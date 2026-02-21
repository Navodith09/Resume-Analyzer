import { useState, useEffect } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { LogOut, User, FileText, Sun, Moon } from 'lucide-react';
import { authService } from '../services/auth';
import { useTheme } from '../context/ThemeContext';

const Navbar = () => {
  const [isAuthenticated, setIsAuthenticated] = useState(false);
  const [user, setUser] = useState(null);
  const [isDropdownOpen, setIsDropdownOpen] = useState(false);
  const navigate = useNavigate();

  useEffect(() => {
    // Check auth state from localStorage
    const authStatus = localStorage.getItem('isAuthenticated');
    const userData = localStorage.getItem('user');
    setIsAuthenticated(authStatus === 'true');
    if (userData) {
        try {
            setUser(JSON.parse(userData));
        } catch (e) {
            console.error("Failed to parse user data", e);
        }
    }
  }, []);

  const handleSignOut = async () => {
    try {
        await authService.signOut();
    } catch (error) {
        console.error("Sign out failed", error);
    } finally {
        localStorage.removeItem('isAuthenticated');
        localStorage.removeItem('user');
        localStorage.removeItem('token');
        setIsAuthenticated(false);
        setUser(null);
        navigate('/');
        window.location.reload(); // To refresh state if needed
    }
  };

  const { theme, toggleTheme } = useTheme();

  return (
    <nav className="bg-white dark:bg-gray-900 shadow-sm border-b border-gray-100 dark:border-gray-800 sticky top-0 z-50 transition-colors duration-200">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex justify-between h-16">
          <div className="flex items-center">
            <Link to="/" className="flex-shrink-0 flex items-center gap-2">
              <span className="text-xl sm:text-2xl font-bold bg-clip-text text-transparent bg-gradient-to-r from-blue-600 to-indigo-600 dark:from-sky-400 dark:to-blue-500 leading-tight">
                Resume<br className="block sm:hidden" /> Evaluator
              </span>
            </Link>
          </div>
          
          <div className="flex items-center space-x-4">
             {/* Dark Mode Toggle */}
             <div 
                onClick={toggleTheme}
                className={`relative w-16 h-8 flex items-center bg-gray-200 dark:bg-gray-700 rounded-full p-1 cursor-pointer transition-colors duration-300 ease-in-out ${theme === 'dark' ? 'justify-end' : 'justify-start'}`}
                aria-label="Toggle Dark Mode"
             >
                {/* Switch Knob */}
                <div className={`
                    absolute left-1 top-1 w-6 h-6 bg-white rounded-full shadow-md transform transition-transform duration-300 ease-in-out flex items-center justify-center
                    ${theme === 'dark' ? 'translate-x-8 bg-gray-800' : 'translate-x-0'}
                `}>
                    {theme === 'light' ? (
                        <Sun size={14} className="text-yellow-500" />
                    ) : (
                        <Moon size={14} className="text-blue-400" />
                    )}
                </div>
                
                {/* Background Icons (Visible when knob moves away) */}
                <div className={`absolute left-2 text-yellow-500 ${theme === 'dark' ? 'opacity-100' : 'opacity-0'} transition-opacity duration-300`}>
                    <Sun size={14} />
                </div>
                <div className={`absolute right-2 text-blue-400 ${theme === 'light' ? 'opacity-100' : 'opacity-0'} transition-opacity duration-300`}>
                    <Moon size={14} />
                </div>
             </div>

             {isAuthenticated ? (
               <>
                 <Link to="/history" className="text-gray-600 dark:text-gray-300 hover:text-indigo-600 dark:hover:text-indigo-400 font-medium px-3 py-2 rounded-md transition-colors flex items-center gap-2">
                    <FileText size={18} />
                    <span>History</span>
                 </Link>
                 
                 <div className="h-8 w-px bg-gray-200 dark:bg-gray-700 mx-2"></div>
                 
                 <div className="relative cursor-pointer">
                    <div 
                        className="flex items-center gap-2 text-gray-700 dark:text-gray-200 hover:text-indigo-600 dark:hover:text-indigo-400 transition-colors"
                        onClick={() => setIsDropdownOpen(!isDropdownOpen)}
                    >
                        <div className="h-9 w-9 bg-indigo-100 dark:bg-indigo-900/30 rounded-full flex items-center justify-center border border-indigo-200 dark:border-indigo-800 text-indigo-700 dark:text-indigo-300">
                             <User size={20} />
                        </div>
                        <span className="font-medium hidden sm:block">{user?.username || 'User'}</span>
                    </div>
                    
                     {/* Dropdown Menu */}
                    {isDropdownOpen && (
                        <div className="absolute right-0 mt-2 w-48 bg-white dark:bg-gray-800 rounded-md shadow-lg py-1 ring-1 ring-black ring-opacity-5 z-50">
                            <button
                                onClick={handleSignOut}
                                className="block px-4 py-2 text-sm text-gray-700 dark:text-gray-200 hover:bg-gray-100 dark:hover:bg-gray-700 w-full text-left flex items-center gap-2"
                            >
                                <LogOut size={16} />
                                Sign out
                            </button>
                        </div>
                    )}
                 </div>
               </>
             ) : (
                <>
                  <Link to="/signin" className="text-gray-600 dark:text-gray-300 hover:text-indigo-600 dark:hover:text-indigo-400 font-medium px-4 py-2 rounded-md transition-colors">
                    Sign In
                  </Link>
                  <Link to="/register" className="bg-indigo-600 hover:bg-indigo-700 text-white font-medium px-5 py-2.5 rounded-full transition-all shadow-md hover:shadow-lg hover:-translate-y-0.5 active:translate-y-0 active:scale-95 dark:shadow-indigo-900/40">
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
