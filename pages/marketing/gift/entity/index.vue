<!--实物奖品-->
<template>
  <div class="main-container">
    <breadcrumb-group :breadGroup="[{label:'活动管理',to:''},{label:'实物奖品',to:'/marketing/gift/entity/index'}]" />
    <el-card>
      <search-table :total="total"
                    :url="urls.PRIZE"
                    :isRefresh="isRefresh"
                    :tableColumns="tableColumns"
                    :searchConfig="searchConfig">
      </search-table>
    </el-card>

    <dialog-add-stock :showDialog="dialogVisible"
                      :info="curItem"
                      @submit="addStock"
                      @close="dialogVisible = false">
    </dialog-add-stock>

    <!-- <dialog-check :showDialog="dialogVisible0"
                  :info="curItem"
                  @submit="check"
                  @close="dialogVisible0 = false">
    </dialog-check> -->
  </div>
</template>

<script lang="ts">
import { Component, Vue } from "vue-property-decorator";
import SearchTable from "@/components/search-table/index.vue";
import Config from "../const/config";
import api from "@/api/restful";
import urls from "@/api/urls";
import { TableItem } from "../const/couponTypes";
import dialogAddStock from "../components/dialogAddStock.vue";
// import dialogCheck from "../components/dialogCheck.vue";

const baseUrl = `/marketing/gift/entity`;

@Component({
  components: {
    SearchTable,
    dialogAddStock
    // dialogCheck
  }
})
export default class Coupon extends Vue {
  private conf = new Config().get(this);
  private tableData: TableItem[] = [];
  private total: number = 0;
  private urls: any = urls;
  private dialogVisible: boolean = false;
  // private dialogVisible0: boolean = false;
  private curItem: object = { value: 0 };
  private isRefresh: boolean = false;
  private searchConfig: object = this.conf.search2Config();
  private tableColumns: object = this.conf.table2Columns;
  private showDialog(row: TableItem) {
    this.dialogVisible = true;
    this.curItem = row;
  }
  private async addStock({ data, value }: { data: TableItem; value: number }) {
    try {
      let res = await api.put({
        url: "ADD_STOCK_PRIZE",
        isAdminApi: true,
        count: value,
        id: data.id
      });
      this.$message({ type: "success", message: "增加库存成功" });
      // 通知刷新列表
      this.isRefresh = !this.isRefresh;
    } catch (err) {
      throw new Error(err);
    }
  }
  // private showCheckDialog() {
  //   this.dialogVisible0 = true;
  // }
  // private async check(val: string) {
  //   let res = await api.put({
  //     url: "CHECK_COUPON",
  //     isAdminApi: true,
  //     code: val
  //   });
  //   this.$message({ type: "success", message: "核销成功" });
  // }
  private disabled(row: TableItem) {
    const h = this.$createElement;
    const msg: any = h("div", {}, [
      h("p", { style: "color:#000" }, "确定要停用该实物奖品吗？ "),
      h("p", { style: "color: gray" }, "停用后，用户无法再领取该实物奖品，用户已领取的实物奖品，在有效期内还能继续使用")
    ]);
    this.$confirm(msg, "停用", {
      showCancelButton: true,
      confirmButtonText: "确定",
      cancelButtonText: "取消"
    }).then(async (action: any) => {
      let res = await api.put({
        url: "DISABLE_PRIZE",
        isAdminApi: true,
        id: row.id
      });
      this.$message({ type: "success", message: "停用成功" });
      this.isRefresh = !this.isRefresh;
    });
  }
  private add() {
    this.$router.push(`${baseUrl}/create`);
  }
  private detail(row: TableItem) {
    this.$router.push(`${baseUrl}/detail/${row.id}`);
  }
  private edit(row: TableItem) {
    this.$router.push(`${baseUrl}/update/${row.id}`);
  }
}
</script>
