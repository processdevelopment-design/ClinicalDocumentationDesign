import { Card } from '@/app/components/ui/card';
import { Input } from '@/app/components/ui/input';
import { Label } from '@/app/components/ui/label';
import { FormData } from '@/app/utils/pdfGenerator';

interface EvaluationHeaderProps {
  formData: FormData;
  setFormData: React.Dispatch<React.SetStateAction<FormData>>;
}

export function EvaluationHeader({ formData, setFormData }: EvaluationHeaderProps) {
  return (
    <Card className="p-6 bg-gradient-to-r from-[#3e454b] to-[#4a5259] border-[#3e454b]">
      <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
        <div className="space-y-2">
          <Label htmlFor="evaluation-date" className="text-white">
            Date of Evaluation
          </Label>
          <Input
            id="evaluation-date"
            type="date"
            value={formData.evaluationDate}
            onChange={(e) => setFormData({ ...formData, evaluationDate: e.target.value })}
            className="bg-white"
          />
        </div>

        <div className="space-y-2">
          <Label htmlFor="branch" className="text-white">
            Branch
          </Label>
          <Input
            id="branch"
            placeholder="Enter branch location"
            value={formData.branch}
            onChange={(e) => setFormData({ ...formData, branch: e.target.value })}
          />
        </div>
      </div>
    </Card>
  );
}