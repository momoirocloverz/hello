<template>
  <div>
    <el-admin-table :tableAttrs="tableAttrs"
                    :apiFn="adviserGetComments" />
  </div>
</template>

<script lang='ts'>
import { Component, Prop, Vue } from 'vue-property-decorator';
import { commentOnAdviserTable } from "../const/adviser-config";
import { adviserGetComments } from "@/api";

@Component
export default class CommentOnAdviser extends Vue {
  readonly componentName: string = 'CommentOnAdviser';
  readonly tableAttrs = {
    border: true,
    columns: commentOnAdviserTable
  };
  get id() {
    return this.$route.params.id;
  }
  adviserGetComments(params = {}) {
    const targetIds = this.id
    const businessCode = "COUNSELOR"
    return adviserGetComments({
      ...params,
      targetIds,
      businessCode
    })
  }
}
</script>