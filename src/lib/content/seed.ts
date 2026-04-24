import type { Content } from './types';

export const SEED_CONTENT: Content = {
  site: {
    name: 'AILAV',
    tagline: 'Aile · Il a · Voyage',
    subtitle: "A Migratory Chef's Journey of Flavor & Love",
    description:
      "AILAV — Pronounced as 'I Love'. 候鳥的歸徑，跨越日、法、台的風味旅程。高雄精緻餐飲。",
  },
  hero: {
    mainImage:
      'https://images.unsplash.com/photo-1414235077428-338989a2e8c0?auto=format',
    scatterImages: [
      { src: 'https://images.unsplash.com/photo-1559339352-11d035aa65de?w=600&q=80&auto=format&fm=avif', alt: '精緻擺盤', className: 'gi-1' },
      { src: 'https://images.unsplash.com/photo-1517248135467-4c7edcad34c4?w=700&q=80&auto=format&fm=avif', alt: '餐廳空間', className: 'gi-2' },
      { src: 'https://images.unsplash.com/photo-1540189549336-e6e99c3679fe?w=500&q=80&auto=format&fm=avif', alt: '色彩料理', className: 'gi-3' },
      { src: 'https://images.unsplash.com/photo-1565299624946-b28f40a0ae38?w=600&q=80&auto=format&fm=avif', alt: '窯烤料理', className: 'gi-4' },
      { src: 'https://images.unsplash.com/photo-1567620905732-2d1ec7ab7445?w=500&q=80&auto=format&fm=avif', alt: '甜點', className: 'gi-5' },
    ],
  },
  concept: {
    heading: '回歸與進化，一場味覺旅程',
    paragraphs: [
      'AILAV，唸作「I Love」——名字源自法文詞彙的深刻結合：Aile（翼）如候鳥般飛行與探索、Il a（擁有）旅途中汲取的豐沛資源、Voyage（旅程）定義了品牌不斷演進、永不停止的探尋。',
      '「如同候鳥跨越經緯，最終帶著整座海洋與森林的養分，回歸家鄉。」',
      '這是 AILAV 的創立初衷，也是我們對每一道料理的承諾——將橫跨日、法、台的技術養分，以當代語彙重新詮釋這片土地的風味。',
    ],
    image: '/images/AILAV/2A5A0689.JPG',
  },
  manifesto: {
    words: [
      { fr: 'Aile', en: 'Wing', zh: '翼 — 如候鳥般的飛行與探索' },
      { fr: 'Il a', en: 'He has', zh: '擁有 — 旅途中獲得的豐沛資源' },
      { fr: 'Voyage', en: 'Journey', zh: '旅程 — 不斷演進，永不停止' },
    ],
    videoUrl: 'https://assets.mixkit.co/videos/4043/4043-720.mp4',
    posterImage: '/images/AILAV/2A5A0821.JPG',
  },
  chefs: [
    {
      id: 'liao',
      name: '廖冠宇 — Ryo Liao',
      images: ['/images/AILAV/2A5A0695.JPG', '/images/AILAV/2A5A0673.JPG'],
      bio: [
        '主廚廖冠宇（Ryo）的料理生涯，是一場不斷遷徙與汲取的旅程。大學時期遠赴日本，開啟了對魚類熟成技術的科學探索；23 歲即以主廚之姿，率領團隊獲得 2022 年米其林入選餐廳肯定。',
        '26 歲那年再度歸零啟程，前往法國米其林二星餐廳 Serge Vieira 進修，在頂級廚房中磨練法式料理的嚴謹靈魂。如同候鳥在漫長旅途中銜回豐沛資源，Ryo 帶著橫跨日、法、台的技術養分回到家鄉，聯合 Henry 共同創立品牌「AILAV」。',
      ],
      awards: [
        { stat: '米其林', label: '2022 入選\n餐廳主廚' },
        { stat: 'Serge Vieira', label: '法國米其林\n二星進修' },
      ],
      flip: false,
    },
    {
      id: 'huang',
      name: '黃恆毅 — Henry Huang',
      images: ['/images/AILAV/2A5A0887.JPG', '/images/AILAV/2A5A0713.JPG'],
      bio: [
        '主廚黃恆毅（Henry）的料理靈魂，紮根於深厚的中式餐飲底蘊。他對台灣土地的風味有著極致的通透感，擅長解構台菜的精髓與乾貨的韻味。',
        '為了尋求料理邊界的突破，Henry 選擇遠赴法國進修，在歐陸料理的嚴謹體系下重新審視家鄉的風味。他將法式烹飪中細膩的醬汁技術與層次堆疊，巧妙地灌注進台菜的靈魂中——料理對他而言，是一場跨越中西、將台灣風土「轉譯」為現代語彙的過程。',
      ],
      awards: [
        { stat: '中式', label: '台菜精髓\n與乾貨韻味' },
        { stat: '轉譯', label: '法式醬汁\n× 台灣風土' },
      ],
      flip: true,
    },
    {
      id: 'tsai',
      name: '蔡佳玓 — Chia-Ti Tsai',
      images: ['/images/AILAV/2A5A0907.JPG', '/images/AILAV/2A5A0869.JPG'],
      bio: [
        '習慣從科學的角度理解料理，也在料理中找到屬於自己的節奏，在理論與實作之間重覆實驗與重組。',
        '以 lab 作為中心，在餐盤上描繪出自己的故事。歡迎大家走入 AILAV，來一場關於風味的實驗。Alors on y va.',
      ],
      awards: [
        { stat: 'Lab', label: '科學思維\n料理實驗室' },
        { stat: 'Récit', label: '理論與實作\n重組風味' },
      ],
      flip: false,
    },
  ],
  menu: [
    {
      id: 'main-course',
      title: '主食套餐之夜',
      price: 'NT$ 990 / 位',
      description:
        '以「主食」為核心的完整饗宴。四道式精選組合：開胃小點、熱前菜、主食（義大利麵 / 燉飯 / 穀物）、甜小點。',
      note: '週五、週六　18:30 – 01:00\n採現場排隊翻桌，不提供訂位',
    },
    {
      id: 'tasting',
      title: '品味套餐之夜',
      price: 'NT$ 990 / 位',
      description:
        '台法技術精髓的四道式感官組合：開胃小點、冷前菜、熱前菜、甜小點。訂位時可加購排餐或精緻盤式甜點。',
      note: '週日、週一、週二　18:30 – 21:00',
    },
    {
      id: 'wine-bar',
      title: '深夜 Wine Bar',
      price: '單點',
      description:
        '轉場為餐酒館形式，提供單點葡萄酒、啤酒與深夜酒食菜單：職人炸物、炭火烤物、主廚熱炒各 2 款。',
      note: '週日、週一、週二　21:30 – 01:00',
    },
  ],
  menuCards: [
    {
      id: 'tasting-card',
      slug: 'tasting',
      kind: 'tasting',
      name: '當季品味套餐',
      subtitle: 'COMPLETE TASTING MENU',
      footnote: 'a 4-course tasting menu　NT 990.',
      theme: { bg: '#b0532f', fg: '#1a0f08', accent: '#1a0f08' },
      courses: [
        {
          id: 'amuse-bouche',
          heading: 'AMUSE-BOUCHE',
          items: [
            {
              id: 'octopus-tartare',
              titleZh: '章魚塔塔 / 煙燻紅椒醬 / 油蔥酥',
              titleEn: 'Octopus Tartare with Smoked Paprika Sauce and Crispy Shallots',
              price: '',
              image: '',
              note: '',
            },
          ],
        },
        {
          id: 'entrees-chaudes',
          heading: 'ENTRÉES CHAUDES',
          items: [
            {
              id: 'spring-roll',
              titleZh: '春捲 / 馬斯卡彭白酒醬 / 鮭魚卵',
              titleEn: 'Spring Roll with Mascarpone White Wine Sauce and Salmon Roe',
              price: '',
              image: '',
              note: '',
            },
          ],
        },
        {
          id: 'plats-principaux',
          heading: 'PLATS PRINCIPAUX',
          items: [
            {
              id: 'leek-risotto',
              titleZh: '韭菜燉飯 / 酥炸鮮蚵 / 蝦卵美乃滋',
              titleEn: 'leek risotto with crispy oysters and shrimp roe mayonnaise',
              price: '',
              image: '',
              note: '',
            },
          ],
        },
        {
          id: 'mignardises',
          heading: 'MIGNARDISES',
          items: [
            {
              id: 'financier-lemon-tart',
              titleZh: '費南雪 / 檸檬塔',
              titleEn: 'financier / lemon tart',
              price: '',
              image: '',
              note: '',
            },
          ],
        },
      ],
    },
    {
      id: 'after-hours-card',
      slug: 'after-hours',
      kind: 'a-la-carte',
      name: '宵夜時段菜單',
      subtitle: 'AFTER HOURS MENU',
      footnote: '',
      theme: { bg: '#7e8a3e', fg: '#1a1a08', accent: '#1a1a08' },
      items: [
        {
          id: 'crab-croquette',
          titleZh: '蟹肉可樂餅 / 檸檬美乃滋',
          titleEn: 'crab croquette / lemon mayonnaise',
          price: 'NT 250.',
          image: '',
          note: '',
        },
        {
          id: 'crispy-chicken-wings',
          titleZh: '酥炸雞翅 / 香料青醬',
          titleEn: 'crispy chicken wings / herbed pesto',
          price: 'NT 220.',
          image: '',
          note: '',
        },
        {
          id: 'charcoal-chicken-thigh',
          titleZh: '碳烤雞腿 / 查理亞賓炒洋蔥 / 柚子胡椒',
          titleEn: 'charcoal-grilled chicken thigh / chaliapin onions / yuzu kosho',
          price: 'NT 350.',
          image: '',
          note: '',
        },
        {
          id: 'charcoal-mackerel',
          titleZh: '碳烤鯖魚 / 漬白蘿蔔 / 紅蘿蔔泥',
          titleEn: 'charcoal-grilled mackerel / pickled white radish / carrot purée',
          price: 'NT 400.',
          image: '',
          note: '',
        },
        {
          id: 'chicken-hearts',
          titleZh: '雞心 / 韭菜 / 帕瑪森起司',
          titleEn: 'chicken hearts / chives / parmesan cheese',
          price: 'NT 220.',
          image: '',
          note: '',
        },
        {
          id: 'mussels-puttanesca',
          titleZh: '淡菜 / 鯷魚 / 九層塔',
          titleEn: 'mussels / puttanesca sauce / taiwanese basil',
          price: 'NT 350.',
          image: '',
          note: '',
        },
      ],
    },
  ],
  restaurant: {
    address: '807 高雄市三民區民壯路 43 號',
    lat: 22.639763,
    lng: 120.340723,
    hours: {
      mainCourse: { days: '週五、週六', time: '18:30 – 01:00', label: '主食套餐之夜' },
      tasting: { days: '週日、週一、週二', time: '18:30 – 21:00', label: '品味套餐之夜' },
      wineBar: { days: '週日、週一、週二', time: '21:30 – 01:00', label: '深夜 Wine Bar' },
      closed: '週三、週四公休',
    },
    mapEmbedUrl:
      'https://www.google.com/maps/embed?pb=!1m18!1m12!1m3!1d1500!2d120.340723!3d22.639763!2m3!1f0!2f0!3f0!3m2!1i1024!2i768!4f13.1!3m3!1m2!1s0x0%3A0x0!2zMjLCsDM4JzIzLjEiTiAxMjDCsDIwJzI2LjYiRQ!5e0!3m2!1szh-TW!2stw!4v1',
  },
};
