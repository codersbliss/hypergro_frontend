import React from 'react';
import { useFormStore } from '../../store/formStore';
import { Plus, X, ChevronUp, ChevronDown } from 'lucide-react';
import Button from '../ui/Button';

const StepNavigator: React.FC = () => {
  const {
    form,
    selectedStepId,
    addStep,
    removeStep,
    selectStep,
    updateStep,
    reorderStep,
  } = useFormStore();

  const handleStepClick = (stepId: string) => {
    selectStep(stepId);
  };

  const handleAddStep = () => {
    addStep();
  };

  const handleRemoveStep = (stepId: string) => {
    if (form.steps.length > 1) {
      removeStep(stepId);
    }
  };

  const handleTitleChange = (stepId: string, title: string) => {
    updateStep(stepId, { title });
  };

  const handleMoveUp = (index: number) => {
    if (index > 0) {
      reorderStep(index, index - 1);
    }
  };

  const handleMoveDown = (index: number) => {
    if (index < form.steps.length - 1) {
      reorderStep(index, index + 1);
    }
  };

  return (
    <div className="bg-card border-r border-border p-4 w-64">
      <div className="flex items-center justify-between mb-4">
        <h2 className="text-lg font-semibold">Form Steps</h2>
        <Button
          size="sm"
          variant="outline"
          onClick={handleAddStep}
          leftIcon={<Plus size={16} />}
        >
          Add
        </Button>
      </div>

      <div className="space-y-2">
        {form.steps.map((step, index) => (
          <div
            key={step.id}
            className={`p-3 rounded-md border ${
              selectedStepId === step.id
                ? 'border-primary bg-primary/5'
                : 'border-border hover:border-primary/30'
            } transition-colors`}
          >
            <div className="flex items-center justify-between mb-2">
              <div className="flex items-center space-x-2">
                <span className="text-xs font-medium text-muted-foreground">
                  {index + 1}
                </span>
                <input
                  type="text"
                  className="border-none bg-transparent focus:outline-none focus:ring-1 focus:ring-primary px-1 py-0.5 rounded text-sm font-medium"
                  value={step.title}
                  onChange={(e) => handleTitleChange(step.id, e.target.value)}
                  onClick={(e) => e.stopPropagation()}
                />
              </div>
              <div className="flex items-center space-x-1">
                <button
                  type="button"
                  className="p-1 text-muted-foreground hover:text-foreground"
                  onClick={() => handleMoveUp(index)}
                  disabled={index === 0}
                >
                  <ChevronUp size={14} />
                </button>
                <button
                  type="button"
                  className="p-1 text-muted-foreground hover:text-foreground"
                  onClick={() => handleMoveDown(index)}
                  disabled={index === form.steps.length - 1}
                >
                  <ChevronDown size={14} />
                </button>
                <button
                  type="button"
                  className="p-1 text-muted-foreground hover:text-destructive"
                  onClick={(e) => {
                    e.stopPropagation();
                    handleRemoveStep(step.id);
                  }}
                  disabled={form.steps.length <= 1}
                >
                  <X size={14} />
                </button>
              </div>
            </div>

            <div 
              className="flex items-center justify-between cursor-pointer"
              onClick={() => handleStepClick(step.id)}
            >
              <div className="text-xs text-muted-foreground">
                {step.fields.length} {step.fields.length === 1 ? 'field' : 'fields'}
              </div>
              <Button 
                size="sm" 
                variant={selectedStepId === step.id ? "primary" : "ghost"}
                onClick={() => handleStepClick(step.id)}
              >
                Edit
              </Button>
            </div>
          </div>
        ))}
      </div>
    </div>
  );
};

export default StepNavigator;