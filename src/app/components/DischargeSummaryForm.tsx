import React, { useState, useEffect } from "react";
import { Save, Send } from "lucide-react";
import { SignaturePad } from "@/app/components/SignaturePad";
import { Card } from "@/app/components/ui/card";
import { Input } from "@/app/components/ui/input";
import { Label } from "@/app/components/ui/label";
import { Textarea } from "@/app/components/ui/textarea";
import { Button } from "@/app/components/ui/button";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/app/components/ui/select";
import { PhysicalTherapist } from "@/app/components/PTDatabase";

export interface DischargeSummaryData {
  // Patient Information
  patientId: string;
  patientName: string;
  dateOfBirth: string;
  sex: string;
  summaryDate: string;
  program?: string;
  referringPhysician?: string;

  // A. Presenting Problem List
  chiefComplaint: string;
  problemList: string;

  // B. Goals Achieved
  goalsAchieved: string;

  // C. PT Management Given
  ptManagementGiven: string;

  // D. Recommendation
  recommendation: string;

  // Therapist Information
  therapistName: string;
  therapistLicense: string;
  therapistPosition: string;
  signature: string;
}

interface DischargeSummaryFormProps {
  patientData: {
    id: string;
    name: string;
    dateOfBirth: string;
    sex: string;
    program?: string;
    chiefComplaint?: string;
    planOfCare?: string;
    referringPhysician?: string;
  };
  therapists: PhysicalTherapist[];
  onSubmit: (data: DischargeSummaryData) => void;
  onCancel: () => void;
}

