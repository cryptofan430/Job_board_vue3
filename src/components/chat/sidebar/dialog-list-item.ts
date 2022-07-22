import { getDateAbsoluteFormatted } from '@/components/helpers/timeFormatter'
import useUserStore from '@/store/user'
import { ChatUser, SimpleChat } from '@/types/chat.model'
import { computed } from 'vue'

export default function useDialogListItem() {
  const { getMyId } = useUserStore()
  const getDialogUser = (users: ChatUser[]) =>
    computed(() => {
      if (!users?.length) return null
      if (users?.length === 1) return users[0]
      const notCurrentUsers = users.filter((user) => getMyId?.value !== user.id)

      return notCurrentUsers[0] || null
    })

  const getDialogDate = (date: string) =>
    computed(() => {
      return getDateAbsoluteFormatted(date)
    })

  const getChatProps = (chat: SimpleChat) => {
    const displayUser = getDialogUser(chat.users)
    const dialogDate = getDialogDate(chat.lastMessage.date)

    return { displayUser, dialogDate }
  }

  return { getChatProps }
}
