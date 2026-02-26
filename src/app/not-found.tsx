"use client"

import Link from "next/link"
import React from "react"
import { FiArrowLeft, FiHome, FiAlertTriangle } from "react-icons/fi"

export default function NotFound() {
  const handleGoBack = () => {
    window.history.back()
  }

  return (
    <div className="min-h-screen flex items-center justify-center bg-white dark:bg-gray-950 text-gray-900 dark:text-gray-100 transition-colors duration-300">
      <div className="container px-4 mx-auto">
        <div className="max-w-4xl mx-auto relative overflow-hidden bg-white dark:bg-gray-900 border border-gray-200 dark:border-gray-800 rounded-2xl shadow-lg dark:shadow-2xl transition-all duration-300">
          {/* Decorative Gradients – theme-aware */}
          <div className="absolute -top-20 -right-20 w-64 h-64 bg-linear-to-br from-teal-100/30 dark:from-teal-900/20 to-cyan-100/20 dark:to-cyan-950/10 rounded-full blur-3xl -z-10"></div>
          <div className="absolute -bottom-20 -left-20 w-64 h-64 bg-linear-to-br from-teal-200/20 dark:from-teal-800/15 to-emerald-100/20 dark:to-emerald-950/10 rounded-full blur-3xl -z-10"></div>

          {/* Circuit-like Lines – subtle in both modes */}
          <div className="absolute inset-0 overflow-hidden opacity-10 dark:opacity-5">
            <div className="absolute top-1/4 left-0 w-full h-px bg-linear-to-br from-transparent via-teal-500/70 dark:via-teal-500/50 to-transparent animate-pulse"></div>
            <div
              className="absolute top-2/4 left-0 w-full h-px bg-linear-to-br from-transparent via-teal-500/70 dark:via-teal-500/50 to-transparent animate-pulse"
              style={{ animationDelay: "1s" }}
            ></div>
            <div
              className="absolute top-3/4 left-0 w-full h-px bg-linear-to-br from-transparent via-teal-500/70 dark:via-teal-500/50 to-transparent animate-pulse"
              style={{ animationDelay: "2s" }}
            ></div>
            <div
              className="absolute left-1/4 top-0 h-full w-px bg-linear-to-br from-transparent via-teal-500/70 dark:via-teal-500/50 to-transparent animate-pulse"
              style={{ animationDelay: "0.5s" }}
            ></div>
            <div
              className="absolute left-2/4 top-0 h-full w-px bg-linear-to-br from-transparent via-teal-500/70 dark:via-teal-500/50 to-transparent animate-pulse"
              style={{ animationDelay: "1.5s" }}
            ></div>
            <div
              className="absolute left-3/4 top-0 h-full w-px bg-linear-to-br from-transparent via-teal-600/60 dark:via-teal-600/40 to-transparent animate-pulse"
              style={{ animationDelay: "2.5s" }}
            ></div>
          </div>

          <div className="p-8 md:p-12 flex flex-col md:flex-row-reverse items-center">
            {/* Left Side - Message */}
            <div className="w-full md:w-1/2 text-center md:text-left mb-8 md:mb-0">
              <div className="inline-flex items-center px-4 py-2 rounded-full text-xs font-medium mb-4 bg-gray-100 dark:bg-gray-800 text-teal-700 dark:text-teal-400 border border-teal-200 dark:border-gray-700">
                <FiAlertTriangle className="mr-2" />
                <span>Error 404</span>
              </div>

              <h1 className="text-4xl md:text-5xl font-bold mb-4 text-gray-900 dark:text-white">
                Page Not Found
              </h1>

              <p className="text-lg md:text-xl font-medium mb-2 text-teal-600 dark:text-teal-400">
                Oops! We couldn't find that page.
              </p>

              <p className="text-base mb-8 max-w-md text-gray-600 dark:text-gray-400">
                The page you’re looking for doesn’t exist or has been moved. Let’s get you back on track.
              </p>

              <div className="flex flex-col sm:flex-row space-y-4 sm:space-y-0 sm:space-x-4 justify-center md:justify-start">
                <button
                  onClick={handleGoBack}
                  className="group relative flex items-center justify-center px-6 py-3 rounded-lg text-sm font-medium transition-all duration-300 bg-gray-100 dark:bg-gray-800 text-teal-700 dark:text-teal-400 border border-teal-300 dark:border-gray-700 hover:bg-teal-100 dark:hover:bg-gray-700 hover:border-teal-500 dark:hover:border-teal-600/60 hover:text-teal-800 dark:hover:text-teal-300"
                >
                  <FiArrowLeft className="mr-2 group-hover:-translate-x-1 transition-transform duration-300" />
                  Go Back
                </button>

                <Link
                  href="/"
                  className="group relative flex items-center justify-center px-6 py-3 rounded-lg text-sm font-medium transition-all duration-300 bg-teal-600 text-white hover:bg-teal-700 dark:bg-teal-700 dark:hover:bg-teal-600 shadow-md shadow-teal-900/20 dark:shadow-teal-950/40"
                >
                  <FiHome className="mr-2 group-hover:scale-110 transition-transform duration-300" />
                  Return to Homepage
                </Link>
              </div>
            </div>

            {/* Right Side - 404 Graphic */}
            <div className="w-full md:w-1/2 flex justify-center">
              <div className="relative">
                <div className="w-64 h-64 md:w-80 md:h-80 rounded-full bg-teal-50 dark:bg-gray-800/60 border border-teal-200 dark:border-gray-700 flex items-center justify-center relative overflow-hidden">
                  {/* Animated Circles */}
                  <div className="absolute inset-0">
                    <div className="absolute top-1/2 left-1/2 transform -translate-x-1/2 -translate-y-1/2 w-40 h-40 rounded-full border-4 border-dashed animate-spin-slow opacity-30 dark:opacity-25 border-teal-400 dark:border-teal-500/70"></div>
                    <div
                      className="absolute top-1/2 left-1/2 transform -translate-x-1/2 -translate-y-1/2 w-60 h-60 rounded-full border-4 border-dashed animate-spin-slow opacity-20 dark:opacity-15 border-teal-500 dark:border-cyan-600/60"
                      style={{
                        animationDirection: "reverse",
                        animationDuration: "30s",
                      }}
                    ></div>
                  </div>

                  <div className="relative z-10 text-center">
                    <div className="text-9xl font-black text-transparent bg-clip-text bg-linear-to-br from-teal-600 to-teal-400 dark:from-teal-400 dark:to-cyan-300">
                      404
                    </div>
                    <div className="mt-4 flex justify-center text-teal-600 dark:text-teal-400">
                      <FiAlertTriangle size={48} className="animate-pulse" />
                    </div>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  )
}