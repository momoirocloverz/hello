<template>
  <!-- 客户管理-粉丝标签-折叠面板 -->
  <div class="collapse">
    <div class="line">
      <b>粉丝标签</b>
      <el-button size="small"
                 type="primary"
                 @click="addTag">新增标签</el-button>
    </div>
    <ul class="main">
      <p>全部粉丝</p>
      <li v-for="(item,index) of _fansList"
          :key="index"
          :class="{'select':item.select}"
          @click="selectItem(item)">
        <span>{{item.tag}}（{{item.number}}）</span>
        <i class="iconfont iconshanchu"
           @click.stop="deleteItem(item)"></i>
      </li>
    </ul>
    <el-btn-dialog :visible.sync="addVisible"
                   :dialogAttr="{width:'300px'}"
                   @save="saveAdd"
                   @close="init">
      <span class="name">标签名</span>
      <el-input placeholder="请输入标签名"
                v-model.trim="tagName"></el-input>
    </el-btn-dialog>

  </div>
</template>

<script lang='ts'>
import { Component, PropSync, Vue } from "vue-property-decorator";
import ElBtnDialog from "@/components/el-btn-dialog/index.vue";
/* eslint-disable-next-line */
import { FansList, FansListContentList } from "@/@types/custom.ts";

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
  _fansList: FansListContentList[];
  activeNames: string[] = ["全部用户"];
  tagName: string = "";
  addVisible: boolean = false;

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
    this.$emit("search", item.id);
  }

  // 删除
  private deleteItem(item: FansListContentList) {
    console.log("删除");
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
  background: #ffffff;
  .main {
    border-top: 1px solid #eeeeee;
    padding-top: 5px;
    p {
      padding-left: 15px;
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
        opacity: 0.95;
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