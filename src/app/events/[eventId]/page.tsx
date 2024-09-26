import {
  getEvent,
  getUserRegistrationStatus,
} from "@/app/actions/eventActions";
import { getCurrentUser } from "@/utils/auth";
import RegistrationModal from "./RegistrationModal";

export default async function EventPage({
  params,
}: {
  params: { eventId: string };
}) {
  const { eventId } = params;
  const event = await getEvent(eventId);
  const currentUser = await getCurrentUser();
  const registrationStatus = currentUser
    ? await getUserRegistrationStatus(eventId, currentUser.id)
    : false;

  return (
    <div className="max-w-4xl mx-auto p-6 bg-white shadow-md rounded-lg">
      <h1 className="text-3xl font-bold mb-4">{event.title}</h1>
      <p className="text-gray-700 mb-4">{event.description}</p>
      <p className="text-gray-500 mb-2">
        Start Date: {event.startDate.toLocaleDateString()}
      </p>
      <p className="text-gray-500 mb-4">
        End Date: {event.endDate.toLocaleDateString()}
      </p>

      <RegistrationModal
        registrationStatus={registrationStatus}
        event={event}
      />
    </div>
  );
}
