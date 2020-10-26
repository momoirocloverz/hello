<template>
  <div class="marketing-content">
    <common-dealer-filter @getData="getMarketingData"></common-dealer-filter>
    <el-row :gutter="20" class="marketing-content">
      <el-col :span="8">
        <div class="type-chart">
          <pie-chart title="活动类型" :series="activityTypeData" chartId="typePieId"></pie-chart>
        </div>
        <div class="from-chart">
          <pie-chart title="活动来源" :series="activityFrom" chartId="fromPieId"></pie-chart>
        </div>
      </el-col>
      <el-col :span="16">
        <div class="total-content">
          <div class="total-box" v-for="item in totalArr" :key="item.key">
            <div class="total-num">{{ item.value }}</div>
            <div class="total-label">{{ item.label }}</div>
          </div>
        </div>
        <div class="bar-chart">
          <bar-chart chartId="marketing-bar" :xData="xDataArr" :series="seriesData" :xDataArr="xDataArr"></bar-chart>
        </div>
      </el-col>
    </el-row>
  </div>
</template>

<script lang="ts">
import { Component, Vue, Watch, Ref, Prop } from "vue-property-decorator";
import { getCampaignStatistics, getCampaignStatisticsBar } from "@/api";
import { storeInfoSetting } from "@/utils/userSetting";
import barChart from "./barChart.vue";
import pieChart from "./pieChart.vue";
import { getAllDate } from "@/utils/";
import { dateToTamp } from "@/utils";
import dayjs from "dayjs";
import commonDealerFilter from "./commonDealerFilter.vue";
@Component({
  name: "marketing-snap",
  components: {
    barChart,
    pieChart,
    commonDealerFilter
  }
})
export default class CustomSnap extends Vue {
  @Prop({ default: () => [] }) private dateRange: Array<any>;
  dealerObj: any = {};
  sysPlat: any = "agent";
  /**
   * 活动类型数据
   */
  private activityTypeData = [
    {
      name: "抽奖活动",
      value: 0,
      key: "luckyDrawCount",
      color: "#358CD5"
    },
    {
      name: "促销活动",
      value: 0,
      key: "groupCount",
      color: "#FF8F00"
    },
    {
      name: "线下活动",
      value: 0,
      key: "offLineCount",
      color: "#EE929E"
    }
  ];
  /**
   * 活动来源数据
   */
  private activityFrom = [
    {
      name: "自建",
      value: 0,
      key: "dealerCampaignCount",
      color: "#358CD5"
    },
    {
      name: "集团",
      value: 0,
      key: "blocCampaignCount",
      color: "#FF8F00"
    },
    {
      name: "主机厂",
      value: 0,
      key: "manufacturerCampaignCount",
      color: "#EE929E"
    }
  ];
  /**
   * 统计总数
   */
  private totalArr: Array<any> = [
    {
      key: "canpaignCount",
      label: "活动场次",
      value: 0
    },
    {
      key: "visitorsCount",
      label: "累计浏览人数",
      value: 0
    },
    {
      key: "participantionCount",
      label: "累计参与人数",
      value: 0
    }
  ];

  xDataArr: Array<any> = [];
  /**
   * 图表数据
   */
  private seriesData: Array<any> = [
    {
      name: "浏览人数",
      key: "visitorsCount",
      type: "line",
      color: "#358CD5",
      data: []
    },
    {
      name: "参与人数",
      key: "participantionCount",
      type: "line",
      color: "#EE929E",
      data: []
    }
  ];

  /**
   * 获取统计数据
   */
  async getStatisticData(row?: any) {
    let dealerCode;
    if (this.sysPlat === "agent") {
      let _info = (await storeInfoSetting.getInfo().info) || {};
      dealerCode = _info.dealerCode;
    } else {
      dealerCode = row.dealerCode;
    }
    let _params: any = {
      startAt: dateToTamp(dayjs(this.dateRange[0]).format("YYYY-MM-DD"), true),
      endAt: dateToTamp(dayjs(this.dateRange[1]).format("YYYY-MM-DD"), false),
      businessUnitId: row.buId,
      regionId: row.regId
    };
    if (dealerCode) {
      _params.dealerCode = dealerCode;
    }
    let pieRes = await getCampaignStatistics(_params);
    this.dealPieData(pieRes.data);
    let barRes = await getCampaignStatisticsBar(_params);
    this.dealBarData(barRes.data);
  }

  /**
   * 处理饼图数据
   * @param data
   */
  dealPieData(data: any) {
    Object.keys(data).forEach((key: string) => {
      let _obj: any = this.activityFrom.find((item: any) => item.key === key);
      if (_obj) {
        _obj.value = data[key];
      }
      let _obj1: any = this.activityTypeData.find((item: any) => item.key === key) || {};
      if (_obj1) {
        _obj1.value = data[key];
      }
      let _obj2: any = this.totalArr.find((item: any) => item.key === key) || {};
      if (_obj2) {
        _obj2.value = data[key];
      }
    });
  }

  /**
   * 处理柱状图
   * @param data
   */
  dealBarData(data: any) {
    let visitorsCount: Array<any> = [];
    let participantionCount: Array<any> = [];
    // 获取到的key无序
    Object.keys(data)
      .sort()
      .forEach((key: any) => {
        visitorsCount.push(data[key].visitorsCount);
        participantionCount.push(data[key].participantionCount);
      });

    let _obj: any = this.seriesData.find((item: any) => item.key === "visitorsCount");
    if (_obj) {
      _obj.data = visitorsCount;
    }
    let _obj1: any = this.seriesData.find((item: any) => item.key === "participantionCount");
    if (_obj1) {
      _obj1.data = participantionCount;
    }
  }
  @Watch("dateRange")
  onDateRange() {
    this.getMarketingData(this.dealerObj);
  }
  // @Watch("dealerCode")
  // onDealerCode() {
  //   this.getMarketingData();
  // }
  getMarketingData(row?: any) {
    this.dealerObj = row;
    this.xDataArr = getAllDate(this.dateRange[0], this.dateRange[1]);
    if (this.dateRange && this.dateRange.length > 0) {
      this.getStatisticData(row || {});
    }
  }
  mounted() {
    this.sysPlat = this.$route.query.sysPlat || "agent";
    this.getMarketingData({});
  }
}
</script>
<style lang="scss" scoped>
.marketing-content {
  .type-chart,
  .from-chart {
    width: 100%;
    height: 250px;
  }
  .total-content {
    display: flex;
    justify-content: space-between;
    .total-box {
      display: flex;
      flex-direction: column;
      justify-content: center;
      align-items: center;
      width: 31%;
      height: 100px;
      box-shadow: 0 2px 12px 0 rgba(43, 114, 174, 0.14);
      border-radius: 5px;
      color: $primary-color;
      font-size: 14px;
      font-weight: 600;
    }
  }
  .bar-chart {
    width: 100%;
    height: 400px;
  }
}
</style>
