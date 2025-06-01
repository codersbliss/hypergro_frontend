import React, { useState, useEffect } from 'react';
import { useParams, Link } from 'react-router-dom';
import { FormField, FormTemplate } from '../types/form';
import { renderFormField } from '../components/ui/FormComponents';
import Button from '../components/ui/Button';
import { ArrowLeft, ArrowRight, Check, FileText } from 'lucide-react';
import { useFormResponseStore } from '../store/formStore';
import { useTheme } from '../context/ThemeContext';

const FormView: React.FC = () => {
  const { formId } = useParams<{ formId: string }>();
  const { addResponse } = useFormResponseStore();
  const {} = useTheme();
  
  const [form, setForm] = useState<FormTemplate | null>(null);
  const [loading, setLoading] = useState(true);
  const [currentStepIndex, setCurrentStepIndex] = useState(0);
  const [formValues, setFormValues] = useState<Record<string, any>>({});
  const [formErrors, setFormErrors] = useState<Record<string, string>>({});
  const [submitted, setSubmitted] = useState(false);
  
  useEffect(() => {
    if (!formId) return;
    
    // Load the form from localStorage
    const savedForms = localStorage.getItem('forms');
    if (savedForms) {
      const forms = JSON.parse(savedForms) as FormTemplate[];
      const foundForm = forms.find(f => f.id === formId);
      
      if (foundForm) {
        setForm(foundForm);
        
        // Initialize default values
        const initialValues: Record<string, any> = {};
        foundForm.steps.forEach(step => {
          step.fields.forEach(field => {
            if (field.defaultValue !== undefined) {
              initialValues[field.id] = field.defaultValue;
            }
          });
        });
        
        setFormValues(initialValues);
      }
    }
    
    setLoading(false);
  }, [formId]);
  
  if (loading) {
    return (
      <div className="min-h-screen flex items-center justify-center bg-background">
        <div className="animate-spin rounded-full h-12 w-12 border-t-2 border-b-2 border-primary"></div>
      </div>
    );
  }
  
  if (!form) {
    return (
      <div className="min-h-screen flex items-center justify-center bg-background">
        <div className="text-center">
          <h1 className="text-2xl font-bold mb-4">Form Not Found</h1>
          <p className="text-muted-foreground mb-6">
            The form you're looking for doesn't exist or has been deleted.
          </p>
          <Link to="/">
            <Button>Return to Dashboard</Button>
          </Link>
        </div>
      </div>
    );
  }
  
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
      
      // Check validation rules
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
      window.scrollTo(0, 0);
    }
  };
  
  const handlePrevious = () => {
    if (currentStepIndex > 0) {
      setCurrentStepIndex(prev => prev - 1);
      window.scrollTo(0, 0);
    }
  };
  
  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    const isValid = validateStep();
    
    if (isValid) {
      // Save the form response
      addResponse(formId!, formValues);
      setSubmitted(true);
      window.scrollTo(0, 0);
    }
  };
  
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
  
  if (submitted) {
    return (
      <div className="min-h-screen flex items-center justify-center bg-background">
        <div className="w-full max-w-xl p-8 bg-card rounded-lg shadow-lg text-center">
          <div className="w-16 h-16 bg-success/10 text-success rounded-full flex items-center justify-center mx-auto mb-6">
            <Check size={32} />
          </div>
          <h1 className="text-2xl font-bold mb-4">Form Submitted!</h1>
          <p className="text-muted-foreground mb-8">
            Thank you for completing the form. Your response has been recorded.
          </p>
          <div className="flex flex-col sm:flex-row gap-4 justify-center">
            <Link to="/">
              <Button variant="outline">
                Return to Dashboard
              </Button>
            </Link>
            <Button onClick={() => {
              setFormValues({});
              setFormErrors({});
              setCurrentStepIndex(0);
              setSubmitted(false);
            }}>
              Submit Another Response
            </Button>
          </div>
        </div>
      </div>
    );
  }
  
  return (
    <div className="min-h-screen bg-background py-12 px-4">
      <div className="max-w-3xl mx-auto">
        <Link to="/" className="inline-flex items-center text-primary mb-6 hover:underline">
          <ArrowLeft size={16} className="mr-2" />
          Back to Dashboard
        </Link>
        
        <div className="bg-card shadow-lg rounded-lg overflow-hidden">
          <div className="p-6 border-b border-border">
            <div className="flex items-center mb-2">
              <FileText className="text-primary mr-2" size={20} />
              <h1 className="text-2xl font-bold">{form.title}</h1>
            </div>
            <p className="text-muted-foreground">{form.description}</p>
          </div>
          
          <div className="p-6">
            {form.steps.length > 1 && renderProgressBar()}
            
            <form onSubmit={handleSubmit}>
              <h2 className="text-xl font-semibold mb-6">{currentStep.title}</h2>
              
              {currentStep.fields.map((field: FormField) => (
                <div key={field.id}>
                  {renderFormField(
                    field,
                    formValues[field.id] || '',
                    (value) => handleFieldChange(field.id, value),
                    () => validateStep(),
                    formErrors[field.id]
                  )}
                </div>
              ))}
              
              <div className="flex justify-between mt-8">
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
      </div>
    </div>
  );
};

export default FormView;