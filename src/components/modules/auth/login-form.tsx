"use client";
import { Button } from "@/components/ui/button";
import {
  Card,
  CardContent,
  CardDescription,
  CardFooter,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import {
  Field,
  FieldDescription,
  FieldError,
  FieldGroup,
  FieldLabel,
} from "@/components/ui/field";
import { Input } from "@/components/ui/input";
import { authClient } from "@/lib/auth-client";
import { useForm } from "@tanstack/react-form";


import { useRouter } from 'next/navigation';
import { toast } from "sonner";

import * as z from "zod";
import { motion } from "framer-motion";
import Link from "next/link";
import { User, ShieldCheck, GraduationCap } from "lucide-react";

const formSchema = z.object({
  password: z.string().min(6, "Minimum length is 6 characters"),
  email: z.string().email("Please enter a valid email"),
});

export function LoginForm({ ...props }: React.ComponentProps<typeof Card>) {
  const router = useRouter();

  const demoCredentials = {
    admin: { email: "sayed123@gmail.com", password: "123456", icon: <ShieldCheck className="w-4 h-4" />, label: "Admin" },
    tutor: { email: "tutor2123@gmail.com", password: "123456", icon: <GraduationCap className="w-4 h-4" />, label: "Tutor" },
    student: { email: "john123@gmail.com", password: "12345678", icon: <User className="w-4 h-4" />, label: "Student" }
  };

  const form = useForm({
    defaultValues: {
      email: "",
      password: "",
    },
    validators: {
      onSubmit: formSchema,
    },
    onSubmit: async ({ value }) => {
      const toastId = toast.loading("Logging in user");
      try {
        const { data, error } = await authClient.signIn.email(value);

        if (error) {
          toast.error(error.message, { id: toastId });
          return;
        }

        toast.success("Welcome back!", { id: toastId });
        router.push('/');
      } catch (err) {
        toast.error("Something went wrong, please try again.", { id: toastId });
      }
    },
  });

  return (
    <motion.div
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.5 }}
    >
      <Card className="border-none bg-card/70 backdrop-blur-xl shadow-2xl overflow-hidden relative" {...props}>
        <div className="absolute top-0 left-0 w-full h-1 bg-gradient-to-r from-[#1cb89e] via-[#1cb89e]/50 to-[#1cb89e]" />
        <CardHeader className="space-y-1 pb-6">
          <CardTitle className="text-3xl font-bold tracking-tight text-center bg-clip-text text-transparent bg-gradient-to-r from-[#1cb89e] to-[#1cb89e]/60">
            Welcome Back
          </CardTitle>
          <CardDescription className="text-center text-muted-foreground">
            Enter your credentials to access your account
          </CardDescription>
        </CardHeader>
        <CardContent className="space-y-6">
          <div className="space-y-3">
            <p className="text-xs font-medium text-center text-muted-foreground uppercase tracking-wider">Quick Login (Demo)</p>
            <div className="grid grid-cols-3 gap-3">
              {(Object.keys(demoCredentials) as Array<keyof typeof demoCredentials>).map((role) => (
                <Button
                  key={role}
                  variant="outline"
                  size="sm"
                  className="flex flex-col h-auto py-3 gap-1.5 hover:bg-accent hover:text-accent-foreground transition-all border-border"
                  onClick={() => {
                    form.setFieldValue("email", demoCredentials[role].email);
                    form.setFieldValue("password", demoCredentials[role].password);
                  }}
                >
                  {demoCredentials[role].icon}
                  <span className="text-[10px] font-semibold">{demoCredentials[role].label}</span>
                </Button>
              ))}
            </div>
          </div>

          <div className="relative">
            <div className="absolute inset-0 flex items-center">
              <span className="w-full border-t" />
            </div>
            <div className="relative flex justify-center text-xs uppercase">
              <span className="bg-background px-2 text-muted-foreground">Or continue with</span>
            </div>
          </div>

          <form
            id="login-form"
            className="space-y-4"
            onSubmit={(e) => {
              e.preventDefault();
              form.handleSubmit();
            }}
          >
            <form.Field
              name="email"
              children={(field) => (
                <div className="space-y-2">
                  <FieldLabel className="text-sm font-medium" htmlFor={field.name}>Email Address</FieldLabel>
                  <Input
                    id={field.name}
                    className="bg-background/50 border-input focus:ring-ring transition-all"
                    placeholder="name@example.com"
                    value={field.state.value}
                    onChange={(e) => field.handleChange(e.target.value)}
                  />
                  {field.state.meta.isTouched && field.state.meta.errors.length > 0 && (
                    <p className="text-xs text-destructive">
                      {field.state.meta.errors[0]?.message?.toString() || field.state.meta.errors[0]?.toString()}
                    </p>
                  )}
                </div>
              )}
            />
            <form.Field
              name="password"
              children={(field) => (
                <div className="space-y-2">
                  <div className="flex items-center justify-between">
                    <FieldLabel className="text-sm font-medium" htmlFor={field.name}>Password</FieldLabel>
                    <Link href="#" className="text-xs text-primary hover:underline">Forgot password?</Link>
                  </div>
                  <Input
                    id={field.name}
                    type="password"
                    className="bg-background/50 border-input focus:ring-ring transition-all"
                    placeholder="••••••••"
                    value={field.state.value}
                    onChange={(e) => field.handleChange(e.target.value)}
                  />
                  {field.state.meta.isTouched && field.state.meta.errors.length > 0 && (
                    <p className="text-xs text-destructive">
                      {field.state.meta.errors[0]?.message?.toString() || field.state.meta.errors[0]?.toString()}
                    </p>
                  )}
                </div>
              )}
            />
          </form>
        </CardContent>
        <CardFooter className="flex flex-col gap-4">
          <Button 
            form="login-form" 
            type="submit" 
            className="w-full h-11 bg-[#1cb89e] hover:bg-[#1cb89e]/90 text-white font-semibold shadow-lg shadow-[#1cb89e]/20 transition-all duration-300"
          >
            Sign In
          </Button>
          <p className="text-sm text-center text-muted-foreground">
            Don't have an account?{" "}
            <Link href="/register" className="text-[#1cb89e] font-semibold hover:underline">
              Create one for free
            </Link>
          </p>
        </CardFooter>
      </Card>
    </motion.div>
  );
}

