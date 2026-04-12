import * as React from "react";
import { Controller, FormProvider, useFormContext } from "react-hook-form";

export const Form = FormProvider;

export const FormField = ({ name, control, render }: any) => {
  return <Controller name={name} control={control} render={render} />;
};

export const FormItem = ({ children }: any) => (
  <div className="space-y-2">{children}</div>
);

export const FormLabel = ({ children }: any) => (
  <label className="text-sm font-medium">{children}</label>
);

export const FormControl = ({ children }: any) => (
  <div>{children}</div>
);

export const FormMessage = ({ children }: any) => (
  <p className="text-sm text-red-500">{children}</p>
);