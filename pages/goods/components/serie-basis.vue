<template>
  <div>
    <el-form @submit.native.prevent
             :model="serieForm"
             ref="serieFormRef"
             size="small"
             :rules="serieFormRule"
             label-width="100px"
             style="width:90%">
      <el-form-item prop="logo"
                    label="LOGO："
                    class="minw">
        <uploadToAli v-model="serieForm.logo"
                     accept='image/png,image/jpg,image/jpeg'
                     :size="1024 * 3" />
        <div class="gray_txt">支持格式：jpg、png、jpeg，单个文件不能超过3MB，建议尺寸300*220px（或相同比例）</div>
      </el-form-item>
      <el-form-item prop="name"
                    label="车系名称："
                    class="minw">
        <el-input v-model.trim="serieForm.name"
                  @keyup.native="readyCheck(1)"
                  maxlength="20">
          <template slot="suffix">
            {{serieForm.name.length}}/20
          </template>
        </el-input>
      </el-form-item>
      <el-form-item prop="externalCode"
                    label="车系代码："
                    class="minw">
        <el-input v-model.trim="serieForm.externalCode"
                  @keyup.native="readyCheck(2)"
                  maxlength="20">
          <template slot="suffix">
            {{serieForm.externalCode.length}}/20
          </template>
        </el-input>
      </el-form-item>
      <el-form-item label="车系介绍："
                    prop="introduction">
        <vueQuillEditor :disabled="disabled"
                        :content.sync="serieForm.introduction" />
      </el-form-item>

      <el-form-item class="tecenter">
        <el-button class="step_btn"
                   @click.stop="backWithoutSave">
          {{disabled?"返回":"取消"}}
        </el-button>
        <el-button class="step_btn"
                   type="primary"
                   :loading="repeatChecking"
                   @click="nextStep">下一步</el-button>
      </el-form-item>
    </el-form>
  </div>
</template>

<script lang='ts'>
import { Component, PropSync, Vue, Ref } from 'vue-property-decorator';
import { mixins } from "vue-class-component";
import SerieDetailMixin from "../mixin/serie-detail.mixin";
import uploadToAli from "@/components/upload-to-ali/src/index.ts";
import ImgPreview from "@femessage/img-preview";
import deepClone from "@/utils/deepClone";
import vueQuillEditor from "@/components/vue-quill-editor";
import {
  detailForMainFactory,
  detailForDealer,
  addSerie,
  modifySerie,
  isRepeatSeriesName,
  validateExternalCode
} from "@/api";
const brandCode = "geely";
const introductionValidatePass = (rule: any, value: string, callback: any) => {
  if (value.length > 6000) {
    callback(new Error('内容已超过最大限制，请简化内容或样式'));
  } else {
    callback();
  }
};

interface SerieFormRule {
  logo: element.FormRule[],
  name: element.FormRule[],
  externalCode: element.FormRule[],
  introduction: element.FormRule[],
}

@Component({
  inheritAttrs: false,
  components: {
    ImgPreview,
    uploadToAli,
    vueQuillEditor,
  },
})
export default class SerieBasis extends mixins(SerieDetailMixin) {
  @PropSync('serieForm', {
    type: Object, default: () => {
      return {}
    }
  }) _serieForm: any;
  @Ref() readonly serieFormRef: element.Refs;
  isRepeatCode: boolean = false;
  isRepeat: boolean = false;

