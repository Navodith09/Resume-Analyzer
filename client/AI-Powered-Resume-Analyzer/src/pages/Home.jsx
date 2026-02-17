import ResumeUpload from '../components/ResumeUpload'
import JobDescription from '../components/JobDescription'
import Results from '../components/Results'

const Home = () => {
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

            <ResumeUpload />
            <JobDescription />
            <Results />
        </div>
    )
}

export default Home
