import dayjs from "dayjs";

const levelMap: any = {
  1: "非常不满意",
  2: "不满意",
  3: "一般",
  4: "满意",
  5: "非常满意"
};
const statusMap: any = {
  0: "待处理",
  1: "不通过",
  2: "通过"
};
const levelArr: any[] = [
  {
    label: "非常满意",
    value: 5
  },
  {
    label: "满意",
    value: 4
  },
  {
    label: "一般",
    value: 3
  },
  {
    label: "不满意",
    value: 2
  },
  {
    label: "非常不满意",
    value: 1
  }
];
const statusArr: any[] = [
  {
    label: "不通过",
    value: 1
  },
  {
    label: "通过",
    value: 2
  }
];
const AGENT_TABLE_COLUMNS = (vm: any) => [
  {
    type: "selection",
    width: 55
  },
  {
    title: "客户姓名",
    key: "userName"
  },
  {
    title: "客户手机号",
    key: "userPhone"
  },
  {
    title: "评价商品",
    key: "targetName"
  },
  {
    title: "商品评价",
    key: "star",
    formatter(val: any) {
      return levelMap[val.starValue];
    }
  },
  {
    title: "评价内容",
    key: "commentText"
  },
  {
    title: "评价时间",
    key: "createdTime",
    formatter(val: any, idx: number, row: any): any {
      return dayjs(val).format("YYYY-MM-DD HH:mm");
    }
  },
  {
    operate: true,
    title: "操作",
    fixed: "right",
    width: 180,
    setBtns: (row: any, index: number) => {
      let hasEditPer = vm.accessIsOpened("PERM:EVALUATE_LIST:EDIT");
      let hasViewPer = vm.accessIsOpened("PERM:EVALUATE_LIST:VIEW");
      return [
        { label: "评价详情", handler: () => vm.handleDetail(row), hide: !hasViewPer },
        {
          label: "通过",
          hide: !hasEditPer,
          handler: () => vm.handlePass(row, true)
        },
        { label: "不通过", hide: !hasEditPer, handler: () => vm.handleNotPass(row, true) }
      ];
    }
  }
];
const AGENT_DEAL_TABLE_COLUMNS = (vm: any) => [
  {
    title: "客户姓名",
    key: "userName"
  },
  {
    title: "客户手机号",
    key: "userPhone"
  },
  {
    title: "评价商品",
    key: "targetName"
  },
  {
    title: "商品评价",
    key: "star",
    formatter(val: any) {
      return levelMap[val.starValue];
    }
  },
  {
    title: "评价内容",
    key: "commentText"
  },
  {
    title: "处理结果",
    key: "status",
    render(h: any, row: any) {
      let _str = statusMap[row.status];
      return h("div", {}, [h("span", { class: `dot dot${row.status}` }), h("span", {}, _str)]);
    }
  },
  {
    title: "提交时间",
    key: "createdTime",
    formatter(val: any, idx: number, row: any): any {
      return dayjs(val).format("YYYY-MM-DD HH:mm");
    }
  },
  {
    operate: true,
    title: "操作",
    fixed: "right",
    width: 180,
    setBtns: (row: any, index: number) => {
      return [{ label: "评价详情", handler: () => vm.handleDetail(row) }];
    }
  }
];
const FACTORY_TABLE_COLUMNS = (vm: any) => [
  {
    title: "经销商",
    key: "dealerName"
  },
  {
    title: "客户姓名",
    key: "userName"
  },
  {
    title: "客户手机号",
    key: "userPhone"
  },
  {
    title: "购买商品",
    key: "targetName"
  },
  {
    title: "商品评价",
    key: "star",
    formatter(val: any) {
      return levelMap[val.starValue];
    }
  },
  {
    title: "评价内容",
    key: "commentText"
  },
  {
    title: "处理结果",
    key: "status",
    render(h: any, row: any) {
      let _str = statusMap[row.status];
      return h("div", {}, [h("span", { class: `dot dot${row.status}` }), h("span", {}, _str)]);
    }
  },
  {
    title: "评价时间",
    key: "createdTime",
    formatter(val: any, idx: number, row: any): any {
      return dayjs(val).format("YYYY-MM-DD HH:mm");
    }
  },
  {
    operate: true,
    title: "操作",
    fixed: "right",
    width: 180,
    setBtns: (row: any, index: number) => {
      return [{ label: "评价详情", handler: () => vm.handleDetail(row) }];
    }
  }
];
const AGENT_SEARCH_CONFIG = (vm: any) => {
  return {
    props: [
      {
        tag: "input",
        prop: "userName",
        placeholder: "客户姓名"
      },
      {
        tag: "input",
        prop: "phone",
        placeholder: "客户手机号"
      },
      {
        tag: "input",
        prop: "targetName",
        placeholder: "商品名称"
      },
      {
        tag: "select",
        prop: "commentStarLevel",
        placeholder: "商品评价",
        options: levelArr
      }
    ]
  };
};
const AGENT_DEAL_SEARCH_CONFIG = (vm: any) => {
  return {
    props: [
      {
        tag: "input",
        prop: "userName",
        placeholder: "客户姓名"
      },
      {
        tag: "input",
        prop: "phone",
        placeholder: "客户手机号"
      },
      {
        tag: "input",
        prop: "targetName",
        placeholder: "商品名称"
      },
      {
        tag: "select",
        prop: "commentStarLevel",
        placeholder: "商品评价",
        options: levelArr
      },
      {
        tag: "select",
        prop: "status",
        placeholder: "处理结果",
        options: statusArr
      }
    ]
  };
};
const FACTORY_SEARCH_CONFIG: any = (vm: any) => {
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
        change: vm.changeBu2,
        disabled: vm.bu2Region && vm.bu2Region.length === 1
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
        change: vm.changeRegion
      },
      {
        tag: "select",
        prop: "dealerCode",
        placeholder: "经销商",
        keyProp: {
          label: "dealerName",
          value: "dealerCode"
        },
        options: vm.dealerList,
        change: vm.changeDealer
      }
    ]
  };

  return _obj;
};

export default class Const {
  vm: any;
  const: any;

  constructor(vm: any) {
    this.vm = vm;
    this.const = {
      levelMap,
      statusMap,
      FACTORY_TABLE_COLUMNS: FACTORY_TABLE_COLUMNS(vm),
      AGENT_TABLE_COLUMNS: AGENT_TABLE_COLUMNS(vm),
      AGENT_DEAL_TABLE_COLUMNS: AGENT_DEAL_TABLE_COLUMNS(vm),
      AGENT_SEARCH_CONFIG: AGENT_SEARCH_CONFIG(vm),
      AGENT_DEAL_SEARCH_CONFIG: AGENT_DEAL_SEARCH_CONFIG(vm),
      FACTORY_SEARCH_CONFIG: FACTORY_SEARCH_CONFIG(vm)
    };
  }
}
