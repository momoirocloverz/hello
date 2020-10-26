/**
 * @description：用户登录角色
 * @type 集团商户1  主机厂0  经销商2
 * */
const userRoleConfig: any = {
  companyUser: {
    key: "companyUser",
    value: "1",
    routerLoginName: "companyLogin",
    sysPlat: "company",
    label: "集团",
    channel: "1"
  },
  factoryUser: {
    key: "factoryUser",
    value: "0",
    routerLoginName: "factoryLogin",
    sysPlat: "factory",
    label: "主机厂",
    channel: "0"
  },
  agentUser: {
    key: "agentUser",
    value: "2",
    routerLoginName: "agentLogin",
    sysPlat: "agent",
    label: "经销商",
    channel: "2"
  }
};
const customerRoleConfig: any = {
  fans: "FANS", // 粉丝
  member: "POTENTIAL" // 潜客
};

export { userRoleConfig, customerRoleConfig };
