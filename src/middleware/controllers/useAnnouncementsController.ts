import api from '@/services/api'
import { AnnouncementsResponse } from '@/types/announcement.model'

const fetchAnnouncements = async () => {
  return await api.get<Array<AnnouncementsResponse>>('announcements')
}

export default function useNotificationsController() {
  return {
    fetchAnnouncements,
  }
}
