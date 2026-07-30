/* ============================================================
   Moonlight Tarot · 塔羅核心 tarot-core.js
   78張韋特塔羅資料 + 牌陣定義 + 文字解析 + 報告合成引擎
   被 index.html / library.html / studio.html 共用
   ============================================================ */

const SITE_NAME = 'Moonlight Tarot';
const SITE_NAME_ZH = '月光塔羅';

// 牌圖（1909 韋特原版，公有領域掃描）
function cardImg(n) {
  if (n <= 21) return 'cards/m' + String(n).padStart(2, '0') + '.jpg';
  const k = n - 22, suit = ['w', 'c', 's', 'p'][Math.floor(k / 14)];
  return 'cards/' + suit + String((k % 14) + 1).padStart(2, '0') + '.jpg';
}

const TAROT_CARDS = [
  { n: 0, name: '愚者 The Fool', emoji: '🃏', up: '新的開始、冒險、純真、無限可能。放下包袱，帶著信任踏出第一步，宇宙會接住你。', rev: '魯莽、缺乏計畫、猶豫不前。提醒你在跳躍之前先看清腳下，別讓衝動代替勇氣。' },
  { n: 1, name: '魔術師 The Magician', emoji: '🎩', up: '創造力、意志力、資源整合。你已擁有實現目標所需的一切工具，專注意念，化想法為現實。', rev: '操弄、潛能未發揮、目標混亂。檢視自己是否分散了能量，或用技巧掩蓋了初心。' },
  { n: 2, name: '女祭司 The High Priestess', emoji: '🌙', up: '直覺、內在智慧、靜觀。答案不在外面，安靜下來聆聽內心的聲音，它早已知道。', rev: '忽視直覺、祕密、表面化。你可能太依賴頭腦分析而壓抑了內在的聲音。' },
  { n: 3, name: '皇后 The Empress', emoji: '👑', up: '豐盛、滋養、創造與美。享受生活的感官之美，善待自己，豐盛自然流向你。', rev: '過度依賴、創造力阻塞、自我忽視。先照顧好自己，才能滋養他人。' },
  { n: 4, name: '皇帝 The Emperor', emoji: '🏛️', up: '秩序、責任、穩固根基。用紀律和結構建立你的王國，穩定是自由的地基。', rev: '僵化、控制欲、濫用權威。規則是工具不是枷鎖，適時放手也是領導力。' },
  { n: 5, name: '教皇 The Hierophant', emoji: '📿', up: '傳統、學習、心靈導師。向前人的智慧學習，尋找值得信任的引導。', rev: '教條、盲從、需要打破常規。別人的地圖未必適合你的路，質疑是成長的開始。' },
  { n: 6, name: '戀人 The Lovers', emoji: '💞', up: '愛、和諧、重要的選擇。跟隨心的方向做選擇，真正的結合來自價值觀的一致。', rev: '失衡、價值觀衝突、逃避抉擇。檢視這段關係或這個選擇是否讓你成為更好的自己。' },
  { n: 7, name: '戰車 The Chariot', emoji: '🏇', up: '意志、勝利、掌控方向。駕馭內心相反的力量，專注目標勇往直前，勝利屬於堅持的人。', rev: '失控、方向迷失、內耗。停下來重新校準方向，蠻力衝刺不如穩住韁繩。' },
  { n: 8, name: '力量 Strength', emoji: '🦁', up: '溫柔的勇氣、耐心、內在力量。真正的強大是以柔克剛，用愛馴服內心的獅子。', rev: '自我懷疑、內在恐懼、失去耐性。你比自己以為的更強壯，先安撫再出發。' },
  { n: 9, name: '隱者 The Hermit', emoji: '🏮', up: '內省、獨處、尋找真理。暫時退出喧囂，提著自己的燈，答案在安靜中浮現。', rev: '孤立、拒絕幫助、過度退縮。獨處是充電不是逃避，記得回到人群分享你的光。' },
  { n: 10, name: '命運之輪 Wheel of Fortune', emoji: '🎡', up: '轉機、週期、好運降臨。生命之輪正在轉動，順勢而為，變化就是機會。', rev: '阻力、壞循環、抗拒改變。輪子暫時向下時，記住它終將轉上來——這也會過去。' },
  { n: 11, name: '正義 Justice', emoji: '⚖️', up: '公平、因果、誠實面對。你種下的因正在結果，做正確的事，平衡自會到來。', rev: '不公、逃避責任、自欺。誠實檢視自己在這件事中的責任，真相是唯一的出路。' },
  { n: 12, name: '倒吊人 The Hanged Man', emoji: '🙃', up: '換位思考、暫停、臣服。卡住的時候不必掙扎，換個角度看，犧牲換來新視野。', rev: '無謂的犧牲、拖延、僵局。你是在沉澱還是在逃避？該放手的執著就放了吧。' },
  { n: 13, name: '死神 Death', emoji: '🦋', up: '結束與重生、轉化、放下。一個章節正在結束，這不是失去，是為新生騰出空間。', rev: '抗拒改變、停滯、抓著過去。越抗拒越痛苦，允許舊的離開，新的才進得來。' },
  { n: 14, name: '節制 Temperance', emoji: '🕊️', up: '平衡、調和、耐心。不急不徐地調配生活的比例，中庸之道就是你的魔法。', rev: '失衡、過度、缺乏耐性。哪個部分的生活過量了？回到中間，慢慢來比較快。' },
  { n: 15, name: '惡魔 The Devil', emoji: '⛓️', up: '慾望、束縛、面對陰影。看見捆綁你的鎖鏈——它其實沒有上鎖，你隨時可以離開。', rev: '掙脫、覺醒、重獲自由。恭喜你正在鬆綁，繼續往光的方向走。' },
  { n: 16, name: '高塔 The Tower', emoji: '🌩️', up: '突變、崩塌、真相大白。建立在錯誤地基上的終將倒塌，讓它塌，才能重建真實的。', rev: '驚險避開、延遲的崩壞、害怕改變。與其等待崩塌，不如主動拆除不穩的結構。' },
  { n: 17, name: '星星 The Star', emoji: '⭐', up: '希望、療癒、靈感。暴風雨後的寧靜夜空，願望正在被聽見，保持信任。', rev: '失去信心、悲觀、與內在失聯。星星一直都在，只是被雲遮住了，抬頭再看一次。' },
  { n: 18, name: '月亮 The Moon', emoji: '🌕', up: '潛意識、夢境、不確定。前路朦朧時，恐懼會放大影子。走過去，霧會散。', rev: '恐懼消散、真相浮現、走出迷惘。你正在離開迷霧區，黎明就在前面。' },
  { n: 19, name: '太陽 The Sun', emoji: '☀️', up: '喜悅、成功、生命力。最正面的牌！陽光灑在你身上，盡情慶祝、盡情發光。', rev: '暫時的陰霾、過度樂觀、內在小孩受傷。太陽還在，只是今天多雲，快樂需要你允許。' },
  { n: 20, name: '審判 Judgement', emoji: '🎺', up: '覺醒、召喚、重生。過去的總結時刻到了，原諒自己，回應內心更高的召喚。', rev: '自我批判、忽視召喚、困在過去。停止審判自己，你已經做得夠好了。' },
  { n: 21, name: '世界 The World', emoji: '🌍', up: '圓滿、完成、整合。一個大週期完美落幕，慶祝你的成就，準備迎接下一段旅程。', rev: '未完成、缺一角、延遲的成功。離終點只差最後一步，別在99%的地方停下。' },
  { n: 22, name: '權杖一 Ace of Wands', emoji: '🔥', up: '新的靈感之火、行動的開端、創造力迸發。一個充滿潛力的機會正在點燃，跟著熱情走。', rev: '延遲、缺乏動力、靈感熄火。火種還在，先清理讓你分心的柴堆。' },
  { n: 23, name: '權杖二 Two of Wands', emoji: '🔥', up: '規劃未來、展望世界、掌握主動。你站在起點眺望遠方，是時候把願景畫成地圖了。', rev: '害怕未知、計畫停滯、格局太小。地圖畫好了卻不敢出門？門外才有答案。' },
  { n: 24, name: '權杖三 Three of Wands', emoji: '🔥', up: '遠見、擴張、等待成果。你派出的船正在回航，保持信心，繼續佈局下一步。', rev: '阻礙、延誤、計畫受挫。船晚到不代表沉了，檢查是否低估了航程。' },
  { n: 25, name: '權杖四 Four of Wands', emoji: '🔥', up: '慶祝、穩定的基礎、歸屬感。一個階段性的里程碑值得好好慶祝，家是你的堡壘。', rev: '過渡期、不安定、慶祝延後。根基還在打，先別急著辦派對。' },
  { n: 26, name: '權杖五 Five of Wands', emoji: '🔥', up: '競爭、意見衝突、切磋。摩擦不全是壞事，健康的競爭讓每個人變強。', rev: '避免衝突、內在矛盾、緊張緩解。有些架不值得吵，挑值得的戰場。' },
  { n: 27, name: '權杖六 Six of Wands', emoji: '🔥', up: '勝利、公眾認可、凱旋。你的努力被看見了，享受掌聲，但記得謙遜。', rev: '自負、跌落、認可延遲。掌聲是借來的，實力才是自己的。' },
  { n: 28, name: '權杖七 Seven of Wands', emoji: '🔥', up: '堅守立場、以一擋十、捍衛成果。你佔據高地，只要不放棄就不會輸。', rev: '不堪負荷、疲於防守、想放棄。守不住全部就守最重要的，戰略性撤退不可恥。' },
  { n: 29, name: '權杖八 Eight of Wands', emoji: '🔥', up: '快速進展、好消息飛來、事態加速。一切突然動起來了，抓穩，順勢而上。', rev: '延誤、混亂、欲速不達。訊息塞車中，急也沒用，把手上的事做好。' },
  { n: 30, name: '權杖九 Nine of Wands', emoji: '🔥', up: '堅韌、最後防線、傷痕中的勇氣。你已經走了這麼遠，再撐最後一里路。', rev: '疲憊、偏執、防衛過度。放下盾牌休息一下，不是每個人都是敵人。' },
  { n: 31, name: '權杖十 Ten of Wands', emoji: '🔥', up: '重擔、責任壓身、負重前行。你扛了太多，快到終點了，但問問哪些擔子其實不是你的。', rev: '放下重擔、學會委託、瀕臨崩潰。放手不是失敗，是智慧。' },
  { n: 32, name: '權杖侍者 Page of Wands', emoji: '🔥', up: '熱情的訊息、探索新領域、初生之犢。用孩子般的好奇心去嘗試，錯了也是收穫。', rev: '三分鐘熱度、方向不明、壞消息。熱情需要紀律當柴火，否則燒完就沒了。' },
  { n: 33, name: '權杖騎士 Knight of Wands', emoji: '🔥', up: '冒險、大膽行動、魅力四射。全速前進的能量，世界為敢衝的人讓路。', rev: '魯莽、衝過頭、雷聲大雨點小。引擎很猛但方向盤呢？先想清楚再踩油門。' },
  { n: 34, name: '權杖王后 Queen of Wands', emoji: '🔥', up: '自信、溫暖的領導力、獨立。你散發著吸引人的光和熱，大方展現自己。', rev: '嫉妒、缺乏自信、能量耗盡。先把自己的火照顧好，才能溫暖別人。' },
  { n: 35, name: '權杖國王 King of Wands', emoji: '🔥', up: '願景領袖、魄力、開創格局。你有能力把大膽的願景變成現實，帶著人一起走。', rev: '獨斷、暴躁、期望過高。領導是點燃別人，不是燒掉別人。' },
  { n: 36, name: '聖杯一 Ace of Cups', emoji: '💧', up: '新的感情、直覺湧現、心靈滿溢。愛正在流向你，敞開心去接住。', rev: '情感壓抑、心門緊閉、錯過連結。杯子倒著是接不到水的，先把心翻正。' },
  { n: 37, name: '聖杯二 Two of Cups', emoji: '💧', up: '相互吸引、夥伴關係、心意相通。一段平等而美好的連結正在建立，珍惜它。', rev: '失衡、誤解、關係緊張。天平歪了，誠實聊聊比冷戰有用。' },
  { n: 38, name: '聖杯三 Three of Cups', emoji: '💧', up: '友誼、慶祝、社群支持。跟懂你的人一起舉杯，快樂會加倍。', rev: '過度放縱、八卦、社交倦怠。派對太多也會空虛，挑真心的聚。' },
  { n: 39, name: '聖杯四 Four of Cups', emoji: '💧', up: '冷漠、重新評估、對現狀無感。眼前的杯子你看膩了，但別錯過正在遞來的新杯子。', rev: '走出低潮、新的動力、接受機會。你醒過來了，世界其實一直很精彩。' },
  { n: 40, name: '聖杯五 Five of Cups', emoji: '💧', up: '失落、悲傷、專注於失去。三個杯子倒了，但你身後還站著兩個——轉過身。', rev: '接受、放下、重新出發。眼淚流完了，把剩下的杯子端好，往前走。' },
  { n: 41, name: '聖杯六 Six of Cups', emoji: '💧', up: '懷舊、童年回憶、純真的善意。過去的美好滋養現在的你，也許該聯絡老朋友了。', rev: '困在過去、拒絕長大、放不下。回憶是拜訪的地方，不是居住的地方。' },
  { n: 42, name: '聖杯七 Seven of Cups', emoji: '💧', up: '幻想、選擇太多、白日夢。七個杯子都很誘人，但只有一個是真的，用心而不是眼睛選。', rev: '清晰、做出決定、腳踏實地。霧散了，你終於知道自己要什麼。' },
  { n: 43, name: '聖杯八 Eight of Cups', emoji: '💧', up: '離開、尋找更深的意義、勇敢轉身。杯子都堆好了你卻不滿足——因為你的靈魂要的在山的另一邊。', rev: '逃避、害怕改變、反覆糾結。是追尋還是逃跑？只有你自己知道。' },
  { n: 44, name: '聖杯九 Nine of Cups', emoji: '💧', up: '願望成真、滿足、享受成果。這是「心想事成」牌，你值得現在的美好。', rev: '貪心、表面的快樂、不知足。擁有很多還是不快樂？也許許錯了願望。' },
  { n: 45, name: '聖杯十 Ten of Cups', emoji: '💧', up: '圓滿、家庭幸福、情感的彩虹。愛的每個層面都到位了，這就是你一直在建造的家。', rev: '失和、價值觀衝突、理想與現實的落差。完美家庭不存在，真實相愛的家才存在。' },
  { n: 46, name: '聖杯侍者 Page of Cups', emoji: '💧', up: '創意的訊息、直覺的邀請、情感的萌芽。魚從杯裡探頭跟你說話——聽聽那些奇妙的靈感。', rev: '情緒不成熟、多愁善感、創意受阻。感受很珍貴，但別讓它淹沒你。' },
  { n: 47, name: '聖杯騎士 Knight of Cups', emoji: '💧', up: '浪漫、追求理想、優雅前行。帶著聖杯的騎士來提案了，可能是感情，也可能是夢想。', rev: '不切實際、情緒化、空頭支票。浪漫很美，但要看他是否言行一致。' },
  { n: 48, name: '聖杯王后 Queen of Cups', emoji: '💧', up: '同理心、直覺、溫柔的關懷。你能感受別人感受不到的，這是天賦，善用它照顧人。', rev: '情感依賴、過度敏感、情緒淹沒。照顧別人之前，先把自己的杯子倒滿。' },
  { n: 49, name: '聖杯國王 King of Cups', emoji: '💧', up: '情緒成熟、包容、以柔克剛。在情感的海洋上穩坐王座——感受一切，但不被淹沒。', rev: '情緒操控、壓抑、喜怒無常。用情緒控制人或壓抑自己，都會讓海起風暴。' },
  { n: 50, name: '寶劍一 Ace of Swords', emoji: '🗡️', up: '突破、真相、心智的清明。一把新劍劈開迷霧，看清事實的時刻到了。', rev: '混亂、誤判、真相被扭曲。劍鈍了就別急著揮，先磨清思路。' },
  { n: 51, name: '寶劍二 Two of Swords', emoji: '🗡️', up: '僵局、抉擇困難、蒙眼的平衡。你用不做決定來維持和平，但拖延本身也是一種決定。', rev: '僵局打破、資訊揭露、必須面對。眼罩掉了，該看的終究要看。' },
  { n: 52, name: '寶劍三 Three of Swords', emoji: '🗡️', up: '心碎、痛苦的真相、悲傷。三把劍穿心很痛，但清楚的痛勝過模糊的煎熬，讓它痛完。', rev: '療癒開始、原諒、拔劍釋懷。傷口正在癒合，別再自己往回插。' },
  { n: 53, name: '寶劍四 Four of Swords', emoji: '🗡️', up: '休息、恢復、暫時停戰。躺下不是認輸，是為了下一場戰役儲備體力。', rev: '過勞、拒絕休息、重返行動。再不休息身體會直接幫你安排住院休息。' },
  { n: 54, name: '寶劍五 Five of Swords', emoji: '🗡️', up: '衝突、不光彩的勝利、代價高昂。贏了戰役輸了關係，值得嗎？', rev: '和解、放下恩怨、離開戰場。有些勝負不重要了，撿起尊嚴走人。' },
  { n: 55, name: '寶劍六 Six of Swords', emoji: '🗡️', up: '過渡、離開風暴、駛向平靜。船正載你離開困境，回頭看一眼就好，別跳回去。', rev: '無法前行、未解的課題、行李太重。船開不動是因為你還拖著錨。' },
  { n: 56, name: '寶劍七 Seven of Swords', emoji: '🗡️', up: '策略、聲東擊西、獨自行動。有時候不是每張牌都要攤開，聰明行事但守住底線。', rev: '坦白、良心發現、計謀敗露。紙包不住火，誠實是最省力的策略。' },
  { n: 57, name: '寶劍八 Eight of Swords', emoji: '🗡️', up: '自我設限、感覺受困、恐懼的牢籠。綁住你的繩子其實很鬆，眼罩也是自己戴的。', rev: '掙脫束縛、新視角、重獲自由。你發現了：門一直沒鎖。' },
  { n: 58, name: '寶劍九 Nine of Swords', emoji: '🗡️', up: '焦慮、失眠、噩夢纏身。凌晨三點的災難劇本，90%不會發生。你需要的是天亮，不是答案。', rev: '走出陰霾、尋求幫助、惡夢醒來。跟人說出來的那一刻，怪物就縮小了一半。' },
  { n: 59, name: '寶劍十 Ten of Swords', emoji: '🗡️', up: '結束、觸底、最黑的時刻。十把劍插背確實慘，但注意——地平線正在亮起來。谷底的好處是只能往上。', rev: '谷底反彈、重生、倖存。你挺過來了。帶著疤，但站著。' },
  { n: 60, name: '寶劍侍者 Page of Swords', emoji: '🗡️', up: '好奇、警覺、求知若渴。像偵探一樣觀察和學習，但查證再傳話。', rev: '八卦、監視、話多傷人。舌頭也是劍，收好。' },
  { n: 61, name: '寶劍騎士 Knight of Swords', emoji: '🗡️', up: '果斷、直衝目標、雷厲風行。想清楚了就全速執行，猶豫是最貴的成本。', rev: '魯莽、咄咄逼人、為衝而衝。快不等於對，先確認方向再加速。' },
  { n: 62, name: '寶劍王后 Queen of Swords', emoji: '🗡️', up: '理性、獨立、一針見血。你能穿透話術看見本質，設立清楚的界線是你的超能力。', rev: '冷酷、尖銳、心牆太高。理性是保護不是武器，偶爾讓心說話。' },
  { n: 63, name: '寶劍國王 King of Swords', emoji: '🗡️', up: '智慧的權威、真理、公正判斷。用清晰的頭腦做困難的決定，情緒放一邊，事實擺中間。', rev: '濫用權力、冷酷、強詞奪理。最鋒利的劍需要最溫暖的手來持。' },
  { n: 64, name: '錢幣一 Ace of Pentacles', emoji: '🪙', up: '新的財務機會、務實的開始、種子落地。一顆金幣種子交到你手上，好好種，它會長成搖錢樹。', rev: '錯失機會、貪婪、地基不穩。機會溜走通常是因為想一次抓太多。' },
  { n: 65, name: '錢幣二 Two of Pentacles', emoji: '🪙', up: '平衡多工、彈性應變、遊刃有餘。你在幾顆球之間熟練地拋接，記得留一隻手給意外。', rev: '失衡、應接不暇、顧此失彼。球太多就放下幾顆，沒有人能全接住。' },
  { n: 66, name: '錢幣三 Three of Pentacles', emoji: '🪙', up: '團隊合作、技藝被認可、共同建造。你的專業正在被看見，和對的人一起蓋大教堂。', rev: '各自為政、品質妥協、單打獨鬥。一個人走得快，一群人蓋得高。' },
  { n: 67, name: '錢幣四 Four of Pentacles', emoji: '🪙', up: '穩固、儲蓄、守住成果。你抱緊自己掙來的金幣，安全感很好——但別抱到手麻。', rev: '吝嗇、過度控制、一毛不拔。錢是流動的能量，握太緊反而長不大。' },
  { n: 68, name: '錢幣五 Five of Pentacles', emoji: '🪙', up: '財務困難、匱乏感、風雪中前行。寒冬是真的，但教堂的燈也是真的——求助不可恥。', rev: '走出困境、獲得援助、雪停了。最難的一段正在過去，門一直為你開著。' },
  { n: 69, name: '錢幣六 Six of Pentacles', emoji: '🪙', up: '慷慨、施與受的平衡、資源流動。今天你是給予的人，明天可能是接受的人，讓善意循環。', rev: '附帶條件的給予、債務、施捨的傲慢。真正的給予不記帳。' },
  { n: 70, name: '錢幣七 Seven of Pentacles', emoji: '🪙', up: '耐心等待收成、評估進度、長期視角。果樹種下了就別天天挖出來看根——時間在替你工作。', rev: '急躁、不見成果的焦慮、想放棄。複利的前半段都長這樣：無聊、緩慢、然後突然驚人。' },
  { n: 71, name: '錢幣八 Eight of Pentacles', emoji: '🪙', up: '精進技藝、勤奮、匠人精神。一枚一枚金幣慢慢敲，你正在變成大師的路上。', rev: '敷衍了事、完美主義、瞎忙。重複不等於精進，用心敲每一枚。' },
  { n: 72, name: '錢幣九 Nine of Pentacles', emoji: '🪙', up: '豐盛、自給自足、優雅的獨立。你在自己建造的花園裡漫步——這一切是你憑本事掙來的。', rev: '過度工作、炫耀、金玉其外。花園很美，但你有時間散步嗎？' },
  { n: 73, name: '錢幣十 Ten of Pentacles', emoji: '🪙', up: '財富傳承、家族豐盛、長期的安全。這是「財務自由」牌——你建立的不只是財富，是可以傳承的根基。', rev: '財務糾紛、不穩固、短視近利。真正的財富是三代人都能乘涼的樹。' },
  { n: 74, name: '錢幣侍者 Page of Pentacles', emoji: '🪙', up: '學習新技能、務實的起步、腳踏實地的夢想。捧著金幣認真研究的學徒——你的學習正在變現的路上。', rev: '拖延、缺乏進展、光說不練。夢想寫在紙上不會增值，動手才會。' },
  { n: 75, name: '錢幣騎士 Knight of Pentacles', emoji: '🪙', up: '穩紮穩打、可靠、慢但必達。這匹馬不快，但牠從不偏離路線——例行公事就是你的超能力。', rev: '停滯、無聊、過度保守。穩健很好，但偶爾也要讓馬小跑一下。' },
  { n: 76, name: '錢幣王后 Queen of Pentacles', emoji: '🪙', up: '務實的滋養、安全感的營造者、豐盛的照顧。你能同時顧好錢包和家人的胃——這是被低估的才華。', rev: '工作家庭失衡、自我忽視、物質焦慮。照顧所有人之前，記得你也在名單上。' },
  { n: 77, name: '錢幣國王 King of Pentacles', emoji: '🪙', up: '財富、事業成功、可靠的供給者。你坐在自己建立的豐盛王國裡——享受它，也守護它。', rev: '貪婪、物質主義、用錢衡量一切。國王最大的財富，是不需要更多也知足。' },
];

