"use client";

import Link from "next/link";
import { useState } from "react";

interface FormField {
  id: string;
  type: 'text' | 'email' | 'number' | 'textarea' | 'select' | 'radio' | 'checkbox' | 'date';
  label: string;
  placeholder?: string;
  required: boolean;
  options?: string[];
}

interface FormData {
  title: string;
  description: string;
  fields: FormField[];
}

const fieldTypes = [
  { type: 'text', label: 'Text Input', icon: '📝' },
  { type: 'email', label: 'Email', icon: '📧' },
  { type: 'number', label: 'Number', icon: '🔢' },
  { type: 'textarea', label: 'Text Area', icon: '📄' },
  { type: 'select', label: 'Dropdown', icon: '📋' },
  { type: 'radio', label: 'Radio Button', icon: '🔘' },
  { type: 'checkbox', label: 'Checkbox', icon: '☑️' },
  { type: 'date', label: 'Date', icon: '📅' },
] as const;

export default function FormBuilderPage() {
  const [formData, setFormData] = useState<FormData>({
    title: '',
    description: '',
    fields: [],
  });

  const [selectedField, setSelectedField] = useState<string | null>(null);
  const [previewMode, setPreviewMode] = useState(false);

  const addField = (type: FormField['type']) => {
    const newField: FormField = {
      id: `field-${Date.now()}`,
      type,
      label: `New ${type} field`,
      required: false,
      ...(type === 'select' || type === 'radio' ? { options: ['Option 1', 'Option 2'] } : {}),
    };

    setFormData(prev => ({
      ...prev,
      fields: [...prev.fields, newField],
    }));
    setSelectedField(newField.id);
  };

  const updateField = (fieldId: string, updates: Partial<FormField>) => {
    setFormData(prev => ({
      ...prev,
      fields: prev.fields.map(field =>
        field.id === fieldId ? { ...field, ...updates } : field
      ),
    }));
  };

  const removeField = (fieldId: string) => {
    setFormData(prev => ({
      ...prev,
      fields: prev.fields.filter(field => field.id !== fieldId),
    }));
    if (selectedField === fieldId) {
      setSelectedField(null);
    }
  };

  const moveField = (fieldId: string, direction: 'up' | 'down') => {
    const fieldIndex = formData.fields.findIndex(field => field.id === fieldId);
    if (
      (direction === 'up' && fieldIndex === 0) ||
      (direction === 'down' && fieldIndex === formData.fields.length - 1)
    ) {
      return;
    }

    const newFields = [...formData.fields];
    const newIndex = direction === 'up' ? fieldIndex - 1 : fieldIndex + 1;
    [newFields[fieldIndex], newFields[newIndex]] = [newFields[newIndex], newFields[fieldIndex]];

    setFormData(prev => ({ ...prev, fields: newFields }));
  };

  const renderFieldPreview = (field: FormField) => {
    const baseClasses = "w-full px-3 py-2 border border-gray-300 rounded-md focus:ring-2 focus:ring-indigo-500 focus:border-transparent";
    
    switch (field.type) {
      case 'text':
      case 'email':
      case 'number':
        return (
          <input
            type={field.type}
            placeholder={field.placeholder || `Enter ${field.label.toLowerCase()}`}
            className={baseClasses}
            required={field.required}
            disabled
          />
        );
      case 'textarea':
        return (
          <textarea
            placeholder={field.placeholder || `Enter ${field.label.toLowerCase()}`}
            rows={3}
            className={baseClasses}
            required={field.required}
            disabled
          />
        );
      case 'select':
        return (
          <select className={baseClasses} required={field.required} disabled>
            <option value="">Select an option</option>
            {field.options?.map((option, index) => (
              <option key={index} value={option}>
                {option}
              </option>
            ))}
          </select>
        );
      case 'radio':
        return (
          <div className="space-y-2">
            {field.options?.map((option, index) => (
              <label key={index} className="flex items-center">
                <input
                  type="radio"
                  name={field.id}
                  value={option}
                  className="mr-2 text-indigo-600 focus:ring-indigo-500"
                  required={field.required}
                  disabled
                />
                {option}
              </label>
            ))}
          </div>
        );
      case 'checkbox':
        return (
          <label className="flex items-center">
            <input
              type="checkbox"
              className="mr-2 text-indigo-600 focus:ring-indigo-500"
              required={field.required}
              disabled
            />
            {field.label}
          </label>
        );
      case 'date':
        return (
          <input
            type="date"
            className={baseClasses}
            required={field.required}
            disabled
          />
        );
      default:
        return null;
    }
  };

  const selectedFieldData = formData.fields.find(field => field.id === selectedField);

  return (
    <div className="min-h-screen bg-gray-50">
      {/* Header */}
      <header className="bg-white shadow-sm border-b">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="flex justify-between items-center h-16">
            <div className="flex items-center">
              <Link href="/" className="text-2xl font-bold text-indigo-600">
                EDC System
              </Link>
            </div>
            <div className="flex items-center space-x-4">
              <button
                onClick={() => setPreviewMode(!previewMode)}
                className="px-4 py-2 text-sm font-medium text-gray-700 bg-white border border-gray-300 rounded-md hover:bg-gray-50 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-indigo-500"
              >
                {previewMode ? 'Edit' : 'Preview'}
              </button>
              <button
                className="px-4 py-2 text-sm font-medium text-white bg-indigo-600 border border-transparent rounded-md hover:bg-indigo-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-indigo-500"
              >
                Save Form
              </button>
            </div>
          </div>
        </div>
      </header>

      <main className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        <div className="mb-6">
          <h1 className="text-3xl font-bold text-gray-900 mb-2">Form Builder</h1>
          <p className="text-gray-600">Create and customize your data collection forms</p>
        </div>

        {previewMode ? (
          /* Preview Mode */
          <div className="max-w-2xl mx-auto">
            <div className="bg-white rounded-lg shadow-sm border p-8">
              <div className="mb-8">
                <h2 className="text-2xl font-bold text-gray-900 mb-2">
                  {formData.title || 'Untitled Form'}
                </h2>
                {formData.description && (
                  <p className="text-gray-600">{formData.description}</p>
                )}
              </div>

              <form className="space-y-6">
                {formData.fields.map((field) => (
                  <div key={field.id}>
                    <label className="block text-sm font-medium text-gray-700 mb-2">
                      {field.label}
                      {field.required && <span className="text-red-500 ml-1">*</span>}
                    </label>
                    {renderFieldPreview(field)}
                  </div>
                ))}

                {formData.fields.length === 0 && (
                  <div className="text-center py-8 text-gray-500">
                    No fields added yet. Switch to edit mode to add fields.
                  </div>
                )}

                <div className="pt-6">
                  <button
                    type="submit"
                    className="w-full py-2 px-4 border border-transparent rounded-md shadow-sm text-sm font-medium text-white bg-indigo-600 hover:bg-indigo-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-indigo-500"
                    disabled
                  >
                    Submit Form (Preview)
                  </button>
                </div>
              </form>
            </div>
          </div>
        ) : (
          /* Edit Mode */
          <div className="grid grid-cols-1 lg:grid-cols-4 gap-8">
            {/* Field Types Panel */}
            <div className="lg:col-span-1">
              <div className="bg-white rounded-lg shadow-sm border p-6">
                <h3 className="text-lg font-semibold text-gray-900 mb-4">Field Types</h3>
                <div className="space-y-2">
                  {fieldTypes.map((fieldType) => (
                    <button
                      key={fieldType.type}
                      onClick={() => addField(fieldType.type)}
                      className="w-full text-left px-3 py-2 text-sm rounded-md border border-gray-200 hover:bg-gray-50 focus:outline-none focus:ring-2 focus:ring-indigo-500"
                    >
                      <span className="mr-2">{fieldType.icon}</span>
                      {fieldType.label}
                    </button>
                  ))}
                </div>
              </div>
            </div>

            {/* Form Canvas */}
            <div className="lg:col-span-2">
              <div className="bg-white rounded-lg shadow-sm border p-6">
                {/* Form Settings */}
                <div className="mb-6">
                  <div className="mb-4">
                    <label className="block text-sm font-medium text-gray-700 mb-2">
                      Form Title
                    </label>
                    <input
                      type="text"
                      value={formData.title}
                      onChange={(e) => setFormData(prev => ({ ...prev, title: e.target.value }))}
                      placeholder="Enter form title"
                      className="w-full px-3 py-2 border border-gray-300 rounded-md focus:ring-2 focus:ring-indigo-500 focus:border-transparent"
                    />
                  </div>
                  <div className="mb-6">
                    <label className="block text-sm font-medium text-gray-700 mb-2">
                      Description
                    </label>
                    <textarea
                      value={formData.description}
                      onChange={(e) => setFormData(prev => ({ ...prev, description: e.target.value }))}
                      placeholder="Enter form description"
                      rows={3}
                      className="w-full px-3 py-2 border border-gray-300 rounded-md focus:ring-2 focus:ring-indigo-500 focus:border-transparent"
                    />
                  </div>
                </div>

                {/* Form Fields */}
                <div className="space-y-4">
                  <h4 className="text-md font-medium text-gray-900">Form Fields</h4>
                  
                  {formData.fields.length === 0 ? (
                    <div className="text-center py-8 text-gray-500 border-2 border-dashed border-gray-300 rounded-lg">
                      <p className="mb-2">No fields added yet</p>
                      <p className="text-sm">Click on field types to add them to your form</p>
                    </div>
                  ) : (
                    formData.fields.map((field, index) => (
                      <div
                        key={field.id}
                        className={`border rounded-lg p-4 cursor-pointer transition-colors ${
                          selectedField === field.id
                            ? 'border-indigo-500 bg-indigo-50'
                            : 'border-gray-200 hover:border-gray-300'
                        }`}
                        onClick={() => setSelectedField(field.id)}
                      >
                        <div className="flex items-center justify-between mb-2">
                          <span className="font-medium text-gray-900">{field.label}</span>
                          <div className="flex items-center space-x-2">
                            <button
                              onClick={(e) => {
                                e.stopPropagation();
                                moveField(field.id, 'up');
                              }}
                              disabled={index === 0}
                              className="p-1 text-gray-400 hover:text-gray-600 disabled:opacity-50"
                              aria-label="Move field up"
                            >
                              ↑
                            </button>
                            <button
                              onClick={(e) => {
                                e.stopPropagation();
                                moveField(field.id, 'down');
                              }}
                              disabled={index === formData.fields.length - 1}
                              className="p-1 text-gray-400 hover:text-gray-600 disabled:opacity-50"
                              aria-label="Move field down"
                            >
                              ↓
                            </button>
                            <button
                              onClick={(e) => {
                                e.stopPropagation();
                                removeField(field.id);
                              }}
                              className="p-1 text-red-400 hover:text-red-600"
                              aria-label="Remove field"
                            >
                              🗑️
                            </button>
                          </div>
                        </div>
                        <div className="text-sm text-gray-500">
                          {field.type} • {field.required ? 'Required' : 'Optional'}
                        </div>
                      </div>
                    ))
                  )}
                </div>
              </div>
            </div>

            {/* Field Properties Panel */}
            <div className="lg:col-span-1">
              <div className="bg-white rounded-lg shadow-sm border p-6">
                <h3 className="text-lg font-semibold text-gray-900 mb-4">Field Properties</h3>
                
                {selectedFieldData ? (
                  <div className="space-y-4">
                    <div>
                      <label className="block text-sm font-medium text-gray-700 mb-2">
                        Label
                      </label>
                      <input
                        type="text"
                        value={selectedFieldData.label}
                        onChange={(e) => updateField(selectedField!, { label: e.target.value })}
                        className="w-full px-3 py-2 border border-gray-300 rounded-md focus:ring-2 focus:ring-indigo-500 focus:border-transparent text-sm"
                      />
                    </div>

                    {(selectedFieldData.type === 'text' || 
                      selectedFieldData.type === 'email' || 
                      selectedFieldData.type === 'number' || 
                      selectedFieldData.type === 'textarea') && (
                      <div>
                        <label className="block text-sm font-medium text-gray-700 mb-2">
                          Placeholder
                        </label>
                        <input
                          type="text"
                          value={selectedFieldData.placeholder || ''}
                          onChange={(e) => updateField(selectedField!, { placeholder: e.target.value })}
                          className="w-full px-3 py-2 border border-gray-300 rounded-md focus:ring-2 focus:ring-indigo-500 focus:border-transparent text-sm"
                        />
                      </div>
                    )}

                    <div>
                      <label className="flex items-center">
                        <input
                          type="checkbox"
                          checked={selectedFieldData.required}
                          onChange={(e) => updateField(selectedField!, { required: e.target.checked })}
                          className="mr-2 text-indigo-600 focus:ring-indigo-500"
                        />
                        <span className="text-sm font-medium text-gray-700">Required field</span>
                      </label>
                    </div>

                    {(selectedFieldData.type === 'select' || selectedFieldData.type === 'radio') && (
                      <div>
                        <label className="block text-sm font-medium text-gray-700 mb-2">
                          Options
                        </label>
                        <div className="space-y-2">
                          {selectedFieldData.options?.map((option, index) => (
                            <input
                              key={index}
                              type="text"
                              value={option}
                              onChange={(e) => {
                                const newOptions = [...(selectedFieldData.options || [])];
                                newOptions[index] = e.target.value;
                                updateField(selectedField!, { options: newOptions });
                              }}
                              className="w-full px-3 py-2 border border-gray-300 rounded-md focus:ring-2 focus:ring-indigo-500 focus:border-transparent text-sm"
                            />
                          ))}
                          <button
                            onClick={() => {
                              const newOptions = [...(selectedFieldData.options || []), `Option ${(selectedFieldData.options?.length || 0) + 1}`];
                              updateField(selectedField!, { options: newOptions });
                            }}
                            className="text-indigo-600 hover:text-indigo-700 text-sm"
                          >
                            + Add Option
                          </button>
                        </div>
                      </div>
                    )}
                  </div>
                ) : (
                  <p className="text-gray-500 text-sm">Select a field to edit its properties</p>
                )}
              </div>
            </div>
          </div>
        )}
      </main>
    </div>
  );
}