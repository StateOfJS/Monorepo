// @ts-ignore: indirect dependency managed by nivo
import { line, curveMonotoneX } from 'd3-shape'
import { SankeyLinkDatum } from '../types'

const sankeyLinkHorizontal = () => {
    const lineGenerator = line().curve(curveMonotoneX)

    return (link: SankeyLinkDatum, contract: number) => {
        const thickness = Math.max(1, link.thickness - contract * 2)
        const halfThickness = thickness / 2
        const linkLength = link.target.x0 - link.source.x1
        const padLength = linkLength * 0.12

        const dots: [number, number][] = [
            [link.source.x1, link.pos0 - halfThickness],
            [link.source.x1 + padLength, link.pos0 - halfThickness],
            [link.target.x0 - padLength, link.pos1 - halfThickness],
            [link.target.x0, link.pos1 - halfThickness],
            [link.target.x0, link.pos1 + halfThickness],
            [link.target.x0 - padLength, link.pos1 + halfThickness],
            [link.source.x1 + padLength, link.pos0 + halfThickness],
            [link.source.x1, link.pos0 + halfThickness],
            [link.source.x1, link.pos0 - halfThickness],
        ]

        return lineGenerator(dots) + 'Z'
    }
}

export const getLinkPath = sankeyLinkHorizontal()