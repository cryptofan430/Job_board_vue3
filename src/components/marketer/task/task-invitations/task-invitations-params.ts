import { ComputedRef, reactive } from 'vue'
import { useRoute } from 'vue-router'
import { useArrayUrlParamReactive, useUpdateQueryParams } from '@/components/helpers/route'
import { SocialMediaPlatform, TaskInvitationsFilters } from '@/types/platform.model'
import { Tags } from '@/types/social-account.model'

export default function useTaskInvitationsParams() {
  const taskId = useRoute().params.taskId?.toString() || ''

  const invitationsPerPage = 6

  const toTaskPlatforms = (array?: string[]) => {
    if (array) {
      const allSocialPlatforms = Object.values(SocialMediaPlatform).filter((item) => item !== SocialMediaPlatform.OTHER)
      return array
        .map((el) => el?.toUpperCase())
        .filter((el) => allSocialPlatforms.includes(el as SocialMediaPlatform)) as SocialMediaPlatform[]
    } else {
      return Object.values(SocialMediaPlatform).filter((item) => item !== SocialMediaPlatform.OTHER)
    }
  }

  const taskInvitationsFilters = reactive({
    socialPlatforms: useArrayUrlParamReactive('socialPlatforms'),
    tags: useArrayUrlParamReactive('tags') as ComputedRef<Tags[]>,
  }) as TaskInvitationsFilters

  const updateRouteParams = useUpdateQueryParams()

  return {
    taskInvitationsFilters,
    invitationsPerPage,
    taskId,
    updateRouteParams,
    toTaskPlatforms,
  }
}
