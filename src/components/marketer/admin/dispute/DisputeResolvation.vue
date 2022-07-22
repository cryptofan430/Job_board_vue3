<template>
  <form class="dispute-resolvation" @submit.prevent="resolveDispute">
    <legend>
      <h2 class="resolvation-header">Resolvation</h2>
    </legend>
    <AppLabel class="money-influencer-text">
      This amount of money goes to influencer:
      <div class="budget-input-container" :data-currency="currencySign">
        <AppInput
          v-model="amountToInfluencer.value"
          :error="amountToInfluencer.isError"
          :decimals="2"
          type="number"
          size="sm"
          responsive
        />
      </div>
    </AppLabel>
    <AppInputError v-if="amountToInfluencer.isError">{{ amountToInfluencer.getErrorMessage }}</AppInputError>
    <AppLabel class="explanation">
      Please, explain your decision
      <AppTextarea v-model="description.value" :error="description.isError" />
    </AppLabel>
    <AppInputError v-if="description.isError">{{ description.getErrorMessage }}</AppInputError>
    <AppButton type="submit" class="resolve-dispute-btn">Resolve Dispute</AppButton>
  </form>
</template>

<script lang="ts">
import { defineComponent, toRefs } from 'vue'
import AppInput from '@/components/common/AppInput.vue'
import AppTextarea from '@/components/common/AppTextarea.vue'
import AppLabel from '@/components/common/AppLabel.vue'
import AppButton from '@/components/common/AppButton.vue'
import AppInputError from '@/components/common/AppInputError.vue'
import useAdminDispute from './dispute'

export default defineComponent({
  components: {
    AppInput,
    AppTextarea,
    AppLabel,
    AppInputError,
    AppButton,
  },
  setup() {
    const { resolveDisputeForm, resolveDispute } = useAdminDispute()
    const { amountToInfluencer, description } = toRefs(resolveDisputeForm.fieldSet)
    const currencySign = '$'

    return {
      amountToInfluencer,
      description,
      currencySign,
      resolveDispute,
    }
  },
})
</script>

<style lang="scss" scoped>
@import '@/assets/styles/views/marketer/admin/dispute/DisputeResolvation.scss';
</style>
