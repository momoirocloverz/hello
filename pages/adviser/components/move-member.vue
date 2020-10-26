<template>
  <div>
    <el-dialog :title="step === 'FIRST'?'转移潜客':'选择顾问'"
               :visible.sync="dialogStatus">
      <el-steps :active="step === 'FIRST'?1:2">
        <el-step title="第一步"
                 description="选择需要转移的潜客"></el-step>
        <el-step title="第二步"
                 description="选择顾问"></el-step>
      </el-steps>
      <!-- 选择潜客 -->
      <el-admin-table v-show="step === 'FIRST'"
                      :tableAttrs="tableAttrs"
                      :apiFn="getList"
                      :key="'first'"
                      ref="adminTableRef"
                      @getTableData="getDatas"
                      @select-all="selectAll"
                      @select="currentCell"
                      :customQuery="firstCustomQuery"
                      :formData.sync="subForm">
        <template slot="search">
          <div class="is-select">已选：{{selectArr.length}}</div>

          <el-form-item prop="name">
            <el-input v-model="subForm.name"
                      placeholder="潜客姓名"
                      clearable />
          </el-form-item>
        </template>
      </el-admin-table>
      <!-- 选择顾问 -->
      <el-admin-table v-show="step === 'SECOND'"
                      :tableAttrs="tableAdviser"
                      :apiFn="getAdviser"
                      :key="'second'"
                      :customQuery="secondCustomQuery"
                      :selectUnique.sync="adviserObj"
                      ref="adminRefAdviser"
                      :formData.sync="adviserForm">
        <template slot="search">
          <el-form-item prop="name">
            <!-- {{adviserObj}} -->
            <el-input v-model="adviserForm.name"
                      placeholder="顾问姓名"
                      clearable />
          </el-form-item>
        </template>
      </el-admin-table>

      <span slot="footer"
            class="dialog-footer">
        <el-button size="small"
                   @click="dialogStatus = false">取 消</el-button>
        <el-button v-if="step === 'FIRST'"
                   size="small"
                   type="primary"
                   @click="next">下一步</el-button>
        <el-button v-if="step === 'SECOND'"
                   size="small"
                   @click="previous">上一步</el-button>
        <el-button v-if="step === 'SECOND'"
                   size="small"
                   type="primary"
                   @click="confirm">确 定</el-button>
      </span>
    </el-dialog>

  </div>
</template>

<script lang='ts'>
import { Component, Prop, Vue, Ref, PropSync } from "vue-property-decorator";
import { memberList, adviserListOld, transferMember } from "@/api";
import { adviserCoumns } from "../const/adviser-config";
import dayjs from "dayjs";
interface SubForm {
  name: string;
  role?: string;
}
interface adviserForm {
  name: string;
}
@Component
export default class App extends Vue {
  @Ref() readonly adminTableRef: any;
  @Ref() readonly adminRefAdviser: any;
  dialogStatus: boolean = false;
  confirmStatus: boolean = true;
  step: string = "FIRST";

