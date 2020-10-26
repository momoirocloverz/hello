<!--活动管理-->
<template>
  <div class="group-list">
    <breadcrumb-group :breadGroup="[{ label: '集团', to: '' }]" />
    <el-card>
      <search-table
        ref="searchTableRef"
        :tableColumns="constant.GROUP_TABLE_COLUMNS"
        :searchConfig="constant.GROUP_SEARCH_CONFIG"
        url="bloc"
      >
        <template v-slot:dealerNum="{ row }">
          <el-button type="text" @click="showAgent(row)" :disabled="!row.enabled">{{
            row.enabled ? row.dealerNum : 0
          }}</el-button>
        </template>
      </search-table>
    </el-card>
    <group-dialog
      @loadList="loadList"
      @saveForm="saveForm"
      :dialogObj="dialogObj"
      @handleClose="handleClose"
    ></group-dialog>
  </div>
</template>

<script lang="ts">
import SearchTable from "@/components/search-table/index.vue";
import { Component, Vue, Ref } from "vue-property-decorator";
import GroupDialog from "./components/groupDialog.vue";
import { DialogInfo } from "@/@types/activity";
import Const from "./const/index";
import { Action, State } from "vuex-class";
@Component({
  name: "listIndex",
  components: {
    SearchTable,
    GroupDialog
  }
})
export default class extends Vue {
  @Ref() private searchTableRef: any;
  @Action("resetGroupForm", { namespace: "group" })
  resetGroupForm: Function;
  @Action("setGroupForm", { namespace: "group" })
  setGroupForm: Function;
  @Action("deleteGroup", { namespace: "group" })
  deleteGroup: Function;
  @Action("frozenGroup", { namespace: "group" })
  frozenGroup: Function;
  @Action("resetPassWord", { namespace: "group" })
  resetPassWord: Function;
  @Action("addGroup", { namespace: "group" })
  addGroup: Function;
  @Action("editGroup", { namespace: "group" })
  editGroup: Function;
  @State(state => state.group.groupForm) private groupForm!: any;

  private tipLabel: string = "新建";
  private dialogObj: DialogInfo = {
    title: "新建集团",
    show: false,
    info: {}
  };
  private getBtnByStatus: Function = this.config.getBtnByStatus;
  private getDealBtns(row: any, index: number) {
    let that = this;
    return this.getBtnByStatus(row, that);
  }
  private get config() {
    return new Const(this);
  }
  private get constant(): any {
    return this.config.const;
  }

  /**
   * 获取列表
   */
  private loadList(): void {
    this.searchTableRef.getList();
  }

  /**
   * 冻结集团
   * @param row
   */
  private frozen(row: any): void {
    this.setGroupForm(row);
    let h = this.$createElement;
    let message: any = h("div", {}, [
      h("p", {}, `确定要冻结该集团？`),
      h("p", `冻结后该集团下所有管理员账号将被冻结，无法登录`)
    ]);
    this.$confirm(message, "冻结集团").then(async () => {
      if (row.dealerNum > 0) {
        this.$message.warning("请先将该集团下所有经销商解绑后，再冻结该集团");
      } else {
        await this.frozenGroup(row);
        this.loadList();
      }
    });
  }

  /**
   * 新建集团
   * @param row
   */
  private add(row: any): void {
    this.dialogObj.title = "新建集团";
    this.dialogObj.show = true;
    this.dialogObj.type = "new";
  }
  /**
   * 编辑集团
   * @param row
   */
  private edit(row: any) {
    this.setGroupForm(row);
    this.dialogObj.title = "编辑集团";
    this.dialogObj.show = true;
    this.dialogObj.type = "edit";
    this.dialogObj.info = row;
  }
  /**
   * 显示经销商
   * @param row
   */
  private showAgent(row: any) {
    this.setGroupForm(row);
    this.dialogObj.title = "旗下经销商";
    this.dialogObj.show = true;
    this.dialogObj.type = "agent";
  }

  /**
   * 启用集团
   * @param row
   */
  private async start(row: any) {
    this.setGroupForm(row);
    this.dialogObj.title = "启用集团";
    this.dialogObj.show = true;
    this.dialogObj.type = "start";
    this.dialogObj.info = row;
  }

  /**
   * 重置密码
   * @param row
   */
  private resetPwd(row: any) {
    let h = this.$createElement;
    let message: any = h("div", {}, [h("p", {}, `确定要将“${row.name}集团”重置为初始密码？`)]);
    this.$confirm(message, "提示").then(async () => {
      try {
        await this.resetPassWord(row);
        this.$message.success("重置密码操作成功");
      } catch (e) {
        console.log(e);
      }
    });
  }

  /**
   * 删除集团
   * @param row
   * @param index
   */
  private delete(row: object, index: number) {
    this.setGroupForm(row);
    let h = this.$createElement;
    let message: any = h("div", {}, [
      h("p", {}, `确定要删除该集团？`),
      h("p", { class: "common_tip" }, `删除后该集团所有数据将一并删除，集团下经销商将自动取消关联`)
    ]);
    this.$confirm(message, "提示").then(async () => {
      try {
        await this.deleteGroup(row);
        this.loadList();
        this.$message.success("集团删除成功");
      } catch (e) {
        console.log(e);
      }
    });
  }

  /**
   * 创建集团
   */
  private async saveForm() {
    let { type } = this.dialogObj;
    let area: string = Array.isArray(this.groupForm.area) ? this.groupForm.area.join("/") : this.groupForm.area;
    switch (type) {
      case "new":
        this.tipLabel = "新建";
        await this.addGroup({
          ...this.groupForm,
          area
        });
        break;
      case "edit":
        this.tipLabel = "编辑";
        await this.editGroup({
          ...this.groupForm,
          area
        });
        break;
      case "start":
        this.tipLabel = "启用";
        await this.frozenGroup({
          ...this.groupForm
        });
        break;
    }
    this.handleClose();
    this.loadList();
    this.$message.success(`集团${this.tipLabel}成功`);
  }
  private handleClose() {
    this.resetGroupForm();
    this.dialogObj.show = false;
    this.dialogObj.type = "";
  }
}
</script>

<style scoped lang="scss"></style>
