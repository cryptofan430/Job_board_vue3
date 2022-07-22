<template>
  <div class="marketer-content-wrapper">
    <form class="content-wrapper" @submit.prevent="submitMarketerForm">
      <AppLabel class="tax-residence-label">
        <p>Tax Residence</p>
        <p class="tax-residence-info">This address will be displayed on invoices.</p>
      </AppLabel>

      <AppLabel class="country-label" for="marketer-location"> Country </AppLabel>

      <AppDropdown
        class="country-dropdown"
        default-text="Choose your country"
        size="lg"
        tall
        icon="dropdown"
        input-id="marketer-location"
        :values="countriesForDropdown"
        :model-value="selectedMarketerLocation"
        @change="updateMarketerLocation"
      />

      <AppLabel>
        Address
        <AppInput v-model="marketerAddress.value" :error="marketerAddress.isError" />
      </AppLabel>

      <AppInputError v-if="marketerAddress.isError" class="tax-info-error">
        {{ marketerAddress.getErrorMessage }}
      </AppInputError>

      <AppLabel>
        City
        <AppInput v-model="marketerCity.value" :error="marketerCity.isError" />
      </AppLabel>

      <AppInputError v-if="marketerCity.isError" class="tax-info-error">
        {{ marketerCity.getErrorMessage }}
      </AppInputError>

      <AppLabel>
        Postal Code
        <AppInput v-model="marketerPostalCode.value" :error="marketerPostalCode.isError" />
      </AppLabel>

      <AppInputError v-if="marketerPostalCode.isError" class="tax-info-error">
        {{ marketerPostalCode.getErrorMessage }}
      </AppInputError>

      <AppLabel class="vat-number-label">
        <p>VAT number</p>
        <AppInput v-model="marketerVatNumber.value" :error="marketerVatNumber.isError" />
        <p class="vat-number-info">
          A VAT number is requested for all persons located in a country where Freelancer-Influencer supports VAT.
        </p>
      </AppLabel>

      <AppInputError v-if="marketerVatNumber.isError" class="tax-info-error">
        {{ marketerVatNumber.getErrorMessage }}
      </AppInputError>

      <AppInputError v-if="marketerForm.isError" class="tax-info-error">{{
        marketerForm.getErrorMessage
      }}</AppInputError>

      <AppButton type="submit" :disabled="isMarketerWaitingResponse" :is-loading="isMarketerWaitingResponse">
        Save changes
      </AppButton>
    </form>
    <div class="mobile-save-button">
      <AppButton
        :disabled="isMarketerWaitingResponse"
        :is-loading="isMarketerWaitingResponse"
        type="button"
        @click="submitMarketerForm"
      >
        Save changes
      </AppButton>
    </div>
  </div>
</template>

<script lang="ts">
import { computed, defineComponent, toRefs } from 'vue'
import AppInput from '@/components/common/AppInput.vue'
import AppLabel from '@/components/common/AppLabel.vue'
import AppDropdown from '@/components/common/AppDropdown.vue'
import AppButton from '@/components/common/AppButton.vue'
import AppInputError from '@/components/common/AppInputError.vue'
import { COUNTRIES } from '@/components/helpers/countries'
import useSettingsTaxInfo from '@/components/settings/settings-taxInfo'

export default defineComponent({
  components: {
    AppLabel,
    AppDropdown,
    AppButton,
    AppInput,
    AppInputError,
  },
  setup() {
    const { marketerForm, isMarketerWaitingResponse, submitMarketerForm } = useSettingsTaxInfo()

    const {
      country: marketerLocation,
      streetAddress: marketerAddress,
      city: marketerCity,
      zipCode: marketerPostalCode,
      vatId: marketerVatNumber,
    } = toRefs(marketerForm.fieldSet)

    const countriesForDropdown = COUNTRIES.map((country) => {
      return { title: country, slug: country }
    })

    const updateMarketerLocation = (locationOption: typeof countriesForDropdown[number]) => {
      marketerLocation.value.value = locationOption.slug
    }

    const selectedMarketerLocation = computed(() =>
      countriesForDropdown.find((country) => country.slug === marketerLocation.value.value)
    )

    return {
      marketerLocation,
      marketerAddress,
      marketerCity,
      marketerPostalCode,
      marketerVatNumber,
      isMarketerWaitingResponse,
      submitMarketerForm,
      updateMarketerLocation,
      selectedMarketerLocation,
      marketerForm,
      countriesForDropdown,
    }
  },
})
</script>

<style lang="scss" scoped>
@import '@/assets/styles/views/settings/taxInfo/MarketerTaxInfo';
</style>
