<template>
  <div class="top-bar">
    <div class="profile-info">
      <div class="mobile-avatar">
        <AppAvatar size="xl" status="online" />
        <p class="mobile-name">Name Surname</p>
      </div>

      <div class="profile-info-wrapper">
        <p class="name">Name Surname</p>
        <div class="profile-info-row">
          <AppIcon name="location" :color="variables.cPrimary500" />
          <p class="profile-info-content">Location</p>
        </div>

        <div class="profile-info-row">
          <AppIcon name="rating" :color="variables.cPrimary500" />
          <p class="profile-info-content">4.8/5</p>
        </div>

        <div class="profile-info-row">
          <AppIcon name="money-earned" :color="variables.cPrimary500" />
          <p class="profile-info-content">$100k+</p>
        </div>
      </div>
    </div>

    <div class="about-me">
      <h2 class="about-me-title">Company's name</h2>

      <p class="about-me-content">
        Lorem ipsum dolor sit amet, consectetur adipiscing elit. Phasellus vehicula, diam sit amet scelerisque euismod,
        metus quam tincidunt mi, in fermentum leo nisl eget metus. Duis blandit facilisis eros id pharetra.
      </p>
    </div>
  </div>
</template>

<script lang="ts">
import { defineComponent } from 'vue'
import AppAvatar from '@/components/common/AppAvatar.vue'
import AppIcon from '@/components/common/AppIcon.vue'
import variables from '@/assets/variables'

export default defineComponent({
  name: 'ProfileTopBar',
  components: {
    AppAvatar,
    AppIcon,
  },
  setup() {
    return { variables }
  },
})
</script>

<style lang="scss" scoped>
@import '@/assets/styles/views/marketer/profile/ProfileTopBar';
</style>
