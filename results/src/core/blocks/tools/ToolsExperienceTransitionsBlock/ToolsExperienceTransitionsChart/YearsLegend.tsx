import React, { memo, useMemo } from 'react'
import styled from 'styled-components'
import { SankeyYear } from '../types'
import { staticProps } from './config'

export const NonMemoizedYearsLegend = ({ years }: {
    years: SankeyYear[]
}) => {
    const pairs = useMemo(() => {
        const _pairs: {
            previous: SankeyYear
            next: SankeyYear
        }[] = []

        years.forEach((year, yearIndex) => {
            if (yearIndex === 0) return

            _pairs.push({
                previous: years[yearIndex - 1],
                next: year,
            })
        })

        return _pairs
    }, [years])

    return (
        <>
            {pairs.map(({previous, next}) => (
                <g
                    key={`${previous.year}.${next.year}`}
                    transform={`translate(0,-${staticProps.yearsLegendHeight / 2})`}
                    opacity={.4}
                >
                    <Line
                        x1={previous.x + staticProps.yearsLegendSpacing}
                        x2={next.x - staticProps.yearsLegendSpacing}
                    />
                    <g transform={`translate(${next.x - staticProps.yearsLegendSpacing},0)`}>
                        <PolyLine
                            points={`
                                -${staticProps.yearsLegendArrowSize},-${staticProps.yearsLegendArrowSize}
                                0,0
                                -${staticProps.yearsLegendArrowSize},${staticProps.yearsLegendArrowSize}
                            `}
                        />
                    </g>
                </g>
            ))}
            {years.map(year => (
                <g
                    key={year.year}
                    transform={`translate(${year.x},-${staticProps.yearsLegendHeight / 2})`}
                >
                    <YearLabel
                        textAnchor="middle"
                        dominantBaseline="central"
                    >
                        {year.year}
                    </YearLabel>
                </g>
            ))}
        </>
    )
}

const Line = styled.line`
    stroke: ${({ theme }) => theme.colors.border}; 
`

const PolyLine = styled.polyline`
    fill: none;
    stroke: ${({ theme }) => theme.colors.border}; 
`

const YearLabel = styled.text`
    font-size: ${({ theme }) => theme.typography.size.smaller};
    fill: ${({ theme }) => theme.colors.text};
  
`

export const YearsLegend = memo(NonMemoizedYearsLegend)
