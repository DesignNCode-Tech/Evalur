import { useState } from "react";
import { useNavigate, useParams } from "react-router-dom";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { Progress } from "@/components/ui/progress";
import { RadioGroup, RadioGroupItem } from "@/components/ui/radio-group";
import { Label } from "@/components/ui/label";
import { Textarea } from "@/components/ui/textarea";
import {
  AlertDialog,
  AlertDialogAction,
  AlertDialogCancel,
  AlertDialogContent,
  AlertDialogDescription,
  AlertDialogFooter,
  AlertDialogHeader,
  AlertDialogTitle,
} from "@/components/ui/alert-dialog";
import {
  Clock,
  AlertTriangle,
  ChevronLeft,
  ChevronRight,
  Flag,
  Save,
  Send,
} from "lucide-react";

const AssessmentTaking = () => {
  const navigate = useNavigate();
  const { id } = useParams();
  const [currentQuestion, setCurrentQuestion] = useState(0);
  const [answers, setAnswers] = useState<Record<number, any>>({});
  const [showSubmitDialog, setShowSubmitDialog] = useState(false);
  const [timeLeft, setTimeLeft] = useState(3600); // 60 minutes in seconds

  // Mock questions data
  const questions = [
    {
      id: 1,
      text: "What is the purpose of React's useEffect hook?",
      type: "multiple-choice",
      options: [
        "To perform side effects in function components",
        "To create new React elements",
        "To handle form submissions",
        "To optimize rendering performance",
      ],
      correctAnswer: 0,
    },
    {
      id: 2,
      text: "Explain the difference between let, const, and var in JavaScript.",
      type: "essay",
    },
    {
      id: 3,
      text: "What will be the output of: console.log([...'hello'])?",
      type: "multiple-choice",
      options: [
        "['h','e','l','l','o']",
        "'hello'",
        "['hello']",
        "Error",
      ],
      correctAnswer: 0,
    },
  ];

  const handleAnswer = (value: any) => {
    setAnswers({ ...answers, [currentQuestion]: value });
  };

  const handleSubmit = () => {
    console.log("Submitted answers:", answers);
    setShowSubmitDialog(false);
    navigate("/user/assessments");
  };

  const formatTime = (seconds: number) => {
    const mins = Math.floor(seconds / 60);
    const secs = seconds % 60;
    return `${mins}:${secs.toString().padStart(2, '0')}`;
  };

  const progress = ((currentQuestion + 1) / questions.length) * 100;

  return (
    <div className="min-h-screen bg-gradient-to-br from-slate-50 via-white to-blue-50 dark:from-slate-950 dark:via-slate-900 dark:to-slate-950">
      <div className="container max-w-4xl mx-auto px-4 py-6">
        {/* Header */}
        <Card className="mb-6 sticky top-0 z-10">
          <CardContent className="p-4">
            <div className="flex justify-between items-center">
              <div>
                <h2 className="font-semibold">Frontend Developer Assessment</h2>
                <p className="text-sm text-muted-foreground">Question {currentQuestion + 1} of {questions.length}</p>
              </div>
              <div className="flex items-center gap-4">
                <div className="flex items-center gap-2">
                  <Clock className="w-4 h-4 text-orange-500" />
                  <span className="font-mono font-semibold">{formatTime(timeLeft)}</span>
                </div>
                <Badge variant="outline">Time Remaining</Badge>
              </div>
            </div>
            <Progress value={progress} className="h-2 mt-3" />
          </CardContent>
        </Card>

        {/* Question Card */}
        <Card>
          <CardHeader>
            <div className="flex justify-between items-start">
              <CardTitle className="text-xl">
                Question {currentQuestion + 1}
              </CardTitle>
              <Button variant="ghost" size="sm">
                <Flag className="w-4 h-4 mr-2" />
                Mark for Review
              </Button>
            </div>
          </CardHeader>
          <CardContent className="space-y-6">
            <p className="text-lg">{questions[currentQuestion].text}</p>

            {questions[currentQuestion].type === "multiple-choice" && (
              <RadioGroup
                value={answers[currentQuestion]}
                onValueChange={handleAnswer}
                className="space-y-3"
              >
                {questions[currentQuestion].options?.map((option, idx) => (
                  <div key={idx} className="flex items-center space-x-2 p-3 rounded-lg border hover:bg-muted/50">
                    <RadioGroupItem value={option} id={`option-${idx}`} />
                    <Label htmlFor={`option-${idx}`} className="flex-1 cursor-pointer">
                      {option}
                    </Label>
                  </div>
                ))}
              </RadioGroup>
            )}

            {questions[currentQuestion].type === "essay" && (
              <Textarea
                placeholder="Type your answer here..."
                value={answers[currentQuestion] || ""}
                onChange={(e) => handleAnswer(e.target.value)}
                rows={8}
                className="resize-none"
              />
            )}

            <div className="flex justify-between pt-4">
              <Button
                variant="outline"
                onClick={() => setCurrentQuestion(Math.max(0, currentQuestion - 1))}
                disabled={currentQuestion === 0}
              >
                <ChevronLeft className="w-4 h-4 mr-2" />
                Previous
              </Button>
              
              {currentQuestion === questions.length - 1 ? (
                <Button onClick={() => setShowSubmitDialog(true)}>
                  <Send className="w-4 h-4 mr-2" />
                  Submit Assessment
                </Button>
              ) : (
                <Button onClick={() => setCurrentQuestion(currentQuestion + 1)}>
                  Next
                  <ChevronRight className="w-4 h-4 ml-2" />
                </Button>
              )}
            </div>
          </CardContent>
        </Card>

        {/* Question Navigator */}
        <div className="mt-6">
          <h4 className="text-sm font-medium mb-3">Question Navigator</h4>
          <div className="flex flex-wrap gap-2">
            {questions.map((_, idx) => (
              <Button
                key={idx}
                variant={currentQuestion === idx ? "default" : answers[idx] ? "secondary" : "outline"}
                size="sm"
                className="w-10 h-10"
                onClick={() => setCurrentQuestion(idx)}
              >
                {idx + 1}
              </Button>
            ))}
          </div>
        </div>

        {/* Submit Confirmation Dialog */}
        <AlertDialog open={showSubmitDialog} onOpenChange={setShowSubmitDialog}>
          <AlertDialogContent>
            <AlertDialogHeader>
              <AlertDialogTitle>Submit Assessment?</AlertDialogTitle>
              <AlertDialogDescription>
                Are you sure you want to submit your assessment? You cannot change your answers after submission.
              </AlertDialogDescription>
            </AlertDialogHeader>
            <div className="flex items-center gap-2 p-3 bg-yellow-50 dark:bg-yellow-950/30 rounded-lg">
              <AlertTriangle className="w-5 h-5 text-yellow-600" />
              <p className="text-sm text-yellow-700 dark:text-yellow-400">
                You have answered {Object.keys(answers).length} out of {questions.length} questions.
              </p>
            </div>
            <AlertDialogFooter>
              <AlertDialogCancel>Cancel</AlertDialogCancel>
              <AlertDialogAction onClick={handleSubmit}>
                Yes, Submit
              </AlertDialogAction>
            </AlertDialogFooter>
          </AlertDialogContent>
        </AlertDialog>
      </div>
    </div>
  );
};

export default AssessmentTaking;