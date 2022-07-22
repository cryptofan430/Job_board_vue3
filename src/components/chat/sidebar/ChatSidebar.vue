<template>
  <div class="chat-sidebar" :class="{ dialogslist: isActive, sidebarClasses }">
    <p v-if="isLoaded && !isMobilePopup && !getSidebarChats.length" class="chat-empty-sidebar">
      There are no dialogues yet
    </p>

    <template v-else>
      <ChatFilters v-if="!isMobilePopup" />
      <DialogsList />
    </template>
  </div>
</template>

<script lang="ts">
import { computed, defineComponent } from 'vue'
import DialogsList from '@/components/chat/sidebar/DialogsList.vue'
import ChatFilters from '@/components/chat/sidebar/ChatFilters.vue'
import useChatSidebar from './chat-sidebar'
import { getIsMobilePopup } from '@/components/helpers/dom'

export default defineComponent({
  name: 'TheSidebar',
  components: {
    DialogsList,
    ChatFilters,
  },
  props: {
    active: Boolean,
  },
  setup(props) {
    const { isLoaded, getSidebarChats } = useChatSidebar()
    const isMobilePopup = getIsMobilePopup()
    const sidebarClasses = computed(() => {
      const mobileClasses = isMobilePopup.value ? 'mobile-chat-popup-footer' : ''
      return `${mobileClasses}`
    })
    const isActive = computed(() => props.active)

    return { sidebarClasses, isMobilePopup, isLoaded, getSidebarChats, isActive }
  },
})
</script>

<style lang="scss" scoped>
@import '@/assets/styles/components/chat/sidebar/ChatSidebar';
</style>
