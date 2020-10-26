<!--新增视频-->
<template>
  <div class="add-video-container">
    <common-form class="video-content-form" :props="props" :form="addVideoForm" :inline="false">
      <div slot="video">
        <el-upload
          action="/api/v1/wechat/materials/materialFileUpload"
          accept="video/mp4,video/quicktime"
          :on-success="handleSuccess"
          :on-error="handleError"
          :on-progress="handleProgress"
          :size="1024 * 20"
          :data="uploadData"
        >
          <el-button>点击上传</el-button>
          <span class="common_tip ml-15">支持格式：mov、mp4，单个文件不能超过20MB</span>
        </el-upload>
        <div class="video-content">
          <video
            class="video-player"
            preload="auto"
            controls="controls"
            poster="https://via.placeholder.com/220x200.png"
            src="http://203.205.158.80/vweixinp.tc.qq.com/1007_cefa100b77a44e78a003a5cf4774a35f.f10.mp4?vkey=F6D95D8FF38F1813845D2A874137BD64C9A9417FBCA0696D6BD44C02BE838BFD66607BF971E6ED5B6B9267EA71F33B19DE6381B34A843188AB04A8F97F48AA6E6F5C370ECB6F482826E7D8DAD154A3C4798CBB1A4B176920&sha=0&save=1"
          ></video>
          <div class="bottom-wrap common_flex-space-center">
            <span class="video-name">视频名称</span>
            <span class="del-text">删除</span>
          </div>
        </div>
      </div>
    </common-form>
  </div>
</template>

<script lang="ts">
import CommonForm from "@/components/common-form/index.vue";
import { Component, Vue, Prop } from "vue-property-decorator";
import { State } from "vuex-class";
interface AddVideoForm {
  name: string;
  video: string;
}
@Component({
  name: "queryTable",
  components: { CommonForm }
})
export default class extends Vue {
  @State(state => state.weChat.organId) private organId!: any;
  loading: boolean = false;
  addVideoForm: AddVideoForm = {
    name: "",
    video: ""
  };
  uploadData: any = {
    mediaType: "video",
    name: "sa",
    organId: this.organId,
    videoIntroduction: "312",
    videoTitle: "123"
  };
  readonly props: Array<{}> = [
    {
      tag: "input",
      label: "视频名称",
      prop: "name",
      placeholder: "请输入视频名称",
      maxLength: 30
    },
    {
      label: "上传视频",
      prop: "video"
    },
    {
      tag: "upload",
      type: "picture-card",
      prop: "thumb",
      accept: ".png,.jpg,.bmp",
      label: "封面",
      slot: (h: any) => {
        return h("i", { class: "el-icon-plus" }, null);
      },
      tip: "支持格式：jpg、png、bmp，单个文件不能超过3MB，建议尺寸600*300px，或等比图片"
    }
  ];
  handleSuccess() {
    this.loading = false;
    this.$message.success("上传成功");
  }
  handleError() {
    this.loading = false;
    this.$message.error("上传失败");
  }
  handleProgress() {
    this.loading = true;
  }
}
</script>

<style scoped lang="scss">
.add-video-container {
  .video-content-form {
    width: 70%;
    .video-content {
    }
    .video-content {
      margin-top: 20px;
      .video-player {
        width: 100%;
        height: 300px;
        object-fit: fill;
      }
      .bottom-wrap {
        padding: 0 10px;
        border: 1px solid $card-border;
      }
      .del-text {
        color: $primary-color;
        cursor: pointer;
      }
    }
  }
}
</style>
