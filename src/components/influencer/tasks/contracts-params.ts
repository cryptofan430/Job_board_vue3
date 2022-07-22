import { computed, reactive, ref } from 'vue'
import { useNumericUrlParamReactive, useUpdateQueryParams } from '@/components/helpers/route'
import { BasicPagination, PaginationPayload } from '@/types/api.model'
import { createPaginationPayload } from '@/components/helpers/api'

const paginationPayloadRef = ref<PaginationPayload>()

const useInfluencerContractParams = () => {
  const pageNumber = useNumericUrlParamReactive('page')
  const validPageNumber = computed(() => Math.max(1, pageNumber.value || 1))

  const influencerContractsPerPage = 10

  const influencerContractsPagination: BasicPagination = reactive({
    limit: influencerContractsPerPage,
    skip: computed(() => (validPageNumber.value - 1) * influencerContractsPerPage),
  })

  const paginationPayload = paginationPayloadRef.value || createPaginationPayload()
  paginationPayloadRef.value = paginationPayload

  return {
    influencerContractsPagination,
    influencerContractsPerPage,
    paginationPayload,
  }
}

export default function useInfluencerContractsFilters() {
  const { influencerContractsPagination, influencerContractsPerPage, paginationPayload } = useInfluencerContractParams()

  const updateRouteParams = useUpdateQueryParams()

  return {
    influencerContractsPagination,
    influencerContractsPerPage,
    updateRouteParams,
    paginationPayload,
  }
}
