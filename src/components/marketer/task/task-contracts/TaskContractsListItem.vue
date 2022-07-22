<template>
  <div>
    <div class="task-contracts-list-item">
      <div class="boxes-container">
        <div class="influencer-box">
          <div class="contract-info-wrapper">
            <span class="status" :class="contractStateClasses">{{ conractStateText }}</span>
            <div class="avatar-with-name">
              <AppAvatar
                size="xs"
                status="online"
                :img-url="contract?.userStateInfo?.avatarSimpleAccessFile?.signedUrl"
              />
              <span class="influencer-name"
                >{{ contract?.userStateInfo?.firstName }} {{ contract?.userStateInfo?.lastName }}</span
              >
            </div>
          </div>

          <div class="desktop-contract-button">
            <AppLink
              size="sm"
              outlined
              class="open-link"
              :to="{
                name: 'MarketerTaskSingleContract',
                params: {
                  contractId: contract?.contract?.id,
                  taskId: contract?.contract?.taskId,
                },
              }"
              >Open</AppLink
            >
            <AppButton v-if="contract.chatId" size="sm" @click="goToChat">Chat</AppButton>
            <AppButton v-else size="md" @click="goToChat">Create Chat</AppButton>
          </div>
        </div>

        <div class="milestone-box">
          <span class="milestone-text">Milestone</span>
          <div class="progress-with-name">
            <AppCompletionProgress :percent="activeMilestoreProgress" />
            <span class="milestone-name">{{ displayedMilsestone?.description }}</span>
          </div>
        </div>
      </div>
    </div>
    <div class="mobile-contract-button">
      <AppLink
        size="sm"
        outlined
        class="open-link"
        :to="{
          name: 'MarketerTaskSingleContract',
          params: {
            contractId: contract?.contract?.id,
            taskId: contract?.contract?.taskId,
          },
        }"
        >Open</AppLink
      >
      <AppButton v-if="contract.chatId" size="sm" @click="goToChat">Chat</AppButton>
      <AppButton v-else size="md" @click="goToChat">Create Chat</AppButton>
    </div>
  </div>
</template>

<script lang="ts">
import { computed, defineComponent, PropType } from 'vue'
import { ContractWithUserStateInfo } from '@/types/contract.model'
import { extractActiveMilestone, extractMilestoneProgress } from '@/components/helpers/milestones'
import AppButton from '@/components/common/AppButton.vue'
import AppCompletionProgress from '@/components/common/AppCompletionProgress.vue'
import AppAvatar from '@/components/common/AppAvatar.vue'
import AppLink from '@/components/common/AppLink.vue'
import useToastsStore from '@/store/toasts'
import useChatController from '@/middleware/controllers/useChatController'
import { useRouter } from 'vue-router'

export default defineComponent({
  name: 'TaskContractsListItem',
  components: {
    AppLink,
    AppButton,
    AppCompletionProgress,
    AppAvatar,
  },
  props: {
    contract: {
      type: Object as PropType<ContractWithUserStateInfo>,
      required: true,
    },
  },
  setup(props) {
    const { addToast } = useToastsStore()
    const { createChat } = useChatController()
    const router = useRouter()

    const conractStateText = computed(() => {
      if (props.contract.contract.ended && !props.contract.contract.influencerReviewed) {
        return 'Contract ended, waiting for a review'
      }
      if (props.contract.contract.ended && props.contract.contract.influencerReviewed) return 'Contract ended'
      if (props.contract.contract.accepted) return 'Contract accepted'
      return 'Contract is not accepted'
    })

    const contractStateClasses = computed(() => {
      if (props.contract.contract.accepted) return '--accepted'
      return ''
    })

    const displayedMilsestone = computed(() => extractActiveMilestone(props.contract.contract.milestones))

    const activeMilestoreProgress = computed(() => extractMilestoneProgress(props.contract.contract.milestones))

    const redirectToChat = (chatId: string) => router.push(`/chat/${chatId}`)

    const goToChat = async () => {
      const { chatId, proposalId } = props.contract

      if (chatId) redirectToChat(chatId)
      if (!chatId && proposalId) {
        await createChat(proposalId)
          .then((response) => {
            redirectToChat(response.data.id)
          })
          .catch(() => addToast('Failed to create a chat', 'danger'))
      }
    }

    return {
      conractStateText,
      contractStateClasses,
      displayedMilsestone,
      activeMilestoreProgress,
      goToChat,
    }
  },
})
</script>

<style lang="scss" scoped>
@import '@/assets/styles/views/marketer/task/TaskContractsListItem';
</style>
