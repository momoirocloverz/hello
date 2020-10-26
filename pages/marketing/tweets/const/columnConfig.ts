export default class Config {
  get(vm: any): any {
    return {
      // 搜索栏
      searchConfig: () => {
        if(vm.accessIsOpened('PERM:COLUMNS:EDIT')){
          return {
            addBtn: {
              label: "新建栏目",
              handler: () => {
                  vm.showDialog();
              }
            }
          }
        }
        return {}
      },
     
      // 表格配置
      tableColumns: [
        {
          title: "栏目名称",
          key: "name"
        },
        {
          operate: true,
          width:150,
          title: "操作",
          setBtns: (row: object, index: number) => {
            if(vm.accessIsOpened('PERM:COLUMNS:EDIT')){
              return [
                {
                  label: "编辑",
                  handler: () => vm.showDialog(row)
                },
                {
                  label: "删除",
                  handler: () => vm.del(row, index)
                }
              ];
            }
            return [];
          }
        }
      ]
      
    }
  }

  
  
}