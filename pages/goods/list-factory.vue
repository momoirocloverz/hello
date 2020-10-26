<template>
  <div class="g_container"
       v-loading="loading">
    <breadcrumb-group :breadGroup="[{label:'车型管理'}]" />

    <el-row :gutter="20"
            class="g_container">
      <el-col :span="4"
              class="box g_container">
        <div class="title">
          <b>车系（{{seriesGroup.length}}）</b>
          <el-button size="mini"
                     type="primary"
                     v-if='accessIsOpened("PERM:MODEL_MANAGE:EDIT")'
                     @click.stop="addSerie">新建车系</el-button>
        </div>
        <ul class="group">
          <li v-for="(serie, i) in seriesGroup"
              :key="i"
              @click.stop="chooseSerie(serie)"
              :class="{'active':currentSeriesTab === serie.code}">
            <div class="dfvc">
              <!-- <img :src="serie.logo"
                   class="small_logo"> -->
              <el-tooltip effect="dark"
                          placement="right"
                          :content="serie.name+''">
                <span class="el-link--inner">
                  {{serie.name}}
                </span>
              </el-tooltip>
            </div>
            <div>
              <span class="el-button--text"
                    v-if='accessIsOpened("PERM:MODEL_MANAGE:VIEW")'
                    @click.stop="viewSeire(serie)">详情</span>
              <span class="el-button--text"
                    v-if='accessIsOpened("PERM:MODEL_MANAGE:EDIT")'
                    @click.stop="modifySerie(serie)">编辑</span>
              <span class="el-button--text"
                    v-if='accessIsOpened("PERM:MODEL_MANAGE:EDIT")'
                    @click.stop="operateShelveSerie(serie)">
                {{statusList[serie.status].todo}}
              </span>
            </div>
          </li>
        </ul>
      </el-col>
      <el-col :span="20">
        <el-admin-table ref="adminTableRef"
                        :hasPager="false"
                        :totalCount.sync="totalCount"
                        :tableAttrs="tableAttrs"
                        :customQuery="customQuery"
                        :pagerAttrs="{'page-sizes': [100], 'page-size':100}"
                        :apiFn="getModelBySeriesCode">
          <template slot="top-content">
            <div class="dfc">
              <b>{{seriesInPage.name || '车型'}}（{{totalCount}}）</b>
              <el-button type="primary"
                         size="small"
                         v-if='accessIsOpened("PERM:MODEL_MANAGE:EDIT")'
                         @click="addCarModel">新建车型</el-button>
            </div>
          </template>
        </el-admin-table>
      </el-col>
    </el-row>

    <elBtnDialog :visible.sync="modalVisible"
                 :title="dialogTitle"
                 :saveAutoClose="false"
                 @save="saveSerieForm">
      <el-form @submit.native.prevent
               :model="serieForm"
               ref="serieFormRef"
               :rules="serieFormRule"
               label-width="100px"
               style="width:90%">
        <el-form-item prop="logo"
                      label="LOGO">
          <uploadToAli v-model="serieForm.logo"
                       accept='image/png,image/jpg,image/jpeg'
                       :size="1024 * 3" />
          <div class="gray_txt">支持格式：jpg、png、jpeg，单个文件不能超过3MB，建议尺寸300*220px（或相同比例）</div>
        </el-form-item>
        <el-form-item prop="name"
                      label="车系名称">
          <el-input v-model.trim="serieForm.name"
                    maxlength="20">
            <template slot="suffix">
              {{serieForm.name.length}}/20
            </template>
          </el-input>
        </el-form-item>
        <el-form-item prop="externalCode"
                      label="车系代码">
          <el-input v-model.trim="serieForm.externalCode"
                    maxlength="20">
            <template slot="suffix">
              {{serieForm.externalCode.length}}/20
            </template>
          </el-input>
        </el-form-item>
      </el-form>
    </elBtnDialog>

    <img-preview v-model="previewUrl" />
  </div>
</template>

