// 现场活动新增活动
import dayjs from "dayjs";
import { DETAIL_SITE_AWARDS_PROPS } from "../../const/common";
const SITE_STEP_ARR = [
  {
    label: "活动设置",
    name: "stepActiveSet",
    step: 1
  },
  {
    label: "现场工具",
    name: "stepAward",
    step: 2
  },
  {
    label: "分享设置",
    name: "stepShareSet",
    step: 3
  }
];

// 现场奖项属性
const SITE_AWARDS_PROPS = [
  {
    tag: "checkbox",
    label: "现场互动工具",
    prop: "tool",
    options: [
      {
        label: "现场签到",
        value: 1,
        disabled: true
      },
      {
        label: "留言墙",
        value: 2
      },
      {
        label: "大屏抽奖",
        value: 3
      }
    ]
  },
  {
    label: "奖项设置",
    prop: "awardSet",
    show: "this.form.tool.indexOf(3) > -1"
  }
];
// 现场活动表单规则
const SITE_FORM_RULES = (vm: any) => {
  return {
    posterUrl: { required: true, trigger: "change", message: "请选择活动图片" },
    name: { required: true, trigger: "blur", maxLength: 20, message: "请输入活动名称" },
    activeTime: [
      { required: true, trigger: "change", message: "请选择活动时间" },
      {
        validator: async (rule: any, value: any, callback: any) => {
          if (!value) {
            callback(new Error("请选择活动时间"));
          }
          if (value[0] < Date.now()) {
            callback(new Error("不能选择过去时间"));
          } else if (vm.trueTime) {
            callback();
          } else {
            callback(new Error("活动时间冲突"));
          }
        }
      }
    ],
    regTime: [
      { required: true, message: "请选择活动签到时间" },
      {
        validator: (rule: any, value: any, callback: any) => {
          let { activeTime, regTime } = vm.siteForm;
          let [validFrom, validTo] = activeTime;
          let [signinValidFrom, signinValidTo] = regTime;
          if (signinValidTo < validFrom || signinValidFrom > validFrom) {
            callback(new Error("签到开始时间不能晚于活动开始时间,签到结束时间不能早于活动开始时间"));
          } else {
            callback();
          }
        }
      }
    ],
    memberLimit: { required: true, trigger: "blur", message: "请选择活动人数限制" },
    limitPerson: {
      pattern: /^[1-9]\d*$/,
      required: vm.siteForm && vm.siteForm.memberLimit > 0,
      maxLength: 6,
      trigger: "blur",
      message: "请输入活动限制人数"
    },
    rule: { required: true, trigger: "blur", message: "请输入次数限制" },
    location: { required: true, trigger: "change", message: "请选择活动地点" },
    information: { required: true, trigger: "change", message: "请选择" },
    description: [
      { required: true, trigger: "change", message: "请输入活动详情" },
      {
        trigger: "change",
        validator: (rule: any, value: any, callback: any) => {
          console.log(value.length);
          if (value.length > 10000) {
            callback(new Error("活动详情超出字数限制"));
          } else {
            callback();
          }
        }
      }
    ],
    tool: { required: true, trigger: "change", message: "请选择" }
  };
};
// 现场活动设置属性
const SITE_ACTIVE_PROP = (vm: any) => {
  let arr = [
    {
      tag: "upload",
      label: "活动图片",
      prop: "posterUrl",
      size: 3072,
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
      changeTime: vm.changeActTime,
      render(h: any) {
        return h("div", {}, [
          h("span", { class: "common_tip mr-15" }, vm.activeLen > 0 ? `当前时间段有${vm.activeLen}场同类型活动` : ""),
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
      tag: "datePicker",
      type: "datetimerange",
      prop: "regTime",
      label: "活动签到时间",
      format: "yyyy-MM-dd HH:mm",
      tip: "签到开始时间不能晚于活动开始时间,签到结束时间不能早于活动开始时间",
      pickerOptions: {
        disabledDate(time: any) {
          if (vm.siteForm.activeTime) {
            return time < Date.now() - 24 * 60 * 60 * 1000 || time > vm.siteForm.activeTime[1];
          } else {
            return time < Date.now() - 24 * 60 * 60 * 1000;
          }
        }
      },
      changeTime: vm.changeRegTime
    },
    {
      tag: "switch",
      prop: "isHot",
      label: "热门",
      inlineTip: true,
      tip: "开启热门后活动将限时在商城首页热门活动中"
    },
    {
      prop: "location",
      label: "活动地点",
      placeholder: "请选择位置"
    },

    {
      prop: "memberLimit",
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
        }
      ]
    },
    {
      prop: "description",
      label: "活动详情"
    }
  ];
  if (vm.sysPlat !== "agent" && vm.mode !== "hosted") {
    arr.splice(2, 5);
  }
  return arr;
};
const DETAIL_ACTIVE_PROP = (vm: any) => {
  let arr: Array<any> = [
    {
      label: "活动图片",
      prop: "posterUrl"
    },
    {
      label: "活动名称",
      tag: "text",
      prop: "campaignName"
    },
    {
      tag: "text",
      prop: "validFrom",
      label: "活动时间",
      show: "this.form.campaignStatus>0",
      formatter(val: any, row: any) {
        return row.validFrom
          ? `${dayjs(row.validFrom).format("YYYY-MM-DD HH:mm")} ~  ${dayjs(row.validTo).format("YYYY-MM-DD HH:mm")}`
          : "-";
      }
    },
    {
      tag: "text",
      prop: "signinValidFrom",
      label: "活动签到时间",
      show: "this.form.campaignStatus>0",

      formatter(val: any, row: any) {
        return row.signinValidFrom
          ? `${dayjs(row.signinValidFrom).format("YYYY-MM-DD HH:mm")} ~  ${dayjs(row.signinValidTo).format(
              "YYYY-MM-DD HH:mm"
            )}`
          : "-";
      }
    },
    {
      tag: "text",
      prop: "isHot",
      label: "热门",
      show: "this.form.campaignStatus>0",
      formatter(val: any, row: any): string {
        return val ? "开启" : "关闭";
      }
    },
    {
      tag: "text",
      prop: "location",
      label: "活动地点",
      show: "this.form.campaignStatus>0"
    },

    {
      tag: "text",
      prop: "memberLimit",
      label: "活动人数限制",
      show: "this.form.campaignStatus>0",
      formatter(val: any, row: any): string {
        return val > 0 ? `限制人数${val}人` : "不限制人数";
      }
    },
    {
      tag: "text",
      prop: "information",
      label: "报名填写资料",
      show: "this.form.campaignStatus>0",
      formatter(val: any, row: any): string {
        return `姓名，手机号`;
      }
    },
    {
      prop: "description",
      label: "活动详情"
    }
  ];

  return arr;
};

class siteConfig {
  vm: any;
  const: any;
  constructor(vm: any) {
    this.vm = vm;
    this.const = {
      SITE_STEP_ARR,
      SITE_AWARDS_PROPS,
      DETAIL_SITE_AWARDS_PROPS,
      SITE_FORM_RULES: SITE_FORM_RULES(this.vm),
      SITE_ACTIVE_PROP: SITE_ACTIVE_PROP(this.vm),
      DETAIL_ACTIVE_PROP: DETAIL_ACTIVE_PROP(this.vm)
    };
  }
}
export default siteConfig;
