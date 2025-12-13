import { createContext, useContext, useState, ReactNode } from "react";

type Language = "english" | "bangla";

interface LanguageContextType {
  language: Language;
  setLanguage: (lang: Language) => void;
  t: (key: string) => string;
}

const LanguageContext = createContext<LanguageContextType | undefined>(
  undefined
);

const translations = {
  english: {
    // Header
    signUp: "Sign up",
    login: "Login",

    // Sidebar
    home: "Home",
    hot: "HOT",
    sports: "Sports",
    casino: "Casino",
    slots: "Slots",
    crash: "Crash",
    table: "Table",
    fishing: "Fishing",
    arcade: "Arcade",
    lottery: "Lottery",
    promotions: "Promotions",
    referralBonus: "Referral Bonus",
    vip: "VIP",
    download: "Download",
    contactUs: "Contact Us",

    // Category Tabs
    all: "ALL",
    welcomeOffer: "Welcome Offer",
    liveCasino: "Live Casino",
    other: "Other",

    // Game Grid
    favourites: "Favourites",
    popularGames: "Popular Games",

    // Promo Banner
    promoCode: "Promo Code",
    add: "Add",

    // Buttons
    detail: "Detail",
    deposit: "Deposit",
    share: "Share",
    claim: "Claim",
    submit: "Submit",

    // Currency Modal
    currencyAndLanguage: "Currency and Language",

    // Promo Banner
    promoBannerText:
      "Receive 500 BDT with your first deposit at Khelaghor! Deposit today and join the excitement!",

    // Footer
    paymentMethods: "Payment Methods",
    responsibleGaming: "Responsible Gaming",
    communityWebsites: "Community Websites",
    affiliatesProgram: "Affiliates Program",
    aboutUs: "About Us",
    security: "Security",
    privacyPolicy: "Privacy Policy",
    faq: "Frequently Asked Questions",
    gamingLicense: "Gaming License",
    officialBrandPartner: "Official Brand Partner",
    bestQualityPlatform: "Best Quality Platform",
    allRightsReserved: "© 2025 KG Copyrights. All Rights Reserved.",

    // Promotions Page
    new: "NEW",

    // Footer Description
    footerTitle: "Khelaghor Bangladesh – Country's Premium Betting & Casino",
    footerPara1:
      "Every casino brand can declare that they are offering premium betting and features, but most of them cannot really live up to the literal meaning of the word premium. Thus, just like how smart you are when playing your favorite game, you should also be attentive and keen in choosing the casino that you will participate in. Amongst the choices, Khelaghor is the newest and trusted player in Bangladesh.",
    footerPara2:
      "A huge welcome bonus is an insufficient reason for you to make a bet. One should have reliable 24/7 customer support, a quick and seamless way to deposit and withdraw, and a user-friendly interface, to name a few. Some of the brands that there are JeetWin, Jeetbuzz, Jeetbaji, Jiliace, Jilibet, Jitawin, and Baji Live.",
    footerPara3:
      "With regard to security, gamblers must be very cautious and mindful of the security measures that a casino has. You should keep in mind that in order for you to play, you have to declare your personal and financial information, both of which are sensitive and should be kept safe. Reputable casinos like Khelaghor are way to go because our data is in good hands.",
    footerPara4:
      "Even if your friends referred to a certain gambling site that they truly enjoy, you should still be cautious about the site's reputation, especially its legality. Before you start betting, you should determine if the casino has a working license, which is a basic component of a casino brand.",
    footerPara5:
      "Out of all the numerous payment methods that are available at Khelaghor Bangladesh: bKash, Nagad, OKWallet, Rocket, Surecash, and CryptoCurrency, choosing one is definitely easy. You can select the one that is more readily available in your area. Well, it is definitely a surprise if you have more than one of these.",
    footerPara6:
      'A world-class gaming experience is what all gamblers are up to. With this, advanced technological features are being added to every casino to make sure that brands like Khelaghor Bangladesh are living up to their "premium" branding. Checkout Khelaghor promotions and play now more!',
  },
  bangla: {
    // Header
    signUp: "সাইন আপ",
    login: "লগইন",

    // Sidebar
    home: "হোম",
    hot: "হট",
    sports: "স্পোর্টস",
    casino: "ক্যাসিনো",
    slots: "স্লটস",
    crash: "ক্র্যাশ",
    table: "টেবিল",
    fishing: "ফিশিং",
    arcade: "আর্কেড",
    lottery: "লটারি",
    promotions: "প্রমোশন",
    referralBonus: "রেফারেল বোনাস",
    vip: "ভিআইপি",
    download: "ডাউনলোড",
    contactUs: "যোগাযোগ করুন",

    // Category Tabs
    all: "সব",
    welcomeOffer: "স্বাগত অফার",
    liveCasino: "লাইভ ক্যাসিনো",
    other: "অন্যান্য",

    // Game Grid
    favourites: "প্রিয়",
    popularGames: "জনপ্রিয় গেমস",

    // Promo Banner
    promoCode: "প্রোমো কোড",
    add: "যোগ করুন",

    // Buttons
    detail: "বিস্তারিত",
    deposit: "জমা",
    share: "শেয়ার",
    claim: "দাবি",
    submit: "জমা দিন",

    // Currency Modal
    currencyAndLanguage: "মুদ্রা এবং ভাষা",

    // Promo Banner
    promoBannerText:
      "খেলাঘরে আপনার প্রথম ডিপোজিটে ৫০০ টাকা পান! আজই ডিপোজিট করুন এবং উত্তেজনায় যোগ দিন!",

    // Footer
    paymentMethods: "পেমেন্ট পদ্ধতি",
    responsibleGaming: "দায়িত্বশীল গেমিং",
    communityWebsites: "কমিউনিটি ওয়েবসাইট",
    affiliatesProgram: "অ্যাফিলিয়েট প্রোগ্রাম",
    aboutUs: "আমাদের সম্পর্কে",
    security: "নিরাপত্তা",
    privacyPolicy: "গোপনীয়তা নীতি",
    faq: "সাধারণ প্রশ্ন",
    gamingLicense: "গেমিং লাইসেন্স",
    officialBrandPartner: "অফিসিয়াল ব্র্যান্ড পার্টনার",
    bestQualityPlatform: "সেরা মানের প্ল্যাটফর্ম",
    allRightsReserved: "© ২০২৫ কেজি কপিরাইট। সর্বস্বত্ব সংরক্ষিত।",

    // Footer Description
    footerTitle: "খেলাঘর বাংলাদেশ – দেশের প্রিমিয়াম বেটিং এবং ক্যাসিনো",
    footerPara1:
      "প্রতিটি ক্যাসিনো ব্র্যান্ড ঘোষণা করতে পারে যে তারা প্রিমিয়াম বেটিং এবং বৈশিষ্ট্যগুলি অফার করছে, কিন্তু তাদের বেশিরভাগই প্রিমিয়াম শব্দের আক্ষরিক অর্থে বেঁচে থাকতে পারে না। এইভাবে, আপনার প্রিয় গেমটি খেলার সময় আপনি যেমন স্মার্ট হন, তেমনি আপনি যে ক্যাসিনোতে অংশগ্রহণ করবেন সেটি বেছে নেওয়ার ক্ষেত্রেও আপনার মনোযোগী এবং আগ্রহী হওয়া উচিত। পছন্দের মধ্যে Khelaghor বাংলাদেশের সবচেয়ে নতুন এবং বিশ্বস্ত খেলোয়াড়।",
    footerPara2:
      "আপনার অপর্যাপ্ত ব্যালান্স থাকলেও বাজি করার জন্য পাবেন একটি বিশাল স্বাগতম বোনাস। একজনের কাছে নির্ভরযোগ্য 24/7 গ্রাহক সহায়তা, জমা এবং উত্তোলনের একটি দ্রুত এবং নিরবচ্ছিন্ন উপায় এবং ব্যবহারকারী-বান্ধব ইন্টারফেস থাকতে হবে। কিছু সেরা ক্যাসিনো ব্র্যান্ড হল Jeetbuzz, Mega Casino World, Fancywin, এবং Baji Live",
    footerPara3:
      "নিরাপত্তার বিষয়ে, জুয়াড়িদের অবশ্যই খুব সতর্ক হতে হবে এবং একটি ক্যাসিনোর নিরাপত্তা ব্যবস্থা সম্পর্কে সচেতন হতে হবে। আপনার মনে রাখা উচিত যে আপনি খেলার জন্য, আপনাকে আপনার ব্যক্তিগত এবং আর্থিক তথ্য ঘোষণা করতে হবে, উভয়ই ব্যক্তিগত এবং সংবেদনশীল ডেটা। খেলাঘরের সবচেয়ে উন্নত এবং স্বনামধন্য নিরাপত্তা ব্যবস্থা রয়েছে, কারণ আপনি চান না আপনার ডেটার সঙ্গে আপোষ করা হোক।",
    footerPara4:
      "এমনকি যদি আপনার বন্ধুরা একটি নির্দিষ্ট জুয়া খেলার সাইটে উল্লেখ করে যেটি তারা সত্যিই উপভোগ করে, তবুও আপনাকে সাইটের খ্যাতি, বিশেষ করে এর বৈধতা সম্পর্কে সতর্ক থাকতে হবে। আপনি বাজি ধরা শুরু করার আগে, ক্যাসিনোটির একটি কাজের লাইসেন্স আছে কিনা তা নির্ধারণ করা উচিত, যা একটি ক্যাসিনো ব্র্যান্ডের একটি মৌলিক উপাদান।",
    footerPara5:
      "Khelaghor বাংলাদেশে উপলব্ধ অসংখ্য পেমেন্ট পদ্ধতির মধ্যে:বিকাশ, নগদ, ওকেওয়ালেট, রকেট, শিওরক্যাশ এবং ক্রিপ্টোকারেন্সি, একটি বেছে নেওয়া অবশ্যই সহজ। আপনি আপনার এলাকায় আরও সুবিধাজনক এবং সহজেই উপলব্ধ একটি নির্বাচন করতে পারেন। ঠিক আছে, আপনার যদি এর মধ্যে একাধিক থাকে তবে অবাক হওয়ার কিছু নেই।",
    footerPara6:
      'একটি বিশ্ব-মানের গেমিং অভিজ্ঞতা যা সব জুয়াড়ির হয়।এর সাথে, Khelaghor Bangladesh এর মতো ব্র্যান্ডগুলি তাদের "প্রিমিয়াম" ব্র্যান্ডিং মেনে চলছে তা নিশ্চিত করতে প্রতিটি ক্যাসিনোতে উন্নত প্রযুক্তিগত বৈশিষ্ট্য যুক্ত করা হচ্ছে। আরও জানতে Khelaghor প্রচার বিভাগে চেকআউট করুন!',

    // Promotions Page
    new: "নতুন",
  },
};

export function LanguageProvider({ children }: { children: ReactNode }) {
  const [language, setLanguage] = useState<Language>("english");

  const t = (key: string): string => {
    return (
      translations[language][key as keyof typeof translations.english] || key
    );
  };

  return (
    <LanguageContext.Provider value={{ language, setLanguage, t }}>
      {children}
    </LanguageContext.Provider>
  );
}

export function useLanguage() {
  const context = useContext(LanguageContext);
  if (!context) {
    throw new Error("useLanguage must be used within a LanguageProvider");
  }
  return context;
}
