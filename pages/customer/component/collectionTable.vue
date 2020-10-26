<template>
  <!-- 收藏记录 -->
  <el-admin-table :tableAttrs="tableAttrs"
                  :apiFn="apiFn"
                  :formData.sync="formData"
                  :hasSearchBtn="false">

  </el-admin-table>
</template>

<script lang='ts'>
import { Component, Vue, Prop } from "vue-property-decorator";
import { getModelCollections_api } from "@/api";
import { userRoleConfig } from "@/const";
import { storeInfoSetting } from "@/utils/userSetting.ts";
import { formatDate } from "@/utils";

interface FormData {
  dealerCode?: string | number; // 经销商端传
  mfId?: number | string; // 主机厂id
  userId: number | string; // 潜客id
}

@Component
export default class CollectionTable extends Vue {
  @Prop({ type: String, default: "" }) id: string;
  @Prop({ type: String, default: "2" }) role: string;
  private apiFn: any = getModelCollections_api;
  private formData: FormData = { userId: "" };
  private tableAttrs = {
    columns: [
      {
        prop: "goodsName",
        label: "收藏内容"
      },
      {
        prop: "lastBrowseTime",
        label: "收藏时间",
        formatter: (row: any) => formatDate(row.createdTime)
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