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
import { toast } from "sonner";

import * as z from "zod";
import { useRouter } from 'next/navigation';
import { motion } from "framer-motion";
import Link from "next/link";
import { UserPlus } from "lucide-react";

const formSchema = z.object({
  name: z.string().min(1, "Name is required"),
  password: z.string().min(6, "Minimum length is 6 characters"),
  email: z.string().email("Please enter a valid email"),
});

export function RegisterForm({ ...props }: React.ComponentProps<typeof Card>) {
  const router = useRouter();

  const form = useForm({
    defaultValues: {
      name: "",
      email: "",
      password: "",
    },
    validators: {
      onSubmit: formSchema,
    },
    onSubmit: async ({ value }) => {
      const toastId = toast.loading("Creating your account...");
      try {
        const { data, error } = await authClient.signUp.email(value);

        if (error) {
          toast.error(error.message, { id: toastId });
          return;
        }

        toast.success("Account created successfully!", { id: toastId });
        router.push('/');
      } catch (err) {
        toast.error("Something went wrong, please try again.", { id: toastId });
      }
    },
  });

  return (
    <motion.div
      initial={{ opacity: 0, scale: 0.95 }}
      animate={{ opacity: 1, scale: 1 }}
      transition={{ duration: 0.5 }}
    >
      <Card className="border-none bg-card/70 backdrop-blur-xl shadow-2xl overflow-hidden relative" {...props}>
        <div className="absolute top-0 left-0 w-full h-1 bg-gradient-to-r from-[#1cb89e] via-[#1cb89e]/50 to-[#1cb89e]" />
        <CardHeader className="space-y-1 pb-6">
          <div className="flex justify-center mb-2">
            <div className="p-3 rounded-full bg-accent text-accent-foreground">
              <UserPlus className="w-6 h-6" />
            </div>
          </div>
          <CardTitle className="text-3xl font-bold tracking-tight text-center bg-clip-text text-transparent bg-gradient-to-r from-[#1cb89e] to-[#1cb89e]/60">
            Join Us Today
          </CardTitle>
          <CardDescription className="text-center text-muted-foreground">
            Create an account to start your learning journey
          </CardDescription>
        </CardHeader>
        <CardContent>
          <form
            id="register-form"
            className="space-y-4"
            onSubmit={(e) => {
              e.preventDefault();
              form.handleSubmit();
            }}
          >
            <form.Field
              name="name"
              children={(field) => (
                <div className="space-y-2">
                  <FieldLabel className="text-sm font-medium" htmlFor={field.name}>Full Name</FieldLabel>
                  <Input
                    id={field.name}
                    className="bg-background/50 border-input focus:ring-ring transition-all"
                    placeholder="John Doe"
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
                  <FieldLabel className="text-sm font-medium" htmlFor={field.name}>Password</FieldLabel>
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
            form="register-form" 
            type="submit" 
            className="w-full h-11 bg-[#1cb89e] hover:bg-[#1cb89e]/90 text-white font-semibold shadow-lg shadow-[#1cb89e]/20 transition-all duration-300"
          >
            Create Account
          </Button>
          <p className="text-sm text-center text-muted-foreground">
            Already have an account?{" "}
            <Link href="/login" className="text-[#1cb89e] font-semibold hover:underline">
              Sign in
            </Link>
          </p>
        </CardFooter>
      </Card>
    </motion.div>
  );
}

