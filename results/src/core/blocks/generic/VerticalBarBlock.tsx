import React, { memo, useState } from 'react'
import PropTypes from 'prop-types'
import { keys } from 'core/bucket_keys'
import BlockVariant from 'core/blocks/block/BlockVariant'
import ChartContainer from 'core/charts/ChartContainer'
import VerticalBarChart from 'core/charts/generic/VerticalBarChart'
import { usePageContext } from 'core/helpers/pageContext'
import { useLegends } from 'core/helpers/useBucketKeys'
// import T from 'core/i18n/T'
import { FacetItem, BlockComponentProps, BlockUnits } from 'core/types'
import { getTableData } from 'core/helpers/datatables'
import sumBy from 'lodash/sumBy'

export interface VerticalBarBlockProps extends BlockComponentProps {
    data: FacetItem
    controlledUnits: BlockUnits
    isCustom: boolean
}

const VerticalBarBlock = ({
    block,
    data,
    keys,
    controlledUnits,
    isCustom
}: VerticalBarBlockProps) => {
    if (!data) {
        throw new Error(`VerticalBarBlock: Missing data for block ${block.id}.`)
    }
    const {
        // id,
        mode = 'relative',
        defaultUnits = 'percentage_survey',
        translateData,
        chartNamespace = block.blockNamespace ?? block.id,
        colorVariant
    } = block

    const context = usePageContext()
    const { width } = context

    const [uncontrolledUnits, setUnits] = useState(defaultUnits)
    const units = controlledUnits || uncontrolledUnits
    
    const addNoAnswer = units === 'percentage_survey'
    const bucketKeys = keys && useLegends(block, keys, undefined, addNoAnswer)

    const { facets, completion } = data

    const countSum = sumBy(facets[0].buckets, b => b.count)
    const percentageSum = sumBy(facets[0].buckets, b => b.percentage_survey)
    const noAnswerBucket = {
        id: 'no_answer',
        count: completion.total - countSum,
        percentage_question: 0,
        percentage_survey: Math.round((100 - percentageSum)*10)/10
    }

    const buckets = addNoAnswer ? [...facets[0].buckets, noAnswerBucket] : facets[0].buckets
    const { total } = completion


    return (
        <BlockVariant
            tables={[
                getTableData({
                    legends: bucketKeys,
                    data: buckets,
                    valueKeys: ['percentage_survey', 'percentage_question', 'count'],
                    translateData
                })
            ]}
            units={controlledUnits ?? units}
            setUnits={setUnits}
            completion={completion}
            data={data}
            block={block}
            legendProps={{ layout: 'vertical' }}
        >
            <ChartContainer fit={true}>
                <VerticalBarChart
                    bucketKeys={bucketKeys}
                    total={total}
                    buckets={buckets}
                    i18nNamespace={chartNamespace}
                    translateData={translateData}
                    mode={mode}
                    units={controlledUnits ?? units}
                    viewportWidth={width}
                    colorVariant={isCustom ? 'secondary' : 'primary'}
                />
            </ChartContainer>
        </BlockVariant>
    )
}

VerticalBarBlock.propTypes = {
    block: PropTypes.shape({
        id: PropTypes.string.isRequired,
        dataPath: PropTypes.string.isRequired,
        bucketKeysName: PropTypes.oneOf(Object.keys(keys)),
        showDescription: PropTypes.bool,
        mode: PropTypes.oneOf(['absolute', 'relative']),
        units: PropTypes.oneOf(['percentage', 'count']),
        view: PropTypes.oneOf(['data', 'viz']),
        colorVariant: PropTypes.oneOf(['primary', 'secondary'])
    }).isRequired,
    data: PropTypes.shape({
        facets: PropTypes.arrayOf(
            PropTypes.shape({
                buckets: PropTypes.arrayOf(
                    PropTypes.shape({
                        id: PropTypes.oneOfType([PropTypes.string, PropTypes.number]).isRequired
                    })
                ).isRequired
            })
        ).isRequired
    }).isRequired
}

export default memo(VerticalBarBlock)
