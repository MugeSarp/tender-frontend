import { useEffect } from "react";
import {
  FiX,
  FiCalendar,
  FiMapPin,
  FiTag,
  FiExternalLink,
  FiStar,
} from "react-icons/fi";
import type Tender from "../interfaces/tender";
import { formatDate } from "../lib/utils";

interface TenderDetailModalProps {
  tender: Tender | null;
  isOpen: boolean;
  onClose: () => void;
}

export default function TenderDetailModal({
  tender,
  isOpen,
  onClose,
}: TenderDetailModalProps) {
  useEffect(() => {
    if (isOpen) {
      document.body.style.overflow = "hidden";
    } else {
      document.body.style.overflow = "";
    }
    return () => {
      document.body.style.overflow = "";
    };
  }, [isOpen]);

  if (!isOpen || !tender) return null;

  const getScoreColor = (score: number) => {
    if (score >= 80) return "bg-green-100 text-green-800 border-green-200";
    if (score >= 60) return "bg-yellow-100 text-yellow-800 border-yellow-200";
    return "bg-gray-100 text-gray-800 border-gray-200";
  };

  const isDeadlinePassed = new Date(tender.deadline) < new Date();

  return (
    <div className="fixed inset-0 z-50 overflow-y-auto">
      {/* Overlay */}
      <div
        className="fixed inset-0 bg-black/25 transition-opacity"
        onClick={onClose}
      />

      {/* Center container */}
      <div className="flex min-h-full items-center justify-center p-4">
        {/* Card */}
        <div className="relative w-full max-w-4xl bg-white rounded-lg shadow-xl transform transition-all">
          {/* Header */}
          <div className="flex items-center justify-between p-6 border-b border-gray-200">
            <div className="flex items-center gap-3">
              <h2 className="text-2xl font-bold text-gray-900">
                Tender Details
              </h2>
              <span
                className={`inline-flex items-center px-3 py-1 rounded-full text-sm font-medium border ${getScoreColor(
                  tender.score
                )}`}
              >
                <FiStar className="w-4 h-4 mr-1" />
                Score: {tender.score}
              </span>
            </div>
            <button
              onClick={onClose}
              className="p-2 hover:bg-gray-100 rounded-full transition-colors duration-200"
            >
              <FiX className="w-6 h-6 text-gray-400" />
            </button>
          </div>

          {/* Body */}
          <div className="p-6 space-y-6">
            <div className="space-y-4">
              <h3 className="text-xl font-semibold text-gray-900 leading-tight">
                {tender.title}
              </h3>

              <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                <div className="flex items-center gap-2 text-sm text-gray-600">
                  <FiMapPin className="w-4 h-4 text-gray-400" />
                  <span className="font-medium">Country:</span>
                  <span>{tender.country}</span>
                </div>
                <div className="flex items-center gap-2 text-sm text-gray-600">
                  <FiTag className="w-4 h-4 text-gray-400" />
                  <span className="font-medium">Business Unit:</span>
                  <span>{tender.unit}</span>
                </div>
                <div
                  className={`flex items-center gap-2 text-sm ${
                    isDeadlinePassed ? "text-red-600" : "text-gray-600"
                  }`}
                >
                  <FiCalendar className="w-4 h-4 text-gray-400" />
                  <span className="font-medium">Deadline:</span>
                  <span>{formatDate(tender.deadline)}</span>
                </div>
              </div>

              {isDeadlinePassed && (
                <div className="bg-red-50 border border-red-200 rounded-md p-3">
                  <p className="text-red-800 text-sm font-medium">
                    ⚠️ This tender deadline has passed
                  </p>
                </div>
              )}
            </div>

            <div className="space-y-2">
              <h4 className="text-lg font-semibold text-gray-900">Summary</h4>
              <p className="text-gray-700 leading-relaxed">{tender.summary}</p>
            </div>

            {tender.description && tender.description !== tender.summary && (
              <div className="space-y-2">
                <h4 className="text-lg font-semibold text-gray-900">
                  Description
                </h4>
                <p className="text-gray-700 leading-relaxed">
                  {tender.description}
                </p>
              </div>
            )}

            {tender.reason && (
              <div className="space-y-2">
                <h4 className="text-lg font-semibold text-gray-900">
                  Assessment
                </h4>
                <div className="bg-blue-50 border border-blue-200 rounded-md p-4">
                  <p className="text-blue-800 leading-relaxed">
                    {tender.reason}
                  </p>
                </div>
              </div>
            )}

            <div className="border-t border-gray-200 pt-4">
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4 text-sm text-gray-600">
                <div className="flex items-center gap-2"></div>
                <div className="flex items-center gap-2"></div>
              </div>
            </div>
          </div>

          {/* Footer actions (both right; Close is to the right of View) */}
          <div className="flex items-center px-6 py-4 bg-gray-50 border-t border-gray-200 rounded-b-lg">
            <div className="ml-auto flex gap-3">
              <a
                href={tender.url}
                target="_blank"
                rel="noopener noreferrer"
                className="inline-flex items-center gap-2 px-4 py-2 bg-blue-600 text-white rounded-md hover:bg-blue-700 transition-colors duration-200"
              >
                <FiExternalLink className="w-4 h-4" />
                View Original
              </a>

              <button
                onClick={onClose}
                className="px-4 py-2 text-gray-700 bg-white border border-gray-300 rounded-md hover:bg-gray-50 transition-colors duration-200"
              >
                Close
              </button>
            </div>
          </div>
        </div>
        {/* /Card */}
      </div>
      {/* /Center container */}
    </div>
  );
}
