<template>
  <div class="content">
    <slot name="header">
      <p class="select_all"
         v-show="highlightListInPage.length>0">
        <el-checkbox v-model="selectAll"
                     @change="chooseAllHighlight"
                     :disabled="disabled">全选</el-checkbox>
      </p>
    </slot>
    <!-- <p class="select_all"
       v-show="highlightListInPage.length<=0">
      暂无亮点
    </p> -->
    <el-row :gutter="20"
            v-if="highlightListInPage.length>0">
      <el-col :span="3"
              v-for="(item, x) in highlightListInPage"
              :key="x">
        <div class="feature_item"
             v-if="(disabled && _highlightListForSubmit.includes(item.id)) || !disabled"
             :class="{'active': _highlightListForSubmit.includes(item.id),'disable':disabled}"
             @click="chooseHighlight(item)">
          <div class="img_box">
            <img :src="item.picUrl">
          </div>
          <div class="item_tag">{{item.name}}</div>
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
                   @click.stop="_stepWalk='0'">上一步</el-button>
        <el-button class="step_btn"
                   type="primary"
                   size="small"
                   @click="nextStep">下一步</el-button>
      </div>
    </slot>
  </div>
</template>

<script lang='ts'>
import { Component, PropSync, Vue } from 'vue-property-decorator';
import { mixins } from "vue-class-component";
import SerieDetailMixin from "../mixin/serie-detail.mixin";
import { highlightsList, getSeriesHighlight, modifySeriesHighlight } from "@/api";
import deepClone from "@/utils/deepClone";
const type = "SERIES"

@Component({
  inheritAttrs: false
})
export default class GoodsFeature extends mixins(SerieDetailMixin) {
  @PropSync("highlightListForSubmit", {
    type: Array, default: () => []
  }) _highlightListForSubmit: number[];

  highlightListInPage: any[] = [];
  selectAll: boolean = false;
  highlightListOrigin: any = {};
  async nextStep() {
    if (this.operationType === 'edit') {
      const res = await this.modifySeriesHighlight();
      if (!res) return;
    }
    this._stepWalk = "2";
  };
  /**
   * @description 保存亮点详细信息
   */
  async modifySeriesHighlight() {
    try {
      const params = {
        highlightsIds: [...this._highlightListForSubmit],
        type,
        code: this.serieCode
      };
      const { data } = await modifySeriesHighlight(params);
      if (data) {
        this.highlightListOrigin = deepClone(this._highlightListForSubmit);
        this.showMsg('修改成功');
      }
      return Promise.resolve(data);
    } catch (e) {
      this.log(e)
    }
  }
  async getHighlightsList() {
    try {
      let res = [];
      const params = { size: 9999 };
      if (this.serieCode) {
        const { data } = await getSeriesHighlight(this.serieCode, params);
        res = data || [];
      } else {
        const { data } = await highlightsList(params);
        res = data || [];
      }
      let tmp: any = [];
      this.highlightListInPage = res;
      res.forEach((e: any) => {
        if (e.isChoosed) tmp.push(e.id)
      });
      this.selectAll = res.length > 0 && res.every((e: any) => e.isChoosed);
      this._highlightListForSubmit = tmp;
      this.$nextTick(() => {
        this.highlightListOrigin = deepClone(this._highlightListForSubmit);
      })
    } catch (e) {
      this.log(e)
    }
  };
  /**
   * @description 单击一个
   */
  chooseHighlight(highlight: any) {
    if (this.disabled) return;
    let t = [...this._highlightListForSubmit];
    if (t.includes(highlight.id)) {
      t = t.filter(id => id !== highlight.id)
    } else {
      t.push(highlight.id)
    }
    this._highlightListForSubmit = t;
    let selectAllMirror = true;
    this.$nextTick(() => {
      for (let i = 0; i < this.highlightListInPage.length; i++) {
        let x = this.highlightListInPage[i].id;
        let t = this._highlightListForSubmit.findIndex(id => id === x);
        if (t < 0) {
          selectAllMirror = false;
          break;
        }
      }
      this.selectAll = selectAllMirror;
    })
  }
  /**
   * @description 选择全部
   */
  chooseAllHighlight() {
    let t: number[] = [];
    if (this.selectAll) {
      this.highlightListInPage.forEach((e: any) => {
        t.push(e.id)
      })
    }
    this._highlightListForSubmit = t;
  }
  /**
   * @description 退出之前判断是否有修改
   */
  backWithoutSave(self = true) {
    let origin = JSON.stringify(this.highlightListOrigin)
    let current = JSON.stringify(this._highlightListForSubmit)
    if (this.operationType === 'add') {
      return this.notEdited(false, self);
    } else {
      return this.notEdited(origin === current, self);
    }
  };
  created() {
    this.getHighlightsList();
  }
}
</script>
<style lang="scss" scoped>
.select_all {
  margin-top: 0;
}
.feature_item {
  display: flex;
  align-items: center;
  justify-content: center;
  flex-direction: column;
  height: 100px;
  margin-bottom: 20px;
  cursor: pointer;
  border: 1px solid #ddd;
  &:hover {
    opacity: 0.85;
  }
  .img_box {
    width: 80%;
    height: 80%;
    overflow: hidden;
    display: flex;
    justify-content: center;
    align-items: center;
  }
  img {
    max-width: 90%;
    max-height: 85%;
  }
}
.item_tag {
  margin-top: 10px;
  font-size: 13px;
}
.active {
  $bg: #127dd7;
  border-color: $bg;
  position: relative;
  overflow: hidden;
  @mixin share {
    content: "";
    position: absolute;
    pointer-events: none;
    right: 0;
  }
  $bw: 30;
  &:after {
    @include share;
    bottom: 0;
    z-index: 3;
    display: block;
    width: 15px;
    height: 15px;
    background: url("/imgs/goods/gou.svg") no-repeat center;
    background-size: contain;
  }
  &:before {
    @include share;
    border-width: #{$bw}px;
    bottom: -#{$bw}px;
    border-style: solid;
    border-color: transparent $bg transparent transparent;
    z-index: 2;
  }
}
.disable {
  cursor: not-allowed;
}
</style>
