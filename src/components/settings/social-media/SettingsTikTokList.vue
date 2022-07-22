<template>
  <SocialMediaList title="TikTok" :is-add-button-visible="authURL.length > 0" @add-social-account="initOAuth">
    <div v-for="account in accounts" :key="account" class="social-media-item">
      <AccountCard
        :key="account.id"
        icon="tiktok"
        :tag-list="extractArrayOfTagNames(account.tags)"
        :account="account.username"
        :proposal-date="account.enabledForProposalsDate"
        :link="`/insights/tiktok/${account.id}`"
      >
        <router-link
          :to="{
            name: 'EditSocialMediaAccount',
            params: {
              accountId: account.id,
              socialPlatform: 'tiktok',
            },
          }"
          class="edit-button"
        >
          <AppIcon name="edit" :color="variables.cGrey300" />
        </router-link>

        <router-link
          :to="{
            name: 'DeleteSocialMediaAccount',
            params: {
              accountId: account.id,
              socialPlatform: 'tiktok',
            },
          }"
          class="mobile-delete-button"
        >
          <AppIcon name="delete" :color="variables.cSystemRed500" />
        </router-link>
      </AccountCard>

      <AppLink
        class="delete-button"
        outlined
        :to="{
          name: 'DeleteSocialMediaAccount',
          params: {
            accountId: account.id,
            socialPlatform: 'tiktok',
          },
        }"
        >Delete account</AppLink
      >
    </div>
  </SocialMediaList>
</template>

<script lang="ts">
import { defineComponent, PropType } from 'vue'
import SocialMediaList from '@/components/settings/social-media/SocialMediaList.vue'
import AccountCard from '@/components/cards/AccountCard.vue'
import AppIcon from '@/components/common/AppIcon.vue'
import AppLink from '@/components/common/AppLink.vue'
import variables from '@/assets/variables'
import useSettingsTikTokList from './settings-tik-tok-list'
import { SocialMediaPlatform, SocialAccountShortInfo } from '@/types/platform.model'
import useSettingsSocialMedia from './social-media'
import { extractArrayOfTagNames } from '@/components/helpers/social-accounts'

export default defineComponent({
  name: 'SettingsTwitchList',
  components: {
    SocialMediaList,
    AppLink,
    AccountCard,
    AppIcon,
  },
  props: {
    accounts: {
      type: Object as PropType<Array<SocialAccountShortInfo>>,
      required: true,
    },
  },
  setup() {
    const { initOAuth, authURL, hasInitedOauth, closePopup } = useSettingsTikTokList()
    const { setAccountToDelete, setAccountToEdit } = useSettingsSocialMedia()

    if (!hasInitedOauth.value) {
      closePopup()
    }

    return {
      variables,
      initOAuth,
      authURL,
      SocialMediaPlatform,
      setAccountToDelete,
      setAccountToEdit,
      extractArrayOfTagNames,
    }
  },
})
</script>

<style lang="scss" scoped>
@import '@/assets/styles/views/settings/settings-social-media/SettingsSingleSocialMedia';
</style>
