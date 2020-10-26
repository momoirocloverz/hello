<template>
  <div class="main-container">
    <breadcrumb-group :breadGroup="[{ label: '文章列表', to: '/marketing/tweets/article/index' }, { label: '新建图文', to: '' }]" />
    <el-form @submit.native.prevent
             ref="form"
             :model="contentList[curArcticle]"
             :rules="rule"
             label-width="120px">
      <el-card class="main-panel">
        <el-row :gutter="15">
          <el-col :xl="14"
                  :md="17">
            <el-form-item label="发布文章："
                          prop="content">
              <el-button size="mini"
                         @click="review">预览</el-button>
              <quill-editor :content="contentList[curArcticle].content"
                            ref="myQuillEditor"
                            :options="editorOption"
                            @on-editor-blur="onEditorBlur"
                            @on-editor-change="onEditorChange($event)">
              </quill-editor>
            </el-form-item>
            <el-form-item label="文章标题："
                          prop="title">
              <el-input type="input"
                        maxlength="64"
                        size="small"
                        v-model="contentList[curArcticle].title"
                        style="width:70%;margin-right:10px;"
                        placeholder="请输入文章标题"></el-input>
              <span>{{ contentList[curArcticle].title.length }}/64</span>
            </el-form-item>
            <el-form-item label="封面："
                          prop="coverUrl">
              <upload-to-ali :multiple="false"
                             :size="3096"
                             :preview="true"
                             :value="contentList[curArcticle].coverUrl"
                             accept="image/png,image/jpeg,image/bmp"
                             :max="1"
                             :width="300"
                             :height="200"
                             @delete="delImage"
                             @loaded="uploadSuccess"></upload-to-ali>
              <br />
              <el-button size="small"
                         @click="showDialog">从素材库选择</el-button>

              <!-- <div class="img-box">
                <img :src="contentList[curArcticle].coverUrl" />
              </div> -->
            </el-form-item>
          </el-col>
          <el-col :xl="10"
                  :md="7">
            <ul class="article-box">
              <li class="main-article"
                  :class="{ active: curArcticle === 0 }"
                  @click.stop="articleChange(0)">
                <img :src="contentList[0].coverUrl || 'https://via.placeholder.com/120x120.png'"
                     :alt="contentList[0].title" />
                <span class="main-article_title">{{ contentList[0].title || "请输入标题" }}</span>
              </li>
              <li v-for="(item, index) in contentList"
                  :key="index"
                  v-show="index !== 0"
                  :class="{ active: curArcticle === index }"
                  @click.stop="articleChange(index)">
                <span class="article-title">{{ item.title || "请输入标题" }}</span>
                <img :src="item.coverUrl || 'https://via.placeholder.com/120x120.png'"
                     alt="" />
              </li>
              <li class="add"
                  v-if="contentList.length < 8"
                  @click="addArticle">
                <i class="el-icon-plus"></i>
                添加
              </li>
            </ul>
          </el-col>
        </el-row>
      </el-card>
      <el-card class="main-panel">
        <el-row :gutter="15">
          <el-col :span="14">
            <el-form-item label="图文素材分组："
                          prop="groupId">
              <el-select v-model="form.groupId"
                         placeholder="请选择">
                <el-option v-for="item in categories"
                           :key="item.id"
                           :label="item.name"
                           :value="item.id"> </el-option>
              </el-select>
            </el-form-item>
          </el-col>
          <el-col :span="10"> </el-col>
        </el-row>
        <div class="btn-group">
          <el-button @click="$router.go(-1)">取消</el-button>
          <el-button type="primary"
                     :loading="loading"
                     @click="submit('form')">提交</el-button>
        </div>
      </el-card>
    </el-form>

    <dialog-select-image :showDialog="dialogVisible"
                         :info="curItem"
                         :categories="categories"
                         @change="imgChange"
                         @close="dialogVisible = false">
    </dialog-select-image>

    <dialog-review :showDialog="dialogVisible0"
                   :info="curItem"
                   @close="dialogVisible0 = false"> </dialog-review>
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

interface Article {
  title: string;
  coverUrl: string;
  content: string;
}

interface Form {
  groupId: number | null;
  contentList: Article[];
}

let vm: Vue;

let validateGroup = (rule: any, value: any, callback: Function) => {
  if (!(<any>vm).form.groupId) {
    callback(new Error("请选择分组"));
  } else {
    callback();
  }
};

