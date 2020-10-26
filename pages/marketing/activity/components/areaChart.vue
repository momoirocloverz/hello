<template>
  <div class="area-chart-wrap" :id="chartId"></div>
</template>

<script lang="ts">
import "echarts/lib/chart/line";
import "echarts/lib/component/legend";
import "echarts/lib/component/title";
import "echarts/lib/component/tooltip";
const echarts = require("echarts/lib/echarts");
import { Component, Vue, Prop, Watch } from "vue-property-decorator";
const seriesConfig = {
  type: "line",
  smooth: true,
  areaStyle: {
    opacity: 0.25
  }
};

@Component({
  name: "areaChart"
})
export default class extends Vue {
  @Prop({ default: "areaId" }) private chartId!: string;
  @Prop({ default: () => [] }) private legendData!: Array<any>;
  @Prop({ default: () => [] }) private series: Array<any>;
  @Prop({ default: () => [] }) private xData: Array<any>;
  chart: any;
  option: object = {};
  private setChartOption() {
    let _series = this.series.map((item: any) => {
      return {
        ...seriesConfig,
        itemStyle: {
          normal: {
            color: new echarts.graphic.LinearGradient(0, 0, 0, 1, [
              {
                offset: 0,
                color: item.color[0] // 0% 处的颜色
              },
              {
                offset: 1,
                color: item.color[1] // 100% 处的颜色
              }
            ]),
            lineStyle: {
              width: 1,
              color: item.color[0]
            }
          },
          emphasis: {
            color: item.color[0],
            lineStyle: {
              // 系列级个性化折线样式
              width: 1,
              type: "dotted",
              color: item.color[0]
            }
          }
        },

        ...item
      };
    });
    this.option = {
      tooltip: {
        trigger: "axis"
      },
      legend: {
        data: this.legendData
      },
      title: {
        text: "活动数据统计",
        itemGap: 0,
        top: 0,
        subtextStyle: {
          color: "rgba(248, 249, 249, 0.85)",
          fontSize: 8,
          fontWeight: 500
        }
      },
      grid: {
        left: "5%",
        right: "5%",
        bottom: "2%",
        containLabel: true
      },
      xAxis: {
        type: "category",
        boundaryGap: false,
        data: this.xData,
        axisTick: {
          show: false
        },
        axisLabel: {
          show: true,
          textStyle: {
            color: () => "rgba(9, 16, 23, 1)",
            fontWeight: 300
          }
        },
        axisLine: {
          show: true,
          lineStyle: {
            color: "rgba(205, 205, 205, 1)",
            borderWidth: 1
          },
          textStyle: {
            color: "rgba(249,249,249,0.6)",
            fontWeight: 300
          }
        },
        splitArea: { show: false }
      },
      yAxis: {
        type: "value",
        splitLine: {
          show: true,
          lineStyle: {
            color: "rgba(205, 205, 205, 1)"
          }
        },
        axisLine: {
          show: true,
          lineStyle: {
            color: "rgba(205, 205, 205, 1)"
          }
        },
        splitArea: { show: false }
      },
      series: _series
    };
  }
  private drawArea(id: string) {
    let o = document.getElementById(id);
    this.chart = echarts.init(o);
    this.chart.setOption(this.option);
  }
  @Watch("series", { immediate: true, deep: true })
  onSeries() {
    this.$nextTick(() => {
      this.setChartOption();
      this.drawArea(this.chartId);
    });
  }

  mounted() {
    this.$nextTick(() => {
      this.setChartOption();
      this.drawArea(this.chartId);
    });
    window.onresize = () => {
      this.chart.resize();
    };
  }
}
</script>

<style scoped></style>
