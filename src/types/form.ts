export type FieldType = 
  | 'text'
  | 'textarea'
  | 'number'
  | 'email'
  | 'password'
  | 'dropdown'
  | 'checkbox'
  | 'radio'
  | 'date'
  | 'time'
  | 'range'
  | 'file'
  | 'heading'
  | 'paragraph';

export interface ValidationRule {
  type: 'required' | 'minLength' | 'maxLength' | 'pattern' | 'min' | 'max';
  value?: string | number;
  message: string;
}

export interface FieldOption {
  label: string;
  value: string;
}

export interface FormField {
  id: string;
  type: FieldType;
  label: string;
  placeholder?: string;
  helperText?: string;
  defaultValue?: string | string[] | boolean;
  options?: FieldOption[];
  validation?: ValidationRule[];
  className?: string;
  disabled?: boolean;
  required?: boolean;
}

export interface FormStep {
  id: string;
  title: string;
  fields: FormField[];
}

export interface FormTemplate {
  id: string;
  title: string;
  description: string;
  steps: FormStep[];
  createdAt: number;
  updatedAt: number;
}

export interface FormResponse {
  id: string;
  formId: string;
  data: Record<string, any>;
  submittedAt: number;
}

export interface FormPreviewMode {
  type: 'desktop' | 'tablet' | 'mobile';
  width: string;
}

export interface UndoRedoState {
  past: FormTemplate[];
  present: FormTemplate;
  future: FormTemplate[];
}

export interface FormBuilderState {
  form: FormTemplate;
  selectedFieldId: string | null;
  selectedStepId: string | null;
  previewMode: FormPreviewMode;
  undoRedoState: UndoRedoState;
  showPreview: boolean;
}