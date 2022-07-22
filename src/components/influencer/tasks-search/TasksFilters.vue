<template>
  <form class="tasks-filters" @submit.prevent="submitFilters" @reset="resetFilters">
    <div class="title">Filter by</div>

    <div class="filter-wrapper">
      <p class="name">Budget</p>

      <div class="budget-wrapper">
        <div class="budget-input-wrapper" data-currency="$">
          <AppInput
            v-model="taskFiltersLocal.budgetGreaterEqual"
            class="budget-input"
            type="number"
            size="sm"
            short
            :decimals="2"
          />
        </div>

        <div class="budget-input-wrapper" data-currency="$">
          <AppInput
            v-model="taskFiltersLocal.budgetLowerEqual"
            class="budget-input"
            type="number"
            size="sm"
            short
            :decimals="2"
          />
        </div>
      </div>
    </div>

    <div class="filter-wrapper">
      <div class="name">Social media</div>

      <div v-for="platform in platformsIncluded" :key="platform" class="checkbox-container">
        <AppLabel class="social-label">
          <AppCheckbox v-model="platform.isIncluded" class="social-checkbox"></AppCheckbox>

          {{ platform.name }}
        </AppLabel>
      </div>
    </div>

    <div class="buttons-wrapper">
      <AppButton type="submit">Apply</AppButton>

      <AppButton outlined type="reset">Clean</AppButton>
    </div>
  </form>
</template>

<script lang="ts">
import { computed, defineComponent, reactive, watch } from 'vue'
import { convertNumberToString } from '@/components/helpers/strings'
import { isTaskPlatformsEqual, taskPlatforms } from '@/components/helpers/platforms'
import { TaskSocialMediaPlatform } from '@/types/platform.model'
import { TaskFilters } from '@/types/tasks.model'
import AppInput from '@/components/common/AppInput.vue'
import AppButton from '@/components/common/AppButton.vue'
import AppCheckbox from '@/components/common/AppCheckbox.vue'
import AppLabel from '@/components/common/AppLabel.vue'
import useTasksSearch from '@/components/influencer/tasks-search/task-search'

export default defineComponent({
  components: {
    AppButton,
    AppInput,
    AppCheckbox,
    AppLabel,
  },
  setup() {
    const { tasksFilters, fetchWithNewFilters, resetFilters } = useTasksSearch()

    let previousTasksFilters: TaskFilters = { ...tasksFilters }

    const isFiltersEqual = (filters1: TaskFilters, filters2: TaskFilters) => {
      if (!isTaskPlatformsEqual(filters1.platforms, filters2.platforms)) return false
      if (filters1.budgetGreaterEqual !== filters2.budgetGreaterEqual) return false
      if (filters1.budgetLowerEqual !== filters2.budgetLowerEqual) return false
      return true
    }

    const taskFiltersLocal: TaskFilters = reactive({
      platforms: tasksFilters.platforms,
      budgetGreaterEqual: tasksFilters.budgetGreaterEqual,
      budgetLowerEqual: tasksFilters.budgetLowerEqual,
    })

    watch(tasksFilters, (value) => {
      if (!isFiltersEqual(value, previousTasksFilters)) {
        taskFiltersLocal.platforms = value.platforms
        taskFiltersLocal.budgetLowerEqual = value.budgetLowerEqual
        taskFiltersLocal.budgetGreaterEqual = value.budgetGreaterEqual
      }

      previousTasksFilters = { ...value }
    })

    const stringBudgetGreaterEqual = computed(() => convertNumberToString(taskFiltersLocal.budgetGreaterEqual))
    const stringBudgetLowerEqual = computed(() => convertNumberToString(taskFiltersLocal.budgetLowerEqual))

    const isPlatformIncluded = (platform: TaskSocialMediaPlatform) => !!taskFiltersLocal.platforms?.includes(platform)
    const platformsIncluded = computed(() =>
      taskPlatforms.map((platform) => ({
        ...platform,
        isIncluded: isPlatformIncluded(platform.value),
      }))
    )

    const submitFilters = () => {
      const platforms = platformsIncluded.value
      const includedPlatforms = platforms.map((platform) => platform.isIncluded && platform.value).filter(Boolean)

      taskFiltersLocal.platforms = includedPlatforms as TaskSocialMediaPlatform[]

      const { budgetGreaterEqual, budgetLowerEqual } = taskFiltersLocal
      if (budgetGreaterEqual && budgetLowerEqual && budgetGreaterEqual > budgetLowerEqual) {
        taskFiltersLocal.budgetGreaterEqual = undefined
      }

      fetchWithNewFilters(taskFiltersLocal)
    }

    return {
      taskFiltersLocal,
      stringBudgetGreaterEqual,
      stringBudgetLowerEqual,
      platformsIncluded,
      submitFilters,
      resetFilters,
    }
  },
})
</script>

<style lang="scss" scoped>
@import '@/assets/styles/views/influencer/tasks-search/TasksFilters';
</style>
