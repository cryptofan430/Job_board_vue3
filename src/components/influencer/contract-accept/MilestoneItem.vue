<template>
  <div class="milestone">
    <p class="name">
      {{ milestone.title }}

      <span class="money"> {{ currencySign }}{{ milestone.budget?.value }} </span>
    </p>

    <p class="content">
      {{ milestone.description }}
    </p>
  </div>
</template>

<script lang="ts">
import { computed, defineComponent, PropType } from 'vue'
import { getCurrencySign } from '@/components/helpers/currencyFormatter'
import { ContractMilestonePublicInfo } from '@/types/contract.model'

export default defineComponent({
  props: {
    milestone: {
      type: Object as PropType<ContractMilestonePublicInfo>,
      required: true,
    },
  },
  setup(props) {
    const currencySign = computed(() => getCurrencySign(props.milestone.budget.currency))

    return {
      currencySign,
    }
  },
})
</script>

<style lang="scss" scoped>
@import '@/assets/styles/views/influencer/contract-accept/MilestoneItem';
</style>
