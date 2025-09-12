import { useState, useEffect } from "react";
import Navbar from "./components/Navbar";
import StatCards from "./components/StatCards";
import Table from "./components/Table";
import PromptDetails from "./components/PromptDetails";
import TenderDetailModal from "./components/TenderDetailModal";
import type Tender from "./interfaces/tender";
import httpClient from "./services/http-client";
import { FiGrid, FiMessageSquare } from "react-icons/fi";

type TabType = "main" | "prompt";

function App() {
  const [selectedTender, setSelectedTender] = useState<Tender | null>(null);
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [tenders, setTenders] = useState<Tender[]>([]);
  const [loading, setLoading] = useState(true);
  const [activeTab, setActiveTab] = useState<TabType>("main");

  const handleTenderSelect = (tender: Tender) => {
    setSelectedTender(tender);
    setIsModalOpen(true);
  };

  const handleCloseModal = () => {
    setIsModalOpen(false);
    setSelectedTender(null);
  };

  const fetchTenders = async () => {
    try {
      const response = await httpClient.get("/api/tenders");
      setTenders(response.data.tenders || response.data);
    } catch (error) {
      console.error("Error fetching tenders:", error);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchTenders();
  }, []);

  return (
    <div className="bg-gray-50 min-h-screen flex flex-col">
      <Navbar />
      <div className="flex-1 container mx-auto px-4 py-6">
        {/* Tab Navigation */}
        <div className="mb-6">
          <div className="border-b border-gray-200">
            <nav className="-mb-px flex space-x-8">
              <button
                onClick={() => setActiveTab("main")}
                className={`flex items-center gap-2 py-2 px-1 border-b-2 font-medium text-sm transition-colors duration-200 ${
                  activeTab === "main"
                    ? "border-red-500 text-red-600"
                    : "border-transparent text-gray-500 hover:text-gray-700 hover:border-gray-300"
                }`}
              >
                <FiGrid className="w-4 h-4" />
                Main View
              </button>
              <button
                onClick={() => setActiveTab("prompt")}
                className={`flex items-center gap-2 py-2 px-1 border-b-2 font-medium text-sm transition-colors duration-200 ${
                  activeTab === "prompt"
                    ? "border-red-500 text-red-600"
                    : "border-transparent text-gray-500 hover:text-gray-700 hover:border-gray-300"
                }`}
              >
                <FiMessageSquare className="w-4 h-4" />
                Prompt Details
              </button>
            </nav>
          </div>
        </div>

        {/* Tab Content */}
        {activeTab === "main" && (
          <>
            <StatCards tenders={tenders} loading={loading} />
            <Table
              tenders={tenders}
              loading={loading}
              onTenderSelect={handleTenderSelect}
            />
          </>
        )}

        {activeTab === "prompt" && <PromptDetails />}

        <TenderDetailModal
          tender={selectedTender}
          isOpen={isModalOpen}
          onClose={handleCloseModal}
        />
      </div>
    </div>
  );
}

export default App;
