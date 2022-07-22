import { FileUploadPayload, SimpleAccessFile, ViewFileUpload } from './file.model'
import { ClientUserState } from './user.model'

export interface MessagesQueryParams {
  limit: number
  olderThanId?: string
  newerThanId?: string
}

export interface ChatQueryParams {
  limit: number
  lastMessageIdOlderThan?: string
}

export enum MessageType {
  USER = 'USER',
  SYSTEM = 'SYSTEM',
}

export interface ChatsResonse {
  chats: Array<SimpleChat>
}

export interface SimpleChat {
  id: string
  users: Array<ChatUser>
  unreadMessages: number
  lastMessage: SimpleChatMessage
  archivedByUserId: null | string
  type: ChatType
  taskChatTypeDataPublicInfo: TaskChatTypeDataPublicInfo
  contractChatTypeDataPublicInfo: ContractChatTypeDataPublicInfo
  ticketChatTypeDataPublicInfo: TicketChatTypeDataPublicInfo
  disputeChatTypeDataPublicInfo: DisputeChatTypeDataPublicInfo
}

export enum ChatType {
  TASK = 'TASK',
  CONTRACT = 'CONTRACT',
  TICKET = 'TICKET',
  DISPUTE = 'DISPUTE',
}

export interface ChatUser {
  id: string
  firstName: string
  lastName: string
  avatarImageFileId: string
  avatarSignedUrl: string
}

export interface SimpleChatMessage {
  id: string
  clientsId: null | string
  chatId: string
  type: MessageType
  userId: null | string
  deleted: boolean
  message: null | string
  date: string
  responseToMessage: null | ResponseToMessage
  files: Array<SimpleAccessFile>
}

export interface ResponseToMessage {
  id: string
  message: null | string
  type: MessageType
  userId: null | string
  deleted: boolean
  fileNames: Array<SimpleAccessFile>
}

export interface ChatMessagesResponse {
  messages: Array<SimpleChatMessage>
}

export interface SendPanelData {
  message: string
  files: Array<ViewFileUpload>
}

export interface ViewChat {
  id: string
  displayName: string
  messages: Array<ViewMessage>
  containsEarliestMessage: boolean
  unreadMessagesCount: number
  userFileUploads: Array<ViewFileUpload>
  sendPanelMessage: string
  sendPanelResponse: null | ViewMessage
  users: Array<ChatUser>
  archivedByUserId: null | string
}

export interface ViewMessage {
  key: string
  clientsId: null | string
  id: null | string
  type: MessageType
  message: null | string
  date: string
  userId: null | string
  displayName: null | string
  avatarFileId: null | string
  messageResponse: null | ViewMessageResponse
  isDeleted: boolean
  isDelivered: boolean
  isMyMessage: boolean
  files: Array<SimpleAccessFile>
}

export interface ViewMessageResponse {
  id: string
  message: null | string
  isDeleted: boolean
  displayName: null | string
  files: Array<SimpleAccessFile>
}

export interface UndeliveredMessage {
  clientsId: string
  chatId: string
  message: string
  date: string
  responseToMessage: null | ViewMessageResponse
  files: Array<SimpleAccessFile>
  avatarFileId: null | string
  userId: string
  displayName: string
}

export interface SendMessageData {
  clientsId: string
  chatId: string
  message: string
  responseToMessageId?: string
  filesIds?: Array<string>
}

export const isSimpleChatMessage = (message: SimpleChatMessage | UndeliveredMessage): message is SimpleChatMessage =>
  (message as SimpleChatMessage).deleted !== undefined

export interface UpdatedUnreadResponse {
  chatId: string
  unreadMessages: number
}

export interface SimpleChatMessageWithUpdatedUnread extends UpdatedUnreadResponse {
  message: SimpleChatMessage
}

export interface ChatArchive {
  archivedByUserId: null | string
  chatId: string
  message: SimpleChatMessage
}

export interface ChatMessagesListItem {
  id: string
  ofCurrentUser: boolean
  variant?: string
  messages: Array<SimpleChatMessage>
  otherUsers?: Array<string | null>
}

export type ChatFileUploadPayload = FileUploadPayload

export interface ChatPanelPayload {
  responseMessage?: null | SimpleChatMessage
  inputMessageText?: string | null
  oldestMessagesLoaded?: boolean
  uploadFiles: Array<ChatFileUploadPayload>
}

export interface TaskChatTypeDataPublicInfo {
  taskId: string
  description: string
  clientUserState: ClientUserState
}

export interface ContractChatTypeDataPublicInfo {
  taskId: string
  contractId: string
  description: string
  clientUserState: ClientUserState
}

export interface TicketChatTypeDataPublicInfo {
  ticketId: string
  description: string
}

export interface DisputeChatTypeDataPublicInfo {
  disputeId: string
  description: string
  clientUserState: ClientUserState
}
