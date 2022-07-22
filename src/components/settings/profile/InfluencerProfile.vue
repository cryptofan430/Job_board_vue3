<template>
  <div class="influencer-content-wrapper">
    <form class="content-wrapper" @submit.prevent="submitInfluencerForm">
      <div class="avatar-container" @click="marketerFileInputRef?.click()">
        <input
          ref="marketerFileInputRef"
          type="file"
          accept=".png,.jpg,.jpeg"
          hidden
          @change="inputInfluencerAvatar(marketerFileInputRef?.files)"
        />

        <div class="avatar-circle">
          <AppIcon v-if="!influencerFileUrl" name="camera" size="lg" :color="variables.cGrey200" />

          <img v-else class="avatar" :src="influencerFileUrl" alt="avatar" />
        </div>
      </div>

      <AppLabel>
        First name
        <AppInput v-model="influencerFirstName.value" :error="influencerFirstName.isError" />
      </AppLabel>

      <AppInputError v-if="influencerFirstName.isError" class="profile-error">
        {{ influencerFirstName.getErrorMessage }}
      </AppInputError>

      <AppLabel>
        Last name
        <AppInput v-model="influencerLastName.value" :error="influencerLastName.isError" />
      </AppLabel>

      <AppInputError v-if="influencerLastName.isError" class="profile-error">
        {{ influencerLastName.getErrorMessage }}
      </AppInputError>

      <AppLabel class="country-label" for="influencer-location"> Country </AppLabel>

      <AppDropdown
        class="country-dropdown"
        default-text="Choose your country"
        size="lg"
        tall
        icon="dropdown"
        input-id="influencer-location"
        :values="countriesForDropdown"
        :model-value="selectedInfluencerLocation"
        @change="updateInfluencerLocation"
      />

      <AppInputError v-if="influencerLocation.isError" class="profile-error">
        {{ influencerLocation.getErrorMessage }}
      </AppInputError>

      <!-- <AppLabel>
            Company's name
            <AppInput />
          </AppLabel> -->

      <AppLabel class="description-label">
        <p>Description</p>
        <p class="description-info">Please, add some information about you.</p>
        <AppTextarea v-model="influencerDescription.value" :error="influencerDescription.isError" />
      </AppLabel>

      <AppInputError v-if="influencerDescription.isError" class="profile-error">
        {{ influencerDescription.getErrorMessage }}
      </AppInputError>

      <AppInputError v-if="influencerForm.isError" class="profile-error">{{
        influencerForm.getErrorMessage
      }}</AppInputError>

      <AppButton :disabled="isInfluencerWaitingResponse" :is-loading="isInfluencerWaitingResponse" type="submit"
        >Save</AppButton
      >
    </form>
    <div class="mobile-save-button">
      <AppButton
        :disabled="isMarketerWaitingResponse"
        :is-loading="isMarketerWaitingResponse"
        type="button"
        @click="submitInfluencerForm"
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
      isInfluencerWaitingResponse,
      getMyProfile,
      influencerForm,
      influencerFileUrl,
      clearMarketerAvatarInput,
      clearInfluencerAvatarInput,
      inputInfluencerAvatar,
      inputMarketerAvatar,
      submitMarketerForm,
      submitInfluencerForm,
    } = useSettingsProfile()

    const {
      firstName: influencerFirstName,
      lastName: influencerLastName,
      description: influencerDescription,
      location: influencerLocation,
      avatarImageFileId: influencerAvatarImageFileId,
    } = toRefs(influencerForm.fieldSet)

    const countriesForDropdown = COUNTRIES.map((country) => {
      return { title: country, slug: country }
    })

    const isPopupVisible = ref(false)

    const togglePopupVisibility = () => {
      isPopupVisible.value = !isPopupVisible.value
    }

    const updateInfluencerLocation = (locationOption: typeof countriesForDropdown[number]) => {
      influencerLocation.value.value = locationOption.slug
    }

    const selectedInfluencerLocation = computed(() =>
      countriesForDropdown.find((country) => country.slug === influencerLocation.value.value)
    )

    const marketerFileInputRef = ref<null | HTMLInputElement>(null)

    onUnmounted(() => {
      clearMarketerAvatarInput()
      clearInfluencerAvatarInput()
    })

    return {
      marketerFileInputRef,
      influencerFileUrl,
      influencerFirstName,
      influencerLastName,
      influencerDescription,
      influencerLocation,
      influencerAvatarImageFileId,
      influencerForm,
      isInfluencerWaitingResponse,
      getMyProfile,
      isPopupVisible,
      togglePopupVisibility,
      variables,
      inputInfluencerAvatar,
      inputMarketerAvatar,
      submitMarketerForm,
      submitInfluencerForm,
      updateInfluencerLocation,
      countriesForDropdown,
      selectedInfluencerLocation,
    }
  },
})
</script>

<style lang="scss" scoped>
@import '@/assets/styles/views/settings/profile/InfluencerProfile';
</style>
