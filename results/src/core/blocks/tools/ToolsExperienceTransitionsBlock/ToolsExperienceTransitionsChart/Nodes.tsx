import React from 'react'
import { ToolExperienceId } from 'core/bucket_keys'
import { SankeyNodeDatum } from '../types'
import { Node } from './Node'

export const Nodes = ({
    nodes,
    currentExperience,
    setCurrentExperience,
}: {
    nodes: SankeyNodeDatum[]
    currentExperience: ToolExperienceId
    setCurrentExperience: (experience: ToolExperienceId) => void
}) => (
    <>
        {nodes.map(node => (
            <Node
                key={node.id}
                node={node}
                isCurrent={node.choice === currentExperience}
                setCurrentExperience={setCurrentExperience}
            />
        ))}
    </>
)
