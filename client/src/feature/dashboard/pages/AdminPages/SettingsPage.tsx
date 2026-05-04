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
import api from "@/api/axios"; // Assuming you have an axios instance with base URL

import { Upload, Trash2, Settings, Palette, FileText, Shield, Users, AlertTriangle, Globe, Phone, Building2 } from "lucide-react";

// ================= SCHEMA (Matched to Postman Payload) =================
const schema = z.object({
  name: z.string().min(2, "Organization name is required"),
  industry: z.string().min(2, "Industry is required"),
  website: z.string().url("Invalid URL format").or(z.literal("")),
  contactPhone: z.string().min(10, "Invalid phone number"),
  logoUrl: z.string().optional(),

  // Internal App Settings
  mcqDuration: z.string().default("30"),
  codingDuration: z.string().default("45"),
  passingScore: z.string().default("60"),
  allowSignup: z.boolean().default(false),
  inviteOnly: z.boolean().default(true),
});

type FormData = z.infer<typeof schema>;

export default function SettingsPage() {
  const [logoPreview, setLogoPreview] = useState<string | null>(null);
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
  });

  const watchSignup = watch("allowSignup");
  const watchInvite = watch("inviteOnly");

  // ================= 1. FETCH PROFILE DATA =================
  useEffect(() => {
    const fetchSettings = async () => {
      try {
        // Updated to your GET endpoint
        const res = await api.get("/org/profile");
        const data = res.data.data;
        reset(data);
        if (data.logoUrl) setLogoPreview(data.logoUrl);
      } catch (error) {
        toast.error("Using default settings (Server unreachable)");
        reset({
          name: "Evalur Corp",
          industry: "Technology",
          website: "https://evalur.io",
          contactPhone: "+91 9876543210",
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

  // ================= 2. SUBMIT CHANGES =================
  const onSubmit = async (data: FormData) => {
    setLoading(true);
    try {
      // Updated to your PATCH endpoint using raw JSON
      const res = await api.patch("/org/profile", {
        name: data.name,
        industry: data.industry,
        website: data.website,
        logoUrl: data.logoUrl,
        contactPhone: data.contactPhone
      });

      if (res.status === 200) {
        toast.success("Organization profile updated!");
      }
    } catch (error) {
      toast.error("Failed to update profile");
    } finally {
      setLoading(false);
    }
  };

  // ================= 3. UI HANDLERS =================
  const handleLogoUpload = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (file) {
      // In a real scenario, upload file to S3/Cloudinary first, then set URL
      const fakeUrl = URL.createObjectURL(file);
      setLogoPreview(fakeUrl);
      setValue("logoUrl", fakeUrl);
    }
  };

  return (
    <form onSubmit={handleSubmit(onSubmit)} className="max-w-5xl mx-auto p-6 space-y-8 animate-in fade-in duration-500">
      <div className="flex justify-between items-end border-b pb-6">
        <div>
          <h1 className="text-4xl font-extrabold text-gray-900 tracking-tight italic uppercase">Settings</h1>
          <p className="text-gray-500 mt-2">Configure your Evalur organization profile</p>
        </div>
        <Button type="submit" disabled={loading} className="bg-blue-600 hover:bg-blue-700 h-12 px-8 rounded-xl font-bold">
          {loading ? <Loader2 className="animate-spin mr-2" /> : "Save Changes"}
        </Button>
      </div>

      <Tabs value={activeTab} onValueChange={setActiveTab} className="w-full">
        <TabsList className="bg-gray-100 p-1 rounded-2xl mb-8">
          <TabsTrigger value="general" className="rounded-xl px-6 font-bold tracking-widest uppercase text-[10px]">
            <Settings className="h-4 w-4 mr-2" /> General
          </TabsTrigger>
          <TabsTrigger value="assessment" className="rounded-xl px-6 font-bold tracking-widest uppercase text-[10px]">
            <FileText className="h-4 w-4 mr-2" /> Assessment
          </TabsTrigger>
          <TabsTrigger value="security" className="rounded-xl px-6 font-bold tracking-widest uppercase text-[10px]">
            <Shield className="h-4 w-4 mr-2" /> Security
          </TabsTrigger>
        </TabsList>

        {/* GENERAL TAB - Linked to Postman Schema */}
        <TabsContent value="general" className="space-y-6">
          <Card className="border-none shadow-xl shadow-gray-200/50 rounded-[2rem] overflow-hidden">
            <CardHeader className="bg-gray-50/50 p-8 border-b">
              <CardTitle className="text-xl font-black italic uppercase">Organization Profile</CardTitle>
            </CardHeader>
            <CardContent className="p-8 space-y-6">
              <div className="grid md:grid-cols-2 gap-6">
                <div className="space-y-2">
                  <Label className="text-[10px] font-black uppercase text-gray-400">Company Name</Label>
                  <div className="relative">
                    <Building2 className="absolute left-3 top-3 h-4 w-4 text-gray-400" />
                    <Input {...register("name")} className="pl-10 h-12 bg-white" />
                  </div>
                  {errors.name && <p className="text-xs text-red-500">{errors.name.message}</p>}
                </div>

                <div className="space-y-2">
                  <Label className="text-[10px] font-black uppercase text-gray-400">Industry</Label>
                  <Input {...register("industry")} className="h-12 bg-white" placeholder="e.g. Technology" />
                </div>

                <div className="space-y-2">
                  <Label className="text-[10px] font-black uppercase text-gray-400">Website</Label>
                  <div className="relative">
                    <Globe className="absolute left-3 top-3 h-4 w-4 text-gray-400" />
                    <Input {...register("website")} className="pl-10 h-12 bg-white" />
                  </div>
                </div>

                <div className="space-y-2">
                  <Label className="text-[10px] font-black uppercase text-gray-400">Contact Phone</Label>
                  <div className="relative">
                    <Phone className="absolute left-3 top-3 h-4 w-4 text-gray-400" />
                    <Input {...register("contactPhone")} className="pl-10 h-12 bg-white" />
                  </div>
                </div>
              </div>

              <Separator />

              <div className="flex items-center gap-6">
                <Avatar className="h-20 w-20 border-4 border-white shadow-xl">
                  {logoPreview ? (
                    <img src={logoPreview} alt="Preview" className="object-cover" />
                  ) : (
                    <AvatarFallback className="bg-blue-600 text-white font-black">EV</AvatarFallback>
                  )}
                </Avatar>
                <div className="space-y-2">
                  <Button type="button" variant="outline" onClick={() => document.getElementById('logo-up')?.click()}>
                    Change Logo
                  </Button>
                  <input id="logo-up" type="file" hidden onChange={handleLogoUpload} accept="image/*" />
                  <p className="text-xs text-gray-400 italic">Square PNG or JPG preferred.</p>
                </div>
              </div>
            </CardContent>
          </Card>
        </TabsContent>

        {/* ASSESSMENT TAB */}
        <TabsContent value="assessment">
          <Card className="border-none shadow-xl rounded-[2rem]">
            <CardContent className="p-8 space-y-6">
              <div className="grid md:grid-cols-3 gap-6">
                <div className="space-y-2">
                  <Label className="text-[10px] font-black uppercase text-gray-400">MCQ Time (Mins)</Label>
                  <Input type="number" {...register("mcqDuration")} className="h-12" />
                </div>
                <div className="space-y-2">
                  <Label className="text-[10px] font-black uppercase text-gray-400">Coding Time (Mins)</Label>
                  <Input type="number" {...register("codingDuration")} className="h-12" />
                </div>
                <div className="space-y-2">
                  <Label className="text-[10px] font-black uppercase text-gray-400">Passing Score (%)</Label>
                  <Input type="number" {...register("passingScore")} className="h-12" />
                </div>
              </div>
            </CardContent>
          </Card>
        </TabsContent>

        {/* SECURITY TAB */}
        <TabsContent value="security">
          <Card className="border-none shadow-xl rounded-[2rem]">
            <CardContent className="p-8 space-y-6">
              <div className="flex items-center justify-between p-6 bg-gray-50 rounded-2xl">
                <div className="space-y-1">
                  <p className="font-bold text-gray-900">Invite-Only Access</p>
                  <p className="text-sm text-gray-500 italic">Only users with an invitation token can join.</p>
                </div>
                <Switch checked={watchInvite} onCheckedChange={(v) => setValue("inviteOnly", v)} />
              </div>

              <div className="flex items-center justify-between p-6 bg-gray-50 rounded-2xl">
                <div className="space-y-1">
                  <p className="font-bold text-gray-900">Public Signup</p>
                  <p className="text-sm text-gray-500 italic">Allow anyone with the link to register.</p>
                </div>
                <Switch checked={watchSignup} onCheckedChange={(v) => setValue("allowSignup", v)} />
              </div>
            </CardContent>
          </Card>
        </TabsContent>
      </Tabs>
    </form>
  );
}

const Loader2 = ({ className }: { className?: string }) => (
  <div className={`animate-spin h-5 w-5 border-2 border-white border-t-transparent rounded-full ${className}`} />
);

const Separator = () => <div className="h-[1px] bg-gray-100 w-full" />;

const Avatar = ({ children, className }: { children: React.ReactNode; className?: string }) => (
  <div className={`rounded-full overflow-hidden flex items-center justify-center bg-gray-100 ${className}`}>
    {children}
  </div>
);

const AvatarFallback = ({ children, className }: { children: React.ReactNode; className?: string }) => (
  <div className={`h-full w-full flex items-center justify-center ${className}`}>{children}</div>
);