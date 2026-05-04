type Props = {
  question: any;
  answer: string;
  onSelect: (val: string) => void;
};

export default function QuestionCard({ question, answer, onSelect }: Props) {
  return (
    <div className="space-y-4">
      <p className="font-medium">{question.question}</p>

      {question.options.map((opt: string) => (
        <label key={opt} className="block">
          <input
            type="radio"
            checked={answer === opt}
            onChange={() => onSelect(opt)}
          />
          <span className="ml-2">{opt}</span>
        </label>
      ))}
    </div>
  );
}