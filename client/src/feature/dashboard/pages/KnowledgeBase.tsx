import { useState } from "react";
import { useNavigate } from "react-router-dom";
import {
  Search,
  BookOpen,
  FileText,
  Video,
  FileQuestion,
  Code,
  Database,
  Cloud,
  Shield,
  Zap,
  TrendingUp,
  Users,
  Clock,
  Eye,
  Heart,
  Share2,
  ChevronRight,
  Filter,
  Plus,
  Edit,
  Trash2,
  MoreVertical,
  Star,
  Award,
  Lightbulb,
  Target,
  Rocket,
  Sparkles,
  CheckCircle2,
  Play,
  Download,
  ExternalLink,
  Bookmark,
  MessageCircle,
} from "lucide-react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import {
  Card,
  CardContent,
  CardDescription,
  CardFooter,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from "@/components/ui/dialog";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";
import { Textarea } from "@/components/ui/textarea";
import { Label } from "@/components/ui/label";
import { Separator } from "@/components/ui/separator";
import { Progress } from "@/components/ui/progress";
import { ScrollArea } from "@/components/ui/scroll-area";

// Demo data
const categories = [
  { id: 1, name: "Getting Started", icon: Rocket, count: 8, color: "text-blue-500" },
  { id: 2, name: "Assessment Creation", icon: FileText, count: 12, color: "text-green-500" },
  { id: 3, name: "Candidate Management", icon: Users, count: 6, color: "text-purple-500" },
  { id: 4, name: "Analytics & Reports", icon: TrendingUp, count: 5, color: "text-orange-500" },
  { id: 5, name: "Technical Guides", icon: Code, count: 15, color: "text-red-500" },
  { id: 6, name: "Best Practices", icon: Award, count: 7, color: "text-indigo-500" },
  { id: 7, name: "API Documentation", icon: Database, count: 4, color: "text-cyan-500" },
  { id: 8, name: "Security", icon: Shield, count: 3, color: "text-rose-500" },
];

const articles = [
  {
    id: 1,
    title: "Getting Started with Evalur Platform",
    description: "Learn how to set up your first assessment and invite candidates",
    content: "Complete guide to getting started with Evalur platform...",
    category: "Getting Started",
    author: "Sarah Johnson",
    authorAvatar: "https://i.pravatar.cc/150?img=1",
    date: "2024-01-15",
    readTime: 5,
    views: 1245,
    likes: 89,
    isPremium: false,
    tags: ["beginner", "tutorial"],
    type: "article",
  },
  {
    id: 2,
    title: "Creating Effective Technical Assessments",
    description: "Best practices for designing assessments that truly evaluate skills",
    content: "Learn how to create assessments that measure real-world skills...",
    category: "Assessment Creation",
    author: "Michael Chen",
    authorAvatar: "https://i.pravatar.cc/150?img=2",
    date: "2024-01-10",
    readTime: 8,
    views: 2341,
    likes: 156,
    isPremium: true,
    tags: ["best practices", "assessment design"],
    type: "article",
  },
  {
    id: 3,
    title: "Video Tutorial: Building Your First Assessment",
    description: "Step-by-step video guide to creating assessments",
    content: "Watch this comprehensive video tutorial...",
    category: "Getting Started",
    author: "Emily Rodriguez",
    authorAvatar: "https://i.pravatar.cc/150?img=3",
    date: "2024-01-05",
    readTime: 15,
    views: 3421,
    likes: 234,
    isPremium: false,
    tags: ["video", "tutorial"],
    type: "video",
  },
  {
    id: 4,
    title: "Understanding Assessment Analytics",
    description: "How to interpret candidate performance data and make informed decisions",
    content: "Deep dive into analytics dashboard and metrics...",
    category: "Analytics & Reports",
    author: "David Kim",
    authorAvatar: "https://i.pravatar.cc/150?img=4",
    date: "2024-01-12",
    readTime: 6,
    views: 987,
    likes: 67,
    isPremium: true,
    tags: ["analytics", "data driven"],
    type: "article",
  },
  {
    id: 5,
    title: "Advanced Question Types Explained",
    description: "Learn about coding challenges, video responses, and more",
    content: "Explore different question types and when to use them...",
    category: "Technical Guides",
    author: "Alex Thompson",
    authorAvatar: "https://i.pravatar.cc/150?img=5",
    date: "2024-01-08",
    readTime: 10,
    views: 1567,
    likes: 123,
    isPremium: false,
    tags: ["advanced", "question types"],
    type: "article",
  },
  {
    id: 6,
    title: "Anti-cheating Mechanisms: Best Practices",
    description: "How to maintain assessment integrity with our security features",
    content: "Comprehensive guide to preventing cheating...",
    category: "Security",
    author: "Lisa Wang",
    authorAvatar: "https://i.pravatar.cc/150?img=6",
    date: "2024-01-03",
    readTime: 7,
    views: 876,
    likes: 94,
    isPremium: true,
    tags: ["security", "proctoring"],
    type: "article",
  },
  {
    id: 7,
    title: "API Integration Guide",
    description: "Connect Evalur with your existing systems using our REST API",
    content: "Complete API documentation with examples...",
    category: "API Documentation",
    author: "James Wilson",
    authorAvatar: "https://i.pravatar.cc/150?img=7",
    date: "2024-01-18",
    readTime: 12,
    views: 543,
    likes: 45,
    isPremium: false,
    tags: ["api", "integration"],
    type: "article",
  },
  {
    id: 8,
    title: "Quick Tip: Using Templates",
    description: "Save time by using and customizing assessment templates",
    content: "Learn how to leverage templates for faster assessment creation...",
    category: "Best Practices",
    author: "Maria Garcia",
    authorAvatar: "https://i.pravatar.cc/150?img=8",
    date: "2024-01-14",
    readTime: 4,
    views: 2345,
    likes: 178,
    isPremium: false,
    tags: ["templates", "productivity"],
    type: "article",
  },
];

