import React from 'react';
import { useNavigate } from 'react-router-dom';
import { FileEdit, Eye, Trash2, Copy } from 'lucide-react';
import Button from '../ui/Button';
import { FormTemplate } from '../../types/form';

interface FormCardProps {
  form: FormTemplate;
  onDelete: (id: string) => void;
  onDuplicate: (form: FormTemplate) => void;
}

const FormCard: React.FC<FormCardProps> = ({ form, onDelete, onDuplicate }) => {
  const navigate = useNavigate();
  
  const handleEdit = () => {
    navigate(`/builder/${form.id}`);
  };
  
  const handleView = () => {
    navigate(`/view/${form.id}`);
  };
  
  const handleDelete = (e: React.MouseEvent) => {
    e.stopPropagation();
    onDelete(form.id);
  };
  
  const handleDuplicate = (e: React.MouseEvent) => {
    e.stopPropagation();
    onDuplicate(form);
  };
  
  // Format date
  const formattedDate = new Date(form.updatedAt).toLocaleDateString('en-US', {
    year: 'numeric',
    month: 'short',
    day: 'numeric',
  });
  
  return (
    <div 
      className="bg-card border border-border rounded-lg shadow-sm hover:shadow-md transition-shadow p-4 cursor-pointer"
      onClick={handleEdit}
    >
      <div className="flex items-start justify-between mb-4">
        <div>
          <h3 className="text-lg font-bold">{form.title}</h3>
          <p className="text-sm text-muted-foreground">
            {form.description || 'No description'}
          </p>
        </div>
      </div>
      
      <div className="flex items-center justify-between text-sm text-muted-foreground">
        <span>
          {form.steps.length} {form.steps.length === 1 ? 'step' : 'steps'} • {
            form.steps.reduce((acc, step) => acc + step.fields.length, 0)
          } fields
        </span>
        <span>Updated {formattedDate}</span>
      </div>
      
      <div className="flex items-center justify-between mt-4 pt-4 border-t border-border">
        <div className="flex gap-2">
          <Button 
            size="sm" 
            variant="outline"
            onClick={handleEdit}
            leftIcon={<FileEdit size={16} />}
          >
            Edit
          </Button>
          <Button
            size="sm"
            variant="outline"
            onClick={handleView}
            leftIcon={<Eye size={16} />}
          >
            View
          </Button>
        </div>
        <div className="flex gap-2">
          <Button
            size="sm"
            variant="ghost"
            onClick={handleDuplicate}
            leftIcon={<Copy size={16} />}
          >
            Duplicate
          </Button>
          <Button
            size="sm"
            variant="ghost"
            onClick={handleDelete}
            leftIcon={<Trash2 size={16} className="text-destructive" />}
          >
            Delete
          </Button>
        </div>
      </div>
    </div>
  );
};

export default FormCard;