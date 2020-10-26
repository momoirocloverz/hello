<template>
  <div>
    <el-admin-table :tableAttrs="tableAttrs"
                    :apiFn="getAdviserShares" />
  </div>
</template>

<script lang='ts'>
import { Component, Prop, Vue } from "vue-property-decorator";
import { activityShareTable } from "../const/adviser-config";
import { getAdviserShares } from "@/api";

@Component
export default class ActivityShare extends Vue {
  readonly componentName: string = "ActivityShare";
  readonly tableAttrs = {
    border: true,
    columns: activityShareTable
  };
  get id() {
    return this.$route.params.id;
  }
  getAdviserShares(params = {}) {
    const adviserId = this.id;
    const type = "CAMPAIGN";
    return getAdviserShares({
      adviserId,
      type,
      ...params
    });
  }
}
</script>
<style lang="scss" scoped>
/deep/ {
  .status0,
  .status1,
  .status2,
  .status3 {
    position: relative;
    margin-left: 15px;
  }
  .status0:before,
  .status1:before,
  .status2:before,
  .status3:before {
    position: absolute;
    left: -10px;
    bottom: 8px;
    content: " ";
    width: 8px;
    height: 8px;
    background-color: #0851ee;
    border-radius: 50%;
  }
  .status1:before {
    background-color: #ceba05;
  }
  .status2:before {
    background-color: #26c24d;
  }
  .status3:before {
    background-color: #ccc;
  }
  .status4:before {
    background-color: red;
  }
}
</style>