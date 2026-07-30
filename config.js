/* ============================================================
   Moonlight Tarot · 設定檔
   要改的東西都在這裡，其他檔案不用動
   ⚠️ 這個檔案會上 GitHub 公開，不要放任何敏感資料
   ============================================================ */

// ① Google Apps Script 部署後的網址（結尾是 /exec）
//    還沒設定就留空字串，網站照常運作，只是不會自動記錄
const CLOUD_URL = 'https://script.google.com/macros/s/AKfycbw_WPci2QnlGLwMep-ACxN4Mgz-KbPeWcSsdgt4nCXUU9z9m2zEy2OU7DZknrwElu5i/exec';

// ② 寫入鑰匙 —— 公開的，只能「新增抽牌紀錄」，讀不到任何資料
//    要跟 Apps Script 裡的 WRITE_KEY 一模一樣
const CLOUD_WRITE_KEY = 'ml-write-8f3a2c';

// ③ 工作台密碼（前端擋君子用，原始碼看得到，別放真機密）
const STUDIO_PWD = 'orangeba';

// ⚠️ 讀取鑰匙（READ_KEY）故意不寫在這裡。
//    它只存在你的 Apps Script 裡，以及你工作台瀏覽器的 localStorage。
//    這樣就算有人翻遍公開原始碼，也讀不到你的紀錄。
