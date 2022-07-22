<template>
  <div v-if="getTaskContract" class="contract-details">
    <div class="project-info">
      <p class="name">
        {{ getTaskContract.task.title }}
      </p>

      <p class="type">Contract</p>

      <p class="marketer-title">Marketer</p>

      <div class="marketer-info">
        <AppAvatar :img-url="getTaskContract?.userStateInfo?.avatarSimpleAccessFile?.signedUrl" size="md" />

        <p class="marketer-name">
          {{ getTaskContract?.userStateInfo?.firstName }} {{ getTaskContract?.userStateInfo?.lastName }}
        </p>

        <AppButton :disabled="isBusy" size="sm" class="chat-button" @click="goToChat"> Chat </AppButton>
      </div>
    </div>

    <AppButton :disabled="isBusy" size="sm" class="mobile-chat-button" @click="goToChat">Open Chat </AppButton>

    <div class="milestones-container">
      <div class="milestones-info">
        <p class="milestones-count">Milestones: {{ getTaskContract.contract?.milestones?.length }}</p>

        <p class="milestones-payments">Payments: {{ currencySign }}{{ totalPayment }}</p>
      </div>

      <slot></slot>
    </div>

    <AppLink
      v-if="isShowLeaveReview"
      :disabled="isBusy"
      size="md"
      class="review-button"
      :to="{ name: 'ContactManagementReview' }"
      >Leave a review</AppLink
    >
  </div>
</template>

<script lang="ts">
import { computed, defineComponent } from 'vue'

import AppButton from '@/components/common/AppButton.vue'
import AppLink from '@/components/common/AppLink.vue'
import AppAvatar from '@/components/common/AppAvatar.vue'
import variables from '@/assets/variables'
import useInfluencerContractManagement from './contract-management'
import { getCurrencySign } from '@/components/helpers/currencyFormatter'

export default defineComponent({
  name: 'InfluencerContractManagement',
  components: {
    AppButton,
    AppLink,
    AppAvatar,
  },
  props: {
    isBusy: {
      type: Boolean,
      default: false,
    },
  },
  setup() {
    const { goToChat, getTaskContract } = useInfluencerContractManagement()
    const totalPayment = computed(() =>
      getTaskContract.value?.contract?.milestones.reduce((acc, milestone) => acc + milestone.budget.value, 0)
    )
    const firstMilestone = computed(() => getTaskContract.value?.contract.milestones?.[0])
    const currencySign = computed(() =>
      firstMilestone.value ? getCurrencySign(firstMilestone.value.budget.currency) : ''
    )

    const isShowLeaveReview = computed(() => {
      if (getTaskContract.value?.contract?.ended && !getTaskContract.value?.contract.marketerReviewed) {
        return true
      }
      return false
    })

    return {
      variables,
      totalPayment,
      currencySign,
      getTaskContract,
      isShowLeaveReview,
      goToChat,
    }
  },
})
</script>

<style lang="scss" scoped>
@import '@/assets/styles/views/influencer/contract-management/ContractDetails';
</style>
