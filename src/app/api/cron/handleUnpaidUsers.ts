// pages/api/checkUnpaidUsers.ts

import notifyIfUnpaid from "@/lib/notifications/notifyIfUnpaid";
import { NextApiRequest, NextApiResponse } from "next";

export default async function handler(
  req: NextApiRequest,
  res: NextApiResponse
) {
  try {
    // Call the function to check for unpaid users
    const unpaidUsers = await notifyIfUnpaid();

    // Perform actions (e.g., send email reminders)
    // Example: console.log or send notification
    console.log(`Unpaid users: ${unpaidUsers}`);

    res.status(200).json({ message: "Checked unpaid users" });
  } catch (error) {
    console.error(error);
    res.status(500).json({ message: "Error checking unpaid users" });
  }
}
