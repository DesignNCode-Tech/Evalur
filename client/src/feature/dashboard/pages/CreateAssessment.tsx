import { useState } from "react";
import { useNavigate } from "react-router-dom";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Textarea } from "@/components/ui/textarea";
import { Badge } from "@/components/ui/badge";
import { Separator } from "@/components/ui/separator";
import { Progress } from "@/components/ui/progress";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import {
  ArrowLeft,
  ArrowRight,
  Check,
  Clock,
  Users,
  FileText,
  Settings,
  Briefcase,
  Target,
  Sparkles,
  Zap,
  Award,
  Mic,
  Brain,
  Code,
  Globe,
  Shield,
  ChevronRight,
  Plus,
  Trash2,
  Move,
  Calendar,
  Mail,
  Link as LinkIcon,
} from "lucide-react";
import { motion, AnimatePresence } from "framer-motion";

const steps = [
  { id: 1, name: "Basic Info", icon: FileText },
  { id: 2, name: "Configuration", icon: Settings },
  { id: 3, name: "Questions", icon: Brain },
  { id: 4, name: "Review", icon: Check },
];

const questionTypes = [
  { value: "mcq", label: "Multiple Choice", icon: Check },
  { value: "coding", label: "Coding Challenge", icon: Code },
  { value: "essay", label: "Essay Question", icon: FileText },
  { value: "video", label: "Video Response", icon: Mic },
];

const skillTags = [
  "React", "JavaScript", "TypeScript", "Node.js", "Python", "Java",
  "CSS", "HTML", "SQL", "MongoDB", "AWS", "Docker"
];

