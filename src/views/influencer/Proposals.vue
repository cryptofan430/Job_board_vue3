<template>
  <main class="proposals">
    <h2 v-if="proposals?.length" class="title">All proposals</h2>

    <div class="wrapper">
      <AppSkeleton v-if="isLoading" />

      <AppErrorBox v-else-if="isError" @clicked="refetchInfluencerProposals">proposal</AppErrorBox>

      <AppEmptyBox v-else-if="isLoaded && !proposals?.length"> There are no proposals </AppEmptyBox>

      <ul v-else class="list">
        <ProposalItem v-for="{ proposal, task } in proposals" :key="proposal.id" :proposal="proposal" :task="task" />
      </ul>
    </div>

    <AppPagination
      v-if="isLoaded && proposals?.length"
      :per-page="perPage"
      :count="proposalsCount"
      :active-page="activePage"
      @page-change="updatePage"
    />
  </main>
</template>

<script lang="ts">
import { defineComponent } from 'vue'
import ProposalItem from '@/components/influencer/proposals/ProposalItem.vue'
import AppPagination from '@/components/common/AppPagination.vue'
import AppSkeleton from '@/components/common/AppSkeleton.vue'
import AppErrorBox from '@/components/common/AppErrorBox.vue'
import AppEmptyBox from '@/components/common/AppEmptyBox.vue'
import useInfluencerProposals from '@/components/influencer/proposals/influencer-proposals'

export default defineComponent({
  name: 'Proposals',
  components: {
    AppSkeleton,
    AppErrorBox,
    AppEmptyBox,
    ProposalItem,
    AppPagination,
  },
  setup() {
    const {
      proposals,
      proposalsCount,
      isLoading,
      isError,
      isLoaded,
      perPage,
      activePage,
      refetchInfluencerProposals,
      updatePage,
      watchFilters,
      watchPageLimits,
    } = useInfluencerProposals()

    refetchInfluencerProposals()

    watchFilters()
    watchPageLimits()

    return {
      proposals,
      activePage,
      perPage,
      proposalsCount,
      isLoaded,
      isLoading,
      isError,
      updatePage,
      refetchInfluencerProposals,
    }
  },
})
</script>

<style lang="scss" scoped>
@import '@/assets/styles/views/influencer/proposals/Proposals';
</style>
