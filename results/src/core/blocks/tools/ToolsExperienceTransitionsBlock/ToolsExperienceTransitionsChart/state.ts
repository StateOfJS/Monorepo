import { createContext, useContext } from 'react'
import { ToolExperienceId } from 'core/bucket_keys'

export interface ChartContextData {
    toolId: string
    currentExperience: ToolExperienceId
    setCurrentExperience: (experience: ToolExperienceId) => void
    currentTransition: [ToolExperienceId, ToolExperienceId] | null
    setCurrentTransition: (transition: [ToolExperienceId, ToolExperienceId] | null) => void
}

// @ts-ignore
export const ChartContext = createContext<ChartContextData>(null)

export const ChartContextProvider = ChartContext.Provider

export const useChartContext = () => useContext(ChartContext)
