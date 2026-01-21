import { Card } from '@/app/components/ui/card';
import { Label } from '@/app/components/ui/label';
import { Textarea } from '@/app/components/ui/textarea';
import { Input } from '@/app/components/ui/input';
import { FormData } from '@/app/utils/pdfGenerator';

interface SubjectiveAssessmentProps {
  formData: FormData;
  setFormData: React.Dispatch<React.SetStateAction<FormData>>;
}

export function SubjectiveAssessment({ formData, setFormData }: SubjectiveAssessmentProps) {
  return (
    <Card className="p-6">
      <h2 className="text-lg font-semibold text-gray-900 mb-6">Subjective Data</h2>
      
      <div className="space-y-6">
        <div className="space-y-2">
          <Label htmlFor="chief-complaint">Chief Complaint</Label>
          <Textarea
            id="chief-complaint"
            placeholder="Patient's primary concern..."
            rows={3}
            value={formData.chiefComplaint}
            onChange={(e) => setFormData({ ...formData, chiefComplaint: e.target.value })}
          />
        </div>

        <div className="space-y-2">
          <Label htmlFor="onset-date">Date of Onset</Label>
          <Input
            id="onset-date"
            type="date"
            value={formData.onsetDate}
            onChange={(e) => setFormData({ ...formData, onsetDate: e.target.value })}
          />
        </div>

        <div className="space-y-2">
          <Label htmlFor="moi">Mechanism of Injury (MOI)</Label>
          <Textarea
            id="moi"
            placeholder="How the injury occurred..."
            rows={3}
            value={formData.mechanism}
            onChange={(e) => setFormData({ ...formData, mechanism: e.target.value })}
          />
        </div>

        <div className="space-y-2">
          <Label htmlFor="prior-treatment">Prior Treatment History</Label>
          <Textarea
            id="prior-treatment"
            placeholder="Previous treatments, medications, therapies..."
            rows={3}
            value={formData.priorTreatment}
            onChange={(e) => setFormData({ ...formData, priorTreatment: e.target.value })}
          />
        </div>

        <div className="space-y-2">
          <Label htmlFor="current-symptoms">Current Symptoms</Label>
          <Textarea
            id="current-symptoms"
            placeholder="Describe current symptoms..."
            rows={3}
            value={formData.currentSymptoms}
            onChange={(e) => setFormData({ ...formData, currentSymptoms: e.target.value })}
          />
        </div>

        <div className="space-y-2">
          <Label htmlFor="goals">Patient Goals</Label>
          <Textarea
            id="goals"
            placeholder="What patient wants to achieve..."
            rows={3}
            value={formData.goals}
            onChange={(e) => setFormData({ ...formData, goals: e.target.value })}
          />
        </div>
      </div>
    </Card>
  );
}