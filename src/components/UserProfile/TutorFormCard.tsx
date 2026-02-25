"use client";

import { useEffect, useState } from "react";
import { toast } from "sonner";

import { useForm } from "@tanstack/react-form";

import { Button } from "@/components/ui/button";
import {
  Card,
  CardContent,
  CardDescription,
  CardFooter,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";

import { Input } from "@/components/ui/input";

import { User } from "lucide-react";

import {
  Field,
  FieldError,
  FieldGroup,
  FieldLabel,
} from "@/components/ui/field";
import { getCategories } from "@/actions/category.action";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { Textarea } from "@/components/ui/textarea";
import { addTutor } from "@/actions/tutor.action";
import { useRouter } from "next/navigation";
import { authClient } from "@/lib/auth-client";


type TutorInfoCardProps = {
  user: any; // adjust type if you have full user shape
  refetch: () => void;
};

export default function TutorFormCard({ user, refetch }: TutorInfoCardProps) {
    //   const { data: session, isPending, refetch } = authClient.useSession();
  const router = useRouter();

  const [categories, setCategories] = useState<any[]>([]);
  const [error, setError] = useState<{ message: string } | null>(null);

  //   console.log(categories, error);

  useEffect(() => {
    async function load() {
      const { data, error } = await getCategories();
      setCategories(data.data);
      setError(error);
    }
    load();
  }, []);

  //   console.log(categories);
  const timeSlots = ["MORNING", "AFTERNOON", "EVENING", "NIGHT"] as const;

  // TanStack Form Setup
  // ────────────────────────────────────────────────
  const form = useForm({
    defaultValues: {
      title: "",
      bio: "",
      timeSlots: "",
      rate: 0,
      poster: "",
      categoryId: "",
    },
    // validators: {
    //   onSubmit: formSchema,
    // },
    onSubmit: async ({ value }) => {
      console.log("Raw form values:", value);

      const toastId = toast.loading("Updating tutor profile...");

      try {
        const selectedCategory = categories.find(
          (cat) => cat.name === value.categoryId,
        );

        const tutorData = {
          title: value.title.trim(),
          bio: value.bio.trim(),
          poster: value.poster.trim(),
          rate: Number(value.rate) || 0,
          categoryId: selectedCategory?.id ?? null,
          timeSlots: value.timeSlots
            ? [value.timeSlots.trim().toUpperCase()]
            : [],
          userId: user?.id ?? null,
        };

        // console.log("Sending to API:", tutorData);

        const res = await addTutor(tutorData);

        if (res.error) {
          toast.error(res.error.message || "Failed to create tutor profile", {
            id: toastId,
          });
          return;
        }

        toast.success("Tutor profile created successfully!", { id: toastId });
         refetch();
         await authClient.signOut();
         router.push("/login");
        //  console.log("Fresh session after refetch:", user.role);
      } catch (err: any) {
        console.error("[submit error]", err);
        toast.error(err.message || "Something went wrong", { id: toastId });
      }
    },
  });

  return (
    <Card className="border shadow-sm">
      <CardHeader className="pb-3">
        <div className="flex items-center justify-between">
          <div className="flex items-center gap-2">
            <User className="h-5 w-5 text-teal-600" />
            <CardTitle>Tutor Information</CardTitle>
          </div>
        </div>
        <CardDescription>Update your tutor profile details</CardDescription>
      </CardHeader>

      <CardContent className="space-y-6 pt-2">
        <form
          id="tutor-form"
          onSubmit={(e) => {
            e.preventDefault();
            form.handleSubmit();
          }}
        >
          <FieldGroup>
            {/* title  */}
            <form.Field
              name="title"
              children={(field) => {
                const isInvalid =
                  field.state.meta.isTouched && !field.state.meta.isValid;
                return (
                  <Field data-invalid={isInvalid}>
                    <FieldLabel htmlFor={field.name}>Your Title</FieldLabel>

                    <Input
                      id={field.name}
                      name={field.name}
                      required
                      placeholder="Tell students about your subject title"
                      className=""
                      value={field.state.value}
                      onChange={(e) => field.handleChange(e.target.value)}
                    />

                    {isInvalid && (
                      <FieldError errors={field.state.meta.errors} />
                    )}
                  </Field>
                );
              }}
            />

            {/* bio  */}
            <form.Field
              name="bio"
              children={(field) => {
                const isInvalid =
                  field.state.meta.isTouched && !field.state.meta.isValid;
                return (
                  <Field data-invalid={isInvalid}>
                    <FieldLabel htmlFor={field.name}>Your Bio</FieldLabel>

                    <Textarea
                      id={field.name}
                      name={field.name}
                      required
                      placeholder="Tell students about your subject slogan"
                      className=""
                      value={field.state.value}
                      onChange={(e) => field.handleChange(e.target.value)}
                    />

                    {isInvalid && (
                      <FieldError errors={field.state.meta.errors} />
                    )}
                  </Field>
                );
              }}
            />

            {/* time slot */}
            <form.Field
              name="timeSlots"
              validators={{
                onChange: ({ value }) =>
                  !value ? "Please select a time slot" : undefined,
                // optional: onChangeAsync if you need async validation
              }}
              children={(field) => {
                const isInvalid =
                  field.state.meta.isTouched && !field.state.meta.isValid;

                return (
                  <Field data-invalid={isInvalid}>
                    <FieldLabel htmlFor={field.name}>Time Slot</FieldLabel>

                    <Select
                      name={field.name}
                      value={field.state.value ?? undefined} // controlled value
                      onValueChange={field.handleChange} // key: this updates form state
                    >
                      <SelectTrigger
                        id={field.name}
                        className={
                          isInvalid
                            ? "border-destructive focus:ring-destructive"
                            : ""
                        }
                      >
                        <SelectValue placeholder="Select your time slot" />
                      </SelectTrigger>

                      <SelectContent>
                        {timeSlots.map((slot) => (
                          <SelectItem key={slot} value={slot}>
                            {slot.charAt(0) + slot.slice(1).toLowerCase()}{" "}
                          </SelectItem>
                        ))}
                      </SelectContent>
                    </Select>
                  </Field>
                );
              }}
            />

            {/* rate  */}

            <form.Field
              name="rate"
              children={(field) => {
                const isInvalid =
                  field.state.meta.isTouched && !field.state.meta.isValid;
                return (
                  <Field data-invalid={isInvalid}>
                    <FieldLabel htmlFor={field.name}>Rate</FieldLabel>
                    <Input
                      id={field.name}
                      name={field.name}
                      required
                      value={field.state.value}
                      type="number"
                      placeholder="Enter your rate"
                      onChange={(e) =>
                        field.handleChange(Number(e.target.value) || 0)
                      }
                    />
                    {isInvalid && (
                      <FieldError errors={field.state.meta.errors} />
                    )}
                  </Field>
                );
              }}
            />

            {/* category  */}

            <form.Field
              name="categoryId"
              validators={{
                onChange: ({ value }) =>
                  !value ? "Please select a category" : undefined,
                // optional: onChangeAsync if you need async validation
              }}
              children={(field) => {
                const isInvalid =
                  field.state.meta.isTouched && !field.state.meta.isValid;

                return (
                  <Field data-invalid={isInvalid}>
                    <FieldLabel htmlFor={field.name}>
                      Your prefer Subject
                    </FieldLabel>

                    <Select
                      name={field.name}
                      value={field.state.value ?? undefined} // controlled value
                      onValueChange={field.handleChange} // key: this updates form state
                    >
                      <SelectTrigger
                        id={field.name}
                        className={
                          isInvalid
                            ? "border-destructive focus:ring-destructive"
                            : ""
                        }
                      >
                        <SelectValue placeholder="Select your category" />
                      </SelectTrigger>

                      <SelectContent>
                        {categories.map((cat) => (
                          <SelectItem key={cat.id} value={cat.name}>
                            {cat.name}
                          </SelectItem>
                        ))}
                      </SelectContent>
                    </Select>
                  </Field>
                );
              }}
            />

            {/* image  */}

            <form.Field
              name="poster"
              children={(field) => {
                const isInvalid =
                  field.state.meta.isTouched && !field.state.meta.isValid;
                return (
                  <Field data-invalid={isInvalid}>
                    <FieldLabel htmlFor={field.name}>Your Poster</FieldLabel>
                    <Input
                      id={field.name}
                      name={field.name}
                      value={field.state.value}
                      type="string"
                      placeholder="Your image url"
                      onChange={(e) => field.handleChange(e.target.value)}
                    />
                    {isInvalid && (
                      <FieldError errors={field.state.meta.errors} />
                    )}
                  </Field>
                );
              }}
            />
          </FieldGroup>
        </form>
      </CardContent>

      <CardFooter className="flex flex-col gap-5 justify-end">
        <Button form="tutor-form" type="submit" className="w-full">
          Submit
        </Button>
      </CardFooter>
    </Card>
  );
}
