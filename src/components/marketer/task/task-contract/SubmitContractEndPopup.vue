<template>
  <div v-if="getMarketerTaskContract" class="popup">
    <div class="popup-content">
      <div class="popup-header --justify-flex-end">
        <AppBackButton button-text="Back" :back-route="{ name: $route.meta.backRoute }" class="popup-back-button" />
        <AppCloseButton class="popup-close-button" @click="onClose" />
      </div>
      <p class="message">Are you sure you want to end contract?</p>
      <div class="actions-container">
        <AppLink class="first-action action-button-half" size="md" :to="{ name: 'MarketerTaskSingleContract' }">
          Keep it
        </AppLink>
        <AppButton class="action-button-half" size="md" outlined @click="endContract"> End it </AppButton>
      </div>
    </div>
  </div>
</template>

<script lang="ts">
import { defineComponent, watch, watchEffect } from 'vue'
import { useRouter } from 'vue-router'
import AppCloseButton from '@/components/common/AppCloseButton.vue'
import AppLink from '@/components/common/AppLink.vue'
import AppButton from '@/components/common/AppButton.vue'
import AppBackButton from '@/components/common/AppBackButton.vue'
import useTaskContract from './task-contract'
import { setTitle } from '@/components/helpers/dom'

export default defineComponent({
  components: {
    AppBackButton,
    AppCloseButton,
    AppButton,
    AppLink,
  },
  setup() {
    const router = useRouter()
    const { getMarketerTaskContract, hasSecuredMilestones, doEndContract } = useTaskContract()

    watch(hasSecuredMilestones, (value) => {
      if (value) router.push({ name: 'MarketerTaskSingleContract' })
    })

    const onClose = () => {
      router.push({ name: 'MarketerTaskSingleContract' })
    }

    const endContract = async () => {
      await doEndContract()
      onClose()
    }

    watchEffect(() => {
      if (getMarketerTaskContract.value?.task) {
        setTitle('Freelance Influence | End Contract Of Task ' + getMarketerTaskContract.value.task.title)
      }
    })

    return {
      getMarketerTaskContract,
      endContract,
      onClose,
    }
  },
})
</script>

<style lang="scss" scoped>
@import '@/assets/styles/views/marketer/task/SubmitContractEndPopup';
</style>
