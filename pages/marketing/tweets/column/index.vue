<!--栏目管理-->
<template>
  <div class="main-container">
    <breadcrumb-group :breadGroup="[{label:'营销推文',to:''},{label:'栏目管理',to:'/marketing/tweets/column/index'}]" />
    <el-card>
      <search-table :data="tableData"
                    :url="urls.COLUMNS"
                    :isRefresh="isRefresh"
                    :tableColumns="tableColumns"
                    :searchConfig="searchConfig">
      </search-table>
    </el-card>

    <dialog-column :showDialog="dialogVisible"
                   :info="curItem"
                   :editMode="editMode"
                   @refresh="isRefresh = !isRefresh"
                   @close="dialogVisible = false">
    </dialog-column>
  </div>

</template>

<script lang="ts">
import { Component, Vue } from "vue-property-decorator";
import SearchTable from "@/components/search-table/index.vue";
import Config from "../const/columnConfig";
import api from "@/api/restful";
import urls from "@/api/urls";
import dialogColumn from "./components/dialogColumn.vue";

interface Item {
  name: string;
  id?: number;
}

@Component({
  components: {
    SearchTable,
    dialogColumn
  }
})
export default class Coupon extends Vue {
  private urls: any = urls;
  private dialogVisible: boolean = false;
  private curItem: Item = {
    name: ""
  };
  private editMode: boolean = false;
  private isRefresh: boolean = false;
  private conf = new Config().get(this);
  private tableData: Item[] = [];
  private searchConfig: object = this.conf.searchConfig();
  private tableColumns: object = this.conf.tableColumns;
  private showDialog(row?: Item) {
    this.dialogVisible = true;
    this.editMode = row ? true : false;
    if (row) this.curItem = row;
  }
  private del(row: Item) {
    this.$confirm("确定要删除吗？", "提示", { type: "warning" })
      .then(_ => {
        api.delete({ url: "COLUMN", id: row.id, isAdminApi: true }).then((data: any) => {
          this.$message({ type: "success", message: "删除成功" });
          this.isRefresh = !this.isRefresh;
        });
      })
      .catch(_ => {});
  }
}
</script>

