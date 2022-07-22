<template>
  <div class="popup">
    <div class="popup-content">
      <div class="popup-header --justify-flex-end">
        <AppBackButton button-text="Back" :back-route="{ name: $route.meta.backRoute }" class="popup-back-button" />
        <AppCloseButton class="popup-close-button" @click="closePopup" />
      </div>

      <div v-if="isLoading" class="unloaded-container">
        <AppSkeleton />
      </div>
      <AppErrorBox v-else-if="isError" @clicked="tryFetchProposal">proposal</AppErrorBox>

      <template v-else>
        <template v-if="isStepOne">
          <p class="message">Please, leave your review. It will help other marketers!</p>
          <form class="review-form" @submit.prevent>
            <p class="behavior-review">What is your work experience with this person? Are you satisfied?</p>
            <AppTextarea v-model="description.value" class="popup-textarea" :error="description.isError" />
            <AppInputError v-if="description.isError">
              {{ description.getErrorMessage }}
            </AppInputError>

            <div v-if="hasSocialMediaAccountsAttached" class="account-card">
              <p class="rate-text">Please, mark influencer’s social media you worked with:</p>
              <div
                v-for="instagramAccount in accounts.fieldSet.instagram.fieldSets"
                :key="instagramAccount.fieldSet.id"
                class="review-account"
              >
                <AppCheckbox v-model="instagramAccount.fieldSet.isSelected.value" class="account-checkbox" />
                <AccountCard
                  :icon="'instagram'"
                  :account="instagramAccount.fieldSet.username.value"
                  :tag-tist="instagramAccount.fieldSet.tags.value"
                  :link="`/insights/instagram/${instagramAccount.fieldSet.id.value}`"
                  class="popup-account-card"
                  size="sm"
                ></AccountCard>
              </div>

              <div
                v-for="twitchAccount in accounts.fieldSet.twitch.fieldSets"
                :key="twitchAccount.fieldSet.id"
                class="review-account"
              >
                <AppCheckbox v-model="twitchAccount.fieldSet.isSelected.value" class="account-checkbox" />
                <AccountCard
                  :icon="'twitch'"
                  :account="twitchAccount.fieldSet.username.value"
                  :tag-tist="twitchAccount.fieldSet.tags.value"
                  :link="`/insights/twitch/${twitchAccount.fieldSet.id.value}`"
                  class="popup-account-card"
                  size="sm"
                ></AccountCard>
              </div>

              <div
                v-for="tikTokAccount in accounts.fieldSet.tiktok.fieldSets"
                :key="tikTokAccount.fieldSet.id"
                class="review-account"
              >
                <AppCheckbox v-model="tikTokAccount.fieldSet.isSelected.value" class="account-checkbox" />
                <AccountCard
                  :icon="'tiktok'"
                  :account="tikTokAccount.fieldSet.username.value"
                  :tag-tist="tikTokAccount.fieldSet.tags.value"
                  :link="`/insights/tiktok/${tikTokAccount.fieldSet.id.value}`"
                  class="popup-account-card"
                  size="sm"
                ></AccountCard>
              </div>

              <div
                v-for="youtubeAccount in accounts.fieldSet.youtube.fieldSets"
                :key="youtubeAccount.fieldSet.id"
                class="review-account"
              >
                <AppCheckbox v-model="youtubeAccount.fieldSet.isSelected.value" class="account-checkbox" />
                <AccountCard
                  :icon="'youtube'"
                  :account="youtubeAccount.fieldSet.username.value"
                  :tag-tist="youtubeAccount.fieldSet.tags.value"
                  :link="`/insights/youtube/${youtubeAccount.fieldSet.id.value}`"
                  class="popup-account-card"
                  size="sm"
                ></AccountCard>
              </div>
            </div>

            <div v-else class="rating-wrapper">
              <p class="rate-text">
                Please, rate influencer’s behavior from 1 to 5<span class="rate-hint"
                  >.(where 1 is ineffective and 5 is perfect)</span
                >:
              </p>
              <div>
                <AppRating v-model="userRating.value" :error="userRating.isError" class="popup-rating" />
              </div>
              <AppInputError v-if="userRating.isError" class="rating-error">
                {{ userRating.getErrorMessage }}
              </AppInputError>
            </div>

            <AppButton
              v-if="hasSocialMediaAccountsAttached"
              :disabled="isWaitingResponse"
              :is-loading="isWaitingResponse"
              class="review-button action-button"
              type="submit"
              @click="submitFirstStep"
              >Next Step</AppButton
            >
            <AppButton
              v-else
              :disabled="isWaitingResponse"
              :is-loading="isWaitingResponse"
              class="review-button action-button"
              type="submit"
              @click="submitForm"
              >Add a review</AppButton
            >
          </form>
        </template>

        <template v-if="isStepTwo && hasSelectedSocialAccounts">
          <p class="message-long">
            Please, rate influencer’s social media from 1 to 5<span class="rate-hint"
              >.(where 1 is ineffective and 5 is perfect)</span
            >:
          </p>
          <form class="review-form" @submit.prevent="submitForm">
            <div v-if="hasSocialMediaAccountsAttached" class="account-card">
              <template
                v-for="instagramAccount in accounts.fieldSet.instagram.fieldSets"
                :key="instagramAccount.fieldSet.id"
              >
                <div v-if="instagramAccount.fieldSet.isSelected.value" class="account-rating">
                  <AccountCard
                    :icon="'instagram'"
                    :account="instagramAccount.fieldSet.username.value"
                    :tag-tist="instagramAccount.fieldSet.tags.value"
                    :link="`/insights/instagram/${instagramAccount.fieldSet.id.value}`"
                    class="popup-account-card-full"
                    size="sm"
                  ></AccountCard>

                  <AppRating
                    v-model="instagramAccount.fieldSet.rating.value"
                    :error="instagramAccount.fieldSet.rating.isError"
                    text-left="Ineffective"
                    class="rating-form-item popup-rating"
                  ></AppRating>

                  <AppInputError v-if="instagramAccount.fieldSet.rating.isError" class="rating-error">
                    {{ instagramAccount.fieldSet.rating.getErrorMessage }}
                  </AppInputError>
                </div>
              </template>

              <template v-for="twitchAccount in accounts.fieldSet.twitch.fieldSets" :key="twitchAccount.fieldSet.id">
                <div v-if="twitchAccount.fieldSet.isSelected.value" class="account-rating">
                  <AccountCard
                    :icon="'twitch'"
                    :account="twitchAccount.fieldSet.username.value"
                    :tag-tist="twitchAccount.fieldSet.tags.value"
                    :link="`/insights/twitch/${twitchAccount.fieldSet.id.value}`"
                    class="popup-account-card-full"
                    size="sm"
                  ></AccountCard>

                  <AppRating
                    v-model="twitchAccount.fieldSet.rating.value"
                    :error="twitchAccount.fieldSet.rating.isError"
                    text-left="Ineffective"
                    class="rating-form-item popup-rating"
                  ></AppRating>

                  <AppInputError v-if="twitchAccount.fieldSet.rating.isError" class="rating-error">
                    {{ twitchAccount.fieldSet.rating.getErrorMessage }}
                  </AppInputError>
                </div>
              </template>

              <template v-for="tikTokAccount in accounts.fieldSet.tiktok.fieldSets" :key="tikTokAccount.fieldSet.id">
                <div v-if="tikTokAccount.fieldSet.isSelected.value" class="account-rating">
                  <AccountCard
                    :icon="'tiktok'"
                    :account="tikTokAccount.fieldSet.username.value"
                    :tag-tist="tikTokAccount.fieldSet.tags.value"
                    :link="`/insights/toktok/${tikTokAccount.fieldSet.id.value}`"
                    class="popup-account-card-full"
                    size="sm"
                  ></AccountCard>

                  <AppRating
                    v-model="tikTokAccount.fieldSet.rating.value"
                    :error="tikTokAccount.fieldSet.rating.isError"
                    text-left="Ineffective"
                    class="rating-form-item popup-rating"
                  ></AppRating>

                  <AppInputError v-if="tikTokAccount.fieldSet.rating.isError" class="rating-error">
                    {{ tikTokAccount.fieldSet.rating.getErrorMessage }}
                  </AppInputError>
                </div>
              </template>

              <template v-for="youtubeAccount in accounts.fieldSet.youtube.fieldSets" :key="youtubeAccount.fieldSet.id">
                <div v-if="youtubeAccount.fieldSet.isSelected.value" class="account-rating">
                  <AccountCard
                    :icon="'youtube'"
                    :account="youtubeAccount.fieldSet.username.value"
                    :tag-tist="youtubeAccount.fieldSet.tags.value"
                    :link="`/insights/youtube/${youtubeAccount.fieldSet.id.value}`"
                    class="popup-account-card-full"
                    size="sm"
                  ></AccountCard>

                  <AppRating
                    v-model="youtubeAccount.fieldSet.rating.value"
                    :error="youtubeAccount.fieldSet.rating.isError"
                    text-left="Ineffective"
                    class="rating-form-item popup-rating"
                  ></AppRating>

                  <AppInputError v-if="youtubeAccount.fieldSet.rating.isError" class="rating-error">
                    {{ youtubeAccount.fieldSet.rating.getErrorMessage }}
                  </AppInputError>
                </div>
              </template>
            </div>

            <div class="action-buttons-wrapper">
              <AppButton
                type="button"
                outlined
                class="action-button-half hidden-desktop-button"
                @click="goBackToStepOne"
                >Go back</AppButton
              >
              <AppButton :disabled="isWaitingResponse" class="review-button action-button-half" type="submit"
                >Add a review</AppButton
              >
            </div>
          </form>
        </template>
        <template v-if="isStepTwo && !hasSelectedSocialAccounts">
          <form class="review-form" @submit.prevent="submitForm">
            <div>
              <p class="rate-influencer-text">
                Please, rate influencer's behavior from 1 to 5<span class="rate-hint"
                  >.(where 1 is ineffective and 5 is perfect)</span
                >:
              </p>
              <AppRating v-model="userRating.value" :error="userRating.isError" />
              <AppInputError v-if="userRating.isError" class="rating-error">
                {{ userRating.getErrorMessage }}
              </AppInputError>
            </div>

            <div class="action-buttons-wrapper">
              <AppButton
                type="button"
                outlined
                class="action-button-half hidden-desktop-button"
                @click="goBackToStepOne"
                >Go back</AppButton
              >

              <AppButton
                :disabled="isWaitingResponse"
                :is-loading="isWaitingResponse"
                class="review-button action-button-half"
                type="submit"
                >Add a review</AppButton
              >
            </div>
          </form>
        </template>
      </template>
    </div>
  </div>
