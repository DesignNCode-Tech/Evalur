import * as React from "react"
import { useFormContext, Controller, type FieldValues, type Path } from "react-hook-form"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { Button } from "@/components/ui/button"
import { Loader2 } from "lucide-react"
import { cn } from "@/lib/utils"

type FormFieldContextValue = {
  id: string
  error?: string
  name: string
}

const FormFieldContext = React.createContext<FormFieldContextValue | null>(null)

const useFormField = () => {
  const context = React.useContext(FormFieldContext)
  if (!context) {
    throw new Error("useFormField must be used within FormField")
  }
  return context
}

interface FormFieldProps<TFieldValues extends FieldValues = any> {
  name: Path<TFieldValues>
  children: React.ReactNode
}

export function FormField<TFieldValues extends FieldValues>({
  name,
  children,
}: FormFieldProps<TFieldValues>) {
  const { control } = useFormContext()
  const id = React.useId()

  return (
    <Controller
      name={name}
      control={control}
      render={({ field, fieldState }) => (
        <FormFieldContext.Provider
          value={{
            id,
            error: fieldState.error?.message,
            name,
          }}
        >
          <div className="space-y-2">
            {children}
          </div>
        </FormFieldContext.Provider>
      )}
    />
  )
}

export function FormItem({ children, className }: { children: React.ReactNode; className?: string }) {
  return <div className={cn("space-y-2", className)}>{children}</div>
}

export function FormLabel({ children, required, className }: { children: React.ReactNode; required?: boolean; className?: string }) {
  const { error, id } = useFormField()
  return (
    <Label htmlFor={id} className={cn("text-sm font-medium", error && "text-destructive", className)}>
      {children}
      {required && <span className="text-destructive ml-1">*</span>}
    </Label>
  )
}

export function FormControl({ children }: { children: React.ReactNode }) {
  const { error, id } = useFormField()
  

  return (
    <div id={id} aria-invalid={!!error}>
      {children}
    </div>
  )
}

export function FormDescription({ children, className }: { children: React.ReactNode; className?: string }) {
  return <p className={cn("text-sm text-muted-foreground", className)}>{children}</p>
}

export function FormMessage({ className }: { className?: string }) {
  const { error } = useFormField()
  if (!error) return null
  return <p className={cn("text-sm font-medium text-destructive", className)}>{error}</p>
}


interface FormInputProps extends React.InputHTMLAttributes<HTMLInputElement> {
  name: string
  label: string
  required?: boolean
  description?: string
}

export function FormInput({ name, label, required, description, type = "text", placeholder, ...props }: FormInputProps) {
  const { control } = useFormContext()
  const id = React.useId()
  
  return (
    <div className="space-y-2">
      <Label htmlFor={id} className="text-sm font-medium">
        {label}
        {required && <span className="text-destructive ml-1">*</span>}
      </Label>
      <Controller
        name={name}
        control={control}
        render={({ field, fieldState }) => (
          <>
            <Input
              id={id}
              type={type}
              placeholder={placeholder}
              aria-invalid={!!fieldState.error}
              className={cn(fieldState.error && "border-destructive")}
              {...field}
              {...props}
            />
            {description && <p className="text-sm text-muted-foreground">{description}</p>}
            {fieldState.error && (
              <p className="text-sm font-medium text-destructive">{fieldState.error.message}</p>
            )}
          </>
        )}
      />
    </div>
  )
}

interface AuthFormProps {
  children: React.ReactNode
  onSubmit: (data: any) => void
  isLoading?: boolean
  submitLabel?: string
  className?: string
}

export function AuthForm({ children, onSubmit, isLoading = false, submitLabel = "Submit", className = "space-y-4" }: AuthFormProps) {
  const { handleSubmit } = useFormContext()
  return (
    <form onSubmit={handleSubmit(onSubmit)} className={className}>
      {children}
      <Button type="submit" className="w-full" disabled={isLoading}>
        {isLoading && <Loader2 className="mr-2 h-4 w-4 animate-spin" />}
        {submitLabel}
      </Button>
    </form>
  )
}

export { useFormContext as useForm }