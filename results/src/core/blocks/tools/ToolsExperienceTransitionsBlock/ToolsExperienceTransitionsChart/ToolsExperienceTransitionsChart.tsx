import React, { useCallback, useMemo } from 'react'
import styled, { useTheme } from 'styled-components'
import { ResponsiveSankey } from '@nivo/sankey'
import { ToolExperienceId } from 'core/bucket_keys'
import { ApiToolExperienceTransitions } from '../types'
import { staticProps } from './config'
import { ChartContextProvider } from './state'
import { ToolLegend } from './ToolLegend'

export const ToolsExperienceTransitionsChart = ({
    data,
    currentExperience,
    setCurrentExperience,
    currentTransition,
    setCurrentTransition,
}: {
    data: ApiToolExperienceTransitions
    currentExperience: ToolExperienceId
    setCurrentExperience: (experience: ToolExperienceId) => void
    currentTransition: [ToolExperienceId, ToolExperienceId] | null
    setCurrentTransition: (transition: [ToolExperienceId, ToolExperienceId] | null) => void
}) => {
    const theme = useTheme()

    const chartData = useMemo(() => ({
        nodes: data.experienceTransitions.nodes,
        links: data.experienceTransitions.transitions.map(transition => {
            return {
                source: transition.from,
                target: transition.to,
                value: transition.count,
                percentage: transition.percentage,
            }
        }),
    }), [data])

    const context = useMemo(() => ({
        toolId: data.id,
        currentExperience,
        setCurrentExperience,
        currentTransition,
        setCurrentTransition,
    }), [
        data.id,
        currentExperience,
        setCurrentExperience,
        currentTransition,
        setCurrentTransition,
    ])

    const getColor = useCallback(({ choice }: { choice: ToolExperienceId }) => {
        return theme.colors.ranges.tools[choice][0]
    }, [theme])

    return (
        <ChartContextProvider value={context}>
            <Container>
                <ToolLegend tool={data.entity} />
                <ChartContainer>
                    <ResponsiveSankey
                        margin={staticProps.margin}
                        data={chartData}
                        sort="input"
                        align="justify"
                        colors={getColor}
                        nodeThickness={18}
                        nodeInnerPadding={1}
                        nodeSpacing={2}
                        linkContract={1}
                        animate={false}
                        // @ts-ignore
                        layers={staticProps.layers}
                    />
                </ChartContainer>
            </Container>
        </ChartContextProvider>
    )
}

const Container = styled.div`
    display: flex;
    overflow: hidden;
    align-items: center;
`

const ChartContainer = styled.div`
    width: calc(100% - 20px);
    height: ${staticProps.margin.top + staticProps.chartHeight + staticProps.margin.bottom}px;
`