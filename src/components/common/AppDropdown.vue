<template>
  <div class="dropdown-container" :class="containerClassList">
    <div class="dropdown" :class="classList">
      <input
        v-if="inputId"
        :id="inputId"
        class="hidden-element"
        type="button"
        tabindex="-1"
        role="presentation"
        @click="triggerDropdown"
        @blur="hideDropdown"
      />

      <button type="button" class="dropdown-trigger" @click="bindDropdown">
        <span class="dropdown-current">
          {{ getCurrentText }}
        </span>

        <span class="dropdown-icon">
          <AppIcon :name="icon" :size="short ? 'sm' : 'md'" :color="variables.cPrimary500" :fill="variables.cGrey000" />
        </span>
      </button>

      <transition name="dropdown">
        <div v-if="openDropdown" class="dropdown-items">
          <ul class="list">
            <li v-for="value in values" :key="value.slug" class="list-item" @click="selectItem(value)">
              {{ value.title }}
            </li>
          </ul>
        </div>
      </transition>
    </div>
  </div>
</template>

<script lang="ts">
import { defineComponent, ref, PropType, computed, watch } from 'vue'
import AppIcon from '@/components/common/AppIcon.vue'
import variables from '@/assets/variables'

type AppDropdownSize = 'sm' | 'md' | 'lg'
type AppDropdownShadow = 'md15' | 'smm15' | 'sm'

interface DropdownValue {
  title: string
  slug: string
}

export default defineComponent({
  name: 'AppDropdown',
  components: {
    AppIcon,
  },
  props: {
    modelValue: {
      type: Object as PropType<DropdownValue>,
      required: false,
      default: null,
    },
    values: {
      type: Array as PropType<Array<DropdownValue>>,
      required: true,
    },
    defaultText: {
      type: String,
      default: 'Sort By',
    },
    size: {
      type: String as PropType<AppDropdownSize>,
      default: 'md',
    },
    tall: {
      type: Boolean,
      required: false,
    },
    short: {
      type: Boolean,
      required: false,
    },
    fullWidth: {
      type: Boolean,
      required: false,
    },
    shadow: {
      type: String as PropType<AppDropdownShadow>,
      default: 'md15',
    },
    icon: {
      type: String as PropType<'dropdown' | 'sorting'>,
      default: 'sorting',
    },
    inputId: {
      type: String,
      required: false,
    },
  },
  emits: ['change'],
  setup(props, { emit }) {
    const openDropdown = ref(false)

    const triggerDropdown = () => {
      openDropdown.value = true
    }
    const hideDropdown = () => {
      openDropdown.value = false
    }
    const bindDropdown = () => {
      openDropdown.value = !openDropdown.value
    }

    const selectedItem = ref<DropdownValue | null>(props.modelValue)

    const selectItem = (item: DropdownValue) => {
      selectedItem.value = item
      hideDropdown()
    }

    const emitValue = () => emit('change', selectedItem.value)

    watch(selectedItem, emitValue)

    const getCurrentText = computed(() => (selectedItem.value === null ? props.defaultText : selectedItem.value.title))

    const containerClassList = computed(() => {
      const shadowClass = `--sh-${props.shadow}`
      return `${shadowClass}`
    })

    const classList = computed(() => {
      const shortClass = props.short ? '--short' : ''
      const tallClass = props.tall ? '--tall' : ''
      const fullWidthClass = props.fullWidth ? '--full-width' : ''
      const sizeClass = `--${props.size} ${shortClass} ${tallClass} ${fullWidthClass}`
      return `${sizeClass}`
    })

    return {
      openDropdown,
      triggerDropdown,
      bindDropdown,
      getCurrentText,
      selectItem,
      hideDropdown,
      containerClassList,
      classList,
      variables,
    }
  },
})
</script>

<style lang="scss" scoped>
@import '@/assets/styles/components/common/AppDropdown';
</style>
