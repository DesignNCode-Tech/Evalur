import { useState } from "react";
import { useNavigate } from "react-router-dom";
 
import {
  ArrowLeft,
  ArrowRight,
  Check,
  User,
  Mail,
  Phone,
  MapPin,
  Briefcase,
  GraduationCap,
  Code,
  Globe,
  Upload,
  X,
  Calendar,
  FileText,
  Send,
  Save,
  Eye,
  ChevronRight,
  Award,
  Users,
  Clock,
  Star,
} from "lucide-react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Textarea } from "@/components/ui/textarea";
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { Badge } from "@/components/ui/badge";
import { Progress } from "@/components/ui/progress";
import { Separator } from "@/components/ui/separator";
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
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
import { motion, AnimatePresence } from "framer-motion";

const steps = [
  { id: 1, name: "Personal Info", icon: User },
  { id: 2, name: "Professional", icon: Briefcase },
  { id: 3, name: "Skills", icon: Code },
  { id: 4, name: "Review", icon: Eye },
];

const skillOptions = [
  "JavaScript", "TypeScript", "React", "Vue.js", "Angular", "Node.js",
  "Python", "Java", "C#", "PHP", "Ruby", "Go", "Rust",
  "HTML5", "CSS3", "Sass", "Tailwind CSS", "Bootstrap",
  "SQL", "MongoDB", "PostgreSQL", "Redis", "Firebase",
  "AWS", "Docker", "Kubernetes", "Jenkins", "Git",
  "Machine Learning", "Data Science", "AI", "Blockchain",
];

const experienceLevels = [
  { value: "entry", label: "Entry Level (0-2 years)", icon: "🌱" },
  { value: "junior", label: "Junior (2-4 years)", icon: "📚" },
  { value: "mid", label: "Mid-Level (4-6 years)", icon: "⚡" },
  { value: "senior", label: "Senior (6-8 years)", icon: "🚀" },
  { value: "lead", label: "Lead (8+ years)", icon: "👑" },
];

const assessments = [
  { id: 1, name: "Frontend Developer Test", duration: 60, questions: 30 },
  { id: 2, name: "Backend Engineer Assessment", duration: 90, questions: 40 },
  { id: 3, name: "Full Stack Challenge", duration: 120, questions: 50 },
  { id: 4, name: "DevOps Engineer Test", duration: 75, questions: 35 },
  { id: 5, name: "Data Scientist Assessment", duration: 90, questions: 45 },
];

