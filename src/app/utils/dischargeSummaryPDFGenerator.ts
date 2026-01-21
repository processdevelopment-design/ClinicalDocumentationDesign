import jsPDF from "jspdf";
import { DischargeSummaryData } from "@/app/components/DischargeSummaryForm";
import {
  addFooter,
  createCheckPageBreak,
  createAddWrappedText,
  renderPDFHeader,
  renderSectionHeader,
  renderSignatureBox,
  renderPatientInfo,
  PDF_CONFIG,
  COLORS,
} from "@/app/utils/pdfHelpers";

export function generateDischargeSummaryPDF(
  summaryData: DischargeSummaryData,
): jsPDF {
  const doc = new jsPDF();
  const pageHeight = doc.internal.pageSize.height;
  const yPositionRef = { value: 45 };
  const lineHeight = PDF_CONFIG.LINE_HEIGHT;
  const margin = PDF_CONFIG.MARGIN;

  // Create helper functions
  const checkPageBreak = createCheckPageBreak(doc, pageHeight, yPositionRef, margin);
  const addWrappedText = createAddWrappedText(doc, yPositionRef, checkPageBreak, margin, lineHeight);

  // Render header
  renderPDFHeader(doc, "PROGRESS REPORT", "Discharge Summary", summaryData.patientId, summaryData.summaryDate);

  doc.setTextColor(COLORS.BLACK.r, COLORS.BLACK.g, COLORS.BLACK.b);

  // GREETING SECTION
  doc.setFontSize(10);
  doc.setFont(undefined, "bold");

  const dateStr = summaryData.summaryDate
    ? new Date(summaryData.summaryDate).toLocaleDateString("en-US", {
        year: "numeric",
        month: "long",
        day: "numeric",
      })
    : new Date().toLocaleDateString("en-US", {
        year: "numeric",
        month: "long",
        day: "numeric",
      });

  doc.text(`Date: ${dateStr}`, margin, yPositionRef.value);
  yPositionRef.value += lineHeight + 2;

  const physicianName = summaryData.referringPhysician || "Referring Physician";
  doc.text(`Dear ${physicianName}`, margin, yPositionRef.value);
  yPositionRef.value += lineHeight + 10;

  // Greeting paragraphs
  doc.setFont(undefined, "normal");
  doc.text("Greetings of good health!", margin, yPositionRef.value);
  yPositionRef.value += lineHeight + 2;

  const greetingText1 =
    "Thank you for referring your patient to our clinic for physical therapy. Please see the report below to see detailed improvement and management given.";
  const greetingLines1 = doc.splitTextToSize(greetingText1, 180);
  greetingLines1.forEach((line: string) => {
    doc.text(line, margin, yPositionRef.value);
    yPositionRef.value += lineHeight;
  });
  yPositionRef.value += 2;

  const greetingText2 =
    "Rest assured that we will take care of your patients because YOUR PATIENT'S HEALTH IS OUR PRIORITY.";
  const greetingLines2 = doc.splitTextToSize(greetingText2, 180);
  greetingLines2.forEach((line: string) => {
    doc.text(line, margin, yPositionRef.value);
    yPositionRef.value += lineHeight;
  });
  yPositionRef.value += 2;

  doc.text("Thank you!", margin, yPositionRef.value);
  yPositionRef.value += lineHeight + 5;

  // PATIENT INFORMATION SECTION
  checkPageBreak(25);
  renderPatientInfo(doc, yPositionRef, summaryData, [
    { label: "Summary Date", value: summaryData.summaryDate },
    { label: "Program", value: summaryData.program || "N/A", position: "right" },
  ]);

  // PRESENTING PROBLEM LIST
  checkPageBreak(20);
  renderSectionHeader(doc, "PRESENTING PROBLEM LIST", yPositionRef.value);
  yPositionRef.value += 12;

  doc.setFontSize(10);

  doc.setFont(undefined, "bold");
  doc.text("Chief Complaint:", margin, yPositionRef.value);
  doc.setFont(undefined, "normal");
  yPositionRef.value += lineHeight;
  if (summaryData.chiefComplaint) {
    addWrappedText(summaryData.chiefComplaint, 180);
  } else {
    doc.text("N/A", margin, yPositionRef.value);
    yPositionRef.value += lineHeight;
  }
  yPositionRef.value += 2;

  checkPageBreak();
  doc.setFont(undefined, "bold");
  doc.text("Problem List:", margin, yPositionRef.value);
  doc.setFont(undefined, "normal");
  yPositionRef.value += lineHeight;
  if (summaryData.problemList) {
    addWrappedText(summaryData.problemList, 180);
  } else {
    doc.text("N/A", margin, yPositionRef.value);
    yPositionRef.value += lineHeight;
  }
  yPositionRef.value += 2;

  // GOALS ACHIEVED
  checkPageBreak(20);
  renderSectionHeader(doc, "GOALS ACHIEVED", yPositionRef.value);
  yPositionRef.value += 12;

  doc.setFontSize(10);
  doc.setFont(undefined, "normal");

  if (summaryData.goalsAchieved) {
    addWrappedText(summaryData.goalsAchieved, 180);
  } else {
    doc.text("N/A", margin, yPositionRef.value);
    yPositionRef.value += lineHeight;
  }
  yPositionRef.value += 2;

  // PT MANAGEMENT GIVEN
  checkPageBreak(20);
  renderSectionHeader(doc, "PT MANAGEMENT GIVEN", yPositionRef.value);
  yPositionRef.value += 12;

  doc.setFontSize(10);
  doc.setFont(undefined, "normal");

  if (summaryData.ptManagementGiven) {
    addWrappedText(summaryData.ptManagementGiven, 180);
  } else {
    doc.text("N/A", margin, yPositionRef.value);
    yPositionRef.value += lineHeight;
  }
  yPositionRef.value += 2;

  // RECOMMENDATION
  checkPageBreak(20);
  renderSectionHeader(doc, "RECOMMENDATION", yPositionRef.value);
  yPositionRef.value += 12;

  doc.setFontSize(10);
  doc.setFont(undefined, "normal");

  if (summaryData.recommendation) {
    addWrappedText(summaryData.recommendation, 180);
  } else {
    doc.text("N/A", margin, yPositionRef.value);
    yPositionRef.value += lineHeight;
  }
  yPositionRef.value += 2;

  // SIGNATURE BOX
  checkPageBreak(50);
  const boxHeight = renderSignatureBox(doc, yPositionRef.value, {
    signature: summaryData.signature,
    therapistName: summaryData.therapistName,
    therapistLicense: summaryData.therapistLicense,
    therapistPosition: summaryData.therapistPosition,
    dateSubmitted: summaryData.summaryDate || new Date().toLocaleDateString(),
  });
  yPositionRef.value += boxHeight;

  // Add footer to the last page
  addFooter(doc, pageHeight);

  return doc;
}