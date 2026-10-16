import React, { useState } from 'react';
import { CreativeAsset, NavTabId } from '../../types';
import { INITIAL_CREATIVE_ASSETS } from '../../data/mockData';

interface CreativeStudioViewProps {
  onOpenQuickAdd: () => void;
  onSelectTab: (tab: NavTabId) => void;
}

export const CreativeStudioView: React.FC<CreativeStudioViewProps> = ({ onOpenQuickAdd, onSelectTab }) => {
  const [assets, setAssets] = useState<CreativeAsset[]>(INITIAL_CREATIVE_ASSETS);
  const [filterType, setFilterType] = useState<'All' | 'Video' | '3D' | 'Vector' | 'Still'>('All');
  const [activeTab, setActiveTab] = useState<'gallery' | 'render' | 'palettes'>('gallery');
  const [selectedAsset, setSelectedAsset] = useState<CreativeAsset | null>(null);

  const filteredAssets = filterType === 'All'
    ? assets
    : assets.filter(a => a.type === filterType);

  return (
    <div className="flex-1 overflow-y-auto px-6 py-6 pb-20 space-y-6">
      {/* Header section */}
      <div className="flex flex-col md:flex-row md:items-center justify-between gap-4">
        <div>
          <div className="flex items-center gap-3">
            <h1 className="text-3xl font-black text-[#151618] tracking-tight font-outfit">Creative Studio</h1>
            <span className="px-3 py-0.5 rounded-full text-xs font-bold uppercase tracking-wider bg-[#d9e6e8] text-[#2c4046]">
              Motion • 3D • Cinema
            </span>
          </div>
          <p className="text-[#57595b] text-sm mt-1">
            Visual identity repository, Blender 3D rigs, DaVinci Resolve color pipelines, and motion assets.
          </p>
        </div>

        <div className="flex items-center gap-3">
          <button
            onClick={() => setActiveTab('render')}
            className="flex items-center gap-2 px-3.5 py-2 rounded-xl bg-white/80 hover:bg-white text-xs font-bold text-[#151618] shadow-sm transition border border-white/40"
          >
            <span className="material-symbols-outlined text-sm text-[#d97d43] animate-pulse">videocam</span>
            <span>Render Queue (1 Active)</span>
          </button>

          <button
            onClick={onOpenQuickAdd}
            className="flex items-center gap-2 px-4 py-2 rounded-xl bg-[#151618] hover:bg-black text-white text-xs font-bold shadow-md transition"
          >
            <span className="material-symbols-outlined text-sm">add</span>
            <span>Upload New Asset</span>
          </button>
        </div>
      </div>

      {/* Top Metric Cards */}
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
        <div className="bg-white/90 backdrop-blur rounded-2xl p-5 border border-white/60 shadow-sm flex flex-col justify-between">
          <div className="flex items-center justify-between">
            <span className="text-xs font-bold uppercase tracking-wider text-[#77777b]">Master Assets</span>
            <div className="w-8 h-8 rounded-lg bg-[#cfe5d2] flex items-center justify-center text-[#1e4d23]">
              <span className="material-symbols-outlined text-base">perm_media</span>
            </div>
          </div>
          <div className="mt-3">
            <div className="text-3xl font-black text-[#151618]">{assets.length} Assets</div>
            <div className="text-xs text-[#3d8357] font-semibold mt-1">
              4K ProRes • Blender Cycles • SVG
            </div>
          </div>
        </div>

        <div className="bg-[#fff8eb] rounded-2xl p-5 border border-amber-200/60 shadow-sm flex flex-col justify-between">
          <div className="flex items-center justify-between">
            <span className="text-xs font-bold uppercase tracking-wider text-[#694400]">Render Engine</span>
            <div className="w-8 h-8 rounded-lg bg-[#f7d774] flex items-center justify-center text-[#694400]">
              <span className="material-symbols-outlined text-base">memory</span>
            </div>
          </div>
          <div className="mt-3">
            <div className="text-2xl font-black text-[#694400]">82% Rendered</div>
            <div className="text-xs text-[#855400] font-semibold mt-1">
              CineGrade LUT pass • DaVinci Node 4
            </div>
          </div>
        </div>

        <div className="bg-white/90 backdrop-blur rounded-2xl p-5 border border-white/60 shadow-sm flex flex-col justify-between">
          <div className="flex items-center justify-between">
            <span className="text-xs font-bold uppercase tracking-wider text-[#77777b]">Brand Tokens</span>
            <div className="w-8 h-8 rounded-lg bg-[#e3d3e8] flex items-center justify-center text-[#552763]">
              <span className="material-symbols-outlined text-base">auto_fix_high</span>
            </div>
          </div>
          <div className="mt-3">
            <div className="text-3xl font-black text-[#151618]">5 Palettes</div>
            <div className="text-xs text-[#552763] font-semibold mt-1">
              SOL Gold, Sage Mist, Deep Charcoal
            </div>
          </div>
        </div>

        <div className="bg-white/90 backdrop-blur rounded-2xl p-5 border border-white/60 shadow-sm flex flex-col justify-between">
          <div className="flex items-center justify-between">
            <span className="text-xs font-bold uppercase tracking-wider text-[#77777b]">Scratch Disk</span>
            <div className="w-8 h-8 rounded-lg bg-[#cfe5d2] flex items-center justify-center text-[#1e4d23]">
              <span className="material-symbols-outlined text-base">hard_drive</span>
            </div>
          </div>
          <div className="mt-3">
            <div className="text-3xl font-black text-[#151618]">142 GB <span className="text-sm font-normal text-[#77777b]">/ 500 GB</span></div>
            <div className="text-xs text-[#3d8357] font-semibold mt-1">
              Fast NVMe cache available
            </div>
          </div>
        </div>
      </div>

      {/* Navigation tabs & Filter */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 border-b border-white/40 pb-2">
        <div className="flex items-center gap-2">
          <button
            onClick={() => setActiveTab('gallery')}
            className={`px-4 py-2 rounded-xl text-xs font-bold transition flex items-center gap-1.5 ${
              activeTab === 'gallery'
                ? 'bg-[#151618] text-white shadow-sm'
                : 'bg-white/60 hover:bg-white text-[#57595b]'
            }`}
          >
            <span className="material-symbols-outlined text-sm">grid_view</span>
            Asset Library
          </button>
          <button
            onClick={() => setActiveTab('render')}
            className={`px-4 py-2 rounded-xl text-xs font-bold transition flex items-center gap-1.5 ${
              activeTab === 'render'
                ? 'bg-[#151618] text-white shadow-sm'
                : 'bg-white/60 hover:bg-white text-[#57595b]'
            }`}
          >
            <span className="material-symbols-outlined text-sm">schedule</span>
            Render Queue
          </button>
          <button
            onClick={() => setActiveTab('palettes')}
            className={`px-4 py-2 rounded-xl text-xs font-bold transition flex items-center gap-1.5 ${
              activeTab === 'palettes'
                ? 'bg-[#151618] text-white shadow-sm'
                : 'bg-white/60 hover:bg-white text-[#57595b]'
            }`}
          >
            <span className="material-symbols-outlined text-sm">palette</span>
            Design Tokens & Colors
          </button>
        </div>

        {activeTab === 'gallery' && (
          <div className="flex items-center gap-1 bg-white/70 p-1 rounded-xl">
            {(['All', 'Video', '3D', 'Vector', 'Still'] as const).map(type => (
              <button
                key={type}
                onClick={() => setFilterType(type)}
                className={`px-3 py-1 rounded-lg text-xs font-bold transition ${
                  filterType === type ? 'bg-[#151618] text-white shadow-sm' : 'text-[#57595b] hover:text-black'
                }`}
              >
                {type}
              </button>
            ))}
          </div>
        )}
      </div>

      {/* Asset Gallery */}
      {activeTab === 'gallery' && (
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-5">
          {filteredAssets.map(asset => (
            <div
              key={asset.id}
              onClick={() => setSelectedAsset(asset)}
              className="bg-white/90 backdrop-blur rounded-2xl overflow-hidden border border-white/60 shadow-sm hover:shadow-md hover:-translate-y-0.5 transition cursor-pointer group flex flex-col justify-between"
            >
              <div>
                <div className="aspect-[16/10] bg-neutral-900 relative overflow-hidden">
                  <img
                    src={asset.image}
                    alt={asset.name}
                    className="w-full h-full object-cover group-hover:scale-105 transition duration-500"
                  />
                  <div className="absolute top-2.5 left-2.5 flex items-center gap-1.5">
                    <span className="px-2 py-0.5 rounded text-[10px] font-mono font-bold bg-black/70 backdrop-blur text-white">
                      {asset.format}
                    </span>
                    {asset.resolution && (
                      <span className="px-1.5 py-0.5 rounded text-[10px] font-mono font-bold bg-black/60 text-white">
                        {asset.resolution}
                      </span>
                    )}
                  </div>
                  <div className="absolute top-2.5 right-2.5">
                    <span
                      className={`px-2 py-0.5 rounded text-[10px] font-bold uppercase ${
                        asset.status === 'Final'
                          ? 'bg-[#cfe5d2] text-[#1e4d23]'
                          : 'bg-[#f7d774] text-[#694400]'
                      }`}
                    >
                      {asset.status}
                    </span>
                  </div>
                </div>

                <div className="p-4 space-y-2">
                  <h3 className="font-bold text-sm text-[#151618] truncate group-hover:text-blue-600 transition">
                    {asset.name}
                  </h3>
                  <div className="flex items-center justify-between text-xs text-[#77777b]">
                    <span>Project: {asset.project}</span>
                    <span>{asset.type}</span>
                  </div>

                  <div className="flex flex-wrap gap-1 pt-1">
                    {asset.tags.map(t => (
                      <span key={t} className="text-[10px] px-1.5 py-0.5 bg-[#f5f6f8] rounded text-[#57595b] font-mono">
                        {t}
                      </span>
                    ))}
                  </div>
                </div>
              </div>

              <div className="px-4 pb-3 pt-0 flex items-center justify-between text-[11px] text-[#77777b] border-t border-black/5 mt-2">
                <span>Click for full preview</span>
                <span className="material-symbols-outlined text-sm">open_in_full</span>
              </div>
            </div>
          ))}
        </div>
      )}

      {/* Render Queue Tab */}
      {activeTab === 'render' && (
        <div className="bg-white/90 backdrop-blur rounded-2xl p-6 border border-white/60 shadow-sm space-y-4">
          <h3 className="font-bold text-base text-[#151618]">Hardware Acceleration & Render Queue</h3>
          <p className="text-xs text-[#77777b]">Connected to Apple Metal / NVIDIA OptiX workstation daemon</p>

          <div className="p-4 rounded-xl bg-[#fff8eb] border border-amber-200 space-y-3">
            <div className="flex items-center justify-between">
              <div className="flex items-center gap-2">
                <span className="w-2.5 h-2.5 rounded-full bg-amber-500 animate-ping"></span>
                <span className="text-xs font-bold text-[#694400]">ACTIVE RENDER: CineGrade AI LUT Generator</span>
              </div>
              <span className="text-xs font-black text-[#694400]">82% (4m 12s remaining)</span>
            </div>
            <div className="w-full bg-amber-200/60 rounded-full h-2.5">
              <div className="bg-[#bfa01e] h-2.5 rounded-full transition-all duration-300" style={{ width: '82%' }}></div>
            </div>
            <div className="flex items-center justify-between text-xs text-[#855400]">
              <span>Resolution: 3840x2160 • Codec: Apple ProRes 422 HQ</span>
              <span>GPU Temp: 68°C • VRAM: 7.2 GB / 16 GB</span>
            </div>
          </div>

          <div className="space-y-2 pt-2">
            <h4 className="font-bold text-xs text-[#57595b]">Finished Jobs Today:</h4>
            <div className="p-3 rounded-xl bg-[#f5f6f8] border border-black/5 flex items-center justify-between text-xs">
              <div className="flex items-center gap-3">
                <span className="material-symbols-outlined text-emerald-600">check_circle</span>
                <span className="font-bold text-[#151618]">SOL_Session42_Teaser_Final.mp4</span>
              </div>
              <span className="text-[#77777b]">Completed 2h ago • 380 MB</span>
            </div>
            <div className="p-3 rounded-xl bg-[#f5f6f8] border border-black/5 flex items-center justify-between text-xs">
              <div className="flex items-center gap-3">
                <span className="material-symbols-outlined text-emerald-600">check_circle</span>
                <span className="font-bold text-[#151618]">Trophy_Rig_Cycles_Turnaround.blend</span>
              </div>
              <span className="text-[#77777b]">Completed 5h ago • 1.2 GB</span>
            </div>
          </div>
        </div>
      )}

      {/* Palettes Tab */}
      {activeTab === 'palettes' && (
        <div className="grid grid-cols-1 md:grid-cols-3 gap-5">
          <div className="bg-white/90 backdrop-blur rounded-2xl p-5 border border-white/60 shadow-sm space-y-3">
            <h4 className="font-bold text-sm text-[#151618]">GOWRISH OS Core</h4>
            <div className="space-y-2">
              <div className="h-10 rounded-lg bg-[#C9D8E6] flex items-center justify-between px-3 text-xs font-mono font-bold text-[#151618]">
                <span>Canvas Blue</span>
                <span>#C9D8E6</span>
              </div>
              <div className="h-10 rounded-lg bg-[#2A2A2C] flex items-center justify-between px-3 text-xs font-mono font-bold text-white">
                <span>Charcoal Sidebar</span>
                <span>#2A2A2C</span>
              </div>
              <div className="h-10 rounded-lg bg-[#151618] flex items-center justify-between px-3 text-xs font-mono font-bold text-white">
                <span>Primary Dark</span>
                <span>#151618</span>
              </div>
            </div>
          </div>

          <div className="bg-white/90 backdrop-blur rounded-2xl p-5 border border-white/60 shadow-sm space-y-3">
            <h4 className="font-bold text-sm text-[#151618]">Toastmasters SOL Palette</h4>
            <div className="space-y-2">
              <div className="h-10 rounded-lg bg-[#F7D774] flex items-center justify-between px-3 text-xs font-mono font-bold text-[#694400]">
                <span>Gold Radiance</span>
                <span>#F7D774</span>
              </div>
              <div className="h-10 rounded-lg bg-[#D97D43] flex items-center justify-between px-3 text-xs font-mono font-bold text-white">
                <span>Amber Flame</span>
                <span>#D97D43</span>
              </div>
              <div className="h-10 rounded-lg bg-[#E3D3E8] flex items-center justify-between px-3 text-xs font-mono font-bold text-[#552763]">
                <span>Lilac Mist</span>
                <span>#E3D3E8</span>
              </div>
            </div>
          </div>

          <div className="bg-white/90 backdrop-blur rounded-2xl p-5 border border-white/60 shadow-sm space-y-3">
            <h4 className="font-bold text-sm text-[#151618]">Status Accents</h4>
            <div className="space-y-2">
              <div className="h-10 rounded-lg bg-[#CFE5D2] flex items-center justify-between px-3 text-xs font-mono font-bold text-[#1e4d23]">
                <span>Success Sage</span>
                <span>#CFE5D2</span>
              </div>
              <div className="h-10 rounded-lg bg-[#FCEEED] flex items-center justify-between px-3 text-xs font-mono font-bold text-[#9e3b30]">
                <span>Alert Crimson</span>
                <span>#FCEEED</span>
              </div>
              <div className="h-10 rounded-lg bg-[#D9E6E8] flex items-center justify-between px-3 text-xs font-mono font-bold text-[#2c4046]">
                <span>Cool Slate</span>
                <span>#D9E6E8</span>
              </div>
            </div>
          </div>
        </div>
      )}

      {/* Asset Preview Modal */}
      {selectedAsset && (
        <div
          className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/60 backdrop-blur-sm"
          onClick={() => setSelectedAsset(null)}
        >
          <div
            className="bg-white rounded-2xl max-w-2xl w-full overflow-hidden shadow-2xl space-y-4"
            onClick={e => e.stopPropagation()}
          >
            <div className="relative aspect-video bg-black flex items-center justify-center">
              <img
                src={selectedAsset.image}
                alt={selectedAsset.name}
                className="max-h-full max-w-full object-contain"
              />
              <button
                onClick={() => setSelectedAsset(null)}
                className="absolute top-3 right-3 w-8 h-8 rounded-full bg-black/60 hover:bg-black text-white flex items-center justify-center"
              >
                <span className="material-symbols-outlined text-sm">close</span>
              </button>
            </div>

            <div className="p-5 space-y-3">
              <div className="flex items-center justify-between">
                <div>
                  <h3 className="font-black text-lg text-[#151618]">{selectedAsset.name}</h3>
                  <div className="text-xs text-[#77777b]">
                    Format: {selectedAsset.format} • Type: {selectedAsset.type} • Resolution: {selectedAsset.resolution || 'Native Vector'}
                  </div>
                </div>
                <span className="px-3 py-1 rounded-full text-xs font-bold bg-[#cfe5d2] text-[#1e4d23]">
                  {selectedAsset.status}
                </span>
              </div>

              <div className="flex flex-wrap gap-1.5">
                {selectedAsset.tags.map(t => (
                  <span key={t} className="text-xs font-mono px-2 py-0.5 rounded bg-[#f5f6f8] text-[#57595b]">
                    {t}
                  </span>
                ))}
              </div>

              <div className="pt-3 border-t border-black/10 flex items-center justify-end gap-2">
                <a
                  href={selectedAsset.image}
                  target="_blank"
                  rel="noreferrer"
                  className="px-4 py-2 rounded-xl bg-black text-white text-xs font-bold hover:bg-neutral-800 transition flex items-center gap-1.5"
                >
                  <span className="material-symbols-outlined text-sm">open_in_new</span>
                  Open High-Res Source
                </a>
              </div>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};
