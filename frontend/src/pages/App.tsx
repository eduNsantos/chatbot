import { useEffect, useState } from "react";
import api from "../utils/api";
import realtimeSocket from "../utils/realtime";

const SESSION_ID = '4fd0f43a-5ec0-4903-90c9-cc4e3da9927f';

interface ApiContact {
    id: number;
    sessionId: string;
    whatsappId: string;
    whatsappNumber: string;
    pictureUrl: string | null;
    name: string;
    isGroup: boolean;
    lastMessageAt?: string | null;
}

interface Contact {
    id: string;
    name: string;
    phone: string;
    lastMessage: string;
    date: string;
    hasIA: boolean;
    avatarColor: string;
    whatsappId: string;
    lastMessageAt: string | null;
}

interface Message {
    id: string;
    content: string;
    fromMe: boolean;
    createdAt: string;
}

interface MessageNotification {
    contactId: number;
    sessionId: string;
    message: string;
    fromMe: boolean;
    type: string;
    key: string;
    createdAt: string;
}

interface ContactNotification {
    id: number;
    sessionId: string;
    whatsappId: string;
    whatsappNumber: string | null;
    pictureUrl: string | null;
    name: string | null;
    isGroup: boolean;
    lastMessageAt: string | null;
    createdAt: string;
    updatedAt: string;
}

const AVATAR_COLORS = ['#e57373', '#42a5f5', '#ab47bc', '#26a69a', '#ff7043', '#66bb6a', '#ffa726', '#8d6e63'];

function toContact(c: ApiContact): Contact {
    const lastMessageAt = c.lastMessageAt ?? null;

    return {
        id: String(c.id),
        name: c.name?.trim() || c.whatsappNumber,
        phone: c.whatsappNumber,
        lastMessage: '',
        date: formatTime(lastMessageAt),
        hasIA: false,
        avatarColor: AVATAR_COLORS[c.id % AVATAR_COLORS.length],
        whatsappId: c.whatsappId,
        lastMessageAt,
    };
}

function formatTime(value: string | null): string {
    if (!value) {
        return '';
    }

    return new Date(value).toLocaleTimeString('pt-BR', { hour: '2-digit', minute: '2-digit' });
}

function sortContactsByLastMessage(contacts: Contact[]): Contact[] {
    return [...contacts].sort((left, right) => {
        const leftTime = left.lastMessageAt ? new Date(left.lastMessageAt).getTime() : 0;
        const rightTime = right.lastMessageAt ? new Date(right.lastMessageAt).getTime() : 0;

        if (rightTime !== leftTime) {
            return rightTime - leftTime;
        }

        return Number(right.id) - Number(left.id);
    });
}

function upsertContact(currentContacts: Contact[], incoming: Contact): Contact[] {
    const nextContacts = currentContacts.filter(contact => contact.id !== incoming.id);
    nextContacts.push(incoming);

    return sortContactsByLastMessage(nextContacts);
}


function Avatar({ name, color, size = 40 }: { name: string; color: string; size?: number }) {
    const initials = name.split(' ').map(n => n[0]).slice(0, 1).join('').toUpperCase();
    return (
        <div
            style={{ width: size, height: size, backgroundColor: color, borderRadius: '50%', flexShrink: 0 }}
            className="flex items-center justify-center text-white font-semibold text-sm"
        >
            {initials}
        </div>
    );
}

function Toggle({ checked, onChange }: { checked: boolean; onChange: () => void }) {
    return (
        <button
            onClick={onChange}
            className={`relative inline-flex items-center w-11 h-6 rounded-full transition-colors ${checked ? 'bg-gray-400' : 'bg-green-500'}`}
        >
            <span
                className={`inline-block w-4 h-4 bg-white rounded-full shadow transform transition-transform ${checked ? 'translate-x-6' : 'translate-x-1'}`}
            />
        </button>
    );
}

