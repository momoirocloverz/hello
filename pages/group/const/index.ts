import area from "@/const/area.json";
import ActiveStatus from "../components/activeStatus.vue";
/**
 * 集团搜索配置
 * @param vm
 * @constructor
 */
const GROUP_SEARCH_CONFIG: any = (vm: any) => {
  let hasEditPer = vm.accessIsOpened("PERM:BLOC:EDIT");
  let _obj: any = {
    props: [
      {
        tag: "input",
        prop: "name",
        placeholder: "集团名称"
      },
      {
        tag: "input",
        prop: "shortName",
        placeholder: "集团简称"
      },
      {
        tag: "select",
        prop: "enabled",
        placeholder: "状态",
        maxLength: 20,
        options: [
          {
            label: "启用",
            value: 1
          },
          {
            label: "冻结",
            value: 0
          }
        ]
      }
    ]
  };
  if (hasEditPer) {
    _obj.addBtn = {
      label: "新建集团",
      handler: () => {
        vm.add();
      }
    };
  }
  return _obj;
};

const AGENT_SEARCH_CONFIG: any = (vm: any) => {
  return {
    props: [
      {
        tag: "input",
        prop: "name",
        placeholder: "经销商名称"
      },
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
        prop: "region",
        placeholder: "区域",
        keyProp: {
          label: "name",
          value: "name"
        },
        options: vm.allRegion
      }
    ]
  };
};

/**
 * 集团状态
 */
const GROUP_STATUS: Array<{}> = [
  {
    label: "冻结",
    value: 0
  },
  {
    label: "启用",
    value: 1
  }
];
/**
 * 集团表单属性
 */
const GROUP_PROPS: any = (vm: any) => {
  return [
    {
      tag: "input",
      label: "集团名称",
      prop: "name",
      placeholder: "请输入集团公司名称",
      maxLength: 20
    },
    {
      tag: "input",
      label: "集团简称",
      prop: "shortName",
      placeholder: "请输入集团简称",
      maxLength: 10
    },
    {
      tag: "cascader",
      label: "所在城市",
      prop: "area",
      placeholder: "请选择省市",
      maxLength: 20,
      optionProps: {
        value: "label",
        label: "label"
      },
      options: area.jsonList
    },
    {
      tag: "input",
      label: "联系电话",
      prop: "phone",
      placeholder: "请输入联系电话",
      maxLength: 20
    },
    {
      tag: "input",
      label: "集团账号",
      disabled: vm.dialogObj.type === "edit",
      prop: "principalAccount",
      placeholder: "请输入字母/数字",
      maxLength: 20,
      tip: "账号具有唯一性,设置后不支持修改"
    },
    {
      tag: "input",
      label: "负责人",
      prop: "principalName",
      placeholder: "请输入负责人姓名",
      maxLength: 20
    },
    {
      tag: "input",
      label: "负责人手机号",
      prop: "principalPhone",
      placeholder: "请输入11位数手机号",
      maxLength: 11
    }
  ];
};
//  之前产品启用时可编辑负责人和手机号，后续再改
const START_GROUP_PROPS = [
  {
    tag: "text",
    label: "集团名称",
    prop: "name"
  },
  {
    tag: "text",
    label: "集团简称",
    prop: "shortName",
    maxLength: 10
  },
  {
    tag: "text",
    label: "所在城市",
    prop: "area",
    formatter: (val: Array<string>) => {
      return val ? val.join("/") : "";
    }
  },
  {
    tag: "text",
    label: "联系电话",
    prop: "phone"
  },
  {
    tag: "text",
    label: "集团账号",
    prop: "principalAccount"
  },
  {
    tag: "text",
    label: "负责人",
    prop: "principalName",
    placeholder: "请输入负责人姓名",
    maxLength: 20
  },
  {
    tag: "text",
    label: "负责人手机号",
    prop: "principalPhone",
    placeholder: "请输入11位数手机号",
    maxLength: 11
  }
];
// 集团表单RULE
const GROUP_RULES = {
  name: { required: true, trigger: "blur", message: "请输入集团公司名称" },
  shortName: { required: true, trigger: "blur", message: "请输入集团简称" },
  phone: {
    required: true,
    trigger: "blur",
    message: "请输入联系电话",
    pattern: /(^(([0+]\d{2,3}-?)?(0\d{2,3})-?)(\d{7,8})(-?(\d{3,}))?$)|(^0{0,1}1[3-9][0-9]{9}$)/
  },
  area: { required: true, trigger: "change", message: "请选择省市" },
  principalAccount: { required: true, trigger: "blur", pattern: /^[0-9a-zA-Z]+$/, message: "请输入字母/数字" },
  principalName: { required: true, trigger: "blur", message: "请输入负责人姓名" },
  principalPhone: { required: true, trigger: "blur", message: "请输入11位数手机号", pattern: /^(\+86)?1\d{10}$/g }
};
/**
 * 集团表格
 * @param vm
 * @constructor
 */
