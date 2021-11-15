# 脚手架
node14.18.1 + volar + vite2.x + vue3.x + vue-router4.x + vuex4.x + element-plus + typeScript + axios + scss脚手架

# 目前实现的功能

## 2021-11-15

1. `scss`引入
2. `element-plus`按需引入
3. `vue-router4.x`引入，静态路由模块实现自动化导入
4. `vuex4.x`引入，`vuex`模块实现自动化挂载
5. `axios`引入，已进行封装
6. `mock`引入，已配置开发环境与生产环境使用条件
7. `svgIcon`实现全局挂载，可全局随意调用
8. 导航守卫、动态路由配置已实现
9. 登录路由控制已实现
10. 由登录-进入导航守卫-`axios`请求`mock`接口获取动态路由-`vuex`中处理动态、静态路由-导航守卫中挂载所有路由-登录成功跳转页面，整条链路已走通

# 配置步骤

1. [详细步骤][1] 
[1]:https://github.com/kaivin/scaffold/blob/main/public/doc/01初始化基础配置.md "初始化基础配置" 

## 命令

1. 下载
```
git clone git@github.com:kaivin/scaffold.git
```

2. 安装

```
yarn
```

3. 运行开发环境

```
yarn start
```

4. 输出生产环境

```
yarn build
```