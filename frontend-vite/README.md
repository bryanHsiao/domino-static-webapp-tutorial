# Frontend Vite

This project is the Step 2 frontend layer.

It builds with Vite and writes its output directly into:

- `../hello-webapp/src/main/resources/WebContent/step2`

That means the Domino packaging project remains the same, while the front-end implementation changes from handwritten static files to a real front-end build. The root tutorial page and Step 1 result are preserved separately.

## Commands

Use `npm.cmd` in PowerShell if script policy blocks `npm`.

```powershell
npm.cmd install
npm.cmd run build
```

After that, rebuild the Domino bundle:

```powershell
cd ..\hello-webapp
mvn package
```

## 繁體中文

這個專案是 Step 2 的前端層。

它使用 Vite build，並且會直接把輸出寫到：

- `../hello-webapp/src/main/resources/WebContent/step2`

也就是說，Domino 的打包專案保持不變，但前端實作已經從手寫靜態檔改成正式的前端 build pipeline，同時根首頁與 Step 1 會各自保留。

## 指令

在 PowerShell 中如果 `npm` 被 execution policy 擋住，請使用 `npm.cmd`。

```powershell
npm.cmd install
npm.cmd run build
```

完成後，再重新打包 Domino bundle：

```powershell
cd ..\hello-webapp
mvn package
```
