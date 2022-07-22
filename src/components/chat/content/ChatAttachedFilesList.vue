<template>
  <ul v-if="files?.length" class="chat-attached-files">
    <ChatAttachedFilesItem v-for="file of files" :key="file.id" :file="file" />
  </ul>
</template>

<script lang="ts">
import { defineComponent, PropType } from 'vue'
import ChatAttachedFilesItem from '@/components/chat/content/ChatAttachedFilesItem.vue'
import { SimpleAccessFile } from '@/types/file.model'

export default defineComponent({
  components: {
    ChatAttachedFilesItem,
  },
  props: {
    files: {
      type: Array as PropType<Array<SimpleAccessFile>>,
      required: false,
    },
  },
})
</script>

<style lang="scss" scoped>
@import '@/assets/styles/components/chat/content/ChatAttachedFilesList';
</style>
