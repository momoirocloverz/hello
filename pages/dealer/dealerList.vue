<template>
  <div class="dealerList">
    <breadcrumb-group :breadGroup="[{ label: '经销商列表', to: '' }]" />
    <el-card>
      <el-admin-table :tableAttrs="tableAttrs"
                      ref="adminTableRef"
                      :apiFn="getDealerList"
                      :filterOut="filterOut"
                      :formData.sync="subForm"
                      @getTableData="getTableData">
        <template slot="top-content">
          <div class="dealer-info">
            <div class="left">
              <strong class="ml-15 mr-15">经销商 ({{ dealerData.pages.total }})</strong>
              <span class="ml-15 mr-15">
                <i class="iconfont iconweixin2"></i>
                已绑定公众号：<strong>{{ dealerData.bindNum }}</strong>
              </span>
              <span>
                <i class="iconfont iconweixin1"></i>
                已开通微信支付：<strong>{{ dealerData.openNum }}</strong>
              </span>
            </div>
            <div class="right">
              <span class="common_tip mr-15">更新时间：{{ dealerData.syncTime | momentTime }}</span>
              <el-button v-if="accessIsOpened('PERM:DEALER:EDIT')"
                         size="small"
                         @click="handleSyncDealer"
                         :loading="syncing">{{
                syncing ? "同步中" : "同步DMS经销商"
              }}</el-button>
            </div>
          </div>
        </template>
        <template slot="search">
          <el-form-item prop="dealerCode">
            <el-input v-model="subForm.dealerCode"
                      placeholder="经销商代码"
                      clearable />
          </el-form-item>
          <el-form-item prop="name">
            <el-input v-model="subForm.name"
                      placeholder="经销商名称"
                      clearable />
          </el-form-item>
          <el-form-item prop="dealerShortName">
            <el-input v-model="subForm.dealerShortName"
                      placeholder="经销商简称"
                      clearable />
          </el-form-item>
          <el-form-item prop="msgType">
            <el-select v-model="subForm.buName"
                       placeholder="事业部"
                       @change="changeBun">
              <el-option v-for="(item, index) in bunListArr"
                         :key="index"
                         :label="item.name"
                         :value="item.name"></el-option>
            </el-select>
          </el-form-item>
          <el-form-item prop="msgType">
            <el-select v-model="subForm.region"
                       :disabled="subForm.buName ? false : true"
                       placeholder="区域">
              <el-option v-for="(item, index) in regionArr"
                         :key="index"
                         :label="item.name"
                         :value="item.name"></el-option>
            </el-select>
          </el-form-item>
          <el-form-item v-if="role === '0'">
            <el-select v-model="subForm.blocId"
                       clearable
                       placeholder="所属集团">
              <el-option v-for="(item, index) in blocListArr1"
                         :key="index"
                         :label="item.name"
                         :value="item.id"></el-option>
              <div>
                <el-pagination layout="prev, pager, next"
                               :page-size="10"
                               @current-change="handleCurrentChange1"
                               :total="blocTotalCount">
                </el-pagination>
              </div>
            </el-select>
          </el-form-item>
          <el-form-item prop="isBindPnum">
            <el-select v-model="subForm.isBindPnum"
                       placeholder="是否绑定公众号">
              <el-option v-for="item in isBindPnumArr"
                         :key="item.value"
                         :label="item.label"
                         :value="item.value"></el-option>
            </el-select>
          </el-form-item>
          <el-form-item prop="isOpenWpay">
            <el-select v-model="subForm.isOpenWpay"
                       placeholder="是否开通微信支付">
              <el-option v-for="item in isOpenWpayArr"
                         :key="item.value"
                         :label="item.label"
                         :value="item.value"></el-option>
            </el-select>
          </el-form-item>
          <el-form-item prop="enabled">
            <el-select v-model="subForm.enabled"
                       placeholder="状态">
              <el-option v-for="item in statusArr"
                         :key="item.value"
                         :label="item.label"
                         :value="item.value"></el-option>
            </el-select>
          </el-form-item>
        </template>
      </el-admin-table>
    </el-card>
    <el-dialog title="启用经销商"
               :show-close="false"
               :visible.sync="dialogStatus">
      <el-form @submit.native.prevent
               :rules="rules"
               label-width="150px"
               class="form-content"
               label-position="left"
               :model="ruleForm"
               ref="ruleFormRef">
        <el-form-item label="经销商代码">
          <span>{{ ruleForm.dealerCode }}</span>
        </el-form-item>
        <el-form-item label="经销商名称">
          <span>{{ ruleForm.dealerName }}</span>
        </el-form-item>
        <el-form-item label="经销商简称">
          <span>{{ ruleForm.dealerShortName }}</span>
        </el-form-item>
        <el-form-item label="事业部">
          <span>{{ ruleForm.buName }}</span>
        </el-form-item>
        <el-form-item label="大区">
          <span>{{ ruleForm.area }}</span>
        </el-form-item>
        <el-form-item label="经销商账号"
                      prop="dealerAccount">
          <el-input maxlength="20"
                    placeholder="请输入字母/数字"
                    :disabled="caveDealerAccount ? true : false"
                    v-model="ruleForm.dealerAccount">
            <template slot="append">{{ ruleForm.dealerAccount.length }}/20</template>
          </el-input>
          <span>账号具有唯一性，设置后不支持修改</span>
        </el-form-item>
        <el-form-item label="负责人"
                      prop="principal">
          <el-input v-model="ruleForm.principal"
                    placeholder="请输入负责人姓名"
                    maxlength="50">
            <template slot="append">{{ ruleForm.principal.length }}/20</template>
          </el-input>
        </el-form-item>
        <el-form-item label="负责人手机号"
                      prop="principalMobile">
          <el-input v-model="ruleForm.principalMobile"
                    placeholder="请输入11位手机号"
                    maxlength="11">
            <template slot="append">{{ ruleForm.principalMobile.length }}/11</template>
          </el-input>
        </el-form-item>
        <el-form-item label="所属集团">
          <el-select v-model="ruleForm.blocName"
                     clearable
                     placeholder="请选择所属集团">
            <el-option v-for="(item, index) in blocListArr"
                       :key="index"
                       :label="item.name"
                       :value="item.name"></el-option>
            <div>
              <el-pagination layout="prev, pager, next"
                             :page-size="10"
                             @current-change="handleCurrentChange"
                             :total="blocTotalCount">
              </el-pagination>
            </div>
          </el-select>
        </el-form-item>
      </el-form>
      <div slot="footer"
           class="dialog-footer">
        <el-button @click="closeDialog">取 消</el-button>
        <el-button type="primary"
                   @click="confirmBtn">确 定</el-button>
      </div>
    </el-dialog>
  </div>
