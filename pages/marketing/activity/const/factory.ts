import dayjs from "dayjs";
import { arrToObject, formatDate } from "@/utils";
import ActiveStatus from "../components/activeStatus.vue";
import { AGENT_STATUS_ARR, TASK_TYPE_ARR, GROUP_STATUS_OBJ, DETAIL_SITE_AWARDS_PROPS } from "./common";
import { getToolBtnByItem } from "./index";
import ActiveTool from "../components/activeTool.vue";
import _ from "lodash";
// 下发活动状态
const ISSUED_STATUS_ARR: element.Options[] = [
  {
    label: "未下发",
    value: "UN_ISSUED"
  },
  {
    label: "已下发",
    value: "ISSUED "
  }
];
// 活动的筛选头
const ACTIVE_SEARCH_CONFIG: any = (vm: any) => {
  let _obj: any = {
    props: [
      {
        tag: "input",
        prop: vm.activeType === "sales" ? "campaignCode" : "code",
        placeholder: "活动编号"
      },
      {
        tag: "select",
        prop: vm.activeType === "sales" ? "type" : "style",
        placeholder: "活动类型",
        keyProp: {
          label: "name",
          value: "id"
        },
        options: vm.typeArr
      },
      {
        tag: "select",
        prop: "issueStatus",
        placeholder: "下发状态",
        options: ISSUED_STATUS_ARR
      }
    ]
  };

  if (vm.activeType === "site") {
    _obj.props.splice(1, 1);
  }
  if (vm.activeType === "sales" && vm.accessIsOpened("PERM:PROMOTION_ACTIVITY:EDIT")) {
    _obj.addBtn = {
      label: "新建促销活动",
      handler: () => {
        vm.handleAdd();
      }
    };
  }
  if (vm.sysPlat === "company") {
    let perKeyMap: any = {
      lottery: "PERM:LOTTERY_ACTIVITY:EDIT",
      sales: "PERM:PROMOTION_ACTIVITY:EDIT",
      site: "PERM:OFFLINE_ACTIVITY:EDIT"
    };
    let keyMap: any = {
      lottery: "新建抽奖活动",
      sales: "新建促销活动",
      site: "新建线下活动"
    };
    if (vm.accessIsOpened(perKeyMap[vm.activeType])) {
      _obj.addBtn = {
        label: keyMap[vm.activeType],
        handler: () => {
          vm.handleAdd();
        }
      };
    }
  }
  return _obj;
};
// 活动表头
const ACTIVE_TABLE_COLUMNS: any = (vm: any) => {
  let _btn = [
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
      key: "type",
      formatter(val: any) {
        let _obj: any = vm.typeArr.find((type: any) => type.id === val) || {};
        return _obj.name || "限时团购";
      }
    },
    {
      title: "投放/下发经销商",
      key: "dealers",
      render: (h: any, row: any) => {
        let { issueStatus, issueCount, releaseCount, dealers } = row;
        let str;
        if (issueStatus === 1) {
          // 已下发
          str = issueCount ? `${releaseCount || 0}/${issueCount}` : dealers || "0/0";
        } else {
          str = "-";
        }
        return h("span", {}, str);
      }
    },
    {
      title: "下发状态",
      key: "issueStatus",
      formatter: (val: number) => {
        return val === 0 ? "未下发" : "已下发";
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
      title: "创建时间",
      key: "createdTime",
      formatter: (val: string) => {
        return formatDate(val);
      }
    },
    {
      operate: true,
      title: "操作",
      width: 160,
      fixed: "right",
      setBtns: (row: any, index: number) => {
        return vm.getDealBtns(row, index);
      }
    }
  ];
  if (vm.activeType === "lottery") {
    _btn.splice(
      7,
      0,

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
      }
    );
  }
  if (vm.activeType === "sales") {
    _btn.splice(7, 0, {
      title: "报名人次",
      key: "enrollmentCount",
      formatter(val: any): any {
        return val ? val : "-";
      }
    });
  }
  if (vm.activeType === "site") {
    _btn.splice(7, 0, {
      title: "报名人次",
      key: "enrollmentCount",
      formatter(val: any): any {
        return val ? val : "-";
      }
    });
    _btn.splice(2, 1);
  }

  return _btn;
};
// 主办活动搜索
const HOSTED_ACTIVE_SEARCH_CONFIG: any = (vm: any) => {
  let _obj: any = {
    props: [
      {
        tag: "input",
        prop: "code",
        placeholder: "活动编号"
      },
      {
        tag: "select",
        prop: "luckyDrawType",
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
        options: AGENT_STATUS_ARR
      }
    ]
  };
  if (vm.activeType === "site") {
    _obj.props[2].prop = "campaignStatus";
    _obj.props.splice(1, 1);
  }
  return _obj;
};
// 主办活动表头
const HOSTED_ACTIVE_TABLE_COLUMNS: any = (vm: any) => {
  let _btn: any[] = [
    {
      title: "活动编号",
      key: "code"
    },
    {
      title: "活动名称",
      key: "campaignName"
    },
    {
      title: "活动类型",
      key: "campaignType",
      formatter(val: any) {
        let _obj: any = vm.typeArr.find((type: any) => type.id === val) || {};
        return _obj.name || "限时团购";
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
      title: "投放经销商",
      key: "dealerCount",
      formatter(val: any): string {
        return val > 0 ? val : "-";
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
      title: "创建时间",
      key: "createdTime",
      formatter: (val: string) => {
        return formatDate(val);
      }
    },
    {
      operate: true,
      title: "操作",
      width: 180,
      fixed: "right",
      setBtns: (row: any, index: number) => {
        return vm.getHostedBtns(row, index);
      }
    }
  ];
  if (vm.activeType === "lottery") {
    _btn.splice(
      8,
      0,

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
      }
    );
  }
  if (vm.activeType === "sales") {
    _btn.splice(7, 0, {
      title: "报名人次",
      key: "enrollmentCount",
      formatter(val: any): any {
        return val ? val : "-";
      }
    });
  }
  if (vm.activeType === "site") {
    _btn.splice(
      8,
      0,
      {
        title: "报名人次",
        key: "enrollmentCount",
        formatter(val: any): any {
          return val ? val : "-";
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
              props: { toolArr: arr, id: row.campaignId, row: row, activeMode: "hosted" }
            },
            arr.join(" ")
          );
        }
      }
    );
    _btn.splice(2, 1);
  }
  return _btn;
};

