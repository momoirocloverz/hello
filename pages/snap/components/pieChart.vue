<template>
  <div class="bar-chart-wrap" :id="chartId"></div>
</template>

<script lang="ts">
import { Component, Vue, Prop, Watch } from "vue-property-decorator";
import "echarts/lib/chart/pie";
import "echarts/lib/component/legend";
import "echarts/lib/component/title";
import "echarts/lib/component/tooltip";
const echarts = require("echarts/lib/echarts");
@Component({
  name: "pieChart"
})
export default class extends Vue {
  @Prop({ default: "pieChartId" }) private chartId!: string;
  @Prop({ default: () => [] }) private series: Array<any>;
  @Prop({ default: () => "" }) private title: string;
  chart: any;
  option: object = {};
  private setChartOption() {
    let _legendData: Array<any> = [];
    let _series = this.series.map((item: any) => {
      _legendData.push({
        name: item.name,
        icon: "circle"
      });
      return {
        type: "pie",
        itemStyle: {
          color: item.color
        },
        ...item
      };
    });
    this.option = {
      title: {
        text: this.title,
        subtext: "",
        x: "center"
      },
      tooltip: {
        trigger: "item",
        formatter: "{b}: {c} ({d}%)"
      },
      legend: {
        bottom: 10,
        data: _legendData
      },
      series: [
        {
          name: "",
          type: "pie",
          radius: ["40%", "45%"],
          label: {
            emphasis: {
              show: true,
              textStyle: {
              }
            }
          },

          data: _series
        }
      ]
    };
  }

  private drawPie(id: string) {
    let o = document.getElementById(id);
    this.chart = echarts.init(o);
    this.chart.setOption(this.option);
  }
  @Watch("series", { immediate: true, deep: true })
  onSeries() {
    this.$nextTick(() => {
      this.setChartOption();
      this.drawPie(this.chartId);
    });
  }

  mounted() {
    window.onresize = () => {
      this.chart.resize();
    };
    this.$nextTick(() => {
      this.setChartOption();
      this.drawPie(this.chartId);
    });
  }
}
</script>

<style scoped>
.bar-chart-wrap {
  width: 100%;
  height: 100%;
}
</style>
