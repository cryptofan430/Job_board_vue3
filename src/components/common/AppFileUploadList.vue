<template>
  <ul v-if="fileEntries.length || simpleFiles?.length" class="file-upload-attachments">
    <template v-if="simpleFiles?.length">
      <li
        v-for="simpleFile of simpleFiles"
        :key="simpleFile.id"
        class="file-upload-attachment attachment-icon-uploaded"
      >
        <div class="attachment-icon">
          <AppIcon name="attach" size="sm" :color="variables.cPrimary500" />
        </div>
        <span class="attached-file-title">{{ simpleFile.filename }}</span>
        <button class="file-entry-close-btn" type="button" @click="removeSimpleFile(simpleFile)" />
      </li>
    </template>

    <li
      v-for="fileEntry of fileEntries"
      :key="fileEntry.id"
      class="file-upload-attachment"
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
import { FileUploadPayload, SimpleAccessFile } from '@/types/file.model'

export default defineComponent({
  name: 'AppFileUploadList',
  components: {
    AppIcon,
    AppCompletionProgres,
  },
  props: {
    simpleFiles: {
      type: Array as PropType<Array<SimpleAccessFile>>,
      required: false,
    },
    fileEntries: {
      type: Array as PropType<Array<FileUploadPayload>>,
      required: true,
    },
  },
  emits: ['remove-file-entry', 'remove-simple-file'],
  setup(_, { emit }) {
    const removeFileEntry = (fileEntry: FileUploadPayload) => {
      emit('remove-file-entry', fileEntry)
    }
    const removeSimpleFile = (file: SimpleAccessFile) => {
      emit('remove-simple-file', file)
    }

    return {
      variables,
      removeFileEntry,
      removeSimpleFile,
    }
  },
})
</script>

<style lang="scss" scoped>
@import '@/assets/styles/components/common/AppFileUploadList';
</style>
