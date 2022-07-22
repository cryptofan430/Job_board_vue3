<template>
  <div class="chat" :class="chatClasses" :style="chatStyles">
    <ChatSidebar :active="$router.currentRoute.value.meta.isChatDialog" />
    <router-view :active="$router.currentRoute.value.meta.isChatDialog" />
  </div>
</template>

<script lang="ts">
import { defineComponent, ref, onMounted, computed, onUnmounted } from 'vue'
import ChatSidebar from '@/components/chat/sidebar/ChatSidebar.vue'
import useChatSidebar from '@/components/chat/sidebar/chat-sidebar'
import { getIsMobilePhone } from '@/components/helpers/dom'
import { useRoute } from 'vue-router'

export default defineComponent({
  name: 'Chat',
  components: { ChatSidebar },

  setup() {
    const { initSidebarChats } = useChatSidebar()
    const isMobile = getIsMobilePhone()
    const route = useRoute()
    const chatHeight = ref(window.innerHeight)

    const listenWindowSize = () => {
      chatHeight.value = window.innerHeight
    }

    initSidebarChats()

    onMounted(() => {
      window.addEventListener('resize', listenWindowSize)
    })

    onUnmounted(() => {
      window.removeEventListener('resize', listenWindowSize)
    })

    const chatClasses = computed(() => {
      const mobileDialogClasses = isMobile.value && route.meta?.isChatDialog ? 'mobile-dialog-chat' : null

      return `${mobileDialogClasses}`
    })

    const chatStyles = computed(() => {
      if (route.meta?.isChatDialog && isMobile.value) return `max-height: ${chatHeight.value - 1}px`
      if (route.meta?.isChatDialog) return `max-height: calc(${chatHeight.value - 1}px - 5rem); overflow: hidden`
      return ''
    })

    return { chatStyles, chatClasses }
  },
})
</script>

<style lang="scss" scoped>
@import '@/assets/styles/views/Chat';
</style>
