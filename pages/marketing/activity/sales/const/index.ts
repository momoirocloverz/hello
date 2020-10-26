// 促销活动新增活动
import dayjs from "dayjs";

const SALES_STEP_ARR = [
  {
    ref: "activeRef",
    label: "活动设置",
    name: "stepActiveSet",
    step: 1
  },
  {
    ref: "activeRef",
    label: "团购商品",
    name: "stepGroupGoods",
    step: 2
  },
  {
    ref: "shareSetRef",
    label: "分享设置",
    name: "stepShareSet",
    step: 3
  }
];
// 促销活动设置属性
const SALES_ACTIVE_PROP: any = (vm: any) => {
  let arr = [
    {
      tag: "upload",
      label: "活动图片",
      size: 3072,
      prop: "campaignImageUrl",
      type: "picture-card",
      tip: "支持格式：jpg、png、jpeg，单个文件不能超过3MB，建议尺寸710*386px（或相同比例）",
      fixedNumber: [710, 386]
    },
    {
      label: "活动名称",
      tag: "input",
      prop: "name",
      placeholder: "活动名称",
      maxLength: 20
    },

    {
      tag: "datePicker",
      type: "datetimerange",
      prop: "activeTime",
      label: "活动时间",
      format: "yyyy-MM-dd HH:mm",
      pickerOptions: {
        disabledDate(time: any) {
          return time < Date.now() - 24 * 60 * 60 * 1000;
        }
      },
      changeTime: vm.changeTime,
      render(h: any) {
        return h("div", {}, [
          h(
            "span",
            { class: "common_tip mr-15" },
            vm.activeLen > 0 ? `当前时间段有${vm.activeLen}场同类型活动，促销活动同一时间段内不允许有多场` : ""
          ),
          h(
            "span",
            {
              class: "cursor primary-text",
              on: {
                click: () => vm.showActiveDialog()
              }
            },
            "活动查询"
          )
        ]);
      }
    },
    {
      tag: "switch",
      prop: "isHot",
      label: "热门",
      inlineTip: true,
      tip: "开启热门后活动将限时在商城首页热门活动中"
    },

    {
      prop: "campaignPeopleLimit",
      label: "活动人数限制"
    },
    {
      tag: "checkbox",
      prop: "information",
      label: "报名填写资料",
      options: [
        {
          label: "姓名",
          value: 1,
          disabled: true
        },
        {
          label: "手机号",
          value: 2,
          disabled: true
        },
        {
          label: "期待提车时间",
          value: 3
        }
      ]
    }
  ];
  if (vm.sysPlat !== "agent" && vm.mode !== "hosted") {
    arr.splice(2, 3);
  }
  return arr;
};
const DETAIL_ACTIVE_PROP: any = (vm: any) => {
  let arr: Array<any> = [
    {
      label: "活动图片",
      prop: "campaignImageUrl"
    },
    {
      label: "活动名称",
      tag: "text",
      prop: "name"
    },

    {
      tag: "text",
      prop: "dateFrom",
      label: "活动时间",
      show: "this.form.dateFrom",
      formatter(val: any, row: any) {
        return row.dateFrom
          ? `${dayjs(row.dateFrom).format("YYYY-MM-DD HH:mm")} ~  ${dayjs(row.dateTo).format("YYYY-MM-DD HH:mm")}`
          : "--";
      }
    },
    {
      tag: "text",
      prop: "isHot",
      label: "热门",
      formatter(val: any, row: any): string {
        return val ? "开启" : "关闭";
      }
    },

    {
      tag: "text",
      prop: "campaignPeopleLimit",
      label: "活动人数限制",
      formatter(val: any, row: any): string {
        return val === -1 ? "不限制人数" : `限制人数${val}人`;
      }
    },
    {
      tag: "text",
      prop: "information",
      label: "报名填写资料",
      formatter(val: any, row: any): string {
        let _arr = [];
        if (row.hasName) {
          _arr.push("姓名");
        }
        if (row.hasMobile) {
          _arr.push("手机号");
        }
        if (row.hasExpectTime) {
          _arr.push("期望提车时间");
        }
        return _arr.join(", ");
      }
    }
  ];
  return arr;
};

// 促销活动表单规则
const SALES_FORM_RULES = (vm: any) => {
  return {
    campaignImageUrl: { required: true, trigger: "change", message: "请选择活动图片" },
    name: { required: true, trigger: "blur", maxLength: 20, message: "请输入活动名称" },
    activeTime: [
      { required: true, trigger: "change", message: "请选择活动时间" },
      {
        trigger: "change",
        validator: async (rule: any, value: any, callback: any) => {
          if (!value) {
            callback(new Error("请选择活动时间"));
          }
          if (value[0] < Date.now()) {
            callback(new Error("不能选择过去时间"));
          } else if (vm.activeLen < 1) {
            callback();
          } else {
            callback(new Error("活动时间冲突"));
          }
        }
      }
    ],
    regTime: { required: true, trigger: "change", message: "请选择报名时间" },
    campaignPeopleLimit: { required: true, trigger: "blur", message: "请选择活动人数限制" },
    limitPerson: {
      required: vm.salesForm && vm.salesForm.campaignPeopleLimit > 0,
      maxLength: 7,
      pattern: /^[1-9]\d*$/,
      trigger: "blur",
      message: "请输入大于0的活动限制人数"
    },
    rule: { required: true, trigger: "blur", message: "请输入次数限制" },
    memberLimit: { required: true, trigger: "change", message: "请选择活动人数限制" },
    information: { required: true, trigger: "change", message: "请选择报名填写资料" }
  };
};

class salesConfig {
  vm: any;
  const: any;
  constructor(vm: any) {
    this.vm = vm;
    this.const = {
      SALES_STEP_ARR,
      SALES_ACTIVE_PROP: SALES_ACTIVE_PROP(this.vm),
      DETAIL_ACTIVE_PROP: DETAIL_ACTIVE_PROP(this.vm),
      SALES_FORM_RULES: SALES_FORM_RULES(this.vm)
    };
  }
}
export default salesConfig;
