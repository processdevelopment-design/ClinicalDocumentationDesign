import jsPDF from "jspdf";

// Brand Colors
export const COLORS = {
  AZURE: { r: 62, g: 69, b: 75 }, // #3e454b - Headers
  COPPER: { r: 184, g: 126, b: 102 }, // #b87e66 - Logo backgrounds
  ORANGE: { r: 179, g: 111, b: 73 }, // #b36f49 - Section headers & buttons
  WHITE: { r: 255, g: 255, b: 255 },
  LIGHT_GRAY: { r: 220, g: 220, b: 220 },
  GRAY: { r: 200, g: 200, b: 200 },
  DARK_GRAY: { r: 100, g: 100, b: 100 },
  BLACK: { r: 0, g: 0, b: 0 },
};

// Common Constants
export const PDF_CONFIG = {
  MARGIN: 15,
  LINE_HEIGHT: 5,
  PAGE_WIDTH: 210,
  HEADER_HEIGHT: 35,
  LOGO_URL: "https://i.imgur.com/N2iG3Ic.png",
  LOGO_HEIGHT: 20,
  LOGO_WIDTH: (619 / 536) * 20,
};

/**
 * Generate a formatted note code: FormTypeAbbr-Last5DigitsPatientCode-YYYYMMDD
 */
export function generateNoteCode(
  formType: string,
  patientId: string,
  date?: string,
): string {
  // Map form types to abbreviations
  const formTypeMap: { [key: string]: string } = {
    "Discharge Summary": "DS",
    "Initial Evaluation": "IE",
    "PT Notes": "PTN",
  };
  
  const formTypeAbbr = formTypeMap[formType] || formType;
  
  // Extract last 5 digits from patient ID
  const last5Digits = patientId.slice(-5);
  
  // Format date as YYYYMMDD
  const timestamp = date ? new Date(date) : new Date();
  const year = timestamp.getFullYear();
  const month = String(timestamp.getMonth() + 1).padStart(2, "0");
  const day = String(timestamp.getDate()).padStart(2, "0");
  
  return `${formTypeAbbr}-${last5Digits}-${year}${month}${day}`;
}

/**
 * Helper to add footer to current page
 */
export function addFooter(doc: jsPDF, pageHeight: number): void {
  const footerY = pageHeight - 10;
  const currentYear = new Date().getFullYear();

  doc.setFontSize(7);
  doc.setTextColor(COLORS.DARK_GRAY.r, COLORS.DARK_GRAY.g, COLORS.DARK_GRAY.b);
  doc.setFont(undefined, "normal");

  const footerText = `File the completed copy on the patient's PMIS Profile. This is a confidential medical record protected under RA 8293; © ${currentYear} Physixare Adtek Solutions, Inc.`;
  const footerLines = doc.splitTextToSize(footerText, 180);

  let footerYPos = footerY - footerLines.length * 2.5;
  footerLines.forEach((line: string) => {
    doc.text(line, 105, footerYPos, { align: "center" });
    footerYPos += 2.5;
  });

  doc.setTextColor(COLORS.BLACK.r, COLORS.BLACK.g, COLORS.BLACK.b);
}

/**
 * Helper to check if we need a new page and add one if necessary
 */
export function createCheckPageBreak(
  doc: jsPDF,
  pageHeight: number,
  yPositionRef: { value: number },
  margin: number = PDF_CONFIG.MARGIN,
) {
  return (requiredSpace: number = 15): boolean => {
    const footerSpace = 15;
    if (yPositionRef.value + requiredSpace > pageHeight - margin - footerSpace) {
      addFooter(doc, pageHeight);
      doc.addPage();
      yPositionRef.value = margin;
      return true;
    }
    return false;
  };
}

/**
 * Helper to add text with word wrap
 */
