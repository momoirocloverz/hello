<!--分享设置-->
<template>
  <el-row :gutter="20">
    <el-col :span="16" class="set-form">
      <common-form
        ref="stepRef"
        :rules="rules"
        :props="constant.SHARE_PROPS"
        :form="shareForm"
        :inline="false"
      ></common-form>
    </el-col>
    <el-col :span="8" class="preview">
      <div class="phone-wrap">
        <img :src="form.tempPic" />
      </div>
    </el-col>
  </el-row>
</template>

<script lang="ts">
import { Component, Vue, Prop, Ref } from "vue-property-decorator";
import CommonForm from "@/components/common-form/index.vue";
import { State } from "vuex-class";
import * as CONST from "../const/common";
import { ShareForm } from "@/@types/activity";
@Component({
  name: "stepShareSet",
  components: {
    CommonForm
  }
})
export default class extends Vue {
  @Prop({ default: {} }) private form: any;
  @Ref() readonly stepRef: any;
  @State(state => state.activity.shareForm) private shareForm!: ShareForm;
  constant: any = CONST;
  rules: any = {
    title: { required: true, trigger: "blur", message: "请输入分享标题" },
    image: { required: true, trigger: "blur", message: "请选择分享图片" },
    content: { required: true, trigger: "blur", message: "请输入分享内容" }
  };
}
</script>

<style scoped lang="scss">
.preview {
  display: flex;
  align-items: center;
  justify-content: center;
  .phone-wrap {
    width: 375px;
    height: 500px;
    overflow: auto;
    img {
      width: 100%;
    }
  }
}
</style>
