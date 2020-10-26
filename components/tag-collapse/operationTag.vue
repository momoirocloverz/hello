<template>
  <!-- 打标签 -->
  <el-btn-dialog class="tag-group"
                 title="新增顾问评价标签"
                 :visible.sync="_visible"
                 :dialogAttr="{width:'400px'}"
                 :saveLoading="submitLoading"
                 @save="saveAll"
                 :saveAutoClose="false">
    <slot name="title"></slot>
    <div class="add-line">
      <div class="add-tag">
        <el-input v-model="name"
                  placeholder="请输入标签名"
                  size="small"
                  maxlength="10">
          <template slot="suffix">
            <span>{{name.length }}/10</span>
          </template>
        </el-input>
        <el-button size="mini"
                   @click="saveTag">+添加</el-button>
      </div>
      <slot name="content"></slot>
    </div>
  </el-btn-dialog>
</template>

<script lang='ts'>
import { Component, Vue, PropSync, Prop } from "vue-property-decorator";
import ElBtnDialog from "@/components/el-btn-dialog/index.vue";
/* eslint-disable-next-line */
import { FansList, FansListContentList, FansListContent } from "@/@types/custom.ts";
import deepClone from "@/utils/deepClone";

@Component({
  components: {
    ElBtnDialog
  }
})
export default class App extends Vue {
  @PropSync("visible", { type: Boolean, default: false }) _visible: boolean;
  @Prop({ default: false, type: Boolean }) submitLoading: boolean;
  name: string = ""; // 新增tag

  // 保存打的标签
  saveTag() {
    if (!this.name) {
      this.showMsg("请先输入标签名", "warning");
      return;
    }
    this.$emit("saveTag", this.name);
    this.name = "";
  }

  saveAll() {
    this.$emit("saveAll");
  }
}
</script>
<style lang='scss' scoped>
.tag-group {
  .el-tag {
    margin-left: 10px;
    cursor: pointer;
  }
  .el-tag:first-child {
    margin-left: 0;
  }

  .add-line {
    margin-top: 30px;
    p {
      font-size: 13px;
    }
    .add-tag {
      display: flex;
      justify-content: space-between;
      margin-bottom: 15px;
    }

    .el-button {
      margin-left: 10px;
    }
  }
}
/deep/ {
  .el-input__suffix {
    top: 6px;
  }
}
</style>