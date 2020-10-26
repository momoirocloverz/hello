<!--活动模板-->
<template>
  <el-container class="m">
    <el-container class="layout">
      <el-aside class="assembly">
        <div class="topBar">
          <p class="title">组件</p>
          <p class="sm"
             @click="reset"><i class="el-icon-refresh"></i> 重置</p>
        </div>
        <!-- 组件 -->
        <assemblys :assembly="tmplCfg"
                   :type='tmplType' />
      </el-aside>
      <el-container>
        <el-main>
          <mobile-kit class="mobileKit"
                      :scale="scale"
                      :tmplCfg="tmplCfg"
                      :type='tmplType'></mobile-kit>
          <action-bar @kitScaleUp="kitScaleUp"
                      @kitScaleDown="kitScaleDown"
                      @kitScaleInit="kitScaleInit"></action-bar>
        </el-main>
      </el-container>
      <el-aside class="setting">
        <!-- top -->
        <div class="topBar">
          <p class="title">模板设置</p>
          <div class="btnGroup">
            <el-button @click="closeEditor"
                       size="mini">退出</el-button>
            <el-button type="primary"
                       @click="saveTMPL"
                       size="mini">保存</el-button>
          </div>
        </div>
        <!-- form -->
        <el-form ref="form"
                 :model="form"
                 size="mini"
                 label-width="80px"
                 class="form">
          <el-form-item label="模板名称"
                        :required="true">
            <el-input v-model="form.name"
                      maxlength="20"
                      show-word-limit></el-input>
          </el-form-item>
          <el-form-item label="获奖轮播">
            <el-switch v-model="form.prizeCarousel"
                       @change="isPrizeScroll"></el-switch>
          </el-form-item>
          <el-form-item label="中奖人数"
                        v-if="tmplType !== 'LUCKY_WHEEL'">
            <el-switch v-model="form.prizePerson"
                       @change="isPartakes"></el-switch>
          </el-form-item>
          <el-form-item label="活动介绍">
            <upload-to-ali class="up-img"
                           v-model="form.desc"
                           :size="1024 * 3"
                           :multiple="true"
                           :max="10"
                           ref="upLoad"></upload-to-ali>
            <p class="descTxt">支持格式：jpg、png、bmp，单个文件不能超过3MB</p>
          </el-form-item>
          <el-form-item label="模板封面">
            <upload-to-ali class="up-img"
                           v-model="form.fm"
                           :size="1024 * 3"
                           ref="upLoad"></upload-to-ali>
            <p class="descTxt">支持格式：jpg、png、bmp，单个文件不能超过3MB</p>
          </el-form-item>
        </el-form>
      </el-aside>
    </el-container>
  </el-container>
</template>

<script lang="ts">
import { Component, Vue } from "vue-property-decorator";
import UploadToAli from "@/components/upload-to-ali/src/index.ts";
import mobileKit from "./components/mobileKit.vue";
import actionBar from "./components/actionBar.vue";
import assemblys from "./components/assemblys.vue";
import { Message, MessageBox, Loading } from "element-ui";
import { GRIDSOFNINE, SCRATCHTICKETS, LUCKYWHEEL } from "./const/tmpl";
import preview from "../site/components/previewDialog.vue";
import api from "@/api/restful";
import urls from "@/api/urls";

