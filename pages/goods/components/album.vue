<template>
  <div class="content">
    <slot name="header">
      <p style="margin-top:0">
        <el-button type="primary"
                   size="small"
                   :disabled="disabled"
                   @click="clickUploadRef">
          添加图片
        </el-button>
        <span class="gray_txt">支持格式：jpg、png、jpeg，单个文件不能超过3MB，建议尺寸300*220px（或相同比例），最多{{maxCount}}张图片</span>
      </p>
    </slot>

    <el-row :gutter="20">
      <uploadToAli v-model="originPicture"
                   ref="uploadRef"
                   style="display:none"
                   accept='image/png,image/jpg,image/jpeg'
                   :size="1024 * 3"
                   multiple
                   @loading="showUpLoad=true"
                   @loaded="loadedOrigin"
                   :disabled="disabled" />
      <el-col :span="colSpan"
              v-show="showUpLoad"
              class="img_box">
        <div class="upload-to-oss">
          <div class="upload-item"
               v-loading="true">
          </div>
        </div>
      </el-col>
      <p v-if="_picturesForSubmit.length===0 && disabled">暂无图片</p>
      <el-col :span="colSpan"
              class="img_box"
              v-for="(item, i) in _picturesForSubmit"
              :key="i">
        <div>
          <div class="upload-to-oss">
            <div class="upload-item">
              <i class="upload-del-icon"
                 v-if="!disabled"
                 @click="deleteUnit(item.url)" />
              <img :src="item.url"
                   @click="previewUrl=item.url">
            </div>
          </div>
          <!-- <el-input v-model="item.name"
                    :maxlength="20"
                    :disabled="disabled"
                    size="mini">
            <template slot="suffix">
              {{item.name.length}}/20
            </template>
          </el-input> -->
        </div>
      </el-col>
    </el-row>

    <slot name="footer">
      <div class="tecenter">
        <el-button class="step_btn"
                   size="small"
                   @click.stop="backWithoutSave">
          {{disabled?"返回":"取消"}}
        </el-button>
        <el-button class="step_btn"
                   size="small"
                   @click.stop="_stepWalk='1'">上一步</el-button>
        <el-button class="step_btn"
                   size="small"
                   type="primary"
                   @click="nextStep">下一步</el-button>
      </div>
    </slot>

    <img-preview v-model="previewUrl" />
  </div>
</template>

<script lang='ts'>
import { Component, PropSync, Ref } from 'vue-property-decorator';
import { mixins } from "vue-class-component";
import SerieDetailMixin from "../mixin/serie-detail.mixin";
import uploadToAli from "@/components/upload-to-ali/src/index.ts";
import { resourcesEdit, resourcesQuery } from '@/api';
import deepClone from "@/utils/deepClone";
import ImgPreview from "@femessage/img-preview";
const urlType = 'PICTURE';
const type = 'SERIES';

@Component({
  inheritAttrs: false,
  components: { uploadToAli, ImgPreview }
})
export default class GoodsAlbum extends mixins(SerieDetailMixin) {
  readonly colSpan: number = 6;
  private maxCount: number = 100;
  @Ref() readonly uploadRef: any;
  @PropSync('picturesForSubmit', {
    type: Array,
    default: () => []
  }) _picturesForSubmit: vehicleConfig.Media[];

  originPicture: string = "";
  picturesOrigin: any = {};
  previewUrl: string = "";
  showUpLoad: boolean = false;
  clickUploadRef() {
    if (this._picturesForSubmit.length >= this.maxCount) {
      return this.showMsg(`最多${this.maxCount}张图片`, "warning")
    }
    this.uploadRef.selectFiles();
  }
  async nextStep() {
    let flag = true
    if (!this.checkNameExist()) return;
    if (this.operationType === 'edit') {
      flag = await this.resourcesEdit();
    }
    if (flag) {
      this._stepWalk = "3";
    };
  }
  checkNameExist() {
    let list = this._picturesForSubmit;
    let t = true
    // if (list.length > 0) {
    //   t = list.every(e => e.name.length > 0);
    //   !t && this.showMsg('部分图片未命名，请检查', "warning")
    // }
    return t;
  }
  /**
   * @description 只有编辑状态才调用，修改并保存图片
   */
  async resourcesEdit() {
    let t = this.checkNameExist()
    if (!t) return;
    if (this.operationType !== 'edit') return;

    try {
      const params = {
        code: this.serieCode,
        type,
        urlType,
        urlList: [...this._picturesForSubmit]
      }
      const data = await resourcesEdit(params)
      if (data) {
        this.picturesOrigin = deepClone(this._picturesForSubmit);
        this.showMsg('修改成功')
      }
      return Promise.resolve(data)
    }
    catch (e) {
      this.log(e)
    }
  }
  get inputDisableList() {
    let t = this._picturesForSubmit;
    let res = {}
    t.forEach(e => {

    })
    return {}
  }
  async getResourcesQuery() {
    if (!this.serieCode) return;
    try {
      const params = {
        type,
        urlType,
        size: 999,
        code: this.serieCode,
      }
      const { data } = await resourcesQuery(params);
      let res: vehicleConfig.Media[] = []
      data.forEach((ele: any) => {
        res.push({
          name: ele.name,
          url: ele.url
        })
      });
      this._picturesForSubmit = res;
      this.$nextTick(() => {
        this.picturesOrigin = deepClone(this._picturesForSubmit);
      })
    } catch (e) {
      this.log(e)
    }
  };
  /**
   * @description 初始上传框上传完成
   */
  loadedOrigin(urls: string[]) {
    this.originPicture = "";
    this.showUpLoad = false;
    for (let i = 0; i < urls.length; i++) {
      let len = this._picturesForSubmit.length;
      if (len >= this.maxCount) break;
      let url = urls[i];
      url && this._picturesForSubmit.splice(0, 0, { url, name: '' });
    }
  }
  /**
   * @description 初始上传框上传完成
   */
  deleteUnit(url: string) {
    let index = this._picturesForSubmit.findIndex((e: vehicleConfig.Media) => e.url === url);
    this._picturesForSubmit.splice(index, 1);
  }
  /**
   * @description 退出之前判断是否有修改
   */
  backWithoutSave(self = true) {
    let origin = JSON.stringify(this.picturesOrigin)
    let current = JSON.stringify(this._picturesForSubmit)
    if (this.operationType === 'add') {
      return this.notEdited(false, self);
    } else {
      return this.notEdited(origin === current, self);
    }
  };
  created() {
    this.getResourcesQuery()
  }
}
</script>
<style lang="scss" scoped>
.img_box {
  margin-bottom: 10px;
  height: 164px;
}
.gray_txt {
  margin-left: 15px;
}
img {
  width: 100% !important;
  max-height: 156px;
  vertical-align: middle;
}
/deep/ {
  .upload-area {
    width: 100%;
  }
  .upload-to-oss,
  .upload-item,
  .upload-box {
    width: 100% !important;
    height: 160px !important;
    margin-bottom: 2px;
  }
  .el-input__suffix {
    line-height: 30px;
  }
}
</style>
