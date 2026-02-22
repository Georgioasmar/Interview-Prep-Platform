import { useState, useRef, useCallback } from "react";
import {
  ChevronRight, ChevronLeft, GraduationCap, Briefcase,
  GripHorizontal, Trash2, Loader, GitBranch, X
} from "lucide-react";
import { supabase } from "../lib/supabase";
import { useEffect } from "react";

// ─── Constants ────────────────────────────────────────────────────────────────
const NODE_W = 288;
const NODE_H = 192;
const generateId = () => `n_${Math.random().toString(36).substr(2, 9)}`;

const bezier = (x1, y1, x2, y2) => {
  const dx = Math.abs(x2 - x1);
  const off = Math.max(dx * 0.55, 80);
  return `M ${x1} ${y1} C ${x1 + off} ${y1}, ${x2 - off} ${y2}, ${x2} ${y2}`;
};

// ─── Data Hook ────────────────────────────────────────────────────────────────
function usePlannerData() {
  const [data, setData] = useState({
    schools: [], companies: [], fields: [], tiers: [],
    roles: [], levels: [], schoolFields: [], schoolTypes: [],
  });
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    Promise.all([
      supabase.from("planner_schools").select("*, planner_school_types(id, name, color)").order("name"),
      supabase.from("planner_companies").select("*").order("name"),
      supabase.from("planner_fields").select("*").order("name"),
      supabase.from("planner_tiers").select("*").order("order"),
      supabase.from("planner_roles").select("*").order("name"),
      supabase.from("planner_levels").select("*").order("order"),
      supabase.from("planner_school_fields").select("school_id, field_id"),
      supabase.from("planner_school_types").select("*"),
    ]).then(([s, c, f, t, r, l, sf, st]) => {
      setData({
        schools: s.data ?? [],
        companies: c.data ?? [],
        fields: f.data ?? [],
        tiers: t.data ?? [],
        roles: r.data ?? [],
        levels: l.data ?? [],
        schoolFields: sf.data ?? [],
        schoolTypes: st.data ?? [],
      });
      setLoading(false);
    });
  }, []);

  return { ...data, loading };
}

// ─── School Type Badge — shown on the card ────────────────────────────────────
function TypeBadge({ label, color }) {
  if (!label || !color) return null;
  return (
    <span
      className="inline-flex items-center text-[9px] font-bold uppercase tracking-widest px-2 py-0.5 rounded-full border"
      style={{ color, borderColor: color + "50", background: color + "14" }}
    >
      {label}
    </span>
  );
}

