/**
 * Custom hook for Text-to-Speech functionality
 * Supports Hindi (hi-IN) and English (en-US)
 */
import { useState, useCallback, useEffect, useRef } from 'react';

export const useSpeech = (defaultLanguage = 'hi-IN') => {
    const [isSpeaking, setIsSpeaking] = useState(false);
    const [isPaused, setIsPaused] = useState(false);
    const [voices, setVoices] = useState([]);
    const [currentVoice, setCurrentVoice] = useState(null);
    const utteranceRef = useRef(null);

    // Load available voices
    useEffect(() => {
        const loadVoices = () => {
            const availableVoices = window.speechSynthesis.getVoices();
            setVoices(availableVoices);
            
            // Find best voice for the language
            const langVoice = availableVoices.find(v => v.lang.startsWith(defaultLanguage.split('-')[0])) 
                || availableVoices.find(v => v.lang.includes('IN'))
                || availableVoices[0];
            setCurrentVoice(langVoice);
        };

        loadVoices();
        window.speechSynthesis.onvoiceschanged = loadVoices;

        return () => {
            window.speechSynthesis.cancel();
        };
    }, [defaultLanguage]);

    // Speak text
    const speak = useCallback((text, options = {}) => {
        if (!text || !window.speechSynthesis) {
            console.warn('Speech synthesis not supported');
            return;
        }

        // Cancel any ongoing speech
        window.speechSynthesis.cancel();

        const utterance = new SpeechSynthesisUtterance(text);
        utteranceRef.current = utterance;

        // Set language based on options or default
        const lang = options.language || defaultLanguage;
        utterance.lang = lang;

        // Find appropriate voice
        const voice = voices.find(v => v.lang.startsWith(lang.split('-')[0])) 
            || currentVoice 
            || voices[0];
        
        if (voice) {
            utterance.voice = voice;
        }

        // Configure speech parameters
        utterance.rate = options.rate || 0.9; // Slightly slower for clarity
        utterance.pitch = options.pitch || 1;
        utterance.volume = options.volume || 1;

        // Event handlers
        utterance.onstart = () => {
            setIsSpeaking(true);
            setIsPaused(false);
        };

        utterance.onend = () => {
            setIsSpeaking(false);
            setIsPaused(false);
            if (options.onEnd) options.onEnd();
        };

        utterance.onerror = (event) => {
            // 'interrupted' is normal when speech is cancelled, don't log as error
            if (event.error !== 'interrupted') {
                console.error('Speech synthesis error:', event);
            }
            setIsSpeaking(false);
            setIsPaused(false);
            if (options.onError) options.onError(event);
        };

        utterance.onpause = () => setIsPaused(true);
        utterance.onresume = () => setIsPaused(false);

        window.speechSynthesis.speak(utterance);
    }, [voices, currentVoice, defaultLanguage]);

    // Speak an array of phrases sequentially
    const speakAll = useCallback((phrases, options = {}) => {
        if (!phrases || phrases.length === 0) return;

        const text = Array.isArray(phrases) ? phrases.join('। ') : phrases;
        speak(text, options);
    }, [speak]);

    // Speak a playbook response
    const speakPlaybook = useCallback((playbook, language = 'hi') => {
        if (!playbook) return;

        const langCode = language === 'hi' ? 'hi-IN' : language === 'kn' ? 'kn-IN' : 'en-US';
        
        let speechText = '';

        // Add "What to say" section
        if (playbook.what_to_say && playbook.what_to_say.length > 0) {
            if (language === 'hi') {
                speechText += 'छात्रों से कहें: ';
            } else if (language === 'kn') {
                speechText += 'ವಿದ್ಯಾರ್ಥಿಗಳಿಗೆ ಹೇಳಿ: ';
            } else {
                speechText += 'Tell students: ';
            }
            speechText += playbook.what_to_say.join('। ');
            speechText += '। ';
        }

        // Add activity name
        if (playbook.activity?.name) {
            if (language === 'hi') {
                speechText += `गतिविधि: ${playbook.activity.name}। `;
            } else if (language === 'kn') {
                speechText += `ಚಟುವಟಿಕೆ: ${playbook.activity.name}। `;
            } else {
                speechText += `Activity: ${playbook.activity.name}. `;
            }
        }

        // Add steps
        if (playbook.activity?.steps && playbook.activity.steps.length > 0) {
            if (language === 'hi') {
                speechText += 'कदम: ';
            } else if (language === 'kn') {
                speechText += 'ಹಂತಗಳು: ';
            } else {
                speechText += 'Steps: ';
            }
            playbook.activity.steps.forEach((step, i) => {
                speechText += `${i + 1}. ${step}। `;
            });
        }

        speak(speechText, { language: langCode, rate: 0.85 });
    }, [speak]);

    // Pause speech
    const pause = useCallback(() => {
        if (window.speechSynthesis.speaking && !window.speechSynthesis.paused) {
            window.speechSynthesis.pause();
        }
    }, []);

    // Resume speech
    const resume = useCallback(() => {
        if (window.speechSynthesis.paused) {
            window.speechSynthesis.resume();
        }
    }, []);

    // Stop/cancel speech
    const stop = useCallback(() => {
        window.speechSynthesis.cancel();
        setIsSpeaking(false);
        setIsPaused(false);
    }, []);

    // Toggle pause/resume
    const togglePause = useCallback(() => {
        if (isPaused) {
            resume();
        } else {
            pause();
        }
    }, [isPaused, pause, resume]);

    return {
        speak,
        speakAll,
        speakPlaybook,
        pause,
        resume,
        stop,
        togglePause,
        isSpeaking,
        isPaused,
        voices,
        isSupported: typeof window !== 'undefined' && 'speechSynthesis' in window
    };
};

export default useSpeech;
