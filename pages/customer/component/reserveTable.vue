<template>
  <!-- 车辆预定 -->
  <el-admin-table :tableAttrs="tableAttrs"
                  :apiFn="apiFn"
                  :formData.sync="formData"
                  :hasSearchBtn="false">

  </el-admin-table>
</template>

<script lang='ts'>
import { Component, Vue, Prop } from "vue-property-decorator";
import { test_prePurchase_api } from "@/api";
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
  private apiFn: any = test_prePurchase_api;
  private formData: FormData = { userId: "" };
  private tableAttrs = {
    columns: [
      {
        prop: "modelForCollectionsOutput",
        label: "预约车型",
        formatter: (row: any) => `${row.modelForCollectionsOutput.seriesName}-${row.modelForCollectionsOutput.name}`
      },
      {
        prop: "expectAt",
        label: "期望提车时间",
        formatter: (row: any) => {
          return row.expectAt === 1
            ? "一周内"
            : row.expectAt === 2
            ? "半月内"
            : row.expectAt === 3
            ? "一个月内"
            : "三个月内";
        }
      },
      {
        prop: "counselorName",
        label: "专属顾问",
        formatter: (row: any) => (row.counselorName ? row.counselorName : "—")
      },
      {
        prop: "createdTime",
        label: "提交时间",
        formatter: (row: any) => formatDate(row.createdTime) || "—"
      }
    ]
  };

  private _filterStatus(status: number) {
    let _status = ["未到店", "待评价", "已完成", "已取消"];
    return _status[status];
  }

  created() {
    this.formData.userId = this.id;
  }
}
</script>