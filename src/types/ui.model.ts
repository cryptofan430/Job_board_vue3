import { Ref, UnwrapRef } from 'vue'

export type UIElementStateType = 'ok' | 'error' | 'disabled' | 'readonly'

export type GeneralType<T> = T extends number ? number : T extends string ? string : T extends boolean ? boolean : T

export interface UIElementState {
  state: UIElementStateType
  payload: {
    message?: string
  }
}

export interface UIElementValidator<T = unknown> {
  (value: UnwrapRef<GeneralType<T>>): string | boolean
}

export interface UIElementFormatter<T = unknown> {
  (value: UnwrapRef<GeneralType<T>>): T
}

export interface FormItemOptions<T> {
  validators: Array<UIElementValidator<T>>
  formatters?: Array<UIElementFormatter<T>>
  state?: UIElementState
}

export interface FieldSetItemPayload {
  value: string | number | Record<string, unknown> | Array<unknown>
  state?: UIElementState
  options?: FormItemOptions<unknown>
}

export interface FormFieldSetPayload {
  [key: string]: FieldSetItemPayload | Array<FormFieldSetPayload>
}

export interface FormItemController<T> extends BasicFormController<GeneralType<T>> {
  value: T extends Ref<infer S> ? Ref<GeneralType<S>> : Ref<GeneralType<T>>
  setValue: (value: UnwrapRef<GeneralType<T>>) => void
}

export interface BasicFormController<T> {
  isError: Ref<boolean>
  getErrorMessage: Ref<string | undefined>
  getValue: () => T
  setError: (errorMessage: string) => void
  setDisabledState: (message?: string) => void
  setReadonlyState: (message?: string) => void
  setNormalState: () => void
  validate: () => boolean
}

export interface FieldSetPayload {
  [key: string]: UnwrapRef<BasicFormController<unknown>>
}

export type FieldSetControl<T extends UnwrapRef<{ [key: string]: unknown }>> = UnwrapRef<
  FieldSetController<{
    [key in keyof T]: UnwrapRef<FormItemController<T[key]>>
  }>
>

export interface FieldSetController<T extends FieldSetPayload>
  extends BasicFormController<{
    [k in keyof T]-?: ReturnType<T[k]['getValue']>
  }> {
  fieldSet: T
  validate: () => boolean
}

// eslint-disable-next-line @typescript-eslint/ban-types
export interface FieldSetsListController<T extends UnwrapRef<FieldSetController<{}>>>
  extends BasicFormController<Array<ReturnType<T['getValue']>>> {
  fieldSets: UnwrapRef<Array<T>>
  validate: () => boolean
  add: (fieldSet: T) => void
  removeAt: (index: number) => void
}