// 投放活动的经销商
const PUT_TABLE_COLUMN: any = (vm: any) => [
  {
    type: "selection",
    width: 55
  },
  {
    title: "经销商代码",
    key: "dealerCode"
  },
  {
    title: "经销商名称",
    key: "dealerName"
  },
  {
    title: "经销商简称",
    key: "dealerShortName"
  },
  {
    title: "事业部",
    key: "buName"
  },
  {
    title: "大区",
    key: "regionName"
  },
  // {
  //   title: "联系电话",
  //   key: "contactNumber"
  // },
  // {
  //   title: "所在城市",
  //   key: "area"
  // },
  // {
  //   title: "营业状态",
  //   key: "osStatus",
  //   formatter: (val: string) => {
  //     return val === "0" ? "营业" : "未营业";
  //   }
  // },
  {
    title: "所属集团",
    key: "blocName"
  }
];
// 投放
const PUT_SEARCH_CONFIG: any = (vm: any) => {
  let _obj: any = {
    props: [
      {
        tag: "select",
        prop: "buId",
        placeholder: "事业部",
        keyProp: {
          label: "name",
          value: "id"
        },
        options: vm.bu2Region,
        change: vm.changeBu2
      },
      {
        tag: "select",
        prop: "regionId",
        placeholder: "大区",
        keyProp: {
          label: "name",
          value: "id"
        },
        options: vm.allRegion
      },
      {
        tag: "input",
        prop: "name",
        placeholder: "经销商名称"
      },
      {
        tag: "input",
        prop: "blocName",
        placeholder: "所属集团"
      }
    ]
  };

  return _obj;
};
// 下发经销商搜索
const ISSUED_DEALER_SEARCH = (vm: any) => {
  return {
    props: [
      {
        tag: "select",
        prop: "businessUnitId",
        placeholder: "事业部",
        keyProp: {
          label: "name",
          value: "id"
        },
        options: vm.bu2Region,
        change: vm.changeBuId
      },
      {
        tag: "select",
        prop: "regionId",
        placeholder: "大区",
        keyProp: {
          label: "name",
          value: "id"
        },
        options: vm.allRegion,
        change: vm.changeAllRegion
      },
      {
        tag: "select",
        prop: "dealerCode",
        placeholder: "经销商",
        keyProp: {
          label: "dealerName",
          value: "dealerCode"
        },
        options: vm.dealerList
      },
      {
        tag: "select",
        prop: "campaignStatus",
        placeholder: "活动状态",
        options: AGENT_STATUS_ARR
      },
      {
        tag: "datePicker",
        label: "投放时间",
        type: "datetimerange",
        prop: "releaseAt",
        placeholder: "投放时间"
      }
    ]
  };
};
// 下发经销商表头
const ISSUED_DEALER_COLUMNS = (vm: any) => {
  let _arr: any[] = [
    {
      title: "经销商名称",
      key: "dealerName"
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
      title: "活动状态",
      key: "campaignStatus",
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
      title: "投放时间",
      key: "releaseAt",
      formatter: (val: string) => {
        return val ? dayjs(val).format("YYYY-MM-DD HH:mm:ss") : "-";
      }
    },
    {
      operate: true,
      title: "操作",
      width: 160,
      fixed: "right",
      setBtns: (row: any, index: number) => {
        let key =
          vm.activeType === "lottery"
            ? "PERM:LOTTERY_ACTIVITY:EDIT"
            : vm.activeType === "sales"
            ? "PERM:PROMOTION_ACTIVITY:EDIT"
            : "PERM:OFFLINE_ACTIVITY:EDIT";
        let _cancel = { label: "取消下发", handler: () => vm.cancel(row) };
        let _detail = { label: "活动详情", handler: () => vm.detail(row) };
        let _btns: Array<any> = [];
        switch (row.campaignStatus) {
          case 0:
            // 未投放
            if (vm.accessIsOpened(key)) {
              _btns = [_cancel];
            }
            break;
          case 1:
          case 2:
          case 3:
          case 4:
            _btns = [_detail];
            break;
        }
        return _btns;
      }
    }
  ];
  if (vm.activeType === "lottery") {
    _arr.splice(
      4,
      0,

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
      }
    );
  }
  if (vm.activeType === "sales") {
    _arr.splice(4, 0, {
      title: "报名人次",
      key: "enrollmentCount",
      formatter(val: any): any {
        return val ? val : "-";
      }
    });
  }
  if (vm.activeType === "site") {
    _arr.splice(4, 0, {
      title: "报名人次",
      key: "enrollmentCount",
      formatter(val: any): any {
        return val ? val : "-";
      }
    });
  }
  return _arr;
};
const HOSTED_DEALER_COLUMNS = (vm: any) => {
  let _arr: any[] = [
    {
      title: "经销商名称",
      key: "dealerName"
    },
    {
      title: "浏览量",
      key: "pageViewCount",
      sortable: true,
      formatter(val: any): any {
        return val ? val : "-";
      }
    },
    {
      title: "浏览人次",
      sortable: true,
      key: "userViewCount",
      formatter(val: any): any {
        return val ? val : "-";
      }
    }
  ];
  if (vm.activeType === "lottery") {
    _arr.splice(
      2,
      0,

      {
        title: "参与人次",
        key: "participationCount",
        sortable: true,
        formatter(val: any): any {
          return val ? val : "-";
        }
      },
      {
        title: "中奖人次",
        key: "awardCount",
        sortable: true,
        formatter(val: any): any {
          return val ? val : "-";
        }
      }
    );
  }
  if (vm.activeType === "sales") {
    _arr.splice(2, 0, {
      title: "报名人次",
      key: "enrollmentCount",
      formatter(val: any): any {
        return val ? val : "-";
      }
    });
  }
  if (vm.activeType === "site") {
    _arr.splice(2, 0, {
      title: "报名人次",
      key: "enrollmentCount",
      formatter(val: any): any {
        return val ? val : "-";
      }
    });
  }
  return _arr;
};
const HOSTED_DEALER_SEARCH_CONFIG: any = (vm: any) => {
  let _obj: any = {
    props: [
      {
        tag: "select",
        prop: "businessUnitId",
        placeholder: "事业部",
        keyProp: {
          label: "name",
          value: "id"
        },
        options: vm.bu2Region,
        change: vm.changeBuId
      },
      {
        tag: "select",
        prop: "regionId",
        placeholder: "大区",
        keyProp: {
          label: "name",
          value: "id"
        },
        options: vm.allRegion,
        change: vm.changeAllRegion
      },
      {
        tag: "select",
        prop: "dealerCode",
        placeholder: "经销商",
        keyProp: {
          label: "dealerName",
          value: "dealerCode"
        },
        options: vm.dealerList
      }
    ]
  };

  return _obj;
};

