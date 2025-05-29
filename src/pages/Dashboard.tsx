import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { Plus, FileText, FileQuestion, Moon, Sun } from 'lucide-react';
import Button from '../components/ui/Button';
import FormCard from '../components/dashboard/FormCard';
import TemplateCard from '../components/dashboard/TemplateCard';
import { FormTemplate } from '../types/form';
import { useFormStore } from '../store/formStore';
import { useTheme } from '../context/ThemeContext';

// Templates
const PREDEFINED_TEMPLATES: FormTemplate[] = [
  {
    id: 'contact-template',
    title: 'Contact Form',
    description: 'A simple contact form for your website',
    createdAt: Date.now(),
    updatedAt: Date.now(),
    steps: [
      {
        id: 'step1',
        title: 'Contact Information',
        fields: [
          {
            id: 'name',
            type: 'text',
            label: 'Name',
            placeholder: 'Enter your name',
            required: true,
            validation: [
              { type: 'required', message: 'Name is required' }
            ]
          },
          {
            id: 'email',
            type: 'email',
            label: 'Email',
            placeholder: 'Enter your email',
            required: true,
            validation: [
              { type: 'required', message: 'Email is required' },
              { type: 'pattern', value: '^[\\w-\\.]+@([\\w-]+\\.)+[\\w-]{2,4}$', message: 'Please enter a valid email' }
            ]
          },
          {
            id: 'message',
            type: 'textarea',
            label: 'Message',
            placeholder: 'Enter your message',
            required: true,
            validation: [
              { type: 'required', message: 'Message is required' }
            ]
          }
        ]
      }
    ]
  },
  {
    id: 'survey-template',
    title: 'Customer Survey',
    description: 'Collect feedback from your customers',
    createdAt: Date.now(),
    updatedAt: Date.now(),
    steps: [
      {
        id: 'step1',
        title: 'Basic Information',
        fields: [
          {
            id: 'name',
            type: 'text',
            label: 'Name',
            placeholder: 'Enter your name',
          },
          {
            id: 'email',
            type: 'email',
            label: 'Email',
            placeholder: 'Enter your email',
            validation: [
              { type: 'pattern', value: '^[\\w-\\.]+@([\\w-]+\\.)+[\\w-]{2,4}$', message: 'Please enter a valid email' }
            ]
          }
        ]
      },
      {
        id: 'step2',
        title: 'Your Experience',
        fields: [
          {
            id: 'satisfaction',
            type: 'radio',
            label: 'How satisfied are you with our service?',
            options: [
              { label: 'Very Satisfied', value: '5' },
              { label: 'Satisfied', value: '4' },
              { label: 'Neutral', value: '3' },
              { label: 'Dissatisfied', value: '2' },
              { label: 'Very Dissatisfied', value: '1' }
            ],
            required: true
          },
          {
            id: 'feedback',
            type: 'textarea',
            label: 'Additional Feedback',
            placeholder: 'Tell us more about your experience'
          }
        ]
      }
    ]
  }
];

const Dashboard: React.FC = () => {
  const navigate = useNavigate();
  const { resetForm, loadTemplate } = useFormStore();
  const { theme, toggleTheme } = useTheme();
  
  const [forms, setForms] = useState<FormTemplate[]>([]);
  
  useEffect(() => {
    // Load forms from localStorage
    const savedForms = localStorage.getItem('forms');
    if (savedForms) {
      setForms(JSON.parse(savedForms));
    }
  }, []);
  
  const handleCreateForm = () => {
    resetForm();
    navigate('/builder');
  };
  
  const handleDeleteForm = (formId: string) => {
    const updatedForms = forms.filter(form => form.id !== formId);
    setForms(updatedForms);
    localStorage.setItem('forms', JSON.stringify(updatedForms));
  };
  
  const handleDuplicateForm = (form: FormTemplate) => {
    const newForm = {
      ...form,
      id: `${form.id}-copy-${Date.now()}`,
      title: `${form.title} (Copy)`,
      createdAt: Date.now(),
      updatedAt: Date.now()
    };
    
    const updatedForms = [...forms, newForm];
    setForms(updatedForms);
    localStorage.setItem('forms', JSON.stringify(updatedForms));
  };
  
  const handleUseTemplate = (template: FormTemplate) => {
    loadTemplate(template);
    navigate('/builder');
  };
  
  return (
    <div className="min-h-screen bg-background">
      {/* Header */}
      <header className="bg-card border-b border-border p-4">
        <div className="container mx-auto flex items-center justify-between">
          <div className="flex items-center">
            <FileText className="text-primary mr-2" size={24} />
            <h1 className="text-xl font-bold">Form Builder</h1>
          </div>
          
          <div className="flex items-center gap-2">
            <Button
              variant="outline"
              size="sm"
              onClick={toggleTheme}
              leftIcon={theme === 'dark' ? <Sun size={16} /> : <Moon size={16} />}
            >
              {theme === 'dark' ? 'Light' : 'Dark'}
            </Button>
            <Button
              onClick={handleCreateForm}
              leftIcon={<Plus size={16} />}
            >
              Create Form
            </Button>
          </div>
        </div>
      </header>
      
      <main className="container mx-auto p-6">
        {/* Your Forms */}
        <section className="mb-12">
          <div className="flex items-center justify-between mb-6">
            <h2 className="text-2xl font-bold">Your Forms</h2>
          </div>
          
          {forms.length === 0 ? (
            <div className="bg-card border border-border rounded-lg p-8 text-center">
              <FileQuestion className="mx-auto text-muted-foreground mb-4" size={48} />
              <h3 className="text-lg font-semibold mb-2">No forms yet</h3>
              <p className="text-muted-foreground mb-6">
                Create your first form to get started
              </p>
              <Button 
                onClick={handleCreateForm}
                leftIcon={<Plus size={16} />}
              >
                Create Form
              </Button>
            </div>
          ) : (
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
              {forms.map(form => (
                <FormCard
                  key={form.id}
                  form={form}
                  onDelete={handleDeleteForm}
                  onDuplicate={handleDuplicateForm}
                />
              ))}
            </div>
          )}
        </section>
        
        {/* Templates */}
        <section>
          <h2 className="text-2xl font-bold mb-6">Templates</h2>
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
            {PREDEFINED_TEMPLATES.map(template => (
              <TemplateCard
                key={template.id}
                template={template}
                onUse={handleUseTemplate}
              />
            ))}
          </div>
        </section>
      </main>
    </div>
  );
};

export default Dashboard;