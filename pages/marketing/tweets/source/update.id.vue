<template>
  <div class="main-container">
    <breadcrumb-group
      :breadGroup="[{ label: '文章列表', to: '/marketing/tweets/article/index' }, { label: '编辑图文', to: '' }]"
    />
    <el-form @submit.native.prevent ref="form" :model="form" :rules="rule" label-width="120px">
      <el-card class="main-panel">
        <el-row :gutter="15">
          <el-col :span="24">
            <el-form-item label="发布文章：" prop="content">
              <el-button size="mini" @click="review">预览</el-button>
              <quill-editor
                :content="form.content"
                ref="myQuillEditor"
                :options="editorOption"
                @on-editor-change="onEditorChange($event)"
              >
              </quill-editor>
            </el-form-item>
            <el-form-item label="文章标题：" prop="title">
              <el-input
                type="input"
                maxlength="64"
                size="small"
                v-model="form.title"
                style="width:70%;margin-right:10px;"
                placeholder="请输入文章标题"
              ></el-input>
              <span>{{ form.title.length }}/64</span>
            </el-form-item>
            <el-form-item label="封面：" prop="coverUrl">
              <upload-to-ali
                :multiple="false"
                :size="3096"
                :preview="true"
                :value="form.coverUrl"
                accept="image/png,image/jpeg,image/bmp"
                :max="1"
                :width="300"
                :height="200"
                @delete="delImage"
                @loaded="uploadSuccess"
              ></upload-to-ali>
              <br />
              <el-button size="small" @click="showDialog">从素材库选择</el-button>
              <!-- <div class="img-box">
                <img :src="form.coverUrl" />
              </div> -->
            </el-form-item>
            <div class="btn-group">
              <el-button @click="$router.push('/marketing/tweets/source/index')">取消</el-button>
              <el-button type="primary" @click="submit('form')">提交</el-button>
            </div>
          </el-col>
        </el-row>
      </el-card>
    </el-form>

    <dialog-select-image
      :showDialog="dialogVisible"
      :info="curItem"
      :categories="categories"
      @change="imgChange"
      @close="dialogVisible = false"
    >
    </dialog-select-image>

    <dialog-review :showDialog="dialogVisible0" :info="curItem" @close="dialogVisible0 = false"> </dialog-review>
  </div>
</template>

<script lang="ts">
import { Component, Vue, Prop } from "vue-property-decorator";
import QuillEditor from "@/components/vue-quill-editor";
import dialogSelectImage from "./components/dialogSelectImage.vue";
import api from "@/api/restful";
import dialogReview from "../components/dialogReview.vue";
import UploadToAli from "@/components/upload-to-ali/src/index.ts";

let tempForm: string = "";

interface Form {
  id: number | null;
  groupId: number | null;
  index: number | null;
  title: string;
  coverUrl: string;
  content: string;
}

