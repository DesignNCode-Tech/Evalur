"use client";

import { useState, useEffect } from "react";
import { useNavigate } from "react-router-dom";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { Avatar, AvatarFallback } from "@/components/ui/avatar";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { Separator } from "@/components/ui/separator";
import {
  FileText,
  Users,
  Plus,
  Upload,
  UserPlus,
  ArrowRight,
  Calendar,
  Eye,
  Activity,
  BarChart3,
  Loader2,
  TrendingUp,
  Award,
  Clock
} from "lucide-react";
import { 
  LineChart, 
  Line, 
  BarChart, 
  Bar, 
  XAxis, 
  YAxis, 
  CartesianGrid, 
  Tooltip, 
  ResponsiveContainer,
  AreaChart,
  Area
} from "recharts";
import { useAuth } from "@/app/providers/AuthContext";
import api from "@/api/axios";
import { cn } from "@/lib/utils";

export default function OverviewPage() {
  const navigate = useNavigate();
  const { user } = useAuth();
  const [loading, setLoading] = useState(true);
  
  // Data State
  const [stats, setStats] = useState({
    totalAssessments: 24,
    totalCandidates: 156,
    pendingReviews: 12,
    averageScore: 78,
  });
  const [recentAssessments, setRecentAssessments] = useState<any[]>([]);
  const [recentSubmissions, setRecentSubmissions] = useState<any[]>([]);
  const [activityData, setActivityData] = useState<any[]>([]);

  useEffect(() => {
    fetchDashboardData();
  }, []);

  const fetchDashboardData = async () => {
    setLoading(true);
    try {
      // Logic for fetching from your Spring Boot /api/v1/admin/stats endpoints
      // Using mock fallback for now as defined in your setup
      setRecentAssessments([
        { id: "23", title: "SQL DEVELOPER", role: "Backend Developer", candidates: 14, status: "READY", createdAt: "2026-05-04" },
        { id: "22", title: "CYBER SECURITY INTERN", role: "Security Analyst", candidates: 8, status: "READY", createdAt: "2026-05-04" },
        { id: "20", title: "JAVA SPRING BOOT", role: "Backend Developer", candidates: 32, status: "GENERATING", createdAt: "2026-05-03" },
      ]);

      setRecentSubmissions([
        { id: "1", name: "Shreyash Bhosale", email: "shreyash@evalur.com", title: "SQL DEVELOPER", score: 85, date: "2026-05-04T10:30:00" },
        { id: "2", name: "Sahil", email: "sahil@mail.com", title: "SQL DEVELOPER", score: 0, date: "2026-05-04T09:15:00", status: "PENDING" },
      ]);

      setActivityData([
        { month: "Jan", assessments: 10, candidates: 40 },
        { month: "Feb", assessments: 15, candidates: 55 },
        { month: "Mar", assessments: 12, candidates: 70 },
        { month: "Apr", assessments: 22, candidates: 110 },
        { month: "May", assessments: 28, candidates: 156 },
      ]);
    } finally {
      setLoading(false);
    }
  };

  if (loading) {
    return (
      <div className="flex flex-col items-center justify-center min-h-[80vh] gap-4">
        <Loader2 className="h-12 w-12 animate-spin text-blue-600 opacity-20" />
        <p className="text-gray-400 font-black uppercase tracking-widest text-xs italic">Syncing Evalur Intelligence...</p>
      </div>
    );
  }

  return (
    <div className="max-w-7xl mx-auto p-6 space-y-8 animate-in fade-in duration-700">
      
      {/* 1. WELCOME HERO */}
      <div className="flex flex-col md:flex-row justify-between items-start md:items-end gap-4 border-b pb-8">
        <div>
          <h1 className="text-5xl font-black text-gray-900 tracking-tighter italic uppercase">
            System <span className="text-blue-600">Overview</span>
          </h1>
          <p className="text-gray-500 mt-2 text-lg">
            Welcome back, <span className="font-bold text-gray-900">{user?.name || "Admin"}</span>. Here is your organization's performance.
          </p>
        </div>
        <div className="flex items-center gap-2 bg-blue-50 px-4 py-2 rounded-full border border-blue-100">
            <div className="h-2 w-2 rounded-full bg-blue-600 animate-pulse" />
            <span className="text-[10px] font-black text-blue-700 uppercase tracking-widest">Server: Production v1.2</span>
        </div>
      </div>

      {/* 2. STATS GRID (Bento Style) */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
        {[
          { label: "Total Evaluations", value: stats.totalAssessments, icon: FileText, color: "text-blue-600", bg: "bg-blue-50" },
          { label: "Registered Students", value: stats.totalCandidates, icon: Users, color: "text-purple-600", bg: "bg-purple-50" },
          { label: "Average Proficiency", value: `${stats.averageScore}%`, icon: Award, color: "text-amber-600", bg: "bg-amber-50" },
          { label: "Pending Reviews", value: stats.pendingReviews, icon: Clock, color: "text-red-600", bg: "bg-red-50" },
        ].map((stat, i) => (
          <Card key={i} className="border-none shadow-xl shadow-gray-200/50 rounded-[2rem] overflow-hidden">
            <CardContent className="p-8">
              <div className={cn("p-3 rounded-2xl inline-flex mb-4", stat.bg)}>
                <stat.icon className={cn("h-6 w-6", stat.color)} />
              </div>
              <p className="text-xs font-black text-gray-400 uppercase tracking-widest">{stat.label}</p>
              <h3 className="text-4xl font-black text-gray-900 mt-1">{stat.value}</h3>
            </CardContent>
          </Card>
        ))}
      </div>

      {/* 3. QUICK ACTIONS */}
      <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
        {[
          { title: "New Assessment", desc: "Build AI-powered evaluations", icon: Plus, path: "/admin/assessments", color: "bg-blue-600" },
          { title: "Ingest Docs", desc: "Update AI knowledge base", icon: Upload, path: "/admin/knowledge", color: "bg-slate-900" },
          { title: "Invite Students", desc: "Generate secure registration links", icon: UserPlus, path: "/admin/candidates", color: "bg-green-600" },
        ].map((action, i) => (
          <Button 
            key={i}
            variant="ghost" 
            onClick={() => navigate(action.path)}
            className="h-auto p-0 rounded-[2rem] overflow-hidden group shadow-lg hover:shadow-2xl transition-all"
          >
            <div className="flex items-center w-full bg-white p-6 gap-6">
              <div className={cn("p-4 rounded-2xl text-white shadow-lg group-hover:scale-110 transition-transform", action.color)}>
                <action.icon className="h-6 w-6" />
              </div>
              <div className="text-left">
                <p className="font-black text-gray-900 uppercase tracking-tight italic">{action.title}</p>
                <p className="text-xs text-gray-400 font-medium">{action.desc}</p>
              </div>
            </div>
          </Button>
        ))}
      </div>

      {/* 4. ANALYTICS SECTION */}
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
        <Card className="border-none shadow-2xl shadow-gray-200/50 rounded-[2.5rem] overflow-hidden">
          <CardHeader className="p-8">
            <div className="flex items-center justify-between">
              <div>
                <CardTitle className="text-xl font-black uppercase italic tracking-tighter">Candidate Growth</CardTitle>
                <CardDescription>Monthly registration activity</CardDescription>
              </div>
              <TrendingUp className="h-6 w-6 text-blue-600" />
            </div>
          </CardHeader>
          <CardContent className="p-8 pt-0">
            <div className="h-72">
              <ResponsiveContainer width="100%" height="100%">
                <AreaChart data={activityData}>
                  <defs>
                    <linearGradient id="colorCand" x1="0" y1="0" x2="0" y2="1">
                      <stop offset="5%" stopColor="#2563eb" stopOpacity={0.1}/>
                      <stop offset="95%" stopColor="#2563eb" stopOpacity={0}/>
                    </linearGradient>
                  </defs>
                  <CartesianGrid strokeDasharray="3 3" vertical={false} stroke="#f0f0f0" />
                  <XAxis dataKey="month" axisLine={false} tickLine={false} tick={{fontSize: 12, fontWeight: 700}} />
                  <YAxis hide />
                  <Tooltip 
                    contentStyle={{ borderRadius: '1rem', border: 'none', boxShadow: '0 10px 15px -3px rgb(0 0 0 / 0.1)' }}
                  />
                  <Area type="monotone" dataKey="candidates" stroke="#2563eb" strokeWidth={3} fillOpacity={1} fill="url(#colorCand)" />
                </AreaChart>
              </ResponsiveContainer>
            </div>
          </CardContent>
        </Card>

        <Card className="border-none shadow-2xl shadow-gray-200/50 rounded-[2.5rem] overflow-hidden">
          <CardHeader className="p-8">
            <div className="flex items-center justify-between">
              <div>
                <CardTitle className="text-xl font-black uppercase italic tracking-tighter">Score Distribution</CardTitle>
                <CardDescription>Overall performance tiers</CardDescription>
              </div>
              <BarChart3 className="h-6 w-6 text-amber-500" />
            </div>
          </CardHeader>
          <CardContent className="p-8 pt-0">
            <div className="h-72">
              <ResponsiveContainer width="100%" height="100%">
                <BarChart data={[
                  { range: "0-40", count: 12 },
                  { range: "41-60", count: 28 },
                  { range: "61-80", count: 42 },
                  { range: "81-100", count: 31 },
                ]}>
                  <CartesianGrid strokeDasharray="3 3" vertical={false} stroke="#f0f0f0" />
                  <XAxis dataKey="range" axisLine={false} tickLine={false} />
                  <YAxis hide />
                  <Tooltip 
                    cursor={{fill: '#f8fafc'}}
                    contentStyle={{ borderRadius: '1rem', border: 'none', boxShadow: '0 10px 15px -3px rgb(0 0 0 / 0.1)' }}
                  />
                  <Bar dataKey="count" fill="#2563eb" radius={[6, 6, 0, 0]} />
                </BarChart>
              </ResponsiveContainer>
            </div>
          </CardContent>
        </Card>
      </div>

      {/* 5. RECENT ACTIVITY TABS */}
      <Tabs defaultValue="submissions" className="space-y-6">
        <div className="flex justify-start">
          <TabsList className="h-14 bg-gray-100 rounded-2xl p-1.5">
            <TabsTrigger value="submissions" className="rounded-xl px-8 font-black uppercase text-[10px] tracking-widest data-[state=active]:bg-white data-[state=active]:text-blue-600">
              Recent Submissions
            </TabsTrigger>
            <TabsTrigger value="assessments" className="rounded-xl px-8 font-black uppercase text-[10px] tracking-widest data-[state=active]:bg-white data-[state=active]:text-blue-600">
              Active Assessments
            </TabsTrigger>
          </TabsList>
        </div>

        <TabsContent value="submissions">
          <Card className="border-none shadow-xl shadow-gray-200/50 rounded-[2.5rem] overflow-hidden">
            <CardContent className="p-0">
              <div className="divide-y divide-gray-50">
                {recentSubmissions.map((sub) => (
                  <div key={sub.id} className="p-6 flex items-center justify-between hover:bg-gray-50/50 transition-colors">
                    <div className="flex items-center gap-4">
                      <Avatar className="h-12 w-12 border-2 border-white shadow-sm">
                        <AvatarFallback className="bg-blue-600 text-white font-black">{sub.name.charAt(0)}</AvatarFallback>
                      </Avatar>
                      <div>
                        <p className="font-bold text-gray-900">{sub.name}</p>
                        <p className="text-xs text-gray-400 font-medium">{sub.title}</p>
                      </div>
                    </div>
                    <div className="text-right flex items-center gap-6">
                        <div className="flex flex-col items-end">
                            {sub.score > 0 ? (
                                <span className="text-2xl font-black text-green-600">{sub.score}%</span>
                            ) : (
                                <Badge className="bg-amber-100 text-amber-700 border-none uppercase text-[9px] font-black tracking-widest">{sub.status}</Badge>
                            )}
                            <span className="text-[10px] text-gray-400 font-bold uppercase mt-1">
                                {new Date(sub.date).toLocaleDateString()}
                            </span>
                        </div>
                        <Button variant="ghost" size="icon" className="rounded-full hover:bg-blue-50 hover:text-blue-600">
                            <ArrowRight className="h-5 w-5" />
                        </Button>
                    </div>
                  </div>
                ))}
              </div>
            </CardContent>
          </Card>
        </TabsContent>

        <TabsContent value="assessments">
          <Card className="border-none shadow-xl shadow-gray-200/50 rounded-[2.5rem] overflow-hidden">
            <CardContent className="p-0">
              <div className="divide-y divide-gray-50">
                {recentAssessments.map((a) => (
                  <div key={a.id} className="p-6 flex items-center justify-between hover:bg-gray-50/50 transition-colors">
                    <div className="flex items-center gap-4">
                      <div className="p-3 bg-blue-50 rounded-xl">
                        <FileText className="h-6 w-6 text-blue-600" />
                      </div>
                      <div>
                        <p className="font-bold text-gray-900 uppercase tracking-tighter italic">{a.title}</p>
                        <p className="text-xs text-gray-400 font-medium">{a.role} • {a.candidates} Candidates</p>
                      </div>
                    </div>
                    <div className="flex items-center gap-4">
                        <Badge className={cn(
                            "uppercase text-[9px] font-black tracking-widest px-3 py-1 rounded-full",
                            a.status === 'READY' ? 'bg-green-100 text-green-700' : 'bg-amber-100 text-amber-700 animate-pulse'
                        )}>
                            {a.status}
                        </Badge>
                        <Button variant="outline" size="sm" onClick={() => navigate(`/admin/assessments/view/${a.id}`)} className="rounded-full border-gray-100 font-bold">
                            <Eye className="h-4 w-4 mr-2" /> View
                        </Button>
                    </div>
                  </div>
                ))}
              </div>
            </CardContent>
          </Card>
        </TabsContent>
      </Tabs>
    </div>
  );
}