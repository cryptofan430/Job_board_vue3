import { computed, reactive, ref } from 'vue'
import { useRoute } from 'vue-router'
import { useNumericUrlParamReactive, useUpdateQueryParams } from '@/components/helpers/route'
import { PaginationPayload, PaginationWithPage } from '@/types/api.model'
import { createPaginationPayload } from '@/components/helpers/api'

const tasksPaginationPayloadRef = ref<PaginationPayload>()

const useMarketerTaskProposalsParams = () => {
  const pageNumber = useNumericUrlParamReactive('page')
  const validPageNumber = computed(() => Math.max(1, pageNumber.value || 1))

  const taskId = useRoute().params.taskId?.toString() || ''

  const proposalsPerPage = 10

  const proposalsPagination: PaginationWithPage = reactive({
    limit: proposalsPerPage,
    skip: computed(() => (validPageNumber.value - 1) * proposalsPerPage),
  })

  const paginationPayload = tasksPaginationPayloadRef.value || createPaginationPayload()
  tasksPaginationPayloadRef.value = paginationPayload

  return {
    paginationPayload,
    proposalsPagination,
    proposalsPerPage,
    taskId,
  }
}

export default function useMarketerTaskProposalsFilters() {
  const { proposalsPagination, proposalsPerPage, paginationPayload, taskId } = useMarketerTaskProposalsParams()

  const updateRouteParams = useUpdateQueryParams()

  return {
    taskId,
    proposalsPagination,
    proposalsPerPage,
    paginationPayload,
    updateRouteParams,
  }
}
