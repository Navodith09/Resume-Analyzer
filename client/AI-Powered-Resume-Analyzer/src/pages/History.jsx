import { useState, useEffect } from 'react';
import { FileText, Calendar, Briefcase, Award, Download, Loader2, AlertCircle } from 'lucide-react';
import { authService } from '../services/auth';
import { generatePDF } from '../utils/pdfGenerator'; // Import utility

const History = () => {
  const [historyData, setHistoryData] = useState([]);
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState('');

  useEffect(() => {
    const fetchHistory = async () => {
        try {
            const data = await authService.getHistory();
            setHistoryData(data.history || []);
        } catch (err) {
            console.error("Failed to fetch history", err);
            setError(err.message || "Failed to load history.");
        } finally {
            setIsLoading(false);
        }
    };

    fetchHistory();
  }, []);

  const getScoreColor = (score) => {
    if (score >= 80) return 'text-green-600 bg-green-100';
    if (score >= 60) return 'text-yellow-600 bg-yellow-100';
    return 'text-red-600 bg-red-100';
  };

  const formatDate = (dateString) => {
      if (!dateString) return 'N/A';
      return new Date(dateString).toLocaleDateString();
  };

  const handleDownload = (item) => {
      if (item && item.analysis) {
            // Reconstruct the data object expected by generatePDF
            const data = {
                score: item.score,
                analysis: item.analysis,
                job_title: item.job_title
            };
            generatePDF(data);
      } else {
          console.error("No analysis data available for download");
          alert("Sorry, report data is missing for this item.");
      }
  };

  if (isLoading) {
      return (
          <div className="flex justify-center items-center h-64">
              <Loader2 className="h-8 w-8 animate-spin text-indigo-600" />
          </div>
      );
  }

  if (error) {
      return (
        <div className="max-w-7xl mx-auto px-4 py-12">
            <div className="bg-red-50 p-4 rounded-lg flex items-center text-red-700">
                <AlertCircle className="h-5 w-5 mr-2" />
                {error}
            </div>
        </div>
      );
  }

  return (
    <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-12 min-h-screen bg-gray-50 dark:bg-gray-900 transition-colors duration-200">
      <div className="mb-8">
        <h1 className="text-3xl font-bold text-gray-900 dark:text-white">Analysis History</h1>
        <p className="mt-2 text-gray-600 dark:text-gray-400">View your past resume analysis scores and details.</p>
      </div>

      <div className="bg-white dark:bg-gray-800 rounded-xl shadow-sm border border-gray-200 dark:border-gray-700 overflow-hidden transition-colors duration-200">
        {historyData.length === 0 ? (
            <div className="p-12 text-center text-gray-500 dark:text-gray-400">
                <FileText className="h-12 w-12 mx-auto text-gray-300 dark:text-gray-600 mb-4" />
                <p>No analysis history found. Upload a resume to get started!</p>
            </div>
        ) : (
            <div className="overflow-x-auto">
            <table className="min-w-full divide-y divide-gray-200 dark:divide-gray-700">
                <thead className="bg-gray-50 dark:bg-gray-700/50">
                <tr>
                    <th scope="col" className="px-6 py-3 text-left text-xs font-medium text-gray-500 dark:text-gray-400 uppercase tracking-wider">
                    Date
                    </th>
                    <th scope="col" className="px-6 py-3 text-left text-xs font-medium text-gray-500 dark:text-gray-400 uppercase tracking-wider">
                    File Name
                    </th>
                    <th scope="col" className="px-6 py-3 text-left text-xs font-medium text-gray-500 dark:text-gray-400 uppercase tracking-wider">
                    Job Role
                    </th>
                    <th scope="col" className="px-6 py-3 text-left text-xs font-medium text-gray-500 dark:text-gray-400 uppercase tracking-wider">
                    ATS Score
                    </th>
                    <th scope="col" className="relative px-6 py-3">
                    <span className="sr-only">Actions</span>
                    </th>
                </tr>
                </thead>
                <tbody className="bg-white dark:bg-gray-800 divide-y divide-gray-200 dark:divide-gray-700">
                {historyData.map((item) => (
                    <tr key={item.id} className="hover:bg-gray-50 dark:hover:bg-gray-700/50 transition-colors">
                    <td className="px-4 sm:px-6 py-4 whitespace-nowrap text-sm text-gray-500 dark:text-gray-400">
                        <div className="flex items-center">
                        <Calendar className="h-4 w-4 mr-2 flex-shrink-0 text-gray-400 dark:text-gray-500" />
                        {formatDate(item.created_at)}
                        </div>
                    </td>
                    <td className="px-4 sm:px-6 py-4 text-sm font-medium text-gray-900 dark:text-white max-w-[120px] sm:max-w-[200px] md:max-w-xs lg:max-w-sm">
                        <div className="flex items-center">
                        <FileText className="h-4 w-4 mr-2 flex-shrink-0 text-gray-400 dark:text-gray-500" />
                        <span className="line-clamp-2 sm:truncate leading-tight" title={item.file_name}>{item.file_name}</span>
                        </div>
                    </td>
                    <td className="px-4 sm:px-6 py-4 text-sm text-gray-500 dark:text-gray-400 max-w-[100px] sm:max-w-[150px] md:max-w-[250px]">
                        <div className="flex items-center">
                        <Briefcase className="h-4 w-4 mr-2 flex-shrink-0 text-gray-400 dark:text-gray-500" />
                        <span className="line-clamp-2 sm:truncate leading-tight" title={item.job_title}>{item.job_title}</span>
                        </div>
                    </td>
                    <td className="px-4 sm:px-6 py-4 whitespace-nowrap text-sm font-medium">
                        <span className={`inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium ${getScoreColor(item.score)}`}>
                            <Award className="h-3 w-3 mr-1" />
                            {item.score}/100
                        </span>
                    </td>
                    <td className="px-4 sm:px-6 py-4 whitespace-nowrap text-right text-sm font-medium">
                        <button 
                            onClick={() => handleDownload(item)}
                            className="text-indigo-600 dark:text-indigo-400 hover:text-indigo-900 dark:hover:text-indigo-300 bg-indigo-50 dark:bg-indigo-900/20 hover:bg-indigo-100 dark:hover:bg-indigo-900/40 p-2.5 rounded-full transition-all shadow-sm hover:shadow-md active:scale-95" 
                            title="Download Report"
                        >
                            <Download className="h-4 w-4" />
                        </button>
                    </td>
                    </tr>
                ))}
                </tbody>
            </table>
            </div>
        )}
      </div>
    </div>
  );
};

export default History;
