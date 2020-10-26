<template>
  <div>
    <transition name="component-fade"
                mode="out-in">
      <div class="preview_dialog"
           v-if="_previewModal">
        <div class="pre_box">
          <i class="el-icon-close close_pre"
             @click.stop="_previewModal=false" />
          <img src="../style/mobile.png"
               class="mobile">
          <div class="pre_content">
            <template v-if="_baseForm.mainImg.length>0">
              <img :src="_baseForm.mainImg[0]">
            </template>
            <div v-else
                 class="imgholder">
              <i class="el-icon-picture-outline" />
            </div>
            <div class="detail_xj">
              <h5>{{_baseForm.name || '名称'}}</h5>
              <p>详情</p>
              <div class="innet_content ql-editor"
                   v-if="_baseForm.desc"
                   v-html="_baseForm.desc" />
              <div v-else
                   class="innet_content ql-editor">
                <span v-for="x in 60"
                      :key="x">图文描述</span>
              </div>
            </div>
          </div>
        </div>
      </div>
    </transition>
  </div>
</template>

<script lang='ts'>
import { Component, PropSync, Vue } from 'vue-property-decorator';
@Component({
  components: {
  },
})
export default class PrevieweModal extends Vue {
  @PropSync('baseForm', { type: Object, default: () => [] }) _baseForm: any;
  @PropSync('previewModal', { type: Boolean, default: () => [] }) _previewModal: any;
}
</script>
<style lang="scss" scoped>
.pre_box {
  position: relative;
  width: 250px;
  background: #fff;
  height: 480px;
  border-radius: 30px;
}
.close_pre {
  position: absolute;
  right: -50px;
  top: -10px;
  background: #fff;
  border-radius: 30px;
  font-size: 30px;
  cursor: pointer;
}
.mobile {
  position: absolute;
  pointer-events: none;
  top: 0;
  left: -1%;
  width: 102%;
  height: 100%;
}
.preview_dialog {
  position: fixed;
  left: 0;
  top: 0;
  display: flex;
  justify-content: center;
  align-items: center;
  width: 100%;
  height: 100%;
  background: rgba(#000, 0.2);
  z-index: 100;
}
.pre_content {
  width: 230px;
  height: 480px;
  margin: 0 auto;
  padding: 55px 5px;
  img,
  .imgholder {
    width: 100%;
    height: 100px;
  }
  .imgholder {
    background: #eee;
    padding: 30px;
    font-size: 20px;
    text-align: center;
  }
  h5,
  p {
    margin: 5px;
    font-size: 14px;
  }
  .detail_xj {
    overflow: auto;
    height: 240px;
    min-height: 240px;
  }
  .innet_content {
    margin-top: 5px;
    font-size: 12px;
    padding: 0 5px;
    overflow: initial;
  }
}
</style>
<style lang="scss">
.component-fade-enter-active,
.component-fade-leave-active {
  transition: opacity 0.3s ease;
}

.component-fade-enter,
.component-fade-leave-to {
  opacity: 0;
}
</style>