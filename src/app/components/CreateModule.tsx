import { useState } from "react";
import { User, FileText, ChevronDown } from "lucide-react";
import { Button } from "@/app/components/ui/button";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/app/components/ui/select";
import { Patient } from "@/app/components/PatientDatabase";

export type FormType =
  | "PT Notes"
  | "Initial Evaluation"
  | "Progress Report"
  | null;

interface CreateModuleProps {
  patients: Patient[];
  selectedPatient: string;
  selectedFormType: FormType;
  onPatientSelect: (patientId: string) => void;
  onFormTypeSelect: (formType: FormType) => void;
}

export function CreateModule({
  patients,
  selectedPatient,
  selectedFormType,
  onPatientSelect,
  onFormTypeSelect,
}: CreateModuleProps) {
  const selectedPatientData = patients.find(
    (p) => p.id === selectedPatient,
  );

  return (
    <div className="space-y-6">
      {/* Selection Card */}
      <div className="bg-white rounded-lg shadow-sm border border-gray-200 p-6">
        <h2 className="text-xl font-semibold text-[#3e454b] mb-6">
          Create New Record
        </h2>

        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
          {/* Patient Selection */}
          <div className="space-y-2">
            <label className="block text-sm font-medium text-gray-700">
              <User className="w-4 h-4 inline mr-2" />
              Select Patient
            </label>
            <Select
              value={selectedPatient}
              onValueChange={onPatientSelect}
            >
              <SelectTrigger className="w-full">
                <SelectValue placeholder="Choose patient..." />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="new-patient">
                  <span className="font-semibold text-[#b36f49]">+ New Patient</span>
                </SelectItem>
                {patients.length === 0 ? (
                  <div className="px-2 py-4 text-sm text-gray-500 text-center">
                    No patients in database. Add a patient
                    first.
                  </div>
                ) : (
                  patients.map((patient) => (
                    <SelectItem
                      key={patient.id}
                      value={patient.id}
                    >
                      {patient.patientName} -{" "}
                      {patient.patientId}
                    </SelectItem>
                  ))
                )}
              </SelectContent>
            </Select>
          </div>

          {/* Form Type Selection */}
          <div className="space-y-2">
            <label className="block text-sm font-medium text-gray-700">
              <FileText className="w-4 h-4 inline mr-2" />
              Type of Form
            </label>
            <Select
              value={selectedFormType || ""}
              onValueChange={(value) =>
                onFormTypeSelect(value as FormType)
              }
              disabled={!selectedPatient}
            >
              <SelectTrigger className="w-full">
                <SelectValue placeholder="Choose form type..." />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="PT Notes">
                  PT Notes
                </SelectItem>
                <SelectItem value="Initial Evaluation">
                  Initial Evaluation
                </SelectItem>
                <SelectItem value="Discharge Summary">
                  Progress Report
                </SelectItem>
              </SelectContent>
            </Select>
            {!selectedPatient && (
              <p className="text-xs text-gray-500">
                Select a patient first
              </p>
            )}
          </div>
        </div>

        {/* Patient Info Preview */}
        {selectedPatientData && (
          <div className="mt-6 p-4 bg-gray-50 rounded-lg border border-gray-200">
            <h3 className="text-sm font-semibold text-gray-700 mb-2">
              Selected Patient Information
            </h3>
            <div className="grid grid-cols-2 md:grid-cols-4 gap-4 text-sm">
              <div>
                <p className="text-gray-500">Name</p>
                <p className="font-medium text-gray-900">
                  {selectedPatientData.patientName}
                </p>
              </div>
              <div>
                <p className="text-gray-500">Patient ID</p>
                <p className="font-medium text-gray-900">
                  {selectedPatientData.patientId}
                </p>
              </div>
              <div>
                <p className="text-gray-500">Date of Birth</p>
                <p className="font-medium text-gray-900">
                  {selectedPatientData.dateOfBirth}
                </p>
              </div>
              <div>
                <p className="text-gray-500">Sex</p>
                <p className="font-medium text-gray-900">
                  {selectedPatientData.sex}
                </p>
              </div>
            </div>
          </div>
        )}
        
        {/* New Patient Info */}
        {selectedPatient === 'new-patient' && (
          <div className="mt-6 p-4 bg-green-50 rounded-lg border border-green-200">
            <h3 className="text-sm font-semibold text-green-800 mb-2">
              ✓ New Patient - Initial Evaluation Selected
            </h3>
            <p className="text-sm text-green-700">
              Complete the Initial Evaluation form below. The patient profile will be automatically saved to the Patient Database when you submit or save as draft.
            </p>
          </div>
        )}

        {/* Form Type Preview */}
        {selectedFormType && (
          <div className="mt-4 p-4 bg-blue-50 rounded-lg border border-blue-200">
            <div className="flex items-center gap-3">
              <div className="w-10 h-10 rounded-full bg-blue-100 flex items-center justify-center">
                <FileText className="w-5 h-5 text-blue-600" />
              </div>
              <div>
                <h3 className="text-sm font-semibold text-blue-900">
                  {selectedFormType}
                </h3>
                <p className="text-xs text-blue-700">
                  {selectedFormType === "PT Notes"
                    ? "Document patient treatment session and progress notes"
                    : selectedFormType === "Initial Evaluation"
                      ? "Complete comprehensive patient assessment and evaluation"
                      : "Summarize patient discharge and final assessment"}
                </p>
              </div>
            </div>
          </div>
        )}
      </div>

      {/* Instructions */}
      {(!selectedPatient || !selectedFormType) && (
        <div className="bg-gradient-to-r from-blue-50 to-indigo-50 rounded-lg border border-blue-200 p-6">
          <h3 className="text-lg font-semibold text-[#3e454b] mb-3">
            Getting Started
          </h3>
          <ol className="space-y-2 text-sm text-gray-700">
            <li className="flex items-start gap-2">
              <span className="flex-shrink-0 w-6 h-6 bg-[#b36f49] text-white rounded-full flex items-center justify-center text-xs font-semibold">
                1
              </span>
              <span>
                Select a patient from the dropdown menu above
              </span>
            </li>
            <li className="flex items-start gap-2">
              <span className="flex-shrink-0 w-6 h-6 bg-[#b36f49] text-white rounded-full flex items-center justify-center text-xs font-semibold">
                2
              </span>
              <span>
                Choose the type of form you want to create
              </span>
            </li>
            <li className="flex items-start gap-2">
              <span className="flex-shrink-0 w-6 h-6 bg-[#b36f49] text-white rounded-full flex items-center justify-center text-xs font-semibold">
                3
              </span>
              <span>
                Complete the form and submit to generate a
                clinical record
              </span>
            </li>
          </ol>
          {patients.length === 0 && (
            <div className="mt-4 p-3 bg-yellow-50 border border-yellow-200 rounded-lg">
              <p className="text-sm text-yellow-800">
                <strong>Note:</strong> No patients found in the
                database. Please add a patient in the Patient
                Database first.
              </p>
            </div>
          )}
        </div>
      )}
    </div>
  );
}