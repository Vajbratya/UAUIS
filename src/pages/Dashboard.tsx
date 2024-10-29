import React from 'react';
import { Card } from '../components/ui/card';
import { Button } from '../components/ui/button';
import { motion } from 'framer-motion';

export function Dashboard() {
  return (
    <div className="min-h-screen bg-gradient-to-b from-gray-900 to-black text-white">
      <div className="flex">
        {/* Sidebar */}
        <div className="w-64 h-screen bg-gray-800/50 backdrop-blur-lg p-6 fixed">
          <div className="text-xl font-bold mb-8 bg-clip-text text-transparent bg-gradient-to-r from-blue-400 to-teal-400">
            RAD Report
          </div>
          <nav className="space-y-4">
            <Button variant="ghost" className="w-full justify-start">
              <svg className="w-5 h-5 mr-3" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M3 12l2-2m0 0l7-7 7 7M5 10v10a1 1 0 001 1h3m10-11l2 2m-2-2v10a1 1 0 01-1 1h-3m-6 0a1 1 0 001-1v-4a1 1 0 011-1h2a1 1 0 011 1v4a1 1 0 001 1m-6 0h6" />
              </svg>
              Dashboard
            </Button>
            <Button variant="ghost" className="w-full justify-start">
              <svg className="w-5 h-5 mr-3" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 12h6m-6 4h6m2 5H7a2 2 0 01-2-2V5a2 2 0 012-2h5.586a1 1 0 01.707.293l5.414 5.414a1 1 0 01.293.707V19a2 2 0 01-2 2z" />
              </svg>
              Reports
            </Button>
            <Button variant="ghost" className="w-full justify-start">
              <svg className="w-5 h-5 mr-3" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M10.325 4.317c.426-1.756 2.924-1.756 3.35 0a1.724 1.724 0 002.573 1.066c1.543-.94 3.31.826 2.37 2.37a1.724 1.724 0 001.065 2.572c1.756.426 1.756 2.924 0 3.35a1.724 1.724 0 00-1.066 2.573c.94 1.543-.826 3.31-2.37 2.37a1.724 1.724 0 00-2.572 1.065c-.426 1.756-2.924 1.756-3.35 0a1.724 1.724 0 00-2.573-1.066c-1.543.94-3.31-.826-2.37-2.37a1.724 1.724 0 00-1.065-2.572c-1.756-.426-1.756-2.924 0-3.35a1.724 1.724 0 001.066-2.573c-.94-1.543.826-3.31 2.37-2.37.996.608 2.296.07 2.572-1.065z" />
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15 12a3 3 0 11-6 0 3 3 0 016 0z" />
              </svg>
              Settings
            </Button>
          </nav>
        </div>

        {/* Main Content */}
        <div className="ml-64 flex-1 p-8">
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.5 }}
          >
            <h1 className="text-3xl font-bold mb-8">Welcome back, Dr. Smith</h1>

            <div className="grid grid-cols-1 md:grid-cols-3 gap-6 mb-8">
              <Card className="p-6 bg-gray-800/50 backdrop-blur-lg border-gray-700">
                <h3 className="text-lg font-semibold mb-2">Reports Today</h3>
                <p className="text-3xl font-bold text-blue-400">12</p>
              </Card>
              <Card className="p-6 bg-gray-800/50 backdrop-blur-lg border-gray-700">
                <h3 className="text-lg font-semibold mb-2">Pending Reviews</h3>
                <p className="text-3xl font-bold text-teal-400">5</p>
              </Card>
              <Card className="p-6 bg-gray-800/50 backdrop-blur-lg border-gray-700">
                <h3 className="text-lg font-semibold mb-2">AI Assists</h3>
                <p className="text-3xl font-bold text-purple-400">28</p>
              </Card>
            </div>

            <Card className="p-6 bg-gray-800/50 backdrop-blur-lg border-gray-700">
              <h2 className="text-xl font-bold mb-4">Recent Reports</h2>
              <div className="space-y-4">
                {[1, 2, 3].map((i) => (
                  <div key={i} className="flex items-center justify-between p-4 rounded-lg bg-gray-700/50">
                    <div>
                      <h4 className="font-semibold">Patient #{i}</h4>
                      <p className="text-sm text-gray-400">CT Scan Report</p>
                    </div>
                    <Button variant="outline" className="border-gray-600">
                      View Report
                    </Button>
                  </div>
                ))}
              </div>
            </Card>
          </motion.div>
        </div>
      </div>
    </div>
  );
}
