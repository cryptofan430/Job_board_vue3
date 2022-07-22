<template>
  <footer class="footer" :class="footerClasses">
    <div class="footer-content-wrapper">
      <div class="info-wrapper">
        <div class="logo-container">
          <AppIcon name="logotype" />
        </div>
        <div class="logo-sm-container">
          <AppIcon name="logotype" size="sm" />
        </div>
        <!-- <AppIcon name="logotype" size="sm" /> -->

        <div class="owner-and-links">
          <span class="owner">Rafał Bednarczuk Software</span>

          <div class="links">
            <router-link id="footer-first-focusable" class="privacy-policy-link" to="/privacy-policy"
              >Privacy Policy</router-link
            >

            <router-link class="terms-of-use-link" to="/terms-of-use">Terms of Use</router-link>
          </div>
        </div>
      </div>

      <div class="contact-us">
        <div class="title-wrapper">
          <span class="title">Contact us</span>
        </div>

        <div class="mail-wrapper">
          <div class="icon-wrapper">
            <AppIcon name="mail" :color="variables.cGrey300" />
          </div>
          <span class="mail">contact@freelanceinfluencer.xyz</span>
        </div>
        <div class="location-wrapper">
          <div class="icon-wrapper">
            <AppIcon name="location" :color="variables.cGrey300" />
          </div>
          <span class="location">Werbkowice, Piłsudzkiego Józefa 29, 22-550 Poland</span>
        </div>
      </div>
      <div class="links-mobile">
        <router-link id="footer-first-focusable" class="privacy-policy-link" to="/privacy-policy"
          >Privacy Policy</router-link
        >

        <router-link class="terms-of-use-link" to="/terms-of-use">Terms of Use</router-link>
      </div>
    </div>
  </footer>
</template>

<script lang="ts">
import { computed, defineComponent } from 'vue'
import AppIcon from '../common/AppIcon.vue'
import variables from '@/assets/variables'
import { getIsMobilePhone } from '../helpers/dom'

export default defineComponent({
  name: 'AppFooter',
  components: { AppIcon },
  setup() {
    const isMobilePhone = getIsMobilePhone()
    const footerClasses = computed(() => {
      const mobileClasses = isMobilePhone.value ? 'footer-mobile' : ''
      return `${mobileClasses}`
    })
    return { footerClasses, variables }
  },
})
</script>

<style lang="scss" scoped>
@import '@/assets/styles/components/layout/AppFooter';
</style>
