import React, { useEffect } from 'react';
import { useParams } from 'react-router-dom';
import { useFormStore } from '../store/formStore';
import ComponentSidebar from '../components/builder/ComponentSidebar';
import FormCanvas from '../components/builder/FormCanvas';
import PropertiesPanel from '../components/builder/PropertiesPanel';
import FormHeader from '../components/builder/FormHeader';
import StepNavigator from '../components/builder/StepNavigator';
import FormPreview from '../components/builder/FormPreview';

const FormBuilder: React.FC = () => {
  const { formId } = useParams<{ formId: string }>();
  const { loadForm, form, showPreview, selectStep } = useFormStore();
  
  useEffect(() => {
    // If there's a formId in the URL, load that form
    if (formId) {
      loadForm(formId);
    }
    
    // Select the first step by default
    if (form.steps.length > 0) {
      selectStep(form.steps[0].id);
    }
  }, [formId]);
  
  return (
    <div className="h-screen flex flex-col bg-background">
      <FormHeader />
      
      <div className="flex-1 flex overflow-hidden">
        {!showPreview ? (
          <>
            <StepNavigator />
            <ComponentSidebar />
            <FormCanvas />
            <PropertiesPanel />
          </>
        ) : (
          <FormPreview />
        )}
      </div>
    </div>
  );
};

export default FormBuilder;