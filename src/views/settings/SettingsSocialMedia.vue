<template>
  <div class="settings-social-media-container">
    <section class="settings-social-media" :class="classList">
      <template v-if="!isMobilePopup">
        <AppErrorBox v-if="isError" @clicked="loadSocialAccounts">accounts</AppErrorBox>

        <AppSkeleton v-else-if="isLoading" />

        <template v-else>
          <SettingsInstagramList :accounts="instagramAccounts" />
          <SettingsTwitchList :accounts="twitchAccounts" />
          <SettingsYoutubeList :accounts="youtubeAccounts" />
          <SettingsTikTokList :accounts="tikTokAccounts" />
        </template>
      </template>
      <router-view />
    </section>
  </div>
</template>

<script lang="ts">
import { computed, defineComponent, onUnmounted } from 'vue'
import AppSkeleton from '@/components/common/AppSkeleton.vue'
import AppErrorBox from '@/components/common/AppErrorBox.vue'
import SettingsInstagramList from '@/components/settings/social-media/SettingsInstagramList.vue'
import SettingsTwitchList from '@/components/settings/social-media/SettingsTwitchList.vue'
import SettingsYoutubeList from '@/components/settings/social-media/SettingsYoutubeList.vue'
import SettingsTikTokList from '@/components/settings/social-media/SettingsTikTokList.vue'
import useSocialMediaAccounts from '@/store/settings-social-media'
import useSettingsSocialMedia from '@/components/settings/social-media/social-media'
import { getIsMobilePopup } from '@/components/helpers/dom'
import useSettingsInstagramList from '@/components/settings/social-media/settings-instagram-list'

export default defineComponent({
  name: 'SettingsSocialMedia',
  components: {
    SettingsInstagramList,
    SettingsTwitchList,
    SettingsYoutubeList,
    SettingsTikTokList,
    AppErrorBox,
    AppSkeleton,
  },
  setup() {
    const { instagramAccounts, twitchAccounts, tikTokAccounts, youtubeAccounts, isLoading, isLoaded, isError, reset } =
      useSocialMediaAccounts()

    const { loadSocialAccounts, handleUrlQueryError } = useSettingsSocialMedia()
    const isMobilePopup = getIsMobilePopup()
    const classList = computed(() => {
      const mobilePopupClasses = isMobilePopup.value ? 'settings-social-media-mobile-popup' : ''

      return `${mobilePopupClasses}`
    })

    const { initOAuth } = useSettingsInstagramList()

    handleUrlQueryError()
    loadSocialAccounts()
    onUnmounted(() => reset())

    return {
      loadSocialAccounts,
      classList,
      isMobilePopup,
      instagramAccounts,
      twitchAccounts,
      youtubeAccounts,
      tikTokAccounts,
      isLoading,
      isLoaded,
      isError,
      initOAuth,
    }
  },
})
</script>

<style lang="scss" scoped>
@import '@/assets/styles/views/settings/SettingsSocialMedia';
</style>
