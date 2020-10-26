<template>
  <div>
    <breadcrumb-group :breadGroup="[{label:'顾问管理',to:''}]" />
    <el-admin-table :tableAttrs="tableAttrs"
                    :apiFn="getList"
                    ref="adminTableRef"
                    :formData.sync="subForm">
      <template slot="search">
        <div class="filter-container">
          <el-input v-model="subForm.name"
                    placeholder="顾问姓名"
                    size="small"
                    clearable />
          <el-select v-model="subForm.post"
                     size="small"
                     placeholder="岗位">
            <el-option v-for="(item, index) in positions"
                       :key="index"
                       :label="item"
                       :value="item">
            </el-option>
          </el-select>
          <el-select v-model="subForm.enabled"
                     size="small"
                     placeholder="状态">
            <el-option v-for="item in status"
                       :key="item.value"
                       :label="item.label"
                       :value="item.value">
            </el-option>
          </el-select>
        </div>
      </template>
      <template slot="right-btns">
        <div class="btns-container">
          更新时间：{{syncTime}}
          <el-button type="default"
                     size="small"
                     v-if="accessIsOpened('PERM:ADVISER:EDIT')"
                     @click="syncAdviser"
                     :icon="syncStatus === 1 ? 'el-icon-refresh': ''"
                     :disabled="syncStatus === 1">{{syncStatus === 1? '同步中': '同步DMS顾问'}}</el-button>
        </div>
      </template>
    </el-admin-table>
    <el-dialog title="启用顾问"
               :visible.sync="dialogStatus"
               width="30%">
      <el-form @submit.native.prevent
               :model="currentRow"
               status-icon
               :rules="rules"
               ref="ruleFormRef"
               label-position="left"
               label-width="100px"
               class="demo-ruleForm">
        <el-form-item label="顾问姓名:"
                      prop="name">
          <span>{{currentRow.name}}</span>
        </el-form-item>
        <el-form-item label="手机号:"
                      prop="phone">
          <span>{{currentRow.phone}}</span>
        </el-form-item>
        <el-form-item label="头像:"
                      prop="avatar">
          <upload-to-ali @input="getUrl"
                         :size="1024 * 10"
                         v-model="currentRow.avatar"></upload-to-ali>
        </el-form-item>
      </el-form>
      <span slot="footer"
            class="dialog-footer">
        <el-button @click="cancel">取 消</el-button>
        <el-button type="primary"
                   @click="confirm">确 定</el-button>
      </span>
    </el-dialog>
    <move-member ref="dialog"
                 @successful="successful"
                 :dialog-visible="dialogMember"></move-member>
  </div>
</template>

