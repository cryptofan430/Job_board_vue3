<template>
  <div
    v-if="instagramAccounts?.length || youtubeAccounts?.length || twitchAccounts?.length"
    class="social-media-column"
  >
    <div class="social-media-title">Influencer's social media</div>

    <div class="social-media-table">
      <div class="table-head">
        <div class="table-row">
          <p class="table-heading"></p>
          <p class="table-heading">Audience</p>
          <p class="table-heading">Rating</p>
          <p class="table-heading">Money earned</p>
        </div>
      </div>

      <div class="mobile-table-head">
        <div class="table-row">
          <p class="table-heading-mobile">Social media</p>
          <p class="table-heading">
            <AppIcon name="followers" size="sm" :color="variables.cPrimary500" />
          </p>
          <p class="table-heading">
            <AppIcon name="rating" size="sm" :color="variables.cPrimary500" />
          </p>
          <p class="table-heading">
            <AppIcon name="money-earned" size="sm" :color="variables.cPrimary500" />
          </p>
        </div>
      </div>

      <div class="table-body">
        <template v-if="instagramAccounts?.length">
          <SocialMediaItem
            v-for="item in instagramAccounts"
            :key="item"
            :platform-name="item.platformName"
            :user-name="item.userName"
            :rating="item.rating"
            :link="`/insights/instagram/${item.id}`"
          />
        </template>

        <template v-if="tiktokAccounts?.length">
          <SocialMediaItem
            v-for="item in tiktokAccounts"
            :key="item"
            :platform-name="item.platformName"
            :user-name="item.userName"
            :rating="item.rating"
            :link="`/insights/tiktok/${item.id}`"
          />
        </template>

        <template v-if="youtubeAccounts?.length">
          <SocialMediaItem
            v-for="item in youtubeAccounts"
            :key="item"
            :platform-name="item.platformName"
            :user-name="item.userName"
            :rating="item.rating"
            :link="`/insights/youtube/${item.id}`"
            :money-earned="item.moneyEarned"
          />
        </template>
      </div>
    </div>
  </div>
  <div v-else class="no-accounts-message">There are no social accounts</div>
</template>

<script lang="ts">
import { computed, defineComponent, PropType } from 'vue'
import { SocialAccountsForProposal } from '@/types/platform.model'
import { getPlatformLabel } from '@/components/helpers/platforms'
import { SocialMediaPlatform } from '@/types/platform.model'
import SocialMediaItem from '@/components/marketer/task/task-proposals/SocialMediaItem.vue'
import AppIcon from '@/components/common/AppIcon.vue'
import variables from '@/assets/variables'

export default defineComponent({
  name: 'ProposalSocialMedia',
  components: {
    SocialMediaItem,
    AppIcon,
  },
  props: {
    socialAccounts: {
      type: Object as PropType<SocialAccountsForProposal>,
      required: false,
    },
  },
  setup(props) {
    const instagramAccounts = computed(() =>
      props.socialAccounts?.instagram.map((instagramAc) => ({
        userName: instagramAc.username,
        platformName: getPlatformLabel(SocialMediaPlatform.INSTAGRAM) || '',
        rating: instagramAc.rating,
      }))
    )

    const youtubeAccounts = computed(() =>
      props.socialAccounts?.youtube.map((youtubeAcc) => ({
        userName: youtubeAcc.username,
        platformName: getPlatformLabel(SocialMediaPlatform.YOUTUBE) || '',
        rating: youtubeAcc.rating,
      }))
    )

    const twitchAccounts = computed(() =>
      props.socialAccounts?.twitch.map((twitchAcc) => ({
        userName: twitchAcc.username,
        platformName: getPlatformLabel(SocialMediaPlatform.TWITCH) || '',
        rating: twitchAcc.rating,
      }))
    )

    const tiktokAccounts = computed(() =>
      props.socialAccounts?.tiktok.map((tiktokAcc) => ({
        userName: tiktokAcc.username,
        platformName: getPlatformLabel(SocialMediaPlatform.TWITCH) || '',
        rating: tiktokAcc.rating,
      }))
    )

    return {
      instagramAccounts,
      youtubeAccounts,
      tiktokAccounts,
      twitchAccounts,
      variables,
    }
  },
})
</script>

<style lang="scss" scoped>
@import '@/assets/styles/views/marketer/task/task-proposals/ProporsalSocialMedia';
</style>