// ===== 問題模板 =====
const TAROT_TEMPLATES = [
  { label: '💼 工作狀態', tpl: '我想要知道未來一個月在「{0}」擔任「{1}」，工作狀態如何？', blanks: ['公司名稱', '職位'] },
  { label: '🔍 找工作', tpl: '我想要知道未來一個月找工作的狀況？', blanks: [] },
  { label: '🌸 桃花', tpl: '我想要知道未來一個月的桃花狀況？', blanks: [] },
  { label: '💑 感情相處', tpl: '我想要知道未來一個月與「{0}」的相處狀況？', blanks: ['對方的名字或稱呼'] },
  { label: '🌈 整體運勢', tpl: '我想要知道未來一個月的整體運勢？', blanks: [] },
  { label: '💰 財運', tpl: '我想要知道未來一個月的財運？', blanks: [] },
  { label: '⚖️ 二擇一', tpl: '我在「{0}」與「{1}」之間難以抉擇，想知道兩條路各自的發展？', blanks: ['選擇 A', '選擇 B'] },
];

// ===== 牌陣定義 =====
const SPREADS = {
  triangle: {
    id: 'triangle', name: '聖三角牌陣', emoji: '🔺', count: 3,
    desc: '主牌看核心，兩張輔助牌補充脈絡。適合大部分的問題。',
    positions: ['主牌', '輔助牌一', '輔助牌二'],
    roles: ['問題的核心能量', '補充脈絡・內在因素', '補充脈絡・外在因素'],
  },
  timeline: {
    id: 'timeline', name: '時間流牌陣', emoji: '⏳', count: 3,
    desc: '過去 → 現在 → 未來，看一件事的能量走向。',
    positions: ['過去', '現在', '未來'],
    roles: ['事情的根源與背景', '目前的狀態', '接下來的走向'],
  },
  choice: {
    id: 'choice', name: '二擇一牌陣', emoji: '⚖️', count: 5,
    desc: '你的現況＋兩條路各自的發展與結果。適合難以抉擇時。',
    positions: ['你的現況', 'A的發展', 'A的結果', 'B的發展', 'B的結果'],
    roles: ['你在抉擇中的狀態', '選擇A的過程', '選擇A的最終結果', '選擇B的過程', '選擇B的最終結果'],
  },
};

