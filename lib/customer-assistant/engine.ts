import { policyKnowledge, recommendProducts, relatedArticles } from "@/lib/customer-assistant/knowledge";
import type { AssistantIntent, AssistantLanguage } from "@/lib/customer-assistant/types";

const translations: Record<AssistantLanguage, Record<string, string>> = {
  en: {
    welcome: "Namaste. I am Dakshin AI Assistant. I can help you discover products, compare options, understand delivery and returns, or track an order securely.",
    human: "I have marked this conversation for our support team. A human agent can continue from the same chat.",
    verify: "For your privacy, please provide the order number and the email or phone used for the order.",
    noFalse: "I do not have enough verified information to answer that accurately. I can connect you with a human specialist."
  },
  hi: {
    welcome: "नमस्ते। मैं दक्षिण AI असिस्टेंट हूँ। मैं उत्पाद खोजने, डिलीवरी, रिटर्न और ऑर्डर ट्रैकिंग में मदद कर सकता हूँ।",
    human: "मैंने यह बातचीत हमारी सहायता टीम को भेज दी है।",
    verify: "गोपनीयता के लिए ऑर्डर नंबर और ऑर्डर में उपयोग किया गया ईमेल या फोन दें।",
    noFalse: "सही उत्तर देने के लिए मेरे पास पर्याप्त सत्यापित जानकारी नहीं है।"
  },
  ta: { welcome: "வணக்கம். நான் Dakshin AI Assistant. பொருட்கள், டெலிவரி மற்றும் ஆர்டர் கண்காணிப்பில் உதவுகிறேன்.", human: "இந்த உரையாடலை மனித உதவி குழுவிற்கு மாற்றியுள்ளேன்.", verify: "ஆர்டர் எண் மற்றும் பயன்படுத்திய மின்னஞ்சல் அல்லது தொலைபேசியை வழங்கவும்.", noFalse: "துல்லியமான பதிலுக்கு போதுமான சரிபார்க்கப்பட்ட தகவல் இல்லை." },
  te: { welcome: "నమస్తే. నేను Dakshin AI Assistant. ఉత్పత్తులు, డెలివరీ మరియు ఆర్డర్ ట్రాకింగ్‌లో సహాయం చేస్తాను.", human: "ఈ సంభాషణను మానవ సహాయ బృందానికి పంపాను.", verify: "ఆర్డర్ నంబర్ మరియు ఉపయోగించిన ఇమెయిల్ లేదా ఫోన్ ఇవ్వండి.", noFalse: "ఖచ్చితమైన సమాధానానికి సరిపడ ధృవీకరించిన సమాచారం లేదు." },
  ml: { welcome: "നമസ്കാരം. ഞാൻ Dakshin AI Assistant. ഉൽപ്പന്നങ്ങൾ, ഡെലിവറി, ഓർഡർ ട്രാക്കിംഗ് എന്നിവയിൽ സഹായിക്കും.", human: "ഈ സംഭാഷണം മനുഷ്യ സഹായ സംഘത്തിലേക്ക് കൈമാറി.", verify: "ഓർഡർ നമ്പറും ഉപയോഗിച്ച ഇമെയിൽ അല്ലെങ്കിൽ ഫോണും നൽകുക.", noFalse: "കൃത്യമായ മറുപടിക്ക് മതിയായ സ്ഥിരീകരിച്ച വിവരം ലഭ്യമല്ല." },
  kn: { welcome: "ನಮಸ್ಕಾರ. ನಾನು Dakshin AI Assistant. ಉತ್ಪನ್ನಗಳು, ವಿತರಣೆ ಮತ್ತು ಆರ್ಡರ್ ಟ್ರ್ಯಾಕಿಂಗ್‌ನಲ್ಲಿ ಸಹಾಯ ಮಾಡುತ್ತೇನೆ.", human: "ಈ ಸಂಭಾಷಣೆಯನ್ನು ಮಾನವ ಸಹಾಯ ತಂಡಕ್ಕೆ ಕಳುಹಿಸಿದ್ದೇನೆ.", verify: "ಆರ್ಡರ್ ಸಂಖ್ಯೆ ಮತ್ತು ಬಳಸಿದ ಇಮೇಲ್ ಅಥವಾ ಫೋನ್ ನೀಡಿ.", noFalse: "ನಿಖರ ಉತ್ತರಕ್ಕೆ ಸಾಕಷ್ಟು ಪರಿಶೀಲಿತ ಮಾಹಿತಿ ಇಲ್ಲ." }
};

export function classifyIntent(message: string): AssistantIntent {
  const lower = message.toLowerCase();
  if (/\b(human|agent|person|call me|complaint|manager)\b/.test(lower)) return "HUMAN_SUPPORT";
  if (/\b(order|track|shipment|refund status|return status|invoice)\b/.test(lower)) return "ORDER_TRACKING";
  if (/\b(return|refund|shipping|delivery|payment|warranty|policy|faq)\b/.test(lower)) return "POLICY";
  if (/\b(company|quotation|quote|bulk|wholesale|requirement|forklift|warehouse)\b/.test(lower)) return "LEAD_CAPTURE";
  if (/\b(recommend|suggest|best|compare|looking for|need|gift|under ₹|under rs)\b/.test(lower)) return "PRODUCT_SEARCH";
  if (/\b(price|specification|ingredients|weight|stock|available|product)\b/.test(lower)) return "PRODUCT_QUESTION";
  if (/\b(hello|hi|hey|namaste)\b/.test(lower)) return "GREETING";
  return "GENERAL";
}

export function createLocalReply(message: string, language: AssistantLanguage) {
  const intent = classifyIntent(message);
  const lower = message.toLowerCase();
  const text = translations[language];
  if (intent === "GREETING") return { intent, reply: text.welcome, quickReplies: ["Recommend products", "Track my order", "Delivery policy", "Talk to a person"] };
  if (intent === "HUMAN_SUPPORT") return { intent, reply: text.human, quickReplies: ["Share my contact details"], escalated: true };
  if (intent === "ORDER_TRACKING") return { intent, reply: text.verify, quickReplies: ["Enter order details", "Talk to support"], requiresVerification: true };
  if (intent === "POLICY") {
    const key = lower.includes("return") ? "return" : lower.includes("refund") ? "refund" : lower.includes("payment") ? "payment" : lower.includes("warranty") ? "warranty" : lower.includes("shipping") ? "shipping" : "delivery";
    return { intent, reply: policyKnowledge[key], quickReplies: ["Track my order", "Talk to support"] };
  }
  if (intent === "LEAD_CAPTURE") return {
    intent,
    reply: "I can help prepare a quotation request. Please share your name, company, mobile number, email, city and product requirement. For industrial products such as forklifts, a specialist must verify capacity, lift height, power type, aisle width and operating environment.",
    quickReplies: ["Create quotation request", "Talk to sales"]
  };
  if (intent === "PRODUCT_SEARCH" || intent === "PRODUCT_QUESTION") {
    const products = recommendProducts(message);
    return {
      intent,
      reply: products.length ? "These are the closest available products from our current catalog. Prices and stock shown are from the catalog data." : text.noFalse,
      quickReplies: ["Compare these products", "Show bestsellers", "Talk to product expert"],
      products,
      articles: relatedArticles(message)
    };
  }
  return { intent, reply: text.noFalse, quickReplies: ["Browse bestsellers", "Ask about delivery", "Talk to a person"] };
}
