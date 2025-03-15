'use client';

import {
    ControlBar,
    GridLayout,
    LiveKitRoom,
    ParticipantTile,
    RoomAudioRenderer,
    useTracks,
} from '@livekit/components-react';

import '@livekit/components-styles';

import { useEffect, useState } from 'react';
import { Track } from 'livekit-client';
import LiveKitModal from '../LiveKitModal/page';



export default function AIVoiceAgent() {
    const [showSupport, setShowSupport] = useState(false);
    const handleSupportClick = () => {
        setShowSupport(true);
    }


    return (
        <div className="max-w-4xl mx-auto p-6 bg-white rounded-lg shadow-md">
            <header className="mb-8 border-b pb-4">
                <h1 className="text-3xl font-bold text-gray-800">AIVoiceAgent</h1>
            </header>


            <main className="space-y-6">
                <section className="bg-gray-50 p-4 rounded-lg">
                    <h1 className="text-xl font-semibold text-gray-700"> Just testing </h1>
                </section>

                <button
                    onClick={handleSupportClick}
                    className="bg-blue-500 hover:bg-blue-600 text-white font-medium py-3 px-6 rounded-lg transition-colors shadow-sm flex items-center justify-center"
                >
                    Speak to Crammie AI!
                </button>
            </main>

            {showSupport && <LiveKitModal setShowSupport={setShowSupport} />}
        </div>
    );
}
