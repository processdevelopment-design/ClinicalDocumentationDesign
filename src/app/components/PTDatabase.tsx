import { useState } from "react";
import { Card } from "@/app/components/ui/card";
import { Button } from "@/app/components/ui/button";
import { Input } from "@/app/components/ui/input";
import { Label } from "@/app/components/ui/label";
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from "@/app/components/ui/dialog";
import { Plus, Trash2, UserCircle } from "lucide-react";

export interface PhysicalTherapist {
  id: string;
  name: string;
  licenseNumber: string;
  position: string;
}

interface PTDatabaseProps {
  therapists: PhysicalTherapist[];
  onAddTherapist: (therapist: Omit<PhysicalTherapist, "id">) => void;
  onDeleteTherapist: (id: string) => void;
}

export function PTDatabase({
  therapists,
  onAddTherapist,
  onDeleteTherapist,
}: PTDatabaseProps) {
  const [isOpen, setIsOpen] = useState(false);
  const [newPT, setNewPT] = useState({
    name: "",
    licenseNumber: "",
    position: "",
  });

  const handleAddPT = () => {
    if (newPT.name && newPT.licenseNumber && newPT.position) {
      onAddTherapist(newPT);
      setNewPT({ name: "", licenseNumber: "", position: "" });
      setIsOpen(false);
    }
  };

  return (
    <div className="p-8 max-w-6xl mx-auto">
      <div className="flex items-center justify-between mb-6">
        <div>
          <h2 className="text-2xl font-semibold text-gray-900">
            Physical Therapist Database
          </h2>
          <p className="text-sm text-gray-500 mt-1">
            Manage physical therapist records and credentials
          </p>
        </div>
        <Dialog open={isOpen} onOpenChange={setIsOpen}>
          <DialogTrigger asChild>
            <Button className="bg-[#b36f49] hover:bg-[#c67f5f] text-white">
              <Plus className="w-4 h-4 mr-2" />
              Add PT
            </Button>
          </DialogTrigger>
          <DialogContent>
            <DialogHeader>
              <DialogTitle>Add Physical Therapist</DialogTitle>
              <DialogDescription>
                Enter the details of the new physical therapist.
              </DialogDescription>
            </DialogHeader>
            <div className="space-y-4 py-4">
              <div className="space-y-2">
                <Label htmlFor="pt-name">Name</Label>
                <Input
                  id="pt-name"
                  placeholder="Enter full name"
                  value={newPT.name}
                  onChange={(e) =>
                    setNewPT({ ...newPT, name: e.target.value })
                  }
                />
              </div>
              <div className="space-y-2">
                <Label htmlFor="pt-license">License Number</Label>
                <Input
                  id="pt-license"
                  placeholder="Enter license number"
                  value={newPT.licenseNumber}
                  onChange={(e) =>
                    setNewPT({ ...newPT, licenseNumber: e.target.value })
                  }
                />
              </div>
              <div className="space-y-2">
                <Label htmlFor="pt-position">Position</Label>
                <Input
                  id="pt-position"
                  placeholder="Enter position"
                  value={newPT.position}
                  onChange={(e) =>
                    setNewPT({ ...newPT, position: e.target.value })
                  }
                />
              </div>
            </div>
            <div className="flex justify-end gap-3">
              <Button
                variant="outline"
                onClick={() => setIsOpen(false)}
              >
                Cancel
              </Button>
              <Button
                onClick={handleAddPT}
                className="bg-[#b36f49] hover:bg-[#c67f5f] text-white"
              >
                Add Therapist
              </Button>
            </div>
          </DialogContent>
        </Dialog>
      </div>

      <Card className="p-6">
        <div className="overflow-x-auto">
          <table className="w-full">
            <thead className="bg-[#3e454b] text-white">
              <tr>
                <th className="text-left px-4 py-3 text-sm font-semibold">
                  Name
                </th>
                <th className="text-left px-4 py-3 text-sm font-semibold">
                  License Number
                </th>
                <th className="text-left px-4 py-3 text-sm font-semibold">
                  Position
                </th>
                <th className="w-16 px-4 py-3"></th>
              </tr>
            </thead>
            <tbody className="divide-y divide-gray-200">
              {therapists.length === 0 ? (
                <tr>
                  <td
                    colSpan={4}
                    className="px-4 py-12 text-center text-gray-500"
                  >
                    <UserCircle className="w-12 h-12 mx-auto mb-3 text-gray-300" />
                    <p className="text-sm">
                      No physical therapists added yet.
                    </p>
                    <p className="text-xs text-gray-400 mt-1">
                      Click "Add PT" to create your first entry.
                    </p>
                  </td>
                </tr>
              ) : (
                therapists.map((pt) => (
                  <tr
                    key={pt.id}
                    className="hover:bg-gray-50 transition-colors"
                  >
                    <td className="px-4 py-3 text-sm font-medium text-gray-900">
                      {pt.name}
                    </td>
                    <td className="px-4 py-3 text-sm text-gray-700">
                      {pt.licenseNumber}
                    </td>
                    <td className="px-4 py-3 text-sm text-gray-700">
                      {pt.position}
                    </td>
                    <td className="px-4 py-3">
                      <Button
                        variant="ghost"
                        size="sm"
                        onClick={() => onDeleteTherapist(pt.id)}
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
      </Card>
    </div>
  );
}