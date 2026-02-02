"use client";
import { Button } from "@/components/ui/button";
import {
  Form,
  FormControl,
  FormField,
  FormItem,
  FormLabel,
  FormMessage,
} from "@/components/ui/form";
import { Input } from "@/components/ui/input";
import { zodResolver } from "@hookform/resolvers/zod";
import Link from "next/link";
import { useRouter, useSearchParams } from "next/navigation";
import { FieldValues, SubmitHandler, useForm } from "react-hook-form";
import { toast } from "sonner";

// import { loginUser } from "@/services/auth/auth";
import { loginSchema } from "./loginschema";
const LoginForm = () => {
  const seachParams = useSearchParams();
  const redirect = seachParams.get("redirectPath");
  const router = useRouter();
  const form = useForm({
    resolver: zodResolver(loginSchema),
  });
  const {
    formState: { isSubmitting },
  } = form;
  const onSubmit: SubmitHandler<FieldValues> = async (data) => {
    try {
      console.log(data);
    //   const res = await loginUser(data);
    //   console.log(res);
    //   if (res.success) {
    //     toast.success("Logged in");
    //     if (redirect) {
    //       router.push(redirect);
    //     } else {
    //       router.push("/");
    //     }
    //   } else {
    //     toast.error(res.message);
    //   }
    } catch (error) {
      const errorMessage = error instanceof Error ? error.message : "An error occurred";
      toast.error(errorMessage);
    }
  };
  const demoCredentials = {
    admin: {
      email: "admin@gmail.com",
      password: "admin123",
    },
    landlord: {
      email: "user@gmail.com",
      password: "admin123",
    },
  };

  return (
    <div className="max-w-md w-full border-2 rounded-xl m-4 p-5">
      <div className="flex items-center mb-3 gap-2">
        <div>
          <h1 className="text-lg  font-semibold">Login</h1>
          <small className="text-gray-600">
            Join us today and start your journey
          </small>
        </div>
      </div>
      <div className="flex items-center my-5 justify-around">
        <Button
          variant="default"
          size="sm"
          className="cursor-pointer"
          onClick={() => {
            form.setValue("email", demoCredentials.admin.email);
            form.setValue("password", demoCredentials.admin.password);
          }}
        >
          Demo Admin
        </Button>
        <Button
          variant="default"
          size="sm"
          className="cursor-pointer"
          onClick={() => {
            form.setValue("email", demoCredentials.landlord.email);
            form.setValue("password", demoCredentials.landlord.password);
          }}
        >
          Demo User
        </Button>
      </div>
      <Form {...form}>
        <form className="space-y-5" onSubmit={form.handleSubmit(onSubmit)}>
          <FormField
            control={form.control}
            name="email"
            render={({ field }) => (
              <FormItem>
                <FormLabel>Email</FormLabel>
                <FormControl>
                  <Input
                    placeholder="Enter your email"
                    {...field}
                    value={field.value || ""}
                  />
                </FormControl>
                <FormMessage />
              </FormItem>
            )}
          />
          <FormField
            control={form.control}
            name="password"
            render={({ field }) => (
              <FormItem>
                <FormLabel>Password</FormLabel>
                <FormControl>
                  <Input
                    type="password"
                    placeholder="Enter password"
                    {...field}
                    value={field.value || ""}
                  />
                </FormControl>
                <FormMessage />
              </FormItem>
            )}
          />

          <Button className="w-full mb-3 cursor-pointer" type="submit">
            {isSubmitting ? "Logging..." : "login"}
          </Button>
          <div className="flex items-center justify-center">
            <small className="text-gray-600">
              Don&apos;t have any account?{" "}
              <Link href={"/register"} className="text-primary">
                Register
              </Link>
            </small>
          </div>

          <div className="flex items-center justify-center ">
            <Link href={"/"}>
              <Button variant="default" className="w-full cursor-pointer">
                Back To Home
              </Button>
            </Link>
          </div>
        </form>
      </Form>
    </div>
  );
};

export default LoginForm;