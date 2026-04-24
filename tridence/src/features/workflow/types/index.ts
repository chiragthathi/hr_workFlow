import type { Node, Edge } from 'reactflow';

export type NodeType = 'start' | 'task' | 'approval' | 'automated' | 'end';

export interface WorkflowNodeData {
  title: string;
  // Node-specific configurations
  metadata?: Record<string, string>; // Start Node
  description?: string;           // Task Node
  assignee?: string;              // Task Node
  dueDate?: string;               // Task Node
  approverRole?: string;          // Approval Node
  autoApproveThreshold?: number;  // Approval Node
  actionId?: string;              // Automated Node
  actionParams?: Record<string, string>; // Automated Node
  message?: string;               // End Node
  isSummary?: boolean;            // End Node
  isActive?: boolean;             // For Simulation UI Highlighting
}

export type HRNode = Node<WorkflowNodeData, NodeType>;
export type HREdge = Edge;

export interface WorkflowGraph {
  nodes: HRNode[];
  edges: HREdge[];
}