// ===== 牌義小工具 =====
function cardZhName(card) { return card.name.split(' ')[0]; }
function meaningOf(card, upright) { return upright ? card.up : card.rev; }
// 牌義開頭「A、B、C。」為關鍵字，其後為建議句
function keywordsOf(card, upright) {
  const t = meaningOf(card, upright);
  return t.split('。')[0];
}
function adviceOf(card, upright) {
  const t = meaningOf(card, upright);
  const i = t.indexOf('。');
  return i >= 0 ? t.slice(i + 1).replace(/。?$/, '。') : t;
}
function suitOf(card) {
  if (card.n <= 21) return '大阿爾克那';
  const z = cardZhName(card);
  if (z.startsWith('權杖')) return '權杖';
  if (z.startsWith('聖杯')) return '聖杯';
  if (z.startsWith('寶劍')) return '寶劍';
  return '錢幣';
}

// ===== 語氣判斷（供綜合解答收尾與二擇一比較） =====
const TONE_POS = ['勝利','成功','喜悅','豐盛','圓滿','好運','希望','慶祝','願望成真','幸福','和諧','轉機','自由','重生','療癒','認可','凱旋','滿足','豐收','清晰','和解','平衡','信任','光','慷慨','走出','掙脫','覺醒','反彈','倖存','機會','美好','珍惜','心想事成','完成','榮耀'];
const TONE_NEG = ['焦慮','失眠','心碎','失落','匱乏','衝突','魯莽','失控','僵局','拖延','恐懼','悲傷','痛苦','疲憊','壓抑','失衡','混亂','操弄','嫉妒','貪婪','停滯','束縛','孤立','逃避','困','危','崩','爭','冷酷','欺','背叛','過勞','擔','沉重','不安','延誤','受挫','放棄','偏執','斷','失去'];
function toneScore(card, upright) {
  const t = meaningOf(card, upright);
  let s = 0;
  TONE_POS.forEach(w => { if (t.includes(w)) s += 1; });
  TONE_NEG.forEach(w => { if (t.includes(w)) s -= 1; });
  return s;
}
function toneLabel(s) { return s >= 2 ? 'pos' : (s <= -2 ? 'neg' : 'neu'); }

