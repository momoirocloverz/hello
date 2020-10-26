<template>
  <div class="main-container">
    <breadcrumb-group :breadGroup="[{label:'实物奖品',to:'/marketing/gift/entity/index'},{label:'实物奖品详情',to:''}]" />
    <el-card>
      <el-tabs>
        <el-tab-pane label="使用情况"
                     name="0">
          <statistics :info="statisticData"
                      :isCoupon="false"></statistics>
          <search-table :url="urls.AWARD_USE_SITUATION"
                        :tableColumns="tableColumns"
                        :searchConfig="searchConfig"
                        :proxyQuery="proxyQuery"
                        :isDelayRequest="true"
                        :isDefaultQuery="true"
                        :isRefresh="isRefresh">
          </search-table>
        </el-tab-pane>
        <el-tab-pane label="基本信息"
                     name="1">
          <common-info-line :info="infoData"
                            :columns="infoColumns"></common-info-line>
        </el-tab-pane>
      </el-tabs>
    </el-card>

    <!-- 弹窗 -->
    <dialog-show-check :showDialog="dialogVisible"
                       :info="curItem"
                       @refresh="isRefresh = !isRefresh"
                       @close="dialogVisible = false">
    </dialog-show-check>
  </div>
</template>

<script lang="ts">
import { Component, Prop, Vue } from "vue-property-decorator";
import statistics from "../components/statistics.vue";
import SearchTable from "@/components/search-table/index.vue";
import commonInfoLine from "../components/commonInfoLine.vue";
import dialogShowCheck from "../components/dialogShowCheck.vue";
import { Config, Item } from "../const/detailTableConfig";
import api from "@/api/restful";
import urls from "@/api/urls";

@Component({
  components: {
    statistics,
    SearchTable,
    commonInfoLine,
    dialogShowCheck
  }
})
export default class couponDetail extends Vue {
  private conf = new Config().get(this);
  private urls: any = urls;
  private infoColumns: any = this.conf.info2Columns;
  private searchConfig: object = this.conf.search2Config;
  private tableColumns: object = this.conf.table2Columns;
  private infoData: any = {};
  private statisticData: any = {};
  private isRefresh: boolean = false;
  private pageId: number = 0;
  private curItem: object = {};
  private dialogVisible: boolean = false;
  showCheckDialog(row: Item) {
    this.dialogVisible = true;
    this.curItem = { prizeTypeName: "实物奖品", ...row, ...this.infoData };
  }
  private proxyQuery(filters: any) {
    let f = JSON.parse(JSON.stringify(filters));
    f.prizeId = this.pageId;
    if (f.datePicker) {
      f.startAt = f.datePicker[0];
      f.endAt = f.datePicker[1];
      delete f.datePicker;
    }

    return f;
  }
  getDetail() {
    api.get({ url: "PRIZE_BASEINFO", isAdminApi: true, id: this.pageId }).then((data: any) => {
      if (data.code === "000000") {
        const { sysPlat } = this.$route.query;
        if (sysPlat === "factory") {
          data.data.receiveMeans = "EXPRESS";
        }
        this.infoData = data.data;
      }
    });
  }
  getStatistic() {
    api.get({ url: "AWARD_STATISTIC", isAdminApi: true, id: this.pageId }).then((data: any) => {
      if (data.code === "000000") {
        this.statisticData = data.data;
      }
    });
  }
  mounted() {
    this.pageId = parseInt(this.$route.params.id);
    this.getDetail();
    this.getStatistic();
    // 拿到pageId后请求列表
    this.isRefresh = !this.isRefresh;
  }
}
</script>
