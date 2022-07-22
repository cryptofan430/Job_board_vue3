<template>
  <main class="dispute">
    <DisputeProjectInfo />
    <DisputeContractInfo class="dispute-block" />
    <JobInfo class="dispute-block" />
    <DisputeResolvation v-if="!getAdminDispute?.disputeAdminInfo || !isDisputeClosed" class="dispute-block" />
  </main>
</template>

<script lang="ts">
import { computed, defineComponent } from 'vue'
import DisputeProjectInfo from '@/components/marketer/admin/dispute/DisputeProject.vue'
import DisputeContractInfo from '@/components/marketer/admin/dispute/DisputeContract.vue'
import JobInfo from '@/components/marketer/admin/dispute/DisputeJob.vue'
import DisputeResolvation from '@/components/marketer/admin/dispute/DisputeResolvation.vue'
import useAdminDispute from '@/components/marketer/admin/dispute/dispute'
import { DisputeState } from '@/types/disputes'

export default defineComponent({
  components: {
    DisputeResolvation,
    DisputeContractInfo,
    DisputeProjectInfo,
    JobInfo,
  },
  setup() {
    const { initDispute, getAdminDispute } = useAdminDispute()
    initDispute()

    const isDisputeClosed = computed(() => getAdminDispute.value?.disputeAdminInfo?.state === DisputeState.CLOSED)

    return {
      getAdminDispute,
      isDisputeClosed,
    }
  },
})
</script>

<style lang="scss" scoped>
@import '@/assets/styles/views/marketer/admin/dispute/DisputePage.scss';
</style>
