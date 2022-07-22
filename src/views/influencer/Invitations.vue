<template>
  <main class="invitations">
    <h2 class="title">All invitations</h2>

    <div class="wrapper">
      <AppSkeleton v-if="isLoading" />

      <AppErrorBox v-else-if="isError" @clicked="refetchInvitations"> invitations </AppErrorBox>

      <AppEmptyBox v-else-if="isLoaded && !invitations?.length"> There are no invitations at the moment </AppEmptyBox>

      <ul v-else class="list">
        <InvitationItem v-for="invitation in invitations" :key="invitation.id" :invitation="invitation" />
      </ul>
    </div>

    <AppPagination
      :active-page="activePage"
      :count="invitationsCount"
      :per-page="invitationsPerPage"
      @page-change="updatePage"
    />
  </main>
</template>

<script lang="ts">
import { defineComponent } from 'vue'
import InvitationItem from '@/components/influencer/invitations/InvitationItem.vue'
import useInfluencerInvitations from '@/components/influencer/tasks/invitations'
import AppPagination from '@/components/common/AppPagination.vue'
import AppSkeleton from '@/components/common/AppSkeleton.vue'
import AppErrorBox from '@/components/common/AppErrorBox.vue'
import AppEmptyBox from '@/components/common/AppEmptyBox.vue'

export default defineComponent({
  name: 'Invitations',
  components: {
    AppPagination,
    InvitationItem,
    AppSkeleton,
    AppErrorBox,
    AppEmptyBox,
  },
  setup() {
    const {
      invitations,
      invitationsCount,
      invitationsPerPage,
      activePage,
      isLoading,
      isError,
      isLoaded,
      refetchInvitations,
      watchFilters,
      watchPageLimits,
      updatePage,
    } = useInfluencerInvitations()

    refetchInvitations()

    watchPageLimits()
    watchFilters()

    return {
      invitations,
      invitationsCount,
      invitationsPerPage,
      activePage,
      isLoading,
      isError,
      isLoaded,
      refetchInvitations,
      updatePage,
    }
  },
})
</script>

<style lang="scss" scoped>
@import '@/assets/styles/views/influencer/invitations/Invitations';
</style>
