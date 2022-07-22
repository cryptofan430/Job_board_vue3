<template>
  <div class="empty-chat">
    <AppEmptyBox v-if="isLoaded && getSidebarChats?.length"> Please select a dialogue from list </AppEmptyBox>
  </div>
</template>

<script lang="ts">
import { defineComponent } from 'vue'
import AppEmptyBox from '@/components/common/AppEmptyBox.vue'
import useChatSidebar from '../sidebar/chat-sidebar'

export default defineComponent({
  name: 'EmptyChat',
  components: {
    AppEmptyBox,
  },
  setup() {
    const { isLoaded, getSidebarChats } = useChatSidebar()

    return {
      getSidebarChats,
      isLoaded,
    }
  },
})
</script>

<style lang="scss" scoped>
@import '@/assets/styles/components/chat/content/EmptyChat.scss';
</style>
