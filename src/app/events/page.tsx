import { Metadata } from "next";
import Link from "next/link";
import { getPublicEvents } from "@/app/actions/eventActions";

export const metadata: Metadata = {
  title: "Upcoming Events | Your Organization Name",
  description: "Browse and register for upcoming events in your area.",
  openGraph: {
    title: "Upcoming Events | Your Organization Name",
    description: "Browse and register for upcoming events in your area.",
    images: ["/path-to-your-og-image.jpg"],
  },
};

export default async function PublicEventsPage() {
  const events = await getPublicEvents();

  return (
    <div className="container mx-auto p-4">
      <h1 className="text-3xl font-bold mb-6">Upcoming Events</h1>
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
        {events.map((event) => (
          <div key={event.id} className="border rounded-lg p-4 shadow-md">
            <h2 className="text-xl font-semibold mb-2">{event.title}</h2>
            <p className="text-gray-600 mb-2">
              {new Date(event.startDate).toLocaleDateString()} -{" "}
              {new Date(event.endDate).toLocaleDateString()}
            </p>
            <p className="mb-4">{event.description}</p>
            <Link
              href={`/events/${event.id}`}
              className="bg-blue-500 text-white px-4 py-2 rounded inline-block"
            >
              View Details
            </Link>
          </div>
        ))}
      </div>
    </div>
  );
}
