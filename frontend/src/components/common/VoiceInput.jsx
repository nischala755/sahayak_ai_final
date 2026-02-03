import React, { useState, useEffect } from 'react';
import { Mic, MicOff, Square } from 'lucide-react';
import useVoiceInput from '../../hooks/useVoiceInput';

export function VoiceInput({
    onTranscript,
    language = 'hi-IN',
    placeholder = 'माइक बटन दबाकर बोलें...',
    className = ''
}) {
    const [inputText, setInputText] = useState('');

    const {
        isListening,
        transcript,
        isSupported,
        startListening,
        stopListening,
        resetTranscript,
    } = useVoiceInput({
        language,
        onResult: (text) => {
            setInputText(text);
        }
    });

    useEffect(() => {
        if (transcript) {
            setInputText(transcript);
        }
    }, [transcript]);

    const handleSubmit = () => {
        if (inputText.trim()) {
            onTranscript(inputText.trim());
            setInputText('');
            resetTranscript();
        }
    };

    const handleKeyPress = (e) => {
        if (e.key === 'Enter' && !e.shiftKey) {
            e.preventDefault();
            handleSubmit();
        }
    };

    return (
        <div className={`space-y-3 ${className}`}>
            {/* Text input */}
            <div className="relative">
                <textarea
                    value={inputText}
                    onChange={(e) => setInputText(e.target.value)}
                    onKeyPress={handleKeyPress}
                    placeholder={placeholder}
                    className="input-field min-h-[100px] pr-14 resize-none"
                    rows={3}
                />

                {/* Voice button inside textarea */}
                {isSupported && (
                    <button
                        type="button"
                        onClick={isListening ? stopListening : startListening}
                        className={`absolute right-3 top-3 p-3 rounded-full transition-all duration-200 ${isListening
                                ? 'bg-red-500 text-white voice-recording'
                                : 'bg-primary-100 text-primary-600 hover:bg-primary-200'
                            }`}
                    >
                        {isListening ? <Square size={20} /> : <Mic size={20} />}
                    </button>
                )}
            </div>

            {/* Voice status */}
            {isListening && (
                <div className="flex items-center gap-2 text-red-600 animate-pulse">
                    <div className="w-3 h-3 bg-red-500 rounded-full" />
                    <span className="text-sm font-medium">सुन रहा है... बोलते रहें</span>
                </div>
            )}

            {/* Submit button */}
            <button
                onClick={handleSubmit}
                disabled={!inputText.trim()}
                className="btn-sos w-full disabled:opacity-50 disabled:cursor-not-allowed"
            >
                🆘 SOS भेजें
            </button>

            {!isSupported && (
                <p className="text-xs text-slate-500 text-center">
                    Voice input not supported. Please type your question.
                </p>
            )}
        </div>
    );
}

export default VoiceInput;
