import { useParams, useNavigate } from "react-router-dom";
import { useAssessmentResult } from  '@/feature/dashboard/api/assessmentApi'
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";

export default function AssessmentResult() {
  const { id } = useParams();
  const navigate = useNavigate();

  const { data, isLoading } = useAssessmentResult(id!);

  if (isLoading) {
    return <div className="p-6">Loading result...</div>;
  }

  if (!data) {
    return <div className="p-6">No result found</div>;
  }

  const {
    score,
    rank,
    totalCandidates,
    mcqScore,
    codingScore,
    mcqTotal,
    codingTotal,
  } = data;

  return (
    <div className="p-6 max-w-3xl mx-auto space-y-6">

      {/* HEADER */}
      <Card>
        <CardHeader>
          <CardTitle>Assessment Result</CardTitle>
        </CardHeader>

        <CardContent className="space-y-4">

          <div className="flex justify-between">
            <p className="text-gray-600">Score</p>
            <p className="text-xl font-bold text-green-600">
              {score}%
            </p>
          </div>

          <div className="flex justify-between">
            <p className="text-gray-600">Rank</p>
            <p className="text-xl font-bold text-blue-600">
              #{rank} / {totalCandidates}
            </p>
          </div>

        </CardContent>
      </Card>

      {/* BREAKDOWN */}
      <Card>
        <CardHeader>
          <CardTitle>Performance Breakdown</CardTitle>
        </CardHeader>

        <CardContent className="space-y-4">

          {/* MCQ */}
          <div>
            <div className="flex justify-between text-sm mb-1">
              <span>MCQ Section</span>
              <span>{mcqScore} / {mcqTotal}</span>
            </div>

            <div className="w-full bg-gray-200 rounded-full h-2">
              <div
                className="bg-blue-500 h-2 rounded-full"
                style={{
                  width: `${(mcqScore / mcqTotal) * 100}%`,
                }}
              />
            </div>
          </div>

          {/* CODING */}
          <div>
            <div className="flex justify-between text-sm mb-1">
              <span>Coding Section</span>
              <span>{codingScore} / {codingTotal}</span>
            </div>

            <div className="w-full bg-gray-200 rounded-full h-2">
              <div
                className="bg-green-500 h-2 rounded-full"
                style={{
                  width: `${(codingScore / codingTotal) * 100}%`,
                }}
              />
            </div>
          </div>

        </CardContent>
      </Card>

      {/* ACTIONS */}
      <div className="flex justify-between">
        <Button variant="outline" onClick={() => navigate("/candidate")}>
          Back to Dashboard
        </Button>

        <Button onClick={() => navigate("/")}>
          Go Home
        </Button>
      </div>

    </div>
  );
}