<template>
  <section class="settings-taxInfo">
    <TaxInfoNav @send-nav="navHandle" />
    <router-view />
  </section>
</template>

<script lang="ts">
import { computed, defineComponent, toRefs } from 'vue'
import TaxInfoNav from '@/components/settings/taxInfo/TaxInfoNav.vue'
import useSettingsTaxInfo from '@/components/settings/settings-taxInfo'
import { COUNTRIES } from '@/components/helpers/countries'

export default defineComponent({
  name: 'SettingsTaxInfo',
  components: {
    TaxInfoNav,
  },
  emits: ['nav-send'],
  setup(_, { emit }) {
    const {
      influencerForm,
      marketerForm,
      isInfluencerWaitingResponse,
      isMarketerWaitingResponse,
      submitMarketerForm,
      submitInfluencerForm,
    } = useSettingsTaxInfo()

    const {
      country: influencerLocation,
      streetAddress: influencerAddress,
      city: influencerCity,
      zipCode: influencerPostalCode,
      vatId: influencerVatNumber,
    } = toRefs(influencerForm.fieldSet)

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

    const updateInfluencerLocation = (locationOption: typeof countriesForDropdown[number]) => {
      influencerLocation.value.value = locationOption.slug
    }

    const updateMarketerLocation = (locationOption: typeof countriesForDropdown[number]) => {
      marketerLocation.value.value = locationOption.slug
    }

    const selectedInfluencerLocation = computed(() =>
      countriesForDropdown.find((country) => country.slug === influencerLocation.value.value)
    )

    const selectedMarketerLocation = computed(() =>
      countriesForDropdown.find((country) => country.slug === marketerLocation.value.value)
    )

    const navHandle = (e: string) => {
      emit('nav-send', e)
    }

    return {
      influencerLocation,
      influencerAddress,
      influencerCity,
      influencerPostalCode,
      influencerVatNumber,
      marketerLocation,
      marketerAddress,
      marketerCity,
      marketerPostalCode,
      marketerVatNumber,
      isInfluencerWaitingResponse,
      isMarketerWaitingResponse,
      navHandle,
      submitMarketerForm,
      submitInfluencerForm,
      updateInfluencerLocation,
      updateMarketerLocation,
      selectedInfluencerLocation,
      selectedMarketerLocation,
    }
  },
})
</script>

<style lang="scss" scoped>
@import '@/assets/styles/views/settings/SettingsTaxInfo';
</style>