</template>
<script lang="ts">
import { Component, Prop, Vue, Ref } from "vue-property-decorator";
import { roleInfoSetting } from "@/utils/userSetting";
import { telValidator, numWordCheck } from "@/const/reg";
import { columns, bindPnumArr, openWpayArr } from "./const/dealer-list";
import {
  dealerListNew,
  blocDealerListNew,
  openDealer,
  freezeDaeler,
  accountRestPwd,
  bunRegion,
  blocList,
  syncDealer
} from "@/api";

interface SubForm {
  dealerCode: string;
  dealerShortName: string;
  blocName: string;
  buName: string;
  name: string;
  region: string;
  blocId: number | string;
  isOpenWpay: number | null;
  isBindPnum: number | null;
  enabled: number | null;
}
interface msgList {
  msgType?: string;
  dealerCode: string;
  dealerName: string;
  dealerShortName: string;
  buName: string;
  blocId: string | number;
  regionName: string;
  principal: string;
  principalMobile: string;
  dealerAccount: string;
  blocName: string;
  area: string;
}

@Component
export default class account extends Vue {
  @Ref("ruleFormRef") readonly ruleFormRef: element.Refs;
  @Ref() readonly adminTableRef: any;
  subForm: SubForm = {
    dealerCode: "",
    dealerShortName: "",
    blocName: "",
    buName: "",
    name: "",
    region: "",
    blocId: "",
    isOpenWpay: null,
    isBindPnum: null,
    enabled: null
  };
  ruleForm: msgList = {
    dealerCode: "",
    dealerName: "",
    dealerShortName: "",
    buName: "",
    blocId: "",
    regionName: "",
    principal: "",
    principalMobile: "",
    dealerAccount: "",
    blocName: "",
    area: ""
  };
  currentRowId: string | number = "";
  // 平台值
  role: number | string = roleInfoSetting.getRole();
  blocTotalCount: number = 1;
  // 当前页集团列表
  blocListArr: any[] = [];
  blocListArr1: any[] = [];
  // 全部集团列表数据
  blocListAll: any[] = [];
  // 事业部
  bunListArr: any[] = [];
  dealerData: any = {
    pages: {}
  };
  // 区域
  regionArr: any[] = [];
  // 保存经销商账号
  caveDealerAccount: string = "";
  syncing: boolean = false;
  rules: Object = {
    dealerAccount: [{ validator: numWordCheck, required: true, trigger: "blur" }],
    principal: [{ required: true, message: "请填写负责人", trigger: "blur" }],
    principalMobile: [{ validator: telValidator, required: true, trigger: "blur" }]
  };
  getDealerList(param = this.subForm) {
    if (roleInfoSetting.getRole() === "1") {
      return blocDealerListNew(param);
    } else {
      return dealerListNew(param);
    }
  }
  filterOut(res: any) {
    return res.pages.records;
  }
  getTableData(res: any) {
    this.dealerData = res;
  }
  dialogStatus: boolean = false;
  dialogType: string = "新建用户";
  readonly tableAttrs = {
    border: true,
    columns: columns
  };
  readonly isBindPnumArr: element.Options[] = bindPnumArr;
  readonly isOpenWpayArr: element.Options[] = openWpayArr;
  readonly statusArr: element.Options[] = [
    {
      label: "启用",
      value: 1
    },
    {
      label: "冻结",
      value: 0
    }
  ];
  // 所属集团
  blocShow: any = {
    prop: "blocName",
    key: "blocName",
    label: "所属集团"
  };
  statusShow: any[] = [
    {
      prop: "status",
      key: "status",
      label: "状态",
      render: (h: any, row: any) =>
        h(
          "div",
          {
            attrs: {
              class: row.dealerStatus === "1" ? "open" : "freeze"
            }
          },
          row.dealerStatus === "1" ? "开启" : "冻结"
        )
    }
  ];
  // 操作权限
  operateArr: any[] = [
    {
      prop: "fansNum",
      key: "fansNum",
      label: "粉丝",
      render: (h: any, row: any) =>
        h(
          "div",
          {
            attrs: {
              class: "colorStyle"
            },
            on: {
              click: () => {
                this.jump(row, "fans");
              }
            }
          },
          row.fansNum ? row.fansNum : 0
        )
    },
    {
      prop: "submarineNum",
      key: "submarineNum",
      label: "潜客",
      render: (h: any, row: any) =>
        h(
          "div",
          {
            attrs: {
              class: "colorStyle"
            },
            on: {
              click: () => {
                this.jump(row, "member");
              }
            }
          },
          row.submarineNum ? row.submarineNum : 0
        )
    },
    {
      prop: "status",
      key: "status",
      label: "状态",
      render: (h: any, row: any) =>
        h(
          "div",
          {
            attrs: {
              class: row.dealerStatus === "1" ? "open" : "freeze"
            }
          },
          row.dealerStatus === "1" ? "开启" : "冻结"
        )
    },
    {
      col: {
        width: "110px",
        fixed: "right"
      },
      type: "operation",
      btns: [
        {
          prop: (row: any) => {
            return {
              disabled: row.msgType === "1"
            };
          },
          show: (row: any) => this.accessIsOpened("PERM:DEALER:EDIT") && row.dealerStatus === "0",
          text: "启用",
          atClick: (row: any) => {
            this.openModel(row);
          }
        },
        {
          prop: (row: any) => {
            return {
              disabled: row.msgType === "1"
            };
          },
          show: (row: any) => this.accessIsOpened("PERM:DEALER:EDIT") && row.dealerStatus === "1",
          text: "冻结",
          atClick: (row: any) => {
            this.userSetting(
              row,
              "FREEZE",
              "确定要冻结该经销商？冻结后该经销商营销管理平台，微信商城将全部被冻结",
              "冻结经销商"
            );
          }
        },
        {
          prop: (row: any) => {
            return {
              disabled: row.msgType === "1"
            };
          },
          show: (row: any) =>
            this.accessIsOpened("PERM:DEALER:EDIT") && row.name !== "ROLE_INSPECTOR" && row.dealerStatus === "1",
          text: "重置密码",
          atClick: (row: any) => {
            this.userSetting(row, "REST", `确定要将"${row.dealerName}集团"密码重置为初始密码?`, "重置密码");
          }
        }
      ]
    }
  ];
  openModel(row: any) {
    let {
      dealerCode,
      dealerName,
      dealerShortName,
      buName,
      blocId,
      regionName,
      principal,
      principalMobile,
      dealerAccount,
      blocName,
      area
    } = row;
    this.ruleForm = {
      dealerCode: dealerCode ? dealerCode : "",
      dealerName: dealerName ? dealerName : "",
      dealerShortName: dealerShortName ? dealerShortName : "",
      buName: buName ? buName : "",
      blocId: blocId ? blocId : "",
      regionName: regionName ? regionName : "",
      principal: principal ? principal : "",
      principalMobile: principalMobile ? principalMobile : "",
      dealerAccount: dealerAccount ? dealerAccount : "",
      blocName: blocName ? blocName : "",
      area: area ? area : ""
    };
    this.caveDealerAccount = dealerAccount ? dealerAccount : "";
    this.dialogStatus = true;
  }
  jump(row: any, type: string) {
    if (type === "fans") {
      this.$router.push({
        path: `/customer/factoryFans`,
        query: {
          dealerCode: row.dealerCode
        }
      });
    } else {
      this.$router.push({
        path: `/customer/member/factoryMember`,
        query: {
          dealerCode: row.dealerCode
        }
      });
    }
  }
  closeDialog() {
    this.ruleFormRef.resetFields();
    this.dialogStatus = false;
  }
  userSetting(row: any, type: string, text: string, tips: string) {
    // 操作弹框
    this.$confirm(text, tips, {
      confirmButtonText: "确定",
      cancelButtonText: "取消"
    })
      .then(() => {
        switch (type) {
          case "FREEZE":
            this.operate(row.dealerCode, freezeDaeler);
            break;
          case "REST":
            this.operate(row.dealerAccountId, accountRestPwd);
            break;
        }
      })
      .catch(() => {
        // 取消操作
      });
  }
  async operate(param: any, fn: Function) {
    // 冻结，重置密码
    try {
      let data = await fn(param);
      this.$message({
        type: "info",
        message: "操作成功"
      });
      this.adminTableRef.goSearch();
    } catch (error) {
      console.log(error);
    }
  }
  async getBunList() {
    // 获取事业部
    let { data } = await bunRegion();
    if (data) {
      this.bunListArr = data;
      if (data.length === 1) {
        this.subForm.buName = data[0].name;
        this.regionArr = data[0].regionList;
      }
    }
  }
  async getLoc(page: number, type: number) {
    // 获取集团列表
    let param = {
      page,
      size: 10
    };
    let { data, totalCount } = await blocList(param);
    this.blocTotalCount = totalCount;
    if (type === 1) {
      this.blocListArr1 = data;
    } else {
      this.blocListAll = this.blocListAll.concat(data);
      this.blocListArr = data;
    }
  }
  handleCurrentChange1(e: any) {
    this.subForm.blocId = "";
    this.getLoc(e, 1);
  }
  handleCurrentChange(e: any) {
    this.getLoc(e, 0);
  }
  changeBun() {
    let bunListArr = this.bunListArr;
    let name = this.subForm.buName;
    for (var i in bunListArr) {
      if (bunListArr[i].name === name) {
        this.regionArr = bunListArr[i].regionList;
      }
    }
  }
  changeRegion() {
    if (this.subForm.buName === "") {
      console.log(1);
    }
  }
  async confirmBtn() {
    let { blocId, blocName, dealerAccount, dealerCode, principal, principalMobile } = this.ruleForm;
    let params = {
      blocId,
      blocName,
      dealerAccount,
      dealerCode,
      principal,
      principalMobile
    };
    let blocListAll = this.blocListAll;
    for (var i in blocListAll) {
      if (blocListAll[i].name === params.blocName) {
        params.blocId = blocListAll[i].id;
      }
    }
    if (params.blocName === "") {
      params.blocId = "";
    }
    this.ruleFormRef.validate((valid: any) => {
      if (valid) {
        // 开启
        this.openDealer(params);
      }
    });
  }
  async openDealer(params: any) {
    try {
      let { data } = await openDealer(params);
      this.closeDialog();
      this.$message({
        type: "info",
        message: "操作成功"
      });
      this.adminTableRef.goSearch();
    } catch (error) {
      console.log(error);
    }
  }
  async handleSyncDealer() {
    this.syncing = true;
    try {
      let res = await syncDealer();
      this.syncing = false;
      this.adminTableRef.goSearch();
    } catch (e) {
      this.syncing = false;
    }
  }
  created() {
    this.getBunList();
    console.log(this.role);
    if (this.role === "0") {
      this.getLoc(1, 1);
      this.getLoc(1, 0);
      if (this.tableAttrs.columns[8].key !== "blocName") {
        this.tableAttrs.columns.splice(8, 0, this.blocShow);
      }
      this.tableAttrs.columns = this.tableAttrs.columns.concat(this.operateArr);
    } else if (this.role === "1") {
      this.tableAttrs.columns = this.tableAttrs.columns.concat(this.statusShow);
    }
  }
}
</script>
<style lang="scss" scoped>
.dealer-info {
  display: flex;
  align-items: center;
  justify-content: space-between;
  background: #fff;
  height: 50px;
  border-bottom: 1px solid #f5f5f5;
  .iconweixin2,
  .iconweixin1 {
    color: $wechat-color;
    font-size: 18px;
    margin-right: 5px;
  }
}
/deep/ {
  .el-dialog {
    width: 40%;
    .form-content {
      width: 80%;
      margin: 0 auto;
    }
  }
  .open,
  .freeze {
    position: relative;
    margin-left: 15px;
  }
  .open:before,
  .freeze:before {
    position: absolute;
    left: -10px;
    bottom: 8px;
    content: " ";
    width: 8px;
    height: 8px;
    background-color: #26c24d;
    border-radius: 50%;
  }
  .freeze:before {
    background-color: #ccc;
  }
  .colorStyle {
    color: #168ff1;
    font-weight: bold;
    cursor: pointer;
  }
}
</style>
