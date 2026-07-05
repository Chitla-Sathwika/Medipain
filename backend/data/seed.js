// Seed data for MediPlain.
// Each item includes English content in full, plus Telugu/Hindi translations
// for the fields users scan first (name + summary). Deeper fields fall back
// to English with a small "translated_partial" flag the frontend can show.
// In production this would live in MongoDB and be filled out by a medical
// content team; here it's enough data to make every feature genuinely work.

export const tests = [
  {
    id: "cbc",
    aliases: ["cbc", "complete blood count", "cbc test"],
    name: { en: "Complete Blood Count (CBC)", te: "సంపూర్ణ రక్త గణన (CBC)", hi: "संपूर्ण रक्त गणना (CBC)" },
    purpose: {
      en: "Measures red cells, white cells, and platelets to give an overall picture of your blood health.",
      te: "మీ రక్త ఆరోగ్యాన్ని అంచనా వేయడానికి ఎర్ర రక్త కణాలు, తెల్ల రక్త కణాలు మరియు ప్లేట్‌లెట్లను కొలుస్తుంది.",
      hi: "आपके रक्त स्वास्थ्य का समग्र चित्र देने के लिए लाल कोशिकाओं, श्वेत कोशिकाओं और प्लेटलेट्स को मापता है।"
    },
    whyRecommended: "Doctors order it for routine checkups, unexplained fatigue, infection, or before surgery.",
    detects: "Anemia, infections, clotting problems, and some blood cancers.",
    normalRange: "RBC: 4.5-5.5 M/µL, WBC: 4,000-11,000/µL, Platelets: 150,000-450,000/µL (adult ranges, vary by lab)",
    abnormal: "Low RBC/hemoglobin suggests anemia. High WBC often means infection or inflammation. Low platelets can indicate bleeding risk.",
    preparation: "Usually no fasting required unless combined with other tests.",
    costRange: "₹200 - ₹600 in India",
    faqs: [
      { q: "Do I need to fast for CBC?", a: "No, CBC alone doesn't require fasting." },
      { q: "How long do results take?", a: "Usually same day, often within a few hours." }
    ]
  },
  {
    id: "blood-sugar",
    aliases: ["blood sugar test", "glucose test", "fbs", "ppbs", "sugar test"],
    name: { en: "Blood Sugar Test (FBS/PPBS)", te: "రక్తంలో చక్కెర పరీక్ష", hi: "रक्त शर्करा परीक्षण" },
    purpose: {
      en: "Checks the level of glucose in your blood to screen for or monitor diabetes.",
      te: "మధుమేహాన్ని గుర్తించడానికి లేదా పర్యవేక్షించడానికి మీ రక్తంలో గ్లూకోజ్ స్థాయిని తనిఖీ చేస్తుంది.",
      hi: "मधुमेह की जांच या निगरानी के लिए आपके रक्त में ग्लूकोज़ के स्तर की जांच करता है।"
    },
    whyRecommended: "Prescribed for diabetes screening, monitoring existing diabetes, or investigating symptoms like excess thirst or fatigue.",
    detects: "Diabetes, prediabetes, and hypoglycemia.",
    normalRange: "Fasting: 70-100 mg/dL, Post-meal (PPBS): under 140 mg/dL",
    abnormal: "Fasting above 126 mg/dL on repeat tests suggests diabetes. Below 70 mg/dL is low blood sugar (hypoglycemia).",
    preparation: "Fasting test requires 8-12 hours without food; PPBS is taken 2 hours after a meal.",
    costRange: "₹100 - ₹300 in India",
    faqs: [
      { q: "Can I drink water while fasting?", a: "Yes, plain water is fine during the fasting period." }
    ]
  },
  {
    id: "lipid-profile",
    aliases: ["lipid profile", "cholesterol test"],
    name: { en: "Lipid Profile", te: "లిపిడ్ ప్రొఫైల్", hi: "लिपिड प्रोफाइल" },
    purpose: {
      en: "Measures cholesterol and triglyceride levels to assess heart disease risk.",
      te: "గుండె జబ్బు ప్రమాదాన్ని అంచనా వేయడానికి కొలెస్ట్రాల్ మరియు ట్రైగ్లిజరైడ్ స్థాయిలను కొలుస్తుంది.",
      hi: "हृदय रोग के जोखिम का आकलन करने के लिए कोलेस्ट्रॉल और ट्राइग्लिसराइड के स्तर को मापता है।"
    },
    whyRecommended: "Routine cardiac risk screening, especially over age 40 or with family history of heart disease.",
    detects: "High LDL ('bad' cholesterol), low HDL ('good' cholesterol), high triglycerides.",
    normalRange: "Total cholesterol: <200 mg/dL, LDL: <100 mg/dL, HDL: >40 mg/dL, Triglycerides: <150 mg/dL",
    abnormal: "High LDL/triglycerides raise heart disease risk. Low HDL is also a risk factor.",
    preparation: "9-12 hours fasting required.",
    costRange: "₹400 - ₹900 in India",
    faqs: [{ q: "Can I take my medicines before the test?", a: "Ask your doctor — some medicines are usually fine, but confirm first." }]
  },
  {
    id: "thyroid",
    aliases: ["thyroid test", "tsh test", "thyroid profile"],
    name: { en: "Thyroid Profile (TSH, T3, T4)", te: "థైరాయిడ్ ప్రొఫైల్", hi: "थायरॉइड प्रोफाइल" },
    purpose: {
      en: "Checks how well your thyroid gland is regulating metabolism.",
      te: "మీ థైరాయిడ్ గ్రంథి జీవక్రియను ఎంత బాగా నియంత్రిస్తుందో తనిఖీ చేస్తుంది.",
      hi: "यह जांचता है कि आपकी थायरॉइड ग्रंथि चयापचय को कितनी अच्छी तरह नियंत्रित कर रही है।"
    },
    whyRecommended: "Fatigue, weight changes, hair loss, or irregular periods often prompt this test.",
    detects: "Hypothyroidism (underactive) or hyperthyroidism (overactive thyroid).",
    normalRange: "TSH: 0.4-4.0 mIU/L (varies by lab and age)",
    abnormal: "High TSH usually means hypothyroidism; low TSH usually means hyperthyroidism.",
    preparation: "No fasting needed, but test at a consistent time of day if monitoring over time.",
    costRange: "₹300 - ₹800 in India",
    faqs: [{ q: "Does stress affect results?", a: "Significant stress and illness can temporarily affect thyroid levels." }]
  },
  {
    id: "liver-function",
    aliases: ["lft", "liver function test"],
    name: { en: "Liver Function Test (LFT)", te: "కాలేయ పనితీరు పరీక్ష", hi: "यकृत कार्य परीक्षण" },
    purpose: { en: "Assesses liver health via enzymes, proteins, and bilirubin levels.", te: "ఎంజైమ్‌లు, ప్రొటీన్లు మరియు బిలిరుబిన్ స్థాయిల ద్వారా కాలేయ ఆరోగ్యాన్ని అంచనా వేస్తుంది.", hi: "एंजाइम, प्रोटीन और बिलीरुबिन स्तर के माध्यम से यकृत स्वास्थ्य का आकलन करता है।" },
    whyRecommended: "Jaundice symptoms, alcohol use monitoring, or before starting certain medications.",
    detects: "Hepatitis, fatty liver, liver damage, bile duct issues.",
    normalRange: "ALT: 7-56 U/L, AST: 10-40 U/L, Bilirubin: 0.1-1.2 mg/dL",
    abnormal: "Elevated ALT/AST suggests liver cell damage or inflammation.",
    preparation: "Usually no fasting required.",
    costRange: "₹500 - ₹1200 in India",
    faqs: []
  },
  {
    id: "kidney-function",
    aliases: ["kft", "kidney function test", "renal function test"],
    name: { en: "Kidney Function Test (KFT)", te: "మూత్రపిండాల పనితీరు పరీక్ష", hi: "गुर्दा कार्य परीक्षण" },
    purpose: { en: "Checks creatinine and urea to see how well your kidneys filter waste.", te: "మీ మూత్రపిండాలు వ్యర్థాలను ఎంత బాగా వడపోస్తున్నాయో చూడటానికి క్రియాటినిన్ మరియు యూరియాను తనిఖీ చేస్తుంది.", hi: "आपके गुर्दे कचरे को कितनी अच्छी तरह फ़िल्टर करते हैं यह देखने के लिए क्रिएटिनिन और यूरिया की जांच करता है।" },
    whyRecommended: "High blood pressure, diabetes monitoring, or swelling in legs/feet.",
    detects: "Chronic kidney disease, dehydration, urinary blockages.",
    normalRange: "Creatinine: 0.6-1.3 mg/dL, Urea: 7-20 mg/dL",
    abnormal: "High creatinine/urea can indicate reduced kidney function.",
    preparation: "No fasting typically needed.",
    costRange: "₹400 - ₹900 in India",
    faqs: []
  },
  {
    id: "vitamin-d",
    aliases: ["vitamin d test", "25-oh vitamin d"],
    name: { en: "Vitamin D Test", te: "విటమిన్ డి పరీక్ష", hi: "विटामिन डी परीक्षण" },
    purpose: { en: "Measures vitamin D level, important for bone health and immunity.", te: "ఎముకల ఆరోగ్యం మరియు రోగనిరోధక శక్తికి ముఖ్యమైన విటమిన్ డి స్థాయిని కొలుస్తుంది.", hi: "हड्डियों के स्वास्थ्य और प्रतिरक्षा के लिए महत्वपूर्ण विटामिन डी के स्तर को मापता है।" },
    whyRecommended: "Bone pain, fatigue, frequent illness, or as part of routine wellness screening.",
    detects: "Vitamin D deficiency or, rarely, toxicity.",
    normalRange: "30-100 ng/mL is considered sufficient",
    abnormal: "Below 20 ng/mL is generally considered deficient.",
    preparation: "No fasting required.",
    costRange: "₹1000 - ₹2000 in India",
    faqs: []
  },
  {
    id: "urine-routine",
    aliases: ["urine test", "urine routine", "urine analysis"],
    name: { en: "Urine Routine Examination", te: "మూత్ర పరీక్ష", hi: "मूत्र परीक्षण" },
    purpose: { en: "Screens for urinary tract infections, kidney issues, and diabetes markers.", te: "మూత్ర మార్గ ఇన్ఫెక్షన్లు, మూత్రపిండాల సమస్యలు మరియు మధుమేహం సూచికల కోసం పరీక్షిస్తుంది.", hi: "मूत्र मार्ग संक्रमण, गुर्दे की समस्याओं और मधुमेह के संकेतकों की जांच करता है।" },
    whyRecommended: "Burning urination, back pain, routine checkups, or pregnancy checkups.",
    detects: "UTIs, kidney stones, glucose/protein leakage.",
    normalRange: "Clear, no glucose/protein/blood/leukocytes",
    abnormal: "Presence of blood, glucose, or leukocytes suggests infection or other issues.",
    preparation: "Midstream clean-catch sample recommended.",
    costRange: "₹100 - ₹300 in India",
    faqs: []
  }
];

