import { computed, ref } from 'vue'

const allAnnouncements = ref<Array<string>>([])
const SAVED_ANNOUNCEMENT_ID = 'savedID'

export default function useAllAnnouncementsStore() {
  const getAllAnnouncements = computed(() => {
    const ids = localStorage.getItem(SAVED_ANNOUNCEMENT_ID)

    if (ids) allAnnouncements.value = JSON.parse(ids)

    return allAnnouncements.value
  })

  const setAllAnnouncements = (id: string) => {
    const copy = [...allAnnouncements.value]

    copy.push(id)
    allAnnouncements.value = copy
    _updateAnnouncements()
  }

  const _updateAnnouncements = () => {
    localStorage.setItem(SAVED_ANNOUNCEMENT_ID, JSON.stringify(allAnnouncements.value))
  }

  const reset = () => {
    console.log('reset')
    allAnnouncements.value = []
  }

  return {
    allAnnouncements,
    getAllAnnouncements,
    reset,
    setAllAnnouncements,
  }
}
