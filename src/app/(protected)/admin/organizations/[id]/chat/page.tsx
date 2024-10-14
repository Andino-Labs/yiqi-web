import { getUser } from "@/lib/auth/lucia";
import { redirect } from "next/navigation";
import { Roles } from "@prisma/client";
import AdminLayout from "@/components/chat/adminLayout";
import ChatComponent from "@/components/chat/chat";

export default async function Page() {
  const user = await getUser();

  if (!user) {
    redirect("/auth");
  }

  const fakeChats = [
    {
      name: "John Doe",
      message:
        "Hey, how are you doing today? I wanted to discuss something important.",
      messageSlug: "chat-1",
    },
    {
      name: "Jane Smith",
      message:
        "Don't forget about the meeting at 10 AM. We need to cover the project timeline.",
      messageSlug: "chat-2",
    },
    {
      name: "Alice Johnson",
      message: "Can you review the code changes I pushed to the repository?",
      messageSlug: "chat-3",
    },
    {
      name: "Bob Williams",
      message:
        "Let’s grab coffee tomorrow. It’s been a while since we caught up!",
      messageSlug: "chat-4",
    },
    {
      name: "Eve Brown",
      message:
        "I’ve been thinking about some new ideas for the marketing strategy.",
      messageSlug: "chat-5",
    },

    {
      name: "John Doe",
      message:
        "Hey, how are you doing today? I wanted to discuss something important.",
      messageSlug: "chat-6",
    },
    {
      name: "Jane Smith",
      message:
        "Don't forget about the meeting at 10 AM. We need to cover the project timeline.",
      messageSlug: "chat-7",
    },
    {
      name: "Alice Johnson",
      message: "Can you review the code changes I pushed to the repository?",
      messageSlug: "chat-8",
    },
    {
      name: "Bob Williams",
      message:
        "Let’s grab coffee tomorrow. It’s been a while since we caught up!",
      messageSlug: "chat-9",
    },
    {
      name: "Eve Brown",
      message:
        "I’ve been thinking about some new ideas for the marketing strategy.",
      messageSlug: "chat-10",
    },

    {
      name: "John Doe",
      message:
        "Hey, how are you doing today? I wanted to discuss something important.",
      messageSlug: "chat-6",
    },
    {
      name: "Jane Smith",
      message:
        "Don't forget about the meeting at 10 AM. We need to cover the project timeline.",
      messageSlug: "chat-7",
    },
    {
      name: "Alice Johnson",
      message: "Can you review the code changes I pushed to the repository?",
      messageSlug: "chat-8",
    },
    {
      name: "Bob Williams",
      message:
        "Let’s grab coffee tomorrow. It’s been a while since we caught up!",
      messageSlug: "chat-9",
    },
    {
      name: "Eve Brown",
      message:
        "I’ve been thinking about some new ideas for the marketing strategy.",
      messageSlug: "chat-10",
    },
  ];

  if (user.role === Roles.ADMIN) {
    return (
      <main className="flex flex-col items-center justify-center">
        <AdminLayout
          userProps={{
            picture: user.picture!,
            email: user.email,
            name: user.name,
          }}
        >
          <ChatComponent chats={fakeChats} />
        </AdminLayout>
      </main>
    );
  } else if (user.role === Roles.NEW_USER) {
    redirect("/newuser");
  } else if (user.role == Roles.ANDINO_ADMIN) {
    redirect("/andino-admin");
  } else if (user.role === Roles.USER) {
    redirect("/user");
  }
}
