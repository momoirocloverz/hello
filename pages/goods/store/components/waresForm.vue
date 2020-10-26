<template>
  <div class="wares_form">
    <div class="bgw"
         id="base">
      <b> 当前类目：</b>
      {{ categoryName || selectText}}
      <el-button size="small"
                 v-if="operateType==='add'"
                 @click="$emit('changeCategory')">更换类目</el-button>
      <el-button type="primary"
                 size="small"
                 @click="preview">预览</el-button>
    </div>
    <el-card class="box-card topbtns">
      <a href="#base"
         class="el-button el-button--mini">基本信息</a>
      <a href="#standard"
         class="el-button el-button--mini">规格信息</a>
      <a href="#content"
         class="el-button el-button--mini">图文描述</a>
    </el-card>

    <el-card class="box-card">
      <div slot="header">
        <b>基本信息</b>
      </div>
      <el-form :model="_baseForm"
               :rules="baseFormRule"
               ref="baseFormRef"
               label-width="140px"
               size="small"
               class="card_content"
               @submit.native.prevent>
        <el-form-item label="商品名称："
                      prop="name">
          <el-input v-model.trim="_baseForm.name"
                    class="dsfs"
                    placeholder="请输入商品名称"
                    clearable
                    :maxlength="100"
                    size="small">
            <span slot="suffix">{{_baseForm.name.length}}/100</span>
          </el-input>
        </el-form-item>
        <el-form-item label="封面图："
                      prop="coverUrl">
          <uploadToAli v-model="_baseForm.coverUrl"
                       :accept='accept'
                       :size="1024 * 3" />
          <div class="gray_txt">{{tip_txt}}</div>
        </el-form-item>
        <el-form-item label="主图："
                      prop="mainImg">
          <uploadToAli v-model="_baseForm.mainImg"
                       :accept="accept"
                       :max="5"
                       :size="1024 * 3"
                       multiple />
          <div class="gray_txt">{{tip_txt}}，最多5张图片</div>
        </el-form-item>

        <h4 class="attrs">商品属性</h4>
        <el-form-item label="品牌名称："
                      prop="brand">
          <el-input v-model.trim="_baseForm.brand"
                    placeholder="请输入品牌名称"
                    :maxlength="10"
                    clearable>
            <span slot="suffix">{{_baseForm.brand.length}}/10</span>
          </el-input>
        </el-form-item>
        <el-form-item label="最小包装："
                      prop="minPack">
          <el-input v-model.trim="_baseForm.minPack"
                    :maxlength="10"
                    placeholder="请输入最小包装"
                    clearable>
            <span slot="suffix">{{_baseForm.minPack.length}}/10</span>
          </el-input>
        </el-form-item>
        <el-form-item label="最小订购量："
                      prop="minOrder">
          <el-input v-model="_baseForm.minOrder"
                    v-formatNum:0="_baseForm.minOrder"
                    placeholder="请输入最小订购量"
                    clearable />
        </el-form-item>
        <el-form-item label="商品类型："
                      id="standard"
                      prop="type">
          <el-radio-group v-model="_baseForm.type">
            <el-radio v-for="item in waresType"
                      :disabled="disabled"
                      :key="item.value"
                      :label="item.value">{{item.label}}</el-radio>
          </el-radio-group>
        </el-form-item>
        <el-form-item label="适用车系："
                      v-show="_baseForm.type==1"
                      prop="vehicle">
          <el-button class="tags"
                     v-if="!disabled"
                     @click="getSeriesByBrandCode">点击选择</el-button>
          <el-tag class="tags"
                  v-for="tag in vehicleModelChoosen"
                  :key="tag.code">
            {{tag.name}}
            <el-icon class="el-icon-close"
                     v-if="!disabled"
                     @click.native.stop="removeVehicleTag(tag)" />
          </el-tag>
        </el-form-item>
      </el-form>
    </el-card>

    <el-card class="box-card">
      <div slot="header">
        <b>规格信息</b>
        <span class="tips">商品默认包邮（免运费），运费不支持单独设置，若涉及到运费，请设置“零售价格时”加入运费金额</span>
      </div>
      <div class="card_content">
        <el-form ref="skuTitleListRef"
                 size="small"
                 @submit.native.prevent
                 label-width="0">
          <el-form-item prop="skuTitleList"
                        v-for="(skuItem,skuIndex) in _skuTitleList"
                        :key="skuItem.key">
            <div>
              <el-input v-model.trim="skuItem.skuLabel"
                        class="standard_list"
                        :maxlength="10"
                        @blur="checkIsReapeat"
                        :disabled="operateType==='edit' && skuItem.disabled"
                        clearable>
                <span slot="suffix">{{skuItem.skuLabel.length}}/10</span>
              </el-input>
              <el-link type="danger"
                       :underline="false"
                       v-if="handleDeleteBtn(skuIndex+1)"
                       @click.native="removeSkuItem(skuIndex)">删除</el-link>
            </div>
            <div class="mt5">
              <el-button :disabled="!handleAddSkuBtn(skuIndex+1)"
                         @click="openChildModal(skuItem,skuIndex)"
                         class="tags">
                <el-icon class="el-icon-plus" />
              </el-button>
              <el-tag class="tags"
                      v-for="(item,tagIndex) in handleskuTitleList(skuIndex+1)"
                      :key="tagIndex">
                {{item.label}}
                <el-icon class="el-icon-close"
                         @click.native.stop="removeStandard(item,`skuTag_${skuIndex+1}`)" />
              </el-tag>
            </div>
          </el-form-item>
          <el-form-item>
            <el-button @click="addSkuItem"
                       :disabled="_skuTitleList.length>=3"> 添加</el-button>
          </el-form-item>
        </el-form>
        <customizeTable :skuTag_1="skuTag_1"
                        :skuTag_2="skuTag_2"
                        :skuTag_3="skuTag_3"
                        :skuTitleList="_skuTitleList"
                        :keyList.sync="keyList"
                        :skuPriceGroup.sync="skuPriceGroup" />
      </div>
    </el-card>

    <el-card class="box-card"
             id="content">
      <div slot="header">
        <b>图文描述</b>
      </div>
      <div>
        <vueQuillEditor :content.sync="_baseForm.desc" />
      </div>
    </el-card>
    <div class="footer">
      <el-button @click="cancel"
                 size="small">取消</el-button>
      <template v-if="operateType==='add'">
        <el-button @click="_activeStep=0"
                   size="small">上一步</el-button>
        <el-button @click="submitPage(false)"
                   size="small"
                   type="primary">保存</el-button>
        <el-button @click="submitPage(true)"
                   size="small"
                   type="primary">保存并上架</el-button>
      </template>
      <el-button v-else
                 @click="saveModify()"
                 size="small"
                 type="primary">保存</el-button>
    </div>

    <el-dialog title="选择适用车系"
               :visible.sync="modalVisible">
      <el-checkbox-group v-model="vehicleGroupModel"
                         size="small">
        <el-checkbox v-for="item in vehicleGroup"
                     class="rjlvu"
                     :key="item.code"
                     :label="item.code"
                     border>
          {{item.name}}
        </el-checkbox>
      </el-checkbox-group>
      <template slot="footer">
        <el-button size="small"
                   @click="modalVisible=false">取消</el-button>
        <el-button size="small"
                   type="primary"
                   @click="confirmCheck">确定</el-button>
      </template>
    </el-dialog>

    <el-dialog :title="`编辑规格信息（${activeSkuItem.skuLabel}）`"
               :visible.sync="childNameModal">
      <el-form v-if="childNameModal"
               ref="childFormRef"
               @submit.native.prevent
               :model="childNameForm"
               :rules="{childName:[{required:true,message:'请输入子类型名称',trigger:'blur'}]}"
               label-width="140px">
        <el-form-item prop="childName"
                      label="子类型名称：">
          <el-input v-model.trim="childNameForm.childName"
                    placeholder="请输入子类型名称"
                    :maxlength="10"
                    clearable>
            <span slot="suffix">{{childNameForm.childName.length}}/10</span>
          </el-input>
        </el-form-item>
      </el-form>
      <div slot="footer">
        <el-button size="small"
                   @click="childNameModal=false">取消</el-button>
        <el-button size="small"
                   type="primary"
                   @click="confirmChild">确定</el-button>
      </div>
    </el-dialog>

    <previewDialog :previewModal.sync="previewModal"
                   :baseForm="_baseForm" />

    <el-backtop target="#theme-container-main" />
  </div>
