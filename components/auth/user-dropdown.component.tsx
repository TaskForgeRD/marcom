"use client";

import { UserCircle, LogOut, User as UserIcon, Shield } from "lucide-react";
import { useAuth } from "@/hooks/use-auth.hook";
import { Button } from "@/components/ui/button";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuLabel,
  DropdownMenuSeparator,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import { Badge } from "@/components/ui/badge";

interface UserDropdownProps {
  readonly showWelcome?: boolean;
  readonly className?: string;
}

export const UserDropdown = ({
  showWelcome = false,
  className,
}: UserDropdownProps) => {
  const { user, logout } = useAuth() as {
    user: {
      name: string;
      email: string;
      avatar_url?: string;
      role?: string;
    } | null;
    logout: () => void;
  };

  if (!user) return null;

  const handleLogout = () => {
    logout();
    window.location.href = "/login";
  };

  const getUserInitials = (name: string): string => {
    return name
      .split(" ")
      .map((word) => word.charAt(0))
      .join("")
      .toUpperCase()
      .slice(0, 2);
  };

  // Fungsi untuk mendapatkan warna dan label role
  const getRoleInfo = (role: string | undefined) => {
    switch (role?.toLowerCase()) {
      case "superadmin":
        return {
          label: "Super Admin",
          variant: "destructive" as const,
        };
      case "admin":
        return {
          label: "Admin",
          variant: "default" as const,
        };
      case "guest":
        return {
          label: "Guest",
          variant: "secondary" as const,
        };
      default:
        return {
          label: "User",
          variant: "outline" as const,
        };
    }
  };

  const roleInfo = getRoleInfo(user.role);

  return (
    <div className={`flex items-center gap-3 ${className}`}>
      {showWelcome && (
        <span className="text-sm font-medium text-foreground hidden sm:inline">
          Selamat datang, {user.name}
        </span>
      )}

      <DropdownMenu>
        <DropdownMenuTrigger asChild>
          <Button
            variant="ghost"
            className="p-2 rounded-full hover:bg-accent transition-colors"
          >
            <Avatar className="h-8 w-8">
              <AvatarImage src={user.avatar_url ?? undefined} alt={user.name} />
              <AvatarFallback className="text-xs font-medium">
                {getUserInitials(user.name)}
              </AvatarFallback>
            </Avatar>
          </Button>
        </DropdownMenuTrigger>

        <DropdownMenuContent align="end" className="w-56">
          <DropdownMenuLabel>
            <div className="flex flex-col space-y-2">
              <p className="text-sm font-medium leading-none">{user.name}</p>
              <p className="text-xs leading-none text-muted-foreground">
                {user.email}
              </p>
              {/* Badge Role */}
              <div className="flex items-center gap-1">
                <Shield className="h-3 w-3 text-muted-foreground" />
                <Badge variant={roleInfo.variant} className="text-xs">
                  {roleInfo.label}
                </Badge>
              </div>
            </div>
          </DropdownMenuLabel>

          <DropdownMenuSeparator />

          <DropdownMenuItem className="cursor-pointer">
            <UserIcon className="mr-2 h-4 w-4" />
            <span>Profil</span>
          </DropdownMenuItem>

          <DropdownMenuSeparator />

          <DropdownMenuItem
            onClick={handleLogout}
            className="cursor-pointer text-destructive focus:text-destructive"
          >
            <LogOut className="mr-2 h-4 w-4" />
            <span>Keluar</span>
          </DropdownMenuItem>
        </DropdownMenuContent>
      </DropdownMenu>
    </div>
  );
};
