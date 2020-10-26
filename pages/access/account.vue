<template>
  <div class="account">
    <breadcrumb-group :breadGroup="[{label:'用户管理',to:''}]" />
    <el-admin-table :tableAttrs="tableAttrs"
                    :apiFn="getUserList"
                    ref="adminTableRef"
                    :customQuery="customQuery"
                    :formData.sync="subForm">
      <template slot="search"
                class="search-head">
        <el-form-item prop="name">
          <el-input v-model="subForm.account"
                    placeholder="账号"
                    clearable
                    size="small" />
        </el-form-item>
        <el-form-item prop="name">
          <el-input v-model="subForm.name"
                    placeholder="姓名"
                    clearable
                    size="small" />
        </el-form-item>
        <el-form-item prop="name">
          <el-input v-model="subForm.phone"
                    placeholder="手机号"
                    clearable
                    size="small" />
        </el-form-item>
        <el-form-item prop="msgType">
          <el-select v-model="subForm.status"
                     placeholder="员工状态"
                     clearable>
            <el-option label="启用"
                       value="ACTIVE"></el-option>
            <el-option label="冻结"
                       value="INACTIVITY"></el-option>
          </el-select>
        </el-form-item>
        <el-form-item class="add"
                      v-if="accessIsOpened('PERM:USER_MANAGE:EDIT')">
          <el-button type="primary"
                     @click="openModel('add')">新建用户</el-button>
        </el-form-item>
      </template>
    </el-admin-table>
    <el-dialog :title="dialogType"
               :show-close="false"
               @close="closeDialog"
               :visible.sync="dialogStatus">
      <el-form @submit.native.prevent
               :rules="rules"
               label-width="100px"
               class="form-content"
               label-position="left"
               :model="ruleForm"
               ref="ruleFormRef">
        <el-form-item label="姓名"
                      prop="name">
          <el-input maxlength="20"
                    v-model="ruleForm.name"
                    size="small">
            <template slot="append">{{ruleForm.name.length}}/20</template>
          </el-input>
        </el-form-item>
        <el-form-item label="账号"
                      prop="account">
          <el-input maxlength="20"
                    :disabled="dialogType === '编辑用户'?true:false"
                    v-model="ruleForm.account"
                    size="small">
            <template slot="append">{{ruleForm.account.length}}/20</template>
          </el-input>
          <span class="txt">账号具有唯一性，设置后不支持修改</span>
        </el-form-item>
        <el-form-item label="手机号"
                      prop="phone">
          <el-input v-model="ruleForm.phone"
                    maxlength="11"
                    size="small">
            <template slot="append">{{ruleForm.phone.length}}/11</template>
          </el-input>
        </el-form-item>
        <el-form-item label="所属事业部"
                      prop="businessUnitId"
                      v-if="this.role ==='0'">
          <el-select v-model="ruleForm.businessUnitId"
                     clearable>
            <el-option v-for="item in businessList"
                       :key="item.id"
                       :label="item.name"
                       :value="item.id"
                       size="small">
            </el-option>
          </el-select>
        </el-form-item>
        <el-form-item label="邮箱"
                      prop="email">
          <el-input v-model="ruleForm.email"
                    maxlength="50"
                    size="small">
            <template slot="append">{{ruleForm.email.length}}/50</template>
          </el-input>
        </el-form-item>
        <el-form-item label="职位"
                      prop="position">
          <el-input v-model="ruleForm.position"
                    maxlength="20"
                    size="small">
            <template slot="append">{{ruleForm.position.length}}/20</template>
          </el-input>
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
import { telValidator, mailCheck } from "@/const/reg";
import { userRoleConfig } from "@/const";
import { userList, addUser, editUser, userIsActive, deleteUser, accountRestPwd, getBu2RegionAll } from "@/api";
import dayjs from "dayjs";
import DialogSelectArticle from "@/pages/marketing/tweets/article/components/dialogSelectArticle.vue";
interface SubForm {
  account: string;
  channel: string;
  name: string;
  phone: string;
  status: string;
}
interface msgList {
  msgType?: string;
  msgContent?: string;
  date?: string;
  status?: number | string;
  id?: number | string;
  name: string;
  account: string;
  phone: string;
  email: string;
  position: string;
  businessUnitId?: number;
}

