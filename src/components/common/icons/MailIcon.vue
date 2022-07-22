<template>
  <svg class="icon mail-icon" width="24" height="24" viewBox="0 0 24 24">
    <path
      fill-rule="evenodd"
      clip-rule="evenodd"
      d="M2.25 5.25C2.25 4.83579 2.58579 4.5 3 4.5H21C21.4142 4.5 21.75 4.83579 21.75 5.25V18C21.75 18.3978 21.592 18.7794 21.3107 19.0607C21.0294 19.342 20.6478 19.5 20.25 19.5H3.75C3.35218 19.5 2.97065 19.342 2.68934 19.0607C2.40804 18.7794 2.25 18.3978 2.25 18V5.25ZM3.75 6V18H20.25V6H3.75Z"
      :fill="color"
    />

    <path
      fill-rule="evenodd"
      clip-rule="evenodd"
      d="M2.44714 4.74321C2.72703 4.43787 3.20146 4.41724 3.5068 4.69714L12 12.4826L20.4932 4.69714C20.7985 4.41724 21.273 4.43787 21.5529 4.74321C21.8328 5.04855 21.8121 5.52298 21.5068 5.80287L12.5068 14.0529C12.2201 14.3157 11.78 14.3157 11.4932 14.0529L2.49321 5.80287C2.18787 5.52298 2.16724 5.04855 2.44714 4.74321Z"
      :fill="color"
    />
  </svg>
</template>

<script lang="ts">
import { defineComponent } from 'vue'
import variables from '@/assets/variables'

export default defineComponent({
  name: 'MailIcon',
  props: {
    color: {
      type: String,
      default: variables.cGrey000,
    },
  },
})
</script>
