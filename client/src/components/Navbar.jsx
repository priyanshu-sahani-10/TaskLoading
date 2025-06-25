import { Link } from "react-router-dom";
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

export default function Navbar() {
  const user = true;

  return (
    <div className="h-16 dark:bg-[#020817] bg-white border-b dark:border-b-gray-800 border-b-gray-200 fixed top-0 left-0 right-0  z-10">
      
      <div className="max-w-7xl mx-auto hidden md:flex justify-between items-center  h-full">
        
        <div className="flex items-center gap-8">
            <h1 className=" text-blue-500 text-3xl">Taskloading</h1>
          <div className=" flex space-x-4">
            <Link to="/">
              <h3 className="hidden md:block font-bold ">Home</h3>
            </Link>
            <Link to="/login">
              <h3 className="hidden md:block font-bold ">login</h3>
            </Link>
          </div>
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
                  <DropdownMenuItem>My Issue</DropdownMenuItem>
                  <DropdownMenuItem>Resolve Issue</DropdownMenuItem>
                  <DropdownMenuItem>Pending Issue</DropdownMenuItem>
                  <DropdownMenuItem>All Issue</DropdownMenuItem>
                </DropdownMenuGroup>

                <DropdownMenuSeparator />
                <DropdownMenuItem>Log out</DropdownMenuItem>
              </DropdownMenuContent>
            </DropdownMenu>
          ) : (
            <div className="flex space-x-2">
              <Button variant="outline">SignUp</Button>
              <Button>Login</Button>
            </div>
          )}

            <DarkMode />
        
        </div>
      </div>
    </div>
  );
}
