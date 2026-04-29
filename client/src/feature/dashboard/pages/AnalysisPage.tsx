import { useNavigate, useParams, useSearchParams } from "react-router-dom";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Tabs, TabsList, TabsTrigger, TabsContent } from "@/components/ui/tabs";
import { Progress } from "@/components/ui/progress";
import { Badge } from "@/components/ui/badge";

import { Brain, Code2, Activity } from "lucide-react";

const AnalysisPage = () => {
  const navigate = useNavigate();
  const { candidateId } = useParams();
  const [searchParams, setSearchParams] = useSearchParams();

  const tab = searchParams.get("tab") || "ai";

  const setTab = (value: string) => {
    setSearchParams({ tab: value });
  };

  return (
        <div className="p-6 space-y-6">

          <div
            className="cursor-pointer hover:opacity-80"
            onClick={() => navigate(`/candidates/${candidateId}`)}
          >
            <h1 className="text-2xl font-bold">Candidate Analysis</h1>
            <p className="text-muted-foreground">
              Click to open full candidate profile →
            </p>
          </div>

          <div className="grid grid-cols-3 gap-4">

            <Card
              className="cursor-pointer hover:shadow-md"
              onClick={() =>
                navigate(`/analysis/${candidateId}?tab=knowledge`)
              }
            >
              <CardHeader>
                <CardTitle className="flex items-center gap-2">
                  <Brain className="w-4 h-4" />
                  Knowledge
                </CardTitle>
              </CardHeader>
              <CardContent>
                <Progress value={82} />
              </CardContent>
            </Card>

            <Card
              className="cursor-pointer hover:shadow-md"
              onClick={() =>
                navigate(`/analysis/${candidateId}?tab=judgment`)
              }
            >
              <CardHeader>
                <CardTitle className="flex items-center gap-2">
                  <Activity className="w-4 h-4" />
                  Judgment
                </CardTitle>
              </CardHeader>
              <CardContent>
                <Progress value={74} />
              </CardContent>
            </Card>

            <Card
              className="cursor-pointer hover:shadow-md"
              onClick={() =>
                navigate(`/analysis/${candidateId}?tab=execution`)
              }
            >
              <CardHeader>
                <CardTitle className="flex items-center gap-2">
                  <Code2 className="w-4 h-4" />
                  Execution
                </CardTitle>
              </CardHeader>
              <CardContent>
                <Progress value={68} />
              </CardContent>
            </Card>

          </div>

          <Card>

            <CardContent className="p-0">

              <Tabs value={tab} onValueChange={setTab}>

                <TabsList className="w-full justify-start border-b rounded-none">

                  <TabsTrigger value="ai">AI Summary</TabsTrigger>

                  <TabsTrigger value="code">Code</TabsTrigger>

                  <TabsTrigger
                    value="timeline"
                    onClick={() =>
                      navigate(`/analysis/${candidateId}/timeline`)
                    }
                  >
                    Timeline
                  </TabsTrigger>

                </TabsList>

                <TabsContent value="ai" className="p-6 space-y-4">

                  <div className="space-y-2">
                    <Badge
                      className="cursor-pointer"
                      onClick={() =>
                        navigate(`/analysis/${candidateId}?tab=ai-details`)
                      }
                    >
                      View Full AI Report →
                    </Badge>

                    <p className="text-sm text-muted-foreground">
                      Strong backend reasoning, weak edge-case handling.
                    </p>
                  </div>

                </TabsContent>

                <TabsContent value="code" className="p-6">

                  <div
                    className="bg-black text-green-400 p-4 rounded-md cursor-pointer"
                    onClick={() =>
                      navigate(`/analysis/${candidateId}/code`)
                    }
                  >
                    Click to open full sandbox →
                  </div>

                </TabsContent>

              </Tabs>

            </CardContent>

          </Card>

        </div>
  );
};

export default AnalysisPage;