</template>

<script lang="ts">
import { defineComponent, toRefs, watchEffect } from 'vue'
import AppRating from '@/components/common/AppRating.vue'
import AppTextarea from '@/components/common/AppTextarea.vue'
import AppButton from '@/components/common/AppButton.vue'
import AppCloseButton from '@/components/common/AppCloseButton.vue'
import AppCheckbox from '@/components/common/AppCheckbox.vue'
import AppInputError from '@/components/common/AppInputError.vue'
import AppSkeleton from '@/components/common/AppSkeleton.vue'
import AppBackButton from '@/components/common/AppBackButton.vue'
import AppErrorBox from '@/components/common/AppErrorBox.vue'
import AccountCard from '@/components/cards/AccountCard.vue'
import useInfluencerReviewPopup from '@/components/marketer/task/task-contract/review-popup'
import { setTitle } from '@/components/helpers/dom'

export default defineComponent({
  name: 'InfluencerReviewPopup',
  components: {
    AppRating,
    AccountCard,
    AppButton,
    AppTextarea,
    AppCloseButton,
    AppInputError,
    AppSkeleton,
    AppErrorBox,
    AppCheckbox,
    AppBackButton,
  },
  setup() {
    const {
      influencerReviewForm,
      isLoading,
      isLoaded,
      isError,
      isStepTwo,
      marketerTaskProposal,
      isWaitingResponse,
      hasSocialMediaAccountsAttached,
      hasSelectedSocialAccounts,
      isStepOne,
      closePopup,
      tryFetchProposal,
      observeContractChanges,
      submitFirstStep,
      goBackToStepOne,
      submitForm,
    } = useInfluencerReviewPopup()

    observeContractChanges()

    const { description, userRating, accounts } = toRefs(influencerReviewForm.fieldSet)

    watchEffect(() => {
      if (marketerTaskProposal.value?.influencerInfo) {
        setTitle(
          'Freelance Influence | Review Influencer ' +
            marketerTaskProposal.value.influencerInfo.firstName +
            ' ' +
            marketerTaskProposal.value.influencerInfo.lastName
        )
      }
    })

    return {
      accounts,
      isStepTwo,
      isLoading,
      isLoaded,
      isError,
      marketerTaskProposal,
      hasSocialMediaAccountsAttached,
      hasSelectedSocialAccounts,
      isWaitingResponse,
      description,
      userRating,
      isStepOne,
      closePopup,
      tryFetchProposal,
      submitFirstStep,
      goBackToStepOne,
      submitForm,
    }
  },
})
</script>

<style lang="scss" scoped>
@import '@/assets/styles/views/marketer/task/InfluencerReviewPopup.scss';
</style>