</template>

<script lang='ts'>
import { Component, Prop, PropSync, Vue, Ref, Watch } from "vue-property-decorator";
import vueQuillEditor from "@/components/vue-quill-editor/index.vue";
import uploadToAli from "@/components/upload-to-ali/src";
import customizeTable from "./customizeTable.vue";
import previewDialog from "./preview-modal.vue";
import { waresType, baseFormRule, baseFormRule2, numReg, DEVIDE_CHAR } from "../const/wares-vars";
import {
  seriesBrandCode,
  dealerSeriesByBrand,
  product_detail_api
} from "@/api";
import deepClone from '@/utils/deepClone';
const brandCode = 'geely';
const standardMsg = "请完善规格信息";
const warn = "warning";

@Component({
  components: {
    vueQuillEditor,
    uploadToAli,
    customizeTable,
    previewDialog
  }
})
export default class WaresForm extends Vue {
  private readonly parseInt = parseInt;
  private readonly tip_txt: string = "支持格式：jpg、png、jpeg，单个文件不能超过3MB";
  private readonly accept: string = 'image/png,image/jpg,image/jpeg';
  private readonly waresType = waresType;
  private get baseFormRule() {
    return String(this._baseForm.type) === '1' ? baseFormRule : baseFormRule2
  };
  private previewModal: boolean = false;
  @Ref('baseFormRef') readonly baseFormRef: element.Refs;
  @Ref('skuTitleListRef') readonly skuTitleListRef: element.Refs;
  @Ref('childFormRef') readonly childFormRef: element.Refs;


