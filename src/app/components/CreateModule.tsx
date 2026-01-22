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
    <div className="space-y-6 animate-in fade-in duration-300">
      {/* Selection Card */}
      <div className="bg-white rounded-xl shadow-sm border border-gray-200 p-8 hover:shadow-md transition-shadow duration-200">
        <h2 className="text-2xl font-semibold text-[#3e454b] mb-8">
          Create New Record
        </h2>

        <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
          {/* Patient Selection */}
          <div className="space-y-3">
            <label className="flex items-center text-sm font-semibold text-gray-700">
              <User className="w-4 h-4 mr-2 text-[#b36f49]" />
              Select Patient
            </label>
            <Select
              value={selectedPatient}
              onValueChange={onPatientSelect}
            >
              <SelectTrigger className="w-full h-11 hover:border-[#b36f49] focus:border-[#b36f49] transition-colors">
                <SelectValue placeholder="Choose patient..." />
              </SelectTrigger>
              <SelectContent>
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
          <div className="space-y-3">
            <label className="flex items-center text-sm font-semibold text-gray-700">
              <FileText className="w-4 h-4 mr-2 text-[#b36f49]" />
              Type of Form
            </label>
            <Select
              value={selectedFormType || ""}
              onValueChange={(value) =>
                onFormTypeSelect(value as FormType)
              }
              disabled={!selectedPatient}
            >
              <SelectTrigger className="w-full h-11 hover:border-[#b36f49] focus:border-[#b36f49] transition-colors disabled:opacity-50 disabled:cursor-not-allowed">
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
          <div className="mt-8 p-5 bg-gradient-to-br from-gray-50 to-gray-100 rounded-xl border border-gray-200 shadow-sm animate-in slide-in-from-top-2 duration-300">
            <h3 className="text-base font-semibold text-[#3e454b] mb-4 flex items-center">
              <span className="w-1.5 h-5 bg-[#b36f49] rounded-full mr-2"></span>
              Selected Patient Information
            </h3>
            <div className="grid grid-cols-2 md:grid-cols-4 gap-5 text-sm">
              <div>
                <p className="text-xs font-medium text-gray-500 uppercase tracking-wide mb-1">Name</p>
                <p className="font-semibold text-gray-900">
                  {selectedPatientData.patientName}
                </p>
              </div>
              <div>
                <p className="text-xs font-medium text-gray-500 uppercase tracking-wide mb-1">Patient ID</p>
                <p className="font-semibold text-gray-900">
                  {selectedPatientData.patientId}
                </p>
              </div>
              <div>
                <p className="text-xs font-medium text-gray-500 uppercase tracking-wide mb-1">Date of Birth</p>
                <p className="font-semibold text-gray-900">
                  {selectedPatientData.dateOfBirth}
                </p>
              </div>
              <div>
                <p className="text-xs font-medium text-gray-500 uppercase tracking-wide mb-1">Sex</p>
                <p className="font-semibold text-gray-900">
                  {selectedPatientData.sex}
                </p>
              </div>
            </div>
          </div>
        )}

        {/* Form Type Preview */}
        {selectedFormType && (
          <div className="mt-6 p-5 bg-gradient-to-br from-orange-50 to-amber-50 rounded-xl border-2 border-[#b36f49]/20 shadow-sm animate-in slide-in-from-top-2 duration-300">
            <div className="flex items-center gap-4">
              <div className="w-12 h-12 rounded-full bg-white shadow-sm flex items-center justify-center ring-2 ring-[#b36f49]/20">
                <FileText className="w-6 h-6 text-[#b36f49]" />
              </div>
              <div className="flex-1">
                <h3 className="text-base font-bold text-[#3e454b] mb-1">
                  {selectedFormType}
                </h3>
                <p className="text-sm text-gray-600 leading-relaxed">
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
        <div className="bg-gradient-to-br from-amber-50 via-orange-50 to-amber-50 rounded-xl border border-orange-200 p-8 shadow-sm animate-in slide-in-from-bottom-2 duration-300">
          <h3 className="text-xl font-bold text-[#3e454b] mb-6 flex items-center">
            <span className="w-1.5 h-6 bg-[#b36f49] rounded-full mr-3"></span>
            Getting Started
          </h3>
          <ol className="space-y-4 text-sm text-gray-700">
            <li className="flex items-start gap-3">
              <span className="flex-shrink-0 w-8 h-8 bg-gradient-to-br from-[#b36f49] to-[#c67f5f] text-white rounded-full flex items-center justify-center text-sm font-bold shadow-sm">
                1
              </span>
              <span className="pt-1 leading-relaxed">
                <strong className="text-[#3e454b]">Select a patient</strong> from the dropdown menu above
              </span>
            </li>
            <li className="flex items-start gap-3">
              <span className="flex-shrink-0 w-8 h-8 bg-gradient-to-br from-[#b36f49] to-[#c67f5f] text-white rounded-full flex items-center justify-center text-sm font-bold shadow-sm">
                2
              </span>
              <span className="pt-1 leading-relaxed">
                <strong className="text-[#3e454b]">Choose the type of form</strong> you want to create
              </span>
            </li>
            <li className="flex items-start gap-3">
              <span className="flex-shrink-0 w-8 h-8 bg-gradient-to-br from-[#b36f49] to-[#c67f5f] text-white rounded-full flex items-center justify-center text-sm font-bold shadow-sm">
                3
              </span>
              <span className="pt-1 leading-relaxed">
                <strong className="text-[#3e454b]">Complete the form</strong> and submit to generate a clinical record
              </span>
            </li>
          </ol>
          {patients.length === 0 && (
            <div className="mt-6 p-4 bg-yellow-50 border-l-4 border-yellow-400 rounded-lg">
              <p className="text-sm text-yellow-800 leading-relaxed">
                <strong className="font-semibold">Note:</strong> No patients found in the database. Please add a patient in the Patient Database first.
              </p>
            </div>
          )}
        </div>
      )}
    </div>
  );
}