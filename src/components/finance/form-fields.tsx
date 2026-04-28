// src/components/finance/form-fields.tsx

import { FormControl, FormField, FormItem, FormLabel, FormMessage } from "@/components/ui/form";
import { Input } from "@/components/ui/input";
import { Control } from "react-hook-form";

interface NumberFieldProps {
  control: Control<any>;
  name: string;
  label: string;
  placeholder?: string;
}

export function FormFieldNumber({ control, name, label, placeholder }: NumberFieldProps) {
  return (
    <FormField
      control={control}
      name={name}
      render={({ field: { value, ...fieldProps } }) => (
        <FormItem className="w-full">
          <FormLabel>{label}</FormLabel>
          <FormControl>
            <Input 
              type="number" 
              {...fieldProps} 
              value={(value as number) ?? ""} 
              placeholder={placeholder}
              className="w-full"
            />
          </FormControl>
          <FormMessage />
        </FormItem>
      )}
    />
  );
}