@Component({
  components: {
    QuillEditor,
    dialogSelectImage,
    dialogReview,
    UploadToAli
  }
})
export default class SetSource extends Vue {
  private dialogVisible: boolean = false;
  private dialogVisible0: boolean = false;
  private categories: any[] = [];
  private curItem: any = {};
  private isSubmit: any = false;
  private source: number | null = null;
  private info: any = {
    id: null,
    index: null
  };
  private form: Form = {
    id: null,
    groupId: null,
    index: null,
    title: "",
    coverUrl: "",
    content: ""
  };
  private editorOption: object = {};
  private rule: object = {
    title: [{ required: true, message: "请输入标题", trigger: "blur" }],
    coverUrl: [{ required: true, message: "请设置封面", trigger: "blur" }],
    content: [{ required: true, message: "请输入内容", trigger: "blur" }]
  };
  get editor() {
    return (<any>this.$refs.myTextEditor).quill;
  }
  review() {
    this.dialogVisible0 = true;
    this.curItem = Object.assign({}, this.form);
  }
  showDialog() {
    this.dialogVisible = true;
    this.curItem = { id: this.form.groupId, source: this.source };
  }
  imgChange(item: any) {
    this.form.coverUrl = item.url;
  }
  uploadSuccess(data: string) {
    this.form.coverUrl = data;
  }
  delImage() {
    this.form.coverUrl = "";
  }
  onEditorChange({ html }: { html: any }) {
    this.form.content = html;
  }
  submit(form: string) {
    (<any>this.$refs[form]).validate((valid: boolean, params: any) => {
      if (valid) {
        if (this.form.content.length > 12000) {
          return this.$message({ type: "error", message: "文章内容超过限制" });
        }
        this.request();
      } else {
        let message = params[Object.keys(params)[0]][0].message;
        this.$message({ type: "error", message: message });
        return false;
      }
    });
  }
  async request() {
    let { title, coverUrl, content } = this.form;
    this.isSubmit = true;
    try {
      let res = await api.put({
        url: "MATERIAL_ARTICLE",
        isAdminApi: true,
        title: title,
        coverUrl: coverUrl,
        content: content,
        ...this.info
      });
      this.$message({ type: "success", message: "修改成功" });
      this.$router.go(-1);
    } catch (err) {
      this.isSubmit = false;
      console.log(err);
    }
  }
  getData() {
    api
      .get({
        url: "MATERIAL_ARTICLE",
        isAdminApi: true,
        id: this.info.id,
        index: this.info.index
      })
      .then((data: any) => {
        tempForm = JSON.stringify(data.data);
        this.form = Object.assign({}, data.data);
      });
  }
  mounted() {
    this.source = parseInt((<any>this.$route).query.source);
    this.info.index = parseInt((<any>this.$route).query.index);
    this.info.id = parseInt((<any>this.$route).params.id);
    this.getData();
  }
  private beforeRouteLeaveCount: number = 0;
  async beforeRouteLeave(to: any, from: any, next: any) {
    if (this.beforeRouteLeaveCount === 0 && !this.isSubmit && tempForm !== JSON.stringify(this.form)) {
      this.beforeRouteLeaveCount++;
      const h = this.$createElement;
      const message: any = h("p", {}, [h("p", { style: "color: #333" }, "编辑信息未保存，确定要离开吗？ ")]);
      try {
        let res = await this.$confirm(message, "提示");
        if (res) {
          next();
        }
      } catch (err) {
        this.beforeRouteLeaveCount = 0;
        next(false);
      }
    } else {
      next();
    }
  }
}
</script>

<style lang="scss" scoped>
.mgl-sm {
  margin-left: 10px;
}

ul.article-box {
  width: 360px;
  background: #f1f1f1;
  padding: 10px;
  box-sizing: border-box;

  li {
    width: 100%;
    display: flex;
    justify-content: space-between;
    list-style: none;
    padding: 10px;
    line-height: 60px;
    background: #fff;
    border-bottom: 1px solid #f7f7f7;

    .article-title {
      width: 70%;
      overflow: hidden;
      text-overflow: ellipsis;
      white-space: nowrap;
    }

    img {
      width: 60px;
      height: 60px;
    }
  }

  li.add {
    width: 100%;
    height: 35px;
    line-height: 35px;
    text-align: center;
    display: block;
    padding: 0;
    cursor: pointer;
  }

  li.main-article {
    width: 100%;
    position: relative;
    padding: 0;

    img {
      width: 100%;
      height: 150px;
    }

    .main-article_title {
      position: absolute;
      bottom: 0;
      left: 0;
      width: 100%;
      line-height: 1em;
      display: block;
      overflow: hidden;
      text-overflow: ellipsis;
      white-space: nowrap;
      padding: 8px 10px;
      background: rgba(255, 255, 255, 0.4);
    }
  }
}
.img-box {
  width: 300px;
  margin-top: 10px;
  img {
    width: 100%;
  }
}
</style>
