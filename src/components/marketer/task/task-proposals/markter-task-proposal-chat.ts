import useChatController from '@/middleware/controllers/useChatController'
import useToastsStore from '@/store/toasts'
import { ProposalPublicInfo } from '@/types/proposal.model'
import { useRouter } from 'vue-router'

export default function useMarketerTaskContractsChat() {
  const { createChat } = useChatController()
  const { addToast } = useToastsStore()
  const router = useRouter()

  const redirectToChat = (chatId: string) => router.push(`/chat/${chatId}`)

  const goToChat = async (proposal: ProposalPublicInfo) => {
    const { chatId } = proposal

    if (chatId) redirectToChat(chatId)
    if (!chatId) {
      await createChat(proposal.id)
        .then((response) => {
          setTimeout(() => (proposal.chatId = response.data.id), 100)
          redirectToChat(response.data.id)
        })
        .catch(() => addToast('Failed to create a chat', 'danger'))
    }
  }

  return {
    goToChat,
  }
}
