# tsproject

## Project setup, use yarn
```
yarn [install]
```

### Compiles and hot-reloads for development
```
yarn start / dev
```

### Compiles and minifies for production
```
yarn build / build:test (depends on .env U choose)
```

### Prettier your tests
```
yarn prettier
```

### Generate ur route-config
> files in pages should be named like user[.id].vue, then generated route-config is <br>
 { <br>
 &emsp;&emsp;&emsp;path: "/user[/:id]",<br>
 &emsp;&emsp;&emsp;name: "user",<br>
 &emsp;&emsp;&emsp;component: () => import("@/pages/user[.id].vue"),<br>
 }

```
yarn generate:route
```

### i18n
explanatory note in main.ts & shims-tsx.d.ts 

### @/pages文件夹下文件命名规则：
1. /share/about.type.id.vue 会动态计算到 @/router/route-append.ts 里面，被解析为 
  {
    path: "/about/:type/:id",
    name: "share-about",  这里只取文件前面的名字，不取参数
    component: () => import("@/share/about.type.vue"),
    meta: { ...args }
  }
动态传参方式，模板是在 ./route-generator.js。（传参数尽量使用这种传参的方式）。
3. 路由动态计算会忽略 @/pages/**/component/ 或者 **/const/ 或者 **/style/ 文件夹下的内容。
4. 不需要动态计算的路由文件写到base.ts里面去，会自动忽略。
ps：修改文件后会重复大概两次左右的重新生成路由，不要慌张。

### src/@types使用
1. 在引入第三方模块或本地模块会红线报错，找不到对应的声明文件，此时可以在@types/definition.d.ts 文件中声明模块
2. declare module 类似于声明了命名空间，可以声明interface避免混淆
