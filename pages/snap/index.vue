<template>
  <div id="snap_main_box">
    <div class="snap_title title">
      <b v-if="sysPlat === 'factory'">总体概览</b>
      <b v-else>{{ sysPlat === "company" ? "经销商" : "" }}实时概览</b>

      <div>
        <span class="update_time"> 更新时间： {{ dayjs(pageUpdatedTime).format("YYYY-MM-DD HH:mm:ss") }} </span>
      </div>
    </div>
    <actualSanp :pageUpdatedTime.sync="pageUpdatedTime" :actualDealerCode="actualDealerCode" />

    <el-card class="statistics-tab">
      <div class="statistics-top">
        <div class="left">
          <el-button
            class="tab-item"
            @click="changeTab(tab)"
            :type="curTab === tab.key ? 'primary' : ''"
            v-for="tab in tabArr"
            :key="tab.key"
            >{{ tab.label }}</el-button
          >
        </div>
        <div class="right">
          <el-select
            size="small"
            v-model="range"
            @change="changeTimeRange"
            class="mr-15"
            style="width: 130px"
            v-if="sysPlat === 'agent'"
          >
            <el-option v-for="item in timeRange" :value="item.value" :label="item.label" :key="item.value" />
          </el-select>

          <el-date-picker
            v-model="dateRange"
            @change="changeDate"
            type="daterange"
            range-separator="-"
            start-placeholder="开始日期"
            end-placeholder="结束日期"
            size="small"
            :picker-options="pickerOptions"
            :clearable="false"
          />
        </div>
      </div>
      <!--营销概览概览-->
      <marketing-snap :dateRange="dateRange" v-if="curTab === 'marketing'" />
      <!--客户概览-->
      <customer-snap :dateRange="dateRange" v-if="curTab === 'customer'" />
      <!--商城概览-->
      <mallSnap :dateRange="dateRange" v-if="curTab === 'mall'" />
    </el-card>
  </div>
</template>

<script lang="ts">
import { Component, Vue, Ref } from "vue-property-decorator";
import marketingSnap from "./components/marketing-snap.vue";
import customerSnap from "./components/customer-snap.vue";
import dayjs from "dayjs";

import actualSanp from "./components/actual-snap.vue";
import mallSnap from "./components/mall-snap.vue";
@Component({
  components: {
    marketingSnap,
    actualSanp,
    customerSnap,
    mallSnap
  }
})
export default class Snap extends Vue {
  private sysPlat: any = "agent";
  readonly dayjs = dayjs;
  pageUpdatedTime: Date = new Date();
  dealerList: Array<any> = [];
  dealerCode: any = "";
  actualDealerCode: any = "";
  private range: any = 7;
  private curTab: string = "marketing";
  /**
   * 时间选择范围
   */
  readonly timeRange: Array<any> = [
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
  get tabArr(): Array<any> {
    let _arr: Array<any> = [
      {
        key: "marketing",
        label: this.sysPlat === "agent" ? "营销概览" : "经销商营销概览"
      },
      {
        key: "customer",
        label: this.sysPlat === "agent" ? "客户概览" : "经销商客户概览"
      },
      {
        key: "mall",
        label: this.sysPlat === "agent" ? "商城概览" : "经销商商城概览"
      }
    ];
    if (this.sysPlat === "company") {
      _arr.splice(1, 2);
    }
    return _arr;
  }

  pickerOptions: any = {
    disabledDate(time: any) {
      let _now = Date.now();
      let _time = time;
      return _time > _now || _time < _now - 3600 * 1000 * 24 * 60;
    }
  };
  dateRange: Array<any> = [];
  changeTab(tab: any) {
    this.curTab = tab.key;
  }

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

  created() {
    this.sysPlat = this.$route.query.sysPlat || "agent";
    this.changeTimeRange();
  }
}
</script>
<style lang="scss" scoped>
.update_time {
  font-size: 14px;
  color: #666;
  font-weight: 400;
}
.snap_title {
  padding-right: 20px;
  font-size: 18px;
  margin: 15px 0;
  display: flex;
  align-items: center;
  justify-content: space-between;
}

.statistics-tab {
  display: flex;
  flex-direction: column;
  margin-top: 20px;
  .statistics-top {
    display: flex;
    justify-content: space-between;
    align-items: center;
    padding: 20px;
    .left {
      display: flex;
    }
  }
}
</style>
