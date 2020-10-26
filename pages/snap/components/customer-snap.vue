<template>
  <div class="customer-container">
    <div class="filter-top">
      <div>
        <common-dealer-filter @getData="getCustomerData"></common-dealer-filter>
      </div>
      <el-radio-group v-model="currentRadio" size="small" class="mr-15">
        <el-radio-button label="guest">潜客</el-radio-button>
        <el-radio-button label="fans">粉丝</el-radio-button>
      </el-radio-group>
    </div>
    <el-row v-if="currentRadio === 'guest'">
      <bar-chart
        class="guest-chart-wrap"
        :showLegend="false"
        :series="guestSeriesData"
        :title="guestTitle"
        chartId="guestChartId"
        :xData="xDataArr"
      />
    </el-row>
    <el-row class="fans-content" v-if="currentRadio === 'fans'">
      <div class="total-content">
        <div class="total-box" v-for="item in totalFansArr" :key="item.key">
          <div class="total-num">{{ item.value }}</div>
          <div class="total-label">{{ item.label }}</div>
        </div>
      </div>
      <area-chart chartId="fansAreaId" class="fans-area-chart" :xData="xDataArr" :series="fansSeriesData" />
    </el-row>
  </div>
</template>

<script lang="ts">
import { Component, Vue, Watch, Ref, Prop } from "vue-property-decorator";
import { getFansStatisticsBar, getGuestStatisticsBar } from "@/api";
import { storeInfoSetting } from "@/utils/userSetting";

import { getAllDate } from "@/utils/";
import areaChart from "./areaChart.vue";
import barChart from "./barChart.vue";
import { dateToTamp } from "@/utils";
import dayjs from "dayjs";
import commonDealerFilter from "./commonDealerFilter.vue";
const startSuffix = " 00:00:00";
const endSuffix = " 23:59:59";
@Component({
  name: "customer-snap",
  components: {
    areaChart,
    barChart,
    commonDealerFilter
  }
})
export default class CustomSnap extends Vue {
  @Prop({ default: () => [] }) dateRange: Array<any>;
  @Prop({ default: () => [] }) bu2Region: Array<any>;
  @Prop({ default: () => [] }) dealerList: Array<any>;
  @Prop({ default: 0 }) dealerTotal: number;
  private: number = 10;
  private sysPlat: any = "agent";
  currentRadio: string = "guest";
  title: string = "";
  buId: string = "";
  regId: string = "";
  dealerCode: string = "";
  xDataArr: Array<any> = [];
  allRegion: any[] = [{ name: "全部大区", code: "", id: "" }];
  dealerObj: any = {};

  /**
   * 粉丝数据
   */
  private fansSeriesData = [
    {
      name: "新增关注人数",
      key: "newlyAddedCount",
      color: ["rgba(18,125,215,1)", ["rgba(18,125,215,0.05)"]],
      type: "line",
      data: []
    },
    {
      name: "取消关注人数",
      type: "line",
      data: [],
      key: "cancelCount",
      color: ["rgba(226,80,171,1)", ["rgba(226,80,171,0.05)"]]
    },
    {
      name: "净增关注人数",
      type: "line",
      data: [],
      key: "netGrowthCount",
      color: ["rgba(102,40,255,1)", ["rgba(102,40,255,0.05)"]]
    }
  ];
  /**
   * 潜客数据
   */
  private guestSeriesData = [
    {
      name: "新增潜客",
      key: "newlyAddedCount",
      color: "rgba(18,125,215,1)",
      type: "line",
      data: []
    }
  ];
  /**
   * 粉丝统计
   */
  private totalFansArr: Array<any> = [
    {
      key: "totleCount",
      label: "累计关注人数",
      value: 0
    },
    {
      key: "newlyAddedCount",
      label: "新增关注人数",
      value: 0
    },
    {
      key: "cancelCount",
      label: "取消关注人数",
      value: 0
    },
    {
      key: "netGrowthCount",
      label: "净增关注人数",
      value: 0
    }
  ];

  /**
   * 潜客title
   */
  get guestTitle() {
    return this.title || "";
  }

  /**
   * 获取粉丝数据
   */
  async getFansData(row?: any) {
    let dealerCode;
    if (this.sysPlat === "agent") {
      let _info = (await storeInfoSetting.getInfo().info) || {};
      dealerCode = _info.dealerCode;
    } else {
      dealerCode = row.dealerCode;
    }
    let _params: any = {
      startAt: dayjs(this.dateRange[0]).format("YYYY-MM-DD") + startSuffix,
      endAt: dayjs(this.dateRange[1]).format("YYYY-MM-DD") + endSuffix
    };
    if (row.buId) {
      _params.buId = row.buId;
    }
    if (row.regId) {
      _params.regId = row.regId;
    }
    if (dealerCode) {
      _params.dealerCode = dealerCode;
    }
    let fanRes: any = await getFansStatisticsBar(_params, this.sysPlat);
    this.dealData(fanRes.data);
  }

