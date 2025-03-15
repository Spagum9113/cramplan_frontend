import {
    useVoiceAssistant,
    BarVisualizer,
    VoiceAssistantControlBar,
    useTrackTranscription,
    useLocalParticipant
} from '@livekit/components-react';
import { Track } from "livekit-client";
import { useEffect, useState } from 'react';

const SimpleVoiceAssistant = () => {
    return (
        <div className="flex flex-col items-center p-6 bg-gray-50 rounded-lg shadow-md max-w-md mx-auto">
            <div className="w-full h-24 mb-6 bg-gray-100 rounded-lg overflow-hidden">
                <BarVisualizer className="w-full h-full" />
            </div>
            <div className="w-full">
                <VoiceAssistantControlBar className="mb-4" />
                <div className="bg-white p-4 rounded-lg shadow-sm h-64 overflow-y-auto">
                    {/* Conversation content will go here */}
                </div>
            </div>
        </div>
    );
}

export default SimpleVoiceAssistant;

