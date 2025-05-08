'use client';

import React from 'react';
import { motion } from 'framer-motion';
import PredictiveModels from '@/components/ai/PredictiveModels';
import ResearchAssistant from '@/components/ai/ResearchAssistant';
import PublicationCard from '@/components/publications/PublicationCard';
import { AIIcon, EarthquakeIcon, StructureIcon, AnalysisIcon } from '@/components/ui/AnimatedIcons';
import Container from '@/components/layout/Container';
import Section from '@/components/layout/Section';
import PageHeader from '@/components/layout/PageHeader';
import Layout from '@/components/layout/LayoutFix';

export default function ResearchPage() {
  // Research areas
  const researchAreas = [
    {
      title: 'AI in Infrastructure Resilience',
      icon: <AIIcon size={32} />,
      description: 'Integrating AI and machine learning algorithms into smart building infrastructures to optimize energy efficiency and structural health monitoring.',
      topics: [
        'AI-powered structural health monitoring',
        'Deep reinforcement learning for HVAC control',
        'CNN-LSTM networks for environmental monitoring',
        'Graph neural networks for structural anomaly detection',
        'Remote monitoring solutions'
      ]
    },
    {
      title: 'ML in Seismic Hazard Prediction',
      icon: <EarthquakeIcon size={32} />,
      description: 'Developing machine learning algorithms to predict potential earthquakes and seismic hazards based on historical data and environmental factors.',
      topics: [
        'XGBoost for earthquake prediction',
        'Random Forests for hazard assessment',
        'LSTM networks for time-series seismic data',
        'Geospatial analysis using QGIS',
        'Seismic signal processing'
      ]
    },
    {
      title: 'Structural Health Monitoring',
      icon: <StructureIcon size={32} />,
      description: 'Implementing AI and ML techniques for monitoring the health and integrity of structural systems in real-time.',
      topics: [
        'Advanced mathematical models for predictive maintenance',
        'Early detection of structural issues',
        'Remote monitoring systems',
        'Structural vulnerability assessment',
        'Building damage analysis'
      ]
    },
    {
      title: 'BIM and Smart Monitoring',
      icon: <AnalysisIcon size={32} />,
      description: 'Combining Building Information Modeling with smart monitoring technologies for improved building management and analysis.',
      topics: [
        'H-BIM for historic buildings',
        'BIM-based sustainable renovation',
        'Integration of monitoring data with BIM models',
        'Adaptive reuse strategies',
        'Digital preservation techniques'
      ]
    }
  ];

  // Featured research papers (updated with real publications)
  const featuredPapers = [
    {
      title: 'Seismic Hazard and Structural Vulnerability: A Study of Building Damage in the 2017 Kermanshah Earthquake',
      authors: 'Hedayat, S., Ciampi, P., and Scarascia Mugnozza, G.',
      journal: 'In preparation',
      year: 2024,
      abstract: 'This paper analyzes the structural vulnerabilities and seismic resilience factors leading to building damage and collapse in the 2017 Kermanshah Earthquake, providing insights for improved structural design and seismic resilience strategies.',
      tags: ['Seismic Analysis', 'Structural Vulnerability', 'Earthquake Damage'],
      imageUrl: '/assets/images/publications/seismic-vulnerability.jpg',
      url: '/publications/seismic-vulnerability'
    },
    {
      title: 'Advancing Infrastructure Resilience through Smart Monitoring: Insights from the Genoa Bridge Catastrophe',
      authors: 'Hedayat, S., Ziarati, T., Ciampi, P., Giannini, L.M.',
      journal: 'In preparation',
      year: 2024,
      abstract: 'This research evaluates the structural integrity and resilience of the Genoa San Giorgio Bridge using advanced analysis tools such as ABAQUS software, aiming to identify and address structural vulnerabilities that may have led to the tragic collapse of the bridge in 2018.',
      tags: ['Smart Monitoring', 'Infrastructure Resilience', 'Structural Analysis'],
      imageUrl: '/assets/images/publications/bridge-monitoring.jpg',
      url: '/publications/bridge-monitoring'
    },
    {
      title: "Iran's Seismic Puzzle: Bridging Gaps in Earthquake Emergency Planning and Public Awareness for Risk Reduction",
      authors: 'Ciampi, P., Giannini, L.M., Hedayat, S., Ziarati, T., and Scarascia Mugnozza, G.',
      journal: 'Italian Journal of Engineering Geology and Environment',
      year: 2024,
      abstract: 'This study designed surveys across various regions of Iran to gather data on public awareness of local hazard risks, utilizing QGIS and Excel to generate detailed maps and graphs integrating demographic, geographic, and hazard data.',
      tags: ['Seismic Risk', 'Public Awareness', 'Emergency Planning'],
      imageUrl: '/assets/images/publications/seismic-puzzle.jpg',
      url: 'https://doi.org/10.4408/IJEGE.2024-01.O-01'
    }
  ];

  return (
    <Layout>
      <PageHeader
        title="Research"
        subtitle="Exploring the frontiers of sustainable building engineering, seismic analysis, and AI integration"
        imageUrl="/assets/images/research-header.jpg"
      />

      <Container>
        <Section>
          <div className="mb-12">
            <h2 className="text-3xl font-bold mb-6">Research Areas</h2>
            <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
              {researchAreas.map((area, index) => (
                <motion.div
                  key={index}
                  initial={{ opacity: 0, y: 20 }}
                  whileInView={{ opacity: 1, y: 0 }}
                  transition={{ duration: 0.5, delay: index * 0.1 }}
                  viewport={{ once: true, margin: "-50px" }}
                  className="bg-white dark:bg-gray-800 p-6 rounded-lg shadow-md"
                >
                  <div className="flex items-center mb-4">
                    <div className="mr-4 text-blue-600 dark:text-blue-400">
                      {area.icon}
                    </div>
                    <h3 className="text-xl font-bold">{area.title}</h3>
                  </div>
                  <p className="text-gray-700 dark:text-gray-300 mb-4">
                    {area.description}
                  </p>
                  <div>
                    <h4 className="font-semibold mb-2 text-sm uppercase tracking-wider text-gray-500 dark:text-gray-400">
                      Key Focus Areas
                    </h4>
                    <ul className="list-disc pl-5 text-gray-700 dark:text-gray-300 space-y-1">
                      {area.topics.map((topic, i) => (
                        <li key={i}>{topic}</li>
                      ))}
                    </ul>
                  </div>
                </motion.div>
              ))}
            </div>
          </div>
        </Section>
        
        <Section className="bg-gray-50 dark:bg-gray-900 py-16">
          <div className="mb-12">
            <h2 className="text-3xl font-bold mb-2">AI-Enhanced Structural Analysis</h2>
            <p className="text-gray-700 dark:text-gray-300 mb-8 max-w-3xl">
              Explore Sattar Hedayat's cutting-edge predictive models that combine artificial intelligence
              with structural engineering principles to revolutionize how we analyze and design buildings.
            </p>
            <div className="bg-white dark:bg-gray-800 rounded-lg shadow-lg p-6">
              <PredictiveModels 
                initialModelType="displacement"
                height="500px"
              />
            </div>
          </div>
        </Section>
        
        <Section>
          <div className="mb-12">
            <h2 className="text-3xl font-bold mb-6">Featured Research</h2>
            <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
              {featuredPapers.map((paper, index) => (
                <PublicationCard 
                  key={index}
                  publication={paper}
                />
              ))}
            </div>
            <div className="text-center mt-8">
              <a 
                href="/publications" 
                className="inline-block px-6 py-3 bg-blue-600 text-white rounded-lg hover:bg-blue-700 transition-colors"
              >
                View All Publications
              </a>
            </div>
          </div>
        </Section>
        
        <Section className="bg-gray-50 dark:bg-gray-900 py-16">
          <div>
            <h2 className="text-3xl font-bold mb-2">Research Assistant</h2>
            <p className="text-gray-700 dark:text-gray-300 mb-8 max-w-3xl">
              Use our AI-powered research assistant to explore Sattar Hedayat's research database
              and find relevant publications and information.
            </p>
            <div className="bg-white dark:bg-gray-800 rounded-lg shadow-lg p-6">
              <ResearchAssistant />
            </div>
          </div>
        </Section>
      </Container>
    </Layout>
  );
} 