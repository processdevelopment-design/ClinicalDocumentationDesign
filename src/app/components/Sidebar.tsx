import { FileText, ClipboardList, Users, FolderOpen, UserCircle, FilePlus } from 'lucide-react';

interface SidebarProps {
  activeItem: string;
  onItemClick: (item: string) => void;
}

export function Sidebar({ activeItem, onItemClick }: SidebarProps) {
  const menuItems = [
    { id: 'create-module', label: 'Create New Record', icon: FilePlus },
    { id: 'clinical-records', label: 'Clinical Records', icon: FolderOpen },
    { id: 'patient-database', label: 'Patient Database', icon: UserCircle },
    { id: 'pt-database', label: 'PT Database', icon: Users },
  ];

  return (
    <aside className="w-64 bg-white border-r border-gray-200 h-screen flex flex-col">
      <div className="p-6 border-b border-gray-200">
        <div className="flex items-center gap-3 mb-2">
          <img src="https://i.imgur.com/JSNghE3.png" alt="Physiare" style={{ height: '1cm', width: 'auto' }} />
        </div>
        <p className="text-sm text-gray-500">Clinical Documentation</p>
      </div>
      <nav className="flex-1 p-4">
        <ul className="space-y-2">
          {menuItems.map((item) => {
            const Icon = item.icon;
            const isActive = activeItem === item.id;
            return (
              <li key={item.id}>
                <button
                  onClick={() => onItemClick(item.id)}
                  className={`w-full flex items-center gap-3 px-4 py-3 rounded-lg transition-colors ${
                    isActive
                      ? 'bg-[#b36f49] text-white font-medium'
                      : 'text-gray-700 hover:bg-gray-50'
                  }`}
                >
                  <Icon className={`w-5 h-5 ${isActive ? 'text-white' : 'text-gray-500'}`} />
                  <span className="text-sm">{item.label}</span>
                </button>
              </li>
            );
          })}
        </ul>
      </nav>
    </aside>
  );
}