@Component({
  name: "templateIndex",
  components: {
    mobileKit,
    actionBar,
    assemblys,
    UploadToAli
  }
})
export default class extends Vue {
  private options: any[] = ["LUCKY_WHEEL", "NINE_BLOCK_BOX", "SCRATCH_TICKETS"];
  private sysPlat: string = "agent";
  private id: String = "";
  tmplType: String = "";
  isOpen: boolean = true;
  scale: number = 0.4;
  loading: boolean = false;
  form: any = {
    name: "",
    prizeCarousel: false,
    prizePerson: false,
    desc: "",
    fm: ""
  };
  tmplCfg: any = {};
  created() {
    this.sysPlat = (<any>this.$route.query).sysPlat || "agent";
    this.tmplType = (<any>this.$route.query).type;
    this.id = (<any>this.$route.query).id;
    let tmpl: any = "";
    if (this.id === null || this.id === undefined) {
      switch (this.tmplType) {
        case "NINE_BLOCK_BOX":
          tmpl = this.deepClone(GRIDSOFNINE);
          break;
        case "SCRATCH_TICKETS":
          tmpl = this.deepClone(SCRATCHTICKETS);
          break;
        case "LUCKY_WHEEL":
          tmpl = this.deepClone(LUCKYWHEEL);
          break;
        default:
          break;
      }
      this.form.fm = "";
    } else {
      tmpl = Object.assign({}, JSON.parse(<any>localStorage.getItem("c_temp_meta")));
      if (localStorage.getItem("c_temp_meta_fm") !== null && localStorage.getItem("c_temp_meta_fm") !== "null") {
        this.form.fm = localStorage.getItem("c_temp_meta_fm");
      }
    }
    this.tmplCfg = tmpl;
    this.form.name = this.tmplCfg.activityName;
    this.form.desc = this.tmplCfg.activityIntroduce;
    this.form.prizeCarousel = this.tmplCfg.prizeScroll.isShow;
    this.form.prizePerson = this.tmplCfg.partakes.isShow;
  }
  private kitScaleUp() {
    // 放大模板
    if (this.scale === 0.55) {
      Message({
        message: "已经缩放到最大值",
        type: "warning"
      });
    } else {
      this.scale = this.scale + 0.05;
    }
  }
  private kitScaleDown() {
    // 缩小模板
    if (this.scale === 0.4) {
      Message({
        message: "已经缩放到最小值",
        type: "warning"
      });
    } else {
      this.scale = this.scale - 0.05;
    }
  }
  private kitScaleInit() {
    // 初始模板大小
    this.scale = 0.4;
  }
  async saveTMPL() {
    let saveLoading = Loading.service({
      fullscreen: true,
      text: "模板保存中，请勿关闭网页...",
      spinner: "el-icon-loading"
    });
    if (this.form.name !== "") {
      try {
        this.tmplCfg.activityName = this.form.name;
        this.tmplCfg.activityIntroduce = this.form.desc;
        console.log(JSON.stringify(this.tmplCfg, null, 2));
        let fm = this.form.fm;
        if (this.id === null || this.id === undefined) {
          let params = {};
          let type = 0;
          this.options.filter((item, index, self) => {
            if (item === this.tmplType) {
              type = index;
            }
            return true;
          });
          if (fm.length > 2) {
            params = {
              url: "ACTIVITY_TEMPLATES",
              isAdminApi: true,
              meta: JSON.stringify(this.tmplCfg),
              name: this.tmplCfg.activityName,
              showCarousel: this.tmplCfg.prizeScroll.isShow,
              showWinnerCount: this.tmplCfg.partakes.isShow,
              thumbnail: this.form.fm,
              toolType: type.toString()
            };
          } else {
            params = {
              url: "ACTIVITY_TEMPLATES",
              isAdminApi: true,
              meta: JSON.stringify(this.tmplCfg),
              name: this.tmplCfg.activityName,
              showCarousel: this.tmplCfg.prizeScroll.isShow,
              showWinnerCount: this.tmplCfg.partakes.isShow,
              toolType: type.toString()
            };
          }

          await api.post(params);
          Message({
            type: "success",
            message: "模板已保存"
          });
          saveLoading.close();
        } else {
          let params = {};
          if (fm.length > 2) {
            params = {
              url: "ACTIVITY_TEMPLATES_EDIT",
              isAdminApi: true,
              meta: JSON.stringify(this.tmplCfg),
              name: this.tmplCfg.activityName,
              showCarousel: this.tmplCfg.prizeScroll.isShow,
              showWinnerCount: this.tmplCfg.partakes.isShow,
              thumbnail: this.form.fm,
              id: this.id
            };
          } else {
            params = {
              url: "ACTIVITY_TEMPLATES_EDIT",
              isAdminApi: true,
              meta: JSON.stringify(this.tmplCfg),
              name: this.tmplCfg.activityName,
              showCarousel: this.tmplCfg.prizeScroll.isShow,
              showWinnerCount: this.tmplCfg.partakes.isShow,
              id: this.id
            };
          }
          await api.put(params);
          Message({
            type: "success",
            message: "模板已保存"
          });
          saveLoading.close();
        }
        this.$router.push({
          path: `/marketing/activity/template/index`
        });
      } catch (err) {
        saveLoading.close();
        console.log(err);
      }
    } else {
      saveLoading.close();
      Message({
        type: "error",
        message: "请填写模板名称"
      });
    }
  }
  private closeEditor() {
    // 退出编辑器
    MessageBox.alert("编辑信息未保存，确定要离开？", "确认信息", {
      confirmButtonText: "继续退出",
      callback: action => {
        if (action !== "cancel") {
          this.$router.push({
            path: `/marketing/activity/template/index`
          });
        }
      }
    });
  }
  private reset() {
    MessageBox.confirm("模板将会重置为最初始状态，是否重置模板？", "确认信息", {
      distinguishCancelAndClose: true,
      confirmButtonText: "确认重置",
      cancelButtonText: "暂不重置，继续编辑"
    }).then(() => {
      let saveLoading = Loading.service({
        fullscreen: true,
        text: "模板重置中，请勿关闭网页...",
        spinner: "el-icon-loading"
      });
      setTimeout(() => {
        saveLoading.close();
        let tmpl = {};
        switch (this.tmplType) {
          case "NINE_BLOCK_BOX":
            tmpl = this.deepClone(GRIDSOFNINE);
            break;
          case "SCRATCH_TICKETS":
            tmpl = this.deepClone(SCRATCHTICKETS);
            break;
          case "LUCKY_WHEEL":
            tmpl = this.deepClone(LUCKYWHEEL);
            break;
          default:
            break;
        }
        this.tmplCfg = tmpl;
        console.log(this.tmplCfg);
        Message({
          type: "success",
          message: "模板重置成功"
        });
      }, 1000);
    });
  }
  private isPrizeScroll(val: any) {
    this.tmplCfg.prizeScroll.isShow = val;
  }
  private isPartakes(val: any) {
    this.tmplCfg.partakes.isShow = val;
  }
  deepClone(obj: any) {
    let objClone: any = Array.isArray(obj) ? [] : {};
    if (obj && typeof obj === "object") {
      for (let key in obj) {
        if (obj.hasOwnProperty(key)) {
          // 判断ojb子元素是否为对象，如果是，递归复制
          if (obj[key] && typeof obj[key] === "object") {
            objClone[key] = this.deepClone(obj[key]);
          } else {
            // 如果不是，简单复制
            objClone[key] = obj[key];
          }
        }
      }
    }
    return objClone;
  }
}
</script>

