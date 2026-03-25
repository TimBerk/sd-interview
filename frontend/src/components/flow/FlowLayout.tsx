import { NavLink, Outlet } from 'react-router-dom';
import { Users, SquareKanban as KanbanSquare } from 'lucide-react';
import { ThemeToggle } from '../ThemeToggle';

export function FlowLayout() {
  return (
    <div className="h-screen bg-gray-50 dark:bg-gray-950 flex overflow-hidden">
      <aside className="w-56 bg-white dark:bg-gray-900 border-r border-gray-200 dark:border-gray-800 flex flex-col">
        <div className="px-5 py-5 border-b border-gray-100 dark:border-gray-800">
          <span className="text-sm font-bold tracking-widest uppercase text-gray-900 dark:text-white">
            Hiring Flow
          </span>
        </div>

        <nav className="flex-1 p-3 space-y-1">
          <NavLink
            to="/flow/candidates"
            className={({ isActive }) =>
              `flex items-center gap-3 px-3 py-2.5 rounded-xl text-sm font-medium transition-all ${
                isActive
                  ? 'bg-gray-900 dark:bg-white text-white dark:text-gray-900'
                  : 'text-gray-600 dark:text-gray-400 hover:bg-gray-100 dark:hover:bg-gray-800 hover:text-gray-900 dark:hover:text-white'
              }`
            }
          >
            <Users className="w-4 h-4" />
            Candidates
          </NavLink>

          <NavLink
            to="/flow/ways"
            className={({ isActive }) =>
              `flex items-center gap-3 px-3 py-2.5 rounded-xl text-sm font-medium transition-all ${
                isActive
                  ? 'bg-gray-900 dark:bg-white text-white dark:text-gray-900'
                  : 'text-gray-600 dark:text-gray-400 hover:bg-gray-100 dark:hover:bg-gray-800 hover:text-gray-900 dark:hover:text-white'
              }`
            }
          >
            <KanbanSquare className="w-4 h-4" />
            Kanban Board
          </NavLink>
        </nav>

        <div className="p-4 border-t border-gray-100 dark:border-gray-800 flex items-center justify-between">
          <span className="text-xs text-gray-400">Theme</span>
          <ThemeToggle />
        </div>
      </aside>

      <main className="flex-1 overflow-auto">
        <Outlet />
      </main>
    </div>
  );
}