const CreateAssessment = () => {
  const navigate = useNavigate();
  const [currentStep, setCurrentStep] = useState(1);
  const [formData, setFormData] = useState({
    title: "",
    role: "",
    description: "",
    duration: 60,
    difficulty: "intermediate",
    maxAttempts: 1,
    passingScore: 70,
    deadline: "",
    instructions: "",
    questions: [] as any[],
    skills: [] as string[],
  });

  const updateFormData = (field: string, value: any) => {
    setFormData(prev => ({ ...prev, [field]: value }));
  };

  const addQuestion = () => {
    setFormData(prev => ({
      ...prev,
      questions: [...prev.questions, {
        id: Date.now(),
        type: "mcq",
        text: "",
        options: ["", "", "", ""],
        correctAnswer: 0,
        points: 10,
      }]
    }));
  };

  const removeQuestion = (id: number) => {
    setFormData(prev => ({
      ...prev,
      questions: prev.questions.filter(q => q.id !== id)
    }));
  };

  const updateQuestion = (id: number, field: string, value: any) => {
    setFormData(prev => ({
      ...prev,
      questions: prev.questions.map(q => 
        q.id === id ? { ...q, [field]: value } : q
      )
    }));
  };

  const toggleSkill = (skill: string) => {
    setFormData(prev => ({
      ...prev,
      skills: prev.skills.includes(skill)
        ? prev.skills.filter(s => s !== skill)
        : [...prev.skills, skill]
    }));
  };

  const nextStep = () => {
    if (currentStep < steps.length) {
      setCurrentStep(currentStep + 1);
    } else {
      // Submit assessment
      console.log("Assessment created:", formData);
      navigate("/onboarding");
    }
  };

  const prevStep = () => {
    if (currentStep > 1) {
      setCurrentStep(currentStep - 1);
    }
  };

  const progress = (currentStep / steps.length) * 100;

  const renderStep = () => {
    switch (currentStep) {
      case 1:
        return <BasicInfoStep formData={formData} updateFormData={updateFormData} toggleSkill={toggleSkill} skillTags={skillTags} />;
      case 2:
        return <ConfigurationStep formData={formData} updateFormData={updateFormData} />;
      case 3:
        return <QuestionsStep formData={formData} updateQuestion={updateQuestion} addQuestion={addQuestion} removeQuestion={removeQuestion} questionTypes={questionTypes} />;
      case 4:
        return <ReviewStep formData={formData} />;
      default:
        return null;
    }
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-slate-50 via-white to-blue-50 dark:from-slate-950 dark:via-slate-900 dark:to-slate-950">
      <div className="container max-w-5xl mx-auto px-4 py-8">
        {/* Header */}
        <div className="mb-8">
          <Button
            variant="ghost"
            onClick={() => navigate("/onboarding")}
            className="mb-4 -ml-2"
          >
            <ArrowLeft className="w-4 h-4 mr-2" />
            Back to Assessments
          </Button>
          
          <div className="text-center mb-8">
            <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-primary/10 text-primary text-sm mb-4">
              <Sparkles className="w-4 h-4" />
              <span>Create New Assessment</span>
            </div>
            <h1 className="text-3xl md:text-4xl font-bold bg-gradient-to-r from-primary to-primary/60 bg-clip-text text-transparent">
              Build Your Assessment
            </h1>
            <p className="text-muted-foreground mt-2">
              Create a comprehensive evaluation in 4 simple steps
            </p>
          </div>

          {/* Progress Steps */}
          <div className="relative mb-8">
            <Progress value={progress} className="h-2" />
            <div className="flex justify-between mt-4">
              {steps.map((step, idx) => {
                const Icon = step.icon;
                const isActive = currentStep === step.id;
                const isCompleted = currentStep > step.id;
                
                return (
                  <div
                    key={step.id}
                    className={`flex flex-col items-center cursor-pointer transition-all ${
                      isActive ? "scale-105" : ""
                    }`}
                    onClick={() => setCurrentStep(step.id)}
                  >
                    <div
                      className={`
                        w-10 h-10 rounded-full flex items-center justify-center mb-2
                        transition-all duration-300
                        ${isCompleted 
                          ? "bg-primary text-white" 
                          : isActive 
                          ? "bg-primary text-white ring-4 ring-primary/20" 
                          : "bg-muted text-muted-foreground"
                        }
                      `}
                    >
                      {isCompleted ? (
                        <Check className="w-5 h-5" />
                      ) : (
                        <Icon className="w-5 h-5" />
                      )}
                    </div>
                    <span className={`text-sm font-medium hidden sm:block ${
                      isActive ? "text-primary" : "text-muted-foreground"
                    }`}>
                      {step.name}
                    </span>
                  </div>
                );
              })}
            </div>
          </div>
        </div>

        {/* Step Content */}
        <AnimatePresence mode="wait">
          <motion.div
            key={currentStep}
            initial={{ opacity: 0, x: 20 }}
            animate={{ opacity: 1, x: 0 }}
            exit={{ opacity: 0, x: -20 }}
            transition={{ duration: 0.3 }}
          >
            {renderStep()}
          </motion.div>
        </AnimatePresence>

        {/* Navigation Buttons */}
        <div className="flex justify-between mt-8">
          <Button
            variant="outline"
            onClick={prevStep}
            disabled={currentStep === 1}
            className="gap-2"
          >
            <ArrowLeft className="w-4 h-4" />
            Previous
          </Button>
          
          <Button onClick={nextStep} className="gap-2">
            {currentStep === steps.length ? (
              <>
                Create Assessment
                <Check className="w-4 h-4" />
              </>
            ) : (
              <>
                Next Step
                <ArrowRight className="w-4 h-4" />
              </>
            )}
          </Button>
        </div>
      </div>
    </div>
  );
};

