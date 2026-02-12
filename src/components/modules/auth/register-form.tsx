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

const formSchema = z.object({
  name: z.string().min(1, "This field is required"),
  password: z.string().min(6, "Minimum length is 6 characters"),
  email: z.email(),
});

export function RegisterForm({ ...props }: React.ComponentProps<typeof Card>) {



    const handleGoogleLogin = async() => {
    const data = await authClient.signIn.social({
      provider: "google",
      callbackURL: process.env.FRONTEND_URL || "http://localhost:3000"
    })
  }





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
      const toastId = toast.loading("Creating user");
      try {
        const { data, error } = await authClient.signUp.email(value);

        if (error) {
          toast.error(error.message, { id: toastId });
          return;
        }

        toast.success("User Created Successfully", { id: toastId });
      } catch (err) {
        toast.error("Something went wrong, please try again.", { id: toastId });
      }
    },
  });

  return (
    <Card {...props}>
      <CardHeader className="text-center">
        <CardTitle>Create an account</CardTitle>
        <CardDescription>
          Enter your information below to create your account
        </CardDescription>
      </CardHeader>
      <CardContent>
        <form
          id="login-form"
          onSubmit={(e) => {
            e.preventDefault();
            form.handleSubmit();
          }}
        >
          <FieldGroup>
            <form.Field
              name="name"
              children={(field) => {
                const isInvalid =
                  field.state.meta.isTouched && !field.state.meta.isValid;
                return  (
                  <Field data-invalid={isInvalid}>
                    <FieldLabel htmlFor={field.name}>Your Name</FieldLabel>
                    <Input
                    id={field.name}
                    name={field.name}
                    value={field.state.value}
                    type="text"
                    placeholder="Enter Your Name"
                    onChange={(e)=> field.handleChange(e.target.value)}
                    />
                     {isInvalid && (
                      <FieldError errors={field.state.meta.errors} />
                    )}
                  </Field>
                )
                
              }}
            />
            <form.Field
              name="email"
              children={(field) => {
                const isInvalid =
                  field.state.meta.isTouched && !field.state.meta.isValid;
                return  (
                  <Field data-invalid={isInvalid}>
                    <FieldLabel htmlFor={field.name}>Your Email</FieldLabel>
                    <Input
                    id={field.name}
                    name={field.name}
                    value={field.state.value}
                    type="email"
                    placeholder="Enter Your Email"
                    onChange={(e)=> field.handleChange(e.target.value)}
                    />
                     {isInvalid && (
                      <FieldError errors={field.state.meta.errors} />
                    )}
                  </Field>
                )
                
              }}
            />
            <form.Field
              name="password"
              children={(field) => {
                const isInvalid =
                  field.state.meta.isTouched && !field.state.meta.isValid;
                return  (
                  <Field data-invalid={isInvalid}>
                    <FieldLabel htmlFor={field.name}>PassWord</FieldLabel>
                    <Input
                    id={field.name}
                    name={field.name}
                    value={field.state.value}
                    type="password"
                    placeholder="password"
                    onChange={(e)=> field.handleChange(e.target.value)}
                    />
                     {isInvalid && (
                      <FieldError errors={field.state.meta.errors} />
                    )}
                  </Field>
                )
                
              }}
            />
          </FieldGroup>
        </form>
      </CardContent>
     <CardFooter className="flex flex-col gap-5 justify-end">
        <Button form="login-form" type="submit" className="w-full">
          Register
        </Button>
        <Button
          onClick={() => handleGoogleLogin()}
          variant="outline"
          type="button"
          className="w-full"
        >
          Continue with Google
        </Button>
      </CardFooter>
    </Card>
  );
}
