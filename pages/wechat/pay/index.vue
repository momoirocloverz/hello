<template>
  <div>
    <breadcrumb-group :breadGroup="[{ label: '公众号', to: '' }, { label: '微信支付设置', to: '' }]" />

    <el-card>
      <p>使用须知:</p>
      <p>
        微信支付支持已认证的服务号，公众号接入支付后，可以完成在公众号【在线商城】微信内的收款需求，以及退款售后退款需求
        <a href="https://pay.weixin.qq.com/index.php/core/home/login?return_url=%2F" target="_blank" class="link"
          >前往立即开通</a
        >
      </p>
      <p>
        若您还未开通微信支付功能，以及绑定过程需要帮助，可查看<a
          href="/微信支付帮助文档.pdf"
          target="_blank"
          class="link"
          >【微信支付帮助文档】</a
        >
      </p>
    </el-card>
    <el-card style="margin-top:20px;">
      <p class="warning-text">已开通微信支付请填写以下信息，请仔细填写</p>
      <el-form @submit.native.prevent ref="form" :model="form" :rules="rule" label-width="160px">
        <el-row :gutter="15">
          <el-col :span="18">
            <el-form-item label="设置安全域名：" prop="name">
              请前往【微信公众平台】 微信支付-公众号支付-支付授权目录，添加安全域名“{{ domain }}”
              <el-button
                type="primary"
                size="small"
                v-clipboard:copy="domain"
                v-clipboard:success="onCopy"
                v-clipboard:error="onError"
                >复制域名</el-button
              >
              <el-button type="default" size="small" @click="toHost">立即前往</el-button>
            </el-form-item>
            <el-form-item label="营业执照名称：" prop="licensedName">
              <el-input
                v-model="form.licensedName"
                :disabled="!canEdit"
                maxlength="100"
                placeholder="请输入营业执照名称"
              ></el-input>
            </el-form-item>
            <el-form-item label="商户号：" prop="wxMchId">
              <el-input
                v-model="form.wxMchId"
                :disabled="!canEdit"
                maxlength="20"
                placeholder="请输入微信商户号"
              ></el-input>
            </el-form-item>
            <el-form-item label="商户密钥：" prop="wxMchKey">
              <el-input
                v-model="form.wxMchKey"
                :disabled="!canEdit"
                maxlength="32"
                placeholder="请输入商户密钥"
              ></el-input>
            </el-form-item>
            <el-form-item label="p12证书：" prop="wxKeyContent">
              <el-upload
                action=""
                ref="upload"
                :auto-upload="false"
                :on-change="onChange"
                :http-request="httpRequest"
                :disabled="!canEdit"
                :before-upload="beforeAvatarUpload"
              >
                <el-button size="small" type="default" :disabled="!canEdit">点击上传</el-button>
                <span v-if="form.wxKeyContent" style="margin-left:8px;">已上传</span>
              </el-upload>
            </el-form-item>
            <el-form-item label="" prop="submit">
              <el-button type="primary" @click="edit(true)" v-if="!canEdit">编辑</el-button>
              <el-button type="default" @click="edit(false)" v-if="canEdit">取消</el-button>
              <el-button type="primary" @click="submit('form')" v-if="canEdit">提交</el-button>
            </el-form-item>
          </el-col>
        </el-row>
      </el-form>
    </el-card>
  </div>
</template>

<script lang="ts">
import api from "@/api/restful";
import urls from "@/api/urls";
import { Component, Vue } from "vue-property-decorator";
import { storeInfoSetting } from "@/utils/userSetting";
import VueClipboard from "vue-clipboard2";
Vue.use(VueClipboard);

let tempData: any = {};

@Component
export default class Coupon extends Vue {
  private form: any = {
    wxKeyContent: "",
    wxMchId: "",
    wxMchKey: "",
    licensedName: ""
  };
  private domain: string = process.env.VUE_APP_HOST.replace(/'/g, "");
  private canEdit: boolean = false;
  private rule: any = {
    licensedName: [{ required: true, trigger: "blur", message: "请输入营业执照名称" }],
    wxKeyContent: [{ required: true, trigger: "change", validator: this.validator }],
    wxMchId: [{ required: true, trigger: "blur", message: "请输入商户号" }],
    wxMchKey: [{ required: true, trigger: "blur", message: "请输入商户密钥" }]
  };
  onCopy() {
    this.$message("复制成功");
  }
  onError(err: any) {
    console.log(err);
    // this.$toast('复制失败')
  }
  toHost() {
    window.open("https://pay.weixin.qq.com");
  }
  validator(value: any, rule: any, callback: Function) {
    if ((<any>this.$refs).upload.uploadFiles.length === 0) {
      return callback(new Error("请上传p12证书"));
    } else {
      return callback();
    }
  }
  onChange(file: any, fileList: any) {
    if (fileList.length > 1) {
      fileList.shift();
    }
    (<any>this.$refs["form"]).validate();
  }
  beforeAvatarUpload(file: any) {
    let isP12: boolean = false;
    const limit: boolean = file.size / 1024 < 50;
    if (file.type === "application/x-pkcs12") {
      isP12 = true;
    }

    if (!isP12) {
      this.$message.error("文件只能是 P12 格式!");
      (<any>this.$refs).upload.clearFiles();
    } else if (!limit) {
      this.$message.error("文件大小不能超过 50KB!");
      (<any>this.$refs).upload.clearFiles();
    }
    return isP12 && limit;
  }
  async httpRequest(e: any) {
    try {
      let param = new FormData();
      param.append("file", e.file);
      let res = await api.upload(
        {
          url: `${urls.WECHAT_APY}?licensedName=${this.form.licensedName}&wxMchId=${this.form.wxMchId}&wxMchKey=${this.form.wxMchKey}`,
          data: param
        },
        { headers: { "Content-Type": "multipart/form-data" } }
      );
      if (res.code === "000000") {
        this.$message({ type: "success", message: "修改成功" });
        this.getList();
        this.canEdit = false;
      }
    } catch (err) {
      console.log(err);
    }
  }
  private async getList() {
    try {
      let res = await api.get({ url: "WECHAT_APY" });
      tempData = res.data;
      Object.assign(this.form, res.data);
    } catch (err) {
      throw new Error(err);
    }
  }
  private async submit(form: string) {
    (<any>this.$refs[form]).validate(async (valid: boolean, params: any) => {
      if (valid) {
        try {
          (<any>this.$refs).upload.submit();
        } catch (err) {
          console.log(err);
        }
      } else {
        // let message = params[Object.keys(params)[0]][0].message;
        // this.$message({ type: "error", message: message });
        return false;
      }
    });
  }
  edit(val: boolean) {
    if (val) {
      this.canEdit = true;
      this.form.wxKeyContent = "";
    } else {
      (<any>this.$refs["form"]).resetFields();
      this.canEdit = false;
      Object.assign(this.form, tempData);
    }
    (<any>this.$refs).upload.clearFiles();
  }
  async created() {
    this.getList();
  }
}
</script>

<style lang="scss" scoped>
.link {
  color: $primary-color;
  text-decoration: none;
}
.warning-text {
  color: #fd9807;
}
</style>
