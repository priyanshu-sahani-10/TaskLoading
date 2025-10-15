import { Link, useNavigate } from "react-router-dom";
import { Button } from "@/components/ui/button";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuGroup,
  DropdownMenuItem,
  DropdownMenuLabel,
  DropdownMenuSeparator,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";
import { Avatar, AvatarFallback, AvatarImage } from "./ui/avatar";
import DarkMode from "@/DarkMode";
import { useSelector } from "react-redux";
import { useLogoutUserMutation } from "@/features/api/authApi";
import { useEffect, useState } from "react";
import { toast } from "sonner";
import { Menu, X, Home, FileText, Users, Shield, User, LogOut, ChevronDown } from "lucide-react";

export default function Navbar() {
  const { user } = useSelector((store) => store.auth);
  const [logoutUser, { data, isSuccess }] = useLogoutUserMutation();
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false);
  const [scrolled, setScrolled] = useState(false);
  const navigate = useNavigate();

  const logoutHandler = async () => {
    await logoutUser();
  };

  useEffect(() => {
    if (isSuccess) {
      navigate("/");
      toast.success("User Logout successful");
      setMobileMenuOpen(false);
    }
  }, [isSuccess, navigate]);

  useEffect(() => {
    const handleScroll = () => {
      setScrolled(window.scrollY > 10);
    };
    window.addEventListener("scroll", handleScroll);
    return () => window.removeEventListener("scroll", handleScroll);
  }, []);

  return (
    <>
      <nav
        className={`h-16 md:h-20 fixed top-0 left-0 right-0 z-50 transition-all duration-300 ${
          scrolled
            ? "bg-white/80 dark:bg-gray-900/80 backdrop-blur-lg shadow-lg"
            : "bg-white/95 dark:bg-gray-900/95 backdrop-blur-sm shadow-md"
        } border-b border-gray-200 dark:border-gray-800`}
      >
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 h-full">
          <div className="flex justify-between items-center h-full">
            {/* Logo */}
            <Link to="/" className="flex items-center gap-2 group">
              <div className="w-10 h-10 bg-gradient-to-br from-blue-500 to-purple-600 rounded-xl flex items-center justify-center transform group-hover:scale-110 transition-transform duration-300">
                <span className="text-white font-bold text-xl">T</span>
              </div>
              <h1 className="text-2xl md:text-3xl font-bold bg-gradient-to-r from-blue-600 to-purple-600 bg-clip-text text-transparent">
                TaskLoading
              </h1>
            </Link>

            {/* Desktop Navigation */}
            <div className="hidden lg:flex items-center gap-6">
              {user && (
                <>
                  <Link to="/">
                    <Button variant="ghost" className="gap-2">
                      <Home className="w-4 h-4" />
                      Home
                    </Button>
                  </Link>
                  <Link to="/reportIssue">
                    <Button className="gap-2 bg-gradient-to-r from-blue-600 to-purple-600 hover:from-blue-700 hover:to-purple-700">
                      <FileText className="w-4 h-4" />
                      Report Issue
                    </Button>
                  </Link>
                  <Link to="/communityBoard">
                    <Button variant="outline" className="gap-2">
                      <Users className="w-4 h-4" />
                      Community
                    </Button>
                  </Link>
                  {user.role === "admin" && (
                    <Link to="/adminIssuesManager">
                      <Button variant="outline" className="gap-2 border-purple-500 text-purple-600 hover:bg-purple-50 dark:hover:bg-purple-950">
                        <Shield className="w-4 h-4" />
                        Admin Panel
                      </Button>
                    </Link>
                  )}
                </>
              )}
            </div>

            {/* Right Section */}
            <div className="flex items-center gap-4">
              {user ? (
                <div className="hidden md:flex items-center gap-3">
                  <span className="text-sm text-gray-600 dark:text-gray-400">
                    Welcome, <span className="font-semibold text-gray-900 dark:text-white">{user?.name}</span>
                  </span>
                  <DropdownMenu>
                    <DropdownMenuTrigger asChild>
                      <button className="flex items-center gap-2 p-1 rounded-full hover:bg-gray-100 dark:hover:bg-gray-800 transition-colors">
                        <Avatar className="w-10 h-10 border-2 border-blue-500">
                          <AvatarImage
                            src={user?.photoUrl || "https://github.com/shadcn.png"}
                            alt={user?.name}
                          />
                          <AvatarFallback className="bg-gradient-to-br from-blue-500 to-purple-600 text-white">
                            {user?.name?.charAt(0).toUpperCase()}
                          </AvatarFallback>
                        </Avatar>
                        <ChevronDown className="w-4 h-4 text-gray-600 dark:text-gray-400" />
                      </button>
                    </DropdownMenuTrigger>

                    <DropdownMenuContent className="w-56" align="end">
                      <DropdownMenuLabel>
                        <div className="flex flex-col">
                          <span className="font-semibold">{user?.name}</span>
                          <span className="text-xs text-gray-500">{user?.email}</span>
                        </div>
                      </DropdownMenuLabel>
                      <DropdownMenuSeparator />

                      <DropdownMenuGroup>
                        <Link to="/userIssues">
                          <DropdownMenuItem className="cursor-pointer gap-2">
                            <User className="w-4 h-4" />
                            My Issues
                          </DropdownMenuItem>
                        </Link>
                        <Link to="/communityBoard">
                          <DropdownMenuItem className="cursor-pointer gap-2">
                            <Users className="w-4 h-4" />
                            All Issues
                          </DropdownMenuItem>
                        </Link>
                      </DropdownMenuGroup>

                      <DropdownMenuSeparator />
                      <DropdownMenuItem
                        onClick={logoutHandler}
                        className="cursor-pointer text-red-600 focus:text-red-600 gap-2"
                      >
                        <LogOut className="w-4 h-4" />
                        Log out
                      </DropdownMenuItem>
                    </DropdownMenuContent>
                  </DropdownMenu>
                </div>
              ) : (
                <div className="hidden md:flex items-center gap-2">
                  <Link to="/login">
                    <Button variant="ghost">Login</Button>
                  </Link>
                  <Link to="/signup">
                    <Button className="bg-gradient-to-r from-blue-600 to-purple-600 hover:from-blue-700 hover:to-purple-700">
                      Sign Up
                    </Button>
                  </Link>
                </div>
              )}

              <div className="hidden md:block">
                <DarkMode />
              </div>

              {/* Mobile Menu Button */}
              <button
                onClick={() => setMobileMenuOpen(!mobileMenuOpen)}
                className="lg:hidden p-2 rounded-lg hover:bg-gray-100 dark:hover:bg-gray-800 transition-colors"
              >
                {mobileMenuOpen ? (
                  <X className="w-6 h-6" />
                ) : (
                  <Menu className="w-6 h-6" />
                )}
              </button>
            </div>
          </div>
        </div>
      </nav>

      {/* Mobile Menu */}
      <div
        className={`lg:hidden fixed inset-0 z-40 transition-all duration-300 ${
          mobileMenuOpen ? "visible" : "invisible"
        }`}
      >
        {/* Backdrop */}
        <div
          onClick={() => setMobileMenuOpen(false)}
          className={`absolute inset-0 bg-black/50 backdrop-blur-sm transition-opacity duration-300 ${
            mobileMenuOpen ? "opacity-100" : "opacity-0"
          }`}
        />

        {/* Menu Content */}
        <div
          className={`absolute top-16 md:top-20 right-0 w-full sm:w-80 bg-white dark:bg-gray-900 border-l border-gray-200 dark:border-gray-800 shadow-2xl h-[calc(100vh-4rem)] md:h-[calc(100vh-5rem)] overflow-y-auto transition-transform duration-300 ${
            mobileMenuOpen ? "translate-x-0" : "translate-x-full"
          }`}
        >
          <div className="p-6 space-y-6">
            {user && (
              <div className="flex items-center gap-3 pb-6 border-b border-gray-200 dark:border-gray-800">
                <Avatar className="w-12 h-12 border-2 border-blue-500">
                  <AvatarImage src={user?.photoUrl || "https://github.com/shadcn.png"} />
                  <AvatarFallback className="bg-gradient-to-br from-blue-500 to-purple-600 text-white">
                    {user?.name?.charAt(0).toUpperCase()}
                  </AvatarFallback>
                </Avatar>
                <div>
                  <p className="font-semibold text-gray-900 dark:text-white">{user?.name}</p>
                  <p className="text-sm text-gray-500">{user?.email}</p>
                </div>
              </div>
            )}

            {user ? (
              <div className="space-y-2">
                <Link to="/" onClick={() => setMobileMenuOpen(false)}>
                  <Button variant="ghost" className="w-full justify-start gap-2">
                    <Home className="w-4 h-4" />
                    Home
                  </Button>
                </Link>
                <Link to="/reportIssue" onClick={() => setMobileMenuOpen(false)}>
                  <Button className="w-full justify-start gap-2 bg-gradient-to-r from-blue-600 to-purple-600">
                    <FileText className="w-4 h-4" />
                    Report Issue
                  </Button>
                </Link>
                <Link to="/communityBoard" onClick={() => setMobileMenuOpen(false)}>
                  <Button variant="outline" className="w-full justify-start gap-2">
                    <Users className="w-4 h-4" />
                    Community Board
                  </Button>
                </Link>
                <Link to="/userIssues" onClick={() => setMobileMenuOpen(false)}>
                  <Button variant="ghost" className="w-full justify-start gap-2">
                    <User className="w-4 h-4" />
                    My Issues
                  </Button>
                </Link>
                {user.role === "admin" && (
                  <Link to="/adminIssuesManager" onClick={() => setMobileMenuOpen(false)}>
                    <Button variant="outline" className="w-full justify-start gap-2 border-purple-500 text-purple-600">
                      <Shield className="w-4 h-4" />
                      Admin Panel
                    </Button>
                  </Link>
                )}
                <div className="pt-4 border-t border-gray-200 dark:border-gray-800">
                  <Button
                    onClick={logoutHandler}
                    variant="ghost"
                    className="w-full justify-start gap-2 text-red-600 hover:text-red-700 hover:bg-red-50 dark:hover:bg-red-950"
                  >
                    <LogOut className="w-4 h-4" />
                    Log out
                  </Button>
                </div>
              </div>
            ) : (
              <div className="space-y-2">
                <Link to="/login" onClick={() => setMobileMenuOpen(false)}>
                  <Button variant="outline" className="w-full">
                    Login
                  </Button>
                </Link>
                <Link to="/signup" onClick={() => setMobileMenuOpen(false)}>
                  <Button className="w-full bg-gradient-to-r from-blue-600 to-purple-600">
                    Sign Up
                  </Button>
                </Link>
              </div>
            )}

            <div className="pt-6 border-t border-gray-200 dark:border-gray-800">
              <div className="flex items-center justify-between">
                <span className="text-sm font-medium text-gray-700 dark:text-gray-300">Theme</span>
                <DarkMode />
              </div>
            </div>
          </div>
        </div>
      </div>
    </>
  );
}