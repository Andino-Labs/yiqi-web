"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";
import { z } from "zod";
import { createEvent } from "@/services/actions/eventActions";

const CustomFieldSchema = z.object({
  name: z.string().min(1, "Field name is required"),
  type: z.enum(["text", "number", "select"]),
  options: z.array(z.string()).optional(),
});

const EventSchema = z.object({
  title: z.string().min(1, "Title is required"),
  description: z.string().optional(),
  startDate: z.string(),
  endDate: z.string(),
  location: z.string().optional(),
  virtualLink: z.string().url().optional(),
  maxAttendees: z.number().int().positive().optional(),
  customFields: z.array(CustomFieldSchema),
});

export default function CreateEventPage({
  params,
}: {
  params: { id: string };
}) {
  const [customFields, setCustomFields] = useState<
    z.infer<typeof CustomFieldSchema>[]
  >([]);
  const [error, setError] = useState("");
  const router = useRouter();

  const handleAddCustomField = () => {
    setCustomFields([...customFields, { name: "", type: "text" }]);
  };

  const handleCustomFieldChange = (
    index: number,
    field: Partial<z.infer<typeof CustomFieldSchema>>,
  ) => {
    const newFields = [...customFields];
    newFields[index] = { ...newFields[index], ...field };
    setCustomFields(newFields);
  };

  const handleSubmit = async (event: React.FormEvent<HTMLFormElement>) => {
    event.preventDefault();
    const formData = new FormData(event.currentTarget);
    const eventData = {
      title: formData.get("title") as string,
      description: formData.get("description") as string,
      startDate: formData.get("startDate") as string,
      endDate: formData.get("endDate") as string,
      location: formData.get("location") as string,
      virtualLink: formData.get("virtualLink") as string,
      maxAttendees: Number(formData.get("maxAttendees")),
      customFields,
    };

    try {
      EventSchema.parse(eventData);
      // Here you would typically call an API to create the event
      // For now, we'll just log the data and redirect
      await createEvent(params.id, eventData);
      router.push(`/organizations/${params.id}/events`);
    } catch (error) {
      if (error instanceof z.ZodError) {
        setError(error.errors.map((e) => e.message).join(", "));
      } else {
        setError("An unexpected error occurred");
      }
    }
  };

  return (
    <div className="container mx-auto p-4">
      <h1 className="text-2xl font-bold mb-4">Create New Event</h1>
      <form onSubmit={handleSubmit} className="space-y-4">
        <input
          name="title"
          placeholder="Event Title"
          required
          className="w-full p-2 border rounded"
        />
        <textarea
          name="description"
          placeholder="Description"
          className="w-full p-2 border rounded"
        />
        <input
          name="startDate"
          type="datetime-local"
          required
          className="w-full p-2 border rounded"
        />
        <input
          name="endDate"
          type="datetime-local"
          required
          className="w-full p-2 border rounded"
        />
        <input
          name="location"
          placeholder="Location"
          className="w-full p-2 border rounded"
        />
        <input
          name="virtualLink"
          placeholder="Virtual Link"
          className="w-full p-2 border rounded"
        />
        <input
          name="maxAttendees"
          type="number"
          placeholder="Max Attendees"
          className="w-full p-2 border rounded"
        />

        <div>
          <h2 className="text-xl font-bold mb-2">Custom Fields</h2>
          {customFields.map((field, index) => (
            <div key={index} className="mb-2">
              <input
                value={field.name}
                onChange={(e) =>
                  handleCustomFieldChange(index, { name: e.target.value })
                }
                placeholder="Field Name"
                className="p-2 border rounded mr-2"
              />
              <select
                value={field.type}
                onChange={(e) =>
                  handleCustomFieldChange(index, {
                    type: e.target.value as "text" | "number" | "select",
                  })
                }
                className="p-2 border rounded"
              >
                <option value="text">Text</option>
                <option value="number">Number</option>
                <option value="select">Select</option>
              </select>
            </div>
          ))}
          <button
            type="button"
            onClick={handleAddCustomField}
            className="bg-green-500 text-white px-4 py-2 rounded"
          >
            Add Custom Field
          </button>
        </div>

        <button
          type="submit"
          className="bg-blue-500 text-white px-4 py-2 rounded"
        >
          Create Event
        </button>
      </form>
      {error && <p className="text-red-500 mt-2">{error}</p>}
    </div>
  );
}