export function createAddWrappedText(
  doc: jsPDF,
  yPositionRef: { value: number },
  checkPageBreak: (requiredSpace?: number) => boolean,
  margin: number = PDF_CONFIG.MARGIN,
  lineHeight: number = PDF_CONFIG.LINE_HEIGHT,
) {
  return (text: string, maxWidth: number): void => {
    const lines = doc.splitTextToSize(text, maxWidth);
    lines.forEach((line: string) => {
      checkPageBreak();
      doc.text(line, margin, yPositionRef.value);
      yPositionRef.value += lineHeight;
    });
  };
}

/**
 * Render the standard PDF header with logo and title
 */
export function renderPDFHeader(
  doc: jsPDF,
  title: string,
  formType: string,
  patientId: string,
  date: string,
): void {
  // Header background
  doc.setFillColor(COLORS.AZURE.r, COLORS.AZURE.g, COLORS.AZURE.b);
  doc.rect(0, 0, PDF_CONFIG.PAGE_WIDTH, PDF_CONFIG.HEADER_HEIGHT, "F");

  // Logo
  try {
    doc.addImage(
      PDF_CONFIG.LOGO_URL,
      "PNG",
      PDF_CONFIG.MARGIN,
      5,
      PDF_CONFIG.LOGO_WIDTH,
      PDF_CONFIG.LOGO_HEIGHT,
    );
  } catch (error) {
    console.error("Failed to load logo:", error);
  }

  // Title
  const centerX = PDF_CONFIG.PAGE_WIDTH / 2;
  doc.setTextColor(COLORS.WHITE.r, COLORS.WHITE.g, COLORS.WHITE.b);
  doc.setFontSize(12);
  doc.setFont(undefined, "normal");
  doc.text("Physiaré Physical Therapy", centerX, 15, { align: "center" });

  doc.setFontSize(16);
  doc.setFont(undefined, "bold");
  doc.text(title, centerX, 23, { align: "center" });

  // Note Code and Date
  const bottomY = 30;
  doc.setFontSize(9);
  doc.setFont(undefined, "normal");
  doc.setTextColor(COLORS.LIGHT_GRAY.r, COLORS.LIGHT_GRAY.g, COLORS.LIGHT_GRAY.b);
  
  const noteCode = generateNoteCode(formType, patientId, date);
  doc.text(`Note Code: ${noteCode}`, PDF_CONFIG.MARGIN, bottomY);
  
  doc.text(
    `Date: ${date || new Date().toLocaleDateString("en-US", { year: "numeric", month: "long", day: "numeric" })}`,
    PDF_CONFIG.PAGE_WIDTH - PDF_CONFIG.MARGIN,
    bottomY,
    { align: "right" },
  );

  doc.setTextColor(COLORS.BLACK.r, COLORS.BLACK.g, COLORS.BLACK.b);
}

/**
 * Render a section header bar
 */
export function renderSectionHeader(
  doc: jsPDF,
  title: string,
  yPosition: number,
  color: "AZURE" | "ORANGE" = "ORANGE",
  margin: number = PDF_CONFIG.MARGIN,
): void {
  const colorValue = color === "AZURE" ? COLORS.AZURE : COLORS.ORANGE;
  doc.setFillColor(colorValue.r, colorValue.g, colorValue.b);
  doc.rect(margin, yPosition, 180, 8, "F");
  doc.setTextColor(COLORS.WHITE.r, COLORS.WHITE.g, COLORS.WHITE.b);
  doc.setFontSize(12);
  doc.setFont(undefined, "bold");
  doc.text(title, margin + 2, yPosition + 6);
  doc.setTextColor(COLORS.BLACK.r, COLORS.BLACK.g, COLORS.BLACK.b);
  doc.setFontSize(10);
}

/**
 * Render the signature box ("Prepared by" section)
 */
