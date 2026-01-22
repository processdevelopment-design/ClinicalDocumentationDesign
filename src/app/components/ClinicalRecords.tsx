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
    <div className="space-y-6 animate-in fade-in duration-300">
      {/* Search Bar */}
      <div className="bg-white rounded-xl shadow-sm p-6 hover:shadow-md transition-shadow duration-200">
        <div className="relative">
          <Search className="absolute left-4 top-1/2 transform -translate-y-1/2 text-[#b36f49] w-5 h-5" />
          <Input
            type="text"
            placeholder="Search by name, patient ID, or note code..."
            value={searchTerm}
            onChange={(e) => setSearchTerm(e.target.value)}
            className="pl-12 py-6 text-base rounded-lg border-2 focus:border-[#b36f49] transition-colors"
          />
        </div>
      </div>

      {/* Records List */}
      <div className="bg-white rounded-xl shadow-sm overflow-hidden">
        <div className="px-8 py-6 border-b border-gray-200 bg-gradient-to-r from-gray-50 to-white">
          <h2 className="text-xl font-bold text-[#3e454b] flex items-center">
            <span className="w-1.5 h-6 bg-[#b36f49] rounded-full mr-3"></span>
            Clinical Records
          </h2>
          <p className="text-sm text-gray-600 mt-2 ml-5">{filteredRecords.length} records found</p>
        </div>

        <div className="divide-y divide-gray-100">
          {filteredRecords.length === 0 ? (
            <div className="px-6 py-16 text-center">
              <div className="w-16 h-16 rounded-full bg-gray-100 flex items-center justify-center mx-auto mb-4">
                <FileText className="w-8 h-8 text-gray-400" />
              </div>
              <p className="text-lg font-semibold text-gray-700">No records found</p>
              <p className="text-sm text-gray-500 mt-2">Try a different search term</p>
            </div>
          ) : (
            filteredRecords.map((record) => (
              <div
                key={record.id}
                className="px-8 py-5 hover:bg-gradient-to-r hover:from-orange-50/30 hover:to-transparent transition-all duration-200 border-l-4 border-transparent hover:border-[#b36f49]"
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
                        className="border-[#b36f49] text-[#b36f49] hover:bg-[#b36f49] hover:text-white transition-all duration-200 shadow-sm hover:shadow"
                      >
                        <Edit className="w-4 h-4 mr-1.5" />
                        Edit
                      </Button>
                    )}
                    <Button
                      variant="outline"
                      size="sm"
                      onClick={() => onViewRecord(record.id)}
                      className="border-gray-300 hover:border-gray-400 transition-all duration-200 shadow-sm hover:shadow"
                    >
                      <Eye className="w-4 h-4 mr-1.5" />
                      View
                    </Button>
                    <Button
                      variant="default"
                      size="sm"
                      onClick={() => onDownloadPDF(record)}
                      className="bg-gradient-to-br from-[#b36f49] to-[#c67f5f] hover:from-[#c67f5f] hover:to-[#b36f49] text-white transition-all duration-200 shadow-sm hover:shadow"
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