"use client";

import { useEffect, useState } from "react";
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { z } from "zod";

import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Switch } from "@/components/ui/switch";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Label } from "@/components/ui/label";
import { toast } from "sonner";

import { Upload, Trash2, Settings, Palette, FileText, Shield, Users, AlertTriangle } from "lucide-react";

// ================= SCHEMA =================
const schema = z.object({
  companyName: z.string().min(2, "Company name is required"),
  email: z.string().email("Invalid email address"),
  domain: z.string().min(2, "Domain is required"),
  website: z.string().optional(),

  mcqDuration: z.string().min(1, "Duration is required"),
  codingDuration: z.string().min(1, "Duration is required"),
  passingScore: z.string().min(1, "Passing score is required"),

  allowSignup: z.boolean(),
  inviteOnly: z.boolean(),
});

type FormData = z.infer<typeof schema>;

// ================= COMPONENT =================
export default function SettingsPage() {
  const [logoPreview, setLogoPreview] = useState<string | null>(null);
  const [logo, setLogo] = useState<File | null>(null);
  const [loading, setLoading] = useState(false);
  const [activeTab, setActiveTab] = useState("general");

  const {
    register,
    handleSubmit,
    setValue,
    reset,
    watch,
    formState: { errors },
  } = useForm<FormData>({
    resolver: zodResolver(schema),
    defaultValues: {
      companyName: "",
      email: "",
      domain: "",
      website: "",
      mcqDuration: "30",
      codingDuration: "45",
      passingScore: "60",
      allowSignup: false,
      inviteOnly: true,
    },
  });

  const watchSignup = watch("allowSignup");
  const watchInvite = watch("inviteOnly");

  // ================= FETCH =================
  useEffect(() => {
    const fetchSettings = async () => {
      try {
        const res = await fetch("/api/organization/settings");
        if (res.ok) {
          const data = await res.json();
          reset(data);
          if (data.logo) setLogoPreview(data.logo);
        }
      } catch {
        reset({
          companyName: "Perfect Enterprises",
          email: "admin@perfect.com",
          domain: "perfect",
          website: "",
          mcqDuration: "30",
          codingDuration: "45",
          passingScore: "60",
          allowSignup: false,
          inviteOnly: true,
        });
      }
    };

    fetchSettings();
  }, [reset]);

  // ================= SUBMIT =================
  const onSubmit = async (data: FormData) => {
    setLoading(true);

    const formData = new FormData();
    Object.entries(data).forEach(([k, v]) => {
      formData.append(k, String(v));
    });

    if (logo) formData.append("logo", logo);

    try {
      const res = await fetch("/api/organization/settings", {
        method: "PATCH",
        headers: {
          Authorization: `Bearer ${localStorage.getItem("token")}`,
        },
        body: formData,
      });

      if (!res.ok) throw new Error();

      toast.success("Settings saved successfully!");
    } catch {
      toast.error("Failed to save settings");
    } finally {
      setLoading(false);
    }
  };

  // ================= LOGO =================
  const handleLogo = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (!file) return;

    setLogo(file);
    setLogoPreview(URL.createObjectURL(file));
  };

  const removeLogo = () => {
    setLogo(null);
    setLogoPreview(null);
  };

  // ================= UI =================
  return (
    <form onSubmit={handleSubmit(onSubmit)} className="min-h-screen bg-gradient-to-br from-gray-50 to-gray-100 dark:from-gray-900 dark:to-gray-950">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-6 md:py-8">
        
        {/* HEADER */}
        <div className="mb-6 md:mb-8">
          <h1 className="text-2xl md:text-3xl font-bold text-gray-900 dark:text-white tracking-tight">
            Organization Settings
          </h1>
          <p className="text-sm md:text-base text-gray-500 dark:text-gray-400 mt-1">
            Manage your organization details, preferences and security
          </p>
        </div>

        {/* TABS */}
        <div className="bg-white dark:bg-gray-800 rounded-lg shadow-sm border border-gray-200 dark:border-gray-700">
          <div className="border-b border-gray-200 dark:border-gray-700">
            <Tabs value={activeTab} onValueChange={setActiveTab} className="w-full">
              <TabsList className="bg-transparent p-0 h-auto flex flex-wrap gap-0">
                <TabsTrigger
                  value="general"
                  className="data-[state=active]:border-b-2 data-[state=active]:border-blue-500 data-[state=active]:text-blue-600 dark:data-[state=active]:text-blue-400 rounded-none border-b-2 border-transparent px-4 py-3 text-sm font-medium transition-all duration-200"
                >
                  <Settings className="h-4 w-4 mr-2" />
                  General
                </TabsTrigger>

                <TabsTrigger
                  value="branding"
                  className="data-[state=active]:border-b-2 data-[state=active]:border-blue-500 data-[state=active]:text-blue-600 dark:data-[state=active]:text-blue-400 rounded-none border-b-2 border-transparent px-4 py-3 text-sm font-medium transition-all duration-200"
                >
                  <Palette className="h-4 w-4 mr-2" />
                  Branding
                </TabsTrigger>

                <TabsTrigger
                  value="assessment"
                  className="data-[state=active]:border-b-2 data-[state=active]:border-blue-500 data-[state=active]:text-blue-600 dark:data-[state=active]:text-blue-400 rounded-none border-b-2 border-transparent px-4 py-3 text-sm font-medium transition-all duration-200"
                >
                  <FileText className="h-4 w-4 mr-2" />
                  Assessment
                </TabsTrigger>

                <TabsTrigger
                  value="security"
                  className="data-[state=active]:border-b-2 data-[state=active]:border-blue-500 data-[state=active]:text-blue-600 dark:data-[state=active]:text-blue-400 rounded-none border-b-2 border-transparent px-4 py-3 text-sm font-medium transition-all duration-200"
                >
                  <Shield className="h-4 w-4 mr-2" />
                  Security
                </TabsTrigger>

                <TabsTrigger
                  value="team"
                  className="data-[state=active]:border-b-2 data-[state=active]:border-blue-500 data-[state=active]:text-blue-600 dark:data-[state=active]:text-blue-400 rounded-none border-b-2 border-transparent px-4 py-3 text-sm font-medium transition-all duration-200"
                >
                  <Users className="h-4 w-4 mr-2" />
                  Team
                </TabsTrigger>

                <TabsTrigger
                  value="danger"
                  className="data-[state=active]:border-b-2 data-[state=active]:border-red-500 data-[state=active]:text-red-600 dark:data-[state=active]:text-red-400 rounded-none border-b-2 border-transparent px-4 py-3 text-sm font-medium transition-all duration-200"
                >
                  <AlertTriangle className="h-4 w-4 mr-2" />
                  Danger Zone
                </TabsTrigger>
              </TabsList>

              {/* CONTENT */}
              <div className="p-6">
                {/* GENERAL TAB */}
                <TabsContent value="general" className="mt-0">
                  <Card className="border-0 shadow-none">
                    <CardHeader className="px-0 pt-0">
                      <CardTitle className="text-xl font-semibold text-gray-900 dark:text-white">
                        General Information
                      </CardTitle>
                    </CardHeader>
                    <CardContent className="space-y-5 px-0">
                      <div className="space-y-2">
                        <Label htmlFor="companyName" className="text-sm font-medium text-gray-700 dark:text-gray-300">
                          Company Name <span className="text-red-500">*</span>
                        </Label>
                        <Input
                          id="companyName"
                          {...register("companyName")}
                          placeholder="Enter company name"
                          className="focus:ring-blue-500 focus:border-blue-500"
                        />
                        {errors.companyName && (
                          <p className="text-sm text-red-600">{errors.companyName.message}</p>
                        )}
                      </div>

                      <div className="space-y-2">
                        <Label htmlFor="email" className="text-sm font-medium text-gray-700 dark:text-gray-300">
                          Email Address <span className="text-red-500">*</span>
                        </Label>
                        <Input
                          id="email"
                          type="email"
                          {...register("email")}
                          placeholder="admin@company.com"
                          className="focus:ring-blue-500 focus:border-blue-500"
                        />
                        {errors.email && (
                          <p className="text-sm text-red-600">{errors.email.message}</p>
                        )}
                      </div>

                      <div className="space-y-2">
                        <Label htmlFor="domain" className="text-sm font-medium text-gray-700 dark:text-gray-300">
                          Domain <span className="text-red-500">*</span>
                        </Label>
                        <Input
                          id="domain"
                          {...register("domain")}
                          placeholder="company"
                          className="focus:ring-blue-500 focus:border-blue-500"
                        />
                        {errors.domain && (
                          <p className="text-sm text-red-600">{errors.domain.message}</p>
                        )}
                      </div>

                      <div className="space-y-2">
                        <Label htmlFor="website" className="text-sm font-medium text-gray-700 dark:text-gray-300">
                          Website
                        </Label>
                        <Input
                          id="website"
                          {...register("website")}
                          placeholder="https://www.company.com"
                          className="focus:ring-blue-500 focus:border-blue-500"
                        />
                      </div>
                    </CardContent>
                  </Card>
                </TabsContent>

                {/* BRANDING TAB */}
                <TabsContent value="branding" className="mt-0">
                  <Card className="border-0 shadow-none">
                    <CardHeader className="px-0 pt-0">
                      <CardTitle className="text-xl font-semibold text-gray-900 dark:text-white">
                        Branding
                      </CardTitle>
                    </CardHeader>
                    <CardContent className="space-y-5 px-0">
                      <div className="space-y-3">
                        <Label className="text-sm font-medium text-gray-700 dark:text-gray-300">
                          Company Logo
                        </Label>
                        
                        {logoPreview && (
                          <div className="relative inline-block">
                            <img 
                              src={logoPreview} 
                              alt="Company Logo" 
                              className="h-20 w-20 rounded-lg border-2 border-gray-200 dark:border-gray-700 object-cover"
                            />
                          </div>
                        )}

                        <div className="flex flex-wrap gap-3">
                          <Button
                            type="button"
                            onClick={() => document.getElementById("logo")?.click()}
                            className="bg-blue-600 hover:bg-blue-700 text-white"
                          >
                            <Upload className="h-4 w-4 mr-2" />
                            Upload Logo
                          </Button>

                          {logoPreview && (
                            <Button
                              type="button"
                              variant="outline"
                              onClick={removeLogo}
                              className="border-red-300 text-red-600 hover:bg-red-50 hover:text-red-700 dark:border-red-700 dark:text-red-400 dark:hover:bg-red-950"
                            >
                              <Trash2 className="h-4 w-4 mr-2" />
                              Remove Logo
                            </Button>
                          )}
                        </div>

                        <p className="text-xs text-gray-500 dark:text-gray-400 mt-2">
                          Recommended: Square image, minimum 200x200px. Max file size: 2MB
                        </p>

                        <input
                          id="logo"
                          type="file"
                          accept="image/*"
                          hidden
                          onChange={handleLogo}
                        />
                      </div>
                    </CardContent>
                  </Card>
                </TabsContent>

                {/* ASSESSMENT TAB */}
                <TabsContent value="assessment" className="mt-0">
                  <Card className="border-0 shadow-none">
                    <CardHeader className="px-0 pt-0">
                      <CardTitle className="text-xl font-semibold text-gray-900 dark:text-white">
                        Assessment Settings
                      </CardTitle>
                    </CardHeader>
                    <CardContent className="space-y-5 px-0">
                      <div className="space-y-2">
                        <Label htmlFor="mcqDuration" className="text-sm font-medium text-gray-700 dark:text-gray-300">
                          MCQ Duration (minutes)
                        </Label>
                        <Input
                          id="mcqDuration"
                          type="number"
                          {...register("mcqDuration")}
                          placeholder="30"
                          className="focus:ring-blue-500 focus:border-blue-500"
                        />
                        {errors.mcqDuration && (
                          <p className="text-sm text-red-600">{errors.mcqDuration.message}</p>
                        )}
                      </div>

                      <div className="space-y-2">
                        <Label htmlFor="codingDuration" className="text-sm font-medium text-gray-700 dark:text-gray-300">
                          Coding Duration (minutes)
                        </Label>
                        <Input
                          id="codingDuration"
                          type="number"
                          {...register("codingDuration")}
                          placeholder="45"
                          className="focus:ring-blue-500 focus:border-blue-500"
                        />
                        {errors.codingDuration && (
                          <p className="text-sm text-red-600">{errors.codingDuration.message}</p>
                        )}
                      </div>

                      <div className="space-y-2">
                        <Label htmlFor="passingScore" className="text-sm font-medium text-gray-700 dark:text-gray-300">
                          Passing Score (%)
                        </Label>
                        <Input
                          id="passingScore"
                          type="number"
                          {...register("passingScore")}
                          placeholder="60"
                          className="focus:ring-blue-500 focus:border-blue-500"
                        />
                        {errors.passingScore && (
                          <p className="text-sm text-red-600">{errors.passingScore.message}</p>
                        )}
                      </div>
                    </CardContent>
                  </Card>
                </TabsContent>

                {/* SECURITY TAB */}
                <TabsContent value="security" className="mt-0">
                  <Card className="border-0 shadow-none">
                    <CardHeader className="px-0 pt-0">
                      <CardTitle className="text-xl font-semibold text-gray-900 dark:text-white">
                        Security Settings
                      </CardTitle>
                    </CardHeader>
                    <CardContent className="space-y-5 px-0">
                      <div className="flex items-center justify-between p-4 bg-gray-50 dark:bg-gray-800/50 rounded-lg">
                        <div>
                          <p className="font-medium text-gray-900 dark:text-white">Allow Signup</p>
                          <p className="text-sm text-gray-500 dark:text-gray-400">
                            Allow new users to sign up to your organization
                          </p>
                        </div>
                        <Switch
                          checked={watchSignup}
                          onCheckedChange={(v) => setValue("allowSignup", v)}
                          className="data-[state=checked]:bg-blue-600"
                        />
                      </div>

                      <div className="flex items-center justify-between p-4 bg-gray-50 dark:bg-gray-800/50 rounded-lg">
                        <div>
                          <p className="font-medium text-gray-900 dark:text-white">Invite Only</p>
                          <p className="text-sm text-gray-500 dark:text-gray-400">
                            Restrict access to invited users only
                          </p>
                        </div>
                        <Switch
                          checked={watchInvite}
                          onCheckedChange={(v) => setValue("inviteOnly", v)}
                          className="data-[state=checked]:bg-blue-600"
                        />
                      </div>
                    </CardContent>
                  </Card>
                </TabsContent>

                {/* TEAM TAB */}
                <TabsContent value="team" className="mt-0">
                  <Card className="border-0 shadow-none">
                    <CardHeader className="px-0 pt-0">
                      <CardTitle className="text-xl font-semibold text-gray-900 dark:text-white">
                        Team Members
                      </CardTitle>
                    </CardHeader>
                    <CardContent className="px-0">
                      <div className="space-y-3">
                        <div className="flex items-center justify-between p-3 bg-gray-50 dark:bg-gray-800/50 rounded-lg">
                          <div>
                            <p className="font-medium text-gray-900 dark:text-white">admin@perfect.com</p>
                            <p className="text-xs text-gray-500 dark:text-gray-400">Joined Jan 2024</p>
                          </div>
                          <Badge className="bg-blue-100 text-blue-700 dark:bg-blue-900/30 dark:text-blue-400">
                            Admin
                          </Badge>
                        </div>
                        
                        <Button 
                          type="button"
                          className="w-full md:w-auto bg-blue-600 hover:bg-blue-700 text-white mt-4"
                        >
                          <Users className="h-4 w-4 mr-2" />
                          Invite Team Member
                        </Button>
                      </div>
                    </CardContent>
                  </Card>
                </TabsContent>

                {/* DANGER TAB */}
                <TabsContent value="danger" className="mt-0">
                  <Card className="border-2 border-red-200 dark:border-red-800 bg-red-50/50 dark:bg-red-950/20">
                    <CardHeader className="px-4 pt-4">
                      <CardTitle className="text-xl font-semibold text-red-600 dark:text-red-400 flex items-center gap-2">
                        <AlertTriangle className="h-5 w-5" />
                        Danger Zone
                      </CardTitle>
                    </CardHeader>
                    <CardContent className="px-4 pb-4">
                      <div className="space-y-4">
                        <div className="p-4 bg-white dark:bg-gray-800 rounded-lg border border-red-200 dark:border-red-800">
                          <h3 className="font-semibold text-gray-900 dark:text-white mb-2">
                            Delete Organization
                          </h3>
                          <p className="text-sm text-gray-600 dark:text-gray-400 mb-3">
                            Once you delete your organization, all data will be permanently removed. 
                            This action cannot be undone.
                          </p>
                          <Button 
                            type="button"
                            variant="destructive"
                            className="bg-red-600 hover:bg-red-700"
                            onClick={() => {
                              if (confirm("Are you sure? This action cannot be undone!")) {
                                toast.error("Organization deletion request sent");
                              }
                            }}
                          >
                            <Trash2 className="h-4 w-4 mr-2" />
                            Delete Organization
                          </Button>
                        </div>
                      </div>
                    </CardContent>
                  </Card>
                </TabsContent>
              </div>
            </Tabs>
          </div>

          {/* SAVE BUTTON */}
          <div className="flex justify-end p-6 border-t border-gray-200 dark:border-gray-700 bg-gray-50 dark:bg-gray-800/50 rounded-b-lg">
            <Button
              type="submit"
              disabled={loading}
              className="bg-blue-600 hover:bg-blue-700 text-white px-6 min-w-[140px]"
            >
              {loading ? (
                <>
                  <div className="animate-spin rounded-full h-4 w-4 border-b-2 border-white mr-2"></div>
                  Saving...
                </>
              ) : (
                "Save Changes"
              )}
            </Button>
          </div>
        </div>
      </div>
    </form>
  );
}

// Helper Badge component (if not imported from UI library)
const Badge = ({ children, className }: { children: React.ReactNode; className?: string }) => (
  <span className={`inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium ${className}`}>
    {children}
  </span>
);