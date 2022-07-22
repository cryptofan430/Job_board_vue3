<template>
  <AppErrorBox v-if="isError" @clicked="getTask"> task </AppErrorBox>

  <div v-else-if="!isLoading" class="project-details">
    <div class="project-bar">
      <p class="name">
        {{ task?.title }}
      </p>

      <div class="rating">
        <span class="budget"> Budget: {{ currencyFormatted }} </span>
      </div>
    </div>

    <p class="date">Added {{ timeEllapsed.time }} {{ timeEllapsed.unit }} ago</p>

    <p class="content">
      {{ task?.description }}
    </p>

    <div class="platforms">
      <p class="platforms-text">Platform:</p>

      <template v-if="task?.platforms?.length">
        <AppTag v-for="platform in task.platforms" :key="platform" outlined>
          {{ platform.toLowerCase() }}
        </AppTag>
      </template>
    </div>
  </div>
  <AppSkeleton v-else />
</template>

<script lang="ts">
import { defineComponent, watchEffect, ref, PropType, computed } from 'vue'
import AppTag from '@/components/common/AppTag.vue'
import AppSkeleton from '@/components/common/AppSkeleton.vue'
import AppErrorBox from '@/components/common/AppErrorBox.vue'
import variables from '@/assets/variables'
import { getTimeEllapsed } from '@/components/helpers/timeFormatter'
import { TaskPublicInfo } from '@/types/tasks.model'
import { getCurrencySign } from '@/components/helpers/currencyFormatter'

export default defineComponent({
  name: 'ProposalProjectInfo',
  components: {
    AppTag,
    AppSkeleton,
    AppErrorBox,
  },
  props: {
    task: {
      type: Object as PropType<TaskPublicInfo>,
      required: true,
    },
    isLoading: {
      type: Boolean,
      required: true,
    },
    isError: {
      type: Boolean,
      required: true,
    },
  },
  emits: ['get-task'],
  setup(props, { emit }) {
    const getTask = () => emit('get-task')

    const timeEllapsed = ref(getTimeEllapsed())
    const currencyFormatted = computed(() => {
      const currencySign = getCurrencySign(props.task.budget?.currency) || ''
      return `${currencySign}${props.task.budget?.value}`
    })

    watchEffect(() => {
      timeEllapsed.value = getTimeEllapsed(props.task?.addedTime)
    })

    return {
      variables,
      timeEllapsed,
      getTask,
      currencyFormatted,
    }
  },
})
</script>

<style lang="scss" scoped>
@import '@/assets/styles/views/influencer/proposal-submit/ProposalProjectInfo';
</style>
