<!--菜单设置内容-->
<template>
  <!--菜单设置-->
  <div class="w-detail-set">
    <div class="set-content" v-if="selectedMenu.type">
      <!--菜单名称-->
      <div class="menu-title">
        <span>{{ selectedMenu.name }}</span>
        <span class="delete-menu" @click="deleteMenu" v-if="!selectedMenu.defMenu">删除菜单</span>
      </div>
      <div class="set-info">
        <el-form
          @submit.native.prevent
          :model="selectedMenu"
          ref="menuFormRef"
          size="small"
          label-width="120px"
          :rules="menuFormRules"
        >
          <el-form-item :label="nameLabel" prop="name">
            <el-input v-model="selectedMenu.name" :maxLength="nameMaxLen"></el-input>
            <span class="common_tip">{{ nameTip }}</span>
          </el-form-item>
          <!--菜单内容start-->
          <el-form-item label="菜单内容" prop="content" v-if="showContent">
            <!--菜单内容start-->
            <el-radio-group v-model="mediaType" @change="changeType" :disabled="selectedMenu.defMenu">
              <el-radio :label="item.value" v-for="item in constant.MENU_CONTENT" :key="item.value" :value="item.value"
                >{{ item.label }}
              </el-radio>
            </el-radio-group>
            <!--菜单内容end-->
            <div :class="['source-card', { error: !selectedMenu.valid }]">
              <!--跳转网页-->
              <div class="jump-page" v-if="selectedMenu.type === 'view'">
                <div class="common_tip">订阅者点击该子菜单会跳到以下链接</div>
                <el-form @submit.native.prevent v-model="selectedMenu" size="small" :inline="true">
                  <el-form-item label="页面地址" prop="url">
                    <el-input
                      :disabled="!hasAuth || selectedMenu.defMenu"
                      v-model="selectedMenu.url"
                      placeholder="认证后才可手动输入地址"
                      clearable=""
                      class=" mr-15"
                    ></el-input>
                  </el-form-item>
                </el-form>
              </div>
              <!--跳转网页-->
              <!--发送消息-->
              <div class="info-content" v-else>
                <!--头部类型-->
                <div class="card-head">
                  <div
                    :class="['head-item', { current: contentType === item.value }]"
                    v-for="item in constant.MENU_SET_HEAD_ARR"
                    :key="item.value"
                    @click="chooseType(item)"
                  >
                    <i :class="['head-icon', item.icon]"></i>
                    <span>{{ item.label }}</span>
                  </div>
                </div>
                <div>
                  <!--文字-->
                  <div v-if="selectedMenu.type === 'text'">
                    <el-input
                      type="textarea"
                      v-model="selectedMenu.value"
                      rows="12"
                      maxlength="600"
                      show-word-limit
                    ></el-input>
                  </div>
                  <div
                    class="card-content"
                    v-else-if="selectedMenu.dataInfo && contentType === selectedMenu.type && selectedMenu.show"
                  >
                    <news-info-content />
                    <a class="delete-text" @click="remove">删除</a>
                  </div>
                  <!--图片-->
                  <div class="card-content" v-else>
                    <div
                      class="content-item"
                      v-for="item in contentArr"
                      :key="item.value"
                      @click="handleTypeClick(item)"
                    >
                      <!--上传图片-->
                      <el-upload
                        :action="`${prefix}wechat/materials/materialFileUpload`"
                        :headers="headers"
                        :data="uploadData"
                        :show-file-list="false"
                        :on-error="handleError"
                        :on-progress="handleProgress"
                        accept="image/*"
                        :on-success="handleUploadPic"
                        v-if="item.type === 'upload'"
                      >
                        <div :class="['item-icon', item.icon]"></div>
                        <div class="label">{{ uploading ? "上传中" : item.label }}</div>
                      </el-upload>
                      <div v-else>
                        <div :class="['item-icon', item.icon]"></div>
                        <div class="label">{{ item.label }}</div>
                      </div>
                    </div>
                  </div>
                </div>
              </div>
            </div>
            <div v-if="!selectedMenu.valid" class="red-text">
              {{ selectedMenu.type === "view" ? "请输入正确的url" : "请完善菜单内容" }}
            </div>
          </el-form-item>
          <!--菜单内容end-->
          <el-form-item label="可见范围" prop="tagIds" v-if="selectedMenu.level !== 1">
            <el-select multiple v-model="selectedMenu.tagIds" :loading="tagList.loading">
              <el-option v-for="tag in tagList.list" :key="tag.wxId" :value="tag.wxId" :label="tag.name"></el-option>
            </el-select>
          </el-form-item>
        </el-form>
      </div>
    </div>
    <div class="set-content common_flex-center" v-else>点击左侧菜单进行编辑操作</div>
    <chat-dialog :contentType="contentType" :dialogObj="dialogInfo" @handleClose="handleClose" />
  </div>
</template>

