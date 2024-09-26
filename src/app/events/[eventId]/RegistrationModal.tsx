"use client";

import { EditEventInput } from "@/schemas/eventSchema";
import { useState } from "react";
import { createAttendee } from "@/app/actions/eventActions";

interface RegistrationModalProps {
  event: EditEventInput;
  registrationStatus: boolean;
}

const RegistrationModal: React.FC<RegistrationModalProps> = ({
  event,
  registrationStatus,
}) => {
  const [customData, setCustomData] = useState({}); // Adjust based on your custom fields
  const [isModalOpen, setIsModalOpen] = useState(false);

  const handleInputChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const { name, value } = e.target;
    setCustomData((prev) => ({ ...prev, [name]: value }));
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    try {
      await createAttendee(event.id, customData);
      alert("Registration successful!");
      setIsModalOpen(false); // Close the modal on success
    } catch (error) {
      console.error("Error during registration:", error);
      alert("An error occurred. Please try again.");
    }
  };

  return (
    <>
      {registrationStatus ? (
        <p className="text-green-600 font-semibold">
          You are registered for this event.
        </p>
      ) : (
        <button
          onClick={() => setIsModalOpen(true)}
          className="px-4 py-2 bg-blue-500 text-white rounded hover:bg-blue-600"
        >
          Register
        </button>
      )}

      {isModalOpen && (
        <div className="fixed inset-0 flex items-center justify-center bg-black bg-opacity-50">
          <div className="bg-white p-6 rounded shadow-md">
            <h2 className="text-xl font-bold mb-4">
              Register for {event.title}
            </h2>
            <form onSubmit={handleSubmit}>
              {/* Example input fields for custom data */}
              {event.customFields &&
                Object.keys(event.customFields).map((field) => (
                  <input
                    key={field}
                    type="text"
                    name={field}
                    placeholder={field}
                    onChange={handleInputChange}
                    className="border p-2 mb-4 w-full"
                  />
                ))}
              <button
                type="submit"
                className="px-4 py-2 bg-blue-500 text-white rounded hover:bg-blue-600"
              >
                Submit
              </button>
            </form>
            <button
              onClick={() => setIsModalOpen(false)}
              className="mt-4 text-red-500"
            >
              Cancel
            </button>
          </div>
        </div>
      )}
    </>
  );
};

export default RegistrationModal;
