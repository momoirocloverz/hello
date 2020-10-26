// todo 需要重新梳理下
import { toMillion, toPercent, formatDate, numToUppercase, toMultipliedBy, toMinus } from "@/utils";
import ActiveStatus from "../components/activeStatus.vue";
import ActiveTool from "../components/activeTool.vue";
import { TOOL_LIST } from "@/mock/marketing";

import {
  COUPON_TYPES,
  AGENT_STATUS_ARR,
  GROUP_STATUS_ARR,
  FACTORY_STATUS_ARR,
  APPROVAL_STATUS_ARR,
  AGENT_STATUS_OBJ,
  GROUP_STATUS_OBJ,
  NUMS_RULES,
  LIMIT_RULES,
  LIMIT_PERSON
} from "./common";
const BigNumber = require("bignumber.js");

export const getToolBtnByItem = (row: any): Array<any> => {
  let {
    messageBoardEnabled,
    luckydrawEnabled,
    signinEnabled,
    approvalStatus,
    campaignStatus,
    signinValidFrom,
    signinValidTo
  } = row;
  let arr: Array<any> = [];
  if (signinEnabled) {
    // 现场签到是投放后可以显示
    arr.push({
      disabled:
        approvalStatus === 0 ||
        approvalStatus === 2 ||
        campaignStatus === 4 ||
        campaignStatus === 3 ||
        signinValidFrom > Date.now() ||
        signinValidTo < Date.now(),
      label: "现场签到",
      id: 1
    });
  }
  if (messageBoardEnabled) {
    // 留言墙是活动进行中可以显示
    arr.push({
      disabled: approvalStatus === 0 || approvalStatus === 2 || campaignStatus !== 2,
      label: "留言墙",
      id: 2
    });
  }
  if (luckydrawEnabled) {
    // 抽奖是活动进行中可以显示
    arr.push({
      disabled: approvalStatus === 0 || approvalStatus === 2 || campaignStatus !== 2,
      label: "大屏抽奖",
      id: 3
    });
  }
  return arr;
};
/**
 * 抽奖活动 start
 */

// 抽奖活动表头
const LOTTERY_TABLE_COLUMNS: any = (vm: any) => {
  let _arr = [
    {
      title: "活动编号",
      key: "code"
    },
    {
      title: "活动名称",
      key: "campaignName",
      render: (h: any, row: any) => {
        let str = row.campaignName || row.name;
        return h("span", {}, str);
      }
    },
    {
      title: "活动类型",
      key: "campaignType",
      formatter(val: any, idx: number, row: any) {
        let _val = val || row.marketingToolType || row.type;
        let _arr: Array<any> = TOOL_LIST[0].children;
        let _obj = _arr.find((type: any) => type.id === _val) || {};
        return _obj.name || "大转盘";
      }
    },
    {
      title: "活动时间",
      key: "time",
      render: (h: any, row: any) => {
        let valid = row.validFrom ? `${formatDate(row.validFrom)}~${formatDate(row.validTo)}` : "-";
        return h("span", {}, valid);
      }
    },
    {
      title: "审批状态",
      key: "approvalStatus",
      render(h: any, row: any): any {
        let val = row.approvalStatus;
        let _str = "";
        if (val !== null) {
          _str = val === 0 ? "待审批" : val === 1 ? "审批通过" : "审批驳回";
        } else {
          _str = "-";
        }
        return h("span", { class: val === 0 ? "primary-text" : val === 1 ? "" : "warn-text" }, _str);
      }
    },
    {
      title: "活动状态",
      key: "campaignStatus",
      render: (h: any, row: any) => {
        return h(ActiveStatus, { props: { row: row, activeItem: vm.activeItem } }, null);
      }
    },
    {
      title: "浏览量",
      key: "pageViewCount",
      formatter(val: any): any {
        return val ? val : "-";
      }
    },
    {
      title: "浏览人次",
      key: "userViewCount",
      formatter(val: any): any {
        return val ? val : "-";
      }
    },
    {
      title: "参与人次",
      key: "participationCount",
      formatter(val: any): any {
        return val ? val : "-";
      }
    },
    {
      title: "中奖人次",
      key: "awardCount",
      formatter(val: any): any {
        return val ? val : "-";
      }
    },
    {
      title: "创建时间",
      key: "createdTime",
      formatter: (val: string) => {
        return formatDate(val);
      }
    },
    {
      operate: true,
      title: "操作",
      fixed: "right",
      width: 180,
      setBtns: (row: any, index: number) => {
        return vm.getDealBtns(row, index);
      }
    }
  ];
  if (vm.activeItem !== "agent") {
    _arr.splice(6, 1, {
      title: "下发时间",
      key: "issueAt",
      formatter: (val: string) => {
        return val ? formatDate(val) : "-";
      }
    });
    // 去掉审批状态
    if (vm.activeItem === "factory") {
      _arr.splice(4, 1);
    }
    // if (vm.activeItem === "company") {
    //   _arr.splice(2, 0, {
    //     title: "所属集团",
    //     key: "groupName"
    //   });
    // }
  }
  return _arr;
};
const LOTTERY_SEARCH_CONFIG: any = (vm: any) => {
  let _obj: any = {
    props: [
      {
        tag: "input",
        prop: "code",
        placeholder: "活动编号"
      },
      {
        tag: "select",
        prop: "marketingToolType",
        placeholder: "活动类型",
        keyProp: {
          label: "name",
          value: "id"
        },
        options: vm.typeArr
      },
      {
        tag: "select",
        prop: "status",
        placeholder: "活动状态",
        options:
          vm.activeItem === "agent"
            ? AGENT_STATUS_ARR
            : vm.activeItem === "company"
            ? GROUP_STATUS_ARR
            : FACTORY_STATUS_ARR
      }
    ]
  };
  if (vm.activeItem === "agent") {
    _obj.props.push({
      tag: "select",
      prop: "approvalStatus",
      placeholder: "审批状态",
      options: APPROVAL_STATUS_ARR
    });
    if (vm.accessIsOpened("PERM:LOTTERY_ACTIVITY:EDIT")) {
      _obj.addBtn = {
        label: "新建抽奖活动",
        handler: () => {
          vm.add();
        }
      };
    }
  }

  return _obj;
};
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