const CreateCandidate = () => {
  const navigate = useNavigate();
  const [currentStep, setCurrentStep] = useState(1);
  const [showSuccess, setShowSuccess] = useState(false);
  const [formData, setFormData] = useState({
    // Personal Info
    firstName: "",
    lastName: "",
    email: "",
    phone: "",
    location: "",
    dateOfBirth: "",
    // Professional
    experience: "",
    currentRole: "",
    company: "",
    education: "",
    linkedin: "",
    github: "",
    portfolio: "",
    bio: "",
    // Skills
    skills: [] as string[],
    certifications: [] as string[],
    languages: [] as string[],
    // Assessment
    assessmentId: "",
    startDate: "",
    notes: "",
  });

  const [newCertification, setNewCertification] = useState("");
  const [newLanguage, setNewLanguage] = useState("");
  const [showCancelDialog, setShowCancelDialog] = useState(false);

  const updateFormData = (field: string, value: any) => {
    setFormData(prev => ({ ...prev, [field]: value }));
  };

  const toggleSkill = (skill: string) => {
    setFormData(prev => ({
      ...prev,
      skills: prev.skills.includes(skill)
        ? prev.skills.filter(s => s !== skill)
        : [...prev.skills, skill]
    }));
  };

  const addCertification = () => {
    if (newCertification.trim() && !formData.certifications.includes(newCertification.trim())) {
      setFormData(prev => ({
        ...prev,
        certifications: [...prev.certifications, newCertification.trim()]
      }));
      setNewCertification("");
    }
  };

  const removeCertification = (cert: string) => {
    setFormData(prev => ({
      ...prev,
      certifications: prev.certifications.filter(c => c !== cert)
    }));
  };

  const addLanguage = () => {
    if (newLanguage.trim() && !formData.languages.includes(newLanguage.trim())) {
      setFormData(prev => ({
        ...prev,
        languages: [...prev.languages, newLanguage.trim()]
      }));
      setNewLanguage("");
    }
  };

  const removeLanguage = (lang: string) => {
    setFormData(prev => ({
      ...prev,
      languages: prev.languages.filter(l => l !== lang)
    }));
  };

  const nextStep = () => {
    if (currentStep < steps.length) {
      setCurrentStep(currentStep + 1);
      window.scrollTo(0, 0);
    } else {
      // Submit form
      console.log("Candidate created:", formData);
      setShowSuccess(true);
      setTimeout(() => {
        navigate("/candidates");
      }, 2000);
    }
  };

  const prevStep = () => {
    if (currentStep > 1) {
      setCurrentStep(currentStep - 1);
      window.scrollTo(0, 0);
    }
  };

  const progress = (currentStep / steps.length) * 100;

  const selectedAssessment = assessments.find(a => a.id.toString() === formData.assessmentId);

  const renderStep = () => {
    switch (currentStep) {
      case 1:
        return <PersonalInfoStep formData={formData} updateFormData={updateFormData} />;
      case 2:
        return <ProfessionalStep formData={formData} updateFormData={updateFormData} />;
      case 3:
        return <SkillsStep 
          formData={formData} 
          toggleSkill={toggleSkill}
          skillOptions={skillOptions}
          newCertification={newCertification}
          setNewCertification={setNewCertification}
          addCertification={addCertification}
          removeCertification={removeCertification}
          newLanguage={newLanguage}
          setNewLanguage={setNewLanguage}
          addLanguage={addLanguage}
          removeLanguage={removeLanguage}
        />;
      case 4:
        return <ReviewStep formData={formData} selectedAssessment={selectedAssessment} />;
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
            onClick={() => setShowCancelDialog(true)}
            className="mb-4 -ml-2"
          >
            <ArrowLeft className="w-4 h-4 mr-2" />
            Back to Candidates
          </Button>
          
          <div className="text-center mb-8">
            <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-primary/10 text-primary text-sm mb-4">
              <Users className="w-4 h-4" />
              <span>Add New Candidate</span>
            </div>
            <h1 className="text-3xl md:text-4xl font-bold bg-gradient-to-r from-primary to-primary/60 bg-clip-text text-transparent">
              Create Candidate Profile
            </h1>
            <p className="text-muted-foreground mt-2">
              Enter candidate details and assign assessment
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
                Create Candidate
                <Send className="w-4 h-4" />
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

      {/* Cancel Confirmation Dialog */}
      <AlertDialog open={showCancelDialog} onOpenChange={setShowCancelDialog}>
        <AlertDialogContent>
          <AlertDialogHeader>
            <AlertDialogTitle>Cancel Candidate Creation?</AlertDialogTitle>
            <AlertDialogDescription>
              Your progress will be lost. Are you sure you want to cancel?
            </AlertDialogDescription>
          </AlertDialogHeader>
          <AlertDialogFooter>
            <AlertDialogCancel>Continue Editing</AlertDialogCancel>
            <AlertDialogAction onClick={() => navigate("/candidates")}>
              Yes, Cancel
            </AlertDialogAction>
          </AlertDialogFooter>
        </AlertDialogContent>
      </AlertDialog>

      {/* Success Dialog */}
      <AlertDialog open={showSuccess} onOpenChange={setShowSuccess}>
        <AlertDialogContent className="text-center">
          <AlertDialogHeader>
            <div className="mx-auto w-12 h-12 bg-green-100 dark:bg-green-900/30 rounded-full flex items-center justify-center mb-4">
              <Check className="w-6 h-6 text-green-600 dark:text-green-400" />
            </div>
            <AlertDialogTitle>Candidate Created Successfully!</AlertDialogTitle>
            <AlertDialogDescription>
              The candidate has been added and assessment invitation has been sent.
            </AlertDialogDescription>
          </AlertDialogHeader>
          <AlertDialogFooter>
            <AlertDialogAction>Continue</AlertDialogAction>
          </AlertDialogFooter>
        </AlertDialogContent>
      </AlertDialog>
    </div>
  );
};

// Step 1: Personal Information
const PersonalInfoStep = ({ formData, updateFormData }: any) => {
  return (
    <Card className="border-0 shadow-xl bg-white/80 dark:bg-slate-900/80 backdrop-blur-sm">
      <CardHeader>
        <CardTitle className="text-2xl">Personal Information</CardTitle>
        <CardDescription>
          Basic information about the candidate
        </CardDescription>
      </CardHeader>
      <CardContent className="space-y-6">
        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
          <div className="space-y-2">
            <Label htmlFor="firstName">First Name *</Label>
            <Input
              id="firstName"
              placeholder="John"
              value={formData.firstName}
              onChange={(e) => updateFormData("firstName", e.target.value)}
            />
          </div>
          
          <div className="space-y-2">
            <Label htmlFor="lastName">Last Name *</Label>
            <Input
              id="lastName"
              placeholder="Doe"
              value={formData.lastName}
              onChange={(e) => updateFormData("lastName", e.target.value)}
            />
          </div>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
          <div className="space-y-2">
            <Label htmlFor="email">
              <div className="flex items-center gap-2">
                <Mail className="w-4 h-4" />
                Email Address *
              </div>
            </Label>
            <Input
              id="email"
              type="email"
              placeholder="john.doe@example.com"
              value={formData.email}
              onChange={(e) => updateFormData("email", e.target.value)}
            />
          </div>
          
          <div className="space-y-2">
            <Label htmlFor="phone">
              <div className="flex items-center gap-2">
                <Phone className="w-4 h-4" />
                Phone Number
              </div>
            </Label>
            <Input
              id="phone"
              placeholder="+1 (555) 000-0000"
              value={formData.phone}
              onChange={(e) => updateFormData("phone", e.target.value)}
            />
          </div>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
          <div className="space-y-2">
            <Label htmlFor="location">
              <div className="flex items-center gap-2">
                <MapPin className="w-4 h-4" />
                Location
              </div>
            </Label>
            <Input
              id="location"
              placeholder="New York, USA"
              value={formData.location}
              onChange={(e) => updateFormData("location", e.target.value)}
            />
          </div>
          
          <div className="space-y-2">
            <Label htmlFor="dateOfBirth">
              <div className="flex items-center gap-2">
                <Calendar className="w-4 h-4" />
                Date of Birth
              </div>
            </Label>
            <Input
              id="dateOfBirth"
              type="date"
              value={formData.dateOfBirth}
              onChange={(e) => updateFormData("dateOfBirth", e.target.value)}
            />
          </div>
        </div>
      </CardContent>
    </Card>
  );
};

// Step 2: Professional Information
const ProfessionalStep = ({ formData, updateFormData }: any) => {
  return (
    <Card className="border-0 shadow-xl bg-white/80 dark:bg-slate-900/80 backdrop-blur-sm">
      <CardHeader>
        <CardTitle className="text-2xl">Professional Information</CardTitle>
        <CardDescription>
          Work experience and professional background
        </CardDescription>
      </CardHeader>
      <CardContent className="space-y-6">
        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
          <div className="space-y-2">
            <Label htmlFor="experience">Experience Level *</Label>
            <Select
              value={formData.experience}
              onValueChange={(value) => updateFormData("experience", value)}
            >
              <SelectTrigger>
                <SelectValue placeholder="Select experience level" />
              </SelectTrigger>
              <SelectContent>
                {experienceLevels.map((level) => (
                  <SelectItem key={level.value} value={level.value}>
                    <div className="flex items-center gap-2">
                      <span>{level.icon}</span>
                      {level.label}
                    </div>
                  </SelectItem>
                ))}
              </SelectContent>
            </Select>
          </div>
          
          <div className="space-y-2">
            <Label htmlFor="currentRole">Current Role</Label>
            <Input
              id="currentRole"
              placeholder="Senior Frontend Developer"
              value={formData.currentRole}
              onChange={(e) => updateFormData("currentRole", e.target.value)}
            />
          </div>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
          <div className="space-y-2">
            <Label htmlFor="company">Current Company</Label>
            <Input
              id="company"
              placeholder="Google, Microsoft, etc."
              value={formData.company}
              onChange={(e) => updateFormData("company", e.target.value)}
            />
          </div>
          
          <div className="space-y-2">
            <Label htmlFor="education">
              <div className="flex items-center gap-2">
                <GraduationCap className="w-4 h-4" />
                Education
              </div>
            </Label>
            <Input
              id="education"
              placeholder="B.S. in Computer Science"
              value={formData.education}
              onChange={(e) => updateFormData("education", e.target.value)}
            />
          </div>
        </div>

        <div className="space-y-2">
          <Label htmlFor="bio">Professional Bio</Label>
          <Textarea
            id="bio"
            placeholder="Brief description about the candidate's background and expertise..."
            value={formData.bio}
            onChange={(e) => updateFormData("bio", e.target.value)}
            rows={4}
          />
        </div>

        <Separator />

        <div className="space-y-4">
          <Label>Social Profiles</Label>
          <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
            <div className="space-y-2">
              <Label htmlFor="linkedin" className="text-sm">
                 
                LinkedIn
              </Label>
              <Input
                id="linkedin"
                placeholder="linkedin.com/in/username"
                value={formData.linkedin}
                onChange={(e) => updateFormData("linkedin", e.target.value)}
              />
            </div>
            
            <div className="space-y-2">
              <Label htmlFor="github" className="text-sm">
                 
                GitHub
              </Label>
              <Input
                id="github"
                placeholder="github.com/username"
                value={formData.github}
                onChange={(e) => updateFormData("github", e.target.value)}
              />
            </div>
            
            <div className="space-y-2">
              <Label htmlFor="portfolio" className="text-sm">
                <Globe className="w-3 h-3 inline mr-1" />
                Portfolio
              </Label>
              <Input
                id="portfolio"
                placeholder="https://portfolio.com"
                value={formData.portfolio}
                onChange={(e) => updateFormData("portfolio", e.target.value)}
              />
            </div>
          </div>
        </div>
      </CardContent>
    </Card>
  );
};

// Step 3: Skills & Assessment
const SkillsStep = ({ 
  formData, 
  toggleSkill, 
  skillOptions,
  newCertification,
  setNewCertification,
  addCertification,
  removeCertification,
  newLanguage,
  setNewLanguage,
  addLanguage,
  removeLanguage,
}: any) => {
  return (
    <Card className="border-0 shadow-xl bg-white/80 dark:bg-slate-900/80 backdrop-blur-sm">
      <CardHeader>
        <CardTitle className="text-2xl">Skills & Assessment</CardTitle>
        <CardDescription>
          Technical skills, certifications, and assessment assignment
        </CardDescription>
      </CardHeader>
      <CardContent className="space-y-6">
        {/* Skills */}
        <div className="space-y-3">
          <Label>Technical Skills *</Label>
          <div className="flex flex-wrap gap-2 max-h-48 overflow-y-auto p-2 border rounded-lg">
            {skillOptions.map((skill: string) => (
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
          {formData.skills.length > 0 && (
            <p className="text-xs text-muted-foreground">
              Selected {formData.skills.length} skills
            </p>
          )}
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
          {/* Certifications */}
          <div className="space-y-3">
            <Label>Certifications</Label>
            <div className="flex gap-2">
              <Input
                placeholder="e.g., AWS Certified Developer"
                value={newCertification}
                onChange={(e) => setNewCertification(e.target.value)}
                onKeyPress={(e) => e.key === 'Enter' && addCertification()}
              />
              <Button onClick={addCertification} type="button">
                Add
              </Button>
            </div>
            <div className="flex flex-wrap gap-2 mt-2">
              {formData.certifications.map((cert: string) => (
                <Badge key={cert} variant="secondary" className="gap-1">
                  <Award className="w-3 h-3" />
                  {cert}
                  <X
                    className="w-3 h-3 cursor-pointer hover:text-red-500"
                    onClick={() => removeCertification(cert)}
                  />
                </Badge>
              ))}
            </div>
          </div>

          {/* Languages */}
          <div className="space-y-3">
            <Label>Languages</Label>
            <div className="flex gap-2">
              <Input
                placeholder="e.g., English (Fluent)"
                value={newLanguage}
                onChange={(e) => setNewLanguage(e.target.value)}
                onKeyPress={(e) => e.key === 'Enter' && addLanguage()}
              />
              <Button onClick={addLanguage} type="button">
                Add
              </Button>
            </div>
            <div className="flex flex-wrap gap-2 mt-2">
              {formData.languages.map((lang: string) => (
                <Badge key={lang} variant="outline" className="gap-1">
                  {lang}
                  <X
                    className="w-3 h-3 cursor-pointer hover:text-red-500"
                    onClick={() => removeLanguage(lang)}
                  />
                </Badge>
              ))}
            </div>
          </div>
        </div>

        <Separator />

        {/* Assessment Assignment */}
        <div className="space-y-4">
          <Label>Assessment Assignment *</Label>
          <Select
            value={formData.assessmentId}
            // onValueChange={(value) => updateFormData("assessmentId", value)}
          >
            <SelectTrigger>
              <SelectValue placeholder="Select assessment to assign" />
            </SelectTrigger>
            <SelectContent>
              {assessments.map((assessment) => (
                <SelectItem key={assessment.id} value={assessment.id.toString()}>
                  <div className="flex items-center justify-between w-full">
                    <span>{assessment.name}</span>
                    <div className="flex gap-2 text-xs text-muted-foreground">
                      <span>⏱ {assessment.duration} min</span>
                      <span>📝 {assessment.questions} questions</span>
                    </div>
                  </div>
                </SelectItem>
              ))}
            </SelectContent>
          </Select>

          <div className="space-y-2">
            <Label htmlFor="startDate">Start Date (Optional)</Label>
            <Input
              id="startDate"
              type="datetime-local"
              value={formData.startDate}
              // onChange={(e) => updateFormData("startDate", e.target.value)}
            />
          </div>

          <div className="space-y-2">
            <Label htmlFor="notes">Additional Notes</Label>
            <Textarea
              id="notes"
              placeholder="Any special instructions or notes for the candidate..."
              value={formData.notes}
              // onChange={(e) => updateFormData("notes", e.target.value)}
              rows={3}
            />
          </div>
        </div>
      </CardContent>
    </Card>
  );
};

// Step 4: Review
const ReviewStep = ({ formData, selectedAssessment }: any) => {
  const getExperienceLabel = (value: string) => {
    const level = experienceLevels.find(l => l.value === value);
    return level ? level.label : value;
  };

  return (
    <Card className="border-0 shadow-xl bg-white/80 dark:bg-slate-900/80 backdrop-blur-sm">
      <CardHeader>
        <CardTitle className="text-2xl">Review & Submit</CardTitle>
        <CardDescription>
          Verify all information before creating the candidate profile
        </CardDescription>
      </CardHeader>
      <CardContent className="space-y-6">
        {/* Candidate Preview */}
        <div className="bg-primary/5 rounded-lg p-6">
          <div className="flex items-start gap-4">
            <Avatar className="w-16 h-16">
              <AvatarFallback className="bg-primary/20 text-primary text-xl">
                {formData.firstName?.[0]}{formData.lastName?.[0]}
              </AvatarFallback>
            </Avatar>
            <div className="flex-1">
              <h3 className="text-xl font-semibold">
                {formData.firstName} {formData.lastName}
              </h3>
              <p className="text-muted-foreground">{formData.currentRole || "No role specified"}</p>
              {formData.company && (
                <p className="text-sm text-muted-foreground">at {formData.company}</p>
              )}
            </div>
          </div>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
          {/* Personal Information */}
          <div className="space-y-3">
            <h4 className="font-semibold flex items-center gap-2">
              <User className="w-4 h-4" />
              Personal Information
            </h4>
            <div className="space-y-2 text-sm">
              {formData.email && (
                <div className="flex items-center gap-2">
                  <Mail className="w-3 h-3 text-muted-foreground" />
                  <span>{formData.email}</span>
                </div>
              )}
              {formData.phone && (
                <div className="flex items-center gap-2">
                  <Phone className="w-3 h-3 text-muted-foreground" />
                  <span>{formData.phone}</span>
                </div>
              )}
              {formData.location && (
                <div className="flex items-center gap-2">
                  <MapPin className="w-3 h-3 text-muted-foreground" />
                  <span>{formData.location}</span>
                </div>
              )}
            </div>
          </div>

          {/* Professional Information */}
          <div className="space-y-3">
            <h4 className="font-semibold flex items-center gap-2">
              <Briefcase className="w-4 h-4" />
              Professional Information
            </h4>
            <div className="space-y-2 text-sm">
              {formData.experience && (
                <div className="flex items-center gap-2">
                  <Star className="w-3 h-3 text-muted-foreground" />
                  <span>{getExperienceLabel(formData.experience)}</span>
                </div>
              )}
              {formData.education && (
                <div className="flex items-center gap-2">
                  <GraduationCap className="w-3 h-3 text-muted-foreground" />
                  <span>{formData.education}</span>
                </div>
              )}
            </div>
          </div>
        </div>

        {/* Skills */}
        {formData.skills.length > 0 && (
          <div className="space-y-2">
            <h4 className="font-semibold flex items-center gap-2">
              <Code className="w-4 h-4" />
              Technical Skills
            </h4>
            <div className="flex flex-wrap gap-2">
              {formData.skills.map((skill: string) => (
                <Badge key={skill} variant="secondary">
                  {skill}
                </Badge>
              ))}
            </div>
          </div>
        )}

        {/* Assessment */}
        {selectedAssessment && (
          <div className="space-y-2">
            <h4 className="font-semibold flex items-center gap-2">
              <FileText className="w-4 h-4" />
              Assigned Assessment
            </h4>
            <Card>
              <CardContent className="p-4">
                <div className="flex justify-between items-start">
                  <div>
                    <p className="font-medium">{selectedAssessment.name}</p>
                    <div className="flex gap-4 mt-2 text-sm text-muted-foreground">
                      <span>⏱ Duration: {selectedAssessment.duration} minutes</span>
                      <span>📝 Questions: {selectedAssessment.questions}</span>
                    </div>
                  </div>
                  <Badge variant="default">Pending</Badge>
                </div>
                {formData.startDate && (
                  <p className="text-sm mt-2">
                    <Clock className="w-3 h-3 inline mr-1" />
                    Starts: {new Date(formData.startDate).toLocaleString()}
                  </p>
                )}
              </CardContent>
            </Card>
          </div>
        )}

        {/* Notes */}
        {formData.notes && (
          <div className="space-y-2">
            <h4 className="font-semibold">Additional Notes</h4>
            <p className="text-sm text-muted-foreground p-3 bg-muted/50 rounded-lg">
              {formData.notes}
            </p>
          </div>
        )}
      </CardContent>
    </Card>
  );
};

export default CreateCandidate;