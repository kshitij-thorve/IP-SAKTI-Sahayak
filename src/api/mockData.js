/**
 * Mock Data for IP-SAKTI Sahayak Prototype Phase
 * 
 * Strict Compliance:
 * - All documents are explicitly flagged with is_sample_document: true
 * - No fake or invented URLs if source_url is null
 * - Never claims official legal advice
 */

export const MOCK_RAG_RESPONSES = [
  // 1. Marathi Patent Filing Query
  {
    triggers: ['patent application sathi konti documents lagtil', 'patent documents marathi', 'कागदपत्रे'],
    language: 'mr',
    response: {
      answer: `भारतीय पेटंट कार्यालयात नवीन पेटंट अर्ज दाखल करण्यासाठी खालील आवश्यक वैधानिक फॉर्म आणि तांत्रिक कागदपत्रांची आवश्यकता असते:\n\n1. **फॉर्म १ (Form 1):** पेटंट अनुदानासाठीचा अधिकृत अर्ज.\n2. **फॉर्म २ (Form 2):** तात्पुरती किंवा संपूर्ण तपशीलपत्रिका (Claims आणि तांत्रिक वर्णनासह).\n3. **फॉर्म ३ (Form 3):** कलम ८ अंतर्गत परदेशी अर्जांचे हमीपत्र.\n4. **फॉर्म ५ (Form 5):** संशोधकत्वाचे घोषणापत्र.\n5. **फॉर्म २६ (Form 26):** पेटंट एजंटसाठी मुखत्यारपत्र (आवश्यक असल्यास).\n6. **अभियांत्रिकी रेखाचित्रे (Drawings):** शोधाची तांत्रिक रचना स्पष्ट करण्यासाठी.\n\n*टीप: हे उत्तर केवळ विकास टप्प्यातील नमुना चाचणीसाठी आहे. अधिकृत संदर्भासाठी भारतीय पेटंट कार्यालय (ipindia.gov.in) मार्गदर्शक नियमावली तपासावी.*`,
      grounded: true,
      citations: [
        {
          citation_id: 1,
          document_id: "DEV-DOC-PAT-001",
          document_title: "Development Test Patent Guide (Provisional Draft)",
          chunk_id: "DEV-DOC-PAT-001#c010",
          page_number: 10,
          section: "Section 7 — Statutory Filing Documents",
          source_url: null, // As required: do NOT invent a URL when null
          relevance_score: 0.94,
          snippet: "An application for a patent for an invention may be made by any of the persons specified in section 6 using Form 1 along with Form 2 specification.",
          is_sample_document: true
        },
        {
          citation_id: 2,
          document_id: "DEV-DOC-PAT-002",
          document_title: "Development Test MPOPP Procedural Checklist",
          chunk_id: "DEV-DOC-PAT-002#c024",
          page_number: 24,
          section: "Chapter 03.02 — Filing of Patent Application Documents",
          source_url: "https://ipindia.gov.in/patents.htm",
          relevance_score: 0.88,
          snippet: "Every specification, whether provisional or complete, shall be made in Form 2. Drawings should be submitted on prescribed A4 durable paper sheets.",
          is_sample_document: true
        }
      ],
      model_info: {
        engine: "IP-SAKTI Prototype Engine",
        pipeline: "Mock RAG Pipeline (Development Mode)",
        retrieval_mode: "Dense + Sparse Hybrid (Simulated)"
      }
    }
  },

  // 2. English Patent Requirements
  {
    triggers: ['patent application', 'patent requirements', 'patent checklist', 'forms required to file a patent'],
    language: 'en',
    response: {
      answer: `Under standard Indian Patent Office procedure, filing a patent application requires the following statutory documentation:\n\n### 1. Mandatory Statutory Forms\n- **Form 1 (Application for Grant of Patent):** Contains applicant details, inventor declarations, and convention priority claims.\n- **Form 2 (Provisional or Complete Specification):** Detailed description of the invention, drawings, and legal Claims defining protection boundaries.\n- **Form 3 (Statement & Undertaking under Section 8):** Details of corresponding foreign applications filed within prescribed timelines.\n- **Form 5 (Declaration as to Inventorship):** Confirms inventive contribution of named inventors.\n\n### 2. Supporting Disclosures\n- **Drawings / Figures:** If necessary for explaining the technical mechanism.\n- **Form 26 (Power of Attorney):** Required if filed via registered Patent Agent.\n- **National Biodiversity Authority (NBA) Clearance:** Mandatory if using biological material native to India.`,
      grounded: true,
      citations: [
        {
          citation_id: 1,
          document_id: "DEV-DOC-PAT-003",
          document_title: "Development Test Patent Guide",
          chunk_id: "DEV-DOC-PAT-003#c002",
          page_number: 2,
          section: "Section 2.1 — Application Specifications",
          source_url: null,
          relevance_score: 0.91,
          snippet: "Standard filing checklist requires Form 1, Form 2 with full disclosure and claims, Form 3, and Form 5, accompanied by statutory filing fee.",
          is_sample_document: true
        },
        {
          citation_id: 2,
          document_id: "DEV-DOC-PAT-004",
          document_title: "Draft Patent Examination Manual",
          chunk_id: "DEV-DOC-PAT-004#c018",
          page_number: 18,
          section: "Section 10(4) — Specification & Scope of Claims",
          source_url: "https://ipindia.gov.in/patents.htm",
          relevance_score: 0.85,
          snippet: "Every complete specification shall fully and particularly describe the invention and its operation, concluding with a claim or claims defining the scope.",
          is_sample_document: true
        }
      ],
      model_info: {
        engine: "IP-SAKTI Prototype Engine",
        pipeline: "Mock RAG Pipeline (Development Mode)"
      }
    }
  },

  // 3. Trademarks Nice Classification
  {
    triggers: ['trademark', 'nice classification', 'tm-a', 'brand', 'class 9', 'class 42'],
    language: 'en',
    response: {
      answer: `When registering a trademark in India using **Form TM-A**, goods and services are classified under the international **Nice Classification (Classes 1 to 45)**:\n\n### Classification for Tech / Software Platforms:\n- **Class 9 (Goods):** Covers downloadable software, mobile apps, recorded data, and digital apparatus.\n- **Class 42 (Services):** Covers Software-as-a-Service (SaaS), cloud hosting, IT infrastructure, and software development services.\n\n### Single vs Multi-Class Filing:\n- Under **Rule 23 of Trade Marks Rules, 2017**, an applicant may file a multi-class application covering multiple classes simultaneously.\n- Fees are assessed per class (discounted 50% for Startups and MSMEs).`,
      grounded: true,
      citations: [
        {
          citation_id: 1,
          document_id: "DEV-DOC-TM-001",
          document_title: "Development Test Trademark Classification Draft",
          chunk_id: "DEV-DOC-TM-001#c014",
          page_number: 14,
          section: "Rule 23 — Nice Classification 11th Edition",
          source_url: "https://ipindia.gov.in/trade-marks.htm",
          relevance_score: 0.89,
          snippet: "Goods and services are classified for registration of trade marks according to the current edition of the Nice Classification.",
          is_sample_document: true
        }
      ],
      model_info: {
        engine: "IP-SAKTI Prototype Engine",
        pipeline: "Mock RAG Pipeline (Development Mode)"
      }
    }
  },

  // 4. BIS Toy Safety Standards
  {
    triggers: ['toy', 'bis', 'is 9873', 'toys', 'safety standards', 'qco'],
    language: 'en',
    response: {
      answer: `Under the **Toys (Quality Control) Order (QCO)** issued by DPIIT, all toys for children under 14 years must comply with mandatory Bureau of Indian Standards (BIS) certification (ISI mark under Scheme-I):\n\n### Mandatory Standards Checklist:\n1. **IS 9873 (Part 1):** Mechanical and physical safety (drop test, small parts choking hazard, sharp edge tests).\n2. **IS 9873 (Part 2):** Flammability testing for plush, fabric, and stuffed toys.\n3. **IS 9873 (Part 3):** Chemical safety — migration limits for toxic heavy metals (lead, cadmium, mercury, arsenic).\n4. **IS 15644:** Electric safety for battery-operated and plug-in electronic toys.\n\n*Regulatory note: Manufacture, import, distribution, or retail sale of toys without the standard BIS ISI mark is prohibited in India.*`,
      grounded: true,
      citations: [
        {
          citation_id: 1,
          document_id: "DEV-DOC-BIS-001",
          document_title: "Development Test BIS Toy Safety Manual",
          chunk_id: "DEV-DOC-BIS-001#c004",
          page_number: 4,
          section: "Clause 3 — Mandatory ISI Mark Scheme",
          source_url: "https://www.bis.gov.in/",
          relevance_score: 0.95,
          snippet: "Articles specified in column (1) shall conform to corresponding Indian Standards IS 9873 and IS 15644 under licence from BIS.",
          is_sample_document: true
        }
      ],
      model_info: {
        engine: "IP-SAKTI Prototype Engine",
        pipeline: "Mock RAG Pipeline (Development Mode)"
      }
    }
  },

  // 5. Ayush & TKDL
  {
    triggers: ['ayush', 'tkdl', 'आयुष', 'बायो-पायरेसी', 'आयुर्वेद', 'पारंपरिक ज्ञान'],
    language: 'hi',
    response: {
      answer: `पारंपरिक ज्ञान डिजिटल लाइब्रेरी (**TKDL**) भारत सरकार (CSIR एवं आयुष मंत्रालय) की एक विश्व-अग्रणी पहल है, जो भारतीय पारंपरिक ज्ञान को अनुचित विदेशी पेटेंट (बायो-पायरेसी) से सुरक्षित करती है:\n\n### 1. TKDL की मुख्य कार्यप्रणाली:\n- **प्राचीन संहिताओं का डिजिटलीकरण:** आयुर्वेद, यूनानी, सिद्ध और योग के प्राचीन ग्रंथों के नुस्खों को 5 अंतरराष्ट्रीय भाषाओं में पेटेंट वर्गीकरण (IPC) के अनुसार संकलित किया गया है।\n- **विदेशी पेटेंट कार्यालयों के साथ समझौता:** TKDL का उपयोग EPO, USPTO, JPO आदि द्वारा पूर्व कला (Prior Art) परीक्षण के लिए किया जाता है।\n\n### 2. राष्ट्रीय जैव विविधता प्राधिकरण (NBA) अनापत्ति:\n- **जैव विविधता अधिनियम, 2002 (धारा 6):** किसी भी भारतीय जैविक संसाधन या पारंपरिक ज्ञान पर पेटेंट आवेदन करने से पूर्व NBA की पूर्व अनुमति लेना कानूनी रूप से अनिवार्य है।`,
      grounded: true,
      citations: [
        {
          citation_id: 1,
          document_id: "DEV-DOC-AYU-001",
          document_title: "Development Test TKDL Guidelines Draft",
          chunk_id: "DEV-DOC-AYU-001#c015",
          page_number: 15,
          section: "अनुभाग २ — TKDL Prior Art Protection",
          source_url: null,
          relevance_score: 0.92,
          snippet: "TKDL prevents bio-piracy by providing non-exclusive access to International Patent Offices for search and examination prior art purposes.",
          is_sample_document: true
        }
      ],
      model_info: {
        engine: "IP-SAKTI Prototype Engine",
        pipeline: "Mock RAG Pipeline (Development Mode)"
      }
    }
  }
];

