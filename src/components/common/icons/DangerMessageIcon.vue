<template>
  <svg class="icon danger-message-icon" :width="edgeSize" :height="edgeSize" :viewBox="`0 0 ${edgeSize} ${edgeSize}`">
    <path
      fill-rule="evenodd"
      clip-rule="evenodd"
      d="M11.9999 2.85002C6.9465 2.85002 2.8499 6.94662 2.8499 12C2.8499 17.0534 6.9465 21.15 11.9999 21.15C17.0533 21.15 21.1499 17.0534 21.1499 12C21.1499 6.94662 17.0533 2.85002 11.9999 2.85002ZM1.1499 12C1.1499 6.00774 6.00761 1.15002 11.9999 1.15002C17.9922 1.15002 22.8499 6.00774 22.8499 12C22.8499 17.9923 17.9922 22.85 11.9999 22.85C6.00761 22.85 1.1499 17.9923 1.1499 12Z"
      fill="white"
    />
    <path
      fill-rule="evenodd"
      clip-rule="evenodd"
      d="M15.6009 8.39898C15.9329 8.73093 15.9329 9.26912 15.6009 9.60107L9.60094 15.6011C9.269 15.933 8.73081 15.933 8.39886 15.6011C8.06692 15.2691 8.06692 14.7309 8.39886 14.399L14.3989 8.39898C14.7308 8.06704 15.269 8.06704 15.6009 8.39898Z"
      fill="white"
    />
    <path
      fill-rule="evenodd"
      clip-rule="evenodd"
      d="M8.39886 8.39898C8.73081 8.06704 9.269 8.06704 9.60094 8.39898L15.6009 14.399C15.9329 14.7309 15.9329 15.2691 15.6009 15.6011C15.269 15.933 14.7308 15.933 14.3989 15.6011L8.39886 9.60107C8.06692 9.26912 8.06692 8.73093 8.39886 8.39898Z"
      fill="white"
    />
    />
  </svg>
</template>

<script lang="ts">
import { computed, defineComponent, PropType } from 'vue'
import variables from '@/assets/variables'
import { IconSize } from '../AppIcon.vue'

export default defineComponent({
  name: 'DangerMessageIcon',
  props: {
    color: {
      type: String,
      default: variables.cGrey000,
    },
    size: {
      type: String as PropType<IconSize>,
      default: 'lg',
    },
  },
  setup(props) {
    const edgeSize = computed(() => {
      if (props.size === 'md') return 24
      if (props.size === 'sm') return 16
      return 32
    })

    return { edgeSize }
  },
})
</script>
