import React from "react";
import Dashboard from "./components/Dashboard";

const App: React.FC = () => {
  return (
    <div className="min-h-screen bg-gray-50 font-sans text-gray-900">
      <nav className="bg-white shadow-sm border-b border-gray-200">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="flex justify-between h-16 items-center">
            <div className="flex items-center gap-3">
              <div className="w-8 h-8 bg-indigo-600 text-white rounded flex items-center justify-center font-bold text-xl">
                C
              </div>
              <span className="font-bold text-lg sm:text-xl text-gray-900 tracking-tight">
                CampaignMS
              </span>
            </div>
            <div className="w-8 h-8 rounded-full bg-indigo-100 border border-indigo-200 flex items-center justify-center text-indigo-700 font-bold text-sm">
              AD
            </div>
          </div>
        </div>
      </nav>

      <main className="py-4 sm:py-8">
        <Dashboard />
      </main>
    </div>
  );
};

export default App;
