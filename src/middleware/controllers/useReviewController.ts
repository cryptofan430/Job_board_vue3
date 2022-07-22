import api from '@/services/api'
import {
  InfluencerReview,
  MarketerReview,
  ReviewToAddForInfluencer,
  ReviewToAddForMarketer,
} from '@/types/review.model'

const addMarketerReview = (contractId: string, data: ReviewToAddForMarketer) => {
  return api.post<MarketerReview>(`/reviews/for-contract/${contractId}/for-marketer`, data)
}

const addInfluencerReview = (contractId: string, data: ReviewToAddForInfluencer) => {
  return api.post<InfluencerReview>(`/reviews/for-contract/${contractId}/for-influencer`, data)
}

export default function useReviewController() {
  return {
    addMarketerReview,
    addInfluencerReview,
  }
}
