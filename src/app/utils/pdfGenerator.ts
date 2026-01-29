import jsPDF from "jspdf";
import { PTNotesData } from "@/app/components/PTNotesForm";

export interface FormData {
  // Patient Information
  patientName: string;
  patientId: string;
  dateOfBirth: string;
  sex: string;
  referringPhysician: string;
  prescribedSessions: number;
  diagnoses: string[];
  categoricalDiagnosis: string;
  caseType: string;
  bodyAreas: string[];
  selectedBodyAreas: string[];

  // Subjective Assessment
  chiefComplaint: string;
  onsetDate: string;
  mechanism: string;
  priorTreatment: string;
  currentSymptoms: string;
  goals: string;

  // Objective Assessment
  painLevel: number;
  painLocation: string;
  painAggravatingFactors: string;
  painAlleviatingFactors: string;
  radiatingPain: string;
  sleepingPosition: string;
  inspection: string;
  palpation: string;
  swelling: string;
  rangeOfMotion: Array<{
    joint: string;
    arom: string;
    prom: string;
    limitation: string;
  }>;
  muscleStrength: Array<{
    muscle: string;
    left: string;
    right: string;
    notes: string;
  }>;
  specialTests: Array<{
    test: string;
    result: string;
    description: string;
  }>;
  posture: Array<{
    area: string;
    finding: string;
    significance: string;
  }>;
  gait: string;
  neurological: string;
  functional: string;

  // Toggle visibility for sections
  showRangeOfMotion: boolean;
  showMMT: boolean;
  showSpecialTests: boolean;
  showSwelling: boolean;
  showGait: boolean;
  showNeurological: boolean;
  showFunctional: boolean;

  // PT Impression
  impression: string;

  // Plan of Care
  shortTermGoals: Array<{ goal: string; timeframe: string }>;
  longTermGoals: Array<{ goal: string; timeframe: string }>;
  interventions: string[];
  planRows: Array<{
    objective: string;
    treatment: string;
    rationale: string;
  }>;
  frequency: string;
  duration: string;

  // Therapist Information
  therapistName: string;
  therapistLicense: string;
  therapistPosition: string;
  evaluationDate: string;
  signature: string;
  branch: string;
}

