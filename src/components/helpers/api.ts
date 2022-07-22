import { EntitiesLoadingState, PaginationPayload, PaginationPages, PaginationWithPage } from '@/types/api.model'
import { computed } from 'vue'
import { reactive, Ref, watch } from 'vue'

export const removePageParams = <T extends PaginationPages, K extends keyof T>(object: T, key?: K) => {
  const { ...copy } = object
  delete copy['currentPage']
  delete copy['targetPage']
  if (key) {
    delete copy[key]
  }
  return copy as Omit<T, 'currentPage' | 'targetPage' | K>
}

const fetchOlderEntitiesFactory = <K, T extends PaginationWithPage>(params: T, cache: Map<number, K[]>) => {
  if (params.targetPage && params.currentPage) {
    const diff = params.targetPage - params.currentPage
    params.skip = (diff - 1) * params.limit
  }

  const pageNumber = Math.max(params.targetPage || 1, 1)
  const entitiesPerPage = params.limit

  const previousPageEntities = cache.get(pageNumber - 1)
  const currentPageEntities = cache.get(pageNumber)
  const nextPageEntities = cache.get(pageNumber + 1)

  let previousPageValue = 0
  let currentPageValue = 0

  if (!previousPageEntities) {
    previousPageValue = entitiesPerPage
    params.skip -= entitiesPerPage
    params.limit += entitiesPerPage
  }
  if (currentPageEntities) {
    params.skip += entitiesPerPage
    params.limit -= entitiesPerPage
  }

  if (!currentPageEntities) currentPageValue = entitiesPerPage
  if (!nextPageEntities) params.limit += entitiesPerPage

  if (previousPageEntities && currentPageEntities && nextPageEntities) return { currentPageEntities }

  const updatedParams = removePageParams(params, 'newerThanId')

  const extractCurrentEntities = (entities: K[]) => {
    const previousEntities = entities.slice(0, previousPageValue)
    const currentPageEntities = entities.slice(previousPageValue, previousPageValue + currentPageValue)
    const nextPageEntities = entities.slice(previousPageValue + currentPageValue)

    if (previousEntities?.length) cache.set(pageNumber - 1, previousEntities)
    if (currentPageEntities?.length) cache.set(pageNumber, currentPageEntities)
    if (nextPageEntities?.length) cache.set(pageNumber + 1, nextPageEntities)

    return { currentPageEntities }
  }

  const calcEntitiesCount = (count: number) => {
    const currentPage = params.currentPage || 1
    return currentPage * entitiesPerPage + updatedParams.skip + count
  }

  return {
    updatedParams,
    currentPageEntities,
    extractCurrentEntities,
    calcEntitiesCount,
  }
}

const fetchNewerEntitiesFactory = <K, T extends PaginationWithPage>(params: T, cache: Map<number, K[]>) => {
  if (params.targetPage && params.currentPage) {
    const diff = params.currentPage - params.targetPage
    params.skip = (diff - 1) * params.limit
  }

  const pageNumber = Math.max(params.targetPage || 1, 1)
  const entitiesPerPage = params.limit

  const previousPageEntities = cache.get(pageNumber - 1)
  const currentPageEntities = cache.get(pageNumber)
  const nextPageEntities = cache.get(pageNumber + 1)

  let previousPageValue = 0
  let currentPageValue = 0

  if (!previousPageEntities) {
    previousPageValue = entitiesPerPage
    params.limit += entitiesPerPage
  }

  if (!currentPageEntities) currentPageValue = entitiesPerPage

  if (currentPageEntities) {
    params.skip += entitiesPerPage
    params.limit -= entitiesPerPage
  }

  if (!nextPageEntities) {
    params.skip -= entitiesPerPage
    params.limit += entitiesPerPage
  }

  if (previousPageEntities && currentPageEntities && nextPageEntities) return { currentPageEntities }

  const updatedParams = removePageParams(params, 'olderThanId')

  const extractCurrentEntities = (entities: K[]) => {
    const previousPageEntities = entities.slice(0, previousPageValue)
    const currentPageEntities = entities.slice(previousPageValue, previousPageValue + currentPageValue)
    const nextPageEntities = entities.slice(previousPageValue + currentPageValue)

    if (previousPageEntities?.length) cache.set(pageNumber - 1, previousPageEntities)
    if (currentPageEntities?.length) cache.set(pageNumber, currentPageEntities)
    if (nextPageEntities?.length) cache.set(pageNumber + 1, nextPageEntities)

    return { currentPageEntities }
  }

  return {
    updatedParams,
    currentPageEntities,
    extractCurrentEntities,
    calcEntitiesCount: null,
  }
}

