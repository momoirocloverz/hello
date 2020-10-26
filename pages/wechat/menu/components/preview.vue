<!--微信预览-->
<template>
  <div class="w-phone">
    <div class="w-preview">
      <div class="w-head">
        <div class="w-title">{{ menuTitle }}</div>
      </div>
      <div class="w-bg">
        <draggable :list="chatMenu.buttons" :sort="sortable" group="article" id="w-menu" :class="['main-menu-list']">
          <!--主菜单-->
          <div
            :class="['menu-item', { 'cursor-move': sortable }, { current: menuIdx === i && level === 1 }]"
            v-for="(btn, i) in chatMenu.buttons"
            :key="btn.id"
            @click="handleSelectedMenu(btn, i)"
          >
            <div class="menu-item-title" :class="sortable ? 'sortable' : ''" :title="btn.name">
              <i :class="sortable ? 'el-icon-rank' : 'icon-dot'"></i>
              <span>{{ btn.name }}</span>
            </div>
            <!--子菜单-->
            <div class="sub-menu-list" v-if="menuIdx === i">
              <draggable :list="btn.subButtons" :sort="sortable">
                <div
                  v-for="(sub, idx) in btn.subButtons"
                  :key="idx"
                  class="sub-menu-item"
                  :class="{ current: subIdx === idx && level === 2 }"
                  @click.stop="selectedSubMenu(sub, idx, i)"
                >
                  <div class="menu-item-title" :title="sub.name">
                    <i class="el-icon-rank" v-if="sortable"></i>
                    <span>{{ sub.name }}</span>
                  </div>
                </div>
              </draggable>
              <div v-if="!btn.subButtons || btn.subButtons.length < 5" class="sub-menu-item" @click="addMenu(btn, 2)">
                <div class="menu-item-title">
                  <span class="el-icon-plus"></span>
                </div>
              </div>
              <i class="menu-arrow arrow_out"></i>
              <i class="menu-arrow arrow_in"></i>
            </div>
          </div>
          <div class="menu-item" v-if="chatMenu.buttons.length < 3" @click="addMenu(chatMenu.buttons, 1)">
            <i class="el-icon-plus"></i>
          </div>
        </draggable>
      </div>
    </div>
    <el-button v-if="chatMenu.buttons.length > 0" @click="menuSort" size="small" class="menu-sort">{{
      this.sortable ? "完成" : "菜单排序"
    }}</el-button>
  </div>
</template>

<script lang="ts">
import { Component, Vue, Prop } from "vue-property-decorator";
import { Action, State } from "vuex-class";
import Draggable from "vuedraggable";
import { generateUuid } from "@/utils/";
import _ from "lodash";
import { storeInfoSetting } from "@/utils/userSetting";
@Component({
  name: "menuPreview",
  components: {
    Draggable
  }
})
export default class extends Vue {
  @State(state => state.weChat.selectedMenu) private selectedMenu!: any; // 选中的menu
  @Prop({ default: false }) private validateContent: boolean;
  @State(state => state.weChat.chatMenu) private chatMenu!: any; //  微信菜单
  @State(state => state.weChat.menuIdx) private menuIdx!: any;
  @State(state => state.weChat.subIdx) private subIdx!: any;
  @State(state => state.weChat.level) private level!: any;
  @Action("setSelectedMenu", { namespace: "weChat" })
  setSelectedMenu: any; // 设置已选择的菜单
  @Action("setMenuIdx", { namespace: "weChat" })
  setMenuIdx: any; // 设置menu的idx

  @Action("saveMenu", { namespace: "weChat" })
  saveMenu: Function; // 保存菜单
  sortable: boolean = false;
  initMenu: any = {
    dataInfo: null,
    subButtons: null,
    tagIds: ["all"],
    appId: null,
    key: null,
    mediaId: null,
    level: 2,
    name: "子菜单名称",
    pagePath: "",
    contentType: "click",
    type: "news",
    show: true,
    valid: true,
    url: ""
  };

  get isValid(): boolean {
    return this.validateContent;
  }
  get menuTitle(): string {
    return storeInfoSetting.getInfo().info.dealerName || "吉利4S店";
  }
  /**
   * 选择目录，先验证内容配置是否正确
   * @param menu
   * @param i
   */
  private async handleSelectedMenu(menu: any, i: number) {
    await this.$emit("preChangeMenu");
    if (this.isValid) {
      this.setMenuIdx({
        subIdx: 0,
        menuIdx: i,
        level: 1
      });
      this.setSelectedMenu(menu);
    } else {
      this.$message.warning("请完善当前菜单页");
    }
  }

  /**
   * 选择子目录
   * @param menu
   * @param menuIdx
   * @param subIdx
   */
  private async selectedSubMenu(menu: any, subIdx: number, menuIdx: number) {
    await this.$emit("preChangeMenu");
    if (this.isValid) {
      this.setMenuIdx({
        subIdx,
        menuIdx,
        level: 2
      });
      this.setSelectedMenu(menu);
    } else {
      this.$message.warning("请完善当前菜单页");
    }
  }

