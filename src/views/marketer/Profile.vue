<template>
  <main class="profile">
    <div class="wrapper">
      <ProfileTopBar />
      <ProfileReferences />
    </div>
  </main>
</template>

<script lang="ts">
import { defineComponent } from 'vue'
import ProfileTopBar from '@/components/marketer/profile/ProfileTopBar.vue'
import ProfileReferences from '@/components/marketer/profile/ProfileReferences.vue'

export default defineComponent({
  components: {
    ProfileTopBar,
    ProfileReferences,
  },
})
</script>

<style lang="scss" scoped>
@import '@/assets/styles/views/marketer/profile/Profile';
</style>
