import React from 'react';
import { useWorkflowStore } from '../../../store/workflowStore';
import { useForm, FormProvider, useFormContext } from 'react-hook-form';

const StartNodeForm = () => {
  const { register } = useFormContext();
  return (
    <div className="flex flex-col gap-4 mt-4">
      <div className="flex flex-col gap-1.5">
        <label className="text-xs font-semibold text-slate-600 uppercase tracking-wider">Node Title</label>
        <input {...register('title')} className="px-3 py-2 bg-white border border-slate-300 rounded-md text-sm shadow-sm focus:outline-none focus:ring-2 focus:ring-indigo-500 focus:border-indigo-500" />
      </div>
      <div className="flex flex-col gap-1.5">
        <label className="text-xs font-semibold text-slate-600 uppercase tracking-wider">Metadata (JSON format)</label>
        <textarea {...register('metadata')} rows={3} className="px-3 py-2 bg-white border border-slate-300 rounded-md text-sm shadow-sm font-mono text-xs focus:outline-none focus:ring-2 focus:ring-indigo-500 focus:border-indigo-500" placeholder='{"key": "value"}' />
      </div>
    </div>
  );
};

const TaskNodeForm = () => {
  const { register } = useFormContext();
  return (
    <div className="flex flex-col gap-4 mt-4">
      <div className="flex flex-col gap-1.5">
        <label className="text-xs font-semibold text-slate-600 uppercase tracking-wider">Node Title</label>
        <input {...register('title')} className="px-3 py-2 bg-white border border-slate-300 rounded-md text-sm shadow-sm focus:outline-none focus:ring-2 focus:ring-indigo-500 focus:border-indigo-500" />
      </div>
      <div className="flex flex-col gap-1.5">
        <label className="text-xs font-semibold text-slate-600 uppercase tracking-wider">Description</label>
        <textarea {...register('description')} rows={2} className="px-3 py-2 bg-white border border-slate-300 rounded-md text-sm shadow-sm focus:outline-none focus:ring-2 focus:ring-indigo-500 focus:border-indigo-500" />
      </div>
      <div className="flex flex-col gap-1.5">
        <label className="text-xs font-semibold text-slate-600 uppercase tracking-wider">Assignee Email</label>
        <input {...register('assignee')} type="email" placeholder="user@company.com" className="px-3 py-2 bg-white border border-slate-300 rounded-md text-sm shadow-sm focus:outline-none focus:ring-2 focus:ring-indigo-500 focus:border-indigo-500" />
      </div>
    </div>
  );
};

// Main Config Panel
export const ConfigPanel: React.FC = () => {
  const selectedNodeId = useWorkflowStore(state => state.selectedNodeId);
  const nodes = useWorkflowStore(state => state.nodes);
  const updateNodeData = useWorkflowStore(state => state.updateNodeData);

  const selectedNode = nodes.find(n => n.id === selectedNodeId);

  // We use key={selectedNodeId} to completely reset the form state when a new node is selected
  if (!selectedNodeId || !selectedNode) {
    return (
      <div className="flex flex-col items-center justify-center h-full text-slate-400 p-8 text-center">
        <div className="w-16 h-16 bg-slate-100 rounded-full flex items-center justify-center mb-4">
          <svg className="w-8 h-8 text-slate-300" fill="none" viewBox="0 0 24 24" stroke="currentColor">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 6V4m0 2a2 2 0 100 4m0-4a2 2 0 110 4m-6 8a2 2 0 100-4m0 4a2 2 0 110-4m0 4v2m0-6V4m6 6v10m6-2a2 2 0 100-4m0 4a2 2 0 110-4m0 4v2m0-6V4" />
          </svg>
        </div>
        <p className="text-sm font-medium">No node selected</p>
        <p className="text-xs mt-1">Select a node on the canvas to configure its properties.</p>
      </div>
    );
  }

  return (
    <div className="p-5 h-full flex flex-col">
      <div className="flex items-center justify-between mb-6 pb-4 border-b border-slate-200">
        <h2 className="text-base font-bold text-slate-800">Configuration</h2>
        <span className="px-2 py-1 bg-slate-100 text-slate-600 text-xs rounded-md shadow-inner capitalize font-medium">
          {selectedNode.type} Node
        </span>
      </div>

      <NodeFormRenderer key={selectedNode.id} node={selectedNode} updateNodeData={updateNodeData} />
    </div>
  );
};

const NodeFormRenderer = ({ node, updateNodeData }: any) => {
  const methods = useForm({
    defaultValues: node.data,
  });

  React.useEffect(() => {
    const subscription = methods.watch((value) => {
      // Debounce this in a real enterprise app, but simple approach works for prototype
      updateNodeData(node.id, value);
    });
    return () => subscription.unsubscribe();
  }, [methods.watch, node.id, updateNodeData]);

  return (
    <FormProvider {...methods}>
      <form className="flex-1 overflow-y-auto pr-2 custom-scrollbar" onSubmit={(e) => e.preventDefault()}>
        {node.type === 'start' && <StartNodeForm />}
        {node.type === 'task' && <TaskNodeForm />}
        {/* Placeholder for other types */}
        {['approval', 'automated', 'end'].includes(node.type) && (
           <div className="flex flex-col gap-4 mt-4">
               <div className="flex flex-col gap-1.5">
                    <label className="text-xs font-semibold text-slate-600 uppercase tracking-wider">Node Title</label>
                    <input {...methods.register('title')} className="px-3 py-2 bg-white border border-slate-300 rounded-md text-sm shadow-sm focus:outline-none focus:ring-2 focus:ring-indigo-500 focus:border-indigo-500" />
               </div>
               <p className="text-xs text-slate-400 italic mt-2">Additional configurations for {node.type} are managed generically.</p>
           </div>
        )}
      </form>
    </FormProvider>
  );
};
