import React, { useMemo } from 'react'
import { ToolExperienceId } from 'core/bucket_keys'
import { SankeyNodeDatum, SankeyLinkDatum, SankeyYear } from '../types'
import { useChartContext } from './state'
import { YearsLegend } from './YearsLegend'
import { LinkPercentages } from './LinkPercentages'
import { Nodes } from './Nodes'
import { ExperienceLinks } from './ExperienceLinks'
import { TransitionLegend } from './TransitionLegend'

/**
 * Used to entirely replace the default nivo Sankey component,
 * the default component is only used to compute node positions
 * and links.
 *
 * This should be passed as the only layer to the Sankey component.
 */
export const CustomSankey = ({ nodes, links }: {
    nodes: SankeyNodeDatum[]
    links: SankeyLinkDatum[]
}) => {
    const {
        currentExperience,
        setCurrentExperience,
        currentTransition,
    } = useChartContext()

    const { years, linksByExperience } = useMemo(() => {
        const _years: SankeyYear[] = []

        const _linksByExperience: Partial<Record<ToolExperienceId, {
            experience: ToolExperienceId
            links: SankeyLinkDatum[]
        }>> = {}

        nodes.forEach(node => {
            let year = _years.find(y => y.year === node.year)
            if (!year) {
                year = {
                    year: node.year,
                    x: node.x0 + (node.x1 - node.x0) / 2,
                }
                _years.push(year)
            }
        })

        links.forEach(link => {
            if (!_linksByExperience[link.source.choice]) {
                _linksByExperience[link.source.choice] = {
                    experience: link.source.choice,
                    links: [],
                }
            }

            _linksByExperience[link.source.choice]!.links.push(link)
        })

        _years.sort((a, b) => a.year - b.year)

        return {
            years: _years,
            linksByExperience: Object.values(_linksByExperience),
        }
    }, [nodes, links])

    const currentLinks = useMemo(() =>
        linksByExperience.find(link => link.experience === currentExperience),
        [linksByExperience, currentExperience]
    )

    let currentTransitionLink: SankeyLinkDatum | undefined = undefined
    if (currentTransition !== null) {
        currentTransitionLink = currentLinks!.links.find(link => {
            return link.source.choice === currentTransition[0] && link.target.choice === currentTransition[1]
        })
    }

    return (
        <>
            <YearsLegend years={years} />
            <Nodes
                nodes={nodes}
                currentExperience={currentExperience}
                setCurrentExperience={setCurrentExperience}
            />
            {linksByExperience.map(links => (
                <ExperienceLinks
                    key={links.experience}
                    experience={links.experience}
                    links={links.links}
                    isActive={links.experience === currentExperience}
                />
            ))}
            <LinkPercentages links={currentLinks!.links} />
            {currentTransitionLink && <TransitionLegend link={currentTransitionLink} />}
        </>
    )
}