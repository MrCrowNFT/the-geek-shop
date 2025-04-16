import React from "react";
import {
  Card,
  CardHeader,
  CardTitle,
  CardContent,
  CardFooter,
} from "@/components/ui/card";
import { Avatar, AvatarImage, AvatarFallback } from "@/components/ui/avatar";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { LogOut } from "lucide-react";
import { useProfile } from "@/hooks/use-profile";

const AdminProfile: React.FC = () => {
  const user = useProfile();
  const logout = useProfile((state) => state.logout);

  const formatDate = (date: Date | null) => {
    if (!date) return "N/A";
    return new Date(date).toLocaleDateString("en-US", {
      year: "numeric",
      month: "long",
      day: "numeric",
      hour: "2-digit",
      minute: "2-digit",
    });
  };

  // Handle logout
  const handleLogout = async () => {
    try {
      await logout();
      //todo maybe add navigation after logout
    } catch (error) {
      console.error("Logout failed:", error);
    }
  };

  const role = "user";

  // Determine badge color based on role
  const getRoleBadgeVariant = (role: string) => {
    switch (role) {
      case "super_admin":
        return "destructive";
      case "admin":
        return "secondary";
      case "user":
        return "outline";
      default:
        return "default";
    }
  };

  return (
    <Card className="w-full max-w-md">
      <CardHeader className="flex flex-row items-center space-x-4">
        <Avatar className="w-16 h-16">
          <AvatarImage
            src={user.profile_pic || ""}
            alt={`${user.username}'s profile picture`}
          />
          <AvatarFallback>
            {user.username ? user.username.charAt(0).toUpperCase() : "U"}
          </AvatarFallback>
        </Avatar>
        <div className="flex flex-col">
          <CardTitle>{user.username || "User"}</CardTitle>
          <Badge
            variant={getRoleBadgeVariant(role)}
            className="mt-1 capitalize"
          >
            {role.replace("_", " ")}
          </Badge>
        </div>
      </CardHeader>
      <CardContent>
        <div className="space-y-2">
          <div>
            <p className="text-sm text-muted-foreground">Email</p>
            <p className="font-medium">{user.email || "N/A"}</p>
          </div>
          <div>
            <p className="text-sm text-muted-foreground">User ID</p>
            <p className="font-medium">{user._id || "N/A"}</p>
          </div>
          <div>
            <p className="text-sm text-muted-foreground">Name</p>
            <p className="font-medium">{`${user.username || ""}`}</p>
          </div>
          <div className="grid grid-cols-2 gap-2">
            <div>
              <p className="text-sm text-muted-foreground">Created At</p>
              <p className="font-medium">{formatDate(user.createdAt)}</p>
            </div>
            <div>
              <p className="text-sm text-muted-foreground">Updated At</p>
              <p className="font-medium">{formatDate(user.updatedAt)}</p>
            </div>
          </div>
        </div>
      </CardContent>
      <CardFooter>
        <Button
          variant="destructive"
          className="w-full flex items-center gap-2"
          onClick={handleLogout}
        >
          <LogOut size={16} />
          Logout
        </Button>
      </CardFooter>
    </Card>
  );
};

export default AdminProfile;
