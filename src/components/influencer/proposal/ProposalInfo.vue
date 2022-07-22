<template>
  <div class="proposal-info">
    <div class="cover-letter">
      <h2 class="title">Cover letter</h2>

      <p class="content">
        {{ proposal.description }}
      </p>
    </div>

    <template
      v-if="
        proposal.accounts.instagram?.length || proposal.accounts.twitch?.length || proposal.accounts.youtube?.length
      "
    >
      <h2 class="social-title">Relevant social media accounts</h2>

      <template v-if="proposal.accounts.instagram?.length">
        <AccountCard
          v-for="instagramAccount in proposal.accounts.instagram"
          :key="instagramAccount.id"
          :icon="'instagram'"
          :account="instagramAccount.username"
          :tag-tist="instagramAccount.tags"
          :proposal-date="instagramAccount.enabledForProposalsDate"
          :link="`/insights/instagram/${instagramAccount.id}`"
        ></AccountCard>
      </template>

      <template v-if="proposal.accounts.twitch?.length">
        <AccountCard
          v-for="twitchAccount in proposal.accounts.twitch"
          :key="twitchAccount.id"
          :icon="'twitch'"
          :account="twitchAccount.username"
          :tag-tist="twitchAccount.tags"
          :proposal-date="twitchAccount.enabledForProposalsDate"
          :link="`/insights/twitch/${twitchAccount.id}`"
        ></AccountCard>
      </template>

      <template v-if="proposal.accounts.youtube?.length">
        <AccountCard
          v-for="youtubeAccount in proposal.accounts.youtube"
          :key="youtubeAccount.id"
          :icon="'youtube'"
          :account="youtubeAccount.username"
          :tag-tist="youtubeAccount.tags"
          :proposal-date="youtubeAccount.enabledForProposalsDate"
          :link="`/insights/youtube/${youtubeAccount.id}`"
        ></AccountCard>
      </template>
    </template>

    <h2 v-else class="social-title">No social media accounts posted</h2>

    <h2 class="terms-title">Terms</h2>

    <div class="terms">
      <div class="budget">
        <p class="budget-value">Budget {{ currencySign }}{{ proposal.cost.value }}</p>

        <p class="budget-info">Total amount your client will see on the proposal.</p>
      </div>

      <div class="estimated">
        <p class="estimated-value">You’ll receive: {{ currencySign }}{{ influencerIncome }}</p>

        <p class="estimated-info">The estimated payment, after service fees.</p>
      </div>
    </div>

    <div class="actions">
      <AppLink size="md" class="change-terms-button" :to="{ name: 'InfluencerProposalEdit', params: { taskId } }">
        Change terms
      </AppLink>

      <AppLink outlined :to="{ name: 'WithdrawProposalPopup' }">Withdraw proposal</AppLink>
    </div>
  </div>
  <div class="mobile-actions">
    <AppLink outlined :to="{ name: 'WithdrawProposalPopup' }">Withdraw</AppLink>

    <AppLink size="md" class="change-terms-button" :to="{ name: 'InfluencerProposalEdit', params: { taskId } }">
      Change
    </AppLink>
  </div>
</template>

<script lang="ts">
import { defineComponent, PropType } from 'vue'
import AppLink from '@/components/common/AppLink.vue'
import variables from '@/assets/variables'
import { ProposalPublicInfo } from '@/types/proposal.model'
import { getCurrencySign } from '@/components/helpers/currencyFormatter'
import { calcInfluencerBudget } from '@/components/helpers/social-accounts'
import AccountCard from '@/components/cards/AccountCard.vue'

export default defineComponent({
  name: 'ProposalInfo',
  components: {
    AppLink,
    AccountCard,
  },
  props: {
    proposal: {
      type: Object as PropType<ProposalPublicInfo>,
      required: true,
    },
    taskId: {
      type: String,
      required: true,
    },
  },
  setup(props) {
    const currencySign = getCurrencySign(props.proposal.cost.currency)
    const influencerIncome = calcInfluencerBudget(props.proposal.cost.value)

    return {
      currencySign,
      influencerIncome,
      variables,
    }
  },
})
</script>

<style lang="scss" scoped>
@import '@/assets/styles/views/influencer/proposal/ProposalInfo';
</style>
