import React, { useState, useEffect, useMemo } from "react";
import axios from "axios";
import toast, { Toaster } from "react-hot-toast";
import {
  BarChart,
  Bar,
  XAxis,
  YAxis,
  Tooltip,
  ResponsiveContainer,
  Cell,
  PieChart,
  Pie,
  Area,
  AreaChart,
  RadarChart,
  PolarGrid,
  PolarAngleAxis,
  PolarRadiusAxis,
  Radar,
} from "recharts";
import {
  Search,
  Filter,
  Trash2,
  Edit3,
  DollarSign,
  Layers,
  TrendingUp,
  Sparkles,
  X,
  Target,
  Zap,
  BarChart3,
  PieChart as PieChartIcon,
  Activity,
} from "lucide-react";
import type { Campaign } from "../types";

// Isay update karein
const API_BASE_URL = "https://test-project-s92a.onrender.com/api/campaigns";
const AI_API_URL = "https://test-project-s92a.onrender.com/api/ai/generate";

const Dashboard: React.FC = () => {
  const [campaigns, setCampaigns] = useState<Campaign[]>([]);
  const [loading, setLoading] = useState(true);
  const [searchTerm, setSearchTerm] = useState("");
  const [filterPlatform, setFilterPlatform] = useState("All");

  const [isModalOpen, setIsModalOpen] = useState(false);
  const [editId, setEditId] = useState<number | null>(null);
  const [newCampaign, setNewCampaign] = useState({
    title: "",
    platform: "Facebook",
    budget: "",
  });
  const [generatedDescription, setGeneratedDescription] = useState("");
  const [isAiLoading, setIsAiLoading] = useState(false);

  useEffect(() => {
    fetchCampaigns();
  }, []);

  const fetchCampaigns = async () => {
    try {
      const res = await axios.get(API_BASE_URL);
      setCampaigns(res.data);
    } catch (err) {
      toast.error("Failed to load campaigns");
    } finally {
      setLoading(false);
    }
  };
  // Ai logic
  const generateAIDescription = async () => {
    if (!newCampaign.title) return toast.error("Please enter a title first");

    setIsAiLoading(true);
    try {
      const res = await axios.post(AI_API_URL, {
        title: newCampaign.title,
        platform: newCampaign.platform,
      });

      setGeneratedDescription(res.data.description);
      toast.success("AI Description Ready!");
    } catch (error) {
      console.error("AI Error:", error);
      toast.error("AI Generation failed");
    } finally {
      setIsAiLoading(false);
    }
  };

  const handleEditClick = (campaign: Campaign) => {
    setEditId(campaign.id);
    setNewCampaign({
      title: campaign.title,
      platform: campaign.platform,
      budget: String(campaign.budget),
    });
    setGeneratedDescription(campaign.description || "");
    setIsModalOpen(true);
  };

  const handleSave = async (e: React.FormEvent) => {
    e.preventDefault();
    const payload = {
      ...newCampaign,
      budget: Number(newCampaign.budget),
      description: generatedDescription,
    };
    try {
      if (editId) {
        const res = await axios.put(`${API_BASE_URL}/${editId}`, payload);

        setCampaigns(campaigns.map((c) => (c.id === editId ? res.data : c)));
        toast.success("Updated!");
      } else {
        const res = await axios.post(API_BASE_URL, payload);
        setCampaigns([res.data, ...campaigns]);
        toast.success("Created!");
      }
      closeModal();
    } catch (err) {
      toast.error("Action failed");
    }
  };

  const handleDelete = async (id: number) => {
    if (!window.confirm("Delete this?")) return;
    try {
      await axios.delete(`${API_BASE_URL}/${id}`);
      setCampaigns(campaigns.filter((c) => c.id !== id));
      toast.success("Deleted");
    } catch (err) {
      toast.error("Delete failed");
    }
  };

  const closeModal = () => {
    setIsModalOpen(false);
    setEditId(null);
    setNewCampaign({ title: "", platform: "Facebook", budget: "" });
    setGeneratedDescription("");
  };

  const filteredCampaigns = useMemo(() => {
    return campaigns.filter((c) => {
      const cleanSearch = searchTerm.trim().toLowerCase();
      const searchFields =
        `${c.title} ${c.description} ${c.platform}`.toLowerCase();
      return (
        searchFields.includes(cleanSearch) &&
        (filterPlatform === "All" || c.platform === filterPlatform)
      );
    });
  }, [campaigns, searchTerm, filterPlatform]);

  const totalBudget = filteredCampaigns.reduce(
    (acc, curr) => acc + Number(curr.budget),
    0,
  );

  const platformColors: Record<string, string> = {
    Facebook: "#3b82f6",
    Google: "#f43f5e",
    LinkedIn: "#0ea5e9",
    Twitter: "#14b8a6",
  };

  const platformStats = useMemo(() => {
    return ["Facebook", "Google", "LinkedIn", "Twitter"].map((p) => ({
      name: p,
      count: filteredCampaigns.filter((c) => c.platform === p).length,
      budget: filteredCampaigns
        .filter((c) => c.platform === p)
        .reduce((acc, c) => acc + Number(c.budget), 0),
      fill: platformColors[p],
    }));
  }, [filteredCampaigns]);

  // Radar chart data
  const radarData = platformStats.map((p) => ({
    platform: p.name,
    campaigns: p.count,
    budget: p.budget / 1000, // Scale down for better visualization
  }));

  if (loading)
    return (
      <div className="flex h-screen items-center justify-center">
        <div className="text-center">
          <div className="w-16 h-16 border-4 border-indigo-600 border-t-transparent rounded-full animate-spin mx-auto mb-4"></div>
          <p className="text-xl font-bold bg-gradient-to-r from-indigo-600 to-purple-600 bg-clip-text text-transparent">
            Loading Dashboard...
          </p>
        </div>
      </div>
    );

  return (
    <div className="min-h-screen bg-gradient-to-br from-slate-50 via-blue-50 to-indigo-50">
      <Toaster position="top-right" />

      {/* HEADER */}
      <div className="bg-white/80 backdrop-blur-xl border-b border-gray-200 sticky top-0 z-40">
        <div className="max-w-7xl mx-auto px-6 py-6">
          <div className="flex items-center justify-between">
            <div>
              <h1 className="text-3xl font-black bg-gradient-to-r from-indigo-600 via-purple-600 to-pink-600 bg-clip-text text-transparent">
                Campaign Analytics
              </h1>
              <p className="text-gray-500 mt-1">
                Monitor and optimize your marketing performance
              </p>
            </div>
            <button
              onClick={() => setIsModalOpen(true)}
              className="group relative px-6 py-3 bg-gradient-to-r from-indigo-600 to-purple-600 text-white rounded-xl font-bold shadow-lg hover:shadow-xl transition-all duration-300 hover:scale-105 active:scale-95"
            >
              <span className="flex items-center gap-2">
                <Sparkles size={18} className="animate-pulse" />
                Create Campaign
              </span>
            </button>
          </div>
        </div>
      </div>

      <div className="max-w-7xl mx-auto px-6 py-8 space-y-8">
        {/* ENHANCED STATS */}
        <div className="grid grid-cols-1 md:grid-cols-4 gap-6">
          <StatCard
            icon={<DollarSign />}
            label="Total Budget"
            value={`$${totalBudget.toLocaleString()}`}
            gradient="from-emerald-500 to-teal-600"
            bgGradient="from-emerald-50 to-teal-50"
          />
          <StatCard
            icon={<Layers />}
            label="Active Campaigns"
            value={filteredCampaigns.length}
            gradient="from-blue-500 to-indigo-600"
            bgGradient="from-blue-50 to-indigo-50"
          />
          <StatCard
            icon={<TrendingUp />}
            label="Avg. Budget"
            value={`$${filteredCampaigns.length ? Math.round(totalBudget / filteredCampaigns.length) : 0}`}
            gradient="from-purple-500 to-pink-600"
            bgGradient="from-purple-50 to-pink-50"
          />
          <StatCard
            icon={<Target />}
            label="Platforms"
            value={platformStats.filter((p) => p.count > 0).length}
            gradient="from-orange-500 to-red-600"
            bgGradient="from-orange-50 to-red-50"
          />
        </div>

        {/* CHARTS SECTION */}
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
          {/* BAR CHART */}
          <div className="bg-white/80 backdrop-blur-xl p-8 rounded-3xl shadow-xl border border-gray-100 hover:shadow-2xl transition-shadow">
            <div className="flex items-center gap-3 mb-6">
              <div className="p-3 bg-gradient-to-br from-blue-500 to-indigo-600 rounded-xl">
                <BarChart3 className="text-white" size={24} />
              </div>
              <div>
                <h2 className="text-xl font-bold text-gray-800">
                  Campaign Distribution
                </h2>
                <p className="text-sm text-gray-500">By platform</p>
              </div>
            </div>
            <div className="h-72">
              <ResponsiveContainer width="100%" height="100%">
                <BarChart data={platformStats}>
                  <defs>
                    <linearGradient
                      id="barGradient"
                      x1="0"
                      y1="0"
                      x2="0"
                      y2="1"
                    >
                      <stop offset="0%" stopColor="#6366f1" stopOpacity={0.8} />
                      <stop
                        offset="100%"
                        stopColor="#8b5cf6"
                        stopOpacity={0.3}
                      />
                    </linearGradient>
                  </defs>
                  <XAxis
                    dataKey="name"
                    axisLine={false}
                    tickLine={false}
                    tick={{ fill: "#6b7280", fontSize: 12 }}
                  />
                  <YAxis
                    axisLine={false}
                    tickLine={false}
                    tick={{ fill: "#6b7280", fontSize: 12 }}
                  />
                  <Tooltip
                    cursor={{ fill: "rgba(99, 102, 241, 0.1)" }}
                    contentStyle={{
                      borderRadius: "16px",
                      border: "none",
                      boxShadow: "0 10px 40px rgba(0,0,0,0.1)",
                    }}
                  />
                  <Bar dataKey="count" radius={[12, 12, 0, 0]}>
                    {platformStats.map((entry, index) => (
                      <Cell key={`cell-${index}`} fill={entry.fill} />
                    ))}
                  </Bar>
                </BarChart>
              </ResponsiveContainer>
            </div>
          </div>

          {/* PIE CHART */}
          <div className="bg-white/80 backdrop-blur-xl p-8 rounded-3xl shadow-xl border border-gray-100 hover:shadow-2xl transition-shadow">
            <div className="flex items-center gap-3 mb-6">
              <div className="p-3 bg-gradient-to-br from-purple-500 to-pink-600 rounded-xl">
                <PieChartIcon className="text-white" size={24} />
              </div>
              <div>
                <h2 className="text-xl font-bold text-gray-800">
                  Budget Allocation
                </h2>
                <p className="text-sm text-gray-500">Per platform</p>
              </div>
            </div>
            <div className="h-72">
              <ResponsiveContainer width="100%" height="100%">
                <PieChart>
                  <Pie
                    data={platformStats.filter((p) => p.budget > 0)}
                    dataKey="budget"
                    nameKey="name"
                    cx="50%"
                    cy="50%"
                    outerRadius={100}
                    innerRadius={60}
                    paddingAngle={5}
                    label={({ name, percent = 0 }) =>
                      `${name} ${(percent * 100).toFixed(0)}%`
                    }
                  >
                    {platformStats.map((entry, index) => (
                      <Cell key={`cell-${index}`} fill={entry.fill} />
                    ))}
                  </Pie>
                  <Tooltip
                    contentStyle={{
                      borderRadius: "16px",
                      border: "none",
                      boxShadow: "0 10px 40px rgba(0,0,0,0.1)",
                    }}
                    formatter={(value: any) => `$${value.toLocaleString()}`}
                  />
                </PieChart>
              </ResponsiveContainer>
            </div>
          </div>

          {/* AREA CHART */}
          <div className="bg-white/80 backdrop-blur-xl p-8 rounded-3xl shadow-xl border border-gray-100 hover:shadow-2xl transition-shadow">
            <div className="flex items-center gap-3 mb-6">
              <div className="p-3 bg-gradient-to-br from-teal-500 to-emerald-600 rounded-xl">
                <Activity className="text-white" size={24} />
              </div>
              <div>
                <h2 className="text-xl font-bold text-gray-800">
                  Budget vs Campaigns
                </h2>
                <p className="text-sm text-gray-500">Comparison view</p>
              </div>
            </div>
            <div className="h-72">
              <ResponsiveContainer width="100%" height="100%">
                <AreaChart data={platformStats}>
                  <defs>
                    <linearGradient
                      id="colorBudget"
                      x1="0"
                      y1="0"
                      x2="0"
                      y2="1"
                    >
                      <stop offset="5%" stopColor="#14b8a6" stopOpacity={0.8} />
                      <stop offset="95%" stopColor="#14b8a6" stopOpacity={0} />
                    </linearGradient>
                  </defs>
                  <XAxis
                    dataKey="name"
                    axisLine={false}
                    tickLine={false}
                    tick={{ fill: "#6b7280", fontSize: 12 }}
                  />
                  <YAxis
                    axisLine={false}
                    tickLine={false}
                    tick={{ fill: "#6b7280", fontSize: 12 }}
                  />
                  <Tooltip
                    contentStyle={{
                      borderRadius: "16px",
                      border: "none",
                      boxShadow: "0 10px 40px rgba(0,0,0,0.1)",
                    }}
                  />
                  <Area
                    type="monotone"
                    dataKey="budget"
                    stroke="#14b8a6"
                    strokeWidth={3}
                    fillOpacity={1}
                    fill="url(#colorBudget)"
                  />
                </AreaChart>
              </ResponsiveContainer>
            </div>
          </div>

          {/* RADAR CHART */}
          <div className="bg-white/80 backdrop-blur-xl p-8 rounded-3xl shadow-xl border border-gray-100 hover:shadow-2xl transition-shadow">
            <div className="flex items-center gap-3 mb-6">
              <div className="p-3 bg-gradient-to-br from-orange-500 to-red-600 rounded-xl">
                <Zap className="text-white" size={24} />
              </div>
              <div>
                <h2 className="text-xl font-bold text-gray-800">
                  Performance Radar
                </h2>
                <p className="text-sm text-gray-500">Multi-metric view</p>
              </div>
            </div>
            <div className="h-72">
              <ResponsiveContainer width="100%" height="100%">
                <RadarChart data={radarData}>
                  <PolarGrid stroke="#e5e7eb" />
                  <PolarAngleAxis
                    dataKey="platform"
                    tick={{ fill: "#6b7280", fontSize: 12 }}
                  />
                  <PolarRadiusAxis
                    angle={90}
                    tick={{ fill: "#6b7280", fontSize: 10 }}
                  />
                  <Radar
                    name="Campaigns"
                    dataKey="campaigns"
                    stroke="#8b5cf6"
                    fill="#8b5cf6"
                    fillOpacity={0.6}
                  />
                  <Tooltip
                    contentStyle={{
                      borderRadius: "16px",
                      border: "none",
                      boxShadow: "0 10px 40px rgba(0,0,0,0.1)",
                    }}
                  />
                </RadarChart>
              </ResponsiveContainer>
            </div>
          </div>
        </div>

        {/* FILTERS & SEARCH */}
        <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
          <div className="relative">
            <Search
              className="absolute left-4 top-1/2 -translate-y-1/2 text-gray-400"
              size={20}
            />
            <input
              type="text"
              placeholder="Search campaigns..."
              className="w-full pl-12 pr-4 py-4 bg-white/80 backdrop-blur-xl border border-gray-200 rounded-2xl outline-none focus:ring-2 focus:ring-indigo-500 focus:border-transparent transition-all shadow-sm"
              value={searchTerm}
              onChange={(e) => setSearchTerm(e.target.value)}
            />
          </div>
          <div className="relative">
            <Filter
              className="absolute left-4 top-1/2 -translate-y-1/2 text-gray-400"
              size={20}
            />
            <select
              className="w-full pl-12 pr-4 py-4 bg-white/80 backdrop-blur-xl border border-gray-200 rounded-2xl outline-none focus:ring-2 focus:ring-indigo-500 appearance-none cursor-pointer transition-all shadow-sm"
              value={filterPlatform}
              onChange={(e) => setFilterPlatform(e.target.value)}
            >
              <option value="All">All Platforms</option>
              <option value="Facebook">Facebook</option>
              <option value="Google">Google</option>
              <option value="LinkedIn">LinkedIn</option>
              <option value="Twitter">Twitter</option>
            </select>
          </div>
          <div className="bg-white/80 backdrop-blur-xl border border-gray-200 rounded-2xl px-6 py-4 flex items-center justify-between shadow-sm">
            <span className="text-gray-600 font-medium">
              {filteredCampaigns.length} Results
            </span>
            <div className="flex gap-2">
              {platformStats
                .filter((p) => p.count > 0)
                .map((p) => (
                  <div
                    key={p.name}
                    className="w-3 h-3 rounded-full"
                    style={{ backgroundColor: p.fill }}
                  ></div>
                ))}
            </div>
          </div>
        </div>

        {/* ENHANCED TABLE */}
        <div className="bg-white/80 backdrop-blur-xl shadow-xl rounded-3xl border border-gray-100 overflow-hidden">
          <div className="overflow-x-auto">
            <table className="min-w-full divide-y divide-gray-100">
              <thead className="bg-gradient-to-r from-gray-50 to-gray-100">
                <tr>
                  <th className="px-8 py-5 text-left text-xs font-bold text-gray-600 uppercase tracking-wider">
                    Campaign Details
                  </th>
                  <th className="px-8 py-5 text-left text-xs font-bold text-gray-600 uppercase tracking-wider">
                    Platform
                  </th>
                  <th className="px-8 py-5 text-left text-xs font-bold text-gray-600 uppercase tracking-wider">
                    Budget
                  </th>
                  <th className="px-8 py-5 text-right text-xs font-bold text-gray-600 uppercase tracking-wider">
                    Actions
                  </th>
                </tr>
              </thead>
              <tbody className="divide-y divide-gray-100">
                {filteredCampaigns.map((c) => (
                  <tr
                    key={c.id}
                    className="hover:bg-gradient-to-r hover:from-indigo-50 hover:to-purple-50 transition-all duration-200"
                  >
                    <td className="px-8 py-5">
                      <div className="flex items-center gap-4">
                        <div
                          className="w-12 h-12 rounded-xl flex items-center justify-center text-white font-bold text-lg shadow-lg"
                          style={{
                            background: platformColors[c.platform] || "#6366f1",
                          }}
                        >
                          {c.title.charAt(0).toUpperCase()}
                        </div>
                        <div>
                          <div className="font-bold text-gray-900 text-lg">
                            {c.title}
                          </div>
                          <div className="text-sm text-gray-500 truncate max-w-md">
                            {c.description}
                          </div>
                        </div>
                      </div>
                    </td>
                    <td className="px-8 py-5">
                      <span
                        className="px-4 py-2 rounded-lg text-white font-medium text-sm shadow-md"
                        style={{
                          background: platformColors[c.platform] || "#6366f1",
                        }}
                      >
                        {c.platform}
                      </span>
                    </td>
                    <td className="px-8 py-5">
                      <div className="flex items-center gap-2">
                        <DollarSign size={18} className="text-emerald-600" />
                        <span className="font-bold text-gray-900 text-lg">
                          {Number(c.budget).toLocaleString()}
                        </span>
                      </div>
                    </td>
                    <td className="px-8 py-5 text-right">
                      <div className="flex justify-end gap-3">
                        <button
                          onClick={() => handleEditClick(c)}
                          className="p-3 text-gray-400 hover:text-indigo-600 hover:bg-indigo-50 rounded-xl transition-all"
                        >
                          <Edit3 size={18} />
                        </button>
                        <button
                          onClick={() => handleDelete(c.id)}
                          className="p-3 text-gray-400 hover:text-red-500 hover:bg-red-50 rounded-xl transition-all"
                        >
                          <Trash2 size={18} />
                        </button>
                      </div>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </div>
      </div>

      {/* ENHANCED MODAL */}
      {isModalOpen && (
        <div className="fixed inset-0 bg-black/60 backdrop-blur-md flex items-center justify-center p-4 z-50 animate-fadeIn">
          <div className="bg-white rounded-3xl p-8 w-full max-w-lg shadow-2xl transform transition-all animate-slideUp">
            <div className="flex justify-between items-center mb-8">
              <div>
                <h2 className="text-3xl font-black bg-gradient-to-r from-indigo-600 to-purple-600 bg-clip-text text-transparent">
                  {editId ? "Edit" : "Create"} Campaign
                </h2>
                <p className="text-gray-500 mt-1">
                  {editId
                    ? "Update campaign details"
                    : "Launch a new marketing campaign"}
                </p>
              </div>
              <button
                onClick={closeModal}
                className="p-2 text-gray-400 hover:text-gray-600 hover:bg-gray-100 rounded-xl transition-all"
              >
                <X size={24} />
              </button>
            </div>
            <form onSubmit={handleSave} className="space-y-5">
              <div>
                <label className="block text-sm font-bold text-gray-700 mb-2">
                  Campaign Title
                </label>
                <input
                  type="text"
                  placeholder="Enter campaign name..."
                  required
                  className="w-full border-2 border-gray-200 p-4 rounded-2xl outline-none focus:border-indigo-500 transition-all"
                  value={newCampaign.title}
                  onChange={(e) =>
                    setNewCampaign({ ...newCampaign, title: e.target.value })
                  }
                />
              </div>

              <div>
                <label className="block text-sm font-bold text-gray-700 mb-2">
                  AI Description
                </label>
                <div className="flex gap-3">
                  <input
                    type="text"
                    placeholder="Generate with AI..."
                    readOnly
                    className="flex-1 border-2 border-gray-200 p-4 rounded-2xl bg-gradient-to-r from-purple-50 to-pink-50 text-sm"
                    value={generatedDescription}
                  />
                  <button
                    type="button"
                    onClick={generateAIDescription}
                    disabled={isAiLoading}
                    className="px-6 bg-gradient-to-r from-purple-500 to-pink-600 text-white rounded-2xl hover:shadow-lg transition-all disabled:opacity-50 flex items-center gap-2"
                  >
                    {isAiLoading ? (
                      <div className="w-5 h-5 border-2 border-white border-t-transparent rounded-full animate-spin"></div>
                    ) : (
                      <Sparkles size={20} />
                    )}
                  </button>
                </div>
              </div>

              <div>
                <label className="block text-sm font-bold text-gray-700 mb-2">
                  Platform
                </label>
                <select
                  className="w-full border-2 border-gray-200 p-4 rounded-2xl outline-none focus:border-indigo-500 transition-all appearance-none cursor-pointer"
                  value={newCampaign.platform}
                  onChange={(e) =>
                    setNewCampaign({ ...newCampaign, platform: e.target.value })
                  }
                >
                  <option value="Facebook">📘 Facebook</option>
                  <option value="Google">🔍 Google</option>
                  <option value="LinkedIn">💼 LinkedIn</option>
                  <option value="Twitter">🐦 Twitter</option>
                </select>
              </div>

              <div>
                <label className="block text-sm font-bold text-gray-700 mb-2">
                  Budget (USD)
                </label>
                <div className="relative">
                  <DollarSign
                    className="absolute left-4 top-1/2 -translate-y-1/2 text-gray-400"
                    size={20}
                  />
                  <input
                    type="number"
                    placeholder="0"
                    required
                    className="w-full border-2 border-gray-200 pl-12 pr-4 py-4 rounded-2xl outline-none focus:border-indigo-500 transition-all"
                    value={newCampaign.budget}
                    onChange={(e) =>
                      setNewCampaign({ ...newCampaign, budget: e.target.value })
                    }
                  />
                </div>
              </div>

              <button
                type="submit"
                className="w-full py-4 bg-gradient-to-r from-indigo-600 to-purple-600 text-white rounded-2xl font-bold shadow-lg hover:shadow-xl transition-all duration-300 hover:scale-[1.02] active:scale-95 mt-6"
              >
                {editId ? "💾 Update Campaign" : "🚀 Launch Campaign"}
              </button>
            </form>
          </div>
        </div>
      )}

      <style>{`
        @keyframes fadeIn {
          from { opacity: 0; }
          to { opacity: 1; }
        }
        @keyframes slideUp {
          from { 
            opacity: 0;
            transform: translateY(20px);
          }
          to { 
            opacity: 1;
            transform: translateY(0);
          }
        }
        .animate-fadeIn {
          animation: fadeIn 0.2s ease-out;
        }
        .animate-slideUp {
          animation: slideUp 0.3s ease-out;
        }
      `}</style>
    </div>
  );
};

const StatCard = ({ icon, label, value, gradient, bgGradient }: any) => {
  return (
    <div
      className={`relative overflow-hidden bg-gradient-to-br ${bgGradient} p-6 rounded-3xl shadow-lg border border-gray-100 hover:shadow-2xl transition-all duration-300 hover:scale-105 group`}
    >
      <div className="relative z-10 flex items-center gap-4">
        <div
          className={`p-4 rounded-2xl bg-gradient-to-br ${gradient} text-white shadow-lg group-hover:scale-110 transition-transform`}
        >
          {icon}
        </div>
        <div>
          <p className="text-xs font-bold text-gray-500 uppercase tracking-wider mb-1">
            {label}
          </p>
          <h3 className="text-3xl font-black text-gray-900">{value}</h3>
        </div>
      </div>
      <div
        className={`absolute -right-8 -bottom-8 w-32 h-32 bg-gradient-to-br ${gradient} opacity-10 rounded-full blur-2xl group-hover:scale-150 transition-transform`}
      ></div>
    </div>
  );
};

export default Dashboard;