  @Prop({ type: String, default: "" }) selectText: string;
  @PropSync('properties', { type: Array, default: () => [] }) _properties: any;
  @PropSync('specForSubmit', { type: Array, default: () => [] }) _specForSubmit: any;
  @PropSync("activeStep", { type: Number, default: () => { return {}; } }) _activeStep: number;

  // 基本信息
  @PropSync("baseForm", {
    type: Object,
    default: () => {
      return {};
    }
  })
  _baseForm: any;
  categoryName: string = '';
  baseFormOrigin: any = {
    brand: "",
    category: "",
    coverUrl: "",
    mainImg: [],
    minOrder: "",
    minPack: "",
    productCode: "",
    name: "",
    desc: "",
    type: 1,
    vehicle: []
  }
  // 规格
  @PropSync("skuTitleList", {
    type: Array,
    default: () => {
      return []
    }
  })
  _skuTitleList: any;
  @PropSync("introduction", {
    type: String,
    default: ""
  })
  _introduction: any;

  propertiesOrigin: any[] = [];

  activeSkuItem: any = {};
  activeIndex: any = 1;
  vehicleGroupModel: any = [];
  vehicleGroup: any[] = [];
  vehicleModelChoosen: any[] = [];
  modalVisible: boolean = false;
  childNameModal: boolean = false;
  childNameForm = {
    childName: ''
  }

  skuTag_1: any[] = [];
  skuTag_2: any[] = [];
  skuTag_3: any[] = [];
  skuPriceGroup: any = {};
  keyList: string[] = [];
  private get operateType() {
    return this.$route.params.operateType
  }
  private get detailId(): number | string {
    return this.$route.params.id;
  };
  get disabled() {
    return this.$route.params.operateType === 'edit'
  }
  get isAgent() {
    return this.$route.query.sysPlat === 'agent'
  }

