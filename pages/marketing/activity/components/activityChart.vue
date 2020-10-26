<!--统计-->
<template>
  <el-row :gutter="20" class="statistics-count ">
    <el-col :span="18">
      <div class="statistics-time">
        <span class="tip">统计时间</span>
        <el-select size="small" v-model="range" @change="changeTimeRange" class="mr-15" style="width: 130px">
          <el-option v-for="item in timeRange" :value="item.value" :label="item.label" :key="item.value"></el-option>
        </el-select>
        <el-date-picker
          v-model="dateRange"
          @change="changeDate"
          type="daterange"
          value-format="timestamp"
          range-separator="-"
          start-placeholder="开始日期"
          end-placeholder="结束日期"
          size="small"
          :picker-options="pickerOptions"
        ></el-date-picker>
      </div>
      <area-chart
        class="area-chart"
        chartId="acitivityChart"
        :legendData="legendData"
        :xData="xData"
        :series="seriesArr"
      ></area-chart>
    </el-col>
    <el-col :span="6">
      <div class="statistics-list">
        <div class="statistics-item" v-for="(item, idx) in seriesData" :key="idx">
          <div class="info">
            <strong class="name">{{ item.name }}:</strong>
            <span>{{ item.total }}</span>
          </div>
        </div>
      </div>
    </el-col>
  </el-row>
</template>

<script lang="ts">
import { Component, Vue, Prop, Watch } from "vue-property-decorator";
import areaChart from "./areaChart.vue";
import { getActivityStatics } from "@/api";
import { getAllDate, dateToTamp } from "@/utils/";
import dayjs from "dayjs";
import { mixins } from "vue-class-component";
import ActivityMixin from "../mixin/activity.mixin";
import { storeInfoSetting } from "@/utils/userSetting";

@Component({
  name: "activityCount",
  components: {
    areaChart
  }
})
export default class extends mixins(ActivityMixin) {
  listData: Array<any> = [];
  private range: number | null = 7;
  timeRange: element.Options[] = [
    {
      label: "最近7天",
      value: 7
    },
    {
      label: "最近15天",
      value: 15
    },
    {
      label: "最近30天",
      value: 30
    }
  ];
  seriesData: Array<any> = [];
  xDataArr: Array<any> = [];
  pickerOptions: any = {
    disabledDate(time: any) {
      let _now = Date.now();
      let _time = time;
      return _time > _now || _time < _now - 3600 * 1000 * 24 * 60;
    }
  };
  dateRange: Array<any> = [];
  get seriesArr(): Array<any> {
    return this.seriesData;
  }
  get xData(): Array<any> {
    return this.xDataArr;
  }
  get legendData(): any[] {
    let _arr: Array<{}> = [];
    this.activityData.forEach((item: any) => {
      _arr.push(item.name);
    });
    return _arr;
  }
  get dateTimeRange(): any[] {
    let type = Object.prototype.toString.call(this.dateRange[1]);
    let [start, end] = this.dateRange;
    return type === "[object Date]" ? [start, end] : this.dateRange;
  }
  /**
   * 切换时间
   */
  private changeTimeRange() {
    let end: number = new Date().getTime();
    let start: number = new Date().getTime();
    const getStart = (num: any) => start - 3600 * 1000 * 24 * (num - 1);
    start = getStart(this.range);
    this.dateRange = [start, end];
  }
  changeDate(val: Array<any>) {
    this.range = null;
    this.dateRange = val;
  }
  /**
   * 处理数据
   * @param res
   */
  dealData(res: any) {
    this.seriesData = this.activityData.map((act: any) => {
      let _resObj: any = res.data[act.id];
      if (_resObj) {
        let _data: any[] = [];
        act.total = _resObj.total;
        _resObj.dots.forEach((item: any) => {
          _data.push(item.value);
        });
        act.data = _data;
      }
      return act;
    });
  }

  async getChatData() {
    let { dateTimeRange } = this;
    let dealerCode;
    let _params: any = {
      startTime: dateToTamp(dayjs(dateTimeRange[0]).format("YYYY-MM-DD")),
      endTime: dateToTamp(dayjs(dateTimeRange[1]).format("YYYY-MM-DD"), false),
      campaignId: this.activeId
    };
    if (this.activeItem === "agent") {
      if(!this.isAgent) {
        dealerCode = this.$route.query.dealerCode || "";
      }
      _params.dealerCode = dealerCode;
    }
    if(this.isAgent){
      dealerCode = this.dealerCode;
      _params.dealerCode = dealerCode;
    }
    let res = await getActivityStatics(_params);
    this.dealData(res);
  }
  @Watch("dateRange")
  onDateRange() {
    this.xDataArr = getAllDate(this.dateRange[0], this.dateRange[1]);
    this.getChatData();
  }

  created() {
    this.changeTimeRange();
  }
}
</script>

<style scoped lang="scss">
.statistics-count {
  margin: 20px;
  .statistics-time {
    margin-bottom: 15px;
    margin-left: 10px;
    .tip {
      margin-right: 10px;
    }
  }
  .area-chart {
    width: 100%;
    height: 400px;
  }
  .statistics-list {
    display: flex;
    align-items: center;
    flex-direction: column;
    justify-content: center;
    height: 400px;
    .statistics-item {
      display: flex;
      justify-content: center;
      align-items: center;
      width: 100%;
      padding: 10px;
      color: rgba(18, 125, 215, 1);
      background: rgba(18, 125, 215, 0.16);
      margin-bottom: 12px;
      border: 1px solid rgba(18, 125, 215, 0.2);
      box-shadow: 0px 0px 1px rgba(18, 125, 215, 0.2);
      .name {
        margin-right: 10px;
      }
    }
  }
}
</style>
