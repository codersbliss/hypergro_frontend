import React from 'react';
import { FormField } from '../../types/form';

interface BaseFieldProps {
  field: FormField;
  value: any;
  onChange: (value: any) => void;
  onBlur?: () => void;
  error?: string;
}

export const TextField: React.FC<BaseFieldProps> = ({ 
  field, value, onChange, onBlur, error 
}) => {
  return (
    <div className="mb-4">
      <label className="block text-sm font-medium mb-1\" htmlFor={field.id}>
        {field.label}
        {field.required && <span className="text-destructive ml-1">*</span>}
      </label>
      <input
        id={field.id}
        type={field.type}
        className="w-full px-3 py-2 border rounded-md focus:outline-none focus:ring-2 focus:ring-primary"
        placeholder={field.placeholder}
        value={value || ''}
        onChange={(e) => onChange(e.target.value)}
        onBlur={onBlur}
        disabled={field.disabled}
        required={field.required}
      />
      {field.helperText && !error && (
        <p className="mt-1 text-sm text-muted-foreground">{field.helperText}</p>
      )}
      {error && <p className="mt-1 text-sm text-destructive">{error}</p>}
    </div>
  );
};

export const TextareaField: React.FC<BaseFieldProps> = ({ 
  field, value, onChange, onBlur, error 
}) => {
  return (
    <div className="mb-4">
      <label className="block text-sm font-medium mb-1\" htmlFor={field.id}>
        {field.label}
        {field.required && <span className="text-destructive ml-1">*</span>}
      </label>
      <textarea
        id={field.id}
        className="w-full px-3 py-2 border rounded-md focus:outline-none focus:ring-2 focus:ring-primary"
        placeholder={field.placeholder}
        value={value || ''}
        onChange={(e) => onChange(e.target.value)}
        onBlur={onBlur}
        disabled={field.disabled}
        required={field.required}
        rows={5}
      />
      {field.helperText && !error && (
        <p className="mt-1 text-sm text-muted-foreground">{field.helperText}</p>
      )}
      {error && <p className="mt-1 text-sm text-destructive">{error}</p>}
    </div>
  );
};

export const DropdownField: React.FC<BaseFieldProps> = ({ 
  field, value, onChange, onBlur, error 
}) => {
  return (
    <div className="mb-4">
      <label className="block text-sm font-medium mb-1\" htmlFor={field.id}>
        {field.label}
        {field.required && <span className="text-destructive ml-1">*</span>}
      </label>
      <select
        id={field.id}
        className="w-full px-3 py-2 border rounded-md focus:outline-none focus:ring-2 focus:ring-primary"
        value={value || ''}
        onChange={(e) => onChange(e.target.value)}
        onBlur={onBlur}
        disabled={field.disabled}
        required={field.required}
      >
        <option value="">Select an option</option>
        {field.options?.map((option) => (
          <option key={option.value} value={option.value}>
            {option.label}
          </option>
        ))}
      </select>
      {field.helperText && !error && (
        <p className="mt-1 text-sm text-muted-foreground">{field.helperText}</p>
      )}
      {error && <p className="mt-1 text-sm text-destructive">{error}</p>}
    </div>
  );
};

export const CheckboxField: React.FC<BaseFieldProps> = ({ 
  field, value, onChange, onBlur, error 
}) => {
  return (
    <div className="mb-4">
      <div className="flex items-start">
        <div className="flex items-center h-5">
          <input
            id={field.id}
            type="checkbox"
            className="w-4 h-4 border rounded focus:ring-2 focus:ring-primary"
            checked={!!value}
            onChange={(e) => onChange(e.target.checked)}
            onBlur={onBlur}
            disabled={field.disabled}
            required={field.required}
          />
        </div>
        <div className="ml-3 text-sm">
          <label className="font-medium" htmlFor={field.id}>
            {field.label}
            {field.required && <span className="text-destructive ml-1">*</span>}
          </label>
          {field.helperText && !error && (
            <p className="text-muted-foreground">{field.helperText}</p>
          )}
          {error && <p className="text-destructive">{error}</p>}
        </div>
      </div>
    </div>
  );
};

export const RadioField: React.FC<BaseFieldProps> = ({ 
  field, value, onChange, onBlur, error 
}) => {
  return (
    <div className="mb-4">
      <div className="mb-1">
        <span className="text-sm font-medium">
          {field.label}
          {field.required && <span className="text-destructive ml-1">*</span>}
        </span>
      </div>
      {field.options?.map((option) => (
        <div key={option.value} className="flex items-center mb-2">
          <input
            id={`${field.id}-${option.value}`}
            name={field.id}
            type="radio"
            className="w-4 h-4 border rounded-full focus:ring-2 focus:ring-primary"
            value={option.value}
            checked={value === option.value}
            onChange={() => onChange(option.value)}
            onBlur={onBlur}
            disabled={field.disabled}
            required={field.required}
          />
          <label
            htmlFor={`${field.id}-${option.value}`}
            className="ml-2 text-sm font-medium"
          >
            {option.label}
          </label>
        </div>
      ))}
      {field.helperText && !error && (
        <p className="mt-1 text-sm text-muted-foreground">{field.helperText}</p>
      )}
      {error && <p className="mt-1 text-sm text-destructive">{error}</p>}
    </div>
  );
};

