import React from 'react'
import styled from 'styled-components'
import { Entity } from 'core/types'

export const ToolLegend = ({ tool }: { tool: Entity }) => (
    <Container>
        <Label>
            {tool.name}
        </Label>
    </Container>
)

const Container = styled.div`
    flex-grow: 0;
    flex-shrink: 0;
    width: 20px;
    display: flex;
    align-items: center;
    justify-content: center;
`

export const Label = styled.div`
    height: 20px;
    display: flex;
    align-items: center;
    padding: 0 12px;
    white-space: nowrap;
    color: ${({ theme }) => theme.colors.text};
    transform: rotate(-90deg);
    font-size: ${({ theme }) => theme.typography.size.smaller};
    font-weight: ${({ theme }) => theme.typography.weight.bold};
`
