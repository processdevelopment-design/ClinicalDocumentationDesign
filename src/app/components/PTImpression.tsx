import { Card } from '@/app/components/ui/card';
import { Label } from '@/app/components/ui/label';
import { Textarea } from '@/app/components/ui/textarea';
import { FormData } from '@/app/utils/pdfGenerator';

interface PTImpressionProps {
  formData: FormData;
  setFormData: React.Dispatch<React.SetStateAction<FormData>>;
}

export function PTImpression({ formData, setFormData }: PTImpressionProps) {
  return (
    <Card className="p-6">
      <h2 className="text-lg font-semibold text-gray-900 mb-6">Physical Therapy Impression</h2>
      
      <div className="space-y-2">
        <Label htmlFor="impression">Clinical Impression and Diagnosis</Label>
        <Textarea
          id="impression"
          placeholder="Your professional assessment and impression..."
          rows={10}
          value={formData.impression}
          onChange={(e) => setFormData({ ...formData, impression: e.target.value })}
        />
      </div>
    </Card>
  );
}
