import { useState } from 'react';
import { Sidebar } from '@/app/components/Sidebar';
import { PTDatabase, PhysicalTherapist } from '@/app/components/PTDatabase';
import { PatientDatabase, Patient } from '@/app/components/PatientDatabase';
import { PatientInformation } from '@/app/components/PatientInformation';
import { EvaluationHeader } from '@/app/components/EvaluationHeader';
import { SubjectiveAssessment } from '@/app/components/SubjectiveAssessment';
import { ObjectiveAssessment } from '@/app/components/ObjectiveAssessment';
import { PTImpression } from '@/app/components/PTImpression';
import { PlanOfCare } from '@/app/components/PlanOfCare';
import { TherapistInformation } from '@/app/components/TherapistInformation';
import { ClinicalRecords, ClinicalRecord } from '@/app/components/ClinicalRecords';
import { PTNotesForm, PTNotesData } from '@/app/components/PTNotesForm';
import { DischargeSummaryForm, DischargeSummaryData } from '@/app/components/DischargeSummaryForm';
import { CreateModule, FormType } from '@/app/components/CreateModule';
import { Button } from '@/app/components/ui/button';
import { History, Save, Send } from 'lucide-react';
import { FormData, generateComprehensivePDF } from '@/app/utils/pdfGenerator';
import { generatePTNotesPDF } from '@/app/utils/ptNotesPDFGenerator';
import { generateDischargeSummaryPDF } from '@/app/utils/dischargeSummaryPDFGenerator';
import { Toaster, toast } from 'sonner';

