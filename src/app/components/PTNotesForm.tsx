import { Card } from "@/app/components/ui/card";
import { Input } from "@/app/components/ui/input";
import { Label } from "@/app/components/ui/label";
import { Textarea } from "@/app/components/ui/textarea";
import { Button } from "@/app/components/ui/button";
import { Plus, Trash2 } from "lucide-react";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/app/components/ui/select";
import { SignaturePad } from "@/app/components/SignaturePad";
import { PhysicalTherapist } from "@/app/components/PTDatabase";

export interface MachineRow {
  id: string;
  treatment: string;
  area: string;
  duration: string;
  remarks: string;
}

export interface ManualTherapyRow {
  id: string;
  treatment: string;
  area: string;
  duration: string;
  remarks: string;
}

export interface ExerciseRow {
  id: string;
  exercise: string;
  parameters: string;
  remarks: string;
}

export interface PTNotesData {
  // Patient Information
  patientName: string;
  patientId: string;
  dateOfBirth: string;
  sex: string;
  noteDate: string;
  program: string;

  // PT Notes Details
  chiefComplaint: string;
  patientGoal: string;
  vasPainIntensity: number;
  painDescription: string;
  inspectionPalpation: string;
  otherFindings: string;
  machineRows: MachineRow[];
  machinePatientReaction: string;
  manualTherapyRows: ManualTherapyRow[];
  manualTherapyPatientReaction: string;
  exerciseRows: ExerciseRow[];
  exercisePatientReaction: string;

  // PT Information
  therapistName: string;
  therapistLicense: string;
  therapistPosition: string;
  signature: string;
}

interface PTNotesFormProps {
  notesData: PTNotesData;
  setNotesData: React.Dispatch<
    React.SetStateAction<PTNotesData>
  >;
  therapists: PhysicalTherapist[];
}

