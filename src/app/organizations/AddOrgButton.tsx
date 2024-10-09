"use client";

import { useState } from "react";
import { createOrganization } from "../../services/actions/organizationActions";
import { useRouter } from "next/navigation";

export default function AddOrgButton() {
  const [showForm, setShowForm] = useState(false);
  const [error, setError] = useState("");
  const router = useRouter();

  async function handleSubmit(event: React.FormEvent<HTMLFormElement>) {
    event.preventDefault();
    const formData = new FormData(event.currentTarget);
    const name = formData.get("name") as string;
    const description = formData.get("description") as string;
    const logo = formData.get("logo") as string;

    try {
      await createOrganization({ name, description, logo });
      setShowForm(false);
      setError("");
      router.refresh();
    } catch (error) {
      console.error(error);
      setError("Failed to create organization. Please try again.");
    }
  }

  return (
    <div className="mt-4">
      <button
        onClick={() => setShowForm(true)}
        className="bg-blue-500 text-white px-4 py-2 rounded"
      >
        Add Organization
      </button>
      {showForm && (
        <div className="fixed inset-0 bg-gray-600 bg-opacity-50 flex items-center justify-center">
          <form
            onSubmit={handleSubmit}
            className="bg-white p-4 rounded shadow-lg"
          >
            <h2 className="text-xl font-bold mb-4">Create New Organization</h2>
            <input
              name="name"
              placeholder="Organization Name"
              required
              className="w-full p-2 mb-2 border rounded"
            />
            <input
              name="description"
              placeholder="Description"
              className="w-full p-2 mb-2 border rounded"
            />
            <input
              name="logo"
              placeholder="Logo URL"
              className="w-full p-2 mb-2 border rounded"
            />
            <div className="flex justify-end space-x-2">
              <button
                type="button"
                onClick={() => setShowForm(false)}
                className="bg-gray-300 px-4 py-2 rounded"
              >
                Cancel
              </button>
              <button
                type="submit"
                className="bg-blue-500 text-white px-4 py-2 rounded"
              >
                Create
              </button>
            </div>
            {error && <p className="text-red-500 mt-2">{error}</p>}
          </form>
        </div>
      )}
    </div>
  );
}