// ─── Node Card ────────────────────────────────────────────────────────────────
function NodeCard({
  node, pan, fields, tiers, roles, levels, schoolFields,
  onDelete, onDataChange, onStartConnect, onHoverHandle,
  hoveredTarget, connectingFrom,
}) {
  const isEdu = node.type === "education";
  const isMBA = isEdu && node.data.field_id === "mba";

  const whitelistedIds = schoolFields
    .filter((sf) => sf.school_id === node.entityId)
    .map((sf) => sf.field_id);
  const availableFields = whitelistedIds.length > 0
    ? fields.filter((f) => whitelistedIds.includes(f.id))
    : fields;

  const availableTiers = isMBA ? tiers.filter((t) => t.id === "master") : tiers;

  const accent = isEdu ? "#6366f1" : "#8b5cf6";
  const accentBorder = accent + "28";
  const accentBg = accent + "08";

  return (
    <div
      className="absolute"
      style={{
        transform: `translate(${node.x + pan.x}px, ${node.y + pan.y}px)`,
        width: NODE_W,
        zIndex: 20,
        pointerEvents: "auto",
      }}
    >
      {/* Input handle (left) */}
      <div
        className="absolute -left-3 top-1/2 w-6 h-6 rounded-full flex items-center justify-center cursor-crosshair z-30 transition-all duration-150"
        style={{
          background: hoveredTarget === node.id ? accent : "#111827",
          border: `2px solid ${hoveredTarget === node.id ? accent : "#374151"}`,
          transform: `translateY(-50%) scale(${hoveredTarget === node.id ? 1.25 : 1})`,
        }}
        onMouseEnter={() => onHoverHandle(node.id)}
        onMouseLeave={() => onHoverHandle(null)}
      >
        <div className="w-2 h-2 rounded-full bg-slate-950" />
      </div>

      {/* Output handle (right) */}
      <div
        className="absolute -right-3 top-1/2 w-6 h-6 rounded-full flex items-center justify-center cursor-crosshair z-30 transition-all duration-150 hover:scale-125"
        style={{
          background: connectingFrom === node.id ? accent : "#111827",
          border: `2px solid ${connectingFrom === node.id ? accent : "#374151"}`,
          transform: "translateY(-50%)",
        }}
        onPointerDown={(e) => { e.stopPropagation(); onStartConnect(node.id); }}
      >
        <div className="w-2 h-2 rounded-full" style={{ background: accent }} />
      </div>

      {/* Card body */}
      <div
        className="rounded-xl overflow-hidden"
        style={{
          background: "#0d0d0f",
          border: `1px solid ${accentBorder}`,
          boxShadow: `0 0 0 1px ${accentBorder}, 0 20px 40px rgba(0,0,0,0.55)`,
        }}
      >
        {/* Header — drag zone */}
        <div
          className="px-4 pt-3 pb-2.5 cursor-grab active:cursor-grabbing no-pan"
          style={{ background: accentBg, borderBottom: `1px solid ${accentBorder}` }}
          onPointerDown={(e) => { e.stopPropagation(); window._dragNodeId = node.id; }}
        >
          {/* Row 1: grip + icon + name + delete */}
          <div className="flex items-center gap-2">
            <GripHorizontal size={13} className="text-slate-700 shrink-0" />
            {isEdu
              ? <GraduationCap size={14} style={{ color: accent }} className="shrink-0" />
              : <Briefcase size={14} style={{ color: accent }} className="shrink-0" />
            }
            <span className="text-sm font-semibold text-slate-100 truncate flex-1 leading-tight">
              {node.title}
            </span>
            <button
              onClick={() => onDelete(node.id)}
              className="text-slate-700 hover:text-red-400 transition-colors shrink-0 p-0.5 rounded"
            >
              <Trash2 size={12} />
            </button>
          </div>

          {/* Row 2: type badge, sits just below the title, left-aligned after grip */}
          <div className="mt-1.5 pl-[38px]">
            {isEdu && node.schoolType && (
              <TypeBadge label={node.schoolType.name} color={node.schoolType.color} />
            )}
            {!isEdu && node.industry && (
              <TypeBadge label={node.industry} color="#8b5cf6" />
            )}
          </div>
        </div>

        {/* Dropdowns */}
        <div className="p-4 space-y-3">
          {isEdu ? (
            <>
              <div>
                <label className="block text-[10px] font-bold text-slate-500 uppercase tracking-widest mb-1.5">
                  Field of Study
                </label>
                <select
                  value={node.data.field_id ?? ""}
                  onChange={(e) => onDataChange(node.id, "field_id", e.target.value)}
                  className="w-full bg-slate-900 border border-slate-800 text-sm rounded-lg px-3 py-2 text-slate-200 focus:outline-none focus:ring-1 focus:ring-indigo-500 focus:border-indigo-500"
                >
                  <option value="">Select field...</option>
                  {availableFields.map((f) => (
                    <option key={f.id} value={f.id}>{f.name}</option>
                  ))}
                </select>
              </div>
              <div>
                <label className="block text-[10px] font-bold text-slate-500 uppercase tracking-widest mb-1.5 flex items-center justify-between">
                  <span>Degree</span>
                  {isMBA && <span className="text-indigo-400 font-normal normal-case text-[9px]">locked by MBA</span>}
                </label>
                <select
                  value={node.data.tier_id ?? ""}
                  onChange={(e) => onDataChange(node.id, "tier_id", e.target.value)}
                  disabled={isMBA}
                  className="w-full bg-slate-900 border border-slate-800 text-sm rounded-lg px-3 py-2 text-slate-200 focus:outline-none focus:ring-1 focus:ring-indigo-500 disabled:opacity-40 disabled:cursor-not-allowed"
                >
                  <option value="">Select degree...</option>
                  {availableTiers.map((t) => (
                    <option key={t.id} value={t.id}>{t.name}</option>
                  ))}
                </select>
              </div>
            </>
          ) : (
            <>
              <div>
                <label className="block text-[10px] font-bold text-slate-500 uppercase tracking-widest mb-1.5">Role</label>
                <select
                  value={node.data.role_id ?? ""}
                  onChange={(e) => onDataChange(node.id, "role_id", e.target.value)}
                  className="w-full bg-slate-900 border border-slate-800 text-sm rounded-lg px-3 py-2 text-slate-200 focus:outline-none focus:ring-1 focus:ring-violet-500"
                >
                  <option value="">Select role...</option>
                  {roles.map((r) => (
                    <option key={r.id} value={r.id}>{r.name}</option>
                  ))}
                </select>
              </div>
              <div>
                <label className="block text-[10px] font-bold text-slate-500 uppercase tracking-widest mb-1.5">Level</label>
                <select
                  value={node.data.level_id ?? ""}
                  onChange={(e) => onDataChange(node.id, "level_id", e.target.value)}
                  className="w-full bg-slate-900 border border-slate-800 text-sm rounded-lg px-3 py-2 text-slate-200 focus:outline-none focus:ring-1 focus:ring-violet-500"
                >
                  <option value="">Select level...</option>
                  {levels.map((l) => (
                    <option key={l.id} value={l.id}>{l.name}</option>
                  ))}
                </select>
              </div>
            </>
          )}
        </div>
      </div>
    </div>
  );
}

