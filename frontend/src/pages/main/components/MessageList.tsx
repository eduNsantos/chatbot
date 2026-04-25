import { useEffect, useState } from "react";
import { Message } from "../@types/types";

export default function MessageList () {
    const [messages, setMessages] = useState<Message[]>([]);

    useEffect(() => {
        setMessages([
            {
                id: '1',
                text: 'Olá, tudo bem?',
                fromMe: false,
                createdAt: new Date(),
                updatedAt: new Date()
            },
            {
                id: '2',
                text: 'Oi! Tudo ótimo, e você?',
                fromMe: true,
                createdAt: new Date(),
                updatedAt: new Date()
            }
        ]);
    }, []);


    return (
        <div className="w-full border border-gray-300 rounded flex flex-col p-5">
            {messages.map((message) => (
                <div key={message.id} className={`p-2 max-w-8/12 ${message.fromMe ? 'bg-blue-100 self-end' : 'bg-gray-100 self-start'}`}>
                    {message.text}
                </div>
            ))}
        </div>
    );

}