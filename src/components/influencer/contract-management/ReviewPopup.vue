<template>
  <div class="popup">
    <div class="popup-content">
      <div class="popup-header --justify-flex-end">
        <AppBackButton button-text="Back" :back-route="{ name: $route.meta.backRoute }" class="popup-back-button" />
        <AppCloseButton class="popup-close-button" @click="closePopup" />
      </div>
      <p class="message">Please, leave your review. It will help other influencers!</p>
      <form class="review-form" @submit.prevent="submitMarketerReview">
        <p class="behavior-review">What is your work experience with this person? Are you satisfied?</p>
        <AppTextarea v-model="description.value" class="popup-textarea" :error="description.isError" />
        <AppInputError v-if="description.isError">
          {{ description.getErrorMessage }}
        </AppInputError>
        <p class="rate-text">
          Please, rate marketer’s behavior from 1 to 5<span class="rating-hint">
            (where 1 is unpleasant and 5 is perfect):</span
          >
        </p>

        <div class="rating-wrapper">
          <AppRating v-model="userRating.value" class="popup-rating" :error="userRating.isError" />
          <AppInputError v-if="userRating.isError" class="rating-error">
            {{ userRating.getErrorMessage }}
          </AppInputError>
        </div>

        <AppButton
          :disabled="isWaitingResponse"
          :is-loading="isWaitingResponse"
          class="review-button action-button"
          type="submit"
          >Add a review</AppButton
        >
      </form>
    </div>
  </div>
</template>

<script lang="ts">
import { defineComponent, toRefs } from 'vue'
import AppRating from '@/components/common/AppRating.vue'
import AppTextarea from '@/components/common/AppTextarea.vue'
import AppButton from '@/components/common/AppButton.vue'
import AppCloseButton from '@/components/common/AppCloseButton.vue'
import AppInputError from '@/components/common/AppInputError.vue'
import AppBackButton from '@/components/common/AppBackButton.vue'
import useContractManagementReview from '@/components/influencer/contract-management/contract-management-review'

export default defineComponent({
  name: 'MarketerReviewPopup',
  components: {
    AppRating,
    AppButton,
    AppTextarea,
    AppCloseButton,
    AppInputError,
    AppBackButton,
  },
  setup() {
    const { contractManagementForm, isWaitingResponse, submitMarketerReview, closePopup } =
      useContractManagementReview()

    const { description, userRating } = toRefs(contractManagementForm.fieldSet)

    return {
      isWaitingResponse,
      description,
      userRating,
      submitMarketerReview,
      closePopup,
    }
  },
})
</script>

<style lang="scss" scoped>
@import '@/assets/styles/views/influencer/contract-management/ReviewPopup';
</style>
