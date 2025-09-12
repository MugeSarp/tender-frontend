import { useState } from "react";
import Navbar from "./components/Navbar";
import StatCards from "./components/StatCards";
import Table from "./components/Table";
import TenderDetailModal from "./components/TenderDetailModal";
import TenderClassifier from "./components/TenderClassifier";
import type Tender from "./interfaces/tender";

function App() {
  const [selectedTender, setSelectedTender] = useState<Tender | null>(null);
  const [isModalOpen, setIsModalOpen] = useState(false);

  const handleTenderSelect = (tender: Tender) => {
    setSelectedTender(tender);
    setIsModalOpen(true);
  };

  const handleCloseModal = () => {
    setIsModalOpen(false);
    setSelectedTender(null);
  };

  return (
    <div className="bg-gray-50 min-h-screen flex flex-col">
      <Navbar />
      <div className="flex-1 container mx-auto px-4 py-6">
        <StatCards />

        {}
        <div className="my-6">
          <TenderClassifier />
        </div>

        <Table onTenderSelect={handleTenderSelect} />
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
