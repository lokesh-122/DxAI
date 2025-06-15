
'use client';

import { useState, useTransition, useCallback, useRef, ChangeEvent, useEffect } from 'react';
import { Button } from '@/components/ui/button';
import { Label } from '@/components/ui/label';
import { Input } from '@/components/ui/input';
import { Textarea } from '@/components/ui/textarea';
import { Card, CardContent, CardHeader, CardTitle, CardFooter } from '@/components/ui/card';
import { Popover, PopoverTrigger, PopoverContent } from "@/components/ui/popover";
import { Command, CommandEmpty, CommandGroup, CommandInput, CommandItem, CommandList } from "@/components/ui/command";

import { Loader2, UploadCloud, FileText, X, Languages, Zap, Upload, Camera, Mic, Video, AlertTriangle, ImageUp, ChevronsUpDown, Check } from 'lucide-react';
import type { ExtractHealthInsightsOutput } from "@/ai/flow/extract-health-insights";
import * as pdfjsLib from 'pdfjs-dist';
import { cn } from '@/lib/utils';
import { useToast } from "@/hooks/use-toast";
import { Alert, AlertDescription, AlertTitle } from "@/components/ui/alert";
import { useIsMobile } from '@/hooks/use-mobile';


if (typeof window !== 'undefined') {
  pdfjsLib.GlobalWorkerOptions.workerSrc = `//unpkg.com/pdfjs-dist@${pdfjsLib.version}/legacy/build/pdf.worker.min.mjs`;
}

interface ReportUploadFormProps {
  onAnalysisComplete: (data: ExtractHealthInsightsOutput) => void;
  onAnalysisError: (error: string) => void;
  clearResults: () => void;
}

type InputMethod = 'upload' | 'text' | 'camera' | 'voice';
type CameraErrorReason = 'denied' | 'not_found' | 'general' | null;

const languages = [
  { value: "English", label: "English" },
  { value: "Arabic", label: "العربية (Arabic)" },
  { value: "Assamese", label: "অসমীয়া (Assamese)" },
  { value: "Awadhi", label: "अवधी (Awadhi)" },
  { value: "Bengali", label: "বাংলা (Bengali)" },
  { value: "Bhojpuri", label: "भोजपुरी (Bhojpuri)" },
  { value: "Bodo", label: "बोड़ो (Bodo)" },
  { value: "Bundeli", label: "बुन्देली (Bundeli)" },
  { value: "Chhattisgarhi", label: "छत्तीसगढ़ी (Chhattisgarhi)" },
  { value: "Chinese (Simplified)", label: "简体中文 (Chinese, Simplified)" },
  { value: "Chinese (Traditional)", label: "繁體中文 (Chinese, Traditional)" },
  { value: "Czech", label: "Čeština (Czech)" },
  { value: "Danish", label: "Dansk (Danish)" },
  { value: "Dogri", label: "डोगरी (Dogri)" },
  { value: "Dutch", label: "Nederlands (Dutch)" },
  { value: "Finnish", label: "Suomi (Finnish)" },
  { value: "French", label: "Français (French)" },
  { value: "Garhwali", label: "गढ़वळि (Garhwali)" },
  { value: "German", label: "Deutsch (German)" },
  { value: "Gondi", label: "गोंडी (Gondi)" },
  { value: "Greek", label: "Ελληνικά (Greek)" },
  { value: "Gujarati", label: "ગુજરાતી (Gujarati)" },
  { value: "Haryanvi", label: "हरियाणवी (Haryanvi)" },
  { value: "Hebrew", label: "עברית (Hebrew)" },
  { value: "Hindi", label: "हिन्दी (Hindi)" },
  { value: "Ho", label: "हो (Ho)" },
  { value: "Hungarian", label: "Magyar (Hungarian)" },
  { value: "Indonesian", label: "Bahasa Indonesia (Indonesian)" },
  { value: "Italian", label: "Italiano (Italian)" },
  { value: "Japanese", label: "日本語 (Japanese)" },
  { value: "Kachchhi", label: "કચ્છી (Kachchhi)" },
  { value: "Kangri", label: "कांगड़ी (Kangri)" },
  { value: "Kannada", label: "ಕನ್ನಡ (Kannada)" },
  { value: "Kashmiri", label: "कॉशुर / کٲشُر (Kashmiri)" },
  { value: "Khandeshi", label: "अहिराणी (Khandeshi)" },
  { value: "Khasi", label: "খাसी (Khasi)" },
  { value: "Konkani", label: "कोंकणी (Konkani)" },
  { value: "Korean", label: "한국어 (Korean)" },
  { value: "Kumaoni", label: "कुमाऊँनी (Kumaoni)" },
  { value: "Kurukh", label: "कुड़ुख़ (Kurukh)" },
  { value: "Magahi", label: "मगही (Magahi)" },
  { value: "Maithili", label: "मैथिली (Maithili)" },
  { value: "Malayalam", label: "മലയാളം (Malayalam)" },
  { value: "Malvi", label: "माळवी (Malvi)" },
  { value: "Manipuri (Meitei)", label: "মৈতৈলোন্ (Manipuri/Meitei)" },
  { value: "Marathi", label: "मराठी (Marathi)" },
  { value: "Marwari", label: "मारवाड़ी (Marwari)" },
  { value: "Mizo", label: "Mizo ṭawng (Mizo)" },
  { value: "Mundari", label: "मुंडारी (Mundari)" },
  { value: "Nepali", label: "नेपाली (Nepali)" },
  { value: "Nimadi", label: "निमाड़ी (Nimadi)" },
  { value: "Norwegian", label: "Norsk (Norwegian)" },
  { value: "Odia", label: "ଓଡ଼ିଆ (Odia)" },
  { value: "Polish", label: "Polski (Polish)" },
  { value: "Portuguese", label: "Português (Portuguese)" },
  { value: "Punjabi", label: "ਪੰਜਾਬੀ (Punjabi)" },
  { value: "Romanian", label: "Română (Romanian)" },
  { value: "Russian", label: "Русский (Russian)" },
  { value: "Sanskrit", label: "संस्कृतम् (Sanskrit)" },
  { value: "Santali", label: "ᱥᱟᱱᱛᱟᱲᱤ (Santali)" },
  { value: "Saraiki", label: "سرائیکی (Saraiki)" },
  { value: "Sindhi", label: "सिन्धी / سنڌي (Sindhi)" },
  { value: "Slovak", label: "Slovenčina (Slovak)" },
  { value: "Sourashtra", label: "ꢱꣃꢬꢵꢰ꣄ꢜ꣄ꢬ (Sourashtra)" },
  { value: "Spanish", label: "Español (Spanish)" },
  { value: "Swedish", label: "Svenska (Swedish)" },
  { value: "Tamil", label: "தமிழ் (Tamil)" },
  { value: "Telugu", label: "తెలుగు (Telugu)" },
  { value: "Thai", label: "ไทย (Thai)" },
  { value: "Tripuri (Kokborok)", label: "କକਬਰକ (Tripuri/Kokborok)" },
  { value: "Tulu", label: "ತುಳು (Tulu)" },
  { value: "Turkish", label: "Türkçe (Turkish)" },
  { value: "Ukrainian", label: "Українська (Ukrainian)" },
  { value: "Urdu", label: "اردو (Urdu)" },
  { value: "Vietnamese", label: "Tiếng Việt (Vietnamese)" },
];


