import React, { memo, useCallback, useState } from 'react'
import styled from 'styled-components'
import { ToolExperienceId } from 'core/bucket_keys'
import { SankeyNodeDatum } from '../types'
import { staticProps } from './config'

const style = {
    cursor: 'pointer'
}

const NonMemoizedNode = ({
    node,
    isCurrent,
    setCurrentExperience,
}: {
    node: SankeyNodeDatum
    isCurrent: boolean
    setCurrentExperience: (experience: ToolExperienceId) => void
}) => {
    const [isHover, setIsHover] = useState(false)

    const handleHover = useCallback(() => {
        setIsHover(true)
    }, [setIsHover])

    const handleLeave = useCallback(() => {
        setIsHover(false)
    }, [setIsHover])

    const handleClick = useCallback(() => {
        setCurrentExperience(node.choice)
    }, [setCurrentExperience, node.choice])

    const centerX = node.x0 + (node.x1 - node.x0) / 2
    const centerY = node.y0 + (node.y1 - node.y0) / 2

    return (
        <>
            <rect
                x={node.x}
                y={node.y}
                width={node.width}
                height={node.height}
                rx={2}
                ry={2}
                fill={node.color}
                opacity={(isCurrent || isHover) ? 1 : .4}
                style={style}
                onMouseEnter={handleHover}
                onMouseLeave={handleLeave}
                onClick={handleClick}
            />
            {node.height >= staticProps.nodeLabelMinHeight && (
                <g transform={`translate(${centerX},${centerY}) rotate(-90)`}>
                    <NodeLabel
                        textAnchor="middle"
                        dominantBaseline="central"
                    >
                        {node.value}
                    </NodeLabel>
                </g>
            )}
        </>
    )
}

const NodeLabel = styled.text`
    fill: ${({ theme }) => theme.colors.textInverted};
    font-size: 10px;
    pointer-events: none;
    font-weight: ${({ theme }) => theme.typography.weight.bold};
`

export const Node = memo(NonMemoizedNode)