/**
 * Fallback generator for queries that do not match exact mock triggers.
 * Respects grounding and sample document flags.
 */
export function generatePrototypeFallbackResponse(query, language = 'en', forceUngrounded = false) {
  if (forceUngrounded) {
    return {
      answer: `The query "${query}" was evaluated against the prototype knowledge base index. While the legal query is understood, no specific statutory sections or gazette citations passed the 0.85 semantic retrieval confidence threshold.\n\nIn the production system, this query will trigger an extended secondary retrieval sweep or escalate to human IP paralegal review.`,
      grounded: false, // Triggers "Insufficient source context" state in UI!
      citations: [],
      model_info: {
        engine: "IP-SAKTI Prototype Engine",
        pipeline: "Mock RAG Pipeline (Development Mode)",
        status: "insufficient_context"
      }
    };
  }

  const answer = language === 'mr'
    ? `**[विकास टप्प्यातील नमुना उत्तर]**\n\nआपल्या प्रश्नाचे ("${query}") विश्लेषण करण्यात आले आहे. हा प्रोटोटाइप विकास टप्प्यात असून बौद्धिक संपदा (पेटंट, ट्रेडमार्क, कॉपीराइट, डिझाईन, जीआय, बीआयएस खेळणी मानके आणि आयुष TKDL) साठी तयार केला जात आहे.\n\nअधिकृत दस्तऐवज संकलनानंतर अंतिम रॅग (RAG) प्रणाली थेट मूळ सरकारी दस्तऐवजांच्या कलमांवर आधारित अचूक उत्तरे आणि पृष्ठ क्रमांकांसह संदर्भ देईल.\n\n*टीप: हे केवळ नमुना उत्तर असून कायदेशीर सल्ला नाही.*`
    : language === 'hi'
    ? `**[विकास चरण का नमूना उत्तर]**\n\nआपके प्रश्न ("${query}") का विश्लेषण किया गया है। यह प्रोटोटाइप बौद्धिक संपदा (पेटेंट, ट्रेडमार्क, कॉपीराइट, डिजाइन, जीआई, बीआईएस खिलौना मानक एवं आयुष टीकेडीएल) के लिए विकसित किया जा रहा है।\n\nअंतिम उत्पादन चरण में रॅग (RAG) पाइपलाइन आधिकारिक सरकारी दस्तावेजों के आधार पर सटीक धाराओं एवं पृष्ठ संदर्भों सहित उत्तर प्रदान करेगी।\n\n*नोट: यह केवल परीक्षण हेतु है और आधिकारिक कानूनी सलाह नहीं है।*`
    : `This is a development sample response for testing the IP-SAKTI Sahayak interface. It is not official legal or regulatory guidance.\n\nYour question regarding "${query}" has been processed through the frontend citation rendering pipeline. Once the official regulatory knowledge base is integrated by the research team, this answer will be synthesized directly from indexed statutes (The Patents Act 1970, Trade Marks Act 1999, BIS QCOs, TKDL).`;

  return {
    answer,
    grounded: true,
    citations: [
      {
        citation_id: 1,
        document_id: "DEV-DOC-SAMPLE-001",
        document_title: "Development Test Patent Guide",
        chunk_id: "DEV-DOC-SAMPLE-001#c001",
        page_number: 2,
        section: "Test Section — Regulatory Overview",
        source_url: null, // Null to test source_url null handling!
        relevance_score: 0.82,
        snippet: "This is a prototype sample excerpt used to test the evidence and citation presentation layer in IP-SAKTI Sahayak.",
        is_sample_document: true
      }
    ],
    model_info: {
      engine: "IP-SAKTI Prototype Engine",
      pipeline: "Mock RAG Pipeline (Development Mode)"
    }
  };
}
