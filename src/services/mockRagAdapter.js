/**
 * Mock RAG Service Adapter
 * 
 * Provides simulated RAG retrieval and generation responses for the prototype phase.
 * All data is strictly marked as DEVELOPMENT/PROTOTYPE ONLY.
 */

import { normalizeRagResponse } from './ragContracts';

const MOCK_KNOWLEDGE_BASE = [
  // 1. Marathi Patent Filing (Requested Example)
  {
    triggers: ['patent application sathi konti documents lagtil', 'patent documents marathi', 'पेटंट कागदपत्रे'],
    language: 'mr',
    answer: `**[नमुना प्रोटोटाइप उत्तर — विकास टप्पा]**

भारतीय पेटंट कार्यालयात (Indian Patent Office / CGPDTM) नवीन पेटंट अर्ज दाखल करण्यासाठी खालील आवश्यक कायदेशीर फॉर्म आणि कागदपत्रांची आवश्यकता असते:

1. **फॉर्म १ (Form 1):** पेटंट मंजुरीसाठी अधिकृत अर्ज (Application for Grant of Patent).
2. **फॉर्म २ (Form 2):** तात्पुरती किंवा संपूर्ण तपशीलपत्रिका (Provisional or Complete Specification). यामध्ये शोध (Invention), त्याचे कार्य आणि दावे (Claims) नमूद असतात.
3. **फॉर्म ३ (Form 3):** परदेशी अर्ज आणि इतर माहितीचे हमीपत्र (Statement and Undertaking under Section 8).
4. **फॉर्म ५ (Form 5):** संशोधकत्वाचे घोषणापत्र (Declaration as to Inventorship).
5. **फॉर्म २६ (Form 26):** जर अर्ज पेटंट एजंट/वकिलामार्फत दाखल करत असाल तर मुखत्यारपत्र (Power of Attorney).
6. **अभियांत्रिकी चित्रे / रेखाचित्रे (Drawings):** शोधाची तांत्रिक रचना स्पष्ट करण्यासाठी आकृत्या.
7. **अधिकृत फी भरणा पावती (Official Fees Receipt):** ई-फायलिंग पोर्टलवरून ऑनलाइन शुल्क भरल्याचा पुरावा.

*टीप: हे उत्तर केवळ सिमुलेशन/प्रोटोटाइप प्रात्यक्षिकासाठी आहे. अधिकृत संदर्भासाठी भारतीय पेटंट कार्यालय (ipindia.gov.in) मार्गदर्शक नियमावली तपासावी.*`,
    sources: [
      {
        title: 'Sample Document — Development Only: Indian Patent Act 1970 & Rules 2003',
        page: 10,
        section: 'Section 7 & 8 — Form and Contents of Application',
        url: 'https://ipindia.gov.in/writereaddata/Portal/IPOAct/1_113_1_The_Patents_Act_1970__Amended_till_2006.pdf',
        excerpt: 'Every application for a patent shall be for one invention only and shall be made in the prescribed form and filed in the patent office.'
      },
      {
        title: 'Sample Document — Development Only: Manual of Patent Office Practice and Procedure (MPOPP)',
        page: 24,
        section: 'Chapter 03.02 — Filing of Patent Application Documents',
        url: 'https://ipindia.gov.in/writereaddata/Portal/IPOGuidelines/1_86_1_Draft_Manual_of_Patent_Office_Practice_and_Procedure_01_11_2019.pdf',
        excerpt: 'The applicant must submit Form 1, Form 2 with description, Form 3 within prescribed timelines, and Form 5 signed by inventors.'
      }
    ]
  },

  // 2. English Patent Filing Checklist
  {
    triggers: ['patent application', 'patent forms', 'patent checklist', 'forms required to file a patent'],
    language: 'en',
    answer: `**[Sample Development Response — Prototype Phase]**

Under the **Indian Patents Act, 1970** and **Patent Rules, 2003 (as amended)**, a standard patent application requires the following statutory forms and technical disclosures:

### 1. Mandatory Statutory Forms
- **Form 1 (Application for Grant of Patent):** Contains details of applicant, inventor declarations, and convention priority claims.
- **Form 2 (Specification):** 
  - *Provisional Specification* (to secure priority date) or 
  - *Complete Specification* (within 12 months, detailing background, summary, detailed description, drawings, and legal Claims).
- **Form 3 (Statement & Undertaking under Section 8):** Disclosure of corresponding foreign patent applications.
- **Form 5 (Declaration as to Inventorship):** Submitted with complete specification.
- **Form 18 / 18A (Request for Examination):** Mandatory to trigger examination (Form 18A for expedited startups/female applicants).

### 2. Supporting Disclosures
- **Drawings / Schematics:** Necessary if referenced in the specification.
- **Form 26 (Power of Attorney):** Required if filed via registered Patent Agent.
- **Biological Material Disclosure:** Mandatory clearance from the National Biodiversity Authority (NBA) if using Indian biological resources.`,
    sources: [
      {
        title: 'Sample Document — Development Only: Manual of Patent Office Practice and Procedure (MPOPP 2019)',
        page: 12,
        section: 'Section 03.02 — Application Formats & Fees',
        url: 'https://ipindia.gov.in/writereaddata/Portal/IPOGuidelines/1_86_1_Draft_Manual_of_Patent_Office_Practice_and_Procedure_01_11_2019.pdf',
        excerpt: 'Standard filing checklist requires Form 1, Form 2 (Claims and Abstract), Form 3, and Form 5, accompanied by statutory filing fee.'
      },
      {
        title: 'Sample Document — Development Only: Patents Act 1970 (Section 10)',
        page: 18,
        section: 'Section 10(4) — Contents of Specification and Scope of Claims',
        url: 'https://ipindia.gov.in/writereaddata/Portal/IPOAct/1_113_1_The_Patents_Act_1970__Amended_till_2006.pdf',
        excerpt: 'Every complete specification shall fully and particularly describe the invention and its operation, and conclude with a claim or claims defining the scope.'
      }
    ]
  },

  // 3. Trademarks Nice Classification
  {
    triggers: ['trademark', 'nice classification', 'tm-a', 'brand', 'class 9', 'class 42'],
    language: 'en',
    answer: `**[Sample Development Response — Prototype Phase]**

When filing a Trademark Application (**Form TM-A**) with the Trademark Registry of India, goods and services are classified under the international **Nice Classification (Classes 1 to 45)**:

### 1. Classification for Software / SaaS Products:
- **Class 9 (Goods):** Covers downloadable computer software, mobile applications, recorded media, and electronic data storage devices.
- **Class 42 (Services):** Covers Software-as-a-Service (SaaS), cloud computing services, IT consultancy, and software development services.

### 2. Multi-Class vs Single Class Filing:
- Under **Rule 23 of Trade Marks Rules, 2017**, applicants can file a single application covering multiple classes via Form TM-A.
- Statutory fee is calculated per class (discounted 50% for Startups and MSMEs).`,
    sources: [
      {
        title: 'Sample Document — Development Only: Trade Marks Rules 2017',
        page: 14,
        section: 'Rule 23 — Classification of Goods and Services (Nice Classification 11th Ed.)',
        url: 'https://ipindia.gov.in/writereaddata/Portal/IPORules/1_69_1_Trade_Marks_Rules_2017.pdf',
        excerpt: 'Goods and services are classified for the purpose of registration of trade marks according to current edition of the Nice Classification.'
      },
      {
        title: 'Sample Document — Development Only: CGPDTM Manual of Trade Marks Practice and Procedure',
        page: 38,
        section: 'Chapter II — Nice Classification Applied to Computer and Online Services',
        url: 'https://ipindia.gov.in/trade-marks.htm',
        excerpt: 'Class 9 includes downloadable computer software; Class 42 comprises Software-as-a-Service and platform hosting.'
      }
    ]
  },

  // 4. BIS Toy Safety Standards
  {
    triggers: ['toy', 'bis', 'is 9873', 'qco', 'safety standards', 'खेळणी'],
    language: 'en',
    answer: `**[Sample Development Response — Prototype Phase]**

In India, toys for children up to 14 years of age are subject to the **Toys (Quality Control) Order (QCO)** issued by DPIIT, mandating standard BIS certification (ISI Mark under Scheme-I):

### Key Mandatory Standards:
1. **IS 9873 (Part 1):** Safety Aspects Related to Mechanical and Physical Properties (drop test, small parts, sharp edges).
2. **IS 9873 (Part 2):** Flammability requirements for textiles and plush toys.
3. **IS 9873 (Part 3):** Migration of Certain Elements (toxic heavy metal limits including lead, cadmium, mercury, and arsenic).
4. **IS 9873 (Part 4 & 7):** Swings, slides, activity toys, and phthalates plasticizer chemical safety.
5. **IS 15644:** Safety of Electric Toys (battery insulation, heat resistance, short-circuit protection).

*Compliance Note: No toy can be manufactured, imported, distributed, or sold in India without the BIS Standard Mark (ISI logo).*`,
    sources: [
      {
        title: 'Sample Document — Development Only: DPIIT Toys (Quality Control) Order',
        page: 4,
        section: 'Clause 3 — Mandatory Use of Standard Mark for Toys',
        url: 'https://www.bis.gov.in/product-certification/products-under-compulsory-certification/toys/',
        excerpt: 'Goods or articles specified in column (1) shall conform to corresponding Indian Standards IS 9873 and IS 15644 under licence from BIS.'
      },
      {
        title: 'Sample Document — Development Only: Bureau of Indian Standards (BIS) Product Manual for Toys',
        page: 22,
        section: 'Section 4 — Testing Protocols for Mechanical and Chemical Hazards (IS 9873)',
        url: 'https://www.bis.gov.in/',
        excerpt: 'Sampling guidelines and migration of heavy metal analysis required before ISI certification grant.'
      }
    ]
  },

  // 5. Ayush & TKDL (Hindi)
  {
    triggers: ['ayush', 'tkdl', 'आयुष', 'बायो-पायरेसी', 'आयुर्वेद', 'पारंपरिक ज्ञान'],
    language: 'hi',
    answer: `**[नमुना प्रोटोटाइप उत्तर — विकास चरण]**

पारंपरिक ज्ञान डिजिटल लाइब्रेरी (**TKDL - Traditional Knowledge Digital Library**) भारत सरकार (CSIR एवं आयुष मंत्रालय) की एक विश्व-अग्रणी पहल है, जो भारतीय पारंपरिक चिकित्सा ज्ञान को अनुचित विदेशी पेटेंट (बायो-पायरेसी) से सुरक्षित करती है:

### 1. TKDL का मुख्य कार्यप्रणाली:
- **प्राचीन ग्रंथों का डिजिटलीकरण:** आयुर्वेद, यूनानी, सिद्ध और योग के प्राचीन संस्कृत, अरबी, फारसी और तमिल ग्रंथों के नुस्खों को 5 अंतरराष्ट्रीय भाषाओं (अंग्रेजी, फ्रेंच, जर्मन, जापानी, स्पेनिश) में पेटेंट वर्गीकरण (IPC) के अनुसार संकलित किया गया है।
- **विदेशी पेटेंट कार्यालयों के साथ समझौता:** TKDL का उपयोग यूरोपीय पेटेंट कार्यालय (EPO), यूएस पेटेंट कार्यालय (USPTO), जापानी पेटेंट कार्यालय (JPO) आदि द्वारा पूर्व कला (Prior Art) परीक्षण के लिए किया जाता है।

### 2. राष्ट्रीय जैव विविधता प्राधिकरण (NBA) अनापत्ति:
- **जैव विविधता अधिनियम, 2002 (धारा 6):** किसी भी भारतीय जैविक संसाधन या पारंपरिक ज्ञान पर पेटेंट आवेदन करने से पूर्व NBA की पूर्व अनुमति लेना कानूनी रूप से अनिवार्य है।`,
    sources: [
      {
        title: 'Sample Document — Development Only: TKDL Institutional Framework & Guidelines (CSIR-AYUSH)',
        page: 15,
        section: 'अनुभाग २ — TKDL Access Agreement and Prior Art Defense Mechanism',
        url: 'https://www.tkdl.res.in/',
        excerpt: 'TKDL prevents bio-piracy by providing non-exclusive access to International Patent Offices for search and examination prior art purposes.'
      },
      {
        title: 'Sample Document — Development Only: The Biological Diversity Act 2002',
        page: 9,
        section: 'Section 6 — Application for Intellectual Property Rights on Biological Resources',
        url: 'http://nbaindia.org/content/25/19/1/act.html',
        excerpt: 'No person shall apply for any intellectual property right, by whatever name called, in or outside India for any invention based on any research on a biological resource obtained from India without previous approval of National Biodiversity Authority.'
      }
    ]
  },

  // 6. Geographical Indications (GI)
  {
    triggers: ['gi', 'geographical indication', 'भौगोलिक निर्देशांक', 'gi tag'],
    language: 'mr',
    answer: `**[नमुना प्रोटोटाइप उत्तर — विकास टप्पा]**

भारतात **भौगोलिक निर्देशांक (नोंदणी आणि संरक्षण) कायदा, १९९९ (GI Act 1999)** अन्वये एखाद्या विशिष्ट भौगोलिक प्रदेशाशी संबंधित कृषी, नैसर्गिक किंवा हस्तकला उत्पादनांना कायदेशीर ओळख दिली जाते:

### १. जीआय टॅग नोंदणीची अधिकृत पायरी:
1. **अर्जदार पात्रता:** उत्पादकांची अधिकृत संस्था, सहकारी संस्था किंवा सरकार-मान्यताप्राप्त संघ (वैयक्तिक मालकी दिली जात नाही).
2. **फॉर्म GI-1A:** जीआय नोंदणी कार्यालयात (चेन्नई) ऐतिहासिक संदर्भ, उत्पादन वैशिष्ट्ये आणि भौगोलिक सीमा नकाशासह सादर करावा लागतो.
3. **तज्ज्ञ सल्लागार समिती तपासणी (Consultative Committee Examination).**
4. **जीआय जर्नलमध्ये प्रसिद्धी (Publication in GI Journal)** आणि ४ महिन्यांची हरकती (Opposition) मुदत.
5. **नोंदणी प्रमाणपत्र (Registration Certificate):** १० वर्षांसाठी वैध, त्यानंतर नूतनीकरण करता येते.

*महाराष्ट्रातील उदाहरणे: कोल्हापुरी चप्पल, महाबळेश्वर स्ट्रॉबेरी, नाशिक व्हॅली वाईन, पैठणी साडी इ.*`,
    sources: [
      {
        title: 'Sample Document — Development Only: Geographical Indications of Goods Act 1999',
        page: 7,
        section: 'Section 11 — Application for Registration of Geographical Indication',
        url: 'https://ipindia.gov.in/gi.htm',
        excerpt: 'Any association of persons or producers or any organisation or authority established by or under any law representing the interest of the producers can apply.'
      }
    ]
  },

  // 7. International IP / PCT Section 39
  {
    triggers: ['pct', 'international ip', 'foreign filing', 'section 39', 'wipo', 'madrid'],
    language: 'en',
    answer: `**[Sample Development Response — Prototype Phase]**

When an Indian resident inventor seeks to file an international patent application (via **PCT** or directly in foreign patent offices), strict statutory compliance with **Section 39 of the Indian Patents Act, 1970** is mandatory:

### 1. Section 39 Foreign Filing License (FFL):
- **Requirement:** A person resident in India cannot file any patent application outside India without:
  - First filing in the Indian Patent Office at least **6 weeks prior**, OR
  - Obtaining written permission (Foreign Filing License via **Form 25**).
- **Penalty:** Violation of Section 39 is a criminal offense under Section 118, attracting imprisonment up to 2 years and abandonment of the Indian patent.

### 2. PCT Filing Routes from India:
- Once FFL clearance is obtained, an applicant may file an international PCT application with the Indian Patent Office (acting as a Receiving Office - RO/IN) or directly with the International Bureau of WIPO (RO/IB).`,
    sources: [
      {
        title: 'Sample Document — Development Only: The Patents Act 1970 (Section 39)',
        page: 45,
        section: 'Section 39 — Residents not to apply for patents outside India without prior permission',
        url: 'https://ipindia.gov.in/writereaddata/Portal/IPOAct/1_113_1_The_Patents_Act_1970__Amended_till_2006.pdf',
        excerpt: 'No person resident in India shall, except under the authority of a written permit granted in the prescribed manner by or on behalf of the Controller, make or cause to be made any application outside India for the grant of a patent for an invention.'
      },
      {
        title: 'Sample Document — Development Only: WIPO PCT Applicant’s Guide — National Phase: India',
        page: 6,
        section: 'Section IN.04 — Filing Procedures and Priority Claims',
        url: 'https://www.wipo.int/pct/en/guide/index.html',
        excerpt: 'Indian Patent Office acts as receiving Office (RO/IN) and International Searching and Preliminary Examining Authority (ISA/IPEA).'
      }
    ]
  }
];

