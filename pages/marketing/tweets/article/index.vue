<!--文章列表-->
<template>
  <div class="main-container">
    <breadcrumb-group :breadGroup="[{label:'营销推文',to:''},{label:'文章列表',to:'/marketing/tweets/article/index'}]" />
    <el-card>
      <search-table ref="searchTableRef"
                    :url="urls.ARTICLE_LIST"
                    :tableColumns="tableColumns"
                    :searchConfig="searchConfig"
                    :spanMethod="spanMethod"
                    :isDelayRequest="true"
                    :proxyData="proxyData">
        <template v-slot:column0="{row}">
          <article-list :item="row"></article-list>
        </template>
      </search-table>
    </el-card>
    <dialog-review :showDialog="dialogVisible"
                   :info="curItem"
                   @close="dialogVisible = false">
    </dialog-review>
    <dialog-statistics :showDialog="dialog2Visible"
                       :editMode="editMode"
                       :info="curItem"
                       :articleObj="articleObj"
                       @close="dialog2Visible = false">
    </dialog-statistics>
  </div>
</template>

<script lang="ts">
import { Component, Vue, Ref } from "vue-property-decorator";
import SearchTable from "@/components/search-table/index.vue";
import { Config, Item, ArticleItem, expendItem } from "../const/articleConfig";
import articleList from "./components/articleList.vue";
import dialogReview from "../components/dialogReviewFormId.vue";
import dialogStatistics from "../components/dialogStatistics.vue";
import api from "@/api/restful";
import urls from "@/api/urls";

@Component({
  components: {
    SearchTable,
    articleList,
    dialogReview,
    dialogStatistics
  }
})
export default class Coupon extends Vue {
  @Ref() searchTableRef!: SearchTable;
  private conf = new Config().get(this);
  private tableData: Item[] = [];
  private urls: any = urls;
  private role: string = "";
  private searchConfig: any = this.conf.searchConfig();
  // private tableColumns: object = this.conf.tableColumns;
  // private spanMethod: Function = this.conf.spanMethod([0, 1, 2]);
  private dialogVisible: boolean = false;
  private dialog2Visible: boolean = false;
  private editMode: boolean = false;
  private curItem: object = {};
  // 传值给统计表使用
  private articleObj: any = {};
  get tableColumns() {
    if (this.role !== "agent") {
      this.conf.tableColumns.splice(2, 1);
      return this.conf.tableColumns;
    } else {
      return this.conf.tableColumns;
    }
  }
  get spanMethod() {
    // 主机厂不显示推送设置
    if (this.role !== "agent") {
      return this.conf.spanMethod([0, 1]);
    } else {
      return this.conf.spanMethod([0, 1, 2]);
    }
  }
  private add() {
    this.$router.push(`/marketing/tweets/article/create`);
  }
  private review(row: Item): void {
    this.curItem = row;
    this.dialogVisible = true;
  }
  private statistics(row: Item): void {
    this.curItem = row;
    this.dialog2Visible = true;
    this.editMode = false;
  }
  private proxyData(data: Item[]): expendItem[] {
    console.log("proxyData", data);
    console.log("handleTableData", this.conf.handleTableData(data));
    return this.conf.handleTableData(data);
  }
  openStatisticsDialog(row: any) {
    this.articleObj = { ...row, refreshDate: new Date() };
    this.dialog2Visible = true;
  }
  toggle(item: any) {
    item.show = !item.show;
  }
  async getColumns() {
    try {
      let res = await api.get({ url: "COLUMNS", isAdminApi: true, page: 1, size: 1000 });
      res.data.map((v: any) => {
        v.value = v.id;
        v.label = v.name;
      });
      res.data.unshift({
        label: "无栏目",
        value: "-100"
      });
      this.searchConfig.props[2].options = res.data;
      // 获取数据
      this.searchTableRef.handleReset();
    } catch (err) {
      console.log(err);
    }
  }
  created() {
    // 根据角色确定source显示,一定要在created钩子中确定role，否则对spanMethod有影响
    this.role = (<any>this.$route.query).sysPlat;
    this.getColumns();
  }
}
</script>

