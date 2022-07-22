<template>
  <div class="tag" :class="classList">
    <span class="tag-text">
      <slot></slot>
    </span>

    <button v-if="removable" class="remove-icon-wrapper" @click.stop="removeTag">
      <AppIcon name="delete" size="sm" :color="variables.cGrey400" />
    </button>
  </div>
</template>

<script lang="ts">
import { defineComponent, PropType } from 'vue'
import AppIcon from '@/components/common/AppIcon.vue'
import variables from '@/assets/variables'

export default defineComponent({
  name: 'AppTag',
  components: {
    AppIcon,
  },
  props: {
    sm: {
      type: Boolean,
      required: false,
    },
    removable: {
      type: Boolean,
      default: false,
    },
    value: {
      type: [String, Object] as PropType<unknown>,
      required: false,
    },
  },
  emits: ['remove'],
  setup(props, { emit }) {
    const classList = props.sm ? '--sm' : '--md'

    const removeTag = () => emit('remove', props.value)

    return { classList, removeTag, variables }
  },
})
</script>

<style lang="scss" scoped>
@import '@/assets/styles/components/common/AppTag';
</style>
