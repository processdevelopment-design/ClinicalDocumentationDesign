import { useState } from "react";
import { Card } from "@/app/components/ui/card";
import { Label } from "@/app/components/ui/label";
import { Textarea } from "@/app/components/ui/textarea";
import { Input } from "@/app/components/ui/input";
import { Slider } from "@/app/components/ui/slider";
import { Button } from "@/app/components/ui/button";
import { Switch } from "@/app/components/ui/switch";
import { Plus, Trash2 } from "lucide-react";
import { FormData } from "@/app/utils/pdfGenerator";

interface ObjectiveAssessmentProps {
  formData: FormData;
  setFormData: React.Dispatch<React.SetStateAction<FormData>>;
}

export function ObjectiveAssessment({
  formData,
  setFormData,
}: ObjectiveAssessmentProps) {
  const [painIntensity, setPainIntensity] = useState([
    formData.painLevel,
  ]);

  const handlePainChange = (value: number[]) => {
    setPainIntensity(value);
    setFormData({ ...formData, painLevel: value[0] });
  };

  return (
    <Card className="p-6">
      <h2 className="text-lg font-semibold text-gray-900 mb-6">
        Objective Assessment
      </h2>

      <div className="space-y-6">
        {/* Pain Assessment */}
        <div className="space-y-4">
          <h3 className="text-base font-semibold text-gray-800 pb-2 border-b">
            Pain Assessment
          </h3>

          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            <div className="space-y-2 md:col-span-2">
              <Label>
                VAS Pain Intensity: {painIntensity[0]}/10
              </Label>
              <Slider
                value={painIntensity}
                onValueChange={handlePainChange}
                max={10}
                step={1}
                className="w-full"
              />
              <div className="flex justify-between text-xs text-gray-500">
                <span>0 - No Pain</span>
                <span>10 - Worst Pain</span>
              </div>
            </div>

            <div className="space-y-2 md:col-span-2">
              <Label htmlFor="pain-location">
                Pain Location
              </Label>
              <Input
                id="pain-location"
                placeholder="Describe pain location..."
                value={formData.painLocation}
                onChange={(e) =>
                  setFormData({
                    ...formData,
                    painLocation: e.target.value,
                  })
                }
              />
            </div>

            <div className="space-y-2">
              <Label htmlFor="pain-aggravating">
                Aggravating Factors
              </Label>
              <Textarea
                id="pain-aggravating"
                placeholder="What makes the pain worse..."
                rows={3}
                value={formData.painAggravatingFactors}
                onChange={(e) =>
                  setFormData({
                    ...formData,
                    painAggravatingFactors: e.target.value,
                  })
                }
              />
            </div>

            <div className="space-y-2">
              <Label htmlFor="pain-alleviating">
                Alleviating Factors
              </Label>
              <Textarea
                id="pain-alleviating"
                placeholder="What makes the pain better..."
                rows={3}
                value={formData.painAlleviatingFactors}
                onChange={(e) =>
                  setFormData({
                    ...formData,
                    painAlleviatingFactors: e.target.value,
                  })
                }
              />
            </div>

            <div className="space-y-2">
              <Label htmlFor="radiating-pain">
                Radiating Pain
              </Label>
              <Input
                id="radiating-pain"
                placeholder="Describe any radiating pain..."
                value={formData.radiatingPain}
                onChange={(e) =>
                  setFormData({
                    ...formData,
                    radiatingPain: e.target.value,
                  })
                }
              />
            </div>

            <div className="space-y-2">
              <Label htmlFor="sleeping-position">
                Sleeping Position
              </Label>
              <Input
                id="sleeping-position"
                placeholder="Describe sleeping position impact..."
                value={formData.sleepingPosition}
                onChange={(e) =>
                  setFormData({
                    ...formData,
                    sleepingPosition: e.target.value,
                  })
                }
              />
            </div>
          </div>
        </div>

        {/* Inspection */}
        <div className="space-y-2">
          <Label htmlFor="inspection">Inspection</Label>
          <Textarea
            id="inspection"
            placeholder="Describe visual observations..."
            rows={3}
            value={formData.inspection}
            onChange={(e) =>
              setFormData({
                ...formData,
                inspection: e.target.value,
              })
            }
          />
        </div>

        {/* Palpation */}
        <div className="space-y-2">
          <Label htmlFor="palpation">Palpation</Label>
          <Textarea
            id="palpation"
            placeholder="Describe palpation findings..."
            rows={3}
            value={formData.palpation}
            onChange={(e) =>
              setFormData({
                ...formData,
                palpation: e.target.value,
              })
            }
          />
        </div>

        {/* Swelling/Edema */}
        <div className="space-y-3">
          <div className="flex items-center gap-3">
            <Label htmlFor="swelling">Swelling / Edema</Label>
            <div className="flex items-center gap-2">
              <Switch
                checked={formData.showSwelling}
                onCheckedChange={(checked) =>
                  setFormData({
                    ...formData,
                    showSwelling: checked,
                  })
                }
              />
              <span className="text-xs text-gray-500">
                {formData.showSwelling
                  ? "Applicable"
                  : "Not Applicable"}
              </span>
            </div>
          </div>
          {formData.showSwelling && (
            <Textarea
              id="swelling"
              placeholder="Describe swelling or edema..."
              rows={2}
              value={formData.swelling}
              onChange={(e) =>
                setFormData({
                  ...formData,
                  swelling: e.target.value,
                })
              }
            />
          )}
        </div>

        {/* Range of Motion */}
        <div className="space-y-3">
          <div className="flex items-center justify-between">
            <div className="flex items-center gap-3">
              <Label>Range of Motion (AROM/PROM)</Label>
              <div className="flex items-center gap-2">
                <Switch
                  checked={formData.showRangeOfMotion}
                  onCheckedChange={(checked) =>
                    setFormData({
                      ...formData,
                      showRangeOfMotion: checked,
                    })
                  }
                />
                <span className="text-xs text-gray-500">
                  {formData.showRangeOfMotion
                    ? "Applicable"
                    : "Not Applicable"}
                </span>
              </div>
            </div>
            <Button
              type="button"
              variant="outline"
              size="sm"
              onClick={() => {
                setFormData({
                  ...formData,
                  rangeOfMotion: [
                    ...formData.rangeOfMotion,
                    {
                      motion: "",
                      left: "",
                      right: "",
                      endFeel: "",
                    },
                  ],
                });
              }}
              className="text-[#b36f49] border-[#b36f49] hover:bg-[#b36f49] hover:text-white"
            >
              <Plus className="w-4 h-4 mr-1" />
              Add Joint
            </Button>
          </div>

          <div className="border rounded-lg overflow-hidden">
            <table className="w-full">
              <thead className="bg-[#3e454b] text-white">
                <tr>
                  <th className="text-left px-3 py-2 text-sm font-semibold">
                    Motion
                  </th>
                  <th className="text-left px-3 py-2 text-sm font-semibold w-24">
                    Left
                  </th>
                  <th className="text-left px-3 py-2 text-sm font-semibold w-24">
                    Right
                  </th>
                  <th className="text-left px-3 py-2 text-sm font-semibold">
                    End Feel
                  </th>
                  <th className="w-12"></th>
                </tr>
              </thead>
              <tbody className="divide-y divide-gray-200">
                {formData.rangeOfMotion.length === 0 ? (
                  <tr>
                    <td
                      colSpan={5}
                      className="px-3 py-8 text-center text-gray-500 text-sm"
                    >
                      No range of motion assessments added.
                      Click "Add Joint" to begin.
                    </td>
                  </tr>
                ) : (
                  formData.rangeOfMotion.map((rom, index) => (
                    <tr
                      key={index}
                      className="bg-white hover:bg-gray-50"
                    >
                      <td className="px-3 py-2">
                        <Input
                          placeholder="e.g., Shoulder Flexion PROM"
                          value={rom.motion}
                          onChange={(e) => {
                            const updated = [
                              ...formData.rangeOfMotion,
                            ];
                            updated[index].motion =
                              e.target.value;
                            setFormData({
                              ...formData,
                              rangeOfMotion: updated,
                            });
                          }}
                          className="border-0 focus:ring-1 focus:ring-[#b36f49]"
                        />
                      </td>
                      <td className="px-3 py-2">
                        <Input
                          placeholder="e.g., 150°"
                          value={rom.left}
                          onChange={(e) => {
                            const updated = [
                              ...formData.rangeOfMotion,
                            ];
                            updated[index].left =
                              e.target.value;
                            setFormData({
                              ...formData,
                              rangeOfMotion: updated,
                            });
                          }}
                          className="border-0 focus:ring-1 focus:ring-[#b36f49]"
                        />
                      </td>
                      <td className="px-3 py-2">
                        <Input
                          placeholder="e.g., 145°"
                          value={rom.right}
                          onChange={(e) => {
                            const updated = [
                              ...formData.rangeOfMotion,
                            ];
                            updated[index].right =
                              e.target.value;
                            setFormData({
                              ...formData,
                              rangeOfMotion: updated,
                            });
                          }}
                          className="border-0 focus:ring-1 focus:ring-[#b36f49]"
                        />
                      </td>
                      <td className="px-3 py-2">
                        <Input
                          placeholder="e.g., Firm"
                          value={rom.endFeel}
                          onChange={(e) => {
                            const updated = [
                              ...formData.rangeOfMotion,
                            ];
                            updated[index].endFeel =
                              e.target.value;
                            setFormData({
                              ...formData,
                              rangeOfMotion: updated,
                            });
                          }}
                          className="border-0 focus:ring-1 focus:ring-[#b36f49]"
                        />
                      </td>
                      <td className="px-3 py-2">
                        <Button
                          type="button"
                          variant="ghost"
                          size="sm"
                          onClick={() => {
                            const updated =
                              formData.rangeOfMotion.filter(
                                (_, i) => i !== index,
                              );
                            setFormData({
                              ...formData,
                              rangeOfMotion: updated,
                            });
                          }}
                          className="text-red-600 hover:text-red-700 hover:bg-red-50"
                        >
                          <Trash2 className="w-4 h-4" />
                        </Button>
                      </td>
                    </tr>
                  ))
                )}
              </tbody>
            </table>
          </div>
        </div>

        {/* Muscle Strength */}
        <div className="space-y-3">
          <div className="flex items-center justify-between">
            <div className="flex items-center gap-3">
              <Label>Muscle Strength (MMT)</Label>
              <div className="flex items-center gap-2">
                <Switch
                  checked={formData.showMMT}
                  onCheckedChange={(checked) =>
                    setFormData({
                      ...formData,
                      showMMT: checked,
                    })
                  }
                />
                <span className="text-xs text-gray-500">
                  {formData.showMMT
                    ? "Applicable"
                    : "Not Applicable"}
                </span>
              </div>
            </div>
            <Button
              type="button"
              variant="outline"
              size="sm"
              onClick={() => {
                setFormData({
                  ...formData,
                  muscleStrength: [
                    ...formData.muscleStrength,
                    {
                      muscle: "",
                      left: "",
                      right: "",
                      remarks: "",
                    },
                  ],
                });
              }}
              className="text-[#b36f49] border-[#b36f49] hover:bg-[#b36f49] hover:text-white"
            >
              <Plus className="w-4 h-4 mr-1" />
              Add Muscle
            </Button>
          </div>

          <div className="border rounded-lg overflow-hidden">
            <table className="w-full">
              <thead className="bg-[#3e454b] text-white">
                <tr>
                  <th className="text-left px-3 py-2 text-sm font-semibold">
                    Muscle
                  </th>
                  <th className="text-left px-3 py-2 text-sm font-semibold w-24">
                    Left
                  </th>
                  <th className="text-left px-3 py-2 text-sm font-semibold w-24">
                    Right
                  </th>
                  <th className="text-left px-3 py-2 text-sm font-semibold">
                    Remarks
                  </th>
                  <th className="w-12"></th>
                </tr>
              </thead>
              <tbody className="divide-y divide-gray-200">
                {formData.muscleStrength.length === 0 ? (
                  <tr>
                    <td
                      colSpan={5}
                      className="px-3 py-8 text-center text-gray-500 text-sm"
                    >
                      No muscle strength assessments added.
                      Click "Add Muscle" to begin.
                    </td>
                  </tr>
                ) : (
                  formData.muscleStrength.map((mmt, index) => (
                    <tr
                      key={index}
                      className="bg-white hover:bg-gray-50"
                    >
                      <td className="px-3 py-2">
                        <Input
                          placeholder="e.g., Shoulder Flexors"
                          value={mmt.muscle}
                          onChange={(e) => {
                            const updated = [
                              ...formData.muscleStrength,
                            ];
                            updated[index].muscle =
                              e.target.value;
                            setFormData({
                              ...formData,
                              muscleStrength: updated,
                            });
                          }}
                          className="border-0 focus:ring-1 focus:ring-[#b36f49]"
                        />
                      </td>
                      <td className="px-3 py-2">
                        <Input
                          placeholder="0-5"
                          value={mmt.left}
                          onChange={(e) => {
                            const updated = [
                              ...formData.muscleStrength,
                            ];
                            updated[index].left =
                              e.target.value;
                            setFormData({
                              ...formData,
                              muscleStrength: updated,
                            });
                          }}
                          className="border-0 focus:ring-1 focus:ring-[#b36f49]"
                        />
                      </td>
                      <td className="px-3 py-2">
                        <Input
                          placeholder="0-5"
                          value={mmt.right}
                          onChange={(e) => {
                            const updated = [
                              ...formData.muscleStrength,
                            ];
                            updated[index].right =
                              e.target.value;
                            setFormData({
                              ...formData,
                              muscleStrength: updated,
                            });
                          }}
                          className="border-0 focus:ring-1 focus:ring-[#b36f49]"
                        />
                      </td>
                      <td className="px-3 py-2">
                        <Input
                          placeholder="Additional notes..."
                          value={mmt.remarks}
                          onChange={(e) => {
                            const updated = [
                              ...formData.muscleStrength,
                            ];
                            updated[index].remarks =
                              e.target.value;
                            setFormData({
                              ...formData,
                              muscleStrength: updated,
                            });
                          }}
                          className="border-0 focus:ring-1 focus:ring-[#b36f49]"
                        />
                      </td>
                      <td className="px-3 py-2">
                        <Button
                          type="button"
                          variant="ghost"
                          size="sm"
                          onClick={() => {
                            const updated =
                              formData.muscleStrength.filter(
                                (_, i) => i !== index,
                              );
                            setFormData({
                              ...formData,
                              muscleStrength: updated,
                            });
                          }}
                          className="text-red-600 hover:text-red-700 hover:bg-red-50"
                        >
                          <Trash2 className="w-4 h-4" />
                        </Button>
                      </td>
                    </tr>
                  ))
                )}
              </tbody>
            </table>
          </div>
        </div>

        {/* Special Tests */}
        <div className="space-y-3">
          <div className="flex items-center justify-between">
            <div className="flex items-center gap-3">
              <Label>Special Tests</Label>
              <div className="flex items-center gap-2">
                <Switch
                  checked={formData.showSpecialTests}
                  onCheckedChange={(checked) =>
                    setFormData({
                      ...formData,
                      showSpecialTests: checked,
                    })
                  }
                />
                <span className="text-xs text-gray-500">
                  {formData.showSpecialTests
                    ? "Applicable"
                    : "Not Applicable"}
                </span>
              </div>
            </div>
            <Button
              type="button"
              variant="outline"
              size="sm"
              onClick={() => {
                setFormData({
                  ...formData,
                  specialTests: [
                    ...formData.specialTests,
                    {
                      test: "",
                      left: "",
                      right: "",
                      remarks: "",
                    },
                  ],
                });
              }}
              className="text-[#b36f49] border-[#b36f49] hover:bg-[#b36f49] hover:text-white"
            >
              <Plus className="w-4 h-4 mr-1" />
              Add Test
            </Button>
          </div>

          <div className="border rounded-lg overflow-hidden">
            <table className="w-full">
              <thead className="bg-[#3e454b] text-white">
                <tr>
                  <th className="text-left px-2 py-2 text-sm font-semibold">
                    Special Test
                  </th>
                  <th className="text-left px-2 py-2 text-sm font-semibold w-24">
                    Left
                  </th>
                  <th className="text-left px-2 py-2 text-sm font-semibold w-24">
                    Right
                  </th>
                  <th className="text-left px-2 py-2 text-sm font-semibold">
                    Remarks
                  </th>
                  <th className="w-12"></th>
                </tr>
              </thead>
              <tbody className="divide-y divide-gray-200">
                {formData.specialTests.length === 0 ? (
                  <tr>
                    <td
                      colSpan={5}
                      className="px-3 py-8 text-center text-gray-500 text-sm"
                    >
                      No special tests added. Click "Add Test"
                      to begin.
                    </td>
                  </tr>
                ) : (
                  formData.specialTests.map((test, index) => (
                    <tr
                      key={index}
                      className="bg-white hover:bg-gray-50"
                    >
                      <td className="px-3 py-2">
                        <Input
                          placeholder="e.g., Hawkins-Kennedy"
                          value={test.test}
                          onChange={(e) => {
                            const updated = [
                              ...formData.specialTests,
                            ];
                            updated[index].test =
                              e.target.value;
                            setFormData({
                              ...formData,
                              specialTests: updated,
                            });
                          }}
                          className="border-0 focus:ring-1 focus:ring-[#b36f49]"
                        />
                      </td>
                      <td className="px-3 py-2">
                        <Input
                          placeholder="+ / -"
                          value={test.left}
                          onChange={(e) => {
                            const updated = [
                              ...formData.specialTests,
                            ];
                            updated[index].left =
                              e.target.value;
                            setFormData({
                              ...formData,
                              specialTests: updated,
                            });
                          }}
                          className="border-0 focus:ring-1 focus:ring-[#b36f49]"
                        />
                      </td>
                      <td className="px-3 py-2">
                        <Input
                          placeholder="+ / -"
                          value={test.right}
                          onChange={(e) => {
                            const updated = [
                              ...formData.specialTests,
                            ];
                            updated[index].right =
                              e.target.value;
                            setFormData({
                              ...formData,
                              specialTests: updated,
                            });
                          }}
                          className="border-0 focus:ring-1 focus:ring-[#b36f49]"
                        />
                      </td>
                      <td className="px-3 py-2">
                        <Input
                          placeholder="Additional notes..."
                          value={test.remarks}
                          onChange={(e) => {
                            const updated = [
                              ...formData.specialTests,
                            ];
                            updated[index].remarks =
                              e.target.value;
                            setFormData({
                              ...formData,
                              specialTests: updated,
                            });
                          }}
                          className="border-0 focus:ring-1 focus:ring-[#b36f49]"
                        />
                      </td>
                      <td className="px-3 py-2">
                        <Button
                          type="button"
                          variant="ghost"
                          size="sm"
                          onClick={() => {
                            const updated =
                              formData.specialTests.filter(
                                (_, i) => i !== index,
                              );
                            setFormData({
                              ...formData,
                              specialTests: updated,
                            });
                          }}
                          className="text-red-600 hover:text-red-700 hover:bg-red-50"
                        >
                          <Trash2 className="w-4 h-4" />
                        </Button>
                      </td>
                    </tr>
                  ))
                )}
              </tbody>
            </table>
          </div>
        </div>

        {/* Posture */}
        <div className="space-y-3">
          <div className="flex items-center justify-between">
            <Label>Postural Assessment</Label>
            <Button
              type="button"
              variant="outline"
              size="sm"
              onClick={() => {
                setFormData({
                  ...formData,
                  posture: [
                    ...formData.posture,
                    {
                      anterior: "",
                      posterior: "",
                      sagittal: "",
                    },
                  ],
                });
              }}
              className="text-[#b36f49] border-[#b36f49] hover:bg-[#b36f49] hover:text-white"
            >
              <Plus className="w-4 h-4 mr-1" />
              Add Row
            </Button>
          </div>

          <div className="border rounded-lg overflow-hidden">
            <table className="w-full">
              <thead className="bg-[#3e454b] text-white">
                <tr>
                  <th className="text-left px-3 py-2 text-sm font-semibold">
                    ANTERIOR (indicate L/R)
                  </th>
                  <th className="text-left px-3 py-2 text-sm font-semibold">
                    POSTERIOR (indicate L/R)
                  </th>
                  <th className="text-left px-3 py-2 text-sm font-semibold">
                    SAGITTAL (indicate L/R)
                  </th>
                  <th className="w-12"></th>
                </tr>
              </thead>
              <tbody className="divide-y divide-gray-200">
                {formData.posture.length === 0 ? (
                  <tr>
                    <td
                      colSpan={4}
                      className="px-3 py-8 text-center text-gray-500 text-sm"
                    >
                      No postural assessments added. Click "Add
                      Row" to begin.
                    </td>
                  </tr>
                ) : (
                  formData.posture.map((posture, index) => (
                    <tr
                      key={index}
                      className="bg-white hover:bg-gray-50"
                    >
                      <td className="px-3 py-2">
                        <Input
                          placeholder="e.g., Forward head posture"
                          value={posture.anterior}
                          onChange={(e) => {
                            const updated = [
                              ...formData.posture,
                            ];
                            updated[index].anterior =
                              e.target.value;
                            setFormData({
                              ...formData,
                              posture: updated,
                            });
                          }}
                          className="border-0 focus:ring-1 focus:ring-[#b36f49]"
                        />
                      </td>
                      <td className="px-3 py-2">
                        <Input
                          placeholder="e.g., Increased thoracic kyphosis"
                          value={posture.posterior}
                          onChange={(e) => {
                            const updated = [
                              ...formData.posture,
                            ];
                            updated[index].posterior =
                              e.target.value;
                            setFormData({
                              ...formData,
                              posture: updated,
                            });
                          }}
                          className="border-0 focus:ring-1 focus:ring-[#b36f49]"
                        />
                      </td>
                      <td className="px-3 py-2">
                        <Input
                          placeholder="e.g., Protracted scapulae (R>L)"
                          value={posture.sagittal}
                          onChange={(e) => {
                            const updated = [
                              ...formData.posture,
                            ];
                            updated[index].sagittal =
                              e.target.value;
                            setFormData({
                              ...formData,
                              posture: updated,
                            });
                          }}
                          className="border-0 focus:ring-1 focus:ring-[#b36f49]"
                        />
                      </td>
                      <td className="px-3 py-2">
                        <Button
                          type="button"
                          variant="ghost"
                          size="sm"
                          onClick={() => {
                            const updated =
                              formData.posture.filter(
                                (_, i) => i !== index,
                              );
                            setFormData({
                              ...formData,
                              posture: updated,
                            });
                          }}
                          className="text-red-600 hover:text-red-700 hover:bg-red-50"
                        >
                          <Trash2 className="w-4 h-4" />
                        </Button>
                      </td>
                    </tr>
                  ))
                )}
              </tbody>
            </table>
          </div>
        </div>

        {/* Gait */}
        <div className="space-y-2">
          <div className="flex items-center gap-3">
            <Label htmlFor="gait">Gait Assessment</Label>
            <div className="flex items-center gap-2">
              <Switch
                checked={formData.showGait}
                onCheckedChange={(checked) =>
                  setFormData({
                    ...formData,
                    showGait: checked,
                  })
                }
              />
              <span className="text-xs text-gray-500">
                {formData.showGait
                  ? "Applicable"
                  : "Not Applicable"}
              </span>
            </div>
          </div>
          <Textarea
            id="gait"
            placeholder="Describe gait pattern..."
            rows={3}
            value={formData.gait}
            onChange={(e) =>
              setFormData({ ...formData, gait: e.target.value })
            }
          />
        </div>

        {/* Neurological */}
        <div className="space-y-2">
          <div className="flex items-center gap-3">
            <Label htmlFor="neuro">
              Neurological Assessment
            </Label>
            <div className="flex items-center gap-2">
              <Switch
                checked={formData.showNeurological}
                onCheckedChange={(checked) =>
                  setFormData({
                    ...formData,
                    showNeurological: checked,
                  })
                }
              />
              <span className="text-xs text-gray-500">
                {formData.showNeurological
                  ? "Applicable"
                  : "Not Applicable"}
              </span>
            </div>
          </div>
          <Textarea
            id="neuro"
            placeholder="Describe neurological findings..."
            rows={3}
            value={formData.neurological}
            onChange={(e) =>
              setFormData({
                ...formData,
                neurological: e.target.value,
              })
            }
          />
        </div>

        {/* Functional */}
        <div className="space-y-2">
          <div className="flex items-center gap-3">
            <Label htmlFor="functional">
              Functional Assessment
            </Label>
            <div className="flex items-center gap-2">
              <Switch
                checked={formData.showFunctional}
                onCheckedChange={(checked) =>
                  setFormData({
                    ...formData,
                    showFunctional: checked,
                  })
                }
              />
              <span className="text-xs text-gray-500">
                {formData.showFunctional
                  ? "Applicable"
                  : "Not Applicable"}
              </span>
            </div>
          </div>
          <Textarea
            id="functional"
            placeholder="Describe functional limitations and test results..."
            rows={3}
            value={formData.functional}
            onChange={(e) =>
              setFormData({
                ...formData,
                functional: e.target.value,
              })
            }
          />
        </div>
      </div>
    </Card>
  );
}