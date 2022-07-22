<template>
  <svg class="completion-progress" width="26" height="26" viewBox="0 0 26 26" fill="none">
    <circle cx="13" cy="13" r="12" :stroke="variables.cGrey200" stroke-width="2" />

    <circle
      class="progress-circle"
      cx="13"
      cy="13"
      r="12"
      :stroke="variables.cPrimary500"
      stroke-width="2"
      :stroke-dasharray="strokeDashArray"
      :style="{ strokeDashoffset }"
    />
  </svg>
</template>

<script lang="ts">
import { computed, defineComponent } from 'vue'
import variables from '@/assets/variables'

export default defineComponent({
  name: 'AppCompletionProgress',
  props: {
    percent: {
      type: Number,
      required: true,
    },
  },
  setup(props) {
    const circumference = 12 * 2 * Math.PI
    const strokeDashArray = `${circumference} ${circumference}`
    const strokeDashoffset = computed(() => circumference - (props.percent / 100) * circumference)

    return {
      strokeDashArray,
      strokeDashoffset,
      variables,
    }
  },
})
</script>

<style lang="scss" scoped>
.progress-circle {
  transform: rotate(-90deg);
  transform-origin: 50% 50%;
  transition: stroke-dashoffset 0.35s linear;
}
</style>