// ===== 抽牌 =====
function drawCards(count) {
  const idx = TAROT_CARDS.map((_, i) => i);
  for (let i = idx.length - 1; i > 0; i--) {
    const j = Math.floor(Math.random() * (i + 1));
    [idx[i], idx[j]] = [idx[j], idx[i]];
  }
  return idx.slice(0, count).map(i => ({ card: TAROT_CARDS[i], upright: Math.random() < 0.5 }));
}

// ===== 分享文字（公開站產生 → 工作台可直接解析） =====
function buildShareText(question, spread, draws, when) {
  const lines = [];
  lines.push('🌙 ' + SITE_NAME + ' · ' + SITE_NAME_ZH);
  if (when) lines.push('📅 ' + when);
  lines.push('❓ 問題：' + (question || '（未填寫）'));
  lines.push('🃏 牌陣：' + spread.name);
  draws.forEach((d, i) => {
    lines.push(spread.positions[i] + '　' + cardZhName(d.card) + '　' + (d.upright ? '正位' : '逆位'));
  });
  lines.push('——請幫我解牌 🙏');
  return lines.join('\n');
}

// ===== 文字解析器（工作台用：容錯解析妹紙傳來的文字） =====
// 支援：「主牌 愚者 正位 輔助牌 魔術師 逆位 女祭司 正位」等鬆散格式
// 別名：星幣/金幣→錢幣、隨從→侍者、皇后(小牌)→王后、聖杯Ace→聖杯一
const CARD_ALIASES = (() => {
  const map = []; // [alias, cardIndex]
  const RANK_ALT = { '侍者': ['侍者', '隨從'], '王后': ['王后', '皇后'], '國王': ['國王', '皇帝'] };
  TAROT_CARDS.forEach((c, i) => {
    const zh = cardZhName(c);
    const en = c.name.slice(zh.length).trim();
    map.push([zh, i]);
    if (en) map.push([en, i]);
    if (c.n >= 22) {
      const suit = zh.slice(0, 2), rank = zh.slice(2);
      const suits = suit === '錢幣' ? ['錢幣', '星幣', '金幣'] : [suit];
      const ranks = RANK_ALT[rank] || [rank];
      suits.forEach(s => ranks.forEach(r => { if (s + r !== zh) map.push([s + r, i]); }));
    }
  });
  // 長名優先，避免「皇后」搶走「錢幣皇后」
  map.sort((a, b) => b[0].length - a[0].length);
  return map;
})();

