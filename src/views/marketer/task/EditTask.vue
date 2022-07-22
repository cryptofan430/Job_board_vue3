<template>
  <main class="edit-task">
    <h1 class="title">Task editing</h1>

    <section class="form-wrapper">
      <AppErrorBox v-if="showLoadingError" @clicked="loadTask">task to edit</AppErrorBox>

      <AppSkeleton v-else-if="isLoading" />

      <form v-else-if="getSelectedTask" class="form" novalidate @submit.prevent="submitTaskEditForm">
        <div class="info-fields-wrapper">
          <div class="title-wrapper">
            <AppLabel for="title">Change the name of your project</AppLabel>
            <AppInput
              id="title"
              v-model="title.value"
              name="title"
              :error="title.isError"
              @update:modelValue="title.setNormalState"
            />
            <AppInputError v-if="title.isError">{{ title.getErrorMessage }}</AppInputError>
          </div>

          <div class="description-wrapper">
            <AppLabel for="description">Change the description of the project</AppLabel>
            <span class="description-info">Include as many details as possible</span>
            <AppTextarea
              id="description"
              v-model="description.value"
              size="lg"
              name="description"
              :error="description.isError"
              @update:modelValue="description.setNormalState"
            />
            <AppInputError v-if="description.isError">{{ description.getErrorMessage }}</AppInputError>
          </div>

          <div class="file-upload">
            <div class="file-input-container">
              <input id="file-input" class="file-input" type="file" multiple @change="handleFilesInput" />

              <AppLabel class="file-label" for="file-input">
                <AppIcon name="attach" size="sm" :color="variables.cGrey000" />

                <span class="file-name">Attach File</span>

                <span class="file-info">up to 10 MB</span>
              </AppLabel>
            </div>
            <AppFileUploadList
              :simple-files="getSelectedTask.files"
              :file-entries="getFileUploadEntries"
              @remove-file-entry="removeFileEntry"
              @remove-simple-file="removeSimpleFile"
            />
            <AppInputError v-if="filesErrorText">{{ filesErrorText }}</AppInputError>
          </div>

          <div class="budget-wrapper">
            <AppLabel for="budget">Your project's budget</AppLabel>
            <div class="budget-input-container" data-currency="$">
              <AppInput
                id="budget"
                v-model="budget.value"
                name="budget"
                type="number"
                :decimals="2"
                :error="budget.isError"
                @update:modelValue="budget.setNormalState"
              />
            </div>
            <AppInputError v-if="budget.isError">{{ budget.getErrorMessage }}</AppInputError>
          </div>

          <AppButton
            type="submit"
            :disabled="
              waitingForResponse ||
              !getSelectedTask.addedByMe ||
              getSelectedTask.hasContractCreated ||
              !isAllFilesUploaded
            "
            :is-loading="waitingForResponse"
            >Save changes</AppButton
          >
        </div>

        <div class="platform-wrapper">
          <h3 class="platforms-text">Choose relevant platforms:</h3>

          <AppLabel v-for="platform in platforms" :key="platform.value" size="sm">
            <AppCheckbox
              v-model="platformsField.value"
              :value="platform.value"
              @update:modelValue="platformsField.setNormalState"
            />
            {{ platform.name }}
          </AppLabel>
          <AppInputError v-if="platformsField.isError">{{ platformsField.getErrorMessage }}</AppInputError>
        </div>
      </form>
      <div class="mobile-button">
        <AppButton
          type="button"
          :disabled="
            waitingForResponse ||
            !getSelectedTask.addedByMe ||
            getSelectedTask.hasContractCreated ||
            !isAllFilesUploaded
          "
          :is-loading="waitingForResponse"
          @click="submitTaskEditForm"
          >Save changes</AppButton
        >
      </div>
    </section>

    <AppRequestErrorPopup v-if="responseErrorMessage.length" redirect-url="/" :error-text="responseErrorMessage" />
  </main>
</template>

