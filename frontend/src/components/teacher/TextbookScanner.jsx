import React, { useState, useRef } from 'react';
import { Camera, Upload, X, Scan } from 'lucide-react';
import Button from '../common/Button';

export function TextbookScanner({ onScan, onClose }) {
    const [image, setImage] = useState(null);
    const [scanning, setScanning] = useState(false);
    const [result, setResult] = useState(null);
    const fileInputRef = useRef(null);
    const videoRef = useRef(null);
    const [cameraMode, setCameraMode] = useState(false);

    const handleFileUpload = (e) => {
        const file = e.target.files[0];
        if (file) {
            const reader = new FileReader();
            reader.onload = (e) => {
                setImage(e.target.result);
            };
            reader.readAsDataURL(file);
        }
    };

    const startCamera = async () => {
        try {
            const stream = await navigator.mediaDevices.getUserMedia({
                video: { facingMode: 'environment' }
            });
            if (videoRef.current) {
                videoRef.current.srcObject = stream;
                setCameraMode(true);
            }
        } catch (error) {
            console.error('Camera error:', error);
            alert('कैमरा एक्सेस नहीं मिला');
        }
    };

    const captureImage = () => {
        if (videoRef.current) {
            const canvas = document.createElement('canvas');
            canvas.width = videoRef.current.videoWidth;
            canvas.height = videoRef.current.videoHeight;
            canvas.getContext('2d').drawImage(videoRef.current, 0, 0);
            const imageData = canvas.toDataURL('image/jpeg');
            setImage(imageData);

            // Stop camera
            const stream = videoRef.current.srcObject;
            stream?.getTracks().forEach(track => track.stop());
            setCameraMode(false);
        }
    };

    const handleScan = async () => {
        if (!image) return;

        setScanning(true);

        // Mock OCR - in production would use actual OCR
        await new Promise(resolve => setTimeout(resolve, 1500));

        // Mock extracted text
        const mockResult = {
            topic: 'जोड़ना और घटाना',
            grade: 3,
            subject: 'Math',
            chapter: 'अध्याय 5: दें और लें',
            keywords: ['जोड़', 'घटाना', 'स्थानीय मान', 'उधार'],
            summary: 'इस पाठ में दो अंकों की संख्याओं के जोड़ और घटाव के बारे में सीखेंगे।'
        };

        setResult(mockResult);
        setScanning(false);

        if (onScan) {
            onScan(mockResult);
        }
    };

    const reset = () => {
        setImage(null);
        setResult(null);
        if (cameraMode && videoRef.current?.srcObject) {
            videoRef.current.srcObject.getTracks().forEach(track => track.stop());
        }
        setCameraMode(false);
    };

    return (
        <div className="fixed inset-0 bg-black/50 flex items-center justify-center p-4 z-50">
            <div className="bg-white rounded-2xl max-w-lg w-full max-h-[90vh] overflow-y-auto">
                {/* Header */}
                <div className="flex items-center justify-between p-4 border-b">
                    <h2 className="text-lg font-bold flex items-center gap-2">
                        <Scan size={20} className="text-primary-600" />
                        पाठ्यपुस्तक स्कैनर
                    </h2>
                    <button onClick={onClose} className="p-2 hover:bg-slate-100 rounded-full">
                        <X size={20} />
                    </button>
                </div>

                <div className="p-4 space-y-4">
                    {/* Camera/Image display */}
                    {cameraMode ? (
                        <div className="relative aspect-[4/3] bg-black rounded-xl overflow-hidden">
                            <video
                                ref={videoRef}
                                autoPlay
                                playsInline
                                className="w-full h-full object-cover"
                            />
                            <button
                                onClick={captureImage}
                                className="absolute bottom-4 left-1/2 -translate-x-1/2 w-16 h-16 bg-white rounded-full border-4 border-primary-500 flex items-center justify-center"
                            >
                                <div className="w-12 h-12 bg-primary-500 rounded-full" />
                            </button>
                        </div>
                    ) : image ? (
                        <div className="relative aspect-[4/3] bg-slate-100 rounded-xl overflow-hidden">
                            <img src={image} alt="Scanned" className="w-full h-full object-contain" />
                            <button
                                onClick={reset}
                                className="absolute top-2 right-2 p-2 bg-white rounded-full shadow"
                            >
                                <X size={16} />
                            </button>
                        </div>
                    ) : (
                        <div className="aspect-[4/3] bg-slate-50 rounded-xl border-2 border-dashed border-slate-200 flex flex-col items-center justify-center gap-4">
                            <Scan size={48} className="text-slate-300" />
                            <p className="text-slate-500 text-center">
                                पाठ्यपुस्तक का पृष्ठ स्कैन करें
                            </p>
                            <div className="flex gap-3">
                                <Button variant="primary" size="md" onClick={startCamera}>
                                    <Camera size={18} />
                                    कैमरा
                                </Button>
                                <Button
                                    variant="secondary"
                                    size="md"
                                    onClick={() => fileInputRef.current?.click()}
                                >
                                    <Upload size={18} />
                                    अपलोड
                                </Button>
                            </div>
                            <input
                                ref={fileInputRef}
                                type="file"
                                accept="image/*"
                                onChange={handleFileUpload}
                                className="hidden"
                            />
                        </div>
                    )}

                    {/* Scan button */}
                    {image && !result && (
                        <Button
                            variant="sos"
                            size="lg"
                            className="w-full"
                            loading={scanning}
                            onClick={handleScan}
                        >
                            <Scan size={20} />
                            स्कैन करें
                        </Button>
                    )}

                    {/* Result */}
                    {result && (
                        <div className="bg-green-50 rounded-xl p-4 border border-green-200">
                            <h3 className="font-bold text-green-900 mb-3">📚 स्कैन परिणाम</h3>
                            <div className="space-y-2 text-green-800">
                                <p><strong>विषय:</strong> {result.topic}</p>
                                <p><strong>कक्षा:</strong> {result.grade}</p>
                                <p><strong>अध्याय:</strong> {result.chapter}</p>
                                <p><strong>सारांश:</strong> {result.summary}</p>
                                <div className="flex flex-wrap gap-2 mt-3">
                                    {result.keywords.map((kw, i) => (
                                        <span key={i} className="bg-green-200 px-2 py-1 rounded text-sm">
                                            {kw}
                                        </span>
                                    ))}
                                </div>
                            </div>

                            <Button
                                variant="primary"
                                size="md"
                                className="w-full mt-4"
                                onClick={() => {
                                    onScan(result);
                                    onClose();
                                }}
                            >
                                इस विषय पर SOS भेजें
                            </Button>
                        </div>
                    )}

                    {/* Mock indicator */}
                    <p className="text-xs text-slate-400 text-center">
                        🔬 Demo: Mock OCR - वास्तविक OCR प्रोडक्शन में
                    </p>
                </div>
            </div>
        </div>
    );
}

export default TextbookScanner;
