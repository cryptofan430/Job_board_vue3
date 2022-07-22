<template>
  <main class="proposal">
    <h2 class="title">Proposal</h2>

    <div class="wrapper">
      <ProposalContent />
      <div class="side">
        <ProposalProjectInfo :task="task" :is-loading="!taskReady" :is-error="taskRequestFailed" @get-task="getTask" />
        <ProposalMarketerInfo :task="task" :is-loading="!taskReady" :is-error="taskRequestFailed" @get-task="getTask" />
      </div>
    </div>

    <div class="wrapper-mobile">
      <div class="side">
        <ProposalProjectInfo :task="task" :is-loading="!taskReady" :is-error="taskRequestFailed" @get-task="getTask" />
        <ProposalMarketerInfo :task="task" :is-loading="!taskReady" :is-error="taskRequestFailed" @get-task="getTask" />
      </div>
      <ProposalContent />
    </div>

    <AppRequestErrorPopup
      v-if="responseErrorMessage.length"
      :error-text="responseErrorMessage"
      :redirect-url="redirectUrl"
      @close="clearResponseErrorMessage"
    />
  </main>
</template>

<script lang="ts">
import { defineComponent, onUnmounted, watchEffect } from 'vue'
import ProposalMarketerInfo from '@/components/influencer/proposal-submit/ProposalMarketerInfo.vue'
import ProposalContent from '@/components/influencer/proposal-submit/ProposalContent.vue'
import ProposalProjectInfo from '@/components/influencer/proposal-submit/ProposalProjectInfo.vue'
import AppRequestErrorPopup from '@/components/common/AppRequestErrorPopup.vue'

import useSubmitProposal from '@/components/influencer/proposal-submit/submit-proposal'
import { setTitle } from '@/components/helpers/dom'

export default defineComponent({
  name: 'Proposal',
  components: {
    ProposalMarketerInfo,
    ProposalContent,
    ProposalProjectInfo,
    AppRequestErrorPopup,
  },
  setup() {
    const {
      task,
      redirectToTask,
      getTask,
      getSocial,
      redirectUrl,
      taskReady,
      taskRequestFailed,
      responseErrorMessage,
      clearResponseErrorMessage,
      clearProposalData,
    } = useSubmitProposal()

    getTask()
    getSocial()
    onUnmounted(() => clearProposalData())

    watchEffect(() => {
      if (task.value) {
        setTitle('Freelance Influence | Submit Proposal For Task ' + task.value.title)
      }
    })
    watchEffect(() => {
      if (task.value?.proposalAlreadySent) redirectToTask(task.value?.id)
    })

    return {
      task,
      taskReady,
      taskRequestFailed,
      responseErrorMessage,
      redirectUrl,
      clearResponseErrorMessage,
      getTask,
    }
  },
})
</script>

<style lang="scss" scoped>
@import '@/assets/styles/views/influencer/proposal-submit/ProposalSubmit';
</style>