export const medicines = [
  {
    id: "dolo-650",
    aliases: ["dolo 650", "dolo650", "dolo"],
    name: { en: "Dolo 650", te: "డోలో 650", hi: "डोलो 650" },
    genericName: "Paracetamol 650mg",
    uses: {
      en: "Used to relieve fever and mild to moderate pain such as headache or body ache.",
      te: "జ్వరం మరియు తలనొప్పి లేదా శరీర నొప్పి వంటి తేలికపాటి నొప్పిని తగ్గించడానికి ఉపయోగిస్తారు.",
      hi: "बुखार और सिरदर्द या शरीर दर्द जैसे हल्के से मध्यम दर्द से राहत के लिए उपयोग किया जाता है।"
    },
    whyPrescribed: "Commonly prescribed for fever, viral infections, headaches, and general body pain.",
    dosage: "Usually one tablet every 6-8 hours, not exceeding 4 tablets (2600mg) per day for adults, unless advised otherwise.",
    sideEffects: "Rare at normal doses; overdose can cause serious liver damage.",
    precautions: "Avoid alcohol. Do not exceed the recommended dose. Caution in liver disease.",
    interactions: "Can interact with warfarin (blood thinner) at high doses; avoid combining with other paracetamol-containing products.",
    costRange: "₹20 - ₹35 for a strip of 15 tablets",
  },
  {
    id: "paracetamol",
    aliases: ["paracetamol", "acetaminophen"],
    name: { en: "Paracetamol", te: "పారాసెటమాల్", hi: "पैरासिटामोल" },
    genericName: "Paracetamol / Acetaminophen",
    uses: { en: "Fever and mild pain relief.", te: "జ్వరం మరియు తేలికపాటి నొప్పి ఉపశమనం.", hi: "बुखार और हल्के दर्द से राहत।" },
    whyPrescribed: "First-line treatment for fever and mild pain across almost all age groups.",
    dosage: "Adults: 500-1000mg every 4-6 hours, max 4g/day. Children: dosed by weight — follow pediatrician's guidance.",
    sideEffects: "Generally well tolerated; rare allergic reactions.",
    precautions: "Overdose risk is serious — check you're not doubling up via combination cold/flu medicines.",
    interactions: "Long-term heavy alcohol use increases liver toxicity risk.",
    costRange: "₹10 - ₹25 for a strip of 10-15 tablets",
  },
  {
    id: "azithromycin",
    aliases: ["azithromycin", "azithral", "azee"],
    name: { en: "Azithromycin", te: "అజిత్రోమైసిన్", hi: "एज़िथ्रोमाइसिन" },
    genericName: "Azithromycin",
    uses: { en: "An antibiotic used to treat bacterial infections like respiratory and throat infections.", te: "శ్వాసకోశ మరియు గొంతు ఇన్ఫెక్షన్ల వంటి బ్యాక్టీరియా ఇన్ఫెక్షన్లకు చికిత్స చేసే యాంటీబయాటిక్.", hi: "श्वसन और गले के संक्रमण जैसे जीवाणु संक्रमणों के इलाज के लिए एक एंटीबायोटिक।" },
    whyPrescribed: "Bacterial throat, sinus, lung, or skin infections.",
    dosage: "Typically 500mg once daily for 3 days, or as prescribed — course must be completed fully.",
    sideEffects: "Nausea, diarrhea, stomach pain; rare heart rhythm effects.",
    precautions: "Do not stop early even if you feel better — incomplete courses can cause antibiotic resistance. Not effective against viral infections like flu or common cold.",
    interactions: "Can interact with antacids (space doses apart) and certain heart medications.",
    costRange: "₹80 - ₹150 for a strip of 3 tablets",
  },
  {
    id: "metformin",
    aliases: ["metformin", "glycomet"],
    name: { en: "Metformin", te: "మెట్‌ఫార్మిన్", hi: "मेटफॉर्मिन" },
    genericName: "Metformin Hydrochloride",
    uses: { en: "Controls blood sugar levels in type 2 diabetes.", te: "టైప్ 2 మధుమేహంలో రక్తంలో చక్కెర స్థాయిలను నియంత్రిస్తుంది.", hi: "टाइप 2 मधुमेह में रक्त शर्करा के स्तर को नियंत्रित करता है।" },
    whyPrescribed: "First-line medication for managing type 2 diabetes.",
    dosage: "Commonly 500mg-1000mg twice daily with meals, adjusted by doctor.",
    sideEffects: "Nausea, stomach upset, diarrhea, especially when starting.",
    precautions: "Take with food to reduce stomach upset. Avoid in significant kidney impairment.",
    interactions: "Caution with alcohol and certain contrast dyes used in imaging scans.",
    costRange: "₹30 - ₹100 for a strip of 10-15 tablets",
  },
  {
    id: "amoxicillin",
    aliases: ["amoxicillin", "amoxyclav", "augmentin"],
    name: { en: "Amoxicillin", te: "అమోక్సిసిలిన్", hi: "एमोक्सिसिलिन" },
    genericName: "Amoxicillin (often with Clavulanic Acid)",
    uses: { en: "Antibiotic for bacterial infections including ear, throat, and urinary infections.", te: "చెవి, గొంతు మరియు మూత్ర ఇన్ఫెక్షన్లతో సహా బ్యాక్టీరియా ఇన్ఫెక్షన్లకు యాంటీబయాటిక్.", hi: "कान, गले और मूत्र संक्रमण सहित जीवाणु संक्रमणों के लिए एंटीबायोटिक।" },
    whyPrescribed: "Bacterial ENT infections, UTIs, and some skin infections.",
    dosage: "Typically 500mg every 8 hours, or as prescribed — complete the full course.",
    sideEffects: "Diarrhea, nausea, skin rash.",
    precautions: "Inform your doctor of any penicillin allergy before taking.",
    interactions: "May reduce effectiveness of some oral contraceptives.",
    costRange: "₹100 - ₹200 for a strip of 10 tablets",
  },
  {
    id: "cetirizine",
    aliases: ["cetirizine", "cetrizine", "cetzine"],
    name: { en: "Cetirizine", te: "సెటిరిజిన్", hi: "सेटिरिज़िन" },
    genericName: "Cetirizine Hydrochloride",
    uses: { en: "Antihistamine for allergy relief — sneezing, itching, runny nose.", te: "అలర్జీ ఉపశమనం కోసం యాంటిహిస్టామైన్ — తుమ్ములు, దురద, ముక్కు కారడం.", hi: "एलर्जी से राहत के लिए एंटीहिस्टामाइन — छींक, खुजली, नाक बहना।" },
    whyPrescribed: "Seasonal allergies, skin allergies, hives.",
    dosage: "10mg once daily for adults, usually at night as it can cause drowsiness.",
    sideEffects: "Drowsiness, dry mouth.",
    precautions: "Avoid driving if it makes you drowsy.",
    interactions: "Additive drowsiness with alcohol or sedatives.",
    costRange: "₹15 - ₹40 for a strip of 10 tablets",
  },
  {
    id: "pantoprazole",
    aliases: ["pantoprazole", "pantocid", "pan 40"],
    name: { en: "Pantoprazole", te: "పాంటోప్రజోల్", hi: "पैंटोप्राज़ोल" },
    genericName: "Pantoprazole",
    uses: { en: "Reduces stomach acid — used for acidity, gastritis, and acid reflux.", te: "కడుపు ఆమ్లాన్ని తగ్గిస్తుంది — ఆమ్లత్వం, గ్యాస్ట్రైటిస్ కోసం ఉపయోగిస్తారు.", hi: "पेट के एसिड को कम करता है — अम्लता, गैस्ट्राइटिस के लिए उपयोग किया जाता है।" },
    whyPrescribed: "Acidity, heartburn, gastritis, or alongside NSAIDs to protect the stomach.",
    dosage: "Usually 40mg once daily before breakfast.",
    sideEffects: "Headache, diarrhea, nausea.",
    precautions: "Long-term use should be reviewed by a doctor periodically.",
    interactions: "Can affect absorption of certain other drugs.",
    costRange: "₹40 - ₹90 for a strip of 10-15 tablets",
  },
  {
    id: "ibuprofen",
    aliases: ["ibuprofen", "brufen"],
    name: { en: "Ibuprofen", te: "ఇబుప్రోఫెన్", hi: "इबुप्रोफेन" },
    genericName: "Ibuprofen",
    uses: { en: "Relieves pain, inflammation, and fever.", te: "నొప్పి, వాపు మరియు జ్వరాన్ని తగ్గిస్తుంది.", hi: "दर्द, सूजन और बुखार से राहत देता है।" },
    whyPrescribed: "Muscle pain, arthritis, menstrual cramps, fever.",
    dosage: "200-400mg every 6-8 hours with food, max as advised by doctor.",
    sideEffects: "Stomach upset, heartburn; long-term use risks stomach ulcers.",
    precautions: "Take with food. Avoid in stomach ulcer history, kidney disease, or late pregnancy.",
    interactions: "Increases bleeding risk with blood thinners; avoid combining with other NSAIDs.",
    costRange: "₹20 - ₹50 for a strip of 10 tablets",
  }
];