  // 潜客列表
  memberArr: any[] = [];
  // 当前页面潜客列表
  currentPageArr: any[] = [];
  // 已选潜客列表
  selectArr: any[] = [];
  // 潜客页size
  memberSize: number = 5;
  // 潜客页page
  memberPage: number = 1;
  // 潜客页totla
  memberTotal: number = 0;
  subForm: SubForm = {
    name: ""
  };
  // 旧顾问信息
  oldCustomInfo: any = {};
  firstCustomQuery = {
    adviserId: "",
    role: "POTENTIAL"
  };
  secondCustomQuery = {
    enabled: "ENABLE"
  };
  adviserForm: adviserForm = {
    name: ""
  };
  adviserObj: any = {};
  adviserCoumns: any[] = adviserCoumns;
  readonly tableAttrs = {
    border: true,
    columns: [
      {
        type: "selection"
      },
      {
        prop: "name",
        label: "潜客姓名",
        formatter: (row: any) => row.name
      },
      {
        prop: "phone",
        label: "潜客手机号"
      },
      {
        prop: "intentionCarModel",
        label: "意向车型"
      },
      {
        prop: "time",
        label: "最近互动时间",
        formatter: (row: any) => dayjs(row.time).format("YYYY-MM-DD HH:mm")
      }
    ]
  };
  readonly tableAdviser = {
    border: true,
    columns: [
      {
        type: "selection"
      },
      {
        prop: "rank",
        label: "排名"
      },
      {
        prop: "name",
        label: "顾问姓名",
        formatter: (row: any) => row.name
      },
      {
        prop: "phone",
        label: "手机号"
      },
      {
        prop: "curMemberNum",
        label: "潜客数"
      },
      {
        prop: "star",
        label: "顾问星级"
      }
    ]
  };
  getDatas(val: any) {
    console.log("val", val);
    let arr: any[] = [];
    this.currentPageArr = val;
    if (this.selectArr.length === 0) {
      return;
    }
    for (var i in val) {
      for (var j in this.selectArr) {
        if (val[i].memberUserId === this.selectArr[j]) {
          arr.push(val[i]);
        }
      }
    }
    this.adminTableRef.isSelect(arr);
  }
  next() {
    // 下一步
    if (this.selectArr.length === 0) {
      this.showMsg("请先选择转移的潜客", "warning");
      return;
    }
    this.step = "SECOND";
  }
  previous() {
    // 上一步
    this.step = "FIRST";
  }
  confirm() {
    // 確定
    if (!this.adviserObj.adviserUserId) {
      this.showMsg("请先选择顾问", "warning");
      return;
    }
    if (this.adviserObj.adviserUserId === this.firstCustomQuery.adviserId) {
      this.showMsg("当前顾问不能和转移顾问相同", "warning");
      return;
    }
    if (this.confirmStatus) {
      this.confirmStatus = false;
      this.transferMember();
    }
  }
  open(row: any) {
    this.currentPageArr = [];
    this.firstCustomQuery.adviserId = row.adviserUserId;
    this.selectArr = [];
    this.adviserObj = {};
    this.step = "FIRST";
    this.confirmStatus = true;
    this.dialogStatus = true;
    this.oldCustomInfo = row;
    this.$nextTick(() => {
      this.adminTableRef.goSearch();
      this.adminRefAdviser.isSelect();
    });
  }
  selectAll(val: any) {
    let selectArr = this.selectArr;
    if (val.length > 0) {
      // 记录全选
      for (var i in val) {
        if (selectArr.indexOf(val[i].memberUserId) === -1) {
          selectArr.push(val[i].memberUserId);
        }
      }
    } else {
      // 移除全选
      for (var j = 0; j < this.currentPageArr.length; j++) {
        let index: number = selectArr.indexOf(this.currentPageArr[j].memberUserId);
        if (index !== -1) {
          selectArr.splice(index, 1);
        }
      }
    }
    this.selectArr = selectArr;
  }
  currentCell(val: any, selection: any) {
    let index = this.selectArr.indexOf(selection.memberUserId);
    if (val.indexOf(selection) > -1) {
      if (index === -1) {
        this.selectArr.push(selection.memberUserId);
      }
    } else {
      if (index !== -1) {
        this.selectArr.splice(index, 1);
      }
    }
  }
  getList(param = this.subForm) {
    return memberList(param);
  }
  getAdviser(param = this.adviserForm) {
    return adviserListOld(param);
  }
  async transferMember() {
    // 转移潜客
    try {
      let param = {
        adviserUserId: this.adviserObj.adviserUserId,
        memberUserId: this.selectArr,
        oldAdviserName: this.oldCustomInfo.name
      };
      let { data } = await transferMember(param);
      if (data) {
        this.confirmStatus = true;
        this.$emit("successful", "success");
        this.showMsg("转移成功");
        this.adminRefAdviser.isSelect();
        this.dialogStatus = false;
      }
    } catch (error) {
      this.confirmStatus = true;
      this.log(error);
    }
  }
  created() {}
}
</script>
<style lang="scss" scoped>
.is-select {
  line-height: 33px;
  margin-right: 30px;
}
.header {
  margin-top: 12px;
  .h-style {
    line-height: 32px;
  }
  .align-style {
    text-align: right;
  }
  .input-style {
    width: 40%;
    margin-right: 10px;
  }
}
</style>
