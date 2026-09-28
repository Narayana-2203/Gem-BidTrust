'use client';

import { useState } from 'react';
import { X, Plus, Save, Sliders, CheckCircle2 } from 'lucide-react';

export default function RuleBuilderModal({ isOpen, onClose, onSave }: { isOpen: boolean, onClose: () => void, onSave: (rule: any) => void }) {
  const [ruleName, setRuleName] = useState('');
  const [description, setDescription] = useState('');
  const [threshold, setThreshold] = useState(50);
  const [category, setCategory] = useState('financial');
  const [weight, setWeight] = useState(1);
  const [isSaved, setIsSaved] = useState(false);

  if (!isOpen) return null;

  const handleSave = () => {
    setIsSaved(true);
    setTimeout(() => {
      onSave({
        rule: `CUSTOM-${Math.random().toString(36).substr(2, 5).toUpperCase()}`,
        name: ruleName,
        description: description,
        category,
        weight,
        threshold,
        status: 'Active',
        lastTriggered: 'Just now',
        triggerCount: 0
      });
      setIsSaved(false);
      onClose();
    }, 1000);
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/40 backdrop-blur-sm">
      <div className="bg-white w-[550px] max-w-[90vw] rounded-xl shadow-2xl overflow-hidden animate-in zoom-in-95 duration-200">
        
        {/* Header */}
        <div className="flex items-center justify-between px-6 py-4 border-b border-gray-100 bg-gray-50">
          <h3 className="font-semibold text-gray-800 flex items-center gap-2">
            <Sliders size={18} className="text-blue-600" />
            Custom Compliance Rule Builder
          </h3>
          <button onClick={onClose} className="p-1 rounded-md hover:bg-gray-200 text-gray-500 transition-colors">
            <X size={18} />
          </button>
        </div>

        {/* Body */}
        <div className="p-6 space-y-5">
          {isSaved ? (
             <div className="flex flex-col items-center justify-center py-10 text-green-600">
                <CheckCircle2 size={48} className="mb-4 animate-bounce" />
                <div className="text-lg font-semibold">Rule Saved Successfully</div>
                <div className="text-sm text-gray-500">Recalculating compliance scores...</div>
             </div>
          ) : (
            <>
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">Rule Name</label>
                <input 
                  type="text" 
                  value={ruleName}
                  onChange={e => setRuleName(e.target.value)}
                  placeholder="e.g. strict-turnover-check"
                  className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
                />
              </div>

              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">Description</label>
                <textarea 
                  value={description}
                  onChange={e => setDescription(e.target.value)}
                  placeholder="Explain what this rule validates..."
                  rows={2}
                  className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
                />
              </div>

              <div className="flex gap-4">
                <div className="flex-1">
                  <label className="block text-sm font-medium text-gray-700 mb-1">Category</label>
                  <select 
                    value={category}
                    onChange={e => setCategory(e.target.value)}
                    className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500 bg-white"
                  >
                    <option value="financial">Financial Integrity</option>
                    <option value="legal">Legal & Debarment</option>
                    <option value="technical">Technical Experience</option>
                    <option value="msme">MSME Exemptions</option>
                  </select>
                </div>
                <div className="w-1/3">
                  <label className="block text-sm font-medium text-gray-700 mb-1">Weightage (x)</label>
                  <input 
                    type="number" 
                    min="1" max="5"
                    value={weight}
                    onChange={e => setWeight(Number(e.target.value))}
                    className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
                  />
                </div>
              </div>

              <div>
                <div className="flex justify-between mb-1">
                  <label className="block text-sm font-medium text-gray-700">Tolerance Threshold</label>
                  <span className="text-sm font-semibold text-blue-600">{threshold}%</span>
                </div>
                <input 
                  type="range" 
                  min="0" max="100" 
                  value={threshold}
                  onChange={e => setThreshold(Number(e.target.value))}
                  className="w-full h-2 bg-gray-200 rounded-lg appearance-none cursor-pointer accent-blue-600"
                />
                <p className="text-xs text-gray-500 mt-2">
                  Sets the threshold for automatic disqualification versus manual officer review.
                </p>
              </div>
            </>
          )}
        </div>

        {/* Footer */}
        {!isSaved && (
          <div className="px-6 py-4 border-t border-gray-100 bg-gray-50 flex justify-end gap-3">
            <button 
              onClick={onClose}
              className="px-4 py-2 text-sm font-medium text-gray-700 bg-white border border-gray-300 rounded-md hover:bg-gray-50"
            >
              Cancel
            </button>
            <button 
              onClick={handleSave}
              disabled={!ruleName}
              className="px-4 py-2 text-sm font-medium text-white bg-blue-600 rounded-md hover:bg-blue-700 disabled:opacity-50 flex items-center gap-2"
            >
              <Save size={16} /> Save Rule
            </button>
          </div>
        )}
      </div>
    </div>
  );
}
