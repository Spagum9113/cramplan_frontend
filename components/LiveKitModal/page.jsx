'use client';

import { useState, useCallback } from 'react';
import { LiveKitRoom, RoomAudioRenderer } from '@livekit/components-react';
import "@livekit/components-styles";
import SimpleVoiceAssistant from '../SimpleVoiceAssistant/page';

const LiveKitModal = ({ setShowSupport }) => {
    const [isSubmittingName, setIsSubmittingName] = useState(true);
    const [name, setName] = useState('');
    const handleSubmitName = (e) => {
        e.preventDefault();
        setIsSubmittingName(false);
    }

    return (
        <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50 p-4">
            <div className="bg-white rounded-lg shadow-xl w-full max-w-md overflow-hidden">
                <div className="p-6">
                    {isSubmittingName ? (
                        <form onSubmit={handleSubmitName} className="space-y-4">
                            <h1 className="text-2xl font-bold text-gray-800">Enter your name</h1>
                            <input
                                type="text"
                                value={name}
                                onChange={(e) => setName(e.target.value)}
                                placeholder="Your name"
                                required
                                className="w-full px-4 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
                            />
                            <div className="flex space-x-3">
                                <button
                                    type="submit"
                                    className="px-4 py-2 bg-blue-500 text-white rounded-md hover:bg-blue-600 transition-colors flex-1"
                                >
                                    Connect
                                </button>
                                <button
                                    type="button"
                                    onClick={() => setShowSupport(false)}
                                    className="px-4 py-2 bg-gray-200 text-gray-800 rounded-md hover:bg-gray-300 transition-colors flex-1"
                                >
                                    Cancel
                                </button>
                            </div>
                        </form>
                    ) : (
                        <div className="h-[500px]">
                            <LiveKitRoom
                                serverUrl={process.env.NEXT_PUBLIC_LIVEKIT_URL || ""}
                                token="eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJleHAiOjE3NDIwNTI4NjgsImlzcyI6IkFQSWNVM25TcW51eDlnZCIsIm5iZiI6MTc0MjA1MTk2OCwic3ViIjoibWF4IiwidmlkZW8iOnsiY2FuUHVibGlzaCI6dHJ1ZSwiY2FuUHVibGlzaERhdGEiOnRydWUsImNhblN1YnNjcmliZSI6dHJ1ZSwicm9vbSI6InJvb20xIiwicm9vbUpvaW4iOnRydWV9fQ.Au0FMVMAEE72tFPchXgettoxZqhSK75vfGuUnxm15HI"
                                connect={true}
                                video={false}
                                audio={true}
                                onDisconnected={() => {
                                    setShowSupport(false);
                                    setIsSubmittingName(true);
                                }}
                            >
                                <div className="relative h-full">
                                    <RoomAudioRenderer />
                                    <SimpleVoiceAssistant />

                                    <button
                                        onClick={() => setShowSupport(false)}
                                        className="absolute top-2 right-2 bg-red-500 text-white p-2 rounded-full hover:bg-red-600"
                                    >
                                        ✕
                                    </button>
                                </div>
                            </LiveKitRoom>
                        </div>
                    )}
                </div>
            </div>
        </div>
    );
}

export default LiveKitModal;