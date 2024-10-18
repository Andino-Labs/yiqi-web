import prisma from "@/lib/prisma";
import { getLinkedInData } from "../data/collectLinkedinUserProfile";
import { getTwitterData } from "../data/collectTwitterUserProfile";

// TODO; ensure this works fine with jsut an email
//  we need to find a service that uses any info we got from the user to get his accounts
//  and then we can use that service to get the data
export const getUserData = async (
  email: string,
  twitterAccessToken: string,
  linkedinAccessToken: string,
  twitterUsername: string,
) => {
  try {
    // Fetch Twitter data
    const twitterData = await getTwitterData(
      twitterAccessToken,
      twitterUsername,
    );

    // Fetch LinkedIn data
    const linkedinData = await getLinkedInData(linkedinAccessToken);

    await prisma.user.findUnique({
      where: {
        email,
      },
    });

    await prisma.user.update({
      where: {
        email,
      },
      data: {
        dataCollected: {
          twitter: twitterData,
          linkedin: linkedinData,
        },
      },
    });
  } catch (error) {
    console.error("Error fetching user data:", error);
    throw error;
  }
};
