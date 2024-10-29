import React from 'react';
import { Button } from '../components/ui/button';
import { motion } from 'framer-motion';

export function LandingPage() {
  return (
    <div className="min-h-screen bg-gradient-to-b from-gray-900 to-black text-white">
      <nav className="container mx-auto px-6 py-4 flex justify-between items-center">
        <div className="text-2xl font-bold bg-clip-text text-transparent bg-gradient-to-r from-blue-400 to-teal-400">
          RAD Report
        </div>
        <div className="space-x-4">
          <Button variant="ghost" className="text-gray-300 hover:text-white">
            Login
          </Button>
          <Button className="bg-gradient-to-r from-blue-500 to-teal-500 hover:from-blue-600 hover:to-teal-600">
            Get Started
          </Button>
        </div>
      </nav>

      <main className="container mx-auto px-6 py-20">
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.8 }}
          className="text-center max-w-4xl mx-auto"
        >
          <h1 className="text-6xl font-bold mb-6 bg-clip-text text-transparent bg-gradient-to-r from-blue-400 to-teal-400">
            Next-Gen Radiology Reporting
          </h1>
          <p className="text-xl text-gray-400 mb-12">
            Streamline your radiology workflow with AI-powered reporting and intelligent analysis
          </p>
          <div className="space-x-4">
            <Button className="bg-gradient-to-r from-blue-500 to-teal-500 hover:from-blue-600 hover:to-teal-600 px-8 py-6 text-lg">
              Start Free Trial
            </Button>
            <Button variant="outline" className="px-8 py-6 text-lg border-gray-700 hover:bg-gray-800">
              Watch Demo
            </Button>
          </div>
        </motion.div>

        <motion.div
          initial={{ opacity: 0, y: 40 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.8, delay: 0.2 }}
          className="mt-20 grid grid-cols-1 md:grid-cols-3 gap-8"
        >
          <div className="p-6 rounded-xl bg-gray-800/50 backdrop-blur-lg">
            <div className="w-12 h-12 bg-blue-500/20 rounded-lg flex items-center justify-center mb-4">
              <svg className="w-6 h-6 text-blue-400" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M13 10V3L4 14h7v7l9-11h-7z" />
              </svg>
            </div>
            <h3 className="text-xl font-semibold mb-2">AI-Powered Analysis</h3>
            <p className="text-gray-400">Advanced AI algorithms assist in generating accurate and detailed reports.</p>
          </div>

          <div className="p-6 rounded-xl bg-gray-800/50 backdrop-blur-lg">
            <div className="w-12 h-12 bg-teal-500/20 rounded-lg flex items-center justify-center mb-4">
              <svg className="w-6 h-6 text-teal-400" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 12l2 2 4-4m6 2a9 9 0 11-18 0 9 9 0 0118 0z" />
              </svg>
            </div>
            <h3 className="text-xl font-semibold mb-2">Efficient Workflow</h3>
            <p className="text-gray-400">Streamlined process for faster reporting and improved productivity.</p>
          </div>

          <div className="p-6 rounded-xl bg-gray-800/50 backdrop-blur-lg">
            <div className="w-12 h-12 bg-purple-500/20 rounded-lg flex items-center justify-center mb-4">
              <svg className="w-6 h-6 text-purple-400" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 15v2m-6 4h12a2 2 0 002-2v-6a2 2 0 00-2-2H6a2 2 0 00-2 2v6a2 2 0 002 2zm10-10V7a4 4 0 00-8 0v4h8z" />
              </svg>
            </div>
            <h3 className="text-xl font-semibold mb-2">Secure Platform</h3>
            <p className="text-gray-400">Enterprise-grade security for your sensitive medical data.</p>
          </div>
        </motion.div>
      </main>
    </div>
  );
}
