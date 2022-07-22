<template>
  <div class="marketer-content-wrapper">
    <form class="content-wrapper" @submit.prevent="submitMarketerForm">
      <div class="avatar-container" @click="influencerFileInputRef?.click()">
        <input
          ref="influencerFileInputRef"
          type="file"
          accept=".png,.jpg,.jpeg"
          hidden
          @change="inputMarketerAvatar(influencerFileInputRef?.files)"
        />

        <div class="avatar-circle">
          <AppIcon v-if="!marketerFileUrl" name="camera" size="lg" :color="variables.cGrey200" />

          <img v-else class="avatar" :src="marketerFileUrl" alt="avatar" />
        </div>
      </div>

      <AppLabel>
        First name
        <AppInput v-model="marketerFirstName.value" :error="marketerFirstName.isError" />
      </AppLabel>

      <AppInputError v-if="marketerFirstName.isError" class="profile-error">
        {{ marketerFirstName.getErrorMessage }}
      </AppInputError>

      <AppLabel>
        Last name
        <AppInput v-model="marketerLastName.value" :error="marketerLastName.isError" />
      </AppLabel>

      <AppInputError v-if="marketerLastName.isError" class="profile-error">
        {{ marketerLastName.getErrorMessage }}
      </AppInputError>

      <AppLabel class="country-label" for="marketer-location"> Country </AppLabel>

      <AppDropdown
        class="country-dropdown"
        default-text="Choose your country"
        size="lg"
        tall
        icon="dropdown"
        input-id="marketer-location"
        :values="countriesForDropdown"
        :model-value="selectedMarketerLocation"
        @change="updateMarketerLocation"
      />

      <AppInputError v-if="marketerLastName.isError" class="profile-error">
        {{ marketerLocation.getErrorMessage }}
      </AppInputError>

      <!-- <AppLabel>
            Company's name
          </AppLabel> -->

      <AppLabel class="description-label">
        <p>Description</p>
        <p class="description-info">Please, add some information about you.</p>
        <AppTextarea v-model="marketerDescription.value" :error="marketerDescription.isError" />
      </AppLabel>

      <AppInputError v-if="marketerDescription.isError" class="profile-error">
        {{ marketerDescription.getErrorMessage }}
      </AppInputError>

      <AppInputError v-if="marketerForm.isError" class="profile-error">{{
        marketerForm.getErrorMessage
      }}</AppInputError>

      <AppButton :disabled="isMarketerWaitingResponse" :is-loading="isMarketerWaitingResponse" type="submit"
        >Save</AppButton
      >
    </form>
    <div class="mobile-save-button">
      <AppButton
        :disabled="isMarketerWaitingResponse"
        :is-loading="isMarketerWaitingResponse"
        type="button"
        @click="submitMarketerForm"
        >Save information</AppButton
      >
    </div>
  </div>
</template>

<script lang="ts">
import { computed, defineComponent, onUnmounted, ref, toRefs } from 'vue'
import AppButton from '@/components/common/AppButton.vue'
import AppInput from '@/components/common/AppInput.vue'
import AppLabel from '@/components/common/AppLabel.vue'
import AppDropdown from '@/components/common/AppDropdown.vue'
import AppTextarea from '@/components/common/AppTextarea.vue'
import AppIcon from '@/components/common/AppIcon.vue'
import AppInputError from '@/components/common/AppInputError.vue'
import variables from '@/assets/variables'
import useSettingsProfile from '@/components/settings/settings-profile'
import { COUNTRIES } from '@/components/helpers/countries'

export default defineComponent({
  components: {
    AppLabel,
    AppInput,
    AppTextarea,
    AppButton,
    AppIcon,
    AppInputError,
    AppDropdown,
  },
  setup() {
    const {
      isMarketerWaitingResponse,
      getMyProfile,
      marketerForm,
      marketerFileUrl,
      clearMarketerAvatarInput,
      clearInfluencerAvatarInput,
      inputInfluencerAvatar,
      inputMarketerAvatar,
      submitMarketerForm,
      submitInfluencerForm,
    } = useSettingsProfile()

    const {
      firstName: marketerFirstName,
      lastName: marketerLastName,
      description: marketerDescription,
      location: marketerLocation,
      avatarImageFileId: marketerAvatarImageId,
    } = toRefs(marketerForm.fieldSet)

    const countriesForDropdown = COUNTRIES.map((country) => {
      return { title: country, slug: country }
    })

    const showMarketerView = ref(true)
    const isPopupVisible = ref(false)

    const togglePopupVisibility = () => {
      isPopupVisible.value = !isPopupVisible.value
    }

    const updateMarketerLocation = (locationOption: typeof countriesForDropdown[number]) => {
      marketerLocation.value.value = locationOption.slug
    }

    const selectedMarketerLocation = computed(() =>
      countriesForDropdown.find((country) => country.slug === marketerLocation.value.value)
    )

    const influencerFileInputRef = ref<null | HTMLInputElement>(null)

    onUnmounted(() => {
      clearMarketerAvatarInput()
      clearInfluencerAvatarInput()
    })

    return {
      influencerFileInputRef,
      marketerFileUrl,
      marketerFirstName,
      marketerLastName,
      marketerDescription,
      marketerLocation,
      marketerAvatarImageId,
      marketerForm,
      isMarketerWaitingResponse,
      getMyProfile,
      isPopupVisible,
      togglePopupVisibility,
      variables,
      inputInfluencerAvatar,
      inputMarketerAvatar,
      submitMarketerForm,
      submitInfluencerForm,
      updateMarketerLocation,
      showMarketerView,
      countriesForDropdown,
      selectedMarketerLocation,
    }
  },
})
</script>

<style lang="scss" scoped>
@import '@/assets/styles/views/settings/profile/MarketerProfile';
</style>
