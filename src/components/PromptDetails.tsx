import { useState, useCallback, useEffect } from "react";
import { toast } from "react-hot-toast";
import {
  FiMessageSquare,
  FiSave,
  FiRefreshCw,
  FiX,
  FiPlus,
} from "react-icons/fi";
import Swal from "sweetalert2";

interface KeywordsType {
  related: {
    iot: string[];
    experience: string[];
    marine: string[];
    target: string[];
    software: string[];
    bislan_emira: string[];
  };
  unrelated: {
    iot_unrelated: string[];
    experience_unrelated: string[];
    marine_unrelated: string[];
    target_unrelated: string[];
    software_unrelated: string[];
    bislan_emira_unrelated: string[];
  };
}

type KeywordUnit =
  | keyof KeywordsType["related"]
  | keyof KeywordsType["unrelated"];

interface PromptDetailsProps {
  keywords: KeywordsType;
  onKeywordsUpdate: (keywords: KeywordsType) => Promise<void>;
}

export default function PromptDetails({
  keywords,
  onKeywordsUpdate,
}: PromptDetailsProps) {
  const [loading, setLoading] = useState(false);
  const [activeKeywordTab, setActiveKeywordTab] = useState<
    "related" | "unrelated"
  >("related");

  // New keyword input states
  const [newKeywordInputs, setNewKeywordInputs] = useState({
    iot: "",
    experience: "",
    marine: "",
    target: "",
    software: "",
    bislan_emira: "",
    iot_unrelated: "",
    experience_unrelated: "",
    marine_unrelated: "",
    target_unrelated: "",
    software_unrelated: "",
    bislan_emira_unrelated: "",
  });

  // System prompt (read-only)
  const systemPrompt = `System Prompt:
You are an expert in business development and procurement.
Your task is to classify a tender into exactly one business unit.

Allowed outputs: [IoT, Experience, Marine, Target, Software, Bislan_Emira, Other]

Rules:
- Match the tender summary with the provided keyword lists.
- Always return only one business unit.
- If multiple units match, pick the most specific or relevant one.
- If no keywords are a good match, return "Other".
- Respond with ONLY the unit name, with no explanation or punctuation.`;

  // Local state for managing keywords (for editing before saving)
  const [localKeywords, setLocalKeywords] = useState<KeywordsType>(keywords);

  // Sync local state when props change
  useEffect(() => {
    setLocalKeywords(keywords);
  }, [keywords]);

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
    (unit: KeywordUnit, type: "related" | "unrelated") => {
      const newKeyword =
        newKeywordInputs[unit as keyof typeof newKeywordInputs].trim();
      if (
        newKeyword &&
        !(localKeywords[type] as Record<string, string[]>)[unit].includes(
          newKeyword
        )
      ) {
        setLocalKeywords((prev) => ({
          ...prev,
          [type]: {
            ...(prev[type] as Record<string, string[]>),
            [unit]: [
              ...(prev[type] as Record<string, string[]>)[unit],
              newKeyword,
            ],
          },
        }));
        setNewKeywordInputs((prev) => ({
          ...prev,
          [unit]: "",
        }));
      }
    },
    [localKeywords, newKeywordInputs]
  );

  // Delete keyword
  const deleteKeyword = (
    unit: KeywordUnit,
    keywordToDelete: string,
    type: "related" | "unrelated"
  ) => {
    setLocalKeywords((prev) => ({
      ...prev,
      [type]: {
        ...(prev[type] as Record<string, string[]>),
        [unit]: (prev[type] as Record<string, string[]>)[unit].filter(
          (keyword: string) => keyword !== keywordToDelete
        ),
      },
    }));
  };

  // Update keywords via API
  const updateKeywords = async () => {
    const result = await Swal.fire({
      title: "Update Keywords?",
      text: "This will update the keyword database and trigger a re-filtering of all tenders. This action cannot be undone.",
      icon: "warning",
      showCancelButton: true,
      confirmButtonColor: "#dc2626",
      cancelButtonColor: "#6b7280",
      confirmButtonText: "Yes, Update Keywords",
      cancelButtonText: "Cancel",
      reverseButtons: true,
    });

    if (!result.isConfirmed) {
      return; // User cancelled
    }

    setLoading(true);
    try {
      await onKeywordsUpdate(localKeywords);

      toast.success("Keywords updated and tenders refiltered successfully!", {
        duration: 3000,
        style: {
          background: "#10b981",
          color: "#fff",
          fontWeight: "500",
        },
        iconTheme: {
          primary: "#fff",
          secondary: "#10b981",
        },
      });

      console.log("Keywords updated successfully");
    } catch (error) {
      console.error("Error updating keywords:", error);

      toast.error("Failed to update keywords. Please try again.", {
        duration: 4000,
        style: {
          background: "#ef4444",
          color: "#fff",
          fontWeight: "500",
        },
        iconTheme: {
          primary: "#fff",
          secondary: "#ef4444",
        },
      });

      throw error;
    } finally {
      setLoading(false);
    }
  };

  // Helper function to render keyword cards
  const renderKeywordCard = (
    unit: KeywordUnit,
    displayName: string,
    shortName: string,
    keywords: string[],
    inputValue: string,
    type: "related" | "unrelated"
  ) => (
    <div className="bg-white border border-slate-200 rounded-lg p-6 shadow-sm hover:shadow-md transition-shadow duration-200 flex flex-col justify-between min-h-[240px]">
      <div>
        <div className="flex items-center gap-3 mb-4">
          <div className="w-10 h-10 bg-slate-100 rounded-lg flex items-center justify-center">
            <span className="text-slate-600 text-sm font-bold">
              {shortName}
            </span>
          </div>
          <div>
            <h3 className="text-lg font-semibold text-slate-900">
              {displayName}
            </h3>
            <p className="text-sm text-slate-600">{keywords.length} keywords</p>
          </div>
        </div>

        <div className="flex flex-wrap gap-2">
          {keywords.map((keyword, index) => (
            <span
              key={index}
              className="inline-flex items-center gap-1 px-3 py-1.5 rounded-md text-xs font-medium bg-slate-100 text-slate-700 border border-slate-300 hover:bg-slate-200 transition-colors duration-200"
            >
              {keyword}
              <button
                onClick={() => deleteKeyword(unit, keyword, type)}
                className="ml-1 hover:bg-slate-300 rounded-full p-0.5 transition-colors duration-200"
              >
                <FiX className="w-3 h-3" />
              </button>
            </span>
          ))}
        </div>
      </div>

      <div className="flex gap-2 sm:gap-3 mt-6">
        <input
          type="text"
          value={inputValue}
          onChange={(e) =>
            handleNewKeywordInputChange(
              unit as keyof typeof newKeywordInputs,
              e.target.value
            )
          }
          placeholder="Add keyword..."
          className="flex-1 px-2 sm:px-3 py-2 border border-slate-300 rounded-md bg-white focus:outline-none focus:ring-2 focus:ring-red-500 focus:border-red-500 text-sm"
        />
        <button
          onClick={() => addKeyword(unit, type)}
          disabled={!inputValue.trim()}
          className="px-2 sm:px-4 py-2 bg-slate-600 hover:bg-slate-700 text-white border border-transparent rounded-md focus:outline-none focus:ring-2 focus:ring-red-500 focus:ring-offset-2 disabled:opacity-50 disabled:cursor-not-allowed font-medium transition-colors duration-200 text-xs sm:text-sm whitespace-nowrap"
        >
          <span className="hidden sm:inline">Add</span>
          <FiPlus className="w-4 h-4 sm:hidden" />
        </button>
      </div>
    </div>
  );

  return (
    <div className="bg-white rounded-lg shadow-sm border border-gray-200">
      <div className="px-6 py-4 border-b border-gray-200">
        <h2 className="text-xl font-semibold text-gray-900 flex items-center gap-2">
          <FiMessageSquare className="w-5 h-5" />
          Prompt Details
        </h2>
      </div>

      {/* Content */}
      <div className="p-6">
        {/* System Prompt Section */}
        <div className="space-y-6 mb-8">
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

        {/* User Prompt Section */}
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
                className="px-4 py-2 text-sm font-medium cursor-pointer text-white bg-red-600 hover:bg-red-700 border border-transparent rounded-md focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-red-500 flex items-center gap-2 disabled:opacity-50 disabled:cursor-not-allowed transition-colors duration-200"
              >
                {loading ? (
                  <FiRefreshCw className="w-4 h-4 animate-spin" />
                ) : (
                  <FiSave className="w-4 h-4" />
                )}
                {loading ? "Updating..." : "Update Keywords"}
              </button>
            </div>

            {/* Keyword Type Tabs */}
            <div className="mb-6">
              <div className="border-b border-gray-200">
                <nav className="-mb-px flex space-x-8">
                  <button
                    onClick={() => setActiveKeywordTab("related")}
                    className={`py-2 px-1 border-b-2 font-medium text-sm transition-colors duration-200 ${
                      activeKeywordTab === "related"
                        ? "border-red-500 text-red-600"
                        : "border-transparent text-gray-500 hover:text-gray-700 hover:border-gray-300"
                    }`}
                  >
                    Related Keywords
                  </button>
                  <button
                    onClick={() => setActiveKeywordTab("unrelated")}
                    className={`py-2 px-1 border-b-2 font-medium text-sm transition-colors duration-200 ${
                      activeKeywordTab === "unrelated"
                        ? "border-red-500 text-red-600"
                        : "border-transparent text-gray-500 hover:text-gray-700 hover:border-gray-300"
                    }`}
                  >
                    Unrelated Keywords
                  </button>
                </nav>
              </div>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
              {activeKeywordTab === "related" ? (
                <>
                  {renderKeywordCard(
                    "iot" as KeywordUnit,
                    "IoT Related Keywords",
                    "IoT",
                    localKeywords.related.iot,
                    newKeywordInputs.iot,
                    "related"
                  )}
                  {renderKeywordCard(
                    "experience" as KeywordUnit,
                    "Experience Related Keywords",
                    "EXP",
                    localKeywords.related.experience,
                    newKeywordInputs.experience,
                    "related"
                  )}
                  {renderKeywordCard(
                    "marine" as KeywordUnit,
                    "Marine Related Keywords",
                    "SEA",
                    localKeywords.related.marine,
                    newKeywordInputs.marine,
                    "related"
                  )}
                  {renderKeywordCard(
                    "target" as KeywordUnit,
                    "Target Related Keywords",
                    "TGT",
                    localKeywords.related.target,
                    newKeywordInputs.target,
                    "related"
                  )}
                  {renderKeywordCard(
                    "software" as KeywordUnit,
                    "Software Related Keywords",
                    "DEV",
                    localKeywords.related.software,
                    newKeywordInputs.software,
                    "related"
                  )}
                  {renderKeywordCard(
                    "bislan_emira" as KeywordUnit,
                    "Bislan Emira Related Keywords",
                    "BE",
                    localKeywords.related.bislan_emira,
                    newKeywordInputs.bislan_emira,
                    "related"
                  )}
                </>
              ) : (
                <>
                  {renderKeywordCard(
                    "iot_unrelated" as KeywordUnit,
                    "IoT Unrelated Keywords",
                    "IoT",
                    localKeywords.unrelated.iot_unrelated,
                    newKeywordInputs.iot_unrelated,
                    "unrelated"
                  )}
                  {renderKeywordCard(
                    "experience_unrelated" as KeywordUnit,
                    "Experience Unrelated Keywords",
                    "EXP",
                    localKeywords.unrelated.experience_unrelated,
                    newKeywordInputs.experience_unrelated,
                    "unrelated"
                  )}
                  {renderKeywordCard(
                    "marine_unrelated" as KeywordUnit,
                    "Marine Unrelated Keywords",
                    "SEA",
                    localKeywords.unrelated.marine_unrelated,
                    newKeywordInputs.marine_unrelated,
                    "unrelated"
                  )}
                  {renderKeywordCard(
                    "target_unrelated" as KeywordUnit,
                    "Target Unrelated Keywords",
                    "TGT",
                    localKeywords.unrelated.target_unrelated,
                    newKeywordInputs.target_unrelated,
                    "unrelated"
                  )}
                  {renderKeywordCard(
                    "software_unrelated" as KeywordUnit,
                    "Software Unrelated Keywords",
                    "DEV",
                    localKeywords.unrelated.software_unrelated,
                    newKeywordInputs.software_unrelated,
                    "unrelated"
                  )}
                  {renderKeywordCard(
                    "bislan_emira_unrelated" as KeywordUnit,
                    "Bislan Emira Unrelated Keywords",
                    "BE",
                    localKeywords.unrelated.bislan_emira_unrelated,
                    newKeywordInputs.bislan_emira_unrelated,
                    "unrelated"
                  )}
                </>
              )}
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
