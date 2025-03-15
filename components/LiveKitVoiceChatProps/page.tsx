'use client';

import { useState, useEffect } from 'react';
import { Room, RoomEvent, LocalParticipant, RemoteParticipant, Track } from 'livekit-client';
import { Button } from "@/components/ui/button";
import { Mic, MicOff } from "lucide-react";

interface LiveKitVoiceChatProps {
    roomName: string;
    userName: string;
}

export default function LiveKitVoiceChat({ roomName, userName }: LiveKitVoiceChatProps) {
    const [isConnected, setIsConnected] = useState(false);
    const [isConnecting, setIsConnecting] = useState(false);
    const [room, setRoom] = useState<Room | null>(null);
    const [error, setError] = useState<string | null>(null);
    const [messages, setMessages] = useState<{ content: string; sender: string }[]>([]);

    const connectToRoom = async () => {
        try {
            setIsConnecting(true);
            setError(null);

            // Get token from your backend
            const response = await fetch('http://localhost:8001/api/get-token', {
                method: 'POST',
                headers: {
                    'Content-Type': 'application/json',
                },
                body: JSON.stringify({
                    room: roomName,
                    username: userName,
                }),
            });

            if (!response.ok) {
                throw new Error('Failed to get token');
            }

            const data = await response.json();
            const token = data.token;

            // Create and connect to the room
            const newRoom = new Room({
                adaptiveStream: true,
                dynacast: true,
                publishDefaults: {
                    simulcast: true,
                    audioPreset: 'music',
                },
            });

            // Set up event listeners
            newRoom.on(RoomEvent.ParticipantConnected, handleParticipantConnected);
            newRoom.on(RoomEvent.ParticipantDisconnected, handleParticipantDisconnected);
            newRoom.on(RoomEvent.TrackSubscribed, handleTrackSubscribed);
            newRoom.on(RoomEvent.TrackUnsubscribed, handleTrackUnsubscribed);
            newRoom.on(RoomEvent.Disconnected, handleDisconnect);
            newRoom.on(RoomEvent.DataReceived, handleDataReceived);

            // Connect to the room
            await newRoom.connect(process.env.NEXT_PUBLIC_LIVEKIT_URL || 'wss://cramplanvoice-ya6mjff9.livekit.cloud', token);

            // Publish audio
            await newRoom.localParticipant.enableAudio();

            setRoom(newRoom);
            setIsConnected(true);

            // Add welcome message
            setMessages(prev => [...prev, {
                content: 'Connected to AI voice assistant. Start speaking to interact.',
                sender: 'system'
            }]);

        } catch (err) {
            console.error('Error connecting to LiveKit:', err);
            setError(err instanceof Error ? err.message : 'Failed to connect to voice chat');
        } finally {
            setIsConnecting(false);
        }
    };

    const disconnectFromRoom = () => {
        if (room) {
            room.disconnect();
            setRoom(null);
            setIsConnected(false);
            setMessages(prev => [...prev, {
                content: 'Disconnected from AI voice assistant.',
                sender: 'system'
            }]);
        }
    };

    const handleParticipantConnected = (participant: RemoteParticipant) => {
        console.log('Participant connected:', participant.identity);
        setMessages(prev => [...prev, {
            content: `${participant.identity} joined the room.`,
            sender: 'system'
        }]);
    };

    const handleParticipantDisconnected = (participant: RemoteParticipant) => {
        console.log('Participant disconnected:', participant.identity);
        setMessages(prev => [...prev, {
            content: `${participant.identity} left the room.`,
            sender: 'system'
        }]);
    };

    const handleTrackSubscribed = (
        track: Track,
        publication: any,
        participant: RemoteParticipant
    ) => {
        console.log('Track subscribed:', track.kind, 'from', participant.identity);

        if (track.kind === 'audio') {
            // Attach audio track to audio element
            const audioElement = new Audio();
            audioElement.srcObject = new MediaStream([track.mediaStreamTrack]);
            audioElement.play();
        }
    };

    const handleTrackUnsubscribed = (
        track: Track,
        publication: any,
        participant: RemoteParticipant
    ) => {
        console.log('Track unsubscribed:', track.kind, 'from', participant.identity);
    };

    const handleDisconnect = () => {
        console.log('Disconnected from room');
        setIsConnected(false);
        setRoom(null);
    };

    const handleDataReceived = (payload: Uint8Array, participant?: RemoteParticipant) => {
        try {
            const data = JSON.parse(new TextDecoder().decode(payload));
            if (data.type === 'chat' && data.message) {
                setMessages(prev => [...prev, {
                    content: data.message,
                    sender: participant?.identity || 'AI Assistant'
                }]);
            }
        } catch (err) {
            console.error('Error parsing data message:', err);
        }
    };

    // Clean up on unmount
    useEffect(() => {
        return () => {
            if (room) {
                room.disconnect();
            }
        };
    }, [room]);

    const toggleConnection = () => {
        if (isConnected) {
            disconnectFromRoom();
        } else {
            connectToRoom();
        }
    };

    return (
        <div className="flex flex-col h-full">
            <div className="flex-1 overflow-y-auto p-4 space-y-4">
                {messages.map((message, index) => (
                    <div key={index} className="p-3 rounded-lg bg-gray-100">
                        <p className="font-semibold">{message.sender}</p>
                        <p>{message.content}</p>
                    </div>
                ))}
                {error && (
                    <div className="p-3 rounded-lg bg-red-100 text-red-800">
                        <p className="font-semibold">Error</p>
                        <p>{error}</p>
                    </div>
                )}
            </div>

            <div className="p-4 flex justify-center">
                <Button
                    onClick={toggleConnection}
                    disabled={isConnecting}
                    className={`w-16 h-16 rounded-full ${isConnected ? 'bg-red-500 hover:bg-red-600' : 'bg-blue-500 hover:bg-blue-600'
                        }`}
                >
                    {isConnected ? (
                        <MicOff className="h-8 w-8" />
                    ) : (
                        <Mic className="h-8 w-8" />
                    )}
                </Button>
            </div>
        </div>
    );
}