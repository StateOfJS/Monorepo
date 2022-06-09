import { SankeyLinkDatum } from '../types'

export const getLinkId = (link: SankeyLinkDatum) => `${link.source.id}.${link.target.id}`
