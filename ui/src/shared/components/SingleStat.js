import React, {PropTypes, PureComponent} from 'react'
import _ from 'lodash'
import classnames from 'classnames'
import lastValues from 'shared/parsing/lastValues'

import {SMALL_CELL_HEIGHT} from 'shared/graphs/helpers'
import {SINGLE_STAT_TEXT} from 'src/dashboards/constants/gaugeColors'
import {isBackgroundLight} from 'shared/constants/colorOperations'

const darkText = '#292933'
const lightText = '#ffffff'

class SingleStat extends PureComponent {
  render() {
    const {
      data,
      cellHeight,
      isFetchingInitially,
      colors,
      prefix,
      suffix,
      lineGraph,
    } = this.props

    // If data for this graph is being fetched for the first time, show a graph-wide spinner.
    if (isFetchingInitially) {
      return (
        <div className="graph-empty">
          <h3 className="graph-spinner" />
        </div>
      )
    }

    const lastValue = lastValues(data)[1]

    const precision = 100.0
    const roundedValue = Math.round(+lastValue * precision) / precision
    let bgColor = null
    let textColor = null

    if (colors.length === 1) {
      if (colors[0].type === SINGLE_STAT_TEXT) {
        textColor = colors[0].hex
      } else {
        bgColor = colors[0].hex
        textColor = isBackgroundLight(bgColor) ? darkText : lightText
      }
    } else if (colors.length > 1) {
      const sortedColors = _.sortBy(colors, color => Number(color.value))
      const nearestCrossedThreshold = sortedColors
        .filter(color => lastValue > color.value)
        .pop()

      const colorizeText = _.some(colors, {type: SINGLE_STAT_TEXT})

      if (colorizeText) {
        textColor = nearestCrossedThreshold
          ? nearestCrossedThreshold.hex
          : '#292933'
      } else {
        bgColor = nearestCrossedThreshold
          ? nearestCrossedThreshold.hex
          : '#292933'
        textColor = isBackgroundLight(bgColor) ? darkText : lightText
      }
    }

    return (
      <div
        className="single-stat"
        style={{backgroundColor: bgColor, color: textColor}}
      >
        <span
          className={classnames('single-stat--value', {
            'single-stat--small': cellHeight === SMALL_CELL_HEIGHT,
          })}
        >
          {prefix}
          {roundedValue}
          {suffix}
          {lineGraph && <div className="single-stat--shadow" />}
        </span>
      </div>
    )
  }
}

const {arrayOf, bool, number, shape, string} = PropTypes

SingleStat.propTypes = {
  data: arrayOf(shape()).isRequired,
  isFetchingInitially: bool,
  cellHeight: number,
  colors: arrayOf(
    shape({
      type: string.isRequired,
      hex: string.isRequired,
      id: string.isRequired,
      name: string.isRequired,
      value: string.isRequired,
    }).isRequired
  ),
  prefix: string,
  suffix: string,
  lineGraph: bool,
}

export default SingleStat
