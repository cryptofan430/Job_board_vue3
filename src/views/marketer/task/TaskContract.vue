<template>
  <main class="task-contract" :class="rootClassess">
    <template v-if="!isMobilePopup">
      <div class="task-contract-wrapper">
        <AppErrorBox v-if="isError" @clicked="initTaskContract">contract</AppErrorBox>

        <AppSkeleton v-else-if="isLoading" />

        <template v-else-if="getMarketerTaskContract">
          <div class="header">
            <div class="mobile-buttons-wrapper">
              <div v-if="!getMarketerTaskContract.contract.ended">
                <AppLink :to="`/m/tasks/${taskId}/contracts/${contractId}/add-milestones`">Add milestones</AppLink>
                <AppLink
                  outlined
                  class="button"
                  :to="{
                    name: 'MarketerTaskSingleContractSubmitEnd',
                  }"
                  :disabled="hasSecuredMilestones || !getMarketerTaskContract.contract.accepted || isExecutingAction"
                  >End contract</AppLink
                >
              </div>
            </div>
            <div class="task-box">
              <div class="task-header">
                <div class="task-info">
                  <h1 class="task-name">{{ getMarketerTaskContract.task.title }}</h1>
                  <p class="contract-text">Contract</p>
                </div>
                <div class="influencer-info">
                  <h4 class="influencer-text">Influencer</h4>
                  <div class="influencer-wrapper">
                    <AppAvatar
                      :img-url="getMarketerTaskContract.userStateInfo?.avatarSimpleAccessFile?.signedUrl"
                      status="away"
                      size="md"
                    />
                    <span class="influencer-name">
                      {{ getMarketerTaskContract.userStateInfo?.firstName }}
                      {{ getMarketerTaskContract.userStateInfo?.lastName }}
                    </span>
                    <AppButton class="chat-button" size="sm" :disabled="isExecutingAction" @click="goToChat"
                      >Chat</AppButton
                    >
                  </div>
                </div>
              </div>

              <div v-if="!getMarketerTaskContract.contract.ended" class="buttons-wrapper">
                <AppLink :to="`/m/tasks/${taskId}/contracts/${contractId}/add-milestones`">Add milestones</AppLink>
                <AppLink
                  outlined
                  class="button"
                  :to="{
                    name: 'MarketerTaskSingleContractSubmitEnd',
                  }"
                  :disabled="hasSecuredMilestones || !getMarketerTaskContract.contract.accepted || isExecutingAction"
                  >End contract</AppLink
                >
              </div>
            </div>

            <div class="mobile-chat-button">
              <AppButton size="sm" :disabled="isExecutingAction" @click="goToChat">Open Chat</AppButton>
            </div>

            <div class="milestones-list">
              <div class="milestones-list-header">
                <h4 class="milestones-counter">
                  Milestones:
                  {{ getMarketerTaskContract.contract.milestones.length }}
                </h4>
                <h4 class="payments-counter">Payments: ${{ totalPayments }}</h4>
              </div>

              <MilestonesListItem
                v-for="milestone in milestones"
                :key="milestone.id"
                class="milestones-list-item"
                :milestone="milestone"
                :actions-disabled="isExecutingAction"
                :actions-visible="!getMarketerTaskContract?.contract.ended"
                @secure-milestone="secureMilestone(milestone)"
                @release-milestone="releaseMilestone(milestone)"
                @delete-milestone="doDeleteMilestone(milestone)"
                @open-dispute="doOpenDispute(milestone)"
              />
            </div>
          </div>
        </template>

        <AppLink
          v-if="isShowLeaveReview"
          :disabled="isExecutingAction"
          size="md"
          class="review-button"
          :to="{ name: 'MarketerTaskReviewInfluencer' }"
          >Leave a review</AppLink
        >
      </div>
    </template>
    <router-view></router-view>
  </main>
</template>

<script lang="ts">
import { computed, defineComponent, watch } from 'vue'
import AppErrorBox from '@/components/common/AppErrorBox.vue'
import AppSkeleton from '@/components/common/AppSkeleton.vue'
import AppLink from '@/components/common/AppLink.vue'
import AppButton from '@/components/common/AppButton.vue'
import AppAvatar from '@/components/common/AppAvatar.vue'
import MilestonesListItem from '@/components/marketer/task/MilestonesListItem.vue'
import useMarketerTaskContract from '@/components/marketer/task/task-contract/task-contract'
import { getIsMobilePopup, setTitle } from '@/components/helpers/dom'

export default defineComponent({
  name: 'TaskContract',
  components: {
    AppErrorBox,
    AppSkeleton,
    AppLink,
    MilestonesListItem,
    AppAvatar,
    AppButton,
  },
  setup() {
    const {
      hasSecuredMilestones,
      isExecutingAction,
      getMarketerTaskContract,
      isShowLeaveReview,
      isLoading,
      isError,
      initTaskContract,
      secureMilestone,
      releaseMilestone,
      doDeleteMilestone,
      doOpenDispute,
      goToChat,
    } = useMarketerTaskContract()

    const isMobilePopup = getIsMobilePopup()

    const taskId = computed(() => getMarketerTaskContract.value?.task.id)
    const contractId = computed(() => getMarketerTaskContract.value?.contract.id)
    const milestones = computed(() => getMarketerTaskContract.value?.contract.milestones || [])
    const totalPayments = computed(() => milestones.value?.reduce((acc, milestone) => acc + milestone.budget.value, 0))
    const rootClassess = computed(() => {
      const mobilePopupClassess = isMobilePopup.value ? 'task-contract-mobile-popup' : ''

      return `${mobilePopupClassess}`
    })

    initTaskContract()
    watch(
      getMarketerTaskContract,
      (task) => {
        if (task?.task) setTitle('Freelance Influence | Contract For Task ' + task.task.title)
      },
      { immediate: true }
    )

    return {
      rootClassess,
      isMobilePopup,
      hasSecuredMilestones,
      getMarketerTaskContract,
      isExecutingAction,
      milestones,
      isLoading,
      isError,
      taskId,
      contractId,
      totalPayments,
      isShowLeaveReview,
      initTaskContract,
      secureMilestone,
      releaseMilestone,
      doDeleteMilestone,
      doOpenDispute,
      goToChat,
    }
  },
})
</script>

<style lang="scss" scoped>
@import '@/assets/styles/views/marketer/task/TaskContract';
</style>
