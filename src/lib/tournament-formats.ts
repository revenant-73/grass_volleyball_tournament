export interface PoolFormat {
  teams: number
  description: string
  courts: number
  poolCount: number
  layout: string
  waves: number
}

export const POOL_FORMATS: Record<number, PoolFormat> = {
  3: { teams: 3, description: '1 pool of 3', courts: 1, poolCount: 1, layout: 'Ct 1: 3', waves: 3 },
  4: { teams: 4, description: '1 pool of 4', courts: 1, poolCount: 1, layout: 'Ct 1: 4', waves: 6 },
  5: { teams: 5, description: '1 pool of 5', courts: 2, poolCount: 1, layout: 'Cts 1-2: 5', waves: 5 },
  6: { teams: 6, description: '2 pools of 3', courts: 2, poolCount: 2, layout: 'Cts 1-2: 3+3', waves: 5 },
  8: { teams: 8, description: '2 pools of 4', courts: 2, poolCount: 2, layout: 'Ct 1: 4; Ct 2: 4', waves: 6 },
  9: { teams: 9, description: '1 pool of 4, 1 pool of 5', courts: 3, poolCount: 2, layout: 'Ct 1: 4; Cts 2-3: 5', waves: 6 },
  10: { teams: 10, description: '2 pools of 5', courts: 4, poolCount: 2, layout: 'Cts 1-2: 5; Cts 3-4: 5', waves: 5 },
  11: { teams: 11, description: '2 pools of 3, 1 pool of 5', courts: 4, poolCount: 3, layout: 'Cts 1-2: 3+3; Cts 3-4: 5', waves: 5 },
  12: { teams: 12, description: '4 pools of 3', courts: 4, poolCount: 4, layout: 'Cts 1-2: 3+3; Cts 3-4: 3+3', waves: 5 },
  13: { teams: 13, description: '2 pools of 4, 1 pool of 5', courts: 4, poolCount: 3, layout: 'Ct 1: 4; Ct 2: 4; Cts 3-4: 5', waves: 6 },
  14: { teams: 14, description: '2 pools of 3, 2 pools of 4', courts: 4, poolCount: 4, layout: 'Cts 1-2: 3+3; Ct 3: 4; Ct 4: 4', waves: 6 },
  15: { teams: 15, description: '3 pools of 5', courts: 6, poolCount: 3, layout: 'Cts 1-2: 5; Cts 3-4: 5; Cts 5-6: 5', waves: 5 },
  16: { teams: 16, description: '2 pools of 3, 2 pools of 5', courts: 6, poolCount: 4, layout: 'Cts 1-2: 3+3; Cts 3-4: 5; Cts 5-6: 5', waves: 5 },
  17: { teams: 17, description: '4 pools of 3, 1 pool of 5', courts: 6, poolCount: 5, layout: 'Cts 1-2: 3+3; Cts 3-4: 3+3; Cts 5-6: 5', waves: 5 },
  18: { teams: 18, description: '6 pools of 3', courts: 6, poolCount: 6, layout: 'Cts 1-2: 3+3; Cts 3-4: 3+3; Cts 5-6: 3+3', waves: 5 },
  19: { teams: 19, description: '2 pools of 3, 2 pools of 4, 1 pool of 5', courts: 6, poolCount: 5, layout: 'Cts 1-2: 3+3; Ct 3: 4; Ct 4: 4; Cts 5-6: 5', waves: 6 },
  20: { teams: 20, description: '4 pools of 5', courts: 8, poolCount: 4, layout: 'Cts 1-2: 5; Cts 3-4: 5; Cts 5-6: 5; Cts 7-8: 5', waves: 5 },
  21: { teams: 21, description: '2 pools of 3, 3 pools of 5', courts: 8, poolCount: 5, layout: 'Cts 1-2: 3+3; Cts 3-4: 5; Cts 5-6: 5; Cts 7-8: 5', waves: 5 },
  22: { teams: 22, description: '4 pools of 3, 2 pools of 5', courts: 8, poolCount: 6, layout: 'Cts 1-2: 3+3; Cts 3-4: 3+3; Cts 5-6: 5; Cts 7-8: 5', waves: 5 },
  23: { teams: 23, description: '6 pools of 3, 1 pool of 5', courts: 8, poolCount: 7, layout: 'Cts 1-2: 3+3; Cts 3-4: 3+3; Cts 5-6: 3+3; Cts 7-8: 5', waves: 5 },
  24: { teams: 24, description: '8 pools of 3', courts: 8, poolCount: 8, layout: 'Cts 1-2: 3+3; Cts 3-4: 3+3; Cts 5-6: 3+3; Cts 7-8: 3+3', waves: 5 },
  25: { teams: 25, description: '5 pools of 5', courts: 10, poolCount: 5, layout: 'Cts 1-2: 5; Cts 3-4: 5; Cts 5-6: 5; Cts 7-8: 5; Cts 9-10: 5', waves: 5 },
  26: { teams: 26, description: '2 pools of 3, 4 pools of 5', courts: 10, poolCount: 6, layout: 'Cts 1-2: 3+3; Cts 3-4: 5; Cts 5-6: 5; Cts 7-8: 5; Cts 9-10: 5', waves: 5 },
  27: { teams: 27, description: '4 pools of 3, 3 pools of 5', courts: 10, poolCount: 7, layout: 'Cts 1-2: 3+3; Cts 3-4: 3+3; Cts 5-6: 5; Cts 7-8: 5; Cts 9-10: 5', waves: 5 },
  28: { teams: 28, description: '6 pools of 3, 2 pools of 5', courts: 10, poolCount: 8, layout: 'Cts 1-2: 3+3; Cts 3-4: 3+3; Cts 5-6: 3+3; Cts 7-8: 5; Cts 9-10: 5', waves: 5 },
  29: { teams: 29, description: '8 pools of 3, 1 pool of 5', courts: 10, poolCount: 9, layout: 'Cts 1-2: 3+3; Cts 3-4: 3+3; Cts 5-6: 3+3; Cts 7-8: 3+3; Cts 9-10: 5', waves: 5 },
  30: { teams: 30, description: '10 pools of 3', courts: 10, poolCount: 10, layout: 'Cts 1-2: 3+3; Cts 3-4: 3+3; Cts 5-6: 3+3; Cts 7-8: 3+3; Cts 9-10: 3+3', waves: 5 },
  31: { teams: 31, description: '2 pools of 3, 5 pools of 5', courts: 12, poolCount: 7, layout: 'Cts 1-2: 3+3; Cts 3-4: 5; Cts 5-6: 5; Cts 7-8: 5; Cts 9-10: 5; Cts 11-12: 5', waves: 5 },
  32: { teams: 32, description: '4 pools of 3, 4 pools of 5', courts: 12, poolCount: 8, layout: 'Cts 1-2: 3+3; Cts 3-4: 3+3; Cts 5-6: 5; Cts 7-8: 5; Cts 9-10: 5; Cts 11-12: 5', waves: 5 },
}

