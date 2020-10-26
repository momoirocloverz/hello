<template>
  <!-- 选择顾问 -->
  <elBtnDlalog title="变更顾问"
               :visible.sync="adviserDialog"
               :saveAutoClose="false"
               :dialogAttr="{width:'700px'}"
               @save="saveChangeAdviser">
    <el-admin-table v-if="adviserDialog"
                    ref="adviserTableRef"
                    :apiFn="adviserList"
                    :tableAttrs="adviserTableAttrs"
                    :selectUnique.sync="adviserLastObj"
                    :formData.sync="adviserSubForm"
                    @getTableData="getTableData">
      <template slot="search">
        <el-form-item prop="name">
          <el-input v-model="adviserSubForm.name"
                    placeholder="顾问"
                    clearable />
        </el-form-item>
      </template>
    </el-admin-table>
  </elBtnDlalog>
</template>

<script lang='ts'>
import { changeMemberAdviser, adviserListOld } from "@/api/index";
import elBtnDlalog from "@/components/el-btn-dialog/index.vue";
import { adviserCoumns } from "@/pages/adviser/const/adviser-config";

import { Component, Vue, Prop, PropSync, Ref } from "vue-property-decorator";
@Component({
  components: { elBtnDlalog }
})
export default class App extends Vue {
  @Ref() readonly adviserTableRef: any;
  @Prop({
    default: 0,
    type: Number
  })
  readonly memberUserId: number;
  @Prop({
    default: 0,
    type: Number
  })
  readonly adviserUserId: number;
  @Prop({
    default: "",
    type: String
  })
  readonly oldAdviserName: string;
  @PropSync("visible", { type: Boolean, default: false }) adviserDialog: boolean;
  readonly adviserList = adviserListOld;
  readonly adviserTableAttrs = {
    columns: [
      {
        type: "selection"
      },
      ...adviserCoumns
    ]
  };
  adviserSubForm = { name: "",enabled:1 };
  adviserLastObj: any = {};
  tableData: any = [];

  private changeAdvise(row: any) {
    this.adviserDialog = true;
  }
  async saveChangeAdviser() {
    if (this.adviserUserId === this.adviserLastObj.adviserUserId) {
      this.showMsg("所选顾问不能为当前顾问", "warning");
      return;
    }
    if (!this.adviserLastObj.adviserUserId) {
      return this.showMsg("请选择顾问", "warning");
    }
    try {
      const params = {
        adviserUserId: this.adviserLastObj.adviserUserId,
        memberUserId: [this.memberUserId],
        oldAdviserName: this.oldAdviserName
      };
      await changeMemberAdviser(params);
      this.showMsg("操作成功");
      this._saveInit();
    } catch (e) {
      this.log(e);
    }
  }
  private _saveInit() {
    this.adviserDialog = false;
    this.adviserLastObj = {};
    this.$emit("save");
  }
  private getTableData(data: any) {
    this.tableData = data;
    console.log(data)
    let item = this.tableData.find((v: any) => v.adviserUserId === this.adviserUserId);
    this.adviserTableRef.isSelect([item]);
  }
}
</script>
<style lang='scss' scoped>
</style>