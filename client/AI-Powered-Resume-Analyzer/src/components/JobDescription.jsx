import { useState } from 'react';
import { Type, Link, Loader2 } from 'lucide-react';

const JobDescription = ({ onDescriptionChange, onAnalyze, isLoading }) => {
    const [activeTab, setActiveTab] = useState('text'); // 'text' or 'link'

    const handleTextChange = (e) => {
        if (onDescriptionChange) {
            onDescriptionChange(e.target.value, false);
        }
    };

    const handleLinkChange = (e) => {
        if (onDescriptionChange) {
            onDescriptionChange(e.target.value, true);
        }
    };

    return (
        <div className="max-w-3xl mx-auto mt-8 px-4">
            <h2 className="text-xl font-semibold mb-4 text-gray-800">2. Job Description</h2>
            
            <div className="bg-white rounded-xl shadow-sm border border-gray-200 overflow-hidden">
                {/* Tabs */}
                <div className="flex border-b border-gray-200">
                    <button 
                        onClick={() => setActiveTab('text')}
                        className={`flex-1 py-3 px-4 text-sm font-medium flex items-center justify-center gap-2 transition-colors ${
                            activeTab === 'text' 
                            ? 'bg-blue-50 text-blue-600 border-b-2 border-blue-600' 
                            : 'text-gray-500 hover:text-gray-700 hover:bg-gray-50'
                        }`}
                    >
                        <Type size={16} />
                        Paste Description
                    </button>
                    <button 
                        onClick={() => setActiveTab('link')}
                        className={`flex-1 py-3 px-4 text-sm font-medium flex items-center justify-center gap-2 transition-colors ${
                            activeTab === 'link' 
                            ? 'bg-blue-50 text-blue-600 border-b-2 border-blue-600' 
                            : 'text-gray-500 hover:text-gray-700 hover:bg-gray-50'
                        }`}
                    >
                        <Link size={16} />
                        Job Link
                    </button>
                </div>

                {/* Content */}
                <div className="p-4">
                    {activeTab === 'text' ? (
                        <textarea
                            className="w-full h-48 p-4 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent resize-none bg-gray-50 text-gray-800 placeholder-gray-400"
                            placeholder="Paste the job description here or simply enter the position you are applying for (e.g., 'Senior React Developer' or 'Product Manager')..."
                            onChange={handleTextChange}
                        ></textarea>
                    ) : (
                        <div className="h-48 flex flex-col justify-center">
                            <label htmlFor="job-link" className="block text-sm font-medium text-gray-700 mb-2">
                                Paste the URL of the job posting
                            </label>
                            <div className="relative rounded-md shadow-sm">
                                <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
                                    <span className="text-gray-500 sm:text-sm">https://</span>
                                </div>
                                <input
                                    type="text"
                                    name="job-link"
                                    id="job-link"
                                    className="focus:ring-blue-500 focus:border-blue-500 block w-full pl-16 sm:text-sm border-gray-300 rounded-lg py-3"
                                    placeholder="www.linkedin.com/jobs/..."
                                    onChange={handleLinkChange}
                                />
                            </div>
                            <p className="mt-2 text-xs text-gray-500">
                                We'll automatically extract the job details from the link.
                            </p>
                        </div>
                    )}
                </div>
            </div>
            
            <div className="mt-8 flex justify-center">
                <button 
                    onClick={onAnalyze}
                    disabled={isLoading}
                    className="bg-gradient-to-r from-blue-600 to-indigo-600 hover:from-blue-700 hover:to-indigo-700 text-white font-bold py-3 px-10 rounded-full shadow-lg transform transition hover:-translate-y-0.5 active:translate-y-0 focus:outline-none focus:ring-4 focus:ring-blue-500/30 text-lg flex items-center gap-2 disabled:opacity-75 disabled:cursor-not-allowed"
                >
                    {isLoading ? (
                        <>
                            <Loader2 className="animate-spin h-5 w-5" />
                            Analyzing...
                        </>
                    ) : (
                        "Analyze Resume"
                    )}
                </button>
            </div>
        </div>
    );
};

export default JobDescription;
