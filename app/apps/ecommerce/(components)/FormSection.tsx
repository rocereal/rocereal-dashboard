"use client";

import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Textarea } from "@/components/ui/textarea";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { DollarSign, Info } from "lucide-react";

export interface FormField {
  id: string;
  label: string;
  type: "text" | "number" | "textarea" | "select";
  placeholder?: string;
  required?: boolean;
  maxLength?: number;
  step?: string;
  description?: string;
  icon?: "dollar";
  prefix?: string;
  options?: { value: string; label: string }[];
  showCharCount?: boolean;
}

interface FormSectionProps {
  title: string;
  fields: FormField[];
  data: Record<string, string>;
  onChange: (field: string, value: string) => void;
}

export function FormSection({
  title,
  fields,
  data,
  onChange,
}: FormSectionProps) {
  const renderField = (field: FormField) => {
    const value = data[field.id] || "";
    const baseInputProps = {
      id: field.id,
      value,
      onChange: (
        e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>
      ) => onChange(field.id, e.target.value),
      placeholder: field.placeholder,
      required: field.required,
      maxLength: field.maxLength,
    };

    const inputClassName = field.icon === "dollar" ? "pl-10" : "";

    switch (field.type) {
      case "textarea":
        return (
          <Textarea {...baseInputProps} rows={3} className={inputClassName} />
        );

      case "select":
        return (
          <Select
            value={value}
            onValueChange={(value) => onChange(field.id, value)}
          >
            <SelectTrigger>
              <SelectValue placeholder={field.placeholder} />
            </SelectTrigger>
            <SelectContent>
              {field.options?.map((option) => (
                <SelectItem key={option.value} value={option.value}>
                  {option.label}
                </SelectItem>
              ))}
            </SelectContent>
          </Select>
        );

      default:
        const inputElement = (
          <Input
            {...baseInputProps}
            type={field.type}
            step={field.step}
            className={inputClassName}
          />
        );

        if (field.icon === "dollar") {
          return (
            <div className="relative">
              <DollarSign className="absolute left-3 top-1/2 transform -translate-y-1/2 h-4 w-4 text-muted-foreground" />
              {inputElement}
            </div>
          );
        }

        if (field.prefix) {
          return (
            <div className="flex">
              <span className="w-32 inline-flex items-center px-3 text-sm text-muted-foreground bg-muted border border-r-0 rounded-l-md">
                {field.prefix}
              </span>
              <Input {...baseInputProps} className="!rounded-l-none" />
            </div>
          );
        }

        return inputElement;
    }
  };

  return (
    <div className="space-y-4">
      <h4 className="text-md font-semibold">{title}</h4>
      <div className="space-y-4">
        {fields.map((field) => (
          <div key={field.id} className="space-y-2">
            <Label htmlFor={field.id} className="flex items-center gap-2">
              {field.label}
              {field.required && "*"}
              {field.type === "textarea" && (
                <Info className="h-4 w-4 text-muted-foreground" />
              )}
            </Label>
            {renderField(field)}
            {field.description && (
              <p className="text-xs text-muted-foreground">
                {field.description}
              </p>
            )}
            {field.showCharCount && field.maxLength && (
              <div className="flex justify-end text-xs text-muted-foreground">
                <span>
                  {data[field.id]?.length || 0}/{field.maxLength}
                </span>
              </div>
            )}
          </div>
        ))}
      </div>
    </div>
  );
}
