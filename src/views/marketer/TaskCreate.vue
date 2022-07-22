<template>
  <main class="task-create" @focusin="clearFileErrorText">
    <h1 class="title">Task creation</h1>

    <section class="form-wrapper">
      <form class="form" novalidate @submit.prevent="submitCreateForm">
        <div class="info-fields-wrapper">
          <div class="title-wrapper">
            <AppLabel for="title" layout="responsive">Name your project</AppLabel>
            <AppInput
              id="title"
              v-model="title.value"
              name="title"
              :error="title.isError"
              responsive
              size="sm"
              @update:modelValue="title.setNormalState"
            />
            <AppInputError :error="title.isError">{{ title.getErrorMessage }}</AppInputError>
          </div>

          <div class="description-wrapper">
            <AppLabel for="description" layout="responsive">Describe your project</AppLabel>
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

              <AppLabel class="file-label" for="file-input" layout="responsive">
                <AppIcon name="attach" size="sm" :color="variables.cGrey000" />

                <span class="file-name">Attach File</span>

                <span class="file-info"> up to 10 MB </span>
              </AppLabel>
            </div>
            <AppFileUploadList :file-entries="getFileUploadEntries" @remove-file-entry="removeFileEntry" />
            <AppInputError v-if="filesErrorText">
              {{ filesErrorText }}
            </AppInputError>
          </div>

          <div class="budget-wrapper">
            <AppLabel for="budget" layout="responsive">Your project's budget</AppLabel>
            <div class="budget-input-container" data-currency="$">
              <AppInput
                id="budget"
                v-model="budgetValue.value"
                name="budget"
                type="number"
                :decimals="2"
                :error="budgetValue.isError"
                responsive
                size="sm"
                @update:modelValue="budgetValue.setNormalState"
              />
            </div>
            <AppInputError v-if="budgetValue.isError">{{ budgetValue.getErrorMessage }}</AppInputError>
          </div>
          <AppButton
            type="submit"
            class="post-task-md-button"
            :disabled="waitingForResponse || !isAllFilesUploaded"
            :is-loading="waitingForResponse"
            >Post a Task</AppButton
          >
        </div>

        <div class="platform-wrapper">
          <h3 class="platforms-text">Choose relevant platforms:</h3>

          <AppLabel v-for="platform in platforms" :key="platform.value" layout="responsive" size="sm">
            <AppCheckbox
              v-model="platformsField.value"
              :value="platform.value"
              @update:modelValue="platformsField.setNormalState"
            />
            <span class="platforms-name">{{ platform.name }}</span>
          </AppLabel>
          <AppInputError v-if="platformsField.isError">{{ platformsField.getErrorMessage }}</AppInputError>
        </div>
      </form>
    </section>

    <AppButton
      type="submit"
      class="post-task-sm-button"
      :disabled="waitingForResponse || !isAllFilesUploaded"
      :is-loading="waitingForResponse"
      @click="submitCreateForm"
      >Post a Task</AppButton
    >

    <AppRequestErrorPopup
      v-if="responseErrorMessage.length"
      :error-text="responseErrorMessage"
      @close="closeErrorResponsePopup"
    />
  </main>
</template>

<script lang="ts">
import { defineComponent, toRefs } from 'vue'
import useTaskCreate from '@/components/marketer/task-create/task-create'
import AppLabel from '@/components/common/AppLabel.vue'
import AppInput from '@/components/common/AppInput.vue'
import AppCheckbox from '@/components/common/AppCheckbox.vue'
import AppButton from '@/components/common/AppButton.vue'
import AppTextarea from '@/components/common/AppTextarea.vue'
import AppInputError from '@/components/common/AppInputError.vue'
import AppRequestErrorPopup from '@/components/common/AppRequestErrorPopup.vue'
import AppIcon from '@/components/common/AppIcon.vue'
import AppFileUploadList from '@/components/common/AppFileUploadList.vue'
import variables from '@/assets/variables'

export default defineComponent({
  name: 'TaskCreate',
  components: {
    AppIcon,
    AppLabel,
    AppInput,
    AppCheckbox,
    AppButton,
    AppTextarea,
    AppInputError,
    AppFileUploadList,
    AppRequestErrorPopup,
  },
  setup() {
    const {
      getFileUploadEntries,
      filesErrorText,
      taskCreateForm,
      platforms,
      waitingForResponse,
      responseErrorMessage,
      isAllFilesUploaded,
      submitCreateForm,
      closeErrorResponsePopup,
      handleFilesInput,
      removeFileEntry,
      clearFileErrorText,
    } = useTaskCreate()

    const { title, description, budget, platforms: platformsField } = toRefs(taskCreateForm.fieldSet)

    const { value: budgetValue } = toRefs(budget.value.fieldSet)

    return {
      getFileUploadEntries,
      filesErrorText,
      title,
      description,
      budgetValue,
      platformsField,
      platforms,
      waitingForResponse,
      responseErrorMessage,
      isAllFilesUploaded,
      submitCreateForm,
      closeErrorResponsePopup,
      handleFilesInput,
      removeFileEntry,
      clearFileErrorText,
      variables,
    }
  },
})
</script>

<style lang="scss" scoped>
@import '@/assets/styles/views/marketer/TaskCreate';
</style>
