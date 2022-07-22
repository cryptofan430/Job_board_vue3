import api from '@/services/api'
import useTagsStore from '@/store/tags'
import { TagsResponse } from '@/types/social-account.model'
import { extractTags, extractTagsFromEnum } from '@/components/helpers/social-accounts'

let isFetchedTags = false

export default function useTagsController() {
  const { setTags, tagsData } = useTagsStore()

  const fetchTags = async () => {
    if (isFetchedTags) return
    await api
      .get<TagsResponse>('/social-accounts/tags')
      .then((response) => {
        isFetchedTags = true
        setTags(extractTags(response.data))
      })
      .catch(() => {
        if (!tagsData.value?.length) {
          setTags(extractTagsFromEnum())
        }
      })
  }

  return {
    fetchTags,
  }
}
