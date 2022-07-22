<template>
  <svg
    class="icon profile-icon"
    :width="edgeSize"
    :height="edgeSize"
    :viewBox="`0 0 ${edgeSize} ${edgeSize}`"
    fill="none"
  >
    <circle v-if="outline" cx="20" cy="20" r="19.25" :stroke="color" stroke-width="1.5" :fill="fill" />

    <template v-if="size === 'md'">
      <path
        xmlns="http://www.w3.org/2000/svg"
        fill-rule="evenodd"
        clip-rule="evenodd"
        d="M11.8452 3.5C8.94572 3.5 6.59521 5.8505 6.59521 8.75C6.59521 11.6495 8.94572 14 11.8452 14C14.7447 14 17.0952 11.6495 17.0952 8.75C17.0952 5.8505 14.7447 3.5 11.8452 3.5ZM5.09521 8.75C5.09521 5.02208 8.11729 2 11.8452 2C15.5731 2 18.5952 5.02208 18.5952 8.75C18.5952 12.4779 15.5731 15.5 11.8452 15.5C8.11729 15.5 5.09521 12.4779 5.09521 8.75Z"
        fill="white"
      />
      <path
        xmlns="http://www.w3.org/2000/svg"
        fill-rule="evenodd"
        clip-rule="evenodd"
        d="M11.845 15.5C10.1334 15.5 8.45187 15.9504 6.96942 16.806C5.48697 17.6616 4.25578 18.8922 3.39954 20.3743C3.19233 20.733 2.7336 20.8557 2.37494 20.6485C2.01628 20.4413 1.8935 19.9826 2.10071 19.6239C3.08864 17.9139 4.50918 16.494 6.21961 15.5068C7.93005 14.5197 9.87015 14 11.845 14C13.8199 14 15.76 14.5197 17.4704 15.507C19.1808 16.4942 20.6013 17.9141 21.5892 19.6241C21.7964 19.9828 21.6736 20.4415 21.315 20.6487C20.9563 20.8559 20.4976 20.7331 20.2904 20.3745C19.4342 18.8924 18.203 17.6617 16.7206 16.8061C15.2381 15.9505 13.5566 15.5 11.845 15.5Z"
        fill="white"
      />
    </template>
    <template v-else>
      <path
        fill-rule="evenodd"
        clip-rule="evenodd"
        d="M19.8452 12.5C16.9457 12.5 14.5952 14.8505 14.5952 17.75C14.5952 20.6495 16.9457 23 19.8452 23C22.7447 23 25.0952 20.6495 25.0952 17.75C25.0952 14.8505 22.7447 12.5 19.8452 12.5ZM13.0952 17.75C13.0952 14.0221 16.1173 11 19.8452 11C23.5731 11 26.5952 14.0221 26.5952 17.75C26.5952 21.4779 23.5731 24.5 19.8452 24.5C16.1173 24.5 13.0952 21.4779 13.0952 17.75Z"
        :fill="color"
      />

      <path
        fill-rule="evenodd"
        clip-rule="evenodd"
        d="M19.845 24.5C18.1334 24.5 16.4519 24.9504 14.9694 25.806C13.487 26.6616 12.2558 27.8922 11.3995 29.3743C11.1923 29.733 10.7336 29.8557 10.3749 29.6485C10.0163 29.4413 9.8935 28.9826 10.1007 28.6239C11.0886 26.9139 12.5092 25.494 14.2196 24.5068C15.93 23.5197 17.8702 23 19.845 23C21.8199 23 23.76 23.5197 25.4704 24.507C27.1808 25.4942 28.6013 26.9141 29.5892 28.6241C29.7964 28.9828 29.6736 29.4415 29.315 29.6487C28.9563 29.8559 28.4976 29.7331 28.2904 29.3745C27.4342 27.8924 26.203 26.6617 24.7206 25.8061C23.2381 24.9505 21.5566 24.5 19.845 24.5Z"
        :fill="color"
      />
    </template>
  </svg>
</template>

<script lang="ts">
import { computed, defineComponent, PropType } from 'vue'
import variables from '@/assets/variables'
import { IconSize } from '../AppIcon.vue'

export default defineComponent({
  name: 'ProfileIcon',
  props: {
    color: {
      type: String,
      default: variables.cGrey100,
    },
    fill: {
      type: String,
      default: variables.cGrey300,
    },
    size: {
      type: String as PropType<IconSize>,
      default: 'lg',
    },
    outline: {
      type: Boolean,
      default: true,
    },
  },
  setup(props) {
    const edgeSize = computed(() => {
      if (props.size === 'lg') return 40
      if (props.size === 'md') return 24
      if (props.size === 'sm') return 16
      return 32
    })

    return { variables, edgeSize }
  },
})
</script>
