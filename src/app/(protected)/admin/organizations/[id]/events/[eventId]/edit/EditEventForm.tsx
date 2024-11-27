'use client'

import { useState } from 'react'
import Link from 'next/link'
import { CustomFieldInputType, EditEventInputType } from '@/schemas/eventSchema'

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
  const [customFields, setCustomFields] = useState<CustomFieldInputType[]>(
    event.customFields
  )

  const addCustomField = () => {
    setCustomFields([
      ...customFields,
      { name: '', type: 'text', required: false }
    ])
  }

  const updateCustomField = (
    index: number,
    field: Partial<CustomFieldInputType>
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
    formData.append('customFields', JSON.stringify(customFields))
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
          <div key={index} className="mb-2">
            <input
              value={field.name}
              onChange={e => updateCustomField(index, { name: e.target.value })}
              placeholder="Field Name"
              className="p-2 border rounded mr-2"
            />
            <select
              value={field.type}
              onChange={() => removeCustomField(index)}
              className="p-2 border rounded"
            >
              <option value="text">Text</option>
              <option value="number">Number</option>
              <option value="select">Select</option>
            </select>
            {field.type === 'select' && (
              <input
                type="text"
                value={field.options}
                onChange={e =>
                  updateCustomField(index, { options: e.target.value })
                }
                placeholder="Enter options separated by commas"
                className="p-2 border rounded ml-2"
              />
            )}
            <button
              type="button"
              onClick={() => removeCustomField(index)}
              className="text-red-500 ml-2"
            >
              Remove
            </button>
          </div>
        ))}
        <button
          type="button"
          onClick={addCustomField}
          className="bg-green-500 text-white px-4 py-2 rounded"
        >
          Add Custom Field
        </button>
      </div>

      <div>
        <button
          type="submit"
          className="bg-blue-500 text-white px-4 py-2 rounded"
        >
          Update Event
        </button>
        <Link
          href={`/admin/organizations/${organizationId}/events`}
          className="ml-4 text-blue-500 hover:underline"
        >
          Cancel
        </Link>
      </div>
    </form>
  )
}