  get serieFormRule(): SerieFormRule {
    const externalCodeValidator = (rule: any, value: any, callback: any) => {
      if (value && !/^[/a-zA-Z0-9-_]{0,20}$/.test(value)) {
        callback(new Error('只可输入数字、字母、-/_ 特殊字符'))
      } else if (this.isRepeatCode) {
        callback(new Error('车系代码重复'))
      } else {
        callback()
      }
    };
    const nameValidator = (rule: any, value: any, callback: any) => {
      if (this.isRepeat) {
        callback(new Error('车系名称重复'))
      } else {
        callback()
      }
    };
    return {
      logo: [{ required: true, message: '请设置车系logo', trigger: 'change' }],
      name: [
        { required: true, message: '请输入车系名称', trigger: ['change', 'blur'] },
        { validator: nameValidator, trigger: ['change', 'blur'] }
      ],
      externalCode: [
        { required: true, message: '请输入车系代码', trigger: ['change', 'blur'] },
        { validator: externalCodeValidator, trigger: ['change', 'blur'] }],
      introduction: [
        { required: true, message: '请输入车系介绍', trigger: 'change' },
        { validator: introductionValidatePass, trigger: ['change', 'blur'] }
      ]
    }
  };
  // 检查编辑
  serieFormOrigin: any = {
    logo: '',
    name: '',
    externalCode: '',
    introduction: '',
  };
  timerX: any = 0;
  repeatChecking: boolean = false;

  async nextStep() {
    let flag = false;
    this.serieFormRef.validate((v: boolean) => flag = v);
    if (!flag || this.repeatChecking) return;
    if (this.operationType === 'edit') {
      const res = await this.modifySerie();
      if (!res) return;
      this.showMsg('修改成功')
    }
    this._stepWalk = "1";
  };
  /**
   * @description 修改车系
   */
  async modifySerie() {
    try {
      const params = {
        brandCode,
        ...this._serieForm,
        code: this.$route.params.serieCode
      }
      const { data } = await modifySerie(params);
      this.serieFormOrigin = deepClone(this._serieForm)
      return data;
    } catch (e) {
      this.log(e)
      return false
    }
  }
  /**
   * @description 退出之前判断是否有修改
   */
  backWithoutSave(self = true) {
    let origin = JSON.stringify(this.serieFormOrigin);
    let current = JSON.stringify(this._serieForm);
    return this.notEdited(origin === current, self);
  };
  readyCheck(val: number) {
    clearTimeout(this.timerX)
    this.timerX = setTimeout(() => {
      val === 1 && this.isRepeatSeriesName();
      val === 2 && this.validateExternalCode();
    }, 100);
  }
  async validateExternalCode() {
    if (this._serieForm.externalCode === this.serieFormOrigin.externalCode) {
      this.isRepeatCode = false;
      return
    }
    try {
      this.repeatChecking = true;
      const params = {
        brandCode,
        externalCode: this._serieForm.externalCode
      }
      const { data } = await validateExternalCode(params)
      this.isRepeatCode = data;
      this.repeatChecking = false;
    } catch (e) {
      this.repeatChecking = false;
      this.log(e)
    }
  }
  async isRepeatSeriesName() {
    if (this._serieForm.name === this.serieFormOrigin.name) {
      this.isRepeat = false;
      return
    }
    try {
      this.repeatChecking = true;
      const params = {
        brandCode,
        seriesName: this._serieForm.name
      }
      const { data } = await isRepeatSeriesName(params)
      this.isRepeat = data;
      this.repeatChecking = false;
    } catch (e) {
      this.repeatChecking = false;
      this.log(e)
    }
  };
  async getBasisInfo() {
    if (this.$route.params.operation === 'add') return;
    try {
      const { sysPlat } = this.$route.query;
      const fn = sysPlat === 'factory' ? detailForMainFactory : detailForDealer;
      const seriesCode: any = this.$route.params.serieCode;
      const { data } = await fn({ seriesCode });
      const { logo, name, externalCode, introduction } = data;
      this._serieForm = {
        logo, name, externalCode, introduction
      }
      this.$nextTick(() => {
        this.serieFormOrigin = deepClone(this._serieForm)
      })
      // const 
    } catch (e) {
      this.log(e)
    }
  }
  created() {
    this.getBasisInfo()
  }
}
</script>
<style lang="scss" scoped>
.minw {
  /deep/ .el-input {
    width: 30%;
  }
}
.logo_pic {
  max-width: 100px;
}
/deep/ {
  .el-date-editor {
    width: 100%;
  }
  .el-input__inner {
    padding-right: 50px;
  }
}
</style>