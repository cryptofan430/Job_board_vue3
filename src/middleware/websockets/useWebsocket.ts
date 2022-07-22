import { ref, watch } from 'vue'
import { Client, IMessage } from '@stomp/stompjs'
import SockJS from 'sockjs-client'
import useChatStore from '@/store/chat'
import { getBaseURL } from '@/services/api'
import {
  ChatArchive,
  SendMessageData,
  SimpleChat,
  SimpleChatMessage,
  SimpleChatMessageWithUpdatedUnread,
  UpdatedUnreadResponse,
} from '@/types/chat.model'
import { NotificationsResponse } from '@/types/notification.model'
import useNotificationsWebsocket from '@/components/notifications/notifications-websocket'

const PRIVATE_CHAT_MESSAGES = '/private/chat'
const PRIVATE_CHAT_DELETE_MESSAGES = '/private/chatDeleteMessages'
const PRIVATE_CHAT_MESSAGES_SEEN = '/private/chatMessagesSeen'
const NEW_CHAT = '/newChat'
const NEW_INCOMING_MESSAGE_AND_UPDATED_UNREAD = '/newIncomingMessageAndUpdatedUnread'
const NEW_OUTGOING_MESSAGE = '/newOutgoingMessage'
const UPDATED_MESSAGE = '/updatedMessage'
// right now there is no way to add new user to chat, create subscription when it's implemented☺
// const UPDATED_CHAT_USERS = '/updateChatUsers'
const UPDATED_CHAT_UNREAD_MESSAGES = '/updatedUnreadMessages'
const UPDATED_CHAT_ARCHIVE = '/updatedChatArchive'
const QUEUE_USER_PREFIX = '/user/queue'
const APP_PREFIX = '/app'
const STOMP_SUFFIX = '/stomp'
const NEW_NOTIFICATION = '/newNotification'

const chat = useChatStore()
const notifications = useNotificationsWebsocket()

const isConnected = ref(false)
let isConnectionInit = false

const WEBSOCKET_SUBSCRIPTION_HEADERS = { 'auto-delete': 'true' }

const doWebsocketAction = <T extends (...args: Array<never>) => unknown>(action: T): T => {
  return function (this: unknown, ...args) {
    // eslint-disable-next-line @typescript-eslint/no-this-alias
    const self = this

    if (isConnected.value) return action.apply(self, args)

    const unwatch = watch(isConnected, (val) => {
      if (val) {
        action.apply(self, args)
        unwatch()
      }
    })
  } as T
}

const _newIncomingMessageAndUpdatedUnreadCallback = (response: IMessage) => {
  const data = JSON.parse(response.body) as SimpleChatMessageWithUpdatedUnread
  console.log(data, NEW_INCOMING_MESSAGE_AND_UPDATED_UNREAD)
  chat.addMessage(data.message)
  chat.updateChatUnreadMessagesCount(data.chatId, data.unreadMessages)
}

const _newOutgoingMessageCallback = (response: IMessage) => {
  const data = JSON.parse(response.body) as SimpleChatMessage
  console.log(data, NEW_OUTGOING_MESSAGE)
  chat.addMyMessage(data)
}

const _updatedMessageCallback = (response: IMessage) => {
  const data = JSON.parse(response.body) as SimpleChatMessage
  console.log(data, UPDATED_MESSAGE)
  chat.replaceMessage(data, data.chatId)
}

const _updatedChatUnreadMessagesCallback = (response: IMessage) => {
  const data = JSON.parse(response.body) as UpdatedUnreadResponse
  console.log(data, UPDATED_CHAT_UNREAD_MESSAGES)
  chat.updateChatUnreadMessagesCount(data.chatId, data.unreadMessages)
}

const _newChatCallback = (response: IMessage) => {
  const data = JSON.parse(response.body) as SimpleChat
  console.log(data, NEW_CHAT)
  chat.addNewChat(data)
}

const _updatedChatArchiveCallback = (response: IMessage) => {
  const data = JSON.parse(response.body) as ChatArchive
  chat.addMessage(data.message)
  chat.updateArchivedChat(data)
}

const _newNotificationCallback = (response: IMessage) => {
  const data: NotificationsResponse = JSON.parse(response.body)
  notifications.addNotificationFromResponse(data)
}

let client: Client

const initWebsocket = () => {
  if (isConnectionInit) return
  isConnectionInit = true

  client = new Client({
    reconnectDelay: 5000,
    heartbeatIncoming: 4000,
    heartbeatOutgoing: 4000,
  })

  client.onUnhandledMessage = function (message) {
    console.log(message, 'unhandled websocket message')
  }

  client.webSocketFactory = function () {
    return new SockJS(`${getBaseURL.value}${STOMP_SUFFIX}`)
  }

  client.onConnect = () => {
    isConnected.value = true

    client.subscribe(
      QUEUE_USER_PREFIX + NEW_INCOMING_MESSAGE_AND_UPDATED_UNREAD,
      _newIncomingMessageAndUpdatedUnreadCallback,
      WEBSOCKET_SUBSCRIPTION_HEADERS
    )

    client.subscribe(
      QUEUE_USER_PREFIX + NEW_OUTGOING_MESSAGE,
      _newOutgoingMessageCallback,
      WEBSOCKET_SUBSCRIPTION_HEADERS
    )

    client.subscribe(QUEUE_USER_PREFIX + UPDATED_MESSAGE, _updatedMessageCallback, WEBSOCKET_SUBSCRIPTION_HEADERS)

    client.subscribe(
      QUEUE_USER_PREFIX + UPDATED_CHAT_UNREAD_MESSAGES,
      _updatedChatUnreadMessagesCallback,
      WEBSOCKET_SUBSCRIPTION_HEADERS
    )

    client.subscribe(QUEUE_USER_PREFIX + NEW_CHAT, _newChatCallback, WEBSOCKET_SUBSCRIPTION_HEADERS)

    client.subscribe(
      QUEUE_USER_PREFIX + UPDATED_CHAT_ARCHIVE,
      _updatedChatArchiveCallback,
      WEBSOCKET_SUBSCRIPTION_HEADERS
    )

    client.subscribe(QUEUE_USER_PREFIX + NEW_NOTIFICATION, _newNotificationCallback, WEBSOCKET_SUBSCRIPTION_HEADERS)
  }

  client.activate()
}

const disconnectWebsocket = () => {
  if (!isConnectionInit) return
  isConnectionInit = false
  isConnected.value = false

  client.forceDisconnect()
  client.deactivate()
}

const sendMessage = (data: SendMessageData) => {
  client.publish({
    destination: APP_PREFIX + PRIVATE_CHAT_MESSAGES,
    body: JSON.stringify(data),
  })
}

const markMessageSeen = (chatId: string, messageId: string | null) => {
  client.publish({
    destination: APP_PREFIX + PRIVATE_CHAT_MESSAGES_SEEN,
    body: JSON.stringify({ chatId, messageId }),
  })
}

const deleteMessage = (chatId: string, messageId: string) => {
  client.publish({
    destination: APP_PREFIX + PRIVATE_CHAT_DELETE_MESSAGES,
    body: JSON.stringify({ chatId, messageId }),
  })
}

export default function useWebsocket() {
  return {
    initWebsocket,
    disconnectWebsocket,
    sendMessage: doWebsocketAction(sendMessage),
    markMessageSeen: doWebsocketAction(markMessageSeen),
    deleteMessage: doWebsocketAction(deleteMessage),
  }
}
