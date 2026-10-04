# 校園守護者

教師宣講用的像素 RPG 資安簡報。打開 `index.html` 即可；圖片、樣式與互動程式皆已內嵌。閱讀外部資訊來源需連網。

十二個情境，包含情境介紹、選擇、各別錯誤後果、重試及貓頭鷹解說。每關解說末尾可開啟具體來源。畫面無日期、時長、倒數、分數或血量。

## 操作

- 點選畫面按鈕；選項也可用 A、B、C。
- 右方向鍵前進介紹與解說；選擇題須先作答。
- 左方向鍵返回。
- 「章節」供講師跳至指定情境；「全螢幕」供投影。
- 本機記錄可用時，封面出現「接續上次」。儲存不可用仍能完整操作。

校內窗口採職務稱呼，未虛構承辦人、分機或正式校內程序。

## 維護

`src/content.js` 維護劇情與來源，`src/style.css` 維護版面，`src/app.js` 維護互動；`assets/` 是內建 image_gen 生成的正式素材，提示詞見 `assets/provenance.json`。

```sh
python3 build.py
```

使用者提供的原始講綱、PPTX 及 QA 截圖不入庫。查證紀錄見 `source-ledger.json`。

Tracking: https://github.com/cyclone-tw/slides/issues/11

此版本供本機預覽，尚未公開發布。
