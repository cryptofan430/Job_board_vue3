<template>
  <div class="contract">
    <router-link
      :to="{
        name: taskContract.contract?.accepted ? 'ContractManagement' : 'ContractAccept',
        params: {
          taskId: taskContract.task?.id,
          contractId: taskContract.contract?.id,
        },
      }"
    >
      <p class="name">{{ taskContract.task?.title }}</p>
    </router-link>

    <p ref="content" class="desc line-clamped">
      {{ taskContract.task?.description }}
    </p>

    <p
      v-if="!detailsTriggerHidden"
      class="read-more-button"
      tabindex="0"
      @keydown.enter="showDetails"
      @click="showDetails"
    >
      Details
    </p>

    <div class="contract-footer">
      <div class="footer-col marketer-col">
        <p class="footer-title">Marketer</p>

        <div class="marketer-box">
          <AppAvatar
            :img-url="taskContract.userStateInfo?.avatarSimpleAccessFile?.signedUrl"
            size="xs"
            status="online"
          />

          <div class="marketer-content">
            <p class="marketer-name">
              {{ taskContract.userStateInfo?.firstName }} {{ taskContract.userStateInfo?.lastName }}
            </p>

            <p class="company">Company</p>
          </div>
        </div>
      </div>

      <div v-if="displayedMilsestone" class="footer-col milestone-col --milestone">
        <p class="footer-title">Milestone</p>

        <div class="milestone-box">
          <AppCompletionProgress :percent="activeMilestoreProgress" />

          <p class="milestone-content">
            {{ displayedMilsestone?.description }}
          </p>
        </div>
      </div>
    </div>
  </div>
</template>

<script lang="ts">
import { computed, defineComponent, onBeforeUnmount, onMounted, PropType, ref, watch } from 'vue'
import AppAvatar from '@/components/common/AppAvatar.vue'
import AppCompletionProgress from '@/components/common/AppCompletionProgress.vue'
import { ContractWithTask } from '@/types/contract.model'
import { extractActiveMilestone, extractMilestoneProgress } from '@/components/helpers/milestones'

export default defineComponent({
  name: 'ContractItem',
  components: {
    AppAvatar,
    AppCompletionProgress,
  },
  props: {
    taskContract: {
      type: Object as PropType<ContractWithTask>,
      required: true,
    },
  },
  setup(props) {
    const displayedMilsestone = computed(() => extractActiveMilestone(props.taskContract.contract?.milestones))
    const activeMilestoreProgress = computed(() => extractMilestoneProgress(props.taskContract.contract?.milestones))

    const content = ref<HTMLDivElement | null>(null)
    const detailsTriggerHidden = ref(false)

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

    onMounted(() => {
      checkDescriptionVisibility()
      window.addEventListener('resize', checkDescriptionVisibility)
    })

    onBeforeUnmount(() => {
      window.removeEventListener('resize', checkDescriptionVisibility)
    })

    watch(
      () => props.taskContract.task?.description,
      () => {
        setTimeout(checkDescriptionVisibility)
      }
    )

    return {
      content,
      detailsTriggerHidden,
      displayedMilsestone,
      activeMilestoreProgress,
      showDetails,
    }
  },
})
</script>

<style lang="scss" scoped>
@import '@/assets/styles/views/influencer/contracts/ContractItem';
</style>
