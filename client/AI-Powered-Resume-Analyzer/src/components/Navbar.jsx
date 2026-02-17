import { useState, useEffect } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { LogOut, User, FileText } from 'lucide-react';

const Navbar = () => {
  const [isAuthenticated, setIsAuthenticated] = useState(false);
  const navigate = useNavigate();

  useEffect(() => {
    // Check auth state from localStorage
    const authStatus = localStorage.getItem('isAuthenticated');
    setIsAuthenticated(authStatus === 'true');
  }, []);

  const handleSignOut = () => {
    localStorage.removeItem('isAuthenticated');
    setIsAuthenticated(false);
    navigate('/');
  };

  return (
    <nav className="bg-white shadow-sm border-b border-gray-100 sticky top-0 z-50">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex justify-between h-16">
          <div className="flex items-center">
            <Link to="/" className="flex-shrink-0 flex items-center gap-2">
              <span className="text-2xl font-bold bg-clip-text text-transparent bg-gradient-to-r from-blue-600 to-indigo-600">
                ResumeAI
              </span>
            </Link>
          </div>
          
          <div className="flex items-center space-x-4">
             {isAuthenticated ? (
               <>
                 <Link to="/history" className="text-gray-600 hover:text-indigo-600 font-medium px-3 py-2 rounded-md transition-colors flex items-center gap-2">
                    <FileText size={18} />
                    <span>History</span>
                 </Link>
                 
                 <div className="h-8 w-px bg-gray-200 mx-2"></div>
                 
                 <div className="relative group cursor-pointer">
                    <div className="flex items-center gap-2 text-gray-700 hover:text-indigo-600 transition-colors">
                        <div className="h-9 w-9 bg-indigo-100 rounded-full flex items-center justify-center border border-indigo-200 text-indigo-700">
                             <User size={20} />
                        </div>
                        <span className="font-medium hidden sm:block">John Doe</span>
                    </div>
                    
                     {/* Dropdown Menu */}
                    <div className="absolute right-0 mt-2 w-48 bg-white rounded-md shadow-lg py-1 ring-1 ring-black ring-opacity-5 hidden group-hover:block transistion-all">
                        <button
                            onClick={handleSignOut}
                            className="block px-4 py-2 text-sm text-gray-700 hover:bg-gray-100 w-full text-left flex items-center gap-2"
                        >
                            <LogOut size={16} />
                            Sign out
                        </button>
                    </div>
                 </div>
               </>
             ) : (
                <>
                  <Link to="/signin" className="text-gray-600 hover:text-indigo-600 font-medium px-4 py-2 rounded-md transition-colors">
                    Sign In
                  </Link>
                  <Link to="/register" className="bg-indigo-600 hover:bg-indigo-700 text-white font-medium px-5 py-2.5 rounded-full transition-colors shadow-sm hover:shadow-md">
                    Register
                  </Link>
                </>
             )}
          </div>
        </div>
      </div>
    </nav>
  );
};

export default Navbar;
