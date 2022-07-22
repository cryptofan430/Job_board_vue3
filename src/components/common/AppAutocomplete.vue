<template>
  <div class="c-root autocomplete" :class="rootClassList" @focusin="toggleVisibility" @focusout="hide">
    <AppLabel v-if="inputId" class="c-autocomplete-label" tabindex="-1" :for="inputId">
      {{ labelText }}
    </AppLabel>

    <div class="c-autocomplete-wrapper" :class="wrapperClassList">
      <AppTag
        v-for="option in selectedOptions"
        :key="option.value"
        class="c-autocomplete-value"
        tabindex="0"
        removable
        :value="option"
        @remove="removeOption"
      >
        {{ option.label }}
      </AppTag>

      <div class="c-options-wrapper" tabindex="0">
        <input
          :id="inputId"
          ref="inputEl"
          v-model="inputElValue"
          class="c-autocomplete-input"
          :class="classList"
          :placeholder="placeholder"
        />

        <transition name="autocomplete">
          <ul v-if="isExpanded" class="c-options">
            <li
              v-for="option in autocompleteOptions"
              :key="option.value"
              class="c-option"
              :class="{ 'c-option_selected': option.selected }"
            >
              <label tabindex="0" class="c-autocomplete-checkbox-label" @keypress.enter="selectOption(option)">
                <AppCheckbox
                  :model-value="option.selected"
                  :disabled="itemsSelected >= maxItems && !option.selected"
                  class="c-autocomplete-checkbox"
                  tabindex="-1"
                  @update:modelValue="selectOption(option)"
                />

                {{ option.label }}
              </label>
            </li>
          </ul>
        </transition>
      </div>
    </div>
  </div>
</template>

<script lang="ts">
import { computed, defineComponent, PropType, reactive, ref, watch } from 'vue'
import AppLabel from '@/components/common/AppLabel.vue'
import AppCheckbox from '@/components/common/AppCheckbox.vue'
import AppTag from '@/components/common/AppTag.vue'

export interface SelectOption {
  label: string
  value: string
}

type AppAutocompleteSize = 'sm' | 'md' | 'lg' | 'xl'

export default defineComponent({
  name: 'AppAutocomplete',
  components: {
    AppLabel,
    AppTag,
    AppCheckbox,
  },
  props: {
    options: {
      type: Array as PropType<Array<SelectOption>>,
      default: () => [],
    },
    modelValue: {
      type: Array as PropType<Array<string> | undefined>,
      required: false,
    },
    inputValue: {
      type: String,
      required: false,
    },
    inputId: {
      type: String,
      required: false,
    },
    labelText: {
      type: String,
      required: true,
    },
    size: {
      type: String as PropType<AppAutocompleteSize>,
      default: '',
    },
    tall: {
      type: Boolean,
      required: false,
    },
    short: {
      type: Boolean,
      required: false,
    },
    maxItems: {
      type: Number,
      default: Number.MAX_SAFE_INTEGER,
    },
    placeholder: {
      type: String,
      default: '',
    },
  },
  emits: ['update:modelValue'],
  setup(props, { emit }) {
    const isExpanded = ref(false)
    const timer = ref<null | number>(null)
    const inputEl = ref<HTMLElement | null>(null)
    const inputElValue = ref(props.inputValue)

    watch(
      () => props.inputValue,
      () => {
        inputElValue.value = props.inputValue
      }
    )

    const autocompleteOptions = computed(() => {
      const selectOptions = props.options
      if (!selectOptions) {
        return []
      }
      const options = selectOptions.map((option) =>
        reactive({
          ...option,
          selected: props.modelValue?.includes(option.value) || false,
        })
      )
      return options
    })

    const filteredOptions = computed(() => {
      const searchValue = inputElValue.value?.toLowerCase() || ''
      const isOptionMatch = (option: SelectOption) => {
        const optionValue = option.label?.toLowerCase()
        return !!optionValue?.includes(searchValue)
      }
      const filteredOptions = autocompleteOptions.value.filter(isOptionMatch)

      return filteredOptions
    })

    const selectedOptions = computed(() => {
      const selectedOptions = autocompleteOptions.value.filter((option) => option.selected)
      return selectedOptions
    })

    const itemsSelected = computed(() => selectedOptions.value?.length || 0)

    const clearTimer = () => {
      if (timer.value) {
        clearTimeout(timer.value)
        timer.value = null
      }
    }

    const focusInputEl = () => {
      if (inputEl.value && document.activeElement !== inputEl.value) {
        inputEl.value?.focus()
      }
    }

    const toggleVisibility = () => {
      clearTimer()
      focusInputEl()
      if (!isExpanded.value) {
        isExpanded.value = true
      }
    }

    const hide = () => {
      if (!timer.value) {
        timer.value = setTimeout(() => {
          isExpanded.value = false
        })
      }
    }

    const selectOption = (option: SelectOption & { selected: boolean }) => {
      const currentValue = props.modelValue || []
      const isSelected = option?.selected
      if (!isSelected && !(selectedOptions.value.length + 1 > props.maxItems)) {
        option.selected = true
        const newValue = [...currentValue, option.value]
        emit('update:modelValue', newValue)
      }
      if (isSelected) {
        option.selected = false
        const newValue = currentValue.filter((val) => val !== option.value)
        emit('update:modelValue', newValue)
      }
    }

    const removeOption = (option: SelectOption & { selected: boolean }) => {
      focusInputEl()

      const isValueSelected = props.modelValue?.includes(option.value)
      option.selected = false
      if (isValueSelected) {
        const newValue = props.modelValue?.filter((val) => val !== option.value)
        emit('update:modelValue', newValue || [])
      }
    }

    const classList = computed(() => {
      const shortClass = props.short ? '--short' : ''
      const tallClass = props.tall ? '--tall' : ''
      const sizeClass = `${shortClass} ${tallClass}`
      return `${sizeClass}`
    })

    const wrapperClassList = computed(() => {
      const activenessClass = isExpanded.value ? '--active' : ''
      const sizeClass = `--${props.size}`

      return `${activenessClass} ${sizeClass}`
    })

    const rootClassList = computed(() => {
      const maxItemsClasses = selectedOptions.value.length >= props.maxItems ? '--max-items' : ''

      return `${maxItemsClasses}`
    })

    return {
      autocompleteOptions: filteredOptions,
      inputEl,
      inputElValue,
      classList,
      wrapperClassList,
      rootClassList,
      isExpanded,
      selectedOptions,
      hide,
      focusInputEl,
      toggleVisibility,
      itemsSelected,
      selectOption,
      removeOption,
    }
  },
})
</script>

<style lang="scss" scoped>
@import '@/assets/styles/components/common/AppAutocomplete';
</style>
