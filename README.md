# SampleElectronPreload

让你的electron请求更加简单

## 使用案例

````typescript
// FileHandler.ts
import {Request} from "@stread/sample-electron-preload/main"

export class FileHandler {
    @Request()
    openFileDialog(event: IpcMainInvokeEvent) {
        return {test: 1}
    }
}
````

````typescript
// Loader.ts
import {FileHandler} from "example/FileHandler";

export const LoaderHandler = [
    FileHandler
]
````

````typescript
// 请求端
import {ElectronRequest} from "@stread/sample-electron-preload/renderer";

const res = await ElectronRequest("FileHandler.openFileDialog", config);
console.log(res) //{test: 1}
````

## 先决条件

### 安装
``` npm install @stread/sample-electron-preload```

### 增加loader文件

这个文件用于初始化handler, 文件的位置随意, 建议放到 electron-main文件附近  
内容如下:

````typescript
    // 所有用户自定义的handler应该都在这里
export const LoaderHandler = [
    XXX
]
````

### 在main文件中引入代码

你可以将下面的代码放到 app.whenReady() 之后, 或者then 回调中

````typescript
// 这里主要是监听请求接口
import {StartListen} from "@stread/sample-electron-preload/main"

StartListen();
// 然后引入 Loader.ts 的内容, 做一次初始化
console.log(`Handler Number: `, LoaderHandler.length)
````

### 在preload中引入路由声明

````
export * from "@stread/sample-electron-preload/preload"
````



