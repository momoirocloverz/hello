<template>
  <!-- 标签-折叠面板 -->
  <!-- v-loading="_fansList.length <= 0"
       element-loading-text="拼命加载中"
       element-loading-spinner="el-icon-loading" -->
  <div class="collapse">
    <div>
      <slot name="title"></slot>
    </div>
    <ul class="main"
        v-for="(item,index) of _fansList"
        :key="index">
      <p v-if="title && index === 0"
         @click="showAll">{{title}}</p>
      <li :class="{'select':item.select}"
          @click="selectItem(item)">
        <span>{{item.name}}（{{typeof(item.num) ==='number'? item.num : item.number}}）</span>

        <i class="iconfont iconshanchu"
           @click.stop.prevent="deleteItem(item)"
           v-if="formParent==='agentFans' && item.type==='CREATE' && btnVisible"></i>

        <i class="iconfont iconshanchu"
           @click.stop.prevent="deleteItem(item)"
           v-if="formParent==='consultantTag' &&!moreIcon && item.type && btnVisible"></i>

        <el-popover placement="bottom"
                    width="80"
                    trigger="hover"
                    popper-class="popper_tag_hover"
                    v-else-if="moreIcon && item.type && btnVisible">
          <div @click.stop="editItem(item)"
               class="text">编辑</div>
          <div @click.stop="deleteItem(item)"
               class="text">删除</div>
          <i slot="reference"
             class="el-icon-more"></i>
        </el-popover>
      </li>
    </ul>
    <el-btn-dialog :visible.sync="addVisible"
                   :dialogAttr="{width:'300px'}"
                   @save="saveAdd"
                   @close="init">
      <span class="name">标签名</span>
      <el-input placeholder="请输入标签名"
                v-model="tagName"
                maxlength="10">
        <template slot="suffix">
          <span>{{tagName.length }}/10</span>
        </template>
      </el-input>
    </el-btn-dialog>

  </div>
</template>

<script lang='ts'>
import { Component, PropSync, Vue, Prop } from "vue-property-decorator";
import ElBtnDialog from "@/components/el-btn-dialog/index.vue";
/* eslint-disable-next-line */
import { FansList, FansListContentList } from "@/@types/custom.ts";

@Component({
  components: {
    ElBtnDialog
  }
})
export default class App extends Vue {
  @Prop({ type: String, default: "" }) formParent: string;
  @Prop({ type: String, default: "" }) title: string;
  @Prop({ type: Boolean, default: false }) moreIcon: boolean; // 是否需要更多的操作按钮
  @Prop({ type: Boolean, default: true }) btnVisible: boolean; // 是否需要操作按钮
  @PropSync("fansList", {
    // 列表
    type: Array,
    default: () => {
      return [];
    }
  })
  _fansList: FansListContentList[];
  activeNames: string[] = ["全部用户"];
  tagName: string = "";
  addVisible: boolean = false;
  selectedId: number | string = "";

  // 新增tag
  addTag() {
    this.addVisible = true;
  }
  saveAdd() {
    if (!this.tagName) {
      this.showMsg("请先填写标签名");
      return;
    }
    this.init();
  }

  // 选中
  private selectItem(item: FansListContentList) {
    this._fansList.map((item: FansListContentList) => {
      return (item.select = false);
    });
    item.select = true;
    this.selectedId = item.id;
    this.$emit("search", item.id);
    this.$emit("searchItem", item);
  }

  // 删除
  private deleteItem(item: FansListContentList) {
    this.$emit("deletSubItem", item.id);
    if (this.selectedId === item.id) {
      this.$emit("reset");
    }
  }
  // 编辑
  private editItem(item: FansListContentList) {
    console.log(item);
    this.$emit("editSubItem", item);
  }
  private showAll() {
    this._fansList.map((item: FansListContentList) => {
      return (item.select = false);
    });
    this.$emit("showAll");
  }

  init() {
    this.addVisible = false;
    this.tagName = "";
  }
}
</script>
<style lang='scss' scoped>
.collapse {
  min-width: 250px;
  padding-bottom: 0;
  height: 100%;
  overflow: auto;
  background: #fff;
  .main {
    // border-top: 1px solid #eeeeee;
    p {
      padding-left: 15px;
      height: 40px;
      line-height: 40px;
      margin: 0;
      cursor: pointer;
      &:hover {
        background: #e7f2fc;
      }
    }
    li {
      padding-left: 30px;
      padding-right: 15px;
      height: 40px;
      display: flex;
      justify-content: space-between;
      align-items: center;
      cursor: pointer;
      font-size: 13px;
      &:hover {
        background: #e7f2fc;
      }
    }
    .iconshanchu {
      font-size: 12px;
    }
    .select {
      background: #d0e5f7;
    }
  }

  .name {
    margin-bottom: 10px;
    display: inline-block;
  }
  .line {
    display: flex;
    justify-content: space-between;
    align-items: center;
    padding: 15px;

    b {
      font-size: 15px;
      color: #666;
    }
  }

  ul,
  li {
    list-style: none;
  }
}
</style>
<style lang="scss">
.popper_tag_hover {
  padding: 0;
  padding-top: 5px;
  padding-bottom: 5px;
  min-width: 90px;
  .text {
    cursor: pointer;
    padding: 5px 20px;
    &:hover {
      background: #e7f2fc;
    }
    &:active {
      background: #d0e5f7;
    }
  }
}
</style>
