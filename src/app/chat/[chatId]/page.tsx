/*
import { getUser } from "@/lib/lucia";
import { redirect } from "next/navigation";
import { Roles } from "@prisma/client";
import AdminLayout from "@/components/admin/adminlayout";
import ActiveChatComponent from "@/components/chat/activeChat";
import ConnectedChat from "@/components/chat/connectedChat";

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
  ];

  if (user.role === Roles.USER) {
    return (
      <main className="flex flex-col items-center justify-center">
        <AdminLayout
          userProps={{
            picture: user.picture!,
            email: user.email,
            name: user.name,
          }}
        >
          <ActiveChatComponent chats={fakeChats}>
            <ConnectedChat />
          </ActiveChatComponent>
        </AdminLayout>
      </main>
    );
  } else if (user.role === Roles.NEW_USER) {
    redirect("/newuser");
  }
}

*/
