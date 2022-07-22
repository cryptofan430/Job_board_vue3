<template>
  <li class="attached-file-item">
    <a :download="file.filename" class="attached-file-link" target="_blank" :href="file.signedUrl">
      <AppIcon name="attach" size="md" color="currentColor" />

      <span class="attached-file-name">{{ file.filename }}</span>
    </a>
  </li>
</template>

<script lang="ts">
import { defineComponent, PropType } from 'vue'
import { SimpleAccessFile } from '@/types/file.model'
import AppIcon from '@/components/common/AppIcon.vue'

export default defineComponent({
  components: {
    AppIcon,
  },
  props: {
    file: {
      type: Object as PropType<SimpleAccessFile>,
      required: true,
    },
  },
})
</script>

<style lang="scss" scoped>
@import '@/assets/styles/components/chat/content/ChatAttachedFilesItem';
</style>
