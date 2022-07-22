<template>
  <div class="popup">
    <div class="popup-content">
      <AppBackButton button-text="Back" :back-route="{ name: $route.meta.backRoute }" class="popup-back-button" />
      <AppCloseButton class="popup-close-button" @click="onClose" />

      <h3 class="popup-title">Are you sure you want to withdraw a proposal?</h3>

      <div class="button-container">
        <AppButton class="popup-action-button action-button-half" @click="onClose">Keep it</AppButton>
        <AppButton class="action-button-half" outlined @click="withdrawProposal">Withdraw it</AppButton>
      </div>
    </div>
  </div>
</template>

<script lang="ts">
import { defineComponent } from 'vue'
import AppCloseButton from '@/components/common/AppCloseButton.vue'
import AppButton from '@/components/common/AppButton.vue'
import AppBackButton from '@/components/common/AppBackButton.vue'
import useInfluencerProposal from '@/components/influencer/proposal/proposal'
import { useRoute, useRouter } from 'vue-router'

export default defineComponent({
  name: 'PopupDeleteAccount',
  components: {
    AppCloseButton,
    AppButton,
    AppBackButton,
  },
  setup() {
    const router = useRouter()
    const route = useRoute()
    const { withdrawProposal } = useInfluencerProposal()
    const onClose = () => {
      router.push({ name: route.meta.backRoute as string })
    }

    return { withdrawProposal, onClose }
  },
})
</script>

<style lang="scss" scoped>
@import '@/assets/styles/views/influencer/proposal/WIthdrawProposalPopup.scss';
</style>