// ─── Sidebar Item ─────────────────────────────────────────────────────────────
function SidebarItem({ item, type }) {
  const isEdu = type === "education";
  const schoolType = item.planner_school_types ?? null;

  return (
    <div
      draggable
      onDragStart={(e) =>
        e.dataTransfer.setData("application/json", JSON.stringify({ ...item, type }))
      }
      className="group flex items-center gap-3 p-3 rounded-xl border border-slate-800 bg-[#0d0d0f] cursor-grab active:cursor-grabbing hover:border-slate-700 hover:bg-slate-900/30 transition-all duration-150"
      style={{ userSelect: "none" }}
    >
      <div
        className="p-2 rounded-lg shrink-0"
        style={{ background: isEdu ? "rgba(99,102,241,0.1)" : "rgba(139,92,246,0.1)" }}
      >
        {isEdu
          ? <GraduationCap size={14} className="text-indigo-400" />
          : <Briefcase size={14} className="text-violet-400" />
        }
      </div>
      <div className="min-w-0 flex-1">
        <p className="text-sm font-semibold text-slate-200 truncate leading-tight">{item.name}</p>
        <div className="flex items-center gap-1.5 mt-0.5">
          {isEdu && schoolType && (
            <span className="text-[9px] font-bold uppercase tracking-widest" style={{ color: schoolType.color }}>
              {schoolType.name}
            </span>
          )}
          {isEdu && item.country && (
            <span className="text-[10px] text-slate-600">{item.country}</span>
          )}
          {!isEdu && item.industry && (
            <span className="text-[10px] text-slate-500 truncate">{item.industry}</span>
          )}
        </div>
      </div>
      <GripHorizontal size={14} className="text-slate-700 opacity-0 group-hover:opacity-100 transition-opacity shrink-0" />
    </div>
  );
}

