<template>
  <div class="contract-list-item">
    <div class="contract-list-item-content">
      <p class="contract-title">
        {{ taskContract.task?.title }}
      </p>

      <div class="boxes-container">
        <div class="influencer-box">
          <div class="contract-info-wrapper">
            <span class="status" :class="contractStateClasses">{{ conractStateText }}</span>
            <div class="avatar-with-name">
              <AppAvatar
                size="xs"
                status="online"
                :img-url="taskContract?.userStateInfo?.avatarSimpleAccessFile?.signedUrl"
              />
              <span class="influencer-name"
                >{{ taskContract?.userStateInfo?.firstName }} {{ taskContract?.userStateInfo?.lastName }}</span
              >
            </div>
          </div>

          <div class="contract-list-item-md-buttons">
            <AppLink
              size="sm"
              outlined
              class="open-link"
              :to="{
                name: 'MarketerTaskSingleContract',
                params: {
                  contractId: taskContract?.contract?.id,
                  taskId: taskContract?.contract?.taskId,
                },
              }"
            >
              Open
            </AppLink>
            <AppButton size="sm" @click="goToChat">Chat</AppButton>
          </div>
        </div>

        <div class="milestone-box">
          <span class="milestone-text">Milestone</span>
          <div class="progress-with-name">
            <AppCompletionProgress class="milestone-progress" :percent="activeMilestoreProgress" />
            <span class="milestone-name">{{ displayedMilsestone?.description }}</span>
          </div>
        </div>
      </div>
    </div>

    <div class="contract-list-item-sm-buttons">
      <AppLink
        size="sm"
        outlined
        class="open-link"
        :to="{
          name: 'MarketerTaskSingleContract',
          params: {
            contractId: taskContract?.contract?.id,
            taskId: taskContract?.contract?.taskId,
          },
        }"
      >
        Open
      </AppLink>
      <AppButton size="sm" @click="goToChat">Chat</AppButton>
    </div>
  </div>
</template>

<script lang="ts">
import { defineComponent, computed, PropType } from 'vue'
import AppCompletionProgress from '@/components/common/AppCompletionProgress.vue'
import AppAvatar from '@/components/common/AppAvatar.vue'
import { ContractWithTask } from '@/types/contract.model'
import { extractActiveMilestone, extractMilestoneProgress } from '@/components/helpers/milestones'
import AppLink from '@/components/common/AppLink.vue'
import AppButton from '@/components/common/AppButton.vue'
import useToastsStore from '@/store/toasts'
import useChatController from '@/middleware/controllers/useChatController'
import { useRouter } from 'vue-router'

export default defineComponent({
  name: 'ContractListItem',
  components: {
    AppCompletionProgress,
    AppAvatar,
    AppLink,
    AppButton,
  },
  props: {
    taskContract: {
      type: Object as PropType<ContractWithTask>,
      required: true,
    },
  },
  setup(props) {
    const { addToast } = useToastsStore()
    const { createChat } = useChatController()
    const router = useRouter()

    const conractStateText = computed(() => {
      const contract = props.taskContract.contract

      if (contract.ended && !contract.influencerReviewed) {
        return 'Contract ended, waiting for a review'
      }
      if (contract.ended && contract.influencerReviewed) return 'Contract ended'
      if (contract.accepted) return 'Contract accepted'
      return 'Contract is not accepted'
    })

    const contractStateClasses = computed(() => {
      const contract = props.taskContract.contract
      if (contract.accepted) return '--accepted'
      return ''
    })
    const displayedMilsestone = computed(() => extractActiveMilestone(props.taskContract.contract?.milestones))

    const activeMilestoreProgress = computed(() => extractMilestoneProgress(props.taskContract.contract?.milestones))

    const redirectToChat = (chatId: string) => router.push(`/chat/${chatId}`)

    const goToChat = async () => {
      const { chatId, proposalId } = props.taskContract

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
      displayedMilsestone,
      activeMilestoreProgress,
      conractStateText,
      contractStateClasses,
      goToChat,
    }
  },
})
</script>

<style lang="scss" scoped>
@import '@/assets/styles/views/marketer/dashboard/ContractListItem';
</style>
