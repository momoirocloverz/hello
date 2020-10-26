<template>
  <div>
    <el-row :gutter="20"
            class="row_bm">
      <el-col :span="24/pageCardList.length"
              v-for="(item, i) in pageCardList"
              :key="i">
        <el-card>
          <p class="part">{{ item[0] }}</p>
          <h3 class="part">{{ divideNumber(sumaryData[item[1]] || 0) }}</h3>
        </el-card>
      </el-col>
    </el-row>

    <div ref="chart_box"
         class="chart_box">

    </div>
  </div>
</template>

<script lang='ts'>
import { Component, Prop, Ref, Vue, Watch } from 'vue-property-decorator';
import divideNumber from "@/utils/divideNumber";
import { appointSeries, scanSeries, testDriveSeries, colorSet, optionSet } from '../const/actualSnap.config';
import { getAllDate } from "@/utils";
import { getStatisticsMap, actualStatisticCount } from "@/api";
import dayjs from "dayjs";
const echarts = require("echarts/lib/echarts");
require("echarts/lib/chart/line");
require("echarts/lib/component/tooltip");
const type = "line";
const startSuffix = ' 00:00:00';
const endSuffix = ' 23:59:59';
const statisticType = 'BY_DAY';
let xAxisData: string[] = []
let scanData: number[] = [41.1, 30.4, 65.1, 53.3, 83.8, 98.7];
let appointData: number[] = [24.1, 67.2, 79.5, 86.4, 65.2, 82.5];
let testDriveData: number[] = [55.2, 67.1, 69.2, 72.4, 53.9, 39.1];

@Component
export default class MallRightSumary extends Vue {
  @Ref() readonly chart_box: any;
  @Prop({ default: () => [] }) dateRange: string[];
  @Prop({ type: Object, default: () => { return {} } }) private regionObj: any;
  @Prop({ default: () => "" }) private dealerCode: any;
  readonly divideNumber = divideNumber;
  readonly pageCardList: string[][] = [
    ["浏览人数", "browseUserTotal"],
    ["在线预订人数", "prePurchaseUserTotal"],
    ["预约试驾人数", "testDriveUserTotal"]
  ];
  chartBox: any = null;
  sumaryData: any[] = [];
  @Watch("dateRange")
  @Watch("regionObj")
  @Watch("dealerCode")
  onChange() {
    this.init();
  }
  init() {
    const params = {
      businessUnitId: this.regionObj.buId,
      regionId: this.regionObj.regId,
      dealerCode: this.regionObj.dealerCode,
    }
    this.getStatisticsMap(params);
    this.actualStatisticCount(params);
  };
  async actualStatisticCount(row = {}) {
    try {
      const params: any = {
        statisticType,
        ...row,
        startDate: dayjs(this.dateRange[0]).format('YYYY-MM-DD') + startSuffix,
        endDate: dayjs(this.dateRange[1]).format('YYYY-MM-DD') + endSuffix,
      }
      if (this.dealerCode) {
        params.dealerCodes = this.dealerCode
      }
      const { data } = await actualStatisticCount(params);
      this.sumaryData = data;
    } catch (e) {
      this.log(e)
    }
  };
  async getStatisticsMap(row = {}) {
    try {
      const params: any = {
        ...row,
        statisticType,
        startDate: dayjs(this.dateRange[0]).format('YYYY-MM-DD') + startSuffix,
        endDate: dayjs(this.dateRange[1]).format('YYYY-MM-DD') + endSuffix,
      }
      if (this.dealerCode) {
        params.dealerCodes = this.dealerCode
      }
      let { data } = await getStatisticsMap(params)
      if (data) {
        xAxisData = Object.keys(data).sort((a: any, b: any) => {
          return new Date(a).getTime() - new Date(b).getTime()
        })
        scanData = [];
        appointData = [];
        testDriveData = [];
        for (let index of xAxisData) {
          scanData.push(
            (data[index].browseUserTotal || 0)
          )
          testDriveData.push(
            (data[index].testDriveUserTotal || 0)
          )
          appointData.push(
            (data[index].prePurchaseUserTotal || 0)
          )
        }
        setTimeout(() => {
          this.drawChart()
        })
      }
    } catch (e) {
      this.log(e)
    }
  };
  drawChart() {
    this.chartBox.setOption({
      ...optionSet,
      tooltip: {
        trigger: 'axis',
      },
      legend: [
        {
          bottom: 0,
          data: this.pageCardList.map(e => {
            return e[0]
          })
        }
      ],
      xAxis: {
        type: 'category',
        data: xAxisData
      },
      series: [
        {
          ...scanSeries,
          type,
          name: this.pageCardList[0][0],
          data: scanData
        },
        {
          ...appointSeries,
          type,
          name: this.pageCardList[1][0],
          data: appointData
        },
        {
          ...testDriveSeries,
          type,
          name: this.pageCardList[2][0],
          data: testDriveData
        }
      ]
    })
  };
  mounted() {
    this.chartBox = echarts.init(this.chart_box)
    this.init();
  }
}
</script>
<style lang="scss" scoped>
.part {
  color: #358cd5;
  text-align: center;
  margin: 0;
  font-size: 14px;
}
h3.part {
  font-size: 26px;
}
.chart_box {
  width: 100%;
  height: 320px;
}
</style>