const popularTopics = [
  { name: "Creating assessments", count: 45, icon: FileText },
  { name: "Inviting candidates", count: 32, icon: Users },
  { name: "Understanding scores", count: 28, icon: TrendingUp },
  { name: "Video proctoring", count: 23, icon: Video },
  { name: "API integration", count: 19, icon: Database },
];

const KnowledgeBase = () => {
  const navigate = useNavigate();
  const [searchTerm, setSearchTerm] = useState("");
  const [selectedCategory, setSelectedCategory] = useState("all");
  const [selectedType, setSelectedType] = useState("all");
  const [viewArticle, setViewArticle] = useState<any>(null);
  const [showCreateDialog, setShowCreateDialog] = useState(false);
  const [newArticle, setNewArticle] = useState({
    title: "",
    category: "",
    content: "",
    tags: "",
  });
  const [bookmarkedArticles, setBookmarkedArticles] = useState<number[]>([]);

  // Filter articles
  const filteredArticles = articles.filter((article) => {
    const matchesSearch = article.title.toLowerCase().includes(searchTerm.toLowerCase()) ||
                         article.description.toLowerCase().includes(searchTerm.toLowerCase()) ||
                         article.tags.some(tag => tag.toLowerCase().includes(searchTerm.toLowerCase()));
    const matchesCategory = selectedCategory === "all" || article.category === selectedCategory;
    const matchesType = selectedType === "all" || article.type === selectedType;
    return matchesSearch && matchesCategory && matchesType;
  });

  // Popular articles (most viewed)
  const popularArticles = [...articles].sort((a, b) => b.views - a.views).slice(0, 5);

  // Recent articles
  const recentArticles = [...articles].sort((a, b) => new Date(b.date).getTime() - new Date(a.date).getTime()).slice(0, 5);

  const toggleBookmark = (articleId: number) => {
    if (bookmarkedArticles.includes(articleId)) {
      setBookmarkedArticles(bookmarkedArticles.filter(id => id !== articleId));
    } else {
      setBookmarkedArticles([...bookmarkedArticles, articleId]);
    }
  };

  const ArticleCard = ({ article }: { article: any }) => {
    const CategoryIcon = categories.find(c => c.name === article.category)?.icon || FileText;
    const isBookmarked = bookmarkedArticles.includes(article.id);

    return (
      <Card 
        className="hover:shadow-xl transition-all duration-300 cursor-pointer group overflow-hidden"
        onClick={() => setViewArticle(article)}
      >
        {/* Premium Badge */}
        {article.isPremium && (
          <div className="absolute top-4 right-4 z-10">
            <Badge variant="default" className="bg-gradient-to-r from-amber-500 to-orange-500">
              <Sparkles className="w-3 h-3 mr-1" />
              Premium
            </Badge>
          </div>
        )}
        
        <CardHeader>
          <div className="flex items-start justify-between">
            <div className="flex items-center gap-2 mb-2">
              <CategoryIcon className={`w-4 h-4 ${categories.find(c => c.name === article.category)?.color}`} />
              <span className="text-xs text-muted-foreground">{article.category}</span>
            </div>
            <Button
              variant="ghost"
              size="icon"
              className="opacity-0 group-hover:opacity-100 transition-opacity"
              onClick={(e) => {
                e.stopPropagation();
                toggleBookmark(article.id);
              }}
            >
              <Bookmark className={`w-4 h-4 ${isBookmarked ? 'fill-primary text-primary' : ''}`} />
            </Button>
          </div>
          
          <CardTitle className="text-xl group-hover:text-primary transition-colors">
            {article.title}
          </CardTitle>
          
          <CardDescription className="line-clamp-2">
            {article.description}
          </CardDescription>
        </CardHeader>
        
        <CardContent>
          <div className="flex flex-wrap gap-2">
            {article.tags.map((tag: string) => (
              <Badge key={tag} variant="secondary" className="text-xs">
                {tag}
              </Badge>
            ))}
          </div>
        </CardContent>
        
        <CardFooter className="flex justify-between items-center pt-0">
          <div className="flex items-center gap-3">
            <Avatar className="w-6 h-6">
              <AvatarImage src={article.authorAvatar} />
              <AvatarFallback>{article.author.charAt(0)}</AvatarFallback>
            </Avatar>
            <div className="text-xs text-muted-foreground">
              <p>{article.author}</p>
              <div className="flex items-center gap-2">
                <span>{new Date(article.date).toLocaleDateString()}</span>
                <span>•</span>
                <span>{article.readTime} min read</span>
              </div>
            </div>
          </div>
          
          <div className="flex items-center gap-3 text-xs text-muted-foreground">
            <div className="flex items-center gap-1">
              <Eye className="w-3 h-3" />
              {article.views}
            </div>
            <div className="flex items-center gap-1">
              <Heart className="w-3 h-3" />
              {article.likes}
            </div>
          </div>
        </CardFooter>
      </Card>
    );
  };

  const ArticleViewDialog = ({ article, open, onOpenChange }: any) => {
    if (!article) return null;

    const CategoryIcon = categories.find(c => c.name === article.category)?.icon || FileText;

    return (
      <Dialog open={open} onOpenChange={onOpenChange}>
        <DialogContent className="max-w-4xl max-h-[90vh] overflow-y-auto">
          <DialogHeader>
            <div className="flex items-center gap-2 mb-4">
              <CategoryIcon className="w-5 h-5 text-primary" />
              <Badge variant="outline">{article.category}</Badge>
              {article.isPremium && (
                <Badge variant="default" className="bg-gradient-to-r from-amber-500 to-orange-500">
                  Premium Content
                </Badge>
              )}
            </div>
            <DialogTitle className="text-2xl">{article.title}</DialogTitle>
            <DialogDescription className="text-base mt-2">
              {article.description}
            </DialogDescription>
          </DialogHeader>
          
          <div className="flex items-center justify-between py-4 border-y">
            <div className="flex items-center gap-3">
              <Avatar className="w-10 h-10">
                <AvatarImage src={article.authorAvatar} />
                <AvatarFallback>{article.author.charAt(0)}</AvatarFallback>
              </Avatar>
              <div>
                <p className="font-medium">{article.author}</p>
                <p className="text-sm text-muted-foreground">
                  Published on {new Date(article.date).toLocaleDateString()}
                </p>
              </div>
            </div>
            
            <div className="flex items-center gap-4">
              <div className="flex items-center gap-1 text-sm text-muted-foreground">
                <Clock className="w-4 h-4" />
                {article.readTime} min read
              </div>
              <div className="flex items-center gap-1 text-sm text-muted-foreground">
                <Eye className="w-4 h-4" />
                {article.views} views
              </div>
            </div>
          </div>
          
          <div className="prose prose-sm max-w-none dark:prose-invert py-4">
            {article.type === "video" ? (
              <div className="aspect-video bg-muted rounded-lg flex items-center justify-center">
                <div className="text-center">
                  <Play className="w-16 h-16 mx-auto text-muted-foreground mb-4" />
                  <p className="text-muted-foreground">Video content would play here</p>
                </div>
              </div>
            ) : (
              <>
                <p className="lead">{article.description}</p>
                <p>{article.content}</p>
                <p>Lorem ipsum dolor sit amet, consectetur adipiscing elit. Sed do eiusmod tempor incididunt ut labore et dolore magna aliqua. Ut enim ad minim veniam, quis nostrud exercitation ullamco laboris.</p>
                <h3>Key Takeaways</h3>
                <ul>
                  <li>Important point one about {article.title.toLowerCase()}</li>
                  <li>Important point two that users should remember</li>
                  <li>Final key takeaway for implementing best practices</li>
                </ul>
              </>
            )}
          </div>
          
          <div className="flex items-center justify-between pt-4 border-t">
            <div className="flex gap-2">
              <Button variant="outline" size="sm">
                <Heart className="w-4 h-4 mr-2" />
                Like ({article.likes})
              </Button>
              <Button variant="outline" size="sm">
                <Share2 className="w-4 h-4 mr-2" />
                Share
              </Button>
              <Button variant="outline" size="sm">
                <Bookmark className="w-4 h-4 mr-2" />
                Bookmark
              </Button>
            </div>
            
            <Button>
              <MessageCircle className="w-4 h-4 mr-2" />
              Ask Question
            </Button>
          </div>
        </DialogContent>
      </Dialog>
    );
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-slate-50 via-white to-blue-50 dark:from-slate-950 dark:via-slate-900 dark:to-slate-950">
      {/* Hero Section */}
      <div className="bg-gradient-to-r from-primary/10 via-primary/5 to-transparent border-b">
        <div className="container mx-auto px-4 py-12 md:py-16">
          <div className="text-center max-w-3xl mx-auto">
            <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-primary/10 text-primary text-sm mb-4">
              <BookOpen className="w-4 h-4" />
              <span>Knowledge Base</span>
            </div>
            <h1 className="text-3xl md:text-4xl font-bold mb-4 bg-gradient-to-r from-primary to-primary/60 bg-clip-text text-transparent">
              How can we help you today?
            </h1>
            <p className="text-muted-foreground mb-8">
              Search our knowledge base for tutorials, guides, and best practices
            </p>
            
            {/* Search Bar */}
            <div className="relative max-w-2xl mx-auto">
              <Search className="absolute left-4 top-1/2 transform -translate-y-1/2 w-5 h-5 text-muted-foreground" />
              <Input
                placeholder="Search for articles, guides, or topics..."
                value={searchTerm}
                onChange={(e) => setSearchTerm(e.target.value)}
                className="pl-12 py-6 text-lg shadow-lg"
              />
            </div>
          </div>
        </div>
      </div>

      <div className="container mx-auto px-4 py-8">
        {/* Categories Section */}
        <div className="mb-12">
          <div className="flex justify-between items-center mb-6">
            <h2 className="text-2xl font-bold">Browse by Category</h2>
            <Button variant="ghost" onClick={() => setSelectedCategory("all")}>
              View All
              <ChevronRight className="w-4 h-4 ml-1" />
            </Button>
          </div>
          
          <div className="grid grid-cols-2 md:grid-cols-4 lg:grid-cols-8 gap-4">
            {categories.map((category) => {
              const Icon = category.icon;
              return (
                <Card
                  key={category.id}
                  className={`cursor-pointer transition-all hover:shadow-lg ${
                    selectedCategory === category.name ? "border-primary shadow-md" : ""
                  }`}
                  onClick={() => setSelectedCategory(
                    selectedCategory === category.name ? "all" : category.name
                  )}
                >
                  <CardContent className="p-4 text-center">
                    <Icon className={`w-8 h-8 mx-auto mb-2 ${category.color}`} />
                    <p className="text-sm font-medium">{category.name}</p>
                    <p className="text-xs text-muted-foreground">{category.count} articles</p>
                  </CardContent>
                </Card>
              );
            })}
          </div>
        </div>

        {/* Main Content */}
        <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
          {/* Left Column - Articles */}
          <div className="lg:col-span-2">
            <div className="flex justify-between items-center mb-6">
              <h2 className="text-2xl font-bold">
                {selectedCategory === "all" ? "All Articles" : selectedCategory}
              </h2>
              
              <div className="flex gap-2">
                <Select value={selectedType} onValueChange={setSelectedType}>
                  <SelectTrigger className="w-[130px]">
                    <Filter className="w-4 h-4 mr-2" />
                    <SelectValue placeholder="Type" />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="all">All Types</SelectItem>
                    <SelectItem value="article">Articles</SelectItem>
                    <SelectItem value="video">Videos</SelectItem>
                  </SelectContent>
                </Select>
              </div>
            </div>
            
            <div className="space-y-4">
              {filteredArticles.length === 0 ? (
                <Card>
                  <CardContent className="text-center py-12">
                    <BookOpen className="w-12 h-12 mx-auto text-muted-foreground mb-3" />
                    <p className="text-muted-foreground">No articles found</p>
                    <Button variant="link" onClick={() => {
                      setSearchTerm("");
                      setSelectedCategory("all");
                      setSelectedType("all");
                    }}>
                      Clear filters
                    </Button>
                  </CardContent>
                </Card>
              ) : (
                filteredArticles.map((article) => (
                  <ArticleCard key={article.id} article={article} />
                ))
              )}
            </div>
          </div>

          {/* Right Column - Sidebar */}
          <div className="space-y-6">
            {/* Popular Topics */}
            <Card>
              <CardHeader>
                <CardTitle className="text-lg flex items-center gap-2">
                  <TrendingUp className="w-5 h-5 text-primary" />
                  Popular Topics
                </CardTitle>
              </CardHeader>
              <CardContent className="space-y-3">
                {popularTopics.map((topic) => {
                  const Icon = topic.icon;
                  return (
                    <div
                      key={topic.name}
                      className="flex items-center justify-between p-2 rounded-lg hover:bg-muted cursor-pointer transition-colors"
                      onClick={() => setSearchTerm(topic.name)}
                    >
                      <div className="flex items-center gap-3">
                        <Icon className="w-4 h-4 text-muted-foreground" />
                        <span className="text-sm">{topic.name}</span>
                      </div>
                      <Badge variant="secondary">{topic.count}</Badge>
                    </div>
                  );
                })}
              </CardContent>
            </Card>

            {/* Popular Articles */}
            <Card>
              <CardHeader>
                <CardTitle className="text-lg flex items-center gap-2">
                  <Star className="w-5 h-5 text-yellow-500" />
                  Most Popular
                </CardTitle>
              </CardHeader>
              <CardContent className="space-y-3">
                {popularArticles.map((article) => (
                  <div
                    key={article.id}
                    className="cursor-pointer hover:bg-muted p-2 rounded-lg transition-colors"
                    onClick={() => setViewArticle(article)}
                  >
                    <p className="text-sm font-medium line-clamp-2">{article.title}</p>
                    <div className="flex items-center gap-2 mt-1 text-xs text-muted-foreground">
                      <Eye className="w-3 h-3" />
                      <span>{article.views} views</span>
                      <span>•</span>
                      <span>{article.readTime} min read</span>
                    </div>
                  </div>
                ))}
              </CardContent>
            </Card>

            {/* Recent Updates */}
            <Card>
              <CardHeader>
                <CardTitle className="text-lg flex items-center gap-2">
                  <Clock className="w-5 h-5 text-blue-500" />
                  Recent Updates
                </CardTitle>
              </CardHeader>
              <CardContent className="space-y-3">
                {recentArticles.map((article) => (
                  <div
                    key={article.id}
                    className="cursor-pointer hover:bg-muted p-2 rounded-lg transition-colors"
                    onClick={() => setViewArticle(article)}
                  >
                    <p className="text-sm font-medium line-clamp-2">{article.title}</p>
                    <p className="text-xs text-muted-foreground mt-1">
                      {new Date(article.date).toLocaleDateString()}
                    </p>
                  </div>
                ))}
              </CardContent>
            </Card>

            {/* Need Help */}
            <Card className="bg-gradient-to-r from-primary/10 to-primary/5 border-primary/20">
              <CardContent className="pt-6 text-center">
                <Lightbulb className="w-12 h-12 mx-auto text-primary mb-3" />
                <h3 className="font-semibold mb-2">Need more help?</h3>
                <p className="text-sm text-muted-foreground mb-4">
                  Can't find what you're looking for? Contact our support team.
                </p>
                <Button className="w-full">
                  Contact Support
                </Button>
              </CardContent>
            </Card>
          </div>
        </div>

        {/* Newsletter Section */}
        <Card className="mt-12  ">
          <CardContent className="p-8 text-center">
            <h3 className="text-2xl font-bold mb-2">Stay Updated</h3>
            <p className="mb-6 opacity-90">
              Get the latest tutorials, guides, and product updates delivered to your inbox
            </p>
            <div className="flex max-w-md mx-auto gap-2">
              <Input
                type="email"
                placeholder="Enter your email"
                 
              />
              <Button variant="secondary">
                Subscribe
              </Button>
            </div>
          </CardContent>
        </Card>
      </div>

      {/* Article View Dialog */}
      <ArticleViewDialog
        article={viewArticle}
        open={!!viewArticle}
        onOpenChange={() => setViewArticle(null)}
      />
    </div>
  );
};

export default KnowledgeBase;