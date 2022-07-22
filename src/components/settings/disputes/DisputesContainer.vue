<template>
  <div class="disputes-container">
    <section class="disputes-sectiom">
      <h2 class="disputes-section-header">Open Disputes</h2>
      <ul class="disputes">
        <DisputesListItem v-for="dispute in disputes" :key="dispute.id" :dispute="dispute" :is-marketer="isMarketer" />
      </ul>
    </section>
  </div>
</template>

<script lang="ts">
import { defineComponent, PropType } from 'vue'
import DisputesListItem from '@/components/settings/disputes/DisputeListItem.vue'
import { DisputePublicInfo } from '@/types/disputes'

export default defineComponent({
  name: 'DisputesContainer',
  components: {
    DisputesListItem,
  },
  props: {
    disputes: {
      type: Array as PropType<Array<DisputePublicInfo>>,
      required: true,
    },
    isMarketer: {
      type: Boolean,
      required: true,
    },
  },
})
</script>

<style lang="scss" scoped>
@import '@/assets/styles/views/settings/disputes/DisputesContainer';
</style>
