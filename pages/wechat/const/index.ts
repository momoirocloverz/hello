// 头部数组
const MENU_SET_HEAD_ARR: Array<{}> = [
  {
    label: "图文信息",
    value: "news",
    icon: "iconfont iconds-icon-tuwenxinxi"
  },
  {
    label: "文字",
    value: "text",
    icon: "iconfont iconfont"
  },
  {
    label: "图片",
    value: "img",
    icon: "el-icon-picture-outline"
  }
  // {
  //   label: "视频",
  //   value: "video",
  //   icon: "el-icon-video-camera"
  // }
];
// 菜单内容数组
const MENU_CONTENT: element.Options[] = [
  {
    value: "click",
    label: "发送信息"
  },
  {
    value: "view",
    label: "跳转网页"
  }
];
//  图文
const PIC_TEXT_CHOOSE_ARR: Array<{}> = [
  {
    label: "从素材库选择",
    value: 1,
    icon: "el-icon-folder"
  },
  {
    label: "自建图文",
    value: 2,
    icon: "el-icon-edit-outline"
  }
];
// 图片
const PIC_CHOOSE_ARR: Array<{}> = [
  {
    label: "从素材库选择",
    value: 1,
    icon: "el-icon-folder"
  },
  {
    label: "上传图片",
    type: "upload",
    value: 2,
    icon: "el-icon-picture-outline"
  }
];
const VIDEO_ARR: Array<{}> = [
  {
    label: "从素材库选择",
    value: 1,
    icon: "el-icon-folder"
  },
  {
    label: "新建视频",
    value: 2,
    icon: "el-icon-picture-outline"
  }
];
const BELONG_ARR: element.Options[] = [
  {
    label: "自建",
    value: 1
  },
  {
    label: "集团",
    value: 2
  },
  {
    label: "主机厂",
    value: "3"
  }
];
export { MENU_SET_HEAD_ARR, MENU_CONTENT, PIC_TEXT_CHOOSE_ARR, PIC_CHOOSE_ARR, VIDEO_ARR, BELONG_ARR };
