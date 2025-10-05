import { useState } from 'react'
import { BrowserRouter as Router } from 'react-router-dom'
import './App.css'

function App() {
  const [count, setCount] = useState(0)

  return (
    <Router>
      <div className="min-h-screen bg-gray-100 dark:bg-gray-900">
        <div className="container mx-auto px-4 py-8">
          <header className="text-center mb-8">
            <h1 className="text-4xl font-bold text-gray-900 dark:text-white mb-4">
              InventoryPro
            </h1>
            <p className="text-xl text-gray-600 dark:text-gray-300">
              Professional Inventory Management System
            </p>
          </header>

          <main className="max-w-4xl mx-auto">
            <div className="card mb-8">
              <h2 className="text-2xl font-semibold mb-4 text-gray-900 dark:text-white">
                Welcome to Your Inventory Management Dashboard
              </h2>
              <p className="text-gray-600 dark:text-gray-300 mb-6">
                This is a comprehensive inventory management application built with React, TypeScript, and Tailwind CSS.
              </p>
              
              <div className="grid grid-cols-1 md:grid-cols-3 gap-4 mb-6">
                <div className="bg-blue-50 dark:bg-blue-900/20 p-4 rounded-lg">
                  <h3 className="font-semibold text-blue-900 dark:text-blue-300">Track Inventory</h3>
                  <p className="text-sm text-blue-700 dark:text-blue-400">Monitor stock levels in real-time</p>
                </div>
                <div className="bg-green-50 dark:bg-green-900/20 p-4 rounded-lg">
                  <h3 className="font-semibold text-green-900 dark:text-green-300">Manage Orders</h3>
                  <p className="text-sm text-green-700 dark:text-green-400">Process and track customer orders</p>
                </div>
                <div className="bg-purple-50 dark:bg-purple-900/20 p-4 rounded-lg">
                  <h3 className="font-semibold text-purple-900 dark:text-purple-300">Generate Reports</h3>
                  <p className="text-sm text-purple-700 dark:text-purple-400">Analyze business performance</p>
                </div>
              </div>

              <div className="flex flex-col sm:flex-row gap-4 items-center justify-center">
                <button 
                  className="btn-primary"
                  onClick={() => setCount((count) => count + 1)}
                >
                  Count is {count}
                </button>
                <button className="btn-secondary">
                  Get Started
                </button>
              </div>
            </div>

            <div className="card">
              <h2 className="text-xl font-semibold mb-4 text-gray-900 dark:text-white">
                Project Setup Complete
              </h2>
              <div className="space-y-2 text-sm text-gray-600 dark:text-gray-300">
                <p>✅ React 19 with TypeScript</p>
                <p>✅ Vite for fast development</p>
                <p>✅ Tailwind CSS for styling</p>
                <p>✅ React Router for navigation</p>
                <p>✅ i18next for internationalization</p>
                <p>✅ ESLint for code quality</p>
              </div>
            </div>
          </main>
        </div>
      </div>
    </Router>
  )
}

export default App
