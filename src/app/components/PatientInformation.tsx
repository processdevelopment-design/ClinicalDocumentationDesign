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

const CATEGORICAL_DIAGNOSES = [
  "Arthroplasty",
  "Atraumatic / RSI Axial Conditions",
  "Atraumatic Sprain-Extremity",
  "Degenerative Spinal Deformities",
  "Idiopathic Scoliosis",
  "IV Disk Pathology c Radiculopathy",
  "IV Disk Pathology s Radiculopathy",
  "Malignancies",
  "Neurologic Conditions",
  "Peripheral Neuropathies",
  "Rheumatoid Conditions",
  "RSI Occupational",
  "Spondylotic Conditions s Radiculopathy",
  "Tendinopathies",
  "Traumatic Long Bone Fractures",
  "Traumatic Short Bone Fractures",
  "Spondylotic Conditions c Radiculopathy",
  "Traumatic Spinal Conditions",
  "Traumatic/ Sports-Related Sprain",
  "Osteoarthritis",
  "Unspecified Joint Stiffness",
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

  const toggleCategoricalDiagnosis = (diagnosis: string) => {
    if (formData.categoricalDiagnoses.includes(diagnosis)) {
      setFormData({
        ...formData,
        categoricalDiagnoses: formData.categoricalDiagnoses.filter(
          (d) => d !== diagnosis,
        ),
      });
    } else {
      setFormData({
        ...formData,
        categoricalDiagnoses: [
          ...formData.categoricalDiagnoses,
          diagnosis,
        ],
      });
    }
  };

  return (
    <Card className="p-6">
      <h2 className="text-lg font-semibold text-gray-900 mb-6">
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
          <Label>Categorical Diagnosis</Label>
          <Select
            value={formData.categoricalDiagnosis || ""}
            onValueChange={(value) =>
              setFormData({ ...formData, categoricalDiagnosis: value })
            }
          >
            <SelectTrigger>
              <SelectValue placeholder="Select categorical diagnosis" />
            </SelectTrigger>
            <SelectContent>
              {CATEGORICAL_DIAGNOSES.map((diagnosis) => (
                <SelectItem key={diagnosis} value={diagnosis}>
                  {diagnosis}
                </SelectItem>
              ))}
            </SelectContent>
          </Select>
        </div>

        <div className="space-y-2 md:col-span-2">
          <Label>Program / Case Type</Label>
          <Select
            value={formData.caseType}
            onValueChange={(value) =>
              setFormData({ ...formData, caseType: value })
            }
          >
            <SelectTrigger>
              <SelectValue placeholder="Select program" />
            </SelectTrigger>
            <SelectContent>
              <SelectItem value="Standard Physical Therapy Program">
                Standard Physical Therapy Program
              </SelectItem>
              <SelectItem value="Advance Physical Therapy Program">
                Advance Physical Therapy Program
              </SelectItem>
              <SelectItem value="Advance Physical Therapy Program: Back Care">
                Advance Physical Therapy Program: Back Care
              </SelectItem>
              <SelectItem value="Advance Physical Therapy Program: Women's Care">
                Advance Physical Therapy Program: Women's Care
              </SelectItem>
              <SelectItem value="Advance Physical Therapy Program: Pediatric Care">
                Advance Physical Therapy Program: Pediatric Care
              </SelectItem>
              <SelectItem value="Myofascial RehabTherapy">
                Myofascial RehabTherapy
              </SelectItem>
              <SelectItem value="Conditioning Program">
                Conditioning Program
              </SelectItem>
              <SelectItem value="Vitalis Program">
                Vitalis Program
              </SelectItem>
              <SelectItem value="Sport Wellness Therapy">
                Sport Wellness Therapy
              </SelectItem>
              <SelectItem value="Physique Enhancement Treatment">
                Physique Enhancement Treatment
              </SelectItem>
              <SelectItem value="CranioFacial Toning Treatment">
                CranioFacial Toning Treatment
              </SelectItem>
              <SelectItem value="Express Slimming Program">
                Express Slimming Program
              </SelectItem>
              <SelectItem value="Toned Neck Treatment">
                Toned Neck Treatment
              </SelectItem>
              <SelectItem value="Collagen Induction PT Augmented Program">
                Collagen Induction PT Augmented Program
              </SelectItem>
              <SelectItem value="Physiaré IV Rehab with Stem Cell">
                Physiaré IV Rehab with Stem Cell
              </SelectItem>
              <SelectItem value="PT-Augmented IV Rehab">
                PT-Augmented IV Rehab
              </SelectItem>
            </SelectContent>
          </Select>
        </div>

        <div className="space-y-2 md:col-span-2">
          <Label>Diagnostic Area</Label>
          <div className="flex flex-wrap gap-2">
            {BODY_AREAS.map((area) => (
              <button
                key={area}
                type="button"
                onClick={() => toggleBodyArea(area)}
                className={`px-4 py-2 rounded-full text-sm font-medium transition-colors ${
                  formData.selectedBodyAreas.includes(area)
                    ? "bg-[#b36f49] text-white border-2 border-[#b36f49]"
                    : "bg-gray-100 text-gray-700 border-2 border-transparent hover:bg-[#c3bbb5] hover:text-gray-800"
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