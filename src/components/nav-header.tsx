import { signOut } from "firebase/auth";
import { Car, LogOut, User } from "lucide-react";
import { Link, useNavigate } from "react-router-dom";
import { toast } from "sonner";

import { Avatar, AvatarFallback } from "@/components/ui/avatar";
import { Button } from "@/components/ui/button";
// Shadcn Components
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuGroup,
  DropdownMenuItem,
  DropdownMenuLabel,
  DropdownMenuSeparator,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";
import { useAuth } from "@/context/AuthContext";
import { auth } from "@/lib/firebase";

import LanguageSwitcher from "./language-switcher";

export function NavHeader() {
  const { user } = useAuth();
  const navigate = useNavigate();

  const handleLogout = async () => {
    try {
      await signOut(auth);
      toast.success("Logged out successfully");
      navigate("/auth");
    } catch (error) {
      toast.error("Error logging out");
    }
  };

  return (
    <header className="border-b bg-white/95 backdrop-blur supports-[backdrop-filter]:bg-white/60 px-4">
      <div className="max-w-7xl flex h-16 items-center justify-between mx-auto">
        {/* Logo Section */}
        <Link to="/" className="flex items-center gap-2 font-bold text-xl tracking-tight">
          <Car className="h-6 w-6 text-primary" />
          <span className="font-mono uppercase">Auto Transport - IRFAN</span>
        </Link>

        {/* User Section */}
        <div className="flex items-center gap-4">
          <LanguageSwitcher />
          {user ? (
            <DropdownMenu>
              <DropdownMenuTrigger className="relative h-10 w-10 rounded-full outline-none cursor-pointer">
                <Avatar className="h-10 w-10 border">
                  <AvatarFallback className="bg-primary/10 text-primary uppercase">
                    {user.email?.charAt(0)}
                  </AvatarFallback>
                </Avatar>
              </DropdownMenuTrigger>

              <DropdownMenuContent className="w-56" align="end">
                {/* 1. Wrap the Label and first section in a Group */}
                <DropdownMenuGroup>
                  <DropdownMenuLabel className="font-normal">
                    <div className="flex flex-col space-y-1">
                      <p className="text-sm font-medium leading-none">Account</p>
                      <p className="text-xs leading-none text-muted-foreground italic">
                        {user.email}
                      </p>
                    </div>
                  </DropdownMenuLabel>
                  <DropdownMenuSeparator />
                  <DropdownMenuItem onClick={() => navigate("/my-orders")} className="cursor-pointer">
                    <User className="mr-2 h-4 w-4" />
                    <span>My Orders</span>
                  </DropdownMenuItem>
                </DropdownMenuGroup>

                <DropdownMenuSeparator />

                {/* 2. Wrap the Logout section in its own Group */}
                <DropdownMenuGroup>
                  <DropdownMenuItem
                    onClick={handleLogout}
                    variant="destructive" // Using the variant you defined in your component
                    className="cursor-pointer"
                  >
                    <LogOut className="mr-2 h-4 w-4" />
                    <span>Log out</span>
                  </DropdownMenuItem>
                </DropdownMenuGroup>
              </DropdownMenuContent>
            </DropdownMenu>
          ) : (
            <Button onClick={() => navigate("/auth")} variant="default">
              Sign In
            </Button>
          )}
        </div>
      </div>
    </header>
  );
}