# 訓練日誌 fit-log

個人專用的健身紀錄 PWA：記錄運動與飲食、算熱量、規則式排課表、用 3D 模型看體態變化。
單人本機使用，不做登入、不做雲端帳號，所有資料存在瀏覽器裡。

**線上使用（手機直接開）：** https://weeeeenfp.github.io/fitSite/

打開後可用 Safari 選單「加入主畫面」，變成像 App 的圖示，離線也能記錄。

## 本機開發

```bash
cd frontend
npm install
npm run dev
```

推送到 `main` 分支會自動透過 GitHub Actions 建置並部署到上面的網址。
