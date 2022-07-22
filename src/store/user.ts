import { computed, Ref, ref } from 'vue'
import { UserPublicInfo, UserInvoiceDetailPublicInfo } from '@/types/user.model'

const myProfile: Ref<UserPublicInfo | null> = ref(null)

export default function useUserStore() {
  const getMyProfile = computed(() => myProfile.value)
  const setMyProfile = (data: UserPublicInfo | null) => {
    myProfile.value = data
  }
  const setInfluencerInvoiceData = (data: UserInvoiceDetailPublicInfo) => {
    if (myProfile.value) {
      myProfile.value.influencerInvoiceDetails = data
    }
  }
  const setMarketerInvoiceData = (data: UserInvoiceDetailPublicInfo) => {
    if (myProfile.value) {
      myProfile.value.marketerInvoiceDetails = data
    }
  }
  const getMyId = computed(() => myProfile.value?.id)

  const reset = () => {
    setMyProfile(null)
  }

  return {
    getMyProfile,
    setMyProfile,
    getMyId,
    reset,
    setInfluencerInvoiceData,
    setMarketerInvoiceData,
  }
}
