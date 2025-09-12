import { useState, useCallback } from "react";
import {
  FiMessageSquare,
  FiSettings,
  FiEdit,
  FiSave,
  FiRefreshCw,
  FiX,
} from "react-icons/fi";
import httpClient from "../services/http-client";

export default function PromptDetails() {
  const [activeTab, setActiveTab] = useState<"system" | "user">("system");
  const [loading, setLoading] = useState(false);

  // New keyword input states
  const [newKeywordInputs, setNewKeywordInputs] = useState({
    iot: "",
    experience: "",
    marine: "",
    target: "",
    bisan_emira: "",
  });

  // System prompt (read-only)
  const systemPrompt = `System Prompt:
You are an expert in business development and procurement.
Your task is to classify a tender into exactly one business unit.

Allowed outputs: [IoT, Experience, Marine, Target, Bisan_Emira, Other]

Rules:
- Match the tender summary with the provided keyword lists.
- Always return only one business unit.
- If multiple units match, pick the most specific or relevant one.
- If no keywords are a good match, return "Other".
- Respond with ONLY the unit name, with no explanation or punctuation.`;

  // Keywords state
  const [keywords, setKeywords] = useState({
    iot: [
      "Connectivity",
      "Monitoring",
      "remote Monitoring",
      "Sensor",
      "Management",
      "Controlling",
      "IoT",
      "Smart City",
      "Integration",
      "Predictive Maintenance",
      "Telemetry",
      "Network",
      "Asset Tracking",
      "Building Automation",
      "Fleet Management",
      "Tracking",
      "Smart Infrastructure",
      "Energy management systems",
      "Larda resource management",
    ],
    experience: [
      "Experience",
      "Immersive",
      "Interactive",
      "Exhibition",
      "Digital Content",
      "Technology",
      "AV Systems",
      "Digital",
      "Thematic",
      "Design",
      "Projection Mapping",
      "Smart Display",
      "Visitor Journey",
      "Cultural Innovation",
    ],
    marine: [
      "Antifouling",
      "Marine Technology",
      "Marine Systems",
      "Vessel Operations",
      "Vessel Maintenance",
    ],
    target: [
      "Target systems",
      "Simulator",
      "Aerial target",
      "Sea target",
      "Naval target",
      "ground target",
      "Unmanned surface vessels",
      "Drone",
      "Asia",
      "Europe",
      "Southeast Asia",
      "Africa",
      "Middle east",
    ],
    bisan_emira: [
      "museum fit-out",
      "immersive experience",
      "immersive installation",
      "experience design",
      "digital experience",
      "interactive exhibition",
      "projection mapping",
      "360° projection",
      "interactive wall",
      "interactive floor",
      "interactive sphere",
      "interactive room system",
      "flexible LED",
      "LED wall",
      "LED screen",
      "curved LED",
      "transparent LED",
      "digital signage",
      "video wall",
      "ScrollUp display",
      "smart sensors",
      "smart infrastructure",
      "connected devices",
      "interactive IoT",
      "augmented reality",
      "virtual reality",
      "extended reality",
      "AR/VR solutions",
      "AR/VR application",
      "XR system",
      "simulation system",
      "interactive simulation",
      "interactive museum",
      "science museum",
      "technology",
      "experience center",
      "theme park technology",
      "digital planetarium",
    ],
  });

  const tabs = [
    { id: "system" as const, label: "System Prompt", icon: FiSettings },
    { id: "user" as const, label: "User Prompt", icon: FiEdit },
  ];

  // Handle new keyword input changes
  const handleNewKeywordInputChange = (
    unit: keyof typeof newKeywordInputs,
    value: string
  ) => {
    setNewKeywordInputs((prev) => ({
      ...prev,
      [unit]: value,
    }));
  };

  // Add new keyword
  const addKeyword = useCallback(
    (unit: keyof typeof keywords) => {
      const newKeyword = newKeywordInputs[unit].trim();
      if (newKeyword && !keywords[unit].includes(newKeyword)) {
        setKeywords((prev) => ({
          ...prev,
          [unit]: [...prev[unit], newKeyword],
        }));
        setNewKeywordInputs((prev) => ({
          ...prev,
          [unit]: "",
        }));
      }
    },
    [keywords, newKeywordInputs]
  );

  // Delete keyword
  const deleteKeyword = (
    unit: keyof typeof keywords,
    keywordToDelete: string
  ) => {
    setKeywords((prev) => ({
      ...prev,
      [unit]: prev[unit].filter((keyword) => keyword !== keywordToDelete),
    }));
  };

  // Update keywords via API
  const updateKeywords = async () => {
    setLoading(true);
    try {
      const response = await httpClient.post("/api/keywords", {
        keywords: keywords,
      });
      console.log("Keywords updated successfully:", response.data);
      // You can add a success message here
    } catch (error) {
      console.error("Error updating keywords:", error);
      // You can add an error message here
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="bg-white rounded-lg shadow-sm border border-gray-200">
      <div className="px-6 py-4 border-b border-gray-200">
        <h2 className="text-xl font-semibold text-gray-900 flex items-center gap-2">
          <FiMessageSquare className="w-5 h-5" />
          Prompt Details
        </h2>
      </div>

      {/* Tab Navigation */}
      <div className="border-b border-gray-200">
        <div className="flex">
          {tabs.map((tab) => {
            const Icon = tab.icon;
            return (
              <button
                key={tab.id}
                onClick={() => setActiveTab(tab.id)}
                className={`flex items-center gap-2 px-6 py-3 text-sm font-medium border-b-2 transition-colors duration-200 ${
                  activeTab === tab.id
                    ? "border-red-500 text-red-600 bg-red-50"
                    : "border-transparent text-gray-500 hover:text-gray-700 hover:border-gray-300"
                }`}
              >
                <Icon className="w-4 h-4" />
                {tab.label}
              </button>
            );
          })}
        </div>
      </div>

      {/* Tab Content */}
      <div className="p-6">
        {activeTab === "system" && (
          <div className="space-y-6">
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2">
                System Prompt (Read-only)
              </label>
              <div className="bg-gray-50 border border-gray-200 rounded-md p-4">
                <pre className="text-sm text-gray-700 whitespace-pre-wrap font-mono">
                  {systemPrompt}
                </pre>
              </div>
            </div>
          </div>
        )}

        {activeTab === "user" && (
          <div className="space-y-6">
            {/* Static User Prompt Section */}
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2">
                User Prompt Template
              </label>
              <div className="bg-gray-50 border border-gray-200 rounded-md p-4 mb-4">
                <pre className="text-sm text-gray-700 whitespace-pre-wrap font-mono">
                  {`User Prompt:
Tender Details:
Title: [Tender Title]
Summary: [Tender Summary]

BUSINESS UNIT KEYWORDS:`}
                </pre>
              </div>
            </div>

            {/* Editable Keywords Section */}
            <div>
              <div className="flex items-center justify-between mb-4">
                <label className="block text-sm font-medium text-gray-700">
                  Business Unit Keywords
                </label>
                <button
                  onClick={() => updateKeywords()}
                  disabled={loading}
                  className="px-4 py-2 text-sm font-medium cursor-pointer text-white bg-[#ff3333] border border-transparent rounded-md  focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-red-500 flex items-center gap-2 disabled:opacity-50"
                >
                  {loading ? (
                    <FiRefreshCw className="w-4 h-4 animate-spin" />
                  ) : (
                    <FiSave className="w-4 h-4" />
                  )}
                  Update Keywords
                </button>
              </div>

              <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                {/* IoT Keywords */}
                <div className="bg-white border border-slate-200 rounded-lg p-6 shadow-sm hover:shadow-md transition-shadow duration-200 flex flex-col justify-between min-h-[240px]">
                  <div>
                    <div className="flex items-center gap-3 mb-4">
                      <div className="w-10 h-10 bg-slate-100 rounded-lg flex items-center justify-center">
                        <span className="text-slate-600 text-sm font-bold">
                          IoT
                        </span>
                      </div>
                      <div>
                        <h3 className="text-lg font-semibold text-slate-900">
                          IoT Keywords
                        </h3>
                        <p className="text-sm text-slate-600">
                          {keywords.iot.length} keywords
                        </p>
                      </div>
                    </div>

                    <div className="flex flex-wrap gap-2">
                      {keywords.iot.map((keyword, index) => (
                        <span
                          key={index}
                          className="inline-flex items-center gap-1 px-3 py-1.5 rounded-md text-xs font-medium bg-slate-100 text-slate-700 border border-slate-300 hover:bg-slate-200 transition-colors duration-200"
                        >
                          {keyword}
                          <button
                            onClick={() => deleteKeyword("iot", keyword)}
                            className="ml-1 hover:bg-slate-300 rounded-full p-0.5 transition-colors duration-200"
                          >
                            <FiX className="w-3 h-3" />
                          </button>
                        </span>
                      ))}
                    </div>
                  </div>

                  <div className="flex gap-3 mt-6">
                    <input
                      type="text"
                      value={newKeywordInputs.iot}
                      onChange={(e) =>
                        handleNewKeywordInputChange("iot", e.target.value)
                      }
                      placeholder="Add keyword..."
                      className="flex-1 px-3 py-2 border border-slate-300 rounded-md bg-white focus:outline-none focus:ring-2 focus:ring-red-500 focus:border-red-500 text-sm"
                    />
                    <button
                      onClick={() => addKeyword("iot")}
                      disabled={!newKeywordInputs.iot.trim()}
                      className="px-4 py-2 bg-slate-600 hover:bg-slate-700 text-white border border-transparent rounded-md focus:outline-none focus:ring-2 focus:ring-red-500 focus:ring-offset-2 disabled:opacity-50 disabled:cursor-not-allowed font-medium transition-colors duration-200"
                    >
                      Add
                    </button>
                  </div>
                </div>

                {/* Experience Keywords */}
                <div className="bg-white border border-slate-200 rounded-lg p-6 shadow-sm hover:shadow-md transition-shadow duration-200 flex flex-col justify-between min-h-[240px]">
                  <div>
                    <div className="flex items-center gap-3 mb-4">
                      <div className="w-10 h-10 bg-slate-100 rounded-lg flex items-center justify-center">
                        <span className="text-slate-600 text-sm font-bold">
                          EXP
                        </span>
                      </div>
                      <div>
                        <h3 className="text-lg font-semibold text-slate-900">
                          Experience Keywords
                        </h3>
                        <p className="text-sm text-slate-600">
                          {keywords.experience.length} keywords
                        </p>
                      </div>
                    </div>

                    <div className="flex flex-wrap gap-2">
                      {keywords.experience.map((keyword, index) => (
                        <span
                          key={index}
                          className="inline-flex items-center gap-1 px-3 py-1.5 rounded-md text-xs font-medium bg-slate-100 text-slate-700 border border-slate-300 hover:bg-slate-200 transition-colors duration-200"
                        >
                          {keyword}
                          <button
                            onClick={() => deleteKeyword("experience", keyword)}
                            className="ml-1 hover:bg-slate-300 rounded-full p-0.5 transition-colors duration-200"
                          >
                            <FiX className="w-3 h-3" />
                          </button>
                        </span>
                      ))}
                    </div>
                  </div>

                  <div className="flex gap-3 mt-6">
                    <input
                      type="text"
                      value={newKeywordInputs.experience}
                      onChange={(e) =>
                        handleNewKeywordInputChange(
                          "experience",
                          e.target.value
                        )
                      }
                      placeholder="Add keyword..."
                      className="flex-1 px-3 py-2 border border-slate-300 rounded-md bg-white focus:outline-none focus:ring-2 focus:ring-red-500 focus:border-red-500 text-sm"
                    />
                    <button
                      onClick={() => addKeyword("experience")}
                      disabled={!newKeywordInputs.experience.trim()}
                      className="px-4 py-2 bg-slate-600 hover:bg-slate-700 text-white border border-transparent rounded-md focus:outline-none focus:ring-2 focus:ring-red-500 focus:ring-offset-2 disabled:opacity-50 disabled:cursor-not-allowed font-medium transition-colors duration-200"
                    >
                      Add
                    </button>
                  </div>
                </div>

                {/* Marine Keywords */}
                <div className="bg-white border border-slate-200 rounded-lg p-6 shadow-sm hover:shadow-md transition-shadow duration-200 flex flex-col justify-between min-h-[240px]">
                  <div>
                    <div className="flex items-center gap-3 mb-4">
                      <div className="w-10 h-10 bg-slate-100 rounded-lg flex items-center justify-center">
                        <span className="text-slate-600 text-sm font-bold">
                          SEA
                        </span>
                      </div>
                      <div>
                        <h3 className="text-lg font-semibold text-slate-900">
                          Marine Keywords
                        </h3>
                        <p className="text-sm text-slate-600">
                          {keywords.marine.length} keywords
                        </p>
                      </div>
                    </div>

                    <div className="flex flex-wrap gap-2">
                      {keywords.marine.map((keyword, index) => (
                        <span
                          key={index}
                          className="inline-flex items-center gap-1 px-3 py-1.5 rounded-md text-xs font-medium bg-slate-100 text-slate-700 border border-slate-300 hover:bg-slate-200 transition-colors duration-200"
                        >
                          {keyword}
                          <button
                            onClick={() => deleteKeyword("marine", keyword)}
                            className="ml-1 hover:bg-slate-300 rounded-full p-0.5 transition-colors duration-200"
                          >
                            <FiX className="w-3 h-3" />
                          </button>
                        </span>
                      ))}
                    </div>
                  </div>

                  <div className="flex gap-3 mt-6">
                    <input
                      type="text"
                      value={newKeywordInputs.marine}
                      onChange={(e) =>
                        handleNewKeywordInputChange("marine", e.target.value)
                      }
                      placeholder="Add keyword..."
                      className="flex-1 px-3 py-2 border border-slate-300 rounded-md bg-white focus:outline-none focus:ring-2 focus:ring-red-500 focus:border-red-500 text-sm"
                    />
                    <button
                      onClick={() => addKeyword("marine")}
                      disabled={!newKeywordInputs.marine.trim()}
                      className="px-4 py-2 bg-slate-600 hover:bg-slate-700 text-white border border-transparent rounded-md focus:outline-none focus:ring-2 focus:ring-red-500 focus:ring-offset-2 disabled:opacity-50 disabled:cursor-not-allowed font-medium transition-colors duration-200"
                    >
                      Add
                    </button>
                  </div>
                </div>

                {/* Target Keywords */}
                <div className="bg-white border border-slate-200 rounded-lg p-6 shadow-sm hover:shadow-md transition-shadow duration-200 flex flex-col justify-between min-h-[240px]">
                  <div>
                    <div className="flex items-center gap-3 mb-4">
                      <div className="w-10 h-10 bg-slate-100 rounded-lg flex items-center justify-center">
                        <span className="text-slate-600 text-sm font-bold">
                          TGT
                        </span>
                      </div>
                      <div>
                        <h3 className="text-lg font-semibold text-slate-900">
                          Target Keywords
                        </h3>
                        <p className="text-sm text-slate-600">
                          {keywords.target.length} keywords
                        </p>
                      </div>
                    </div>

                    <div className="flex flex-wrap gap-2">
                      {keywords.target.map((keyword, index) => (
                        <span
                          key={index}
                          className="inline-flex items-center gap-1 px-3 py-1.5 rounded-md text-xs font-medium bg-slate-100 text-slate-700 border border-slate-300 hover:bg-slate-200 transition-colors duration-200"
                        >
                          {keyword}
                          <button
                            onClick={() => deleteKeyword("target", keyword)}
                            className="ml-1 hover:bg-slate-300 rounded-full p-0.5 transition-colors duration-200"
                          >
                            <FiX className="w-3 h-3" />
                          </button>
                        </span>
                      ))}
                    </div>
                  </div>

                  <div className="flex gap-3 mt-6">
                    <input
                      type="text"
                      value={newKeywordInputs.target}
                      onChange={(e) =>
                        handleNewKeywordInputChange("target", e.target.value)
                      }
                      placeholder="Add keyword..."
                      className="flex-1 px-3 py-2 border border-slate-300 rounded-md bg-white focus:outline-none focus:ring-2 focus:ring-red-500 focus:border-red-500 text-sm"
                    />
                    <button
                      onClick={() => addKeyword("target")}
                      disabled={!newKeywordInputs.target.trim()}
                      className="px-4 py-2 bg-slate-600 hover:bg-slate-700 text-white border border-transparent rounded-md focus:outline-none focus:ring-2 focus:ring-red-500 focus:ring-offset-2 disabled:opacity-50 disabled:cursor-not-allowed font-medium transition-colors duration-200"
                    >
                      Add
                    </button>
                  </div>
                </div>

                {/* Bisan_Emira Keywords - Full Width */}
                <div className="md:col-span-2 bg-white border border-slate-200 rounded-lg p-6 shadow-sm hover:shadow-md transition-shadow duration-200 flex flex-col justify-between min-h-[240px]">
                  <div>
                    <div className="flex items-center gap-3 mb-4">
                      <div className="w-10 h-10 bg-slate-100 rounded-lg flex items-center justify-center">
                        <span className="text-slate-600 text-sm font-bold">
                          BE
                        </span>
                      </div>
                      <div>
                        <h3 className="text-lg font-semibold text-slate-900">
                          Bisan Emira Keywords
                        </h3>
                        <p className="text-sm text-slate-600">
                          {keywords.bisan_emira.length} keywords
                        </p>
                      </div>
                    </div>

                    <div className="flex flex-wrap gap-2">
                      {keywords.bisan_emira.map((keyword, index) => (
                        <span
                          key={index}
                          className="inline-flex items-center gap-1 px-3 py-1.5 rounded-md text-xs font-medium bg-slate-100 text-slate-700 border border-slate-300 hover:bg-slate-200 transition-colors duration-200"
                        >
                          {keyword}
                          <button
                            onClick={() =>
                              deleteKeyword("bisan_emira", keyword)
                            }
                            className="ml-1 hover:bg-slate-300 rounded-full p-0.5 transition-colors duration-200"
                          >
                            <FiX className="w-3 h-3" />
                          </button>
                        </span>
                      ))}
                    </div>
                  </div>

                  <div className="flex gap-3 mt-6">
                    <input
                      type="text"
                      value={newKeywordInputs.bisan_emira}
                      onChange={(e) =>
                        handleNewKeywordInputChange(
                          "bisan_emira",
                          e.target.value
                        )
                      }
                      placeholder="Add keyword..."
                      className="flex-1 px-3 py-2 border border-slate-300 rounded-md bg-white focus:outline-none focus:ring-2 focus:ring-red-500 focus:border-red-500 text-sm"
                    />
                    <button
                      onClick={() => addKeyword("bisan_emira")}
                      disabled={!newKeywordInputs.bisan_emira.trim()}
                      className="px-4 py-2 bg-slate-600 hover:bg-slate-700 text-white border border-transparent rounded-md focus:outline-none focus:ring-2 focus:ring-red-500 focus:ring-offset-2 disabled:opacity-50 disabled:cursor-not-allowed font-medium transition-colors duration-200"
                    >
                      Add
                    </button>
                  </div>
                </div>
              </div>
            </div>
          </div>
        )}
      </div>
    </div>
  );
}
