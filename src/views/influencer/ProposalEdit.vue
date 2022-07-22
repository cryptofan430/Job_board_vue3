<template>
  <main class="proposal">
    <h2 class="title">Proposal</h2>

    <div class="wrapper">
      <ProposalEditContent />
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
      <ProposalEditContent />
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
import ProposalEditContent from '@/components/influencer/proposal-submit/ProposalEditContent.vue'
import ProposalProjectInfo from '@/components/influencer/proposal-submit/ProposalProjectInfo.vue'
import AppRequestErrorPopup from '@/components/common/AppRequestErrorPopup.vue'

import useEditProposal from '@/components/influencer/proposal-submit/edit-proposal'
import { setTitle } from '@/components/helpers/dom'

export default defineComponent({
  name: 'Proposal',
  components: {
    ProposalMarketerInfo,
    ProposalEditContent,
    ProposalProjectInfo,
    AppRequestErrorPopup,
  },
  setup() {
    const {
      task,
      getTask,
      getSocial,
      redirectUrl,
      taskReady,
      taskRequestFailed,
      responseErrorMessage,
      clearResponseErrorMessage,
      clearProposalData,
      fetchTaskProposal,
      watchTaskProposalUpdates,
    } = useEditProposal()

    fetchTaskProposal()
    watchTaskProposalUpdates()
    getTask()
    getSocial()
    onUnmounted(() => clearProposalData())

    watchEffect(() => {
      if (task.value) {
        setTitle('Freelance Influence | Edit Proposal For Task ' + task.value.title)
      }
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