function parseReadingText(text) {
  const found = [];
  const used = []; // 已被占用的字元區間
  const overlaps = (s, e) => used.some(([a, b]) => s < b && e > a);
  for (const [alias, idx] of CARD_ALIASES) {
    let from = 0;
    while (true) {
      const p = text.indexOf(alias, from);
      if (p < 0) break;
      from = p + 1;
      if (overlaps(p, p + alias.length)) continue;
      // 名字後方 12 字內找正/逆位
      const after = text.slice(p + alias.length, p + alias.length + 12);
      const m = after.match(/(正|逆)\s*位?/);
      const upright = m ? m[1] === '正' : true;
      // 名字前方抓標籤（主牌/輔助牌/過去/現在/未來/現況/A/B…）
      const before = text.slice(Math.max(0, p - 14), p);
      const lm = before.match(/(主牌|輔助牌[一二]?|過去|現在|未來|你的現況|現況|A的發展|A的結果|B的發展|B的結果|[AB])\s*[:：]?\s*$/);
      used.push([p, p + alias.length]);
      found.push({ pos: p, card: TAROT_CARDS[idx], upright, label: lm ? lm[1] : null, hasOrient: !!m });
    }
  }
  found.sort((a, b) => a.pos - b.pos);
  // 問題行
  const qm = text.match(/(?:❓\s*)?問題\s*[:：]\s*(.+)/);
  // 牌陣
  let spreadId = null;
  if (/時間流|過去.*現在.*未來/s.test(text)) spreadId = 'timeline';
  else if (/二擇一|A的發展|B的發展/.test(text)) spreadId = 'choice';
  else if (/聖三角|主牌/.test(text)) spreadId = 'triangle';
  if (!spreadId) spreadId = found.length >= 5 ? 'choice' : 'triangle';
  return {
    question: qm ? qm[1].trim() : '',
    spreadId,
    draws: found.map(f => ({ card: f.card, upright: f.upright, label: f.label })),
  };
}

