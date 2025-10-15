import { Link, useNavigate } from "react-router-dom";
import { Button } from "@/components/ui/button";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuGroup,
  DropdownMenuItem,
  DropdownMenuLabel,
  DropdownMenuPortal,
  DropdownMenuSeparator,
  DropdownMenuShortcut,
  DropdownMenuSub,
  DropdownMenuSubContent,
  DropdownMenuSubTrigger,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";
import { Avatar, AvatarFallback, AvatarImage } from "./ui/avatar";
import DarkMode from "@/DarkMode";
import { useSelector } from "react-redux";
import { useLogoutUserMutation } from "@/features/api/authApi";
import { use, useEffect } from "react";
import { toast } from "sonner";

export default function Navbar() {
  const { user } = useSelector((store) => store.auth);

  const [logoutUser, { data, isSuccess }] = useLogoutUserMutation();
  const navigate = useNavigate();
  const logoutHandler = async () => {
  await logoutUser();
};


useEffect(() => {
  if (isSuccess) {
    navigate("/");
    toast.success("User Logout successful");
  }
}, [isSuccess, navigate]);





  return (
    <div className="h-16 dark:bg-[#020817] bg-cyan-100 border-b dark:border-b-gray-800 border-b-gray-200 fixed top-0 left-0 right-0  z-10">
      <div className="max-w-7xl mx-auto hidden md:flex justify-between items-center  h-full">
        <div className="flex items-center gap-8">
          <Link to="/">
            <h1 className=" text-blue-500 text-3xl">Taskloading</h1>
          </Link>

          {user && (
            <div className="flex items-center gap-4">
              <span>Welcome, {user?.name}</span>
              <Link to="/reportIssue">
                <Button>Report Issue</Button>
              </Link>
              <Link to="/communityBoard">
                <Button>Show All Issues !</Button>
              </Link>
            </div>
          )}

          {user && user.role === "admin" && (
            <Link to="/adminIssuesManager">
              <Button >Admin Panel</Button>
            </Link>
          )}
        </div>

        <div className="flex items-center gap-8">
          {user ? (
            <DropdownMenu>
              <DropdownMenuTrigger asChild>
                <Avatar>
                  <AvatarImage
                    src={user?.photoUrl || "https://github.com/shadcn.png"}
                    alt="@shadcn"
                  />
                  <AvatarFallback>CN</AvatarFallback>
                </Avatar>
              </DropdownMenuTrigger>

              <DropdownMenuContent className="w-56" align="start">
                <DropdownMenuLabel>My Account</DropdownMenuLabel>

                <DropdownMenuGroup>
                  <Link to='/userIssues'><DropdownMenuItem>My Issue</DropdownMenuItem>
                  </Link>
                  <Link to='/communityBoard'><DropdownMenuItem>All Issue</DropdownMenuItem></Link>
                </DropdownMenuGroup>

                <DropdownMenuSeparator />
                <button onClick={logoutHandler}>
                  <DropdownMenuItem>Log out</DropdownMenuItem>
                </button>
              </DropdownMenuContent>
            </DropdownMenu>
          ) : (
            <div className="flex space-x-2">
              <Link to='/login'><Button variant="outline">SignUp</Button>
              <Button>Login</Button></Link>
            </div>
          )}

          <DarkMode />
        </div>
      </div>
    </div>
  );
}