<script lang='ts'>
import dayjs from "dayjs";
import { Component, Vue, Ref } from "vue-property-decorator";
import { adviserList, consultantSet, consultantMod } from "@/api";
import UploadToAli from "@/components/upload-to-ali/src/index.ts";
import MoveMember from "./components/move-member.vue";
import { adviserTableColumns } from "./const/adviser-config";
interface SubForm {
  name: string;
  enabled: string;
  post: string;
}
interface msgList {
  msgType: string;
  msgContent: string;
  date: string;
}
@Component({
  components: {
    UploadToAli,
    MoveMember
  }
})
export default class Article extends Vue {
  @Ref() readonly adminTableRef: any;
  @Ref("ruleFormRef") readonly ruleFormRef: element.Refs;
  @Ref() readonly dialog: any;
  private positions: any[] = [];
  private status: any[] = [{ value: "ENABLE", label: "启用" }, { value: "FREEZE", label: "冻结" }];
  subForm: SubForm = {
    name: "",
    enabled: "",
    post: ""
  };
  private syncTime: string = "";
  private syncStatus: number = 0; // 0:同步完成，1:同步中
  async getList(param = this.subForm) {
    let params = {};
    let data = await adviserList(param);
    let pages = data.data.pages;
    params = {
      data: pages.records,
      totalCount: pages.total
    };
    this.syncTime = dayjs(data.syncTime).format("YYYY-MM-DD HH:mm:ss");
    return params;
  }
  rules: Object = {
    avatar: [{ required: true, message: "请选择头像", trigger: "blur" }]
  };
  isChangeAvatar: boolean = false;
  currentRow: any = {
    name: "",
    phone: "",
    adviserUserId: "",
    avatar: ""
  };
  dialogMember: boolean = false;
  dialogStatus: boolean = false;
  readonly tableAttrs = {
    border: true,
    columns: [
      ...adviserTableColumns,
      {
        type: "operation",
        col: {
          width: "170px"
        },
        btns: [
          {
            prop: (row: msgList) => {
              return {
                disabled: row.msgType === "1"
              };
            },
            text: "详情",
            atClick: (row: msgList) => this.goDetail(row)
          },
          {
            prop: (row: msgList) => {
              return {
                disabled: row.msgType === "1"
              };
            },
            show: (row: any) => this.accessIsOpened("PERM:ADVISER:EDIT") && row.enabled === "ENABLE",
            text: "转移潜客",
            atClick: (row: any) => this.openMemberDialog(row)
          },
          {
            prop: (row: msgList) => {
              return {
                disabled: row.msgType === "1"
              };
            },
            show: (row: any) => this.accessIsOpened("PERM:ADVISER:EDIT") && row.enabled === "ENABLE",
            text: "冻结",
            atClick: (row: any) => {
              this.$confirm("确定要冻结该顾问？冻结后该顾问将无法登录顾问端", "冻结顾问", {
                confirmButtonText: "确定",
                cancelButtonText: "取消"
              }).then(() => {
                this.consultantSet(row.adviserUserId, false);
              });
            }
          },
          {
            prop: (row: msgList) => {
              return {
                disabled: row.msgType === "1"
              };
            },
            show: (row: any) => this.accessIsOpened("PERM:ADVISER:EDIT") && row.enabled === "FREEZE",
            text: "启用",
            atClick: (row: any) => this.openDialog(row)
          }
        ]
      }
    ]
  };
  getUrl(e: any) {
    console.log("头像", e);
    if (e) {
      this.isChangeAvatar = true;
    }
  }
  successful(val: any) {
    this.adminTableRef.goSearch();
  }
  async consultantSet(id: number, enabled: boolean) {
    let { msg } = await consultantSet(id, enabled);
    if (msg === "SUCCESS") {
      if (enabled === true) {
        this.cancel();
      }
      this.adminTableRef.goSearch();
    }
  }
  async consultantMod() {
    let param = {
      avatar: this.currentRow.avatar,
      id: this.currentRow.adviserUserId
    };
    if (!this.isChangeAvatar) {
      this.consultantSet(Number(this.currentRow.adviserUserId), true);
    } else {
      let { msg } = await consultantMod(param);
      if (msg === "SUCCESS") {
        this.consultantSet(Number(this.currentRow.adviserUserId), true);
      }
    }
  }
  cancel() {
    this.ruleFormRef.resetFields();
    this.dialogStatus = false;
    this.isChangeAvatar = false;
  }
  confirm() {
    this.ruleFormRef.validate((valid: any) => {
      if (valid) {
        // 开启
        this.consultantMod();
      }
    });
  }
  openMemberDialog(row: any) {
    this.dialog.open(row);
  }
  async syncAdviser() {
    this.syncStatus = 1;
    let { data } = await (<any>this).$api.get({ url: "SYNV_ADVISER", isAdminApi: true });
    if (data !== -1) {
      this.$message({ type: "success", message: "同步DMS顾问成功" });
      this.syncTime = dayjs(data).format("YYYY-MM-DD HH:mm:ss");
    } else {
      this.$message({ type: "error", message: "同步DMS顾问失败，请重试" });
    }
    this.syncStatus = 0;
  }
  openDialog(row: any) {
    let { name, phone, avatar, adviserUserId } = row;
    this.currentRow = {
      name: name ? name : "",
      phone: phone ? phone : "",
      avatar: avatar ? avatar : "",
      adviserUserId
    };
    this.dialogStatus = true;
  }
  datePickerChange(val = []): void {
    console.log(val);
  }
  goDetail(row: any) {
    this.$router.push({
      name: "adviser-detail",
      params: {
        id: row.adviserUserId
      }
    });
  }
  async getPositions() {
    let { data } = await (<any>this).$api.get({ url: "POSTS_LIST", isAdminApi: true });
    this.positions = data;
  }
  created() {
    this.getPositions();
  }
}
</script>
<style lang="scss" scoped>
.filter-container {
  /deep/ {
    .el-input {
      width: 150px;
      margin-right: 7px;
    }
  }
}
.btns-container {
  vertical-align: middle;
  text-align: right;
  flex: 1;
}
/deep/ {
  .el-form-item {
    margin-bottom: 0;
  }
  .head-img {
    width: 50px;
    margin: 0 auto;
  }
  .ENABLE,
  .FREEZE {
    position: relative;
    margin-left: 15px;
  }
  .ENABLE:before,
  .FREEZE:before {
    position: absolute;
    left: -10px;
    bottom: 8px;
    content: " ";
    width: 8px;
    height: 8px;
    background-color: #ccc;
    border-radius: 50%;
  }
  .ENABLE:before {
    background-color: #0eec2c;
  }
}
</style>
