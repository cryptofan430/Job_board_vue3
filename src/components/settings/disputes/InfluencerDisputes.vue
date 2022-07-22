<template>
  <div>
    <AppSkeleton v-if="isLoading" />
    <AppErrorBox v-else-if="isError" @clicked="refetchDisputes">disputes</AppErrorBox>
    <AppEmptyBox v-else-if="!getInfluencerDisputes?.length">No disputes at the moment</AppEmptyBox>

    <DisputesContainer v-else :disputes="getInfluencerDisputes" :is-marketer="false" />
  </div>
</template>

<script lang="ts">
import { defineComponent } from 'vue'
import DisputesContainer from '@/components/settings/disputes/DisputesContainer.vue'
import AppSkeleton from '@/components/common/AppSkeleton.vue'
import AppErrorBox from '@/components/common/AppErrorBox.vue'
import AppEmptyBox from '@/components/common/AppEmptyBox.vue'
import useInfluencerDisputes from '@/components/settings/disputes/influencer-disputes'

export default defineComponent({
  name: 'InfluencerDisputes',
  components: {
    DisputesContainer,
    AppSkeleton,
    AppErrorBox,
    AppEmptyBox,
  },
  setup() {
    const { isLoaded, isLoading, isError, getInfluencerDisputes, refetchDisputes } = useInfluencerDisputes()

    refetchDisputes()

    return {
      getInfluencerDisputes,
      isLoaded,
      isLoading,
      isError,
      refetchDisputes,
    }
  },
})
</script>