@Component
export default class account extends Vue {
  @Ref("ruleFormRef") readonly ruleFormRef: element.Refs;
  @Ref() readonly adminTableRef: any;
  businessList: any[] = [];
  subForm: SubForm = {
    account: "",
    channel: roleInfoSetting.getRole() === "1" ? "GROUP" : roleInfoSetting.getRole() === "2" ? "DEALER" : "MANUFACTOR",
    name: "",
    phone: "",
    status: ""
  };
  customQuery: any = {
    channel: roleInfoSetting.getRole() === "1" ? "GROUP" : roleInfoSetting.getRole() === "2" ? "DEALER" : "MANUFACTOR"
  };
  ruleForm: msgList = {
    name: "",
    account: "",
    phone: "",
    email: "",
    position: ""
  };
  currentRowId: string | number = "";
  role: number | string = roleInfoSetting.getRole();

  get rules() {
    let _rules: any = {
      name: [{ required: true, message: "请输入姓名", trigger: "blur" }],
      account: [{ required: true, message: "请填写账号", trigger: "blur" }],
      phone: [{ validator: telValidator, required: true, trigger: "blur" }],
      email: [{ validator: mailCheck, required: false, trigger: "blur" }]
    };
    this.role === "0" ? (_rules.businessUnitId = [{ required: true, trigger: "blur",message: "请选择事业部" }]) : "";
    return _rules;
  }

  getUserList(param = this.subForm) {
    return userList(param);
  }
  dialogStatus: boolean = false;
  dialogType: string = "新建用户";

