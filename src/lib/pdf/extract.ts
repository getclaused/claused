import { extractText, getDocumentProxy, renderPageAsImage } from "unpdf";
import { createWorker, type Worker } from "tesseract.js";

const MIN_TEXT_LENGTH = 100;
// Cap OCR work so a long scanned PDF cannot exhaust the serverless time budget.
const MAX_OCR_PAGES = 5;
const OCR_SCALE = 2.0;

export class OcrFailedError extends Error {
  constructor(message = "OCR_FAILED") {
    super(message);
    this.name = "OcrFailedError";
  }
}

async function extractDirectly(buffer: ArrayBuffer): Promise<string> {
  const pdf = await getDocumentProxy(new Uint8Array(buffer));
  const { text } = await extractText(pdf, { mergePages: true });
  return Array.isArray(text) ? text.join("\n") : text;
}

async function extractWithOcr(buffer: ArrayBuffer): Promise<string> {
  const bytes = new Uint8Array(buffer);
  const pdf = await getDocumentProxy(bytes);
  const numPages = Math.min(pdf.numPages, MAX_OCR_PAGES);

  let worker: Worker | null = null;
  try {
    worker = await createWorker(["kor", "eng"]);
    const pageTexts: string[] = [];
    for (let pageNo = 1; pageNo <= numPages; pageNo++) {
      const imageBuffer = await renderPageAsImage(bytes, pageNo, {
        scale: OCR_SCALE,
      });
      const { data } = await worker.recognize(Buffer.from(imageBuffer));
      pageTexts.push(data.text);
    }
    return pageTexts.join("\n");
  } finally {
    if (worker) await worker.terminate().catch(() => undefined);
  }
}

export async function extractPdfText(buffer: ArrayBuffer): Promise<string> {
  const directText = await extractDirectly(buffer);
  if (directText.trim().length >= MIN_TEXT_LENGTH) {
    return directText;
  }

  console.log("Direct extraction yielded < 100 chars, falling back to OCR");

  let ocrText: string;
  try {
    ocrText = await extractWithOcr(buffer);
  } catch (err) {
    console.error("OCR error:", err);
    throw new OcrFailedError();
  }

  if (ocrText.trim().length < MIN_TEXT_LENGTH) {
    throw new OcrFailedError();
  }

  return ocrText;
}
