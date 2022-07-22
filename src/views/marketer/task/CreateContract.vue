<template>
  <main class="create-contract">
    <h1 class="title">Contract creation</h1>

    <AppErrorBox v-if="isError" @clicked="fetchData">task</AppErrorBox>

    <AppSkeleton v-else-if="isLoading" />

    <template v-else>
      <form class="wrapper" @submit.prevent="submitCreateContractForm">
        <router-link v-if="getActiveMarketerTask" :to="`/m/tasks/` + getActiveMarketerTask.id">
          <h2 class="task-name">{{ getActiveMarketerTask?.title }}</h2>
        </router-link>

        <div class="influencer-box">
          <p class="influencer-text">Influencer</p>
          <div class="avatar-with-name">
            <AppAvatar
              :img-url="getActiveMarketerProposal?.influencerInfo?.avatarSimpleAccessFile?.signedUrl"
              size="md"
            />
            <p class="influencer-name">
              {{ getActiveMarketerProposal?.influencerInfo?.firstName }}
              {{ getActiveMarketerProposal?.influencerInfo?.lastName }}
            </p>
          </div>
        </div>

        <p class="milestone-question">How many milestones do you want to include?</p>

        <AppInputError v-if="milestones.isError">{{ milestones.getErrorMessage }}</AppInputError>

        <div class="milestones-list">
          <NewMilestone
            v-for="(milestone, i) in milestones.fieldSets"
            :key="milestone.fieldSet.id.value"
            :counter="i + 1"
            :milestone-id="milestone.fieldSet.id.value"
            :mile-stone-form="milestone"
            @delete-milestone="milestones.removeAt(i)"
          />

          <button class="add-milestone-button" type="button" @click="addMilestone(), milestones.setNormalState()">
            + Add milestone
          </button>
        </div>

        <div class="budget-box">
          <p class="budget">Budget: ${{ totalBudget }}</p>
          <p class="info">This includes all milestones.</p>
        </div>

        <AppButton
          :disabled="!getActiveMarketerTask || getWaitingActionResponse"
          :is-loading="getWaitingActionResponse"
          type="submit"
          class="send-contract-button"
          >Send a contract</AppButton
        >
      </form>
      <div class="mobile-send-contract-button">
        <AppButton
          :disabled="!getActiveMarketerTask || getWaitingActionResponse"
          :is-loading="getWaitingActionResponse"
          type="submit"
          @click="submitCreateContractForm"
          >Send a contract</AppButton
        >
      </div>
    </template>
  </main>
</template>

<script lang="ts">
import { defineComponent, onBeforeUnmount, toRefs, watch } from 'vue'
import useMarketerCreateContract from '@/components/marketer/task/create-contract/create-contract'
import AppButton from '@/components/common/AppButton.vue'
import AppSkeleton from '@/components/common/AppSkeleton.vue'
import AppErrorBox from '@/components/common/AppErrorBox.vue'
import AppAvatar from '@/components/common/AppAvatar.vue'
import AppInputError from '@/components/common/AppInputError.vue'
import NewMilestone from '@/components/marketer/task/NewMilestone.vue'
import { setTitle } from '@/components/helpers/dom'

export default defineComponent({
  name: 'CreateContract',
  components: {
    AppButton,
    AppSkeleton,
    AppErrorBox,
    AppAvatar,
    AppInputError,
    NewMilestone,
  },
  setup() {
    const {
      getActiveMarketerProposal,
      getWaitingActionResponse,
      getActiveMarketerTask,
      contractForm,
      totalBudget,
      isLoading,
      isError,
      reset,
      addMilestone,
      fetchData,
      submitCreateContractForm,
    } = useMarketerCreateContract()

    const { milestones } = toRefs(contractForm.fieldSet)

    addMilestone()
    fetchData()
    onBeforeUnmount(() => reset())
    watch(
      getActiveMarketerTask,
      (task) => {
        if (task) setTitle('Freelance Influence | Create Contract For Task ' + task.title)
      },
      { immediate: true }
    )

    return {
      getActiveMarketerTask,
      getWaitingActionResponse,
      getActiveMarketerProposal,
      milestones,
      isLoading,
      isError,
      contractForm,
      totalBudget,
      addMilestone,
      fetchData,
      submitCreateContractForm,
    }
  },
})
</script>

<style lang="scss" scoped>
@import '@/assets/styles/views/marketer/task/CreateContract';
</style>
