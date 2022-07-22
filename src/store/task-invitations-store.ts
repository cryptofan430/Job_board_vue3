import { computed, reactive, readonly, ref } from 'vue'
import {
  InstagramForInviteResponse,
  InvitationWithPlatform,
  SocialMediaAccountsForInviteResponse,
  SocialMediaPlatform,
  TikTokInviteResponse,
  TwitchForInviteResponse,
  YoutubeForInviteResponse,
} from '@/types/platform.model'
import { ApiLoadingState, EntitiesLoadingState } from '@/types/api.model'

const taskInstagramInvitations = ref<Array<InstagramForInviteResponse>>([])
const taskTwitchInvitations = ref<Array<TwitchForInviteResponse>>([])
const taskYoutubeInvitations = ref<Array<YoutubeForInviteResponse>>([])
const taskTikTokInvitations = ref<Array<TikTokInviteResponse>>([])
const invitationsLoadingState = reactive<EntitiesLoadingState>({
  state: 'loading',
  payload: {
    message: undefined,
  },
})
const invitationCount = ref(0)

const setTaskInstagramInvitations = (invitations: Array<InstagramForInviteResponse>) => {
  taskInstagramInvitations.value = invitations
}

const setTaskYoutubeInvitations = (invitations: Array<YoutubeForInviteResponse>) => {
  taskYoutubeInvitations.value = invitations
}

const setTaskTwitchInvitations = (invitations: Array<TwitchForInviteResponse>) => {
  taskTwitchInvitations.value = invitations
}

const setTikTokInvitations = (invitations: Array<TikTokInviteResponse>) => {
  taskTikTokInvitations.value = invitations
}

const setTaskInvitationsData = (invitations: SocialMediaAccountsForInviteResponse) => {
  taskInstagramInvitations.value = invitations.instagram
  taskTwitchInvitations.value = invitations.twitch
  taskYoutubeInvitations.value = invitations.youtube
}

const setInvitationsLoadingState = (state: ApiLoadingState, payload?: { message?: string }) => {
  invitationsLoadingState.state = state
  invitationsLoadingState.payload = payload
}

const setInvitationsCount = (count: number) => {
  invitationCount.value = count
}

const reset = () => {
  taskInstagramInvitations.value = []
  taskTwitchInvitations.value = []
  taskYoutubeInvitations.value = []
  invitationCount.value = 0
}

export default function useTaskInvitationsStore() {
  const getTaskInvitations = computed(() => {
    const allInvitations: InvitationWithPlatform[] = [
      ...taskInstagramInvitations.value.map((invitation) => ({ invitation, platform: SocialMediaPlatform.INSTAGRAM })),
      ...taskTwitchInvitations.value.map((invitation) => ({ invitation, platform: SocialMediaPlatform.TWITCH })),
      ...taskYoutubeInvitations.value.map((invitation) => ({ invitation, platform: SocialMediaPlatform.YOUTUBE })),
      ...taskTikTokInvitations.value.map((invitation) => ({ invitation, platform: SocialMediaPlatform.TIKTOK })),
    ]
    // probably we should sort by the username, when it will be available in response
    const sortedInvitations = allInvitations.sort((invitation1, invitation2) =>
      invitation1.invitation.id > invitation2.invitation.id ? 1 : -1
    )
    return sortedInvitations
  })
  const getInvitationsCount = readonly(invitationCount)

  return {
    getTaskInvitations,
    getInvitationsCount,
    taskInstagramInvitations,
    taskTwitchInvitations,
    taskYoutubeInvitations,
    taskTikTokInvitations,
    invitationsLoadingState,
    setInvitationsLoadingState,
    setTaskInvitationsData,
    setInvitationsCount,
    setTaskInstagramInvitations,
    setTaskYoutubeInvitations,
    setTaskTwitchInvitations,
    setTikTokInvitations,
    reset,
  }
}
