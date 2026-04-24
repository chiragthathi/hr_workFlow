import React from 'react';
import { Play, Settings, GripVertical, FileText, CheckSquare, Zap, Target } from 'lucide-react';
import type { NodeType } from '../types';

const NODE_TYPES: { type: NodeType; label: string; icon: React.ReactNode; color: string }[] = [
  { type: 'start', label: 'Start', icon: <Play className="w-4 h-4" />, color: 'bg-green-100 text-green-700 border-green-300' },
  { type: 'task', label: 'Human Task', icon: <FileText className="w-4 h-4" />, color: 'bg-blue-100 text-blue-700 border-blue-300' },
  { type: 'approval', label: 'Approval Step', icon: <CheckSquare className="w-4 h-4" />, color: 'bg-purple-100 text-purple-700 border-purple-300' },
  { type: 'automated', label: 'Automated Action', icon: <Zap className="w-4 h-4" />, color: 'bg-orange-100 text-orange-700 border-orange-300' },
  { type: 'end', label: 'End', icon: <Target className="w-4 h-4" />, color: 'bg-red-100 text-red-700 border-red-300' },
];

export const Sidebar: React.FC = () => {
  const onDragStart = (event: React.DragEvent<HTMLDivElement>, nodeType: NodeType) => {
    event.dataTransfer.setData('application/reactflow', nodeType);
    event.dataTransfer.effectAllowed = 'move';
  };

  return (
    <aside className="w-64 bg-slate-50 border-r border-slate-200 p-4 flex flex-col gap-4">
      <div className="flex items-center gap-2 mb-4 text-slate-800">
        <Settings className="w-5 h-5 text-indigo-600" />
        <h2 className="font-semibold">Node Toolbox</h2>
      </div>
      
      <p className="text-xs text-slate-500 mb-2">Drag and drop nodes onto the canvas to construct your workflow.</p>
      
      <div className="space-y-3">
        {NODE_TYPES.map((nt) => (
          <div
            key={nt.type}
            onDragStart={(event) => onDragStart(event, nt.type)}
            draggable
            className={`flex items-center gap-3 p-3 rounded-md border text-sm font-medium cursor-grab active:cursor-grabbing hover:shadow-sm transition-all ${nt.color}`}
          >
            <GripVertical className="w-4 h-4 opacity-50" />
            <div className="p-1.5 bg-white rounded-md shadow-sm">
              {nt.icon}
            </div>
            {nt.label}
          </div>
        ))}
      </div>
    </aside>
  );
};
