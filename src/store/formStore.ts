import { create } from 'zustand';
import { nanoid } from 'nanoid';
import { persist } from 'zustand/middleware';
import {
  FormBuilderState,
  FormField,
  FormStep,
  FormTemplate,
  FormPreviewMode,
  FormResponse,
} from '../types/form';

// Create a new form with a default step
const createNewForm = (): FormTemplate => ({
  id: nanoid(),
  title: 'Untitled Form',
  description: 'Form description',
  steps: [
    {
      id: nanoid(),
      title: 'Step 1',
      fields: [],
    },
  ],
  createdAt: Date.now(),
  updatedAt: Date.now(),
});

// Initial state with undo/redo capability
const initialState: FormBuilderState = {
  form: createNewForm(),
  selectedFieldId: null,
  selectedStepId: null,
  previewMode: { type: 'desktop', width: '100%' },
  undoRedoState: {
    past: [],
    present: createNewForm(),
    future: [],
  },
  showPreview: false,
};

type FormStore = FormBuilderState & {
  updateForm: (form: Partial<FormTemplate>) => void;
  resetForm: () => void;
  loadForm: (formId: string) => void;
  saveForm: () => void;
  duplicateForm: () => void;
  addField: (field: Omit<FormField, 'id'>, stepId: string) => void;
  updateField: (fieldId: string, updates: Partial<FormField>) => void;
  removeField: (fieldId: string) => void;
  selectField: (fieldId: string | null) => void;
  reorderField: (stepId: string, sourceIndex: number, destinationIndex: number) => void;
  addStep: () => void;
  updateStep: (stepId: string, updates: Partial<FormStep>) => void;
  removeStep: (stepId: string) => void;
  selectStep: (stepId: string | null) => void;
  reorderStep: (sourceIndex: number, destinationIndex: number) => void;
  setPreviewMode: (mode: FormPreviewMode) => void;
  togglePreview: () => void;
  undo: () => void;
  redo: () => void;
  updateUndoRedoState: (newPresent: FormTemplate) => void;
  loadTemplate: (template: FormTemplate) => void;
  createTemplateFromForm: () => void;
};

