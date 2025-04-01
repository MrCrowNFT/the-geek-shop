import React from "react";
import { Card, CardHeader, CardTitle, CardContent } from "@/components/ui/card";
import { Avatar, AvatarImage, AvatarFallback } from "@/components/ui/avatar";
import { IUserCardProps } from "@/types/user";

const UserInfoCard: React.FC<IUserCardProps> = ({ user }) => {
  return (
    <Card className="w-full max-w-xs">
      <CardHeader className="flex flex-col items-center space-y-2">
        <Avatar className="w-24 h-24">
          <AvatarImage
            src={user.profile_pic}
            alt={`${user.username}'s profile picture`}
            className="object-cover"
          />
          <AvatarFallback>
            {user.username.charAt(0).toUpperCase()}
          </AvatarFallback>
        </Avatar>
        <CardTitle className="text-center">{user.username}</CardTitle>
      </CardHeader>
      <CardContent className="space-y-2">
        <div className="flex justify-between items-center">
          <span className="font-medium">User ID:</span>
          <span className="text-sm text-muted-foreground">
            {user._id || "N/A"}
          </span>
        </div>
        <div className="flex justify-between items-center">
          <span className="font-medium">Email:</span>
          <span className="text-sm text-muted-foreground">{user.email}</span>
        </div>
        <div className="flex justify-between items-center">
          <span className="font-medium">Total Orders:</span>
          <span className="text-sm text-muted-foreground">
            {Array.isArray(user.orders) ? user.orders.length : 0}
          </span>
        </div>
      </CardContent>
    </Card>
  );
};

export default UserInfoCard;
