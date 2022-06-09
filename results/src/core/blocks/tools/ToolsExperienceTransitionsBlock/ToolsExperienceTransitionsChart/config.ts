import { CustomSankey } from './CustomSankey'

export const staticProps = {
    layers: [CustomSankey],
    chartHeight: 140,
    margin: {
        // space for years legends
        top: 30,
        // extra space for last year legend
        right: 10,
        // space the current transition legend
        bottom: 50,
        // extra space for first year legend
        left: 10,
    },
    yearsLegendHeight: 30,
    yearsLegendSpacing: 26,
    yearsLegendArrowSize: 4,
    // nodes below this height won't have labels
    nodeLabelMinHeight: 28,
}