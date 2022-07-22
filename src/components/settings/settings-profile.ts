import useFileController from '@/middleware/controllers/useFileController'
import useUserManagementController from '@/middleware/controllers/useUserManagementController'
import useToastsStore from '@/store/toasts'
import useUserStore from '@/store/user'
import { computed, ref, watch } from '@vue/runtime-core'
import { createFormFieldSet, createFormItem, useFormatters, useValidators } from '../helpers/forms'

export default function useSettingsProfile() {
  const { getMyProfile, setMyProfile } = useUserStore()
  const { uploadFile } = useFileController()
  const { updateInfluencerProfile, updateMarketerProfile } = useUserManagementController()
  const { required } = useValidators()
  const { addToast } = useToastsStore()
  const { trimFormatter } = useFormatters()

  const marketerInputFile = ref<File>()
  const influencerInputFile = ref<File>()

  const marketerInputFileUrl = ref<string>()
  const influencerInputFileUrl = ref<string>()

  const marketerFileUrl = computed(
    () => marketerInputFileUrl.value || getMyProfile.value?.marketer?.avatarSimpleAccessFile?.signedUrl
  )
  const influencerFileUrl = computed(
    () => influencerInputFileUrl.value || getMyProfile.value?.influencer?.avatarSimpleAccessFile?.signedUrl
  )
  const isInfluencerWaitingResponse = ref(false)
  const isMarketerWaitingResponse = ref(false)

  const clearMarketerAvatarInput = () => {
    marketerInputFile.value = undefined

    if (marketerInputFileUrl.value) {
      URL.revokeObjectURL(marketerInputFileUrl.value)
      marketerInputFileUrl.value = undefined
    }
  }

  const clearInfluencerAvatarInput = () => {
    influencerInputFileUrl.value = undefined

    if (influencerInputFileUrl.value) {
      URL.revokeObjectURL(influencerInputFileUrl.value)
      influencerInputFileUrl.value = undefined
    }
  }

  const createInfluencerForm = () => {
    const userProfile = getMyProfile.value
    const firstName = createFormItem(userProfile?.influencer.firstName || '', {
      validators: [required],
      formatters: [trimFormatter],
    })
    const lastName = createFormItem(userProfile?.influencer.lastName || '', {
      validators: [required],
      formatters: [trimFormatter],
    })
    const description = createFormItem(userProfile?.influencer.description || '')
    const avatarImageFileId = createFormItem<string | null>(null)
    const location = createFormItem(userProfile?.influencer?.location || '', {
      validators: [],
      formatters: [trimFormatter],
    })

    watch(getMyProfile, (userProfile) => {
      firstName.setValue(userProfile?.influencer.firstName || '')
      lastName.setValue(userProfile?.influencer.lastName || '')
      description.setValue(userProfile?.influencer.description || '')
      location.setValue(userProfile?.influencer?.location || '')
      if (getMyProfile.value?.influencer && userProfile?.influencer) {
        getMyProfile.value.influencer = userProfile?.influencer
        avatarImageFileId.value = null
      }
    })

    return createFormFieldSet({
      firstName,
      lastName,
      description,
      location,
      avatarImageFileId,
    })
  }

  const createMarketerForm = () => {
    const userProfile = getMyProfile.value
    const firstName = createFormItem(userProfile?.marketer.firstName || '', {
      validators: [required],
      formatters: [trimFormatter],
    })
    const lastName = createFormItem(userProfile?.marketer.lastName || '', {
      validators: [required],
      formatters: [trimFormatter],
    })
    const description = createFormItem(userProfile?.marketer.description || '')
    const location = createFormItem(userProfile?.marketer?.location || '', {
      validators: [],
      formatters: [trimFormatter],
    })
    const avatarImageFileId = createFormItem<string | null>(null)

    watch(getMyProfile, (userProfile) => {
      firstName.setValue(userProfile?.marketer.firstName || '')
      lastName.setValue(userProfile?.marketer.lastName || '')
      description.setValue(userProfile?.marketer.description || '')
      location.setValue(userProfile?.marketer.location || '')
      if (getMyProfile.value?.marketer && userProfile?.marketer) {
        avatarImageFileId.value = null
        getMyProfile.value.marketer = userProfile.marketer
      }
    })

    return createFormFieldSet({
      firstName,
      lastName,
      description,
      location,
      avatarImageFileId,
    })
  }

  const influencerForm = createInfluencerForm()
  const marketerForm = createMarketerForm()

  const uploadInfluencerAvatar = async () => {
    if (influencerInputFile.value) {
      isInfluencerWaitingResponse.value = true
      const formData = new FormData()
      formData.append('file', influencerInputFile.value)

      await uploadFile(formData)
        .then((response) => {
          influencerForm.fieldSet.avatarImageFileId.value = response?.data?.id || null
        })
        .catch(() => {
          influencerForm.setError('An unexpected error occurred, please try later')
        })
        .finally(() => {
          isInfluencerWaitingResponse.value = false
        })
    }
  }

  const uploadMarketerAvatar = async () => {
    if (marketerInputFile.value) {
      isMarketerWaitingResponse.value = true
      const formData = new FormData()
      formData.append('file', marketerInputFile.value)
      await uploadFile(formData)
        .then((response) => {
          marketerForm.fieldSet.avatarImageFileId.value = response?.data?.id || null
        })
        .catch(() => {
          marketerForm.setError('An unexpected error occurred, please try later')
        })
        .finally(() => {
          isMarketerWaitingResponse.value = false
        })
    }
  }

  const inputInfluencerAvatar = (inputtedFiles?: FileList | null) => {
    const avatar = inputtedFiles?.[0]
    if (avatar) {
      clearInfluencerAvatarInput()
      influencerInputFile.value = avatar
      influencerInputFileUrl.value = URL.createObjectURL(avatar)
      uploadInfluencerAvatar()
    }
  }

  const inputMarketerAvatar = (inputtedFiles?: FileList | null) => {
    const avatar = inputtedFiles?.[0]
    if (avatar) {
      clearMarketerAvatarInput()
      marketerInputFile.value = avatar
      marketerInputFileUrl.value = URL.createObjectURL(avatar)
      uploadMarketerAvatar()
    }
  }

  const submitMarketerForm = async () => {
    const isValid = marketerForm.validate()
    if (!isValid) return

    isMarketerWaitingResponse.value = true
    const marketerProfile = marketerForm.getValue()
    updateMarketerProfile(marketerProfile)
      .then((response) => {
        setMyProfile(response.data)
        addToast('Marketer profile has been successfully updated', 'success')
      })
      .catch(() => {
        marketerForm.setError('An unexpected error occurred, please try later')
      })
      .finally(() => {
        isMarketerWaitingResponse.value = false
      })
  }

  const submitInfluencerForm = async () => {
    const isValid = influencerForm.validate()
    if (!isValid) return

    isInfluencerWaitingResponse.value = true
    const influencerProfile = influencerForm.getValue()
    updateInfluencerProfile(influencerProfile)
      .then((response) => {
        setMyProfile(response.data)
        addToast('Influencer profile has been successfully updated', 'success')
      })
      .catch(() => {
        influencerForm.setError('An unexpected error occurred, please try later')
      })
      .finally(() => {
        isInfluencerWaitingResponse.value = false
      })
  }

  return {
    influencerForm,
    getMyProfile,
    marketerForm,
    marketerFileUrl,
    influencerFileUrl,
    isInfluencerWaitingResponse,
    isMarketerWaitingResponse,
    uploadMarketerAvatar,
    uploadInfluencerAvatar,
    clearMarketerAvatarInput,
    clearInfluencerAvatarInput,
    inputInfluencerAvatar,
    inputMarketerAvatar,
    submitMarketerForm,
    submitInfluencerForm,
  }
}
