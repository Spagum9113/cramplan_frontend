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
        <div className="flex flex-col items-center p-6 rounded-2xl max-w-lg mx-auto border-4 bg-white border-blue-600 shadow-xl">
            <div className="w-full h-24 mb-6 rounded-lg overflow-hidden">
                <BarVisualizer className="w-full h-full" />
            </div>
            <div className="w-full">
                <VoiceAssistantControlBar className="mb-4" />

            </div>
        </div>
    );
}

export default SimpleVoiceAssistant;