  handleskuTitleList(index: number) {
    return (<any>this)[`skuTag_${index}`]
  }
  // 编辑状态下不可删除
  handleDeleteBtn(index: number) {
    const s = (<any>this)[`skuTag_${index}`]
    return (s && !s.find((e: any) => e.disabled))
  }
  // 最多20个
  handleAddSkuBtn(index: number) {
    const rjl = (<any>this)[`skuTag_${index}`].length;
    return rjl < 20;
  }
  preview() {
    this.previewModal = true;
  }
  /**
   * @description 车系列表
   */
  async getSeriesByBrandCode() {
    try {
      let fn = seriesBrandCode
      if (this.$route.query.sysPlat === "agent") {
        fn = dealerSeriesByBrand
      }
      const { data } = await fn(brandCode);
      this.vehicleGroupModel = this.vehicleModelChoosen.map(e => {
        return e.code
      });
      this.vehicleGroup = data || [];
      if (Number(this._baseForm.type) === 1) {
        this.modalVisible = true;
      }
    } catch (e) {
      this.log(e)
    }
  }
  confirmCheck() {
    this.vehicleModelChoosen = this.vehicleGroup.filter(e => {
      return this.vehicleGroupModel.indexOf(e.code) > -1;
    })
    this.modalVisible = false;
    this.vehicleFormatValue()
  }
  vehicleFormatValue() {
    let res: any[] = [];
    this.vehicleModelChoosen.forEach(e => {
      res.push({
        code: e.code,
        type: this.operateType === 'add' ? 1 : 0
      })
    })
    this._baseForm.vehicle = res
  }
  removeVehicleTag(tag: any) {
    const index = this.vehicleModelChoosen.indexOf(tag);
    index > -1 && this.vehicleModelChoosen.splice(index, 1);
    this.vehicleFormatValue()
  }
  addSkuItem() {
    let { _skuTitleList } = this
    if (_skuTitleList.length >= 3) {
      return
    }
    _skuTitleList.push({
      key: Date.now(),
      skuLabel: ""
    })
  }
  removeSkuItem(index: number, needConfirm = true, removeTitle = true) {
    const fn = () => {
      let { _skuTitleList } = this
      removeTitle && _skuTitleList.splice(index, 1)
      let sl = _skuTitleList.length;
      if (index === 0) {
        this.skuTag_1 = [...this.skuTag_2];
        this.skuTag_2 = [...this.skuTag_3]
      }
      if (index === 1) {
        this.skuTag_2 = [...this.skuTag_3];
      }
      sl === 1 && (this.skuTag_2 = []);
      sl === 0 && (this.skuTag_1 = []);
      this.skuTag_3 = [];
    }
    needConfirm && this.$confirm('确定删除吗', '提示')
      .then(fn).catch(() => { });
    !needConfirm && fn();
  }
  openChildModal(skuItem: any, index: number) {
    if (!skuItem.skuLabel) {
      return this.showMsg('请输入规格名称', 'warning')
    }
    this.childNameForm.childName = '';
    this.childNameModal = true;
    this.activeSkuItem = skuItem;
    this.activeIndex = index
  };
  confirmChild() {
    this.childFormRef.validate((v: boolean) => {
      if (v) {
        let ll: any[] = (<any>this)[`skuTag_${this.activeIndex + 1}`]
        if (ll.find(e => e.label === this.childNameForm.childName)) {
          this.showMsg('名称重复', 'warning')
          return
        }
        ll.push({
          label: this.childNameForm.childName,
          disabled: false
        });
        this.childNameForm.childName = "";
        this.childNameModal = false
      }
    })
  }
  removeStandard(item: any, tagArrName: any) {
    const index = (<any>this)[tagArrName].findIndex((e: any) => e.label === item.label)
    index > -1 && (<any>this)[tagArrName].splice(index, 1);
    if (this.skuTag_3.length === 0) {
      this.removeSkuItem(2, false, tagArrName === 'skuTag_3')
    }
    if (this.skuTag_2.length === 0) {
      this.removeSkuItem(1, false, tagArrName === 'skuTag_2')
    }
    if (this.skuTag_1.length === 0) {
      this.removeSkuItem(0, false, tagArrName === 'skuTag_1')
    }
  };

