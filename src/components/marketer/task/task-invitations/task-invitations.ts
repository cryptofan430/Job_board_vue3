import { ref, watch } from 'vue'
import { useRouter } from 'vue-router'
import { AxiosError } from 'axios'
import { extractEntitiesLoadingState } from '@/components/helpers/state'
import { InvitationWithPlatform, SocialMediaPlatform, InvitationsParams } from '@/types/platform.model'
import { Tags } from '@/types/social-account.model'
import { getFirstError } from '@/services/api'
import { InvitationCreateError } from '@/types/invitation.model'
import useSocialAccountController from '@/middleware/controllers/useSocialAccountController'
import useTaskInvitationsStore from '@/store/task-invitations-store'
import useTaskInvitationsParams from './task-invitations-params'
import useInvitationController from '@/middleware/controllers/useInvitationController'
import useToastsStore from '@/store/toasts'

export default function useTaskInvitations() {
  const router = useRouter()
  const { fetchSocialAccountsToInviteForTask } = useSocialAccountController()
  const { addInvitation } = useInvitationController()
  const { addToast } = useToastsStore()
  const {
    getInvitationsCount,
    getTaskInvitations,
    invitationsLoadingState,
    taskInstagramInvitations,
    taskTikTokInvitations,
    taskTwitchInvitations,
    taskYoutubeInvitations,
    setTaskInstagramInvitations,
    setTaskTwitchInvitations,
    setTaskYoutubeInvitations,
    setTikTokInvitations,
    setInvitationsCount,
    setInvitationsLoadingState,
  } = useTaskInvitationsStore()

  const { taskId, invitationsPerPage, taskInvitationsFilters, updateRouteParams, toTaskPlatforms } =
    useTaskInvitationsParams()

  const { isLoading, isLoaded, isError } = extractEntitiesLoadingState(invitationsLoadingState)
  const tagsValue = ref<Tags[]>(taskInvitationsFilters.tags || [])

  const _fetchInvitations = async (params: InvitationsParams) => {
    return fetchSocialAccountsToInviteForTask(taskId, params).then((response) => {
      setTaskInstagramInvitations([...taskInstagramInvitations.value, ...response.data.instagram])
      setTaskTwitchInvitations([...taskTwitchInvitations.value, ...response.data.twitch])
      setTaskYoutubeInvitations([...taskYoutubeInvitations.value, ...response.data.youtube])
      setTikTokInvitations([...taskTikTokInvitations.value, ...response.data.tiktok])
      setInvitationsCount(response.data.count)
    })
  }

  const updateTagsValue = (value: Tags[]) => {
    const updatedFilters = {
      tags: value,
    }
    updateRouteParams(updatedFilters)
  }

  const fetchMoreInvitations = () => {
    const olderThanId = getTaskInvitations.value?.[getTaskInvitations.value.length - 1]?.invitation?.id
    _fetchInvitations({
      ...taskInvitationsFilters,
      limit: invitationsPerPage,
      olderThanId,
      socialPlatforms: toTaskPlatforms(taskInvitationsFilters.socialPlatforms),
    })
      .then(() => {
        setInvitationsLoadingState('loaded')
      })
      .catch(() => {
        setInvitationsLoadingState('error')
      })
  }

  const refetchInvitations = () => {
    setInvitationsLoadingState('loading')
    setTaskInstagramInvitations([])
    setTaskTwitchInvitations([])
    setTaskYoutubeInvitations([])
    fetchMoreInvitations()
  }

  const updateSocialMediaAccount = (newValue?: SocialMediaPlatform | null) => {
    if (newValue) {
      updateRouteParams({ socialPlatforms: [newValue] })
    }
    if (!newValue) {
      updateRouteParams({ socialPlatforms: undefined })
    }
  }

  const watchFilters = () => {
    watch(taskInvitationsFilters, refetchInvitations)
  }

  const inviteForTask = (invitation: InvitationWithPlatform) => {
    invitation.isProcessing = true

    addInvitation({
      taskId: taskId,
      platform: invitation.platform,
      socialAccountId: invitation.invitation.id,
    })
      .then(() => {
        invitation.invitation.invited = true
        invitation.isProcessing = false
        addToast('Influencer successfully invited', 'success')
      })
      .catch((e: AxiosError) => {
        const error = getFirstError<InvitationCreateError>(e)
        if (error?.errorType === InvitationCreateError.UNABLE_TO_INVITE_MYSELF) {
          addToast("You can't invite yourself for a task", 'danger')
        } else if (error?.errorType === InvitationCreateError.TASK_NOT_EXIST) {
          addToast('The task does not exist anymore', 'danger')
        } else if (error?.errorType === InvitationCreateError.TASK_NOT_BELONG_TO_USER) {
          addToast('The task does not belong to you', 'danger')
          router.push('/')
        } else if (error?.errorType === InvitationCreateError.SOCIAL_ACCOUNT_NOT_EXIST) {
          // TODO: add freelancer name when it will be in response from backend
          addToast('Social media account was deleted', 'danger')
        } else if (error?.errorType === InvitationCreateError.SOCIAL_ACCOUNT_ALREADY_IN_PROPOSALS) {
          // TODO: add freelancer name when it will be in response from backend
          addToast('You have proposal from this freelancer', 'danger')
        } else if (error?.errorType === InvitationCreateError.INVITATION_ALREADY_SENT) {
          // TODO: add freelancer name when it will be in response from backend
          addToast('You have already sent an invitation to this freelancer', 'danger')
        } else if (error?.errorType === InvitationCreateError.INVITATIONS_LIMIT_REACHED) {
          addToast('You reached the limit of people that you can invite for a task', 'danger')
        } else {
          addToast('Unexpected error occurred, please check your internet connection and try later', 'danger')
        }
      })
      .finally(() => {
        invitation.isProcessing = false
      })
  }

  return {
    refetchInvitations,
    fetchMoreInvitations,
    updateTagsValue,
    updateSocialMediaAccount,
    watchFilters,
    inviteForTask,
    tagsValue,
    taskInvitationsFilters,
    getTaskInvitations,
    getInvitationsCount,
    isLoading,
    isLoaded,
    isError,
    invitationsPerPage,
  }
}
