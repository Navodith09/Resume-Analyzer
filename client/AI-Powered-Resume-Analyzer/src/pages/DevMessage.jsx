import React from 'react';
import { Link } from 'react-router-dom';
import { MessageCircle, Home, UserPlus } from 'lucide-react';

const DevMessage = () => {
  return (
    <div className="min-h-[80vh] flex items-center justify-center py-12 px-4 sm:px-6 lg:px-8">
      <div className="max-w-md w-full space-y-8 bg-white dark:bg-gray-800 p-8 rounded-xl shadow-lg border border-gray-100 dark:border-gray-700">
        <div className="text-center">
          <div className="mx-auto flex items-center justify-center h-16 w-16 rounded-full bg-blue-100 dark:bg-blue-900/30 mb-6">
            <MessageCircle className="h-8 w-8 text-blue-600 dark:text-blue-500" />
          </div>
          <h2 className="mt-2 text-3xl font-extrabold text-gray-900 dark:text-white tracking-tight">
            Message from Project Dev
          </h2>
          <div className="mt-6 text-base text-gray-600 dark:text-gray-300 space-y-4 text-left">
            <p>
              We are sorry, but the <strong>Reset Password</strong> option is currently not working due to automated mailing limitations on our hosting platform.
            </p>
            <p>
              Because we cannot verify your email right now, we temporarily cannot authenticate your password reset request. 
            </p>
            <p className="font-medium text-blue-700 dark:text-blue-400 p-3 bg-blue-50 dark:bg-blue-900/20 rounded-md">
              Your existing data will stay completely unchanged and secure until this feature is Live again.
            </p>
            <p>
              Until then, you can register a new account to continue using the project's features!
            </p>
          </div>
        </div>
        
        <div className="mt-8 flex flex-col sm:flex-row gap-4 justify-center">
          <Link
            to="/register"
            className="flex justify-center items-center px-4 py-2 border border-transparent text-sm font-medium rounded-md shadow-sm text-white bg-indigo-600 hover:bg-indigo-700 dark:bg-indigo-500 dark:hover:bg-indigo-600 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-indigo-500 transition-colors"
          >
            <UserPlus className="h-4 w-4 mr-2" />
            Register New Account
          </Link>
          <Link
            to="/"
            className="flex justify-center items-center px-4 py-2 border border-gray-300 dark:border-gray-600 text-sm font-medium rounded-md text-gray-700 dark:text-gray-200 bg-white dark:bg-gray-700 hover:bg-gray-50 dark:hover:bg-gray-600 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-indigo-500 transition-colors"
          >
            <Home className="h-4 w-4 mr-2" />
            Return Home
          </Link>
        </div>
      </div>
    </div>
  );
};

export default DevMessage;
