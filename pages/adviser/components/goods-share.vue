<template>
  <div>
    <el-admin-table :tableAttrs="tableAttrs"
                    :apiFn="getAdviserShares" />
  </div>
</template>

<script lang='ts'>
import { Component, Prop, Vue } from "vue-property-decorator";
import { goodsShareTable } from "../const/adviser-config";
import { getAdviserShares } from "@/api";

@Component
export default class GoodsShare extends Vue {
  readonly componentName: string = "GoodsShare";
  readonly tableAttrs = {
    border: true,
    columns: goodsShareTable
  };
  get id() {
    return this.$route.params.id;
  }
  getAdviserShares(params = {}) {
    const adviserId = this.id;
    const type = "SERIES";
    return getAdviserShares({
      adviserId,
      type,
      ...params
    });
  }
}
</script>