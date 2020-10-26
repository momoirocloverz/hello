import { arrToObject } from "@/utils";

// 优惠劵
const COUPON_TYPES: element.Options[] = [
  {
    label: "现金券",
    value: 0
  },
  {
    label: "折扣券",
    value: 1
  }
];

/**
 * 自建状态
 */
const AGENT_STATUS_ARR: element.Options[] = [
  {
    label: "未投放",
    value: 0
  },
  {
    label: "已投放",
    value: 1
  },
  {
    label: "进行中 ",
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

// 集团的活动状态
const GROUP_STATUS_ARR: element.Options[] = [
  {
    label: "未投放",
    value: 0
  },
  {
    label: "已投放",
    value: 1
  },
  {
    label: "进行中",
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
// 主机厂的活动
const FACTORY_STATUS_ARR: element.Options[] = [
  {
    label: "未投放",
    value: 0
  },
  {
    label: "已投放",
    value: 1
  },
  {
    label: "进行中 ",
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
// 审核状态
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
// 供应商状态对象
const AGENT_STATUS_OBJ = arrToObject(AGENT_STATUS_ARR);
const GROUP_STATUS_OBJ = arrToObject(GROUP_STATUS_ARR);
const SHARE_PROPS = [
  {
    tag: "input",
    label: "分享标题",
    prop: "title",
    placeholder: "请输入分享标题",
    maxLength: 20
  },
  {
    tag: "upload",
    label: "分享图片",
    prop: "image",
    size: 3072,
    type: "picture-card",
    tip: "支持格式：jpg、png、bmp，单个文件不能超过3MB，建议尺寸200*200px，或等比图片",
    fixedNumber: [1, 1]
  },
  {
    tag: "input",
    label: "分享内容",
    row: 10,
    type: "textarea",
    prop: "content",
    placeholder: "请输入分享内容",
    tip: "注：分享到朋友圈时，只显示分享标题",
    maxLength: 30
  }
];
const DETAIL_SHARE_PROPS = [
  {
    tag: "text",
    label: "分享标题",
    prop: "title"
  },
  {
    label: "分享图片",
    prop: "image"
  },
  {
    tag: "text",
    label: "分享内容",
    prop: "content"
  }
];
// 次数数组
const NUMS_RULES: element.Options[] = [
  {
    label: "次/活动全程",
    value: "ALL_TIMES"
  },
  {
    label: "次/每日",
    value: "DAILY"
  }
];
// 领取规则
const LIMIT_RULES: element.Options[] = [
  {
    label: "活动时间内领取",
    value: 0
  },
  {
    label: "活动结束后",
    value: 1
  }
];
// 人数限定规则
const LIMIT_PERSON: element.Options[] = [
  {
    label: "不限制人数",
    value: -1
  },
  {
    label: "限制人数",
    value: 1
  }
];
const TASK_TYPE_ARR: element.Options[] = [
  {
    label: "在线预订",
    value: "RESERVATION_ONLINE"
  },
  {
    label: "预约试驾",
    value: "TEST_DRIVE"
  },
  {
    label: "邀请新用户",
    value: "INVITATION"
  }
];
const DETAIL_SITE_AWARDS_PROPS = [
  {
    tag: "text",
    label: "现场互动工具",
    prop: "messageBoardEnabled",
    formatter(val: any, row: any) {
      let _arr: Array<any> = [];
      if (row.signinEnabled) {
        _arr.push("现场签到");
      }
      if (row.messageBoardEnabled) {
        _arr.push("留言墙");
      }
      if (row.luckydrawEnabled) {
        _arr.push("大屏抽奖");
      }
      return _arr.join(",");
    }
  },
  {
    label: "奖项设置",
    prop: "awardSet",
    show: "this.form.luckydrawEnabled"
  }
];

export {
  COUPON_TYPES,
  AGENT_STATUS_ARR,
  GROUP_STATUS_ARR,
  FACTORY_STATUS_ARR,
  APPROVAL_STATUS_ARR,
  AGENT_STATUS_OBJ,
  GROUP_STATUS_OBJ,
  SHARE_PROPS,
  DETAIL_SHARE_PROPS,
  TASK_TYPE_ARR,
  NUMS_RULES,
  LIMIT_RULES,
  LIMIT_PERSON,
  DETAIL_SITE_AWARDS_PROPS
};
