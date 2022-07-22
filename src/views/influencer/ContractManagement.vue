<template>
  <main class="i-contract-management" :class="classList">
    <template v-if="!isMobilePopup">
      <AppSkeleton v-if="isLoading" />
      <AppErrorBox v-else-if="isError" @clicked="initTaskContract">contract</AppErrorBox>
      <ContractDetails v-else-if="getTaskContract" :is-busy="isExecutingAction">
        <MilestoneItem
          v-for="milestone in getTaskContract.contract.milestones"
          :key="milestone.id"
          :milestone="milestone"
          @open-dispute="doOpenDispute(milestone)"
        />
      </ContractDetails>
    </template>
    <router-view></router-view>
  </main>
</template>

<script lang="ts">
import { computed, defineComponent, watchEffect } from 'vue'
import useInfluencerContractManagement from '@/components/influencer/contract-management/contract-management'
import ContractDetails from '@/components/influencer/contract-management/ContractDetails.vue'
import MilestoneItem from '@/components/influencer/contract-management/MilestoneItem.vue'
import AppSkeleton from '@/components/common/AppSkeleton.vue'
import AppErrorBox from '@/components/common/AppErrorBox.vue'
import { getIsMobilePopup, setTitle } from '@/components/helpers/dom'

export default defineComponent({
  name: 'ContractManagement',
  components: {
    ContractDetails,
    MilestoneItem,
    AppSkeleton,
    AppErrorBox,
  },
  setup() {
    const { isLoaded, isLoading, isError, getTaskContract, isExecutingAction, doOpenDispute, initTaskContract } =
      useInfluencerContractManagement()
    const isMobilePopup = getIsMobilePopup()

    const classList = computed(() => {
      const emptyStyles = isLoaded.value ? '' : '--empty'
      const mobilePopups = isMobilePopup.value ? 'contract-management-mobile-popup' : ''

      return `${emptyStyles} ${mobilePopups}`
    })

    watchEffect(() => {
      if (getTaskContract.value?.task) {
        setTitle('Freelance Influence | Proposal For Task ' + getTaskContract.value.task.title)
      }
    })

    initTaskContract()

    return {
      classList,
      isMobilePopup,
      getTaskContract,
      isLoading,
      isError,
      isExecutingAction,
      initTaskContract,
      doOpenDispute,
    }
  },
})
</script>

<style lang="scss" scoped>
@import '@/assets/styles/views/influencer/contract-management/ContractManagement';
</style>