// 抽奖活动end

/**
 * 促销活动
 */

// 促销活动表头
const SALES_TABLE_COLUMNS: any = (vm: any) => {
  let _arr = [
    {
      title: "活动编号",
      key: "code"
    },
    {
      title: "活动名称",
      key: "name",
      formatter(val: any, idx: number, row: any): string {
        return val || row.campaignName;
      }
    },
    {
      title: "活动类型",
      key: "type",
      width: 100,
      formatter(val: any) {
        return "限时团购";
      }
    },
    {
      title: "活动车型",
      key: "typeCount",
      width: 80,
      formatter(val: any, idx: number, row: any) {
        return val || row.carModelCount;
      }
    },
    {
      title: "活动时间",
      key: "time",
      render: (h: any, row: any) => {
        let valid = row.validFrom ? `${formatDate(row.validFrom)}~${formatDate(row.validTo)}` : "-";
        return h("span", {}, valid);
      }
    },
    {
      title: "审批状态",
      key: "approvalStatus",
      render(h: any, row: any): any {
        let val = row.approvalStatus;
        let _str = "";
        if (val !== null) {
          _str = val === 0 ? "待审批" : val === 1 ? "审批通过" : "审批驳回";
        } else {
          _str = "-";
        }
        return h("span", { class: val === 0 ? "primary-text" : val === 1 ? "" : "warn-text" }, _str);
      }
    },
    {
      title: "活动状态",
      key: "status",
      render: (h: any, row: object) => {
        return h(ActiveStatus, { props: { row: row, activeItem: vm.activeItem } }, null);
      }
    },
    {
      title: "浏览量",
      key: "pageViewCount",
      formatter(val: any): any {
        return val ? val : "-";
      }
    },
    {
      title: "浏览人次",
      key: "userViewCount",
      formatter(val: any): any {
        return val ? val : "-";
      }
    },
    {
      title: "报名人次",
      key: "enrollmentCount",
      formatter(val: any): any {
        return val ? val : "-";
      }
    },
    {
      title: "创建时间",
      key: "createdTime",
      formatter: (val: string) => {
        return formatDate(val);
      }
    },
    {
      operate: true,
      title: "操作",
      fixed: "right",
      width: 180,
      setBtns: (row: any, index: number) => {
        return vm.getDealBtns(row, index);
      }
    }
  ];
  if (vm.activeItem !== "agent") {
    _arr.splice(7, 1, {
      title: "下发时间",
      key: "issueAt",
      formatter: (val: string) => {
        return formatDate(val);
      }
    });
    // 去掉审批状态
    if (vm.activeItem === "factory") {
      _arr.splice(5, 1);
    }
    // if (vm.activeItem === "company") {
    //   _arr.splice(2, 0, {
    //     title: "所属集团",
    //     key: "groupName"
    //   });
    // }
  }
  return _arr;
};

/**
 * 现场活动
 */

