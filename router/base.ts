// separated from auto ROUTE
module.exports = [
  {
    path: "/snap",
    name: "snap-index",
    component: () => import("@/pages/snap/index.vue"),
    meta: {
      withMenu: true
    }
  },
  // 集团商户管理端
  {
    path: "/companyLogin",
    name: "companyLogin",
    component: () => import("@/pages/login.vue"),
    meta: {
      sysPlat: "company",
      label: "集团",
      withMenu: false,
      // 登录认证 是否需要重定
      withoutAuth: true
    }
  },
  // 主机厂管理端
  {
    path: "/factoryLogin",
    name: "factoryLogin",
    component: () => import("@/pages/login.vue"),
    meta: {
      sysPlat: "factory",
      label: "主机厂",
      withMenu: false,
      // 登录认证 是否需要重定
      withoutAuth: true
    }
  },
  // 经销商管理端
  {
    path: "/agentLogin",
    name: "agentLogin",
    component: () => import("@/pages/login.vue"),
    meta: {
      sysPlat: "agent",
      label: "经销商",
      withMenu: false,
      // 登录认证 是否需要重定
      withoutAuth: true
    }
  },
  // 让地址为 login 和 没有地址 重定向到 经销商
  {
    path: "/",
    redirect: "/agentLogin"
  },
  {
    path: "/login",
    name: "login",
    redirect: "/agentLogin",
    meta: {
      withMenu: false,
      // 登录认证 是否需要重定
      withoutAuth: true
    }
  },
  {
    path: "/forgetPwd",
    name: "forgetPwd",
    component: () => import("@/pages/forgetPwd.vue"),
    meta: {
      withMenu: false,
      // 登录认证 是否需要重定
      withoutAuth: true
    }
  },
  {
    path: "*",
    name: "notFound",
    component: () => import("@/pages/notFound.vue"),
    meta: {
      withMenu: false
    }
  }
];
