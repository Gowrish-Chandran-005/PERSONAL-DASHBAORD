import React, { useState } from 'react';
import { TaskItem } from '../types';

interface QuickAddModalProps {
  isOpen: boolean;
  onClose: () => void;
  onAddTask: (task: Partial<TaskItem>) => void;
}

export const QuickAddModal: React.FC<QuickAddModalProps> = ({ isOpen, onClose, onAddTask }) => {
  const [selectedType, setSelectedType] = useState<string>('Task');
  const [inputValue, setInputValue] = useState('Revise UML Diagrams for CAT-1');
  const [selectedProject, setSelectedProject] = useState('LENDR: Capstone');
  const [priority, setPriority] = useState<'High Priority' | 'Medium Priority' | 'Low Priority'>('High Priority');
  const [dueTime, setDueTime] = useState('Today, 5:00 PM');

  if (!isOpen) return null;

  const quickTypes = [
    { label: 'Task', key: 'T', icon: 'check_circle', bg: '#E3D3E8' },
    { label: 'Event', key: 'E', icon: 'calendar_today', bg: '#C9D8E6' },
    { label: 'Project', key: 'P', icon: 'folder_open', bg: '#CFE5D2' },
    { label: 'Habit', key: 'H', icon: 'local_fire_department', bg: '#F7D774' },
    { label: 'Goal', key: 'G', icon: 'ads_click', bg: '#F4C9A8' },
    { label: 'Intern', key: 'I', icon: 'business_center', bg: '#E3D3E8' },
    { label: 'Academic', key: 'A', icon: 'school', bg: '#C9D8E6' },
    { label: 'Speech', key: 'S', icon: 'mic', bg: '#C9D8E6' },
    { label: 'Creative', key: 'C', icon: 'palette', bg: '#F4C9A8' },
    { label: 'Journal', key: 'J', icon: 'auto_stories', bg: '#CFE5D2' },
  ];

  const handleCreate = () => {
    if (!inputValue.trim()) return;

    let category: TaskItem['category'] = 'Academics';
    if (selectedType === 'Speech') category = 'Toastmasters';
    else if (selectedType === 'Intern') category = 'Career';
    else if (selectedType === 'Creative') category = 'Creative';
    else if (selectedType === 'Habit') category = 'Habits';
    else if (selectedType === 'Event' || selectedType === 'Journal') category = 'Personal';

    onAddTask({
      id: `task-${Date.now()}`,
      title: inputValue,
      category,
      source: selectedProject,
      status: priority === 'High Priority' ? 'Urgent' : 'Upcoming',
      due: dueTime,
      completed: false,
      priorityGroup: priority === 'High Priority' ? 'Must Do' : 'Should Do',
    });

    onClose();
  };

  return (
    <div className="fixed inset-0 bg-[#141821]/50 backdrop-blur-[6px] z-50 flex items-center justify-center p-4">
      <div className="w-full max-w-[560px] bg-white rounded-[28px] p-6 lg:p-8 shadow-[0_24px_64px_rgba(0,0,0,0.22)] relative transform transition-all duration-300">
        {/* Header */}
        <div className="flex items-center justify-between pb-4">
          <div className="flex items-center gap-2.5">
            <div className="w-7 h-7 rounded-full bg-[#f4f4f2] flex items-center justify-center text-[#151618]">
              <span className="material-symbols-outlined text-[18px]">add</span>
            </div>
            <h2 className="font-outfit font-semibold text-xl text-[#151618] tracking-tight">Quick Add</h2>
          </div>
          <div className="flex items-center gap-2">
            <span className="text-[10px] font-sora font-semibold px-2 py-0.5 rounded bg-[#f4f4f2] text-[#77777b] tracking-wider">
              ESC
            </span>
            <button
              onClick={onClose}
              className="w-8 h-8 rounded-full flex items-center justify-center text-[#77777b] hover:bg-[#f4f4f2] hover:text-[#151618] transition-colors cursor-pointer"
            >
              <span className="material-symbols-outlined text-[20px]">close</span>
            </button>
          </div>
        </div>

        {/* Input Bar */}
        <div className="relative flex items-center mb-5">
          <span className="material-symbols-outlined absolute left-4 text-[#77777b] text-[20px]">
            auto_awesome
          </span>
          <input
            type="text"
            value={inputValue}
            onChange={(e) => setInputValue(e.target.value)}
            onKeyDown={(e) => {
              if (e.key === 'Enter') handleCreate();
            }}
            placeholder="What do you want to add? (e.g. CAT-1 prep, Gym workout, Speech draft)"
            className="w-full bg-[#f4f4f2] pl-12 pr-10 py-3.5 text-sm font-outfit rounded-full text-[#1a1c1b] placeholder:text-[#77777b] focus:outline-none focus:bg-white focus:ring-2 focus:ring-[#C9D8E6] transition-all shadow-inner"
            autoFocus
          />
          {inputValue && (
            <button
              onClick={() => setInputValue('')}
              className="absolute right-3.5 text-[#77777b] hover:text-black transition-colors cursor-pointer"
            >
              <span className="material-symbols-outlined text-[18px]">cancel</span>
            </button>
          )}
        </div>

        {/* 2x5 Grid of Pastel Quick-Select Tiles */}
        <div className="grid grid-cols-5 gap-2.5 mb-5 select-none">
          {quickTypes.map((item) => {
            const isSelected = selectedType === item.label;
            return (
              <button
                key={item.label}
                type="button"
                onClick={() => setSelectedType(item.label)}
                style={{ backgroundColor: item.bg }}
                className={`relative flex flex-col items-center justify-center p-2.5 rounded-[18px] text-[#151618] transition-all cursor-pointer ${
                  isSelected
                    ? 'ring-2 ring-[#151618] scale-[1.03] shadow-md'
                    : 'opacity-85 hover:opacity-100 hover:scale-[1.01]'
                }`}
              >
                <span className="absolute top-1.5 right-1.5 text-[9px] font-sora font-bold opacity-60">
                  {item.key}
                </span>
                <span className="material-symbols-outlined text-[20px] mb-1">{item.icon}</span>
                <span className="text-[11px] font-sora font-medium text-center">{item.label}</span>
              </button>
            );
          })}
        </div>

        {/* Compact Form */}
        <div className="bg-[#f4f4f2] rounded-[20px] p-4 space-y-3.5 mb-6">
          {/* Detected Category */}
          <div className="flex items-center justify-between text-xs font-outfit">
            <span className="text-[#52606c] font-medium">Smart Classification</span>
            <div className="inline-flex items-center gap-1.5 px-3 py-1 rounded-full bg-[#E3D3E8] text-[#151618] font-sora text-[11px] font-semibold">
              <span className="material-symbols-outlined text-[13px]">auto_fix_high</span>
              <span>Academics • BCSE301L</span>
            </div>
          </div>

          {/* Project Selector */}
          <div className="flex items-center justify-between bg-white px-4 py-2.5 rounded-full shadow-sm">
            <div className="flex items-center gap-2 text-xs font-outfit">
              <span className="material-symbols-outlined text-[18px] text-[#52606c]">link</span>
              <span className="text-[#52606c]">Project:</span>
              <select
                value={selectedProject}
                onChange={(e) => setSelectedProject(e.target.value)}
                className="bg-transparent font-semibold text-[#151618] border-none outline-none cursor-pointer"
              >
                <option value="LENDR: Capstone">LENDR: Capstone</option>
                <option value="GOWRISH OS">GOWRISH OS</option>
                <option value="Student Burnout Prediction">Student Burnout Prediction</option>
                <option value="Toastmasters Session #42">Toastmasters Session #42</option>
                <option value="Microsoft Prep">Microsoft Prep</option>
              </select>
            </div>
            <span className="material-symbols-outlined text-[18px] text-[#77777b]">arrow_drop_down</span>
          </div>

          {/* Priority & Due Date Row */}
          <div className="grid grid-cols-2 gap-3">
            <div className="flex items-center justify-between bg-white px-3.5 py-2 rounded-full shadow-sm">
              <div className="flex items-center gap-2">
                <span
                  className={`w-2.5 h-2.5 rounded-full ${
                    priority === 'High Priority'
                      ? 'bg-[#ba1a1a]'
                      : priority === 'Medium Priority'
                      ? 'bg-[#E8923A]'
                      : 'bg-[#4E9F6B]'
                  }`}
                />
                <select
                  value={priority}
                  onChange={(e) => setPriority(e.target.value as any)}
                  className="bg-transparent font-outfit text-xs text-[#151618] font-medium border-none outline-none cursor-pointer"
                >
                  <option value="High Priority">High Priority</option>
                  <option value="Medium Priority">Medium Priority</option>
                  <option value="Low Priority">Low Priority</option>
                </select>
              </div>
            </div>

            <div className="flex items-center justify-between bg-white px-3.5 py-2 rounded-full shadow-sm">
              <div className="flex items-center gap-2">
                <span className="material-symbols-outlined text-[18px] text-[#52606c]">schedule</span>
                <input
                  type="text"
                  value={dueTime}
                  onChange={(e) => setDueTime(e.target.value)}
                  className="bg-transparent font-outfit text-xs text-[#151618] font-medium w-28 border-none outline-none"
                />
              </div>
              <span className="material-symbols-outlined text-[16px] text-[#77777b]">calendar_month</span>
            </div>
          </div>
        </div>

        {/* Action Footer */}
        <div className="flex items-center justify-between pt-1">
          <button
            type="button"
            onClick={onClose}
            className="px-5 py-2.5 rounded-full text-sm font-outfit text-[#52606c] hover:text-[#151618] hover:bg-[#f4f4f2] transition-all cursor-pointer"
          >
            Cancel
          </button>
          <button
            type="button"
            onClick={handleCreate}
            className="inline-flex items-center gap-2 bg-[#151618] text-white px-6 py-2.5 rounded-full font-sora text-xs font-semibold tracking-wide shadow-md hover:opacity-90 active:scale-[0.98] transition-all cursor-pointer"
          >
            <span>Create {selectedType}</span>
            <span className="opacity-75 text-[10px] font-sans px-1.5 py-0.5 rounded bg-white/20">↵ Return</span>
          </button>
        </div>
      </div>
    </div>
  );
};
