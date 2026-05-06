import { useState, useEffect, useRef } from "react";
import { useParams, useNavigate } from "react-router-dom";
import { useStartAssessment, useSubmitAssessment } from "@/feature/dashboard/hooks/useAssessment";
import Editor from "@monaco-editor/react"; //  Imported Monaco

import { Button } from "@/components/ui/button";
import { Card, CardContent } from "@/components/ui/card";
import { ShieldAlert, Camera, Lock, ChevronRight, Loader2, CheckCircle, AlertTriangle, Mic, Timer, Zap } from "lucide-react";
import { toast } from "sonner";

export default function AssessmentPlayer() {
  const { id } = useParams();
  const navigate = useNavigate();

  // API HOOKS
  const { data: assessmentData, isLoading, isError } = useStartAssessment(Number(id));
  const submitMutation = useSubmitAssessment();

  // STATE
  const [hasStarted, setHasStarted] = useState(false);
  const [currentStep, setCurrentStep] = useState(0); 
  const [mcqAnswers, setMcqAnswers] = useState<number[]>([]);
  const [codingSolution, setCodingSolution] = useState("");
  
  //  TIME STATES
  const [timeLeft, setTimeLeft] = useState<number | null>(null); // Total Exam Time
  const [questionTimeLeft, setQuestionTimeLeft] = useState<number | null>(null); // Individual Question Time
  const [initialQuestionTime, setInitialQuestionTime] = useState<number>(0); // Constant for % calculation

  // MEDIA STATE
  const videoRef = useRef<HTMLVideoElement>(null);
  const [stream, setStream] = useState<MediaStream | null>(null);
  const [micLevel, setMicLevel] = useState(0); //  Tracks microphone volume

  //  FIX 4: Track latest state for the auto-submit event listener
  const stateRef = useRef({ mcqAnswers, codingSolution, id, hasStarted, currentStep });
  useEffect(() => {
    stateRef.current = { mcqAnswers, codingSolution, id, hasStarted, currentStep };
  }, [mcqAnswers, codingSolution, id, hasStarted, currentStep]);

  //  1. INITIALIZE TOTAL TIMER (Minutes * 0.65 multiplier)
  useEffect(() => {
    if (assessmentData && timeLeft === null) {
      const mcqs = assessmentData.mcqs || [];
      const codingTasks = assessmentData.codingTasks || [];
      const totalMinutes = [...mcqs, ...codingTasks].reduce((acc, curr) => acc + (curr.timeEstimateMinutes || 0), 0);
      const totalSeconds = Math.floor(totalMinutes * 0.65 * 60);
      setTimeLeft(totalSeconds);
    }
  }, [assessmentData, timeLeft]);

  //  2. RESET INDIVIDUAL QUESTION TIMER (When step changes)
  useEffect(() => {
    if (assessmentData && hasStarted) {
      const mcqs = assessmentData.mcqs || [];
      const codingTasks = assessmentData.codingTasks || [];
      
      // Get the time for the specific question/task
      const currentItem = currentStep < mcqs.length ? mcqs[currentStep] : codingTasks[0];
      
      if (currentItem) {
        const seconds = Math.floor((currentItem.timeEstimateMinutes || 1) * 0.65 * 60);
        setQuestionTimeLeft(seconds);
        setInitialQuestionTime(seconds);
      }
    }
  }, [currentStep, hasStarted, assessmentData]);

  // 3. MASTER COUNTDOWN (Ticks both Total and Question timers)
  useEffect(() => {
    if (!hasStarted) return;

    const timerId = setInterval(() => {
      // Tick Total Exam Timer
      setTimeLeft((prev) => {
        if (prev !== null && prev <= 1) {
          triggerAutoSubmit("Total assessment time expired");
          return 0;
        }
        return prev !== null ? prev - 1 : null;
      });

      // Tick Individual Question Timer
      setQuestionTimeLeft((prev) => {
        if (prev !== null && prev <= 1) {
          handleQuestionTimeout();
          return 0;
        }
        return prev !== null ? prev - 1 : null;
      });
    }, 1000);

    return () => clearInterval(timerId);
  }, [hasStarted]);

  //  4. AUTO-ADVANCE LOGIC
  const handleQuestionTimeout = () => {
    const mcqs = assessmentData?.mcqs || [];
    const codingTasks = assessmentData?.codingTasks || [];
    const totalSteps = mcqs.length + (codingTasks.length > 0 ? 1 : 0);

    if (currentStep < totalSteps - 1) {
      toast.warning("Time's up! Force-advancing to next question.", { 
        icon: <Zap className="text-yellow-500"/> 
      });
      setCurrentStep(prev => prev + 1);
    } else {
      triggerAutoSubmit("Time limit reached on final task");
    }
  };

  //  FIX 2: Attach the video stream ONLY after the video element actually exists on screen
  useEffect(() => {
    if (hasStarted && stream && videoRef.current) {
      videoRef.current.srcObject = stream;
    }
  }, [hasStarted, stream]);

  //  FIX 2.1: Microphone Frequency Analyzer
  useEffect(() => {
    if (!stream) return;
    
    const audioContext = new window.AudioContext();
    const analyser = audioContext.createAnalyser();
    const microphone = audioContext.createMediaStreamSource(stream);
    
    microphone.connect(analyser);
    analyser.fftSize = 256;
    const bufferLength = analyser.frequencyBinCount;
    const dataArray = new Uint8Array(bufferLength);

    let animationFrameId: number;

    const updateMicLevel = () => {
      analyser.getByteFrequencyData(dataArray);
      let sum = 0;
      for (let i = 0; i < bufferLength; i++) {
        sum += dataArray[i];
      }
      setMicLevel((sum / bufferLength) * 2); 
      animationFrameId = requestAnimationFrame(updateMicLevel);
    };

    updateMicLevel();

    return () => {
      cancelAnimationFrame(animationFrameId);
      audioContext.close();
    };
  }, [stream]);

  //  CONSOLIDATED AUTO-SUBMIT TRIGGER
  const triggerAutoSubmit = (reason: string) => {
    const { mcqAnswers: latestMcq, codingSolution: latestCode, id: assessId, hasStarted: active } = stateRef.current;
    
    if (!active || submitMutation.isPending) return;

    toast.error(`SECURITY ALERT: ${reason}. Assessment automatically submitted.`, {
      duration: 8000,
      style: { background: "#ef4444", color: "white", border: "none" }
    });

    submitMutation.mutate({
      userAssessmentId: Number(assessId),
      mcqAnswers: latestMcq,
      codingSolution: latestCode
    }, {
      onSuccess: () => {
        if (stream) stream.getTracks().forEach(track => track.stop());
        if (document.fullscreenElement) document.exitFullscreen().catch(() => {});
        navigate("/candidate");
      }
    });
  };

  // SECURITY PROTOCOLS (Anti-Cheat & Auto-Submit)
  useEffect(() => {
    if (!hasStarted) return;

    const preventAction = (e: Event) => {
      e.preventDefault();
      toast.error("Copy, paste, and right-click are disabled during the assessment.");
    };

    document.addEventListener("copy", preventAction);
    document.addEventListener("paste", preventAction);
    document.addEventListener("contextmenu", preventAction);

    const handleVisibilityChange = () => {
      if (document.hidden) triggerAutoSubmit("Tab switched or minimized");
    };

    const handleBlur = () => {
      triggerAutoSubmit("Window focus lost (minimizing or clicking away)");
    };

    const handleFullscreenExit = () => {
      if (!document.fullscreenElement) {
        triggerAutoSubmit("Exited full-screen mode");
      }
    };

    document.addEventListener("visibilitychange", handleVisibilityChange);
    window.addEventListener("blur", handleBlur);
    document.addEventListener("fullscreenchange", handleFullscreenExit);

    return () => {
      document.removeEventListener("copy", preventAction);
      document.removeEventListener("paste", preventAction);
      document.removeEventListener("contextmenu", preventAction);
      document.removeEventListener("visibilitychange", handleVisibilityChange);
      window.removeEventListener("blur", handleBlur);
      document.removeEventListener("fullscreenchange", handleFullscreenExit);
    };
  }, [hasStarted, stream, submitMutation, navigate]);

  // START TEST & REQUEST PERMISSIONS
  const handleStart = async () => {
    try {
      const mediaStream = await navigator.mediaDevices.getUserMedia({ video: true, audio: true });
      setStream(mediaStream);

      if (document.documentElement.requestFullscreen) {
        await document.documentElement.requestFullscreen();
      }

      setHasStarted(true);
      toast.success("Secure environment activated. Good luck!");
    } catch (err) {
      toast.error("You must grant camera and microphone access to begin.");
    }
  };

  // MANUAL SUBMIT ASSESSMENT
  const handleSubmit = async () => {
    if (stream) {
      stream.getTracks().forEach(track => track.stop());
    }
    if (document.fullscreenElement) {
      await document.exitFullscreen().catch(err => console.log(err));
    }

    submitMutation.mutate({
      userAssessmentId: Number(id),
      mcqAnswers: mcqAnswers,
      codingSolution: codingSolution
    }, {
      onSuccess: () => {
        navigate("/candidate"); 
      }
    });
  };

  //  TIME FORMATTER
  const formatTime = (seconds: number | null) => {
    if (seconds === null) return "--:--";
    const mins = Math.floor(seconds / 60);
    const secs = seconds % 60;
    return `${mins.toString().padStart(2, "0")}:${secs.toString().padStart(2, "0")}`;
  };

  //  FIX 3: Detect language based on question string
  const detectLanguage = (text: string) => {
    const lower = text.toLowerCase();
    if (lower.includes("sql") || lower.includes("postgresql")) return "sql";
    if (lower.includes("python")) return "python";
    if (lower.includes("java") && !lower.includes("javascript")) return "java";
    if (lower.includes("javascript") || lower.includes("node")) return "javascript";
    if (lower.includes("go ") || lower.includes("golang")) return "go";
    return "plaintext";
  };

  // RENDER: LOADING/ERROR
  if (isLoading) return <div className="min-h-screen flex items-center justify-center"><Loader2 className="animate-spin w-12 h-12 text-blue-600" /></div>;
  if (isError || !assessmentData) return <div className="min-h-screen flex flex-col items-center justify-center text-slate-500"><AlertTriangle className="w-12 h-12 text-red-500 mb-4" /><p>Failed to load assessment environment.</p><Button onClick={() => navigate("/candidate")} className="mt-4">Return to Dashboard</Button></div>;

  // RENDER: PRE-FLIGHT SCREEN
  if (!hasStarted) {
    return (
      <div className="min-h-screen bg-slate-900 flex items-center justify-center p-6">
        <Card className="max-w-xl w-full bg-slate-800 border-slate-700 text-white shadow-2xl">
          <CardContent className="p-8 space-y-6">
            <div className="flex items-center gap-3 text-red-400 mb-6">
              <ShieldAlert className="w-8 h-8" />
              <h1 className="text-2xl font-bold">Secure Assessment Environment</h1>
            </div>
            
            <p className="text-slate-300">
              You are about to begin a proctored technical evaluation. 
              Total time allocated: <span className="text-white font-bold">{formatTime(timeLeft)}</span>.
            </p>

            <ul className="space-y-4 text-sm text-slate-400">
              <li className="flex gap-3 text-orange-300"><Zap className="w-5 h-5 shrink-0" /> Each question has an individual time limit.</li>
              <li className="flex gap-3"><Lock className="w-5 h-5 text-slate-500 shrink-0" /> Full-screen mode will be enforced.</li>
              <li className="flex gap-3"><Lock className="w-5 h-5 text-slate-500 shrink-0" /> Grant Access to webcam and microphone.</li>

              <li className="flex gap-3"><AlertTriangle className="w-5 h-5 text-red-400 shrink-0" /> <span className="text-red-400 font-semibold">Exiting full-screen, switching tabs, or minimizing the window will instantly auto-submit your test.</span></li>
            </ul>

            <Button onClick={handleStart} className="w-full h-12 bg-blue-600 hover:bg-blue-700 text-white font-bold mt-4">
              Grant Permissions & Start
            </Button>
          </CardContent>
        </Card>
      </div>
    );
  }

  // ACTIVE ASSESSMENT SETUP
  const mcqs = assessmentData.mcqs || [];
  const codingTasks = assessmentData.codingTasks || [];
  const totalSteps = mcqs.length + (codingTasks.length > 0 ? 1 : 0);
  const isCodingStep = currentStep >= mcqs.length;
  
  const detectedEditorLang = codingTasks.length > 0 
    ? detectLanguage(codingTasks[0].description + " " + (codingTasks[0].constraints || "")) 
    : "plaintext";

  return (
    <div className="min-h-screen bg-slate-50 flex flex-col select-none relative overflow-hidden">
      
      {/*  REVERSE PROGRESSION PANIC BAR */}
      {hasStarted && (
        <div className="absolute top-0 left-0 w-full h-1.5 bg-slate-200 z-[60]">
          <div 
            className={`h-full transition-all duration-1000 ease-linear ${
              (questionTimeLeft || 0) < 15 ? 'bg-red-500' : 'bg-blue-600'
            }`}
            style={{ width: `${((questionTimeLeft || 0) / initialQuestionTime) * 100}%` }}
          />
        </div>
      )}

      {/* Top Navbar */}
      <header className="bg-white border-b border-slate-200 h-16 flex items-center justify-between px-6 shrink-0 shadow-sm z-10">
        <div className="flex items-center gap-2 text-slate-900 font-bold">
          <ShieldAlert className="w-5 h-5 text-blue-600" />
          Evalur Secure Player
        </div>

        <div className="flex items-center gap-6">
          {/*  Individual Question Timer Display */}
          <div className={`flex items-center gap-2 px-3 py-1 rounded-md border font-mono text-xs font-bold transition-all ${questionTimeLeft && questionTimeLeft < 10 ? 'bg-red-100 text-red-700 animate-pulse border-red-300' : 'bg-orange-50 text-orange-700 border-orange-200'}`}>
            <Zap className="w-3 h-3" /> Q-TIME: {formatTime(questionTimeLeft)}
          </div>

          <div className="h-8 w-[1px] bg-slate-200" />

          {/* Total Timer Display */}
          <div className="flex items-center gap-4">
            <div className={`flex items-center gap-2 font-mono font-bold px-3 py-1.5 rounded-md border transition-colors ${timeLeft && timeLeft < 60 ? 'bg-red-50 text-red-600 border-red-200 animate-pulse' : 'bg-slate-50 text-slate-700 border-slate-200'}`}>
              <Timer className="w-4 h-4" />
              {formatTime(timeLeft)}
            </div>
            <div className="font-medium text-slate-500 bg-slate-100 px-4 py-1.5 rounded-full text-sm">
               {currentStep + 1} of {totalSteps}
            </div>
          </div>
        </div>
      </header>

      {/* Main Content */}
      <main className="flex-1 overflow-y-auto p-6 flex justify-center pb-32">
        <div className="max-w-4xl w-full">
          
          {/* MCQ STEP */}
          {!isCodingStep && mcqs[currentStep] && (
            <Card className="border-slate-200 shadow-sm p-8 animate-in fade-in slide-in-from-bottom-4 duration-500">
              <div className="flex justify-between items-start mb-6">
                <h2 className="text-xl font-bold text-slate-900">{mcqs[currentStep].question}</h2>
                <span className="text-xs font-bold text-slate-400 uppercase tracking-wider bg-slate-100 px-2 py-1 rounded">
                  {mcqs[currentStep].difficulty}
                </span>
              </div>
              
              <div className="space-y-3">
                {mcqs[currentStep].options.map((opt: string, idx: number) => (
                  <label 
                    key={idx} 
                    className={`flex items-center gap-3 p-4 rounded-xl border-2 cursor-pointer transition-all ${
                      mcqAnswers[currentStep] === idx ? "border-blue-600 bg-blue-50 shadow-sm" : "border-slate-200 hover:border-blue-300 bg-white"
                    }`}
                  >
                    <input 
                      type="radio" 
                      name={`question-${currentStep}`} 
                      className="w-5 h-5 text-blue-600 focus:ring-blue-600"
                      checked={mcqAnswers[currentStep] === idx}
                      onChange={() => {
                        const newAnswers = [...mcqAnswers];
                        newAnswers[currentStep] = idx;
                        setMcqAnswers(newAnswers);
                      }}
                    />
                    <span className="text-slate-700 font-medium leading-relaxed">{opt}</span>
                  </label>
                ))}
              </div>
            </Card>
          )}

          {/* CODING STEP (Monaco Editor) */}
          {isCodingStep && codingTasks.length > 0 && (
            <Card className="border-slate-200 shadow-sm p-6 flex flex-col h-[75vh] animate-in fade-in slide-in-from-bottom-4 duration-500">
              <div className="mb-4 shrink-0">
                <h2 className="text-xl font-bold text-slate-900 mb-2">Coding Task: {codingTasks[0].title}</h2>
                <p className="text-slate-600 text-sm bg-slate-100 p-4 rounded-lg border border-slate-200">
                  {codingTasks[0].description}
                </p>
                {codingTasks[0].constraints && (
                  <p className="text-xs text-slate-500 mt-3 font-mono">
                    <span className="font-bold uppercase">Constraints:</span> {codingTasks[0].constraints}
                  </p>
                )}
              </div>
              
              <div className="flex-1 rounded-lg overflow-hidden border border-slate-300 shadow-inner">
                <Editor
                  height="100%"
                  language={detectedEditorLang}
                  theme="vs-dark"
                  value={codingSolution || codingTasks[0].initialCode || ""}
                  onChange={(value) => setCodingSolution(value || "")}
                  options={{
                    minimap: { enabled: false },
                    fontSize: 14,
                    wordWrap: "on",
                    padding: { top: 16 }
                  }}
                />
              </div>
            </Card>
          )}

          {/* Navigation Controls */}
          <div className="mt-8 flex justify-end">
            {currentStep < totalSteps - 1 ? (
              <Button 
                onClick={() => setCurrentStep(prev => prev + 1)} 
                className="bg-slate-900 hover:bg-slate-800 text-white px-8 h-12 text-lg shadow-md font-bold"
              >
                Next Question <ChevronRight className="w-5 h-5 ml-2" />
              </Button>
            ) : (
              <Button 
                onClick={handleSubmit} 
                disabled={submitMutation.isPending}
                className="bg-green-600 hover:bg-green-700 text-white font-bold px-8 h-12 text-lg shadow-md"
              >
                {submitMutation.isPending ? <Loader2 className="w-5 h-5 animate-spin mr-2" /> : <CheckCircle className="w-5 h-5 mr-2"/>}
                {submitMutation.isPending ? "Submitting..." : "Submit Assessment"}
              </Button>
            )}
          </div>

        </div>
      </main>

      {/* Floating Camera Preview with Mic Frequency */}
      <div className="fixed bottom-6 left-6 w-56 aspect-video bg-black rounded-xl overflow-hidden shadow-2xl border-4 border-slate-800 z-50">
        <video ref={videoRef} autoPlay muted playsInline className="w-full h-full object-cover transform -scale-x-100" />
        
        <div className="absolute top-2 right-2 flex items-center gap-2 bg-black/50 px-2 py-1 rounded-full backdrop-blur-sm">
          <div className="w-2 h-2 rounded-full bg-red-500 animate-pulse" />
          <span className="text-[10px] text-white font-bold tracking-wider uppercase">Recording</span>
        </div>

        <div className="absolute bottom-2 left-2 flex items-end gap-[2px] bg-black/60 px-2 py-1 rounded-md backdrop-blur-sm h-8 w-12">
          <Mic className="w-3 h-3 text-slate-300 mr-1 mb-0.5" />
          <div className="w-1.5 bg-green-500 rounded-t-sm transition-all duration-75" style={{ height: `${Math.min(Math.max(micLevel * 0.2, 10), 100)}%` }} />
          <div className="w-1.5 bg-green-400 rounded-t-sm transition-all duration-75" style={{ height: `${Math.min(Math.max(micLevel * 0.5, 10), 100)}%` }} />
          <div className="w-1.5 bg-green-300 rounded-t-sm transition-all duration-75" style={{ height: `${Math.min(Math.max(micLevel * 0.8, 10), 100)}%` }} />
        </div>
      </div>

    </div>
  );
}