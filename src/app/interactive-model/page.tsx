'use client';

import React, { useState } from 'react';
import Layout from '@/components/layout/LayoutFix';
import BuildingModelViewer from '@/components/3d/BuildingModelViewer';
import SeismicVisualization from '@/components/3d/SeismicVisualization';
import AIVisualization from '@/components/ai/AIVisualization';
import { motion } from 'framer-motion';
import Link from 'next/link';

// Tab interface for switching between different visualizations
type VisualizationTab = 'building' | 'seismic' | 'ai';

export default function InteractiveModelPage() {
  const [activeTab, setActiveTab] = useState<VisualizationTab>('building');
  
  return (
    <Layout>
      {/* Header */}
      <section className="bg-gray-900 text-white py-16">
        <div className="container mx-auto px-6">
          <motion.div
            initial={{ opacity: 0, y: -20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.7 }}
          >
            <h1 className="text-4xl md:text-5xl font-bold mb-4">
              Interactive Structural Visualizations
            </h1>
            <p className="text-xl text-gray-300 max-w-3xl">
              Explore cutting-edge visualizations of building structures, seismic responses, 
              and AI-powered structural analysis.
            </p>
          </motion.div>
        </div>
      </section>
      
      {/* Visualization Tabs */}
      <section className="py-10 bg-gray-100">
        <div className="container mx-auto px-6">
          <div className="bg-white rounded-lg shadow-lg overflow-hidden">
            {/* Tabs Header */}
            <div className="flex border-b border-gray-200">
              <button
                className={`px-6 py-4 text-lg font-medium ${
                  activeTab === 'building' 
                    ? 'text-blue-600 border-b-2 border-blue-600' 
                    : 'text-gray-600 hover:text-blue-500'
                }`}
                onClick={() => setActiveTab('building')}
              >
                3D Building Model
              </button>
              <button
                className={`px-6 py-4 text-lg font-medium ${
                  activeTab === 'seismic' 
                    ? 'text-blue-600 border-b-2 border-blue-600' 
                    : 'text-gray-600 hover:text-blue-500'
                }`}
                onClick={() => setActiveTab('seismic')}
              >
                Seismic Simulation
              </button>
              <button
                className={`px-6 py-4 text-lg font-medium ${
                  activeTab === 'ai' 
                    ? 'text-blue-600 border-b-2 border-blue-600' 
                    : 'text-gray-600 hover:text-blue-500'
                }`}
                onClick={() => setActiveTab('ai')}
              >
                AI Analysis
              </button>
            </div>
            
            {/* Tab Content */}
            <div className="p-6">
              {/* 3D Building Model Viewer */}
              {activeTab === 'building' && (
                <motion.div
                  initial={{ opacity: 0 }}
                  animate={{ opacity: 1 }}
                  transition={{ duration: 0.5 }}
                >
                  <div className="mb-6">
                    <h2 className="text-2xl font-bold text-gray-800 mb-3">
                      Interactive 3D Building Model
                    </h2>
                    <p className="text-gray-600">
                      Explore a detailed 3D model of a building structure. Use your mouse to rotate, 
                      zoom, and pan to examine the model from different angles.
                    </p>
                  </div>
                  <BuildingModelViewer 
                    backgroundColor="#f8fafc"
                    className="rounded-lg shadow-inner"
                    modelPath="/models/building.glb"
                  />
                  <div className="mt-6 text-gray-600">
                    <h3 className="text-lg font-semibold mb-2">About This Model</h3>
                    <p>
                      This 3D model represents a modern reinforced concrete frame structure designed 
                      to withstand seismic forces. The model includes detailed representations of 
                      structural elements including columns, beams, floor slabs, and foundations.
                    </p>
                  </div>
                </motion.div>
              )}
              
              {/* Seismic Visualization */}
              {activeTab === 'seismic' && (
                <motion.div
                  initial={{ opacity: 0 }}
                  animate={{ opacity: 1 }}
                  transition={{ duration: 0.5 }}
                >
                  <div className="mb-6">
                    <h2 className="text-2xl font-bold text-gray-800 mb-3">
                      Seismic Response Simulation
                    </h2>
                    <p className="text-gray-600">
                      Visualize how buildings respond to earthquake forces with this interactive 
                      seismic simulation. Adjust the intensity and observe the building's behavior.
                    </p>
                  </div>
                  <SeismicVisualization
                    initialIntensity={0.3}
                    className="rounded-lg shadow-inner"
                  />
                  <div className="mt-6 text-gray-600">
                    <h3 className="text-lg font-semibold mb-2">Understanding Seismic Effects</h3>
                    <p>
                      This simulation demonstrates the dynamic response of buildings to seismic ground 
                      motions. The visualization shows how seismic waves propagate and affect different 
                      parts of the structure, highlighting the importance of proper seismic design.
                    </p>
                  </div>
                </motion.div>
              )}
              
              {/* AI Analysis Visualization */}
              {activeTab === 'ai' && (
                <motion.div
                  initial={{ opacity: 0 }}
                  animate={{ opacity: 1 }}
                  transition={{ duration: 0.5 }}
                >
                  <div className="mb-6">
                    <h2 className="text-2xl font-bold text-gray-800 mb-3">
                      AI-Powered Structural Analysis
                    </h2>
                    <p className="text-gray-600 mb-4">
                      Explore how artificial intelligence analyzes building structures to identify 
                      potential weaknesses and optimize designs for seismic performance.
                    </p>
                  </div>
                  <div className="border border-gray-200 rounded-lg p-4 shadow-inner bg-gray-50">
                    <AIVisualization
                      className="rounded-lg"
                    />
                  </div>
                  <div className="mt-6 text-gray-600">
                    <h3 className="text-lg font-semibold mb-2">The Future of Structural Engineering</h3>
                    <p>
                      AI-powered analysis represents the cutting edge of structural engineering, 
                      enabling more precise predictions of building behavior and optimizing design 
                      decisions for safety, efficiency, and resilience against natural disasters.
                    </p>
                  </div>
                </motion.div>
              )}
            </div>
          </div>
        </div>
      </section>
      
      {/* Call to Action */}
      <section className="py-16 bg-blue-600 text-white">
        <div className="container mx-auto px-6 text-center">
          <h2 className="text-3xl font-bold mb-4">Want to Learn More?</h2>
          <p className="text-xl mb-8 max-w-3xl mx-auto">
            Discover how these advanced visualization techniques are being applied in real-world 
            research projects to improve building safety and resilience.
          </p>
          <div className="flex flex-col sm:flex-row gap-4 justify-center">
            <Link
              href="/research"
              className="px-8 py-4 bg-white text-blue-800 rounded-lg font-bold hover:bg-blue-100 transition-colors duration-300"
            >
              Research Projects
            </Link>
            <Link
              href="/publications"
              className="px-8 py-4 bg-transparent border-2 border-white rounded-lg font-bold hover:bg-white hover:text-blue-800 transition-all duration-300"
            >
              View Publications
            </Link>
          </div>
        </div>
      </section>
    </Layout>
  );
} 