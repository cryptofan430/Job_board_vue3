<template>
  <li class="milestone-list-item">
    <div class="milestone">
      <h3 class="milestone-name">{{ milestone.title }}</h3>
      <div class="milestone-sm-payment">
        <span class="money-earned"
          >{{ currencySign }} {{ milestone.budget.value }}
          {{ milestoneState.isSecured ? 'funded' : milestoneState.isReleased ? 'paid' : 'left' }}</span
        >
      </div>
      <p v-if="milestone.disputeId && !isDisputeOpen" class="disputes-message --warning">Dispute is open</p>
      <p class="milestone-description">
        {{ milestone.description }}
      </p>
      <p v-if="milestone.disputeId && !isDisputeOpen" class="disputes-sm-message --warning">Dispute is open</p>
    </div>
    <div class="milestone-payment">
      <span class="money-earned"
        >{{ currencySign }} {{ milestone.budget.value }}
        {{ milestoneState.isSecured ? 'funded' : milestoneState.isReleased ? 'paid' : 'left' }}</span
      >
    </div>
  </li>
</template>

<script lang="ts">
import { getCurrencySign } from '@/components/helpers/currencyFormatter'
import { extractMilestoneState } from '@/components/helpers/milestones'
import { ContractMilestonePublicInfo } from '@/types/contract.model'
import { DisputeState } from '@/types/disputes'
import { computed, defineComponent, PropType } from 'vue'

export default defineComponent({
  props: {
    milestone: {
      type: Object as PropType<ContractMilestonePublicInfo>,
      required: true,
    },
  },
  setup(props) {
    const currencySign = getCurrencySign(props.milestone.budget.currency)
    const milestoneState = computed(() => extractMilestoneState(props.milestone))
    const isDisputeOpen = computed(() => props.milestone.disputeState === DisputeState.CLOSED)

    return {
      isDisputeOpen,
      currencySign,
      milestoneState,
    }
  },
})
</script>

<style lang="scss" scoped>
@import '@/assets/styles/views/marketer/admin/dispute/DisputeContractMilestone.scss';
</style>