export function ReportUploadForm({ onAnalysisComplete, onAnalysisError, clearResults }: ReportUploadFormProps) {
  const [activeInputMethod, setActiveInputMethod] = useState<InputMethod>('upload');
  const [selectedFile, setSelectedFile] = useState<File | null>(null);
  const [typedText, setTypedText] = useState<string>('');
  const [selectedLanguage, setSelectedLanguage] = useState<string>("English");
  const [isPending, startTransition] = useTransition();
  const { toast } = useToast();
  const isMobile = useIsMobile();

  const fileInputRef = useRef<HTMLInputElement>(null);
  
  const [cameraStream, setCameraStream] = useState<MediaStream | null>(null);
  const [hasCameraPermission, setHasCameraPermission] = useState<boolean | null>(null);
  const [isCameraLive, setIsCameraLive] = useState<boolean>(false);
  const [isVideoPlaying, setIsVideoPlaying] = useState<boolean>(false);
  const videoRef = useRef<HTMLVideoElement>(null);
  const canvasRef = useRef<HTMLCanvasElement>(null);
  const [cameraErrorReason, setCameraErrorReason] = useState<CameraErrorReason>(null);
  const [showDesktopCameraAlert, setShowDesktopCameraAlert] = useState(false);

  const [isListening, setIsListening] = useState<boolean>(false);
  const [speechError, setSpeechError] = useState<string | null>(null);
  // TypeScript: Add SpeechRecognition type for browser compatibility
  type SpeechRecognitionType = typeof window extends { SpeechRecognition: infer T }
    ? T
    : typeof window extends { webkitSpeechRecognition: infer T }
      ? T
      : any;
  
  const recognitionRef = useRef<InstanceType<SpeechRecognitionType> | null>(null);

  const [openLanguagePopover, setOpenLanguagePopover] = useState(false);

  const handleVideoPlaying = useCallback(() => {
    setIsVideoPlaying(true);
  }, []);
  const handleVideoPlayingRef = useRef(handleVideoPlaying);

  useEffect(() => {
    handleVideoPlayingRef.current = handleVideoPlaying;
  }, [handleVideoPlaying]);


  const stopCurrentCameraStream = useCallback(() => {
    if (cameraStream) {
      cameraStream.getTracks().forEach(track => track.stop());
      if (videoRef.current) {
        videoRef.current.srcObject = null;
      }
      setCameraStream(null);
    }
    setIsVideoPlaying(false); 
  }, [cameraStream]);

  const handlePlayError = useCallback((err: any, streamToStop?: MediaStream | null) => {
    console.error("Video play failed:", err);
    toast({ variant: 'destructive', title: 'Camera Error', description: 'Could not start video playback.' });
    setCameraErrorReason('general');
    setIsCameraLive(false); 
    

    if (streamToStop) { 
        streamToStop.getTracks().forEach(track => track.stop());
        if (cameraStream === streamToStop) { 
            setCameraStream(null);
        }
    }
  }, [toast, cameraStream]);


  useEffect(() => {
    const videoNode = videoRef.current;
    let streamInstanceForCleanup: MediaStream | null = null;

    if (activeInputMethod === 'camera' && isCameraLive && isMobile) { // Only initialize if mobile and camera is live
      const initializeCamera = async () => {
        if (!navigator.mediaDevices || !navigator.mediaDevices.getUserMedia) {
          toast({ variant: 'destructive', title: 'Camera Error', description: 'Camera API is not supported by your browser.' });
          setHasCameraPermission(false);
          setIsCameraLive(false);
          setIsVideoPlaying(false);
          setCameraErrorReason('general');
          return;
        }

        try {
          
          if (cameraStream) {
             stopCurrentCameraStream();
          }

          const stream = await navigator.mediaDevices.getUserMedia({ video: { facingMode: "environment" } });
          streamInstanceForCleanup = stream;
          setCameraStream(stream);

          if (videoNode) {
            videoNode.srcObject = stream;
            videoNode.addEventListener('playing', handleVideoPlayingRef.current);
            videoNode.onloadedmetadata = () => {
              videoNode.play().catch(e => handlePlayError(e, stream));
            };
          }
          setHasCameraPermission(true);
          setCameraErrorReason(null);
        } catch (err) {
          let description = 'An unexpected error occurred while trying to access the camera.';
          let title = 'Camera Access Issue';
          let reason: CameraErrorReason = 'general';

          if (err instanceof Error) {
            if (err.name === "NotAllowedError") {
              description = "Camera access was denied. Please allow access in your browser settings.";
              title = "Camera Permission Denied";
              reason = 'denied';
              console.warn(`Camera access denied by user: ${err.message}`);
            } else if (err.name === "NotFoundError") {
              description = "No camera found. Please ensure a camera is connected and enabled.";
              title = "No Camera Found";
              reason = 'not_found';
              console.warn(`No camera device found: ${err.message}`);
            } else {
              console.error(`Unexpected error accessing camera: ${err.name} - ${err.message}`);
              description = `An error occurred: ${err.message}. Please try again.`;
            }
          } else {
              console.warn("An unexpected non-Error object was thrown while accessing camera:", err);
              description = "An unknown issue occurred with the camera.";
          }
          toast({ variant: 'destructive', title: title, description });
          setHasCameraPermission(false);
          setIsCameraLive(false);
          setIsVideoPlaying(false);
          setCameraErrorReason(reason);
          if (streamInstanceForCleanup) {
              streamInstanceForCleanup.getTracks().forEach(track => track.stop());
          }
          setCameraStream(null);
        }
      };
      initializeCamera();
    } else {
      stopCurrentCameraStream();
    }

    return () => {
      if (streamInstanceForCleanup) {
        streamInstanceForCleanup.getTracks().forEach(track => track.stop());
      }
      if (videoNode) {
        videoNode.removeEventListener('playing', handleVideoPlayingRef.current);
      }
    };
  }, [activeInputMethod, isCameraLive, toast, stopCurrentCameraStream, handlePlayError, cameraStream, isMobile]);


  const resetInputs = useCallback((newMethod?: InputMethod) => {
    setSelectedFile(null);
    setTypedText('');
    if (fileInputRef.current) fileInputRef.current.value = '';
    
    if (newMethod !== 'camera' && activeInputMethod === 'camera') {
      setIsCameraLive(false); 
      setHasCameraPermission(null);
      setCameraErrorReason(null);
    }
    if (newMethod !== 'voice' && activeInputMethod === 'voice' && recognitionRef.current && isListening) {
      recognitionRef.current.stop();
      setIsListening(false);
    }
    setSpeechError(null);
    setShowDesktopCameraAlert(false);
    clearResults();
  }, [clearResults, activeInputMethod, isListening]);


  const handleInputMethodChange = (method: InputMethod) => {
    if (activeInputMethod === method) return;
    
    resetInputs(method); 
    setActiveInputMethod(method);
    // setShowDesktopCameraAlert(false); // Already handled in resetInputs

    if (method === 'camera') {
      if (!isMobile) {
        setShowDesktopCameraAlert(true);
        setIsCameraLive(false); // Ensure camera does not try to activate
      } else {
        // Mobile device, prepare for camera
        setHasCameraPermission(null); 
        setCameraErrorReason(null);
        setIsVideoPlaying(false); 
        setIsCameraLive(true); // This will trigger the useEffect
      }
    } else if (method === 'voice') {
      setSpeechError(null); 
    }
  };


  const handleFileChange = (event: ChangeEvent<HTMLInputElement>) => {
    clearResults(); 

    const file = event.target.files?.[0];

    if (file) {
      const allowedExtensions = [".txt", ".pdf", ".jpg", ".jpeg", ".png"];
      const fileExtension = file.name.substring(file.name.lastIndexOf('.')).toLowerCase();

      if (allowedExtensions.includes(fileExtension)) {
        setSelectedFile(file);
      } else {
        onAnalysisError('Invalid file type. Please upload a .txt, .pdf, .jpg, or .png file.');
        setSelectedFile(null);
        if (event.target) event.target.value = '';
      }
    } else {
      setSelectedFile(null);
      if (fileInputRef.current) {
        fileInputRef.current.value = '';
      }
    }
  };

  const clearSelectedFile = useCallback(() => {
    setSelectedFile(null);
    if (fileInputRef.current) fileInputRef.current.value = '';
    clearResults();
  }, [clearResults]);


  const extractTextFromPdf = async (file: File): Promise<string> => {
    const arrayBuffer = await file.arrayBuffer();
    const pdf = await pdfjsLib.getDocument({ data: arrayBuffer }).promise;
    let fullText = '';
    for (let i = 1; i <= pdf.numPages; i++) {
      const page = await pdf.getPage(i);
      const textContent = await page.getTextContent();
      fullText += textContent.items.map((item: any) => item.str).join(' ') + '\n';
    }
    return fullText;
  };

  const dataURItoFile = (dataURI: string, filename: string): File => {
    if (!dataURI || !dataURI.includes(',')) {
      console.error('Invalid data URI passed to dataURItoFile:', dataURI.substring(0,100));
      throw new Error('Invalid data URI format: missing comma or empty URI.');
    }
    const arr = dataURI.split(',');
    const mimePart = arr[0];
    const base64Data = arr[1];

    if (!mimePart || !base64Data) {
        console.error('Invalid data URI structure after split:', dataURI.substring(0,100));
        throw new Error('Invalid data URI structure after split.');
    }
    
    const mimeMatch = mimePart.match(/:(.*?);/);
    if (!mimeMatch || mimeMatch.length < 2) {
      console.error('Could not parse MIME type from data URI. Mime part:', mimePart, 'Full URI:', dataURI.substring(0, 100) + "...");
      throw new Error('Could not parse MIME type from data URI. Ensure format is data:<mimetype>;base64.');
    }
    const mime = mimeMatch[1];

    if (!mime) {
        console.error('MIME type is empty after parsing. Mime part:', mimePart);
        throw new Error('MIME type is empty after parsing.');
    }

    try {
      const bstr = atob(base64Data);
      let n = bstr.length;
      const u8arr = new Uint8Array(n);
      while (n--) {
        u8arr[n] = bstr.charCodeAt(n);
      }
      return new File([u8arr], filename, { type: mime });
    } catch (e) {
      console.error('Error decoding base64 data or creating file:', e, 'MIME type:', mime);
      throw new Error('Failed to decode base64 data or create File object.');
    }
  };

  const handleCapturePhoto = () => {
    if (videoRef.current && canvasRef.current && cameraStream && hasCameraPermission && isCameraLive && isVideoPlaying && isMobile) {
      const video = videoRef.current;
      const canvas = canvasRef.current;
      
      if (video.readyState < video.HAVE_METADATA || video.videoWidth === 0 || video.videoHeight === 0) {
        console.error("Video not ready or dimensions are zero. readyState:", video.readyState, "width:", video.videoWidth, "height:", video.videoHeight);
        toast({ variant: "destructive", title: "Capture Error", description: "Camera not fully initialized or video stream has no dimensions. Please wait a moment and try again." });
        return;
      }
      
      canvas.width = video.videoWidth;
      canvas.height = video.videoHeight;

      const context = canvas.getContext('2d');
      if (context) {
        context.drawImage(video, 0, 0, canvas.width, canvas.height);
        
        const dataUrl = canvas.toDataURL('image/png');

        if (!dataUrl || dataUrl === "data:," || dataUrl.length < 30) { 
          console.error("canvas.toDataURL returned invalid or too short data. Canvas dimensions:", canvas.width, "x", canvas.height, "DataURL:", dataUrl ? dataUrl.substring(0,50) + "..." : "null");
          toast({ variant: "destructive", title: "Capture Error", description: "Failed to capture image from camera. Canvas might be empty or image too small." });
          return;
        }
        
        try {
          const file = dataURItoFile(dataUrl, `capture-${Date.now()}.png`);
          setSelectedFile(file); 
          setIsCameraLive(false); 
          
        } catch (e) {
          console.error("Error creating file from data URI:", e);
          const errorMessage = e instanceof Error ? e.message : "Could not process captured image.";
          toast({ variant: "destructive", title: "Capture Error", description: errorMessage });
        }
      } else {
         toast({ variant: "destructive", title: "Capture Error", description: "Could not get canvas context." });
      }
    } else {
        let errorDescription = "Camera not ready, permission denied, or video not playing.";
        if (!isMobile) errorDescription = "Photo capture is not available on this device.";
        else if (!cameraStream) errorDescription = "Camera stream not available.";
        else if (!hasCameraPermission) errorDescription = "Camera permission not granted.";
        else if (!isCameraLive) errorDescription = "Camera is not live.";
        else if (!isVideoPlaying) errorDescription = "Video is not playing yet. Please wait for the feed to stabilize.";
        console.warn("Capture attempt failed:", {isMobile, cameraStream: !!cameraStream, hasCameraPermission, isCameraLive, isVideoPlaying, videoReadyState: videoRef.current?.readyState });
        toast({ variant: "destructive", title: "Capture Error", description: errorDescription });
    }
  };

  const handleStartCamera = () => {
    if (!isMobile && activeInputMethod === 'camera') {
      setShowDesktopCameraAlert(true);
      setIsCameraLive(false);
      return;
    }
    setSelectedFile(null); 
    setHasCameraPermission(null); 
    setCameraErrorReason(null);
    setIsVideoPlaying(false); 
    setShowDesktopCameraAlert(false);
    setIsCameraLive(true); 
  };

  const handleStopCamera = () => {
    setIsCameraLive(false); 
  };


  const handleToggleListening = () => {
    if (isListening) {
      recognitionRef.current?.stop();
    } else {
      const SpeechRecognitionAPI = window.SpeechRecognition || window.webkitSpeechRecognition;
      if (!SpeechRecognitionAPI) {
        setSpeechError("Speech recognition is not supported by your browser.");
        toast({ variant: "destructive", title: "Voice Input Error", description: "Speech recognition is not supported by your browser."});
        return;
      }

      if (!recognitionRef.current) {
        recognitionRef.current = new SpeechRecognitionAPI();
        recognitionRef.current.continuous = true; 
        recognitionRef.current.interimResults = true; 

        recognitionRef.current.onstart = () => {
          setIsListening(true);
          setSpeechError(null);
        };

        recognitionRef.current.onresult = (event) => {
          let fullTranscriptFromEvent = "";
          for (let i = 0; i < event.results.length; ++i) {
            fullTranscriptFromEvent += event.results[i][0].transcript;
          }
          setTypedText(fullTranscriptFromEvent.trimStart());
        };

        recognitionRef.current.onerror = (event) => {
          console.error("Speech recognition error", event.error);
          let message = `Speech recognition error: ${event.error}.`;
           if (event.error === 'not-allowed' || event.error === 'service-not-allowed') {
            message = "Microphone access denied or speech service not allowed. Please check permissions.";
          } else if (event.error === 'no-speech') {
            message = "No speech was detected. Please try again.";
          } else if (event.error === 'network') {
            message = "Network error during speech recognition. Check connection and ensure online speech services are not blocked. This may also indicate an issue with the speech recognition service itself.";
          } else if (event.error === 'audio-capture') {
            message = "Audio capture failed. Ensure microphone is working and not used by another app. If using a virtual machine, ensure microphone is passed through.";
          }
          setSpeechError(message);
          setIsListening(false);
          toast({ variant: "destructive", title: "Voice Input Error", description: message});
        };

        recognitionRef.current.onend = () => {
          setIsListening(false);
        };
      }
      try {
        clearResults(); 
        setTypedText(''); 
        setSpeechError(null);
        recognitionRef.current.start();
      } catch (e) {
         console.error("Error starting speech recognition:", e);
         const errorMsg = e instanceof Error ? e.message : "Could not start voice recognition.";
         setSpeechError(`Failed to start listening: ${errorMsg}`);
         toast({ variant: "destructive", title: "Voice Input Error", description: `Failed to start listening: ${errorMsg}`});
         setIsListening(false);
      }
    }
  };

  useEffect(() => {
    return () => {
      if (recognitionRef.current) {
        recognitionRef.current.stop();
        recognitionRef.current = null; 
      }
    };
  }, []);

  useEffect(() => {
    if (activeInputMethod !== 'voice' && isListening && recognitionRef.current) {
        recognitionRef.current.stop(); 
    }
  }, [activeInputMethod, isListening]);


  const handleSubmit = async (event: React.FormEvent<HTMLFormElement>) => {
    event.preventDefault();
    onAnalysisError(''); 

    startTransition(async () => {
      const { analyzeReportAction } = await import('@/app/action');
      let analysisInputText = '';

      try {
        if (activeInputMethod === 'upload' || (activeInputMethod === 'camera' && selectedFile) ) {
          if (!selectedFile) {
            onAnalysisError(`Please select a file or capture a photo.`);
            return;
          }
          const fileExtension = selectedFile.name.substring(selectedFile.name.lastIndexOf('.')).toLowerCase();
          if (selectedFile.type === 'application/pdf' || fileExtension === '.pdf') {
            analysisInputText = await extractTextFromPdf(selectedFile);
          } else if (selectedFile.type === 'text/plain' || fileExtension === '.txt') {
            analysisInputText = await selectedFile.text();
          } else if (['.jpg', '.jpeg', '.png'].includes(fileExtension) || selectedFile.type.startsWith('image/')) {
            onAnalysisError(`Selected file (${selectedFile.name}) is an image. Automatic text extraction (OCR) from images is not yet implemented. Please upload a PDF or TXT file, or use the "Type Text" or "Voice Input" option.`);
            return;
          } else {
            onAnalysisError('Unsupported file type for processing. Please use PDF, TXT, JPG, or PNG.');
            return;
          }
        } else if (activeInputMethod === 'text' || activeInputMethod === 'voice') {
          if (!typedText.trim()) {
            onAnalysisError(`Please type, paste, or dictate your report text.`);
            return;
          }
          analysisInputText = typedText;
        } else if (activeInputMethod === 'camera' && !selectedFile && isMobile) { // Check isMobile here
          onAnalysisError('Please capture a photo before submitting.');
          return;
        } else if (activeInputMethod === 'camera' && !isMobile) {
           onAnalysisError('Photo capture is not available on this device. Please choose another input method.');
           return;
        }


        if (!analysisInputText.trim() && !(activeInputMethod === 'camera' && selectedFile)) { 
           if (! (activeInputMethod === 'camera' && selectedFile)) { 
             onAnalysisError('The input is empty or text could not be extracted/provided.');
             return;
           }
        }
        
        const result = await analyzeReportAction(analysisInputText, selectedLanguage);
        
        if (result && result.error) {
          onAnalysisError(result.error);
        } else if (result && result.data) {
          onAnalysisComplete(result.data);
        } else {
          onAnalysisError('An unexpected error occurred. No data or specific error received from analysis.');
        }
      } catch (e) {
          const errorMessage = e instanceof Error ? e.message : 'An unexpected error occurred during processing.';
          onAnalysisError(`Operation failed: ${errorMessage}`);
      }
    });
  };

  const inputMethodButtonClasses = (method: InputMethod) => cn(
    "flex-1 flex flex-col items-center justify-center p-3 md:p-4 border rounded-lg transition-all h-24 md:h-28",
    "hover:shadow-md",
    activeInputMethod === method ? "bg-primary/10 border-primary ring-2 ring-primary shadow-md" : "bg-card border-border hover:border-muted-foreground/50"
  );

  return (
    <Card className="w-full max-w-2xl mx-auto shadow-xl">
      <CardHeader>
        <CardTitle className="font-headline text-2xl flex items-center gap-2">
          <Zap className="h-6 w-6 text-primary" />
          Choose Your Input Method
        </CardTitle>
        <div className="grid grid-cols-2 md:grid-cols-4 gap-2 md:gap-3 pt-4">
          <button type="button" onClick={() => handleInputMethodChange('upload')} className={inputMethodButtonClasses('upload')}>
            <Upload className="h-6 w-6 mb-1 text-primary" />
            <span className="text-sm font-medium text-foreground">Upload File</span>
            <span className="text-xs text-muted-foreground">PDF, TXT, Image</span>
          </button>
          <button type="button" onClick={() => handleInputMethodChange('text')} className={inputMethodButtonClasses('text')}>
            <FileText className="h-6 w-6 mb-1 text-primary" />
            <span className="text-sm font-medium text-foreground">Type Text</span>
            <span className="text-xs text-muted-foreground">Copy & paste report</span>
          </button>
          <button type="button" onClick={() => handleInputMethodChange('camera')} className={inputMethodButtonClasses('camera')}>
            <Camera className="h-6 w-6 mb-1 text-primary" />
            <span className="text-sm font-medium text-foreground">Take Photo</span>
            <span className="text-xs text-muted-foreground">Capture with camera</span>
          </button>
          <button type="button" onClick={() => handleInputMethodChange('voice')} className={inputMethodButtonClasses('voice')}>
            <Mic className="h-6 w-6 mb-1 text-primary" />
            <span className="text-sm font-medium text-foreground">Voice Input</span>
            <span className="text-xs text-muted-foreground">Speak report details</span>
          </button>
        </div>
      </CardHeader>
      <form onSubmit={handleSubmit}>
        <CardContent className="space-y-6 pt-2">
          {activeInputMethod === 'upload' && (
            <div>
              <Label htmlFor="file-upload" className="mb-2 block text-sm font-medium">Upload Report File (.pdf, .jpg, .png, .txt)</Label>
              <div className="relative flex flex-col items-center justify-center w-full p-6 border-2 border-dashed rounded-lg hover:border-primary transition-colors">
                <UploadCloud className="h-12 w-12 text-muted-foreground mb-3" />
                <p className="mb-2 text-sm text-foreground">
                  <span className="font-semibold">Drag & drop</span> or click to upload
                </p>
                <p className="text-xs text-muted-foreground">PDF reports, lab results, or photos of medical documents</p>
                <Input
                  id="file-upload"
                  ref={fileInputRef}
                  type="file"
                  accept=".txt,.pdf,.jpg,.jpeg,.png,text/plain,application/pdf,image/jpeg,image/png"
                  onChange={handleFileChange}
                  className="absolute inset-0 w-full h-full opacity-0 cursor-pointer"
                  disabled={isPending}
                />
              </div>

              {selectedFile && (
                <div className="mt-3 flex items-center justify-between p-2.5 bg-muted/50 rounded-md border">
                  <div className="flex items-center gap-2 overflow-hidden"> 
                    <ImageUp className="h-5 w-5 text-primary shrink-0" /> 
                    <span className="text-sm text-foreground truncate">{selectedFile.name}</span> 
                  </div>
                  <Button
                    type="button"
                    variant="ghost"
                    size="icon"
                    className="h-7 w-7 shrink-0" 
                    onClick={clearSelectedFile}
                    disabled={isPending}
                    aria-label="Clear selected file"
                  >
                    <X className="h-4 w-4" />
                  </Button>
                </div>
              )}
              <p className="mt-1.5 text-xs text-muted-foreground">
               Max file size: 5MB. Text extraction (OCR) from images is not yet available.
              </p>
            </div>
          )}

          {(activeInputMethod === 'text' || activeInputMethod === 'voice') && (
            <div>
              <Label htmlFor="text-input" className="mb-2 block text-sm font-medium">
                {activeInputMethod === 'text' ? 'Type or Paste Report Text' : 'Voice-to-Text Input (Editable)'}
              </Label>
              <Textarea
                id="text-input"
                value={typedText}
                onChange={(e) => {
                  if (isListening) return; 
                  clearResults();
                  setTypedText(e.target.value);
                }}
                placeholder={
                  activeInputMethod === 'voice' ? 
                  (isListening ? "Listening... speak clearly." : "Click 'Start Listening' to dictate. Transcript will appear here.") :
                  "Paste your medical report text here..."
                }
                className="min-h-[200px]"
                disabled={isPending || (activeInputMethod === 'voice' && isListening)}
                readOnly={activeInputMethod === 'voice' && isListening} 
              />
            </div>
          )}
          
          {activeInputMethod === 'camera' && (
            <div className="space-y-4">
                {showDesktopCameraAlert && !isMobile ? (
                    <Alert variant="default">
                        <AlertTriangle className="h-4 w-4" />
                        <AlertTitle>Invalid Device Selection</AlertTitle>
                        <AlertDescription>
                        The "Take Photo" option is intended for devices with a suitable camera, like mobile phones. For desktops, please consider using "Upload File" or "Type Text".
                        </AlertDescription>
                    </Alert>
                ) : (
                  <>
                    <canvas ref={canvasRef} className="hidden"></canvas>
                    <div className={cn("w-full aspect-[3/4] bg-muted rounded-md overflow-hidden border relative")}>
                       <video 
                        ref={videoRef} 
                        className={cn(
                            "w-full h-full object-cover",
                            (!isCameraLive || !isVideoPlaying) && "hidden" 
                        )} 
                        autoPlay 
                        playsInline 
                        muted 
                       />
                       {(!isCameraLive || (isCameraLive && !isVideoPlaying && hasCameraPermission !== false && !selectedFile)) && (
                         <div className="absolute inset-0 flex flex-col items-center justify-center p-4 text-center">
                            {hasCameraPermission === null && isCameraLive && (
                                <>
                                    <Loader2 className="h-8 w-8 animate-spin text-primary mb-2" />
                                    <p className="text-sm text-muted-foreground">Requesting camera access...</p>
                                </>
                            )}
                            {(!isCameraLive && !selectedFile) && (
                                 <Button type="button" onClick={handleStartCamera} className="w-auto" disabled={isPending}>
                                    <Video className="mr-2 h-4 w-4" /> Start Camera
                                </Button>
                            )}
                            {(isCameraLive && !isVideoPlaying && hasCameraPermission === true && !cameraErrorReason && !selectedFile) && (
                                 <>
                                    <Loader2 className="h-8 w-8 animate-spin text-primary mb-2" />
                                    <p className="text-sm text-muted-foreground">Initializing video stream...</p>
                                </>
                            )}
                         </div>
                       )}
                    </div>
                    
                    {activeInputMethod === 'camera' && hasCameraPermission === false && !isCameraLive && cameraErrorReason && (
                        <Alert variant="destructive">
                            <AlertTriangle className="h-4 w-4" />
                            <AlertTitle>
                              {cameraErrorReason === 'denied' && "Camera Permission Denied"}
                              {cameraErrorReason === 'not_found' && "No Camera Found"}
                              {cameraErrorReason === 'general' && "Camera Access Issue"}
                            </AlertTitle>
                            <AlertDescription>
                              {cameraErrorReason === 'denied' && "Camera access was denied. Please allow access in your browser settings and try starting the camera again."}
                              {cameraErrorReason === 'not_found' && "No camera found. Please ensure a camera is connected, enabled, and try starting the camera again."}
                              {cameraErrorReason === 'general' && "Could not access the camera due to an issue. Please check your settings, ensure a camera is available, and try starting the camera again."}
                            </AlertDescription>
                             <Button type="button" onClick={handleStartCamera} variant="outline" className="mt-2" disabled={isPending}>
                                <Video className="mr-2 h-4 w-4" /> Try Starting Camera Again
                            </Button>
                        </Alert>
                    )}

                    {isCameraLive && hasCameraPermission && isMobile && ( 
                        <div className="flex gap-2">
                            <Button 
                              type="button" 
                              onClick={handleCapturePhoto} 
                              className="flex-1" 
                              disabled={isPending || !isVideoPlaying} 
                            >
                                <Camera className="mr-2 h-4 w-4" /> Capture Photo
                            </Button>
                            <Button type="button" onClick={handleStopCamera} variant="outline" className="flex-1" disabled={isPending}>
                                Stop Camera
                            </Button>
                        </div>
                    )}
                  </>
                )}

              {selectedFile && activeInputMethod === 'camera' && (
                <div className="mt-3">
                  <Label className="mb-1 block text-sm font-medium">Captured Photo:</Label>
                  <div className="flex items-center justify-between p-2.5 bg-muted/50 rounded-md border">
                    <div className="flex items-center gap-2 overflow-hidden">
                      <ImageUp className="h-5 w-5 text-primary shrink-0" />
                      <span className="text-sm text-foreground truncate">{selectedFile.name}</span>
                    </div>
                    <Button type="button" variant="ghost" size="icon" className="h-7 w-7 shrink-0" onClick={() => { setSelectedFile(null); clearResults();}} disabled={isPending} aria-label="Clear captured photo">
                      <X className="h-4 w-4" />
                    </Button>
                  </div>
                  {isMobile && (
                   <Button type="button" onClick={handleStartCamera} variant="link" className="mt-1 text-sm" disabled={isPending}>
                        Retake Photo
                    </Button>
                  )}
                </div>
              )}
              <p className="mt-1.5 text-xs text-muted-foreground">
               Ensure good lighting and clear focus for best results. Text extraction (OCR) from images is not yet implemented.
              </p>
            </div>
          )}

          {activeInputMethod === 'voice' && (
            <div className="space-y-3 mt-4">
              <Button type="button" onClick={handleToggleListening} className="w-full" disabled={isPending}>
                {isListening ? (
                  <>
                    <Loader2 className="mr-2 h-4 w-4 animate-spin" />
                    Stop Listening
                  </>
                ) : (
                  <>
                    <Mic className="mr-2 h-4 w-4" />
                    Start Listening
                  </>
                )}
              </Button>
              {speechError && (
                <Alert variant="destructive">
                  <AlertTriangle className="h-4 w-4" />
                  <AlertTitle>Voice Input Error</AlertTitle>
                  <AlertDescription>{speechError}</AlertDescription>
                </Alert>
              )}
              {!(window.SpeechRecognition || window.webkitSpeechRecognition) && activeInputMethod === 'voice' && !speechError && (
                 <Alert variant="destructive">
                    <AlertTriangle className="h-4 w-4" />
                    <AlertTitle>Browser Not Supported</AlertTitle>
                    <AlertDescription>
                        Speech recognition is not supported by your current browser. Please try Chrome or another supported browser.
                    </AlertDescription>
                 </Alert>
              )}
               <p className="mt-1.5 text-xs text-muted-foreground">
                 Click "Start Listening" and speak clearly. The transcript will appear above and can be edited.
              </p>
            </div>
          )}

          <div className="pt-4">
            <Label htmlFor="language-select" className="mb-2 block text-sm font-medium">
              <Languages className="h-4 w-4 inline-block mr-1.5 relative -top-px" />
              Select Insight Language
            </Label>
            <Popover open={openLanguagePopover} onOpenChange={setOpenLanguagePopover}>
              <PopoverTrigger asChild>
                <Button
                  variant="outline"
                  role="combobox"
                  aria-expanded={openLanguagePopover}
                  className="w-full justify-between md:w-[240px]"
                  disabled={isPending}
                >
                  {selectedLanguage
                    ? languages.find((language) => language.value.toLowerCase() === selectedLanguage.toLowerCase())?.label
                    : "Select language..."}
                  <ChevronsUpDown className="ml-2 h-4 w-4 shrink-0 opacity-50" />
                </Button>
              </PopoverTrigger>
              <PopoverContent className="w-full p-0 md:w-[240px]" style={{width: 'var(--radix-popover-trigger-width)'}}>
                <Command>
                  <CommandInput placeholder="Search language..." />
                  <CommandList>
                    <CommandEmpty>No language found.</CommandEmpty>
                    <CommandGroup>
                      {languages.map((language) => (
                        <CommandItem
                          key={language.value}
                          value={language.value}
                          onSelect={(currentValue) => {
                            setSelectedLanguage(currentValue === selectedLanguage ? selectedLanguage : currentValue);
                            setOpenLanguagePopover(false);
                          }}
                        >
                          <Check
                            className={cn(
                              "mr-2 h-4 w-4",
                              selectedLanguage.toLowerCase() === language.value.toLowerCase() ? "opacity-100" : "opacity-0"
                            )}
                          />
                          {language.label}
                        </CommandItem>
                      ))}
                    </CommandGroup>
                  </CommandList>
                </Command>
              </PopoverContent>
            </Popover>
          </div>

        </CardContent>
        <CardFooter>
          <Button 
            type="submit" 
            className="bg-gradient-to-r w-full from-green-500 to-teal-500 hover:from-green-600 hover:to-teal-600 text-white font-medium px-6 py-2 rounded-xl shadow-lg hover:shadow-xl transition-all duration-200" 
            disabled={
              isPending ||
              isListening || 
              (activeInputMethod === 'upload' && !selectedFile) ||
              ((activeInputMethod === 'text' || activeInputMethod === 'voice') && !typedText.trim()) ||
              (activeInputMethod === 'camera' && !selectedFile && isCameraLive && isMobile) || // Disabled if camera live (mobile) but no file
              (activeInputMethod === 'camera' && !selectedFile && !isCameraLive && isMobile) || // Disabled if camera not live (mobile) and no file
              (activeInputMethod === 'camera' && !isMobile) // Always disabled for camera on desktop (alert is shown)
            }
          >
            {isPending ? (
              <>
                <Loader2 className="mr-2 h-4 w-4 animate-spin" />
                Analyzing...
              </>
            ) : (
              'Get Insights'
            )}
          </Button>
        </CardFooter>
      </form>
    </Card>
  );
}
    
