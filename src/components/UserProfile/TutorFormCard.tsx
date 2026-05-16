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
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { Textarea } from "@/components/ui/textarea";
import { useCategories } from "@/hooks/useCategories";
import { useCreateTutor } from "@/hooks/useTutors";
import { useRouter } from "next/navigation";
import { authClient } from "@/lib/auth-client";
import { cn } from "@/lib/utils";


type TutorInfoCardProps = {
  user: any; // adjust type if you have full user shape
  refetch: () => void;
};

export default function TutorFormCard({ user, refetch }: TutorInfoCardProps) {
    //   const { data: session, isPending, refetch } = authClient.useSession();
  const router = useRouter();

  const { data: categoriesData = [] } = useCategories();
  const categories = categoriesData as { id: number; name: string }[];
  const createTutorMutation = useCreateTutor();

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
      // console.log("Raw form values:", value);

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

        await createTutorMutation.mutateAsync(tutorData);

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
    <Card className="border shadow-sm bg-card/50 backdrop-blur-md rounded-xl overflow-hidden">
      <CardHeader className="pb-3 border-b border-border/30 bg-muted/20">
        <div className="flex items-center justify-between">
          <div className="flex items-center gap-3">
            <div className="p-2.5 rounded-2xl bg-[#1cb89e]/10">
              <User className="h-6 w-6 text-[#1cb89e]" />
            </div>
            <div>
              <CardTitle className="text-xl font-black tracking-tight">Mentor Application Form</CardTitle>
              <CardDescription className="text-sm font-medium">Please provide detailed information to set up your mentorship profile.</CardDescription>
            </div>
          </div>
        </div>
      </CardHeader>

      <CardContent className="space-y-4 lg:px-5 px-4">
        <form
          id="tutor-form"
          onSubmit={(e) => {
            e.preventDefault();
            form.handleSubmit();
          }}
          className="space-y-8"
        >
          <FieldGroup className="space-y-4">
            <div className="grid grid-cols-1 md:grid-cols-2 gap-3">
              {/* title  */}
              <form.Field
                name="title"
                children={(field) => {
                  const isInvalid =
                    field.state.meta.isTouched && !field.state.meta.isValid;
                  return (
                    <Field data-invalid={isInvalid} className="space-y-2">
                      <FieldLabel htmlFor={field.name} className="text-xs font-black uppercase tracking-widest text-muted-foreground ml-1">Professional Title</FieldLabel>

                      <Input
                        id={field.name}
                        name={field.name}
                        required
                        placeholder="e.g. Senior Frontend Engineer"
                        className="h-12 rounded-xl border-border/50 focus-visible:ring-[#1cb89e]/20 bg-background/50 shadow-sm transition-all"
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

              {/* rate  */}
              <form.Field
                name="rate"
                children={(field) => {
                  const isInvalid =
                    field.state.meta.isTouched && !field.state.meta.isValid;
                  return (
                    <Field data-invalid={isInvalid} className="space-y-2">
                      <FieldLabel htmlFor={field.name} className="text-xs font-black uppercase tracking-widest text-muted-foreground ml-1">Hourly Rate ($)</FieldLabel>
                      <Input
                        id={field.name}
                        name={field.name}
                        required
                        value={field.state.value}
                        type="number"
                        placeholder="0.00"
                        className="h-12 rounded-xl border-border/50 focus-visible:ring-[#1cb89e]/20 bg-background/50 shadow-sm transition-all"
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
            </div>

            {/* bio  */}
            <form.Field
              name="bio"
              children={(field) => {
                const isInvalid =
                  field.state.meta.isTouched && !field.state.meta.isValid;
                return (
                  <Field data-invalid={isInvalid} className="space-y-2">
                    <FieldLabel htmlFor={field.name} className="text-xs font-black uppercase tracking-widest text-muted-foreground ml-1">Your Professional Bio</FieldLabel>

                    <Textarea
                      id={field.name}
                      name={field.name}
                      required
                      placeholder="Briefly describe your experience and what you can offer to students..."
                      className="min-h-[120px] rounded-2xl border-border/50 focus-visible:ring-[#1cb89e]/20 bg-background/50 shadow-sm transition-all p-4 text-sm"
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

            <div className="grid grid-cols-1 md:grid-cols-2 gap-3">
              {/* time slot */}
              <form.Field
                name="timeSlots"
                validators={{
                  onChange: ({ value }) =>
                    !value ? "Please select a time slot" : undefined,
                }}
                children={(field) => {
                  const isInvalid =
                    field.state.meta.isTouched && !field.state.meta.isValid;

                  return (
                    <Field data-invalid={isInvalid} className="space-y-2">
                      <FieldLabel htmlFor={field.name} className="text-xs font-black uppercase tracking-widest text-muted-foreground ml-1">Availability Window</FieldLabel>

                      <Select
                        name={field.name}
                        value={field.state.value ?? undefined}
                        onValueChange={field.handleChange}
                      >
                        <SelectTrigger
                          id={field.name}
                          className={cn(
                            "h-12 rounded-xl border-border/50 bg-background/50 shadow-sm transition-all",
                            isInvalid ? "border-destructive focus:ring-destructive" : ""
                          )}
                        >
                          <SelectValue placeholder="Select availability" />
                        </SelectTrigger>

                        <SelectContent className="rounded-xl">
                          {timeSlots.map((slot) => (
                            <SelectItem key={slot} value={slot}>
                              {slot.charAt(0) + slot.slice(1).toLowerCase()}
                            </SelectItem>
                          ))}
                        </SelectContent>
                      </Select>
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
                }}
                children={(field) => {
                  const isInvalid =
                    field.state.meta.isTouched && !field.state.meta.isValid;

                  return (
                    <Field data-invalid={isInvalid} className="space-y-2">
                      <FieldLabel htmlFor={field.name} className="text-xs font-black uppercase tracking-widest text-muted-foreground ml-1">Primary Subject</FieldLabel>

                      <Select
                        name={field.name}
                        value={field.state.value ?? undefined}
                        onValueChange={field.handleChange}
                      >
                        <SelectTrigger
                          id={field.name}
                          className={cn(
                            "h-12 rounded-xl border-border/50 bg-background/50 shadow-sm transition-all",
                            isInvalid ? "border-destructive focus:ring-destructive" : ""
                          )}
                        >
                          <SelectValue placeholder="Select subject" />
                        </SelectTrigger>

                        <SelectContent className="rounded-2xl">
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
            </div>

            {/* image  */}
            <form.Field
              name="poster"
              children={(field) => {
                const isInvalid =
                  field.state.meta.isTouched && !field.state.meta.isValid;
                return (
                  <Field data-invalid={isInvalid} className="space-y-2">
                    <FieldLabel htmlFor={field.name} className="text-xs font-black uppercase tracking-widest text-muted-foreground ml-1">Profile Banner / Poster URL</FieldLabel>
                    <Input
                      id={field.name}
                      name={field.name}
                      value={field.state.value}
                      type="string"
                      placeholder="https://example.com/your-image.jpg"
                      className="h-12 rounded-xl border-border/50 focus-visible:ring-[#1cb89e]/20 bg-background/50 shadow-sm transition-all"
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

      <CardFooter className="p-5 border-t border-border/30 bg-muted/10">
        <Button 
          form="tutor-form" 
          type="submit" 
          className="w-full h-14 bg-[#1cb89e] hover:bg-[#1cb89e]/90 text-white text-lg font-black tracking-tight rounded-xl shadow-sm shadow-[#1cb89e]/20 transition-all active:scale-[0.98]"
        >
          Apply for Tutor
        </Button>
      </CardFooter>
    </Card>
  );
}
