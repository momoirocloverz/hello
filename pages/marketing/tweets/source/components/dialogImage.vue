<template>
  <div class="main-container">
    <!--dialog-->
    <el-dialog title="添加图片" :visible.sync="showDialog" :before-close="closeDialog" width="65%">
      <div class="dialog-content">
        <el-form @submit.native.prevent ref="form" :model="form" :rules="rule" label-width="120px">
          <el-form-item label="图片：" prop="imgUrl">
            <div class="video-upload-container">
              <upload-to-ali
                :multiple="false"
                :size="3096"
                :preview="true"
                :value="form.imgUrl"
                accept="image/png,image/jpeg,image/bmp"
                :max="1"
                :width="300"
                :height="200"
                @delete="delImage"
                @loaded="uploadSuccess"
              ></upload-to-ali>
              <p>支持格式：jpg、png、bmp，单个文件不能超过3MB，建议尺寸600*300px（或相同比例）</p>
            </div>
          </el-form-item>
          <el-form-item label="分组：" prop="groupId">
            <el-select v-model="form.groupId" placeholder="请选择">
              <el-option v-for="item in categories" :key="item.id" :label="item.name" :value="item.id"> </el-option>
            </el-select>
          </el-form-item>
        </el-form>
      </div>
      <div slot="footer" class="dialog-footer">
        <el-button @click="closeDialog">取 消</el-button>
        <el-button type="primary" :loading="loading" @click="submit">确 定</el-button>
      </div>
    </el-dialog>
  </div>
</template>

<script lang="ts">
import { Component, Watch, Prop, Vue } from "vue-property-decorator";
import _ from "lodash";
import UploadToAli from "@/components/upload-to-ali/src/index.ts";
import api from "@/api/restful";
import axios from "@/api/axios";

let vm: any;

interface Image {
  imgUrl: string;
  title: string;
  groupId: number | null;
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
    imgUrl: "",
    title: "",
    groupId: null
  };
  private loading: boolean = false;
  private progress: number = 0;
  private rule: any = {
    imgUrl: [{ required: true, message: "请上传图片", trigger: blur }],
    groupId: [{ required: true, message: "请选择分组", trigger: blur }]
    // title: [{ required: true, message: "请输入名称", trigger: blur }]
  };
  uploadSuccess(data: string) {
    this.form.imgUrl = data;
  }
  delImage() {
    this.form.imgUrl = "";
  }
  closeDialog() {
    this.$emit("close", true);
  }
  submit() {
    this.closeAndRefresh();
    // TODO 去抖动
    // _.debounce(() => {
    // }, 30, { 'maxWait': 500 });
  }
  closeAndRefresh() {
    (<any>this.$refs["form"]).validate((valid: boolean, params: any) => {
      if (valid) {
        this.createOne();
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
    let res = await api.post({ url: "METERIAL_IMAGES", isAdminApi: true, ...this.form });
    if (res) {
      this.$message({ type: "success", message: "新建成功" });
    }
    this.closeDialog();
    this.loading = false;
    this.$emit("refresh", true);
  }
  @Watch("showDialog")
  onShowDialog(newVal: boolean, oldVal: boolean) {
    if (newVal !== oldVal && newVal) {
      this.form = {
        imgUrl: "",
        id: null,
        title: ""
      };
    }
  }
}
</script>
