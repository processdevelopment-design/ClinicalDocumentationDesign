import { Card } from '@/app/components/ui/card';
import { Input } from '@/app/components/ui/input';
import { Label } from '@/app/components/ui/label';
import { SignaturePad } from '@/app/components/SignaturePad';
import { FormData } from '@/app/utils/pdfGenerator';

interface TherapistSignatureProps {
  formData: FormData;
  setFormData: React.Dispatch<React.SetStateAction<FormData>>;
}

export function TherapistSignature({ formData, setFormData }: TherapistSignatureProps) {
  return (
    <Card className="p-6">
      <h2 className="text-lg font-semibold text-gray-900 mb-6">
        Physical Therapist Information & Signature
      </h2>

      <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
        <div className="space-y-2">
          <Label htmlFor="therapist-name">Physical Therapist Name</Label>
          <Input
            id="therapist-name"
            placeholder="Enter full name"
            value={formData.therapistName}
            onChange={(e) => setFormData({ ...formData, therapistName: e.target.value })}
          />
        </div>

        <div className="space-y-2">
          <Label htmlFor="therapist-license">License Number</Label>
          <Input
            id="therapist-license"
            placeholder="Enter license number"
            value={formData.therapistLicense}
            onChange={(e) => setFormData({ ...formData, therapistLicense: e.target.value })}
          />
        </div>

        <div className="space-y-2">
          <Label htmlFor="evaluation-date">Date of Evaluation</Label>
          <Input
            id="evaluation-date"
            type="date"
            value={formData.evaluationDate}
            onChange={(e) => setFormData({ ...formData, evaluationDate: e.target.value })}
          />
        </div>

        <div className="space-y-2">
          <Label htmlFor="next-visit">Next Scheduled Visit</Label>
          <Input
            id="next-visit"
            type="date"
          />
        </div>

        <div className="space-y-2 md:col-span-2">
          <Label htmlFor="therapist-signature">Digital Signature</Label>
          <SignaturePad
            signature={formData.signature}
            onSignatureChange={(sig) => setFormData({ ...formData, signature: sig })}
          />
        </div>

        <div className="md:col-span-2 mt-4 p-4 bg-blue-50 border border-blue-200 rounded-lg">
          <p className="text-sm text-blue-900">
            <strong>Certification:</strong> I certify that this evaluation was performed by me or under my direct supervision, and that the information contained herein is accurate to the best of my knowledge.
          </p>
        </div>
      </div>
    </Card>
  );
}