<template>
  <ul v-if="fileEntries.length" class="send-message-attachments">
    <li
      v-for="fileEntry of fileEntries"
      :key="fileEntry.id"
      class="send-message-attachment"
      :class="{ 'attachment-icon-uploaded': fileEntry.progress === null }"
    >
      <div v-if="fileEntry.progress !== null" class="progress-icon">
        <AppCompletionProgres :percent="fileEntry.progress" />
      </div>

      <div v-if="fileEntry.progress === null" class="attachment-icon">
        <AppIcon name="attach" size="sm" :color="variables.cPrimary500" />
      </div>
      <span class="attached-file-title">{{ fileEntry.file.name }}</span>
      <button class="file-entry-close-btn" type="button" @click="removeFileEntry(fileEntry)" />
    </li>
  </ul>
</template>

<script lang="ts">
import { defineComponent, PropType } from 'vue'
import AppCompletionProgres from '@/components/common/AppCompletionProgress.vue'
import variables from '@/assets/variables'
import AppIcon from '@/components/common/AppIcon.vue'
import { FileUploadPayload } from '@/types/file.model'

export default defineComponent({
  components: {
    AppIcon,
    AppCompletionProgres,
  },
  props: {
    fileEntries: {
      type: Array as PropType<Array<FileUploadPayload>>,
      required: true,
    },
  },
  emits: ['remove-file-entry'],
  setup(_, { emit }) {
    const removeFileEntry = (fileEntry: FileUploadPayload) => {
      emit('remove-file-entry', fileEntry)
    }

    return {
      variables,
      removeFileEntry,
    }
  },
})
</script>

<style lang="scss" scoped>
@import '@/assets/styles/components/chat/panel/SendMessageAttachments';
</style>
