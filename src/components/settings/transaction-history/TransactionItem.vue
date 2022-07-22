<template>
  <div class="transactions-rows">
    <div class="transactions-row">
      <div class="transactions-cell --date">{{ transactionDate }}</div>

      <div class="transactions-cell --desc">{{ transaction?.description }}</div>

      <div class="transactions-cell --client">{{ 'client name' }}</div>

      <div class="transactions-cell --amount" :class="isDecreased ? '--decrease' : '--increase'">
        {{ isDecreased ? '-' : '+' }} {{ currencySign }} {{ transaction?.money?.value?.toFixed(2) }}
      </div>

      <div class="transactions-cell --invoice">
        <a :href="transaction?.file?.signedUrl" :download="transaction?.file?.filename" class="invoice-button">
          <AppIcon name="invoice" :color="variables.cPrimary500" />
        </a>
      </div>
    </div>

    <div class="mobile-transactions-row">
      <div class="mobile-client-amount">
        <div class="mobile-client">
          <span>From:</span>
          {{ 'client name' }}
        </div>
        <div class="mobile-amount" :class="isDecreased ? '--decrease' : '--increase'">
          {{ isDecreased ? '-' : '+' }} {{ currencySign }} {{ transaction?.money?.value?.toFixed(2) }}
        </div>
      </div>
      <div class="mobile-date">{{ transactionDate }}</div>
      <div class="mobile-desc">{{ transaction?.description }}</div>
      <div class="mobile-invoice">
        <a :href="transaction?.file?.signedUrl" :download="transaction?.file?.filename" class="invoice-button">
          <AppIcon name="invoice" :color="variables.cPrimary500" />
          <span>Download invoice</span>
        </a>
      </div>
    </div>
  </div>
</template>

<script lang="ts">
import { computed, defineComponent, PropType } from 'vue'
import AppIcon from '@/components/common/AppIcon.vue'
import variables from '@/assets/variables'
import { TransactionPublicInfo, TransactionState, TransactionType } from '@/types/transaction.model'
import { getCurrencySign } from '@/components/helpers/currencyFormatter'
import { getDateAbsoluteFormatted } from '@/components/helpers/timeFormatter'

export default defineComponent({
  name: 'TransactionItem',
  components: {
    AppIcon,
  },
  props: {
    transaction: {
      type: Object as PropType<TransactionPublicInfo>,
      required: true,
    },
  },
  setup(props) {
    const isDecreased = computed(() => {
      const transactionType = props.transaction?.type
      const transactionState = props.transaction?.state
      if (
        transactionType === TransactionType.SERVICE_FEE ||
        (transactionType === TransactionType.MILESTONE_PAYMENT && transactionState === TransactionState.MARKETER) ||
        transactionType === TransactionType.WITHDRAWAL ||
        (transactionType === TransactionType.MILESTONE_RELEASED && transactionState === TransactionState.MARKETER)
      ) {
        return true
      }
      return false
    })
    //prototype only

    const currencySign = computed(() => getCurrencySign(props.transaction?.money?.currency))
    const transactionDate = computed(() => getDateAbsoluteFormatted(props.transaction?.date))

    return { variables, isDecreased, currencySign, transactionDate }
  },
})
</script>

<style lang="scss" scoped>
@import '@/assets/styles/views/settings/transaction-history/TransactionItem';
</style>
