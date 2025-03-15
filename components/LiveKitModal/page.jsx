'use client';

import { useEffect } from 'react';
import { LiveKitRoom, RoomAudioRenderer } from '@livekit/components-react';
import "@livekit/components-styles";
import SimpleVoiceAssistant from '../SimpleVoiceAssistant/page';

const LiveKitModal = ({ setShowSupport }) => {
    // Optionally, you can remove any connection state if it's no longer needed.
    // The modal will directly render the LiveKitRoom component to connect automatically.

    return (
        // Full-screen overlay with a semi-transparent black background,
        // centering the modal in the middle of the viewport.
        <div className="fixed inset-0 flex items-center justify-center p-4">
            {/* Modal container with a blue border, centered in the viewport */}
            <div className=" rounded-2xl w-[600px] overflow-hidden">
                <div className="p-4">
                    {/* Container for the voice chat interface */}
                    <div className="h-[350px]">
                        <LiveKitRoom
                            serverUrl={process.env.NEXT_PUBLIC_LIVEKIT_URL || ""}
                            token="eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJleHAiOjE3NDIwNzI0MzcsImlzcyI6IkFQSWNVM25TcW51eDlnZCIsIm5iZiI6MTc0MjA2MzQzNywic3ViIjoiciIsInZpZGVvIjp7ImNhblB1Ymxpc2giOnRydWUsImNhblB1Ymxpc2hEYXRhIjp0cnVlLCJjYW5TdWJzY3JpYmUiOnRydWUsInJvb20iOiJyIiwicm9vbUpvaW4iOnRydWV9fQ.65NeVfBkAd849gCZHRdgNJFWOjx40X_XMt55H0uAw2A" // Replace with a secure token in production
                            connect={true}
                            video={false}
                            audio={true}
                            onDisconnected={() => setShowSupport(false)}
                        >
                            <div className="relative h-full flex flex-col items-center justify-center">
                                {/* Renders the audio from the room */}
                                <RoomAudioRenderer />
                                {/* Displays the AI voice assistant's interactive speech bar */}
                                <SimpleVoiceAssistant />
                            </div>
                        </LiveKitRoom>
                    </div>
                </div>
            </div>
        </div >
    );
};

export default LiveKitModal;