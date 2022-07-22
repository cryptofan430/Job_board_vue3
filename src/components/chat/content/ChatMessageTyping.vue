<template>
  <p class="chat-message-typing"></p>
</template>

<script lang="ts">
import { defineComponent, PropType } from 'vue'

export default defineComponent({
  name: 'ChatMessageTyping',
  props: {
    users: {
      type: Array as PropType<Array<string>>,
      required: false,
    },
  },
})
</script>

<style lang="scss" scoped>
@import '@/assets/styles/components/chat/content/ChatMessageTyping';
</style>
