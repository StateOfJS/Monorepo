import React from 'react'
import styled from 'styled-components'
import { useI18n } from 'core/i18n/i18nContext'
import { staticProps } from './config'
import { SankeyLinkDatum } from '../types'

export const TransitionLegend = ({ link }: { link: SankeyLinkDatum }) => {
    const { translate } = useI18n()

    const x0 = link.source.x
    const x1 = link.target.x + link.target.width

    return (
        <g transform={`translate(0,${staticProps.chartHeight})`}>
            <ExperienceLabel
                x={x0}
                y={14}
                textAnchor="start"
                dominantBaseline="central"
            >
                {translate!(`options.tools.${link.source.choice}.short`)}
            </ExperienceLabel>
            <ExperienceLabel
                x={x1}
                y={14}
                textAnchor="end"
                dominantBaseline="central"
            >
                {translate!(`options.tools.${link.target.choice}.short`)}
            </ExperienceLabel>
            <Separator
                className="ToolsExperienceTransitionsSeparator"
                x1={x1}
                y1={26}
                x2={x0}
                y2={26}
            />
            <Values
                x={x1}
                y={38}
                textAnchor="end"
                dominantBaseline="central"
            >
                {link.percentage}% [{link.value}]
            </Values>
        </g>
    )
}

const ExperienceLabel = styled.text`
    font-size: ${({ theme }) => theme.typography.size.smaller};
    fill: ${({ theme }) => theme.colors.text};
`

const Separator = styled.line`
    stroke: ${({ theme }) => theme.colors.border};
    opacity: .4;
`

const Values = styled.text`
    font-size: ${({ theme }) => theme.typography.size.smaller};
    font-weight: ${({ theme }) => theme.typography.weight.medium};
    fill: ${({ theme }) => theme.colors.text};
`
