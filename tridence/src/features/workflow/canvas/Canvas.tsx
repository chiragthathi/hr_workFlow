import { useState, useRef, useCallback } from 'react';
import ReactFlow, {
  Background,
  Controls,
  MiniMap,
  ReactFlowProvider,
} from 'reactflow';
import 'reactflow/dist/style.css';

import { useWorkflowStore } from '../../../store/workflowStore';
import type { NodeType, HRNode } from '../types';

import { customNodeTypes } from '../nodes/CustomNodes';



const generateId = () => `node_${Math.random().toString(36).substr(2, 9)}`;

export const Canvas = () => {
  const reactFlowWrapper = useRef<HTMLDivElement>(null);
  const [reactFlowInstance, setReactFlowInstance] = useState<any>(null);

  const {
    nodes,
    edges,
    onNodesChange,
    onEdgesChange,
    onConnect,
    addNode,
    setSelectedNodeId,
    clearSelection,
  } = useWorkflowStore();

  const onDragOver = useCallback((event: React.DragEvent<HTMLDivElement>) => {
    event.preventDefault();
    event.dataTransfer.dropEffect = 'move';
  }, []);

  const onDrop = useCallback(
    (event: React.DragEvent<HTMLDivElement>) => {
      event.preventDefault();

      const type = event.dataTransfer.getData('application/reactflow') as NodeType;

      if (typeof type === 'undefined' || !type) {
        return;
      }

      const position = reactFlowInstance.screenToFlowPosition({
        x: event.clientX,
        y: event.clientY,
      });

      const newNode: HRNode = {
        id: generateId(),
        type,
        position,
        data: { title: `${type.charAt(0).toUpperCase() + type.slice(1)} Node` },
      };

      addNode(newNode);
    },
    [reactFlowInstance, addNode]
  );

  return (
    <div className="flex-grow h-full" ref={reactFlowWrapper}>
      <ReactFlowProvider>
        <ReactFlow
          nodes={nodes}
          edges={edges}
          onNodesChange={onNodesChange}
          onEdgesChange={onEdgesChange}
          onConnect={onConnect}
          onInit={setReactFlowInstance}
          onDrop={onDrop}
          onDragOver={onDragOver}
          onNodeClick={(_, node) => setSelectedNodeId(node.id)}
          onPaneClick={clearSelection}
          nodeTypes={customNodeTypes}
          fitView
          className="bg-slate-50/50"
        >
          <Background color="#ccc" gap={16} />
          <Controls />
          <MiniMap />
          {/* We can put a Simulate Button here later if needed in a Panel */}
        </ReactFlow>
      </ReactFlowProvider>
    </div>
  );
};
