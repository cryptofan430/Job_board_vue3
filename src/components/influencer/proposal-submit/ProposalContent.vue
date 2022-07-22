<template>
  <div class="proposal-content">
    <div class="cover-letter">
      <p class="title">Cover letter</p>

      <div class="subtitle">Promote yourself for marketer</div>

      <AppTextarea v-model="proposalData.description" />

      <AppInputError>
        {{ errors.description }}
      </AppInputError>
    </div>

    <AppErrorBox v-if="socialRequestFailed" @clicked="getSocial"> social accounts </AppErrorBox>

    <SocialItems
      v-else-if="relevantAccountsReady"
      class="social-items-root"
      :no-relevant-accounts="noRelevantAccounts"
      :relevant-accounts="relevantAccounts"
    />
    <AppSkeleton v-else />

    <AppErrorBox v-if="taskRequestFailed" @clicked="getTask"> task </AppErrorBox>

    <div v-else-if="taskReady">
      <p class="terms-title">Terms</p>

      <div class="terms">
        <div class="budget-input-container" :data-currency="currencySign">
          <AppInput
            id="budget"
            v-model="proposalData.cost"
            name="budget"
            type="number"
            :decimals="2"
            responsive
            size="sm"
          />
        </div>

        <div class="estimated">
          <p class="estimated-value">You’ll receive: {{ currencySign }}{{ influencerIncome }}</p>

          <p class="estimated-info">The estimated payment, after service fees.</p>
        </div>
      </div>
    </div>

    <AppSkeleton v-else />

    <div class="actions">
      <AppButton size="md" :disabled="waitingForResponse" :is-loading="waitingForResponse" @click="submit">
        Submit proposal
      </AppButton>
    </div>
  </div>
  <div class="actions-mobile">
    <AppButton
      class="submit-proposal-mobile-btn"
      :disabled="waitingForResponse"
      :is-loading="waitingForResponse"
      @click="submit"
    >
      Submit proposal
    </AppButton>
  </div>
</template>

<script lang="ts">
import { computed, defineComponent, provide } from 'vue'
import AppButton from '@/components/common/AppButton.vue'
import AppTextarea from '@/components/common/AppTextarea.vue'
import AppInput from '@/components/common/AppInput.vue'
import AppInputError from '@/components/common/AppInputError.vue'
import AppSkeleton from '@/components/common/AppSkeleton.vue'
import AppErrorBox from '@/components/common/AppErrorBox.vue'
import SocialItems from './SocialItems.vue'
import variables from '@/assets/variables'

import useSubmitProposal from '@/components/influencer/proposal-submit/submit-proposal'
import { getCurrencySign } from '@/components/helpers/currencyFormatter'
import { calcInfluencerBudget } from '@/components/helpers/social-accounts'

export default defineComponent({
  name: 'ProposalContent',
  components: {
    AppButton,
    AppTextarea,
    AppInput,
    SocialItems,
    AppInputError,
    AppSkeleton,
    AppErrorBox,
  },
  setup() {
    const {
      proposalData,
      submit,
      errors,
      waitingForResponse,
      task,
      taskReady,
      relevantAccountsReady,
      taskRequestFailed,
      socialRequestFailed,
      noRelevantAccounts,
      relevantAccounts,
      selectedRelevantAccounts,
      getTask,
      getSocial,
    } = useSubmitProposal()

    const currencySign = computed(() => {
      if (!task.value) return ''
      return getCurrencySign(task.value.budget.currency)
    })

    const influencerIncome = computed(() => {
      if (!task.value) return ''
      return calcInfluencerBudget(proposalData.value.cost)
    })

    if (task.value) proposalData.value.cost = task.value.budget.value

    provide('selected-relevant-accounts', selectedRelevantAccounts)

    return {
      variables,
      noRelevantAccounts,
      relevantAccounts,
      selectedRelevantAccounts,
      proposalData,
      submit,
      errors,
      waitingForResponse,
      task,
      taskReady,
      relevantAccountsReady,
      taskRequestFailed,
      socialRequestFailed,
      getTask,
      getSocial,
      influencerIncome,
      currencySign,
    }
  },
})
</script>

<style lang="scss" scoped>
@import '@/assets/styles/views/influencer/proposal-submit/ProposalContent';
</style>