export function renderSignatureBox(
  doc: jsPDF,
  yPosition: number,
  data: {
    signature?: string;
    therapistName: string;
    therapistLicense: string;
    therapistPosition: string;
    dateSubmitted: string;
  },
): number {
  const BOX_X = 100;
  const BOX_W = 95;
  const BOX_H = 42; // Increased to accommodate position field

  doc.setFontSize(9);
  doc.setDrawColor(COLORS.GRAY.r, COLORS.GRAY.g, COLORS.GRAY.b);
  doc.setFillColor(COLORS.WHITE.r, COLORS.WHITE.g, COLORS.WHITE.b);
  doc.roundedRect(BOX_X, yPosition, BOX_W, BOX_H, 2, 2, "FD");

  let cursorY = yPosition + 6;

  // "Prepared by" label
  doc.setFont(undefined, "bold");
  doc.text("Prepared by", BOX_X + 4, cursorY);
  cursorY += 5;

  // Signature image or line
  if (data.signature && data.signature.startsWith("data:image")) {
    try {
      doc.addImage(data.signature, "PNG", BOX_X + 4, cursorY, 40, 12);
    } catch {
      doc.line(BOX_X + 4, cursorY + 10, BOX_X + 44, cursorY + 10);
    }
  } else {
    doc.line(BOX_X + 4, cursorY + 10, BOX_X + 44, cursorY + 10);
  }
  cursorY += 16;

  // Therapist name
  doc.setFont(undefined, "bold");
  doc.text(data.therapistName || "N/A", BOX_X + 4, cursorY);
  cursorY += 5;

  // License number
  doc.setFont(undefined, "normal");
  doc.text(`License No. ${data.therapistLicense || "N/A"}`, BOX_X + 4, cursorY);
  cursorY += 4;

  // Position
  doc.text(`Position: ${data.therapistPosition || "N/A"}`, BOX_X + 4, cursorY);
  cursorY += 4;

  // Date submitted
  doc.text(`Date Submitted: ${data.dateSubmitted || new Date().toLocaleDateString()}`, BOX_X + 4, cursorY);

  return BOX_H + 6;
}

/**
 * Render patient information section
 */
export function renderPatientInfo(
  doc: jsPDF,
  yPositionRef: { value: number },
  patientData: {
    patientName: string;
    patientId: string;
    dateOfBirth: string;
    sex: string;
    [key: string]: string | number;
  },
  additionalFields?: Array<{ label: string; value: string | number; position?: "left" | "right" }>,
  margin: number = PDF_CONFIG.MARGIN,
  lineHeight: number = PDF_CONFIG.LINE_HEIGHT,
): void {
  renderSectionHeader(doc, "PATIENT INFORMATION", yPositionRef.value, "ORANGE", margin);
  yPositionRef.value += 12;

  doc.setFontSize(10);

  // Standard fields - Row 1
  doc.text(`Patient Name: ${patientData.patientName}`, margin, yPositionRef.value);
  doc.text(`Patient ID: ${patientData.patientId}`, 120, yPositionRef.value);
  yPositionRef.value += lineHeight;

  // Standard fields - Row 2
  doc.text(`Date of Birth: ${patientData.dateOfBirth}`, margin, yPositionRef.value);
  doc.text(`Sex: ${patientData.sex}`, 120, yPositionRef.value);
  yPositionRef.value += lineHeight;

  // Additional fields
  if (additionalFields && additionalFields.length > 0) {
    let leftField: { label: string; value: string | number } | null = null;
    let rightField: { label: string; value: string | number } | null = null;

    additionalFields.forEach((field) => {
      if (field.position === "right") {
        rightField = field;
      } else {
        if (leftField) {
          // Render the previous pair
          doc.text(`${leftField.label}: ${leftField.value}`, margin, yPositionRef.value);
          if (rightField) {
            doc.text(`${rightField.label}: ${rightField.value}`, 120, yPositionRef.value);
            rightField = null;
          }
          yPositionRef.value += lineHeight;
        }
        leftField = field;
      }
    });

    // Render any remaining fields
    if (leftField) {
      doc.text(`${leftField.label}: ${leftField.value}`, margin, yPositionRef.value);
      if (rightField) {
        doc.text(`${rightField.label}: ${rightField.value}`, 120, yPositionRef.value);
      }
      yPositionRef.value += lineHeight;
    }
  }

  yPositionRef.value += 2;
}