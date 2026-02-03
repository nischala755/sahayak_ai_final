import { useState, useEffect, useCallback } from 'react';

export function useVoiceInput(options = {}) {
    const { language = 'hi-IN', continuous = false, onResult } = options;

    const [isListening, setIsListening] = useState(false);
    const [transcript, setTranscript] = useState('');
    const [error, setError] = useState(null);
    const [isSupported, setIsSupported] = useState(false);

    useEffect(() => {
        // Check for Web Speech API support
        const SpeechRecognition = window.SpeechRecognition || window.webkitSpeechRecognition;
        setIsSupported(!!SpeechRecognition);
    }, []);

    const startListening = useCallback(() => {
        if (!isSupported) {
            setError('Voice input not supported in this browser');
            return;
        }

        const SpeechRecognition = window.SpeechRecognition || window.webkitSpeechRecognition;
        const recognition = new SpeechRecognition();

        recognition.lang = language;
        recognition.continuous = continuous;
        recognition.interimResults = true;

        recognition.onstart = () => {
            setIsListening(true);
            setError(null);
        };

        recognition.onresult = (event) => {
            let finalTranscript = '';
            let interimTranscript = '';

            for (let i = event.resultIndex; i < event.results.length; i++) {
                const result = event.results[i];
                if (result.isFinal) {
                    finalTranscript += result[0].transcript;
                } else {
                    interimTranscript += result[0].transcript;
                }
            }

            const fullTranscript = finalTranscript || interimTranscript;
            setTranscript(fullTranscript);

            if (finalTranscript && onResult) {
                onResult(finalTranscript);
            }
        };

        recognition.onerror = (event) => {
            setError(event.error);
            setIsListening(false);
        };

        recognition.onend = () => {
            setIsListening(false);
        };

        recognition.start();

        // Store recognition instance for cleanup
        window.currentRecognition = recognition;
    }, [isSupported, language, continuous, onResult]);

    const stopListening = useCallback(() => {
        if (window.currentRecognition) {
            window.currentRecognition.stop();
            window.currentRecognition = null;
        }
        setIsListening(false);
    }, []);

    const resetTranscript = useCallback(() => {
        setTranscript('');
    }, []);

    return {
        isListening,
        transcript,
        error,
        isSupported,
        startListening,
        stopListening,
        resetTranscript,
    };
}

export default useVoiceInput;
