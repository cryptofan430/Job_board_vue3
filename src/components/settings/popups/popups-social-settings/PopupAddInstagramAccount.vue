<template>
  <div class="popup">
    <div class="popup-content">
      <div class="popup-header" :class="{ '--justify-flex-end': !isAccountSelected }">
        <button v-if="isAccountSelected" class="back-button" @click="selectAccount(null)">
          <AppIcon name="back" :color="variables.cPrimary500" />
          <span class="back-content">Back</span>
        </button>

        <AppBackButton
          v-if="!isAccountSelected"
          button-text="Back"
          :back-route="{ name: $route.meta.backRoute }"
          class="popup-back-button"
        />
        <AppCloseButton class="popup-close-button" @click="closePopup" />
      </div>

      <div v-if="!isAccountSelected" class="list-step-wrapper">
        <h3 v-if="instagramAccounts.length || isLoading" class="popup-title">
          Which accounts you want to add to your profile?
        </h3>

        <h3 v-else-if="instagramAccounts.length === 0 && isLoaded" class="popup-title --error">
          This Facebook account has no Instagram accounts connected
        </h3>

        <AppErrorBox v-if="isError" @clicked="loadInstagramAccounts">accounts</AppErrorBox>

        <AppSkeleton v-else-if="isLoading" />

        <ul v-else-if="instagramAccounts.length && isLoaded" class="social-list">
          <template v-for="account in instagramAccounts" :key="account.platformId">
            <li class="social-item">
              <p class="social-name">@{{ account.username }}</p>

              <AppButton size="sm" :disabled="account.accountLinked" @click="selectAccount(account)">{{
                account.accountLinked ? 'Added' : 'Add'
              }}</AppButton>
            </li>
          </template>
        </ul>
      </div>

      <div v-else class="tags-step-wrapper">
        <h3 class="popup-title">Add tags for account to describe it’s content.</h3>
        <p class="additional-info">Please, select at least 1 tag and at most 2 tags from list.</p>

        <AppAutoComplete
          v-model="tagList"
          tall
          label-text="Tags"
          input-id="instagram-tags"
          :max-items="2"
          :options="tagsData"
        />

        <AppInputError v-if="tagsError.length">{{ tagsError }}</AppInputError>

        <AppButton
          class="add-account-button"
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
import AppAutoComplete from '@/components/common/AppAutocomplete.vue'
import AppCloseButton from '@/components/common/AppCloseButton.vue'
import AppRequestErrorPopup from '@/components/common/AppRequestErrorPopup.vue'
import AppInputError from '@/components/common/AppInputError.vue'
import AppButton from '@/components/common/AppButton.vue'
import AppIcon from '@/components/common/AppIcon.vue'
import AppSkeleton from '@/components/common/AppSkeleton.vue'
import AppErrorBox from '@/components/common/AppErrorBox.vue'
import AppBackButton from '@/components/common/AppBackButton.vue'
import variables from '@/assets/variables'
import useSettingsInstagramList from '../../social-media/settings-instagram-list'

export default defineComponent({
  name: 'PopupAddInstagramAccount',
  components: {
    AppCloseButton,
    AppButton,
    AppBackButton,
    AppSkeleton,
    AppErrorBox,
    AppIcon,
    AppAutoComplete,
    AppRequestErrorPopup,
    AppInputError,
  },
  setup() {
    const { tagsData } = useTagsStore()
    const { fetchTags } = useTagsController()

    fetchTags()

    const {
      closePopup,
      addAccount,
      apiErrorMessage,
      clearApiErrorMesage,
      tagList,
      tagsError,
      isAccountAddInProgress,
      selectAccount,
      isAccountSelected,
      instagramAccounts,
      isError,
      isLoading,
      isLoaded,
      loadInstagramAccounts,
    } = useSettingsInstagramList()

    setTimeout(loadInstagramAccounts)

    return {
      variables,
      isAccountSelected,
      tagsData,
      tagList,
      closePopup,
      addAccount,
      apiErrorMessage,
      clearApiErrorMesage,
      loadInstagramAccounts,
      tagsError,
      isAccountAddInProgress,
      selectAccount,
      instagramAccounts,
      isError,
      isLoading,
      isLoaded,
    }
  },
})
</script>

<style lang="scss" scoped>
@import '@/assets/styles/views/settings/popups/PopupAddSocialAccount';
</style>
