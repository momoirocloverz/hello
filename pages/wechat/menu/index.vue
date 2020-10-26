<template>
  <div>
    <breadcrumb-group
      :breadGroup="[{ label: '公众号', to: '' }, { label: '微信菜单设置', to: '/wechat/menu/index' }]"
    />
    <el-card class="wechat-menu-set">
      <!--判断是否授权-->
      <div v-if="hasAuth" v-loading="saving || loading">
        <div class="menu-set-container">
          <!--微信目录预览-->
          <preview :validateContent="validateContent" @preChangeMenu="preChangeMenu" />
          <div class="right-content">
            <!--menu内容-->
            <menu-content ref="menuContentRef" />
            <div class="btn-wrap">
              <el-button
                type="success"
                size="small"
                :disabled="chatMenu.buttons.length < 1"
                @click="saveSet"
                v-if="hasSavePer"
                >保存并发布</el-button
              >
            </div>
          </div>
        </div>
      </div>
      <div class="common_flex-center common_flex-column" v-else-if="!loading && !hasAuth">
        <p>绑定公众号后，即可使用自定义菜单功能</p>
        <el-button type="primary" size="small" @click="goBind">先去绑定公众号</el-button>
      </div>
    </el-card>
  </div>
</template>

<script lang="ts">
import preview from "./components/preview.vue";
import { Component, Vue, Watch, Ref } from "vue-property-decorator";
import { State, Action } from "vuex-class";
import api from "@/api/restful";
import MenuContent from "./components/menuContent.vue";

@Component({
  name: "index",
  components: { preview, MenuContent }
})
export default class extends Vue {
  @Ref() readonly menuContentRef: any;
  @State(state => state.weChat.selectedMenu) private selectedMenu!: any; // 选中的menu
  @State(state => state.weChat.chatMenu) private chatMenu!: any; // 微信的全部menu
  @State(state => state.weChat.organId) private organId!: any; // 微信的全部menu
  @Action("getChatMenu", { namespace: "weChat" })
  getChatMenu: any; // 获取菜单
  @Action("setSelectedMenu", { namespace: "weChat" })
  setSelectedMenu: any; // 设置已选择的菜单
  @Action("saveMenu", { namespace: "weChat" })
  saveMenu: Function;
  @Action("getOrganId", { namespace: "weChat" })
  getOrganId: Function;
  @Action("getTagList", { namespace: "weChat" })
  getTagList: Function;
  @Action("setMenuIdx", { namespace: "weChat" })
  setMenuIdx: Function; // 设置menu的idx
  private loading: Boolean = false;
  private saving: Boolean = false;
  private validateContent: Boolean = true;
  private hasAuth: Boolean = false;
  get hasSetEditPer() {
    return this.accessIsOpened("PERM:WX_OFFICIAL_ACCOUNTS:EDIT");
  }
  get hasSavePer() {
    return this.accessIsOpened("PERM:WX_MENU:EDIT");
  }
  /**
   * 是否绑定公众号
   */
  private async getAuth() {
    this.loading = true;
    try {
      let info = await api.get({ url: "GET_AUTH_INFO", organId: this.organId });
      if (info.data) {
        this.loading = false;
        this.hasAuth = true;
        this.getChatMenu();
        this.getTagList();
      } else {
        this.loading = false;
        this.hasAuth = false;
      }
    } catch (e) {
      this.loading = false;
      this.hasAuth = false;
    }
  }

  /**
   * 去绑定
   */
  goBind(): void {
    if (this.hasSetEditPer) {
      this.$router.push({
        path: "/wechat/set/index"
      });
    } else {
      this.$message.warning("无公众号设置权限");
    }
  }

  /**
   * 跳转网页是否正确
   * @param item
   */
  private checkView(item: any): boolean {
    let { url, type } = item;
    let valid = true;
    if (type === "view") {
      let reg = /^(?:http(s)?:\/\/)?[\w.-]+(?:\.[\w.-]+)+[\w\-._~:/?#[\]@!$&'*+,;=.]+$/;

      valid = reg.test(url);
    }
    return valid;
  }

  /**
   * 检查图文
   * @param item
   */
  private checkClick(item: any): boolean {
    let { dataInfo, type, value } = item;
    let valid = true;
    if (type !== "view") {
      if (type !== "text") {
        valid = dataInfo && dataInfo.mediaId;
      } else {
        valid = value && value !== "";
      }
    }
    return valid;
  }

  /**
   * 检测菜单名称
   * @param name
   */
  checkName(name: string): boolean {
    return /^[a-zA-Z]{1,16}$/.test((name + "").replace(/[\u4e00-\u9fa5]/g, "aa"));
  }
  /**
   * 检测可见范围
   */
  checkTagIds(item: any) {
    return item.tagIds.length > 0;
  }
  /**
   * 保存前的检测
   */
  private preValid() {
    let { buttons } = this.chatMenu;
    let hasValid: boolean = true;
    let tagValid: boolean = true;
    // 菜单
    for (let i = 0; i < buttons.length; i++) {
      let _btn = buttons[i];
      if (_btn.subButtons.length < 1) {
        hasValid = this.checkClick(_btn) && this.checkView(_btn);
        tagValid = this.checkTagIds(_btn);
        _btn.valid = hasValid;
        _btn.tagValid = tagValid;
        if (!hasValid || !tagValid) {
          this.setSelectedMenu(_btn);
          this.setMenuIdx({
            menuIdx: i,
            level: 1
          });
          break;
        }
      } else {
        // 子菜单
        for (let j = 0; j < _btn.subButtons.length; j++) {
          let _child = _btn.subButtons[j];
          hasValid = this.checkClick(_child) && this.checkView(_child);
          _child.valid = hasValid;
          tagValid = this.checkTagIds(_child);
          _child.tagValid = this.checkTagIds(_child);
          if (!hasValid || !tagValid) {
            this.setSelectedMenu(_child);
            this.setMenuIdx({
              menuIdx: i,
              subIdx: j,
              level: 2
            });
            break;
          }
        }
      }
      if (!hasValid || !tagValid) {
        break;
      }
    }
    return hasValid && tagValid;
  }

  /**
   * 切换目录进行检测
   */
  async preChangeMenu() {
    if (this.selectedMenu.type) {
      this.menuContentRef.menuFormRef.validate((valid: boolean) => {
        this.validateContent = valid;
      });
    }
  }

  /**
   * 保存目录
   * 先对menu进行检测
   */
  async saveSet() {
    try {
      this.preChangeMenu();
      if (this.validateContent) {
        if (this.preValid()) {
          this.saving = true;
          await this.saveMenu(this.chatMenu);
          this.saving = false;
          this.$message.success("保存成功");
        }
      }
    } catch (e) {
      this.saving = false;
    }
  }
  created() {
    this.getOrganId();
  }
  mounted() {
    this.getAuth();
  }
  beforeDestroy() {
    this.setSelectedMenu({});
  }
}
</script>
<style scoped lang="scss">
.wechat-menu-set {
  position: relative;
  width: 100%;
  height: 100%;
  min-height: 640px;
  overflow: auto;
  .menu-set-container {
    .right-content {
      display: flex;
      flex-direction: column;
    }
  }

  .btn-wrap {
    display: flex;
    justify-content: center;
    margin-top: 30px;
  }
}
</style>
