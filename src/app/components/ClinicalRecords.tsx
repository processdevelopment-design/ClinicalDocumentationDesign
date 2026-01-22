import { useState } from 'react';
import { Search, FileText, Download, Eye, Edit } from 'lucide-react';
import { Input } from '@/app/components/ui/input';
import { Button } from '@/app/components/ui/button';
import { FormData } from '@/app/utils/pdfGenerator';
import { PTNotesData } from '@/app/components/PTNotesForm';
import { DischargeSummaryData } from '@/app/components/DischargeSummaryForm';

export interface ClinicalRecord {
  id: string;
  noteCode: string;
  patientId: string;
  patientName: string;
  dateCreated: string;
  type: 'Initial Evaluation' | 'PT Notes' | 'Discharge Summary';
  status: 'Draft' | 'Submitted';
  formData?: FormData;
  ptNotesData?: PTNotesData;
  dischargeSummaryData?: DischargeSummaryData;
}

interface ClinicalRecordsProps {
  records: ClinicalRecord[];
  onViewRecord: (recordId: string) => void;
  onDownloadPDF: (record: ClinicalRecord) => void;
  onEditRecord?: (record: ClinicalRecord) => void;
}

export function ClinicalRecords({ records, onViewRecord, onDownloadPDF, onEditRecord }: ClinicalRecordsProps) {
  const [searchTerm, setSearchTerm] = useState('');

  const filteredRecords = records.filter(record => {
    const search = searchTerm.toLowerCase();
    return (
      record.patientName.toLowerCase().includes(search) ||
      record.patientId.toLowerCase().includes(search) ||
      record.noteCode.toLowerCase().includes(search)
    );
  });

  return (
    <div className="space-y-6">
      {/* Search Bar */}
      <div className="bg-white rounded-lg shadow-sm p-6">
        <div className="relative">
          <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400 w-5 h-5" />
          <Input
            type="text"
            placeholder="Search by name, patient ID, or note code..."
            value={searchTerm}
            onChange={(e) => setSearchTerm(e.target.value)}
            className="pl-10 py-6 text-base"
          />
        </div>
      </div>

      {/* Records List */}
      <div className="bg-white rounded-lg shadow-sm">
        <div className="px-6 py-4 border-b border-gray-200">
          <h2 className="text-lg font-semibold text-gray-900">Clinical Records</h2>
          <p className="text-sm text-gray-500 mt-1">{filteredRecords.length} records found</p>
        </div>

        <div className="divide-y divide-gray-100">
          {filteredRecords.length === 0 ? (
            <div className="px-6 py-12 text-center">
              <FileText className="w-12 h-12 text-gray-300 mx-auto mb-3" />
              <p className="text-gray-500">No records found</p>
              <p className="text-sm text-gray-400 mt-1">Try a different search term</p>
            </div>
          ) : (
            filteredRecords.map((record) => (
              <div
                key={record.id}
                className="px-6 py-4 hover:bg-gray-50 transition-colors"
              >
                <div className="flex items-start justify-between gap-4">
                  <div className="flex-1 min-w-0">
                    <div className="flex items-center gap-3 mb-2">
                      <h3 className="text-base font-semibold text-gray-900">
                        {record.patientName}
                      </h3>
                      <span className="inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium bg-[#c3bbb5]/20 text-[#3e454b]">
                        {record.type}
                      </span>
                      <span className={`inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium ${
                        record.status === 'Submitted'
                          ? 'bg-green-100 text-green-800'
                          : 'bg-yellow-100 text-yellow-800'
                      }`}>
                        {record.status}
                      </span>
                    </div>
                    <div className="flex items-center gap-4 text-sm text-gray-600">
                      <span>
                        <span className="font-medium">Note Code:</span> {record.noteCode}
                      </span>
                      <span>•</span>
                      <span>
                        <span className="font-medium">Patient ID:</span> {record.patientId}
                      </span>
                      <span>•</span>
                      <span>
                        <span className="font-medium">Date:</span> {record.dateCreated}
                      </span>
                    </div>
                  </div>

                  <div className="flex items-center gap-2">
                    {record.status === 'Draft' && onEditRecord && (
                      <Button
                        variant="outline"
                        size="sm"
                        onClick={() => onEditRecord(record)}
                        className="border-[#b36f49] text-[#b36f49] hover:bg-[#b36f49] hover:text-white"
                      >
                        <Edit className="w-4 h-4 mr-1.5" />
                        Edit
                      </Button>
                    )}
                    <Button
                      variant="outline"
                      size="sm"
                      onClick={() => onViewRecord(record.id)}
                      className="border-gray-300"
                    >
                      <Eye className="w-4 h-4 mr-1.5" />
                      View
                    </Button>
                    <Button
                      variant="default"
                      size="sm"
                      onClick={() => onDownloadPDF(record)}
                      className="bg-[#b36f49] hover:bg-[#c67f5f] text-white"
                    >
                      <Download className="w-4 h-4 mr-1.5" />
                      PDF
                    </Button>
                  </div>
                </div>
              </div>
            ))
          )}
        </div>
      </div>
    </div>
  );
}