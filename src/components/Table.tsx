import { useState, useMemo } from "react";
import {
  FiCalendar,
  FiMapPin,
  FiTag,
  FiExternalLink,
  FiChevronDown,
} from "react-icons/fi";
import type Tender from "../interfaces/tender";

interface TableProps {
  tenders: Tender[];
  loading: boolean;
  onTenderSelect: (tender: Tender) => void;
}

type SortField = "score" | "deadline" | "none";
type SortDirection = "asc" | "desc";

export default function Table({
  tenders,
  loading,
  onTenderSelect,
}: TableProps) {
  const [sortField, setSortField] = useState<SortField>("none");
  const [sortDirection, setSortDirection] = useState<SortDirection>("desc");

  // Sort tenders based on current sort field and direction
  const sortedTenders = useMemo(() => {
    if (sortField === "none") {
      return tenders;
    }

    return [...tenders].sort((a, b) => {
      let aValue: number;
      let bValue: number;

      if (sortField === "score") {
        aValue = a.score;
        bValue = b.score;
      } else if (sortField === "deadline") {
        aValue = new Date(a.deadline).getTime();
        bValue = new Date(b.deadline).getTime();
      } else {
        return 0;
      }

      if (sortDirection === "asc") {
        return aValue > bValue ? 1 : aValue < bValue ? -1 : 0;
      } else {
        return aValue < bValue ? 1 : aValue > bValue ? -1 : 0;
      }
    });
  }, [tenders, sortField, sortDirection]);

  const handleSort = (field: SortField) => {
    if (field === "none") {
      setSortField("none");
      return;
    }

    if (sortField === field) {
      // Toggle direction if same field
      setSortDirection(sortDirection === "asc" ? "desc" : "asc");
    } else {
      // New field, set default direction
      setSortField(field);
      setSortDirection(field === "score" ? "desc" : "asc"); // Score: high to low, Deadline: earliest first
    }
  };

  const formatDate = (dateString: string) => {
    return new Date(dateString).toLocaleDateString("en-US", {
      year: "numeric",
      month: "short",
      day: "numeric",
    });
  };

  /*const getScoreColor = (score: number) => {
    if (score >= 80) return "bg-green-100 text-green-800";
    if (score >= 60) return "bg-yellow-100 text-yellow-800";
    return "bg-gray-100 text-gray-800";
  };  */

  if (loading) {
    return (
      <div className="bg-white rounded-lg shadow-sm border border-gray-200 p-6">
        <div className="animate-pulse">
          <div className="h-6 bg-gray-200 rounded w-1/4 mb-4"></div>
          <div className="space-y-3">
            {Array.from({ length: 5 }).map((_, i) => (
              <div key={i} className="h-12 bg-gray-200 rounded"></div>
            ))}
          </div>
        </div>
      </div>
    );
  }

  return (
    <div className="bg-white rounded-lg shadow-sm border border-gray-200">
      <div className="px-6 py-4 border-b border-gray-200">
        <div className="flex justify-between items-center">
          <h2 className="text-xl font-semibold text-gray-900">
            Tender Opportunities
          </h2>
        </div>

        {/* Sort Controls */}
        <div className="flex items-center gap-4 pt-4">
          <span className="text-sm font-medium text-gray-700">Sort by:</span>
          <div className="flex gap-2">
            <button
              onClick={() => handleSort("none")}
              className={`px-3 py-1 text-sm rounded-md transition-colors duration-200 ${
                sortField === "none"
                  ? "bg-red-100 text-red-800 border border-red-300"
                  : "bg-gray-100 text-gray-700 hover:bg-gray-200"
              }`}
            >
              Default
            </button>
            {/*<button
              onClick={() => handleSort("score")}
              className={`flex items-center gap-1 px-3 py-1 text-sm rounded-md transition-colors duration-200 ${
                sortField === "score"
                  ? "bg-red-100 text-red-800 border border-red-300"
                  : "bg-gray-100 text-gray-700 hover:bg-gray-200"
              }`}
            >
              <FiStar className="w-3 h-3" />
              Score
              {sortField === "score" && (
                <FiChevronDown
                  className={`w-3 h-3 transition-transform duration-200 ${
                    sortDirection === "asc" ? "rotate-180" : ""
                  }`}
                />
              )}
            </button> */}
            <button
              onClick={() => handleSort("deadline")}
              className={`flex items-center gap-1 px-3 py-1 text-sm rounded-md transition-colors duration-200 ${
                sortField === "deadline"
                  ? "bg-red-100 text-red-800 border border-red-300"
                  : "bg-gray-100 text-gray-700 hover:bg-gray-200"
              }`}
            >
              <FiCalendar className="w-3 h-3" />
              Deadline
              {sortField === "deadline" && (
                <FiChevronDown
                  className={`w-3 h-3 transition-transform duration-200 ${
                    sortDirection === "asc" ? "rotate-180" : ""
                  }`}
                />
              )}
            </button>
          </div>
        </div>
      </div>

      <div className="overflow-x-auto">
        <table className="w-full">
          <thead className="bg-gray-50">
            <tr>
              <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                Title
              </th>
              <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                Country
              </th>
              <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                Business Unit
              </th>
              <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                Deadline
              </th>

              <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                Actions
              </th>
            </tr>
          </thead>
          <tbody className="bg-white">
            {sortedTenders.map((tender) => (
              <tr
                key={tender.id}
                className="hover:bg-gray-50 cursor-pointer transition-colors duration-200"
                onClick={() => onTenderSelect(tender)}
              >
                <td className="px-6 py-4  border-b border-gray-200">
                  <div>
                    <div className="text-sm font-medium text-gray-900 ">
                      {tender.title}
                    </div>
                  </div>
                </td>
                <td className="px-6 py-4 whitespace-nowrap border-b border-gray-200">
                  <div className="flex items-center text-sm text-gray-900">
                    <FiMapPin className="w-4 h-4 mr-1 text-gray-400" />
                    {tender.country}
                  </div>
                </td>
                <td className="px-6 py-4 whitespace-nowrap border-b border-gray-200">
                  <div className="flex items-center text-sm text-gray-900">
                    <FiTag className="w-4 h-4 mr-1 text-gray-400" />
                    {tender.unit}
                  </div>
                </td>
                <td className="px-6 py-4 whitespace-nowrap border-b border-gray-200">
                  <div className="flex items-center text-sm text-gray-900">
                    <FiCalendar className="w-4 h-4 mr-1 text-gray-400" />
                    {formatDate(tender.deadline)}
                  </div>
                </td>

                <td className="px-6 py-4 whitespace-nowrap text-sm font-medium border-b border-gray-200">
                  <a
                    href={tender.url}
                    target="_blank"
                    rel="noopener noreferrer"
                    className="text-red-600 hover:text-red-900 flex items-center"
                    onClick={(e) => e.stopPropagation()}
                  >
                    <FiExternalLink className="w-4 h-4 mr-1" />
                    View
                  </a>
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>

      {sortedTenders.length === 0 && !loading && (
        <div className="text-center py-12">
          <p className="text-gray-500 text-lg">
            No tenders available at the moment.
          </p>
        </div>
      )}
    </div>
  );
}
