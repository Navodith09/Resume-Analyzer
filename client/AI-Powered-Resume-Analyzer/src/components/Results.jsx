import { Award, CheckCircle, AlertCircle, AlertTriangle, Download } from 'lucide-react';

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
    const score = results.score || 0;
    const analysis = results.analysis || {};
    const summary = analysis.professional_summary || "No summary available.";
    const missingSkills = analysis.missing_skills || [];
    const improvements = analysis.improvement_suggestions || [];
    const matchedSkills = analysis.matched_skills || [];

    const getScoreColor = (score) => {
        if (score >= 80) return 'text-green-600 border-green-500 bg-green-50';
        if (score >= 60) return 'text-yellow-600 border-yellow-500 bg-yellow-50';
        return 'text-red-600 border-red-500 bg-red-50';
    };

    return (
        <div className="max-w-5xl mx-auto mt-12 mb-20 px-4">
            <h2 className="text-xl font-semibold mb-6 text-gray-800">Analysis Results</h2>
            
            <div className="bg-white rounded-xl shadow-lg border border-gray-100 overflow-hidden">
                <div className="grid grid-cols-1 md:grid-cols-3 divide-y md:divide-y-0 md:divide-x divide-gray-100">
                    
                    {/* Column 1: Score & Overview */}
                    <div className="p-8 flex flex-col items-center justify-center text-center">
                        <div className={`w-32 h-32 rounded-full border-8 flex items-center justify-center mb-4 ${getScoreColor(score)}`}>
                            <div className="text-center">
                                <span className="block text-4xl font-bold">{score}</span>
                                <span className="text-xs uppercase font-semibold opacity-80">ATS Score</span>
                            </div>
                        </div>
                        <h3 className="text-lg font-bold text-gray-900 mb-1">
                            {score >= 80 ? 'Excellent Match' : score >= 60 ? 'Good Match' : 'Needs Improvement'}
                        </h3>
                        <p className="text-sm text-gray-500 px-4">
                             {score >= 80 
                                ? "Your resume runs a high chance of passing the ATS filters." 
                                : "Your resume aligns with the job but needs optimization to pass ATS filters."}
                        </p>
                        
                        <button className="mt-6 flex items-center gap-2 bg-gray-900 hover:bg-gray-800 text-white px-5 py-2.5 rounded-lg transition-colors font-medium text-sm">
                            <Download size={16} />
                            Download Report (PDF)
                        </button>
                    </div>

                    {/* Column 2: Breakdown */}
                    <div className="p-8 md:col-span-2">
                         {/* Summary */}
                         <div className="mb-6">
                            <h4 className="text-sm font-bold text-gray-900 uppercase tracking-wide mb-2 flex items-center gap-2">
                                <CheckCircle size={16} className="text-indigo-500" /> Executive Summary
                            </h4>
                            <p className="text-gray-600 text-sm leading-relaxed bg-gray-50 p-4 rounded-lg border border-gray-100">
                                {summary}
                            </p>
                        </div>

                        {/* Missing Skills */}
                        <div className="mb-6">
                            <h4 className="text-sm font-bold text-gray-900 uppercase tracking-wide mb-3 flex items-center gap-2">
                                <AlertTriangle size={16} className="text-amber-500" /> Missing Keywords
                            </h4>
                            <div className="flex flex-wrap gap-2">
                                {missingSkills.length > 0 ? missingSkills.map((skill, index) => (
                                    <span key={index} className="px-3 py-1 bg-red-50 text-red-700 text-xs font-medium rounded-full border border-red-100">
                                        {skill}
                                    </span>
                                )) : <p className="text-sm text-gray-500">No missing keywords detected!</p>}
                            </div>
                        </div>

                         {/* Improvements */}
                         <div>
                            <h4 className="text-sm font-bold text-gray-900 uppercase tracking-wide mb-3 flex items-center gap-2">
                                <AlertCircle size={16} className="text-blue-500" /> Recommended Improvements
                            </h4>
                            <ul className="space-y-2">
                                {improvements.map((item, index) => (
                                    <li key={index} className="flex items-start gap-2 text-sm text-gray-600">
                                        <div className="mt-1.5 w-1.5 h-1.5 rounded-full bg-blue-400 flex-shrink-0"></div>
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
