<template>
  <div>
    <div class="desktop-tasks-sidebar">
      <div class="tasks-sidebar">
        <SidebarList
          title="Proposals"
          route-path="proposals"
          :items="proposalsData"
          :state="proposalsState.state"
          entities-name="proposals"
          @reload-items="fetchInfluencerProposalsFirstPage"
        >
          <template #noItemsText>You have no proposals at the moment</template>
        </SidebarList>

        <SidebarList
          title="Invitations"
          route-path="invitations"
          :items="invitationsData"
          :state="invitationsState.state"
          entities-name="invitations"
          @reload-items="fetchInvitationFirstPage"
        >
          <template #noItemsText>You have no invitations at the moment</template>
        </SidebarList>
      </div>
    </div>

    <div class="mobile-tasks-sidebar">
      <AppExpandMenu @click="showProposalButton">
        <template #header>Proposals</template>
        <SidebarList
          route-path="proposals"
          title="Proposals"
          :items="proposalsData"
          :state="proposalsState.state"
          entities-name="proposals"
          @reload-items="fetchInfluencerProposalsFirstPage"
        >
          <template #noItemsText>You have no proposals at the moment</template>
        </SidebarList>
      </AppExpandMenu>

      <router-link :to="`proposals`">
        <AppButton v-if="isProposalActive" outlined>Show all</AppButton>
      </router-link>

      <AppExpandMenu @click="showInvitationButton">
        <template #header>Invitations</template>
        <SidebarList
          route-path="invitations"
          title="Invitations"
          :items="invitationsData"
          :state="invitationsState.state"
          entities-name="invitations"
          @reload-items="fetchInvitationFirstPage"
        >
          <template #noItemsText>You have no invitations at the moment</template>
        </SidebarList>
      </AppExpandMenu>

      <router-link :to="`invitations`">
        <AppButton v-if="isInvitationActive" outlined>Show all</AppButton>
      </router-link>
    </div>
  </div>
</template>

<script>
import { computed, defineComponent, ref } from 'vue'
import { getFormattedRelativeDate } from '@/components/helpers/timeFormatter'
import { initialIItems } from '@/components/helpers/arrays'
import SidebarList from '@/components/influencer/tasks/SidebarList.vue'
import useInfluencerInvitations from '@/components/influencer/tasks/invitations'
import useInfluencerProposals from '../proposals/influencer-proposals'
import AppExpandMenu from '@/components/common/AppExpandMenu.vue'
import AppButton from '@/components/common/AppButton.vue'

export default defineComponent({
  name: 'TasksSidebar',
  components: {
    SidebarList,
    AppExpandMenu,
    AppButton,
  },
  setup() {
    const { proposals, proposalsState, fetchInfluencerProposalsFirstPage } = useInfluencerProposals()
    const { invitations, invitationsState, fetchInvitationFirstPage } = useInfluencerInvitations()

    const firstProposals = computed(() => initialIItems(proposals.value || [], 4))
    const firstInvitations = computed(() => initialIItems(invitations.value || [], 4))

    const proposalsData = computed(() => {
      return firstProposals?.value?.map((proposalTask) => ({
        name: proposalTask.task?.title,
        date: getFormattedRelativeDate(proposalTask.proposal.addedTime),
        link: `/i/tasks/${proposalTask.task.id || ''}/proposal`,
      }))
    })

    const invitationsData = computed(() => {
      return firstInvitations?.value?.map((invitation) => ({
        name: invitation.task?.title || '',
        date: getFormattedRelativeDate(invitation.date),
        link: `/i/tasks/${invitation.task.id || ''}/propose`,
      }))
    })

    const isProposalActive = ref(false)
    const isInvitationActive = ref(false)

    const showProposalButton = () => {
      isProposalActive.value = !isProposalActive.value
    }

    const showInvitationButton = () => {
      isInvitationActive.value = !isInvitationActive.value
    }

    fetchInfluencerProposalsFirstPage()
    fetchInvitationFirstPage()

    return {
      proposalsData,
      proposalsState,
      invitationsData,
      invitationsState,
      fetchInfluencerProposalsFirstPage,
      fetchInvitationFirstPage,
      showProposalButton,
      showInvitationButton,
      isProposalActive,
      isInvitationActive,
    }
  },
})
</script>

<style lang="scss" scoped>
@import '@/assets/styles/views/influencer/tasks/TasksSidebar';
</style>
