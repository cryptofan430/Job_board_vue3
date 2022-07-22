<template>
  <div class="chat-filters">
    <div class="chat-filters-content">
      <div class="chat-search-wrapper">
        <AppInputDecoration>
          <template #default="{ classList }">
            <AppInput search short size="md" shadow="smm15" class="chat-search" model-value="" :class="classList" />
          </template>

          <template #leftIcon>
            <AppIcon class="chat-search-icon" name="search" size="sm" />
          </template>
        </AppInputDecoration>
      </div>

      <div class="chat-recent-filters">
        <AppLabel class="recent-filters-label" size="sm" for="chat-filter"> View Only </AppLabel>

        <AppDropdown
          class="chat-recent-filter-dropdown"
          default-text="Recent"
          icon="dropdown"
          input-id="chat-filter"
          short
          shadow="smm15"
          :values="FILTERS_OPTIONS"
        />
      </div>
    </div>
  </div>
</template>

<script lang="ts">
import { defineComponent } from 'vue'
import AppInput from '@/components/common/AppInput.vue'
import AppDropdown from '@/components/common/AppDropdown.vue'
import AppIcon from '@/components/common/AppIcon.vue'
import AppLabel from '@/components/common/AppLabel.vue'
import AppInputDecoration from '@/components/common/AppInputDecoration.vue'

const FILTERS_OPTIONS = [
  {
    title: 'Recent',
    slug: 'recent',
  },
]

export default defineComponent({
  components: {
    AppInputDecoration,
    AppInput,
    AppLabel,
    AppIcon,
    AppDropdown,
  },
  setup() {
    return { FILTERS_OPTIONS }
  },
})
</script>

<style lang="scss" scoped>
@import '@/assets/styles/components/chat/sidebar/ChatFilters';
</style>