// ===== 報告合成引擎（風格：逐牌簡單介紹 → 湊出一個解答） =====
function pick(arr, seedStr) {
  let h = 0;
  const s = seedStr || String(Math.random());
  for (let i = 0; i < s.length; i++) h = (h * 31 + s.charCodeAt(i)) >>> 0;
  return arr[h % arr.length];
}

function cardBrief(d, role) {
  const zh = cardZhName(d.card);
  const o = d.upright ? '正位' : '逆位';
  return {
    title: `${d.card.emoji} ${zh}（${o}）`,
    role,
    keywords: keywordsOf(d.card, d.upright),
    advice: adviceOf(d.card, d.upright),
  };
}

function synthesize(spreadId, draws, question) {
  const spread = SPREADS[spreadId];
  const seed = draws.map(d => d.card.n + (d.upright ? 'u' : 'r')).join('');
  const kw = i => keywordsOf(draws[i].card, draws[i].upright);
  const firstKw = i => kw(i).split('、')[0];
  const adv = i => adviceOf(draws[i].card, draws[i].upright);
  const name = i => cardZhName(draws[i].card) + (draws[i].upright ? '（正位）' : '（逆位）');
  const tone = i => toneScore(draws[i].card, draws[i].upright);
  const paras = [];

  if (spreadId === 'timeline') {
    paras.push(`把三張牌連起來看，能量的走向是清楚的：過去的「${name(0)}」說明這件事的根源帶著「${firstKw(0)}」的色彩；走到現在，「${name(1)}」顯示你正處在「${kw(1)}」的狀態；而未來由「${name(2)}」接手，指向「${kw(2)}」。`);
    const t = tone(2);
    if (toneLabel(t) === 'pos') {
      paras.push(`整體來說，這是一組往上走的牌。${adv(2)}目前的功課是把現在這一段照顧好——${adv(1)}`);
    } else if (toneLabel(t) === 'neg') {
      paras.push(`未來這張牌提醒你需要多一點準備，但別緊張——塔羅指出的是「照目前慣性走」的方向，方向盤還在你手上。${adv(2)}`);
    } else {
      paras.push(`未來的能量還在成形，不算定局。${adv(2)}把現在做好，未來就會往你要的方向靠。`);
    }
  } else if (spreadId === 'choice') {
    const aScore = tone(1) + tone(2), bScore = tone(3) + tone(4);
    paras.push(`先看你自己：「${name(0)}」顯示你在這個抉擇裡帶著「${kw(0)}」的狀態。${adv(0)}`);
    paras.push(`選擇A這條路，過程是「${name(1)}」（${firstKw(1)}），走到最後是「${name(2)}」——${kw(2)}。選擇B則是由「${name(3)}」（${firstKw(3)}）展開，結果落在「${name(4)}」——${kw(4)}。`);
    if (aScore - bScore >= 2) {
      paras.push(`兩相比較，牌面明顯偏向【選擇A】：它的過程與結果能量都比較順。${adv(2)}`);
    } else if (bScore - aScore >= 2) {
      paras.push(`兩相比較，牌面明顯偏向【選擇B】：它的路徑能量流動得比較順。${adv(4)}`);
    } else {
      paras.push(`兩條路的能量其實不相上下，代表關鍵不在「哪條路對」，而在你帶著什麼心態上路。回到現況牌的提醒：${adv(0)}選那條你願意承擔它的代價、也享受它的風景的路。`);
    }
  } else { // triangle
    paras.push(`這個問題的核心落在主牌「${name(0)}」——關鍵字是「${kw(0)}」。${adv(0)}`);
    paras.push(`兩張輔助牌補上了脈絡：「${name(1)}」帶來「${firstKw(1)}」的訊息，${adv(1)}而「${name(2)}」則提醒「${firstKw(2)}」，${adv(2)}`);
    const total = tone(0) * 2 + tone(1) + tone(2);
    if (toneLabel(Math.round(total / 2)) === 'pos') {
      paras.push(pick([
        `湊起來看，這是一組偏向肯定的牌：方向是對的，帶著主牌的能量放心往前走吧。`,
        `整體牌面是給你打氣的：能量站在你這邊，剩下的只是時間和執行。`,
      ], seed));
    } else if (toneLabel(Math.round(total / 2)) === 'neg') {
      paras.push(`湊起來看，牌面提醒這件事目前阻力不小——但塔羅照出的是現在的慣性，不是判決書。先處理主牌指出的核心課題，局面就會開始鬆動。`);
    } else {
      paras.push(`湊起來看，這是一組「操之在己」的牌：好壞還沒定案，主牌指出的課題就是槓桿點，先動它，其他的會跟著轉。`);
    }
  }
  return paras;
}

// 完整報告文字（工作台用）
function buildReport({ who, question, spreadId, draws, date }) {
  const spread = SPREADS[spreadId];
  const L = [];
  L.push(`🔮 ${who ? '給 ' + who + ' 的' : ''}塔羅解讀`);
  if (date) L.push(`📅 ${date}`);
  if (question) L.push(`❓ 問題：${question}`);
  L.push(`🃏 牌陣：${spread.name}`);
  L.push('');
  L.push('【逐牌解析】');
  draws.forEach((d, i) => {
    const b = cardBrief(d, spread.positions[i] + '・' + spread.roles[i]);
    L.push(`▸ ${spread.positions[i]}｜${b.title}`);
    L.push(`　關鍵字：${b.keywords}`);
    L.push(`　${b.advice}`);
    L.push('');
  });
  L.push('【綜合解答】');
  synthesize(spreadId, draws, question).forEach(p => { L.push(p); L.push(''); });
  L.push('塔羅是與內心對話的鏡子，最終的答案永遠在你自己手上 ✨');
  return L.join('\n');
}
