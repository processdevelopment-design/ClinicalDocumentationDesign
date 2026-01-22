import { Card } from "@/app/components/ui/card";
import { Input } from "@/app/components/ui/input";
import { Label } from "@/app/components/ui/label";
import {
  RadioGroup,
  RadioGroupItem,
} from "@/app/components/ui/radio-group";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/app/components/ui/select";
import { Button } from "@/app/components/ui/button";
import { Plus, X } from "lucide-react";
import { FormData } from "@/app/utils/pdfGenerator";

const BODY_AREAS = [
  "Shoulder",
  "Knee",
  "Hip",
  "Upper Back",
  "Lower Back",
  "Elbow",
  "Wrist",
  "Ankle",
  "PhysioBeauty",
  "Overall Conditioning",
];

interface PatientInformationProps {
  formData: FormData;
  setFormData: React.Dispatch<React.SetStateAction<FormData>>;
}

export function PatientInformation({
  formData,
  setFormData,
}: PatientInformationProps) {
  const addDiagnosis = () => {
    setFormData({
      ...formData,
      diagnoses: [...formData.diagnoses, ""],
    });
  };

  const removeDiagnosis = (index: number) => {
    setFormData({
      ...formData,
      diagnoses: formData.diagnoses.filter(
        (_, i) => i !== index,
      ),
    });
  };

  const updateDiagnosis = (index: number, value: string) => {
    const updated = [...formData.diagnoses];
    updated[index] = value;
    setFormData({ ...formData, diagnoses: updated });
  };

  const toggleBodyArea = (area: string) => {
    if (formData.selectedBodyAreas.includes(area)) {
      setFormData({
        ...formData,
        selectedBodyAreas: formData.selectedBodyAreas.filter(
          (a) => a !== area,
        ),
      });
    } else {
      setFormData({
        ...formData,
        selectedBodyAreas: [
          ...formData.selectedBodyAreas,
          area,
        ],
      });
    }
  };

  return (
    <Card className="p-8 rounded-xl shadow-sm hover:shadow-md transition-shadow duration-200">
      <h2 className="text-xl font-bold text-[#3e454b] mb-8 flex items-center">
        <span className="w-1.5 h-6 bg-[#b36f49] rounded-full mr-3"></span>
        Patient Information
      </h2>

      <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
        <div className="space-y-2">
          <Label htmlFor="patient-name">Patient Name</Label>
          <Input
            id="patient-name"
            placeholder="Enter patient name"
            defaultValue="John Smith"
            onChange={(e) =>
              setFormData({
                ...formData,
                patientName: e.target.value,
              })
            }
          />
        </div>

        <div className="space-y-2">
          <Label htmlFor="patient-id">Patient ID</Label>
          <Input
            id="patient-id"
            placeholder="Auto-generated"
            defaultValue="PT-2026-0142"
            disabled
          />
        </div>

        <div className="space-y-2">
          <Label htmlFor="dob">Date of Birth</Label>
          <Input
            id="dob"
            type="date"
            defaultValue="1978-03-15"
            onChange={(e) =>
              setFormData({ ...formData, dob: e.target.value })
            }
          />
        </div>

        <div className="space-y-2">
          <Label>Sex</Label>
          <RadioGroup
            defaultValue="male"
            className="flex gap-4"
            onValueChange={(value) =>
              setFormData({ ...formData, sex: value })
            }
          >
            <div className="flex items-center space-x-2">
              <RadioGroupItem value="male" id="male" />
              <Label
                htmlFor="male"
                className="font-normal cursor-pointer"
              >
                Male
              </Label>
            </div>
            <div className="flex items-center space-x-2">
              <RadioGroupItem value="female" id="female" />
              <Label
                htmlFor="female"
                className="font-normal cursor-pointer"
              >
                Female
              </Label>
            </div>
            <div className="flex items-center space-x-2">
              <RadioGroupItem value="other" id="other" />
              <Label
                htmlFor="other"
                className="font-normal cursor-pointer"
              >
                Other
              </Label>
            </div>
          </RadioGroup>
        </div>

        <div className="space-y-2">
          <Label htmlFor="referring-physician">
            Referring Physician
          </Label>
          <Input
            id="referring-physician"
            placeholder="Dr. Name"
            defaultValue="Dr. Sarah Johnson"
            onChange={(e) =>
              setFormData({
                ...formData,
                referringPhysician: e.target.value,
              })
            }
          />
        </div>

        <div className="space-y-2">
          <Label htmlFor="sessions">
            Prescribed Number of Therapy Sessions
          </Label>
          <Input
            id="sessions"
            type="number"
            placeholder="0"
            defaultValue="12"
            onChange={(e) =>
              setFormData({
                ...formData,
                sessions: parseInt(e.target.value),
              })
            }
          />
        </div>

        <div className="space-y-2 md:col-span-2">
          <Label>Medical Diagnosis</Label>
          {formData.diagnoses.map((diagnosis, index) => (
            <div key={index} className="flex gap-2 mb-2">
              <Input
                value={diagnosis}
                onChange={(e) =>
                  updateDiagnosis(index, e.target.value)
                }
                placeholder="Enter diagnosis"
                className="flex-1"
              />
              {formData.diagnoses.length > 1 && (
                <Button
                  type="button"
                  variant="outline"
                  size="icon"
                  onClick={() => removeDiagnosis(index)}
                >
                  <X className="w-4 h-4" />
                </Button>
              )}
            </div>
          ))}
          <Button
            type="button"
            variant="outline"
            onClick={addDiagnosis}
            className="w-full"
          >
            <Plus className="w-4 h-4 mr-2" />
            Add Diagnosis
          </Button>
        </div>

        <div className="space-y-2 md:col-span-2">
          <Label>Program / Case Type</Label>
          <Select
            defaultValue="orthopedic"
            onValueChange={(value) =>
              setFormData({ ...formData, caseType: value })
            }
          >
            <SelectTrigger>
              <SelectValue placeholder="Select case type" />
            </SelectTrigger>
            <SelectContent>
              <SelectItem value="orthopedic">
                Orthopedic Rehabilitation
              </SelectItem>
              <SelectItem value="sports">
                Sports Injury
              </SelectItem>
              <SelectItem value="post-surgical">
                Post-Surgical
              </SelectItem>
              <SelectItem value="neurological">
                Neurological
              </SelectItem>
              <SelectItem value="geriatric">
                Geriatric
              </SelectItem>
              <SelectItem value="pediatric">
                Pediatric
              </SelectItem>
            </SelectContent>
          </Select>
        </div>

        <div className="space-y-3 md:col-span-2">
          <Label className="text-sm font-semibold">Diagnostic Area</Label>
          <div className="flex flex-wrap gap-2">
            {BODY_AREAS.map((area) => (
              <button
                key={area}
                type="button"
                onClick={() => toggleBodyArea(area)}
                className={`px-4 py-2.5 rounded-lg text-sm font-medium transition-all duration-200 ${
                  formData.selectedBodyAreas.includes(area)
                    ? "bg-gradient-to-br from-[#b36f49] to-[#c67f5f] text-white shadow-sm scale-105"
                    : "bg-gray-100 text-gray-700 hover:bg-gray-200 hover:shadow-sm"
                }`}
              >
                {area}
              </button>
            ))}
          </div>
        </div>
      </div>
    </Card>
  );
}