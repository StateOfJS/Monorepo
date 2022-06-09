import React, { memo, useMemo } from 'react'
import { useSpring, animated, config } from '@react-spring/web'
import { ToolExperienceId } from 'core/bucket_keys'
import { SankeyLinkDatum } from '../types'
import { LinkWithGradient} from './LinkWithGradient'
import { useChartContext } from './state'

export const NonMemoizedExperienceLinks = ({
    experience,
    links,
    isActive
}: {
    experience: ToolExperienceId
    links: SankeyLinkDatum[]
    isActive: boolean
}) => {
    const { toolId } = useChartContext()
    const maskId = `${experience}LinksMask${toolId}`
    const maxWidth = useMemo(() => Math.max(...links.map((link) => link.target.x0)), [links])
    const maskStyles = useSpring({
        width: isActive ? maxWidth : 0,
        opacity: isActive ? 1 : 0,
        config: config.slow,
    })

    return (
        <>
            <mask id={maskId}>
                <animated.rect
                    width={maskStyles.width}
                    height={1000}
                    fill="white"
                />
            </mask>
            <animated.g
                mask={`url(#${maskId})`}
                opacity={maskStyles.opacity}
            >
                {links.map((link) => (
                    <LinkWithGradient
                        key={`${link.source.id}.${link.target.id}`}
                        link={link}
                        isActive={isActive}
                    />
                ))}
            </animated.g>
        </>
    )
}

export const ExperienceLinks = memo(NonMemoizedExperienceLinks)
