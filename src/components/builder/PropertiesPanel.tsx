import React, { useState, useEffect } from 'react';
import { useFormStore } from '../../store/formStore';
import { ValidationRule, FieldOption } from '../../types/form';
import Button from '../ui/Button';
import { PlusCircle, Trash2, X } from 'lucide-react';

const PropertiesPanel: React.FC = () => {
  const { form, selectedFieldId, updateField } = useFormStore();
  const [localField, setLocalField] = useState<Record<string, any> | null>(null);

  // Find the selected field
  const selectedField = React.useMemo(() => {
    if (!selectedFieldId) return null;

    for (const step of form.steps) {
      const field = step.fields.find(f => f.id === selectedFieldId);
      if (field) return field;
    }
    return null;
  }, [form, selectedFieldId]);

  // Update local state when selected field changes
  useEffect(() => {
    setLocalField(selectedField ? { ...selectedField } : null);
  }, [selectedField]);

  const handleInputChange = (key: string, value: any) => {
    if (!localField) return;

    setLocalField(prev => ({
      ...prev,
      [key]: value,
    }));
  };

  const handleSave = () => {
    if (!selectedFieldId || !localField) return;
    updateField(selectedFieldId, localField);
  };

  const handleAddValidation = () => {
    if (!localField) return;

    const newValidation: ValidationRule[] = [
      ...(localField.validation || []),
      { type: 'required', message: 'This field is required' },
    ];

    setLocalField({ ...localField, validation: newValidation });
  };
  
  const handleRemoveValidation = (index: number) => {
    if (!localField || !localField.validation) return;

    const newValidation = [...localField.validation];
    newValidation.splice(index, 1);

    setLocalField({ ...localField, validation: newValidation });
  };

  const handleValidationChange = (index: number, key: string, value: any) => {
    if (!localField || !localField.validation) return;

    const newValidation = [...localField.validation];
    newValidation[index] = { ...newValidation[index], [key]: value };

    setLocalField({ ...localField, validation: newValidation });
  };

  const handleAddOption = () => {
    if (!localField) return;

    const newOptions: FieldOption[] = [
      ...(localField.options || []),
      { label: 'New Option', value: `option${(localField.options?.length || 0) + 1}` },
    ];

    setLocalField({ ...localField, options: newOptions });
  };

  const handleRemoveOption = (index: number) => {
    if (!localField || !localField.options) return;

    const newOptions = [...localField.options];
    newOptions.splice(index, 1);

    setLocalField({ ...localField, options: newOptions });
  };

  const handleOptionChange = (index: number, key: string, value: string) => {
    if (!localField || !localField.options) return;

    const newOptions = [...localField.options];
    newOptions[index] = { ...newOptions[index], [key]: value };

    setLocalField({ ...localField, options: newOptions });
  };

  // If no field is selected
  if (!localField) {
    return (
      <div className="w-72 border-l border-border h-full bg-card p-4 overflow-y-auto">
        <h2 className="text-lg font-semibold mb-4">Properties</h2>
        <p className="text-muted-foreground text-sm">
          Select a field to edit its properties
        </p>
      </div>
    );
  }

  return (
    <div className="w-72 border-l border-border h-full bg-card p-4 overflow-y-auto">
      <div className="flex items-center justify-between mb-4">
        <h2 className="text-lg font-semibold">Field Properties</h2>
        <Button size="sm" onClick={handleSave}>
          Save
        </Button>
      </div>

      <div className="space-y-4">
        {/* Basic Properties */}
        <div>
          <label className="block text-sm font-medium mb-1">
            Label
          </label>
          <input
            type="text"
            className="w-full px-3 py-2 border rounded-md"
            value={localField.label || ''}
            onChange={(e) => handleInputChange('label', e.target.value)}
          />
        </div>

        {['text', 'textarea', 'email', 'password', 'number'].includes(localField.type) && (
          <div>
            <label className="block text-sm font-medium mb-1">
              Placeholder
            </label>
            <input
              type="text"
              className="w-full px-3 py-2 border rounded-md"
              value={localField.placeholder || ''}
              onChange={(e) => handleInputChange('placeholder', e.target.value)}
            />
          </div>
        )}

        <div>
          <label className="block text-sm font-medium mb-1">
            Helper Text
          </label>
          <input
            type="text"
            className="w-full px-3 py-2 border rounded-md"
            value={localField.helperText || ''}
            onChange={(e) => handleInputChange('helperText', e.target.value)}
          />
        </div>

        <div>
          <div className="flex items-center">
            <input
              type="checkbox"
              id="required"
              className="mr-2"
              checked={localField.required || false}
              onChange={(e) => handleInputChange('required', e.target.checked)}
            />
            <label htmlFor="required" className="text-sm font-medium">
              Required
            </label>
          </div>
        </div>

        {/* Validation Rules */}
        {['text', 'textarea', 'email', 'password', 'number'].includes(localField.type) && (
          <div className="pt-4 border-t">
            <div className="flex items-center justify-between mb-2">
              <h3 className="text-sm font-semibold">Validation Rules</h3>
              <Button
                size="sm"
                variant="outline"
                onClick={handleAddValidation}
                leftIcon={<PlusCircle size={16} />}
              >
                Add
              </Button>
            </div>

            {localField.validation?.map((rule: ValidationRule, index: number) => (
              <div key={index} className="mb-3 p-3 bg-muted/30 rounded-md">
                <div className="flex justify-between items-center mb-2">
                  <select
                    className="px-2 py-1 text-sm border rounded-md"
                    value={rule.type}
                    onChange={(e) => handleValidationChange(index, 'type', e.target.value)}
                  >
                    <option value="required">Required</option>
                    <option value="minLength">Min Length</option>
                    <option value="maxLength">Max Length</option>
                    <option value="pattern">Pattern</option>
                    {localField.type === 'number' && (
                      <>
                        <option value="min">Min Value</option>
                        <option value="max">Max Value</option>
                      </>
                    )}
                  </select>
                  <Button
                    size="sm"
                    variant="ghost"
                    onClick={() => handleRemoveValidation(index)}
                  >
                    <Trash2 size={16} className="text-destructive" />
                  </Button>
                </div>

                {['minLength', 'maxLength', 'min', 'max'].includes(rule.type) && (
                  <div className="mb-2">
                    <input
                      type="number"
                      className="w-full px-3 py-1 text-sm border rounded-md"
                      placeholder="Value"
                      value={rule.value || ''}
                      onChange={(e) => handleValidationChange(index, 'value', e.target.value)}
                    />
                  </div>
                )}

                {rule.type === 'pattern' && (
                  <div className="mb-2">
                    <input
                      type="text"
                      className="w-full px-3 py-1 text-sm border rounded-md"
                      placeholder="Regex pattern"
                      value={rule.value || ''}
                      onChange={(e) => handleValidationChange(index, 'value', e.target.value)}
                    />
                  </div>
                )}

                <div>
                  <input
                    type="text"
                    className="w-full px-3 py-1 text-sm border rounded-md"
                    placeholder="Error message"
                    value={rule.message || ''}
                    onChange={(e) => handleValidationChange(index, 'message', e.target.value)}
                  />
                </div>
              </div>
            ))}
          </div>
        )}

        {/* Options for select, radio, checkbox */}
        {['dropdown', 'radio'].includes(localField.type) && (
          <div className="pt-4 border-t">
            <div className="flex items-center justify-between mb-2">
              <h3 className="text-sm font-semibold">Options</h3>
              <Button
                size="sm"
                variant="outline"
                onClick={handleAddOption}
                leftIcon={<PlusCircle size={16} />}
              >
                Add
              </Button>
            </div>

            {localField.options?.map((option: FieldOption, index: number) => (
              <div key={index} className="mb-2 flex items-center">
                <input
                  type="text"
                  className="flex-1 px-3 py-1 text-sm border rounded-l-md"
                  placeholder="Label"
                  value={option.label}
                  onChange={(e) => handleOptionChange(index, 'label', e.target.value)}
                />
                <input
                  type="text"
                  className="w-1/3 px-3 py-1 text-sm border-t border-b border-r rounded-r-md"
                  placeholder="Value"
                  value={option.value}
                  onChange={(e) => handleOptionChange(index, 'value', e.target.value)}
                />
                <Button
                  size="sm"
                  variant="ghost"
                  onClick={() => handleRemoveOption(index)}
                >
                  <X size={16} className="text-muted-foreground" />
                </Button>
              </div>
            ))}
          </div>
        )}

        {/* Default Value */}
        {!['heading', 'paragraph'].includes(localField.type) && (
          <div className="pt-4 border-t">
            <label className="block text-sm font-medium mb-1">
              Default Value
            </label>
            {localField.type === 'checkbox' ? (
              <input
                type="checkbox"
                checked={!!localField.defaultValue}
                onChange={(e) => handleInputChange('defaultValue', e.target.checked)}
              />
            ) : localField.type === 'radio' || localField.type === 'dropdown' ? (
              <select
                className="w-full px-3 py-2 border rounded-md"
                value={localField.defaultValue || ''}
                onChange={(e) => handleInputChange('defaultValue', e.target.value)}
              >
                <option value="">No default</option>
                {localField.options?.map((option: FieldOption) => (
                  <option key={option.value} value={option.value}>
                    {option.label}
                  </option>
                ))}
              </select>
            ) : (
              <input
                type={localField.type === 'number' ? 'number' : 'text'}
                className="w-full px-3 py-2 border rounded-md"
                value={localField.defaultValue || ''}
                onChange={(e) => handleInputChange('defaultValue', e.target.value)}
              />
            )}
          </div>
        )}
      </div>
    </div>
  );
};

export default PropertiesPanel;