import { Github, Twitter, Mail, Code } from 'lucide-react';

const Footer = () => {
  const currentYear = new Date().getFullYear();

  return (
    <footer className="bg-white dark:bg-gray-900 border-t border-gray-100 dark:border-gray-800 transition-colors duration-200">
      <div className="max-w-7xl mx-auto py-8 px-4 sm:px-6 lg:px-8">
        <div className="flex flex-col md:flex-row justify-between items-center gap-4">
          
          <div className="flex flex-col items-center md:items-start">
            <span className="text-sm text-gray-500 dark:text-gray-400">
              © {currentYear} Navodith Mondal. All rights reserved.
            </span>
            <span className="text-xs text-gray-400 dark:text-gray-500 mt-1 flex items-center gap-1">
              Developed with <Code size={12} className="text-gray-400 dark:text-gray-500" /> by Navodith
            </span>
          </div>

          <div className="flex items-center space-x-6">
            <a 
              href="https://github.com/Navodith09" 
              target="_blank" 
              rel="noopener noreferrer"
              className="text-gray-400 hover:text-gray-900 dark:hover:text-white transition-colors"
              aria-label="GitHub"
            >
              <Github size={20} />
            </a>
            <a 
              href="https://x.com/NavodithM" 
              target="_blank" 
              rel="noopener noreferrer"
              className="text-gray-400 hover:text-blue-400 transition-colors"
              aria-label="X (Twitter)"
            >
              <Twitter size={20} />
            </a>
            <a 
              href="mailto:navodith.saptarshi@gmail.com"
              onClick={(e) => {
                window.location.href = "mailto:navodith.saptarshi@gmail.com";
                e.preventDefault();
              }}
              className="text-gray-400 hover:text-indigo-600 dark:hover:text-indigo-400 transition-colors"
              aria-label="Email"
            >
              <Mail size={20} />
            </a>
          </div>
        </div>
      </div>
    </footer>
  );
};

export default Footer;