// ─── Type Filter Pills ─────────────────────────────────────────────────────────
function TypeFilterPills({ schoolTypes, activeFilter, onFilter }) {
  return (
    <div className="px-3 py-2.5 border-b border-slate-800 flex gap-1.5 flex-wrap">
      <button
        onClick={() => onFilter(null)}
        className={`text-[10px] font-bold uppercase tracking-widest px-2.5 py-1 rounded-full border transition-all ${
          activeFilter === null
            ? "bg-slate-800 border-slate-700 text-slate-300"
            : "border-slate-800 text-slate-600 hover:text-slate-400 hover:border-slate-700"
        }`}
      >
        All
      </button>
      {schoolTypes.map((st) => (
        <button
          key={st.id}
          onClick={() => onFilter(activeFilter === st.id ? null : st.id)}
          className="text-[10px] font-bold uppercase tracking-widest px-2.5 py-1 rounded-full border transition-all"
          style={
            activeFilter === st.id
              ? { color: st.color, borderColor: st.color + "55", background: st.color + "18" }
              : { color: "#475569", borderColor: "#1e293b" }
          }
        >
          {st.name}
        </button>
      ))}
    </div>
  );
}

// ─── Main Planner View ────────────────────────────────────────────────────────
export function PlannerView() {
  const { schools, companies, fields, tiers, roles, levels, schoolFields, schoolTypes, loading } = usePlannerData();

  const [nodes, setNodes] = useState([]);
  const [edges, setEdges] = useState([]);
  const [pan, setPan] = useState({ x: 0, y: 0 });
  const [isPanning, setIsPanning] = useState(false);
  const [panStart, setPanStart] = useState({ x: 0, y: 0 });
  const [connectingFrom, setConnectingFrom] = useState(null);
  const [mousePos, setMousePos] = useState({ x: 0, y: 0 });
  const [hoveredTarget, setHoveredTarget] = useState(null);
  const [panelOpen, setPanelOpen] = useState(true);
  const [activeTab, setActiveTab] = useState("education");
  const [search, setSearch] = useState("");
  const [typeFilter, setTypeFilter] = useState(null);
  const mapRef = useRef(null);

  const handlePointerDown = useCallback((e) => {
    if (e.button !== 0) return;
    if (e.target.closest(".no-pan")) return;
    setIsPanning(true);
    setPanStart({ x: e.clientX - pan.x, y: e.clientY - pan.y });
  }, [pan]);

  const handlePointerMove = useCallback((e) => {
    if (window._dragNodeId) {
      setNodes((prev) => prev.map((n) =>
        n.id === window._dragNodeId ? { ...n, x: n.x + e.movementX, y: n.y + e.movementY } : n
      ));
      return;
    }
    if (isPanning) {
      setPan({ x: e.clientX - panStart.x, y: e.clientY - panStart.y });
      return;
    }
    if (connectingFrom && mapRef.current) {
      const rect = mapRef.current.getBoundingClientRect();
      setMousePos({ x: e.clientX - rect.left, y: e.clientY - rect.top });
    }
  }, [isPanning, panStart, connectingFrom]);

  const handlePointerUp = useCallback(() => {
    if (window._dragNodeId) { window._dragNodeId = null; return; }
    setIsPanning(false);
    if (connectingFrom) {
      if (hoveredTarget && hoveredTarget !== connectingFrom) {
        const exists = edges.some((e) => e.source === connectingFrom && e.target === hoveredTarget);
        if (!exists) setEdges((prev) => [...prev, { id: generateId(), source: connectingFrom, target: hoveredTarget }]);
      }
      setConnectingFrom(null);
    }
  }, [connectingFrom, hoveredTarget, edges]);

  const handleDrop = (e) => {
    e.preventDefault();
    const raw = e.dataTransfer.getData("application/json");
    if (!raw || !mapRef.current) return;
    const item = JSON.parse(raw);
    const rect = mapRef.current.getBoundingClientRect();
    setNodes((prev) => [...prev, {
      id: generateId(),
      type: item.type,
      title: item.name,
      entityId: item.id,
      schoolType: item.type === "education" ? (item.planner_school_types ?? null) : null,
      industry: item.type === "experience" ? item.industry : null,
      x: e.clientX - rect.left - pan.x - NODE_W / 2,
      y: e.clientY - rect.top  - pan.y - NODE_H / 2,
      data: item.type === "education" ? { field_id: "", tier_id: "" } : { role_id: "", level_id: "" },
    }]);
  };

  const deleteNode = (id) => {
    setNodes((prev) => prev.filter((n) => n.id !== id));
    setEdges((prev) => prev.filter((e) => e.source !== id && e.target !== id));
  };

  const handleDataChange = (nodeId, key, value) => {
    setNodes((prev) => prev.map((n) => {
      if (n.id !== nodeId) return n;
      const d = { ...n.data, [key]: value };
      if (key === "field_id" && value === "mba") d.tier_id = "master";
      return { ...n, data: d };
    }));
  };

  const nodeHandles = (id) => {
    const n = nodes.find((nd) => nd.id === id);
    if (!n) return null;
    return {
      outX: n.x + pan.x + NODE_W + 12, outY: n.y + pan.y + NODE_H / 2,
      inX:  n.x + pan.x - 12,          inY:  n.y + pan.y + NODE_H / 2,
    };
  };

  const rawItems = activeTab === "education" ? schools : companies;
  const filteredItems = rawItems.filter((i) => {
    const q = search.toLowerCase();
    const matchSearch = !q || i.name.toLowerCase().includes(q);
    const matchType = !typeFilter || i.school_type_id === typeFilter;
    return matchSearch && matchType;
  });

  if (loading) return (
    <div className="flex items-center justify-center h-[calc(100vh-8rem)] text-slate-500">
      <Loader size={20} className="animate-spin mr-2.5" /> Loading planner...
    </div>
  );

  return (
    <div className="flex h-[calc(100vh-4rem)] -mx-4 -mb-8 overflow-hidden">

      {/* ── MAP ── */}
      <div
        ref={mapRef}
        className="flex-1 relative overflow-hidden"
        style={{ background: "#0a0a0c", cursor: isPanning ? "grabbing" : "default" }}
        onPointerDown={handlePointerDown}
        onPointerMove={handlePointerMove}
        onPointerUp={handlePointerUp}
        onPointerLeave={handlePointerUp}
        onDragOver={(e) => e.preventDefault()}
        onDrop={handleDrop}
      >
        {/* Dot grid */}
        <div className="absolute inset-0 pointer-events-none" style={{
          backgroundImage: "radial-gradient(circle, #1e293b 1px, transparent 1px)",
          backgroundSize: "28px 28px",
          backgroundPosition: `${pan.x % 28}px ${pan.y % 28}px`,
          opacity: 0.5,
        }} />

        {/* Vignette */}
        <div className="absolute inset-0 pointer-events-none" style={{
          background: "radial-gradient(ellipse at center, transparent 50%, #0a0a0c 100%)"
        }} />

        {/* SVG edges */}
        <svg className="absolute inset-0 w-full h-full pointer-events-none" style={{ zIndex: 10 }}>
          <defs>
            <marker id="arrow" markerWidth="8" markerHeight="6" refX="7" refY="3" orient="auto">
              <polygon points="0 0, 8 3, 0 6" fill="#4f46e5" opacity="0.65" />
            </marker>
          </defs>

          {connectingFrom && (() => {
            const h = nodeHandles(connectingFrom);
            if (!h) return null;
            return <path d={bezier(h.outX, h.outY, mousePos.x, mousePos.y)}
              fill="none" stroke="#6366f1" strokeWidth="2" strokeDasharray="6 4" opacity="0.5" />;
          })()}

          {edges.map((edge) => {
            const s = nodeHandles(edge.source);
            const t = nodeHandles(edge.target);
            if (!s || !t) return null;
            const mx = (s.outX + t.inX) / 2;
            const my = (s.outY + t.inY) / 2;
            return (
              <g key={edge.id} className="pointer-events-auto group">
                <path d={bezier(s.outX, s.outY, t.inX, t.inY)}
                  fill="none" stroke="#4f46e5" strokeWidth="1.5"
                  opacity="0.4" markerEnd="url(#arrow)"
                  className="group-hover:opacity-10 transition-opacity" />
                <path d={bezier(s.outX, s.outY, t.inX, t.inY)}
                  fill="none" stroke="transparent" strokeWidth="20"
                  className="cursor-pointer"
                  onClick={() => setEdges((prev) => prev.filter((e) => e.id !== edge.id))} />
                <g className="opacity-0 group-hover:opacity-100 transition-opacity pointer-events-none">
                  <circle cx={mx} cy={my} r={9} fill="#0d0d0f" stroke="#ef4444" strokeWidth="1" />
                  <line x1={mx-3} y1={my-3} x2={mx+3} y2={my+3} stroke="#ef4444" strokeWidth="1.5" strokeLinecap="round" />
                  <line x1={mx+3} y1={my-3} x2={mx-3} y2={my+3} stroke="#ef4444" strokeWidth="1.5" strokeLinecap="round" />
                </g>
              </g>
            );
          })}
        </svg>

        {/* Nodes layer */}
        <div className="absolute inset-0 pointer-events-none" style={{ zIndex: 20 }}>
          {nodes.map((node) => (
            <NodeCard
              key={node.id} node={node} pan={pan}
              fields={fields} tiers={tiers} roles={roles} levels={levels}
              schoolFields={schoolFields}
              onDelete={deleteNode} onDataChange={handleDataChange}
              onStartConnect={setConnectingFrom} onHoverHandle={setHoveredTarget}
              hoveredTarget={hoveredTarget} connectingFrom={connectingFrom}
            />
          ))}
        </div>

        {/* Empty state */}
        {nodes.length === 0 && (
          <div className="absolute inset-0 flex items-center justify-center pointer-events-none">
            <div className="flex flex-col items-center gap-4 text-center">
              <div className="w-14 h-14 rounded-2xl border border-slate-800 bg-slate-900/40 flex items-center justify-center">
                <GitBranch size={24} className="text-slate-600" />
              </div>
              <div>
                <p className="text-slate-400 font-semibold text-sm mb-1">Your career map is empty</p>
                <p className="text-slate-600 text-xs">Drag schools or companies from the panel to start</p>
              </div>
              <div className="flex items-center gap-2 text-[11px] text-slate-700 mt-1">
                <span className="px-2 py-1 rounded border border-slate-800 bg-slate-900/50">Drag to place</span>
                <span>→</span>
                <span className="px-2 py-1 rounded border border-slate-800 bg-slate-900/50">Connect handles</span>
                <span>→</span>
                <span className="px-2 py-1 rounded border border-slate-800 bg-slate-900/50">Build your path</span>
              </div>
            </div>
          </div>
        )}

        {/* Stats + clear */}
        {nodes.length > 0 && (
          <div className="absolute top-4 left-4 flex items-center gap-2" style={{ zIndex: 30, pointerEvents: "auto" }}>
            <div className="text-xs text-slate-500 border border-slate-800 bg-[#0d0d0f]/90 px-3 py-1.5 rounded-full backdrop-blur-sm">
              {nodes.length} block{nodes.length !== 1 ? "s" : ""} · {edges.length} link{edges.length !== 1 ? "s" : ""}
            </div>
            <button
              onClick={() => { setNodes([]); setEdges([]); }}
              className="flex items-center gap-1.5 text-xs text-slate-600 hover:text-red-400 border border-slate-800 hover:border-red-900/40 bg-[#0d0d0f]/90 px-3 py-1.5 rounded-full transition-all backdrop-blur-sm"
            >
              <X size={11} /> Clear
            </button>
          </div>
        )}
      </div>

      {/* ── SIDE PANEL ── */}
      <div
        className="relative z-50 flex flex-col border-l border-slate-800 transition-all duration-300 ease-in-out"
        style={{ width: panelOpen ? 308 : 0, background: "#0d0d0f", overflow: panelOpen ? "visible" : "hidden" }}
      >
        <button
          onClick={() => setPanelOpen(!panelOpen)}
          className="absolute top-6 -left-9 w-9 h-10 flex items-center justify-center border border-slate-800 border-r-0 rounded-l-lg text-slate-500 hover:text-slate-200 hover:bg-slate-900 transition-all"
          style={{ background: "#0d0d0f", zIndex: 60 }}
        >
          {panelOpen ? <ChevronRight size={15} /> : <ChevronLeft size={15} />}
        </button>

        {panelOpen && (
          <div className="flex flex-col h-full w-[308px]">
            {/* Header */}
            <div className="px-5 py-4 border-b border-slate-800">
              <h3 className="font-bold text-slate-100 text-sm tracking-tight">Career Blocks</h3>
              <p className="text-xs text-slate-500 mt-0.5">Drag onto the map to build your path</p>
            </div>

            {/* Tabs */}
            <div className="flex border-b border-slate-800">
              {["education", "experience"].map((tab) => (
                <button
                  key={tab}
                  onClick={() => { setActiveTab(tab); setSearch(""); setTypeFilter(null); }}
                  className="flex-1 py-3 text-xs font-bold uppercase tracking-widest transition-colors relative"
                  style={{ color: activeTab === tab ? (tab === "education" ? "#6366f1" : "#8b5cf6") : "#475569" }}
                >
                  {tab === "education"
                    ? <><GraduationCap size={12} className="inline mr-1" />Schools</>
                    : <><Briefcase size={12} className="inline mr-1" />Companies</>
                  }
                  {activeTab === tab && (
                    <span className="absolute bottom-0 left-0 right-0 h-0.5 rounded-t"
                      style={{ background: tab === "education" ? "#6366f1" : "#8b5cf6" }} />
                  )}
                </button>
              ))}
            </div>

            {/* School type filter pills */}
            {activeTab === "education" && (
              <TypeFilterPills
                schoolTypes={schoolTypes}
                activeFilter={typeFilter}
                onFilter={setTypeFilter}
              />
            )}

            {/* Search */}
            <div className="px-3 py-2 border-b border-slate-800">
              <input
                type="text"
                value={search}
                onChange={(e) => setSearch(e.target.value)}
                placeholder={`Search ${activeTab === "education" ? "schools" : "companies"}...`}
                className="w-full bg-slate-900 border border-slate-800 rounded-lg px-3 py-2 text-xs text-slate-300 placeholder-slate-600 focus:outline-none focus:border-slate-700"
              />
            </div>

            {/* Items list */}
            <div className="flex-1 overflow-y-auto p-3 space-y-2" style={{ scrollbarWidth: "thin", scrollbarColor: "#1e293b transparent" }}>
              {filteredItems.length === 0
                ? <p className="text-center text-slate-600 text-xs py-10 italic">No results.</p>
                : filteredItems.map((item) => (
                    <SidebarItem key={item.id} item={item} type={activeTab} />
                  ))
              }
            </div>

            {/* Footer hint */}
            <div className="px-4 py-3 border-t border-slate-800">
              <p className="text-[10px] text-slate-600 leading-relaxed">
                Drag the <span className="text-indigo-400">●</span> right handle to another block's <span className="text-indigo-400">●</span> left handle to connect. Click a line to delete it.
              </p>
            </div>
          </div>
        )}
      </div>
    </div>
  );
}