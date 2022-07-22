import { ContractMilestonePublicInfo, MilestoneState } from '@/types/contract.model'

export const extractActiveMilestone = (milestones?: ContractMilestonePublicInfo[]) => {
  if (!milestones?.length) return null

  const oldestSecured = milestones.find((milestone) => milestone.state === MilestoneState.SECURED)
  if (oldestSecured) return oldestSecured

  const oldestNotSecured = milestones.find((milestone) => milestone.state === MilestoneState.NOT_SECURED)
  if (oldestNotSecured) return oldestNotSecured

  const activeMilestone = milestones[0] || null

  return activeMilestone
}

export const extractMilestoneProgress = (milestones?: ContractMilestonePublicInfo[] | null) => {
  const releasedMilestones = milestones?.filter((milestone) => milestone.state === MilestoneState.RELEASED)
  const securedMilestones = milestones?.filter((milestones) => milestones.state === MilestoneState.SECURED)

  const releasedCount = releasedMilestones?.length || 0
  const securedCount = securedMilestones?.length || 0

  if (!releasedCount && !securedCount) return 0

  return releasedCount / (releasedCount + securedCount)
}

export const extractMilestoneState = (milestone: ContractMilestonePublicInfo) => {
  const isNotSecured = milestone.state === MilestoneState.NOT_SECURED
  const isSecured = milestone.state === MilestoneState.SECURED
  const isReleased = milestone.state === MilestoneState.RELEASED

  return {
    isNotSecured,
    isSecured,
    isReleased,
  }
}
