import { Card } from '@/app/components/ui/card';
import { Input } from '@/app/components/ui/input';
import { Label } from '@/app/components/ui/label';
import { SignaturePad } from '@/app/components/SignaturePad';
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/app/components/ui/select";
import { FormData } from '@/app/utils/pdfGenerator';
import { PhysicalTherapist } from '@/app/components/PTDatabase';

interface TherapistInformationProps {
  formData: FormData;
  setFormData: React.Dispatch<React.SetStateAction<FormData>>;
  therapists: PhysicalTherapist[];
}

export function TherapistInformation({ 
  formData, 
  setFormData,
  therapists 
}: TherapistInformationProps) {
  
  const handleTherapistSelect = (therapistId: string) => {
    const selected = therapists.find(t => t.id === therapistId);
    if (selected) {
      setFormData({
        ...formData,
        therapistName: selected.name,
        therapistLicense: selected.licenseNumber,
        // Do not auto-load branch - let user fill it manually
      });
    }
  };

  return (
    <Card className="p-6">
      <h2 className="text-lg font-semibold text-gray-900 mb-6">
        Physical Therapist Information & Signature
      </h2>

      <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
        <div className="space-y-2">
          <Label htmlFor="therapist-select">Physical Therapist</Label>
          <Select onValueChange={handleTherapistSelect}>
            <SelectTrigger id="therapist-select">
              <SelectValue placeholder={formData.therapistName || "Select a therapist"} />
            </SelectTrigger>
            <SelectContent>
              {therapists.map((therapist) => (
                <SelectItem key={therapist.id} value={therapist.id}>
                  {therapist.name}
                </SelectItem>
              ))}
            </SelectContent>
          </Select>
        </div>

        <div className="space-y-2">
          <Label htmlFor="therapist-license">License Number</Label>
          <Input
            id="therapist-license"
            placeholder="Auto-loaded from database"
            value={formData.therapistLicense}
            readOnly
            className="bg-gray-50"
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