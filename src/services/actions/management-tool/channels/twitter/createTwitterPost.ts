'use server'

import prisma from "@/lib/prisma";
import { CreatePostTwitterSchema } from "@/schemas/twitterSchema";

export const createTwitterPost = async (input: CreatePostTwitterSchema) => {
  const { userId, accountId, organizationId, content, scheduledDate } = input;
  
  try {
    return await prisma.post.create({
      data: {
        userId,
        accountId,
        organizationId,
        content,
        scheduledDate,
        status: 'SCHEDULED',
        createdAt: new Date(),
        postTwitterId: input.postTwitterId || '',
      },
    });
  } catch (error) {
    console.error("Error creating post:", error);
    throw new Error("Failed to create post");
  }
};