<template>
  <main class="i-contract-accept">
    <h2 class="title">Contract</h2>

    <AppSkeleton v-if="isLoading" />
    <AppErrorBox v-else-if="isError" @clicked="initTaskContract"> contract </AppErrorBox>

    <ContractDetails v-else-if="getTaskContract" :task-contract="getTaskContract">
      <MilestoneItem
        v-for="milestone in getTaskContract.contract.milestones"
        :key="milestone.id"
        :milestone="milestone"
      />
    </ContractDetails>
  </main>
</template>

<script lang="ts">
import { defineComponent, watchEffect } from 'vue'
import useContractAccept from '@/components/influencer/contract-accept/contract-accept'
import ContractDetails from '@/components/influencer/contract-accept/ContractDetails.vue'
import MilestoneItem from '@/components/influencer/contract-accept/MilestoneItem.vue'
import AppSkeleton from '@/components/common/AppSkeleton.vue'
import AppErrorBox from '@/components/common/AppErrorBox.vue'
import { setTitle } from '@/components/helpers/dom'

export default defineComponent({
  name: 'ContractAccept',
  components: {
    ContractDetails,
    MilestoneItem,
    AppSkeleton,
    AppErrorBox,
  },
  setup() {
    const { getTaskContract, isLoading, isError, initTaskContract } = useContractAccept()
    initTaskContract()

    watchEffect(() => {
      if (getTaskContract.value?.task) {
        setTitle('Freelance Influence | Proposal For Task ' + getTaskContract.value.task.title)
      }
    })

    return {
      isLoading,
      isError,
      getTaskContract,
      initTaskContract,
    }
  },
})
</script>

<style lang="scss" scoped>
@import '@/assets/styles/views/influencer/contract-accept/ContractAccept';
</style>