<script lang="ts">
import { Component, Vue, Watch, Ref } from "vue-property-decorator";
import { State, Action } from "vuex-class";
import { DialogInfo } from "@/@types/activity";
import NewsInfoContent from "./newsInfoContent.vue";
import DialogSelectArticle from "@/pages/marketing/tweets/article/components/dialogSelectArticle.vue";
import * as CONST from "../../const";
import ChatDialog from "./chatDialog.vue";
import { storeInfoSetting } from "@/utils/userSetting";

@Component({
  name: "index",
  components: { ChatDialog, DialogSelectArticle, NewsInfoContent }
})
export default class extends Vue {
  @Ref() readonly menuFormRef: { formRef: HTMLFormElement };
  @State(state => state.weChat.selectedMenu) private selectedMenu!: any; // 选中的menu
  @State(state => state.weChat.chatMenu) private chatMenu!: any; // 微信的全部menu
  @State(state => state.weChat.tagList) private tagList!: any; // tag
  @State(state => state.weChat.organId) private organId!: any;
  @Action("deleteChatMenu", { namespace: "weChat" })
  deleteChatMenu: Function;
  @Action("setSelectedMenu", { namespace: "weChat" })
  setSelectedMenu: Function;
  @Action("setMenuIdx", { namespace: "weChat" })
  setMenuIdx: any; // 设置menu的idx
  readonly constant: any = CONST;
  private clickArr: Array<string> = ["img", "news", "video", "media_id", "click", "image", "photo", "text"];
  private uploadData = {};
  private mediaType: string = "click";
  private dialogObj: DialogInfo = {
    show: false,
    title: "添加图片",
    type: "pic",
    info: {}
  };
  private dialogInfo: DialogInfo = {
    show: false,
    title: "从素材库中选择图文",
    type: "picText",
    info: {}
  };
  private contentType: string = "news";
  uploading: boolean = false;
  prefix: string = process.env.VUE_APP_API_PREFIX;
  // 是否授权
  hasAuth: boolean = true;
  // 验证菜单名称
  private validateName(rule: any, value: any, callback: any) {
    let str = this.selectedMenu.name;
    let reg = this.selectedMenu.level === 1 ? /^\w{1,8}$/ : /^\w{1,16}$/;
    if (reg.test((str + "").replace(/[\u4e00-\u9fa5]/g, "aa"))) {
      callback();
    } else {
      callback(new Error("菜单名称不符合规则"));
    }
  }
  get headers() {
    let token = storeInfoSetting.getCookies() || "";
    return {
      "x-auth-token": token
    };
  }
  // menu规则
  get menuFormRules(): any {
    return {
      tagIds: { required: true, trigger: "change", message: "请选择可见范围" },
      name: {
        required: true,
        validator: this.validateName,
        trigger: "blur"
      }
    };
  }

  get nameMaxLen() {
    return this.selectedMenu.level === 1 ? 8 : 16;
  }
  get nameLabel() {
    return this.selectedMenu.level === 1 ? "菜单名称" : "子菜单名称";
  }
  get nameTip() {
    return this.selectedMenu.level === 1
      ? "仅支持中英文和数字，字数不超过4个汉字或8个字母"
      : "仅支持中英文和数字，字数不超过8个汉字或16个字母";
  }

  /**
   * 是否显示内容
   * 当一级菜单无子菜单时或者二级菜单
   */
  get showContent() {
    return (this.selectedMenu.level === 1 && this.selectedMenu.subButtons.length < 1) || this.selectedMenu.level === 2;
  }
  /**
   * 根据不同的类型来显示文字
   * 菜单类型为 news ,img,video,view
   */
  get contentArr(): Array<{}> {
    let _arr: Array<{}> = [];
    switch (this.contentType) {
      case "news":
        // 图文信息
        _arr = this.constant.PIC_TEXT_CHOOSE_ARR;
        break;
      case "img":
        // 图片
        _arr = this.constant.PIC_CHOOSE_ARR;
        break;
      case "video":
        // 视频
        _arr = this.constant.VIDEO_ARR;
        break;
    }
    return _arr;
  }

  /**
   * 切换类型
   * 当为跳转网页时，url必须有值
   * @param val
   */
  changeType(val: any) {
    let { type, initType, initUrl, show, dataInfo, initValue } = this.selectedMenu;
    this.selectedMenu.valid = true;
    if (val === "click") {
      this.selectedMenu.type = initType === "view" ? "news" : initType || "news";
      this.selectedMenu.show = !dataInfo || !dataInfo.mediaId ? false : show;
      this.selectedMenu.url = null;
      // this.selectedMenu.value = initValue;
    } else {
      this.selectedMenu.type = "view";
      this.selectedMenu.url = initType === "view" ? initUrl : "";
      this.selectedMenu.value = "";
    }
  }

  /**
   * 选择发送信息类型
   * @param row
   */
  chooseType(row: any): void {
    if (row.value !== this.contentType) {
      let { initType, initDataInfo, initValue } = this.selectedMenu;
      this.selectedMenu.show = row.value === initType;
      this.selectedMenu.type = row.value;
      this.selectedMenu.dataInfo = row.value === initType ? initDataInfo : {};
      this.contentType = row.value;
    }
  }