<script lang='ts'>
import { Component, Ref } from "vue-property-decorator";
import { mixins } from "vue-class-component";
import elBtnDialog from "@/components/el-btn-dialog/index.vue";
import GoodsListMixin from "./mixin/goods-list.mixin";
import { factoryListColumn, statusList } from "./const/list-config";
import uploadToAli from "@/components/upload-to-ali/src/index.ts";
import ImgPreview from "@femessage/img-preview";
import {
  serieDiscontinuation,
  serieEnabling,
  modelEnabling,
  modelDiscontinuate,
  addSerie,
  modifySerie
} from "@/api";
const brandCode = "geely";
interface SerieFormRule {
  logo: element.FormRule[],
  name: element.FormRule[],
  externalCode: element.FormRule[],
}
const externalCodeValidator = (rule: any, value: any, callback: any) => {
  if (value && !/^[/a-zA-Z0-9-_]{0,20}$/.test(value)) {
    callback(new Error('只可输入数字、字母、-/_ 特殊字符'))
  } else {
    callback()
  }
}

@Component({
  inheritAttrs: false,
  components: { elBtnDialog, uploadToAli, ImgPreview }
})
export default class GoodsFactoryList extends mixins(GoodsListMixin) {
  @Ref() readonly serieFormRef: element.Refs;
  readonly statusList = statusList;
  readonly serieFormRule: SerieFormRule = {
    logo: [{ required: true, message: '请设置车系logo', trigger: 'change' }],
    name: [{ required: true, message: '请输入车系名称', trigger: ['change', 'blur'] }],
    externalCode: [
      { required: true, message: '请输入车系代码', trigger: ['change', 'blur'] },
      { validator: externalCodeValidator, trigger: ['change', 'blur'] }]
  }
  readonly tableAttrs = {
    border: true,
    columns: [
      {
        col: {
          width: "50px"
        },
        type: "index",
        label: "序号"
      },
      // {
      //   prop: "logo",
      //   label: "车型图片",
      //   render: (h: Function, row: any) =>
      //     h("img", {
      //       class: "row_img",
      //       attrs: {
      //         src: row.logo
      //       },
      //       on: {
      //         click: () => this.showImgPreview(row)
      //       }
      //     })
      // },
      // table静态列
      ...factoryListColumn,
      {
        prop: "networks",
        label: "授权网络",
        formatter: (row: any) => {
          let networks = row.networks.map((e: string) => {
            return e += "网"
          })
          return networks.join("、") || "—"
        }
      },
      {
        prop: "status",
        label: "状态",
        render: (h: any, row: any) =>
          h("div", [
            h("span", {
              class: (row => {
                return (row.status === "RELEASE" || row.status === 1)
                  ? "dot dot2"
                  : "dot dot5";
              })(row)
            }),
            h("span", this.statusList[row.status].txt)
          ])
      },
      {
        type: "operation",
        col: {
          width: "160px"
        },
        btns: [
          {
            prop: (row: any) => {
              return {
                disabled: row.msgType === "1"
              };
            },
            text: "车型详情",
            show: (row: any) => this.accessIsOpened("PERM:MODEL_MANAGE:VIEW"),
            atClick: (row: any) => this.goDetail(row, "view")
          },
          {
            prop: (row: any) => {
              return {
                disabled: row.msgType === "1"
              };
            },
            text: "编辑",
            show: (row: any) => this.accessIsOpened("PERM:MODEL_MANAGE:EDIT"),
            atClick: (row: any) => this.goEditDetail(row, "edit")
          },
          {
            prop: (row: any) => {
              return {
                disabled: row.msgType === "1"
              };
            },
            show: (row: any) => this.accessIsOpened("PERM:MODEL_MANAGE:EDIT") && !this.isRelease(row),
            text: "上架",
            atClick: (row: any) => this.operateModelStatus(row)
          },
          {
            prop: (row: any) => {
              return {
                disabled: row.msgType === "1"
              };
            },
            show: (row: any) => this.accessIsOpened("PERM:MODEL_MANAGE:EDIT") && this.isRelease(row),
            text: "下架",
            atClick: (row: any) => this.operateModelStatus(row)
          }
        ]
      }
    ]
  };
  get dialogTitle() {
    switch (this.dialogType) {
      case 1:
        return "新建车系";
      default:
        return "编辑车系";
    }
  }
  serieForm: any = {
    logo: "",
    name: "",
    externalCode: ""
  };
  /**
   * @description 传递给btn选择显示
   */
  isRelease(row: any) {
    return (row.status === "RELEASE" || row.status === 1);
  }
  /**
   * @description 新增车系
   */
  addSerie() {
    this.$router.push({
      name: "goods-serie",
      params: {
        operation: "add"
      }
    })
  }
  /**
   * @description 修改车系
   */
  modifySerie(serie: any) {
    localStorage[`${this.sysPlat}-seriecode`] = serie.code;
    this.$router.push({
      name: "goods-serie",
      params: {
        operation: "edit",
        serieCode: serie.code
      }
    });
  }
  addCarModel() {
    if (!this.seriesInPage.code) {
      this.showMsg('未选择车系', 'warning')
      return
    }
    this.$router.push({
      name: "goods-model",
      params: {
        operation: "add"
      },
      query: {
        serie: this.seriesInPage.code
      }
    });
  }
  /**
   * @description 上下架车系
   * @function serieEnabling 上
   * @function serieDiscontinuation 下
   */
  operateShelveSerie(serie: any) {
    let msg = "上架";
    let txt = "上架后该车系下所有车型将一并上架";
    let fn = serieEnabling;
    if (serie.status === "RELEASE" || serie.status === 1) {
      msg = "下架";
      txt = "请确保下架前所有经销商车型是否下架，直接下架经销商该车系下所有车型将一并下架，商城端该车系下车型无法显示，正在进行的活动有关联相关车型的将自动取消关联";
      fn = serieDiscontinuation;
    }
    this.$confirm(`确定${msg}${serie.name}车系？<p style='${this.textStyle}'>${txt}</p>`, `${msg}车系`, {
      dangerouslyUseHTMLString: true
    }).then(async () => {
      const { data } = await fn(serie.code);
      if (data) {
        this.showMsg(`${msg}成功`);
        this.getSeriesByBrandCode();
        if (this.seriesInPage.code === serie.code) {
          this.adminTableRef.getList();
        }
      }
    });
  }
  goEditDetail(row: any, operation = "edit") {
    this.$router.push({
      name: "goods-model",
      params: {
        operation,
        modelCode: row.code
      },
      query: {
        serie: this.seriesInPage.code
      }
    })
  };
  /**
   * @description 上下架车型
   * @function modelEnabling 上
   * @function modelDiscontinuate 下
   */
  operateModelStatus(row: any) {
    try {
      let msg = "上架";
      let txt = "";
      let fn = modelEnabling;
      if (row.status === "RELEASE" || row.status === 1) {
        msg = "下架";
        txt = "请确保下架前所有经销商车型是否下架，直接下架经销商该车型将一并下架，下架后商城端该车型无法显示，正在进行的活动有关联该车型的将自动取消关联";
        fn = modelDiscontinuate;
      }
      this.$confirm(`确定${msg}${row.name}车型？<p style='${this.textStyle}'>${txt}</p>`, `${msg}车型`, {
        dangerouslyUseHTMLString: true
      }).then(async () => {
        const modelCode = row.code;
        const { data } = await fn(modelCode);
        if (data) {
          this.showMsg(`${msg}成功`);
          await this.adminTableRef.getList();
          this.getSeriesByBrandCode();
        }
      });
    } catch (e) {
      this.log(e);
    }
  }
  async saveSerieForm() {
    let flag = false;
    this.serieFormRef.validate((v: boolean) => {
      flag = v;
    });
    if (!flag) return;
    try {
      let params: any = {
        brandCode,
        logo: this.serieForm.logo,
        name: this.serieForm.name,
        externalCode: this.serieForm.externalCode,
      };
      let fn = addSerie;
      if (this.dialogType === 2) {
        params.code = this.serieForm.code;
        fn = modifySerie;
      }
      const { data } = await fn(params);
      if (data) {
        this.showMsg(`${this.dialogTitle}成功`);
        this.modalVisible = false;
        this.getSeriesByBrandCode();
      }
    } catch (e) {
      this.log(e);
    }
  }
}
</script>
<style lang="scss" scoped>
@import "./style/list-page.scss";
.dfc {
  display: flex;
  justify-content: space-between;
  align-items: center;
  background: #fff;
  padding: 0 15px;
  height: 50px;
  border-bottom: 1px solid #ddd;
}
.dfvc {
  display: flex;
  align-items: center;
  width: calc(100% - 92px);
}
</style>
