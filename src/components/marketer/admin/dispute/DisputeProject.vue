<template>
  <div class="disputes-list-item">
    <AppSkeleton v-if="isLoading" />

    <AppErrorBox v-else-if="isError" @clicked="initDispute">dispute</AppErrorBox>
    <template v-else>
      <div class="disputes-content">
        <div class="dispute-content-info-container">
          <h2 class="project-name">{{ getAdminDispute?.contractWithTask?.task?.title }}</h2>
          <p class="milestone-name">{{ disputeMilestone?.title }}</p>
          <p class="project-description">
            {{ disputeMilestone?.description }}
          </p>
          <p class="project-time">created 15 minutes ago</p>
        </div>
        <div class="button-actions">
          <AppButton size="md" @click="joinDisputeChat">Dispute Chat</AppButton>
          <AppButton class="chat-button" size="md" outlined @click="joinRegularChat">Regular Chat</AppButton>
        </div>
      </div>
      <div class="disputes-aside">
        <div class="dispute-admin">
          <p class="dispute-admin-label">Admin</p>
          <p class="dispute-admin-name" :class="adminClasses">{{ adminText }}</p>
        </div>
        <div class="dispute-status">
          <p class="dispute-status-label">Status:</p>
          <p class="dispute-status-value" :class="disputeStateClasses">{{ disputeStateText }}</p>
        </div>
      </div>
    </template>
  </div>
  <div v-if="!isLoading && !isError" class="button-sm-actions">
    <AppButton size="md" @click="joinDisputeChat">Dispute Chat</AppButton>
    <AppButton class="chat-button" size="md" outlined @click="joinRegularChat">Regular Chat</AppButton>
  </div>
</template>

<script lang="ts">
import { computed, defineComponent } from 'vue'
import AppSkeleton from '@/components/common/AppSkeleton.vue'
import AppErrorBox from '@/components/common/AppErrorBox.vue'
import AppButton from '@/components/common/AppButton.vue'
import useAdminDispute from './dispute'
import { DisputeState } from '@/types/disputes'
// import AppLink from '@/components/common/AppLink.vue'
// import { getMessageTimeFormatted } from '@/components/helpers/timeFormatter'

export default defineComponent({
  components: {
    AppButton,
    AppSkeleton,
    AppErrorBox,
    // AppLink,
  },
  setup() {
    const { getAdminDispute, isError, isLoading, isLoaded, initDispute, joinDisputeChat, joinRegularChat } =
      useAdminDispute()
    const disputeMilestone = computed(() =>
      getAdminDispute?.value?.contractWithTask?.contract?.milestones?.find(
        ({ id }) => id === getAdminDispute?.value?.disputeAdminInfo?.milestoneId
      )
    )
    // const dateFormatted = computed(() => getMessageTimeFormatted(getAdminDispute.value?.disputeAdminInfo?.))

    const isDisputeOpen = computed(() => getAdminDispute.value?.disputeAdminInfo?.state === DisputeState.OPEN)
    const isDisputeClosed = computed(() => getAdminDispute.value?.disputeAdminInfo?.state === DisputeState.CLOSED)
    const disputeStateText = computed(() => {
      if (isDisputeOpen.value) return 'open'
      if (isDisputeClosed.value) return 'closed'
      return 'no state'
    })
    const disputeStateClasses = computed(() => {
      if (isDisputeOpen.value) return '--new'
      if (isDisputeClosed.value) return '--closed'
      return ''
    })

    const adminText = computed(() => {
      if (
        getAdminDispute.value?.disputeAdminInfo?.isAdminInChat &&
        getAdminDispute.value?.disputeAdminInfo?.joinedDisputeChat
      )
        return 'me'
      if (getAdminDispute.value?.disputeAdminInfo?.isAdminInChat) return 'other admin'
      return 'no admin'
    })
    const adminClasses = computed(() => {
      if (!getAdminDispute.value?.disputeAdminInfo?.isAdminInChat) return '--not-selected'
      return ''
    })

    return {
      getAdminDispute,
      disputeMilestone,
      disputeStateText,
      adminText,
      disputeStateClasses,
      adminClasses,
      isLoaded,
      isLoading,
      isError,
      initDispute,
      joinDisputeChat,
      joinRegularChat,
    }
  },
})
</script>

<style lang="scss" scoped>
@import '@/assets/styles/views/marketer/admin/dispute/DisputeProject.scss';
</style>
