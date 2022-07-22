<template>
  <main class="tasks">
    <h1 class="title">My tasks</h1>

    <div class="wrapper">
      <div class="mobile-for-contracts-button">
        <router-link to="contracts">
          <AppButton v-if="isLoaded && getInfluencerContracts?.length" outlined>Show all</AppButton>
        </router-link>
      </div>
      <div class="tasks-list-wrapper" :class="wrapperClassList">
        <div v-if="!isLoaded || getInfluencerContracts?.length" class="tasks-list-header">
          <p class="list-title">Contracts</p>

          <router-link to="contracts">
            <AppButton v-if="isLoaded && getInfluencerContracts?.length" outlined>Show all</AppButton>
          </router-link>
        </div>

        <AppSkeleton v-if="isLoading" />
        <AppErrorBox v-else-if="isError" @clicked="fetchContractFirstPage">contracts</AppErrorBox>

        <AppEmptyBox v-else-if="isLoaded && !getInfluencerContracts?.length">There are no contracts</AppEmptyBox>

        <TasksList v-else />
      </div>

      <TasksSidebar />
    </div>
  </main>
</template>

<script lang="ts">
import { computed, defineComponent } from 'vue'
import useInfluencerContracts from '@/components/influencer/tasks/contracts'
import TasksSidebar from '@/components/influencer/tasks/TasksSidebar.vue'
import TasksList from '@/components/influencer/tasks/TasksList.vue'
import AppButton from '@/components/common/AppButton.vue'
import AppSkeleton from '@/components/common/AppSkeleton.vue'
import AppErrorBox from '@/components/common/AppErrorBox.vue'
import AppEmptyBox from '@/components/common/AppEmptyBox.vue'

export default defineComponent({
  name: 'TasksSearch',
  components: {
    TasksList,
    TasksSidebar,
    AppButton,
    AppSkeleton,
    AppErrorBox,
    AppEmptyBox,
  },
  setup() {
    const { getInfluencerContracts, isLoading, isError, isLoaded, fetchContractFirstPage } = useInfluencerContracts()

    fetchContractFirstPage()

    const wrapperClassList = computed(() => {
      const wrapperEmpty = !isLoaded || !getInfluencerContracts?.value?.length ? 'wrapper-empty' : ''
      return `${wrapperEmpty}`
    })

    return {
      getInfluencerContracts,
      isLoading,
      isError,
      isLoaded,
      wrapperClassList,
      fetchContractFirstPage,
    }
  },
})
</script>

<style lang="scss" scoped>
@import '@/assets/styles/views/influencer/tasks/Tasks';
</style>
