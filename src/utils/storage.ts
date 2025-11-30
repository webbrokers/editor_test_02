import type { CampaignFlow } from '../types/flow'

const STORAGE_KEY = 'campaigns'

function readStorage(): CampaignFlow[] {
  if (typeof localStorage === 'undefined') return []
  try {
    const raw = localStorage.getItem(STORAGE_KEY)
    if (!raw) return []
    const parsed = JSON.parse(raw)
    if (Array.isArray(parsed)) {
      return parsed as CampaignFlow[]
    }
    return []
  } catch (error) {
    console.error('Failed to read campaigns from storage', error)
    return []
  }
}

function writeStorage(campaigns: CampaignFlow[]) {
  if (typeof localStorage === 'undefined') return
  try {
    localStorage.setItem(STORAGE_KEY, JSON.stringify(campaigns))
  } catch (error) {
    console.error('Failed to save campaigns to storage', error)
  }
}

export function getCampaigns(): CampaignFlow[] {
  return readStorage()
}

export function getCampaignById(id: string): CampaignFlow | undefined {
  return readStorage().find((campaign) => campaign.id === id)
}

export function saveCampaign(flow: CampaignFlow): void {
  const campaigns = readStorage()
  const existingIndex = campaigns.findIndex((item) => item.id === flow.id)

  if (existingIndex >= 0) {
    campaigns[existingIndex] = flow
  } else {
    campaigns.push(flow)
  }

  writeStorage(campaigns)
}

export function deleteCampaign(id: string): void {
  const campaigns = readStorage().filter((campaign) => campaign.id !== id)
  writeStorage(campaigns)
}

export function renameCampaign(id: string, nextName: string): void {
  const campaigns = readStorage().map((campaign) => (campaign.id === id ? { ...campaign, name: nextName } : campaign))
  writeStorage(campaigns)
}