const GROUP_TABLE_COLUMNS = (vm: any) => [
  {
    title: "集团名称",
    key: "name"
  },
  {
    title: "集团简称",
    key: "shortName"
  },
  {
    title: "联系电话",
    key: "phone"
  },
  {
    title: "所在城市",
    key: "area"
  },
  {
    title: "集团账号",
    key: "principalAccount"
  },
  {
    title: "负责人",
    key: "principalName"
  },
  {
    title: "负责人手机号",
    key: "principalPhone"
  },
  {
    title: "旗下经销商",
    key: "dealerNum",
    slot: true,
    slotName: "dealerNum"
  },
  {
    title: "状态",
    key: "enabled",
    render: (h: any, row: any) => {
      return h(ActiveStatus, { props: { row: row } }, null);
    }
  },
  {
    operate: true,
    title: "操作",
    width: 200,
    setBtns: (row: object, index: number) => {
      return vm.getDealBtns(row, index);
    }
  }
];

const AGENT_TABLE_COLUMNS = (vm: any) => {
  let _arr: Array<any> = [
    {
      title: "经销商代码",
      key: "dealerCode"
    },
    { title: "经销商名称", key: "dealerName" },
    { title: "经销商简称", key: "dealerShortName" },
    { title: "事业部", key: "buName" },
    { title: "大区", key: "regionName" },
    // { title: "联系电话", key: "contactNumber" },
    // { title: "所在城市", key: "area" }
  ];
  return vm.isBind
    ? [
        {
          type: "selection",
          width: 60
        }
      ].concat(_arr)
    : _arr.concat({
        operate: true,
        title: "操作",
        setBtns: (row: object, index: number) => {
          let hasEditPer = vm.accessIsOpened("PERM:BLOC:EDIT");
          return [{ label: "解绑", hide: !hasEditPer, handler: () => vm.removeBind(row, index) }];
        }
      });
};
export default class Index {
  vm: any;
  const: any;

  constructor(vm: any) {
    this.vm = vm;
    this.const = {
      GROUP_STATUS,
      GROUP_PROPS: GROUP_PROPS(this.vm),
      START_GROUP_PROPS,
      GROUP_RULES,
      GROUP_TABLE_COLUMNS: GROUP_TABLE_COLUMNS(this.vm),
      GROUP_SEARCH_CONFIG: GROUP_SEARCH_CONFIG(this.vm),
      AGENT_SEARCH_CONFIG: AGENT_SEARCH_CONFIG(this.vm),
      AGENT_TABLE_COLUMNS: AGENT_TABLE_COLUMNS(this.vm)
    };
  }

  getBtnByStatus(row: any) {
    let vm: any = this;
    let _btns: Array<{}> = [];
    let hasEditPer = vm.accessIsOpened("PERM:BLOC:EDIT");
    let hasViewPer = vm.accessIsOpened("PERM:BLOC:VIEW");

    let _del = { label: "删除", hide: !hasEditPer, handler: () => vm.delete(row) };
    let _edit = { label: "编辑", hide: !hasEditPer, handler: () => vm.edit(row) };
    let _frozen = { label: "冻结", hide: !hasEditPer, handler: () => vm.frozen(row) };
    let _start = { label: "启用", hide: !hasEditPer, handler: () => vm.start(row) };
    let _resetPwd = { label: "重置密码", hide: !hasEditPer, handler: () => vm.resetPwd(row) };
    if (row.enabled) {
      // 启用
      _btns = [_edit, _frozen, _resetPwd];
    } else {
      // 冻结
      _btns = [_edit, _start, _resetPwd, _del];
    }

    return _btns;
  }
}
