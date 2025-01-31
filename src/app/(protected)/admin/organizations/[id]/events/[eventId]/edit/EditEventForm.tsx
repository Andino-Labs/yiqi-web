'use client'

import { useState } from 'react'
import Link from 'next/link'
import { CustomFieldType, EditEventInputType } from '@/schemas/eventSchema'

interface EditEventFormProps {
  event: EditEventInputType
  handleSubmit: (formData: FormData) => Promise<void>
  organizationId: string
}

export default function EditEventForm({
  event,
  handleSubmit,
  organizationId
}: EditEventFormProps) {
  const [customFields, setCustomFields] = useState<CustomFieldType[]>(
    event.customFields?.fields || []
  )

  const addCustomField = () => {
    setCustomFields([
      ...customFields,
      {
        name: '',
        description: '',
        type: 'text',
        inputType: 'shortText',
        required: false,
        defaultValue: undefined
      }
    ])
  }

  const updateCustomField = (
    index: number,
    field: Partial<CustomFieldType>
  ) => {
    const newFields = [...customFields]
    newFields[index] = { ...newFields[index], ...field }
    setCustomFields(newFields)
  }

  const removeCustomField = (index: number) => {
    setCustomFields(customFields.filter((_, i) => i !== index))
  }

  const onSubmit = async (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault()
    const formData = new FormData(e.currentTarget)
    formData.append('customFields', JSON.stringify({ fields: customFields }))
    await handleSubmit(formData)
  }

  return (
    <form onSubmit={onSubmit} className="space-y-4">
      {/* Form fields */}
      <div>
        <label htmlFor="title" className="block">
          Title
        </label>
        <input
          type="text"
          id="title"
          name="title"
          defaultValue={event.title}
          required
          className="w-full border p-2"
        />
      </div>
      <div>
        <label htmlFor="startDate" className="block">
          Start Date {new Date(event.startDate).toLocaleDateString()}
        </label>
        <input
          type="datetime-local"
          id="startDate"
          name="startDate"
          defaultValue={new Date(event.startDate).toISOString().slice(0, 16)}
          required
          className="w-full border p-2"
        />
      </div>
      <div>
        <label htmlFor="endDate" className="block">
          End Date
        </label>
        <input
          type="datetime-local"
          id="endDate"
          name="endDate"
          defaultValue={new Date(event.endDate).toISOString().slice(0, 16)}
          required
          className="w-full border p-2"
        />
      </div>
      <div>
        <label htmlFor="description" className="block">
          Description
        </label>
        <textarea
          id="description"
          name="description"
          defaultValue={event.description || ''}
          className="w-full border p-2"
          rows={4}
        ></textarea>
      </div>

      {/* Custom Fields */}
      <div>
        <h2 className="text-xl font-semibold mb-2">Custom Fields</h2>
        {customFields.map((field, index) => (
          <div key={index} className="mb-4 p-4 border rounded">
            <div className="grid grid-cols-2 gap-4 mb-2">
              <div>
                <label className="block text-sm font-medium mb-1">Name</label>
                <input
                  value={field.name}
                  onChange={e =>
                    updateCustomField(index, { name: e.target.value })
                  }
                  placeholder="Field Name"
                  className="w-full p-2 border rounded"
                  required
                />
              </div>
              <div>
                <label className="block text-sm font-medium mb-1">Type</label>
                <select
                  value={field.type}
                  onChange={e =>
                    updateCustomField(index, {
                      type: e.target.value as CustomFieldType['type']
                    })
                  }
                  className="w-full p-2 border rounded"
                >
                  {['text', 'number', 'date', 'boolean', 'url'].map(option => (
                    <option key={option} value={option}>
                      {option}
                    </option>
                  ))}
                </select>
              </div>
            </div>

            <div className="grid grid-cols-2 gap-4 mb-2">
              <div>
                <label className="block text-sm font-medium mb-1">
                  Input Type
                </label>
                <select
                  value={field.inputType}
                  onChange={e =>
                    updateCustomField(index, {
                      inputType: e.target.value as CustomFieldType['inputType']
                    })
                  }
                  className="w-full p-2 border rounded"
                >
                  <option value="shortText">Short Text</option>
                  <option value="longText">Long Text</option>
                </select>
              </div>
              <div>
                <label className="block text-sm font-medium mb-1">
                  Default Value
                </label>
                <input
                  type="text"
                  value={field.defaultValue?.toString() || ''}
                  onChange={e =>
                    updateCustomField(index, { defaultValue: e.target.value })
                  }
                  placeholder="Default Value"
                  className="w-full p-2 border rounded"
                />
              </div>
            </div>

            <div className="mb-2">
              <label className="block text-sm font-medium mb-1">
                Description
              </label>
              <input
                value={field.description}
                onChange={e =>
                  updateCustomField(index, { description: e.target.value })
                }
                placeholder="Field Description"
                className="w-full p-2 border rounded"
              />
            </div>

            <div className="flex items-center justify-between">
              <label className="flex items-center gap-2">
                <input
                  type="checkbox"
                  checked={field.required || false}
                  onChange={e =>
                    updateCustomField(index, { required: e.target.checked })
                  }
                  className="h-4 w-4"
                />
                <span className="text-sm">Required</span>
              </label>
              <button
                type="button"
                onClick={() => removeCustomField(index)}
                className="text-red-500 hover:text-red-700 text-sm"
              >
                Remove Field
              </button>
            </div>
          </div>
        ))}

        <button
          type="button"
          onClick={addCustomField}
          className="mt-4 bg-green-500 text-white px-4 py-2 rounded hover:bg-green-600"
        >
          Add Custom Field
        </button>
      </div>

      <div className="flex gap-4">
        <button
          type="submit"
          className="bg-blue-500 text-white px-4 py-2 rounded hover:bg-blue-600"
        >
          Update Event
        </button>
        <Link
          href={`/admin/organizations/${organizationId}/events`}
          className="bg-gray-500 text-white px-4 py-2 rounded hover:bg-gray-600"
        >
          Cancel
        </Link>
      </div>
    </form>
  )
}
