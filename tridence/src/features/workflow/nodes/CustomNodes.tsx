import { Handle, Position } from 'reactflow';
import { Play, FileText, CheckSquare, Zap, Target } from 'lucide-react';

const BaseNode = ({ data, selected, icon: Icon, colorClass, title, subtitle }: any) => (
  <div className={`w-64 bg-white rounded-xl border-2 shadow-sm transition-all duration-200 ${
    data.isActive ? 'border-green-500 shadow-md ring-4 ring-green-500/30' :
    selected ? 'border-indigo-500 shadow-md ring-4 ring-indigo-500/20' : 'border-slate-200 hover:border-slate-300 hover:shadow-md'
  }`}>
    <div className="p-4 flex items-start gap-3">
      <div className={`p-2 rounded-lg ${colorClass}`}>
        <Icon className="w-5 h-5" />
      </div>
      <div className="flex-1 min-w-0">
        <h3 className="text-sm font-bold text-slate-800 truncate leading-tight mb-0.5">{data.title || title}</h3>
        <p className="text-xs text-slate-500 truncate">{subtitle}</p>
      </div>
    </div>
  </div>
);

export const StartNode = ({ data, selected }: any) => {
  return (
    <>
      <BaseNode data={data} selected={selected} icon={Play} colorClass="bg-green-100 text-green-600" title="Start Process" subtitle="Trigger point" />
      <Handle type="source" position={Position.Bottom} className="w-3 h-3 bg-slate-400 border-2 border-white" />
    </>
  );
};

export const TaskNode = ({ data, selected }: any) => {
  return (
    <>
      <Handle type="target" position={Position.Top} className="w-3 h-3 bg-slate-400 border-2 border-white" />
      <BaseNode data={data} selected={selected} icon={FileText} colorClass="bg-blue-100 text-blue-600" title="Human Task" subtitle={data.assignee || 'Unassigned'} />
      <Handle type="source" position={Position.Bottom} className="w-3 h-3 bg-slate-400 border-2 border-white" />
    </>
  );
};

export const ApprovalNode = ({ data, selected }: any) => {
  return (
    <>
      <Handle type="target" position={Position.Top} className="w-3 h-3 bg-slate-400 border-2 border-white" />
      <BaseNode data={data} selected={selected} icon={CheckSquare} colorClass="bg-purple-100 text-purple-600" title="Approval Step" subtitle={data.approverRole || 'Manager'} />
      <div className="px-4 py-2 bg-slate-50 border-t border-slate-100 rounded-b-xl flex justify-between gap-2">
         <span className="text-[10px] uppercase font-bold text-green-600">Approved</span>
         <span className="text-[10px] uppercase font-bold text-red-600">Rejected</span>
      </div>
      {/* Multiple source handles for branching! */}
      <Handle type="source" position={Position.Bottom} id="approved" className="w-3 h-3 bg-green-500 border-2 border-white translate-x-[-30px]" />
      <Handle type="source" position={Position.Bottom} id="rejected" className="w-3 h-3 bg-red-500 border-2 border-white translate-x-[30px]" />
    </>
  );
};

export const AutomatedNode = ({ data, selected }: any) => {
  return (
    <>
      <Handle type="target" position={Position.Top} className="w-3 h-3 bg-slate-400 border-2 border-white" />
      <BaseNode data={data} selected={selected} icon={Zap} colorClass="bg-orange-100 text-orange-600" title="Automated Action" subtitle="System integration" />
      <Handle type="source" position={Position.Bottom} className="w-3 h-3 bg-slate-400 border-2 border-white" />
    </>
  );
};

export const EndNode = ({ data, selected }: any) => {
  return (
    <>
      <Handle type="target" position={Position.Top} className="w-3 h-3 bg-slate-400 border-2 border-white" />
      <BaseNode data={data} selected={selected} icon={Target} colorClass="bg-red-100 text-red-600" title="End Process" subtitle="Completion" />
    </>
  );
};

export const customNodeTypes = {
  start: StartNode,
  task: TaskNode,
  approval: ApprovalNode,
  automated: AutomatedNode,
  end: EndNode,
};
