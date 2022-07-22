<template>
  <div class="milestone">
    <div class="milestone-header">
      <div class="milestone-name-wrapper">
        <p class="name">
          {{ milestone.title }}
        </p>

        <div class="disputes-menu" @focusin="preventClose" @focusout="triggerClose">
          <div class="dispute-context-menu">
            <AppDottedButton @click="toggleContextMenu" />
            <AppContextMenu v-if="contextMenuOpen" class="disputes-context-menu">
              <AppContextMenuItem :disabled="!milestoneState.isSecured">Open&nbsp;Dispute</AppContextMenuItem>
            </AppContextMenu>
          </div>
        </div>
      </div>

      <p class="payment">
        {{ currencySign }}{{ milestone.budget.value }}
        {{ milestoneState.isSecured ? 'funded' : milestoneState.isReleased ? 'paid' : 'left' }}
      </p>
    </div>
    <p v-if="milestone.disputeId && !isDisputeClosed" class="disputes-message --warning">Dispute is open</p>

    <p class="content">
      {{ milestone.description }}
    </p>

    <p v-if="milestone.disputeId" class="mobile-disputes-message --warning">Dispute is open</p>
  </div>
</template>

<script lang="ts">
import { computed, defineComponent, ref, PropType } from 'vue'
import { getCurrencySign } from '@/components/helpers/currencyFormatter'
import { ContractMilestonePublicInfo } from '@/types/contract.model'
import AppContextMenu from '@/components/common/AppContextMenu.vue'
import AppContextMenuItem from '@/components/common/AppContextMenuItem.vue'
import AppDottedButton from '@/components/common/AppDottedButton.vue'
import { extractMilestoneState } from '@/components/helpers/milestones'
import { DisputeState } from '@/types/disputes'

export default defineComponent({
  components: {
    AppContextMenu,
    AppDottedButton,
    AppContextMenuItem,
  },
  props: {
    milestone: {
      type: Object as PropType<ContractMilestonePublicInfo>,
      required: true,
    },
  },
  emits: ['open-dispute'],
  setup(props, { emit }) {
    const currencySign = computed(() => getCurrencySign(props.milestone.budget.currency))
    const milestoneState = computed(() => extractMilestoneState(props.milestone))

    const contextMenuOpen = ref(false)
    let timer: number | null = null

    const toggleContextMenu = () => {
      contextMenuOpen.value = !contextMenuOpen.value
    }
    const triggerOpen = () => {
      if (timer) {
        clearTimeout(timer)
        timer = null
      }
      contextMenuOpen.value = true
    }
    const triggerClose = () => {
      if (timer) clearTimeout(timer)
      timer = setTimeout(() => {
        contextMenuOpen.value = false
      })
    }
    const preventClose = () => {
      if (timer) {
        clearTimeout(timer)
        timer = null
      }
    }
    const isDisputeClosed = computed(() => props.milestone.disputeState === DisputeState.CLOSED)

    const closePopupImmediate = () => {
      if (timer) {
        clearTimeout(timer)
        timer = null
      }
      contextMenuOpen.value = false
    }

    const openDispute = () => {
      closePopupImmediate()
      emit('open-dispute')
    }

    return {
      contextMenuOpen,
      milestoneState,
      currencySign,
      isDisputeClosed,
      toggleContextMenu,
      triggerOpen,
      preventClose,
      closePopupImmediate,
      triggerClose,
      openDispute,
    }
  },
})
</script>
<style lang="scss" scoped>
@import '@/assets/styles/views/influencer/contract-management/MilestoneItem';
</style>