  /**
   * 删除目录
   */
  deleteMenu() {
    let h = this.$createElement;
    let _str = this.selectedMenu.level === 1 ? "菜单" : "子菜单";

    let message: any = h("div", {}, [
      h("p", {}, `确定要删除“${this.selectedMenu.name}”${_str}？`),
      h("p", { class: "common_tip" }, `删除后该子菜单下设置的内容将被删除`)
    ]);
    this.$confirm(message, "温馨提示", { type: "warning" }).then(res => {
      if (!this.selectedMenu.defMenu) {
        this.setMenuIdx({ level: -1, menuIdx: -1, subIdx: -1 });
        this.deleteChatMenu(this.selectedMenu);
      }
    });
  }

  /**
   * 根据点击的类型不同显示不同的内容
   * @param item
   */
  handleTypeClick(item: any) {
    switch (this.contentType) {
      case "news":
        if (item.value === 1) {
          // 素材库
          this.dialogInfo.type = "news";
          this.dialogInfo.show = true;
          this.dialogInfo.title = "选择图文素材";
        } else if (item.value === 2) {
          // 自建图文
          this.$router.push("/marketing/tweets/source/create");
        }
        break;
      case "img":
        if (item.value === 1) {
          // 素材库
          this.dialogInfo.show = true;
          this.dialogInfo.type = "img";
          this.dialogInfo.title = "选择图片";
        }
        break;
      case "video":
        // 视频
        if (item.value === 1) {
          // 素材库
          this.dialogObj.show = true;
          this.dialogObj.title = "添加视频";
        } else if (item.value === 2) {
          // 自建视频
          this.dialogInfo.show = true;
          this.dialogInfo.title = "新建视频";
        }
        break;
    }
  }

  /**
   * 关闭弹框
   */
  private handleClose() {
    this.dialogInfo.show = false;
    this.dialogInfo.type = "";
  }

  /**
   * 选择图片和视频
   * @param info
   */
  choosedPicVideo(info: any) {
    this.selectedMenu.show = true;
    this.selectedMenu.dataInfo = info;
    this.handleClose();
  }

  /**
   * 上传图片
   * @param res
   */
  handleUploadPic(res: any) {
    this.selectedMenu.show = true;
    this.selectedMenu.dataInfo = res.data;
    this.selectedMenu.valid = true;
    this.uploading = false;
    this.$message.success("上传成功");
  }

  /**
   * 失败操作
   */
  handleError() {
    this.uploading = false;
    this.selectedMenu.valid = false;
    this.$message.error("上传失败");
  }
  handleProgress() {
    this.uploading = true;
  }
  remove() {
    this.selectedMenu.show = false;
  }

  /**
   * 检验
   */
  validateContent() {
    this.$nextTick(() => {
      let $menuRef: any = this.menuFormRef;
      return $menuRef.validate();
    });
  }

  @Watch("selectedMenu", { immediate: true, deep: true })
  "selectedMenu.type"() {
    this.contentType = this.selectedMenu.type || "news";
    if (this.clickArr.indexOf(this.selectedMenu.type) > -1) {
      this.mediaType = "click";
    } else {
      this.mediaType = "view";
    }
  }

  mounted() {
    this.uploadData = {
      organId: this.organId,
      mediaType: "image",
      name: "上传新的图片",
      videoIntroduction: "",
      videoTitle: ""
    };
  }
}
</script>
<style scoped lang="scss">
$content_h: 540px;
.w-detail-set {
  float: left;
  margin-left: 20px;
  min-height: $content_h;
  background: #f4f5f9;
  /*max-height: calc(100vh - 20px);*/
  .el-select,
  .el-input {
    width: 100%;
  }
  .red-text {
    color: $red-color;
  }
  .set-content {
    margin: 20px;
  }

  .menu-title {
    display: flex;
    justify-content: space-between;
    width: 100%;
    padding-left: 40px;
    height: 35px;
    line-height: 35px;
    border-bottom: 1px solid #f5f5f5;
    margin-bottom: 15px;
    .delete-menu {
      color: $primary-color;
      cursor: pointer;
    }
  }

  .source-card {
    width: 100%;
    background: #fff;
    margin-top: 20px;
    border: 1px solid #f5f5f5;
    &.error {
      border: 1px solid $red-color;
    }
    .card-head {
      display: flex;
      align-items: center;
      width: 100%;
      padding: 15px;
      background: #f6f8f9;

      .head-item {
        display: flex;
        align-items: center;
        margin-right: 20px;
        cursor: pointer;

        .head-icon {
          font-size: 20px;
          margin-right: 5px;
        }

        &.current {
          color: $wechat-color;
        }
      }
    }

    .card-content {
      display: flex;
      align-items: center;
      justify-content: center;
      width: 100%;
      min-height: 240px;

      .content-item {
        text-align: center;
        margin-right: 40px;
        cursor: pointer;

        .item-icon {
          font-size: 40px;
          color: #999999;
        }
      }
      .delete-text {
        cursor: pointer;
        color: $wechat-color;
      }
    }
    .jump-page {
      padding: 20px;
      .j-text {
        color: $primary-color;
        cursor: pointer;
      }
    }
  }
}
</style>
