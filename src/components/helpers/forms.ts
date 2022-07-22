import {
  FieldSetPayload,
  FieldSetsListController,
  FormItemController,
  FormItemOptions,
  FieldSetController,
  UIElementState,
  GeneralType,
} from '@/types/ui.model'
import { computed, isRef, reactive, Ref, ref, UnwrapRef } from 'vue'

const createDefaultUiElementState = (): UIElementState => ({
  state: 'ok',
  payload: {
    message: undefined,
  },
})

export const createFormItem = <T extends unknown>(
  value?: T,
  options?: FormItemOptions<T>
): UnwrapRef<FormItemController<T>> => {
  const actualState = reactive(options?.state || createDefaultUiElementState())
  const actualValue = (isRef(value) ? value : ref(value)) as T extends Ref<infer S>
    ? Ref<GeneralType<S>>
    : Ref<GeneralType<T>>

  const isError = computed(() => actualState.state === 'error')

  const getErrorMessage = computed(() => actualState.payload?.message)

  const setError = (errorMessage: string) => {
    actualState.state = 'error'
    actualState.payload = { message: errorMessage }
  }

  const setNormalState = () => {
    actualState.state = 'ok'
    actualState.payload = { message: undefined }
  }

  const setDisabledState = (message?: string) => {
    actualState.state = 'disabled'
    actualState.payload = { message }
  }

  const setReadonlyState = (message?: string) => {
    actualState.state = 'readonly'
    actualState.payload = { message }
  }

  const validate = () => {
    let isValid = true

    options?.validators?.every((validator) => {
      const validationResult = validator(actualValue.value as UnwrapRef<GeneralType<T>>)
      if (validationResult === true || validationResult === '') {
        setNormalState()
        return (isValid = true)
      }
      if (typeof validationResult === 'string') {
        setError(validationResult)
        return (isValid = false)
      }
      setError('Field value is not valid')
      return (isValid = false)
    })

    return isValid
  }

  const setValue = (
    value: UnwrapRef<T extends number ? number : T extends string ? string : T extends boolean ? boolean : T>
  ) => {
    actualValue.value = value
  }

  const getValue = () => {
    if (options?.formatters?.length) {
      return options.formatters.reduce(
        (acc, func) => func(acc as UnwrapRef<GeneralType<T>>),
        actualValue.value
      ) as GeneralType<T>
    }
    return actualValue.value as GeneralType<T>
  }

  return reactive({
    value: actualValue,
    isError,
    getErrorMessage,
    getValue,
    setValue,
    setError,
    setDisabledState,
    setReadonlyState,
    setNormalState,
    validate,
  })
}

export const createFormFieldSet = <T extends FieldSetPayload>(fieldSet: T): UnwrapRef<FieldSetController<T>> => {
  const state = reactive(createDefaultUiElementState())

  const isError = computed(() => state?.state === 'error')
  const getErrorMessage = computed(() => state.payload?.message)

  const setError = (errorMessage: string) => {
    state.state = 'error'
    state.payload = { message: errorMessage }
  }

  const setNormalState = () => {
    state.state = 'ok'
    state.payload = { message: undefined }
  }

  const setDisabledState = (message?: string) => {
    state.state = 'disabled'
    state.payload = { message }
  }

  const setReadonlyState = (message?: string) => {
    state.state = 'readonly'
    state.payload = { message }
  }

  const validate = () => {
    const formItems = Object.values(fieldSet)
    let isValid = true

    formItems.forEach((item) => {
      if (!item.validate()) isValid = false
    })

    if (isValid) setNormalState()

    return isValid
  }

  const getValue = () => {
    const formValue = {} as {
      [k in keyof T]-?: ReturnType<FormItemController<T[k]>['getValue']>
    }
    const fieldSetKeys = Object.keys(fieldSet) as (keyof T)[]
    for (const key of fieldSetKeys) {
      formValue[key] = fieldSet[key]?.getValue() as ReturnType<FormItemController<T[typeof key]>['getValue']>
    }
    // eslint-disable-next-line @typescript-eslint/no-explicit-any
    return formValue as any
  }

  return reactive({
    fieldSet,
    isError,
    getErrorMessage,
    getValue,
    setError,
    setDisabledState,
    setReadonlyState,
    setNormalState,
    validate,
  })
}

