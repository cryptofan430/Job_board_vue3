<template>
  <div>
    <AppSkeleton v-if="isLoading" />
    <AppErrorBox v-else-if="isError" @clicked="refetchDisputes">disputes</AppErrorBox>
    <AppEmptyBox v-else-if="!getMarketerDisputes?.length">No disputes at the moment</AppEmptyBox>

    <DisputesContainer v-else :disputes="getMarketerDisputes" is-marketer />
  </div>
</template>

<script lang="ts">
import { defineComponent } from 'vue'
import DisputesContainer from '@/components/settings/disputes/DisputesContainer.vue'
import AppSkeleton from '@/components/common/AppSkeleton.vue'
import AppErrorBox from '@/components/common/AppErrorBox.vue'
import AppEmptyBox from '@/components/common/AppEmptyBox.vue'
import useMarketerDisputes from '@/components/settings/disputes/marketer-disputes'

export default defineComponent({
  components: {
    DisputesContainer,
    AppSkeleton,
    AppErrorBox,
    AppEmptyBox,
  },
  setup() {
    const { isLoaded, isLoading, isError, getMarketerDisputes, refetchDisputes } = useMarketerDisputes()

    refetchDisputes()

    return {
      getMarketerDisputes,
      isLoaded,
      isLoading,
      isError,
      refetchDisputes,
    }
  },
})
</script>
