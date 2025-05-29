import React from 'react';
import { FileEdit, Copy } from 'lucide-react';
import Button from '../ui/Button';
import { FormTemplate } from '../../types/form';

interface TemplateCardProps {
  template: FormTemplate;
  onUse: (template: FormTemplate) => void;
}

const TemplateCard: React.FC<TemplateCardProps> = ({ template, onUse }) => {
  return (
    <div className="bg-card border border-border rounded-lg shadow-sm p-4">
      <div className="mb-4">
        <h3 className="text-lg font-bold">{template.title}</h3>
        <p className="text-sm text-muted-foreground">
          {template.description || 'No description'}
        </p>
      </div>
      
      <div className="flex items-center justify-between text-sm text-muted-foreground mb-4">
        <span>
          {template.steps.length} {template.steps.length === 1 ? 'step' : 'steps'} • {
            template.steps.reduce((acc, step) => acc + step.fields.length, 0)
          } fields
        </span>
      </div>
      
      <Button
        onClick={() => onUse(template)}
        className="w-full"
        leftIcon={<Copy size={16} />}
      >
        Use Template
      </Button>
    </div>
  );
};

export default TemplateCard;