import { AnnouncementPublicInfo } from '@/types/announcement.model'

export const arrange = (params: Array<AnnouncementPublicInfo>) => {
  const sortedResults = params.sort((n1, n2) => {
    if (n1.id < n2.id) {
      return -1
    }
    if (n1.id > n2.id) {
      return 1
    }
    return 0
  })

  return sortedResults
}
