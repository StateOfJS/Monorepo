import React, { memo, useCallback } from 'react'
import styled from 'styled-components'
import { SankeyLinkDatum } from '../types'
import { useChartContext } from './state'
import { getLinkPath } from './getLinkPath'
import { getLinkId } from './getLinkId'

const NonMemoizedLinkWithGradient = ({ link, isActive }: {
    link: SankeyLinkDatum
    isActive: boolean
}) => {
    const gradientId = `${getLinkId(link)}Gradient`

    const { currentTransition, setCurrentTransition } = useChartContext()

    const sourceExperience = link.source.choice
    const targetExperience = link.target.choice

    const handleClick = useCallback(() => {
        setCurrentTransition([sourceExperience, targetExperience])
    }, [
        setCurrentTransition,
        sourceExperience,
        targetExperience,
    ])

    let opacity = 1
    // change the opacity of the inactive links in case
    // users selected a specific transition.
    if (currentTransition !== null && (link.source.choice !== currentTransition[0] || link.target.choice !== currentTransition[1])) {
        opacity = .3
    }

    return (
        <>
            <defs>
                <linearGradient id={gradientId} spreadMethod="pad">
                    <stop offset="0%" stopColor={link.source.color} />
                    <stop offset="100%" stopColor={link.target.color} />
                </linearGradient>
            </defs>
            <Path
                $isActive={isActive}
                onClick={handleClick}
                d={getLinkPath(link, 1)}
                fill={`url(#${gradientId})`}
                opacity={opacity}
            />
        </>
    )
}

const Path = styled.path<{
    $isActive: boolean
}>`
    pointer-events: ${({ $isActive }) => $isActive ? 'auto' : 'none'};
    cursor: ${({ $isActive }) => $isActive ? 'pointer' : 'auto'};
`

export const LinkWithGradient = memo(NonMemoizedLinkWithGradient)
