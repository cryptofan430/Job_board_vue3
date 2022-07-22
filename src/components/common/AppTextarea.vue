<template>
  <textarea v-model="vmodel" class="textarea" :class="classList"></textarea>
</template>

<script lang="ts">
import { computed, defineComponent, PropType } from 'vue'

type AppTextareaSize = 'lg' | 'md'

export default defineComponent({
  name: 'AppTextarea',
  props: {
    modelValue: {
      type: [String, Number],
      required: true,
    },
    size: {
      type: String as PropType<AppTextareaSize>,
      default: 'md',
    },
    error: {
      type: Boolean,
      required: false,
    },
  },
  emits: ['update:modelValue'],
  setup(props, { emit }) {
    const vmodel = computed({
      get() {
        return props.modelValue
      },
      set(val) {
        emit('update:modelValue', val)
      },
    })

    const classList = computed(() => {
      const error = props.error ? `--error` : ''
      return `--${props.size} ${error}`
    })

    return {
      classList,
      vmodel,
    }
  },
})
</script>

<style lang="scss" scoped>
@import '@/assets/styles/components/common/AppTextarea';
</style>
