import { formatDate } from "@/utils";

const BANNER_RULES = {
  type: { required: true, trigger: "change", message: "请选择关联内容" },
  info: { required: true, trigger: "change", message: "请选择" },
  url: { required: true, trigger: "change", message: "请选择Banner图片" }
};
const CONTENT_ARR = [
  {
    label: "活动",
    value: 0
  },
  {
    label: "商品",
    value: 1
  }
];
const BANNER_SET_PROPS = (vm: any) => [
  {
    tag: "radio",
    prop: "type",
    label: "关联内容"
  },
  {
    prop: "info",
    label: "关联活动"
  },
  {
    tag: "upload",
    label: "Banner图片",
    prop: "url",
    action: "",
    size: 3072,
    type: "picture-card",
    tip: "支持格式：jpg、png、bmp，单个文件不能超过3MB，建议尺寸375*132px（或相同比例）",
    fixedNumber: [375, 132],
    slot: (h: any) => {
      return h("i", { class: "el-icon-plus" }, null);
    }
  }
];
const GIFT_BANNER_PROPS = (vm: any) => [
  {
    prop: "info",
    label: "关联活动"
  },
  {
    tag: "upload",
    label: "Banner图片",
    size: 3072,
    prop: "url",
    tip: "支持格式：jpg、png、bmp，单个文件不能超过3MB，建议尺寸355*177px（或相同比例）",
    fixedNumber: [355, 177],
  }
];
const ACTIVE_COLUMNS: Array<any> = [
  {
    title: "",
    slot: true,
    slotName: "radio",
    width: 60
  },
  {
    title: "活动编号",
    key: "code"
  },
  {
    title: "活动名称",
    key: "name"
  },
  {
    title: "活动类型",
    key: "typeStr"
  },
  {
    title: "活动时间",
    key: "createdTime",
    render: (h: any, row: any) => {
      let valid = row.validFrom ? `${formatDate(row.validFrom)}~${formatDate(row.validTo)}` : "-";
      return h("span", {}, valid);
    }
  }
];

class ConstConfig {
  vm: any;
  const: any;
  constructor(vm: any) {
    this.vm = vm;
    this.const = {
      BANNER_RULES,
      ACTIVE_COLUMNS,
      GIFT_BANNER_PROPS: GIFT_BANNER_PROPS(this.vm),
      CONTENT_ARR,
      BANNER_SET_PROPS: BANNER_SET_PROPS(this.vm)
    };
  }
}
export default ConstConfig;
