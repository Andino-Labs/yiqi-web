import prisma from "@/lib/prisma";
import { subDays, subHours, setSeconds, setMinutes, setHours } from "date-fns";
import setupNewThreads from "./setupNewThreads";

export default async function setupInitialEventNotifications({
  eventId,
  eventStartDate,
  orgId,
  userId,
}: {
  eventId: string;
  orgId: string;
  eventStartDate: Date;
  userId: string;
}) {
  // Setup new threads for the user if they don't exist
  await setupNewThreads(userId, orgId);

  const oneDayBefore = subDays(eventStartDate, 1);
  const twoHoursBefore = subHours(eventStartDate, 2);
  const morningOfEvent = setSeconds(
    setMinutes(setHours(eventStartDate, 9), 0),
    0,
  ); // 9 AM on the day of the event

  // Create notification entries in your Notification model
  await prisma.notification.createMany({
    data: [
      {
        userId,
        eventId,
        organizationId: orgId,
        type: "ONE_DAY_BEFORE",
        scheduledFor: oneDayBefore,
      },
      {
        userId,
        organizationId: orgId,
        eventId,
        type: "TWO_HOURS_BEFORE",
        scheduledFor: twoHoursBefore,
      },
      {
        userId,
        organizationId: orgId,
        eventId,
        type: "MORNING_OF",
        scheduledFor: morningOfEvent,
      },
    ],
  });
}