  private cancel() {
    this.$router.replace("/goods/store/storeList");
  }
  /**
   * @description 检查一级规格名称重复
   */
  msgBox: any;
  checkIsReapeat(): boolean {
    const standardLen = this._skuTitleList.length;
    let tmp = this._skuTitleList.map((e: any) => e.skuLabel);
    tmp = [...new Set(tmp)]
    if (tmp.length !== standardLen) {
      this.msgBox && this.msgBox.close();
      this.msgBox = this.showMsg('一级规格名称重复', warn)
      return false
    }
    return !0
  }
  formatBeforeSave(): boolean {
    const standardLen = this._skuTitleList.length;
    const group = this.skuPriceGroup;
    const spec = [];
    let flag = true;
    this._specForSubmit = [];
    const standardWarn = "子规格不可为空";
    if (standardLen < 1) {
      this.showMsg(standardMsg, warn);
      return false
    }
    if (!this.checkIsReapeat()) return !1;
    const bo = (standardLen === 1 && this.skuTag_1.length < 1)
      || (standardLen === 2 && this.skuTag_2.length < 1)
      || (standardLen === 3 && this.skuTag_3.length < 1);
    if (bo) {
      this.showMsg(standardWarn, warn);
      return false
    }
    // sku: [ { price: stock: surplusStock:  specsValue: [白色，10米]}]
    for (let key in group) {
      if (this.keyList.indexOf(key) < 0 || key.split(DEVIDE_CHAR).length !== standardLen) continue;
      if (!numReg.test(group[key].value)) {
        this.showMsg('所有价格须为大于0的数字，最多两位小数', 'warning');
        flag = false
        break;
      }
      if (this.isAgent) {
        if (!/^\d\d*$/.test(group[key].stock)
          || group[key].stock < 0
          || group[key].stock > 1000000
        ) {
          this.showMsg('所有库存须为0~1,000,000之间的整数', 'warning');
          flag = false
          break;
        }
      }
      if (group[key].value <= 0 || group[key].value > 100000) {
        this.showMsg('所有金额须在0~100,000之间', 'warning');
        flag = false
        break;
      }
      if (this.keyList.indexOf(key) > -1) {
        let res: any = {
          // 这里的是固定写法，影响编辑解析
          skuId: group[key].skuId,
          specsValue: [{ value: key }],
          stock: group[key].stock,
          price: group[key].value,
          spuId: group[key].spuId
        }
        group[key].stockId && (res.stockId = group[key].stockId);
        spec.push(res)
      }
    }
    // console.log(this.keyList)
    if (flag) {
      this.$set(this, '_specForSubmit', spec);
      this._properties.splice(0);

      this._skuTitleList.forEach((e: any, viewOrder: number) => {
        if (e.skuLabel) {
          let value = e.skuLabel
            + DEVIDE_CHAR
            + (<any>this)[`skuTag_${viewOrder + 1}`]
              .map((val: any) => val.label)
              .join(DEVIDE_CHAR);

          let propItem: any = { value, viewOrder }
          if (this.operateType === 'edit') {
            const item = this.propertiesOrigin.find(e => e.value === value)
            if (item) {
              propItem.id = item.id;
              propItem.spuId = item.spuId;
            }
          }
          this._properties.push(propItem)
        }
      })
      if (this._properties.length < 1) {
        return this.showMsg(standardMsg, warn)
      }
    }
    // console.log(spec, this._specForSubmit)
    return flag;
  }
  submitPage(forWhat: string) {
    let b = this.formatBeforeSave()
    if (!b) return;
    this.baseFormRef.validate((v: boolean) => {
      if (v) {
        this.baseFormOrigin = deepClone(this._baseForm);
        this.$emit('submitPage', forWhat);
      }
    })
  };
  saveModify() {
    let b = this.formatBeforeSave()
    if (!b) return;
    this.baseFormRef.validate((v: boolean) => {
      if (v) {
        this.baseFormOrigin = deepClone(this._baseForm);
        this.$emit('saveModify');
      }
    })
  }

  /**
   * @description 关键函数->返回的数据进行格式化
   */
  private async getDetailInfo() {
    try {
      this.skuTag_1 = []
      this.skuTag_2 = []
      this.skuTag_3 = []
      let { data } = await product_detail_api(this.detailId);
      this._baseForm = {
        name: data.name,
        brand: data.brand,
        coverUrl: data.coverUrl,
        mainImg: data.mainImg,
        minOrder: data.minOrder,
        minPack: data.minPack,
        desc: data.desc,
        status: data.status,
        type: data.type,
        vehicle: data.vehicle,
      };

      this.categoryName = data.categoryName;
      this.$nextTick(() => {
        this.baseFormOrigin = deepClone(this._baseForm);
      })

      const { properties, specs, vehicleNames } = data;
      specs.forEach((e: any) => {
        const key = e.specsValue[0].value
        let res: any = {
          value: e.price,
          stock: e.surplusStock,
          stockId: e.stockId,
          skuId: e.skuId,
          spuId: e.spuId
        }
        this.$set(this.skuPriceGroup, key, res)
      });
      this.vehicleModelChoosen = vehicleNames.map((e: any, index: number) => {
        return { name: e, code: data.vehicle[index].code }
      })

      this.propertiesOrigin = properties;

      properties.forEach((e: any, index: number) => {
        e.value.split(DEVIDE_CHAR).forEach((v: any, i: number) => {
          i === 0 && this._skuTitleList.push({
            skuLabel: v,
            key: Math.random(),
            disabled: true
          });
          if (i > 0) {
            (<any>this)[`skuTag_${index + 1}`].push({
              label: v,
              spuId: e.spuId,
              disabled: true
            })
          }
        });
      })
    } catch (error) {
      this.log(error);
    }
  };
  isModified() {
    return JSON.stringify(this._baseForm) !== JSON.stringify(this.baseFormOrigin)
  }

  created() {
    this.baseFormOrigin = deepClone(this._baseForm);
    if (this.operateType === 'edit') {
      this.getDetailInfo()
    }
  };
}
</script>
<style lang="scss">
@import "../style/ware-form.scss";
</style>