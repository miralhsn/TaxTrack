import React from 'react';
import { FaSun, FaMoon, FaEye, FaEyeSlash, FaEdit, FaTrash, FaDownload, FaPrint } from 'react-icons/fa';

const ThemeTest = () => {
  return (
    <div className="p-6 space-y-6">
      <div className="bg-white dark:bg-gray-800 rounded-xl shadow-lg border border-gray-200 dark:border-gray-700 p-6">
        <h2 className="text-2xl font-bold text-gray-900 dark:text-white mb-4">Theme Test Component</h2>
        <p className="text-gray-600 dark:text-gray-400 mb-6">This component tests all theme elements for proper contrast and visibility.</p>
        
        {/* Text Colors Test */}
        <div className="space-y-4 mb-6">
          <h3 className="text-lg font-semibold text-gray-900 dark:text-white">Text Colors</h3>
          <p className="text-gray-900 dark:text-white">Primary text - should be dark in light mode, light in dark mode</p>
          <p className="text-gray-600 dark:text-gray-400">Secondary text - should be medium gray in both modes</p>
          <p className="text-gray-500 dark:text-gray-500">Muted text - should be light gray in both modes</p>
        </div>

        {/* Button Test */}
        <div className="space-y-4 mb-6">
          <h3 className="text-lg font-semibold text-gray-900 dark:text-white">Buttons</h3>
          <div className="flex flex-wrap gap-3">
            <button className="bg-blue-600 hover:bg-blue-700 text-white font-semibold py-2 px-4 rounded-lg transition-colors duration-200">
              Primary Button
            </button>
            <button className="bg-gray-200 dark:bg-gray-600 text-gray-700 dark:text-gray-200 hover:bg-gray-300 dark:hover:bg-gray-500 font-semibold py-2 px-4 rounded-lg transition-colors duration-200">
              Secondary Button
            </button>
            <button className="bg-green-600 hover:bg-green-700 text-white font-semibold py-2 px-4 rounded-lg transition-colors duration-200">
              Success Button
            </button>
            <button className="bg-yellow-600 hover:bg-yellow-700 text-white font-semibold py-2 px-4 rounded-lg transition-colors duration-200">
              Warning Button
            </button>
            <button className="bg-red-600 hover:bg-red-700 text-white font-semibold py-2 px-4 rounded-lg transition-colors duration-200">
              Danger Button
            </button>
          </div>
        </div>

        {/* Icon Buttons Test */}
        <div className="space-y-4 mb-6">
          <h3 className="text-lg font-semibold text-gray-900 dark:text-white">Icon Buttons</h3>
          <div className="flex flex-wrap gap-3">
            <button className="p-2 rounded-lg transition-colors duration-200 hover:bg-gray-100 dark:hover:bg-gray-700 text-blue-600 hover:text-blue-700 hover:bg-blue-50 dark:hover:bg-blue-900/20">
              <FaEye size={16} />
            </button>
            <button className="p-2 rounded-lg transition-colors duration-200 hover:bg-gray-100 dark:hover:bg-gray-700 text-green-600 hover:text-green-700 hover:bg-green-50 dark:hover:bg-green-900/20">
              <FaEdit size={16} />
            </button>
            <button className="p-2 rounded-lg transition-colors duration-200 hover:bg-gray-100 dark:hover:bg-gray-700 text-red-600 hover:text-red-700 hover:bg-red-50 dark:hover:bg-red-900/20">
              <FaTrash size={16} />
            </button>
            <button className="p-2 rounded-lg transition-colors duration-200 hover:bg-gray-100 dark:hover:bg-gray-700">
              <FaDownload size={16} />
            </button>
            <button className="p-2 rounded-lg transition-colors duration-200 hover:bg-gray-100 dark:hover:bg-gray-700">
              <FaPrint size={16} />
            </button>
          </div>
        </div>

        {/* Input Test */}
        <div className="space-y-4 mb-6">
          <h3 className="text-lg font-semibold text-gray-900 dark:text-white">Input Fields</h3>
          <div className="space-y-3">
            <input 
              type="text" 
              placeholder="Test input field" 
              className="w-full px-4 py-3 border border-gray-300 dark:border-gray-600 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent bg-white dark:bg-gray-700 text-gray-900 dark:text-white placeholder-gray-500 dark:placeholder-gray-400 transition-colors duration-200"
            />
            <input 
              type="email" 
              placeholder="Email input field" 
              className="w-full px-4 py-3 border border-gray-300 dark:border-gray-600 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent bg-white dark:bg-gray-700 text-gray-900 dark:text-white placeholder-gray-500 dark:placeholder-gray-400 transition-colors duration-200"
            />
            <textarea 
              placeholder="Textarea field" 
              className="w-full px-4 py-3 border border-gray-300 dark:border-gray-600 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent bg-white dark:bg-gray-700 text-gray-900 dark:text-white placeholder-gray-500 dark:placeholder-gray-400 transition-colors duration-200"
              rows={3}
            />
          </div>
        </div>

        {/* Status Indicators */}
        <div className="space-y-4 mb-6">
          <h3 className="text-lg font-semibold text-gray-900 dark:text-white">Status Indicators</h3>
          <div className="flex flex-wrap gap-3">
            <span className="inline-flex px-3 py-1 text-sm font-medium rounded-full bg-green-100 text-green-800 dark:bg-green-900 dark:text-green-200">
              Success Status
            </span>
            <span className="inline-flex px-3 py-1 text-sm font-medium rounded-full bg-yellow-100 text-yellow-800 dark:bg-yellow-900 dark:text-yellow-200">
              Warning Status
            </span>
            <span className="inline-flex px-3 py-1 text-sm font-medium rounded-full bg-red-100 text-red-800 dark:bg-red-900 dark:text-red-200">
              Error Status
            </span>
            <span className="inline-flex px-3 py-1 text-sm font-medium rounded-full bg-blue-100 text-blue-800 dark:bg-blue-900 dark:text-blue-200">
              Info Status
            </span>
          </div>
        </div>

        {/* Cards Test */}
        <div className="space-y-4 mb-6">
          <h3 className="text-lg font-semibold text-gray-900 dark:text-white">Cards</h3>
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            <div className="bg-white dark:bg-gray-800 rounded-xl shadow-lg border border-gray-200 dark:border-gray-700 p-4">
              <h4 className="font-semibold text-gray-900 dark:text-white mb-2">Card Title</h4>
              <p className="text-gray-600 dark:text-gray-400">This is a test card with proper contrast.</p>
            </div>
            <div className="bg-white dark:bg-gray-800 rounded-xl shadow-lg border border-gray-200 dark:border-gray-700 p-4">
              <h4 className="font-semibold text-gray-900 dark:text-white mb-2">Another Card</h4>
              <p className="text-gray-600 dark:text-gray-400">Another test card to verify theme consistency.</p>
            </div>
          </div>
        </div>

        {/* Icons Test */}
        <div className="space-y-4">
          <h3 className="text-lg font-semibold text-gray-900 dark:text-white">Icons</h3>
          <div className="flex flex-wrap gap-4">
            <FaSun className="text-yellow-500 text-2xl" />
            <FaMoon className="text-blue-500 text-2xl" />
            <FaEye className="text-green-500 text-2xl" />
            <FaEyeSlash className="text-red-500 text-2xl" />
            <FaEdit className="text-blue-600 text-2xl" />
            <FaTrash className="text-red-600 text-2xl" />
            <FaDownload className="text-green-600 text-2xl" />
            <FaPrint className="text-purple-600 text-2xl" />
          </div>
        </div>
      </div>
    </div>
  );
};

export default ThemeTest; 