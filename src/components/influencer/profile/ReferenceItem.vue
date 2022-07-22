<template>
  <div class="reference">
    <div class="header">
      <AppAvatar size="sm" />
      <p class="author">{{ reference.author }}</p>
    </div>
    <p ref="content" class="content">
      {{ reference.content }}
    </p>
    <span v-if="readMore" class="details"> Read more </span>
    <div class="rating">
      <AppIcon name="rating" :color="variables.cSystemYellow500" />
      <p class="rating-value">{{ reference.rating }} / {{ maxRating }}</p>
    </div>
  </div>
</template>

<script lang="ts">
import AppAvatar from '@/components/common/AppAvatar.vue'
import AppIcon from '@/components/common/AppIcon.vue'
import variables from '@/assets/variables'
import { ref, onMounted } from 'vue'

// prototype only
const maxRating = 5
const maxContentHeight = 80

export default {
  name: 'ReferenceItem',
  components: {
    AppAvatar,
    AppIcon,
  },
  props: {
    reference: {
      type: Object,
      required: true,
    },
  },
  setup() {
    // prototype only
    const content = ref<HTMLDivElement | null>(null)
    const readMore = ref(false)
    const getContentLength = () => content.value?.offsetHeight

    onMounted(() => {
      const contentLength = getContentLength()
      readMore.value = contentLength !== undefined && contentLength > maxContentHeight
    })

    return {
      maxRating,
      variables,
      content,
      readMore,
    }
  },
}
</script>

<style lang="scss" scoped>
@import '@/assets/styles/views/influencer/profile/ReferenceItem';
</style>
