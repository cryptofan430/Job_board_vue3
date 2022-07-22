<template>
  <form class="tickets-filters-form" @submit.prevent="updateParamsValue" @reset.prevent="resetFilters">
    <div v-if="filterIcon" class="icon-btn-container">
      <AppIcon v-if="filterIcon" name="filter" :color="variables.cGrey900" />
      <h2 class="filters-header">Filter By:</h2>
    </div>
    <h2 v-if="!filterIcon" class="filters-header">Filter By:</h2>
    <div class="filter-wrapper">
      <div class="name">Status</div>

      <div class="checkbox-container">
        <AppLabel class="ticket-option-label">
          <AppCheckbox class="ticket-status" :model-value="newValue" @update:model-value="updateNewValue"></AppCheckbox>

          New
        </AppLabel>

        <AppLabel class="ticket-option-label">
          <AppCheckbox
            class="ticket-status"
            :model-value="inProgressValue"
            @update:model-value="updateInProgressValue"
          ></AppCheckbox>

          In progress
        </AppLabel>

        <AppLabel class="ticket-option-label">
          <AppCheckbox class="ticket-status" :model-value="myValue" @update:model-value="updateMyValue"></AppCheckbox>

          My
        </AppLabel>
      </div>
    </div>

    <div class="buttons-wrapper">
      <AppButton type="submit" class="button-apply">Apply</AppButton>

      <AppButton outlined type="reset">Clean</AppButton>
    </div>
  </form>
</template>

<script lang="ts">
import { defineComponent, ref, watch } from 'vue'
import AppLabel from '@/components/common/AppLabel.vue'
import AppIcon from '@/components/common/AppIcon.vue'
import AppButton from '@/components/common/AppButton.vue'
import AppCheckbox from '@/components/common/AppCheckbox.vue'
import useAdminTickets from './admin-tickets'
import { TicketState } from '@/types/tickets'
import variables from '@/assets/variables'

export default defineComponent({
  components: {
    AppLabel,
    AppButton,
    AppCheckbox,
    AppIcon,
  },
  props: {
    filterIcon: {
      type: Boolean,
      default: false,
    },
  },
  setup(props) {
    const { ticketsFilters, updateFilters } = useAdminTickets()
    const newValue = ref(false)
    const inProgressValue = ref(false)
    const myValue = ref(false)
    console.log(props.filterIcon)

    watch(
      ticketsFilters,
      (newFilters) => {
        if (newFilters.haveIJoined) {
          myValue.value = true
        }
        if (!newFilters.haveIJoined) {
          myValue.value = false
        }
        if (!newFilters.isAdminInChat) {
          newValue.value = false
        }
        if (newFilters.isAdminInChat === false) {
          newValue.value = true
        }
        if (newFilters.state === TicketState.OPEN && newFilters.isAdminInChat) {
          inProgressValue.value = true
        } else {
          inProgressValue.value = false
        }
      },
      {
        immediate: true,
      }
    )

    const updateParamsValue = () => {
      let state: TicketState | undefined = undefined
      let haveIJoined: boolean | undefined = undefined
      let isAdminInChat: boolean | undefined | string = undefined

      if (newValue.value) {
        isAdminInChat = 'false'
        state = TicketState.OPEN
      }
      if (inProgressValue.value) {
        isAdminInChat = true
        state = TicketState.OPEN
      }
      if (myValue.value) {
        haveIJoined = true
      }

      updateFilters({
        state,
        haveIJoined,
        isAdminInChat,
      })
    }

    const updateNewValue = (isNew: boolean) => {
      newValue.value = isNew
      if (isNew) {
        inProgressValue.value = false
      }
    }

    const updateInProgressValue = (isInProgress: boolean) => {
      inProgressValue.value = isInProgress
      if (isInProgress) {
        newValue.value = false
      }
    }

    const updateMyValue = (isMy: boolean) => {
      myValue.value = isMy
    }

    const resetFilters = () => {
      updateFilters({
        state: undefined,
        haveIJoined: undefined,
        isAdminInChat: undefined,
        page: 1,
      })
    }

    return {
      updateNewValue,
      updateInProgressValue,
      updateMyValue,
      updateParamsValue,
      resetFilters,
      newValue,
      inProgressValue,
      myValue,
      variables,
    }
  },
})
</script>

<style lang="scss" scoped>
@import '@/assets/styles/views/marketer/admin/tickets/TicketsFilters';
</style>
