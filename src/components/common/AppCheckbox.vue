<template>
  <label class="checkbox" :class="classList">
    <input
      :id="id"
      v-model="vmodel"
      class="checkbox-real"
      type="checkbox"
      :disabled="disabled"
      :name="name"
      :value="value"
    />

    <span class="checkbox-fake"></span>
  </label>
</template>

<script lang="ts">
import { computed, defineComponent } from 'vue'
export default defineComponent({
  name: 'AppCheckbox',
  props: {
    modelValue: {
      type: [String, Number, Object, Array, Boolean],
      required: true,
    },
    id: {
      type: String,
      required: false,
    },
    name: {
      type: String,
      required: false,
    },
    value: {
      type: [String, Number, Object, Array, Boolean],
      required: false,
    },
    disabled: {
      type: Boolean,
      default: false,
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
      const disabledClasses = props.disabled ? '--disabled' : ''

      return `${disabledClasses}`
    })

    return { vmodel, classList }
  },
})
</script>

<style lang="scss" scoped>
@import '@/assets/styles/components/common/AppCheckbox';
</style>
