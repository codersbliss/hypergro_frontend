import React from 'react';
import { 
  AlignLeft, 
  AlignJustify, 
  List, 
  Calendar, 
  Check, 
  Type, 
  Heading1, 
  Pilcrow, 
  SlidersHorizontal, 
  Clock, 
  File
} from 'lucide-react';
import { FieldType } from '../../types/form';
import { useFormStore } from '../../store/formStore';
// import Button from '../ui/Button';

interface ComponentItem {
  type: FieldType;
  label: string;
  icon: React.ReactNode;
}

const COMPONENT_ITEMS: ComponentItem[] = [
  { type: 'text', label: 'Text Input', icon: <Type size={18} /> },
  { type: 'textarea', label: 'Text Area', icon: <AlignJustify size={18} /> },
  { type: 'dropdown', label: 'Dropdown', icon: <List size={18} /> },
  { type: 'checkbox', label: 'Checkbox', icon: <Check size={18} /> },
  { type: 'radio', label: 'Radio', icon: <AlignLeft size={18} /> },
  { type: 'date', label: 'Date', icon: <Calendar size={18} /> },
  { type: 'time', label: 'Time', icon: <Clock size={18} /> },
  { type: 'range', label: 'Range', icon: <SlidersHorizontal size={18} /> },
  { type: 'file', label: 'File Upload', icon: <File size={18} /> },
  { type: 'heading', label: 'Heading', icon: <Heading1 size={18} /> },
  { type: 'paragraph', label: 'Paragraph', icon: <Pilcrow size={18} /> },
];

const ComponentSidebar: React.FC = () => {
  const { selectedStepId, addField } = useFormStore();

  const handleDragStart = (e: React.DragEvent, type: FieldType) => {
    e.dataTransfer.setData('fieldType', type);
    e.dataTransfer.effectAllowed = 'copy';
  };

  const handleAddComponent = (type: FieldType) => {
    if (!selectedStepId) return;

    // Create default field properties based on type
    const defaultProps: Record<FieldType, any> = {
      text: {
        label: 'Text Input',
        placeholder: 'Enter text...',
        type: 'text',
        helperText: 'Please enter some text',
        validation: [{ type: 'required', message: 'This field is required' }],
      },
      textarea: {
        label: 'Text Area',
        placeholder: 'Enter text...',
        type: 'textarea',
        helperText: 'Please enter some text',
      },
      dropdown: {
        label: 'Dropdown',
        placeholder: 'Select an option',
        type: 'dropdown',
        options: [
          { label: 'Option 1', value: 'option1' },
          { label: 'Option 2', value: 'option2' },
          { label: 'Option 3', value: 'option3' },
        ],
      },
      checkbox: {
        label: 'Checkbox',
        type: 'checkbox',
        helperText: 'Check this box if you agree',
      },
      radio: {
        label: 'Radio Group',
        type: 'radio',
        options: [
          { label: 'Option 1', value: 'option1' },
          { label: 'Option 2', value: 'option2' },
          { label: 'Option 3', value: 'option3' },
        ],
      },
      date: {
        label: 'Date',
        type: 'date',
        helperText: 'Select a date',
      },
      time: {
        label: 'Time',
        type: 'time',
        helperText: 'Select a time',
      },
      range: {
        label: 'Range',
        type: 'range',
        helperText: 'Select a value',
        validation: [
          { type: 'min', value: 0, message: 'Minimum value is 0' },
          { type: 'max', value: 100, message: 'Maximum value is 100' },
        ],
      },
      file: {
        label: 'File Upload',
        type: 'file',
        helperText: 'Upload a file',
      },
      heading: {
        label: 'Section Heading',
        type: 'heading',
        helperText: '',
      },
      paragraph: {
        label: 'Information Text',
        type: 'paragraph',
        helperText: 'This is a paragraph of text that provides additional information.',
      },
      email: {
        label: 'Email',
        placeholder: 'Enter your email',
        type: 'email',
        helperText: 'Please enter a valid email address',
        validation: [
          { type: 'required', message: 'Email is required' },
          { type: 'pattern', value: '^[\\w-\\.]+@([\\w-]+\\.)+[\\w-]{2,4}$', message: 'Please enter a valid email' },
        ],
      },
      password: {
        label: 'Password',
        placeholder: 'Enter your password',
        type: 'password',
        helperText: 'Please enter your password',
        validation: [
          { type: 'required', message: 'Password is required' },
          { type: 'minLength', value: 8, message: 'Password must be at least 8 characters' },
        ],
      },
      number: {
        label: 'Number',
        placeholder: 'Enter a number',
        type: 'number',
        helperText: 'Please enter a number',
        validation: [
          { type: 'required', message: 'This field is required' },
        ],
      },
    };

    addField(defaultProps[type], selectedStepId);
  };

  return (
    <div className="bg-card border-r border-border h-full w-64 p-4 overflow-y-auto">
      <h2 className="text-lg font-semibold mb-4">Components</h2>
      <div className="space-y-2">
        {COMPONENT_ITEMS.map((item) => (
          <div
            key={item.type}
            className="flex items-center p-3 border rounded-md hover:bg-accent hover:border-primary cursor-move transition-colors"
            draggable
            onDragStart={(e) => handleDragStart(e, item.type)}
            onClick={() => handleAddComponent(item.type)}
          >
            <div className="mr-3 text-muted-foreground">{item.icon}</div>
            <span className="text-sm">{item.label}</span>
          </div>
        ))}
      </div>
      <div className="mt-6 border-t pt-4">
        <p className="text-xs text-muted-foreground mb-2">Drag components onto the canvas or click to add them directly.</p>
      </div>
    </div>
  );
};

export default ComponentSidebar;