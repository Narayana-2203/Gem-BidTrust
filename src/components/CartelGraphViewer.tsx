'use client';

import { useState, useEffect } from 'react';
import { Network, Server, User, MapPin, FileText, AlertTriangle } from 'lucide-react';
import { api } from '@/services/api';

export default function CartelGraphViewer({ tenderId = "GEM/2026/B/892" }) {
  const [graphData, setGraphData] = useState<any>(null);
  const [loading, setLoading] = useState(true);
  const [selectedNode, setSelectedNode] = useState<any>(null);

  useEffect(() => {
    async function load() {
      const data = await api.getCartelGraph(tenderId);
      // Generate random coordinates for nodes for simple SVG visualization
      const radius = 160;
      const center = { x: 300, y: 250 };
      
      const positionedNodes = data.nodes.map((node: any, i: number) => {
        const angle = (i / data.nodes.length) * 2 * Math.PI;
        return {
          ...node,
          x: center.x + radius * Math.cos(angle),
          y: center.y + radius * Math.sin(angle)
        };
      });

      setGraphData({
        ...data,
        nodes: positionedNodes
      });
      setLoading(false);
    }
    load();
  }, [tenderId]);

  if (loading) return <div className="p-8 text-center text-sm text-gray-500">Loading Cartel Graph...</div>;
  if (!graphData || !graphData.nodes || graphData.nodes.length === 0) return <div className="p-8 text-center text-sm text-gray-500">No Cartel Graph Data Available</div>;

  const getNodeIcon = (type: string) => {
    switch (type) {
      case 'bidder': return <Server size={14} />;
      case 'director': return <User size={14} />;
      case 'address': return <MapPin size={14} />;
      case 'ip': return <Network size={14} />;
      case 'metadata': return <FileText size={14} />;
      default: return <AlertTriangle size={14} />;
    }
  };

  return (
    <div className="flex flex-col md:flex-row gap-4 w-full h-[500px] border border-[var(--surface-200)] rounded-lg overflow-hidden bg-[var(--surface-50)]">
      {/* Graph Area */}
      <div className="flex-1 relative bg-[var(--surface-50)] overflow-hidden flex items-center justify-center">
        <svg width="600" height="500" className="absolute" style={{ cursor: 'grab' }}>
          {/* Edges */}
          {graphData.edges.map((edge: any, i: number) => {
            const source = graphData.nodes.find((n: any) => n.id === edge.source);
            const target = graphData.nodes.find((n: any) => n.id === edge.target);
            if (!source || !target) return null;
            return (
              <line 
                key={i} 
                x1={source.x} y1={source.y} 
                x2={target.x} y2={target.y} 
                stroke="#cbd5e1" 
                strokeWidth="1.5" 
                strokeDasharray={edge.relation === 'submitted_from' ? '4 2' : 'none'}
              />
            );
          })}
          
          {/* Nodes */}
          {graphData.nodes.map((node: any, i: number) => {
            const isSelected = selectedNode?.id === node.id;
            return (
              <g 
                key={i} 
                transform={`translate(${node.x}, ${node.y})`}
                onClick={() => setSelectedNode(node)}
                style={{ cursor: 'pointer', transition: 'all 0.2s' }}
              >
                <circle 
                  r={isSelected ? 18 : 14} 
                  fill={node.color || '#3b82f6'} 
                  stroke={isSelected ? '#1e293b' : 'white'} 
                  strokeWidth="2" 
                />
                <text 
                  y={26} 
                  textAnchor="middle" 
                  fontSize="11" 
                  fill="#475569" 
                  fontWeight={isSelected ? 600 : 400}
                >
                  {node.label?.substring(0, 15)}{node.label?.length > 15 ? '...' : ''}
                </text>
              </g>
            );
          })}
        </svg>

        <div className="absolute top-4 left-4 bg-white/80 p-3 rounded-lg border border-gray-200 shadow-sm backdrop-blur text-xs">
          <div className="font-semibold mb-2">Confidence: {graphData.riskConfidence}%</div>
          <div className="text-gray-600">Clusters detected: {graphData.clusters}</div>
        </div>
      </div>

      {/* Inspector Panel */}
      <div className="w-full md:w-64 bg-white border-l border-[var(--surface-200)] p-4 shadow-inner flex flex-col">
        <h4 className="text-sm font-semibold text-gray-800 mb-4 flex items-center gap-2">
          <Network size={16} /> Node Inspector
        </h4>
        
        {selectedNode ? (
          <div className="animate-in fade-in slide-in-from-right-4 duration-300">
            <div className="flex items-center gap-2 mb-3">
              <div 
                className="w-8 h-8 rounded-full flex items-center justify-center text-white" 
                style={{ backgroundColor: selectedNode.color || '#3b82f6' }}
              >
                {getNodeIcon(selectedNode.node_type)}
              </div>
              <div>
                <div className="text-xs text-gray-500 uppercase tracking-wide font-semibold">{selectedNode.node_type}</div>
                <div className="text-sm font-medium text-gray-900 break-words">{selectedNode.label}</div>
              </div>
            </div>
            
            <div className="h-px bg-gray-100 w-full my-3"></div>
            
            <div className="text-xs text-gray-600 space-y-2">
              <p><strong>ID:</strong> {selectedNode.id}</p>
              {selectedNode.node_type === 'ip' && <p>Detected identical IP submission across multiple bids.</p>}
              {selectedNode.node_type === 'metadata' && <p>PDF author fingerprint matches exactly.</p>}
              {selectedNode.node_type === 'bidder' && <p>Flagged as part of a highly suspicious proxy cluster.</p>}
            </div>
          </div>
        ) : (
          <div className="text-xs text-gray-400 italic text-center mt-10">
            Click on any node in the graph to inspect shared attributes, IP addresses, and metadata.
          </div>
        )}
      </div>
    </div>
  );
}
