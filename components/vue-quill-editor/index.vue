<template>
  <div class="v-editor ql-editor">
    <div class="loading-mask"
         v-if="showLoading">
      <div class="loading-content">
        <!-- @slot 自定义上传文本 -->
        <slot name="loading">
          <p>文件上传中...</p>
        </slot>
      </div>
    </div>
    <div ref="editor"
         style="text-align:left" />
    <!-- @paste="paste"></div> -->
    <upload-to-ali v-show="false"
                   ref="uploadToAli"
                   v-bind="upload"
                   @loading="handleLoading"
                   @loaded="handleUploadFileSuccess"
                   @fail="handleUploadFileFail" />
  </div>
</template>

<script>
/** eslint-disable */
import E from "./wangEditor";
import uploadToAli from "../upload-to-ali/src";
import defaultEditorOptions from "./defaultEditorOptions";

const HTML_PATTERN = /^<[a-z\s]+class="text-box"/i;

// 对齐wangEditor的样式
const editorValue = val => (val && HTML_PATTERN.test(val) ? val : `<div class="text-box">${val}<br></div>`);

export default {
  name: "VEditor",
  components: {
    uploadToAli
  },
  props: {
    /**
     * upload-to-ali的参数;
     * 文档参看upload-to-ali;
     */
    upload: {
      type: Object,
      default: () => ({
        size: 1024 * 3,
        multiple: true,
        accept: "image/png,image/jpg,image/jpeg"
      })
    },
    /**
     * 编辑的内容，返回一段HTML，支持v-model
     */
    content: {
      type: String,
      default: () => {
        return "";
      }
    },
    /**
     * editor配置，参考[wangEditor文档](https://github.com/wangfupeng1988/wangEditor)；
     * [默认配置](https://github.com/FEMessage/v-editor/blob/dev/src/defaultEditorOptions.js)
     */
    options: {
      type: Object,
      default: () => {
        return defaultEditorOptions;
      }
    },
    /**
     * 编辑器是否可编辑
     */
    disabled: {
      type: Boolean,
      default: false
    }
  },
  data() {
    return {
      enableUpdateValue: true,
      showLoading: false
    };
  },
  watch: {
    disabled(val, oldVal) {
      this.$refs.editor.querySelector(".w-e-toolbar").style["pointer-events"] = val ? "none" : "";
      this.editor.$textElem.attr("contenteditable", !val);
    },
    content(val) {
      if (this.enableUpdateValue) {
        this.editor && this.editor.txt.html(val);
      }
    }
  },
  mounted() {
    // 初始化editor
    const editor = new E(this.$refs.editor);
    // 显示本地上传
    editor.customConfig.uploadImgShowBase64 = true;
    // editor.customConfig.showLinkImg = false;
    // 自定义菜单配置
    editor.customConfig.menus = this.options.menus || defaultEditorOptions.menus;
    // debug模式下，有 JS 错误会以throw Error方式提示出来。默认值为false，即不会抛出异常。
    editor.customConfig.debug = this.options.debug;
    // 复制样式控制
    editor.customConfig.pasteFilterStyle = false;
    // 自定义 onchange 触发的延迟时间，默认为 200 ms
    editor.customConfig.onchangeTimeout = this.options.onchangeTimeout || defaultEditorOptions.onchangeTimeout; // 单位 ms
    // 详细注释以及解释可以参考 method: `emitValue`
    editor.customConfig.onchange = this.emitValue;
    // 自定义上传方法
    editor.customConfig.customUploadImg = (files, insert) => {
      const upObj = { target: { files } };
      this.$refs.uploadToAli.upload(upObj);
    };

    // editor 聚焦时不触发 watch
    editor.customConfig.onfocus = () => {
      this.enableUpdateValue = false;
      this.$emit("on-editor-focus");
    };
    // editor 失焦时不触发 watch
    editor.customConfig.onblur = () => {
      this.enableUpdateValue = true;
      this.$emit("on-editor-blur");
    };

    editor.create();

    // 是否禁用编辑器
    editor.$textElem.attr("contenteditable", !this.disabled);

    const toolbar = this.$refs.editor.querySelector(".w-e-toolbar");
    toolbar.style["pointer-events"] = this.disabled ? "none" : "";

    // 保存实例，用于后续处理
    this.editor = editor;

    // 设置默认值
    editor.txt.html(this.content);
    this.emitValue(this.content);
  },
  methods: {
    /**
     * 返回内部的wangEditor对象
     * @public
     */
    getEditor() {
      // 暴露当前编辑器，可以在外部调用编辑器的功能
      return this.editor;
    },
    handleLoading() {
      // 外部监听upload-loading，增加显示loading ui 逻辑
      this.showLoading = true;
      this.$emit("upload-loading", true);
    },
    // 将文件上传后的URL地址插入到编辑器文本中
    handleUploadFileSuccess(urls) {
      // eslint-disable-next-line
      if (!!urls) {
        urls.forEach(item => {
          this.editor.cmd.do("insertHtml", `<img src="${item}" style="max-width:100%;"/>`);
        });
      } else {
        this.$emit("upload-error");
      }
      // 外部监听upload-loading，增加显示loading ui 逻辑
      this.showLoading = false;
      this.$emit("upload-loading", false);
      this.enableUpdateValue = false;
    },
    handleUploadFileFail() {
      this.showLoading = false;
    },
    /**
     * emitValue 里要处理空值校验的问题:
     * 目标： v-editor 视觉上内容为空(无文本无图片)时，向上输出的 content 为 ''
     * 默认情况下，v-editor 视觉上内容为空时，value 不为空，可能包括以下情况：
     * 1. 空内容的斜体、加粗符号
     * 2. 空内容的 quote 块
     * 3. 空内容的 table
     *      table是通过menu插入的表格。
     *      wangEditor源码里默认生成的table每一个格子里都有一个空格&nbsp
     */
    emitValue(str = "") {
      /**
       * 不使用 editor.txt.text() 的原因是
       * 该方法返回的是去掉标签的html内容
       * 但空格是&nbsp，无法被trim
       */
      const noText = !this.editor.$textElem[0].textContent
        .trim()
        // 处理斜体和加粗符号('zero-width space')
        .replace(/\u200b/g, "");
      const noImg = !str.includes("img");
      if (str.length > 10000) {
        str = str.substr(0, 10000);
        this.editor.txt.html(str);
      }
      const html = noText && noImg ? "" : editorValue(str);
      // html = filterXSS(html);
      this.$emit("on-editor-change", { html });
      this.$emit("update:content", html);
    }
  }
};
</script>

<style lang="scss">
.v-editor {
  min-width: 460px;
  position: relative;
  padding: 0;
  .w-e-text-container {
    min-height: 300px;
    z-index: 2 !important;
  }
  .w-e-menu {
    z-index: 3 !important;
  }
  .w-e-toolbar {
    border-color: #cad1e8;
    background: #f4f6fa;
  }
  .text-box {
    margin: 10px 0;
    line-height: 1.5;
  }
  .disabled-mask {
    position: absolute;
    background-color: rgba(0, 0, 0, 0);
    margin: 0;
    top: 0;
    right: 0;
    bottom: 0;
    left: 0;
    z-index: 200;
    cursor: not-allowed;
  }
  .loading-mask {
    position: absolute;
    background-color: rgba(0, 0, 0, 0.3);
    margin: 0;
    top: 0;
    right: 0;
    bottom: 0;
    left: 0;
    z-index: 200;
  }
  .w-e-item {
    &::before {
      display: none;
    }
  }
  .loading-content {
    position: absolute;
    text-align: center;
    width: 100%;
    top: 50%;
    margin-top: -21px;
  }
}
</style>
