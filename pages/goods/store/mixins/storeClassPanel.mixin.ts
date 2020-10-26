import { Component,Vue, Watch } from 'vue-property-decorator';
import storeClassPanel from "./../components/storeClassPanel.vue";
import { product_list_api } from "@/api";

@Component({
  components: { storeClassPanel }
})
export default class StoreClassPanelMixin extends Vue{
  oneParentId:number = 0;
  twoParentId: number = 0;
  threeParentId: number = 0;
  oneLoading:boolean = false;
  twoLoading:boolean = false;
  threeLoading:boolean = false;
  oneInfoList:any[] = [];
  twoInfoList:any[] = [];
  threeInfoList:any[] = [];
  timeout:number = 0;
  selectOneName:string = '';
  selectTwoName:string = '';
  selectAllName:string = '';
  category:number = 0 ;
  isOneFirst:boolean = true;
  isTwoFirst:boolean = true;
  isThreeFirst:boolean = true;

  get twoDisabled() {
    return !this.oneInfoList.some((item: any) => item.select);
  }
  get threeDisabled() {
    return !this.twoInfoList.some((item: any) => item.select);
  }

  @Watch('oneInfoList')
  onOneListChange(newVal:any[]){
    let _list = newVal.filter((item:any) => { return item.select });
    this.twoInfoList = [];
    this.threeInfoList = [];
    this.selectOneName = '';
    this.category = 0;
    this.twoLoading = false;
    if(_list.length > 0){
      this.twoParentId = _list[0].id;
      this.selectOneName = _list[0].name;
      this.category = _list[0].id;
      this.twoLoading = true;
      this.getList(_list[0].id,2);
    }
  }
  @Watch('twoInfoList')
  onTwoListChange(newVal:any[]){
    let _list = newVal.filter((item:any) => { return item.select });
    this.threeInfoList = [];
    this.selectTwoName = '';
    this.threeLoading = false;

    if(_list.length > 0){
      this.threeParentId = _list[0].id;
      this.selectTwoName = _list[0].name;
      this.category = _list[0].id;
      this.threeLoading = true;
      this.getList(_list[0].id,3)
    }
  }
  @Watch('threeInfoList')
  onThreeListChange(newVal:any[]){
    let _list = newVal.filter((item:any) => { return item.select });
    this.selectAllName =  this.selectTwoName ? `${this.selectOneName} > ${this.selectTwoName}` : `${this.selectOneName}`;
    if(_list.length > 0){
      this.selectAllName = `${this.selectOneName} > ${this.selectTwoName} > ${_list[0].name}`;
      this.category = _list[0].id;
    }
  }

  addSuc(parentId:number,levelId:number){
    this.getList(parentId,levelId)
  }

  /**
   * @description 获取列表
   * @param parentId 
   * @param level 
   */
  async getList(parentId:number,levelId:number){
    try {
      let { data } = await product_list_api(parentId);
      data.forEach((e:any) => {
        e.value = e.name;
      });
      if(levelId === 1){
        this.oneInfoList = data;
        this.isOneFirst ? this._filterItem(this.oneInfoList) : "";
        this.oneLoading = false;
        this.isOneFirst = false;
      }else if(levelId === 2){
        this.twoInfoList = data;
        this.isTwoFirst ?  this._filterItem(this.twoInfoList) : "";
        this.twoLoading = false;
        this.isTwoFirst = false;
      }else if(levelId === 3){
        this.threeInfoList = data;
        this.isThreeFirst ?  this._filterItem(this.threeInfoList) : "";
        this.threeLoading = false;
        this.isThreeFirst = false;

      }
    } catch (error) {
      this.log(error)
    }
  }
  private _filterItem(arr:any[]){
     arr.map((item:any,index:number)=>{
      item.select = !index;
    })
  }

  /**
   * @description 选中某一行
   *  @param item 
   */
  selectItem(item:any,levelId:number){
    levelId === 1 ? this.oneParentId = item.id : levelId === 2 ? this.twoParentId = item.id : levelId === 3 ? this.threeParentId = item.id : '';
   
    // 如果没有子集就不请求接口，把页面数据清空
    item.hasChild ? this.getList(item.id, levelId+1) : levelId === 1 ? this.twoInfoList = [] : levelId === 2 ? this.threeInfoList = [] : '';
  }

  /**
   * @description 类目搜索
   */
  oneQueryModelSearchAsync(str:any, cb:any){
    this._QueryModelSearchAsync(str,cb,1)
  }
  twoQueryModelSearchAsync(str:any, cb:any){
    this._QueryModelSearchAsync(str,cb,2)
  }
  threeQueryModelSearchAsync(str:any, cb:any){
    this._QueryModelSearchAsync(str,cb,3)
  }
  private _QueryModelSearchAsync(str:any, cb:any,levelId:number){
    let _infoList = this._filterList(levelId);
    var results = str ? _infoList.filter((item:any) => {
      return item.name.toLowerCase().indexOf(str.toLowerCase()) > -1}) : 
      _infoList;
    clearTimeout(this.timeout);
    this.timeout = setTimeout(() => {
      cb(results);
    }, 500 * Math.random());
  }

  /**
   * @description 搜索后选中
   */
  oneHandleSelect(value:any){
    this.oneInfoList = this.oneInfoList.map((item:any)=>{
      item.select = item.name === value.name;
      item.select ? this.selectItem(item,1) : '';
      return item;
    });
  }
  twoHandleSelect(value:any){
    this.twoInfoList = this.twoInfoList.map((item:any)=>{
      item.select = item.name === value.name;
      item.select ? this.selectItem(item,2) : '';
      return item;
    });
  }
  threeHandleSelect(value:any){
    this.threeInfoList = this.threeInfoList.map((item:any)=>{
      item.select = item.name === value.name;
      item.select ? this.selectItem(item,3) : '';
      return item;
    });
  }


  private _filterList(levelId:number):any[] {
    return levelId === 1 ? this.oneInfoList : levelId === 2 ? this.twoInfoList : levelId === 3 ? this.threeInfoList: [];
  }

  mounted() {
    this.oneLoading = true;
    this.twoLoading = true;
    this.threeLoading = true;
    this.getList(0,1)
  }
}