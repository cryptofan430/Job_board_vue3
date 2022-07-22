<template>
  <SocialMediaList title="Twitch" :is-add-button-visible="authURL.length > 0" @add-social-account="initOAuth">
    <div v-for="account in accounts" :key="account" class="social-media-item">
      <AccountCard
        :key="account.id"
        icon="twitch"
        :tag-list="extractArrayOfTagNames(account.tags)"
        :account="account.username"
        :proposal-date="account.enabledForProposalsDate"
        :link="`/insights/twitch/${account.id}`"
      >
        <router-link
          :to="{
            name: 'EditSocialMediaAccount',
            params: {
              accountId: account.id,
              socialPlatform: 'twitch',
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
              socialPlatform: 'twitch',
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
            socialPlatform: 'twitch',
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
import useSettingsTwitchList from './settings-twitch-list'
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
    const { initOAuth, authURL, hasInitedOauth, closePopup } = useSettingsTwitchList()
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
