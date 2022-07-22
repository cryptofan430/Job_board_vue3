<template>
  <div class="popup">
    <div class="popup-content">
      <div class="popup-header --justify-flex-end">
        <AppBackButton button-text="Back" :back-route="{ name: $route.meta.backRoute }" class="popup-back-button" />
        <AppCloseButton class="popup-close-button" @click="closePopup" />
      </div>

      <div class="tags-step-wrapper">
        <h3 class="popup-title">Add tags for account to describe it’s content.</h3>
        <p class="additional-info">Please, select at least 1 tag and at most 2 tags from list.</p>

        <AppAutoComplete
          v-model="tagList"
          tall
          label-text="Tags"
          input-id="twitch-tags"
          :max-items="2"
          :options="tagsData"
        />

        <AppInputError v-if="tagsError.length">{{ tagsError }}</AppInputError>

        <AppButton
          class="add-account-button action-button"
          :is-loading="isAccountAddInProgress"
          :disabled="isAccountAddInProgress"
          @click="addAccount"
          >Save</AppButton
        >
      </div>
    </div>
  </div>

  <AppRequestErrorPopup v-if="apiErrorMessage.length" :error-text="apiErrorMessage" @close="clearApiErrorMesage" />
</template>

<script lang="ts">
import { defineComponent } from 'vue'
import useTagsStore from '@/store/tags'
import useTagsController from '@/middleware/controllers/useTagsController'
import AppCloseButton from '@/components/common/AppCloseButton.vue'
import AppButton from '@/components/common/AppButton.vue'
import AppBackButton from '@/components/common/AppBackButton.vue'
import AppAutoComplete from '@/components/common/AppAutocomplete.vue'
import AppInputError from '@/components/common/AppInputError.vue'
import AppRequestErrorPopup from '@/components/common/AppRequestErrorPopup.vue'
import useSettingsTwitchList from '../../social-media/settings-twitch-list'

export default defineComponent({
  name: 'PopupAddTwitchAccount',
  components: {
    AppCloseButton,
    AppAutoComplete,
    AppButton,
    AppRequestErrorPopup,
    AppInputError,
    AppBackButton,
  },
  setup() {
    const { tagsData } = useTagsStore()
    const { fetchTags } = useTagsController()

    fetchTags()

    const { closePopup, addAccount, apiErrorMessage, clearApiErrorMesage, tagList, tagsError, isAccountAddInProgress } =
      useSettingsTwitchList()

    return {
      tagsData,
      tagList,
      closePopup,
      addAccount,
      apiErrorMessage,
      clearApiErrorMesage,
      tagsError,
      isAccountAddInProgress,
    }
  },
})
</script>

<style lang="scss" scoped>
@import '@/assets/styles/views/settings/popups/PopupAddSocialAccount';
</style>
