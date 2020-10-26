import dayjs from "dayjs";
import { formatDate } from "@/utils/index";
import { AGENT_STATUS_ARR } from "../../const/common";
import ActiveStatus from "../../components/activeStatus.vue";

const ACTIVE_STATUS_ARR: element.Options[] = [
  {
    label: "未投放",
    value: 0
  },
  {
    label: "已投放",
    value: 1
  },
  {
    label: "已开始 ",
    value: 2
  },
  {
    label: "已结束",
    value: 3
  },
  {
    label: "已终止",
    value: 4
  }
];
const APPROVAL_STATUS_ARR: element.Options[] = [
  {
    label: "待审批",
    value: 0
  },
  {
    label: "审批通过",
    value: 1
  },
  {
    label: "审批驳回",
    value: 2
  }
];
const APPROVAL_SEARCH_CONFIG: any = (vm: any) => {
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
        change: vm.changeBuId,
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
        tag: "input",
        prop: "campaignCode",
        placeholder: "活动编号"
      },
      {
        tag: "select",
        prop: "campaignType",
        placeholder: "活动类型",
        options: [
          {
            label: "抽奖活动",
            value: 0
          },
          {
            label: "促销活动",
            value: 1
          },
          {
            label: "线下活动",
            value: 2
          }
        ]
      },
      {
        tag: "select",
        prop: "campaignStatus",
        placeholder: "活动状态",
        options: AGENT_STATUS_ARR
      },
      {
        tag: "select",
        prop: "approvalStatus",
        placeholder: "审批状态",
        options: APPROVAL_STATUS_ARR
      }
    ]
  };

  return _obj;
};

const APPROVAL_TABLE_COLUMNS: any = (vm: any) => {
  return [
    {
      title: "经销商名称",
      key: "dealerName"
    },
    {
      title: "活动编号",
      key: "campaignCode"
    },
    {
      title: "活动名称",
      key: "campaignName"
    },
    {
      title: "活动类型",
      key: "campaignTypeStr"
    },
    {
      title: "活动时间",
      key: "time",
      render: (h: any, row: any) => {
        let valid = `${formatDate(row.validFrom)}~${formatDate(row.validTo)}`;
        return h("span", {}, valid);
      }
    },
    {
      title: "活动状态",
      key: "campaignStatus",
      render: (h: any, row: any) => {
        return h(ActiveStatus, { props: { row: row, activeItem: "agent" } }, null);
      }
    },
    {
      title: "审批状态",
      key: "approvalStatus",
      render(h: any, row: any): any {
        let val = row.approvalStatus;
        let _obj: any = APPROVAL_STATUS_ARR.find((item: any) => item.value === val) || {};

        return h("span", { class: val === 0 ? "primary-text" : val === 1 ? "" : "warn-text" }, _obj.label);
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
      title: "申请时间",
      key: "applyAt",
      formatter: (val: string) => {
        return dayjs(val).format("YYYY-MM-DD HH:mm:ss");
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
};

export default class ApprovalConst {
  vm: any;
  const: any;
  constructor(vm: any) {
    this.vm = vm;
    this.const = {
      APPROVAL_TABLE_COLUMNS: APPROVAL_TABLE_COLUMNS(this.vm),
      APPROVAL_SEARCH_CONFIG: APPROVAL_SEARCH_CONFIG(this.vm)
    };
  }
  getBtnByStatus(row: any) {
    let vm: any = this;
    let hasViewPer = vm.accessIsOpened("PERM:ACTIVITY_APPROVE:VIEW");
    let hasApprovePer = vm.accessIsOpened("PERM:ACTIVITY_APPROVE:APPROVE");

    let _detail = { label: "详情", hide: !hasViewPer, handler: () => vm.detail(row) };
    let _pass = { label: "审批通过", hide: !hasApprovePer, handler: () => vm.pass(row) };
    let _reject = { label: "驳回", hide: !hasApprovePer, handler: () => vm.reject(row) };
    let _btns: Array<any> = [];
    switch (row.approvalStatus) {
      case 0:
        // 待审核
        _btns = [_detail, _pass, _reject];
        break;
      case 1:
      case 2:
        _btns = [_detail];
        break;
    }
    return _btns;
  }
}