export const useFormStore = create<FormStore>()(
  persist(
    (set, get) => ({
      ...initialState,

      updateUndoRedoState: (newPresent: FormTemplate) => {
        const { undoRedoState } = get();
        set({
          undoRedoState: {
            past: [...undoRedoState.past, undoRedoState.present],
            present: newPresent,
            future: [],
          },
        });
      },

      updateForm: (updates) => {
        const form = { ...get().form, ...updates, updatedAt: Date.now() };
        set({ form });
        get().updateUndoRedoState(form);
      },

      resetForm: () => {
        const newForm = createNewForm();
        set({
          form: newForm,
          selectedFieldId: null,
          selectedStepId: null,
          undoRedoState: {
            past: [],
            present: newForm,
            future: [],
          },
        });
      },

      loadForm: (formId) => {
        const savedForms = localStorage.getItem('forms');
        if (savedForms) {
          const forms = JSON.parse(savedForms) as FormTemplate[];
          const form = forms.find(f => f.id === formId);
          if (form) {
            set({
              form,
              selectedFieldId: null,
              selectedStepId: null,
              undoRedoState: {
                past: [],
                present: form,
                future: [],
              },
            });
          }
        }
      },

      saveForm: () => {
        const form = { ...get().form, updatedAt: Date.now() };
        const savedForms = localStorage.getItem('forms');
        const forms = savedForms ? JSON.parse(savedForms) as FormTemplate[] : [];
        const existingIndex = forms.findIndex(f => f.id === form.id);
        if (existingIndex >= 0) {
          forms[existingIndex] = form;
        } else {
          forms.push(form);
        }
        localStorage.setItem('forms', JSON.stringify(forms));
        set({ form });
      },

      duplicateForm: () => {
        const { form } = get();
        const newForm = {
          ...form,
          id: nanoid(),
          title: `${form.title} (Copy)`,
          createdAt: Date.now(),
          updatedAt: Date.now(),
        };
        set({
          form: newForm,
          undoRedoState: {
            past: [],
            present: newForm,
            future: [],
          },
        });
      },

      addField: (fieldData, stepId) => {
        const field: FormField = {
          id: nanoid(),
          ...fieldData,
        };
        const form = { ...get().form };
        const stepIndex = form.steps.findIndex(s => s.id === stepId);
        if (stepIndex >= 0) {
          form.steps[stepIndex].fields.push(field);
          form.updatedAt = Date.now();
          set({ form, selectedFieldId: field.id, selectedStepId: stepId });
          get().updateUndoRedoState(form);
        }
      },

      updateField: (fieldId, updates) => {
        const form = { ...get().form };
        for (const step of form.steps) {
          const fieldIndex = step.fields.findIndex(f => f.id === fieldId);
          if (fieldIndex >= 0) {
            step.fields[fieldIndex] = { ...step.fields[fieldIndex], ...updates };
            form.updatedAt = Date.now();
            set({ form });
            get().updateUndoRedoState(form);
            break;
          }
        }
      },

      removeField: (fieldId) => {
        const form = { ...get().form };
        for (const step of form.steps) {
          const fieldIndex = step.fields.findIndex(f => f.id === fieldId);
          if (fieldIndex >= 0) {
            step.fields.splice(fieldIndex, 1);
            form.updatedAt = Date.now();
            set({ form, selectedFieldId: null });
            get().updateUndoRedoState(form);
            break;
          }
        }
      },

      selectField: (fieldId) => {
        set({ selectedFieldId: fieldId });
      },

      reorderField: (stepId, sourceIndex, destinationIndex) => {
        const form = { ...get().form };
        const stepIndex = form.steps.findIndex(s => s.id === stepId);
        if (stepIndex >= 0) {
          const step = form.steps[stepIndex];
          const [removed] = step.fields.splice(sourceIndex, 1);
          step.fields.splice(destinationIndex, 0, removed);
          form.updatedAt = Date.now();
          set({ form });
          get().updateUndoRedoState(form);
        }
      },

      addStep: () => {
        const form = { ...get().form };
        const newStep: FormStep = {
          id: nanoid(),
          title: `Step ${form.steps.length + 1}`,
          fields: [],
        };
        form.steps.push(newStep);
        form.updatedAt = Date.now();
        set({ form, selectedStepId: newStep.id, selectedFieldId: null });
        get().updateUndoRedoState(form);
      },

      updateStep: (stepId, updates) => {
        const form = { ...get().form };
        const stepIndex = form.steps.findIndex(s => s.id === stepId);
        if (stepIndex >= 0) {
          form.steps[stepIndex] = { ...form.steps[stepIndex], ...updates };
          form.updatedAt = Date.now();
          set({ form });
          get().updateUndoRedoState(form);
        }
      },

      removeStep: (stepId) => {
        const form = { ...get().form };
        const stepIndex = form.steps.findIndex(s => s.id === stepId);
        if (stepIndex >= 0 && form.steps.length > 1) {
          form.steps.splice(stepIndex, 1);
          form.updatedAt = Date.now();
          set({ form, selectedStepId: form.steps[0].id, selectedFieldId: null });
          get().updateUndoRedoState(form);
        }
      },

      selectStep: (stepId) => {
        set({ selectedStepId: stepId, selectedFieldId: null });
      },

      reorderStep: (sourceIndex, destinationIndex) => {
        const form = { ...get().form };
        const [removed] = form.steps.splice(sourceIndex, 1);
        form.steps.splice(destinationIndex, 0, removed);
        form.updatedAt = Date.now();
        set({ form });
        get().updateUndoRedoState(form);
      },

      setPreviewMode: (mode) => {
        set({ previewMode: mode });
      },

      togglePreview: () => {
        set(state => ({ showPreview: !state.showPreview }));
      },

      undo: () => {
        const { undoRedoState } = get();
        if (undoRedoState.past.length === 0) return;
        const previous = undoRedoState.past[undoRedoState.past.length - 1];
        const newPast = undoRedoState.past.slice(0, -1);
        set({
          form: previous,
          undoRedoState: {
            past: newPast,
            present: previous,
            future: [undoRedoState.present, ...undoRedoState.future],
          },
        });
      },

      redo: () => {
        const { undoRedoState } = get();
        if (undoRedoState.future.length === 0) return;
        const next = undoRedoState.future[0];
        const newFuture = undoRedoState.future.slice(1);
        set({
          form: next,
          undoRedoState: {
            past: [...undoRedoState.past, undoRedoState.present],
            present: next,
            future: newFuture,
          },
        });
      },

      loadTemplate: (template) => {
        const newForm = {
          ...template,
          id: nanoid(),
          createdAt: Date.now(),
          updatedAt: Date.now(),
        };
        set({
          form: newForm,
          selectedFieldId: null,
          selectedStepId: null,
          undoRedoState: {
            past: [],
            present: newForm,
            future: [],
          },
        });
      },

      createTemplateFromForm: () => {
        const form = get().form;
        const savedTemplates = localStorage.getItem('templates');
        const templates = savedTemplates ? JSON.parse(savedTemplates) as FormTemplate[] : [];
        templates.push(form);
        localStorage.setItem('templates', JSON.stringify(templates));
      },
    }),
    {
      name: 'form-builder-storage',
      partialize: (state) => ({ form: state.form }),
    }
  )
);

type FormResponseStore = {
  responses: Record<string, FormResponse[]>;
  addResponse: (formId: string, data: Record<string, any>) => void;
  getResponsesByFormId: (formId: string) => FormResponse[];
};

export const useFormResponseStore = create<FormResponseStore>()(
  persist(
    (set, get) => ({
      responses: {},
      addResponse: (formId, data) => {
        const response: FormResponse = {
          id: nanoid(),
          formId,
          data,
          submittedAt: Date.now(),
        };
        const current = get().responses[formId] || [];
        set({
          responses: {
            ...get().responses,
            [formId]: [...current, response],
          },
        });
      },
      getResponsesByFormId: (formId) => {
        return get().responses[formId] || [];
      },
    }),
    {
      name: 'form-responses-storage',
    }
  )
);