/**
 * Searches the mock knowledge base or synthesizes a contextual response.
 */
export function getMockRagResponse(query, language = 'en', forceEmptySources = false) {
  const normalizedQuery = (query || '').toLowerCase().trim();
  
  if (forceEmptySources) {
    return normalizeRagResponse({
      answer: `**[Sample Development Response — No High-Confidence Sources]**\n\nYour question regarding "${query}" was evaluated against the prototype knowledge base index. While the legal query is understood, no specific section or statutory document passed the 0.85 semantic retrieval confidence threshold.\n\nIn the production system, this query will trigger an extended secondary retrieval sweep or escalate to human IP paralegal review.`,
      language,
      sources: [],
      session_id: `session_sim_${Date.now()}`
    });
  }

  // Find best match in mock KB
  const matched = MOCK_KNOWLEDGE_BASE.find(item => 
    item.triggers.some(trigger => normalizedQuery.includes(trigger.toLowerCase()))
  );

  if (matched) {
    return normalizeRagResponse({
      answer: matched.answer,
      language: matched.language || language,
      sources: matched.sources,
      session_id: `session_mock_${Date.now()}`
    });
  }

  // Contextual fallback response across IP domains
  const fallbackAnswer = language === 'mr' 
    ? `**[नमुना प्रोटोटाइप उत्तर — विकास टप्पा]**\n\nआपल्या प्रश्नाचे ("${query}") विश्लेषण करण्यात आले आहे. हा प्रोटोटाइप विकास टप्प्यात असून बौद्धिक संपदा (पेटंट, ट्रेडमार्क, कॉपीराइट, डिझाईन, जीआय, बीआयएस खेळणी मानके आणि आयुष TKDL) साठी तयार केला जात आहे.\n\nअधिकृत दस्तऐवज संकलनानंतर अंतिम रॅग (RAG) प्रणाली थेट मूळ सरकारी दस्तऐवजांच्या कलमांवर आधारित अचूक उत्तरे आणि पृष्ठ क्रमांकांसह संदर्भ देईल.\n\n*टीप: हे केवळ नमुना उत्तर असून कायदेशीर सल्ला नाही.*`
    : language === 'hi'
    ? `**[नमुना प्रोटोटाइप उत्तर — विकास चरण]**\n\nआपके प्रश्न ("${query}") का विश्लेषण किया गया है। यह प्रोटोटाइप बौद्धिक संपदा (पेटेंट, ट्रेडमार्क, कॉपीराइट, डिजाइन, जीआई, बीआईएस खिलौना मानक एवं आयुष टीकेडीएल) के लिए विकसित किया जा रहा है।\n\nअंतिम उत्पादन चरण में रॅग (RAG) पाइपलाइन आधिकारिक सरकारी दस्तावेजों के आधार पर सटीक धाराओं एवं पृष्ठ संदर्भों सहित उत्तर प्रदान करेगी।\n\n*नोट: यह केवल परीक्षण हेतु है और आधिकारिक कानूनी सलाह नहीं है।*`
    : `**[Sample Development Response — Prototype Phase]**\n\nYour query regarding **"${query}"** has been processed by the IP-SAKTI Sahayak prototype pipeline.\n\nThis application is currently in active development. When the production RAG knowledge base is integrated, this response will be generated dynamically from official statutes (The Patents Act 1970, Trade Marks Act 1999, Designs Act 2000, Copyright Act 1957, BIS QCOs, and AYUSH TKDL records).\n\nBelow are representative sample document citations demonstrating the frontend citation architecture:`;

  return normalizeRagResponse({
    answer: fallbackAnswer,
    language,
    sources: [
      {
        title: 'Sample Document — Development Only: National IPR Policy Framework & CGPDTM Guidelines',
        page: 10,
        section: 'Draft Framework 2.1 — Regulatory Knowledge Retrieval',
        url: 'https://ipindia.gov.in/',
        excerpt: 'Standard operating procedures for intellectual property registration, documentation verification, and public assistance.'
      },
      {
        title: 'Sample Document — Development Only: IP-SAKTI Sahayak Knowledge Schema Draft',
        page: 3,
        section: 'Section A.4 — Multilingual Query Disambiguation',
        url: '#',
        excerpt: 'Draft specifications for multi-source citation verification across 9 intellectual property categories.'
      }
    ],
    session_id: `session_mock_${Date.now()}`
  });
}
