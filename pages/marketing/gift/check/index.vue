<template>
  <div class="main-container">
    <breadcrumb-group
      :breadGroup="[{ label: '奖品管理', to: '/marketing/gift/coupon/index' }, { label: '奖品验券', to: '' }]"
    />

    <el-card>
      <search-table
        :url="urls.CHECK_CODE_LIST"
        :tableColumns="tableColumns"
        :searchConfig="searchConfig"
        :proxyQuery="proxyQuery"
        :isDelayRequest="true"
        :isDefaultQuery="true"
        :isRefresh="isRefresh"
      >
      </search-table>
    </el-card>

    <!-- 弹窗 -->
    <dialog-prize-check
      :showDialog="dialogVisible"
      :info="curItem"
      @refresh="isRefresh = !isRefresh"
      @close="dialogVisible = false"
    >
    </dialog-prize-check>
  </div>
</template>

<script lang="ts">
import { Component, Prop, Vue } from "vue-property-decorator";
import SearchTable from "@/components/search-table/index.vue";
import commonInfoLine from "../components/commonInfoLine.vue";
import dialogPrizeCheck from "../components/dialogPrizeCheck.vue";
import { Config, Item } from "../const/checkConfig";
import api from "@/api/restful";
import urls from "@/api/urls";

@Component({
  components: {
    SearchTable,
    commonInfoLine,
    dialogPrizeCheck
  }
})
export default class couponDetail extends Vue {
  private conf = new Config().get(this);
  private urls: any = urls;
  private infoColumns: any = this.conf.infoColumns;
  private searchConfig: object = this.conf.searchConfig();
  private tableColumns: object = this.conf.tableColumns;
  private infoData: any = {};
  private statisticData: any = {};
  private isRefresh: boolean = false;
  private pageId: number = 0;
  private curItem: object = {};
  private dialogVisible: boolean = false;
  showCheckDialog(row: Item) {
    this.dialogVisible = true;
    this.curItem = { prizeTypeName: "优惠券", ...row, ...this.infoData };
  }
  private proxyQuery(filters: any) {
    return filters;
  }
  mounted() {
    this.pageId = parseInt(this.$route.params.id);
    // 拿到pageId后请求列表
    this.isRefresh = !this.isRefresh;
  }
}
</script>
