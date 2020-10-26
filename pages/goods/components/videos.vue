<template>
  <div class="content">
    <slot name="header">
      <p style="margin-top:0">
        <el-button type="primary"
                   size="small"
                   :disabled="disabled"
                   @click="clickUploadRef">
          添加视频
        </el-button>
        <span class="gray_txt">支持格式：mov、mp4，单个文件不能超过 20MB，最多{{maxCount}}段视频</span>
      </p>
    </slot>

    <el-row :gutter="20">
      <uploadToAli v-model="originVideo"
                   ref="uploadRef"
                   style="display:none"
                   accept="video/mp4,video/quicktime"
                   :size="1024 * 20"
                   @loading="showUpLoad=true"
                   @loaded="loadedOrigin"
                   multiple
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
      <p v-if="_videoesForSubmit.length===0 && disabled">暂无视频</p>
      <el-col :span="colSpan"
              class="img_box"
              v-for="item in _videoesForSubmit"
              :key="item.url">
        <div>
          <div class="upload-to-oss">
            <div class="upload-item">
              <i class="upload-del-icon"
                 v-if="!disabled"
                 @click="deleteUnit(item.url)" />
              <video :poster="`${item.url}?x-oss-process=video/snapshot,t_0,f_jpg,w_${itemWidth},h_156,m_fast`"
                     controls>
                <source :src="item.url" />
              </video>
            </div>
          </div>
          <el-input v-model="item.name"
                    :maxlength="20"
                    :disabled="disabled"
                    placeholder="请输入视频名称"
                    size="mini">
            <template slot="suffix">
              {{item.name.length}}/20
            </template>
          </el-input>
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
                   @click.stop="_stepWalk='2'">上一步</el-button>
        <el-button class="step_btn"
                   type="primary"
                   size="small"
                   :loading="optionLoading"
                   v-if="!disabled"
                   @click="onlySave">保存</el-button>
        <!-- <el-button class="step_btn"
                   type="primary"
                   size="small"
                   :loading="optionLoading"
                   v-if="operationType==='add'"
                   @click="publish">发布</el-button> -->
      </div>
    </slot>
  </div>
</template>

<script lang='ts'>
import { Component, PropSync, Ref } from 'vue-property-decorator';
import { mixins } from "vue-class-component";
import SerieDetailMixin from "../mixin/serie-detail.mixin";
import uploadToAli from "@/components/upload-to-ali/src/index.ts";
import { resourcesEdit, resourcesQuery } from '@/api';
import deepClone from "@/utils/deepClone";
const urlType = 'VIDEO';
const type = 'SERIES';

@Component({
  inheritAttrs: false,
  components: { uploadToAli }
})
export default class GoodsVideos extends mixins(SerieDetailMixin) {
  readonly colSpan: number = 6;
  private maxCount: number = 10;
  @Ref() readonly uploadRef: any;
  clickUploadRef() {
    if (this._videoesForSubmit.length >= this.maxCount) {
      return this.showMsg(`最多${this.maxCount}段视频`, "warning")
    }
    this.uploadRef.selectFiles();
  }
  videoesOrigin: any = {};
  get itemWidth() {
    let dom: any = document.querySelector('.upload-item')
    return (dom.offsetWidth || 220)
  }
  @PropSync('videoesForSubmit', {
    type: Array,
    default: () => []
  }) _videoesForSubmit: vehicleConfig.Media[];
  originVideo: string = "";
  showUpLoad: boolean = false;
  optionLoading: boolean = false;
  async onlySave() {
    if (this.optionLoading) return;
    let flag = true
    this.optionLoading = true
    if (!this.checkNameExist()) {
      this.optionLoading = false;
      return
    };
    if (this.operationType === 'edit') {
      flag = await this.resourcesEdit();
    }
    this.optionLoading = false
    this.$emit('onlySave', flag)
  };
  async publish() {
    if (this.optionLoading) return;
    let flag = true
    this.optionLoading = true
    if (!this.checkNameExist()) {
      this.optionLoading = false;
      return
    };
    if (this.operationType === 'edit') {
      flag = await this.resourcesEdit();
    }
    this.optionLoading = false
    this.$emit('publish', flag)
  }
  checkNameExist() {
    let list = this._videoesForSubmit;
    let t = true
    if (list.length > 0) {
      t = list.every(e => e.name.length > 0);
      !t && this.showMsg('部分视频未命名，请检查', "warning")
    }
    return t;
  }
  /**
   * @description 只有编辑状态才调用，修改并保存视频
   */
  async resourcesEdit() {
    if (!this.checkNameExist()) return;
    if (this.operationType !== 'edit') return;
    try {
      const params = {
        code: this.serieCode,
        type,
        urlType,
        urlList: [...this._videoesForSubmit]
      }
      const data = await resourcesEdit(params)
      if (data) {
        this.showMsg('修改成功');
        this.videoesOrigin = deepClone(this._videoesForSubmit);
        this.$router.replace({
          name: "goods-list-factory"
        })
      }
      return Promise.resolve(data)
    }
    catch (e) {
      this.log(e)
    }
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
      let res: vehicleConfig.Media[] = [];
      data.forEach((ele: any) => {
        res.push({
          name: ele.name,
          url: ele.url
        })
      });
      this._videoesForSubmit = res;
      this.$nextTick(() => {
        this.videoesOrigin = deepClone(this._videoesForSubmit);
      })
    } catch (e) {
      this.log(e)
    }
  };
  /**
   * @description 初始上传框上传完成
   */
  loadedOrigin(urls: string[]) {
    this.originVideo = "";
    this.showUpLoad = false;
    for (let i = 0; i < urls.length; i++) {
      let len = this._videoesForSubmit.length;
      if (len >= this.maxCount) break;
      let url = urls[i];
      url && this._videoesForSubmit.splice(0, 0, { url, name: '' });
    }
  }
  /**
   * @description 初始上传框上传完成
   */
  deleteUnit(url: string) {
    let index = this._videoesForSubmit.findIndex((e: vehicleConfig.Media) => e.url === url);
    this._videoesForSubmit.splice(index, 1);
  }
  /**
   * @description 退出之前判断是否有修改
   */
  backWithoutSave(self = true) {
    let origin = JSON.stringify(this.videoesOrigin);
    let current = JSON.stringify(this._videoesForSubmit);
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
.video_box {
  margin-bottom: 10px;
}
video {
  width: 100%;
  max-height: 156px;
}
.gray_txt {
  margin-left: 15px;
}
.img_box {
  margin-bottom: 15px;
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
  .upload-to-oss {
    position: relative;
  }
  .el-input__suffix {
    line-height: 30px;
  }
}
</style>
