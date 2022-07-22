import { computed, watch } from 'vue'
import { clearPaginationPayload, createPageLimitsWatcher, fetchEntitiesFactory } from '@/components/helpers/api'
import { PaginationWithPage } from '@/types/api.model'
import useInvitationController from '@/middleware/controllers/useInvitationController'
import useInfluencerInvitationsStore from '@/store/influencer-invitations'
import useInfluencerInvitationsFilters from '@/components/influencer/tasks/invitations-params'

export default function useInfluencerInvitations() {
  const { fetchInvitations } = useInvitationController()
  const {
    getInfluencerInvitations,
    getInfluencerInvitationsCount,
    getInfluencerInvitationsState,
    invitationsCache,
    getFirstInfluencerInvitation,
    getLastInfluencerInvitation,
    setInfluencerInvitations,
    setInfluencerInvitationsCount,
    setInfluencerInvitationsState,
  } = useInfluencerInvitationsStore()

  const { influencerInvitationsPagination, paginationPayload, influencerInvitationsPerPage, updateRouteParams } =
    useInfluencerInvitationsFilters()

  const activePage = computed(() => influencerInvitationsPagination.skip / influencerInvitationsPagination.limit + 1)
  const isLoading = computed(() => getInfluencerInvitationsState.value.state === 'loading')
  const isLoaded = computed(() => getInfluencerInvitationsState.value.state === 'loaded')
  const isError = computed(() => getInfluencerInvitationsState.value.state === 'error')

  const scrollToPageTop = () => {
    window.scrollTo({ top: 0, behavior: 'smooth' })
  }

  const _fetchInvitations = async (params: PaginationWithPage) => {
    const {
      currentPageEntities: cachedInvitations,
      calcEntitiesCount,
      extractCurrentEntities,
      updatedParams,
    } = fetchEntitiesFactory(params, invitationsCache)

    if (cachedInvitations) setInfluencerInvitations(cachedInvitations)

    if (extractCurrentEntities) {
      return await fetchInvitations(updatedParams).then((response) => {
        const { currentPageEntities } = extractCurrentEntities(response.data.invitations)
        if (!cachedInvitations) setInfluencerInvitations(currentPageEntities)
        if (calcEntitiesCount) setInfluencerInvitationsCount(calcEntitiesCount(response.data.count))
      })
    }
  }

  const fetchInvitationsInitial = () => {
    _fetchInvitations({
      ...influencerInvitationsPagination,
      ...paginationPayload,
      targetPage: activePage.value,
    })
      .then(() => setInfluencerInvitationsState('loaded'))
      .catch((e) => setInfluencerInvitationsState('error', { message: e?.message }))

    clearPaginationPayload(paginationPayload)
  }

  const refetchInvitations = () => {
    setInfluencerInvitationsState('loading')

    fetchInvitationsInitial()
  }

  const fetchInvitationFirstPage = () => {
    const invitationsCached = invitationsCache.get(1)

    if (invitationsCached) setInfluencerInvitations(invitationsCached)
    if (!invitationsCached) setInfluencerInvitationsState('loading')

    _fetchInvitations({
      skip: 0,
      limit: influencerInvitationsPerPage,
      targetPage: 1,
    })
      .then(() => setInfluencerInvitationsState('loaded'))
      .catch((e) => setInfluencerInvitationsState('error', { message: e?.message }))
  }

  const updatePage = (targetPage: number) => {
    scrollToPageTop()
    const firstInvitation = getFirstInfluencerInvitation()
    const lastInvitation = getLastInfluencerInvitation()

    paginationPayload.currentPage = activePage.value
    paginationPayload.newerThanId = firstInvitation?.id
    paginationPayload.olderThanId = lastInvitation?.id

    updateRouteParams({ page: targetPage })
  }

  const watchPageLimits = createPageLimitsWatcher(
    getInfluencerInvitations,
    getInfluencerInvitationsCount,
    activePage,
    updatePage
  )

  const watchFilters = () => {
    watch(influencerInvitationsPagination, fetchInvitationsInitial)
  }

  return {
    invitations: getInfluencerInvitations,
    invitationsCount: getInfluencerInvitationsCount,
    invitationsState: getInfluencerInvitationsState,
    invitationsPerPage: influencerInvitationsPerPage,
    activePage,
    isLoading,
    isLoaded,
    isError,
    fetchInvitationsInitial,
    fetchInvitationFirstPage,
    refetchInvitations,
    updatePage,
    watchPageLimits,
    watchFilters,
  }
}
