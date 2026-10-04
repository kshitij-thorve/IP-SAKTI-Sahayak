/**
 * Documents API Service Abstraction
 * 
 * Prototype Phase:
 * Documents and verified regulatory corpus are actively being collected.
 * Final production document ingestion is NOT implemented here.
 */

export const INGESTION_NOTICE = "Document ingestion will be enabled after the verified official corpus and backend ingestion workflow are ready.";

export async function fetchDocumentCatalog() {
  return [
    {
      id: "DEV-DOC-PAT-001",
      title: "Draft Indian Patent Act 1970 & Rules 2003",
      category: "Patents",
      status: "In Research Collection",
      pagesIndexed: 142,
      isSample: true
    },
    {
      id: "DEV-DOC-TM-001",
      title: "Draft Trade Marks Rules 2017 & Nice Classification",
      category: "Trademarks",
      status: "In Research Collection",
      pagesIndexed: 98,
      isSample: true
    },
    {
      id: "DEV-DOC-BIS-001",
      title: "DPIIT Toys (Quality Control) Order & IS 9873",
      category: "BIS / Toys",
      status: "In Research Collection",
      pagesIndexed: 45,
      isSample: true
    },
    {
      id: "DEV-DOC-AYU-001",
      title: "Traditional Knowledge Digital Library (TKDL) Framework",
      category: "Ayush",
      status: "In Research Collection",
      pagesIndexed: 78,
      isSample: true
    }
  ];
}
