import { computed, watch } from 'vue'
import { clearPaginationPayload, createPageLimitsWatcher, fetchEntitiesFactory } from '@/components/helpers/api'
import { PaginationWithPage } from '@/types/api.model'
import useInfluencerProposalsStore from '@/store/influencer-proposals'
import useInfluencerProposalsFilters from '@/components/influencer/proposals/proposals-params'
import useProposalController from '@/middleware/controllers/useProposalController'

export default function useInfluencerProposals() {
  const { fetchMyProposals } = useProposalController()
  const {
    getInfluencerProposals,
    getInfluencerProposalsCount,
    getInfluencerProposalsState,
    influencerProposalsCache,
    getFirstInfluencerProposal,
    getLastInfluencerProposal,
    setInfluencerProposals,
    setInfluencerProposalsState,
    setInfluencerProposalsCount,
  } = useInfluencerProposalsStore()

  const { influencerProposalsPagination, influencerProposalsPerPage, paginationPayload, updateRouteParams } =
    useInfluencerProposalsFilters()

  const activePage = computed(() => influencerProposalsPagination.skip / influencerProposalsPagination.limit + 1)
  const isLoading = computed(() => getInfluencerProposalsState.value.state === 'loading')
  const isLoaded = computed(() => getInfluencerProposalsState.value.state === 'loaded')
  const isError = computed(() => getInfluencerProposalsState.value.state === 'error')

  const scrollToPageTop = () => {
    window.scrollTo({ top: 0, behavior: 'smooth' })
  }

  const _fetchInfluencerProposals = async (params: PaginationWithPage) => {
    const {
      updatedParams,
      currentPageEntities: cachedProposals,
      extractCurrentEntities,
      calcEntitiesCount,
    } = fetchEntitiesFactory(params, influencerProposalsCache)

    if (cachedProposals) {
      setInfluencerProposals(cachedProposals)
    }

    if (extractCurrentEntities) {
      return await fetchMyProposals(updatedParams).then((response) => {
        const { currentPageEntities } = extractCurrentEntities(response.data.proposalTaskPairs)

        if (calcEntitiesCount) setInfluencerProposalsCount(calcEntitiesCount(response.data.count))
        if (!cachedProposals) setInfluencerProposals(currentPageEntities)
      })
    }
  }

  const updatePage = (targetPage: number) => {
    scrollToPageTop()
    const firstProposal = getFirstInfluencerProposal()
    const lastProposal = getLastInfluencerProposal()

    paginationPayload.currentPage = activePage.value
    paginationPayload.newerThanId = firstProposal?.proposal?.id
    paginationPayload.olderThanId = lastProposal?.proposal?.id

    updateRouteParams({ page: targetPage })
  }

  const fetchInfluencerProposalsFirstPage = () => {
    const cachedProposals = influencerProposalsCache.get(1)

    if (cachedProposals) setInfluencerProposals(cachedProposals)
    if (!cachedProposals) setInfluencerProposalsState('loading')

    _fetchInfluencerProposals({
      skip: 0,
      limit: influencerProposalsPerPage,
      targetPage: 1,
    })
      .then(() => setInfluencerProposalsState('loaded'))
      .catch((e) => setInfluencerProposalsState('error', { message: e?.message }))
  }

  const fetchInfluencerProposalsInitial = () => {
    _fetchInfluencerProposals({
      ...influencerProposalsPagination,
      ...paginationPayload,
      targetPage: activePage.value,
    })
      .then(() => setInfluencerProposalsState('loaded'))
      .catch((e) => setInfluencerProposalsState('error', { message: e?.message }))

    clearPaginationPayload(paginationPayload)
  }

  const refetchInfluencerProposals = () => {
    setInfluencerProposalsState('loading')

    fetchInfluencerProposalsInitial()
  }

  const watchPageLimits = createPageLimitsWatcher(
    getInfluencerProposals,
    getInfluencerProposalsCount,
    activePage,
    updatePage
  )

  const watchFilters = () => {
    watch(influencerProposalsPagination, fetchInfluencerProposalsInitial)
  }

  return {
    proposals: getInfluencerProposals,
    proposalsCount: getInfluencerProposalsCount,
    proposalsState: getInfluencerProposalsState,
    perPage: influencerProposalsPagination.limit,
    influencerProposalsPagination,
    isLoaded,
    isLoading,
    isError,
    activePage,
    fetchInfluencerProposalsFirstPage,
    fetchInfluencerProposalsInitial,
    refetchInfluencerProposals,
    updatePage,
    watchPageLimits,
    watchFilters,
  }
}
