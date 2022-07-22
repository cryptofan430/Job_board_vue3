import useWebsocket from '@/middleware/websockets/useWebsocket'
import { onBeforeUnmount, ref } from 'vue'
import { useRoute } from 'vue-router'

const markedAsSeen = new Set<string>()

export default function useMessageListMessage() {
  const chatId = useRoute().params.chatId?.toString()

  const messageElementRef = ref<HTMLElement | null>()
  const { markMessageSeen } = useWebsocket()

  const observeMessageSeen = (messageId: string) => {
    const target = messageElementRef.value

    if (!target) return

    const observer = new IntersectionObserver((entries) => {
      const markAsSeen = () => {
        if (markedAsSeen.has(messageId)) return
        markMessageSeen(chatId, messageId)
        markedAsSeen.add(messageId)
      }

      const targetEntry = entries[0]
      const { isIntersecting } = targetEntry

      if (isIntersecting) {
        observer.unobserve(target)
        observer.disconnect()
        markAsSeen()
      }
    })

    onBeforeUnmount(() => {
      if (markedAsSeen.has(messageId)) return
      observer.unobserve(target)
      observer.disconnect()
    })

    if (target) observer.observe(target)
  }

  const scrollToMessage = (messageId?: string) => {
    if (!messageId) return
    const el = document?.getElementById(messageId)
    el?.scrollIntoView()
  }

  return {
    messageElementRef,
    observeMessageSeen,
    scrollToMessage,
  }
}