const fetchEntitiesBasicFactory = <K, T extends PaginationWithPage>(params: T, cache: Map<number, K[]>) => {
  const pageNumber = Math.max(params.targetPage || 1, 1)
  const entitiesPerPage = params.limit

  let skip = (pageNumber - 1) * entitiesPerPage
  let limit = entitiesPerPage

  const previousPageEntities = cache.get(pageNumber - 1)
  const currentPageEntities = cache.get(pageNumber)
  const nextPageEntities = cache.get(pageNumber + 1)

  let previousPageValue = 0
  let currentPageValue = 0
  let nextPageValue = 0

  if (pageNumber !== 1 && !previousPageEntities) previousPageValue = entitiesPerPage
  if (!currentPageEntities) currentPageValue = entitiesPerPage
  if (!nextPageEntities) nextPageValue = entitiesPerPage

  skip = (pageNumber - 1) * entitiesPerPage - previousPageValue
  limit = currentPageValue + previousPageValue + nextPageValue

  if (previousPageEntities && !(cache.get(pageNumber - 2) && !currentPageEntities)) skip += nextPageValue

  const withoutPageParams = removePageParams(params)
  const updatedParams = { ...withoutPageParams, skip, limit }

  const hasPreviousEntities = previousPageEntities || pageNumber === 1
  if (hasPreviousEntities && currentPageEntities && nextPageEntities) return { currentPageEntities }

  const extractCurrentEntities = (entities: K[]) => {
    const previousEntities = entities.slice(0, previousPageValue)
    const currentPageEntities = entities.slice(previousPageValue, previousPageValue + currentPageValue)
    const nextPageEntities = entities.slice(previousPageValue + currentPageValue)

    if (previousEntities?.length) cache.set(pageNumber - 1, previousEntities)
    if (currentPageEntities?.length) cache.set(pageNumber, currentPageEntities)
    if (nextPageEntities?.length) cache.set(pageNumber + 1, nextPageEntities)

    return { currentPageEntities }
  }

  const calcEntitiesCount = (count: number) => count + skip

  return {
    updatedParams,
    currentPageEntities,
    extractCurrentEntities,
    calcEntitiesCount,
  }
}

export const fetchEntitiesFactory = <K, T extends PaginationWithPage>(params: T, cache: Map<number, K[]>) => {
  if (params.targetPage === 1) {
    cache.clear()
    params.olderThanId = undefined
    params.newerThanId = undefined
    params.currentPage = undefined
  }

  const { targetPage, currentPage } = params

  if (targetPage && currentPage && targetPage > currentPage) return fetchOlderEntitiesFactory(params, cache)
  else if (targetPage && currentPage && targetPage < currentPage) return fetchNewerEntitiesFactory(params, cache)
  else return fetchEntitiesBasicFactory(params, cache)
}

export const extractStates = (state: EntitiesLoadingState) => {
  const isLoading = computed(() => state.state === 'loading')
  const isError = computed(() => state.state === 'error')
  const isLoaded = computed(() => state.state === 'loaded')

  return {
    isLoading,
    isError,
    isLoaded,
  }
}

export const createPaginationPayload = () => {
  const paginationPayload: PaginationPayload = reactive({
    currentPage: undefined,
    newerThanId: undefined,
    olderThanId: undefined,
    targetPage: undefined,
  })

  return paginationPayload
}

export const clearPaginationPayload = (paginationPayload: PaginationPayload) => {
  paginationPayload.newerThanId = undefined
  paginationPayload.olderThanId = undefined
  paginationPayload.currentPage = undefined
}

export const createPageLimitsWatcher = (
  entities: Ref<unknown[]>,
  count: Ref<number>,
  activePage: Ref<number>,
  updatePage: (page: number) => unknown
) => {
  return () =>
    watch(entities, () => {
      if (!entities.value?.length && count?.value && activePage.value !== 1) {
        updatePage(1)
      }
    })
}
