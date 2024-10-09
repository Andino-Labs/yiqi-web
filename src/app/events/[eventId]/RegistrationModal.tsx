"use client";

import { EditEventInput } from "@/schemas/eventSchema";
import { useState } from "react";
import { createRegistration } from "@/app/actions/eventActions";

interface RegistrationModalProps {
  event: EditEventInput;
  registrationStatus: boolean;
}

const RegistrationModal: React.FC<RegistrationModalProps> = ({
  event,
  registrationStatus,
}) => {
  const [customData, setCustomData] = useState({});
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [optionsInput, setOptionsInput] = useState("");

  const handleInputChange = (
    e: React.ChangeEvent<HTMLInputElement | HTMLSelectElement>
  ) => {
    const { name, value } = e.target;
    setCustomData((prev) => ({ ...prev, [name]: value }));
  };

  const handleOptionsChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    setOptionsInput(e.target.value);
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    try {
      // If there are options for a select field, split them into an array
      if (optionsInput) {
        const optionsArray = optionsInput
          .split(",")
          .map((option) => option.trim());
        setCustomData((prev) => ({ ...prev, options: optionsArray }));
      }
      await createRegistration(event.id, customData);
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
                event.customFields.map((field) => {
                  if (field.type === "select") {
                    return (
                      <div key={field.name} className="mb-4">
                        <label className="block mb-2">{field.name}</label>
                        <input
                          type="text"
                          placeholder="Enter options separated by commas"
                          value={optionsInput}
                          onChange={handleOptionsChange}
                          className="border p-2 w-full mb-2"
                        />
                        <select
                          name={field.name}
                          onChange={handleInputChange}
                          className="border p-2 w-full"
                        >
                          <option value="">Select an option</option>
                          {optionsInput.split(",").map((option, index) => (
                            <option key={index} value={option.trim()}>
                              {option.trim()}
                            </option>
                          ))}
                        </select>
                      </div>
                    );
                  } else {
                    return (
                      <div key={field.name} className="mb-4">
                        <label className="block mb-2">{field.name}</label>
                        <input
                          type="text"
                          name={field.name}
                          placeholder={field.name}
                          onChange={handleInputChange}
                          className="border p-2 w-full"
                        />
                      </div>
                    );
                  }
                })}
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
