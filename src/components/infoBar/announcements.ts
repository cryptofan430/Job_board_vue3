import { computed, ref } from 'vue'
import useAnnouncementsController from '@/middleware/controllers/useAnnouncementsController'
import useAllAnnouncementsStore from '@/store/announcements'
import useAuthStore from '@/store/auth'
import { AnnouncementPublicInfo } from '@/types/announcement.model'
import { arrange } from '@/components/helpers/announcements'

const newAnnouncements = ref<Array<AnnouncementPublicInfo>>([])

export default function useNotifications() {
  const { fetchAnnouncements } = useAnnouncementsController()
  const { getAllAnnouncements } = useAllAnnouncementsStore()
  const { isAuthenticated } = useAuthStore()

  const getNewAnnouncements = computed(() => newAnnouncements.value)

  const checkAnnouncements = async () => {
    const announcements: Array<AnnouncementPublicInfo> = []
    if (isAuthenticated.value) {
      await fetchAnnouncements().then((response) => {
        if (response.data.length > 0) {
          const sortedAnnouncements = arrange(response.data)
          sortedAnnouncements.forEach((item) => {
            const status = getAllAnnouncements.value.some((val) => val === item.id)

            if (!status) {
              announcements.push(item)
            }
          })
        }
      })
    }

    newAnnouncements.value = announcements
  }

  return {
    getNewAnnouncements,
    checkAnnouncements,
  }
}
