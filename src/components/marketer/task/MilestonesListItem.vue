<template>
  <div class="milestones-list-item">
    <div class="text-content">
      <div class="text-wrapper">
        <div class="milestone-name-block">
          <h5 class="name">{{ milestone.title }}</h5>
          <div class="disputes-menu" @focusin="preventClose" @focusout="triggerClose">
            <div class="dispute-context-menu">
              <AppDottedButton @click="toggleContextMenu" />
              <AppContextMenu v-if="contextMenuOpen" class="disputes-context-menu">
                <AppContextMenuItem
                  :disabled="!milestoneState.isSecured && milestone.disputeId == null"
                  @click="openDispute"
                  >Open&nbsp;Dispute</AppContextMenuItem
                >
              </AppContextMenu>
            </div>
          </div>
        </div>
        <div class="mobile-money-info">
          <p>
            {{ currencySign }}{{ milestone.budget?.value }}
            {{ milestoneState.isSecured ? 'founded' : milestoneState.isReleased ? 'paid' : 'left' }}
          </p>
        </div>
        <p v-if="milestone.disputeId && !isDisputeClosed" class="disputes-message --warning">Dispute is open</p>
        <p class="description">{{ milestone.description }}</p>
      </div>
      <p class="money-info">
        {{ currencySign }}{{ milestone.budget?.value }}
        {{ milestoneState.isSecured ? 'funded' : milestoneState.isReleased ? 'paid' : 'left' }}
      </p>
    </div>

    <div v-if="!milestoneState.isReleased && actionsVisible" class="buttons-container">
      <AppButton v-if="milestoneState.isSecured" :disabled="actionsDisabled" @click="releaseMilestone"
        >Release milestone</AppButton
      >

      <AppButton v-if="milestoneState.isNotSecured" :disabled="actionsDisabled" @click="secureMilestone"
        >Secure milestone</AppButton
      >

      <AppButton v-if="milestoneState.isNotSecured" outlined :disabled="actionsDisabled" @click="deleteMilestone"
        >Delete milestone</AppButton
      >
    </div>

    <div class="mobile-buttons-container">
      <AppButton v-if="milestoneState.isSecured" :disabled="actionsDisabled" @click="releaseMilestone"
        >Release</AppButton
      >

      <AppButton v-if="milestoneState.isNotSecured" :disabled="actionsDisabled" @click="secureMilestone"
        >Secure</AppButton
      >

      <AppButton v-if="milestoneState.isNotSecured" outlined :disabled="actionsDisabled" @click="deleteMilestone"
        >Delete</AppButton
      >
    </div>
  </div>
</template>

<script lang="ts">
import { computed, defineComponent, ref, PropType } from 'vue'
import { ContractMilestonePublicInfo } from '@/types/contract.model'
import { getCurrencySign } from '@/components/helpers/currencyFormatter'
import { extractMilestoneState } from '@/components/helpers/milestones'
import AppButton from '@/components/common/AppButton.vue'
import AppDottedButton from '@/components/common/AppDottedButton.vue'
import AppContextMenu from '@/components/common/AppContextMenu.vue'
import AppContextMenuItem from '@/components/common/AppContextMenuItem.vue'
import { DisputeState } from '@/types/disputes'

export default defineComponent({
  name: 'ContractMilestonesListItem',
  components: {
    AppButton,
    AppDottedButton,
    AppContextMenu,
    AppContextMenuItem,
  },
  props: {
    milestone: {
      type: Object as PropType<ContractMilestonePublicInfo>,
      required: true,
    },
    actionsDisabled: {
      type: Boolean,
      default: false,
    },
    actionsVisible: {
      type: Boolean,
      default: true,
    },
  },
  emits: ['secure-milestone', 'release-milestone', 'delete-milestone', 'open-dispute'],
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

    const isDisputeClosed = computed(() => props.milestone.disputeState === DisputeState.CLOSED)

    const secureMilestone = () => emit('secure-milestone')
    const releaseMilestone = () => emit('release-milestone')
    const deleteMilestone = () => emit('delete-milestone')

    return {
      contextMenuOpen,
      milestoneState,
      isDisputeClosed,
      currencySign,
      secureMilestone,
      releaseMilestone,
      deleteMilestone,
      toggleContextMenu,
      triggerOpen,
      triggerClose,
      preventClose,
      closePopupImmediate,
      openDispute,
    }
  },
})
</script>

<style lang="scss" scoped>
@import '@/assets/styles/views/marketer/task/MilestonesListItem';
</style>
