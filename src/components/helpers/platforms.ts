import { SocialMediaPlatform, TaskSocialMediaPlatform } from '@/types/platform.model'

const taskPlatforms = Object.values(TaskSocialMediaPlatform).map((el) => {
  if (el === TaskSocialMediaPlatform.TIKTOK)
    return {
      name: 'TikTok',
      value: el,
    }
  return {
    name: `${el.charAt(0).toUpperCase()}${el.slice(1).toLowerCase()}`,
    value: el,
  }
})

const platforms = Object.values(SocialMediaPlatform).map((el) => {
  if (el === SocialMediaPlatform.TIKTOK)
    return {
      name: 'TikTok',
      value: el,
    }
  return {
    name: `${el.charAt(0).toUpperCase()}${el.slice(1).toLowerCase()}`,
    value: el,
  }
})

export const getPlatformLabel = (platform: SocialMediaPlatform) => {
  if (platform === SocialMediaPlatform.TIKTOK) return 'TikTok'
  return platforms.find((onePlatform) => onePlatform.value === platform)?.name
}
export const getTaskPlatformLabel = (platform: TaskSocialMediaPlatform) => {
  if (platform === TaskSocialMediaPlatform.TIKTOK) return 'TikTok'
  return taskPlatforms.find((onePlatform) => onePlatform.value === platform)?.name
}
export const isTaskPlatformsEqual = (p1?: TaskSocialMediaPlatform[], p2?: TaskSocialMediaPlatform[]) => {
  if (!p1 && !p2) return true
  if ((p1 && !p2) || (!p1 && p2)) return false
  if (p1?.length !== p2?.length) return false

  const p1Values = new Set(p1)
  const p2Values = new Set(p2)
  for (const p1Value of p1Values) {
    if (!p2Values.has(p1Value)) return false
  }

  return true
}

export { taskPlatforms, platforms }
