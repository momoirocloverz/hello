<template>
  <div class="main-panel">
    <div class="top-select-container"
         v-if="accessIsOpened('PERM:MATERIAL:EDIT')">
      <el-button size="mini"
                 @click="showCatDialog">分组</el-button>
      <span v-show="selectedList.length > 0">已选：{{selectedList.length}}</span>
    </div>
    <search-table ref="searchTableRef"
                  :url="urls.MATERIAL_ARTICLES"
                  :tableColumns="tableColumns"
                  :searchConfig="searchConfig"
                  :proxyData="proxyData"
                  :proxyQuery="proxyQuery"
                  :isDelayRequest="true"
                  :isDefaultQuery="true"
                  :isRefresh="isRefresh"
                  :spanMethod="spanMethod"
                  @selectionChange="selectionChange">
      <template v-slot:column0="{row}">
        <article-list :item="row"></article-list>
      </template>
    </search-table>

    <dialog-category :showDialog="dialogVisible[0]"
                     :selectedList="selectedList"
                     :categories="categories"
                     :groupId="groupId"
                     @change="catChange"
                     @close="dialogVisible[0] = false">
    </dialog-category>
    <!-- 预览弹窗 -->
    <dialog-review :showDialog="dialogVisible[1]"
                   :info="curItem"
                   :isResource="true"
                   @close="dialogVisible[1] = false">
    </dialog-review>

    <!-- 统计弹窗 -->
    <dialog-statistic :showDialog="dialogVisible[2]"
                      :info="curItem"
                      @close="dialogVisible[2] = false">
    </dialog-statistic>
  </div>
</template>

<script lang="ts">
import { Component, Vue, Prop, Watch, Ref } from "vue-property-decorator";
import SearchTable from "@/components/search-table/index.vue";
import api from "@/api/restful";
import urls from "@/api/urls";
import { Config, Item, ArticleItem, expendItem } from "../../const/config";
import articleList from "./articleList.vue";
import dialogCategory from "./dialogSelectCategory.vue";
import dialogReview from "../../components/dialogReviewFormId.vue";
import dialogStatistic from "../../components/dialogMaterialStatistic.vue";
@Component({
  components: {
    SearchTable,
    articleList,
    dialogCategory,
    dialogReview,
    dialogStatistic
  }
})
export default class Article extends Vue {
  @Ref() searchTableRef!: SearchTable;
  @Prop({ default: 2 }) readonly curType: number; // 2-自建，1-集团，0-主机厂
  @Prop({ default: [] }) readonly categories: [];
  @Prop({ default: false }) readonly isRefreshData: boolean;
  @Prop({ default: null }) readonly groupId: number;
  @Prop({ default: false }) readonly isShowAddBtn: number;
  private conf = new Config().get(this);
  private tableData: Item[] = [];
  private searchConfig: object = {};
  private dialogVisible: any = {
    0: false,
    1: false,
    2: false
  };
  private urls: any = urls;
  private selectedList: number[] = [];
  private isRefresh: boolean = false;
  private tableColumns: any = this.conf.tableColumns;
  private spanMethod: Function = this.conf.spanMethod([0, 1]); // 合并列
  private editMode: boolean = false;
  private curItem: Item | {} = {};
  private proxyQuery(filters: any) {
    filters.source = this.curType;
    filters.groupId = this.groupId;
    return filters;
  }
  // 处理请求返回的table数据
  private proxyData(data: Item[]) {
    return this.conf.handleTableData(data);
  }
  toggle(item: any) {
    item.show = !item.show;
  }
  selectionChange(data: Item[]) {
    if (data.length > 0) {
      this.selectedList = [];
      data.map((v: Item) => {
        if (this.selectedList.indexOf(v.id) === -1) {
          this.selectedList.push(v.id);
        }
      });
    } else {
      this.selectedList = [];
    }
  }
  private refresh() {
    this.$emit("refreshGroup");
  }
  private showCatDialog() {
    if (this.selectedList.length === 0) {
      return this.$message({ type: "error", message: "请选择图文" });
    }
    this.dialogVisible[0] = true;
  }
  private showReviewDialog(row: Item) {
    this.dialogVisible[1] = true;
    this.curItem = row;
  }
  private showStatisticDialog(row: Item) {
    this.dialogVisible[2] = true;
    this.curItem = row;
  }
  private async catChange(val: number) {
    try {
      let res = await api.put({
        url: "MATERIAL_ARTICLE_GROUP",
        isAdminApi: true,
        groupId: val,
        materialIds: this.selectedList
      });
      this.$message({ type: "success", message: "分组成功" });
      // 刷新分组
      this.refresh();
      this.searchTableRef.clearSelections();
    } catch (err) {
      console.log(err);
    }
  }
  private update(row: expendItem) {
    this.$router.push(`/marketing/tweets/source/update/${row.id}?index=${row.index}&source=${this.curType}`);
  }
  private del(row: expendItem) {
    const h = this.$createElement;
    const message: any = h("p", {}, [
      h("p", { style: "color: #333" }, "确定要删除选中的素材？ "),
      h("p", { style: "color: #666" }, "删除后无法恢复")
    ]);
    this.$confirm(message, "提示").then(_ => {
      api
        .delete({
          url: "MATERIAL_ARTICLE",
          isAdminApi: true,
          id: row.id,
          index: row.index
        })
        .then((data: any) => {
          this.$message({ type: "success", message: "删除成功" });
          this.refresh();
        });
    });
  }
  @Watch("isRefreshData")
  onIsRefreshData(newVal: boolean, oldVal: boolean) {
    if (newVal !== oldVal) {
      this.selectedList = [];
      this.searchTableRef.resetDefaultSelect();
      // 通知search-table获取数据
      this.searchTableRef.handleReset();
    }
  }
}
</script>


<style lang="scss" scoped>
.top-select-container {
  width: 100%;
  margin: 10px;
  * {
    margin-right: 8px;
  }
}
</style>