export function DischargeSummaryForm({
  patientData,
  therapists,
  onSubmit,
  onCancel,
}: DischargeSummaryFormProps) {
  const [formData, setFormData] =
    useState<DischargeSummaryData>({
      patientId: patientData.id,
      patientName: patientData.name,
      dateOfBirth: patientData.dateOfBirth,
      sex: patientData.sex,
      summaryDate: new Date().toISOString().split("T")[0],
      program: patientData.program || "",
      chiefComplaint: patientData.chiefComplaint || "",
      problemList: "",
      goalsAchieved: "",
      ptManagementGiven: patientData.planOfCare || "",
      recommendation: "",
      therapistName: "",
      therapistLicense: "",
      therapistPosition: "",
      signature: "",
      referringPhysician: patientData.referringPhysician || "",
    });

  const [errors, setErrors] = useState<Record<string, string>>(
    {},
  );

  const handleChange = (
    e: React.ChangeEvent<
      HTMLInputElement | HTMLTextAreaElement
    >,
  ) => {
    const { name, value } = e.target;
    setFormData((prev) => ({ ...prev, [name]: value }));
    // Clear error when user starts typing
    if (errors[name]) {
      setErrors((prev) => ({ ...prev, [name]: "" }));
    }
  };

  const handleSignatureChange = (signature: string) => {
    setFormData((prev) => ({ ...prev, signature }));
    if (errors.signature) {
      setErrors((prev) => ({ ...prev, signature: "" }));
    }
  };

  const handleTherapistSelect = (therapistId: string) => {
    const selectedTherapist = therapists.find(t => t.id === therapistId);
    if (selectedTherapist) {
      setFormData((prev) => ({
        ...prev,
        therapistName: selectedTherapist.name,
        therapistLicense: selectedTherapist.licenseNumber,
        therapistPosition: selectedTherapist.position,
      }));
      // Clear errors
      if (errors.therapistName) {
        setErrors((prev) => ({ ...prev, therapistName: "" }));
      }
      if (errors.therapistLicense) {
        setErrors((prev) => ({ ...prev, therapistLicense: "" }));
      }
    }
  };

  const validateForm = (): boolean => {
    const newErrors: Record<string, string> = {};

    if (!formData.chiefComplaint.trim()) {
      newErrors.chiefComplaint = "Chief Complaint is required";
    }
    if (!formData.problemList.trim()) {
      newErrors.problemList = "Problem List is required";
    }
    if (!formData.goalsAchieved.trim()) {
      newErrors.goalsAchieved = "Goals Achieved is required";
    }
    if (!formData.ptManagementGiven.trim()) {
      newErrors.ptManagementGiven =
        "PT Management Given is required";
    }
    if (!formData.recommendation.trim()) {
      newErrors.recommendation = "Recommendation is required";
    }
    if (!formData.therapistName.trim()) {
      newErrors.therapistName = "Therapist Name is required";
    }
    if (!formData.therapistLicense.trim()) {
      newErrors.therapistLicense = "License Number is required";
    }
    if (!formData.signature) {
      newErrors.signature = "Signature is required";
    }

    setErrors(newErrors);
    return Object.keys(newErrors).length === 0;
  };

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (validateForm()) {
      onSubmit(formData);
    } else {
      // Scroll to first error
      const firstErrorField = document.querySelector(
        '[data-error="true"]',
      );
      if (firstErrorField) {
        firstErrorField.scrollIntoView({
          behavior: "smooth",
          block: "center",
        });
      }
    }
  };

  return (
    <>
      {/* Patient Information */}
      <Card className="p-6">
        <div className="bg-gray-50 p-4 rounded-lg border border-gray-200 mb-4">
          <h3 className="font-semibold text-[#3e454b] mb-3">
            Patient Information
          </h3>
          <div className="grid grid-cols-2 gap-4 text-sm">
            <div>
              <span className="text-gray-600">Patient Name:</span>{" "}
              <span className="font-medium">{formData.patientName}</span>
            </div>
            <div>
              <span className="text-gray-600">Patient ID:</span>{" "}
              <span className="font-medium">{formData.patientId}</span>
            </div>
            <div>
              <span className="text-gray-600">Date of Birth:</span>{" "}
              <span className="font-medium">{formData.dateOfBirth}</span>
            </div>
            <div>
              <span className="text-gray-600">Sex:</span>{" "}
              <span className="font-medium">{formData.sex}</span>
            </div>
            <div className="space-y-2">
              <Label htmlFor="summaryDate">Summary Date</Label>
              <Input
                id="summaryDate"
                type="date"
                name="summaryDate"
                value={formData.summaryDate}
                onChange={handleChange}
              />
            </div>
            {formData.program && (
              <div>
                <span className="text-gray-600">Program:</span>{" "}
                <span className="font-medium">{formData.program}</span>
              </div>
            )}
            {formData.referringPhysician && (
              <div>
                <span className="text-gray-600">Referring Physician:</span>{" "}
                <span className="font-medium">{formData.referringPhysician}</span>
              </div>
            )}
          </div>
        </div>
      </Card>

      {/* A. Presenting Problem List */}
      <Card className="p-6">
        <h3 className="text-lg font-semibold text-[#3e454b] mb-4 pb-2 border-b-2 border-[#b36f49]">
          A. Presenting Problem List
        </h3>
        <div className="space-y-4">
          <div className="space-y-2">
            <Label htmlFor="chiefComplaint">
              Chief Complaint <span className="text-red-500">*</span>
            </Label>
            <Textarea
              id="chiefComplaint"
              name="chiefComplaint"
              value={formData.chiefComplaint}
              onChange={handleChange}
              rows={3}
              placeholder="Enter chief complaint"
              className={errors.chiefComplaint ? "border-red-500" : ""}
              data-error={!!errors.chiefComplaint}
            />
            {errors.chiefComplaint && (
              <p className="text-red-500 text-sm">{errors.chiefComplaint}</p>
            )}
          </div>

          <div className="space-y-2">
            <Label htmlFor="problemList">
              Problem List <span className="text-red-500">*</span>
            </Label>
            <Textarea
              id="problemList"
              name="problemList"
              value={formData.problemList}
              onChange={handleChange}
              rows={6}
              placeholder="Enter detailed problem list..."
              className={errors.problemList ? "border-red-500" : ""}
              data-error={!!errors.problemList}
            />
            {errors.problemList && (
              <p className="text-red-500 text-sm">{errors.problemList}</p>
            )}
          </div>
        </div>
      </Card>

      {/* B. Goals Achieved */}
      <Card className="p-6">
        <h3 className="text-lg font-semibold text-[#3e454b] mb-4 pb-2 border-b-2 border-[#b36f49]">
          B. Goals Achieved
        </h3>
        <div className="space-y-2">
          <Label htmlFor="goalsAchieved">
            Goals Achieved <span className="text-red-500">*</span>
          </Label>
          <Textarea
            id="goalsAchieved"
            name="goalsAchieved"
            value={formData.goalsAchieved}
            onChange={handleChange}
            rows={6}
            placeholder="Describe the goals that have been achieved during treatment..."
            className={errors.goalsAchieved ? "border-red-500" : ""}
            data-error={!!errors.goalsAchieved}
          />
          {errors.goalsAchieved && (
            <p className="text-red-500 text-sm">{errors.goalsAchieved}</p>
          )}
        </div>
      </Card>

      {/* C. PT Management Given */}
      <Card className="p-6">
        <h3 className="text-lg font-semibold text-[#3e454b] mb-4 pb-2 border-b-2 border-[#b36f49]">
          C. PT Management Given
        </h3>
        <div className="space-y-2">
          <Label htmlFor="ptManagementGiven">
            Plan of Care <span className="text-red-500">*</span>
          </Label>
          <Textarea
            id="ptManagementGiven"
            name="ptManagementGiven"
            value={formData.ptManagementGiven}
            onChange={handleChange}
            rows={8}
            placeholder="Enter PT management given (auto-filled from Initial Evaluation if available)"
            className={errors.ptManagementGiven ? "border-red-500" : ""}
            data-error={!!errors.ptManagementGiven}
          />
          {errors.ptManagementGiven && (
            <p className="text-red-500 text-sm">{errors.ptManagementGiven}</p>
          )}
        </div>
      </Card>

      {/* D. Recommendation */}
      <Card className="p-6">
        <h3 className="text-lg font-semibold text-[#3e454b] mb-4 pb-2 border-b-2 border-[#b36f49]">
          D. Recommendation
        </h3>
        <div className="space-y-2">
          <Label htmlFor="recommendation">
            Recommendation <span className="text-red-500">*</span>
          </Label>
          <Textarea
            id="recommendation"
            name="recommendation"
            value={formData.recommendation}
            onChange={handleChange}
            rows={6}
            placeholder="Enter recommendations for the patient..."
            className={errors.recommendation ? "border-red-500" : ""}
            data-error={!!errors.recommendation}
          />
          {errors.recommendation && (
            <p className="text-red-500 text-sm">{errors.recommendation}</p>
          )}
        </div>
      </Card>

      {/* Prepared By Section */}
      <Card className="p-6">
        <h3 className="text-lg font-semibold text-[#3e454b] mb-4 pb-2 border-b-2 border-[#b36f49]">
          Prepared By
        </h3>
        <div className="space-y-4">
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            <div className="space-y-2">
              <Label htmlFor="therapist">
                PT Name <span className="text-red-500">*</span>
              </Label>
              <Select onValueChange={handleTherapistSelect} value={formData.therapistName}>
                <SelectTrigger
                  id="therapist"
                  className={errors.therapistName ? "border-red-500" : ""}
                  data-error={!!errors.therapistName}
                >
                  <SelectValue placeholder="Select PT Name">
                    {formData.therapistName ? formData.therapistName : "Select PT Name"}
                  </SelectValue>
                </SelectTrigger>
                <SelectContent>
                  {therapists.map((pt) => (
                    <SelectItem key={pt.id} value={pt.id}>
                      {pt.name}
                    </SelectItem>
                  ))}
                </SelectContent>
              </Select>
              {errors.therapistName && (
                <p className="text-red-500 text-sm">{errors.therapistName}</p>
              )}
            </div>

            <div className="space-y-2">
              <Label htmlFor="therapistLicense">
                License Number <span className="text-red-500">*</span>
              </Label>
              <Input
                id="therapistLicense"
                type="text"
                name="therapistLicense"
                value={formData.therapistLicense}
                onChange={handleChange}
                placeholder="Enter license number"
                className={errors.therapistLicense ? "border-red-500" : ""}
                data-error={!!errors.therapistLicense}
              />
              {errors.therapistLicense && (
                <p className="text-red-500 text-sm">{errors.therapistLicense}</p>
              )}
            </div>
          </div>

          <div className="space-y-2">
            <Label>
              Signature <span className="text-red-500">*</span>
            </Label>
            <SignaturePad
              signature={formData.signature}
              onSignatureChange={handleSignatureChange}
            />
            {errors.signature && (
              <p className="text-red-500 text-sm">{errors.signature}</p>
            )}
          </div>
        </div>
      </Card>

      {/* Bottom Action Bar */}
      <div className="flex justify-end gap-3 pb-8 pt-4 border-t border-gray-200">
        <Button variant="outline" onClick={onCancel} size="lg">
          Cancel
        </Button>
        <Button
          onClick={handleSubmit}
          size="lg"
          className="bg-[#b36f49] hover:bg-[#c67f5f] text-white"
        >
          <Send className="w-4 h-4 mr-2" />
          Submit Progress Report
        </Button>
      </div>
    </>
  );
}