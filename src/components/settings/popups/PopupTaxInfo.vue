<template>
  <div class="popup">
    <div class="popup-content">
      <AppBackButton button-text="Back" :back-route="{ name: $route.meta.backRoute }" class="popup-back-button" />
      <AppCloseButton class="popup-close-button" @click="onClose" />

      <div class="dropdown-wrapper">
        <p class="country-text">Country</p>
        <AppDropdown
          class="popup-input"
          default-text="Choose your country"
          size="lg"
          tall
          icon="dropdown"
          :values="countriesForDropdown"
          @change="onCountryUpdate"
        />
      </div>

      <AppLabel class="adress-label">
        Adress
        <AppInput class="popup-input" />
      </AppLabel>

      <AppLabel>
        City
        <AppInput class="popup-input" />
      </AppLabel>

      <AppLabel>
        Postal code
        <AppInput class="popup-input" />
      </AppLabel>

      <AppLabel>
        VAT number
        <AppInput class="popup-input" />
      </AppLabel>

      <AppButton class="action-button">Save changes</AppButton>
    </div>
  </div>
</template>

<script lang="ts">
import { defineComponent } from 'vue'
import AppCloseButton from '@/components/common/AppCloseButton.vue'
import AppButton from '@/components/common/AppButton.vue'
import AppLabel from '@/components/common/AppLabel.vue'
import AppInput from '@/components/common/AppInput.vue'
import AppBackButton from '@/components/common/AppBackButton.vue'
import AppDropdown from '@/components/common/AppDropdown.vue'
import { COUNTRIES } from '@/components/helpers/countries'
import { useRoute, useRouter } from 'vue-router'

export default defineComponent({
  name: 'PopupTaxInfo',
  components: {
    AppCloseButton,
    AppButton,
    AppLabel,
    AppInput,
    AppBackButton,
    AppDropdown,
  },
  setup() {
    const router = useRouter()
    const route = useRoute()

    const onClose = () => {
      router.push({ name: route.meta.backRoute })
    }
    const onCountryUpdate = (country: string) => {
      console.log(country)
    }

    const countriesForDropdown = COUNTRIES.map((country) => {
      return { title: country, slug: country }
    })

    return {
      onClose,
      countriesForDropdown,
      onCountryUpdate,
    }
  },
})
</script>

<style lang="scss" scoped>
@import '@/assets/styles/views/settings/popups/PopupTaxInfo';
</style>