export function PTNotesForm({
  notesData,
  setNotesData,
  therapists,
}: PTNotesFormProps) {
  // Therapist selection handler
  const handleTherapistSelect = (therapistId: string) => {
    const selected = therapists.find(
      (t) => t.id === therapistId,
    );
    if (selected) {
      setNotesData({
        ...notesData,
        therapistName: selected.name,
        therapistLicense: selected.licenseNumber,
        therapistPosition: selected.position,
      });
    }
  };

  // Machine handlers
  const addMachineRow = () => {
    const newRow: MachineRow = {
      id: Date.now().toString(),
      treatment: "",
      area: "",
      duration: "",
      remarks: "",
    };
    setNotesData({
      ...notesData,
      machineRows: [...notesData.machineRows, newRow],
    });
  };

  const updateMachineRow = (
    id: string,
    field: keyof MachineRow,
    value: string,
  ) => {
    setNotesData({
      ...notesData,
      machineRows: notesData.machineRows.map((row) =>
        row.id === id ? { ...row, [field]: value } : row,
      ),
    });
  };

  const deleteMachineRow = (id: string) => {
    setNotesData({
      ...notesData,
      machineRows: notesData.machineRows.filter(
        (row) => row.id !== id,
      ),
    });
  };

  // Manual Therapy handlers
  const addManualTherapyRow = () => {
    const newRow: ManualTherapyRow = {
      id: Date.now().toString(),
      treatment: "",
      area: "",
      duration: "",
      remarks: "",
    };
    setNotesData({
      ...notesData,
      manualTherapyRows: [
        ...notesData.manualTherapyRows,
        newRow,
      ],
    });
  };

  const updateManualTherapyRow = (
    id: string,
    field: keyof ManualTherapyRow,
    value: string,
  ) => {
    setNotesData({
      ...notesData,
      manualTherapyRows: notesData.manualTherapyRows.map(
        (row) =>
          row.id === id ? { ...row, [field]: value } : row,
      ),
    });
  };

  const deleteManualTherapyRow = (id: string) => {
    setNotesData({
      ...notesData,
      manualTherapyRows: notesData.manualTherapyRows.filter(
        (row) => row.id !== id,
      ),
    });
  };

  // Exercise handlers
  const addExerciseRow = () => {
    const newRow: ExerciseRow = {
      id: Date.now().toString(),
      exercise: "",
      parameters: "",
      remarks: "",
    };
    setNotesData({
      ...notesData,
      exerciseRows: [...notesData.exerciseRows, newRow],
    });
  };

  const updateExerciseRow = (
    id: string,
    field: keyof ExerciseRow,
    value: string,
  ) => {
    setNotesData({
      ...notesData,
      exerciseRows: notesData.exerciseRows.map((row) =>
        row.id === id ? { ...row, [field]: value } : row,
      ),
    });
  };

  const deleteExerciseRow = (id: string) => {
    setNotesData({
      ...notesData,
      exerciseRows: notesData.exerciseRows.filter(
        (row) => row.id !== id,
      ),
    });
  };

  return (
    <div className="space-y-6">
      {/* Patient Information */}
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
              value={notesData.patientName}
              onChange={(e) =>
                setNotesData({
                  ...notesData,
                  patientName: e.target.value,
                })
              }
            />
          </div>

          <div className="space-y-2">
            <Label htmlFor="patient-id">Patient ID</Label>
            <Input
              id="patient-id"
              placeholder="Enter patient ID"
              value={notesData.patientId}
              onChange={(e) =>
                setNotesData({
                  ...notesData,
                  patientId: e.target.value,
                })
              }
            />
          </div>

          <div className="space-y-2">
            <Label htmlFor="dob">Date of Birth</Label>
            <Input
              id="dob"
              type="date"
              value={notesData.dateOfBirth}
              onChange={(e) =>
                setNotesData({
                  ...notesData,
                  dateOfBirth: e.target.value,
                })
              }
            />
          </div>

          <div className="space-y-2">
            <Label htmlFor="sex">Sex</Label>
            <Select
              value={notesData.sex}
              onValueChange={(value) =>
                setNotesData({ ...notesData, sex: value })
              }
            >
              <SelectTrigger id="sex">
                <SelectValue placeholder="Select sex" />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="Male">Male</SelectItem>
                <SelectItem value="Female">Female</SelectItem>
              </SelectContent>
            </Select>
          </div>

          <div className="space-y-2">
            <Label htmlFor="note-date">Treatment Date</Label>
            <Input
              id="note-date"
              type="date"
              value={notesData.noteDate}
              onChange={(e) =>
                setNotesData({
                  ...notesData,
                  noteDate: e.target.value,
                })
              }
            />
          </div>

          <div className="space-y-2">
            <Label htmlFor="program">Program</Label>
            <Input
              id="program"
              placeholder="Enter program name"
              value={notesData.program}
              onChange={(e) =>
                setNotesData({
                  ...notesData,
                  program: e.target.value,
                })
              }
            />
          </div>
        </div>
      </Card>

      {/* Chief Complaint & Patient Goal */}
      <Card className="p-6">
        <div className="space-y-6">
          <div className="space-y-2">
            <Label htmlFor="chief-complaint">
              Chief Complaint
            </Label>
            <Textarea
              id="chief-complaint"
              placeholder="Enter patient's chief complaint..."
              value={notesData.chiefComplaint}
              onChange={(e) =>
                setNotesData({
                  ...notesData,
                  chiefComplaint: e.target.value,
                })
              }
              rows={3}
            />
          </div>

          <div className="space-y-2">
            <Label htmlFor="patient-goal">Patient Goal</Label>
            <Textarea
              id="patient-goal"
              placeholder="Enter patient's goals for treatment..."
              value={notesData.patientGoal}
              onChange={(e) =>
                setNotesData({
                  ...notesData,
                  patientGoal: e.target.value,
                })
              }
              rows={3}
            />
          </div>
        </div>
      </Card>

      {/* Assessment Key Points */}
      <Card className="p-6">
        <h2 className="text-lg font-semibold text-gray-900 mb-6">
          Assessment Key Points
        </h2>

        <div className="space-y-6">
          <div className="space-y-2">
            <Label htmlFor="vas-pain">
              VAS Pain Intensity (0-10)
            </Label>
            <div className="flex items-center gap-4">
              <Input
                id="vas-pain"
                type="number"
                min="0"
                max="10"
                value={notesData.vasPainIntensity}
                onChange={(e) =>
                  setNotesData({
                    ...notesData,
                    vasPainIntensity:
                      parseInt(e.target.value) || 0,
                  })
                }
                className="w-24"
              />
              <input
                type="range"
                min="0"
                max="10"
                value={notesData.vasPainIntensity}
                onChange={(e) =>
                  setNotesData({
                    ...notesData,
                    vasPainIntensity: parseInt(e.target.value),
                  })
                }
                className="flex-1"
              />
              <span className="text-lg font-semibold text-[#b36f49] min-w-[3rem] text-center">
                {notesData.vasPainIntensity}/10
              </span>
            </div>
          </div>

          <div className="space-y-2">
            <Label htmlFor="pain-description">
              Pain Description and Location
            </Label>
            <Textarea
              id="pain-description"
              placeholder="Describe pain characteristics and location..."
              value={notesData.painDescription}
              onChange={(e) =>
                setNotesData({
                  ...notesData,
                  painDescription: e.target.value,
                })
              }
              rows={4}
            />
          </div>

          <div className="space-y-2">
            <Label htmlFor="inspection-palpation">
              Inspection and Palpation
            </Label>
            <Textarea
              id="inspection-palpation"
              placeholder="Document inspection and palpation findings..."
              value={notesData.inspectionPalpation}
              onChange={(e) =>
                setNotesData({
                  ...notesData,
                  inspectionPalpation: e.target.value,
                })
              }
              rows={4}
            />
          </div>

          <div className="space-y-2">
            <Label htmlFor="other-findings">
              Other Pertinent Objective Findings
            </Label>
            <Textarea
              id="other-findings"
              placeholder="Document other relevant objective findings..."
              value={notesData.otherFindings}
              onChange={(e) =>
                setNotesData({
                  ...notesData,
                  otherFindings: e.target.value,
                })
              }
              rows={4}
            />
          </div>
        </div>
      </Card>

      {/* Plan of Care */}
      <Card className="p-6">
        <h2 className="text-lg font-semibold text-gray-900 mb-6">
          Plan of Care
        </h2>

        {/* A. Machine */}
        <div className="mb-8">
          <div className="flex items-center justify-between mb-4">
            <h3 className="text-base font-semibold text-gray-800">
              A. Machine
            </h3>
            <Button
              type="button"
              onClick={addMachineRow}
              size="sm"
              className="bg-[#b36f49] hover:bg-[#c67f5f] text-white"
            >
              <Plus className="w-4 h-4 mr-2" />
              Add Row
            </Button>
          </div>

          {notesData.machineRows.length > 0 && (
            <div className="overflow-x-auto mb-4">
              <table className="w-full border border-gray-200 rounded-lg">
                <thead className="bg-gray-50">
                  <tr>
                    <th className="px-4 py-3 text-left text-sm font-semibold text-gray-700 border-b">
                      Treatment
                    </th>
                    <th className="px-4 py-3 text-left text-sm font-semibold text-gray-700 border-b">
                      Area
                    </th>
                    <th className="px-4 py-3 text-left text-sm font-semibold text-gray-700 border-b">
                      Duration
                    </th>
                    <th className="px-4 py-3 text-left text-sm font-semibold text-gray-700 border-b">
                      Remarks
                    </th>
                    <th className="px-4 py-3 text-center text-sm font-semibold text-gray-700 border-b w-16">
                      Action
                    </th>
                  </tr>
                </thead>
                <tbody>
                  {notesData.machineRows.map((row) => (
                    <tr
                      key={row.id}
                      className="border-b last:border-b-0"
                    >
                      <td className="px-4 py-3">
                        <Input
                          value={row.treatment}
                          onChange={(e) =>
                            updateMachineRow(
                              row.id,
                              "treatment",
                              e.target.value,
                            )
                          }
                          placeholder="Treatment"
                          className="min-w-[150px]"
                        />
                      </td>
                      <td className="px-4 py-3">
                        <Input
                          value={row.area}
                          onChange={(e) =>
                            updateMachineRow(
                              row.id,
                              "area",
                              e.target.value,
                            )
                          }
                          placeholder="Area"
                          className="min-w-[120px]"
                        />
                      </td>
                      <td className="px-4 py-3">
                        <Input
                          value={row.duration}
                          onChange={(e) =>
                            updateMachineRow(
                              row.id,
                              "duration",
                              e.target.value,
                            )
                          }
                          placeholder="Duration"
                          className="min-w-[100px]"
                        />
                      </td>
                      <td className="px-4 py-3">
                        <Input
                          value={row.remarks}
                          onChange={(e) =>
                            updateMachineRow(
                              row.id,
                              "remarks",
                              e.target.value,
                            )
                          }
                          placeholder="Remarks"
                          className="min-w-[150px]"
                        />
                      </td>
                      <td className="px-4 py-3 text-center">
                        <Button
                          type="button"
                          variant="ghost"
                          size="sm"
                          onClick={() =>
                            deleteMachineRow(row.id)
                          }
                          className="text-red-600 hover:text-red-700 hover:bg-red-50"
                        >
                          <Trash2 className="w-4 h-4" />
                        </Button>
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          )}

          <div className="space-y-2">
            <Label htmlFor="machine-reaction">
              Patient Reaction
            </Label>
            <Textarea
              id="machine-reaction"
              placeholder="Document patient's reaction to machine treatments..."
              value={notesData.machinePatientReaction}
              onChange={(e) =>
                setNotesData({
                  ...notesData,
                  machinePatientReaction: e.target.value,
                })
              }
              rows={3}
            />
          </div>
        </div>

        {/* B. Manual Therapy */}
        <div className="mb-8">
          <div className="flex items-center justify-between mb-4">
            <h3 className="text-base font-semibold text-gray-800">
              B. Manual Therapy
            </h3>
            <Button
              type="button"
              onClick={addManualTherapyRow}
              size="sm"
              className="bg-[#b36f49] hover:bg-[#c67f5f] text-white"
            >
              <Plus className="w-4 h-4 mr-2" />
              Add Row
            </Button>
          </div>

          {notesData.manualTherapyRows.length > 0 && (
            <div className="overflow-x-auto mb-4">
              <table className="w-full border border-gray-200 rounded-lg">
                <thead className="bg-gray-50">
                  <tr>
                    <th className="px-4 py-3 text-left text-sm font-semibold text-gray-700 border-b">
                      Treatment
                    </th>
                    <th className="px-4 py-3 text-left text-sm font-semibold text-gray-700 border-b">
                      Area
                    </th>
                    <th className="px-4 py-3 text-left text-sm font-semibold text-gray-700 border-b">
                      Duration
                    </th>
                    <th className="px-4 py-3 text-left text-sm font-semibold text-gray-700 border-b">
                      Remarks
                    </th>
                    <th className="px-4 py-3 text-center text-sm font-semibold text-gray-700 border-b w-16">
                      Action
                    </th>
                  </tr>
                </thead>
                <tbody>
                  {notesData.manualTherapyRows.map((row) => (
                    <tr
                      key={row.id}
                      className="border-b last:border-b-0"
                    >
                      <td className="px-4 py-3">
                        <Input
                          value={row.treatment}
                          onChange={(e) =>
                            updateManualTherapyRow(
                              row.id,
                              "treatment",
                              e.target.value,
                            )
                          }
                          placeholder="Treatment"
                          className="min-w-[150px]"
                        />
                      </td>
                      <td className="px-4 py-3">
                        <Input
                          value={row.area}
                          onChange={(e) =>
                            updateManualTherapyRow(
                              row.id,
                              "area",
                              e.target.value,
                            )
                          }
                          placeholder="Area"
                          className="min-w-[120px]"
                        />
                      </td>
                      <td className="px-4 py-3">
                        <Input
                          value={row.duration}
                          onChange={(e) =>
                            updateManualTherapyRow(
                              row.id,
                              "duration",
                              e.target.value,
                            )
                          }
                          placeholder="Duration"
                          className="min-w-[100px]"
                        />
                      </td>
                      <td className="px-4 py-3">
                        <Input
                          value={row.remarks}
                          onChange={(e) =>
                            updateManualTherapyRow(
                              row.id,
                              "remarks",
                              e.target.value,
                            )
                          }
                          placeholder="Remarks"
                          className="min-w-[150px]"
                        />
                      </td>
                      <td className="px-4 py-3 text-center">
                        <Button
                          type="button"
                          variant="ghost"
                          size="sm"
                          onClick={() =>
                            deleteManualTherapyRow(row.id)
                          }
                          className="text-red-600 hover:text-red-700 hover:bg-red-50"
                        >
                          <Trash2 className="w-4 h-4" />
                        </Button>
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          )}

          <div className="space-y-2">
            <Label htmlFor="manual-therapy-reaction">
              Patient Reaction
            </Label>
            <Textarea
              id="manual-therapy-reaction"
              placeholder="Document patient's reaction to manual therapy..."
              value={notesData.manualTherapyPatientReaction}
              onChange={(e) =>
                setNotesData({
                  ...notesData,
                  manualTherapyPatientReaction: e.target.value,
                })
              }
              rows={3}
            />
          </div>
        </div>

        {/* C. Exercises */}
        <div>
          <div className="flex items-center justify-between mb-4">
            <h3 className="text-base font-semibold text-gray-800">
              C. Exercises
            </h3>
            <Button
              type="button"
              onClick={addExerciseRow}
              size="sm"
              className="bg-[#b36f49] hover:bg-[#c67f5f] text-white"
            >
              <Plus className="w-4 h-4 mr-2" />
              Add Row
            </Button>
          </div>

          {notesData.exerciseRows.length > 0 && (
            <div className="overflow-x-auto mb-4">
              <table className="w-full border border-gray-200 rounded-lg">
                <thead className="bg-gray-50">
                  <tr>
                    <th className="px-4 py-3 text-left text-sm font-semibold text-gray-700 border-b">
                      Exercise
                    </th>
                    <th className="px-4 py-3 text-left text-sm font-semibold text-gray-700 border-b">
                      Parameters
                    </th>
                    <th className="px-4 py-3 text-left text-sm font-semibold text-gray-700 border-b">
                      Remarks
                    </th>
                    <th className="px-4 py-3 text-center text-sm font-semibold text-gray-700 border-b w-16">
                      Action
                    </th>
                  </tr>
                </thead>
                <tbody>
                  {notesData.exerciseRows.map((row) => (
                    <tr
                      key={row.id}
                      className="border-b last:border-b-0"
                    >
                      <td className="px-4 py-3">
                        <Input
                          value={row.exercise}
                          onChange={(e) =>
                            updateExerciseRow(
                              row.id,
                              "exercise",
                              e.target.value,
                            )
                          }
                          placeholder="Exercise"
                          className="min-w-[150px]"
                        />
                      </td>
                      <td className="px-4 py-3">
                        <Input
                          value={row.parameters}
                          onChange={(e) =>
                            updateExerciseRow(
                              row.id,
                              "parameters",
                              e.target.value,
                            )
                          }
                          placeholder="Parameters"
                          className="min-w-[150px]"
                        />
                      </td>
                      <td className="px-4 py-3">
                        <Input
                          value={row.remarks}
                          onChange={(e) =>
                            updateExerciseRow(
                              row.id,
                              "remarks",
                              e.target.value,
                            )
                          }
                          placeholder="Remarks"
                          className="min-w-[150px]"
                        />
                      </td>
                      <td className="px-4 py-3 text-center">
                        <Button
                          type="button"
                          variant="ghost"
                          size="sm"
                          onClick={() =>
                            deleteExerciseRow(row.id)
                          }
                          className="text-red-600 hover:text-red-700 hover:bg-red-50"
                        >
                          <Trash2 className="w-4 h-4" />
                        </Button>
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          )}

          <div className="space-y-2">
            <Label htmlFor="exercise-reaction">
              Patient Reaction
            </Label>
            <Textarea
              id="exercise-reaction"
              placeholder="Document patient's reaction to exercises..."
              value={notesData.exercisePatientReaction}
              onChange={(e) =>
                setNotesData({
                  ...notesData,
                  exercisePatientReaction: e.target.value,
                })
              }
              rows={3}
            />
          </div>
        </div>
      </Card>

      {/* PT Information & Signature */}
      <Card className="p-6">
        <h2 className="text-lg font-semibold text-gray-900 mb-6">
          Physical Therapist Information & Signature
        </h2>

        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
          <div className="space-y-2">
            <Label htmlFor="therapist-select">
              Physical Therapist
            </Label>
            <Select onValueChange={handleTherapistSelect}>
              <SelectTrigger id="therapist-select">
                <SelectValue
                  placeholder={
                    notesData.therapistName ||
                    "Select a therapist"
                  }
                />
              </SelectTrigger>
              <SelectContent>
                {therapists.map((therapist) => (
                  <SelectItem
                    key={therapist.id}
                    value={therapist.id}
                  >
                    {therapist.name}
                  </SelectItem>
                ))}
              </SelectContent>
            </Select>
          </div>

          <div className="space-y-2">
            <Label htmlFor="therapist-license">
              License Number
            </Label>
            <Input
              id="therapist-license"
              placeholder="Auto-loaded from database"
              value={notesData.therapistLicense}
              readOnly
              className="bg-gray-50"
            />
          </div>

          <div className="space-y-2">
            <Label htmlFor="therapist-position">
              Position
            </Label>
            <Input
              id="therapist-position"
              placeholder="Auto-loaded from database"
              value={notesData.therapistPosition}
              readOnly
              className="bg-gray-50"
            />
          </div>

          <div className="space-y-2 md:col-span-2">
            <Label htmlFor="therapist-signature">
              Digital Signature
            </Label>
            <SignaturePad
              signature={notesData.signature}
              onSignatureChange={(sig) =>
                setNotesData({ ...notesData, signature: sig })
              }
            />
          </div>

          <div className="md:col-span-2 mt-4 p-4 bg-blue-50 border border-blue-200 rounded-lg">
            <p className="text-sm text-blue-900">
              <strong>Certification:</strong> I certify that
              this treatment session was performed by me or
              under my direct supervision, and that the
              information contained herein is accurate to the
              best of my knowledge.
            </p>
          </div>
        </div>
      </Card>
    </div>
  );
}