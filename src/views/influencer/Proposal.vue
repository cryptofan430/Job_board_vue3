<template>
  <main class="proposal" :class="proposalClasses">
    <template v-if="!isMobilePopup">
      <h1 class="title">Proposal</h1>
      <div class="wrapper">
        <AppSkeleton v-if="isLoading" />

        <AppErrorBox v-else-if="isError" @clicked="initInfluencerProposal">proposal</AppErrorBox>
        <template v-else>
          <ProposalInfo :proposal="getInfluencerProposal" :task-id="getProposalTask?.id || ''" />
          <div class="side">
            <ProposalProjectInfo :task="getProposalTask" />
            <ProposalMarketerInfo :marketer="getProposalTask?.marketerInfo" />
          </div>
          <div class="mobile-side">
            <AppExpandMenu header-color="secondary-header-color">
              <template #header> {{ getProposalTask?.title }} </template>
              <template #default>
                <ProposalProjectInfo :task="getProposalTask" />
                <ProposalMarketerInfo :marketer="getProposalTask?.marketerInfo" />
              </template>
            </AppExpandMenu>
          </div>
        </template>
      </div>
    </template>

    <router-view />
  </main>
</template>

<script lang="ts">
import { computed, defineComponent, onUnmounted, watchEffect } from 'vue'
import ProposalMarketerInfo from '@/components/influencer/proposal/ProposalMarketerInfo.vue'
import ProposalInfo from '@/components/influencer/proposal/ProposalInfo.vue'
import ProposalProjectInfo from '@/components/influencer/proposal/ProposalProjectInfo.vue'
import useInfluencerProposal from '@/components/influencer/proposal/proposal'
import AppErrorBox from '@/components/common/AppErrorBox.vue'
import AppSkeleton from '@/components/common/AppSkeleton.vue'
import AppExpandMenu from '@/components/common/AppExpandMenu.vue'
import { getIsMobilePopup, setTitle } from '@/components/helpers/dom'

export default defineComponent({
  name: 'Proposal',
  components: {
    ProposalMarketerInfo,
    ProposalInfo,
    ProposalProjectInfo,
    AppErrorBox,
    AppSkeleton,
    AppExpandMenu,
  },
  setup() {
    const { isLoading, isError, isLoaded, getInfluencerProposal, getProposalTask, initInfluencerProposal, resetState } =
      useInfluencerProposal()
    const isMobilePopup = getIsMobilePopup()

    const proposalClasses = computed(() => {
      const emptyClassess = !isLoaded.value ? '--empty' : ''
      const mobilePopupClasses = isMobilePopup.value ? '--mobile-popup' : ''

      return `${emptyClassess} ${mobilePopupClasses}`
    })

    initInfluencerProposal()
    onUnmounted(() => resetState())
    watchEffect(() => {
      if (getProposalTask.value) {
        setTitle('Freelance Influence | Proposal For Task ' + getProposalTask.value.title)
      }
    })

    return {
      proposalClasses,
      isLoading,
      isError,
      isLoaded,
      isMobilePopup,
      getInfluencerProposal,
      getProposalTask,
      initInfluencerProposal,
    }
  },
})
</script>

<style lang="scss" scoped>
@import '@/assets/styles/views/influencer/proposal/Proposal';
</style>
