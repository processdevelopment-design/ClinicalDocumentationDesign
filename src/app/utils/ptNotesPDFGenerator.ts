import jsPDF from "jspdf";
import { PTNotesData } from "@/app/components/PTNotesForm";
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

export function generatePTNotesPDF(notesData: PTNotesData): jsPDF {
  const doc = new jsPDF();
  const pageHeight = doc.internal.pageSize.height;
  const yPositionRef = { value: 45 };
  const lineHeight = PDF_CONFIG.LINE_HEIGHT;
  const margin = PDF_CONFIG.MARGIN;

  // Create helper functions
  const checkPageBreak = createCheckPageBreak(doc, pageHeight, yPositionRef, margin);
  const addWrappedText = createAddWrappedText(doc, yPositionRef, checkPageBreak, margin, lineHeight);

  // Render header
  renderPDFHeader(doc, "PT NOTES", "PT Notes", notesData.patientId, notesData.noteDate);

  doc.setTextColor(COLORS.BLACK.r, COLORS.BLACK.g, COLORS.BLACK.b);

  // PATIENT INFORMATION
  renderPatientInfo(doc, yPositionRef, notesData, [
    { label: "Treatment Date", value: notesData.noteDate },
    { label: "Program", value: notesData.program || "N/A", position: "right" },
  ]);

  // PT NOTES DETAILS
  checkPageBreak(30);
  renderSectionHeader(doc, "PT NOTES DETAILS", yPositionRef.value);
  yPositionRef.value += 12;

  doc.setFontSize(10);

  // Chief Complaint
  doc.setFont(undefined, "bold");
  doc.text("Chief Complaint:", margin, yPositionRef.value);
  doc.setFont(undefined, "normal");
  yPositionRef.value += lineHeight;
  if (notesData.chiefComplaint) {
    addWrappedText(notesData.chiefComplaint, 180);
  } else {
    doc.text("N/A", margin, yPositionRef.value);
    yPositionRef.value += lineHeight;
  }
  yPositionRef.value += 2;

  // Patient Goal
  checkPageBreak();
  doc.setFont(undefined, "bold");
  doc.text("Patient Goal:", margin, yPositionRef.value);
  doc.setFont(undefined, "normal");
  yPositionRef.value += lineHeight;
  if (notesData.patientGoal) {
    addWrappedText(notesData.patientGoal, 180);
  } else {
    doc.text("N/A", margin, yPositionRef.value);
    yPositionRef.value += lineHeight;
  }
  yPositionRef.value += 2;

  // ASSESSMENT KEY POINTS
  checkPageBreak(25);
  renderSectionHeader(doc, "ASSESSMENT KEY POINTS", yPositionRef.value, "AZURE");
  yPositionRef.value += 12;

  doc.setFontSize(10);

  // VAS Pain Intensity
  doc.setFont(undefined, "bold");
  doc.text("VAS Pain Intensity:", margin, yPositionRef.value);
  doc.setFont(undefined, "normal");
  doc.text(`${notesData.vasPainIntensity}/10`, margin + 50, yPositionRef.value);
  yPositionRef.value += lineHeight + 2;

  // Pain Description
  checkPageBreak();
  doc.setFont(undefined, "bold");
  doc.text("Pain Description:", margin, yPositionRef.value);
  doc.setFont(undefined, "normal");
  yPositionRef.value += lineHeight;
  if (notesData.painDescription) {
    addWrappedText(notesData.painDescription, 180);
  } else {
    doc.text("N/A", margin, yPositionRef.value);
    yPositionRef.value += lineHeight;
  }
  yPositionRef.value += 2;

  // Inspection & Palpation
  checkPageBreak();
  doc.setFont(undefined, "bold");
  doc.text("Inspection & Palpation:", margin, yPositionRef.value);
  doc.setFont(undefined, "normal");
  yPositionRef.value += lineHeight;
  if (notesData.inspectionPalpation) {
    addWrappedText(notesData.inspectionPalpation, 180);
  } else {
    doc.text("N/A", margin, yPositionRef.value);
    yPositionRef.value += lineHeight;
  }
  yPositionRef.value += 2;

  // Other Findings
  checkPageBreak();
  doc.setFont(undefined, "bold");
  doc.text("Other Findings:", margin, yPositionRef.value);
  doc.setFont(undefined, "normal");
  yPositionRef.value += lineHeight;
  if (notesData.otherFindings) {
    addWrappedText(notesData.otherFindings, 180);
  } else {
    doc.text("N/A", margin, yPositionRef.value);
    yPositionRef.value += lineHeight;
  }
  yPositionRef.value += 2;

  // PLAN OF CARE
  checkPageBreak(30);
  renderSectionHeader(doc, "PLAN OF CARE", yPositionRef.value);
  yPositionRef.value += 12;

  doc.setFontSize(10);

  // MACHINE TABLE
  if (notesData.machineRows && notesData.machineRows.length > 0) {
    doc.setFont(undefined, "bold");
    doc.setFontSize(9);
    doc.text("A. Machine:", margin, yPositionRef.value);
    yPositionRef.value += lineHeight + 1;

    const colWidths = [50, 40, 30, 60];
    const startX = margin;
    const rowHeight = 8;

    // Header
    doc.setFillColor(COLORS.LIGHT_GRAY.r, COLORS.LIGHT_GRAY.g, COLORS.LIGHT_GRAY.b);
    doc.setDrawColor(COLORS.DARK_GRAY.r, COLORS.DARK_GRAY.g, COLORS.DARK_GRAY.b);
    doc.setFont(undefined, "bold");

    doc.rect(startX, yPositionRef.value, colWidths[0], 8, "FD");
    doc.rect(startX + colWidths[0], yPositionRef.value, colWidths[1], 8, "FD");
    doc.rect(startX + colWidths[0] + colWidths[1], yPositionRef.value, colWidths[2], 8, "FD");
    doc.rect(startX + colWidths[0] + colWidths[1] + colWidths[2], yPositionRef.value, colWidths[3], 8, "FD");

    doc.text("Treatment", startX + 2, yPositionRef.value + 5);
    doc.text("Area", startX + colWidths[0] + 2, yPositionRef.value + 5);
    doc.text("Duration", startX + colWidths[0] + colWidths[1] + 2, yPositionRef.value + 5);
    doc.text("Remarks", startX + colWidths[0] + colWidths[1] + colWidths[2] + 2, yPositionRef.value + 5);

    yPositionRef.value += 8;

    // Rows
    doc.setFont(undefined, "normal");
    notesData.machineRows.forEach((row) => {
      checkPageBreak(rowHeight + 2);

      doc.rect(startX, yPositionRef.value, colWidths[0], rowHeight, "D");
      doc.rect(startX + colWidths[0], yPositionRef.value, colWidths[1], rowHeight, "D");
      doc.rect(startX + colWidths[0] + colWidths[1], yPositionRef.value, colWidths[2], rowHeight, "D");
      doc.rect(startX + colWidths[0] + colWidths[1] + colWidths[2], yPositionRef.value, colWidths[3], rowHeight, "D");

      const treatmentLines = doc.splitTextToSize(row.treatment || "", colWidths[0] - 4);
      const areaLines = doc.splitTextToSize(row.area || "", colWidths[1] - 4);
      const remarksLines = doc.splitTextToSize(row.remarks || "", colWidths[3] - 4);

      doc.text(treatmentLines[0] || "", startX + 2, yPositionRef.value + 5);
      doc.text(areaLines[0] || "", startX + colWidths[0] + 2, yPositionRef.value + 5);
      doc.text(row.duration || "", startX + colWidths[0] + colWidths[1] + 2, yPositionRef.value + 5);
      doc.text(remarksLines[0] || "", startX + colWidths[0] + colWidths[1] + colWidths[2] + 2, yPositionRef.value + 5);

      yPositionRef.value += rowHeight;
    });

    yPositionRef.value += 3;

    // Patient Reaction
    if (notesData.machinePatientReaction) {
      doc.setFont(undefined, "bold");
      doc.text("Patient Reaction:", margin, yPositionRef.value);
      doc.setFont(undefined, "normal");
      yPositionRef.value += 4;
      const reactionLines = doc.splitTextToSize(notesData.machinePatientReaction, 180);
      reactionLines.forEach((line: string) => {
        checkPageBreak();
        doc.text(line, margin, yPositionRef.value);
        yPositionRef.value += 4;
      });
    }

    yPositionRef.value += 2;
  }

  // MANUAL THERAPY TABLE
  if (notesData.manualTherapyRows && notesData.manualTherapyRows.length > 0) {
    checkPageBreak(30);
    doc.setFont(undefined, "bold");
    doc.setFontSize(9);
    doc.text("B. Manual Therapy:", margin, yPositionRef.value);
    yPositionRef.value += lineHeight + 2;

    const colWidths = [50, 40, 30, 60];
    const startX = margin;
    const rowHeight = 8;

    // Header
    doc.setFillColor(COLORS.LIGHT_GRAY.r, COLORS.LIGHT_GRAY.g, COLORS.LIGHT_GRAY.b);
    doc.setDrawColor(COLORS.DARK_GRAY.r, COLORS.DARK_GRAY.g, COLORS.DARK_GRAY.b);
    doc.setFont(undefined, "bold");

    doc.rect(startX, yPositionRef.value, colWidths[0], 8, "FD");
    doc.rect(startX + colWidths[0], yPositionRef.value, colWidths[1], 8, "FD");
    doc.rect(startX + colWidths[0] + colWidths[1], yPositionRef.value, colWidths[2], 8, "FD");
    doc.rect(startX + colWidths[0] + colWidths[1] + colWidths[2], yPositionRef.value, colWidths[3], 8, "FD");

    doc.text("Treatment", startX + 2, yPositionRef.value + 5);
    doc.text("Area", startX + colWidths[0] + 2, yPositionRef.value + 5);
    doc.text("Duration", startX + colWidths[0] + colWidths[1] + 2, yPositionRef.value + 5);
    doc.text("Remarks", startX + colWidths[0] + colWidths[1] + colWidths[2] + 2, yPositionRef.value + 5);

    yPositionRef.value += 8;

    // Rows
    doc.setFont(undefined, "normal");
    notesData.manualTherapyRows.forEach((row) => {
      checkPageBreak(rowHeight + 2);

      doc.rect(startX, yPositionRef.value, colWidths[0], rowHeight, "D");
      doc.rect(startX + colWidths[0], yPositionRef.value, colWidths[1], rowHeight, "D");
      doc.rect(startX + colWidths[0] + colWidths[1], yPositionRef.value, colWidths[2], rowHeight, "D");
      doc.rect(startX + colWidths[0] + colWidths[1] + colWidths[2], yPositionRef.value, colWidths[3], rowHeight, "D");

      const treatmentLines = doc.splitTextToSize(row.treatment || "", colWidths[0] - 4);
      const areaLines = doc.splitTextToSize(row.area || "", colWidths[1] - 4);
      const remarksLines = doc.splitTextToSize(row.remarks || "", colWidths[3] - 4);

      doc.text(treatmentLines[0] || "", startX + 2, yPositionRef.value + 5);
      doc.text(areaLines[0] || "", startX + colWidths[0] + 2, yPositionRef.value + 5);
      doc.text(row.duration || "", startX + colWidths[0] + colWidths[1] + 2, yPositionRef.value + 5);
      doc.text(remarksLines[0] || "", startX + colWidths[0] + colWidths[1] + colWidths[2] + 2, yPositionRef.value + 5);

      yPositionRef.value += rowHeight;
    });

    yPositionRef.value += 3;

    // Patient Reaction
    if (notesData.manualTherapyPatientReaction) {
      doc.setFont(undefined, "bold");
      doc.text("Patient Reaction:", margin, yPositionRef.value);
      doc.setFont(undefined, "normal");
      yPositionRef.value += 4;
      const reactionLines = doc.splitTextToSize(notesData.manualTherapyPatientReaction, 180);
      reactionLines.forEach((line: string) => {
        checkPageBreak();
        doc.text(line, margin, yPositionRef.value);
        yPositionRef.value += 4;
      });
    }

    yPositionRef.value += 2;
  }

  // EXERCISE TABLE
  if (notesData.exerciseRows && notesData.exerciseRows.length > 0) {
    checkPageBreak(30);
    doc.setFont(undefined, "bold");
    doc.setFontSize(9);
    doc.text("C. Exercises:", margin, yPositionRef.value);
    yPositionRef.value += lineHeight + 2;

    const colWidths = [60, 60, 60];
    const startX = margin;
    const rowHeight = 8;

    // Header
    doc.setFillColor(COLORS.LIGHT_GRAY.r, COLORS.LIGHT_GRAY.g, COLORS.LIGHT_GRAY.b);
    doc.setDrawColor(COLORS.DARK_GRAY.r, COLORS.DARK_GRAY.g, COLORS.DARK_GRAY.b);
    doc.setFont(undefined, "bold");

    doc.rect(startX, yPositionRef.value, colWidths[0], 8, "FD");
    doc.rect(startX + colWidths[0], yPositionRef.value, colWidths[1], 8, "FD");
    doc.rect(startX + colWidths[0] + colWidths[1], yPositionRef.value, colWidths[2], 8, "FD");

    doc.text("Exercise", startX + 2, yPositionRef.value + 5);
    doc.text("Parameters", startX + colWidths[0] + 2, yPositionRef.value + 5);
    doc.text("Remarks", startX + colWidths[0] + colWidths[1] + 2, yPositionRef.value + 5);

    yPositionRef.value += 8;

    // Rows
    doc.setFont(undefined, "normal");
    notesData.exerciseRows.forEach((row) => {
      checkPageBreak(rowHeight + 2);

      doc.rect(startX, yPositionRef.value, colWidths[0], rowHeight, "D");
      doc.rect(startX + colWidths[0], yPositionRef.value, colWidths[1], rowHeight, "D");
      doc.rect(startX + colWidths[0] + colWidths[1], yPositionRef.value, colWidths[2], rowHeight, "D");

      const exerciseLines = doc.splitTextToSize(row.exercise || "", colWidths[0] - 4);
      const parametersLines = doc.splitTextToSize(row.parameters || "", colWidths[1] - 4);
      const remarksLines = doc.splitTextToSize(row.remarks || "", colWidths[2] - 4);

      doc.text(exerciseLines[0] || "", startX + 2, yPositionRef.value + 5);
      doc.text(parametersLines[0] || "", startX + colWidths[0] + 2, yPositionRef.value + 5);
      doc.text(remarksLines[0] || "", startX + colWidths[0] + colWidths[1] + 2, yPositionRef.value + 5);

      yPositionRef.value += rowHeight;
    });

    yPositionRef.value += 3;

    // Patient Reaction
    if (notesData.exercisePatientReaction) {
      doc.setFont(undefined, "bold");
      doc.text("Patient Reaction:", margin, yPositionRef.value);
      doc.setFont(undefined, "normal");
      yPositionRef.value += 4;
      const reactionLines = doc.splitTextToSize(notesData.exercisePatientReaction, 180);
      reactionLines.forEach((line: string) => {
        checkPageBreak();
        doc.text(line, margin, yPositionRef.value);
        yPositionRef.value += 4;
      });
    }

    yPositionRef.value += 2;
  }

  // SIGNATURE BOX
  checkPageBreak(50);
  const boxHeight = renderSignatureBox(doc, yPositionRef.value, {
    signature: notesData.signature,
    therapistName: notesData.therapistName,
    therapistLicense: notesData.therapistLicense,
    therapistPosition: notesData.therapistPosition,
    dateSubmitted: notesData.noteDate || new Date().toLocaleDateString(),
  });
  yPositionRef.value += boxHeight;

  // Add footer to the last page
  addFooter(doc, pageHeight);

  return doc;
}