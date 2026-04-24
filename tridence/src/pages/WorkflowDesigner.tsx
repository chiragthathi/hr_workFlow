import React from 'react';
import { Sidebar } from '../features/workflow/canvas/Sidebar';
import { Canvas } from '../features/workflow/canvas/Canvas';
import { ConfigPanel } from '../features/workflow/forms/ConfigPanel';
import { useWorkflowStore } from '../store/workflowStore';

export const WorkflowDesigner: React.FC = () => {
  const nodes = useWorkflowStore(state => state.nodes);
  const edges = useWorkflowStore(state => state.edges);
  const updateNodeData = useWorkflowStore(state => state.updateNodeData);

  const saveDraft = () => {
    try {
      localStorage.setItem('hr_workflow_draft', JSON.stringify({ nodes, edges }));
      alert('Draft saved successfully to local storage!');
    } catch (e) {
      console.error(e);
      alert('Failed to save draft.');
    }
  };

  const simulateWorkflow = async () => {
    if (nodes.length === 0) return alert('Cannot simulate an empty workflow!');
    try {
      const response = await fetch('/api/simulate', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ nodes, edges }),
      });
      const data = await response.json();
      
      if (data.status === 'success') {
        for (const step of data.steps) {
           // Highlight active node via data mutation
           updateNodeData(step.nodeId, { isActive: true });
           await new Promise(r => setTimeout(r, 700));
           // Revert back
           updateNodeData(step.nodeId, { isActive: false });
        }
      }
    } catch (e) {
      console.error('Simulation Failed:', e);
      alert('Simulation failed to run.');
    }
  };
  return (
    <div className="flex h-screen w-full bg-white overflow-hidden font-sans">
      <Sidebar />
      
      <main className="flex-1 flex flex-col relative h-full">
        <header className="h-14 bg-white border-b border-slate-200 flex items-center px-6 justify-between shadow-sm z-10">
          <div>
            <h1 className="text-lg font-bold text-slate-800">HR Workflow Designer</h1>
            <p className="text-xs text-slate-500">Design and simulate custom HR automations.</p>
          </div>
          <div className="flex gap-3">
             <button 
               onClick={saveDraft}
               className="px-4 py-1.5 text-sm font-medium border border-slate-300 rounded-md text-slate-700 hover:bg-slate-50 transition-colors">
               Save Draft
             </button>
             <button 
               onClick={simulateWorkflow}
               className="px-4 py-1.5 text-sm font-medium bg-indigo-600 rounded-md text-white hover:bg-indigo-700 shadow-sm transition-all focus:ring-2 focus:ring-indigo-500/50 focus:outline-none">
               Simulate Execution
             </button>
          </div>
        </header>
        
        <div className="flex-1 w-full bg-slate-50">
           <Canvas />
        </div>
      </main>
      
      <aside className="w-80 bg-white border-l border-slate-200">
         <ConfigPanel />
      </aside>
    </div>
  );
};
