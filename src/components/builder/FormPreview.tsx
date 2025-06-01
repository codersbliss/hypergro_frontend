import React, { useState } from 'react';
import { useFormStore } from '../../store/formStore';
import { FormField } from '../../types/form';
import { renderFormField } from '../ui/FormComponents';
import { Smartphone, Tablet, Monitor, ArrowRight, ArrowLeft } from 'lucide-react';
import Button from '../ui/Button';

const FormPreview: React.FC = () => {
  const { form, previewMode, setPreviewMode } = useFormStore();
  const [currentStepIndex, setCurrentStepIndex] = useState(0);
  const [formValues, setFormValues] = useState<Record<string, any>>({});
  const [formErrors, setFormErrors] = useState<Record<string, string>>({});
  
  const currentStep = form.steps[currentStepIndex];
  
  const handleFieldChange = (fieldId: string, value: any) => {
    setFormValues(prev => ({
      ...prev,
      [fieldId]: value,
    }));
    
    // Clear error when value changes
    if (formErrors[fieldId]) {
      setFormErrors(prev => {
        const newErrors = { ...prev };
        delete newErrors[fieldId];
        return newErrors;
      });
    }
  };
  
  const validateStep = () => {
    const errors: Record<string, string> = {};
    
    for (const field of currentStep.fields) {
      // Skip validation for heading and paragraph
      if (field.type === 'heading' || field.type === 'paragraph') continue;
      
      const value = formValues[field.id];
      
      // Check required fields
      if (field.required && (value === undefined || value === '' || value === null)) {
        errors[field.id] = 'This field is required';
        continue;
      }
      
      // Skip other validations if field is empty and not required
      if (value === undefined || value === '' || value === null) continue;
      
      // Check other validation rules
      if (field.validation) {
        for (const rule of field.validation) {
          switch (rule.type) {
            case 'required':
              if (!value) {
                errors[field.id] = rule.message;
              }
              break;
            case 'minLength':
              if (typeof value === 'string' && value.length < Number(rule.value)) {
                errors[field.id] = rule.message;
              }
              break;
            case 'maxLength':
              if (typeof value === 'string' && value.length > Number(rule.value)) {
                errors[field.id] = rule.message;
              }
              break;
            case 'pattern':
              if (
                typeof value === 'string' &&
                typeof rule.value === 'string' &&
                rule.value
              ) {
                try {
                  if (!new RegExp(rule.value).test(value)) {
                    errors[field.id] = rule.message;
                  }
                } catch (e) {
                  errors[field.id] = 'Invalid pattern';
                }
              }
              break;
            case 'min':
              if (typeof value === 'number' && value < Number(rule.value)) {
                errors[field.id] = rule.message;
              }
              break;
            case 'max':
              if (typeof value === 'number' && value > Number(rule.value)) {
                errors[field.id] = rule.message;
              }
              break;
          }
          
          // Stop checking other rules if we already have an error
          if (errors[field.id]) break;
        }
      }
    }
    
    setFormErrors(errors);
    return Object.keys(errors).length === 0;
  };
  
  const handleNext = () => {
    const isValid = validateStep();
    
    if (isValid && currentStepIndex < form.steps.length - 1) {
      setCurrentStepIndex(prev => prev + 1);
    }
  };
  
  const handlePrevious = () => {
    if (currentStepIndex > 0) {
      setCurrentStepIndex(prev => prev - 1);
    }
  };
  
  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    const isValid = validateStep();
    
    if (isValid) {
      console.log('Form submitted:', formValues);
      // In a real app, this would submit the form data to an API
    }
  };
  
  const renderPreviewModeButtons = () => (
    <div className="flex items-center justify-center mb-4 gap-2">
      <Button
        size="sm"
        variant={previewMode.type === 'desktop' ? 'primary' : 'outline'}
        onClick={() => setPreviewMode({ type: 'desktop', width: '100%' })}
      >
        <Monitor size={16} className="mr-1" />
        Desktop
      </Button>
      <Button
        size="sm"
        variant={previewMode.type === 'tablet' ? 'primary' : 'outline'}
        onClick={() => setPreviewMode({ type: 'tablet', width: '768px' })}
      >
        <Tablet size={16} className="mr-1" />
        Tablet
      </Button>
      <Button
        size="sm"
        variant={previewMode.type === 'mobile' ? 'primary' : 'outline'}
        onClick={() => setPreviewMode({ type: 'mobile', width: '375px' })}
      >
        <Smartphone size={16} className="mr-1" />
        Mobile
      </Button>
    </div>
  );
  
  const renderProgressBar = () => (
    <div className="mb-6">
      <div className="flex justify-between mb-2">
        {form.steps.map((step, index) => (
          <div 
            key={step.id}
            className={`text-xs ${
              index === currentStepIndex 
                ? 'text-primary font-semibold' 
                : index < currentStepIndex
                ? 'text-success'
                : 'text-muted-foreground'
            }`}
          >
            Step {index + 1}
          </div>
        ))}
      </div>
      <div className="w-full bg-muted h-2 rounded-full overflow-hidden">
        <div
          className="bg-primary h-full transition-all"
          style={{ width: `${((currentStepIndex + 1) / form.steps.length) * 100}%` }}
        />
      </div>
    </div>
  );
  
  return (
    <div className="p-6 h-full overflow-auto">
      <h2 className="text-xl font-bold mb-4">Form Preview</h2>
      
      {renderPreviewModeButtons()}
      
      <div 
        className="mx-auto bg-white shadow-lg rounded-lg p-6 transition-all"
        style={{ width: previewMode.width, maxWidth: '100%' }}
      >
        <h3 className="text-xl font-bold mb-2">{form.title}</h3>
        <p className="text-muted-foreground mb-6">{form.description}</p>
        
        {form.steps.length > 1 && renderProgressBar()}
        
        <form onSubmit={handleSubmit}>
          <h4 className="text-lg font-semibold mb-4">{currentStep.title}</h4>
          
          {currentStep.fields.map((field: FormField) => (
            <div key={field.id}>
              {renderFormField(
                field,
                formValues[field.id] || field.defaultValue || '',
                (value) => handleFieldChange(field.id, value),
                () => validateStep(),
                formErrors[field.id]
              )}
            </div>
          ))}
          
          <div className="flex justify-between mt-6">
            {currentStepIndex > 0 ? (
              <Button
                type="button"
                variant="outline"
                onClick={handlePrevious}
                leftIcon={<ArrowLeft size={16} />}
              >
                Previous
              </Button>
            ) : (
              <div></div>
            )}
            
            {currentStepIndex < form.steps.length - 1 ? (
              <Button
                type="button"
                onClick={handleNext}
                rightIcon={<ArrowRight size={16} />}
              >
                Next
              </Button>
            ) : (
              <Button type="submit">
                Submit
              </Button>
            )}
          </div>
        </form>
      </div>
    </div>
  );
};

export default FormPreview;