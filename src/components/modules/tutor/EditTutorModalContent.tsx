// app/tutor/dashboard/EditTutorModal.tsx
'use client';

import { useEffect, useState } from 'react';
import { toast } from 'sonner';
import { useForm } from '@tanstack/react-form';

import { Tutor } from '@/constants/otherinterface';

import {
  DialogContent,
  DialogHeader,
  DialogTitle,
  DialogDescription,
  DialogFooter,
} from '@/components/ui/dialog';
import { Input } from '@/components/ui/input';
import { Textarea } from '@/components/ui/textarea';
import { Label } from '@/components/ui/label';
import { Button } from '@/components/ui/button';
import { Switch } from '@/components/ui/switch';
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from '@/components/ui/select';

import {
  Field,
  FieldError,
  FieldGroup,
  FieldLabel,
} from '@/components/ui/field';
import { getCategories } from '@/actions/category.action';
import { updateTutor } from '@/actions/tutor.action';

const TIME_SLOTS = ['MORNING', 'AFTERNOON', 'EVENING', 'NIGHT'] as const;

type Props = {
  tutor: Tutor;
  close: () => void;          // ← new: close modal
  onSuccess?: () => void;     // ← new: success callback
};

export default function EditTutorModalContent({ tutor, close, onSuccess }: Props) {
  const [categories, setCategories] = useState<any[]>([]);

  useEffect(() => {
    async function load() {
      const { data, error } = await getCategories();
      setCategories(data.data);
    }
    load();
  }, []);

  const form = useForm({
    defaultValues: {
      title: tutor.title || '',
      bio: tutor.bio || '',
      rate: tutor.rate || 0,
      poster: tutor.poster || '',
      availability: tutor.availability ?? true,
      timeSlots: tutor.timeSlots?.[0] || '',
      categoryId: tutor.categories?.name || '',
    },

    onSubmit: async ({ value }) => {
      const toastId = toast.loading('Updating profile...');

      try {
        const selectedCategory = categories.find(
          (cat) => cat.name === value.categoryId,
        );

        const payload = {
          title: value.title.trim(),
          bio: value.bio.trim(),
          rate: Number(value.rate) || 0,
          poster: value.poster.trim(),
          availability: value.availability,
          timeSlots: value.timeSlots ? [value.timeSlots.trim().toUpperCase()] : [],
          categoryId: selectedCategory?.id || tutor.categoryId,
          userId: tutor.userId,
        };
        




        // console.log("Payload for updateTutor:", payload);

        const res = await updateTutor(tutor.id, payload);
        if (res?.error) toast.error(res?.error || 'Failed to update profile', { id: toastId });


        toast.success('Profile updated successfully!', { id: toastId });

        // Close dialog & trigger success
        close();
        onSuccess?.();

      } catch (err: any) {
        toast.error(err.message || 'Failed to update profile', { id: toastId });
        // modal stays open on error
      }
    },
  });

  return (
    <DialogContent className="sm:max-w-lg max-h-[90vh] overflow-y-auto">
      <DialogHeader className="pb-6">
        <DialogTitle className="text-xl">Edit Tutor Profile</DialogTitle>
        <DialogDescription className="text-sm text-muted-foreground">
          Update your tutor information
        </DialogDescription>
      </DialogHeader>

      <form
        onSubmit={(e) => {
          e.preventDefault();
          e.stopPropagation();
          form.handleSubmit();
        }}
        className="space-y-6"
      >
       <FieldGroup>
          {/* Title */}
          <form.Field
            name="title"
            validators={{
              onChange: ({ value }) =>
                !value?.trim() ? 'Title is required' : undefined,
            }}
            children={(field) => {
              const isInvalid = field.state.meta.isTouched && field.state.meta.errors?.length > 0;
              return (
                <Field data-invalid={isInvalid}>
                  <FieldLabel htmlFor={field.name}>Professional Title</FieldLabel>
                  <Input
                    id={field.name}
                    value={field.state.value}
                    onChange={(e) => field.handleChange(e.target.value)}
                    placeholder="e.g. Full-Stack Web Developer & MERN Expert"
                    disabled={form.state.isSubmitting}
                  />
                  {/* <FieldError errors={field.state.meta.errors} /> */}
                </Field>
              );
            }}
          />

          {/* Bio */}
          <form.Field
            name="bio"
            children={(field) => (
              <Field>
                <FieldLabel htmlFor={field.name}>Bio</FieldLabel>
                <Textarea
                  id={field.name}
                  value={field.state.value}
                  onChange={(e) => field.handleChange(e.target.value)}
                  placeholder="Tell students about your experience and teaching style..."
                  rows={4}
                  disabled={form.state.isSubmitting}
                />
              </Field>
            )}
          />

          {/* Rate */}
          <form.Field
            name="rate"
            validators={{
              onChange: ({ value }) =>
                value <= 0 ? 'Rate must be greater than 0' : undefined,
            }}
            children={(field) => {
              const isInvalid = field.state.meta.isTouched && field.state.meta.errors?.length > 0;
              return (
                <Field data-invalid={isInvalid}>
                  <FieldLabel htmlFor={field.name}>Hourly Rate (USD)</FieldLabel>
                  <Input
                    id={field.name}
                    type="number"
                    min={1}
                    value={field.state.value}
                    onChange={(e) => field.handleChange(Number(e.target.value) || 0)}
                    disabled={form.state.isSubmitting}
                  />
                  {/* <FieldError errors={field.state.meta.errors} /> */}
                </Field>
              );
            }}
          />

          {/* Availability */}
          <form.Field
            name="availability"
            children={(field) => (
              <div className="flex items-center justify-between py-2">
                <Label htmlFor="availability" className="cursor-pointer text-base font-medium">
                  Available for new bookings
                </Label>
                <Switch
                  id="availability"
                  checked={field.state.value}
                  onCheckedChange={field.handleChange}
                  disabled={form.state.isSubmitting}
                />
              </div>
            )}
          />

          {/* Poster */}
          <form.Field
            name="poster"
            children={(field) => (
              <Field>
                <FieldLabel htmlFor={field.name}>Profile Image URL</FieldLabel>
                <Input
                  id={field.name}
                  value={field.state.value}
                  onChange={(e) => field.handleChange(e.target.value)}
                  placeholder="https://..."
                  disabled={form.state.isSubmitting}
                />
                {field.state.value && (
                  <div className="mt-3">
                    <div className="text-xs text-muted-foreground mb-1">Preview:</div>
                    <img
                      src={field.state.value}
                      alt="Preview"
                      className="h-24 w-24 rounded-md object-cover border"
                      onError={(e) => (e.currentTarget.style.display = 'none')}
                    />
                  </div>
                )}
              </Field>
            )}
          />

          {/* Category */}
          <form.Field
            name="categoryId"
            validators={{
              onChange: ({ value }) => (!value ? 'Please select a category' : undefined),
            }}
            children={(field) => {
              const isInvalid = field.state.meta.isTouched && field.state.meta.errors?.length > 0;
              return (
                <Field data-invalid={isInvalid}>
                  <FieldLabel>Preferred Subject / Category</FieldLabel>
                  <Select
                    value={field.state.value}
                    onValueChange={field.handleChange}
                    disabled={form.state.isSubmitting}
                  >
                    <SelectTrigger className={isInvalid ? 'border-destructive' : ''}>
                      <SelectValue placeholder="Select category" />
                    </SelectTrigger>
                    <SelectContent>
                      {categories.map((cat) => (
                        <SelectItem key={cat.id} value={cat.name}>
                          {cat.name}
                        </SelectItem>
                      ))}
                    </SelectContent>
                  </Select>
                  {/* <FieldError errors={field.state.meta.errors} /> */}
                </Field>
              );
            }}
          />

          {/* Time Slots – changed to single Select (like your create form) */}
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
                <Field data-invalid={isInvalid}>
                  <FieldLabel htmlFor={field.name}>Preferred Time Slot</FieldLabel>

                  <Select
                    name={field.name}
                    value={field.state.value ?? undefined}
                    onValueChange={field.handleChange}
                    disabled={form.state.isSubmitting}
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
                      {TIME_SLOTS.map((slot) => (
                        <SelectItem key={slot} value={slot}>
                          {slot.charAt(0) + slot.slice(1).toLowerCase()}
                        </SelectItem>
                      ))}
                    </SelectContent>
                  </Select>

                  {/* Optional: show error if you uncomment FieldError component */}
                  {/* <FieldError errors={field.state.meta.errors} /> */}
                </Field>
              );
            }}
          />
        </FieldGroup>

        <DialogFooter className="pt-6 border-t mt-4">
          <Button
            type="button"
            variant="outline"
            disabled={form.state.isSubmitting}
            onClick={close}                     // ← closes dialog on Cancel
          >
            Cancel
          </Button>

          <Button
            type="submit"
            disabled={form.state.isSubmitting}
            className="bg-[#1cb89e] hover:bg-[#1cb89e]/90 text-white min-w-35"
          >
            {form.state.isSubmitting ? 'Saving...' : 'Save Changes'}
          </Button>
        </DialogFooter>
      </form>
    </DialogContent>
  );
}