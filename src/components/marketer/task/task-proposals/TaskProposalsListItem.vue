<template>
  <div>
    <div class="proposals-list-item">
      <div class="proposal-column">
        <div class="user-box">
          <AppAvatar size="md" :img-url="proposal.influencerInfo?.avatarSimpleAccessFile?.signedUrl" />
          <div class="name-with-location">
            <p class="name">{{ proposal.influencerInfo?.firstName }} {{ proposal.influencerInfo?.lastName }}</p>
            <p class="location">{{ locationText }}Location</p>
          </div>
        </div>

        <div class="overall-stats">
          <div class="rating-box">
            <AppIcon name="rating" size="sm" :color="variables.cPrimary500" />
            <p class="rating">{{ ratingText }}5/5</p>
          </div>

          <div class="money-box">
            <AppIcon name="money-earned" size="sm" :color="variables.cPrimary500" />
            <p class="money-earned">{{ moneySpentText }}</p>
          </div>
        </div>

        <p ref="content" class="proposal-text line-clamped">{{ proposal.description }}</p>
        <div class="mobile-social-media-column">
          <SocialMedia :social-accounts="proposal.accounts" />
        </div>
        <button v-if="!detailsTriggerHidden" class="read-more-button" @click="showDetails">Read more</button>

        <div class="buttons-wrapper">
          <AppButton size="sm" @click="goToChat(proposal)">Chat</AppButton>

          <AppButton v-if="!proposal.contractId" size="sm" outlined @click="goToProposal(proposal, taskId, task)"
            >Hire</AppButton
          >

          <AppLink v-else :to="`/m/tasks/${taskId}/contracts/${proposal.contractId}`" size="md" outlined
            >View Contract</AppLink
          >
        </div>
      </div>
      <div class="desktop-social-media-column">
        <SocialMedia :social-accounts="proposal.accounts" />
      </div>
    </div>
    <div class="mobile-buttons-wrapper">
      <AppButton size="sm" @click="goToChat(proposal)">Chat</AppButton>

      <AppButton v-if="!proposal.contractId" size="sm" outlined @click="goToProposal(proposal, taskId, task)"
        >Hire</AppButton
      >

      <AppLink v-else :to="`/m/tasks/${taskId}/contracts/${proposal.contractId}`" size="md" outlined
        >View Contract</AppLink
      >
    </div>
  </div>
</template>

<script lang="ts">
import { computed, defineComponent, onBeforeUnmount, onMounted, PropType, ref, watch } from 'vue'
import { ProposalPublicInfo } from '@/types/proposal.model'
import { UserPublicInfo } from '@/types/user.model'
import { TaskPublicInfo } from '@/types/tasks.model'
import useMarketerProposalChat from '@/components/marketer/task/task-proposals/markter-task-proposal-chat'
import useMarketerTaskProposalContract from '@/components/marketer/task/task-proposals/markter-task-proposal-conract'
import variables from '@/assets/variables'
import AppButton from '@/components/common/AppButton.vue'
import AppLink from '@/components/common/AppLink.vue'
import AppAvatar from '@/components/common/AppAvatar.vue'
import AppIcon from '@/components/common/AppIcon.vue'
import SocialMedia from '@/components/marketer/task/task-proposals/ProporsalSocialMedia.vue'

export default defineComponent({
  name: 'TaskProposalsListItem',
  components: {
    SocialMedia,
    AppButton,
    AppLink,
    AppAvatar,
    AppIcon,
  },
  props: {
    proposal: {
      type: Object as PropType<ProposalPublicInfo>,
      required: true,
    },
    taskId: {
      type: String,
      required: true,
    },
    task: {
      type: Object as PropType<TaskPublicInfo>,
      required: false,
    },
    user: {
      type: Object as PropType<UserPublicInfo>,
      required: false,
    },
  },
  setup(props) {
    const detailsTriggerHidden = ref(false)
    const content = ref<HTMLElement | null>(null)
    const { goToChat } = useMarketerProposalChat()
    const { goToProposal } = useMarketerTaskProposalContract()

    const showDetails = () => {
      content.value?.classList.toggle('line-clamped')
      detailsTriggerHidden.value = true
    }

    const checkDescriptionVisibility = () => {
      const descriptionElement = content.value as HTMLParagraphElement
      const lineHeight = window.getComputedStyle(descriptionElement).getPropertyValue('line-height')
      const lineHeightInt = parseInt(lineHeight)

      if (descriptionElement.scrollHeight > lineHeightInt * 3) {
        descriptionElement.classList.remove('truncated')
      }
      if (descriptionElement.scrollHeight <= lineHeightInt * 3) {
        descriptionElement.classList.add('truncated')
      }
    }

    const moneySpentText = computed(() => {
      const moneyTransferred = props.proposal?.influencerInfo?.moneyTransferred
      if (moneyTransferred || moneyTransferred === 0) {
        return `$${moneyTransferred}`
      }
      return '-'
    })

    const locationText = computed(() => {
      const location = props.proposal?.influencerInfo?.location
      if (location) return location?.toString() || '-'
      return '-'
    })

    const ratingText = computed(() => {
      const rating = props.proposal?.influencerInfo?.rating
      if (rating || rating === 0) return `${rating}/5`
      return '-'
    })

    onMounted(() => {
      checkDescriptionVisibility()
      window.addEventListener('resize', checkDescriptionVisibility)
    })

    onBeforeUnmount(() => {
      window.removeEventListener('resize', checkDescriptionVisibility)
    })

    watch(
      () => props.proposal?.description,
      () => {
        setTimeout(checkDescriptionVisibility)
      }
    )

    return {
      variables,
      content,
      moneySpentText,
      locationText,
      ratingText,
      detailsTriggerHidden,
      goToChat,
      goToProposal,
      showDetails,
    }
  },
})
</script>

<style lang="scss" scoped>
@import '@/assets/styles/views/marketer/task/task-proposals/TaskProposalsListItem';
</style>
