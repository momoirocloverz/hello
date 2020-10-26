interface GroupForm {
  id?: any;
  principalId?: any;
  name: string;
  shortName: string;
  area: string;
  phone: string;
  principalAccount: string;
  principalName: string;
  principalPhone: string;
}
interface GroupObj {
  loading: boolean;
  list: Array<{}>;
  total: number;
}
export { GroupForm };
