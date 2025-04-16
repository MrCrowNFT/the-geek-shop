import { cn } from "@/lib/utils";
import { Button } from "@/components/ui/button";
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { useState } from "react";
import { useSignup } from "@/hooks/use-auth";
import { Alert, AlertDescription } from "@/components/ui/alert";
import { useNavigate } from "react-router-dom"; // Add this import

export function SignupForm({
  className,
  ...props
}: React.ComponentPropsWithoutRef<"div">) {
  // Get navigate function from react-router
  const navigate = useNavigate();

  // State to manage form inputs
  const [formData, setFormData] = useState({
    username: "",
    email: "",
    password: "",
    confirmPassword: "",
  });

  // State to manage validation errors
  const [errors, setErrors] = useState({
    passwordMismatch: false,
  });

  // Setup signup mutation
  const signupMutation = useSignup();

  // Handle input changes
  const handleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const { id, value } = e.target;
    setFormData((prev) => ({
      ...prev,
      [id]: value,
    }));
  };

  // Handle form submission
  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();

    // Validate password and confirm password
    if (formData.password !== formData.confirmPassword) {
      setErrors({ ...errors, passwordMismatch: true });
      return; // Stop form submission if passwords don't match
    }

    // Reset errors
    setErrors({ passwordMismatch: false });

    // Call the signup mutation
    try {
      await signupMutation.mutateAsync({
        username: formData.username,
        email: formData.email,
        password: formData.password,
      });

      // If we reach here, the mutation was successful
      // Redirect to login page
      navigate("/login");
    } catch (error) {
      // Error is already handled by the mutation
      console.log("Signup failed:", error);
    }
  };

  return (
    <div className={cn("flex flex-col gap-6", className)} {...props}>
      <Card>
        <CardHeader>
          <CardTitle className="text-2xl">Sign Up</CardTitle>
          <CardDescription>Create a new account</CardDescription>
        </CardHeader>
        <CardContent>
          <form onSubmit={handleSubmit}>
            <div className="flex flex-col gap-6">
              {/* Error alert for API errors */}
              {signupMutation.isError && (
                <Alert variant="destructive">
                  <AlertDescription>
                    {(signupMutation.error as Error)?.message ||
                      "Signup failed. Please try again."}
                  </AlertDescription>
                </Alert>
              )}

              {/* Username Field */}
              <div className="grid gap-2">
                <Label htmlFor="username">Username</Label>
                <Input
                  id="username"
                  type="text"
                  placeholder="Enter your username"
                  value={formData.username}
                  onChange={handleChange}
                  required
                />
              </div>

              {/* Email Field */}
              <div className="grid gap-2">
                <Label htmlFor="email">Email</Label>
                <Input
                  id="email"
                  type="email"
                  placeholder="m@example.com"
                  value={formData.email}
                  onChange={handleChange}
                  required
                />
              </div>

              {/* Password Field */}
              <div className="grid gap-2">
                <Label htmlFor="password">Password</Label>
                <Input
                  id="password"
                  type="password"
                  placeholder="Enter your password"
                  value={formData.password}
                  onChange={handleChange}
                  required
                />
              </div>

              {/* Confirm Password Field */}
              <div className="grid gap-2">
                <Label htmlFor="confirmPassword">Confirm Password</Label>
                <Input
                  id="confirmPassword"
                  type="password"
                  placeholder="Confirm your password"
                  value={formData.confirmPassword}
                  onChange={handleChange}
                  required
                />
                {errors.passwordMismatch && (
                  <p className="text-sm text-red-500">
                    Passwords do not match.
                  </p>
                )}
              </div>

              {/* Submit Button */}
              <Button
                type="submit"
                className="w-full"
                disabled={signupMutation.isLoading}
              >
                {signupMutation.isLoading ? "Signing up..." : "Sign Up"}
              </Button>
            </div>
            <div className="mt-4 text-center text-sm">
              Already have an account?{" "}
              <a href="/login" className="underline underline-offset-4">
                Log in
              </a>
            </div>
          </form>
        </CardContent>
      </Card>
    </div>
  );
}
