import { useState } from 'react';
import ResumeUpload from '../components/ResumeUpload'
import JobDescription from '../components/JobDescription'
import Results from '../components/Results'
import { analyzerService } from '../services/analyzer';
import { Loader2, AlertCircle } from 'lucide-react';

const Home = () => {
    const [resumeFile, setResumeFile] = useState(null);
    const [jobDescription, setJobDescription] = useState('');
    const [jobTitle, setJobTitle] = useState(''); // Optional, extracted or input
    const [results, setResults] = useState(null);
    const [isLoading, setIsLoading] = useState(false);
    const [error, setError] = useState(null);

    const handleFileSelect = (file) => {
        setResumeFile(file);
        setError(null);
    };

    const handleDescriptionChange = (text, isUrl = false) => {
        setJobDescription(text);
        setError(null);
    };

    const handleAnalyze = async () => {
        if (!resumeFile) {
            setError("Please upload a resume.");
            return;
        }
        if (!jobDescription) {
            setError("Please enter a job description or link.");
            return;
        }

        setIsLoading(true);
        setError(null);
        setResults(null);

        const formData = new FormData();
        formData.append('resume', resumeFile);
        formData.append('job_description', jobDescription);
        if (jobTitle) formData.append('job_title', jobTitle);

        try {
            const data = await analyzerService.analyzeResume(formData);
            setResults(data);
        } catch (err) {
            console.error("Analysis failed", err);
            // Handle Django error format { error: "..." } or { detail: "..." }
            const errorMessage = err.error || err.detail || err.message || "An error occurred during analysis.";
            setError(errorMessage);
        } finally {
            setIsLoading(false);
        }
    };

    return (
        <div className="pb-20">
            <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 pt-10 text-center">
                <h1 className="text-4xl sm:text-5xl font-extrabold tracking-tight text-gray-900 mb-4">
                    <span className="block">Optimize Your Resume for</span>
                    <span className="block text-indigo-600">ATS Success</span>
                </h1>
                <p className="mt-4 max-w-2xl mx-auto text-xl text-gray-500">
                    Upload your resume and the job description to get an instant analysis, score, and actionable feedback.
                </p>
            </div>

            {error && (
                <div className="max-w-3xl mx-auto mt-6 px-4">
                    <div className="bg-red-50 border border-red-200 text-red-700 px-4 py-3 rounded-lg flex items-center gap-2">
                        <AlertCircle className="h-5 w-5" />
                        <p>{error}</p>
                    </div>
                </div>
            )}

            <ResumeUpload onFileSelect={handleFileSelect} />
            
            <JobDescription 
                onDescriptionChange={handleDescriptionChange} 
                onAnalyze={handleAnalyze}
                isLoading={isLoading}
            />
            
            {(results || isLoading) && (
                <Results results={results} isLoading={isLoading} />
            )}
        </div>
    )
}

export default Home
