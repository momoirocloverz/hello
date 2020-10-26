<template>
  <div class="main-container">
    <!--dialog-->
    <el-dialog title="添加视频"
               :visible.sync="showDialog"
               :before-close="closeDialog"
               width="65%">
      <div class="dialog-content">
        <el-form @submit.native.prevent
                 ref="form"
                 :model="form"
                 :rules="rule"
                 label-width="120px">
          <el-form-item label="视频名称："
                        prop="title">
            <el-input type="input"
                      maxlength="30"
                      size="small"
                      v-model.number="form.title"
                      style="width:50%;margin-right:10px;"
                      placeholder="请输入视频名称"></el-input>
            <span>{{form.title.length}}/30</span>
          </el-form-item>
          <el-form-item label="上传视频："
                        prop="videoUrl">
            <upload-to-ali :multiple="false"
                           :size="10240"
                           :preview="false"
                           :isImg="false"
                           :uploadOptions="uploadOptions"
                           accept="video/mp4,video/quicktime"
                           @loaded="uploadSuccess">
              <slot>
                <el-button type="default"
                           size="small">点击上传</el-button>
              </slot>
              <slot name="placeholder">
                <span style="margin-left:10px;">支持格式：mov、mp4，单个文件不能超过10MB</span>
              </slot>
            </upload-to-ali>
            <div class="video-box"
                 v-if="form.videoUrl">
              <el-progress :percentage="progress"
                           v-if="progress && progress !== 100"></el-progress>
              <video controls
                     width="500"
                     height="320"
                     ref="video">
                <source :src="form.videoUrl"
                        type="video/mp4">
                <p>Your browser doesn't support HTML5 video. Here is
                  a <a :href="form.videoUrl">link to the video</a> instead.</p>
              </video>
            </div>
          </el-form-item>
          <el-form-item label="封面："
                        prop="coverUrl">
            <div class="video-upload-container">
              <upload-to-ali :multiple="false"
                             :size="3096"
                             :preview="true"
                             :value="form.coverUrl"
                             accept="image/png,image/jpeg,image/bmp"
                             :max="1"
                             :width="500"
                             :height="320"
                             @delete="delImage"
                             @loaded="uploadImgSuccess"></upload-to-ali>
              <p>支持格式：jpg、png、bmp，单个文件不能超过3MB，建议尺寸600*300px（或相同比例）</p>
            </div>
          </el-form-item>
          <el-form-item label="分组："
                        prop="groupId">
            <el-select v-model="form.groupId"
                       placeholder="请选择">
              <el-option v-for="item in categories"
                         :key="item.id"
                         :label="item.name"
                         :value="item.id">
              </el-option>
            </el-select>
          </el-form-item>
        </el-form>
      </div>
      <div slot="footer"
           class="dialog-footer">
        <el-button @click="closeDialog">取 消</el-button>
        <el-button type="primary"
                   :loading="loading"
                   @click="closeAndRefresh('form')">确 定</el-button>
      </div>
    </el-dialog>
  </div>
</template>

<script lang="ts">
import { Component, Watch, Prop, Vue } from "vue-property-decorator";
import UploadToAli from "@/components/upload-to-ali/src/index.ts";
import api from "@/api/restful";
import axios from "@/api/axios";

let vm: any;

interface Video {
  coverUrl: string;
  duration: number;
  groupId: number | null;
  title: string;
  videoUrl: string;
}

@Component({
  components: {
    UploadToAli
  }
})
export default class dialogReview extends Vue {
  @Prop({ default: true }) readonly showDialog: boolean;
  @Prop({ default: {} }) readonly info: any;
  @Prop({ default: false }) readonly editMode: boolean;
  @Prop({ default: [] }) readonly categories: [];
  private form: any = {
    coverUrl: "",
    duration: 0,
    groupId: null,
    title: "",
    videoUrl: ""
  };
  private loading: boolean = false;
  private progress: number = 0;
  private rule: any = {
    videoUrl: [{ required: true, message: "请上传视频", trigger: blur }],
    title: [{ required: true, message: "请输入名称", trigger: blur }],
    groupId: [{ required: true, message: "请选择分组", trigger: blur }],
    coverUrl: [{ required: true, message: "请上传封面图", trigger: blur }]
  };
  private uploadOptions: any = {
    progress(percentage: number) {
      let fileloadingNum = Math.ceil(percentage * 100);
      vm.progress = fileloadingNum;
    }
  };
  uploadSuccess(data: string) {
    this.$set(this.form, "videoUrl", data);
    setTimeout(() => {
      (<any>this.$refs.video).src = data;
    }, 300);
    // 加延时获取视频信息
    setTimeout((): void => {
      this.form.duration = Math.ceil((<any>this.$refs.video).duration) * 1000;
    }, 800);
  }
  uploadImgSuccess(data: string) {
    this.form.coverUrl = data;
  }
  delImage() {
    this.form.coverUrl = "";
  }
  closeDialog() {
    this.$emit("close", true);
  }
  closeAndRefresh(form: string) {
    (<any>this.$refs[form]).validate((valid: boolean, params: any) => {
      if (valid) {
        if (this.editMode) {
          this.updateOne();
        } else {
          this.createOne();
        }
      } else {
        let message = params[Object.keys(params)[0]][0].message;
        this.$message({ type: "error", message: message });
        return false;
      }
    });
  }
  async createOne() {
    if (this.loading) {
      return;
    }
    this.loading = true;
    let res = await api.post({ url: "VIDEOS", isAdminApi: true, ...this.form });
    if (res) {
      this.$message({ type: "success", message: "新建成功" });
    }
    this.closeDialog();
    this.loading = false;
    this.$emit("refresh", true);
  }
  async updateOne() {
    let res = await api.put({ url: "VIDEOS", isAdminApi: true, ...this.form });
    if (res) {
      this.$message({ type: "success", message: "编辑成功" });
    }
    this.closeDialog();
    this.$emit("refresh", true);
  }
  created() {
    vm = this;
  }
  @Watch("showDialog")
  onShowDialog(newVal: boolean, oldVal: boolean) {
    if (newVal !== oldVal && newVal) {
      if (this.editMode) {
        this.info.videoUrl = this.info.url;
        this.form = Object.assign({}, this.info);
        delete this.form.url;
      }
    } else {
      this.form = {
        coverUrl: "",
        duration: 0,
        groupId: null,
        title: "",
        videoUrl: ""
      };
    }
  }
}
</script>


<style lang="scss">
.video-box {
  width: 80%;
  margin-top: 10px;
  display: block;
  video {
    background: #f7f7f7;
    margin-top: 10px;
  }
}
</style>
