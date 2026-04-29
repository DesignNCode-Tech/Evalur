import * as React from "react"
import {
  Form as FormProvider,
  FormField,
  FormItem,
  FormLabel,
  FormControl,
  FormMessage,
  FormDescription,
} from "@/components/ui/form"
import { Input } from "@/components/ui/input"
import { Button } from "@/components/ui/button"
import { Loader2 } from "lucide-react"
import type { UseFormReturn, FieldValues, Path } from "react-hook-form"


interface FormWrapperProps<T extends FieldValues> {
  form: UseFormReturn<T>
  onSubmit: (data: T) => void
  children: React.ReactNode
  isLoading?: boolean
  submitLabel?: string
}

export function FormWrapper<T extends FieldValues>({
  form,
  onSubmit,
  children,
  isLoading,
  submitLabel = "Submit",
}: FormWrapperProps<T>) {
  return (
    <FormProvider {...form}>
      <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-4">
        {children}
        <Button type="submit" className="w-full" disabled={isLoading}>
          {isLoading && <Loader2 className="mr-2 h-4 w-4 animate-spin" />}
          {submitLabel}
        </Button>
      </form>
    </FormProvider>
  )
}


interface FormFieldWrapperProps<T extends FieldValues> {
  form: UseFormReturn<T>
  name: Path<T>
  label: string
  placeholder?: string
  description?: string
  type?: string
}

export function FormFieldWrapper<T extends FieldValues>({
  form,
  name,
  label,
  placeholder,
  description,
  type = "text",
}: FormFieldWrapperProps<T>) {
  const error = form.formState.errors[name]
  
  return (
    <FormField
      control={form.control}
      name={name}
      render={({ field }) => (
        <FormItem>
          <FormLabel>{label}</FormLabel>
          <FormControl>
            <Input 
              type={type} 
              placeholder={placeholder} 
              {...field}
              aria-invalid={!!error}
            />
          </FormControl>
          {description && <FormDescription>{description}</FormDescription>}
          <FormMessage />
        </FormItem>
      )}
    />
  )
}