// Step 1: Basic Information
const BasicInfoStep = ({ formData, updateFormData, toggleSkill, skillTags }: any) => {
  return (
    <Card className="border-0 shadow-xl bg-white/80 dark:bg-slate-900/80 backdrop-blur-sm">
      <CardHeader>
        <CardTitle className="text-2xl">Basic Information</CardTitle>
        <CardDescription>
          Tell us about the assessment you want to create
        </CardDescription>
      </CardHeader>
      <CardContent className="space-y-6">
        <div className="space-y-2">
          <Label htmlFor="title">Assessment Title *</Label>
          <Input
            id="title"
            placeholder="e.g., Frontend Developer Assessment"
            value={formData.title}
            onChange={(e) => updateFormData("title", e.target.value)}
            className="text-lg"
          />
        </div>

        <div className="space-y-2">
          <Label htmlFor="role">Target Role *</Label>
          <Input
            id="role"
            placeholder="e.g., React Developer, Full Stack Engineer"
            value={formData.role}
            onChange={(e) => updateFormData("role", e.target.value)}
          />
        </div>

        <div className="space-y-2">
          <Label htmlFor="description">Description</Label>
          <Textarea
            id="description"
            placeholder="Describe the purpose and scope of this assessment..."
            value={formData.description}
            onChange={(e) => updateFormData("description", e.target.value)}
            rows={4}
          />
        </div>

        <div className="space-y-2">
          <Label>Required Skills</Label>
          <div className="flex flex-wrap gap-2">
            {skillTags.map((skill: string) => (
              <Badge
                key={skill}
                variant={formData.skills.includes(skill) ? "default" : "outline"}
                className="cursor-pointer transition-all hover:scale-105"
                onClick={() => toggleSkill(skill)}
              >
                {formData.skills.includes(skill) && <Check className="w-3 h-3 mr-1" />}
                {skill}
              </Badge>
            ))}
          </div>
        </div>
      </CardContent>
    </Card>
  );
};

// Step 2: Configuration
const ConfigurationStep = ({ formData, updateFormData }: any) => {
  return (
    <Card className="border-0 shadow-xl bg-white/80 dark:bg-slate-900/80 backdrop-blur-sm">
      <CardHeader>
        <CardTitle className="text-2xl">Assessment Settings</CardTitle>
        <CardDescription>
          Configure the rules and parameters for your assessment
        </CardDescription>
      </CardHeader>
      <CardContent className="space-y-6">
        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
          <div className="space-y-2">
            <Label htmlFor="duration">
              <div className="flex items-center gap-2">
                <Clock className="w-4 h-4" />
                Duration (minutes)
              </div>
            </Label>
            <Input
              id="duration"
              type="number"
              value={formData.duration}
              onChange={(e) => updateFormData("duration", parseInt(e.target.value))}
            />
          </div>

          <div className="space-y-2">
            <Label htmlFor="difficulty">Difficulty Level</Label>
            <Select
              value={formData.difficulty}
              onValueChange={(value) => updateFormData("difficulty", value)}
            >
              <SelectTrigger>
                <SelectValue />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="beginner">Beginner</SelectItem>
                <SelectItem value="intermediate">Intermediate</SelectItem>
                <SelectItem value="advanced">Advanced</SelectItem>
                <SelectItem value="expert">Expert</SelectItem>
              </SelectContent>
            </Select>
          </div>

          <div className="space-y-2">
            <Label htmlFor="maxAttempts">Maximum Attempts</Label>
            <Input
              id="maxAttempts"
              type="number"
              value={formData.maxAttempts}
              onChange={(e) => updateFormData("maxAttempts", parseInt(e.target.value))}
            />
          </div>

          <div className="space-y-2">
            <Label htmlFor="passingScore">Passing Score (%)</Label>
            <Input
              id="passingScore"
              type="number"
              value={formData.passingScore}
              onChange={(e) => updateFormData("passingScore", parseInt(e.target.value))}
            />
          </div>

          <div className="space-y-2">
            <Label htmlFor="deadline">
              <div className="flex items-center gap-2">
                <Calendar className="w-4 h-4" />
                Deadline (Optional)
              </div>
            </Label>
            <Input
              id="deadline"
              type="datetime-local"
              value={formData.deadline}
              onChange={(e) => updateFormData("deadline", e.target.value)}
            />
          </div>
        </div>

        <Separator />

        <div className="space-y-2">
          <Label htmlFor="instructions">
            <div className="flex items-center gap-2">
              <FileText className="w-4 h-4" />
              Instructions for Candidates
            </div>
          </Label>
          <Textarea
            id="instructions"
            placeholder="Provide clear instructions for candidates taking this assessment..."
            value={formData.instructions}
            onChange={(e) => updateFormData("instructions", e.target.value)}
            rows={4}
          />
        </div>

        <div className="bg-primary/5 rounded-lg p-4 border border-primary/10">
          <div className="flex items-start gap-3">
            <Shield className="w-5 h-5 text-primary mt-0.5" />
            <div>
              <p className="text-sm font-medium">Anti-cheating Protection</p>
              <p className="text-xs text-muted-foreground mt-1">
                Webcam proctoring, tab switching detection, and AI-powered cheating prevention will be automatically enabled for this assessment.
              </p>
            </div>
          </div>
        </div>
      </CardContent>
    </Card>
  );
};

