<template>
  <div class=" common-dealer-filter" v-if="sysPlat === 'factory'">
    <el-select size="small" class="mr-15" v-model="buId" placeholder="事业部" @change="changeBu2">
      <el-option v-for="(item, index) in bu2Region" :key="index" :label="item.name" :value="item.id"></el-option>
    </el-select>
    <el-select size="small" class="mr-15" v-model="regId" placeholder="大区" :disabled="!buId" @change="changeRegion">
      <el-option v-for="(item, index) in allRegion" :key="index" :label="item.name" :value="item.id"></el-option>
    </el-select>
    <el-select
      size="small"
      v-model="dealerCode"
      class="mr-15"
      style="width: 130px"
      :disabled="!regId"
      @change="changeDealer"
    >
      <el-option v-for="item in dealerList" :value="item.dealerCode" :label="item.dealerName" :key="item.value" />
      <el-pagination
        v-if="dealerTotal > size"
        layout="prev, pager, next"
        :page-size="size"
        @current-change="handleCurrentChange1"
        :total="dealerTotal"
      >
      </el-pagination>
    </el-select>
  </div>
</template>

<script lang="ts">
import { Component, Vue, Watch, Ref, Prop } from "vue-property-decorator";
import { getBu2Region, getFactoryDealer, blocDealerList } from "@/api/";
import areaChart from "./areaChart.vue";
import barChart from "./barChart.vue";
@Component({
  name: "commonDealerFilter",
  components: {
    areaChart,
    barChart
  }
})
export default class CustomSnap extends Vue {
  @Prop({ default: () => [] }) dateRange: Array<any>;
  private page: number = 1;
  private dealerTotal: number = 1;
  private size: number = 10;
  private sysPlat: any = "agent";
  actualDealerCode: any = "";
  buId: string = "";
  regId: string = "";
  dealerCode: string = "";
  dealerList: any[] = [{ dealerName: "全部经销商", dealerCode: "" }];
  allRegion: any[] = [{ name: "全部大区", code: "", id: "" }];
  bu2Region: any[] = [];

  /**
   * 切换事业部
   * @param val
   */
  changeBu2(val: any) {
    this.dealerCode = "";
    this.regId = "";
    this.allRegion = [{ name: "全部大区", code: "", id: "" }];
    for (let i = 0; i < this.bu2Region.length; i++) {
      let item = this.bu2Region[i];
      if (item.id === val) {
        this.allRegion = [{ name: "全部大区", code: "", id: "" }].concat(item.regionList || []) || [];
      }
    }

    this.loadDealerList();
    this.getStatisData();
  }

  /**
   * 切换大区
   */
  changeRegion() {
    this.dealerCode = "";
    this.loadDealerList();
    this.getStatisData();
  }

  /**
   * 获取统计数据
   */
  getStatisData() {
    this.$emit("getData", {
      buId: this.buId,
      regId: this.regId,
      dealerCode: this.dealerCode
    });
  }

  /**
   * 获取经销商列表
   */
  loadDealerList() {
    this.getDealerList({ regionId: this.regId, buId: this.buId });
  }

  /**
   * 获取事业部列表
   */
  private async loadBu2Region() {
    let params = { buCodeList: "" };
    let res = await getBu2Region(params);
    let data = res.data || [];
    if (data.length === 1) {
      this.buId = data[0].id;
      this.bu2Region = data;
      this.changeBu2(this.buId);
    } else {
      this.bu2Region = [{ name: "全部事业部", code: "", id: "" }].concat(data);
    }
  }

  /**
   * 获取经销商
   * @param row
   */
  async getDealerList(row?: any) {
    let res;
    if (this.sysPlat === "factory") {
      res = await getFactoryDealer({
        page: this.page,
        size: this.size,
        ...row
      });
    } else {
      res = await blocDealerList({
        page: this.page,
        size: this.size
      });
    }

    this.dealerList = [{ dealerName: "全部经销商", dealerCode: "" }].concat(res.data);
    this.dealerTotal = res.totalCount;
  }

  /**
   * 切换页数
   * @param val
   */
  handleCurrentChange1(val: number) {
    this.actualDealerCode = "";
    this.dealerCode = "";
    this.page = val;
    this.getDealerList({ regionId: this.regId, buId: this.buId });
  }

  changeDealer() {
    this.getStatisData();
    this.$emit("getDealerCode", this.dealerCode);
  }
  created() {
    this.sysPlat = this.$route.query.sysPlat || "agent";
    if (this.sysPlat !== "agent") {
      this.getDealerList({ regionId: this.regId, buId: this.buId });
      this.loadBu2Region();
    }
  }
}
</script>
<style lang="scss" scoped>
.common-dealer-filter {
  padding: 0 20px 35px;
}
</style>
