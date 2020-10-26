<template>
  <el-card>
    <actualTopFactory v-if="$route.query.sysPlat === 'factory'"
                      :sumaryData="sumaryData" />
    <div class="common_flex-space-center"
         v-else>
      <actualTop :text="text"
                 :sumaryData="sumaryData" />
      <div ref="chart__box"
           v-show="showChart"
           class="chart__box" />
    </div>
  </el-card>
</template>

<script lang="ts">
import { Component, Prop, Vue, Watch, PropSync, Ref } from "vue-property-decorator";
import { appointSeries, scanSeries, testDriveSeries, optionSet } from "../const/actualSnap.config";
import { actualStatisticCount, manufacturerCount, getStatisticsMap } from "@/api";
import actualTop from "./actual-top.vue";
import actualTopFactory from "./actual-top-factory.vue";
import dayjs from "dayjs";
const echarts = require("echarts/lib/echarts");
require("echarts/lib/chart/bar");
require("echarts/lib/component/legend");
require("echarts/lib/component/tooltip");

const startSuffix = " 00:00:00";
const endSuffix = " 23:59:59";
const statisticType = "BY_HOUR";
let xAxisData: string[] = [];
let scanData: number[] = [];
let appointData: number[] = [];
let testDriveData: number[] = [];

@Component({
  components: { actualTop, actualTopFactory }
})
export default class ActualSnap extends Vue {
  @Ref() readonly chart__box: any;
  @PropSync("pageUpdatedTime", { type: Date }) _pageUpdatedTime: Date;
  @Prop({ type: String }) actualDealerCode: string;
  readonly text: string[] = ["浏览人数", "预约试驾人数", "在线预订人数"];
  chartBox: any = null;
  today: string = dayjs(new Date()).format("YYYY-MM-DD");
  sumaryData: any = {};
  showChart: boolean = false;
  timer: number = 0;
  @Watch("actualDealerCode")
  getData() {
    clearInterval(this.timer);
    this.actualStatisticCount();
    this.getStatisticsMap();
    this.timer = setInterval(() => {
      this.actualStatisticCount();
      this.getStatisticsMap();
    }, 90 * 1000);
  }
  drawChart() {
    this.chartBox = echarts.init(this.chart__box);
    this.chartBox.setOption({
      ...optionSet,
      xAxis: {
        interval: 0,
        type: "category",
        data: xAxisData
      },
      grid: {
        top: "3%",
        left: "7%"
      },
      legend: [
        {
          bottom: 0,
          data: this.text
        }
      ],
      series: [
        {
          ...scanSeries,
          name: this.text[0],
          data: scanData
        },
        {
          ...appointSeries,
          name: this.text[1],
          data: appointData
        },
        {
          ...testDriveSeries,
          name: this.text[2],
          data: testDriveData
        }
      ]
    });
  }
  async actualStatisticCount() {
    try {
      const fn = this.$route.query.sysPlat === "factory" ? manufacturerCount : actualStatisticCount;
      const params: any = {
        statisticType,
        startDate: dayjs(new Date()).format("YYYY-MM-DD") + startSuffix,
        endDate: dayjs(new Date()).format("YYYY-MM-DD") + endSuffix
      };
      if (this.actualDealerCode) {
        params.dealerCodes = this.actualDealerCode;
      }
      const { data } = await fn(params);
      this._pageUpdatedTime = new Date();
      this.sumaryData = data;
    } catch (e) {
      this.log(e);
    }
  }
  async getStatisticsMap() {
    const { sysPlat } = this.$route.query;
    if (sysPlat === "factory") return;
    try {
      const params: any = {
        statisticType,
        startDate: dayjs(new Date()).format("YYYY-MM-DD") + startSuffix,
        endDate: dayjs(new Date()).format("YYYY-MM-DD") + endSuffix
      };
      if (this.actualDealerCode) {
        params.dealerCodes = this.actualDealerCode;
      }
      const res: any = await getStatisticsMap(params);
      if (res.data) {
        this.showChart = true;
        const data = res.data;
        const xDataTmp: any[] = Object.keys(res.data).sort((a: any, b: any) => a - b);
        xAxisData = [];
        scanData = [];
        appointData = [];
        testDriveData = [];
        for (let index of xDataTmp) {
          xAxisData.push(`${this.today} ${(index + "").padStart(2, "0")}:00`);
          scanData.push(data[index].browseUserTotal || 0);
          appointData.push(data[index].testDriveUserTotal || 0);
          testDriveData.push(data[index].prePurchaseUserTotal || 0);
        }
        setTimeout(() => {
          this.drawChart();
        });
      }
    } catch (e) {
      this.log(e);
    }
  }
  mounted() {
    this.getData();
  }
  beforeDestroy() {
    clearInterval(this.timer);
  }
}
</script>
<style lang="scss" scoped>
.chart__box {
  height: 320px;
  width: 100%;
}
/deep/ {
  .top_content {
    padding: 20px;
  }
  .t_content {
    display: flex;
    border-radius: 10px;
    align-items: center;
  }
  .comment {
    display: flex;
    flex-direction: column;
    justify-content: space-between;
  }
  p {
    margin: 0;
  }
}
</style>
