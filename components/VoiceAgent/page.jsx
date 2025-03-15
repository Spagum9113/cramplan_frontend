'use client';

import { useState, useCallback } from 'react';
import { LiveKitRoom, RoomAudioRenderer } from '@livekit/components-react';
import "@livekit/components-styles";
import SimpleVoiceAssistant from '../SimpleVoiceAssistant/page';
import LiveKitModal from '../LiveKitModal/page';




export default function VoiceAgent() {
    const [showVoiceChat, setShowVoiceChat] = useState(false);

    const toggleVoiceChat = () => {
        setShowVoiceChat((prev) => !prev);
    };

    return (
        <div>
            {/* Fixed microphone button in the bottom right */}


            <button
                onClick={toggleVoiceChat}
                type="button"
                className="
                fixed bottom-4 right-4 m-2
                w-16 h-16
                flex items-center justify-center
                rounded-full
                border-4 border-blue-600
                bg-white text-blue-600
                focus:outline-none
                transition-all duration-700
             hover:text-white hover:scale-125 hover:bg-white
              "
            >
                <span
                    role="img"
                    aria-label={showVoiceChat ? "close" : "microphone"}
                    className={`text-2xl ${showVoiceChat ? 'hidden' : 'group-hover:hidden'}`}
                >
                    🎤
                </span>
                <span
                    role="img"
                    aria-label="close"
                    className={`text-2xl ${showVoiceChat ? '' : 'hidden group-hover:block'}`}
                >
                    🎤
                </span>
            </button>






            {/* Render the LiveKit modal when active */}
            {showVoiceChat && <LiveKitModal setShowSupport={setShowVoiceChat} />}
        </div>

    );
}
