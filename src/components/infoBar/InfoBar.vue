<template>
  <transition-group v-if="getNewAnnouncements.length" tag="ul" name="list" mode="in-out">
    <li v-for="announcement in getNewAnnouncements" :key="announcement.id" class="info-bar-container">
      <p class="content-text">{{ announcement.message }}</p>
      <button class="icon-button" @click="closeAnnouncement(announcement.id)">
        <AppIcon name="close" :color="variables.cGrey000" />
      </button>
    </li>
  </transition-group>
</template>

<script lang="ts">
import { defineComponent } from 'vue'
import AppIcon from '@/components/common/AppIcon.vue'
import useAnnouncements from '@/components/infoBar/announcements'
import variables from '@/assets/variables'
import useAllAnnouncementsStore from '@/store/announcements'

export default defineComponent({
  name: 'AppInfoBar',
  components: {
    AppIcon,
  },
  setup() {
    const { setAllAnnouncements } = useAllAnnouncementsStore()
    const { getNewAnnouncements, checkAnnouncements } = useAnnouncements()

    const closeAnnouncement = (id: string) => {
      setAllAnnouncements(id)
      checkAnnouncements()
    }

    return { variables, getNewAnnouncements, closeAnnouncement }
  },
})
</script>

<style lang="scss" scoped>
@import '@/assets/styles/views/infoBar/InfoBar';
</style>