  get tableAttrs() {
    const bzColumn =
      this.role === "0"
        ? [
            {
              prop: "businessUnitName",
              label: "所属事业部",
              formatter: (row: any) => this.formatBusiness(row)
            }
          ]
        : [];
    return {
      border: true,
      columns: [
        {
          prop: "account",
          label: "账号"
        },
        {
          prop: "name",
          label: "姓名",
          formatter: (row: any) => {
            if (row.adminFlag) {
              return `${row.name} (负责人)`;
            } else {
              return row.name;
            }
          }
        },
        {
          prop: "phone",
          label: "手机号"
        },
        {
          prop: "email",
          col: {
            width: "150px"
          },
          label: "邮箱"
        },
        {
          prop: "position",
          label: "职位"
        },
        ...bzColumn,
        {
          prop: "status",
          col: {
            width: "80px"
          },
          label: "员工状态",
          render: (h: any, row: any) =>
            h(
              "div",
              {
                attrs: {
                  class: row.status === 0 ? "open" : "freeze"
                }
              },
              row.status === 0 ? "开启" : "冻结"
            )
        },
        {
          prop: "msgContent",
          label: "新建时间",
          formatter: (row: any) => dayjs(row.createdTime).format("YYYY-MM-DD")
        },
        {
          type: "operation",
          col: {
            width: "180px"
          },
          btns: [
            {
              prop: (row: msgList) => {
                return {
                  disabled: row.msgType === "1"
                };
              },
              text: "编辑",
              show: (row: any) => this.accessIsOpened("PERM:USER_MANAGE:EDIT"),
              atClick: (row: any) => {
                this.openModel("edit", row);
              }
            },
            {
              prop: (row: msgList) => {
                return {
                  disabled: row.msgType === "1"
                };
              },
              show: (row: any) => this.accessIsOpened("PERM:USER_MANAGE:EDIT") && !row.adminFlag && row.status === 0,
              text: "冻结",
              atClick: (row: msgList) => {
                this.userSetting(row, "INACTIVITY", "确定要冻结该用户？冻结后该用户将无法登陆平台", "冻结用户");
              }
            },
            {
              prop: (row: msgList) => {
                return {
                  disabled: row.msgType === "1"
                };
              },
              show: (row: any) => this.accessIsOpened("PERM:USER_MANAGE:EDIT") && !row.adminFlag && row.status === 1,
              text: "启用",
              atClick: (row: msgList) => {
                this.userSetting(row, "ACTIVE", "确定要启用该用户？", "启用用户");
              }
            },
            {
              prop: (row: msgList) => {
                return {
                  disabled: row.msgType === "1"
                };
              },
              show: (row: any) =>
                this.accessIsOpened("PERM:USER_MANAGE:EDIT") && !row.adminFlag && row.name !== "ROLE_INSPECTOR",
              text: "重置密码",
              atClick: (row: msgList) => {
                this.userSetting(row, "REST", "确定要将该用户密码重置为初始密码？", "提示");
              }
            },
            {
              prop: (row: msgList) => {
                return {
                  disabled: row.msgType === "1"
                };
              },
              show: (row: any) => this.accessIsOpened("PERM:USER_MANAGE:EDIT") && !row.adminFlag && row.status === 1,
              text: "删除",
              atClick: (row: msgList) => {
                this.userSetting(row, "DELETE", "确定要删除用户吗？", "删除用户");
              }
            }
          ]
        }
      ]
    };
  }
  formatBusiness({ businessUnitId, businessUnitName }: any) {
    return businessUnitId === 0 ? "全国" : businessUnitName;
  }
  openModel(e: string, row?: any) {
    this.getBusinessList();
    this.dialogType = e === "add" ? "新建用户" : "编辑用户";
    if (row) {
      let { name, account, phone, email, position, id, businessUnitId } = row;
      this.currentRowId = id;
      this.ruleForm = {
        name: name ? name : "",
        account: account ? account : "",
        phone: phone ? phone : "",
        email: email ? email : "",
        position: position ? position : ""
      };
      let _businessUnitId = businessUnitId ? businessUnitId : 0;
      this.role === "0" ? this.$set(this.ruleForm, "businessUnitId", _businessUnitId) : "";
    } else {
      this.ruleForm = {
        name: "",
        account: "",
        phone: "",
        email: "",
        position: ""
      };
      this.role === "0" ? this.$set(this.ruleForm, "businessUnitId",0)  : "";
    }
    this.dialogStatus = true;
  }
  closeDialog() {
    this.ruleFormRef.resetFields();
    this.dialogStatus = false;
    this.currentRowId = "";
  }
  userSetting(row: msgList, type: string, text: string, tips: string) {
    // 操作弹框
    this.$confirm(text, tips, {
      confirmButtonText: "确定",
      cancelButtonText: "取消"
    })
      .then(() => {
        switch (type) {
          case "INACTIVITY":
            this.operate(row, userIsActive, type);
            break;
          case "ACTIVE":
            this.operate(row, userIsActive, type);
            break;
          case "REST":
            this.operate(row, accountRestPwd);
            break;
          case "DELETE":
            this.operate(row, deleteUser);
            break;
        }
      })
      .catch(() => {
        this.$message({
          type: "info",
          message: "已取消"
        });
      });
  }
  async operate(row: msgList, fn: Function, type?: string) {
    // 删除，冻结，启用，重置密码
    try {
      let data;
      if (type) {
        data = await fn(row.id, type);
      } else {
        data = await fn(row.id);
      }
      this.$message({
        type: "info",
        message: "操作成功"
      });
      this.adminTableRef.goSearch();
    } catch (error) {
      console.log(error);
    }
  }
  confirmBtn() {
    let params = {};
    let obj = JSON.parse(JSON.stringify(this.ruleForm));
    let type = this.dialogType;
    let currentRowId = this.currentRowId;
    let fn = addUser;
    if (type === "编辑用户") {
      obj.id = Number(currentRowId);
      fn = editUser;
    } else {
      obj.channel = this.role;
    }
    params = obj;
    this.ruleFormRef.validate((valid: any) => {
      if (valid) {
        // 增加用户
        this.userSet(params, fn);
      }
    });
  }
  async userSet(param: any, fn: Function) {
    // 新增&编辑用户
    try {
      const data = await fn(param);
      this.closeDialog();
      this.adminTableRef.goSearch();
    } catch (error) {
      console.log(error);
    }
  }

  // 查询事业部
  private async getBusinessList() {
    try {
      let { data } = await getBu2RegionAll();
      this.businessList = data;
      this.businessList.unshift({
        code: "code0",
        id: 0,
        name: "全国"
      });
    } catch (error) {
      this.log(error);
    }
  }
}
</script>
<style lang="scss" scoped>
.search-head {
  position: relative;
}
.add {
  position: absolute;
  right: 0;
}
/deep/ {
  .disNo {
    display: none;
  }
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
  .txt {
    font-size: 12px;
  }
}
</style>

