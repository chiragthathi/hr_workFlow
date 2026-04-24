import { create } from 'zustand';
import {
  applyNodeChanges,
  applyEdgeChanges,
  addEdge,
} from 'reactflow';
import type { NodeChange, EdgeChange, Connection } from 'reactflow';
import type { HRNode, HREdge, WorkflowNodeData } from '../features/workflow/types';

interface WorkflowState {
  nodes: HRNode[];
  edges: HREdge[];
  selectedNodeId: string | null;
  onNodesChange: (changes: NodeChange[]) => void;
  onEdgesChange: (changes: EdgeChange[]) => void;
  onConnect: (connection: Connection) => void;
  addNode: (node: HRNode) => void;
  updateNodeData: (id: string, data: Partial<WorkflowNodeData>) => void;
  updateNodeStyle: (id: string, style: React.CSSProperties) => void;
  setSelectedNodeId: (id: string | null) => void;
  clearSelection: () => void;
}

export const useWorkflowStore = create<WorkflowState>((set, get) => ({
  nodes: [],
  edges: [],
  selectedNodeId: null,

  onNodesChange: (changes) => {
    set({
      nodes: applyNodeChanges(changes, get().nodes) as HRNode[],
    });
  },

  onEdgesChange: (changes) => {
    set({
      edges: applyEdgeChanges(changes, get().edges) as HREdge[],
    });
  },

  onConnect: (connection) => {
    // Basic validation: Don't allow multiple edges from the same source handle if we're branching tightly, 
    // but React Flow handles basic graph logic.
    set({
      edges: addEdge(connection, get().edges) as HREdge[],
    });
  },

  addNode: (node) => {
    set({
      nodes: [...get().nodes, node],
    });
  },

  updateNodeData: (id, newData) => {
    set({
      nodes: get().nodes.map((node) =>
        node.id === id
          ? { ...node, data: { ...node.data, ...newData } }
          : node
      ),
    });
  },

  updateNodeStyle: (id, style) => {
    set({
      nodes: get().nodes.map((node) =>
        node.id === id
          ? { ...node, style: { ...(node.style || {}), ...style } }
          : node
      ),
    });
  },

  setSelectedNodeId: (id) => {
    set({ selectedNodeId: id });
  },

  clearSelection: () => {
    set({ selectedNodeId: null });
  },
}));
