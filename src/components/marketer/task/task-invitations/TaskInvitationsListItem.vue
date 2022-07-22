<template>
  <tr class="invitations-list-item">
    <td class="invitation-table-cell invitation-table-wide-cell">
      <div class="user-box">
        <AppAvatar size="md" />
        <div class="name-with-account">
          <p class="name">Name and Surname</p>
          <p class="account">@{{ invitation.invitation.username }}</p>
        </div>
      </div>
    </td>

    <td class="tags invitation-table-cell invitation-table-middle-sized-cell">
      <AppTag v-for="tag in tagsLabels" :key="tag" sm>{{ tag }}</AppTag>
    </td>

    <td class="mobile-table">
      <table>
        <tr class="mobile-table-head">
          <td>Social media</td>
          <td>
            <AppIcon name="followers" size="sm" :color="variables.cPrimary500" />
          </td>
          <td>
            <AppIcon name="rating" size="sm" :color="variables.cPrimary500" />
          </td>
          <td>
            <AppIcon name="money-earned" size="sm" :color="variables.cPrimary500" />
          </td>
        </tr>
        <tr class="mobile-table-body">
          <td class="platform invitation-table-cell">{{ platformlabel }}</td>
          <td class="audience invitation-table-cell">{{ invitation?.invitation?.audience }}</td>
          <td class="rating invitation-table-cell">{{ ratingText }}</td>
          <td class="invitation-table-cell">$200K</td>
        </tr>
        <tr class="mobile-table-button">
          <AppButton
            :disabled="invitation?.invitation?.invited || invitation?.invitation?.proposed || invitation.isProcessing"
            :is-loading="invitation.isProcessing"
            @click="inviteForTask"
            >Invite</AppButton
          >
        </tr>
      </table>
    </td>

    <td class="platform invitation-table-cell invitation-table-tiny-cell">{{ platformlabel }}</td>

    <td class="audience invitation-table-cell invitation-table-tiny-cell">{{ invitation?.invitation?.audience }}</td>

    <td class="rating invitation-table-cell invitation-table-tiny-cell">{{ ratingText }}</td>

    <td class="invitation-table-cell invitation-table-wide-cell">
      <div class="money-with-button">
        <p class="money-earned">$200K</p>
        <AppButton
          :disabled="invitation?.invitation?.invited || invitation?.invitation?.proposed || invitation.isProcessing"
          :is-loading="invitation.isProcessing"
          @click="inviteForTask"
          >Invite</AppButton
        >
      </div>
    </td>
  </tr>
</template>

<script lang="ts">
import { computed, defineComponent, PropType } from 'vue'
import AppButton from '@/components/common/AppButton.vue'
import AppAvatar from '@/components/common/AppAvatar.vue'
import AppTag from '@/components/common/AppTag.vue'
import { InvitationWithPlatform } from '@/types/platform.model'
import { extractArrayOfTagNames } from '@/components/helpers/social-accounts'
import { getPlatformLabel } from '@/components/helpers/platforms'
import AppIcon from '@/components/common/AppIcon.vue'
import variables from '@/assets/variables'

export default defineComponent({
  components: {
    AppButton,
    AppAvatar,
    AppTag,
    AppIcon,
  },
  props: {
    invitation: {
      type: Object as PropType<InvitationWithPlatform>,
      required: true,
    },
  },
  emits: ['invite-for-task'],
  setup(props, { emit }) {
    const ratingText = computed(() => {
      const rating = props.invitation?.invitation?.rating
      if (rating === 0 || rating) return `${rating}/5`
      return '-'
    })
    const tagsLabels = computed(() => extractArrayOfTagNames(props.invitation?.invitation?.tags || []))

    const platformlabel = computed(() => getPlatformLabel(props.invitation?.platform))

    const inviteForTask = () => emit('invite-for-task', props.invitation)

    return {
      ratingText,
      tagsLabels,
      platformlabel,
      inviteForTask,
      variables,
    }
  },
})
</script>

<style lang="scss" scoped>
@import '@/assets/styles/views/marketer/task/task-invitations/TaskInvitationsListItem';
</style>
