'use client';

import { Compass, Moon, Sun } from 'lucide-react';
import { useState } from 'react';

interface HeaderProps {
  isSimpleMode: boolean;
  onModeToggle: () => void;
  cryptoCount: number;
  onCountChange: (count: number) => void;
}

export default function Header({ isSimpleMode, onModeToggle, cryptoCount, onCountChange }: HeaderProps) {
  return (
    <header className="border-b border-gray-800 bg-gray-900/80 backdrop-blur-sm sticky top-0 z-50">
      <div className="max-w-7xl mx-auto px-4 py-4">
        <div className="flex items-center justify-between">
          {/* Logo */}
          <div className="flex items-center gap-3">
            <div className="bg-gradient-to-br from-blue-500 to-purple-600 p-2 rounded-xl">
              <Compass className="w-6 h-6 text-white" />
            </div>
            <div>
              <h1 className="text-xl font-bold bg-gradient-to-r from-blue-400 to-purple-400 bg-clip-text text-transparent">
                CryptoCompass
              </h1>
              <p className="text-xs text-gray-500">Navigate the crypto market</p>
            </div>
          </div>

          {/* Controls */}
          <div className="flex items-center gap-4">
            {/* Crypto Count Selector */}
            <div className="flex items-center gap-2 bg-gray-800 rounded-lg p-1">
              {[10, 20, 50].map((count) => (
                <button
                  key={count}
                  onClick={() => onCountChange(count)}
                  className={`px-3 py-1 rounded-md text-sm font-medium transition-colors ${
                    cryptoCount === count 
                      ? 'bg-blue-600 text-white' 
                      : 'text-gray-400 hover:text-white'
                  }`}
                >
                  Top {count}
                </button>
              ))}
            </div>

            {/* Mode Toggle */}
            <button
              onClick={onModeToggle}
              className={`flex items-center gap-2 px-4 py-2 rounded-lg font-medium text-sm transition-colors ${
                isSimpleMode 
                  ? 'bg-green-600/20 text-green-400 border border-green-600/50' 
                  : 'bg-purple-600/20 text-purple-400 border border-purple-600/50'
              }`}
            >
              {isSimpleMode ? '🌱 Simple' : '🚀 Advanced'}
            </button>
          </div>
        </div>
      </div>
    </header>
  );
}
