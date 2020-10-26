const serieShare = {
  type: 'bar',
  smooth: true,
  barWidth: 10,
}
export const colorSet = [
  'rgba(117,43,255,1)',
  'rgba(53,140,213,1)',
  'rgba(238,146,158,1)'
]
export const scanSeries = {
  ...serieShare,
  itemStyle: {
    normal: {
      color: colorSet[0]
    }
  },
};
export const appointSeries = {
  ...serieShare,
  itemStyle: {
    normal: {
      color: colorSet[1]
    }
  },
};
export const testDriveSeries = {
  ...serieShare,
  itemStyle: {
    normal: {
      color: colorSet[2]
    }
  },
};
export const optionSet = {
  tooltip: {
    trigger: 'axis',
    axisPointer: {
      type: 'shadow'
    }
  },
  grid: {
    left: '5%',
    right: 20
  },
  yAxis: {
    type: 'value',
    boundaryGap: [0, '50%']
  },
}
