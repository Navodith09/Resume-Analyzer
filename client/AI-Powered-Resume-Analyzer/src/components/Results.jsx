import { Award, CheckCircle, AlertCircle, AlertTriangle, Download } from 'lucide-react';
import { generatePDF } from '../utils/pdfGenerator'; // Import utility

const Results = ({ results, isLoading }) => {
    
    if (isLoading) {
        return (
             <div className="max-w-5xl mx-auto mt-12 mb-20 px-4 text-center">
                <p className="text-gray-500">Generating report...</p>
             </div>
        )
    }

    if (!results) return null;

    // Map API response to component data structure
    // Map API response to component data structure
    const score = results.score || 0;
    // Handle both nested 'analysis' (History) and flat structure (API response)
    const analysis = results.analysis || results; 
    const summary = analysis.professional_summary || "No summary available.";
    const missingSkills = analysis.missing_skills || [];
    const improvements = analysis.improvement_suggestions || [];
    const matchedSkills = analysis.matched_skills || [];

    const getScoreColor = (score) => {
        if (score >= 80) return 'text-green-600 border-green-500 bg-green-50';
        if (score >= 60) return 'text-yellow-600 border-yellow-500 bg-yellow-50';
        return 'text-red-600 border-red-500 bg-red-50';
    };

    const handleDownload = () => {
        const dataForPdf = {
            score: score,
            analysis: analysis,
            job_title: results.job_title || results.extracted_job_title
        };
        generatePDF(dataForPdf);
    };

    return (
        <div className="max-w-5xl mx-auto mt-12 mb-20 px-4">
            <h2 className="text-xl font-semibold mb-6 text-gray-800 dark:text-gray-200">Analysis Results</h2>
            
            <div className="bg-white dark:bg-gray-800 rounded-xl shadow-lg border border-gray-100 dark:border-gray-700 overflow-hidden transition-colors duration-200">
                <div className="grid grid-cols-1 md:grid-cols-3 divide-y md:divide-y-0 md:divide-x divide-gray-100 dark:divide-gray-700">
                    
                    {/* Column 1: Score & Overview */}
                    <div className="p-8 flex flex-col items-center justify-center text-center">
                        <div className={`w-32 h-32 rounded-full border-8 flex items-center justify-center mb-4 ${getScoreColor(score)}`}>
                            <div className="text-center">
                                <span className="block text-4xl font-bold dark:text-gray-900">{score}</span>
                                <span className="text-xs uppercase font-semibold opacity-80 dark:text-gray-800">ATS Score</span>
                            </div>
                        </div>
                        <h3 className="text-lg font-bold text-gray-900 dark:text-white mb-1">
                            {score >= 80 ? 'Excellent Match' : score >= 60 ? 'Good Match' : 'Needs Improvement'}
                        </h3>
                        <p className="text-sm text-gray-500 dark:text-gray-400 px-4">
                             {score >= 80 
                                ? "Your resume runs a high chance of passing the ATS filters." 
                                : "Your resume aligns with the job but needs optimization to pass ATS filters."}
                        </p>
                        
                        <button 
                            onClick={handleDownload}
                            className="mt-6 flex items-center gap-2 bg-gray-900 dark:bg-indigo-600 hover:bg-gray-800 dark:hover:bg-indigo-700 text-white px-6 py-3 rounded-lg transition-all font-medium text-sm shadow-md hover:shadow-lg hover:-translate-y-0.5 active:translate-y-0 active:scale-95 dark:shadow-indigo-900/40"
                        >
                            <Download size={16} />
                            Download Report (PDF)
                        </button>
                    </div>

                    {/* Column 2: Breakdown */}
                    <div className="p-8 md:col-span-2">
                         {/* Summary */}
                         <div className="mb-6">
                            <h4 className="text-sm font-bold text-gray-900 dark:text-white uppercase tracking-wide mb-2 flex items-center gap-2">
                                <CheckCircle size={16} className="text-indigo-500 dark:text-indigo-400" /> Executive Summary
                            </h4>
                            <p className="text-gray-600 dark:text-gray-300 text-sm leading-relaxed bg-gray-50 dark:bg-gray-700/50 p-4 rounded-lg border border-gray-100 dark:border-gray-700">
                                {summary}
                            </p>
                        </div>

                        {/* Missing Skills */}
                        <div className="mb-6">
                            <h4 className="text-sm font-bold text-gray-900 dark:text-white uppercase tracking-wide mb-3 flex items-center gap-2">
                                <AlertTriangle size={16} className="text-amber-500" /> Missing Keywords
                            </h4>
                            <div className="flex flex-wrap gap-2">
                                {missingSkills.length > 0 ? missingSkills.map((skill, index) => (
                                    <span key={index} className="px-3 py-1 bg-red-50 dark:bg-red-900/20 text-red-700 dark:text-red-300 text-xs font-medium rounded-full border border-red-100 dark:border-red-800">
                                        {skill}
                                    </span>
                                )) : <p className="text-sm text-gray-500 dark:text-gray-400">No missing keywords detected!</p>}
                            </div>
                        </div>

                         {/* Improvements */}
                         <div>
                            <h4 className="text-sm font-bold text-gray-900 dark:text-white uppercase tracking-wide mb-3 flex items-center gap-2">
                                <AlertCircle size={16} className="text-blue-500 dark:text-blue-400" /> Recommended Improvements
                            </h4>
                            <ul className="space-y-2">
                                {improvements.map((item, index) => (
                                    <li key={index} className="flex items-start gap-2 text-sm text-gray-600 dark:text-gray-300">
                                        <div className="mt-1.5 w-1.5 h-1.5 rounded-full bg-blue-400 dark:bg-blue-500 flex-shrink-0"></div>
                                        {item}
                                    </li>
                                ))}
                            </ul>
                        </div>
                    </div>
                </div>
            </div>
            
        </div>
    );
};

export default Results;
