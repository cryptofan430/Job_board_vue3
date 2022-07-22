<template>
  <AppLink v-if="isProposalAdded.isActive" size="xsm" outlined :to="`/m/tasks/${isProposalAdded.taskId}/proposals`">
    Go to proposals
  </AppLink>

  <AppLink
    v-else-if="isInvitationCreated.isActive"
    size="xsm"
    outlined
    :to="isInfluencer ? '/i/invitations' : `/m/tasks/${isInvitationCreated.taskId}/invitations`"
  >
    Go to invitations
  </AppLink>

  <AppLink
    v-else-if="isContractCreated.isActive"
    size="xsm"
    outlined
    :to="
      isInfluencer
        ? `/i/tasks/${isContractCreated.taskId}/contracts/${isContractCreated.contractId}`
        : `/m/tasks/${isContractCreated.taskId}/contracts`
    "
  >
    Go to contract
  </AppLink>

  <AppLink
    v-else-if="isContractAccepted.isActive"
    size="xsm"
    outlined
    :to="
      isInfluencer
        ? `/i/tasks/${isContractAccepted.taskId}/contracts/${isContractAccepted.contractId}`
        : `/m/tasks/${isContractAccepted.taskId}/contracts`
    "
  >
    Go to contract
  </AppLink>

  <AppLink
    v-else-if="isContractEnded.isActive"
    size="xsm"
    outlined
    :to="
      isInfluencer
        ? `/i/tasks/${isContractEnded.taskId}/contracts/${isContractEnded.contractId}`
        : `/m/tasks/${isContractEnded.taskId}/contracts`
    "
  >
    Go to contract
  </AppLink>

  <AppLink
    v-else-if="isMilestoneCreated.isActive"
    size="xsm"
    outlined
    :to="isInfluencer ? `/i/invitations` : `/m/tasks/${isMilestoneCreated.taskId}/invitations`"
  >
    Go to invitations
  </AppLink>

  <AppLink
    v-else-if="isMilestoneSecured.isActive"
    size="xsm"
    outlined
    :to="isInfluencer ? `/i/invitations` : `/m/tasks/${isMilestoneSecured.taskId}/invitations`"
  >
    Go to invitations
  </AppLink>

  <AppLink
    v-else-if="isMilestoneReleased.isActive"
    size="xsm"
    outlined
    :to="isInfluencer ? `/i/invitations` : `/m/tasks/${isMilestoneReleased.taskId}/invitations`"
  >
    Go to invitations
  </AppLink>

  <AppLink v-else-if="isSocialAccountUnlinked.isActive" size="xsm" outlined to="/settings/social-media">
    Go to settings
  </AppLink>
</template>

<script lang="ts">
import { defineComponent, computed, PropType } from 'vue'
import {
  ContractNotification,
  InvitationNotification,
  MilestoneNotification,
  NotificationType,
  NotificationWithTypeInfo,
  ProposalNotification,
  SocialAccountUnlinkNotification,
} from '@/types/notification.model'
import useAuthStore from '@/store/auth'
import AppLink from '@/components/common/AppLink.vue'

export default defineComponent({
  name: 'NotificationAction',
  components: {
    AppLink,
  },
  props: {
    notification: {
      type: Object as PropType<NotificationWithTypeInfo>,
      required: true,
    },
  },
  setup(props) {
    const { accountType } = useAuthStore()

    const isInfluencer = computed(() => accountType.value === 'influencer')

    const isProposalAdded = computed(() => {
      const notification = props.notification as ProposalNotification

      return {
        isActive: props.notification.notificationType === NotificationType.PROPOSAL_ADDED,
        taskId: notification.taskId,
      }
    })

    const isInvitationCreated = computed(() => {
      const notification = props.notification as InvitationNotification

      return {
        isActive: props.notification.notificationType === NotificationType.INVITATION_CREATED,
        taskId: notification.taskId,
        invitationId: notification.invitationId,
      }
    })

    const isContractCreated = computed(() => {
      const notification = props.notification as ContractNotification

      return {
        isActive: props.notification.notificationType === NotificationType.CONTRACT_CREATED,
        taskId: notification.taskId,
        contractId: notification.contractId,
      }
    })

    const isContractAccepted = computed(() => {
      const notification = props.notification as ContractNotification

      return {
        isActive: props.notification.notificationType === NotificationType.CONTRACT_ACCEPTED,
        taskId: notification.taskId,
        contractId: notification.contractId,
      }
    })

    const isContractEnded = computed(() => {
      const notification = props.notification as ContractNotification

      return {
        isActive: props.notification.notificationType === NotificationType.CONTRACT_ENDED,
        taskId: notification.taskId,
        contractId: notification.contractId,
      }
    })

    const isMilestoneCreated = computed(() => {
      const notification = props.notification as MilestoneNotification

      return {
        isActive: props.notification.notificationType === NotificationType.MILESTONES_CREATED,
        taskId: notification.taskId,
        invitationId: notification.invitationId,
      }
    })

    const isMilestoneSecured = computed(() => {
      const notification = props.notification as MilestoneNotification

      return {
        isActive: props.notification.notificationType === NotificationType.MILESTONE_SECURED,
        taskId: notification.taskId,
        invitationId: notification.invitationId,
      }
    })

    const isMilestoneReleased = computed(() => {
      const notification = props.notification as MilestoneNotification

      return {
        isActive: props.notification.notificationType === NotificationType.MILESTONE_RELEASED,
        taskId: notification.taskId,
        invitationId: notification.invitationId,
      }
    })

    const isSocialAccountUnlinked = computed(() => {
      const notification = props.notification as SocialAccountUnlinkNotification

      return {
        isActive: props.notification.notificationType === NotificationType.SOCIAL_ACCOUNT_UNLINKED,
        socialPlatform: notification.socialMediaPlatform,
        accountName: notification.accountName,
      }
    })

    return {
      isProposalAdded,
      isInvitationCreated,
      isContractCreated,
      isContractAccepted,
      isContractEnded,
      isMilestoneCreated,
      isMilestoneSecured,
      isMilestoneReleased,
      isSocialAccountUnlinked,
      isInfluencer,
    }
  },
})
</script>
