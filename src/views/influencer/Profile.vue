<template>
  <main class="profile">
    <div class="wrapper">
      <ProfileTopBar />
      <div class="for-mobile">
        <ProfileSidebar />
      </div>
      <ProfileReferences />
    </div>
    <div class="for-desktop">
      <ProfileSidebar />
    </div>
  </main>
</template>

<script lang="ts">
import { defineComponent } from 'vue'
import ProfileTopBar from '@/components/influencer/profile/ProfileTopBar.vue'
import ProfileSidebar from '@/components/influencer/profile/ProfileSidebar.vue'
import ProfileReferences from '@/components/influencer/profile/ProfileReferences.vue'

export default defineComponent({
  name: 'Profile',
  components: {
    ProfileTopBar,
    ProfileSidebar,
    ProfileReferences,
  },
})
</script>

<style lang="scss" scoped>
@import '@/assets/styles/views/influencer/profile/Profile';
</style>
