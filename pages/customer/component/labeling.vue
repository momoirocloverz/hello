<template>
  <!-- 打标签 -->
  <el-btn-dialog class="tag-group"
                 title="打标签"
                 :visible.sync="_visible"
                 :dialogAttr="{width:'400px'}"
                 :saveLoading="saveLabelLoading"
                 :saveAutoClose="false"
                 @save="saveLabel"
                 @close="close">
    <div class="content_body">
      <el-tag v-for="(item,index) of _fansList"
              :key="index"
              :class="{'disabled':item.disabled}"
              :type="item.select?'':'info'"
              @click="tagSelect(item)">{{item.name}}</el-tag>
      <div class="add-line">
        <p>新增标签</p>
        <div class="add-tag">
          <el-input v-model.trim="_addTagName"
                    placeholder="请输入标签名"
                    :maxlength="10"
                    size="small">
            <span slot="suffix">{{_addTagName.length}}/10</span>
          </el-input>
          <el-button size="mini"
                     @click="saveTag"
                     :loading="addTagLoading">+添加</el-button>
        </div>
      </div>
    </div>
  </el-btn-dialog>
</template>

<script lang='ts'>
import { Component, Vue, PropSync, Watch, Prop } from "vue-property-decorator";
import ElBtnDialog from "@/components/el-btn-dialog/index.vue";
/* eslint-disable-next-line */
import { FansList, FansListContentList, FansListContent } from "@/@types/custom.ts";
import deepClone from "@/utils/deepClone";

interface LabelTabItem {
  id?: number;
  name?: string;
  type?: string | number;
}

@Component({
  components: {
    ElBtnDialog
  }
})
export default class App extends Vue {
  @PropSync("fansList", {
    type: Array,
    default: () => {
      return [];
    }
  })
  _fansList: Array<LabelTabItem>;

  @PropSync("visible", { type: Boolean, default: false }) _visible: boolean;
  @PropSync("selectTagList", {
    type: Array,
    default: () => {
      return [];
    }
  })
  _selectTagList: Array<number | string>; // 打标签 选择中的list
  @Prop({ type: Boolean, default: false }) saveLabelLoading: boolean;
  @Prop({ type: Boolean, default: false }) addTagLoading: boolean;

  @PropSync("addTagName", { type: String }) _addTagName: string; // 新增tag
  _oldFansList: FansListContentList;

  @Watch("visible")
  visibleChange() {
    this._oldFansList = deepClone(this._fansList);
  }

  tagSelect(item: FansListContentList) {
    if (item.disabled) return;
    item.select = !item.select;
    item.select ? this.pushSelectList(item.id) : this.filterSelectList(item.id);
  }
  // push list
  pushSelectList(id: number | string) {
    this._selectTagList.push(id);
  }
  // filter list
  filterSelectList(id: number | string) {
    this._selectTagList = this._selectTagList.filter(ids => ids !== id);
  }

  // 保存打的标签
  saveLabel() {
    this.$emit("saveTag", this._selectTagList);
  }

  // 保存添加的标签
  saveTag() {
    if (!this._addTagName) {
      this.showMsg("请先填写标签名称", "warning");
      return;
    }
    this.$emit("addTag", this._addTagName);
  }
  close() {
    this.$emit("close");
  }
}
</script>
<style lang='scss' scoped>
.content_body {
  margin-right: 30px;
}
.tag-group {
  .el-tag {
    margin: 0 5px 5px;
    cursor: pointer;
  }
  .disabled {
    cursor: not-allowed;
  }
}
.add-line {
  margin-top: 30px;
  p {
    font-size: 13px;
  }
  .add-tag {
    display: flex;
    justify-content: space-between;
  }
  /deep/ {
    .el-input__suffix-inner {
      line-height: 31px;
    }
  }
  .el-button {
    margin-left: 10px;
  }
}
</style>