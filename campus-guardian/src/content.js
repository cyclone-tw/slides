const SOURCES = {
  voice: {publisher:'FTC 美國聯邦貿易委員會',title:'Scammers use AI to enhance their family emergency schemes',url:'https://consumer.ftc.gov/consumer-alerts/2023/03/scammers-use-ai-enhance-their-family-emergency-schemes',note:'聲音可被仿冒；使用已知電話另行確認。'},
  clickfix: {publisher:'TWCERT/CC',title:'駭客結合惡意廣告與 AI 平台發動 ClickFix 攻擊',url:'https://www.twcert.org.tw/newepaper/cp-146-11067-5d2f9-3.html',note:'假驗證誘導執行指令，以及隔離設備、檢查帳號的應變建議。'},
  moe: {publisher:'教育部',title:'中小學使用「生成式人工智慧」注意事項 2.0（教師、行政人員及家長版）',url:'https://www.ycjh.tp.edu.tw/uploadfiles/annex/20260102141112_2.pdf',note:'第四、五、八點；教育部文件，由臺北市立螢橋國中網站提供原文 PDF。'},
  prompt: {publisher:'Google',title:'使用 Google 提示登入',url:'https://support.google.com/accounts/answer/7026266?hl=zh-Hant',note:'未發起登入卻收到通知時，拒絕要求並檢查帳戶。'},
  mfa: {publisher:'Google',title:'開啟兩步驟驗證功能',url:'https://support.google.com/accounts/answer/185839?hl=zh-Hant',note:'在密碼以外增加驗證步驟。'},
  third: {publisher:'Google',title:'管理 Google 帳戶與第三方之間的連結',url:'https://support.google.com/accounts/answer/13533235?hl=zh-Hant',note:'區分登入連結與資料存取；移除連結不等於刪除第三方已持有資料。'},
  key: {publisher:'Google AI for Developers',title:'Using Gemini API keys',url:'https://ai.google.dev/gemini-api/docs/api-key',note:'Security and secret management、Leak response checklist、Restricting and securing your keys。'},
  mask: {publisher:'MDN Web Docs',title:'HTML 密碼輸入欄位',url:'https://developer.mozilla.org/en-US/docs/Web/HTML/Reference/Elements/input/password',note:'遮蔽畫面字元不會清除欄位的實際值。'},
  byok: {publisher:'OpenRouter',title:'Bring your own API Keys',url:'https://openrouter.ai/docs/guides/overview/auth/byok',note:'BYOK 指使用自己的供應商金鑰；本教材不推薦特定工具。'},
  share: {publisher:'Google',title:'透過 Google 雲端硬碟共用檔案',url:'https://support.google.com/drive/answer/2494822?hl=zh-Hant',note:'指定對象、一般存取權、檢視與編輯權限及資料夾的影響。'},
  account: {publisher:'Google',title:'保護遭到入侵或盜用的 Google 帳戶',url:'https://support.google.com/accounts/answer/6294825?hl=zh-Hant',note:'變更密碼、檢查活動、陌生裝置與安全設定。'},
  shared: {publisher:'Google',title:'在他人的裝置上登入帳戶',url:'https://support.google.com/accounts/answer/2917834?hl=zh-Hant',note:'訪客／私密瀏覽與用完後登出。'},
  incognito: {publisher:'Google',title:'使用無痕模式瀏覽網路',url:'https://support.google.com/chrome/answer/95464?hl=zh-Hant',note:'無痕模式的保護範圍；下載檔案仍保留在裝置上。'},
  protection: {publisher:'衛生福利部',title:'終結性影像，沒有人是局外人！',url:'https://www.mohw.gov.tw/fp-16-74815-1.html',note:'不散布性影像；記錄網址、帳號等線索並尋求協助。'},
  siarc: {publisher:'衛生福利部性影像處理中心',title:'性影像申訴、檢舉與下架協助',url:'https://siarc.mohw.gov.tw/',note:'性影像事件的官方求助入口。'},
  iwin: {publisher:'iWIN 網路內容防護機構',title:'網路不當內容檢舉',url:'https://i.win.org.tw/',note:'教育部注意事項指定的其他網路不當內容檢舉管道。'}
};