@Component({
  components: {
    QuillEditor,
    dialogSelectImage,
    dialogReview,
    UploadToAli
  }
})
export default class SetSource extends Vue {
  private curArcticle: number = 0;
  private dialogVisible: boolean = false;
  private dialogVisible0: boolean = false;
  private categories: any[] = [];
  private curItem: any = {};
  private isSubmit: any = false;
  private source: number | null = null;
  private contentList: Article[] = [
    {
      title: "",
      coverUrl: "",
      content: ""
    }
  ];
  private form: Form = {
    groupId: null,
    contentList: []
  };
  private loading: boolean = false;
  private editorOption: object = {};
  private rule: object = {
    title: [{ required: true, message: "请输入标题", trigger: "blur" }],
    coverUrl: [{ required: true, message: "请设置封面", trigger: "blur" }],
    content: [{ required: true, message: "请输入内容", trigger: "blur" }],
    groupId: [{ validator: validateGroup, trigger: "blur" }]
  };
  uploadSuccess(data: string) {
    this.contentList[this.curArcticle].coverUrl = data;
    (<any>this.$refs["form"]).validate();
  }
  delImage() {
    this.contentList[this.curArcticle].coverUrl = "";
  }
  review() {
    this.dialogVisible0 = true;
    this.curItem = Object.assign({}, this.contentList[this.curArcticle]);
  }
  addArticle() {
    if (this.contentList.length >= 8) {
      return;
    }
    this.contentList.push({
      title: "",
      coverUrl: "",
      content: ""
    });
  }
  articleChange(index: number) {
    this.curArcticle = index;
  }
  showDialog() {
    this.dialogVisible = true;
    this.curItem = { id: this.form.groupId, source: this.source };
  }
  async getOptions() {
    try {
      let res = await api.get({
        url: "MATERIAL_GROUP",
        isAdminApi: true,
        source: this.source, // 0-主机厂 1-集团 2-经销商
        type: 0 // 0-图文  1-图片  2-视频
      });
      this.categories = res.data;
      this.form.groupId = this.categories[0].id;
      tempForm = JSON.stringify({ groupId: this.form.groupId, contentList: this.contentList });
    } catch (err) {
      console.log(err);
    }
  }
  imgChange(item: any) {
    this.contentList[this.curArcticle].coverUrl = item.url;
    (<any>this.$refs["form"]).validate();
  }
  onEditorBlur() {
    (<any>this.$refs["form"]).validate();
  }
  onEditorFocus() { }
  onEditorChange({ html }: { html: any }) {
    this.contentList[this.curArcticle].content = html;
  }
  submit(form: string) {
    let result = this.checkForm();
    // 检查有没有未填写字段，自动定位到相应文章
    if (!result[0]) {
      this.articleChange(<number>result[1]);
    }
    setTimeout(() => {
      (<any>this.$refs[form]).validate((valid: boolean, params: any) => {
        if (valid) {
          this.request();
        } else {
          let message = params[Object.keys(params)[0]][0].message;
          // this.$message({ type: "error", message: message });
          return false;
        }
      });
    }, 100);
  }
  checkForm(): [boolean, number?] {
    let arr: [boolean, number?] = [true];
    this.contentList.map((v: Article, k: number) => {
      Object.keys(v).map((key: string) => {
        if (!v[key as keyof Article]) {
          arr = [false, k];
        }
        if (key === "content" && v[key as keyof Article].length > 12000) {
          this.$message({ type: "error", message: "文章内容超过限制" });
          arr = [false, k];
        }
      });
    });
    return arr;
  }
  async request() {
    if (this.loading) {
      return;
    }
    this.isSubmit = true;
    this.loading = true;
    let form = Object.assign({}, this.form);
    form.contentList = this.contentList;

    try {
      let res = await api.post({ url: "MATERIAL_ARTICLES", isAdminApi: true, ...form });
      this.loading = false;
      this.$message({ type: "success", message: "创建成功" });
      this.$router.go(-1);
    } catch (err) {
      this.isSubmit = false;
      console.log(err);
    }
  }
  mounted() {
    vm = this;
    // 根据角色确定source
    let s: string = (<any>this.$route.query).sysPlat;
    if (s === "factory") {
      this.source = 0;
    } else if (s === "company") {
      this.source = 1;
    } else {
      this.source = 2;
    }
    this.getOptions();
  }
  private beforeRouteLeaveCount: number = 0;
  async beforeRouteLeave(to: any, from: any, next: any) {
    // bug:beforeRouteLeave会走两次
    if (
      this.beforeRouteLeaveCount === 0 &&
      !this.isSubmit &&
      tempForm !== JSON.stringify({ groupId: this.form.groupId, contentList: this.contentList })
    ) {
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
/deep/ {
  .ql-editor {
    padding-left: 0;
    padding-right: 0;
  }

  .w-e-toolbar .w-e-menu {
    padding-left: 7px;
    padding-right: 7px;
  }
}
.mgl-sm {
  margin-left: 10px;
}
.main-panel {
  min-width: 860px;
}
ul.article-box {
  max-width: 360px;
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

    &.active {
      border: 1px solid rgb(10, 111, 226);
    }

    &.add {
      width: 100%;
      height: 35px;
      line-height: 35px;
      text-align: center;
      display: block;
      padding: 0;
      cursor: pointer;
    }

    &.main-article {
      width: 100%;
      position: relative;
      padding: 0;

      img {
        width: 100%;
        height: 11vw;
        max-height: 150px;
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

    img {
      width: 60px;
      height: 60px;
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
