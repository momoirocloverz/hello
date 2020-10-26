<template>
  <!-- 预约试驾 -->
  <el-admin-table :tableAttrs="tableAttrs"
                  :apiFn="apiFn"
                  :formData.sync="formData"
                  :hasSearchBtn="false">

  </el-admin-table>
</template>

<script lang='ts'>
import { Component, Vue, Prop } from "vue-property-decorator";
import { test_drive_api } from "@/api";
import { userRoleConfig } from "@/const";
import { storeInfoSetting } from "@/utils/userSetting.ts";
import { formatDate } from "@/utils";

interface FormData {
  dealerCode?: string | number; // 经销商端传
  mfId?: number | string; // 主机厂id
  userId: number | string; // 潜客id
}

@Component
export default class App extends Vue {
  @Prop({ type: String, default: "" }) id: string;
  @Prop({ type: String, default: "2" }) role: string;
  private apiFn: any = test_drive_api;
  private formData: FormData = { userId: "" };
  private tableAttrs = {
    columns: [
      {
        prop: "model",
        label: "预约车型",
        formatter: (row: any) => `${row.model.seriesName}-${row.model.name}`
      },
      {
        prop: "appointmentDate",
        label: "预约时间",
        formatter: (row: any) => formatDate(row.appointmentDate)
      },
      {
        prop: "adviserName",
        label: "专属顾问",
        formatter: (row: any) => row.adviserName ?  row.adviserName : '—'
      }
    ]
  };

  private _filterStatus(status: number) {
    let _status = ["未到店", "待评价", "已完成", "已取消"];
    return _status[status];
  }
  private _filterStatusColor(status: number) {
    let _status = ["dot dot1", "dot dot3", "dot dot2", "dot dot5"];
    return _status[status];
  }

  created() {
    this.formData.userId = this.id;
  }
}
</script>