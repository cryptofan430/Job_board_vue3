<template>
  <div class="influencer-content-wrapper">
    <form class="content-wrapper" @submit.prevent="submitInfluencerForm">
      <AppLabel class="tax-residence-label">
        <p>Tax Residence</p>
        <p class="tax-residence-info">This address will be displayed on invoices.</p>
      </AppLabel>

      <AppLabel class="country-label" for="influencer-location"> Country </AppLabel>

      <AppDropdown
        class="country-dropdown"
        default-text="Choose your country"
        size="lg"
        tall
        icon="dropdown"
        input-id="influencer-location"
        :values="countriesForDropdown"
        :model-value="selectedInfluencerLocation"
        @change="updateInfluencerLocation"
      />

      <AppLabel>
        Address
        <AppInput v-model="influencerAddress.value" :error="influencerAddress.isError" />
      </AppLabel>

      <AppInputError v-if="influencerAddress.isError" class="tax-info-error">
        {{ influencerAddress.getErrorMessage }}
      </AppInputError>

      <AppLabel>
        City
        <AppInput v-model="influencerCity.value" :error="influencerCity.isError" />
      </AppLabel>

      <AppInputError v-if="influencerCity.isError" class="tax-info-error">
        {{ influencerCity.getErrorMessage }}
      </AppInputError>

      <AppLabel>
        Postal Code
        <AppInput v-model="influencerPostalCode.value" :error="influencerPostalCode.isError" />
      </AppLabel>

      <AppInputError v-if="influencerPostalCode.isError" class="tax-info-error">
        {{ influencerPostalCode.getErrorMessage }}
      </AppInputError>

      <AppLabel class="vat-number-label">
        <p>VAT number</p>
        <AppInput v-model="influencerVatNumber.value" :error="influencerVatNumber.isError" />
        <p class="vat-number-info">
          A VAT number is requested for all persons located in a country where Freelancer-Influencer supports VAT.
        </p>
      </AppLabel>

      <AppInputError v-if="influencerVatNumber.isError" class="tax-info-error">
        {{ influencerVatNumber.getErrorMessage }}
      </AppInputError>

      <AppInputError v-if="influencerForm.isError" class="tax-info-error">{{
        influencerForm.getErrorMessage
      }}</AppInputError>

      <AppButton type="submit" :disabled="isInfluencerWaitingResponse" :is-loading="isInfluencerWaitingResponse">
        Save changes
      </AppButton>
    </form>
    <div class="mobile-save-button">
      <AppButton
        type="button"
        :disabled="isInfluencerWaitingResponse"
        :is-loading="isInfluencerWaitingResponse"
        @click="submitInfluencerForm"
      >
        Save changes
      </AppButton>
    </div>
  </div>
</template>

<script lang="ts">
import { computed, defineComponent, toRefs } from 'vue'
import AppInput from '@/components/common/AppInput.vue'
import AppButton from '@/components/common/AppButton.vue'
import AppLabel from '@/components/common/AppLabel.vue'
import AppDropdown from '@/components/common/AppDropdown.vue'
import AppInputError from '@/components/common/AppInputError.vue'
import { COUNTRIES } from '@/components/helpers/countries'
import useSettingsTaxInfo from '@/components/settings/settings-taxInfo'

export default defineComponent({
  components: {
    AppInput,
    AppButton,
    AppLabel,
    AppDropdown,
    AppInputError,
  },
  setup() {
    const { influencerForm, isInfluencerWaitingResponse, submitInfluencerForm } = useSettingsTaxInfo()

    const {
      country: influencerLocation,
      streetAddress: influencerAddress,
      city: influencerCity,
      zipCode: influencerPostalCode,
      vatId: influencerVatNumber,
    } = toRefs(influencerForm.fieldSet)

    const countriesForDropdown = COUNTRIES.map((country) => {
      return { title: country, slug: country }
    })

    const updateInfluencerLocation = (locationOption: typeof countriesForDropdown[number]) => {
      influencerLocation.value.value = locationOption.slug
    }

    const selectedInfluencerLocation = computed(() =>
      countriesForDropdown.find((country) => country.slug === influencerLocation.value.value)
    )

    return {
      influencerLocation,
      influencerAddress,
      influencerCity,
      influencerPostalCode,
      influencerVatNumber,
      isInfluencerWaitingResponse,
      submitInfluencerForm,
      updateInfluencerLocation,
      selectedInfluencerLocation,
      influencerForm,
      countriesForDropdown,
    }
  },
})
</script>

<style lang="scss" scoped>
@import '@/assets/styles/views/settings/taxInfo/InfluencerTaxInfo';
</style>
