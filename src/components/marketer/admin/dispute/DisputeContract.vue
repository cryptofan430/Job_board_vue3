<template>
  <AppExpandMenu>
    <template #header> Contract </template>

    <template #default>
      <AppSkeleton v-if="isLoading" />
      <AppErrorBox v-else-if="isError" @clicked="initDispute">dispute</AppErrorBox>

      <div v-else class="dispute-members">
        <section class="influencer">
          <h2 class="account-type-headline">Influencer</h2>
          <div class="influencer-info">
            <AppAvatar
              class="user-avatar"
              size="md"
              :img-url="getAdminDispute?.influencerInfo?.avatarSimpleAccessFile?.signedUrl"
            />
            {{ getAdminDispute?.influencerInfo?.firstName }} {{ getAdminDispute?.influencerInfo?.lastName }}
          </div>
        </section>

        <section class="marketer">
          <h2 class="account-type-headline account-type-headline-marketer">Marketer</h2>
          <div class="marketer-info">
            <AppAvatar
              class="user-avatar"
              size="md"
              :img-url="getAdminDispute?.marketerInfo?.avatarSimpleAccessFile?.signedUrl"
            />
            {{ getAdminDispute?.marketerInfo?.firstName }} {{ getAdminDispute?.marketerInfo?.lastName }}
          </div>
        </section>
      </div>

      <div class="contract-milestones-payload">
        <span class="milestone-count"
          >Milestones: {{ getAdminDispute?.contractWithTask?.contract?.milestones?.length }}</span
        >
        <span class="milestone-payments">Payments: ${{ milestonesPaymentsSum }}</span>
      </div>

      <ol class="milestones">
        <DisputeContractMilestone
          v-for="milestone in getAdminDispute?.contractWithTask?.contract?.milestones || []"
          :key="milestone.id"
          :milestone="milestone"
        />
      </ol>
    </template>
  </AppExpandMenu>
</template>

<script lang="ts">
import { computed, defineComponent } from 'vue'
import AppExpandMenu from '@/components/common/AppExpandMenu.vue'
import AppAvatar from '@/components/common/AppAvatar.vue'
import AppSkeleton from '@/components/common/AppSkeleton.vue'
import AppErrorBox from '@/components/common/AppErrorBox.vue'
import DisputeContractMilestone from '@/components/marketer/admin/dispute/DisputeContractMilestone.vue'
import useAdminDispute from './dispute'

export default defineComponent({
  components: {
    AppExpandMenu,
    AppAvatar,
    AppSkeleton,
    AppErrorBox,
    DisputeContractMilestone,
  },
  setup() {
    const { getAdminDispute, isLoading, isError, initDispute } = useAdminDispute()
    const milestonesPaymentsSum = computed(() =>
      getAdminDispute.value?.contractWithTask?.contract?.milestones?.reduce((acc, curr) => acc + curr.budget.value, 0)
    )

    return { milestonesPaymentsSum, getAdminDispute, isLoading, isError, initDispute }
  },
})
</script>

<style lang="scss" scoped>
@import '@/assets/styles/views/marketer/admin/dispute/DisputeContract.scss';
</style>
