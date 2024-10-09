"use client";

import { useState, useEffect, useRef } from "react";
import {
  CardContent,
  CardFooter,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { ScrollArea } from "@/components/ui/scroll-area";
import { Avatar, AvatarFallback } from "@/components/ui/avatar";
import { Textarea } from "../ui/textarea";

type Message = {
  id: string;
  sender: string;
  content: string;
  timestamp: string;
};

function ChatCard({ message }: { message: Message }) {
  const isCurrentUser = message.sender === "You";

  return (
    <div
      className={`flex ${isCurrentUser ? "justify-end" : "justify-start"} mb-4`}
    >
      <div
        className={`flex ${isCurrentUser ? "flex-row-reverse" : "flex-row"} items-start`}
      >
        <Avatar className="w-8 h-8">
          <AvatarFallback>{message.sender[0]}</AvatarFallback>
        </Avatar>
        <div className={`mx-2 ${isCurrentUser ? "text-right" : "text-left"}`}>
          <div className="text-sm text-muted-foreground">{message.sender}</div>
          <div
            className={`mt-1 rounded-lg p-2 ${isCurrentUser ? "bg-primary text-primary-foreground" : "bg-secondary"}`}
          >
            {message.content}
          </div>
          <div className="text-xs text-muted-foreground mt-1">
            {new Date(message.timestamp).toLocaleTimeString()}
          </div>
        </div>
      </div>
    </div>
  );
}

export default function ConnectedChat() {
  const [messages, setMessages] = useState<Message[]>([]);
  const [inputMessage, setInputMessage] = useState("");
  const socketRef = useRef<WebSocket | null>(null);
  const scrollAreaRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    socketRef.current = new WebSocket("wss://your-websocket-server-url");

    socketRef.current.onopen = () => {
      console.log("WebSocket connection established");
    };

    socketRef.current.onmessage = (event) => {
      const message = JSON.parse(event.data);
      setMessages((prevMessages) => [...prevMessages, message]);
    };

    socketRef.current.onclose = () => {
      console.log("WebSocket connection closed");
    };

    return () => {
      if (socketRef.current) {
        socketRef.current.close();
      }
    };
  }, []);

  useEffect(() => {
    // Scroll to bottom when new messages are added
    if (scrollAreaRef.current) {
      scrollAreaRef.current.scrollTop = scrollAreaRef.current.scrollHeight;
    }
  }, [messages]);

  const sendMessage = () => {
    if (inputMessage.trim() && socketRef.current) {
      const newMessage: Message = {
        id: Date.now().toString(),
        sender: "You", // Replace with actual user name or ID
        content: inputMessage,
        timestamp: new Date().toISOString(),
      };
      socketRef.current.send(JSON.stringify(newMessage));
      setInputMessage("");
    }
  };

  return (
    <>
      <CardHeader>
        <CardTitle>Chat Room</CardTitle>
      </CardHeader>
      <CardContent>
        <ScrollArea className="h-[400px] pr-4" ref={scrollAreaRef}>
          {messages.map((message) => (
            <ChatCard key={message.id} message={message} />
          ))}
        </ScrollArea>
      </CardContent>
      <CardFooter>
        <form
          onSubmit={(e) => {
            e.preventDefault();
            sendMessage();
          }}
          className="flex w-full gap-2"
        >
          <Textarea
            placeholder="Type a message..."
            value={inputMessage}
            onChange={(e) => setInputMessage(e.target.value)}
            className="flex-grow"
          />
          <Button type="submit">Send</Button>
        </form>
      </CardFooter>
    </>
  );
}
