<template>
  <div class="main-container">
    <breadcrumb-group :breadGroup="[{label:'奖品管理',to:'/marketing/gift/coupon/index'},{label:'奖品发放',to:''}]" />

    <el-card>
      <el-tabs v-model="activeName"
               @tab-click="handleClick">
        <el-tab-pane label="待发货"
                     name="0"></el-tab-pane>
        <el-tab-pane label="已发货"
                     name="1"></el-tab-pane>
      </el-tabs>
      <search-table ref="searchTable"
                    :url="urls.RELEASE_LIST"
                    :tableColumns="tableColumns"
                    :searchConfig="searchConfig"
                    :isRefresh="isRefresh"
                    :proxyQuery="proxyQuery"
                    :isDefaultQuery="true">
      </search-table>
    </el-card>

    <!-- 弹窗 -->
    <dialog-release :showDialog="dialogVisible"
                    :info="curItem"
                    :action="action"
                    @refresh="isRefresh = !isRefresh"
                    @close="dialogVisible = false">
    </dialog-release>
  </div>
</template>

<script lang="ts">
import { Component, Prop, Vue, Ref } from "vue-property-decorator";
import SearchTable from "@/components/search-table/index.vue";
import dialogRelease from "../components/dialogRelease.vue";
import { Config, Item } from "../const/releaseConfig";
import api from "@/api/restful";
import urls from "@/api/urls";

@Component({
  components: {
    SearchTable,
    dialogRelease
  }
})
export default class couponDetail extends Vue {
  @Ref() searchTable!: SearchTable;
  private conf = new Config().get(this);
  private urls: any = urls;
  private curItem: object = {};
  private activeName: string = "0";
  private isRefresh: boolean = false;
  private dialogVisible: boolean = false;
  private action: string = "release";
  get tableColumns() {
    if (this.activeName === "0") {
      return this.conf.tableColumns;
    } else {
      return this.conf.tableColumns1;
    }
  }
  get searchConfig() {
    if (this.activeName === "0") {
      return this.conf.searchConfig;
    } else {
      return this.conf.search2Config;
    }
  }
  showCheckDialog(row: Item) {
    this.dialogVisible = true;
    this.curItem = row;
    this.action = "release";
  }
  showDetailDialog(row: Item) {
    this.dialogVisible = true;
    this.curItem = row;
    this.action = "detail";
  }
  private proxyQuery(filters: any) {
    filters.redeemed = parseInt(this.activeName);
    return filters;
  }
  handleClick() {
    this.searchTable.handleReset();
  }
}
</script>


<style lang="scss" scoped>
/deep/ .link {
  color: #409eff;
}
</style>