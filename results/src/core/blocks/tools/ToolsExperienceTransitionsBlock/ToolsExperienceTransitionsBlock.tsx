import React, { useCallback, useMemo, useState } from 'react'
import styled from 'styled-components'
import { ToolExperienceId } from 'core/bucket_keys'
import { useLegends } from 'core/helpers/useBucketKeys'
import Block from 'core/blocks/block/BlockVariant'
import {
    ToolsExperienceTransitionsBlockData,
    ApiToolExperienceTransitions,
} from './types'
import { ToolsExperienceTransitionsChart } from './ToolsExperienceTransitionsChart'

export const ToolsExperienceTransitionsBlock = ({
    block,
    data,
}: {
    block: ToolsExperienceTransitionsBlockData
    data: ApiToolExperienceTransitions[]
}) => {
    const filteredData = useMemo(() =>
        data.filter(toolData => toolData.experienceTransitions.nodes.length > 0),
        [data]
    )

    const [currentExperience, _setCurrentExperience] = useState<ToolExperienceId>('interested')
    const [currentTransition, _setCurrentTransition] = useState<[ToolExperienceId, ToolExperienceId] | null>([
        'interested',
        'would_use'
    ])

    // avoid creating a new transition array if the values don't change
    const setCurrentTransition = useCallback((transition: [ToolExperienceId, ToolExperienceId] | null) => {
        _setCurrentTransition((previous) => {
            if (transition === null) return null
            if (previous !== null && previous[0] === transition[0] && previous[1] === transition[1]) {
                return previous
            }

            return transition
        })
    }, [_setCurrentTransition])

    // reset the current transition when a new source experience is selected
    const setCurrentExperience = useCallback((experience: ToolExperienceId) => {
        if (experience === currentExperience) return

        _setCurrentExperience(experience)
        _setCurrentTransition(null)
    }, [currentExperience, _setCurrentTransition])

    const keys = data[0].experienceTransitions.keys
    const legends = useLegends(block, keys, 'tools')
    const legendProps = useMemo(() => ({
        current: currentExperience,
        onClick: ({ id }: { id: ToolExperienceId }) => {
            setCurrentExperience(id)
        }
    }), [currentExperience, setCurrentExperience])

    return (
        <Block
            block={block}
            data={filteredData}
            legends={legends}
            legendProps={legendProps}
        >
            <Grid>
                {filteredData.map(toolData => (
                    <ToolsExperienceTransitionsChart
                        key={toolData.id}
                        data={toolData}
                        currentExperience={currentExperience}
                        setCurrentExperience={setCurrentExperience}
                        currentTransition={currentTransition}
                        setCurrentTransition={setCurrentTransition}
                    />
                ))}
            </Grid>
        </Block>
    )
}

const Grid = styled.div`
    display: grid;
    width: 100%;
    grid-template-columns: repeat(auto-fit, minmax(min(240px, 100%), 1fr));
    column-gap: 24px;
    row-gap: 16px;
`