export function generateComprehensivePDF(
  formData: FormData,
): jsPDF {
  const doc = new jsPDF();
  let yPosition = 15;
  const pageHeight = doc.internal.pageSize.height;
  const margin = 15;
  const lineHeight = 5;
  const currentYear = new Date().getFullYear();

  // Helper function to add footer to current page
  const addFooter = () => {
    const footerY = pageHeight - 10;
    doc.setFontSize(7);
    doc.setTextColor(100, 100, 100);
    doc.setFont(undefined, "normal");
    
    const footerText = `File the completed copy on the patient's PMIS Profile. This is a confidential medical record protected under RA 8293; © ${currentYear} Physixare Adtek Solutions, Inc.`;
    const footerLines = doc.splitTextToSize(footerText, 180);
    
    let footerYPos = footerY - (footerLines.length * 2.5);
    footerLines.forEach((line: string) => {
      doc.text(line, 105, footerYPos, { align: "center" });
      footerYPos += 2.5;
    });
    
    doc.setTextColor(0, 0, 0);
  };

  // Helper function to check if we need a new page
  const checkPageBreak = (requiredSpace: number = 20) => {
    // Footer needs only 10mm (1cm) space at bottom
    const footerSpace = 10;
    if (yPosition + requiredSpace > pageHeight - margin - footerSpace) {
      addFooter(); // Add footer before creating new page
      doc.addPage();
      yPosition = margin;
      return true;
    }
    return false;
  };

  // Helper function to add text with word wrap
  const addWrappedText = (text: string, maxWidth: number) => {
    const lines = doc.splitTextToSize(text, maxWidth);
    lines.forEach((line: string) => {
      checkPageBreak();
      doc.text(line, margin, yPosition);
      yPosition += lineHeight;
    });
  };
  
  // Helper function to add text with word wrap without breaking across pages
  const addWrappedTextNoBreak = (text: string, maxWidth: number) => {
    const lines = doc.splitTextToSize(text, maxWidth);
    const totalHeight = lines.length * lineHeight;
    
    // Check if we need to move the entire block to next page
    checkPageBreak(totalHeight + 5);
    
    // Now add all lines without individual page breaks
    lines.forEach((line: string) => {
      doc.text(line, margin, yPosition);
      yPosition += lineHeight;
    });
  };

  // Header with logo and title
  doc.setFillColor(62, 69, 75); // #3e454b
  doc.rect(0, 0, 210, 35, "F");

  // LEFT SECTION: Logo and Note Code
  const logoUrl = "https://i.imgur.com/N2iG3Ic.png";

  try {
    const LOGO_HEIGHT = 20; // mm
    const LOGO_WIDTH = (619 / 536) * LOGO_HEIGHT; //  23.1 mm

    doc.addImage(
      logoUrl,
      "PNG",
      margin,
      5,
      LOGO_WIDTH,
      LOGO_HEIGHT,
    );
  } catch (error) {
    console.error("Failed to load logo:", error);
  }

  // CENTER SECTION: Two-line title
  const centerX = 105; // Center of page (210mm / 2)

  doc.setTextColor(255, 255, 255);
  doc.setFontSize(12);
  doc.setFont(undefined, "normal");
  doc.text("Physiaré Physical Therapy", centerX, 15, {
    align: "center",
  });

  doc.setFontSize(16);
  doc.setFont(undefined, "bold");
  doc.text("INITIAL EVALUATION", centerX, 23, {
    align: "center",
  });

  // BOTTOM ROW: Note Code (left) and Date (right) - aligned in one row
  const bottomY = 30;
  doc.setFontSize(9);
  doc.setFont(undefined, "normal");
  doc.setTextColor(220, 220, 220);
  
  // Generate note code: IE-Last5Digits-YYYYMMDD
  const last5Digits = formData.patientId.slice(-5);
  const noteCodeTimestamp = new Date();
  const year = noteCodeTimestamp.getFullYear();
  const month = String(noteCodeTimestamp.getMonth() + 1).padStart(2, "0");
  const day = String(noteCodeTimestamp.getDate()).padStart(2, "0");
  const noteCode = `IE-${last5Digits}-${year}${month}${day}`;
  
  doc.text(`Note Code: ${noteCode}`, margin, bottomY);
  doc.text(
    `Date: ${new Date().toLocaleDateString("en-US", { year: "numeric", month: "long", day: "numeric" })}`,
    210 - margin,
    bottomY,
    { align: "right" },
  );

  yPosition = 45;
  doc.setTextColor(0, 0, 0);

  // SECTION 1: PATIENT INFORMATION
  doc.setFillColor(179, 111, 73); // #b36f49
  doc.rect(margin, yPosition, 180, 8, "F");
  doc.setTextColor(255, 255, 255);
  doc.setFontSize(12);
  doc.text("PATIENT INFORMATION", margin + 2, yPosition + 6);
  yPosition += 12;

  doc.setTextColor(0, 0, 0);
  doc.setFontSize(10);

  // Patient details
  doc.text(
    `Patient Name: ${formData.patientName}`,
    margin,
    yPosition,
  );
  doc.text(`Patient ID: ${formData.patientId}`, 120, yPosition);
  yPosition += lineHeight;

  doc.text(
    `Date of Birth: ${formData.dateOfBirth}`,
    margin,
    yPosition,
  );
  doc.text(`Sex: ${formData.sex}`, 120, yPosition);
  yPosition += lineHeight;

  doc.text(
    `Referring Physician: ${formData.referringPhysician}`,
    margin,
    yPosition,
  );
  yPosition += lineHeight;

  doc.text(
    `Prescribed Sessions: ${formData.prescribedSessions}`,
    margin,
    yPosition,
  );
  doc.text(`Case Type: ${formData.caseType}`, 120, yPosition);
  yPosition += lineHeight + 2;

  // Diagnoses
  doc.setFont(undefined, "bold");
  doc.text("Medical Diagnosis:", margin, yPosition);
  doc.setFont(undefined, "normal");
  yPosition += lineHeight;
  formData.diagnoses.forEach((diagnosis, index) => {
    if (diagnosis.trim()) {
      doc.text(
        `${index + 1}. ${diagnosis}`,
        margin + 5,
        yPosition,
      );
      yPosition += lineHeight;
    }
  });
  yPosition += 2;

  // Categorical Diagnoses
  if (formData.categoricalDiagnosis && formData.categoricalDiagnosis.trim()) {
    doc.setFont(undefined, "bold");
    doc.text("Categorical Diagnosis:", margin, yPosition);
    doc.setFont(undefined, "normal");
    yPosition += lineHeight;
    doc.text(
      formData.categoricalDiagnosis,
      margin + 5,
      yPosition,
      { maxWidth: 175 - 5 }
    );
    yPosition += lineHeight + 2;
  }

  // Diagnostic Areas
  doc.setFont(undefined, "bold");
  doc.text("Diagnostic Areas:", margin, yPosition);
  doc.setFont(undefined, "normal");
  yPosition += lineHeight;
  doc.text(
    formData.selectedBodyAreas.join(", "),
    margin + 5,
    yPosition,
    { maxWidth: 175 - 5 }
  );
  yPosition += lineHeight + 5;

  // SECTION 1.5: EVALUATION HEADER (Date and Branch)
  checkPageBreak(20);
  doc.setFillColor(62, 69, 75); // #3e454b - darker header
  doc.rect(margin, yPosition, 180, 8, "F");
  doc.setTextColor(255, 255, 255);
  doc.setFontSize(12);
  doc.text("EVALUATION DETAILS", margin + 2, yPosition + 6);
  yPosition += 12;

  doc.setTextColor(0, 0, 0);
  doc.setFontSize(10);
  
  doc.text(
    `Date of Evaluation: ${formData.evaluationDate}`,
    margin,
    yPosition,
  );
  doc.text(`Branch: ${formData.branch}`, 120, yPosition);
  yPosition += lineHeight + 5;

  // SECTION 2: SUBJECTIVE ASSESSMENT
  checkPageBreak(30);
  doc.setFillColor(179, 111, 73);
  doc.rect(margin, yPosition, 180, 8, "F");
  doc.setTextColor(255, 255, 255);
  doc.setFontSize(12);
  doc.text("SUBJECTIVE ASSESSMENT", margin + 2, yPosition + 6);
  yPosition += 12;

  doc.setTextColor(0, 0, 0);
  doc.setFontSize(10);

  // Chief Complaint
  doc.setFont(undefined, "bold");
  doc.text("Chief Complaint:", margin, yPosition);
  doc.setFont(undefined, "normal");
  yPosition += lineHeight;
  addWrappedText(formData.chiefComplaint, 180);
  yPosition += 2;

  // Onset and Mechanism
  checkPageBreak();
  doc.text(
    `Onset Date: ${formData.onsetDate}`,
    margin,
    yPosition,
  );
  yPosition += lineHeight;
  doc.setFont(undefined, "bold");
  doc.text("Mechanism of Injury:", margin, yPosition);
  doc.setFont(undefined, "normal");
  yPosition += lineHeight;
  addWrappedText(formData.mechanism, 180);
  yPosition += 2;

  // Prior Treatment
  checkPageBreak();
  doc.setFont(undefined, "bold");
  doc.text("Prior Treatment:", margin, yPosition);
  doc.setFont(undefined, "normal");
  yPosition += lineHeight;
  addWrappedText(formData.priorTreatment, 180);
  yPosition += 2;

  // Current Symptoms
  checkPageBreak();
  doc.setFont(undefined, "bold");
  doc.text("Current Symptoms:", margin, yPosition);
  doc.setFont(undefined, "normal");
  yPosition += lineHeight;
  addWrappedText(formData.currentSymptoms, 180);
  yPosition += 2;

  // Patient Goals
  // Don't check page break - keep on first page with other subjective content
  doc.setFont(undefined, "bold");
  doc.text("Patient Goals:", margin, yPosition);
  doc.setFont(undefined, "normal");
  yPosition += lineHeight;
  
  // Add all goal lines
  const goalsLines = doc.splitTextToSize(formData.goals, 180);
  goalsLines.forEach((line: string) => {
    doc.text(line, margin, yPosition);
    yPosition += lineHeight;
  });
  yPosition += 5;

  // SECTION 3: OBJECTIVE ASSESSMENT
  checkPageBreak(30);
  doc.setFillColor(179, 111, 73);
  doc.rect(margin, yPosition, 180, 8, "F");
  doc.setTextColor(255, 255, 255);
  doc.setFontSize(12);
  doc.text("OBJECTIVE ASSESSMENT", margin + 2, yPosition + 6);
  yPosition += 12;

  doc.setTextColor(0, 0, 0);
  doc.setFontSize(10);

  // Pain Assessment - with proper text wrapping and spacing
  const labelWidth = 45; // Width for labels
  const contentWidth = 180 - labelWidth; // Remaining width for content
  const enhancedLineHeight = 6; // Increased for better readability
  
  // Pain Level (VAS)
  doc.setFont(undefined, "bold");
  doc.text("Pain Level (VAS):", margin, yPosition);
  doc.setFont(undefined, "normal");
  doc.text(`${formData.painLevel}/10`, margin + labelWidth, yPosition);
  yPosition += enhancedLineHeight;
  
  // Location with text wrapping
  doc.setFont(undefined, "bold");
  doc.text("Location:", margin, yPosition);
  doc.setFont(undefined, "normal");
  const locationLines = doc.splitTextToSize(formData.painLocation, contentWidth);
  locationLines.forEach((line: string, index: number) => {
    doc.text(line, margin + labelWidth, yPosition + (index * enhancedLineHeight));
  });
  yPosition += locationLines.length * enhancedLineHeight;
  
  // Aggravating Factors with text wrapping
  doc.setFont(undefined, "bold");
  doc.text("Aggravating Factors:", margin, yPosition);
  doc.setFont(undefined, "normal");
  const aggravatingLines = doc.splitTextToSize(formData.painAggravatingFactors, contentWidth);
  aggravatingLines.forEach((line: string, index: number) => {
    doc.text(line, margin + labelWidth, yPosition + (index * enhancedLineHeight));
  });
  yPosition += aggravatingLines.length * enhancedLineHeight;
  
  // Alleviating Factors with text wrapping
  doc.setFont(undefined, "bold");
  doc.text("Alleviating Factors:", margin, yPosition);
  doc.setFont(undefined, "normal");
  const alleviatingLines = doc.splitTextToSize(formData.painAlleviatingFactors, contentWidth);
  alleviatingLines.forEach((line: string, index: number) => {
    doc.text(line, margin + labelWidth, yPosition + (index * enhancedLineHeight));
  });
  yPosition += alleviatingLines.length * enhancedLineHeight;
  
  // Radiating Pain with text wrapping
  doc.setFont(undefined, "bold");
  doc.text("Radiating Pain:", margin, yPosition);
  doc.setFont(undefined, "normal");
  const radiatingLines = doc.splitTextToSize(formData.radiatingPain, contentWidth);
  radiatingLines.forEach((line: string, index: number) => {
    doc.text(line, margin + labelWidth, yPosition + (index * enhancedLineHeight));
  });
  yPosition += radiatingLines.length * enhancedLineHeight;
  
  // Sleeping Position with text wrapping
  doc.setFont(undefined, "bold");
  doc.text("Sleeping Position:", margin, yPosition);
  doc.setFont(undefined, "normal");
  const sleepingLines = doc.splitTextToSize(formData.sleepingPosition, contentWidth);
  sleepingLines.forEach((line: string, index: number) => {
    doc.text(line, margin + labelWidth, yPosition + (index * enhancedLineHeight));
  });
  yPosition += sleepingLines.length * enhancedLineHeight + 3;
  
  // Inspection, Palpation, and Swelling/Edema as Cards Side by Side
  checkPageBreak(40);
  
  // Calculate number of cards to display
  const numCards = formData.showSwelling ? 3 : 2;
  const cardWidth = 180 / numCards;
  const cardPadding = 2;
  
  doc.setDrawColor(200, 200, 200);
  doc.setFontSize(9);
  
  // Inspection Card
  let cardX = margin;
  doc.rect(cardX, yPosition, cardWidth - (numCards > 1 ? 2 : 0), 30, "D");
  doc.setFont(undefined, "bold");
  doc.text("Inspection", cardX + cardPadding, yPosition + 4);
  doc.setFont(undefined, "normal");
  const inspectionLines = doc.splitTextToSize(formData.inspection, cardWidth - cardPadding * 2 - 4);
  let inspY = yPosition + 8;
  inspectionLines.slice(0, 5).forEach((line: string) => {
    doc.text(line, cardX + cardPadding, inspY);
    inspY += 4;
  });
  
  // Palpation Card
  cardX += cardWidth;
  doc.rect(cardX, yPosition, cardWidth - (numCards > 2 ? 1 : 0), 30, "D");
  doc.setFont(undefined, "bold");
  doc.text("Palpation", cardX + cardPadding, yPosition + 4);
  doc.setFont(undefined, "normal");
  const palpationLines = doc.splitTextToSize(formData.palpation, cardWidth - cardPadding * 2 - 4);
  let palpY = yPosition + 8;
  palpationLines.slice(0, 5).forEach((line: string) => {
    doc.text(line, cardX + cardPadding, palpY);
    palpY += 4;
  });
  
  // Swelling/Edema Card (if applicable)
  if (formData.showSwelling) {
    cardX += cardWidth;
    doc.rect(cardX, yPosition, cardWidth, 30, "D");
    doc.setFont(undefined, "bold");
    doc.text("Swelling/Edema", cardX + cardPadding, yPosition + 4);
    doc.setFont(undefined, "normal");
    const swellingLines = doc.splitTextToSize(formData.swelling, cardWidth - cardPadding * 2);
    let swellY = yPosition + 8;
    swellingLines.slice(0, 5).forEach((line: string) => {
      doc.text(line, cardX + cardPadding, swellY);
      swellY += 4;
    });
  }
  
  yPosition += 32;
  doc.setFontSize(9);

  // Range of Motion
  if (formData.showRangeOfMotion) {
    checkPageBreak(30);
    doc.setFont(undefined, "bold");
    doc.setFontSize(10);
    doc.text("Range of Motion:", margin, yPosition);
    yPosition += lineHeight + 2;

    if (formData.rangeOfMotion.length > 0) {
      // Full-width table setup - spans 180mm
      const tableWidth = 180;
      const colWidths = [45, 35, 40, 60]; // Proportional: Joint, AROM, PROM, Limitation
      const startX = margin;
      const rowHeight = 9; // Increased for better readability
      
      // Table header
      doc.setFillColor(220, 220, 220);
      doc.setDrawColor(100, 100, 100);
      doc.setFont(undefined, "bold");
      doc.setFontSize(9);
      
      // Draw header cells
      doc.rect(startX, yPosition, colWidths[0], 8, "FD");
      doc.rect(startX + colWidths[0], yPosition, colWidths[1], 8, "FD");
      doc.rect(startX + colWidths[0] + colWidths[1], yPosition, colWidths[2], 8, "FD");
      doc.rect(startX + colWidths[0] + colWidths[1] + colWidths[2], yPosition, colWidths[3], 8, "FD");
      
      doc.text("Joint", startX + 2, yPosition + 5);
      doc.text("AROM", startX + colWidths[0] + 2, yPosition + 5);
      doc.text("PROM", startX + colWidths[0] + colWidths[1] + 2, yPosition + 5);
      doc.text("Limitation", startX + colWidths[0] + colWidths[1] + colWidths[2] + 2, yPosition + 5);
      
      yPosition += 8;
      
      // Table rows
      doc.setFont(undefined, "normal");
      formData.rangeOfMotion.forEach((rom) => {
        checkPageBreak(rowHeight + 2);
        
        // Draw row cells
        doc.rect(startX, yPosition, colWidths[0], rowHeight, "D");
        doc.rect(startX + colWidths[0], yPosition, colWidths[1], rowHeight, "D");
        doc.rect(startX + colWidths[0] + colWidths[1], yPosition, colWidths[2], rowHeight, "D");
        doc.rect(startX + colWidths[0] + colWidths[1] + colWidths[2], yPosition, colWidths[3], rowHeight, "D");
        
        // Add text with wrapping support
        const jointLines = doc.splitTextToSize(rom.joint, colWidths[0] - 4);
        const aromLines = doc.splitTextToSize(rom.arom, colWidths[1] - 4);
        const promLines = doc.splitTextToSize(rom.prom, colWidths[2] - 4);
        const limitationLines = doc.splitTextToSize(rom.limitation, colWidths[3] - 4);
        
        doc.text(jointLines[0], startX + 2, yPosition + 6);
        doc.text(aromLines[0], startX + colWidths[0] + 2, yPosition + 6);
        doc.text(promLines[0], startX + colWidths[0] + colWidths[1] + 2, yPosition + 6);
        doc.text(limitationLines[0], startX + colWidths[0] + colWidths[1] + colWidths[2] + 2, yPosition + 6);
        
        yPosition += rowHeight;
      });
      
      yPosition += 5;
    }
    doc.setFontSize(10);
  }

  // Muscle Strength
  if (formData.showMMT) {
    checkPageBreak(30);
    doc.setFont(undefined, "bold");
    doc.setFontSize(10);
    doc.text("Muscle Strength (MMT):", margin, yPosition);
    yPosition += lineHeight + 2;

    if (formData.muscleStrength.length > 0) {
      // Full-width table setup - spans 180mm
      const tableWidth = 180;
      const colWidths = [50, 30, 30, 70]; // Muscle, Left, Right, Notes
      const startX = margin;
      const rowHeight = 9; // Increased for better readability
      
      // Table header
      doc.setFillColor(220, 220, 220);
      doc.setDrawColor(100, 100, 100);
      doc.setFont(undefined, "bold");
      doc.setFontSize(9);
      
      // Draw header cells
      doc.rect(startX, yPosition, colWidths[0], 8, "FD");
      doc.rect(startX + colWidths[0], yPosition, colWidths[1], 8, "FD");
      doc.rect(startX + colWidths[0] + colWidths[1], yPosition, colWidths[2], 8, "FD");
      doc.rect(startX + colWidths[0] + colWidths[1] + colWidths[2], yPosition, colWidths[3], 8, "FD");
      
      doc.text("Muscle", startX + 2, yPosition + 5);
      doc.text("Left", startX + colWidths[0] + 2, yPosition + 5);
      doc.text("Right", startX + colWidths[0] + colWidths[1] + 2, yPosition + 5);
      doc.text("Notes", startX + colWidths[0] + colWidths[1] + colWidths[2] + 2, yPosition + 5);
      
      yPosition += 8;
      
      // Table rows
      doc.setFont(undefined, "normal");
      formData.muscleStrength.forEach((ms) => {
        checkPageBreak(rowHeight + 2);
        
        // Draw row cells
        doc.rect(startX, yPosition, colWidths[0], rowHeight, "D");
        doc.rect(startX + colWidths[0], yPosition, colWidths[1], rowHeight, "D");
        doc.rect(startX + colWidths[0] + colWidths[1], yPosition, colWidths[2], rowHeight, "D");
        doc.rect(startX + colWidths[0] + colWidths[1] + colWidths[2], yPosition, colWidths[3], rowHeight, "D");
        
        // Add text with wrapping support
        const muscleLines = doc.splitTextToSize(ms.muscle, colWidths[0] - 4);
        const notesLines = doc.splitTextToSize(ms.notes, colWidths[3] - 4);
        
        doc.text(muscleLines[0], startX + 2, yPosition + 6);
        doc.text(ms.left, startX + colWidths[0] + 2, yPosition + 6);
        doc.text(ms.right, startX + colWidths[0] + colWidths[1] + 2, yPosition + 6);
        doc.text(notesLines[0], startX + colWidths[0] + colWidths[1] + colWidths[2] + 2, yPosition + 6);
        
        yPosition += rowHeight;
      });
      
      yPosition += 5;
    }
    doc.setFontSize(10);
  }

  // Special Tests
  if (formData.showSpecialTests) {
    checkPageBreak(30);
    doc.setFont(undefined, "bold");
    doc.setFontSize(10);
    doc.text("Special Tests:", margin, yPosition);
    yPosition += lineHeight + 2;

    if (formData.specialTests.length > 0) {
      // Full-width table setup - spans 180mm
      const tableWidth = 180;
      const colWidths = [50, 30, 100]; // Test, Result, Description
      const startX = margin;
      const rowHeight = 9; // Increased for better readability
      
      // Table header
      doc.setFillColor(220, 220, 220);
      doc.setDrawColor(100, 100, 100);
      doc.setFont(undefined, "bold");
      doc.setFontSize(9);
      
      // Draw header cells
      doc.rect(startX, yPosition, colWidths[0], 8, "FD");
      doc.rect(startX + colWidths[0], yPosition, colWidths[1], 8, "FD");
      doc.rect(startX + colWidths[0] + colWidths[1], yPosition, colWidths[2], 8, "FD");
      
      doc.text("Test", startX + 2, yPosition + 5);
      doc.text("Result", startX + colWidths[0] + 2, yPosition + 5);
      doc.text("Description", startX + colWidths[0] + colWidths[1] + 2, yPosition + 5);
      
      yPosition += 8;
      
      // Table rows
      doc.setFont(undefined, "normal");
      formData.specialTests.forEach((test) => {
        checkPageBreak(rowHeight + 2);
        
        // Draw row cells
        doc.rect(startX, yPosition, colWidths[0], rowHeight, "D");
        doc.rect(startX + colWidths[0], yPosition, colWidths[1], rowHeight, "D");
        doc.rect(startX + colWidths[0] + colWidths[1], yPosition, colWidths[2], rowHeight, "D");
        
        // Add text with wrapping support
        const testLines = doc.splitTextToSize(test.test, colWidths[0] - 4);
        const descriptionLines = doc.splitTextToSize(test.description || "", colWidths[2] - 4);
        
        doc.text(testLines[0], startX + 2, yPosition + 6);
        doc.text(test.result || "", startX + colWidths[0] + 2, yPosition + 6);
        doc.text(descriptionLines[0], startX + colWidths[0] + colWidths[1] + 2, yPosition + 6);
        
        yPosition += rowHeight;
      });
      
      yPosition += 5;
    }
    doc.setFontSize(10);
  }

  // Posture
  checkPageBreak(30);
  doc.setFont(undefined, "bold");
  doc.setFontSize(10);
  doc.text("Posture Assessment:", margin, yPosition);
  yPosition += lineHeight + 2;

  if (formData.posture.length > 0) {
    // Full-width table setup - spans 180mm
    const tableWidth = 180;
    const colWidths = [60, 60, 60]; // Equal width: Area, Finding, Significance
    const startX = margin;
    const rowHeight = 9; // Increased for better readability
    
    // Table header
    doc.setFillColor(220, 220, 220);
    doc.setDrawColor(100, 100, 100);
    doc.setFont(undefined, "bold");
    doc.setFontSize(9);
    
    // Draw header cells
    doc.rect(startX, yPosition, colWidths[0], 8, "FD");
    doc.rect(startX + colWidths[0], yPosition, colWidths[1], 8, "FD");
    doc.rect(startX + colWidths[0] + colWidths[1], yPosition, colWidths[2], 8, "FD");
    
    doc.text("Area", startX + 2, yPosition + 5);
    doc.text("Finding", startX + colWidths[0] + 2, yPosition + 5);
    doc.text("Significance", startX + colWidths[0] + colWidths[1] + 2, yPosition + 5);
    
    yPosition += 8;
    
    // Table rows
    doc.setFont(undefined, "normal");
    formData.posture.forEach((posture) => {
      checkPageBreak(rowHeight + 2);
      
      // Draw row cells
      doc.rect(startX, yPosition, colWidths[0], rowHeight, "D");
      doc.rect(startX + colWidths[0], yPosition, colWidths[1], rowHeight, "D");
      doc.rect(startX + colWidths[0] + colWidths[1], yPosition, colWidths[2], rowHeight, "D");
      
      // Add text with wrapping support
      const areaLines = doc.splitTextToSize(posture.area, colWidths[0] - 4);
      const findingLines = doc.splitTextToSize(posture.finding, colWidths[1] - 4);
      const significanceLines = doc.splitTextToSize(posture.significance, colWidths[2] - 4);
      
      doc.text(areaLines[0], startX + 2, yPosition + 6);
      doc.text(findingLines[0], startX + colWidths[0] + 2, yPosition + 6);
      doc.text(significanceLines[0], startX + colWidths[0] + colWidths[1] + 2, yPosition + 6);
      
      yPosition += rowHeight;
    });
    
    yPosition += 5;
  }
  doc.setFontSize(10);

  // Gait
  if (formData.showGait) {
    checkPageBreak();
    doc.setFont(undefined, "bold");
    doc.text("Gait Assessment:", margin, yPosition);
    doc.setFont(undefined, "normal");
    yPosition += lineHeight;
    addWrappedText(formData.gait, 180);
    yPosition += 2;
  }

  // Neurological
  if (formData.showNeurological) {
    checkPageBreak();
    doc.setFont(undefined, "bold");
    doc.text("Neurological Assessment:", margin, yPosition);
    doc.setFont(undefined, "normal");
    yPosition += lineHeight;
    addWrappedText(formData.neurological, 180);
    yPosition += 2;
  }

  // Functional Assessment
  if (formData.showFunctional) {
    checkPageBreak();
    doc.setFont(undefined, "bold");
    doc.text("Functional Assessment:", margin, yPosition);
    doc.setFont(undefined, "normal");
    yPosition += lineHeight;
    addWrappedText(formData.functional, 180);
    yPosition += 5;
  }

  // SECTION 4: PT IMPRESSION
  checkPageBreak(30);
  doc.setFillColor(179, 111, 73);
  doc.rect(margin, yPosition, 180, 8, "F");
  doc.setTextColor(255, 255, 255);
  doc.setFontSize(12);
  doc.text("PT IMPRESSION", margin + 2, yPosition + 6);
  yPosition += 12;

  doc.setTextColor(0, 0, 0);
  doc.setFontSize(10);

  // Clinical Impression
  doc.setFont(undefined, "bold");
  doc.text("Clinical Impression:", margin, yPosition);
  doc.setFont(undefined, "normal");
  yPosition += lineHeight;
  addWrappedText(formData.impression, 180);
  yPosition += 5;

  // SECTION 5: PLAN OF CARE
  checkPageBreak(30);
  doc.setFillColor(179, 111, 73);
  doc.rect(margin, yPosition, 180, 8, "F");
  doc.setTextColor(255, 255, 255);
  doc.setFontSize(12);
  doc.text("PLAN OF CARE", margin + 2, yPosition + 6);
  yPosition += 12;

  doc.setTextColor(0, 0, 0);
  doc.setFontSize(10);

  // Three-Column Table for Plan Rows
  if (formData.planRows && formData.planRows.length > 0) {
    // Table header
    const tableStartY = yPosition;
    const colWidth = 60;

    doc.setFillColor(62, 69, 75); // #3e454b
    doc.rect(margin, yPosition, colWidth, 8, "F");
    doc.rect(margin + colWidth, yPosition, colWidth, 8, "F");
    doc.rect(
      margin + colWidth * 2,
      yPosition,
      colWidth,
      8,
      "F",
    );

    doc.setTextColor(255, 255, 255);
    doc.setFont(undefined, "bold");
    doc.setFontSize(9);
    doc.text(
      "Objective per Session",
      margin + 2,
      yPosition + 5,
    );
    doc.text(
      "Treatment Plan",
      margin + colWidth + 2,
      yPosition + 5,
    );
    doc.text(
      "Rationale",
      margin + colWidth * 2 + 2,
      yPosition + 5,
    );
    yPosition += 10;

    doc.setTextColor(0, 0, 0);
    doc.setFont(undefined, "normal");
    doc.setFontSize(8);

    // Table rows
    formData.planRows.forEach((row, index) => {
      const rowStartY = yPosition;

      // Split text for each column
      const objectiveLines = doc.splitTextToSize(
        row.objective || "N/A",
        colWidth - 4,
      );
      const treatmentLines = doc.splitTextToSize(
        row.treatment || "N/A",
        colWidth - 4,
      );
      const rationaleLines = doc.splitTextToSize(
        row.rationale || "N/A",
        colWidth - 4,
      );

      // Calculate row height based on the tallest column
      const maxLines = Math.max(
        objectiveLines.length,
        treatmentLines.length,
        rationaleLines.length,
      );
      const rowHeight = Math.max(maxLines * 4 + 4, 12);

      // Check if we need a new page
      checkPageBreak(rowHeight + 5);

      // Draw row borders
      doc.setDrawColor(200, 200, 200);
      doc.rect(margin, yPosition, colWidth, rowHeight);
      doc.rect(
        margin + colWidth,
        yPosition,
        colWidth,
        rowHeight,
      );
      doc.rect(
        margin + colWidth * 2,
        yPosition,
        colWidth,
        rowHeight,
      );

      // Add text content
      let currentY = yPosition + 4;
      objectiveLines.forEach((line: string) => {
        doc.text(line, margin + 2, currentY);
        currentY += 4;
      });

      currentY = yPosition + 4;
      treatmentLines.forEach((line: string) => {
        doc.text(line, margin + colWidth + 2, currentY);
        currentY += 4;
      });

      currentY = yPosition + 4;
      rationaleLines.forEach((line: string) => {
        doc.text(line, margin + colWidth * 2 + 2, currentY);
        currentY += 4;
      });

      yPosition += rowHeight;
    });

    yPosition += 5;
  }

  // Footer with Therapist Information and Signature
  checkPageBreak(40);

  // Certification box
  doc.setFillColor(240, 240, 240); // Light gray background
  doc.setDrawColor(100, 100, 100);
  doc.rect(margin, yPosition, 180, 20, "FD");
  yPosition += 5;

  doc.setFontSize(9);
  doc.setTextColor(0, 0, 0);
  doc.setFont(undefined, "bold");
  doc.text("CERTIFICATION:", margin + 2, yPosition);
  doc.setFont(undefined, "normal");
  yPosition += 5;
  doc.setFontSize(8);
  const certText =
    "I certify that this evaluation was performed by me or under my direct supervision, and that the information contained herein is accurate to the best of my knowledge.";
  const certLines = doc.splitTextToSize(certText, 176);
  certLines.forEach((line: string) => {
    doc.text(line, margin + 2, yPosition);
    yPosition += 4;
  });
  yPosition += 3;

  // Separator line
  doc.setDrawColor(100, 100, 100);
  doc.setLineWidth(0.5);
  doc.line(margin, yPosition, 195, yPosition);
  yPosition += 10;

  // Signature block - Row 1
  doc.setFontSize(11);
  doc.setTextColor(0, 0, 0);
  doc.setFont(undefined, "bold");
  doc.text("Physical Therapist:", margin, yPosition);
  doc.setFont(undefined, "normal");
  doc.text(formData.therapistName, margin + 45, yPosition);

  doc.setFont(undefined, "bold");
  doc.text("License #:", 110, yPosition);
  doc.setFont(undefined, "normal");
  doc.text(formData.therapistLicense, 135, yPosition);
  yPosition += 7;

  // Signature block - Row 2: Position
  doc.setFont(undefined, "bold");
  doc.text("Position:", margin, yPosition);
  doc.setFont(undefined, "normal");
  doc.text(formData.therapistPosition || "N/A", margin + 45, yPosition);
  yPosition += 10;

  // Signature block - Row 3: Signature
  doc.setFont(undefined, "bold");
  doc.text("Signature:", margin, yPosition);

  // Add signature image if available
  if (
    formData.signature &&
    formData.signature.startsWith("data:image")
  ) {
    try {
      doc.addImage(
        formData.signature,
        "PNG",
        margin + 30,
        yPosition - 8,
        50,
        15,
      );
    } catch (error) {
      console.error("Failed to add signature image:", error);
      doc.setFont(undefined, "normal");
      doc.text(
        "________________________",
        margin + 30,
        yPosition,
      );
    }
  } else {
    doc.setFont(undefined, "normal");
    doc.text(
      "________________________",
      margin + 30,
      yPosition,
    );
  }

  doc.setFontSize(11);
  doc.setFont(undefined, "bold");
  doc.text("Date:", 110, yPosition);
  doc.setFont(undefined, "normal");
  doc.text(formData.evaluationDate, 125, yPosition);

  // Add footer to the last page
  addFooter();

  return doc;
}

