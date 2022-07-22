<template>
  <section class="settings-help">
    <form class="ticket-form" @submit.prevent="submitTicketForm">
      <AppInputError v-if="ticketForm.isError">{{ ticketForm.getErrorMessage }}</AppInputError>
      <AppLabel>
        <p class="help-title">If you need help, send us a message.</p>
        <p class="help-info">Please, describe your problem.</p>
        <AppTextarea v-model="description.value" :error="description.isError" />
        <AppInputError v-if="description.isError">{{ description.getErrorMessage }}</AppInputError>
      </AppLabel>
      <AppButton :disabled="isCreatingTicket" :is-loading="isCreatingTicket" type="submit">Send message</AppButton>
    </form>

    <div class="mobile-send-message">
      <AppButton :disabled="isCreatingTicket" :is-loading="isCreatingTicket" type="button" @click="submitTicketForm"
        >Send message</AppButton
      >
    </div>

    <AppSkeleton v-if="isLoading" class="tickets-state" />
    <AppErrorBox v-else-if="isError" class="tickets-state" @clicked="refetchTickets">tickets</AppErrorBox>

    <SettingsTickets v-else-if="getSettingsTickets?.length" />
    <AppEmptyBox v-else>You have opened no tickets</AppEmptyBox>
  </section>
</template>

<script lang="ts">
import { defineComponent, toRefs } from 'vue'
import AppButton from '@/components/common/AppButton.vue'
import AppLabel from '@/components/common/AppLabel.vue'
import AppTextarea from '@/components/common/AppTextarea.vue'
import AppSkeleton from '@/components/common/AppSkeleton.vue'
import AppErrorBox from '@/components/common/AppErrorBox.vue'
import AppEmptyBox from '@/components/common/AppEmptyBox.vue'
import SettingsTickets from '@/components/settings/help/SettingsTickets.vue'
import useSettingsTickets from '@/components/settings/help/settings-tickets'
import AppInputError from '@/components/common/AppInputError.vue'

export default defineComponent({
  name: 'SettingsHelp',
  components: {
    AppLabel,
    AppTextarea,
    AppButton,
    SettingsTickets,
    AppInputError,
    AppSkeleton,
    AppErrorBox,
    AppEmptyBox,
  },
  setup() {
    const {
      getSettingsTickets,
      isLoaded,
      isLoading,
      isError,
      isCreatingTicket,
      ticketForm,
      refetchTickets,
      submitTicketForm,
    } = useSettingsTickets()

    refetchTickets()

    const { description } = toRefs(ticketForm.fieldSet)

    return {
      getSettingsTickets,
      description,
      isCreatingTicket,
      ticketForm,
      isLoading,
      isLoaded,
      isError,
      submitTicketForm,
      refetchTickets,
    }
  },
})
</script>

<style lang="scss" scoped>
@import '@/assets/styles/views/settings/SettingsHelp';
</style>