  async getGuestData(row?: any) {
    let dealerCode;
    if (this.sysPlat === "agent") {
      let _info = (await storeInfoSetting.getInfo().info) || {};
      dealerCode = _info.dealerCode;
    } else {
      dealerCode = row.dealerCode;
    }
    let _params: any = {
      startAt: dayjs(this.dateRange[0]).format("YYYY-MM-DD") + startSuffix,
      endAt: dayjs(this.dateRange[1]).format("YYYY-MM-DD") + endSuffix
    };
    if (row.buId) {
      _params.buId = row.buId;
    }
    if (row.regId) {
      _params.regId = row.regId;
    }
    if (dealerCode) {
      _params.dealerCode = dealerCode;
    }
    let guestRes: any = await getGuestStatisticsBar(_params, this.sysPlat);
    this.dealGuestData(guestRes.data);
    this.title = `累计新增潜客：${guestRes.data.total || 0}`;
  }

  /**
   * 处理潜客数据
   * @param data
   */
  dealGuestData(data: any) {
    let { detail } = data;
    Object.keys(detail)
      .sort()
      .forEach((date: any) => {
        Object.keys(detail[date]).forEach((_key: any) => {
          let _obj: any = this.guestSeriesData.find((item: any) => item.key === _key);
          if (_obj) {
            _obj.data.push(detail[date][_key]);
          }
        });
      });
  }

  /**
   * 处理粉丝数据
   * @param data
   */
  dealData(data: any) {
    let { detail } = data;
    Object.keys(data).forEach((key: any) => {
      let _obj2: any = this.totalFansArr.find((item: any) => item.key === key) || {};
      if (_obj2) {
        _obj2.value = data[key];
      }
    });
    Object.keys(detail)
      .sort()
      .forEach((date: any) => {
        Object.keys(detail[date]).forEach((_key: any) => {
          let _obj: any = this.fansSeriesData.find((item: any) => item.key === _key);
          if (_obj) {
            _obj.data.push(detail[date][_key]);
          }
        });
      });
  }

  /**
   * 重置数据
   */
  resetData() {
    this.guestSeriesData = this.guestSeriesData.map((item: any) => {
      return {
        ...item,
        data: []
      };
    });
    this.fansSeriesData = this.fansSeriesData.map((item: any) => {
      return {
        ...item,
        data: []
      };
    });
  }

  loadDealerList() {
    let regionObj = this.allRegion.find((item: any) => item.id === this.regId) || {};
    let buObj = this.bu2Region.find((item: any) => item.id === this.buId) || {};
    this.$emit("getDealerList", {
      region: this.regId ? regionObj.name : "",
      buName: this.buId ? buObj.name : ""
    });
  }
  changeDealer() {
    this.getCustomerData();
  }

  @Watch("dateRange")
  onDateRange() {
    this.getCustomerData(this.dealerObj);
  }

  getCustomerData(row?: any) {
    this.resetData();
    this.dealerObj = row;
    this.xDataArr = getAllDate(this.dateRange[0], this.dateRange[1]);
    this.getFansData(row || {});
    this.getGuestData(row || {});
  }
  created() {
    this.sysPlat = this.$route.query.sysPlat || "agent";
    this.getCustomerData();
  }
}
</script>
<style lang="scss">
.customer-container {
  position: relative;
  width: 100%;
  /*height: 500px;*/
  .filter-top {
    display: flex;
    flex-direction: row;
    justify-content: space-between;
  }
  .total-content {
    display: flex;
    justify-content: space-between;
    margin-bottom: 15px;
    .total-box {
      display: flex;
      flex-direction: column;
      justify-content: center;
      align-items: center;
      width: 24%;
      height: 100px;
      box-shadow: 0 2px 12px 0 rgba(43, 114, 174, 0.14);
      border-radius: 5px;
      color: $primary-color;
      font-size: 14px;
      font-weight: 600;
    }
  }
  .fans-content {
    width: 100%;
  }
  .guest-chart-wrap {
    width: 100%;
    height: 450px;
  }
  .fans-area-chart {
    width: 100%;
    height: 450px;
  }
}
</style>
