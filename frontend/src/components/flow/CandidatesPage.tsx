import { useEffect, useState } from 'react';
import { Link } from 'react-router-dom';
import { User, ExternalLink, Calendar, ChevronRight } from 'lucide-react';
import { api } from '../../services/api';
import type { Candidate } from '../../types';

const SPECIALTY_LABELS: Record<string, string> = {
  BE: 'Backend',
  FE: 'Frontend',
  QA: 'QA',
  MOB: 'Mobile',
  DEVOPS: 'DevOps',
};

const SPECIALTY_COLORS: Record<string, string> = {
  BE: 'bg-blue-100 dark:bg-blue-900/30 text-blue-700 dark:text-blue-300',
  FE: 'bg-green-100 dark:bg-green-900/30 text-green-700 dark:text-green-300',
  QA: 'bg-yellow-100 dark:bg-yellow-900/30 text-yellow-700 dark:text-yellow-300',
  MOB: 'bg-orange-100 dark:bg-orange-900/30 text-orange-700 dark:text-orange-300',
  DEVOPS: 'bg-red-100 dark:bg-red-900/30 text-red-700 dark:text-red-300',
};

export function CandidatesPage() {
  const [candidates, setCandidates] = useState<Candidate[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    api.getCandidates().then((data) => {
      setCandidates(data);
      setLoading(false);
    });
  }, []);

  if (loading) {
    return (
      <div className="flex items-center justify-center h-full">
        <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-gray-900 dark:border-white" />
      </div>
    );
  }

  return (
    <div className="p-8">
      <div className="mb-8">
        <h1 className="text-2xl font-bold text-gray-900 dark:text-white">Candidates</h1>
        <p className="text-sm text-gray-500 dark:text-gray-400 mt-1">
          {candidates.length} candidate{candidates.length !== 1 ? 's' : ''} total
        </p>
      </div>

      {candidates.length === 0 ? (
        <div className="flex flex-col items-center justify-center py-24 text-center">
          <div className="w-16 h-16 bg-gray-100 dark:bg-gray-800 rounded-2xl flex items-center justify-center mb-4">
            <User className="w-8 h-8 text-gray-400" />
          </div>
          <p className="text-gray-500 dark:text-gray-400 text-sm">No candidates yet</p>
        </div>
      ) : (
        <div className="grid gap-4 sm:grid-cols-2 lg:grid-cols-3">
          {candidates.map((candidate) => (
            <Link
              key={candidate.id}
              to={`/flow/candidates/${candidate.id}`}
              className="group bg-white dark:bg-gray-900 rounded-2xl border border-gray-200 dark:border-gray-800 p-5 hover:border-gray-400 dark:hover:border-gray-600 hover:shadow-md transition-all"
            >
              <div className="flex items-start justify-between mb-4">
                <div className="w-11 h-11 bg-gray-100 dark:bg-gray-800 rounded-xl flex items-center justify-center">
                  <User className="w-5 h-5 text-gray-500 dark:text-gray-400" />
                </div>
                <div className="flex items-center gap-2">
                  <span className={`text-xs font-medium px-2.5 py-1 rounded-lg ${SPECIALTY_COLORS[candidate.specialty] || 'bg-gray-100 dark:bg-gray-800 text-gray-600 dark:text-gray-400'}`}>
                    {SPECIALTY_LABELS[candidate.specialty] || candidate.specialty}
                  </span>
                  <ChevronRight className="w-4 h-4 text-gray-300 dark:text-gray-600 group-hover:text-gray-500 dark:group-hover:text-gray-400 transition-colors" />
                </div>
              </div>

              <h3 className="font-semibold text-gray-900 dark:text-white text-base mb-2 leading-tight">
                {candidate.full_name}
              </h3>

              {candidate.description && (
                <p className="text-sm text-gray-500 dark:text-gray-400 line-clamp-2 mb-4 leading-relaxed">
                  {candidate.description.replace(/<[^>]*>/g, '')}
                </p>
              )}

              <div className="flex items-center justify-between mt-auto pt-3 border-t border-gray-100 dark:border-gray-800">
                <div className="flex items-center gap-1.5 text-xs text-gray-400 dark:text-gray-500">
                  <Calendar className="w-3.5 h-3.5" />
                  {new Date(candidate.created_at).toLocaleDateString('en-US', {
                    month: 'short',
                    day: 'numeric',
                    year: 'numeric',
                  })}
                </div>

                {candidate.links && candidate.links.length > 0 && (
                  <div className="flex items-center gap-1 text-xs text-gray-400 dark:text-gray-500">
                    <ExternalLink className="w-3.5 h-3.5" />
                    {candidate.links.length} link{candidate.links.length !== 1 ? 's' : ''}
                  </div>
                )}
              </div>
            </Link>
          ))}
        </div>
      )}
    </div>
  );
}
