/* ============================================================
   Moonlight Tarot · 設定檔
   要改的東西都在這裡，其他檔案不用動
   ⚠️ 這個檔案會上 GitHub 公開，不要放任何敏感資料
   ============================================================ */

// ① Google Apps Script 部署後的網址（結尾是 /exec）
//    還沒設定就留空字串，網站照常運作，只是不會自動記錄
const CLOUD_URL = 'https://script.google.com/macros/s/AKfycbx-Dp8SZsjQ-IceKOatwQHJhAk7oIWkJKF694GPQB-ONl19kg59ttVjY4aCu67N1S_d/exec';

// ② 寫入鑰匙 —— 公開的，只能「新增抽牌紀錄」，讀不到任何資料
//    要跟 Apps Script 裡的 WRITE_KEY 一模一樣
const CLOUD_WRITE_KEY = 'ml-write-8f3a2c';

// ③ 工作台密碼（前端擋君子用，原始碼看得到，別放真機密）
const STUDIO_PWD = 'orangeba';

// ⚠️ 讀取鑰匙（READ_KEY）故意不寫在這裡。
//    它只存在你的 Apps Script 裡，以及你工作台瀏覽器的 localStorage。
//    這樣就算有人翻遍公開原始碼，也讀不到你的紀錄。

// ④ 贊助連結（選填）。整個留空 = 網站上完全不會出現贊助區塊
//    可以依語言給不同連結：台灣人用綠界，國外用 Ko-fi
//
//    綠界 ECPay 贊助連結：支援超商代碼、ATM、信用卡、LINE Pay，台灣人最方便
//      申請：https://p.ecpay.com.tw  → 產生的連結長得像 https://p.ecpay.com.tw/XXXXXX
//    Ko-fi：走 PayPal，適合海外訪客
//
//    zh 留空的話會自動退回用 en 的連結，所以還沒申請好也不會壞掉。
const TIP_URL = {
  zh: '',                                        // ← 綠界連結填這裡
  en: 'https://ko-fi.com/moonlighttarottw',
  ja: 'https://ko-fi.com/moonlighttarottw',
};

// 中文版的贊助文案（英日文的在 i18n.js 裡）
const TIP_TEXT = '這次的牌如果有幫到你，可以請我喝杯咖啡 ☕';