// 投放活动属性
const PUT_IN_LOTTERY_PROPS = (vm: any) => {
  return [
    {
      tag: "text",
      prop: "code",
      label: "活动编号"
    },
    {
      tag: "text",
      prop: "name",
      label: "活动名称"
    },
    {
      tag: "datePicker",
      type: "datetimerange",
      prop: "activeTime",
      label: "活动时间",
      format: "yyyy-MM-dd HH:mm",
      clearable: false,
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
      label: "奖项设置",
      prop: "priceSetList"
    }
  ];
};
// 投放现场活动
const PUT_IN_SITE_PROPS = (vm: any) => {
  return [
    {
      tag: "text",
      prop: "code",
      label: "活动编号"
    },
    {
      tag: "text",
      prop: "name",
      label: "活动名称"
    },
    {
      tag: "datePicker",
      type: "datetimerange",
      prop: "activeTime",
      clearable: false,
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
      tag: "datePicker",
      type: "datetimerange",
      prop: "regTime",
      label: "活动签到时间",
      tip: "签到开始时间不能晚于活动开始时间,签到结束时间不能早于活动开始时间",
      pickerOptions: {
        disabledDate(time: any) {
          if (vm.putInForm.activeTime) {
            return time < Date.now() - 24 * 60 * 60 * 1000 || time > vm.putInForm.activeTime[1];
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
      label: "现场互动工具",
      prop: "tool",
      options: [
        {
          label: "现场签到",
          value: 1
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
      prop: "priceSetList",
      show: "this.form.tool.indexOf(3) > -1"
    }
  ];
};
// 投放团购活动
const PUT_IN_SALES_PROPS = (vm: any) => {
  return [
    {
      tag: "text",
      prop: "code",
      label: "活动编号"
    },
    {
      tag: "text",
      prop: "name",
      label: "活动名称"
    },
    {
      tag: "datePicker",
      type: "datetimerange",
      prop: "activeTime",
      label: "活动时间",
      clearable: false,
      format: "yyyy-MM-dd HH:mm",
      pickerOptions: {
        disabledDate(time: any) {
          return time < Date.now() - 24 * 60 * 60 * 1000;
        }
      },
      changeTime: vm.changeActTime,
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
      prop: "memberLimit",
      label: "活动人数限制"
    },
    {
      label: "团购商品",
      prop: "reletedGoods"
    }
  ];
};
// 投入活动规则
const PUT_IN_RULES = (vm: any) => {
  return {
    activeTime: [
      { required: true, trigger: "change", message: "请选择活动时间" },
      {
        trigger: "change",
        validator: async (rule: any, value: any, callback: any) => {
          if (vm.trueTime) {
            callback();
          } else {
            callback(new Error("活动时间冲突"));
          }
        }
      }
    ],
    priceSetList: { required: false, trigger: "change", message: "请设置奖项规则" },
    memberLimit: { required: true, trigger: "blur", message: "请选择活动人数限制" },
    limitPerson: {
      pattern: /^[1-9]\d*$/,
      required: vm.putInForm && vm.putInForm.memberLimit > 0,
      trigger: "blur",
      message: "请输入大于0的整数"
    },
    regTime: [
      { required: true, message: "请选择活动签到时间" },
      {
        validator: (rule: any, value: any, callback: any) => {
          let { activeTime, regTime } = vm.putInForm;
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
    location: { required: true, trigger: "change", message: "请选择活动位置" },
    reletedGoods: [
      { required: true, trigger: "change", message: "请选择团购商品" },
      {
        trigger: "change",
        validator: (rule: any, value: any, callback: any) => {
          if (vm.putInForm.reletedGoods.length > 0) {
            callback();
          }
        }
      }
    ],
    tool: { required: true, trigger: "change", message: "请选择" }
  };
};

// 线下活动表头
const SITE_TABLE_COLUMNS: any = (vm: any) => {
  let _arr = [
    {
      title: "活动编号",
      key: "code"
    },
    {
      title: "活动名称",
      key: "campaignName",
      formatter(val: any, idx: number, row: any): any {
        return val || row.name;
      }
    },

    {
      title: "活动时间",
      key: "time",
      render: (h: any, row: any) => {
        let valid = row.validFrom ? `${formatDate(row.validFrom)}~${formatDate(row.validTo)}` : "-";
        return h("span", {}, valid);
      }
    },
    {
      title: "审批状态",
      key: "approvalStatus",
      render(h: any, row: any): any {
        let val = row.approvalStatus;
        let _str = "";
        if (val !== null) {
          _str = val === 0 ? "待审批" : val === 1 ? "审批通过" : "审批驳回";
        } else {
          _str = "-";
        }
        return h("span", { class: val === 0 ? "primary-text" : val === 1 ? "" : "warn-text" }, _str);
      }
    },
    {
      title: "活动状态",
      key: "status",
      render: (h: any, row: object) => {
        return h(ActiveStatus, { props: { row: row, activeItem: vm.activeItem } }, null);
      }
    },
    {
      title: "浏览量",
      key: "pageViewCount",
      formatter(val: any): any {
        return val ? val : "-";
      }
    },
    {
      title: "浏览人次",
      key: "userViewCount",
      formatter(val: any): any {
        return val ? val : "-";
      }
    },
    {
      title: "报名人次",
      key: "enrollmentCount",
      formatter(val: any): any {
        return val ? val : "-";
      }
    },
    {
      title: "创建时间",
      key: "createdTime",
      formatter: (val: string) => {
        return formatDate(val);
      }
    },
    {
      title: "现场工具",
      key: "tool",
      width: 210,
      showTooltip: false,
      render: (h: any, row: any) => {
        let arr: Array<any> = getToolBtnByItem(row);
        return h(
          ActiveTool,
          {
            props: { toolArr: arr, id: row.campaignId, row: row }
          },
          arr.join(" ")
        );
      }
    },
    {
      operate: true,
      title: "操作",
      width: 180,
      fixed: "right",
      setBtns: (row: any, index: number) => {
        return vm.getDealBtns(row, index);
      }
    }
  ];
  if (vm.activeItem !== "agent") {
    _arr.splice(5, 1, {
      title: "下发时间",
      key: "issueAt",
      formatter: (val: string) => {
        return formatDate(val);
      }
    });
    // 去掉审批状态
    if (vm.activeItem === "factory") {
      _arr.splice(3, 1);
    }
    // if (vm.activeItem === "company") {
    //   _arr.splice(2, 0, {
    //     title: "所属集团",
    //     key: "groupName"
    //   });
    // }
  }
  return _arr;
};
const SALES_SEARCH_CONFIG: any = (vm: any) => {
  let _obj: any = {
    props: [
      {
        tag: "input",
        prop: "campaignCode",
        placeholder: "活动编号"
      },
      {
        tag: "select",
        prop: "type",
        placeholder: "活动类型",
        keyProp: {
          label: "name",
          value: "id"
        },
        options: vm.typeArr
      },
      {
        tag: "select",
        prop: "campaignStatus",
        placeholder: "活动状态",
        options: vm.activeItem === "agent" ? AGENT_STATUS_ARR : GROUP_STATUS_ARR
      }
    ]
  };
  if (vm.activeItem === "agent") {
    _obj.props.push({
      tag: "select",
      prop: "approvalStatus",
      placeholder: "审批状态",
      options: APPROVAL_STATUS_ARR
    });
    if (vm.accessIsOpened("PERM:PROMOTION_ACTIVITY:EDIT")) {
      _obj.addBtn = {
        label: "新建促销活动",
        handler: () => {
          vm.add();
        }
      };
    }
  }

  return _obj;
};
const SITE_SEARCH_CONFIG: any = (vm: any) => {
  let _obj: any = {
    props: [
      {
        tag: "input",
        prop: "code",
        placeholder: "活动编号"
      },
      {
        tag: "select",
        prop: "campaignStatus",
        placeholder: "活动状态",
        options: vm.activeItem === "agent" ? AGENT_STATUS_ARR : GROUP_STATUS_ARR
      }
    ]
  };
  if (vm.activeItem === "agent") {
    _obj.props.push({
      tag: "select",
      prop: "approvalStatus",
      placeholder: "审批状态",
      options: APPROVAL_STATUS_ARR
    });
    if (vm.accessIsOpened("PERM:OFFLINE_ACTIVITY:EDIT")) {
      _obj.addBtn = {
        label: "新建线下活动",
        handler: () => {
          vm.add();
        }
      };
    }
  }

  return _obj;
};

// 中奖名单表头
const WINNING_PRICE_COLUMN: any = (vm: any) => {
  let arr: Array<any> = [
    {
      title: "客户姓名",
      key: "userName"
    },
    {
      title: "手机号",
      key: "userMobile"
    },
    {
      title: "核销码",
      key: "ticketCode"
    },
    {
      title: "奖品类型",
      key: "prizeType",
      formatter: (val: any) => {
        return val ? (val === 2 ? "无奖品" : val === 1 ? "优惠券" : "实物奖品") : "实物奖品";
      }
    },
    {
      title: "奖项",
      key: "prizeLevel"
    },
    {
      title: "奖品",
      key: "prizeName"
    },
    {
      title: "使用状态",
      key: "prizeUsed",
      formatter: (val: any) => {
        return val ? "已使用" : "未使用";
      }
    },

    {
      title: "中奖时间",
      key: "wonAt",
      formatter: (val: string) => {
        return formatDate(val);
      }
    }
  ];
  // 2019-09-29 二期不需要验券
  // if (vm.sysPlat === "agent") {
  //   arr.push({
  //     title: "操作",
  //     operate: true,
  //     setBtns: (row: any, index: number) => {
  //       if (!row.prizeUsed) {
  //         let _btn: Array<{}> = [
  //           {
  //             label: "验券",
  //             handler: () => vm.checkTicket(row, index)
  //           }
  //         ];
  //         return _btn;
  //       } else {
  //         return [];
  //       }
  //     }
  //   });
  // }
  return arr;
};
const LOTTERY_WIN_PRICE_PROP: any = (vm: any) => [
  {
    tag: "text",
    label: "奖品名称",
    prop: "prizeName",
    key: "prizeType",
    formatter: (val: any) => {
      return val ? (val === 2 ? "无奖品" : val === 1 ? "优惠券" : "实物奖品") : "实物奖品";
    }
  },
  {
    tag: "text",
    label: "奖品名称",
    prop: "prizeName"
  },
  {
    tag: "text",
    label: "核销码",
    prop: "ticketCode"
  },
  {
    tag: "text",
    label: "客户姓名",
    prop: "userName"
  },
  {
    tag: "text",
    label: "手机号",
    prop: "phone"
  }
];

const SITE_WIN_PRICE_COLUMN: any = (vm: any) => {
  let arr = [
    {
      title: "客户姓名",
      key: "userName"
    },
    {
      title: "手机号",
      key: "userMobile"
    },
    {
      title: "核销码",
      key: "ticketCode"
    },

    {
      title: "奖项",
      key: "prizeLevel"
    },
    {
      title: "奖品",
      key: "prizeName"
    },
    {
      title: "使用状态",
      key: "prizeUsed",
      formatter: (val: any) => {
        return val ? "已使用" : "未使用";
      }
    },

    {
      title: "中奖时间",
      key: "wonAt",
      formatter: (val: string) => {
        return formatDate(val);
      }
    }
    // {
    //   title: "操作",
    //   operate: true,
    //   setBtns: (row: any, index: number) => {
    //     if (!row.prizeUsed) {
    //       let _btn: Array<{}> = [
    //         {
    //           label: "验券",
    //           handler: () => vm.checkTicket(row, index)
    //         }
    //       ];
    //       return _btn;
    //     } else {
    //       return [];
    //     }
    //   }
    // }
  ];
  if (vm.sysPlat !== "agent") {
    arr.splice(2, 1);
  }
  return arr;
};
const SITE_WIN_PRICE_PROP: any = (vm: any) => [
  {
    tag: "text",
    label: "奖品名称",
    prop: "prizeName"
  },
  {
    tag: "text",
    label: "核销码",
    prop: "ticketCode"
  },
  {
    tag: "text",
    label: "客户姓名",
    prop: "userName"
  },
  {
    tag: "text",
    label: "手机号",
    prop: "userMobile"
  }
];
// 参与名单
const ROSTER_LIST: any = (vm: any) => [
  {
    title: "姓名",
    key: "userName"
  },
  {
    title: "手机号",
    key: "userMobile"
  },
  {
    title: "参与时间",
    key: "createdTime",
    formatter: (val: string) => {
      return formatDate(val);
    }
  }
];
const AWARD_PROPS: any = [
  {
    tag: "text",
    label: "奖品类型",
    prop: "type"
  },
  {
    tag: "text",
    label: "奖品名称",
    prop: "name"
  },
  {
    tag: "text",
    label: "核销码",
    prop: "code"
  },
  {
    tag: "text",
    label: "客户姓名",
    prop: "customerName"
  },
  {
    tag: "text",
    label: "手机号",
    prop: "phone"
  }
];

//  现场活动参与名单
const SITE_ROSTER_LIST: any = (vm: any) => [
  {
    title: "姓名",
    key: "userName"
  },
  {
    title: "手机号",
    key: "userMobile"
  },
  {
    title: "是否报名",
    key: "signUpType",
    render: (h: any, row: any) => {
      return h(
        "i",
        {
          attrs: {
            class: row.signUpType ? "el-icon-check green" : "el-icon-close red"
          }
        },
        ""
      );
    }
  },
  {
    title: "报名时间",
    key: "signUpTime",
    formatter: (val: string) => {
      return val ? formatDate(val) : "-";
    }
  },
  {
    title: "是否签到",
    key: "signStatus",
    render: (h: any, row: any) => {
      return h(
        "i",
        {
          attrs: {
            class: row.signStatus ? "el-icon-check green" : "el-icon-close red"
          }
        },
        ""
      );
    }
  }
];
// 促销-报名表头
const SIGN_UP_COLUMN = [
  {
    title: "姓名",
    key: "userName"
  },
  {
    title: "手机号",
    key: "userMobile"
  },
  {
    title: "报名车型",
    key: "modelInfoNameList",
    formatter: (val: Array<any>) => {
      return val.join(",");
    }
  },
  {
    title: "期望提车时间",
    key: "returnVehicleTime"
  },
  {
    title: "报名时间",
    key: "applyTime",
    formatter: (val: string) => {
      return formatDate(val);
    }
  }
];

// 优惠券
const COUPON_COLUMNS: any = (vm: any) => [
  {
    title: "优惠劵名称",
    key: "name"
  },
  {
    title: "优惠劵类型",
    key: "couponType",
    formatter: (val: any) => {
      let item: any = COUPON_TYPES.find((coup: any) => coup.value === Number(val)) || {};
      return item.label || "";
    }
  },
  {
    title: "有效期",
    key: "valid",
    render: (h: any, row: any) => {
      let valid = `${formatDate(row.validFrom)}~${formatDate(row.validTo)}`;
      return h("span", {}, valid);
    }
  },
  {
    title: "创建时间",
    key: "createdTime",
    formatter: (val: string) => {
      return formatDate(val);
    }
  },
  {
    title: "使用/领取/剩余库存",
    key: "use",
    render: (h: any, row: any) => {
      let str = ` ${row.used}/${row.received}/${row.stockCount}`;
      return h("span", {}, str);
    }
  },
  {
    title: "操作",
    operate: true,
    setBtns: (row: any, index: number) => {
      let { priceSetList } = vm;
      let hasRow = priceSetList.find((item: any) => item.id === row.id);
      let hasId = priceSetList.find((item: any) => item.prizeId === row.id);
      return hasRow || hasId
        ? []
        : [
            {
              label: "选取",
              handler: () =>
                vm.checkedAward(
                  {
                    type: 1,
                    posterUrl: require("@/assets/images/activity/coupon.png"),
                    ...row
                  },
                  index
                )
            }
          ];
    }
  }
];
const COUPON_SEARCH_CONFIG = {
  props: [
    {
      tag: "input",
      prop: "couponName",
      placeholder: "优惠券名称"
    },
    {
      tag: "select",
      prop: "couponType",
      placeholder: "优惠券类型",
      options: COUPON_TYPES
    }
  ]
};
// 实物奖品
const ENTITY_AWARD = (vm: any) => [
  {
    title: "奖品名称",
    key: "name"
  },
  {
    title: "使用/领取/剩余库存",
    key: "use",
    render: (h: any, row: any) => {
      let str = ` ${row.used}/${row.received}/${row.stockCount}`;
      return h("span", {}, str);
    }
  },
  {
    title: "创建时间",
    key: "createdTime",
    formatter: (val: string) => {
      return formatDate(val);
    }
  },
  {
    title: "操作",
    operate: true,
    setBtns: (row: any, index: number) => {
      let { priceSetList } = vm;

      let hasRow = priceSetList.find((item: any) => item.id === row.id);
      // 编辑时候id变为了prizeId
      let hasId = priceSetList.find((item: any) => item.prizeId === row.id);

      return hasRow || hasId
        ? []
        : [
            {
              label: "选取",
              handler: () =>
                vm.checkedAward(
                  {
                    type: 0,
                    posterUrl: "",
                    ...row
                  },
                  index
                )
            }
          ];
    }
  }
];
const ENTITY_SEARCH_CONFIG = {
  props: [
    {
      tag: "input",
      prop: "objectName",
      placeholder: "奖品名称"
    }
  ]
};
// 无奖品
const NO_AWARD = (vm: any) => [
  {
    title: "奖品名称",
    key: "name"
  },
  {
    title: "操作",
    operate: true,
    setBtns: (row: any, index: number) => {
      let { priceSetList } = vm;
      let hasRow = priceSetList.find((item: any) => item.id === row.id);
      // 编辑时候id变为了prizeId
      let hasId = priceSetList.find((item: any) => item.prizeId === row.id);
      return hasRow || hasId
        ? []
        : [
            {
              label: "选取",
              handler: () =>
                vm.checkedAward(
                  {
                    type: "无奖品",
                    ...row
                  },
                  index
                )
            }
          ];
    }
  }
];
//  奖项设置
const AWARD_SET_COLUMNS = (vm: any) => {
  let _btn: Array<any> = [
    {
      title: "奖项",
      key: "levelTitle",
      formatter(val: any, idx: number) {
        let level = Number(idx);
        return vm.activeType === "site"
          ? numToUppercase(level + 1) + "等奖"
          : idx
          ? numToUppercase(level) + "等奖"
          : "固定奖项";
      }
    },
    {
      title: "奖品图片",
      key: "posterUrl",
      render: (h: any, row: any) => {
        if (row.type === 1) {
          row.posterUrl = require("@/assets/images/activity/coupon.png");
        } else if (row.prizeId === -1 && row.type === 2) {
          row.posterUrl = require("@/assets/images/activity/thank.png");
        } else if (row.name === "再来一次" && row.type === 2) {
          row.posterUrl = require("@/assets/images/activity/again.png");
        }
        return h("img", {
          attrs: {
            class: "poster",
            src: row.posterUrl
          }
        });
      }
    },
    {
      title: "奖品名称",
      key: "name"
    },
    {
      title: "类型",
      key: "type",
      formatter(val: any, idx: number): string {
        return vm.activeType === "lottery" ? (val === 2 ? "无奖品" : val === 1 ? "优惠券" : "实物奖品") : "实物奖品";
      }
    },
    {
      title: "奖品个数",
      key: "quantity",
      slot: true,
      slotName: "quantity"
    },
    {
      title: "中奖概率",
      key: "probability",
      slot: true,
      slotName: "probability"
    }
  ];
  if (vm.usedFrom === "new" || vm.usedFrom === "put") {
    _btn.push({
      operate: true,
      title: "操作",
      width: 100,
      setBtns: (row: any, index: number) => {
        let _arr: Array<any> = [
          {
            label: "更换",
            handler: () => vm.change(row, index)
          },

          {
            label: "删除",
            handler: () => vm.delete(row, index)
          }
        ];
        // 为谢谢参与时不可以删除
        if (row.id === -1 || row.prizeId === -1) {
          _arr = [];
        }
        return _arr;
      }
    });
  }
  if (vm.activeType === "site") {
    _btn.splice(5, 1);
  }
  return _btn;
};

//  团购商品
const GOODS_PROPS = [
  {
    label: "车型",
    prop: "carModel",
    placeholder: "请选择车型"
  },
  {
    label: "厂家指导价",
    tag: "text",
    prop: "guidePrice",
    formatter: (val: any) => {
      return val ? toMillion(val) + "万元" : "-";
    }
  },
  // {
  //   label: "最高优惠金额",
  //   tag: "text",
  //   prop: "maxCompanyDiscountPrice",
  //   formatter: (val: any) => {
  //     return val ? toMillion(val) + "万元" : "-";
  //   }
  // },
  // {
  //   tag: "text",
  //   label: "最高优惠百分比",
  //   prop: "maxCompanyDiscountPercentage",
  //   formatter(val: any, row: any) {
  //     let { guidePrice } = row;
  //
  //     let _price = val ? toMultipliedBy(guidePrice, val) : "";
  //     return val ? `${toPercent(val)} (${toMillion(_price)}万元)` : "-";
  //   }
  // },
  // {
  //   label: "申请优惠金额",
  //   prop: "maxDealerDiscountPrice",
  //   render: (h: any, val: any, row: any) => {
  //     let { maxDealerDiscountPrice, maxDealerRuleStatus } = row;
  //     let approval = "";
  //     let dot = "";
  //     let str = "";
  //     switch (maxDealerRuleStatus) {
  //       case 0:
  //         str = "(";
  //         approval = "待审核)";
  //         dot = "dot dot1";
  //         break;
  //       case 1:
  //         str = "(";
  //         approval = "审核通过)";
  //         dot = "dot dot2";
  //         break;
  //       case 2:
  //         str = "(";
  //         approval = "审核驳回)";
  //         dot = "dot dot5";
  //         break;
  //     }
  //     let _price = maxDealerDiscountPrice ? toMillion(maxDealerDiscountPrice) + "万元" : "-";
  //
  //     return h("div", [
  //       h("span", {}, _price),
  //       h("span", { class: "ml-15" }, str),
  //       h("span", { class: dot }),
  //       h("span", approval)
  //     ]);
  //   }
  // },
  {
    label: "优惠报价",
    tag: "text",
    prop: "salesPrice",
    formatter: (val: any) => {
      return val ? toMillion(val) + "万元" : "-";
    }
  },
  {
    label: "团购价格",
    tag: "input",
    prop: "goodsGrouponPrice",
    placeholder: "团购价格",
    append(h: any, row: any) {
      return h("span", {}, "万元");
    }
  }
];
// 团购RULES
const GOODS_RULES: any = (vm: any) => {
  return {
    carModel: {
      required: true,
      message: "请选择车型",
      trigger: "change"
    },
    goodsGrouponPrice: [
      {
        pattern: /^((?:[1-9]\d{0,2}|1\d{0,3})(\.(\d{1,2}))?|2000(\.(0{1,2}))?|0(\.(\d?[1-9])))$/,
        max: 2000,
        required: true,
        message: "请输入大于0且不大于2000且保留两位小数的团购价格",
        trigger: "blur"
      }
      // {
      //   validator: (rule: any, value: any, callback: any) => {
      //     let {
      //       guidePrice,
      //       maxDealerDiscountPrice,
      //       maxDealerRuleStatus,
      //       maxCompanyDiscountPrice,
      //       maxCompanyDiscountPercentage
      //     } = vm.goodsForm;
      //
      //     // 最大优惠百分比
      //     let maxPerNum = maxCompanyDiscountPercentage
      //       ? toMillion(toMultipliedBy(guidePrice, maxCompanyDiscountPercentage))
      //       : null;
      //     // 经销商申请的最大优惠
      //     let maxDealer = maxDealerRuleStatus === 1 ? toMillion(maxDealerDiscountPrice) : null;
      //     let _arr = [];
      //     if (maxPerNum) {
      //       _arr.push(maxPerNum);
      //     }
      //     if (maxDealer) {
      //       _arr.push(maxDealer);
      //     }
      //     if (maxCompanyDiscountPrice) {
      //       // 最高优惠金额
      //       _arr.push(toMillion(maxCompanyDiscountPrice));
      //     }
      //     if (_arr.length > 0) {
      //       // 优惠金额不能大于优惠价中最大的
      //       let _max = Math.max.apply(null, _arr);
      //       if (toMinus(toMillion(guidePrice), value) > _max) {
      //         callback(new Error("团购价过低"));
      //       } else {
      //         callback();
      //       }
      //     } else if (value >= toMillion(guidePrice)) {
      //       callback();
      //     } else {
      //       callback(new Error("团购价过低"));
      //     }
      //   }
      // }
    ]
  };
};
// 团购商品table
const GROUP_GOODS_COLUMNS = (vm: any) => {
  let _arr: Array<any> = [
    {
      title: "车型",
      key: "modelName"
    },
    {
      title: "销售价格（万元）",
      key: "salesPrice",
      formatter: (val: any) => {
        return val ? toMillion(val) : "-";
      }
    },
    {
      title: "团购价格（万元）",
      key: "goodsGrouponPrice",
      formatter: (val: any) => {
        return val ? toMillion(val) : "-";
      }
    }
  ];
  if (vm.usedFrom === "new") {
    _arr.push({
      operate: true,
      title: "操作",
      setBtns: (row: object, index: number) => {
        return [
          {
            label: "删除",
            handler: () => vm.delete(row, index)
          }
        ];
      }
    });
  }
  return _arr;
};
export default class Const {
  vm: any;
  const: any;

  constructor(vm: any) {
    this.vm = vm;
    this.const = {
      AGENT_STATUS_ARR,
      GROUP_STATUS_ARR,
      AGENT_STATUS_OBJ,
      GROUP_STATUS_OBJ,
      NUMS_RULES,
      LIMIT_RULES,
      LIMIT_PERSON,
      PUT_IN_SALES_PROPS: PUT_IN_SALES_PROPS(this.vm),
      SIGN_UP_COLUMN,
      COUPON_SEARCH_CONFIG,
      ENTITY_SEARCH_CONFIG,
      GOODS_PROPS,
      GOODS_RULES: GOODS_RULES(this.vm),
      LOTTERY_STEP_ARR,
      AWARD_PROPS,
      PUT_IN_LOTTERY_PROPS: PUT_IN_LOTTERY_PROPS(this.vm),
      PUT_IN_RULES: PUT_IN_RULES(this.vm),
      PUT_IN_SITE_PROPS: PUT_IN_SITE_PROPS(this.vm),
      LOTTERY_TABLE_COLUMNS: LOTTERY_TABLE_COLUMNS(this.vm),
      LOTTERY_SEARCH_CONFIG: LOTTERY_SEARCH_CONFIG(this.vm),
      ROSTER_LIST: ROSTER_LIST(this.vm),
      WINNING_PRICE_COLUMN: WINNING_PRICE_COLUMN(this.vm),
      LOTTERY_WIN_PRICE_PROP: LOTTERY_WIN_PRICE_PROP(this.vm),
      SITE_WIN_PRICE_COLUMN: SITE_WIN_PRICE_COLUMN(this.vm),
      SITE_WIN_PRICE_PROP: SITE_WIN_PRICE_PROP(this.vm),
      SITE_ROSTER_LIST: SITE_ROSTER_LIST(this.vm),
      SALES_TABLE_COLUMNS: SALES_TABLE_COLUMNS(this.vm),
      SITE_TABLE_COLUMNS: SITE_TABLE_COLUMNS(this.vm),
      SALES_SEARCH_CONFIG: SALES_SEARCH_CONFIG(this.vm),
      SITE_SEARCH_CONFIG: SITE_SEARCH_CONFIG(this.vm),
      COUPON_COLUMNS: COUPON_COLUMNS(this.vm),
      ENTITY_AWARD: ENTITY_AWARD(this.vm),
      NO_AWARD: NO_AWARD(this.vm),
      AWARD_SET_COLUMNS: AWARD_SET_COLUMNS(this.vm),
      GROUP_GOODS_COLUMNS: GROUP_GOODS_COLUMNS(this.vm)
    };
  }

  /**
   * 0:未开始，1:已投放,2:'进行中',3:'结束',4:'终止’
   * 主机厂自办和经销商自建公用这个状态
   * @param row
   */
  getBtnByStatus(row: any) {
    let vm: any = this;
    let _btns: Array<{}> = [];
    let perKey: any = {
      lottery: "LOTTERY_ACTIVITY",
      sales: "PROMOTION_ACTIVITY",
      site: "OFFLINE_ACTIVITY"
    };
    let hasEditPer: boolean = vm.accessIsOpened(`PERM:${perKey[vm.activeType]}:EDIT`);
    let hasViewPer: boolean = vm.accessIsOpened(`PERM:${perKey[vm.activeType]}:VIEW`);
    let hasPutPer: boolean = vm.accessIsOpened(`PERM:${perKey[vm.activeType]}:PUT`);
    let hasStopPer: boolean = vm.accessIsOpened(`PERM:${perKey[vm.activeType]}:STOP`);

    let _detail = {
      label: "详情",
      hide: !hasViewPer,
      disabled: row.approvalStatus === 0 || row.approvalStatus === 2 || row.campaignStatus === 0,
      handler: () => vm.detail(row)
    };
    let _del = { label: "删除", hide: !hasEditPer, handler: () => vm.delete(row) };
    let _edit = { label: "编辑", hide: !hasEditPer, handler: () => vm.edit(row) };
    let _popularize = { label: "推广", hide: !hasEditPer, handler: () => vm.popularize(row) };
    let _stop = { label: "终止", hide: !hasStopPer, handler: () => vm.stop(row) };
    let _putIn = { label: "投放", hide: !hasPutPer, handler: () => vm.putIn(row) };
    let _cancellation = { label: "取消投放", hide: !hasPutPer, handler: () => vm.cancelPutIn(row) };
    const dealPass = () => {
      let status = row.campaignStatus || row.status;
      switch (status) {
        case 0:
          // 经销商-主机厂 未投放
          // 经销商-自建 未开始
          // 主机厂-自办
          _btns = vm.activeItem === "agent" ? [_detail, _del] : [_detail, _putIn, _edit, _del];
          break;
        case 1:
          // 经销商-主机厂 已投放
          // 经销商-自建 未开始
          // 主机厂-自办 已投放
          _btns =
            vm.sysPlat === "agent"
              ? vm.activeItem === "agent"
                ? [_detail, _del]
                : [_detail, _cancellation]
              : [_detail, _del];
          break;
        case 2:
          // 进行中
          // 主机厂-自办 进行中
          _btns = vm.sysPlat === "agent" ? [_detail, _stop, _popularize] : [_detail, _stop];
          break;
        case 3:
          //  结束
          _btns = [_detail];
          break;
        case 4:
          // 终止
          _btns = [_detail];
          break;
      }
    };
    switch (row.approvalStatus) {
      case 0:
        // 待审核
        _btns = vm.activeItem === "agent" ? [_detail] : [_detail];
        break;
      case 1:
        dealPass();
        break;
      case 2:
        // 审批驳回
        _btns = vm.activeItem === "agent" ? [_detail, _edit, _del] : [_detail, _putIn];
        break;
      default:
        // 主机厂：未投放
        _btns = vm.activeItem === "agent" ? [_detail, _del] : [_detail, _putIn];
        break;
    }
    return _btns;
  }
}
