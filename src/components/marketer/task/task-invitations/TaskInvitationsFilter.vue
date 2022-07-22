<template>
  <div class="filter">
    <AppDropdown
      :model-value="selectedValue"
      :values="PLATFORMS_OPTIONS"
      default-text="Social media"
      size="sm"
      @change="sortChange"
    />
  </div>
</template>

<script lang="ts">
import { computed, defineComponent } from 'vue'
import AppDropdown from '@/components/common/AppDropdown.vue'

const PLATFORMS_OPTIONS = [
  {
    title: 'Any',
    slug: undefined,
  },
  {
    title: 'Instagram',
    slug: 'instagram',
  },
  {
    title: 'Youtube',
    slug: 'youtube',
  },
  {
    title: 'Twitch',
    slug: 'twitch',
  },
]

export default defineComponent({
  components: { AppDropdown },
  props: {
    socialMediaPlatform: {
      type: String,
      default: '',
    },
  },
  emits: ['update-filter'],
  setup(props, { emit }) {
    const sortChange = (emitedValue: Record<string, unknown>) => {
      emit('update-filter', emitedValue.slug)
    }
    const selectedValue = computed(() => PLATFORMS_OPTIONS.find((option) => option.slug === props.socialMediaPlatform))
    return { PLATFORMS_OPTIONS, selectedValue, sortChange }
  },
})
</script>
