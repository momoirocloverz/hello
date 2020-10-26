import { Component, Vue, Ref } from "vue-property-decorator";
import {
  dealerEnabling,
  dealerDiscontinuate,
  dealerUnitPrice,
  applyLowPrice,
  dealerMaxRule
} from "@/api";
const BigNumber = require('bignumber.js');

@Component
export default class AgentDialogMixin extends Vue {
  @Ref() readonly modelFormRef: element.Refs;
  adminTableRef: any;
  readonly operationBtns: any = [
    {
      prop: (row: any) => {
        return {
          disabled: row.msgType === "1",
        };
      },
      show: (row: any) => this.accessIsOpened("PERM:MODEL:EDIT") && this.isRelease(row),
      text: "下架",
      atClick: (row: any) => this.dealerDiscontinuate(row)
    },
    {
      prop: (row: any) => {
        return {
          disabled: row.msgType === "1",
        };
      },
      show: (row: any) => this.accessIsOpened("PERM:MODEL:EDIT") && !this.isRelease(row),
      text: "上架",
      atClick: (row: any) => this.openModal(row, 1)
    },
    {
      prop: (row: any) => {
        return {
        };
      },
      show: (row: any) => this.accessIsOpened("PERM:MODEL:EDIT") && this.isRelease(row),
      text: "价格设置",
      atClick: (row: any) => this.openModal(row, 2)
    }
  ];
  /**
   * @description 限价表单验证
   */
  get modelFormRule() {
    const reservationValidatePass = (rule: any, value: string, callback: any) => {
      if (Number(value) > 100000) {
        callback(new Error('人数不可大于100,000'));
      } else if (Number(value) < 0) {
        callback(new Error('人数不可小于0'));
      } else {
        callback();
      }
    };
    const unitPriceValidatePass = (rule: any, value: string, callback: any) => {
      if ((Number(value)) > 2000) {
        callback(new Error("金额不能超过2000万元"));
      } else if (Number(value) <= 0) {
        callback(new Error("金额需大于0"));
      } else {
        callback();
      }
    };
    return {
      unitPrice: [
        { required: true, message: '请输入优惠报价', trigger: 'change' },
        { validator: unitPriceValidatePass, trigger: ['blur', 'change'] }
      ],
      initialReservationCount: [{ validator: reservationValidatePass, trigger: ['blur', 'change'] }],
    }
  };
  get dialogTitle() {
    switch (this.dialogType) {
      case 3:
        return "低价申请";
      case 2:
        return "设置价格";
      default:
        return "上架车型";
    }
  };
  maxRuleInPage: any = {};
  seriesInPage: any = {};
  modelForm: any = {
    modelCode: '',
    unitPrice: '',
    maxDiscount: '',
    initialReservationCount: '',
    reason: ''
  };
  dialogType: number = 1;
  modalVisible: boolean = false;
  modelFormLoading: boolean = false;
  formMirrorForModel: any = {};
  _infoRow: any;
  /**
   * @description 传递给btn选择显示
   */
  isRelease(row: any) {
    return row.dealerModelStatus === "RELEASE" || row.dealerModelStatus === 0
  };
  dealerDiscontinuate(row: any) {
    const textStyle = "color:#888;font-size:13px";
    const txt = "下架后商城端该车型无法显示，正在进行的活动有关联该车型的将自动取消关联";
    this.$confirm(
      `确定下架车型-${row.name}
      <p style='${textStyle}'>${txt}</p>`,
      '下架车型',
      {
        dangerouslyUseHTMLString: true
      })
      .then(async () => {
        try {
          const params = { modelCode: row.code };
          const { data } = await dealerDiscontinuate(params);
          if (data) {
            this.showMsg("下架成功");
            this.adminTableRef && this.adminTableRef.getList();
            if (this.$route.name === 'goods-modelinfo') {
              this._infoRow.dealerModelStatus = 1;
            }
          }
        } catch (e) {
          this.log(e)
        }
      })
  }
  /**
   * @description 打开弹窗，并获取经销商车型最大优惠
   */
  async openModal(row: any, dialogType: number) {
    this.dialogType = dialogType;
    this.formMirrorForModel = row;
    this.modelForm.modelCode = row.code;
    this.modelForm.reason = '';
    this.modelForm.initialReservationCount = row.initialReservationCount;
    await this.dealerMaxRule(row);
    if (dialogType > 1) {
      this.modelForm.id = row.id;
    }
    this.modalVisible = true;
    this.$nextTick(() => {
      this.modelFormRef && this.modelFormRef.clearValidate();
    })
  };
  /**
   * 获取最大优惠参数
   */
  async dealerMaxRule(row: any) {
    const modelCode = row.code;
    this.modelFormLoading = true;
    try {
      const { data } = await dealerMaxRule(modelCode);
      this.seriesInPage.name = data.seriesName;
      if (data.maxDealerDiscountPrice) {
        this.modelForm.maxDiscount = Number(BigNumber(data.maxDealerDiscountPrice).dividedBy(10000))
      } else {
        this.modelForm.maxDiscount = ''
      }
      this.modelForm.unitPrice = '';
      this.modelFormLoading = false;
      if (this.dialogType === 2 && data.salesPrice) {
        this.modelForm.unitPrice = Number(BigNumber(data.salesPrice).dividedBy(10000));
      }

      data.dealerModelStatus = row.dealerModelStatus;
      this.maxRuleInPage = data;
      return Promise.resolve()
    } catch (e) {
      this.modelFormLoading = false;
      this.log(e)
    }
  }
  saveModelForm() {
    let flag = false;
    this.modelFormRef.validate((v: boolean) => flag = v)
    if (!flag) return;
    if (this.dialogType < 3) {
      this.putOnShelve()
    } else {
      this.applyLowPrice()
    }
  };
  /**
   * @description 低价申请
   */
  async applyLowPrice() {
    try {
      const params = {
        discountType: 'DISCOUNT_PRICE',
        reason: this.modelForm.reason,
        maxDiscount: Number(BigNumber(this.modelForm.maxDiscount).multipliedBy(10000)),
        modelCode: this.formMirrorForModel.code
      }
      const { data } = await applyLowPrice(params);
      if (data) {
        this.modalVisible = false;
        this.showMsg('操作成功');
        this.adminTableRef && this.adminTableRef.getList();
      }
    } catch (e) {
      this.log(e)
    }
  };
  /**
   * @description 上架车型、设置价格
   */
  async putOnShelve() {
    let { dialogType, modelForm } = this
    try {
      let msg = "上架"
      let fn = dealerEnabling;
      if (dialogType === 2) {
        msg = "设置价格";
        fn = dealerUnitPrice;
      }
      this.modalVisible = false;
      const params = {
        ...modelForm,
        unitPrice: Number(BigNumber(modelForm.unitPrice).multipliedBy(10000))
      };
      const { data } = await fn(params);
      if (data) {
        this.modalVisible = false;
        this.showMsg(`${msg}成功`);
        this.adminTableRef && this.adminTableRef.getList();
        if (this.$route.name === 'goods-modelinfo') {
          this._infoRow.dealerModelStatus = 0;
        }
      }
    } catch (e) {
      this.log(e)
    }
  };
}