<template>
  <div>
    <el-button :type="currentTab===1?'primary':'info'"
               :plain="currentTab===2?true:false"
               size="small"
               @click="currentTab=1"
               round>在线预订</el-button>
    <el-button :type="currentTab===2?'primary':'info'"
               :plain="currentTab===1?true:false"
               size="small"
               @click="currentTab=2"
               round>预约试驾</el-button>

    <!-- 在线预订 -->
    <div class="sumary_group"
         v-show="currentTab===1 && sumaryRankData.length>0"
         v-loading="sumaryRankDataLoading">
      <div class="content"
           v-for="(model,i) in sumaryRankData"
           :key="i">
        <i class="dot"
           :class="`dot${i%4+1}`" />
        <div>
          <small>{{ divideNumber(model.count) }} 次</small>
          <div>{{ model.modelBaseInfo && `${model.modelBaseInfo.seriesName} - ${model.modelBaseInfo.name}`}}</div>
        </div>
      </div>
    </div>
    <div class="sumary_group"
         v-show="currentTab===1 && sumaryRankData.length===0">
      无数据
    </div>

    <!-- 预约试驾 -->
    <div class="sumary_group"
         v-show="currentTab===2 && sumaryDriveData.length>0"
         v-loading="sumaryDriveDataLoading">
      <div class="content"
           v-for="(drive,j) in sumaryDriveData"
           :key="j">
        <i class="dot"
           :class="`dot${j%4+1}`" />
        <div>
          <small>{{ divideNumber(drive.count) }} 次</small>
          <div>{{ drive.model && `${drive.model.seriesName} - ${drive.model.name}`}}</div>
        </div>
      </div>
    </div>
    <div class="sumary_group"
         v-show="currentTab===2 && sumaryDriveData.length===0">
      无数据
    </div>

  </div>
</template>

<script lang='ts'>
import { Component, Prop, Watch, Vue } from 'vue-property-decorator';
import { getAllDate } from "@/utils";
import divideNumber from "@/utils/divideNumber";
import { getTestDriveTop, prePurchaseRank } from "@/api"
import dayjs from "dayjs";
const startSuffix = ' 00:00:00';
const endSuffix = ' 23:59:59';

@Component
export default class MallLeftSumary extends Vue {
  currentTab: number = 1;
  readonly divideNumber = divideNumber;
  @Prop({ default: () => [] }) dateRange: string[];
  @Prop({ default: () => "" }) private dealerCode: any;
  @Prop({ type: Object, default: () => { return {} } }) private regionObj: any;

  sumaryDriveData: any[] = [];
  sumaryDriveDataLoading: boolean = true;
  sumaryRankDataLoading: boolean = true;
  sumaryRankData: any[] = [];
  @Watch("dateRange")
  @Watch("dealerCode")
  @Watch('regionObj')
  onChange() {
    this.init()
  };
  /**
   * @description 预约试驾
   */
  async getTestDriveTop(row = {}) {
    this.sumaryDriveDataLoading = true;
    this.sumaryDriveData = [];
    try {
      const params = {
        size: 10,
        dealerCode: this.dealerCode,
        ...row,
        startAt: dayjs(this.dateRange[0]).format('YYYY-MM-DD') + startSuffix,
        endAt: dayjs(this.dateRange[1]).format('YYYY-MM-DD') + endSuffix,
      }
      const { data } = await getTestDriveTop(params)
      this.sumaryDriveData = data;
      this.sumaryDriveDataLoading = false;
    } catch (e) {
      this.sumaryDriveDataLoading = false;
      this.log(e)
    }
  };
  /**
   * @description 预订
   */
  async prePurchaseRank(row = {}) {
    this.sumaryRankDataLoading = true;
    this.sumaryRankData = [];
    try {
      const params = {
        size: 10,
        dealerCode: this.dealerCode,
        ...row,
        startAt: dayjs(this.dateRange[0]).format('YYYY-MM-DD') + startSuffix,
        endAt: dayjs(this.dateRange[1]).format('YYYY-MM-DD') + endSuffix,
      }
      const { data } = await prePurchaseRank(params)
      this.sumaryRankData = data;
      this.sumaryRankDataLoading = false;
    } catch (e) {
      this.sumaryRankDataLoading = false;
      this.log(e)
    }
  };
  init() {
    const params = {
      businessUnitId: this.regionObj.buId,
      regionId: this.regionObj.regId,
      dealerCode: this.regionObj.dealerCode,
    }
    this.getTestDriveTop(params)
    this.prePurchaseRank(params)
  }
  created() {
    this.init()
  }
}
</script>
<style lang="scss" scoped>
.sumary_group {
  margin-top: 20px;
  height: 330px;
  overflow: auto;
}
.dot {
  margin-right: 20px;
}
::-webkit-scrollbar {
  width: 6px;
  height: 1px;
}

::-webkit-scrollbar-thumb {
  border-radius: 10px;
  box-shadow: inset 0 0 5px rgba(0, 0, 0, 0.1);
  background: #ededed;
}

::-webkit-scrollbar-track {
  border-radius: 10px;
  background: #ededed;
}
.content {
  display: flex;
  align-items: center;
  height: 60px;
  & + & {
    border-top: 1px solid #eee;
  }
  small {
    font-size: 12px;
    color: #8392a7;
  }
}
</style>