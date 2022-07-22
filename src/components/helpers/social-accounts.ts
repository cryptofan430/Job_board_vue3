import { SocialTagWithName, Tags, TagsData, TagsResponse } from '@/types/social-account.model'
import { SERVICE_FEE_MULTIPLIER } from '@/components/constants/fees'

export const extractTags = (tags: TagsResponse): TagsData[] => {
  return Object.entries(tags).map((entry) => ({
    value: entry[0] as Tags,
    label: entry[1],
  }))
}

export const extractTagsFromEnum = (): TagsData[] => {
  const tags = Object.values(Tags)

  return tags.map((tagValue) => ({
    value: tagValue,
    label: tagValue.replace(/_/g, ' ').toLocaleLowerCase(),
  }))
}

export const extractArrayOfTagNames = (tags: Array<SocialTagWithName>) => {
  return tags.map((tag) => tag.name)
}

export const extractArrayOfSocialTags = (tags: Array<SocialTagWithName>) => {
  return tags.map((tag) => tag.socialTag)
}

export const calcInfluencerBudget = (marketerBudget?: number) => {
  if (!marketerBudget) return 0
  return Number.parseFloat(String(marketerBudget * SERVICE_FEE_MULTIPLIER)).toFixed(2)
}