const CHAPTERS = [
 {id:'voice',title:'熟悉的聲音',place:'辦公室',bg:'office',speaker:'手機裡的「校長」',
  intro:'你正在整理班級資料，收到一段聽起來很像校長的語音。',
  quote:'我正在開會。先把家長聯絡表寄到這個新信箱，不用打電話。',
  question:'你會怎麼回應這份急件？',cue:'熟悉的聲音，卻要求改用新信箱收資料。',
  choices:[
   {text:'聲音沒錯，先寄出資料。',failure:'聯絡表可能已寄給冒用者。熟悉的聲音，不能證明訊息來自本人。'},
   {text:'用原本的校內分機確認。',correct:true},
   {text:'在同一個對話裡問：「真的是你嗎？」',failure:'回覆的仍可能是同一位冒用者。原本可疑的管道，無法替自己作證。'}],
  lessons:[
   {title:'換一條管道，才是查證。',body:['你用原本的分機聯絡，發現校長沒有提出這項要求。','聲音、頭像、顯示名稱都可能被冒用。用既有通訊錄或當面確認，別改打訊息新提供的電話。']},
   {title:'確認是本人，還要確認能不能給。',body:['涉及個資、金錢、驗證碼或變更收件人，都值得先停一下。','校園裡還要確認業務目的、必要資料與校內提供流程；身分確認不等於資料授權。'],sources:['voice']}]
 },
 {id:'clickfix',title:'奇怪的驗證',place:'教室電腦',bg:'classroom',speaker:'教材下載頁',
  intro:'你準備下載一份教材，網頁卻要求先完成「身分驗證」。',
  quote:'請開啟系統工具，貼上本頁提供的指令並執行，即可繼續下載。',
  question:'遇到這種驗證，你會怎麼做？',cue:'網頁要求你把指令帶到電腦裡執行。',
  choices:[
   {text:'停止操作，向資訊窗口確認。',correct:true},
   {text:'頁面看起來很正式，照著完成。',failure:'看似驗證的步驟，可能已讓電腦執行惡意指令。版面正式並不代表指令可信。'},
   {text:'換另一台共用電腦試試看。',failure:'換電腦沒有解決來源問題，反而可能讓另一台設備也暴露在風險中。'}],
  lessons:[
   {title:'它要借用你的手，執行指令。',body:['這類手法稱為 ClickFix：假裝驗證或修復，誘導你複製並執行指令。','熟悉品牌、分享平台或成功下載，都不能單獨證明安全。']},
   {title:'停下來，回到可信來源。',body:['不執行不明指令；教材與工具改從官方或校內核可管道取得。','若已經執行，停止使用、隔離網路並求助；不要換設備繼續測試。'],sources:['clickfix']}]
 },
 {id:'ai',title:'改名字就好了嗎？',place:'備課桌',bg:'office',speaker:'隔壁的同事',
  intro:'你想用 AI 協助設計練習，同事拿來一份學生評量與家庭狀況紀錄。',
  quote:'我把姓名改成小明了，用我的個人 AI 帳號幫忙整理，應該可以吧？',
  question:'你會怎麼完成這次備課？',cue:'紀錄改了名字，仍保留個別學生的生活與學習細節。',
  choices:[
   {text:'改過名字，就貼上整份紀錄。',failure:'家庭、班級或事件細節仍可能辨識學生。只換姓名，沒有解除資料風險。'},
   {text:'換成個人付費帳號再上傳。',failure:'付費不等於學校核可。工具的訂閱方案，不能代替學生資料的使用規範。'},
   {text:'改問一般教學需求，不附個案紀錄。',correct:true}],
  lessons:[
   {title:'把教學需求留下，把個案資料拿掉。',body:['可以改問：「請設計低年級加減練習，句子簡短、一次一題，附口語提示。」','用一般性或完全虛構的情境備課，產出仍由教師檢查。']},
   {title:'學校帳號，也不是萬用通行證。',body:['教育部規範：學生資料與校務文件不得以個人帳號登入處理。','先確認核可工具、帳號與資料範圍。改姓名、付費或換學校信箱，都不是任意上傳的許可。'],sources:['moe']}]
 },
 {id:'login',title:'不是我登入',place:'走廊',bg:'corridor',speaker:'手機通知',
  intro:'你正在走廊準備進教室，手機反覆跳出帳號的登入確認。',
  quote:'有人正在嘗試登入。要允許這次登入嗎？',
  question:'你沒有發起登入，該怎麼做？',cue:'驗證通知一直出現，讓你想趕快把它關掉。',
  choices:[
   {text:'先按同意，讓通知不要再跳。',failure:'「同意」是核准登入，不是關閉提醒。你可能替陌生人完成最後一道驗證。'},
   {text:'拒絕要求，再從正式入口檢查。',correct:true},
   {text:'把驗證碼傳給自稱資訊人員的人。',failure:'驗證碼可能被拿去登入你的帳號。自稱協助處理的人，也不能代你取得驗證碼。'}],
  lessons:[
   {title:'不是自己發起，就不要核准。',body:['先拒絕這次要求，再從原本的 Google 帳戶入口查看安全活動。','有陌生登入跡象時，變更密碼、檢查裝置，並向校內資訊窗口反映。']},
   {title:'讓驗證成為防線。',body:['依校規啟用多因素驗證，也就是密碼以外再確認一次身分。','重要帳號使用不同密碼；驗證碼與恢復方式由自己妥善保管。'],sources:['prompt','mfa','account']}]
 },
 {id:'permission',title:'抽籤工具的要求',place:'備課桌',bg:'office',speaker:'抽籤小工具',
  intro:'你找到一個方便的課堂抽籤工具，點選「使用 Google 帳戶登入」。',
  quote:'請允許本工具讀取郵件，以及查看、修改你的雲端硬碟檔案。',
  question:'只想抽籤，需要交出這些權限嗎？',cue:'工具要求的存取範圍，遠超過眼前的課堂用途。',
  choices:[
   {text:'先不授權，確認必要性與校內核可。',correct:true},
   {text:'有 Google 登入按鈕，就全部同意。',failure:'熟悉的登入方式，不代表第三方需要或適合取得你的郵件與檔案。'},
   {text:'先試用，用完關掉分頁就好。',failure:'關閉分頁不會自動撤回已給出的存取權。工具可能仍保有授權。'}],
  lessons:[
   {title:'登入是認身分，授權是交能力。',body:['「用 Google 登入」和「讀取郵件、修改檔案」是不同的事。','逐項看工具要做什麼；權限超出用途時，先停止授權並找核可替代工具。']},
   {title:'不用的授權，也要收回。',body:['從 Google 帳戶的第三方連結管理頁，檢查並移除不再需要的存取權。','撤回授權不等於取回對方已複製的資料；有疑慮時向校內窗口反映。'],sources:['third']}]
 },
 {id:'byok',title:'免費工具與一把鑰匙',place:'備課桌',bg:'office',speaker:'教材小幫手',
  intro:'API Key 是讓工具使用某項服務的憑證，可能動用你的額度。自備這把金鑰的用法稱為 BYOK。',
  quote:'朋友都在用！輸入 API Key 就能出題。我們不保存金鑰。',
  question:'朋友推薦、功能正常，就可以貼嗎？',cue:'你尚未確認工具來源、金鑰接收對象與保管方式。',
  choices:[
   {text:'朋友能正常出題，先貼上試用。',failure:'功能正常，只能證明工具會出題，不能證明金鑰沒有被保存或傳走。'},
   {text:'欄位會顯示小黑點，應該很安全。',failure:'小黑點只遮住畫面上的文字。網站仍可能讀取欄位的實際內容。'},
   {text:'先確認接收對象、處理方式與核可。',correct:true}],
  lessons:[
   {title:'金鑰不是一般啟用碼。',body:['取得有效金鑰的人，可能依它的權限使用服務、消耗額度或產生費用。','BYOK 是使用方式，不是安全認證；也不能只因要求金鑰，就認定全是詐騙。']},
   {title:'要問的是：我把能力交給誰？',body:['誰提供工具？金鑰送到哪裡？如何保存與刪除？學校是否核可？','確認後仍只給必要權限，依平台設定限制並查看用量；不清楚就先不要貼。'],sources:['key','mask','byok']}]
 },
 {id:'share',title:'只傳給同事的連結',place:'辦公室',bg:'office',speaker:'共用設定',
  intro:'你要把一份含校內聯絡資料的文件交給承辦同事，準備複製分享連結。',
  quote:'一般存取權：知道連結的任何人。角色：編輯者。',
  question:'怎麼讓這份文件只給需要的人？',cue:'傳訊息的對象，和檔案允許存取的對象，是兩件事。',
  choices:[
   {text:'連結只私訊同事，設定不用改。',failure:'連結仍可被轉傳；任何持有連結的人可能依設定開啟或修改文件。'},
   {text:'改為指定對象，給必要權限。',correct:true},
   {text:'改成檢視者，仍保留任何人可開啟。',failure:'這能減少修改風險，但沒有解決不該看的人仍能讀取文件的問題。'}],
  lessons:[
   {title:'限制的是存取權，不只是收件人。',body:['改成限制對象，再加入真正需要使用的承辦同事。','依工作選擇檢視、加註或編輯；需要看資料，不一定需要改資料。']},
   {title:'連上層資料夾一起檢查。',body:['檔案的存取權也可能受資料夾或群組設定影響。','設定完成後確認實際對象；「知道連結的任何人」不等於只限你私訊的人。'],sources:['share']}]
 },
 {id:'leaked-key',title:'已經貼出去了',place:'備課桌',bg:'office',speaker:'來求助的同事',
  intro:'同事把一把只供試用、未接正式服務的 API Key 貼到不明網站，現在開始擔心。',
  quote:'我已經把欄位清空，也關掉網頁了。這樣是不是就好了？',
  question:'這把可能外洩的金鑰，該怎麼處理？',cue:'清除眼前畫面，無法撤回網站可能已取得的憑證。',
  choices:[
   {text:'回官方介面停用金鑰、查用量並求助。',correct:true},
   {text:'既然已關掉頁面，就繼續使用原金鑰。',failure:'關閉頁面不會讓金鑰失效；別人若已取得，仍可能繼續使用。'},
   {text:'只改登入密碼，金鑰先留著。',failure:'登入密碼和 API Key 是不同憑證。不能假設改密碼就撤銷了那把金鑰。'}],
  lessons:[
   {title:'讓外洩的鑰匙失效。',body:['從可信裝置回到服務商官方介面，停用或撤銷這把試用金鑰，查核用量與費用。','向校內資訊窗口交代工具來源與做過的操作，不在群組貼出金鑰。']},
   {title:'如果它連著正式服務呢？',body:['立即找管理者安排安全替換，確認新金鑰可用後停用舊金鑰，兼顧止損與服務持續。','持續查看異常用量；本情境的試用金鑰沒有正式服務相依，可直接先停用。'],sources:['key']}]
 },
 {id:'incident',title:'指令已經執行',place:'教室電腦',bg:'classroom',speaker:'隔壁班老師',
  intro:'同事照著假驗證頁執行指令，畫面閃了一下，又回到正常桌面。',
  quote:'看起來沒事，要不要再跑一次確認？還是我自己重灌？',
  question:'你會先協助他做什麼？',cue:'桌面看起來正常，並不能證明剛才的操作安全。',
  choices:[
   {text:'再執行一次，看看有沒有錯誤。',failure:'重跑可能再次觸發惡意操作。測試來源不明的指令，可能擴大影響。'},
   {text:'先重灌，清乾淨再告訴資訊人員。',failure:'自行清除可能破壞調查線索，也沒有處理可能已外洩的帳號憑證。'},
   {text:'停止使用、隔離網路，聯絡資訊窗口。',correct:true}],
  lessons:[
   {title:'先停止擴大，再交給窗口處理。',body:['停止操作，拔除網路線或關閉 Wi-Fi；保留現況，聯絡資訊窗口。','不要自行重跑、清除紀錄或重灌；後續開關機與處理依窗口指示。']},
   {title:'說清楚「做到哪一步」。',body:['只開頁面：停止互動，記下來源。已交密碼：從可信裝置回官方入口改密碼、檢查登入。','已交金鑰：處理金鑰撤銷與用量。已執行指令：隔離設備，讓資訊人員調查。']},
   {title:'求助不用先查出原因。',body:['交代何時、哪台設備、看到什麼、做過什麼，以及目前已採取的動作。','若主要窗口不在，找校內指定的備援承辦；不在群組附上學生資料、密碼或金鑰。'],sources:['clickfix','account','key']}]
 },
 {id:'continuity',title:'平台打不開',place:'教室',bg:'classroom',speaker:'講臺前的你',
  intro:'學生都已坐好，原本要使用的教學平台卻無法開啟，原因還不清楚。',
  quote:'教材都在平台裡，現在怎麼讓課繼續？',
  question:'哪個安排能讓教學安全地接續？',cue:'先維持學習，不急著替故障下結論。',
  choices:[
   {text:'請學生把帳密借給彼此試登入。',failure:'共用帳密增加風險，也不一定能解決平台無法使用的問題。'},
   {text:'改用備妥教材，並向校內窗口反映。',correct:true},
   {text:'把學生名單搬到陌生免費平台繼續。',failure:'為了趕快恢復課程，又把學生資料交給未核可的平台，造成新的風險。'}],
  lessons:[
   {title:'備援的是教學，不只是檔案。',body:['本關的教學建議：備妥可離線使用的一般教材、紙本任務或口頭討論活動。','備份與替代活動也要避開不必要的學生個資；可用，不代表可以任意搬資料。']},
   {title:'別讓趕課，變成另一個破口。',body:['從正式公告與校內資訊窗口確認狀況；平台打不開，不一定代表遭入侵。','不共用帳密、不臨時上傳學生資料到陌生工具。這是校園情境演練，並非特定平台事件。'],sources:['moe','shared']}]
 },
 {id:'shared-device',title:'下一位使用者',place:'共用教室',bg:'classroom',speaker:'準備離開的你',
  intro:'你在共用電腦上開過信箱和教材，接下來要把設備交給下一位老師。',
  quote:'畫面關掉了，但我的帳號是不是還留在裡面？',
  question:'離開共用電腦前，該怎麼做？',cue:'把視窗縮小或關掉螢幕，不等於結束登入。',
  choices:[
   {text:'確認登出，依校規處理本機殘留檔案。',correct:true},
   {text:'下一位也是老師，就保留我的登入。',failure:'接手的人可能直接使用你的帳號，操作與資料存取也會算在你的身分下。'},
   {text:'把瀏覽器縮小，關掉螢幕即可。',failure:'帳號仍可能保持登入；再次打開視窗的人，就能接續你的工作。'}],
  lessons:[
   {title:'把帳號帶走，讓設備留下。',body:['確認登出帳戶，不儲存密碼；依校規清理自己留下的下載檔案。','若校內允許，可使用訪客或私密瀏覽，用完關閉所有相關視窗。']},
   {title:'私密瀏覽，也不是防毒模式。',body:['它主要處理瀏覽器留下的紀錄與登入狀態，不能讓不可信的設備變安全。','如果察覺設備異常，停止輸入帳密並找資訊窗口；下載檔案仍要另外確認。'],sources:['shared','incognito']}]
 },
 {id:'protect',title:'老師，我不敢說',place:'安靜的教室',bg:'classroom',speaker:'來求助的學生',
  intro:'學生私下告訴你，群組裡有人用 AI 把他的臉合成到令人難堪的影像。',
  quote:'大家一直傳。我沒有拍過，可不可以不要讓全班都知道？',
  question:'身為老師，你會先怎麼回應？',cue:'先保護正在求助的人，再處理影像與傳播。',
  choices:[
   {text:'轉到教師大群組，請大家辨認真偽。',failure:'轉傳讓更多人看到，也可能再次傷害學生。求助不需要把影像散布給更多人。'},
   {text:'看起來是合成的，叫他別放在心上。',failure:'影像是假的，羞辱與傷害仍然真實。學生需要支持與具體協助。'},
   {text:'先安撫、不轉傳，依校內流程求助。',correct:true}],
  lessons:[
   {title:'先讓學生知道：你願意幫忙。',body:['私下傾聽、不責備，避免公開追問或要求重複展示影像。','依校內程序找學務、輔導或權責窗口，記錄網址、帳號、群組等必要線索。']},
   {title:'讓傷害停止擴散。',body:['若涉及性影像，向衛福部性影像處理中心尋求下架協助；其他不當內容可向 iWIN 檢舉。','不轉傳、不另行下載散布；證據保全方式請由權責窗口協助。'],sources:['moe','protection','siarc','iwin']}]
 }
];
