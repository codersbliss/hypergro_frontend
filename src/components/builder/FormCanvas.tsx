import React, { useState } from 'react';
import { DragDropContext, Droppable, Draggable, DropResult } from 'react-beautiful-dnd';
import { useFormStore } from '../../store/formStore';
// import { FormField } from '../../types/form';
import { renderFormField } from '../ui/FormComponents';
import { Trash2, GripVertical, Edit } from 'lucide-react';
import Button from '../ui/Button';

const FormCanvas: React.FC = () => {
  const { 
    form, 
    selectedStepId, 
    selectedFieldId,
    selectField,
    reorderField,
    addField,
    removeField,
  } = useFormStore();
  
  const [dragOver, setDragOver] = useState(false);
  
  const currentStep = form.steps.find(step => step.id === selectedStepId);
  
  const handleDragEnd = (result: DropResult) => {
    const { source, destination } = result;
    
    if (!destination) return;
    
    // Reordering within the canvas
    if (result.type === 'FIELD' && selectedStepId) {
      reorderField(selectedStepId, source.index, destination.index);
    }
  };
  
  const handleDragOver = (e: React.DragEvent) => {
    e.preventDefault();
    setDragOver(true);
  };
  
  const handleDragLeave = () => {
    setDragOver(false);
  };
  
  const handleDrop = (e: React.DragEvent) => {
    e.preventDefault();
    setDragOver(false);
    
    const fieldType = e.dataTransfer.getData('fieldType') as any;
    if (fieldType && selectedStepId) {
      addField({ 
        type: fieldType,
        label: `New ${fieldType.charAt(0).toUpperCase() + fieldType.slice(1)}`,
        placeholder: `Enter ${fieldType}...`,
      }, selectedStepId);
    }
  };
  
  const handleFieldClick = (fieldId: string) => {
    selectField(fieldId);
  };
  
  const handleDeleteField = (fieldId: string) => {
    removeField(fieldId);
  };
  
  if (!currentStep) {
    return (
      <div className="flex-1 p-8 flex items-center justify-center">
        <div className="text-center">
          <p className="text-muted-foreground mb-4">Please select or create a form step</p>
        </div>
      </div>
    );
  }
  
  return (
    <div className="flex-1 h-full overflow-auto">
      <DragDropContext onDragEnd={handleDragEnd}>
        <div className="p-6 h-full">
          <h2 className="text-xl font-bold mb-4">{currentStep.title}</h2>
          
          <Droppable droppableId={currentStep.id} type="FIELD">
            {(provided) => (
              <div
                className={`min-h-[calc(100%-2rem)] p-4 border-2 rounded-lg transition-colors ${
                  dragOver ? 'border-dashed border-primary bg-primary/5' : 'border-border'
                }`}
                ref={provided.innerRef}
                {...provided.droppableProps}
                onDragOver={handleDragOver}
                onDragLeave={handleDragLeave}
                onDrop={handleDrop}
              >
                {currentStep.fields.length === 0 ? (
                  <div className="h-32 flex items-center justify-center text-muted-foreground border border-dashed rounded-md">
                    <p>Drag and drop components here</p>
                  </div>
                ) : (
                  currentStep.fields.map((field, index) => (
                    <Draggable key={field.id} draggableId={field.id} index={index}>
                      {(provided, snapshot) => (
                        <div
                          ref={provided.innerRef}
                          {...provided.draggableProps}
                          className={`mb-4 border rounded-md p-4 ${
                            selectedFieldId === field.id ? 'border-primary ring-2 ring-primary/20' : 'border-border'
                          } ${snapshot.isDragging ? 'opacity-70' : ''}`}
                          onClick={() => handleFieldClick(field.id)}
                        >
                          <div className="flex items-center justify-between mb-2">
                            <div 
                              {...provided.dragHandleProps} 
                              className="p-1 rounded-md hover:bg-secondary cursor-move"
                            >
                              <GripVertical size={16} className="text-muted-foreground" />
                            </div>
                            <div className="ml-auto flex items-center gap-2">
                              <Button
                                size="icon"
                                variant="ghost"
                                onClick={(e) => {
                                  e.stopPropagation();
                                  handleFieldClick(field.id);
                                }}
                              >
                                <Edit size={16} className="text-muted-foreground" />
                              </Button>
                              <Button
                                size="icon"
                                variant="ghost"
                                onClick={(e) => {
                                  e.stopPropagation();
                                  handleDeleteField(field.id);
                                }}
                              >
                                <Trash2 size={16} className="text-destructive" />
                              </Button>
                            </div>
                          </div>
                          
                          {renderFormField(
                            field,
                            field.defaultValue || '',
                            () => {},
                            undefined,
                            undefined
                          )}
                        </div>
                      )}
                    </Draggable>
                  ))
                )}
                {provided.placeholder}
              </div>
            )}
          </Droppable>
        </div>
      </DragDropContext>
    </div>
  );
};

export default FormCanvas;