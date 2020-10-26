// 任务类型
import { formatDate } from "@/utils";
import { TASK_TYPE_ARR } from "../../const/common";
import dayjs from "dayjs";
// 抽奖活动新增活动
const LOTTERY_STEP_ARR = [
  {
    ref: "tempRef",
    label: "选择模板",
    name: "stepTemp",
    step: 1
  },
  {
    ref: "activeRef",
    label: "活动设置",
    name: "stepActiveSet",
    step: 2
  },
  {
    ref: "awardRef",
    label: "奖项设置",
    name: "stepAward",
    step: 3
  },
  {
    ref: "shareSetRef",
    label: "分享设置",
    name: "stepShareSet",
    step: 4
  }
];
// 抽奖活动模板属性
const LOTTERY_TEMP_PROP = [
  {
    label: "活动模板",
    prop: "marketingToolStyle"
  }
];
const WHEEL_ARR = [
  {
    id: 1,
    pic: require("@/assets/images/activity/wheel1.png"),
    temp: require("@/assets/images/activity/temp_wheel1.png")
  }
  // {
  //   id: 2,
  //   pic: require("@/assets/images/activity/wheel2.png"),
  //   temp: require("@/assets/images/activity/temp_wheel2.png")
  // }
];
const TICKET_ARR = [
  {
    id: 1,
    pic: require("@/assets/images/activity/ticket1.png"),
    temp: require("@/assets/images/activity/temp_ticket1.png")
  }
  // {
  //   id: 2,
  //   pic: require("@/assets/images/activity/ticket2.png"),
  //   temp: require("@/assets/images/activity/temp_ticket1.png")
  // }
];
const NINE_ARR = [
  {
    id: 1,
    pic: require("@/assets/images/activity/nine1.png"),
    temp: require("@/assets/images/activity/temp_nine1.png")
  }
  // {
  //   id: 2,
  //   pic: require("@/assets/images/activity/nine2.png"),
  //   temp: require("@/assets/images/activity/temp_nine1.png")
  // }
];

