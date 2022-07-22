import { computed, reactive, readonly, Ref, ref } from 'vue'
import { ApiLoadingState, EntitiesLoadingState } from '@/types/api.model'
import { InvitationSentToMe } from '@/types/invitation.model'

const influencerInvitations = ref<Array<InvitationSentToMe>>([])
const influencerInvitationsCount: Ref<number> = ref(0)
const influencerInvitationsState = reactive<EntitiesLoadingState>({
  state: 'loading',
  payload: {
    message: undefined,
  },
})
const invitationsCache = new Map<number, InvitationSentToMe[]>()

export default function useInfluencerInvitationsStore() {
  const getInfluencerInvitations = computed(() => influencerInvitations.value)
  const getInfluencerInvitationsCount = readonly(influencerInvitationsCount)
  const getInfluencerInvitationsState = computed(() => influencerInvitationsState)

  const setInfluencerInvitations = (Invitations: Array<InvitationSentToMe>) => {
    influencerInvitations.value = Invitations
  }
  const getFirstInfluencerInvitation = () => influencerInvitations.value[0] || null
  const getLastInfluencerInvitation = () => influencerInvitations.value[influencerInvitations.value.length - 1] || null
  const setInfluencerInvitationsCount = (InvitationsCount: number) =>
    (influencerInvitationsCount.value = InvitationsCount)

  const setInfluencerInvitationsState = (state: ApiLoadingState, payload?: { message?: string }) => {
    influencerInvitationsState.state = state
    influencerInvitationsState.payload = payload
  }

  const reset = () => {
    influencerInvitationsCount.value = 0
    influencerInvitations.value = []
    influencerInvitationsState.state = 'loading'
    influencerInvitationsState.payload = { message: undefined }
    invitationsCache.clear()
  }

  return {
    getInfluencerInvitations,
    getInfluencerInvitationsCount,
    getInfluencerInvitationsState,
    invitationsCache,
    reset,
    setInfluencerInvitations,
    getFirstInfluencerInvitation,
    getLastInfluencerInvitation,
    setInfluencerInvitationsCount,
    setInfluencerInvitationsState,
  }
}
