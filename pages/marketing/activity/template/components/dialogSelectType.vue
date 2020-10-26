<template>
  <div>
    <!--dialog-->
    <el-dialog title="请选择模版类型"
               :visible.sync="showDialog"
               :before-close="closeDialog"
               width="30%">
      <div class="dialog-content">
        <div class="list">
          <div class="list-item"
               v-for="(item, index) in options"
               :key="index"
               @click="creatTemplate(item.value)">
            <span>{{item.label}}</span>
            <i class="el-icon el-icon-arrow-right"></i>
          </div>
        </div>
      </div>
    </el-dialog>
  </div>
</template>

<script lang="ts">
import { Component, Watch, Prop, Vue, Ref } from "vue-property-decorator";
import api from "@/api/restful";

@Component
export default class dialogSelectType extends Vue {
  @Prop({ default: true })
  readonly showDialog: boolean;
  @Prop({ default: [] })
  readonly options: any[];
  private creatTemplate(type: string) {
    this.$router.push({
      path: `/marketing/activity/template/editor?type=${type}`
    });
  }
  closeDialog() {
    this.$emit("close", true);
  }
  @Watch("showDialog")
  onShowDialog(newVal: boolean, oldVal: boolean) {}
}
</script>

<style lang="scss" scoped>
.list {
  width: 100%;
  .list-item {
    width: 100%;
    height: 50px;
    line-height: 50px;
    padding: 0 20px;
    box-sizing: border-box;
    position: relative;
    border-bottom: 1px solid #f1f1f1;
    cursor: pointer;

    &:hover {
      background: #f1f1f1;
    }

    i {
      position: absolute;
      right: 20px;
      top: 20px;
    }

    &:last-child {
      border-bottom: none;
    }
  }
}
/deep/ {
  .el-dialog__body {
    padding: 0;
  }
}
</style>
