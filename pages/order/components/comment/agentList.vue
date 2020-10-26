<!--经销商评价列表-->
<template>
  <div class="comment-agent-list">
    <el-card class="mb-15">
      <statistic></statistic>
    </el-card>
    <el-card>
      <el-tabs v-model="tabActive">
        <el-tab-pane v-for="item in tabArr" :key="item.value" :name="item.value" :label="item.label">
          <search-table
            v-if="item.value === tabActive"
            ref="agentComment"
            :url="loadUrl"
            :tableColumns="tableColumns"
            :searchConfig="searchConfig"
            :searchParams="searchParams"
            @selectionChange="selectionChange"
          >
            <div class="table-top mb-15" slot="table-top" v-if="tabActive === 'wait'">
              <el-button
                size="small"
                type="primary"
                @click="handlePass"
                v-if="accessIsOpened('PERM:EVALUATE_LIST:EDIT')"
                :disabled="hasSelected < 1"
                >通过</el-button
              >
              <el-button
                size="small"
                @click="handleNotPass"
                :disabled="hasSelected < 1"
                v-if="accessIsOpened('PERM:EVALUATE_LIST:EDIT')"
                >不通过</el-button
              >
              <span class="ml-15"> 已选：{{ hasSelected.length }}</span>
            </div>
          </search-table>
        </el-tab-pane>
      </el-tabs>
      <detail-dialog v-if="dialogObj.show" :dialogObj="dialogObj"></detail-dialog>
    </el-card>
  </div>
</template>

<script lang="ts">
import { Component, Vue, Prop, Ref } from "vue-property-decorator";
import { getCommentDetail } from "@/api";
import SearchTable from "@/components/search-table/index.vue";
import Const from "../../const/comment";
import detailDialog from "./detailDialog.vue";
import { approveComment } from "@/api";
import statistic from "./statistic.vue";
import App from "@/App.vue";
@Component({
  name: "agentList",
  components: {
    App,
    SearchTable,
    detailDialog,
    statistic
  }
})
export default class extends Vue {
  @Ref() private agentComment: any;

  hasSelected: any[] = [];
  dialogObj: any = {
    title: "评价详情",
    show: false,
    info: {}
  };
  approvalDialog: any = {
    title: "通过",
    show: false,
    info: {}
  };
  tabActive: string = "wait";
  readonly tabArr: element.Options[] = [
    {
      label: "待处理",
      value: "wait"
    },
    {
      label: "已处理",
      value: "deal"
    }
  ];
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
    return this.tabActive === "wait" ? this.constant.AGENT_TABLE_COLUMNS : this.constant.AGENT_DEAL_TABLE_COLUMNS;
  }
  get searchConfig() {
    return this.tabActive === "wait" ? this.constant.AGENT_SEARCH_CONFIG : this.constant.AGENT_DEAL_SEARCH_CONFIG;
  }
  get searchParams() {
    let _obj: any;
    if (this.tabActive === "deal") {
      _obj = {
        businessCode: "SPU",
        status: [1, 2].join(",")
      };
    } else {
      _obj = {
        businessCode: "SPU",
        status: 0
      };
    }

    return _obj;
  }
  async getData() {
    await getCommentDetail({});
  }
  handleDetail(row: any) {
    this.dialogObj.show = true;
    this.dialogObj.info = row;
  }
  get selectedIds(): any {
    return this.hasSelected.map((item: any) => item.id) || [];
  }
  handlePass(row: any) {
    let h = this.$createElement;

    let message: any = h("div", {}, [
      h("p", {}, `确定要通过选中的商品评价？`),
      h("p", { class: "common_tip" }, `通过后评价将展示在用户端`)
    ]);

    this.$confirm(message, "通过").then(async () => {
      try {
        let ids;
        if (this.hasSelected.length > 0) {
          ids = this.selectedIds;
        } else {
          ids = [row.id];
        }
        await approveComment({
          ids: ids.toString(),
          status: "PASS"
        });
        this.$message.success("通过成功");
        this.hasSelected = [];
        this.agentComment[0].getList();
      } catch (e) {
        throw new Error(e);
      }
    });
  }
  handleNotPass(row?: any, isOne?: boolean) {
    let h = this.$createElement;
    let message: any = h("div", {}, [
      h("p", {}, `确定要不通过选中的商品评价？`),
      h("p", { class: "common_tip" }, `未通过的评价，将不会展示在用户端`)
    ]);
    this.$confirm(message, "不通过").then(async () => {
      try {
        let ids;
        if (this.hasSelected.length > 0) {
          ids = this.selectedIds;
        } else {
          ids = [row.id];
        }
        await approveComment({
          ids: ids.toString(),
          status: "REJECT"
        });
        this.$message.success("不通过成功");
        this.agentComment[0].getList();
        this.hasSelected = [];
      } catch (e) {
        throw new Error(e);
      }
    });
  }
  selectionChange(arr: any[]) {
    this.hasSelected = arr;
  }
  handleClose() {
    this.approvalDialog.show = false;
    this.hasSelected = [];
    this.agentComment[0].getList();
  }
  getTableData() {}

  created() {}
}
</script>

<style scoped lang="scss">
.comment-agent-list {
  .dot {
    &.dot1 {
      color: $red-color;
    }
  }
}
</style>