// Sample data generator for testing
export function getSampleFormData(): FormData {
  return {
    patientName: "John Smith",
    patientId: "PT-2026-0142",
    dateOfBirth: "1978-03-15",
    sex: "Male",
    referringPhysician: "Dr. Sarah Johnson",
    prescribedSessions: 12,
    diagnoses: [
      "Right shoulder impingement syndrome",
      "Rotator cuff tendinitis",
    ],
    categoricalDiagnosis: "Shoulder Impingement, Rotator Cuff Injury",
    caseType: "Standard Physical Therapy Program",
    bodyAreas: ["Shoulder", "Upper Back"],
    selectedBodyAreas: ["Shoulder"],

    chiefComplaint:
      "Patient reports persistent right shoulder pain for the past 3 months, limiting ability to perform overhead activities and affecting sleep quality.",
    onsetDate: "2025-10-15",
    mechanism:
      "Gradual onset following repetitive overhead activities at work (construction). No specific traumatic event reported.",
    priorTreatment:
      "Patient tried over-the-counter NSAIDs with minimal relief. Has been attending physical therapy at another facility for 4 weeks with limited improvement.",
    currentSymptoms:
      "Sharp pain with overhead reaching (8/10), dull ache at rest (3/10). Pain increases with prolonged computer work. Reports occasional numbness in upper arm.",
    goals:
      "Return to work without limitations, resume recreational tennis, improve sleep quality, eliminate pain with daily activities.",

    painLevel: 6,
    painLocation:
      "Right anterior and lateral shoulder, radiating to upper arm",
    painAggravatingFactors:
      "Overhead reaching, lifting objects above shoulder height, sleeping on right side, prolonged sitting at computer.",
    painAlleviatingFactors:
      "Ice application, rest, avoiding overhead activities, gentle pendulum exercises.",
    radiatingPain:
      "Radiating to upper arm and lateral shoulder",
    sleepingPosition:
      "Sleeping on right side exacerbates pain",
    inspection:
      "Mild anterior shoulder asymmetry, forward head posture, rounded shoulders bilaterally. No visible swelling or discoloration. Scapular winging observed on right side.",
    palpation:
      "Tenderness to palpation over anterior shoulder (supraspinatus insertion), AC joint tender to moderate pressure. No crepitus noted. Muscle spasm present in upper trapezius.",
    swelling:
      "Minimal swelling noted at anterior shoulder. No joint effusion present.",
    rangeOfMotion: [
      {
        joint: "Flexion",
        arom: "150°",
        prom: "145° (pain at end range)",
        limitation: "Pain",
      },
      {
        joint: "Abduction",
        arom: "150°",
        prom: "130° (pain >90°)",
        limitation: "Pain",
      },
      {
        joint: "External Rotation",
        arom: "90°",
        prom: "60° (limited)",
        limitation: "Pain",
      },
      {
        joint: "Internal Rotation",
        arom: "L3 vertebra",
        prom: "L3 vertebra",
        limitation: "Pain",
      },
    ],
    muscleStrength: [
      {
        muscle: "Shoulder flexion",
        left: "4/5",
        right: "4/5 (pain)",
        notes: "Pain limits full effort on testing",
      },
      {
        muscle: "Shoulder abduction",
        left: "4-/5",
        right: "4-/5 (pain)",
        notes: "Pain limits full effort on testing",
      },
      {
        muscle: "External rotation",
        left: "3+/5",
        right: "3+/5 (pain)",
        notes: "Pain limits full effort on testing",
      },
      {
        muscle: "Internal rotation",
        left: "4/5",
        right: "4/5 (pain)",
        notes: "Pain limits full effort on testing",
      },
      {
        muscle: "Scapular stabilizers",
        left: "3/5",
        right: "3/5 (pain)",
        notes: "Pain limits full effort on testing",
      },
    ],
    specialTests: [
      {
        test: "Hawkins-Kennedy",
        result: "Positive",
        description: "Pain with arm abduction and external rotation",
      },
      {
        test: "Neer",
        result: "Positive",
        description: "Pain with arm abduction and external rotation",
      },
      {
        test: "Empty can test",
        result: "Positive with weakness",
        description: "Weakness with arm abduction and external rotation",
      },
      {
        test: "Speeds test",
        result: "Negative",
        description: "No pain or weakness",
      },
      {
        test: "Cross-body adduction",
        result: "Positive",
        description: "Pain with arm abduction and external rotation",
      },
    ],
    posture: [
      {
        area: "Anterior",
        finding: "Forward head posture (2 inches)",
        significance: "Increased thoracic kyphosis",
      },
      {
        area: "Posterior",
        finding: "Increased thoracic kyphosis",
        significance: "Protracted scapulae bilaterally (R>L)",
      },
      {
        area: "Sagittal",
        finding: "Protracted scapulae bilaterally (R>L)",
        significance: "Elevated right shoulder",
      },
    ],
    gait: "Normal gait pattern. Holds right arm in protected position with reduced arm swing.",
    neurological:
      "Upper extremity dermatomes intact. Reflexes 2+ and symmetrical. Negative upper limb tension test.",
    functional:
      "Modified DASH score: 42/100. Unable to reach overhead shelves, difficulty with dressing (putting on shirt), reduced lifting capacity to 10 lbs.",

    impression:
      "Patient presents with right shoulder impingement syndrome with associated rotator cuff tendinitis and scapular dyskinesis. Clinical findings consistent with subacromial impingement.",

    shortTermGoals: [
      {
        goal: "Reduce pain level from 6/10 to 3/10 at rest and with ADLs",
        timeframe: "2-3 weeks",
      },
      {
        goal: "Improve shoulder flexion AROM to 160°",
        timeframe: "3-4 weeks",
      },
      {
        goal: "Increase rotator cuff strength to 4/5",
        timeframe: "4 weeks",
      },
    ],
    longTermGoals: [
      {
        goal: "Return to full work duties without restrictions",
        timeframe: "8-10 weeks",
      },
      {
        goal: "Achieve pain-free full shoulder AROM in all planes",
        timeframe: "10-12 weeks",
      },
      {
        goal: "Resume recreational tennis activities",
        timeframe: "12 weeks",
      },
    ],
    interventions: [
      "Manual therapy: Joint mobilizations, soft tissue mobilization",
      "Therapeutic exercises: Rotator cuff strengthening, scapular stabilization",
      "Modalities: Ice/heat therapy, electrical stimulation as needed",
      "Postural training and ergonomic education",
      "Home exercise program with progression",
      "Patient education on activity modification",
    ],
    planRows: [
      {
        objective: "Reduce pain and improve shoulder function",
        treatment:
          "Joint mobilizations, soft tissue mobilization, rotator cuff strengthening",
        rationale:
          "To reduce pain and improve shoulder function",
      },
      {
        objective: "Improve shoulder range of motion",
        treatment:
          "Joint mobilizations, soft tissue mobilization, rotator cuff strengthening",
        rationale: "To improve shoulder range of motion",
      },
      {
        objective: "Increase rotator cuff strength",
        treatment:
          "Rotator cuff strengthening, scapular stabilization",
        rationale: "To increase rotator cuff strength",
      },
    ],
    frequency: "3 times per week",
    duration: "8-12 weeks (24-36 sessions)",

    // Toggle visibility for sections
    showRangeOfMotion: true,
    showMMT: true,
    showSpecialTests: true,
    showSwelling: true,
    showGait: true,
    showNeurological: true,
    showFunctional: true,

    // Therapist Information
    therapistName: "Dr. Emily Rodriguez",
    therapistLicense: "PT-CA-45892",
    therapistPosition: "Physical Therapist",
    evaluationDate: "2026-01-16",
    signature: "Emily Rodriguez",
    branch: "Main Branch",
  };
}