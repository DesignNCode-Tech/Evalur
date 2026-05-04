import { useParams, useNavigate } from "react-router-dom";
import { useState } from "react";
import Timer from "../../components/Timer";
import QuestionCard from "../../components/QuestionCard";
import { useAssessment, useSubmitAssessment } from "../../hooks/useAssessment";
import { Button } from "@/components/ui/button";

export default function AssessmentPlayer() {
  const { id } = useParams();
  const navigate = useNavigate();

  const { data, isLoading } = useAssessment(id!);
  const { mutate, isPending } = useSubmitAssessment();

  const [started, setStarted] = useState(false);
  const [current, setCurrent] = useState(0);
  const [answers, setAnswers] = useState<any>({});

  if (isLoading) return <div className="p-6">Loading...</div>;

  const questions = data?.mcq || [];
  const coding = data?.coding;

  // ✅ SUBMIT
  const handleSubmit = () => {
    mutate(
      {
        assessmentId: id,
        answers,
      },
      {
        onSuccess: () => {
          navigate(`/assessment/result/${id}`);
        },
      }
    );
  };

  // 🧪 START SCREEN
  if (!started) {
    return (
      <div className="h-screen flex flex-col items-center justify-center space-y-6">
        <h1 className="text-xl font-semibold">
          Assessment: {data.title}
        </h1>

        <div className="text-sm text-gray-600 space-y-1">
          <p>- No copy paste</p>
          <p>- Stay fullscreen</p>
        </div>

        <Button onClick={() => setStarted(true)}>
          Start Test
        </Button>
      </div>
    );
  }

  const q = questions[current];

  return (
    <div className="p-6 max-w-3xl mx-auto space-y-6">

      {/* HEADER */}
      <div className="flex justify-between">
        <h2>{data.title}</h2>
        <Timer initial={1500} />
      </div>

      {/* MCQ */}
      {q && (
        <QuestionCard
          question={q}
          answer={answers[q.id]}
          onSelect={(val) =>
            setAnswers({ ...answers, [q.id]: val })
          }
        />
      )}

      {/* NAV */}
      <div className="flex justify-between">
        <Button
          disabled={current === 0}
          onClick={() => setCurrent((c) => c - 1)}
        >
          Prev
        </Button>

        {current === questions.length - 1 ? (
          <Button onClick={handleSubmit} disabled={isPending}>
            {isPending ? "Submitting..." : "Submit"}
          </Button>
        ) : (
          <Button onClick={() => setCurrent((c) => c + 1)}>
            Next
          </Button>
        )}
      </div>

      {/* CODING SECTION */}
      {coding && (
        <div className="mt-10 space-y-4">
          <h3 className="font-semibold">Coding Problem</h3>

          <p>{coding.description}</p>

          <textarea
            className="w-full border p-3 h-40"
            placeholder="Write your code here..."
          />

          <div className="flex gap-2">
            <Button variant="outline">Run</Button>
            <Button>Submit Code</Button>
          </div>
        </div>
      )}

    </div>
  );
}