export function getRecommendedFormat(teamCount: number): PoolFormat | null {
  return POOL_FORMATS[teamCount] || null
}

// Helper to determine team distribution for complex layouts (e.g. 1 pool of 4, 1 pool of 5)
export function getPoolSizes(teamCount: number): number[] {
  if (teamCount === 7) return [] // Conflict
  if (teamCount === 9) return [4, 5]
  if (teamCount === 11) return [3, 3, 5]
  if (teamCount === 13) return [4, 4, 5]
  if (teamCount === 14) return [3, 3, 4, 4]
  if (teamCount === 16) return [3, 3, 5, 5]
  if (teamCount === 17) return [3, 3, 3, 3, 5]
  if (teamCount === 19) return [3, 3, 4, 4, 5]
  if (teamCount === 21) return [3, 3, 5, 5, 5]
  if (teamCount === 22) return [3, 3, 3, 3, 5, 5]
  if (teamCount === 23) return [3, 3, 3, 3, 3, 3, 5]
  if (teamCount === 26) return [3, 3, 5, 5, 5, 5]
  if (teamCount === 27) return [3, 3, 3, 3, 5, 5, 5]
  if (teamCount === 28) return [3, 3, 3, 3, 3, 3, 5, 5]
  if (teamCount === 29) return [3, 3, 3, 3, 3, 3, 3, 3, 5]
  if (teamCount === 31) return [3, 3, 5, 5, 5, 5, 5]
  if (teamCount === 32) return [3, 3, 3, 3, 5, 5, 5, 5]

  // Default: even distribution
  const format = POOL_FORMATS[teamCount]
  if (!format) return []
  
  const size = teamCount / format.poolCount
  return Array(format.poolCount).fill(size)
}
