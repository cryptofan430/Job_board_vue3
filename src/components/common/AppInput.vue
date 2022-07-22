<template>
  <input v-model="vmodel" class="input" :class="classList" :type="type" />
</template>

<script lang="ts">
import { defineComponent, PropType, computed, watch } from 'vue'

type AppInputSize = 'xl' | 'lg' | 'md' | 'sm'
type AppInputShadow = 'md15' | 'smm15' | 'sm'

export default defineComponent({
  name: 'AppInput',
  props: {
    modelValue: {
      type: [String, Number],
      required: false,
    },
    size: {
      type: String as PropType<AppInputSize>,
      default: 'md',
    },
    short: {
      type: Boolean,
      required: false,
    },
    search: {
      type: Boolean,
      required: false,
    },
    shadow: {
      type: String as PropType<AppInputShadow>,
      default: 'md15',
    },
    error: {
      type: Boolean,
      required: false,
    },
    type: {
      type: String,
      required: false,
    },
    decimals: {
      type: Number,
      required: false,
    },
    responsive: {
      type: Boolean,
      required: false,
    },
    fullWidth: {
      type: Boolean,
      required: false,
    },
  },
  emits: ['update:modelValue'],
  setup(props, { emit }) {
    const vmodel = computed<string>({
      get() {
        return props.modelValue as string
      },
      set(val) {
        if (props.type === 'number') {
          const numericValue = Number(val)
          if ((numericValue === 0 && val !== '') || numericValue) emit('update:modelValue', numericValue)
          else emit('update:modelValue', undefined)
        }

        if (props.type !== 'number') emit('update:modelValue', val)
      },
    })

    const classList = computed(() => {
      const size = props.short || props.responsive ? `--${props.size}` : ''
      const short = props.short ? '--short' : '--tall'
      const search = props.search ? '--search' : ''
      const error = props.error ? `--error` : ''
      const shadow = `--sh-${props.shadow}`
      const responsive = props.responsive ? '--responsive' : ''
      const fullWidth = props.fullWidth ? '--full-width' : ''

      return `${size} ${short} ${search} ${error} ${shadow} ${responsive} ${fullWidth}`
    })

    if (props.type === 'number' && typeof props.decimals === 'number') {
      watch(vmodel, (val) => {
        if (Number(val) % 1 !== 0) {
          vmodel.value = Number(val).toFixed(props.decimals).toString()
        }
      })
    }

    return {
      vmodel,
      classList,
    }
  },
})
</script>

<style lang="scss" scoped>
@import '@/assets/styles/components/common/AppInput';
</style>