export const DateField: React.FC<BaseFieldProps> = ({ 
  field, value, onChange, onBlur, error 
}) => {
  return (
    <div className="mb-4">
      <label className="block text-sm font-medium mb-1\" htmlFor={field.id}>
        {field.label}
        {field.required && <span className="text-destructive ml-1">*</span>}
      </label>
      <input
        id={field.id}
        type="date"
        className="w-full px-3 py-2 border rounded-md focus:outline-none focus:ring-2 focus:ring-primary"
        value={value || ''}
        onChange={(e) => onChange(e.target.value)}
        onBlur={onBlur}
        disabled={field.disabled}
        required={field.required}
      />
      {field.helperText && !error && (
        <p className="mt-1 text-sm text-muted-foreground">{field.helperText}</p>
      )}
      {error && <p className="mt-1 text-sm text-destructive">{error}</p>}
    </div>
  );
};

export const HeadingField: React.FC<{ field: FormField }> = ({ field }) => {
  return (
    <div className="mb-6">
      <h2 className="text-xl font-bold">{field.label}</h2>
      {field.helperText && (
        <p className="mt-1 text-muted-foreground">{field.helperText}</p>
      )}
    </div>
  );
};

export const ParagraphField: React.FC<{ field: FormField }> = ({ field }) => {
  return (
    <div className="mb-6">
      <p className="text-muted-foreground">{field.helperText}</p>
    </div>
  );
};

export const RangeField: React.FC<BaseFieldProps> = ({ 
  field, value, onChange, onBlur, error 
}) => {
  return (
    <div className="mb-4">
      <label className="block text-sm font-medium mb-1\" htmlFor={field.id}>
        {field.label}
        {field.required && <span className="text-destructive ml-1">*</span>}
      </label>
      <div className="flex items-center gap-2">
        <input
          id={field.id}
          type="range"
          className="w-full h-2 bg-gray-200 rounded-lg appearance-none cursor-pointer"
          value={value || 0}
          onChange={(e) => onChange(e.target.value)}
          onBlur={onBlur}
          disabled={field.disabled}
          min={field.validation?.find(v => v.type === 'min')?.value || 0}
          max={field.validation?.find(v => v.type === 'max')?.value || 100}
        />
        <span className="text-sm text-muted-foreground">{value || 0}</span>
      </div>
      {field.helperText && !error && (
        <p className="mt-1 text-sm text-muted-foreground">{field.helperText}</p>
      )}
      {error && <p className="mt-1 text-sm text-destructive">{error}</p>}
    </div>
  );
};

// Function to render the appropriate field component based on field type
export const renderFormField = (
  field: FormField,
  value: any,
  onChange: (value: any) => void,
  onBlur?: () => void,
  error?: string
) => {
  switch (field.type) {
    case 'text':
    case 'email':
    case 'password':
    case 'number':
      return (
        <TextField
          field={field}
          value={value}
          onChange={onChange}
          onBlur={onBlur}
          error={error}
        />
      );
    case 'textarea':
      return (
        <TextareaField
          field={field}
          value={value}
          onChange={onChange}
          onBlur={onBlur}
          error={error}
        />
      );
    case 'dropdown':
      return (
        <DropdownField
          field={field}
          value={value}
          onChange={onChange}
          onBlur={onBlur}
          error={error}
        />
      );
    case 'checkbox':
      return (
        <CheckboxField
          field={field}
          value={value}
          onChange={onChange}
          onBlur={onBlur}
          error={error}
        />
      );
    case 'radio':
      return (
        <RadioField
          field={field}
          value={value}
          onChange={onChange}
          onBlur={onBlur}
          error={error}
        />
      );
    case 'date':
      return (
        <DateField
          field={field}
          value={value}
          onChange={onChange}
          onBlur={onBlur}
          error={error}
        />
      );
    case 'range':
      return (
        <RangeField
          field={field}
          value={value}
          onChange={onChange}
          onBlur={onBlur}
          error={error}
        />
      );
    case 'heading':
      return <HeadingField field={field} />;
    case 'paragraph':
      return <ParagraphField field={field} />;
    default:
      return null;
  }
};