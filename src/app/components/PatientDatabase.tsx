import { useState } from 'react';
import { Button } from '@/app/components/ui/button';
import { Input } from '@/app/components/ui/input';
import { Label } from '@/app/components/ui/label';
import { Plus, Edit, Trash2, X, Check, Search, Eye } from 'lucide-react';

export interface Patient {
  id: string;
  patientName: string;
  patientId: string;
  dateOfBirth: string;
  sex: string;
  referringPhysician: string;
  prescribedSessions: number;
  diagnoses: string[];
  categoricalDiagnosis?: string;
  program: string;
  bodyAreasInvolved: string[];
  lastEditDate: string;
}

interface PatientDatabaseProps {
  patients: Patient[];
  onAddPatient: (patient: Omit<Patient, 'id' | 'lastEditDate'>) => void;
  onEditPatient: (id: string, patient: Omit<Patient, 'id' | 'lastEditDate'>) => void;
  onDeletePatient: (id: string) => void;
}

export function PatientDatabase({ patients, onAddPatient, onEditPatient, onDeletePatient }: PatientDatabaseProps) {
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [isViewModalOpen, setIsViewModalOpen] = useState(false);
  const [editingId, setEditingId] = useState<string | null>(null);
  const [viewingPatient, setViewingPatient] = useState<Patient | null>(null);
  const [searchQuery, setSearchQuery] = useState('');
  const [formData, setFormData] = useState({
    patientName: '',
    patientId: '',
    dateOfBirth: '',
    sex: '',
    referringPhysician: '',
    prescribedSessions: 0,
    diagnoses: [''],
    categoricalDiagnosis: '',
    program: '',
    bodyAreasInvolved: [] as string[],
  });

  const bodyAreaOptions = [
    "Head and Face",
    "TMJ",
    "Cervical",
    "Thoracic",
    "Lumbar",
    "Shoulder",
    "Elbow",
    "Wrist and Hand",
    "Pelvis, Hip and Sacrum",
    "Upper Leg and Knee",
    "Lower Leg, Ankle and Foot",
  ];

  const programOptions = [
    'Standard Physical Therapy Program',
    'Advance Physical Therapy Program',
    'Advance Physical Therapy Program: Back Care',
    'Advance Physical Therapy Program: Women\'s Care',
    'Advance Physical Therapy Program: Pediatric Care',
    'Myofascial RehabTherapy',
    'Conditioning Program',
    'Vitalis Program',
    'Sport Wellness Therapy',
    'Physique Enhancement Treatment',
    'CranioFacial Toning Treatment',
    'Express Slimming Program',
    'Toned Neck Treatment',
    'Collagen Induction PT Augmented Program',
    'Physiaré IV Rehab with Stem Cell',
    'PT-Augmented IV Rehab',
  ];

  const handleOpenModal = (patient?: Patient) => {
    if (patient) {
      setEditingId(patient.id);
      setFormData({
        patientName: patient.patientName,
        patientId: patient.patientId,
        dateOfBirth: patient.dateOfBirth,
        sex: patient.sex,
        referringPhysician: patient.referringPhysician,
        prescribedSessions: patient.prescribedSessions,
        diagnoses: patient.diagnoses.length > 0 ? patient.diagnoses : [''],
        categoricalDiagnosis: patient.categoricalDiagnosis || '',
        program: patient.program,
        bodyAreasInvolved: patient.bodyAreasInvolved,
      });
    } else {
      setEditingId(null);
      setFormData({
        patientName: '',
        patientId: '',
        dateOfBirth: '',
        sex: '',
        referringPhysician: '',
        prescribedSessions: 0,
        diagnoses: [''],
        categoricalDiagnosis: '',
        program: '',
        bodyAreasInvolved: [],
      });
    }
    setIsModalOpen(true);
  };

  const handleCloseModal = () => {
    setIsModalOpen(false);
    setEditingId(null);
  };

  const handleViewPatient = (patient: Patient) => {
    setViewingPatient(patient);
    setIsViewModalOpen(true);
  };

  const handleCloseViewModal = () => {
    setIsViewModalOpen(false);
    setViewingPatient(null);
  };

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    
    const patientData = {
      ...formData,
      diagnoses: formData.diagnoses.filter(d => d.trim() !== ''),
    };

    if (editingId) {
      onEditPatient(editingId, patientData);
    } else {
      onAddPatient(patientData);
    }
    
    handleCloseModal();
  };

  const handleAddDiagnosis = () => {
    setFormData({
      ...formData,
      diagnoses: [...formData.diagnoses, ''],
    });
  };

  const handleRemoveDiagnosis = (index: number) => {
    setFormData({
      ...formData,
      diagnoses: formData.diagnoses.filter((_, i) => i !== index),
    });
  };

  const handleDiagnosisChange = (index: number, value: string) => {
    const newDiagnoses = [...formData.diagnoses];
    newDiagnoses[index] = value;
    setFormData({
      ...formData,
      diagnoses: newDiagnoses,
    });
  };

  const toggleBodyArea = (area: string) => {
    if (formData.bodyAreasInvolved.includes(area)) {
      setFormData({
        ...formData,
        bodyAreasInvolved: formData.bodyAreasInvolved.filter(a => a !== area),
      });
    } else {
      setFormData({
        ...formData,
        bodyAreasInvolved: [...formData.bodyAreasInvolved, area],
      });
    }
  };

  // Filter patients based on search query
  const filteredPatients = patients.filter((patient) => {
    const query = searchQuery.toLowerCase();
    return (
      patient.patientName.toLowerCase().includes(query) ||
      patient.patientId.toLowerCase().includes(query) ||
      patient.program.toLowerCase().includes(query) ||
      patient.sex.toLowerCase().includes(query) ||
      patient.referringPhysician.toLowerCase().includes(query)
    );
  });

  return (
    <div className="space-y-6">
      {/* Header with Add Button */}
      <div className="flex items-center justify-between">
        <div>
          <h2 className="text-xl font-semibold text-[#3e454b]">Patient Database</h2>
          <p className="text-sm text-gray-600 mt-1">Manage patient records and information</p>
        </div>
        <Button onClick={() => handleOpenModal()} className="bg-[#b36f49] hover:bg-[#c67f5f] text-white">
          <Plus className="w-4 h-4 mr-2" />
          Add Patient
        </Button>
      </div>

      {/* Search Bar */}
      <div className="bg-white rounded-lg shadow-sm border border-gray-200 p-4">
        <div className="relative">
          <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400 w-5 h-5" />
          <Input
            type="text"
            placeholder="Search by patient name, ID, program, sex, or physician..."
            value={searchQuery}
            onChange={(e) => setSearchQuery(e.target.value)}
            className="pl-10 w-full"
          />
        </div>
        {searchQuery && (
          <div className="mt-2 text-sm text-gray-600">
            Found {filteredPatients.length} patient{filteredPatients.length !== 1 ? 's' : ''}
          </div>
        )}
      </div>

      {/* Patient Table */}
      <div className="bg-white rounded-lg shadow-sm border border-gray-200 overflow-hidden">
        <div className="overflow-x-auto">
          <table className="w-full">
            <thead className="bg-[#3e454b] text-white">
              <tr>
                <th className="px-6 py-3 text-left text-xs font-medium uppercase tracking-wider">Patient Name</th>
                <th className="px-6 py-3 text-left text-xs font-medium uppercase tracking-wider">Patient ID</th>
                <th className="px-6 py-3 text-left text-xs font-medium uppercase tracking-wider">Date of Birth</th>
                <th className="px-6 py-3 text-left text-xs font-medium uppercase tracking-wider">Sex</th>
                <th className="px-6 py-3 text-left text-xs font-medium uppercase tracking-wider">Program</th>
                <th className="px-6 py-3 text-left text-xs font-medium uppercase tracking-wider">Last Edit Date</th>
                <th className="px-6 py-3 text-left text-xs font-medium uppercase tracking-wider">Actions</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-gray-200">
              {filteredPatients.length === 0 ? (
                <tr>
                  <td colSpan={7} className="px-6 py-8 text-center text-gray-500">
                    {searchQuery ? (
                      <>
                        No patients found matching "<strong>{searchQuery}</strong>".
                        <br />
                        Try a different search term.
                      </>
                    ) : (
                      'No patients added yet. Click "Add Patient" to create your first patient record.'
                    )}
                  </td>
                </tr>
              ) : (
                filteredPatients.map((patient) => (
                  <tr key={patient.id} className="hover:bg-gray-50">
                    <td className="px-6 py-4 whitespace-nowrap">
                      <div className="font-medium text-gray-900">{patient.patientName}</div>
                    </td>
                    <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-600">
                      {patient.patientId}
                    </td>
                    <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-600">
                      {patient.dateOfBirth}
                    </td>
                    <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-600">
                      {patient.sex}
                    </td>
                    <td className="px-6 py-4 text-sm text-gray-600">
                      <div className="max-w-xs truncate">{patient.program}</div>
                    </td>
                    <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-600">
                      {patient.lastEditDate}
                    </td>
                    <td className="px-6 py-4 whitespace-nowrap text-sm">
                      <div className="flex items-center gap-2">
                        <button
                          onClick={() => handleOpenModal(patient)}
                          className="text-[#b36f49] hover:text-[#c67f5f] transition-colors"
                          title="Edit Patient"
                        >
                          <Edit className="w-4 h-4" />
                        </button>
                        <button
                          onClick={() => onDeletePatient(patient.id)}
                          className="text-red-600 hover:text-red-700 transition-colors"
                          title="Delete Patient"
                        >
                          <Trash2 className="w-4 h-4" />
                        </button>
                        <button
                          onClick={() => handleViewPatient(patient)}
                          className="text-[#b36f49] hover:text-[#c67f5f] transition-colors"
                          title="View Patient"
                        >
                          <Eye className="w-4 h-4" />
                        </button>
                      </div>
                    </td>
                  </tr>
                ))
              )}
            </tbody>
          </table>
        </div>
      </div>

      {/* Add/Edit Patient Modal */}
      {isModalOpen && (
        <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50 p-4">
          <div className="bg-white rounded-lg shadow-xl max-w-3xl w-full max-h-[90vh] overflow-y-auto">
            {/* Modal Header */}
            <div className="sticky top-0 bg-[#3e454b] text-white px-6 py-4 flex items-center justify-between border-b border-gray-700">
              <h3 className="text-xl font-semibold">
                {editingId ? 'Edit Patient' : 'Add Patient'}
              </h3>
              <button onClick={handleCloseModal} className="text-gray-300 hover:text-white transition-colors">
                <X className="w-5 h-5" />
              </button>
            </div>

            {/* Modal Content */}
            <form onSubmit={handleSubmit} className="p-6 space-y-6">
              <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                {/* Patient Name */}
                <div className="md:col-span-2">
                  <Label htmlFor="patientName" className="text-sm font-medium text-gray-700">
                    Patient Name *
                  </Label>
                  <Input
                    id="patientName"
                    value={formData.patientName}
                    onChange={(e) => setFormData({ ...formData, patientName: e.target.value })}
                    placeholder="Enter patient's full name"
                    required
                    className="mt-1"
                  />
                </div>

                {/* Patient ID */}
                <div>
                  <Label htmlFor="patientId" className="text-sm font-medium text-gray-700">
                    Patient ID *
                  </Label>
                  <Input
                    id="patientId"
                    value={formData.patientId}
                    onChange={(e) => setFormData({ ...formData, patientId: e.target.value })}
                    placeholder="e.g., PT-2026-0001"
                    required
                    className="mt-1"
                  />
                </div>

                {/* Date of Birth */}
                <div>
                  <Label htmlFor="dateOfBirth" className="text-sm font-medium text-gray-700">
                    Date of Birth *
                  </Label>
                  <Input
                    id="dateOfBirth"
                    type="date"
                    value={formData.dateOfBirth}
                    onChange={(e) => setFormData({ ...formData, dateOfBirth: e.target.value })}
                    required
                    className="mt-1"
                  />
                </div>

                {/* Sex */}
                <div>
                  <Label htmlFor="sex" className="text-sm font-medium text-gray-700">
                    Sex *
                  </Label>
                  <select
                    id="sex"
                    value={formData.sex}
                    onChange={(e) => setFormData({ ...formData, sex: e.target.value })}
                    required
                    className="mt-1 w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-[#b36f49] focus:border-transparent"
                  >
                    <option value="">Select sex</option>
                    <option value="Male">Male</option>
                    <option value="Female">Female</option>
                    <option value="Other">Other</option>
                  </select>
                </div>

                {/* Prescribed Sessions */}
                <div>
                  <Label htmlFor="prescribedSessions" className="text-sm font-medium text-gray-700">
                    Prescribed Number of PT Sessions *
                  </Label>
                  <Input
                    id="prescribedSessions"
                    type="number"
                    min="0"
                    value={formData.prescribedSessions}
                    onChange={(e) => setFormData({ ...formData, prescribedSessions: parseInt(e.target.value) || 0 })}
                    placeholder="Enter number"
                    required
                    className="mt-1"
                  />
                </div>

                {/* Referring Physician */}
                <div className="md:col-span-2">
                  <Label htmlFor="referringPhysician" className="text-sm font-medium text-gray-700">
                    Referring Physician *
                  </Label>
                  <Input
                    id="referringPhysician"
                    value={formData.referringPhysician}
                    onChange={(e) => setFormData({ ...formData, referringPhysician: e.target.value })}
                    placeholder="e.g., Dr. John Smith, MD"
                    required
                    className="mt-1"
                  />
                </div>

                {/* Program */}
                <div className="md:col-span-2">
                  <Label htmlFor="program" className="text-sm font-medium text-gray-700">
                    Program *
                  </Label>
                  <select
                    id="program"
                    value={formData.program}
                    onChange={(e) => setFormData({ ...formData, program: e.target.value })}
                    required
                    className="mt-1 w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-[#b36f49] focus:border-transparent"
                  >
                    <option value="">Select program</option>
                    {programOptions.map((program) => (
                      <option key={program} value={program}>
                        {program}
                      </option>
                    ))}
                  </select>
                </div>

                {/* Medical Diagnoses */}
                <div className="md:col-span-2">
                  <div className="flex items-center justify-between mb-2">
                    <Label className="text-sm font-medium text-gray-700">
                      Medical Diagnosis
                    </Label>
                    <Button
                      type="button"
                      onClick={handleAddDiagnosis}
                      variant="outline"
                      size="sm"
                      className="text-[#b36f49] border-[#b36f49] hover:bg-[#b36f49] hover:text-white"
                    >
                      <Plus className="w-3 h-3 mr-1" />
                      Add Diagnosis
                    </Button>
                  </div>
                  <div className="space-y-2">
                    {formData.diagnoses.map((diagnosis, index) => (
                      <div key={index} className="flex gap-2">
                        <Input
                          value={diagnosis}
                          onChange={(e) => handleDiagnosisChange(index, e.target.value)}
                          placeholder={`Diagnosis ${index + 1}`}
                          className="flex-1"
                        />
                        {formData.diagnoses.length > 1 && (
                          <Button
                            type="button"
                            onClick={() => handleRemoveDiagnosis(index)}
                            variant="outline"
                            size="sm"
                            className="text-red-600 border-red-300 hover:bg-red-50"
                          >
                            <X className="w-4 h-4" />
                          </Button>
                        )}
                      </div>
                    ))}
                  </div>
                </div>

                {/* Diagnostic Areas */}
                <div className="md:col-span-2">
                  <Label className="text-sm font-medium text-gray-700 mb-2 block">
                    Diagnostic Areas
                  </Label>
                  <div className="grid grid-cols-2 md:grid-cols-3 gap-2 max-h-48 overflow-y-auto border border-gray-200 rounded-md p-3 bg-gray-50">
                    {bodyAreaOptions.map((area) => (
                      <label
                        key={area}
                        className="flex items-center gap-2 cursor-pointer hover:bg-white p-2 rounded transition-colors"
                      >
                        <input
                          type="checkbox"
                          checked={formData.bodyAreasInvolved.includes(area)}
                          onChange={() => toggleBodyArea(area)}
                          className="w-4 h-4 text-[#b36f49] border-gray-300 rounded focus:ring-[#b36f49]"
                        />
                        <span className="text-sm text-gray-700">{area}</span>
                      </label>
                    ))}
                  </div>
                </div>
              </div>

              {/* Modal Actions */}
              <div className="flex justify-end gap-3 pt-4 border-t border-gray-200">
                <Button type="button" onClick={handleCloseModal} variant="outline">
                  Cancel
                </Button>
                <Button type="submit" className="bg-[#b36f49] hover:bg-[#c67f5f] text-white">
                  <Check className="w-4 h-4 mr-2" />
                  {editingId ? 'Update Patient' : 'Add Patient'}
                </Button>
              </div>
            </form>
          </div>
        </div>
      )}

      {/* View Patient Modal */}
      {isViewModalOpen && viewingPatient && (
        <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50 p-4">
          <div className="bg-white rounded-lg shadow-xl max-w-3xl w-full max-h-[90vh] overflow-y-auto">
            {/* Modal Header */}
            <div className="sticky top-0 bg-[#3e454b] text-white px-6 py-4 flex items-center justify-between border-b border-gray-700">
              <h3 className="text-xl font-semibold">
                Patient Details
              </h3>
              <button onClick={handleCloseViewModal} className="text-gray-300 hover:text-white transition-colors">
                <X className="w-5 h-5" />
              </button>
            </div>

            {/* Modal Content */}
            <div className="p-6 space-y-6">
              <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                {/* Patient Name */}
                <div className="md:col-span-2">
                  <Label htmlFor="patientName" className="text-sm font-medium text-gray-700">
                    Patient Name
                  </Label>
                  <Input
                    id="patientName"
                    value={viewingPatient.patientName}
                    readOnly
                    className="mt-1"
                  />
                </div>

                {/* Patient ID */}
                <div>
                  <Label htmlFor="patientId" className="text-sm font-medium text-gray-700">
                    Patient ID
                  </Label>
                  <Input
                    id="patientId"
                    value={viewingPatient.patientId}
                    readOnly
                    className="mt-1"
                  />
                </div>

                {/* Date of Birth */}
                <div>
                  <Label htmlFor="dateOfBirth" className="text-sm font-medium text-gray-700">
                    Date of Birth
                  </Label>
                  <Input
                    id="dateOfBirth"
                    type="date"
                    value={viewingPatient.dateOfBirth}
                    readOnly
                    className="mt-1"
                  />
                </div>

                {/* Sex */}
                <div>
                  <Label htmlFor="sex" className="text-sm font-medium text-gray-700">
                    Sex
                  </Label>
                  <select
                    id="sex"
                    value={viewingPatient.sex}
                    readOnly
                    className="mt-1 w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-[#b36f49] focus:border-transparent"
                  >
                    <option value="">Select sex</option>
                    <option value="Male">Male</option>
                    <option value="Female">Female</option>
                    <option value="Other">Other</option>
                  </select>
                </div>

                {/* Prescribed Sessions */}
                <div>
                  <Label htmlFor="prescribedSessions" className="text-sm font-medium text-gray-700">
                    Prescribed Number of PT Sessions
                  </Label>
                  <Input
                    id="prescribedSessions"
                    type="number"
                    min="0"
                    value={viewingPatient.prescribedSessions}
                    readOnly
                    className="mt-1"
                  />
                </div>

                {/* Referring Physician */}
                <div className="md:col-span-2">
                  <Label htmlFor="referringPhysician" className="text-sm font-medium text-gray-700">
                    Referring Physician
                  </Label>
                  <Input
                    id="referringPhysician"
                    value={viewingPatient.referringPhysician}
                    readOnly
                    className="mt-1"
                  />
                </div>

                {/* Program */}
                <div className="md:col-span-2">
                  <Label htmlFor="program" className="text-sm font-medium text-gray-700">
                    Program
                  </Label>
                  <select
                    id="program"
                    value={viewingPatient.program}
                    readOnly
                    className="mt-1 w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-[#b36f49] focus:border-transparent"
                  >
                    <option value="">Select program</option>
                    {programOptions.map((program) => (
                      <option key={program} value={program}>
                        {program}
                      </option>
                    ))}
                  </select>
                </div>

                {/* Medical Diagnoses */}
                <div className="md:col-span-2">
                  <div className="flex items-center justify-between mb-2">
                    <Label className="text-sm font-medium text-gray-700">
                      Medical Diagnosis
                    </Label>
                  </div>
                  <div className="space-y-2">
                    {viewingPatient.diagnoses.map((diagnosis, index) => (
                      <div key={index} className="flex gap-2">
                        <Input
                          value={diagnosis}
                          readOnly
                          placeholder={`Diagnosis ${index + 1}`}
                          className="flex-1"
                        />
                      </div>
                    ))}
                  </div>
                </div>

                {/* Diagnostic Areas */}
                <div className="md:col-span-2">
                  <Label className="text-sm font-medium text-gray-700 mb-2 block">
                    Diagnostic Areas
                  </Label>
                  <div className="grid grid-cols-2 md:grid-cols-3 gap-2 max-h-48 overflow-y-auto border border-gray-200 rounded-md p-3 bg-gray-50">
                    {bodyAreaOptions.map((area) => (
                      <label
                        key={area}
                        className="flex items-center gap-2 cursor-pointer hover:bg-white p-2 rounded transition-colors"
                      >
                        <input
                          type="checkbox"
                          checked={viewingPatient.bodyAreasInvolved.includes(area)}
                          readOnly
                          className="w-4 h-4 text-[#b36f49] border-gray-300 rounded focus:ring-[#b36f49]"
                        />
                        <span className="text-sm text-gray-700">{area}</span>
                      </label>
                    ))}
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}