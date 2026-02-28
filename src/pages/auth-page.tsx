import { zodResolver } from "@hookform/resolvers/zod";
import { createUserWithEmailAndPassword, signInWithEmailAndPassword } from "firebase/auth";
import { Eye, EyeOff } from "lucide-react";
import { useState } from "react";
import { Controller, useForm } from "react-hook-form";
import { useNavigate } from "react-router-dom";
import { toast } from "sonner";

// Shadcn + Base UI components (Assumed imports based on your structure)
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Field, FieldError, FieldGroup, FieldLabel } from "@/components/ui/field"; // Adjust path as needed
import { Input } from "@/components/ui/input";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { Constants } from "@/Constants";
import { errorMessages } from "@/lib/custom-errors";
import { auth } from "@/lib/firebase";
import { loginSchema, type LoginValues, signupSchema, type SignupValues } from "@/lib/validations/auth";

export default function AuthPage() {
  const navigate = useNavigate();
  
  const [isLoading, setIsLoading] = useState(false);
  const [activeTab, setActiveTab] = useState("login");

  // Inside your AuthPage component...
  const [showPassword, setShowPassword] = useState(false);

  const loginForm = useForm<LoginValues>({
    resolver: zodResolver(loginSchema),
    defaultValues: { email: "", password: "" },
  });

  const signupForm = useForm<SignupValues>({
    resolver: zodResolver(signupSchema),
    defaultValues: { email: "", password: "", confirmPassword: "" },
  });

  const handleAuth = async (type: 'login' | 'signup', data: any) => {
    setIsLoading(true);
    try {
      if (type === 'login') {
        await signInWithEmailAndPassword(auth, data.email, data.password);
        toast.success("Welcome back!");
        // Navigation is handled by AuthContext/Router
        navigate("/manage"); // Navigate to home after login
      }
    } catch (error: any) {
      const msg = errorMessages(error.message)
      toast.error(msg);
      console.error(msg);
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <div className="flex items-center justify-center min-h-screen bg-slate-50 p-4">
      <Card className="w-full max-w-md shadow-lg">
        <CardHeader>
          <CardTitle className="text-2xl text-center font-bold font-mono">{Constants.SITE_TITLE}</CardTitle>
        </CardHeader>
        <CardContent>
          <Tabs value={activeTab} onValueChange={setActiveTab} defaultValue="login">
            <TabsList className="grid w-full grid-cols-1 mb-8">
              <TabsTrigger value="login">{'Login'}</TabsTrigger>
            </TabsList>

            {/* --- LOGIN TAB --- */}
            <TabsContent value="login">
              <form onSubmit={loginForm.handleSubmit((d) => handleAuth('login', d))} className="space-y-4">
                <FieldGroup>
                  <Controller
                    name="email"
                    control={loginForm.control}
                    render={({ field, fieldState }) => (
                      <Field data-invalid={fieldState.invalid}>
                        <FieldLabel>Email</FieldLabel>
                        <Input {...field} aria-invalid={fieldState.invalid} placeholder="you@example.com" />
                        {fieldState.invalid && <FieldError errors={[fieldState.error]} />}
                      </Field>
                    )}
                  />
                  <Controller
                    name="password"
                    control={loginForm.control}
                    render={({ field, fieldState }) => (
                      <Field data-invalid={fieldState.invalid}>
                        <FieldLabel>Password</FieldLabel>
                        <div className="relative"> {/* Container for positioning */}
                          <Input
                            {...field}
                            type={showPassword ? "text" : "password"} // Toggle type
                            aria-invalid={fieldState.invalid}
                            placeholder="••••••"
                            className="pr-10" // Add padding so text doesn't overlap icon
                          />
                          <button
                            type="button"
                            onClick={() => setShowPassword(!showPassword)}
                            className="absolute right-3 top-1/2 -translate-y-1/2 text-gray-500 hover:text-gray-700"
                          >
                            {showPassword ? (
                              <EyeOff className="h-4 w-4" />
                            ) : (
                              <Eye className="h-4 w-4" />
                            )}
                          </button>
                        </div>
                        {fieldState.invalid && <FieldError errors={[fieldState.error]} />}
                      </Field>
                    )}
                  />
                </FieldGroup>
                <Button className="w-full mt-4" type="submit" disabled={isLoading}>
                  {isLoading ? "Authenticating..." : "Sign In"}
                </Button>
              </form>
            </TabsContent>

            {/* --- SIGNUP TAB --- */}
            <TabsContent value="signup">
              <form onSubmit={signupForm.handleSubmit((d) => handleAuth('signup', d))} className="space-y-4">
                <FieldGroup>
                  <Controller
                    name="email"
                    control={signupForm.control}
                    render={({ field, fieldState }) => (
                      <Field data-invalid={fieldState.invalid}>
                        <FieldLabel>Email Address</FieldLabel>
                        <Input {...field} aria-invalid={fieldState.invalid} placeholder="new-user@example.com" />
                        {fieldState.invalid && <FieldError errors={[fieldState.error]} />}
                      </Field>
                    )}
                  />
                  <Controller
                    name="password"
                    control={signupForm.control}
                    render={({ field, fieldState }) => (
                      <Field data-invalid={fieldState.invalid}>
                        <FieldLabel>Create Password</FieldLabel>
                        <Input {...field} type="password" aria-invalid={fieldState.invalid} />
                        {fieldState.invalid && <FieldError errors={[fieldState.error]} />}
                      </Field>
                    )}
                  />
                  <Controller
                    name="confirmPassword"
                    control={signupForm.control}
                    render={({ field, fieldState }) => (
                      <Field data-invalid={fieldState.invalid}>
                        <FieldLabel>Confirm Password</FieldLabel>
                        <Input {...field} type="password" aria-invalid={fieldState.invalid} />
                        {fieldState.invalid && <FieldError errors={[fieldState.error]} />}
                      </Field>
                    )}
                  />
                </FieldGroup>
                <Button className="w-full mt-4" type="submit" disabled={isLoading}>
                  {isLoading ? "Creating Account..." : "Create Account"}
                </Button>
              </form>
            </TabsContent>
          </Tabs>
        </CardContent>
      </Card>
    </div>
  );
}