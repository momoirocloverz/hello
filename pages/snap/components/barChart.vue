<template>
  <div class="bar-chart-wrap" :id="chartId"></div>
</template>

<script lang="ts">
import { Component, Vue, Prop, Watch } from "vue-property-decorator";
import "echarts/lib/chart/bar";
import "echarts/lib/component/legend";
import "echarts/lib/component/title";
import "echarts/lib/component/tooltip";
const echarts = require("echarts/lib/echarts");
@Component({
  name: "barChart"
})
export default class extends Vue {
  @Prop({ default: "barChartId" }) private chartId!: string;
  @Prop({ default: () => [] }) private legendData!: Array<any>;
  @Prop({ default: () => [] }) private series: Array<any>;
  @Prop({ default: () => [] }) private xData: Array<any>;
  @Prop({ default: () => true }) private showLegend: boolean;
  @Prop({ default: () => "" }) private title: string;
  chart: any;
  option: object = {};
  private setChartOption() {
    let _legend: Array<any> = [];
    let _series = this.series.map((item: any) => {
      _legend.push({
        name: item.name
      });
      return {
        type: "bar",
        smooth: true,
        barMaxWidth: 10,
        itemStyle: {
          color: item.color
        },

        ...item
      };
    });
    this.option = {
      title: {
        text: this.title,
        subtext: ""
      },
      tooltip: {
        trigger: "axis"
      },
      legend: {
        show: this.showLegend,
        bottom: 0,
        data: _legend
      },
      toolbox: {
        show: true,
        feature: {
          magicType: { show: true, type: ["line", "bar"] }
        }
      },
      grid: {
        left: "1%",
        right: "5%",
        bottom: "7%",
        containLabel: true
      },
      calculable: true,
      xAxis: [
        {
          type: "category",
          data: this.xData,
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
              color: "#CDCDCD",
              borderWidth: 1
            },
            textStyle: {
              color: "#CDCDCD",
              fontWeight: 300
            }
          }
        }
      ],
      yAxis: [
        {
          type: "value",
          splitLine: {
            show: true,
            lineStyle: {
              color: "#CDCDCD"
            }
          },
          axisLine: {
            show: true,
            lineStyle: {
              color: "#CDCDCD"
            }
          },
          boundaryGap: [0, "50%"]
        }
      ],
      series: _series
    };
  }

  private drawBar(id: string) {
    let o = document.getElementById(id);
    this.chart = echarts.init(o);
    this.chart.setOption(this.option);
  }
  @Watch("series", { immediate: true, deep: true })
  onSeries() {
    this.$nextTick(() => {
      this.setChartOption();
      this.drawBar(this.chartId);
    });
  }

  mounted() {
    this.$nextTick(() => {
      this.setChartOption();
      this.drawBar(this.chartId);
    });
    window.onresize = () => {
      this.chart.resize();
    };
  }
}
</script>

<style scoped>
.bar-chart-wrap {
  width: 100%;
  height: 100%;
}
</style>