// Step 3: Questions
const QuestionsStep = ({ formData, updateQuestion, addQuestion, removeQuestion, questionTypes }: any) => {
  return (
    <Card className="border-0 shadow-xl bg-white/80 dark:bg-slate-900/80 backdrop-blur-sm">
      <CardHeader>
        <div className="flex justify-between items-start">
          <div>
            <CardTitle className="text-2xl">Questions</CardTitle>
            <CardDescription>
              Add and manage your assessment questions
            </CardDescription>
          </div>
          <Button onClick={addQuestion} className="gap-2">
            <Plus className="w-4 h-4" />
            Add Question
          </Button>
        </div>
      </CardHeader>
      <CardContent className="space-y-6">
        {formData.questions.length === 0 ? (
          <div className="text-center py-12">
            <Brain className="w-16 h-16 mx-auto text-muted-foreground mb-4" />
            <h3 className="text-lg font-semibold mb-2">No questions yet</h3>
            <p className="text-muted-foreground mb-4">
              Start building your assessment by adding questions
            </p>
            <Button onClick={addQuestion} variant="outline">
              <Plus className="w-4 h-4 mr-2" />
              Add Your First Question
            </Button>
          </div>
        ) : (
          formData.questions.map((question: any, index: number) => (
            <motion.div
              key={question.id}
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              className="border rounded-lg p-4 space-y-4 relative group"
            >
              <div className="flex justify-between items-start">
                <div className="flex items-center gap-2">
                  <Move className="w-4 h-4 text-muted-foreground cursor-move" />
                  <span className="text-sm font-medium">Question {index + 1}</span>
                </div>
                <Button
                  variant="ghost"
                  size="icon"
                  onClick={() => removeQuestion(question.id)}
                  className="text-red-500 hover:text-red-700"
                >
                  <Trash2 className="w-4 h-4" />
                </Button>
              </div>

              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                <div className="space-y-2">
                  <Label>Question Type</Label>
                  <Select
                    value={question.type}
                    onValueChange={(value) => updateQuestion(question.id, "type", value)}
                  >
                    <SelectTrigger>
                      <SelectValue />
                    </SelectTrigger>
                    <SelectContent>
                      {questionTypes.map((type: any) => (
                        <SelectItem key={type.value} value={type.value}>
                          <div className="flex items-center gap-2">
                            <type.icon className="w-4 h-4" />
                            {type.label}
                          </div>
                        </SelectItem>
                      ))}
                    </SelectContent>
                  </Select>
                </div>

                <div className="space-y-2">
                  <Label>Points</Label>
                  <Input
                    type="number"
                    value={question.points}
                    onChange={(e) => updateQuestion(question.id, "points", parseInt(e.target.value))}
                  />
                </div>
              </div>

              <div className="space-y-2">
                <Label>Question Text</Label>
                <Textarea
                  placeholder="Enter your question here..."
                  value={question.text}
                  onChange={(e) => updateQuestion(question.id, "text", e.target.value)}
                  rows={3}
                />
              </div>

              {question.type === "mcq" && (
                <div className="space-y-3">
                  <Label>Options</Label>
                  {question.options.map((option: string, optIndex: number) => (
                    <div key={optIndex} className="flex items-center gap-2">
                      <Input
                        placeholder={`Option ${optIndex + 1}`}
                        value={option}
                        onChange={(e) => {
                          const newOptions = [...question.options];
                          newOptions[optIndex] = e.target.value;
                          updateQuestion(question.id, "options", newOptions);
                        }}
                      />
                      <Button
                        variant={question.correctAnswer === optIndex ? "default" : "outline"}
                        size="sm"
                        onClick={() => updateQuestion(question.id, "correctAnswer", optIndex)}
                      >
                        {question.correctAnswer === optIndex ? (
                          <Check className="w-4 h-4" />
                        ) : (
                          "Set as Correct"
                        )}
                      </Button>
                    </div>
                  ))}
                </div>
              )}
            </motion.div>
          ))
        )}
      </CardContent>
    </Card>
  );
};

