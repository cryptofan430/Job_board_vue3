<template>
  <main class="add-milestones">
    <h1 class="title">Add milestones</h1>

    <AppErrorBox v-if="isError" @clicked="fetchData">task</AppErrorBox>

    <AppSkeleton v-else-if="isLoading" />

    <template v-else-if="getActiveMarketerTaskContract">
      <form class="wrapper" @submit.prevent="submitAddMilestonesForm">
        <h2 class="task-name">{{ getActiveMarketerTaskContract.task.title }}</h2>

        <div class="influencer-box">
          <p class="influencer-text">Influencer</p>
          <div class="avatar-with-name">
            <AppAvatar
              :img-url="getActiveMarketerTaskContract?.userStateInfo?.avatarSimpleAccessFile?.signedUrl"
              size="md"
            />
            <p class="influencer-name">
              {{ getActiveMarketerTaskContract?.userStateInfo?.firstName }}
              {{ getActiveMarketerTaskContract?.userStateInfo?.lastName }}
            </p>
          </div>
        </div>

        <p class="milestone-question">How many milestones do you want to include?</p>

        <div class="milestones-list">
          <NewMilestone
            v-for="(milestone, i) in milestones.fieldSets"
            :key="milestone.fieldSet.id.value"
            :counter="i + previousMilestonesCount + 1"
            :milestone-id="milestone.fieldSet.id.value"
            :mile-stone-form="milestone"
            :actions-disabled="getWaitingActionResponse"
            @delete-milestone="milestones.removeAt(i)"
          />

          <button class="add-milestone-button" type="button" :disabled="getWaitingActionResponse" @click="addMilestone">
            + Add milestone
          </button>
        </div>

        <div class="budget-box">
          <p class="budget">Budget: ${{ totalBudget }}</p>
          <p class="info">This includes all milestones.</p>
        </div>

        <AppButton
          type="submit"
          class="send-contract-button"
          :disabled="getWaitingActionResponse"
          :is-loading="getWaitingActionResponse"
          >Save milestones</AppButton
        >
      </form>
      <div class="mobile-send-contract-button">
        <AppButton
          type="button"
          :disabled="getWaitingActionResponse"
          :is-loading="getWaitingActionResponse"
          @click="submitAddMilestonesForm"
          >Save milestones</AppButton
        >
      </div>
    </template>
  </main>
</template>

<script lang="ts">
import { computed, defineComponent, toRefs, watch } from 'vue'
import AppButton from '@/components/common/AppButton.vue'
import AppSkeleton from '@/components/common/AppSkeleton.vue'
import AppErrorBox from '@/components/common/AppErrorBox.vue'
import AppAvatar from '@/components/common/AppAvatar.vue'
import NewMilestone from '@/components/marketer/task/NewMilestone.vue'
import useMarketerAddMilestones from '@/components/marketer/task/add-milestones'
import { setTitle } from '@/components/helpers/dom'

export default defineComponent({
  name: 'AddMilestones',
  components: {
    AppButton,
    AppSkeleton,
    AppErrorBox,
    AppAvatar,
    NewMilestone,
  },
  setup() {
    const {
      isLoading,
      isError,
      getActiveMarketerTaskContract,
      getWaitingActionResponse,
      milestonesForm,
      totalBudget,
      fetchData,
      addMilestone,
      submitAddMilestonesForm,
    } = useMarketerAddMilestones()

    const { milestones } = toRefs(milestonesForm.fieldSet)

    addMilestone()
    fetchData()

    const previousMilestonesCount = computed(() => {
      return getActiveMarketerTaskContract.value?.contract.milestones.length || 0
    })

    watch(
      getActiveMarketerTaskContract,
      (task) => {
        if (task?.task) setTitle('Freelance Influence | Create Contract For Task ' + task.task.title)
      },
      { immediate: true }
    )

    return {
      getActiveMarketerTaskContract,
      getWaitingActionResponse,
      milestones,
      previousMilestonesCount,
      isLoading,
      isError,
      totalBudget,
      fetchData,
      addMilestone,
      submitAddMilestonesForm,
    }
  },
})
</script>

<style lang="scss" scoped>
@import '@/assets/styles/views/marketer/task/AddMilestones';
</style>