export default function App() {
  const [activeItem, setActiveItem] = useState('create-module');
  
  // Create Module State
  const [selectedPatient, setSelectedPatient] = useState<string>('');
  const [selectedFormType, setSelectedFormType] = useState<FormType>(null);
  
  // PT Database State
  const [therapists, setTherapists] = useState<PhysicalTherapist[]>([
    {
      id: '1',
      name: 'Dr. Emily Rodriguez',
      licenseNumber: 'PT-CA-45892',
      position: 'Main Branch',
    },
    {
      id: '2',
      name: 'Dr. Michael Chen',
      licenseNumber: 'PT-CA-45893',
      position: 'Downtown Branch',
    },
  ]);

  // Patient Database State
  const [patients, setPatients] = useState<Patient[]>([
    {
      id: '1',
      patientName: 'Maria Santos Rodriguez',
      patientId: 'PT-2026-0089',
      dateOfBirth: '1985-03-15',
      sex: 'Female',
      referringPhysician: 'Dr. James Chen',
      prescribedSessions: 12,
      diagnoses: ['Chronic Lower Back Pain', 'Lumbar Disc Herniation L4-L5'],
      program: 'Orthopedic - Non-Work Related',
      bodyAreasInvolved: ['Lumbar Spine', 'Right Hip'],
      lastEditDate: '2026-01-15',
    },
    {
      id: '2',
      patientName: 'Robert Johnson',
      patientId: 'PT-2026-0112',
      dateOfBirth: '1978-07-22',
      sex: 'Male',
      referringPhysician: 'Dr. Sarah Williams',
      prescribedSessions: 16,
      diagnoses: ['Rotator Cuff Tear', 'Post-Surgical Right Shoulder'],
      program: 'Post-Surgical Rehabilitation',
      bodyAreasInvolved: ['Right Shoulder'],
      lastEditDate: '2026-01-16',
    },
    {
      id: '3',
      patientName: 'Jennifer Lee',
      patientId: 'PT-2026-0145',
      dateOfBirth: '1992-11-08',
      sex: 'Female',
      referringPhysician: 'Dr. Michael Brown',
      prescribedSessions: 10,
      diagnoses: ['ACL Reconstruction Post-Op', 'Left Knee Pain'],
      program: 'Sports Rehabilitation',
      bodyAreasInvolved: ['Left Knee'],
      lastEditDate: '2026-01-17',
    },
    {
      id: '4',
      patientName: 'David Martinez',
      patientId: 'PT-2026-0178',
      dateOfBirth: '1965-05-30',
      sex: 'Male',
      referringPhysician: 'Dr. Emily Davis',
      prescribedSessions: 20,
      diagnoses: ['Stroke - Left Hemiparesis', 'Balance Impairment'],
      program: 'Neurological Rehabilitation',
      bodyAreasInvolved: ['Cervical Spine', 'Left Shoulder', 'Left Hip', 'Left Knee'],
      lastEditDate: '2026-01-18',
    },
    {
      id: '5',
      patientName: 'Susan Thompson',
      patientId: 'PT-2026-0201',
      dateOfBirth: '1988-09-12',
      sex: 'Female',
      referringPhysician: 'Dr. Robert Anderson',
      prescribedSessions: 8,
      diagnoses: ['Carpal Tunnel Syndrome', 'Right Wrist Tendinitis'],
      program: 'Orthopedic - Work Related',
      bodyAreasInvolved: ['Right Wrist/Hand'],
      lastEditDate: '2026-01-19',
    },
  ]);

  // PT Notes State
  const [ptNotesData, setPTNotesData] = useState<PTNotesData>({
    // Patient Information
    patientName: '',
    patientId: '',
    dateOfBirth: '',
    sex: '',
    noteDate: '',
    program: '',
    
    // PT Notes Details
    chiefComplaint: '',
    patientGoal: '',
    vasPainIntensity: 0,
    painDescription: '',
    inspectionPalpation: '',
    otherFindings: '',
    machineRows: [],
    machinePatientReaction: '',
    manualTherapyRows: [],
    manualTherapyPatientReaction: '',
    exerciseRows: [],
    exercisePatientReaction: '',
    
    // PT Information
    therapistName: '',
    therapistLicense: '',
    therapistPosition: '',
    signature: '',
  });

  const [formData, setFormData] = useState<FormData>({
    // Patient Information
    patientName: '',
    patientId: '',
    dateOfBirth: '',
    sex: '',
    referringPhysician: '',
    prescribedSessions: 0,
    diagnoses: ['', '', ''],
    caseType: '',
    bodyAreas: [],
    selectedBodyAreas: [],
    
    // Subjective Assessment
    chiefComplaint: '',
    onsetDate: '',
    mechanism: '',
    priorTreatment: '',
    currentSymptoms: '',
    goals: '',
    
    // Objective Assessment
    painLevel: 0,
    painLocation: '',
    painAggravatingFactors: '',
    painAlleviatingFactors: '',
    radiatingPain: '',
    sleepingPosition: '',
    inspection: '',
    palpation: '',
    swelling: '',
    rangeOfMotion: [],
    muscleStrength: [],
    specialTests: [],
    posture: [],
    gait: '',
    neurological: '',
    functional: '',
    
    // Toggle visibility for sections
    showRangeOfMotion: true,
    showMMT: true,
    showSpecialTests: true,
    showSwelling: true,
    showGait: true,
    showNeurological: true,
    showFunctional: true,
    
    // PT Impression
    impression: '',
    
    // Plan of Care
    shortTermGoals: [],
    longTermGoals: [],
    interventions: [],
    planRows: [],
    frequency: '',
    duration: '',
    
    // Therapist Information
    therapistName: '',
    therapistLicense: '',
    evaluationDate: '',
    signature: '',
    branch: '',
  });

  const [clinicalRecords, setClinicalRecords] = useState<ClinicalRecord[]>([
    {
      id: '1',
      noteCode: 'IE-PT2026-0089-20260119',
      patientId: 'PT-2026-0089',
      patientName: 'Maria Santos Rodriguez',
      dateCreated: '2026-01-19',
      type: 'Initial Evaluation',
      status: 'Submitted',
    },
  ]);

  const generateNoteCode = () => {
    const today = new Date();
    const dateStr = today.toISOString().slice(0, 10).replace(/-/g, '');
    const patientId = formData.patientId;
    return `IE-${patientId}-${dateStr}`;
  };

  const handleSubmit = () => {
    const noteCode = generateNoteCode();
    const today = new Date().toISOString().slice(0, 10);
    
    const newRecord: ClinicalRecord = {
      id: Date.now().toString(),
      noteCode: noteCode,
      patientId: formData.patientId,
      patientName: formData.patientName,
      dateCreated: today,
      type: 'Initial Evaluation',
      status: 'Submitted',
      formData: { ...formData }, // Store the form data
    };
    
    setClinicalRecords([newRecord, ...clinicalRecords]);
    
    // Update patient information in Patient Database if changed
    const patientIndex = patients.findIndex(p => p.patientId === formData.patientId);
    if (patientIndex !== -1) {
      const updatedPatients = [...patients];
      updatedPatients[patientIndex] = {
        ...updatedPatients[patientIndex],
        patientName: formData.patientName,
        dateOfBirth: formData.dateOfBirth,
        sex: formData.sex,
        referringPhysician: formData.referringPhysician,
        prescribedSessions: formData.prescribedSessions,
        diagnoses: formData.diagnoses.filter(d => d.trim() !== ''),
        program: formData.caseType,
        bodyAreasInvolved: formData.selectedBodyAreas,
        lastEditDate: today,
      };
      setPatients(updatedPatients);
      
      toast.success('Patient information updated', {
        description: 'Changes from the evaluation form have been synced to the Patient Database.',
      });
    }
    
    // Generate PDF
    const doc = generateComprehensivePDF(formData);
    doc.save(`${noteCode}.pdf`);
    
    toast.success('Evaluation submitted', {
      description: `Note Code: ${noteCode} - PDF generated successfully.`,
    });
    
    // Navigate to Clinical Records
    setActiveItem('clinical-records');
  };

  const handleSaveDraft = () => {
    const today = new Date().toISOString().slice(0, 10);
    const dateStr = today.replace(/-/g, '');
    
    // Determine which form type we're saving
    let noteCode = '';
    let recordType: 'Initial Evaluation' | 'PT Notes' | 'Discharge Summary' = 'Initial Evaluation';
    let patientId = '';
    let patientName = '';
    let recordData: Partial<ClinicalRecord> = {};
    
    if (selectedFormType === 'PT Notes') {
      // Extract last 5 digits of patient ID
      const last5 = ptNotesData.patientId.slice(-5);
      noteCode = `PTN-${last5}-${dateStr}`;
      recordType = 'PT Notes';
      patientId = ptNotesData.patientId;
      patientName = ptNotesData.patientName;
      recordData = { ptNotesData: { ...ptNotesData } };
    } else if (selectedFormType === 'Discharge Summary') {
      // For Discharge Summary, we need to get the current form data
      // Since DischargeSummaryForm has its own state, we'll pass a callback
      // For now, we'll use a simple approach
      const last5 = formData.patientId.slice(-5);
      noteCode = `DS-${last5}-${dateStr}`;
      recordType = 'Discharge Summary';
      patientId = formData.patientId;
      patientName = formData.patientName;
      // We'll need to handle this specially in the component
    } else {
      // Initial Evaluation
      const last5 = formData.patientId.slice(-5);
      noteCode = `IE-${last5}-${dateStr}`;
      recordType = 'Initial Evaluation';
      patientId = formData.patientId;
      patientName = formData.patientName;
      recordData = { formData: { ...formData } };
    }
    
    const newDraft: ClinicalRecord = {
      id: Date.now().toString(),
      noteCode: noteCode,
      patientId: patientId,
      patientName: patientName,
      dateCreated: today,
      type: recordType,
      status: 'Draft',
      ...recordData,
    };
    
    setClinicalRecords([newDraft, ...clinicalRecords]);
    
    toast.success('Draft saved successfully', {
      description: `Note Code: ${noteCode} - Draft saved to Clinical Records.`,
    });
    
    // Navigate to Clinical Records
    setActiveItem('clinical-records');
  };

  const handleViewHistory = () => {
    toast.info('Patient History', {
      description: 'Last evaluation: 2025-08-12 - Shoulder Progress Note',
    });
  };

  const handleViewRecord = (recordId: string) => {
    // Find the record
    const record = clinicalRecords.find(r => r.id === recordId);
    if (!record) {
      toast.error('Record not found');
      return;
    }

    // Generate PDF based on record type
    let doc;
    if (record.type === 'PT Notes' && record.ptNotesData) {
      doc = generatePTNotesPDF(record.ptNotesData);
    } else if (record.type === 'Initial Evaluation' && record.formData) {
      doc = generateComprehensivePDF(record.formData);
    } else if (record.type === 'Discharge Summary' && record.dischargeSummaryData) {
      doc = generateDischargeSummaryPDF(record.dischargeSummaryData);
    } else {
      toast.error('Record data not available');
      return;
    }
    
    // Convert PDF to blob and open in new window
    const pdfBlob = doc.output('blob');
    const pdfUrl = URL.createObjectURL(pdfBlob);
    window.open(pdfUrl, '_blank');
    
    toast.info('PDF Preview', {
      description: `Opening record in new tab`,
    });
  };

  const handleDownloadPDF = (record: ClinicalRecord) => {
    // Generate PDF based on record type
    let doc;
    if (record.type === 'PT Notes' && record.ptNotesData) {
      doc = generatePTNotesPDF(record.ptNotesData);
    } else if (record.type === 'Initial Evaluation' && record.formData) {
      doc = generateComprehensivePDF(record.formData);
    } else if (record.type === 'Discharge Summary' && record.dischargeSummaryData) {
      doc = generateDischargeSummaryPDF(record.dischargeSummaryData);
    } else {
      toast.error('Record data not available');
      return;
    }
    
    // Save the PDF
    doc.save(`${record.noteCode}.pdf`);
    
    toast.success('PDF Downloaded', {
      description: `${record.noteCode}.pdf has been downloaded.`,
    });
  };

  // PT Database handlers
  const handleAddTherapist = (therapist: Omit<PhysicalTherapist, 'id'>) => {
    const newTherapist: PhysicalTherapist = {
      ...therapist,
      id: Date.now().toString(),
    };
    setTherapists([...therapists, newTherapist]);
    toast.success('Therapist added successfully', {
      description: `${therapist.name} has been added to the database.`,
    });
  };

  const handleDeleteTherapist = (id: string) => {
    setTherapists(therapists.filter((t) => t.id !== id));
    toast.success('Therapist removed', {
      description: 'The therapist has been removed from the database.',
    });
  };

  // Patient Database handlers
  const handleAddPatient = (patient: Omit<Patient, 'id' | 'lastEditDate'>) => {
    const today = new Date().toISOString().slice(0, 10);
    const newPatient: Patient = {
      ...patient,
      id: Date.now().toString(),
      lastEditDate: today,
    };
    setPatients([...patients, newPatient]);
    toast.success('Patient added successfully', {
      description: `${patient.patientName} has been added to the database.`,
    });
  };

  const handleEditPatient = (id: string, patient: Omit<Patient, 'id' | 'lastEditDate'>) => {
    const today = new Date().toISOString().slice(0, 10);
    setPatients(patients.map((p) => 
      p.id === id 
        ? { ...patient, id, lastEditDate: today }
        : p
    ));
    toast.success('Patient updated successfully', {
      description: `${patient.patientName} has been updated.`,
    });
  };

  const handleDeletePatient = (id: string) => {
    setPatients(patients.filter((p) => p.id !== id));
    toast.success('Patient removed', {
      description: 'The patient has been removed from the database.',
    });
  };

  // PT Notes handlers
  const handleSubmitPTNote = () => {
    const today = new Date().toISOString().slice(0, 10);
    const dateStr = today.replace(/-/g, '');
    const noteCode = `PN-${ptNotesData.patientId}-${dateStr}`;

    const newRecord: ClinicalRecord = {
      id: Date.now().toString(),
      noteCode: noteCode,
      patientId: ptNotesData.patientId,
      patientName: ptNotesData.patientName,
      dateCreated: today,
      type: 'PT Notes',
      status: 'Submitted',
      ptNotesData: { ...ptNotesData }, // Store the PT Notes data
    };

    setClinicalRecords([newRecord, ...clinicalRecords]);

    // Generate PT Notes PDF
    const doc = generatePTNotesPDF(ptNotesData);
    doc.save(`${noteCode}.pdf`);

    toast.success('PT Note submitted', {
      description: `Note Code: ${noteCode} - PDF generated successfully.`,
    });

    // Reset form and navigate to Clinical Records
    setPTNotesData({
      patientName: '',
      patientId: '',
      dateOfBirth: '',
      sex: '',
      noteDate: '',
      program: '',
      chiefComplaint: '',
      patientGoal: '',
      vasPainIntensity: 0,
      painDescription: '',
      inspectionPalpation: '',
      otherFindings: '',
      machineRows: [],
      machinePatientReaction: '',
      manualTherapyRows: [],
      manualTherapyPatientReaction: '',
      exerciseRows: [],
      exercisePatientReaction: '',
      therapistName: '',
      therapistLicense: '',
      therapistPosition: '',
      signature: '',
    });
    setSelectedPatient('');
    setSelectedFormType(null);
    setActiveItem('clinical-records');
  };

  // Create Module handlers
  const handlePatientSelect = (patientId: string) => {
    setSelectedPatient(patientId);
    const patient = patients.find(p => p.id === patientId);
    
    if (patient) {
      // Pre-fill patient information in both forms
      setPTNotesData(prev => ({
        ...prev,
        patientName: patient.patientName,
        patientId: patient.patientId,
        dateOfBirth: patient.dateOfBirth,
        sex: patient.sex,
        noteDate: new Date().toISOString().slice(0, 10),
      }));
      
      setFormData(prev => ({
        ...prev,
        patientName: patient.patientName,
        patientId: patient.patientId,
        dateOfBirth: patient.dateOfBirth,
        sex: patient.sex,
      }));
    }
  };

  const handleFormTypeSelect = (formType: FormType) => {
    setSelectedFormType(formType);
  };

  // Discharge Summary handler
  const handleSubmitDischargeSummary = (summaryData: DischargeSummaryData) => {
    const today = new Date().toISOString().slice(0, 10);
    const dateStr = today.replace(/-/g, '');
    const noteCode = `DS-${summaryData.patientId}-${dateStr}`;

    const newRecord: ClinicalRecord = {
      id: Date.now().toString(),
      noteCode: noteCode,
      patientId: summaryData.patientId,
      patientName: summaryData.patientName,
      dateCreated: today,
      type: 'Discharge Summary',
      status: 'Submitted',
      dischargeSummaryData: { ...summaryData },
    };

    setClinicalRecords([newRecord, ...clinicalRecords]);

    // Generate Discharge Summary PDF
    const doc = generateDischargeSummaryPDF(summaryData);
    doc.save(`${noteCode}.pdf`);

    toast.success('Discharge Summary submitted', {
      description: `Note Code: ${noteCode} - PDF generated successfully.`,
    });

    // Reset form and navigate to Clinical Records
    setSelectedPatient('');
    setSelectedFormType(null);
    setActiveItem('clinical-records');
  };

  // Handle editing a draft record
  const handleEditRecord = (record: ClinicalRecord) => {
    // Find the patient to pre-select
    const patient = patients.find(p => p.patientId === record.patientId);
    
    if (patient) {
      setSelectedPatient(patient.id);
    }
    
    // Load the form data based on record type
    if (record.type === 'Initial Evaluation' && record.formData) {
      setFormData(record.formData);
      setSelectedFormType('Initial Evaluation');
    } else if (record.type === 'PT Notes' && record.ptNotesData) {
      setPTNotesData(record.ptNotesData);
      setSelectedFormType('PT Notes');
    } else if (record.type === 'Discharge Summary' && record.dischargeSummaryData) {
      // For discharge summary, we need to handle it differently
      // since it has its own internal state
      setSelectedFormType('Discharge Summary');
      // The form will be populated when it renders
    }
    
    // Remove the draft from clinical records since we're editing it
    setClinicalRecords(clinicalRecords.filter(r => r.id !== record.id));
    
    // Navigate to create module
    setActiveItem('create-module');
    
    toast.info('Draft loaded', {
      description: 'You can now continue editing your draft.',
    });
  };

  return (
    <div className="flex h-screen bg-gray-50">
      <Sidebar activeItem={activeItem} onItemClick={setActiveItem} />
      
      <div className="flex-1 flex flex-col overflow-hidden">
        {/* Sticky Header */}
        <header className="bg-[#3e454b] border-b border-gray-700 px-8 py-4 flex items-center justify-between sticky top-0 z-10 shadow-lg">
          <div className="flex items-center gap-4">
            <div className="flex items-center gap-3">
              <div className="w-10 h-10 rounded-lg bg-white flex items-center justify-center p-1.5">
                <img src="https://i.imgur.com/N2iG3Ic.png" alt="Physiare Logo" className="w-full h-full object-contain" />
              </div>
              <div>
                <h1 className="text-2xl font-semibold text-white">
                  {activeItem === 'create-module'
                    ? 'Create New Record'
                    : activeItem === 'pt-database' 
                    ? 'PT Database' 
                    : activeItem === 'patient-database'
                    ? 'Patient Database'
                    : activeItem === 'clinical-records' 
                    ? 'Clinical Records'
                    : selectedFormType === 'PT Notes'
                    ? 'PT Notes Form' 
                    : 'Initial Evaluation Form'}
                </h1>
                <p className="text-sm text-gray-300 mt-0.5">
                  {activeItem === 'create-module'
                    ? 'Select patient and form type to begin documentation'
                    : activeItem === 'pt-database'
                    ? 'Manage physical therapist records and credentials'
                    : activeItem === 'patient-database'
                    ? 'Manage patient records and medical information'
                    : activeItem === 'clinical-records'
                    ? 'View and manage submitted patient evaluation records'
                    : selectedFormType === 'PT Notes'
                    ? 'Document patient treatment session and progress notes'
                    : 'Complete all sections for comprehensive patient assessment'}
                </p>
              </div>
            </div>
          </div>
          {activeItem !== 'pt-database' && activeItem !== 'patient-database' && activeItem !== 'clinical-records' && activeItem !== 'create-module' && (
            <div className="flex items-center gap-3">
              <Button variant="outline" onClick={handleViewHistory} className="border-gray-500 text-gray-200 hover:bg-[#4a5259] hover:text-white">
                <History className="w-4 h-4 mr-2" />
                View History
              </Button>
              <Button variant="outline" onClick={handleSaveDraft} className="border-gray-500 text-gray-200 hover:bg-[#4a5259] hover:text-white">
                <Save className="w-4 h-4 mr-2" />
                Save Draft
              </Button>
              {selectedFormType === 'PT Notes' ? (
                <Button onClick={handleSubmitPTNote} className="bg-[#b36f49] hover:bg-[#c67f5f] text-white">
                  <Send className="w-4 h-4 mr-2" />
                  Submit Note
                </Button>
              ) : (
                <Button onClick={handleSubmit} className="bg-[#b36f49] hover:bg-[#c67f5f] text-white">
                  <Send className="w-4 h-4 mr-2" />
                  Submit Evaluation
                </Button>
              )}
            </div>
          )}
          {activeItem === 'create-module' && selectedPatient && selectedFormType && (
            <div className="flex items-center gap-3">
              <Button variant="outline" onClick={handleViewHistory} className="border-gray-500 text-gray-200 hover:bg-[#4a5259] hover:text-white">
                <History className="w-4 h-4 mr-2" />
                View History
              </Button>
              <Button variant="outline" onClick={handleSaveDraft} className="border-gray-500 text-gray-200 hover:bg-[#4a5259] hover:text-white">
                <Save className="w-4 h-4 mr-2" />
                Save Draft
              </Button>
              {selectedFormType === 'PT Notes' ? (
                <Button onClick={handleSubmitPTNote} className="bg-[#b36f49] hover:bg-[#c67f5f] text-white">
                  <Send className="w-4 h-4 mr-2" />
                  Submit Note
                </Button>
              ) : (
                <Button onClick={handleSubmit} className="bg-[#b36f49] hover:bg-[#c67f5f] text-white">
                  <Send className="w-4 h-4 mr-2" />
                  Submit Evaluation
                </Button>
              )}
            </div>
          )}
        </header>

        {/* Main Content - Scrollable */}
        <main className="flex-1 overflow-y-auto px-8 py-6">
          <div className="max-w-7xl mx-auto space-y-6">
            {activeItem === 'create-module' ? (
              <>
                <CreateModule
                  patients={patients}
                  selectedPatient={selectedPatient}
                  selectedFormType={selectedFormType}
                  onPatientSelect={handlePatientSelect}
                  onFormTypeSelect={handleFormTypeSelect}
                />
                
                {/* Show form based on selection */}
                {selectedPatient && selectedFormType === 'PT Notes' && (
                  <>
                    <PTNotesForm notesData={ptNotesData} setNotesData={setPTNotesData} therapists={therapists} />
                    
                    {/* Bottom Action Bar */}
                    <div className="flex justify-end gap-3 pb-8 pt-4 border-t border-gray-200">
                      <Button variant="outline" onClick={handleSaveDraft} size="lg">
                        <Save className="w-4 h-4 mr-2" />
                        Save Draft
                      </Button>
                      <Button onClick={handleSubmitPTNote} size="lg" className="bg-[#b36f49] hover:bg-[#c67f5f] text-white">
                        <Send className="w-4 h-4 mr-2" />
                        Submit Note
                      </Button>
                    </div>
                  </>
                )}
                
                {selectedPatient && selectedFormType === 'Initial Evaluation' && (
                  <>
                    <EvaluationHeader formData={formData} setFormData={setFormData} />
                    <PatientInformation formData={formData} setFormData={setFormData} />
                    <SubjectiveAssessment formData={formData} setFormData={setFormData} />
                    <ObjectiveAssessment formData={formData} setFormData={setFormData} />
                    <PTImpression formData={formData} setFormData={setFormData} />
                    <PlanOfCare formData={formData} setFormData={setFormData} />
                    <TherapistInformation formData={formData} setFormData={setFormData} therapists={therapists} />

                    {/* Bottom Action Bar */}
                    <div className="flex justify-end gap-3 pb-8 pt-4 border-t border-gray-200">
                      <Button variant="outline" onClick={handleSaveDraft} size="lg">
                        <Save className="w-4 h-4 mr-2" />
                        Save Draft
                      </Button>
                      <Button onClick={handleSubmit} size="lg" className="bg-[#b36f49] hover:bg-[#c67f5f] text-white">
                        <Send className="w-4 h-4 mr-2" />
                        Submit Evaluation
                      </Button>
                    </div>
                  </>
                )}
                
                {selectedPatient && selectedFormType === 'Discharge Summary' && (() => {
                  const selectedPatientData = patients.find(p => p.id === selectedPatient);
                  
                  // Find the most recent Initial Evaluation for this patient
                  const patientIERecords = clinicalRecords.filter(
                    record => record.type === 'Initial Evaluation' && 
                              record.patientId === selectedPatientData?.patientId
                  ).sort((a, b) => new Date(b.dateCreated).getTime() - new Date(a.dateCreated).getTime());
                  
                  const mostRecentIE = patientIERecords[0];
                  
                  // Extract chiefComplaint and planOfCare from the IE
                  let chiefComplaint = '';
                  let planOfCare = '';
                  
                  if (mostRecentIE?.formData) {
                    chiefComplaint = mostRecentIE.formData.chiefComplaint || '';
                    
                    // Build planOfCare from the IE data
                    const planParts: string[] = [];
                    
                    // Add frequency and duration
                    if (mostRecentIE.formData.frequency) {
                      planParts.push(`Frequency: ${mostRecentIE.formData.frequency}`);
                    }
                    if (mostRecentIE.formData.duration) {
                      planParts.push(`Duration: ${mostRecentIE.formData.duration}`);
                    }
                    
                    // Add short-term goals
                    if (mostRecentIE.formData.shortTermGoals && mostRecentIE.formData.shortTermGoals.length > 0) {
                      planParts.push('\nShort-Term Goals:');
                      mostRecentIE.formData.shortTermGoals.forEach((goal, idx) => {
                        if (goal.goal) {
                          planParts.push(`${idx + 1}. ${goal.goal} (${goal.timeframe || 'TBD'})`);
                        }
                      });
                    }
                    
                    // Add long-term goals
                    if (mostRecentIE.formData.longTermGoals && mostRecentIE.formData.longTermGoals.length > 0) {
                      planParts.push('\nLong-Term Goals:');
                      mostRecentIE.formData.longTermGoals.forEach((goal, idx) => {
                        if (goal.goal) {
                          planParts.push(`${idx + 1}. ${goal.goal} (${goal.timeframe || 'TBD'})`);
                        }
                      });
                    }
                    
                    // Add interventions
                    if (mostRecentIE.formData.interventions && mostRecentIE.formData.interventions.length > 0) {
                      planParts.push('\nInterventions:');
                      mostRecentIE.formData.interventions.forEach((intervention) => {
                        if (intervention) {
                          planParts.push(`• ${intervention}`);
                        }
                      });
                    }
                    
                    // Add plan rows (objective, treatment, rationale)
                    if (mostRecentIE.formData.planRows && mostRecentIE.formData.planRows.length > 0) {
                      planParts.push('\nTreatment Plan:');
                      mostRecentIE.formData.planRows.forEach((row, idx) => {
                        if (row.objective || row.treatment || row.rationale) {
                          planParts.push(`\n${idx + 1}. Objective: ${row.objective || 'N/A'}`);
                          planParts.push(`   Treatment: ${row.treatment || 'N/A'}`);
                          planParts.push(`   Rationale: ${row.rationale || 'N/A'}`);
                        }
                      });
                    }
                    
                    planOfCare = planParts.join('\n');
                  }
                  
                  return (
                    <DischargeSummaryForm
                      patientData={{
                        id: selectedPatientData?.patientId || '',
                        name: selectedPatientData?.patientName || '',
                        dateOfBirth: selectedPatientData?.dateOfBirth || '',
                        sex: selectedPatientData?.sex || '',
                        program: selectedPatientData?.program || '',
                        chiefComplaint: chiefComplaint,
                        planOfCare: planOfCare,
                        referringPhysician: selectedPatientData?.referringPhysician || '',
                      }}
                      therapists={therapists}
                      onSubmit={handleSubmitDischargeSummary}
                      onCancel={() => {
                        setSelectedPatient('');
                        setSelectedFormType(null);
                      }}
                    />
                  );
                })()}
              </>
            ) : activeItem === 'pt-database' ? (
              <PTDatabase
                therapists={therapists}
                onAddTherapist={handleAddTherapist}
                onDeleteTherapist={handleDeleteTherapist}
              />
            ) : activeItem === 'patient-database' ? (
              <PatientDatabase
                patients={patients}
                onAddPatient={handleAddPatient}
                onEditPatient={handleEditPatient}
                onDeletePatient={handleDeletePatient}
              />
            ) : activeItem === 'clinical-records' ? (
              <ClinicalRecords
                records={clinicalRecords}
                onViewRecord={handleViewRecord}
                onDownloadPDF={handleDownloadPDF}
                onEditRecord={handleEditRecord}
              />
            ) : (
              <>
                {/* Form Sections */}
                <EvaluationHeader formData={formData} setFormData={setFormData} />
                <PatientInformation formData={formData} setFormData={setFormData} />
                <SubjectiveAssessment formData={formData} setFormData={setFormData} />
                <ObjectiveAssessment formData={formData} setFormData={setFormData} />
                <PTImpression formData={formData} setFormData={setFormData} />
                <PlanOfCare formData={formData} setFormData={setFormData} />
                <TherapistInformation formData={formData} setFormData={setFormData} therapists={therapists} />

                {/* Bottom Action Bar */}
                <div className="flex justify-end gap-3 pb-8 pt-4 border-t border-gray-200">
                  <Button variant="outline" onClick={handleSaveDraft} size="lg">
                    <Save className="w-4 h-4 mr-2" />
                    Save Draft
                  </Button>
                  <Button onClick={handleSubmit} size="lg" className="bg-[#b36f49] hover:bg-[#c67f5f] text-white">
                    <Send className="w-4 h-4 mr-2" />
                    Submit Evaluation
                  </Button>
                </div>
              </>
            )}
          </div>
        </main>
      </div>

      <Toaster />
    </div>
  );
}