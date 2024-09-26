"use client";

import { useState } from "react";
import Link from "next/link";
import { CustomFieldInput } from "@/schemas/eventSchema";

interface EditEventFormProps {
  event: {
    id: string;
    title: string;
    startDate: string;
    endDate: string;
    description?: string;
    customFields: CustomFieldInput[];
  };
  handleSubmit: (formData: FormData) => Promise<void>;
  organizationId: string;
}

export default function EditEventForm({
  event,
  handleSubmit,
  organizationId,
}: EditEventFormProps) {
  const [customFields, setCustomFields] = useState<CustomFieldInput[]>(
    event.customFields
  );

  const addCustomField = () => {
    setCustomFields([
      ...customFields,
      { name: "", type: "text", required: false },
    ]);
  };

  const updateCustomField = (
    index: number,
    field: Partial<CustomFieldInput>
  ) => {
    const newFields = [...customFields];
    newFields[index] = { ...newFields[index], ...field };
    setCustomFields(newFields);
  };

  const removeCustomField = (index: number) => {
    setCustomFields(customFields.filter((_, i) => i !== index));
  };

  const onSubmit = async (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    const formData = new FormData(e.currentTarget);
    formData.append("customFields", JSON.stringify(customFields));
    await handleSubmit(formData);
  };

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
          Start Date
        </label>
        <input
          type="datetime-local"
          id="startDate"
          name="startDate"
          defaultValue={event.startDate.slice(0, 16)}
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
          defaultValue={event.endDate.slice(0, 16)}
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
          defaultValue={event.description || ""}
          className="w-full border p-2"
          rows={4}
        ></textarea>
      </div>

      {/* Custom Fields */}
      <div>
        <h2 className="text-xl font-semibold mb-2">Custom Fields</h2>
        {customFields.map((field, index) => (
          <div key={index} className="mb-4 p-4 border rounded">
            {/* Custom field inputs */}
            {/* ... (same as before) ... */}
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
          href={`/organizations/${organizationId}/events`}
          className="ml-4 text-blue-500 hover:underline"
        >
          Cancel
        </Link>
      </div>
    </form>
  );
}
