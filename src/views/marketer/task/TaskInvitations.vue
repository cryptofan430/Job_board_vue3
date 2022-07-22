<template>
  <section class="task-invitations">
    <form class="search-bar" @submit.prevent="updateTagsValue(tagsValue || [])">
      <AppAutocomplete
        v-model="tagsValue"
        class="invitations-autocomplete"
        :options="tagsData"
        label-text
        placeholder="Search"
      />

      <AppButton type="submit">Search</AppButton>
    </form>

    <p class="search-info">Use keywords to search for an exact account</p>

    <div class="filters">
      <TaskInvitationsSort />
      <TaskInvitationsFilter
        :social-media-platform="taskInvitationsFilters.socialPlatforms?.toString()"
        @update-filter="updateSocialMediaAccount"
      />
    </div>

    <AppErrorBox v-if="isError && !getTaskInvitations.length" @clicked="refetchInvitations">invitations</AppErrorBox>

    <AppSkeleton v-else-if="isLoading && !getTaskInvitations.length" />

    <template v-else-if="getTaskInvitations.length">
      <table class="invitations-table">
        <thead class="table-head">
          <tr>
            <th class="table-heading">Account</th>
            <th class="table-heading">Tags</th>
            <th class="table-heading">Platform</th>
            <th class="table-heading">Audience</th>
            <th class="table-heading">Rating</th>
            <th class="table-heading">Money earned</th>
          </tr>
        </thead>

        <tbody class="table-body">
          <TaskInvitationsListItem
            v-for="invitation in getTaskInvitations"
            :key="invitation.invitation.id"
            :invitation="invitation"
            @invite-for-task="inviteForTask"
          />
        </tbody>
      </table>
      <p v-if="isError" class="loading-error">An error occurred when fetching invitations</p>
      <div class="load-more-button-wrapper">
        <AppButton
          size="md"
          class="load-more-button"
          :disabled="isLoading || getInvitationsCount <= getTaskInvitations.length"
          :loading="isLoading"
          type="button"
          @click="fetchMoreInvitations"
          >Load more</AppButton
        >
      </div>
    </template>
    <AppEmptyBox v-else-if="!getTaskInvitations.length">No freelancers to invite</AppEmptyBox>
  </section>
</template>

<script lang="ts">
import { defineComponent, watch } from 'vue'
import AppErrorBox from '@/components/common/AppErrorBox.vue'
import AppSkeleton from '@/components/common/AppSkeleton.vue'
import AppButton from '@/components/common/AppButton.vue'
import AppAutocomplete from '@/components/common/AppAutocomplete.vue'
import AppEmptyBox from '@/components/common/AppEmptyBox.vue'
import TaskInvitationsSort from '@/components/marketer/task/task-invitations/TaskInvitationsSort.vue'
import TaskInvitationsFilter from '@/components/marketer/task/task-invitations/TaskInvitationsFilter.vue'
import TaskInvitationsListItem from '@/components/marketer/task/task-invitations/TaskInvitationsListItem.vue'
import useTagsStore from '@/store/tags'
import useTagsController from '@/middleware/controllers/useTagsController'
import useTaskInvitations from '@/components/marketer/task/task-invitations/task-invitations'
import useTaskStore from '@/store/task'
import { setTitle } from '@/components/helpers/dom'

export default defineComponent({
  name: 'TaskInvitations',
  components: {
    AppAutocomplete,
    AppErrorBox,
    AppSkeleton,
    AppButton,
    AppEmptyBox,
    TaskInvitationsSort,
    TaskInvitationsFilter,
    TaskInvitationsListItem,
  },
  setup() {
    const { tagsData } = useTagsStore()
    const { fetchTags } = useTagsController()
    const {
      tagsValue,
      taskInvitationsFilters,
      getTaskInvitations,
      getInvitationsCount,
      invitationsPerPage,
      isLoading,
      isLoaded,
      isError,
      updateTagsValue,
      updateSocialMediaAccount,
      refetchInvitations,
      watchFilters,
      inviteForTask,
      fetchMoreInvitations,
    } = useTaskInvitations()
    const { getSelectedTask } = useTaskStore()

    fetchTags()
    refetchInvitations()
    watchFilters()

    watch(
      getSelectedTask,
      (task) => {
        if (task) setTitle('Freelance Influence | Invite For Task ' + task.title)
      },
      { immediate: true }
    )

    return {
      tagsValue,
      tagsData,
      isLoading,
      isLoaded,
      isError,
      taskInvitationsFilters,
      getTaskInvitations,
      getInvitationsCount,
      invitationsPerPage,
      updateTagsValue,
      updateSocialMediaAccount,
      refetchInvitations,
      inviteForTask,
      fetchMoreInvitations,
    }
  },
})
</script>

<style lang="scss" scoped>
@import '@/assets/styles/views/marketer/task/task-invitations/TaskInvitations';
</style>
