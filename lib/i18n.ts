export const LOCALES = ["en", "hi", "mr"] as const;
export type Locale = (typeof LOCALES)[number];
/** Non-English locales stay noindex and out of hreflang until a human reviewer signs the translation off. */
export const LOCALE_REVIEWED: Record<Locale, boolean> = { en: true, hi: false, mr: false };
export const LOCALE_NAMES: Record<Locale, string> = { en: "English", hi: "हिन्दी", mr: "मराठी" };
export const localeHome = (l: Locale) => (l === "en" ? "/" : `/${l}`);
type Dict = { about: string; approach: string; conditions: string; consultation: string; faqs: string; contact: string; book: string; bookLong: string; call: string; whatsapp: string; menu: string; skip: string; language: string; privacy: string; terms: string; quick: string; disclaimer: string; heroTitle: string; heroLead: string; finalCta: string; englishNote: string; englishLink: string };
/** DRAFT UI strings for hi/mr. Written by an AI assistant: must be reviewed by a native speaker before launch. */
export const dict: Record<Locale, Dict> = {
  en: { about: "About", approach: "Approach", conditions: "Conditions", consultation: "Consultation", faqs: "FAQs", contact: "Contact", book: "Book", bookLong: "Book an appointment", call: "Call", whatsapp: "WhatsApp", menu: "Menu", skip: "Skip to content", language: "Language", privacy: "Privacy", terms: "Terms", quick: "Quick actions",
    disclaimer: "This website provides general information and is not a substitute for professional medical evaluation. In an emergency, go to the nearest hospital or call 112.",
    heroTitle: "Considered homeopathic care, in the heart of Waluj.", heroLead: "Unhurried one-to-one consultations with Dr. Atul Bhale, with time to listen before any treatment is advised.", finalCta: "Tell us what is troubling you. We will listen.", englishNote: "", englishLink: "" },
  hi: { about: "हमारे बारे में", approach: "उपचार पद्धति", conditions: "स्वास्थ्य समस्याएँ", consultation: "परामर्श", faqs: "अक्सर पूछे जाने वाले प्रश्न", contact: "संपर्क", book: "अपॉइंटमेंट", bookLong: "अपॉइंटमेंट का अनुरोध करें", call: "कॉल करें", whatsapp: "WhatsApp", menu: "मेन्यू", skip: "मुख्य सामग्री पर जाएँ", language: "भाषा", privacy: "गोपनीयता", terms: "शर्तें", quick: "त्वरित विकल्प",
    disclaimer: "यह वेबसाइट सामान्य जानकारी देती है और चिकित्सकीय जाँच का विकल्प नहीं है। आपात स्थिति में नज़दीकी अस्पताल जाएँ या 112 पर कॉल करें।",
    heroTitle: "वालूज के हृदय में, सोच-समझकर किया गया होम्योपैथिक उपचार।", heroLead: "डॉ. अतुल भाले के साथ व्यक्तिगत और बिना जल्दबाज़ी का परामर्श।", finalCta: "आपको क्या परेशानी है, हमें बताइए। हम सुनेंगे।", englishNote: "विस्तृत जानकारी अभी अंग्रेज़ी में उपलब्ध है।", englishLink: "अंग्रेज़ी में देखें" },
  mr: { about: "डॉक्टरांविषयी", approach: "उपचार पद्धती", conditions: "आरोग्य समस्या", consultation: "सल्लामसलत", faqs: "वारंवार विचारले जाणारे प्रश्न", contact: "संपर्क", book: "अपॉइंटमेंट", bookLong: "अपॉइंटमेंटसाठी विनंती करा", call: "कॉल करा", whatsapp: "WhatsApp", menu: "मेनू", skip: "मुख्य मजकुराकडे जा", language: "भाषा", privacy: "गोपनीयता", terms: "अटी", quick: "झटपट पर्याय",
    disclaimer: "ही वेबसाइट सर्वसाधारण माहिती देते आणि वैद्यकीय तपासणीला पर्याय नाही. आणीबाणीच्या वेळी जवळच्या रुग्णालयात जा किंवा 112 वर कॉल करा.",
    heroTitle: "वाळूजच्या मध्यभागी, विचारपूर्वक केलेले होमिओपॅथिक उपचार.", heroLead: "डॉ. अतुल भाले यांच्यासोबत वैयक्तिक आणि घाई न करता सल्लामसलत.", finalCta: "तुम्हाला काय त्रास होत आहे ते सांगा. आम्ही ऐकू.", englishNote: "सविस्तर माहिती सध्या इंग्रजीत उपलब्ध आहे.", englishLink: "इंग्रजीत पहा" },
};
