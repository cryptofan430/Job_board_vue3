<template>
  <form class="search-bar" @submit.prevent="submitSearchbarValue">
    <AppInput v-model="searchBarValueLocal" class="search-input" full-width />

    <AppButton class="search-button" type="submit"> Search </AppButton>
  </form>
</template>

<script lang="ts">
import { defineComponent, watch, ref } from 'vue'
import AppInput from '@/components/common/AppInput.vue'
import AppButton from '@/components/common/AppButton.vue'
import useTasksSearch from '@/components/influencer/tasks-search/task-search'

export default defineComponent({
  components: {
    AppInput,
    AppButton,
  },
  setup() {
    const { searchBarValue, fetchWithNewSearchBarValue } = useTasksSearch()

    const searchBarValueLocal = ref(searchBarValue.value || '')

    watch(
      () => searchBarValue.value,
      () => {
        searchBarValueLocal.value = searchBarValue.value
      }
    )

    const submitSearchbarValue = () => {
      fetchWithNewSearchBarValue(searchBarValueLocal.value)
    }

    return {
      searchBarValueLocal,
      submitSearchbarValue,
    }
  },
})
</script>

<style lang="scss" scoped>
@import '@/assets/styles/views/influencer/tasks-search/TasksSearchBar';
</style>
