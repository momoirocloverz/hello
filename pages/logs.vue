<template>
  <div>
    <breadcrumb-group :breadGroup="[{ label: '操作日志', to: '' }]" />
    <el-admin-table :tableAttrs="tableAttrs"
                    :apiFn="getlist"
                    :formData.sync="subForm"
                    @reset="resetForm">
      <template slot="search">
        <el-form-item label="操作人">
          <el-select v-model="subForm.operatorId"
                     clearable
                     placeholder="操作人">
            <el-option v-for="(item, index) in userListArr"
                       :key="index"
                       :label="item.name"
                       :value="item.id"></el-option>
            <div>
              <el-pagination layout="prev, pager, next"
                             :page-size="10"
                             @current-change="handleCurrentChange"
                             :total="userTotal">
              </el-pagination>
            </div>
          </el-select>
        </el-form-item>
        <el-form-item prop="msgContent"
                      label="操作时间">
          <el-date-picker type="daterange"
                          v-model="dataPickerVal"
                          value-format="yyyy-MM-dd"
                          range-separator="至"
                          start-placeholder="开始日期"
                          end-placeholder="结束日期"
                          @change="datePickerChange"
                          clearable />
        </el-form-item>
      </template>
    </el-admin-table>
  </div>
</template>

<script lang="ts">
import { Component, Vue } from "vue-property-decorator";
import { operationLog } from "@/api/modules/dealerList";
import { roleInfoSetting } from "@/utils/userSetting";
import { userList } from "@/api";
import dayjs from "dayjs";
interface SubForm {
  operatorId: number | string;
  startDate: string;
  endDate: string;
}
interface msgList {
  msgType: string;
  msgContent: string;
  date: string;
}
@Component({})
export default class Article extends Vue {
  subForm: SubForm = {
    operatorId: "",
    startDate: "",
    endDate: ""
  };
  getlist(param = {}) {
    return operationLog(param);
  }
  userListArr: any[] = [];
  userTotal: number = 1;
  dataPickerVal: string[] = [];
  readonly tableAttrs = {
    border: true,
    columns: [
      {
        col: {
          width: "180px"
        },
        prop: "operatorName",
        label: "操作人"
      },
      {
        col: {
          width: "180px"
        },
        prop: "ip",
        label: "IP地址"
      },
      {
        prop: "content",
        label: "操作内容"
      },
      {
        col: {
          width: "180px"
        },
        prop: "msgContent",
        label: "操作时间",
        formatter: (row: any) => (row.operateTime ? dayjs(row.operateTime).format("YYYY-MM-DD HH:mm") : "-")
      }
    ]
  };
  async getUserlist(page: number) {
    try {
      let param = {
        page,
        channel:
          roleInfoSetting.getRole() === "1" ? "GROUP" : roleInfoSetting.getRole() === "2" ? "DEALER" : "MANUFACTOR",
        size: 10
      };
      let { data, totalCount } = await userList(param);
      this.userTotal = totalCount;
      this.userListArr = data;
    } catch (error) {
      this.log(error);
    }
  }
  handleCurrentChange(e: any) {
    this.getUserlist(e);
  }
  datePickerChange(val = []): void {
    if (val) {
      this.subForm.startDate = val[0];
      this.subForm.endDate = val[1];
    } else {
      this.subForm.startDate = "";
      this.subForm.endDate = "";
    }
  }
  resetForm(): void {
    this.dataPickerVal = [];
  }
  created() {
    this.getUserlist(1);
  }
}
</script>
