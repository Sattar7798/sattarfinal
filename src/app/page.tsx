'use client';

import React from 'react';
import { motion } from 'framer-motion';
import Layout from '@/components/layout/LayoutFix';
import BuildingAnimation from '@/components/animations/BuildingAnimation';
import Link from 'next/link';

export default function Home() {
  return (
    <Layout>
      {/* Hero Section */}
      <section className="relative h-screen flex items-center justify-center bg-gradient-to-b from-gray-900 to-blue-900 text-white overflow-hidden">
        <div className="absolute inset-0 w-full h-full opacity-20">
          {/* Background design elements */}
          <div className="absolute top-20 left-20 w-64 h-64 bg-blue-500 rounded-full mix-blend-multiply filter blur-xl opacity-70 animate-blob"></div>
          <div className="absolute top-40 right-20 w-72 h-72 bg-purple-500 rounded-full mix-blend-multiply filter blur-xl opacity-70 animate-blob animation-delay-2000"></div>
          <div className="absolute bottom-20 left-1/3 w-80 h-80 bg-teal-500 rounded-full mix-blend-multiply filter blur-xl opacity-70 animate-blob animation-delay-4000"></div>
        </div>
        
        <div className="container mx-auto px-6 z-10 text-center">
          <motion.h1 
            className="text-5xl md:text-7xl font-bold mb-6"
            initial={{ opacity: 0, y: -20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.7 }}
          >
            Sattar Hedayat
          </motion.h1>
          
          <motion.h2 
            className="text-2xl md:text-3xl mb-8 text-blue-200"
            initial={{ opacity: 0, y: -20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.7, delay: 0.2 }}
          >
            Sustainable Building Engineering & Advanced Seismic Analysis
          </motion.h2>
          
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.7, delay: 0.4 }}
            className="max-w-3xl mx-auto"
          >
            <p className="text-xl text-gray-200 mb-10">
              Integrating cutting-edge AI technology with seismic engineering to create safer,
              more resilient building structures for the future.
            </p>
            
            <div className="flex flex-col sm:flex-row gap-4 justify-center mt-8">
              <Link 
                href="/research"
                className="px-8 py-4 bg-blue-600 rounded-lg font-bold hover:bg-blue-700 transition-colors duration-300"
              >
                Research Projects
              </Link>
              <Link 
                href="/interactive-model"
                className="px-8 py-4 bg-transparent border-2 border-white rounded-lg font-bold hover:bg-white hover:text-blue-900 transition-all duration-300"
              >
                Interactive Models
              </Link>
            </div>
          </motion.div>
        </div>
        
        <div className="absolute bottom-10 left-0 right-0 flex justify-center">
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            transition={{ duration: 1, delay: 1 }}
            className="animate-bounce"
          >
            <svg 
              className="w-10 h-10 text-white" 
              fill="none" 
              strokeLinecap="round" 
              strokeLinejoin="round" 
              strokeWidth="2" 
              viewBox="0 0 24 24" 
              stroke="currentColor"
            >
              <path d="M19 14l-7 7m0 0l-7-7m7 7V3"></path>
            </svg>
          </motion.div>
        </div>
      </section>
      
      {/* Research Focus Section */}
      <section className="py-20 bg-gray-50">
        <div className="container mx-auto px-6">
          <div className="text-center mb-16">
            <h2 className="text-4xl font-bold text-gray-800 mb-4">Research Focus</h2>
            <p className="text-xl text-gray-600 max-w-3xl mx-auto">
              My research combines structural engineering principles with advanced computational methods and AI
              to develop innovative solutions for building resilience.
            </p>
          </div>
          
          <div className="grid grid-cols-1 md:grid-cols-3 gap-10">
            {/* Research Area 1 */}
            <motion.div 
              className="bg-white rounded-xl shadow-lg overflow-hidden seismic-card"
              whileHover={{ y: -10, boxShadow: '0 20px 25px -5px rgba(0, 0, 0, 0.1), 0 10px 10px -5px rgba(0, 0, 0, 0.04)' }}
              transition={{ duration: 0.3 }}
              style={{ isolation: 'isolate' }}
            >
              <div className="h-48 bg-blue-600 flex items-center justify-center relative">
                <BuildingAnimation className="transform scale-75" />
                {/* Clear any overlays */}
                <div className="absolute inset-0 bottom-0 h-1 bg-blue-600"></div>
              </div>
              {/* Add specific styles to prevent overlay */}
              <div className="p-6 relative bg-white" style={{ position: 'relative', zIndex: 2 }}>
                {/* Fix the black bar by removing any potential pseudo-elements */}
                <h3 className="text-2xl font-bold text-gray-800 mb-2" 
                    style={{ 
                      background: 'transparent', 
                      boxShadow: 'none',
                      borderRadius: 0,
                      padding: 0,
                      margin: '0 0 0.5rem 0',
                      position: 'relative'
                    }}>
                  Seismic Analysis
                </h3>
                <p className="text-gray-600">
                  Designing machine learning algorithms for earthquake prediction using XGBoost, Random Forests, and LSTM, with a focus on early warning systems and structural vulnerability assessment.
                </p>
              </div>
            </motion.div>
            
            {/* Research Area 2 */}
            <motion.div 
              className="bg-white rounded-xl shadow-lg overflow-hidden"
              whileHover={{ y: -10, boxShadow: '0 20px 25px -5px rgba(0, 0, 0, 0.1), 0 10px 10px -5px rgba(0, 0, 0, 0.04)' }}
              transition={{ duration: 0.3 }}
            >
              <div className="h-48 bg-purple-600 flex items-center justify-center">
                <svg className="w-24 h-24 text-white" fill="currentColor" viewBox="0 0 20 20">
                  <path fillRule="evenodd" d="M3 5a2 2 0 012-2h10a2 2 0 012 2v8a2 2 0 01-2 2h-2.22l.123.489.804.804A1 1 0 0113 18H7a1 1 0 01-.707-1.707l.804-.804L7.22 15H5a2 2 0 01-2-2V5zm5.771 7H5V5h10v7H8.771z" clipRule="evenodd" />
                </svg>
              </div>
              <div className="p-6">
                <h3 className="text-2xl font-bold text-gray-800 mb-2">AI Integration</h3>
                <p className="text-gray-600">
                  Developing AI and ML frameworks for smart building infrastructures to optimize energy efficiency, enhance structural health monitoring, and implement predictive maintenance systems.
                </p>
              </div>
            </motion.div>
            
            {/* Research Area 3 */}
            <motion.div 
              className="bg-white rounded-xl shadow-lg overflow-hidden"
              whileHover={{ y: -10, boxShadow: '0 20px 25px -5px rgba(0, 0, 0, 0.1), 0 10px 10px -5px rgba(0, 0, 0, 0.04)' }}
              transition={{ duration: 0.3 }}
            >
              <div className="h-48 bg-green-600 flex items-center justify-center">
                <svg className="w-24 h-24 text-white" fill="currentColor" viewBox="0 0 20 20">
                  <path d="M11 17a1 1 0 001.447.894l4-2A1 1 0 0017 15V9.236a1 1 0 00-1.447-.894l-4 2a1 1 0 00-.553.894V17zM15.211 6.276a1 1 0 000-1.788l-4.764-2.382a1 1 0 00-.894 0L4.789 4.488a1 1 0 000 1.788l4.764 2.382a1 1 0 00.894 0l4.764-2.382zM4.447 8.342A1 1 0 003 9.236V15a1 1 0 00.553.894l4 2A1 1 0 009 17v-5.764a1 1 0 00-.553-.894l-4-2z" />
                </svg>
              </div>
              <div className="p-6">
                <h3 className="text-2xl font-bold text-gray-800 mb-2">Sustainable Building</h3>
                <p className="text-gray-600">
                  Integrating BIM and smart monitoring technologies to create sustainable, resilient building designs with reduced environmental impact and improved performance during seismic events.
                </p>
              </div>
            </motion.div>
          </div>
        </div>
      </section>
      
      {/* Call to Action */}
      <section className="py-20 bg-gradient-to-r from-blue-600 to-indigo-800 text-white">
        <div className="container mx-auto px-6 text-center">
          <h2 className="text-4xl font-bold mb-4">Experience Interactive Structural Models</h2>
          <p className="text-xl mb-8 max-w-3xl mx-auto">
            Explore our interactive 3D building models with real-time seismic simulations
            and cutting-edge AI analysis tools.
          </p>
          <Link
            href="/interactive-model"
            className="px-8 py-4 bg-white text-blue-800 rounded-lg font-bold hover:bg-blue-100 transition-colors duration-300 inline-block"
          >
            Launch 3D Visualizations
          </Link>
        </div>
      </section>
      
      {/* Latest Publications Preview */}
      <section className="py-20 bg-white">
        <div className="container mx-auto px-6">
          <div className="text-center mb-16">
            <h2 className="text-4xl font-bold text-gray-800 mb-4">Latest Publications</h2>
            <p className="text-xl text-gray-600 max-w-3xl mx-auto">
              A selection of my recent research papers and publications in structural engineering and seismic analysis.
            </p>
          </div>
          
          <div className="grid grid-cols-1 md:grid-cols-2 gap-8 max-w-5xl mx-auto">
            {/* Publication 1 */}
            <motion.div 
              className="border border-gray-200 rounded-lg p-6 hover:border-blue-500 transition-colors duration-300"
              whileHover={{ y: -5 }}
              transition={{ duration: 0.2 }}
            >
              <h3 className="text-xl font-bold text-gray-800 mb-2">
                AI-Enhanced Prediction of Building Response to Seismic Events
              </h3>
              <p className="text-gray-600 mb-4">
                Journal of Structural Engineering, 2023
              </p>
              <p className="text-gray-700 mb-4">
                This paper presents a novel approach to predicting building responses during earthquakes
                by combining traditional structural analysis with machine learning algorithms.
              </p>
              <Link href="/publications" className="text-blue-600 font-medium hover:text-blue-800 transition-colors">
                Read More →
              </Link>
            </motion.div>
            
            {/* Publication 2 */}
            <motion.div 
              className="border border-gray-200 rounded-lg p-6 hover:border-blue-500 transition-colors duration-300"
              whileHover={{ y: -5 }}
              transition={{ duration: 0.2 }}
            >
              <h3 className="text-xl font-bold text-gray-800 mb-2">
                Advanced Visualization Techniques for Structural Analysis
              </h3>
              <p className="text-gray-600 mb-4">
                International Conference on Structural Engineering, 2022
              </p>
              <p className="text-gray-700 mb-4">
                A comprehensive exploration of how 3D visualization and virtual reality can enhance
                our understanding of complex structural behaviors and improve design outcomes.
              </p>
              <Link href="/publications" className="text-blue-600 font-medium hover:text-blue-800 transition-colors">
                Read More →
              </Link>
            </motion.div>
          </div>
          
          <div className="text-center mt-12">
            <Link 
              href="/publications"
              className="px-6 py-3 bg-gray-800 text-white rounded-lg font-medium hover:bg-gray-900 transition-colors duration-300 inline-block"
            >
              View All Publications
            </Link>
          </div>
        </div>
      </section>
    </Layout>
  );
} 