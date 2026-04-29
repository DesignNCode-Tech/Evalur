import { useNavigate } from "react-router-dom";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { Separator } from "@/components/ui/separator";

import {
  Users,
  FileText,
  CheckCircle,
  TrendingUp,
  Plus,
  Upload,
 
} from "lucide-react";

const OverviewPage = () => {
  const navigate = useNavigate();

  return (

        <div className="p-6 space-y-6">

          <div>
            <h1 className="text-2xl font-bold">Overview Dashboard</h1>
            <p className="text-muted-foreground">
              AI-powered hiring and assessment analytics
            </p>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-4 gap-4">

            <Card
              className="cursor-pointer hover:shadow-md"
              onClick={() => navigate("/candidates")}
            >
              <CardHeader className="flex flex-row items-center gap-2">
                <Users className="w-4 h-4" />
                <CardTitle>Candidates</CardTitle>
              </CardHeader>
              <CardContent>
                <p className="text-2xl font-bold">128</p>
              </CardContent>
            </Card>

            <Card
              className="cursor-pointer hover:shadow-md"
              onClick={() => navigate("/assessments")}
            >
              <CardHeader className="flex flex-row items-center gap-2">
                <FileText className="w-4 h-4" />
                <CardTitle>Assessments</CardTitle>
              </CardHeader>
              <CardContent>
                <p className="text-2xl font-bold">24</p>
              </CardContent>
            </Card>

            <Card
              className="cursor-pointer hover:shadow-md"
              onClick={() => navigate("/analysis")}
            >
              <CardHeader className="flex flex-row items-center gap-2">
                <CheckCircle className="w-4 h-4" />
                <CardTitle>Completion Rate</CardTitle>
              </CardHeader>
              <CardContent>
                <p className="text-2xl font-bold">87%</p>
              </CardContent>
            </Card>

            <Card
              className="cursor-pointer hover:shadow-md"
              onClick={() => navigate("/analytics")}
            >
              <CardHeader className="flex flex-row items-center gap-2">
                <TrendingUp className="w-4 h-4" />
                <CardTitle>Avg Score</CardTitle>
              </CardHeader>
              <CardContent>
                <p className="text-2xl font-bold">76%</p>
              </CardContent>
            </Card>

          </div>

          <div className="grid grid-cols-1 md:grid-cols-3 gap-6">

            <Card>
              <CardHeader>
                <CardTitle>Quick Actions</CardTitle>
              </CardHeader>

              <CardContent className="space-y-3">

                <Button
                  className="w-full justify-start"
                  onClick={() => navigate("/assessments/create")}
                >
                  <Plus className="w-4 h-4 mr-2" />
                  Create Assessment
                </Button>

                <Button
                  variant="outline"
                  className="w-full justify-start"
                  onClick={() => navigate("/candidates")}
                >
                  <Users className="w-4 h-4 mr-2" />
                  View Candidates
                </Button>

                <Button
                  variant="outline"
                  className="w-full justify-start"
                  onClick={() => navigate("/upload-docs")}
                >
                  <Upload className="w-4 h-4 mr-2" />
                  Upload Docs (RAG)
                </Button>

              </CardContent>
            </Card>

            <Card className="col-span-2">
              <CardHeader>
                <CardTitle>Recent Activity</CardTitle>
              </CardHeader>

              <CardContent className="space-y-3">

                <div className="flex justify-between text-sm">
                  <span>Shreyash completed Backend Assessment</span>
                  <Badge>Completed</Badge>
                </div>

                <div className="flex justify-between text-sm">
                  <span>Namira scored 94% in Frontend Test</span>
                  <Badge variant="secondary">High Score</Badge>
                </div>

                <div className="flex justify-between text-sm">
                  <span>Pavan started Full Stack Assessment</span>
                  <Badge variant="outline">In Progress</Badge>
                </div>

                <Separator />

                <Button
                  variant="ghost"
                  className="w-full"
                  onClick={() => navigate("/activity")}
                >
                  View Full Activity Log →
                </Button>

              </CardContent>
            </Card>

          </div>

          <Card>
            <CardHeader>
              <CardTitle>AI Insights</CardTitle>
            </CardHeader>

            <CardContent className="space-y-2 text-sm">

              <p>
                Most candidates struggle in <b>Debugging Layer</b>
              </p>

              <p>
                Backend candidates show lower system design scores
              </p>

              <p>
                 Frontend completion rate is highest (92%)
              </p>

              <Button
                variant="outline"
                className="mt-3"
                onClick={() => navigate("/insights")}
              >
                View Detailed AI Report →
              </Button>

            </CardContent>
          </Card>

        </div>
     
  );
};

export default OverviewPage;