  /**
   * 添加目录
   * @param menu
   * @param level
   */
  private async addMenu(menu: any, level: number) {
    if (this.sortable) {
      this.$message.warning("请先完成排序");
      return;
    }
    await this.$emit("preChangeMenu");
    if (this.isValid) {
      let _initMenu = _.cloneDeep(this.initMenu);
      let uuid = generateUuid();
      menu.subButtons = menu.subButtons || [];
      level === 1
        ? menu.push({
            ..._initMenu,
            uuid,
            level: 1,
            name: "菜单名称",
            subButtons: []
          })
        : menu.subButtons.push({
            ..._initMenu,
            uuid
          });
    } else {
      this.$message.warning("请完善当前菜单页");
    }
  }

  /**
   * 目录排序
   */
  private async menuSort() {
    await this.$emit("preChangeMenu");
    if (this.isValid) {
      if (this.sortable) {
        console.log(this.chatMenu);
        // await this.saveMenu(this.chatMenu);
        // this.$message.success('完成排序成功')
      }
      this.sortable = !this.sortable;
      this.setMenuIdx({
        menuIdx: -1
      });
    }
  }

  mounted() {}
}
</script>

<style scoped lang="scss">
$phone_w: 320px;
$phone_h: 540px;
$b_color: #e7e7eb;
$head_h: 64px;
$menu_h: 50px;
.w-phone {
  display: flex;
  flex-direction: column;
  float: left;
  margin-right: 10px;
  .cursor-move {
    cursor: move !important;
  }
  .w-preview {
    position: relative;
    display: flex;
    flex-direction: column;
    justify-content: space-between;
    width: $phone_w;
    height: $phone_h;
    border: 1px solid $b_color;
    overflow: hidden;
    .w-head {
      position: relative;
      color: #fff;
      text-align: center;
      width: $phone_w;
      height: $head_h;
      background: transparent url(../../../../assets/images/wechat/menu_head.png) no-repeat 0 0;
      background-position: 0 0;
      .w-title {
        position: absolute;
        width: 100%;
        color: #fff;
        font-size: 15px;
        text-align: center;
        top: 33px;
        left: 0;
      }
    }
    .main-menu-list {
      position: relative;
      width: $phone_w;
      height: $menu_h;
      border-top: 1px solid #e7e7e7;
      background: transparent url(../../../../assets/images/wechat/menu_foot.png) no-repeat 0 0;
      background-position: 0 0;
      padding-left: 43px;
      margin-bottom: 0;
      list-style: none;
      .menu-item {
        position: relative;
        float: left;
        line-height: $menu_h;
        height: $menu_h;
        text-align: center;
        width: 33.33%;
        border-left: 1px solid #e7e7e7;
        cursor: pointer;
        color: #616161;
        &.current {
          border: 1px solid $wechat-color;
          background: #fff;
          color: $wechat-color;
        }
      }
      .icon-dot {
        background: url(../../../../assets/images/wechat/little.png) 0px -36px no-repeat;
        width: 7px;
        height: 7px;
        vertical-align: middle;
        display: inline-block;
        margin-right: 2px;
        margin-top: -2px;
      }
    }
    .sub-menu-list {
      position: absolute;
      bottom: 60px;
      left: 0;
      right: 0;
      border-top: 1px solid #d0d0d0;
      margin-bottom: 0;
      background: #fafafa;
      display: block;
      padding: 0;
      list-style: none;
      .menu-arrow {
        position: absolute;
        left: 50%;
        margin-left: -6px;
        &.arrow_in {
          bottom: -4px;
          display: inline-block;
          width: 0;
          height: 0;
          border-width: 6px 6px 0;
          border-style: solid dashed dashed;
          border-color: #fafafa transparent transparent;
        }
        &.arrow_out {
          bottom: -5px;
          display: inline-block;
          width: 0;
          height: 0;
          border-width: 6px 6px 0;
          border-style: solid dashed dashed;
          border-color: #d0d0d0 transparent transparent;
        }
      }
      .sub-menu-item {
        line-height: 50px;
        height: 50px;
        text-align: center;
        width: 100%;
        border: 1px solid #d0d0d0;
        border-top-width: 0;
        cursor: pointer;
        position: relative;
        color: #616161;

        &.current {
          border: 1px solid $wechat-color;
          background: #fff;
          color: $wechat-color;
        }
      }
    }
    .menu-item-title {
      overflow: hidden;
      text-overflow: ellipsis;
      white-space: nowrap;
      &.sortable {
        .el-icon-rank {
          text-align: left;
        }
      }
    }
  }
  .menu-sort {
    /*position: absolute;*/
    bottom: 20px;
    left: 160px;
    margin-top: 30px;
  }
}
</style>