// 抽奖互动rules
const LOTTERY_RULES = (vm: any) => {
  return {
    marketingToolType: { required: true, trigger: "change", message: "请选择活动类型" },
    marketingToolStyle: { required: true, trigger: "change", message: "请选择活动模板" },
    posterUrl: { required: true, trigger: "change", message: "请选择活动图片" },
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
          } else if (vm.trueTime) {
            callback();
          } else {
            callback(new Error("活动时间冲突"));
          }
        }
      }
    ],
    chanceTime: { required: true, trigger: "change", message: "请选择抽奖次数" },
    freeChanceTimes: [
      { required: true, trigger: "blur", message: "请输入免费次数" },
      {
        pattern: /^([1-9]\d?|100)$/g,
        message: "请输入1-100的数字",
        trigger: "blur"
      }
    ],
    taskTypes: { required: true, trigger: "change", message: "请选择抽奖任务" },
    chanceLimit: [
      { required: true, message: "请输入任务次数限制" },
      {
        pattern: /^([1-9]\d?|100)$/g,
        message: "请输入1-100的数字",
        trigger: "blur"
      }
    ],
    prizeValidityPeriod: [{ required: true, trigger: "change", message: "请选择领取时限" }],
    dayNum: {
      required: vm.lotteryForm && vm.lotteryForm.prizeValidityPeriod > 0,
      pattern: /^([1-9]|[1-2]\d?|30)$/g,
      message: "请输入1-30的数字",
      trigger: "blur"
    },
    description: { required: true, trigger: "blur", message: "请输入活动规则" },
    awardSet: { required: true, trigger: "blur", message: "请设置奖项规则" }
  };
};
// 抽奖奖项设置属性
const LOTTERY_AWARDS_PROP = [
  {
    label: "奖项设置",
    prop: "awardSet"
  }
];
// 抽奖活动设置属性
const LOTTERY_ACTIVE_PROP: any = (vm: any) => {
  let arr = [
    {
      tag: "upload",
      label: "活动图片",
      size: 3072,
      prop: "posterUrl",
      tip: "支持格式：jpg、png、bmp，单个文件不能超过3MB，建议尺寸710*386px（或相同比例）",
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
      clearable: false,
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
          h("span", { class: "common_tip mr-15" }, vm.activeLen > 0 ? `当前时间段有${vm.activeLen}场同类型活动` : ""),
          h(
            "span",
            {
              class: "cursor primary-text ",
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
      tag: "checkbox",
      prop: "chanceTime",
      label: "抽奖次数",
      options: [{ label: "免费抽奖次数", value: 1 }, { label: "任务抽奖次数", value: 2 }]
    },
    {
      prop: "freeChanceTimes",
      label: "免费抽奖次数",
      show: `this.form.chanceTime.indexOf(1)>-1`
    },
    {
      tag: "checkbox",
      prop: "taskTypes",
      label: "抽奖任务",
      options: TASK_TYPE_ARR,
      show: `this.form.chanceTime.indexOf(2)>-1`
    },
    {
      label: "任务次数限制",
      prop: "chanceLimit",
      show: `this.form.chanceTime.indexOf(2)>-1`
    },
    {
      prop: "prizeValidityPeriod",
      label: "奖品领取时限",
      tip: "注：超过领取时限用户将无法领取奖品"
    },
    {
      label: "活动规则",
      tag: "input",
      type: "textarea",
      row: 10,
      maxLength: 1000,
      prop: "description",
      placeholder: "请输入活动规则"
    }
  ];

  if (vm.sysPlat !== "agent" && vm.mode === "put") {
    arr.splice(2, 2);
  }

  return arr;
};
const DETAIL_ACTIVE_PROP: any = (vm: any) => {
  return [
    {
      tag: "img",
      label: "活动图片",
      prop: "posterUrl"
    },
    {
      label: "活动名称",
      tag: "text",
      prop: "name"
    },
    {
      tag: "text",
      prop: "validFrom",
      label: "活动时间",
      show: `this.form.status>0`,
      formatter(val: any, row: any) {
        return `${dayjs(row.validFrom).format("YYYY-MM-DD HH:mm")} ~  ${dayjs(row.validTo).format("YYYY-MM-DD HH:mm")}`;
      }
    },
    {
      tag: "text",
      prop: "isHot",
      label: "热门",
      show: `this.form.status>0`,
      formatter(val: any, row: any): string {
        return val ? "开启" : "关闭";
      }
    },
    {
      tag: "text",
      prop: "freeChanceTimes",
      label: "免费抽奖次数",
      show: `this.form.freeChanceTimes`,
      formatter(val: any, row: any): string {
        return `${val}次/${row.freeChanceMode === "ALL_TIMES" ? "活动全程" : "每日"}`;
      }
    },
    {
      tag: "text",
      prop: "taskTypes",
      label: "抽奖任务",
      formatter(val: any, row: any): string {
        let strArr: Array<any> = [];
        val.forEach((item: any) => {
          let _obj: any = TASK_TYPE_ARR.find((task: any) => task.value === item);
          _obj && strArr.push(_obj.label);
        });
        return strArr.join(",");
      },
      options: TASK_TYPE_ARR,
      show: `this.form.chanceLimit`
    },
    {
      tag: "text",
      label: "任务次数限制",
      prop: "chanceLimit",
      show: `this.form.chanceLimit`,
      formatter(val: any, row: any): string {
        return `${val}次/${row.chanceMode === "ALL_TIMES" ? "活动全程" : "每日"}`;
      }
    },
    {
      tag: "text",
      prop: "prizeValidityPeriod",
      label: "奖品领取时限",
      formatter(val: any, row: any): string {
        return val ? `活动结束后${val}天内领取` : "活动时间内领取";
      }
    },
    {
      label: "活动规则",
      tag: "text",
      prop: "description"
    }
  ];
};

class lotteryConfig {
  vm: any;
  const: any;

  constructor(vm: any) {
    this.vm = vm;
    this.const = {
      LOTTERY_STEP_ARR,
      LOTTERY_TEMP_PROP,
      WHEEL_ARR,
      TICKET_ARR,
      NINE_ARR,
      LOTTERY_AWARDS_PROP,
      LOTTERY_RULES: LOTTERY_RULES(this.vm),
      DETAIL_ACTIVE_PROP: DETAIL_ACTIVE_PROP(this.vm),
      LOTTERY_ACTIVE_PROP: LOTTERY_ACTIVE_PROP(this.vm)
    };
  }
}

export default lotteryConfig;
