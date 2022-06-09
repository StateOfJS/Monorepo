import React from 'react'
import styled, { DefaultTheme, useTheme } from 'styled-components'
// @ts-ignore: indirect dependency managed by nivo
import { interpolateRgb } from 'd3-interpolate'
import { useTransition, animated, to, config } from '@react-spring/web'
import { SankeyLinkDatum } from '../types'

const getLinkCenter = (link: SankeyLinkDatum) => {
    const x = link.target.x0 + (link.source.x1 - link.target.x0) / 2
    const y = link.pos0 + (link.pos1 - link.pos0) / 2

    return {x, y}
}

const getLinkColor = (link: SankeyLinkDatum, theme: DefaultTheme) =>
    interpolateRgb(
        theme.colors.ranges.tools[link.source.choice][0],
        theme.colors.ranges.tools[link.target.choice][0]
    )(.5)

export const LinkPercentages = ({
    links,
}: {
    links: SankeyLinkDatum[]
}) => {
    const theme = useTheme()

    const percentages = links.filter(link => link.thickness > 6)
        .map(link => {
            return {
                id: `${link.source.id}.${link.target.id}`,
                percentage: link.percentage,
                color: getLinkColor(link, theme),
                ...getLinkCenter(link),
            }
        })

    const transition = useTransition<(typeof percentages)[number], {
        x: number
        y: number
        percentage: number
        opacity: number
    }>(percentages, {
        keys: p => p.id,
        from: (percentage) => ({
            x: percentage.x,
            y: percentage.y,
            percentage: percentage.percentage,
            opacity: 0,
        }),
        enter: (percentage) => ({
            x: percentage.x,
            y: percentage.y,
            percentage: percentage.percentage,
            opacity: 1,
        }),
        update: (percentage) => ({
            x: percentage.x,
            y: percentage.y,
            percentage: percentage.percentage,
            opacity: 1,
        }),
        leave: {
            opacity: 0,
        },
        config: config.slow,
    })

    return (
        <>
            {transition(({ x, y, opacity }, percentage) => {
                return (
                    <animated.g
                        key={percentage.id}
                        opacity={opacity}
                        transform={to([x, y], (_x, _y) => {
                            return `translate(${_x},${_y})`
                        })}
                        style={{
                            pointerEvents: 'none'
                        }}
                    >
                        <Label
                            textAnchor="middle"
                            dominantBaseline="central"
                            style={{
                                stroke: percentage.color,
                                strokeWidth: 4,
                            }}
                        >
                            {percentage.percentage}%
                        </Label>
                        <Label
                            textAnchor="middle"
                            dominantBaseline="central"
                        >
                            {percentage.percentage}%
                        </Label>
                    </animated.g>
                )
            })}
        </>
    )
}

const Label = styled.text`
    font-size: ${({ theme }) => theme.typography.size.smaller};
    font-weight: ${({ theme }) => theme.typography.weight.medium};
    fill: ${({ theme }) => theme.colors.textInverted};
    stroke-linejoin: round;
`
