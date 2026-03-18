import { CircleCheck as CheckCircle } from 'lucide-react';
import type { Section, RoomAnswer } from '../types';

interface SectionNavbarProps {
  sections: Section[];
  currentIndex: number;
  onSectionChange: (index: number) => void;
  answers: RoomAnswer[];
}

export function SectionNavbar({
  sections,
  currentIndex,
  onSectionChange,
  answers,
}: SectionNavbarProps) {
  return (
    <div className="w-14 bg-gray-950 border-r border-gray-800 flex flex-col items-center py-4 gap-2">
      {sections.map((section, index) => {
        const answer = answers[index];
        const hasAnswer = answer?.candidate_answer && answer.candidate_answer.trim();
        const isCurrent = index === currentIndex;

        return (
          <button
            key={section.id}
            onClick={() => onSectionChange(index)}
            className={`relative w-9 h-9 rounded-xl flex items-center justify-center font-medium text-sm transition-all ${
              isCurrent
                ? 'bg-white text-gray-900 shadow-lg scale-110'
                : hasAnswer
                ? 'bg-gray-700 text-white hover:bg-gray-600'
                : 'bg-gray-800 text-gray-400 hover:bg-gray-700'
            }`}
          >
            {index + 1}
            {hasAnswer && !isCurrent && (
              <CheckCircle className="absolute -top-0.5 -right-0.5 w-3 h-3 text-green-400 fill-green-400" />
            )}
          </button>
        );
      })}
    </div>
  );
}