// eslint-disable-next-line @typescript-eslint/ban-types
export const createFormArray = <T extends UnwrapRef<FieldSetController<{}>>>(
  fieldSets: T[],
  options?: FormItemOptions<Array<ReturnType<T['getValue']>>>
): UnwrapRef<FieldSetsListController<T>> => {
  const reactiveFieldSets = reactive(fieldSets)

  const state = reactive(createDefaultUiElementState())
  const isError = computed(() => state.state === 'error')

  const getErrorMessage = computed(() => state.payload?.message)

  const setError = (errorMessage: string) => {
    state.state = 'error'
    state.payload.message = errorMessage
  }

  const setNormalState = () => {
    state.state = 'ok'
    state.payload = { message: undefined }
  }

  const setDisabledState = (message?: string) => {
    state.state = 'disabled'
    state.payload = { message }
  }

  const setReadonlyState = (message?: string) => {
    state.state = 'readonly'
    state.payload = { message }
  }

  const add = (...fieldSet: Array<T>) => reactiveFieldSets.push(...reactive(fieldSet))
  const removeAt = (index: number) => reactiveFieldSets.splice(index, 1)

  const getValue = () => {
    const fieldSetValues = fieldSets.map((fieldSet) => fieldSet.getValue()) as Array<ReturnType<T['getValue']>>
    return fieldSetValues
  }

  const validate = () => {
    let isValid = true

    fieldSets.forEach((fieldSet) => {
      const isFieldSetValid = fieldSet.validate()
      if (!isFieldSetValid) isValid = false
    })

    if (!isValid) return false

    const formValue = reactive(getValue())

    options?.validators?.every((validator) => {
      const validationResult = validator(formValue)
      if (validationResult === true || validationResult === '') {
        setNormalState()
        return (isValid = true)
      }
      if (typeof validationResult === 'string') {
        setError(validationResult)
        return (isValid = false)
      }

      setError('Field value is not valid')
      return (isValid = false)
    })

    return isValid
  }

  return reactive({
    fieldSets: reactiveFieldSets,
    getErrorMessage,
    isError,
    getValue,
    add,
    removeAt,
    setError,
    setDisabledState,
    setReadonlyState,
    setNormalState,
    validate,
  })
}

const requiredValidator = (value: number | string | unknown) => {
  if (!value && value !== 0 && value !== false) return 'Field is required'
  return true
}

const arrayMinLengthValidator = (minValue: number, errorMessage: (itemsLength: number) => string) => {
  return (items: Array<unknown>) => {
    if (items.length < minValue) return errorMessage(items.length)
    return true
  }
}

const stringMinLengthValidator = (minValue: number, errorMessage: (itemLength: number) => string) => {
  return (value: string) => {
    if (value.length < minValue) return errorMessage(value.length)
    return true
  }
}

const stringTrimmedMinLength = (minValue: number, errorMessage: (itemLength: number) => string) => {
  return (value: string) => {
    if (value?.trim().length < minValue) return errorMessage(value.length)
    return true
  }
}

const stringTrimmedMaxLength = (maxValue: number, errorMessage: (itemLength: number) => string) => {
  return (value: string) => {
    if (value?.trim().length > maxValue) return errorMessage(value.length)
    return true
  }
}

const stringMaxLengthValidator = (maxValue: number, errorMessage: (itemLength: number) => string) => {
  return (value: string) => {
    if (value.length > maxValue) return errorMessage(value.length)
    return true
  }
}

const emailValidator = (errorMessage: (email: string) => string) => {
  const regexp =
    /^[a-z0-9!#$%&'*+/=?^_`{|}~.-]+@[a-z0-9](?:[a-z0-9-]{0,61}[a-z0-9])?(?:\.[a-z0-9]([a-z0-9-]{0,61}[a-z0-9])?)*$/i

  return (value: string) => {
    if (!regexp.test(value)) return errorMessage(value)
    return true
  }
}

const booleanValidator = (errorMessage: (value: unknown) => string) => {
  return (value: unknown) => {
    if (typeof value !== 'boolean') return errorMessage(value)
    return true
  }
}

const numberMinValueValidator = (minValue: number, errorMessage: (arg: unknown) => string) => {
  return (value: unknown) => {
    if (typeof value !== 'number') return errorMessage(value)
    if (typeof value === 'number' && value < minValue) return errorMessage(value)
    return true
  }
}

const numberMaxValueValidator = (maxValue: number, errorMessage: (arg: unknown) => string) => {
  return (value: unknown) => {
    if (typeof value !== 'number') return errorMessage(value)
    if (typeof value === 'number' && value > maxValue) return errorMessage(value)
    return true
  }
}

const trimFormatter = (value?: string | null) => {
  return value?.trim() || ''
}

export const useValidators = () => {
  return {
    required: requiredValidator,
    arrayMinLength: arrayMinLengthValidator,
    stringMinLength: stringMinLengthValidator,
    stringMaxLength: stringMaxLengthValidator,
    stringTrimmedMinLength: stringTrimmedMinLength,
    stringTrimmedMaxLength: stringTrimmedMaxLength,
    emailValidator: emailValidator,
    numberMinValue: numberMinValueValidator,
    numberMaxValue: numberMaxValueValidator,
    isBoolean: booleanValidator,
  }
}

export const useFormatters = () => {
  return {
    trimFormatter,
  }
}
