<template>
  <section class="settings-profile">
    <ProfileNav @send-nav="navHandle" />
    <router-view />
  </section>
  <!-- For now is not used at all, might be added in future -->
  <!-- <PopupAddPhoto v-if="isPopupVisible" @close="togglePopupVisibility" /> -->
</template>

<script lang="ts">
import { computed, defineComponent, onUnmounted, ref, toRefs } from 'vue'
import ProfileNav from '@/components/settings/profile/ProfileNav.vue'
import variables from '@/assets/variables'
import useSettingsProfile from '@/components/settings/settings-profile'
import { COUNTRIES } from '@/components/helpers/countries'

export default defineComponent({
  name: 'SettingsProfile',
  components: {
    ProfileNav,
  },
  emits: ['nav-send'],
  setup(_, { emit }) {
    const {
      isInfluencerWaitingResponse,
      isMarketerWaitingResponse,
      getMyProfile,
      influencerForm,
      marketerForm,
      marketerFileUrl,
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

    const updateInfluencerLocation = (locationOption: typeof countriesForDropdown[number]) => {
      influencerLocation.value.value = locationOption.slug
    }

    const updateMarketerLocation = (locationOption: typeof countriesForDropdown[number]) => {
      marketerLocation.value.value = locationOption.slug
    }

    const selectedInfluencerLocation = computed(() =>
      countriesForDropdown.find((country) => country.slug === influencerLocation.value.value)
    )

    const selectedMarketerLocation = computed(() =>
      countriesForDropdown.find((country) => country.slug === marketerLocation.value.value)
    )

    const marketerFileInputRef = ref<null | HTMLInputElement>(null)
    const influencerFileInputRef = ref<null | HTMLInputElement>(null)

    onUnmounted(() => {
      clearMarketerAvatarInput()
      clearInfluencerAvatarInput()
    })

    const navHandle = (e: string) => {
      emit('nav-send', e)
    }

    return {
      marketerFileInputRef,
      influencerFileInputRef,
      marketerFileUrl,
      influencerFileUrl,
      influencerFirstName,
      influencerLastName,
      influencerDescription,
      influencerLocation,
      influencerAvatarImageFileId,
      influencerForm,
      isInfluencerWaitingResponse,
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
      updateInfluencerLocation,
      updateMarketerLocation,
      showMarketerView,
      countriesForDropdown,
      selectedInfluencerLocation,
      selectedMarketerLocation,
      navHandle,
    }
  },
})
</script>

<style lang="scss" scoped>
@import '@/assets/styles/views/settings/SettingsProfile';
</style>