<style lang="scss" scoped>
p {
  margin: 0;
  padding: 0;
}
.el-container {
  &.layout {
    display: flex;

    .el-container {
      flex: 1;

      .el-main {
        // background-image: url('../assets/image/bg.jpg');
        color: #333;
        min-width: 500px;
        height: 100vh;
        text-align: center;
        overflow: hidden;
        display: flex;
        justify-content: center;
        align-items: center;
        position: relative;

        .mobileKit {
          transition: all 0.3s;
        }
      }
    }

    .el-aside {
      width: 200px !important;
      height: 100vh;
      background-color: #fff;
      color: #333;

      .logo {
        height: 60px;
        line-height: 60px;
        font-size: 20px;
        letter-spacing: 1px;
        color: #708fd4;
        text-shadow: 0 0 10px #708fd4;
      }

      &.setting {
        min-width: 350px !important;

        .topBar {
          background: #f7f7f7;
          border-bottom: 1px solid #ebebeb;
          display: flex;
          align-items: center;
          justify-content: space-between;
          padding: 15px 20px;
        }
      }

      &.assembly {
        min-width: 400px !important;

        .topBar {
          background: #f7f7f7;
          border-bottom: 1px solid #ebebeb;
          display: flex;
          align-items: center;
          justify-content: space-between;
          padding: 15px 20px;

          .title {
            span {
              color: #409eff;
            }
          }

          .sm {
            font-size: 12px;
            color: #409eff;
            cursor: pointer;
          }
        }
      }
    }
  }

  &.m {
    display: flex;
    flex-direction: column;
    min-width: 1250px;
    overflow: hidden;

    .el-header {
      background-color: #fff;
      line-height: 60px;
      border-bottom: 1px solid #ebebeb;
      position: relative;
    }
  }
}

.form {
  display: block;
  padding: 0 20px;
  margin-top: 20px;

  .link {
    margin-left: 20px;
    font-size: 12px;
  }
  .descTxt {
    font-size: 12px;
    color: #999;
    line-height: 16px;
  }
}

/deep/ {
  .upload-to-oss .upload-img {
    object-fit: scale-down;
  }
  .el-message .el-icon-warning {
    font-size: 20px;
  }

  .el-dropdown-link {
    cursor: pointer;
  }
}
</style>
