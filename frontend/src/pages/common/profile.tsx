import React, { useState, useRef } from "react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import {
  Card,
  CardContent,
  CardHeader,
  CardTitle,
  CardFooter,
} from "@/components/ui/card";
import {
  AlertDialog,
  AlertDialogAction,
  AlertDialogCancel,
  AlertDialogContent,
  AlertDialogDescription,
  AlertDialogFooter,
  AlertDialogHeader,
  AlertDialogTitle,
  AlertDialogTrigger,
} from "@/components/ui/alert-dialog";
import { useProfile } from "@/hooks/use-profile";
import { IUpdateProfilePayload } from "@/types/user";

const ProfilePage: React.FC = () => {
  const {
    username,
    email,
    profile_pic,
    isLoading,
    error,
    updateProfile,
    deleteProfile,
  } = useProfile();

  // Local state for form data
  const [formData, setFormData] = useState<IUpdateProfilePayload>({
    username: username || "",
    email: email || "",
    profile_pic: profile_pic || "",
  });

  // State to control when edit mode is active
  const [isEditing, setIsEditing] = useState(false);

  // State for file upload preview
  const [imagePreview, setImagePreview] = useState<string | null>(null);

  // Ref for file input
  const fileInputRef = useRef<HTMLInputElement>(null);

  // Update local state when profile data changes
  React.useEffect(() => {
    setFormData({
      username: username || "",
      email: email || "",
      profile_pic: profile_pic || "",
    });
  }, [username, email, profile_pic]);

  // Handle form input changes
  const handleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const { name, value } = e.target;
    setFormData((prev) => ({ ...prev, [name]: value }));
  };

  // Handle profile image change
  const handleImageChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (file) {
      // In a real app, you would upload this file to a server
      // and get back a URL. For now, we'll just use a local preview
      const reader = new FileReader();
      reader.onloadend = () => {
        setImagePreview(reader.result as string);
        // In a real implementation, you would update formData.profile_pic
        // with the URL returned from your image upload service
        setFormData((prev) => ({
          ...prev,
          profile_pic: reader.result as string,
        }));
      };
      reader.readAsDataURL(file);
    }
  };

  // Trigger file input click
  const handleImageClick = () => {
    fileInputRef.current?.click();
  };

  // Submit form to update profile
  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();

    if (isEditing) {
      // Only update if there are changes
      const hasChanges =
        formData.username !== username ||
        formData.email !== email ||
        (imagePreview !== null && formData.profile_pic !== profile_pic);

      if (hasChanges) {
        const success = await updateProfile({
          username: formData.username,
          email: formData.email,
          profile_pic: formData.profile_pic,
        });

        if (success) {
          setImagePreview(null);
          setIsEditing(false);
        }
      } else {
        // No changes, just exit edit mode
        setIsEditing(false);
      }
    } else {
      // Enter edit mode
      setIsEditing(true);
    }
  };

  // Cancel editing
  const handleCancel = () => {
    setFormData({
      username: username || "",
      email: email || "",
      profile_pic: profile_pic || "",
    });
    setImagePreview(null);
    setIsEditing(false);
  };

  // Handle account deletion
  const handleDeleteAccount = async () => {
    const success = await deleteProfile();
    if (success) {
      // Redirect to login page or show success message
      // This would typically be handled by your router
      window.location.href = "/login";
    }
  };

  return (
    <div className="container mx-auto py-8">
      <Card className="max-w-md mx-auto">
        <CardHeader>
          <CardTitle className="text-2xl font-bold">
            Profile Information
          </CardTitle>
        </CardHeader>

        <CardContent>
          {error && (
            <div className="mb-4 p-3 bg-red-100 text-red-800 rounded">
              {error}
            </div>
          )}

          <form onSubmit={handleSubmit}>
            <div className="mb-6 flex justify-center">
              <div className="relative">
                <div
                  className="w-24 h-24 rounded-full overflow-hidden border-2 border-gray-300 cursor-pointer"
                  onClick={isEditing ? handleImageClick : undefined}
                >
                  <img
                    src={
                      imagePreview ||
                      formData.profile_pic ||
                      "/default-avatar.png"
                    }
                    alt={formData.username}
                    className="w-full h-full object-cover"
                  />

                  {isEditing && (
                    <div className="absolute inset-0 bg-black bg-opacity-40 flex items-center justify-center text-white opacity-0 hover:opacity-100 transition-opacity">
                      Change Photo
                    </div>
                  )}
                </div>

                {isEditing && (
                  <input
                    type="file"
                    ref={fileInputRef}
                    className="hidden"
                    accept="image/*"
                    onChange={handleImageChange}
                  />
                )}
              </div>
            </div>

            <div className="mb-4">
              <label className="block text-sm font-medium mb-1">Username</label>
              <Input
                type="text"
                name="username"
                value={formData.username}
                onChange={handleChange}
                disabled={!isEditing || isLoading}
                className="w-full"
              />
            </div>

            <div className="mb-4">
              <label className="block text-sm font-medium mb-1">
                Email Address
              </label>
              <Input
                type="email"
                name="email"
                value={formData.email}
                onChange={handleChange}
                disabled={!isEditing || isLoading}
                className="w-full"
              />
            </div>

            <div className="flex justify-between mt-6">
              {isEditing ? (
                <>
                  <Button
                    type="button"
                    variant="outline"
                    onClick={handleCancel}
                    disabled={isLoading}
                  >
                    Cancel
                  </Button>
                  <Button type="submit" disabled={isLoading}>
                    {isLoading ? "Saving..." : "Save Changes"}
                  </Button>
                </>
              ) : (
                <Button type="submit" className="w-full">
                  Edit Profile
                </Button>
              )}
            </div>
          </form>
        </CardContent>

        <CardFooter className="flex justify-center">
          <AlertDialog>
            <AlertDialogTrigger asChild>
              <Button variant="destructive">Delete Account</Button>
            </AlertDialogTrigger>
            <AlertDialogContent>
              <AlertDialogHeader>
                <AlertDialogTitle>Are you absolutely sure?</AlertDialogTitle>
                <AlertDialogDescription>
                  This action cannot be undone. This will permanently delete
                  your account and remove your data from our servers.
                </AlertDialogDescription>
              </AlertDialogHeader>
              <AlertDialogFooter>
                <AlertDialogCancel>Cancel</AlertDialogCancel>
                <AlertDialogAction onClick={handleDeleteAccount}>
                  {isLoading ? "Deleting..." : "Delete Account"}
                </AlertDialogAction>
              </AlertDialogFooter>
            </AlertDialogContent>
          </AlertDialog>
        </CardFooter>
      </Card>
    </div>
  );
};

export default ProfilePage;
