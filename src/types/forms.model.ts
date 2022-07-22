import { FieldSetControl } from './ui.model'

export type MileStoneForm = FieldSetControl<{
  id: number
  title: string
  budget: number
  description: string
}>
