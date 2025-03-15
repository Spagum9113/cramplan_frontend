'use client';

import { useState } from 'react';
import dynamic from 'next/dynamic';
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from '@/components/ui/card';

// Dynamically import the LiveKitVoiceChat component to avoid SSR issues
const LiveKitVoiceChat = dynamic(
    () => import('@/components/LiveKitVoiceChat'),
    { ssr: false }
);

export default function VoiceChatPage() {
    // Generate a random room name and username if needed
    const [roomName] = useState(`room-${Math.floor(Math.random() * 100000)}`);
    const [userName] = useState(`user-${Math.floor(Math.random() * 100000)}`);

    return (
        <div className="container max-w-4xl py-8">
            <Card className="mb-6">
                <CardHeader>
                    <CardTitle>AI Voice Assistant</CardTitle>
                    <CardDescription>
                        Click the microphone button to start or stop the voice chat.
                        <div className="text-xs mt-1 text-gray-500">
                            Room: {roomName} | User: {userName}
                        </div>
                    </CardDescription>
                </CardHeader>
                <CardContent className="h-[500px]">
                    <LiveKitVoiceChat roomName={roomName} userName={userName} />
                </CardContent>
            </Card>
        </div>
    );
} 