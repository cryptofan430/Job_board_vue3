import { computed } from 'vue'
import { EntitiesLoadingState } from '@/types/api.model'

export const extractEntitiesLoadingState = (state: EntitiesLoadingState) => {
  const isLoading = computed(() => state.state === 'loading')
  const isError = computed(() => state.state === 'error')
  const isLoaded = computed(() => state.state === 'loaded')

  return {
    isLoading,
    isError,
    isLoaded,
  }
}
