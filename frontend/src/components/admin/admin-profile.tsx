import React from "react";
import { Card, CardHeader, CardTitle, CardContent } from "@/components/ui/card";
import { Avatar, AvatarImage, AvatarFallback } from "@/components/ui/avatar";
import { Badge } from "@/components/ui/badge";
import { IUser, IUserCardProps } from "@/types/user";

const AdminProfile: React.FC<IUserCardProps> = ({ user }) => {
  // Helper function to format date
  const formatDate = (date: Date) => {
    return new Date(date).toLocaleDateString("en-US", {
      year: "numeric",
      month: "long",
      day: "numeric",
      hour: "2-digit",
      minute: "2-digit",
    });
  };

  // Determine badge color based on role
  const getRoleBadgeVariant = (role: IUser["role"]) => {
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
            src={user.profile_pic}
            alt={`${user.username}'s profile picture`}
          />
          <AvatarFallback>
            {user.username.charAt(0).toUpperCase()}
          </AvatarFallback>
        </Avatar>
        <div className="flex flex-col">
          <CardTitle>{user.username}</CardTitle>
          <Badge
            variant={getRoleBadgeVariant(user.role)}
            className="mt-1 capitalize"
          >
            {user.role.replace("_", " ")}
          </Badge>
        </div>
      </CardHeader>
      <CardContent>
        <div className="space-y-2">
          <div>
            <p className="text-sm text-muted-foreground">Email</p>
            <p className="font-medium">{user.email}</p>
          </div>
          <div>
            <p className="text-sm text-muted-foreground">User ID</p>
            <p className="font-medium">{user._id || "N/A"}</p>
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
    </Card>
  );
};

export default AdminProfile;