// Step 4: Review
const ReviewStep = ({ formData }: any) => {
  return (
    <Card className="border-0 shadow-xl bg-white/80 dark:bg-slate-900/80 backdrop-blur-sm">
      <CardHeader>
        <CardTitle className="text-2xl">Review & Publish</CardTitle>
        <CardDescription>
          Review your assessment details before publishing
        </CardDescription>
      </CardHeader>
      <CardContent className="space-y-6">
        <div className="bg-primary/5 rounded-lg p-6">
          <h3 className="font-semibold text-lg mb-2">{formData.title || "Untitled Assessment"}</h3>
          <p className="text-muted-foreground">{formData.role || "No role specified"}</p>
          {formData.description && (
            <p className="text-sm mt-2">{formData.description}</p>
          )}
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
          <div className="flex items-center gap-3 p-3 rounded-lg border">
            <Clock className="w-5 h-5 text-primary" />
            <div>
              <p className="text-xs text-muted-foreground">Duration</p>
              <p className="font-medium">{formData.duration} minutes</p>
            </div>
          </div>
          <div className="flex items-center gap-3 p-3 rounded-lg border">
            <Target className="w-5 h-5 text-primary" />
            <div>
              <p className="text-xs text-muted-foreground">Passing Score</p>
              <p className="font-medium">{formData.passingScore}%</p>
            </div>
          </div>
          <div className="flex items-center gap-3 p-3 rounded-lg border">
            <Users className="w-5 h-5 text-primary" />
            <div>
              <p className="text-xs text-muted-foreground">Max Attempts</p>
              <p className="font-medium">{formData.maxAttempts}</p>
            </div>
          </div>
          <div className="flex items-center gap-3 p-3 rounded-lg border">
            <Brain className="w-5 h-5 text-primary" />
            <div>
              <p className="text-xs text-muted-foreground">Questions</p>
              <p className="font-medium">{formData.questions.length} questions</p>
            </div>
          </div>
        </div>

        {formData.skills.length > 0 && (
          <div>
            <Label>Required Skills</Label>
            <div className="flex flex-wrap gap-2 mt-2">
              {formData.skills.map((skill: string) => (
                <Badge key={skill} variant="secondary">
                  {skill}
                </Badge>
              ))}
            </div>
          </div>
        )}

        <div className="bg-green-50 dark:bg-green-950/20 border border-green-200 dark:border-green-900 rounded-lg p-4">
          <div className="flex items-start gap-3">
            <Zap className="w-5 h-5 text-green-600 mt-0.5" />
            <div>
              <p className="text-sm font-medium text-green-900 dark:text-green-100">
                Ready to publish!
              </p>
              <p className="text-xs text-green-700 dark:text-green-300 mt-1">
                Your assessment will be live immediately after creation. You can edit it anytime.
              </p>
            </div>
          </div>
        </div>
      </CardContent>
    </Card>
  );
};

export default CreateAssessment;