const LOTTERY_DETAIL_ACTIVE_PROP: any = (vm: any) => {
  let arr: any[] = [
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
      formatter(val: any, row: any) {
        return `${dayjs(row.validFrom).format("YYYY-MM-DD HH:mm")} ~  ${dayjs(row.validTo).format("YYYY-MM-DD HH:mm")}`;
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
  if (vm.mode !== "hosted" && vm.sysPlat !== "agent") {
    arr.splice(2, 2);
  }
  return arr;
};
const SALES_DETAIL_ACTIVE_PROP: any = (vm: any) => {
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
      prop: "validFrom",
      label: "活动时间",
      formatter(val: any, row: any) {
        return `${dayjs(row.validFrom).format("YYYY-MM-DD HH:mm")} ~  ${dayjs(row.validTo).format("YYYY-MM-DD HH:mm")}`;
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
  if (vm.mode !== "hosted" && vm.sysPlat !== "agent") {
    arr.splice(2, 3);
  }
  return arr;
};
const SITE_DETAIL_ACTIVE_PROP: any = (vm: any) => {
  let arr: Array<any> = [
    {
      label: "活动图片",
      prop: "posterUrl"
    },
    {
      label: "活动名称",
      tag: "text",
      prop: "name",
      formatter(val: any, row: any): string {
        return row.name || row.campaignName;
      }
    },
    {
      tag: "text",
      prop: "validFrom",
      label: "活动时间",
      formatter(val: any, row: any) {
        return `${dayjs(row.validFrom).format("YYYY-MM-DD HH:mm")} ~  ${dayjs(row.validTo).format("YYYY-MM-DD HH:mm")}`;
      }
    },
    {
      tag: "text",
      prop: "signinValidFrom",
      label: "活动签到时间",
      formatter(val: any, row: any) {
        return `${dayjs(row.signinValidFrom).format("YYYY-MM-DD HH:mm")} ~  ${dayjs(row.signinValidTo).format(
          "YYYY-MM-DD HH:mm"
        )}`;
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
      prop: "location",
      label: "活动地点"
    },

    {
      tag: "text",
      prop: "memberLimit",
      label: "活动人数限制",
      formatter(val: any, row: any): string {
        return val > 0 ? `限制人数${val}人` : "不限制人数";
      }
    },
    {
      tag: "text",
      prop: "information",
      label: "报名填写资料",
      formatter(val: any, row: any): string {
        return `姓名，手机号`;
      }
    },
    {
      prop: "description",
      label: "活动详情"
    }
  ];
  if (vm.mode !== "hosted" && vm.sysPlat !== "agent") {
    arr.splice(2, 5);
  }
  return arr;
};
class ConstConfig {
  vm: any;
  const: any;
  constructor(vm: any) {
    this.vm = vm;
    this.const = {
      DETAIL_SITE_AWARDS_PROPS,
      GROUP_STATUS_OBJ,
      ISSUED_DEALER_SEARCH: ISSUED_DEALER_SEARCH(this.vm),
      HOSTED_ACTIVE_SEARCH_CONFIG: HOSTED_ACTIVE_SEARCH_CONFIG(this.vm),
      HOSTED_ACTIVE_TABLE_COLUMNS: HOSTED_ACTIVE_TABLE_COLUMNS(this.vm),
      ISSUED_DEALER_COLUMNS: ISSUED_DEALER_COLUMNS(this.vm),
      HOSTED_DEALER_COLUMNS: HOSTED_DEALER_COLUMNS(this.vm),
      HOSTED_DEALER_SEARCH_CONFIG: HOSTED_DEALER_SEARCH_CONFIG(this.vm),
      ACTIVE_TABLE_COLUMNS: ACTIVE_TABLE_COLUMNS(this.vm),
      ACTIVE_SEARCH_CONFIG: ACTIVE_SEARCH_CONFIG(this.vm),
      PUT_TABLE_COLUMN: PUT_TABLE_COLUMN(this.vm),
      PUT_SEARCH_CONFIG: PUT_SEARCH_CONFIG(this.vm),
      LOTTERY_DETAIL_ACTIVE_PROP: LOTTERY_DETAIL_ACTIVE_PROP(this.vm),
      SITE_DETAIL_ACTIVE_PROP: SITE_DETAIL_ACTIVE_PROP(this.vm),
      SALES_DETAIL_ACTIVE_PROP: SALES_DETAIL_ACTIVE_PROP(this.vm)
    };
  }

  getBtnByStatus(row: any) {
    let vm: any = this;
    let editKey =
      vm.activeType === "lottery"
        ? "PERM:LOTTERY_ACTIVITY:EDIT"
        : vm.activeType === "sales"
        ? "PERM:PROMOTION_ACTIVITY:EDIT"
        : "PERM:OFFLINE_ACTIVITY:EDIT";
    let viewKey =
      vm.activeType === "lottery"
        ? "PERM:LOTTERY_ACTIVITY:VIEW"
        : vm.activeType === "sales"
        ? "PERM:PROMOTION_ACTIVITY:VIEW"
        : "PERM:OFFLINE_ACTIVITY:VIEW";
    let hasEditPer = vm.accessIsOpened(editKey);
    let hasViewPer = vm.accessIsOpened(viewKey);
    let _detail = { label: "下发详情", hide: !hasViewPer, handler: () => vm.detailIssuedActive(row) };
    let _issuedActive = { label: "下发活动", hide: !hasEditPer, handler: () => vm.handleIssuedActive(row) };
    let _edit = { label: "编辑", hide: !hasEditPer, handler: () => vm.editPutActive(row) };
    let _del = { label: "删除", hide: !hasEditPer, handler: () => vm.deletePutActive(row) };
    let _btns: Array<any> = [];

    // 根据下发状态
    switch (row.issueStatus) {
      case 0:
        // 未下发
        if (hasEditPer) {
          // 判断是否有权限
          _btns = [_issuedActive, _edit, _del];
        } else {
          _btns = [];
        }
        break;
      case 1:
        _btns = hasViewPer ? [_detail] : [];
        break;

      default:
        _btns = hasViewPer ? [_detail] : [];
    }
    return _btns;
  }
  getHostedBtnByStatus(row: any) {
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
      handler: () => vm.detailHostedActive(row)
    };
    let _del = { label: "删除", hide: !hasEditPer, handler: () => vm.deleteHosted(row) };
    let _edit = { label: "编辑", hide: !hasEditPer, handler: () => vm.editHosted(row) };
    let _stop = { label: "终止", hide: !hasEditPer, handler: () => vm.stopHosted(row) };
    let _putIn = { label: "投放", hide: !hasEditPer, handler: () => vm.putInHosted(row) };
    let status = _.isUndefined(row.status) ? row.campaignStatus : row.status;
    switch (status) {
      case 0:
        // 主机厂-自办
        _btns = [_detail, _putIn, _edit, _del];
        break;
      case 1:
        // 主机厂-自办 已投放
        _btns = [_detail, _del];
        break;
      case 2:
        // 主机厂-自办 进行中
        _btns = [_detail, _stop];
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
    return _btns;
  }
}
export default ConstConfig;
