import { ref } from 'vue'
import { Tags, TagsData } from '@/types/social-account.model'

export const tagsData = ref<Array<TagsData>>([])

const setTags = (tags: Array<TagsData>) => {
  tagsData.value = tags
}

const getTagLabel = (value: Tags) => tagsData.value.find((tagData) => tagData.value === value)?.label || ''

const reset = () => {
  tagsData.value = []
}

export default function useTagsStore() {
  return { tagsData, getTagLabel, setTags, reset }
}
