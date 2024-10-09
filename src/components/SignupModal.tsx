import { useState } from "react";
import { createRegistration } from "@/app/actions/eventActions";
import { CustomFieldInput, createAttendeeSchema } from "@/schemas/eventSchema";
import { useSession } from "next-auth/react";
import { z } from "zod";

interface SignupModalProps {
  event: {
    id: string;
    title: string;
    customFields: CustomFieldInput[];
  };
  onClose: () => void;
}

export default function SignupModal({ event, onClose }: SignupModalProps) {
  const [formData, setFormData] = useState<Record<string, string>>({});
  const [error, setError] = useState<string | null>(null);
  const { data: session } = useSession();

  const attendeeSchema = createAttendeeSchema(event.customFields);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setError(null);

    try {
      const validatedData = attendeeSchema.parse(formData);
      await createRegistration(event.id, validatedData);
      onClose();
      // Show success message
    } catch (error) {
      if (error instanceof z.ZodError) {
        setError(error.errors.map((e) => e.message).join(", "));
      } else if (error instanceof Error) {
        setError(error.message);
      } else {
        setError("An unknown error occurred");
      }
    }
  };

  return (
    <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center">
      <div className="bg-white p-6 rounded-lg max-w-md w-full">
        <h2 className="text-2xl font-bold mb-4">Sign Up for {event.title}</h2>
        {error && <p className="text-red-500 mb-4">{error}</p>}
        <form onSubmit={handleSubmit}>
          <input
            type="email"
            name="email"
            required
            placeholder="Email"
            className="w-full border p-2 mb-2"
            defaultValue={session?.user?.email || ""}
            onChange={(e) =>
              setFormData({ ...formData, email: e.target.value })
            }
          />
          {event.customFields.map((field) => (
            <div key={field.name}>
              {field.type === "select" ? (
                <select
                  name={field.name}
                  required={field.required}
                  className="w-full border p-2 mb-2"
                  onChange={(e) =>
                    setFormData({ ...formData, [field.name]: e.target.value })
                  }
                >
                  <option value="">Select {field.name}</option>
                  {field.options?.split(",").map((option) => (
                    <option key={option.trim()} value={option.trim()}>
                      {option.trim()}
                    </option>
                  ))}
                </select>
              ) : (
                <input
                  type={field.type}
                  name={field.name}
                  required={field.required}
                  placeholder={field.name}
                  className="w-full border p-2 mb-2"
                  onChange={(e) =>
                    setFormData({ ...formData, [field.name]: e.target.value })
                  }
                />
              )}
            </div>
          ))}
          <button
            type="submit"
            className="bg-blue-500 text-white px-4 py-2 rounded"
          >
            Sign Up
          </button>
          <button
            type="button"
            onClick={onClose}
            className="ml-2 text-gray-600"
          >
            Cancel
          </button>
        </form>
      </div>
    </div>
  );
}