export default function App() {
    const [contacts, setContacts] = useState<Contact[]>([]);
    const [loadingContacts, setLoadingContacts] = useState(true);
    const [selectedContactId, setSelectedContactId] = useState<string | null>(null);
    const [search, setSearch] = useState('');
    const [iaEnabled, setIaEnabled] = useState(false);
    const [messageText, setMessageText] = useState('');
    const [prompt, setPrompt] = useState('Você é um assistente atencioso. Responda de forma curta, educada e em português.');
    const [messages, setMessages] = useState<Message[]>([]);

    const selectedContact = contacts.find(c => c.id === selectedContactId);

    useEffect(() => {
        function fetchContacts() {
            api.get<ApiContact[]>(`/sessions/${SESSION_ID}/contacts`)
                .then(res => {
                    const filtered = res.data.filter(c => !c.isGroup && c.whatsappNumber !== 'status');
                    const nextContacts = sortContactsByLastMessage(filtered.map(toContact));
                    setContacts(nextContacts);
                    if (nextContacts.length > 0) setSelectedContactId(String(nextContacts[0].id));
                })
                .finally(() => setLoadingContacts(false));

        }

        function fetchPrompt() {
            api.get<{ config: {
                prompt: string
            } }>(`/sessions/${SESSION_ID}/agent`).then(res => {
                setPrompt(res.data.config.prompt);
                // setPrompt(res.data.prompt);
            });
        }

        fetchContacts();
        fetchPrompt();

    }, []);

    useEffect(() => {

        if (!selectedContactId) {
            return;
        }

        api.get(`/sessions/${SESSION_ID}/message/${selectedContactId}`).then(res => {
            const msgs: Message[] = res.data.map((m: any) => ({
                id: String(m.id),
                content: m.content,
                fromMe: m.fromMe,
                createdAt: new Date(m.createdAt).toLocaleTimeString('pt-BR', { hour: '2-digit', minute: '2-digit' }),
            }));
            setMessages(msgs);
        });
    }, []);

    useEffect(() => {
        realtimeSocket.emit('session:join', SESSION_ID);

        const handleContactUpsert = (payload: ContactNotification) => {
            if (payload.sessionId !== SESSION_ID || payload.isGroup || payload.whatsappNumber === 'status') {
                return;
            }

            const incomingContact: Contact = {
                id: String(payload.id),
                name: payload.name?.trim() || payload.whatsappNumber || payload.whatsappId,
                phone: payload.whatsappNumber || payload.whatsappId,
                lastMessage: '',
                date: formatTime(payload.lastMessageAt),
                hasIA: false,
                avatarColor: AVATAR_COLORS[payload.id % AVATAR_COLORS.length],
                whatsappId: payload.whatsappId,
                lastMessageAt: payload.lastMessageAt,
            };

            setContacts(prev => {
                const nextContacts = upsertContact(prev, incomingContact);

                if (!selectedContactId && nextContacts.length > 0) {
                    setSelectedContactId(nextContacts[0].id);
                }

                return nextContacts;
            });
        };

        const handleSessionMessage = (payload: MessageNotification) => {
            if (payload.sessionId !== SESSION_ID) {
                return;
            }

            setContacts(prev => {
                const current = prev.find(contact => contact.id === String(payload.contactId));

                if (!current) {
                    return prev;
                }

                return upsertContact(prev, {
                    ...current,
                    lastMessage: payload.message,
                    date: formatTime(payload.createdAt),
                    lastMessageAt: payload.createdAt,
                });
            });
        };

        realtimeSocket.on('session:contact:upsert', handleContactUpsert);
        realtimeSocket.on('session:message:new', handleSessionMessage);

        return () => {
            realtimeSocket.emit('session:leave', SESSION_ID);
            realtimeSocket.off('session:contact:upsert', handleContactUpsert);
            realtimeSocket.off('session:message:new', handleSessionMessage);
        };
    }, [selectedContactId]);

    useEffect(() => {
        if (!selectedContactId) {
            return;
        }

        const numericContactId = Number(selectedContactId);
        realtimeSocket.emit('contact:join', numericContactId);

        const handleNewMessage = (payload: MessageNotification) => {
            if (payload.contactId !== numericContactId) {
                return;
            }

            setMessages(prev => [
                ...prev,
                {
                    id: payload.key,
                    content: payload.message,
                    fromMe: payload.fromMe,
                    createdAt: new Date(payload.createdAt).toLocaleTimeString('pt-BR', { hour: '2-digit', minute: '2-digit' }),
                }
            ]);
        };

        realtimeSocket.on('message:new', handleNewMessage);

        return () => {
            realtimeSocket.emit('contact:leave', numericContactId);
            realtimeSocket.off('message:new', handleNewMessage);
        };
    }, [selectedContactId]);

    const filteredContacts = contacts.filter(c =>
        c.name.toLowerCase().includes(search.toLowerCase())
    );

    async function handleSendMessage() {
        if (!messageText.trim() || !selectedContact) {
            return;
        }

        await api.post(`/sessions/${SESSION_ID}/message`, {
            message: messageText.trim(),
            to: contacts.find(c => c.id === selectedContactId)?.whatsappId,
            type: 'person'
        });

        setMessageText('');
    }

    function updateAgentPrompt(newPrompt: string) {
        api.put(`/sessions/${SESSION_ID}/agent`, {
            prompt: newPrompt
        });
    }

    return (
        <div className="flex flex-col h-screen bg-gray-100">
            {/* Header */}
            <header className="flex items-center gap-3 px-5 py-3 bg-white border-b border-gray-200 shadow-sm">
                <div className="flex items-center justify-center w-9 h-9 rounded-full bg-green-500 text-white">
                    <svg viewBox="0 0 24 24" fill="currentColor" className="w-5 h-5">
                        <path d="M17.472 14.382c-.297-.149-1.758-.867-2.03-.967-.273-.099-.471-.148-.67.15-.197.297-.767.966-.94 1.164-.173.199-.347.223-.644.075-.297-.15-1.255-.463-2.39-1.475-.883-.788-1.48-1.761-1.653-2.059-.173-.297-.018-.458.13-.606.134-.133.298-.347.446-.52.149-.174.198-.298.298-.497.099-.198.05-.371-.025-.52-.075-.149-.669-1.612-.916-2.207-.242-.579-.487-.5-.669-.51-.173-.008-.371-.01-.57-.01-.198 0-.52.074-.792.372-.272.297-1.04 1.016-1.04 2.479 0 1.462 1.065 2.875 1.213 3.074.149.198 2.096 3.2 5.077 4.487.709.306 1.262.489 1.694.625.712.227 1.36.195 1.871.118.571-.085 1.758-.719 2.006-1.413.248-.694.248-1.289.173-1.413-.074-.124-.272-.198-.57-.347z"/>
                        <path d="M12 0C5.373 0 0 5.373 0 12c0 2.122.554 4.11 1.523 5.83L0 24l6.338-1.498A11.943 11.943 0 0012 24c6.627 0 12-5.373 12-12S18.627 0 12 0zm0 21.818a9.818 9.818 0 01-5.006-1.373l-.36-.213-3.727.88.936-3.629-.233-.373A9.818 9.818 0 1112 21.818z"/>
                    </svg>
                </div>
                <span className="text-lg font-bold text-gray-800">WhatsApp + IA</span>
                <span className="text-xs font-semibold bg-gray-200 text-gray-600 px-2 py-0.5 rounded">DEMO</span>
            </header>

            {/* Body */}
            <div className="flex flex-1 overflow-hidden">
                {/* Left: Conversations */}
                <div className="w-72 flex flex-col border-r border-gray-200 bg-white">
                    <div className="p-4 border-b border-gray-100">
                        <h2 className="text-base font-semibold text-gray-800 mb-3">Conversas</h2>
                        <div className="relative">
                            <svg className="absolute left-3 top-1/2 -translate-y-1/2 text-gray-400 w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M21 21l-4.35-4.35M17 11A6 6 0 115 11a6 6 0 0112 0z" />
                            </svg>
                            <input
                                type="text"
                                placeholder="Buscar..."
                                value={search}
                                onChange={e => setSearch(e.target.value)}
                                className="w-full pl-9 pr-3 py-2 text-sm bg-gray-100 rounded-full border-none outline-none placeholder-gray-400"
                            />
                        </div>
                    </div>

                    <div className="flex-1 overflow-y-auto">
                        {loadingContacts ? (
                            <div className="flex items-center justify-center py-10 text-sm text-gray-400">Carregando...</div>
                        ) : filteredContacts.map(contact => (
                            <div
                                key={contact.id}
                                onClick={() => setSelectedContactId(contact.id)}
                                className={`flex items-center gap-3 px-4 py-3 cursor-pointer border-b border-gray-50 hover:bg-gray-50 transition-colors ${selectedContactId === contact.id ? 'bg-green-50' : ''}`}
                            >
                                <Avatar name={contact.name} color={contact.avatarColor} />
                                <div className="flex-1 min-w-0">
                                    <div className="flex items-center justify-between">
                                        <span className="text-sm font-semibold text-gray-800 truncate">{contact.name}</span>
                                        <span className="text-xs text-gray-400 ml-2 shrink-0">{contact.date}</span>
                                    </div>
                                    <div className="flex items-center justify-between mt-0.5">
                                        <span className="text-xs text-gray-500 truncate">{contact.lastMessage}</span>
                                        {contact.hasIA && (
                                            <span className="ml-2 shrink-0 text-xs font-semibold bg-green-500 text-white px-1.5 py-0.5 rounded">IA</span>
                                        )}
                                    </div>
                                </div>
                            </div>
                        ))}
                    </div>
                </div>
                <div className="flex-1 flex flex-col">
                    {selectedContact ? (
                        <>
                            {/* Chat header */}
                            <div className="flex items-center gap-3 px-5 py-3 bg-white border-b border-gray-200">
                                <Avatar name={selectedContact.name} color={selectedContact.avatarColor} size={42} />
                                <div className="flex-1">
                                    <p className="text-sm font-semibold text-gray-800">{selectedContact.name}</p>
                                    <p className="text-xs text-gray-500">{selectedContact.phone}</p>
                                </div>
                                <div className="flex items-center gap-4 text-gray-500">
                                    <div className="flex items-center gap-2">
                                        <svg className="w-4 h-4 text-green-500" viewBox="0 0 24 24" fill="currentColor">
                                            <path d="M12 2C6.48 2 2 6.48 2 12s4.48 10 10 10 10-4.48 10-10S17.52 2 12 2zm0 18c-4.41 0-8-3.59-8-8s3.59-8 8-8 8 3.59 8 8-3.59 8-8 8zm-1-13h2v6h-2zm0 8h2v2h-2z"/>
                                        </svg>
                                        <span className="text-xs text-gray-600 font-medium">IA automática</span>
                                        <Toggle checked={iaEnabled} onChange={() => setIaEnabled(v => !v)} />
                                    </div>
                                    <button className="hover:text-gray-700">
                                        <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M3 5a2 2 0 012-2h3.28a1 1 0 01.948.684l1.498 4.493a1 1 0 01-.502 1.21l-2.257 1.13a11.042 11.042 0 005.516 5.516l1.13-2.257a1 1 0 011.21-.502l4.493 1.498a1 1 0 01.684.949V19a2 2 0 01-2 2h-1C9.716 21 3 14.284 3 6V5z"/>
                                        </svg>
                                    </button>
                                    <button className="hover:text-gray-700">
                                        <svg className="w-5 h-5" fill="currentColor" viewBox="0 0 24 24">
                                            <path d="M12 8c1.1 0 2-.9 2-2s-.9-2-2-2-2 .9-2 2 .9 2 2 2zm0 2c-1.1 0-2 .9-2 2s.9 2 2 2 2-.9 2-2-.9-2-2-2zm0 6c-1.1 0-2 .9-2 2s.9 2 2 2 2-.9 2-2-.9-2-2-2z"/>
                                        </svg>
                                    </button>
                                </div>
                            </div>

                            {/* Messages area */}
                            <div className="flex-1 overflow-y-auto p-5" style={{ backgroundColor: '#e8f5e1' }}>
                                <div className="flex flex-col gap-2">
                                    {!messages ? <></> : messages.map(msg => (
                                        <div key={msg.id} className={`flex ${msg.fromMe ? 'justify-end' : 'justify-start'}`}>
                                            <div className={`max-w-xs px-3 py-2 rounded-lg shadow-sm text-sm ${msg.fromMe ? 'bg-[#dcf8c6]' : 'bg-white'}`}>
                                                <span>{msg.content}</span>
                                                <span className="text-xs text-gray-400 ml-2">{msg.createdAt}</span>
                                            </div>
                                        </div>
                                    ))}
                                </div>
                            </div>

                            {/* Message input */}
                            <div className="flex items-center gap-2 px-4 py-3 bg-white border-t border-gray-200">
                                <input
                                    type="text"
                                    placeholder="Digite uma mensagem..."
                                    value={messageText}
                                    onChange={e => setMessageText(e.target.value)}
                                    onKeyDown={e => e.key === 'Enter' && handleSendMessage()}
                                    className="flex-1 px-4 py-2 text-sm bg-gray-100 rounded-full outline-none placeholder-gray-400"
                                />
                                <button
                                    onClick={handleSendMessage}
                                    className="w-9 h-9 flex items-center justify-center bg-green-500 text-white rounded-full hover:bg-green-600 transition-colors"
                                >
                                    <svg className="w-4 h-4" fill="currentColor" viewBox="0 0 24 24">
                                        <path d="M2.01 21L23 12 2.01 3 2 10l15 2-15 2z"/>
                                    </svg>
                                </button>
                            </div>
                        </>
                    ) : (
                        <div className="flex-1 flex items-center justify-center text-gray-400 text-sm">
                            Selecione uma conversa
                        </div>
                    )}
                </div>

                {/* Right: IA Prompt */}
                <div className="w-72 flex flex-col border-l border-gray-200 bg-white">
                    <div className="p-5 border-b border-gray-100">
                        <div className="flex items-center gap-2 mb-1">
                            <svg className="w-5 h-5 text-green-500" viewBox="0 0 24 24" fill="currentColor">
                                <path d="M12 2a2 2 0 012 2c0 .74-.4 1.39-1 1.73V7h1a7 7 0 017 7h1a1 1 0 010 2h-1v1a2 2 0 01-2 2H5a2 2 0 01-2-2v-1H2a1 1 0 010-2h1a7 7 0 017-7h1V5.73A2 2 0 0110 4a2 2 0 012-2zm0 7a5 5 0 00-5 5v3h10v-3a5 5 0 00-5-5z"/>
                            </svg>
                            <h3 className="text-sm font-semibold text-gray-800">Prompt da IA</h3>
                        </div>
                        <p className="text-xs text-gray-500">Define como a IA deve responder mensagens recebidas.</p>
                    </div>
                    <div className="flex-1 flex flex-col p-4 gap-3">
                        <textarea
                            value={prompt}
                            onChange={e => setPrompt(e.target.value)}
                            className="flex-1 resize-none text-sm text-gray-700 border border-gray-200 rounded-lg p-3 outline-none focus:border-green-400 transition-colors"
                            placeholder="Escreva o prompt da IA aqui..."
                        />
                        <button
                            onClick={() => updateAgentPrompt(prompt)}
                            className="flex items-center justify-center gap-2 w-full py-2.5 bg-green-500 text-white text-sm font-semibold rounded-lg hover:bg-green-600 transition-colors"
                        >
                            <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M8 7H5a2 2 0 00-2 2v9a2 2 0 002 2h14a2 2 0 002-2V9a2 2 0 00-2-2h-3m-1 4l-3 3m0 0l-3-3m3 3V4"/>
                            </svg>
                            Salvar prompt
                        </button>
                    </div>
                </div>
            </div>
        </div>
    );
}