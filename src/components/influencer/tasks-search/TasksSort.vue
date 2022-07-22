<template>
  <div class="sort">
    <AppDropdown :values="SORT_OPTIONS" size="md" full-width @change="sortChange" />
  </div>
</template>

<script lang="ts">
import { defineComponent } from 'vue'
import AppDropdown from '@/components/common/AppDropdown.vue'

const SORT_OPTIONS = [
  {
    title: 'Newest',
    slug: 'newest',
  },
  {
    title: 'Client spend',
    slug: 'client_spend',
  },
  {
    title: 'Client rating',
    slug: 'client_rating',
  },
]

export default defineComponent({
  components: {
    AppDropdown,
  },
  setup() {
    const sortChange = (emitedValue: Record<string, unknown>) => {
      console.log(emitedValue)
    }

    return { SORT_OPTIONS, sortChange }
  },
})
</script>
