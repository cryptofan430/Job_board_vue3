<template>
  <div class="contract-details">
    <div class="contract-bar">
      <p class="name">
        {{ taskContract.task?.title }}
      </p>

      <div class="rating">
        <span class="budget"> Budget: {{ currencyFormatted }} </span>
      </div>
    </div>

    <p class="date">
      {{ dateFormatted }}
    </p>

    <p class="content">
      {{ taskContract.task?.description }}
    </p>

    <div class="platforms">
      <span class="platforms-text">Platform: </span>

      <AppTag v-for="platform in platformLabels" :key="platform" outlined>
        {{ platform }}
      </AppTag>
    </div>

    <div class="milestiones-container">
      <slot></slot>
    </div>

    <div class="footer">
      <div class="budget">
        <p class="budget-value">Budget ${{ totalBudget }}</p>

        <p class="budget-info">This includes all milestones.</p>
      </div>

      <div class="estimated">
        <p class="estimated-value">You’ll receive: ${{ influencerIncome }}</p>

        <p class="estimated-info">The estimated payment, after service fees.</p>
      </div>

      <div class="actions">
        <AppButton :disabled="isWaitingActionResponse" :is-loading="isAcceptingContract" @click="doAcceptContract">
          Accept
        </AppButton>

        <AppButton
          class="decline"
          outlined
          :disabled="isWaitingActionResponse"
          :is-loading="isDecliningContract"
          @click="declineContract"
        >
          Decline
        </AppButton>
      </div>
    </div>
  </div>
  <div class="mobile-actions">
    <AppButton :disabled="isWaitingActionResponse" :is-loading="isAcceptingContract" @click="doAcceptContract">
      Accept
    </AppButton>

    <AppButton
      class="decline"
      outlined
      :disabled="isWaitingActionResponse"
      :is-loading="isDecliningContract"
      @click="declineContract"
    >
      Decline
    </AppButton>
  </div>
</template>

<script lang="ts">
import { computed, defineComponent, PropType } from 'vue'
import AppButton from '@/components/common/AppButton.vue'
import variables from '@/assets/variables'
import AppTag from '@/components/common/AppTag.vue'
import { ContractWithTask } from '@/types/contract.model'
import { getFormattedRelativeDate } from '@/components/helpers/timeFormatter'
import { getTaskPlatformLabel } from '@/components/helpers/platforms'
import { calcInfluencerIncome } from '@/components/helpers/currencyFormatter'
import useContractAccept from './contract-accept'
import { getCurrencySign } from '@/components/helpers/currencyFormatter'

export default defineComponent({
  name: 'InfluencerContractDetails',
  components: {
    AppTag,
    AppButton,
  },
  props: {
    taskContract: {
      type: Object as PropType<ContractWithTask>,
      required: true,
    },
  },
  setup(props) {
    const { isWaitingActionResponse, isAcceptingContract, isDecliningContract, doAcceptContract, declineContract } =
      useContractAccept()
    const dateFormatted = computed(() => getFormattedRelativeDate(props.taskContract?.task?.addedTime))
    const platformLabels = computed(() =>
      props.taskContract.task.platforms.map((platform) => getTaskPlatformLabel(platform))
    )
    const totalBudget = computed(
      () => props.taskContract.contract?.milestones?.reduce((acc, milestone) => acc + milestone.budget.value, 0) || 0
    )
    const currencyFormatted = computed(() => {
      const currencySign = getCurrencySign(props.taskContract.task.budget?.currency) || ''
      return `${currencySign}${props.taskContract.task.budget?.value}`
    })
    const influencerIncome = computed(() => calcInfluencerIncome(totalBudget.value))

    return {
      isWaitingActionResponse,
      isAcceptingContract,
      isDecliningContract,
      dateFormatted,
      platformLabels,
      totalBudget,
      influencerIncome,
      variables,
      doAcceptContract,
      declineContract,
      currencyFormatted,
    }
  },
})
</script>

<style lang="scss" scoped>
@import '@/assets/styles/views/influencer/contract-accept/ContractDetails';
</style>
