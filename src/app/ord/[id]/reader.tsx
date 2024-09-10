"use client";

import { faPause, faPlay, faStop } from "@fortawesome/free-solid-svg-icons";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import { useState, useEffect } from "react";

// Manage the speech synthesis instance and its state
const useSpeechSynthesis = () => {
    const [synth, setSynth] = useState<SpeechSynthesis | null>(null);
    const [isSpeaking, setIsSpeaking] = useState(false);
    const [isPaused, setIsPaused] = useState(false);

    useEffect(() => {
        const speechSynth = window.speechSynthesis;
        setSynth(speechSynth);

        // Reset state when speech ends
        const handleEnd = () => {
            setIsSpeaking(false);
            setIsPaused(false);
        };

        speechSynth.addEventListener("end", handleEnd);

        return () => {
            speechSynth.removeEventListener("end", handleEnd);
        };
    }, []);

    const speak = (text: string) => {
        if (synth) {
            // Cancel any ongoing speech
            synth.cancel();

            // Create a new utterance and speak it
            const utterance = new SpeechSynthesisUtterance(text);
            utterance.onend = () => setIsSpeaking(false); // Reset when speech ends
            synth.speak(utterance);
            setIsSpeaking(true);
            setIsPaused(false);
        }
    };

    const pause = () => {
        if (synth && isSpeaking && !isPaused) {
            synth.pause();
            setIsPaused(true);
        }
    };

    const resume = () => {
        if (synth && isSpeaking && isPaused) {
            synth.resume();
            setIsPaused(false);
        }
    };

    const cancel = () => {
        if (synth) {
            synth.cancel();
            setIsSpeaking(false);
            setIsPaused(false);
        }
    };

    return { speak, pause, resume, cancel, isSpeaking, isPaused };
};

export default function ReadButton({ text }: { text: string }) {
    const { speak, pause, resume, cancel, isSpeaking, isPaused } = useSpeechSynthesis();

    return (
        <div className="reader">
            {/* Show Start button when not speaking */}
            {!isSpeaking && (
                <button className="btn" onClick={() => speak(text)}><FontAwesomeIcon icon={faPlay} style={{marginRight: "0.5rem"}}/> Start</button>
            )}

            {/* Show Pause and Stop buttons while speaking */}
            {isSpeaking && !isPaused && (
                <>
                    <button className="btn btn-orange" onClick={pause}><FontAwesomeIcon icon={faPause} style={{marginRight: "0.5rem"}}/> Pause</button>
                    <button className="btn btn-red" onClick={cancel}><FontAwesomeIcon icon={faStop} style={{marginRight: "0.5rem"}}/> Stop</button>
                </>
            )}

            {/* Show Resume and Stop buttons when paused */}
            {isPaused && (
                <>
                    <button className="btn" onClick={resume}><FontAwesomeIcon icon={faPlay} style={{marginRight: "0.5rem"}}/> Resume</button>
                    <button className="btn btn-red" onClick={cancel}><FontAwesomeIcon icon={faStop} style={{marginRight: "0.5rem"}}/> Stop</button>
                </>
            )}
        </div>
    );
}