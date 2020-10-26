<template>
  <!-- 浏览记录 -->
  <el-admin-table :tableAttrs="tableAttrs"
                  :apiFn="apiFn"
                  :formData.sync="formData"
                  :hasSearchBtn="false">

  </el-admin-table>
</template>

<script lang='ts'>
import { Component, Vue, Prop } from "vue-property-decorator";
import { getModelUserBrowses_api } from "@/api";
import { userRoleConfig } from "@/const";
import { storeInfoSetting } from "@/utils/userSetting.ts";
import { formatDate } from "@/utils";

interface FormData {
  dealerCode?: string | number; // 经销商端传
  mfId?: number | string; // 主机厂id
  userId: number | string; // 潜客id
}

@Component
export default class BrowseTable extends Vue {
  @Prop({ type: String, default: "" }) id: string;
  @Prop({ type: String, default: "2" }) role: string;
  private apiFn: any = getModelUserBrowses_api;
  private formData: FormData = { userId: "" };
  private tableAttrs = {
    columns: [
      {
        prop: "goodsName",
        label: "浏览内容"
      },
      {
        prop: "count",
        label: "浏览次数"
      },
      {
        prop: "lastBrowseTime",
        label: "最近浏览时间",
        formatter: (row: any) => formatDate(row.lastBrowseTime)
      }
    ]
  };
  created() {
    this.formData.userId = this.id;
  }
}
</script>
<style lang='scss' scoped>
</style>