<script lang="ts">
import { computed, defineComponent, onUnmounted, ref, toRefs, watch } from 'vue'
import { useRouter } from 'vue-router'
import AppLabel from '@/components/common/AppLabel.vue'
import AppInput from '@/components/common/AppInput.vue'
import AppCheckbox from '@/components/common/AppCheckbox.vue'
import AppButton from '@/components/common/AppButton.vue'
import AppTextarea from '@/components/common/AppTextarea.vue'
import AppSkeleton from '@/components/common/AppSkeleton.vue'
import AppErrorBox from '@/components/common/AppErrorBox.vue'
import AppRequestErrorPopup from '@/components/common/AppRequestErrorPopup.vue'
import AppInputError from '@/components/common/AppInputError.vue'
import AppIcon from '@/components/common/AppIcon.vue'
import AppFileUploadList from '@/components/common/AppFileUploadList.vue'
import variables from '@/assets/variables'
import useTaskDetails from '@/components/marketer/task/task-details'
import useTaskEdit from '@/components/marketer/task/task-edit/task-edit'
import { TaskPublicInfo, TaskForUpdateForm } from '@/types/tasks.model'
import useTaskStore from '@/store/task'
import useTaskEditForm from '@/components/marketer/task/task-edit/task-edit-form'
import { SimpleAccessFile } from '@/types/file.model'
import { setTitle } from '@/components/helpers/dom'

export default defineComponent({
  name: 'EditTask',
  components: {
    AppLabel,
    AppInput,
    AppCheckbox,
    AppButton,
    AppTextarea,
    AppSkeleton,
    AppErrorBox,
    AppInputError,
    AppRequestErrorPopup,
    AppIcon,
    AppFileUploadList,
  },
  setup() {
    const router = useRouter()

    const { taskEditForm, assignValue } = useTaskEditForm()
    const { title, description, budget, platforms: platformsField } = toRefs(taskEditForm.fieldSet)

    const { getSelectedTask, setSelectedTask } = useTaskStore()

    const { loadTask, reset, isLoading, showLoadingError } = useTaskDetails()

    const {
      update,
      platforms,
      waitingForResponse,
      responseErrorMessage,
      getFileUploadEntries,
      filesErrorText,
      clearFileErrorText,
      handleFilesInput,
      removeFileEntry,
    } = useTaskEdit()

    if (getSelectedTask.value?.id !== router.currentRoute.value.params?.taskId) setSelectedTask(null)
    if (!getSelectedTask.value) loadTask()

    const taskToUpdate = ref<null | TaskForUpdateForm>(null)

    const setTaskToUpdate = (task: TaskPublicInfo | null) => {
      if (task) {
        assignValue(task)
        if (!task.addedByMe || task.hasContractCreated) router.push('/')
      }
    }

    const isAllFilesUploaded = computed(() => getFileUploadEntries.value.every((entry) => entry.isReady))

    const submitTaskEditForm = () => {
      const isValid = taskEditForm.validate()

      if (!isValid) return
      const value = taskEditForm.getValue()

      waitingForResponse.value = true
      if (isAllFilesUploaded.value) update(value)
      if (!isAllFilesUploaded.value) {
        const unwatch = watch(isAllFilesUploaded, (isUploaded) => {
          if (isUploaded) {
            update(value)
            unwatch()
          }
        })
      }
    }

    const removeSimpleFile = (file: SimpleAccessFile) => {
      const idx = getSelectedTask.value?.files?.findIndex(({ id }) => file.id === id)
      if (idx !== undefined && idx !== -1) getSelectedTask.value?.files.splice(idx, 1)
    }

    if (getSelectedTask.value) setTaskToUpdate(getSelectedTask.value)

    watch(getSelectedTask, setTaskToUpdate)
    watch(
      getSelectedTask,
      (task) => {
        if (task) setTitle('Freelance Influence | Edit Task ' + task.title)
      },
      { immediate: true }
    )

    onUnmounted(reset)

    return {
      title,
      description,
      budget,
      platformsField,
      getFileUploadEntries,
      filesErrorText,
      getSelectedTask,
      taskToUpdate,
      platforms,
      waitingForResponse,
      isLoading,
      showLoadingError,
      responseErrorMessage,
      isAllFilesUploaded,
      variables,
      submitTaskEditForm,
      loadTask,
      clearFileErrorText,
      handleFilesInput,
      removeFileEntry,
      removeSimpleFile,
    }
  },
})
</script>

<style lang="scss" scoped>
@import '@/assets/styles/views/marketer/task/EditTask';
</style>
