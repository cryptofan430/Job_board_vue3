<template>
  <div class="transactions">
    <section class="settings-transactions">
      <div class="header">
        <h2 class="title">Transaction history</h2>

        <AppButton :disabled="!getTransactions?.length" @click="downloadInvoices">Download invoices</AppButton>
      </div>

      <AppSkeleton v-if="isLoading" class="special-state" />
      <AppErrorBox v-else-if="isError" class="special-state" @clicked="refetchTransactions">invoices</AppErrorBox>
      <AppEmptyBox v-else-if="isLoaded && !getTransactions?.length" class="special-state"
        >No invoices at the moment</AppEmptyBox
      >

      <template v-else>
        <div class="transactions-table">
          <div class="transactions-header">
            <div class="transactions-cell --date">Date</div>

            <div class="transactions-cell --desc">Description</div>

            <div class="transactions-cell --client">Client</div>

            <div class="transactions-cell --amount">Amount</div>

            <div class="transactions-cell --invoice">Invoice</div>
          </div>
        </div>

        <div class="transaction-wrapper">
          <TransactionItem v-for="transaction in getTransactions" :key="transaction.id" :transaction="transaction" />
          <AppPagination
            :active-page="activePage"
            :per-page="transactionsPerPage"
            :count="getTransactionsCount"
            @page-change="updatePage"
          />
        </div>
      </template>
    </section>
    <section class="mobile-settings-transactions">
      <AppButton :disabled="!getTransactions?.length" @click="downloadInvoices">Download invoices</AppButton>
      <div class="mobile-transactions">
        <AppSkeleton v-if="isLoading" class="special-state" />
        <AppErrorBox v-else-if="isError" class="special-state" @clicked="refetchTransactions">invoices</AppErrorBox>
        <AppEmptyBox v-else-if="isLoaded && !getTransactions?.length" class="special-state"
          >No invoices at the moment</AppEmptyBox
        >
        <div v-else>
          <h2 class="title">Transaction history</h2>
          <TransactionItem v-for="transaction in getTransactions" :key="transaction.id" :transaction="transaction" />
        </div>
      </div>
    </section>
  </div>
</template>

<script lang="ts">
import { defineComponent } from 'vue'
import AppButton from '@/components/common/AppButton.vue'
import TransactionItem from '@/components/settings/transaction-history/TransactionItem.vue'
import AppSkeleton from '@/components/common/AppSkeleton.vue'
import AppErrorBox from '@/components/common/AppErrorBox.vue'
import AppEmptyBox from '@/components/common/AppEmptyBox.vue'
import AppPagination from '@/components/common/AppPagination.vue'
import useTransactionsHistory from '@/components/settings/transaction-history/transactions-history'

export default defineComponent({
  name: 'SettingsTransactions',
  components: {
    AppButton,
    TransactionItem,
    AppSkeleton,
    AppErrorBox,
    AppEmptyBox,
    AppPagination,
  },
  setup() {
    const {
      isLoading,
      isLoaded,
      isError,
      getTransactions,
      activePage,
      getTransactionsCount,
      transactionsPerPage,
      watchFilters,
      fetchTransactionsInitial,
      refetchTransactions,
      watchPageLimits,
      updatePage,
      downloadInvoices,
    } = useTransactionsHistory()

    watchPageLimits()
    watchFilters()
    fetchTransactionsInitial()

    return {
      getTransactions,
      getTransactionsCount,
      transactionsPerPage,
      activePage,
      isLoading,
      isError,
      isLoaded,
      refetchTransactions,
      updatePage,
      downloadInvoices,
    }
  },
})
</script>

<style lang="scss" scoped>
@import '@/assets/styles/views/settings/SettingsTransactions';
</style>
