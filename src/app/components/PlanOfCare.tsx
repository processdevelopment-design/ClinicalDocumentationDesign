import { Card } from '@/app/components/ui/card';
import { Label } from '@/app/components/ui/label';
import { Textarea } from '@/app/components/ui/textarea';
import { Input } from '@/app/components/ui/input';
import { Button } from '@/app/components/ui/button';
import { Plus, X } from 'lucide-react';
import { FormData } from '@/app/utils/pdfGenerator';

interface PlanOfCareProps {
  formData: FormData;
  setFormData: React.Dispatch<React.SetStateAction<FormData>>;
}

export function PlanOfCare({ formData, setFormData }: PlanOfCareProps) {
  const addPlanRow = () => {
    setFormData({
      ...formData,
      planRows: [...formData.planRows, { objective: '', treatment: '', rationale: '' }]
    });
  };

  const removePlanRow = (index: number) => {
    if (formData.planRows.length > 1) {
      setFormData({
        ...formData,
        planRows: formData.planRows.filter((_, i) => i !== index)
      });
    }
  };

  const updatePlanRow = (index: number, field: 'objective' | 'treatment' | 'rationale', value: string) => {
    const updated = [...formData.planRows];
    updated[index] = { ...updated[index], [field]: value };
    setFormData({ ...formData, planRows: updated });
  };

  return (
    <Card className="p-6">
      <div className="flex justify-between items-center mb-6">
        <h2 className="text-lg font-semibold text-gray-900">Plan of Care</h2>
        <Button type="button" onClick={addPlanRow} variant="outline" size="sm" className="border-[#b36f49] text-[#b36f49] hover:bg-[#b36f49] hover:text-white">
          <Plus className="w-4 h-4 mr-2" />
          Add Row
        </Button>
      </div>
      
      <div className="space-y-6">
        {/* Three-Column Table */}
        <div className="border border-gray-200 rounded-lg overflow-hidden">
          {/* Table Header */}
          <div className="grid grid-cols-3 bg-[#3e454b] text-white">
            <div className="p-3 border-r border-gray-600">
              <Label className="text-white font-semibold text-sm">Objective per Session</Label>
            </div>
            <div className="p-3 border-r border-gray-600">
              <Label className="text-white font-semibold text-sm">Treatment Plan</Label>
            </div>
            <div className="p-3">
              <Label className="text-white font-semibold text-sm">Rationale</Label>
            </div>
          </div>

          {/* Table Rows */}
          {formData.planRows.map((row, index) => (
            <div key={index} className="grid grid-cols-3 border-t border-gray-200 bg-white hover:bg-gray-50 transition-colors">
              <div className="p-3 border-r border-gray-200">
                <Textarea
                  value={row.objective}
                  onChange={(e) => updatePlanRow(index, 'objective', e.target.value)}
                  placeholder="Enter objective for this session..."
                  rows={4}
                  className="w-full resize-none border-0 focus:ring-0 p-0 text-sm"
                />
              </div>
              <div className="p-3 border-r border-gray-200">
                <Textarea
                  value={row.treatment}
                  onChange={(e) => updatePlanRow(index, 'treatment', e.target.value)}
                  placeholder="Describe treatment approach..."
                  rows={4}
                  className="w-full resize-none border-0 focus:ring-0 p-0 text-sm"
                />
              </div>
              <div className="p-3 flex gap-2">
                <Textarea
                  value={row.rationale}
                  onChange={(e) => updatePlanRow(index, 'rationale', e.target.value)}
                  placeholder="Explain clinical reasoning..."
                  rows={4}
                  className="flex-1 resize-none border-0 focus:ring-0 p-0 text-sm"
                />
                {formData.planRows.length > 1 && (
                  <Button
                    type="button"
                    variant="ghost"
                    size="icon"
                    onClick={() => removePlanRow(index)}
                    className="h-8 w-8 flex-shrink-0 text-red-600 hover:text-red-700 hover:bg-red-50"
                  >
                    <X className="w-4 h-4" />
                  </Button>
                )}
              </div>
            </div>
          ))}
        </div>
      </div>
    </Card>
  );
}