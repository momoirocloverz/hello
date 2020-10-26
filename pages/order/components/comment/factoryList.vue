<!--经销商评价列表-->
<template>
  <el-card class="comment-factory-list">
    <search-table
      ref="commentRef"
      :url="loadUrl"
      :tableColumns="tableColumns"
      :searchConfig="searchConfig"
      :searchParams="searchParams"
      :proxyQuery="proxyQuery"
      :initFilter="initFilter"
      @reset="handleReset"
    >
      <div class="table-top mb-15" slot="table-top">
        <statistic ref="statisticRef"></statistic>
      </div>
    </search-table>
    <detail-dialog v-if="dialogObj.show" :dialogObj="dialogObj"></detail-dialog>
  </el-card>
</template>

<script lang="ts">
import { Component, Vue, Ref } from "vue-property-decorator";
import { getCommentDetail } from "@/api";
import SearchTable from "@/components/search-table/index.vue";
import Const from "../../const/comment";
import statistic from "./statistic.vue";
import detailDialog from "./detailDialog.vue";
import { getBu2Region, getFactoryDealer, blocDealerList } from "@/api";
import { storeInfoSetting } from "@/utils/userSetting";

@Component({
  name: "factoryCommentList",
  components: {
    SearchTable,
    statistic,
    detailDialog
  }
})
export default class extends Vue {
  @Ref() private commentRef: any;
  @Ref() private statisticRef: any;

  dialogObj: any = {
    title: "评价详情",
    show: false,
    info: {}
  };
  sysPlat: "factory";
  allRegion: Array<any> = [];
  bu2Region: Array<any> = [];
  dealerList: Array<any> = [];
  buId: any = "";
  region: any = "";
  dealerCode: any = "";
  get initFilter() {
    let info = storeInfoSetting.getInfo().info;
    let _obj: any = {};
    if (this.bu2Region.length > 0) {
      _obj.businessUnitId = info.businessUnitId || "";
    }
    return _obj;
  }
  get config() {
    return new Const(this);
  }
  private get constant(): any {
    return this.config.const;
  }
  get loadUrl(): string {
    return "comment/getCommentList";
  }
  get tableColumns() {
    return this.constant.FACTORY_TABLE_COLUMNS;
  }
  get searchConfig() {
    return this.constant.FACTORY_SEARCH_CONFIG;
  }
  get searchParams() {
    return {
      businessCode: "SPU"
    };
  }
  async getData() {
    await getCommentDetail({});
  }
  handleDetail(row: any) {
    this.dialogObj.show = true;
    this.dialogObj.info = row;
  }
  private async loadBu2Region() {
    let params = { buCodeList: "" };
    let res = await getBu2Region(params);
    let data = res.data || [];
    this.bu2Region = data;
    // 如果只有一条数据，默认把数据填进去
    if (data.length === 1) {
      this.buId = data[0].id;
      this.changeBu2(this.buId);
    }
  }
  changeBu2(val: any) {
    this.buId = val;
    this.setFilterForm({ regionId: null, dealerCode: null });
    if (this.bu2Region.length > 0) {
      for (let i = 0; i < this.bu2Region.length; i++) {
        let item = this.bu2Region[i];
        if (item.id === val) {
          this.allRegion = item.regionList || [];
        }
      }
    }
  }
  async changeRegion(val: any) {
    this.region = val;
    this.setFilterForm({ dealerCode: null });

    let res = await getFactoryDealer({
      page: 1,
      size: 1000,
      regionId: this.region,
      buId: this.buId
    });
    this.dealerList = res.data;
  }

  setFilterForm(params: any) {
    this.commentRef.setFilterForm(params);
  }
  changeDealer(val: any) {
    this.dealerCode = val;
  }
  proxyQuery() {
    this.statisticRef.getData({
      businessUnitId: this.buId,
      regionId: this.region,
      dealerCode: this.dealerCode
    });
  }
  handleReset() {
    this.statisticRef.getData();
  }
  created() {
    this.loadBu2Region();
  }
}
</script>

<style scoped lang="scss">
.comment-factory-list {
  .dot {
    &.dot1 {
      color: $red-color;
    }
  }
}
</style>
