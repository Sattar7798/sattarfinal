'use client';

import React from 'react';
import { motion } from 'framer-motion';
import Image from 'next/image';
import Container from '@/components/layout/Container';
import Section from '@/components/layout/Section';
import PageHeader from '@/components/layout/PageHeader';
import Timeline from '@/components/ui/Timeline';
import { StructureIcon, EarthquakeIcon, AIIcon } from '@/components/ui/AnimatedIcons';
import Layout from '@/components/layout/LayoutFix';

export default function AboutPage() {
  // Professional expertise
  const expertise = [
    {
      title: 'AI & Machine Learning',
      icon: <AIIcon size={28} />,
      description: 'Specializing in applying artificial intelligence and machine learning to structural engineering and seismic prediction challenges.',
      skills: ['ML Algorithms (XGBoost, Random Forests)', 'LSTM Networks', 'TensorFlow', 'PyTorch', 'Keras', 'Graph Neural Networks']
    },
    {
      title: 'Structural Engineering',
      icon: <StructureIcon size={28} />,
      description: 'Expert in sustainable building engineering with focus on structural analysis and seismic resilience.',
      skills: ['Finite Element Analysis', 'ABAQUS', 'SAP2000', 'SeismoSignal-SeismoStruct', 'Structural Vulnerability Assessment', 'BIM Modeling']
    },
    {
      title: 'Seismic Analysis',
      icon: <EarthquakeIcon size={28} />,
      description: 'Specialized knowledge in seismic hazard assessment and structural vulnerability during earthquakes.',
      skills: ['Seismic Signal Processing', 'Geopsy (Ambient Noise Analysis)', 'QGIS-ArcGIS (Geospatial Analysis)', 'Earthquake Prediction Models', 'Building Damage Assessment']
    },
    {
      title: 'Programming & Technical',
      icon: <AIIcon size={28} />,
      description: 'Strong programming skills with focus on data analysis and machine learning implementation.',
      skills: ['Python', 'NumPy', 'Pandas', 'Matplotlib', 'scikit-learn', 'AutoCAD (2D/3D)', 'Revit', 'NavisWork', 'Mathematica']
    }
  ];

  // Education timeline
  const education = [
    {
      year: '2024-2026',
      degree: 'Master in Sustainable Building Engineering',
      institution: 'Sapienza University, Rome, Italy',
      description: 'Currently pursuing advanced studies in sustainable building engineering.',
      achievements: []
    },
    {
      year: '2021-2024',
      degree: 'B.Sc. in Sustainable Building Engineering',
      institution: 'Sapienza University, Rome, Italy',
      description: 'Thesis: Seismic Hazard and Structural Vulnerability: A Study of Building Damage in the 2017 Kermanshah Earthquake',
      achievements: ['CGPA: 3.86/4', 'GPA (Last 2-Years): 4+/4', 'Ranked 2nd among 90 Sustainable Building Engineering students', 'First of 90 students to complete the program on schedule']
    }
  ];

  // Professional timeline
  const career = [
    {
      years: '2023 - Present',
      position: 'Research Assistant',
      organization: 'Sapienza University',
      description: 'Contributing to the preparation of research reports, conference papers, and journal articles.',
      achievements: [
        'Developed a comprehensive framework integrating AI and ML algorithms into smart building infrastructures',
        'Created and implemented advanced mathematical models for predictive maintenance',
        'Designed experimental methodologies that demonstrated energy consumption reductions',
        'Utilized Python for implementing remote structural health monitoring solutions'
      ]
    },
    {
      years: '2025 - Present',
      position: 'Peer Reviewer',
      organization: 'EEEIC 2025 Conference',
      description: 'Selected as a reviewer for the EEEIC25 (International Conference on Environment and Electrical Engineering).',
      achievements: [
        'Evaluating submitted research papers for acceptance or rejection',
        'Providing critical feedback on scholarly articles'
      ]
    },
    {
      years: '2020 - 2021',
      position: 'Education Consultant',
      organization: 'Venous Institute',
      description: 'Worked as a Mathematics instructor and Education Consultant for people managing their educational paths.',
      achievements: []
    },
    {
      years: '2017 - 2020',
      position: 'Architectural Designer',
      organization: '',
      description: 'Worked on architectural design projects using AutoCAD and 3D Max software.',
      achievements: []
    },
    {
      years: '2018 - 2019',
      position: 'Civil Engineering Intern',
      organization: 'Khaf Steel Company',
      description: 'Interned as a civil engineer to develop abilities and better understand career goals.',
      achievements: []
    }
  ];

  // Awards and recognition
  const awards = [
    {
      year: 2024,
      title: 'First to Complete Sustainable Building Engineering Program on Schedule',
      description: 'First of 90 Sustainable Building Engineering bachelor\'s students to complete the program on schedule at Sapienza University.'
    },
    {
      year: 2024,
      title: 'Ranked 2nd in Sustainable Building Engineering Program',
      description: 'Ranked 2nd among the 90 Sustainable Building Engineering students at Sapienza University.'
    },
    {
      year: 2017,
      title: 'Outstanding Student Award',
      description: 'Ranked 1st among 100+ students at Salam High School, Iran.'
    },
    {
      year: 2017,
      title: 'Iranian University Entrance Exam',
      description: 'Ranked 261 out of 170,000+ participants in the Iranian University Entrance Exam.'
    },
    {
      year: 2014,
      title: 'Mathematics Olympiad Qualification',
      description: 'Among 12,000 candidates in Iran, qualified for the first stage of the Mathematics Olympiad.'
    }
  ];

  return (
    <Layout>
      <PageHeader
        title="About Sattar Hedayat"
        subtitle="Sustainable Building Engineer, Seismic Specialist, and AI Innovator"
        imageUrl="/assets/images/about-header.jpg"
      />

      <Container>
        <Section>
          <div className="grid grid-cols-1 md:grid-cols-2 gap-12 items-center">
            <motion.div
              initial={{ opacity: 0, x: -20 }}
              animate={{ opacity: 1, x: 0 }}
              transition={{ duration: 0.5 }}
            >
              <h2 className="text-3xl font-bold mb-6">Professional Background</h2>
              <p className="text-gray-700 dark:text-gray-300 mb-4">
                Sattar Hedayat is a sustainable building engineer specializing in the integration of artificial intelligence with structural analysis and seismic engineering. Currently pursuing a Master's degree at Sapienza University in Rome, his work focuses on innovative approaches to structural resilience and seismic hazard prediction.
              </p>
              <p className="text-gray-700 dark:text-gray-300 mb-4">
                His research integrates AI and ML algorithms into smart building infrastructures to optimize energy efficiency and structural health monitoring. Sattar's work bridges the gap between traditional structural engineering principles and cutting-edge machine learning techniques.
              </p>
              <p className="text-gray-700 dark:text-gray-300">
                Sattar is particularly focused on ML algorithms for predicting seismic hazards, AI applications in structural health monitoring, and integrating BIM with smart monitoring systems.
              </p>
            </motion.div>

            <motion.div
              initial={{ opacity: 0, x: 20 }}
              animate={{ opacity: 1, x: 0 }}
              transition={{ duration: 0.5, delay: 0.2 }}
              className="relative h-[500px] rounded-lg overflow-hidden shadow-xl"
            >
              <Image
                src="/assets/images/dr-hedayat-profile.jpg"
                alt="Dr. Sattar Hedayat"
                fill
                style={{ objectFit: 'cover' }}
                className="rounded-lg"
              />
            </motion.div>
          </div>
        </Section>

        <Section className="bg-gray-50 dark:bg-gray-900 py-16">
          <h2 className="text-3xl font-bold mb-10 text-center">Areas of Expertise</h2>
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
            {expertise.map((area, index) => (
              <motion.div
                key={index}
                initial={{ opacity: 0, y: 20 }}
                whileInView={{ opacity: 1, y: 0 }}
                transition={{ duration: 0.5, delay: index * 0.1 }}
                viewport={{ once: true, margin: "-50px" }}
                className="bg-white dark:bg-gray-800 p-6 rounded-lg shadow-md h-full"
              >
                <div className="text-blue-600 dark:text-blue-400 mb-4">
                  {area.icon}
                </div>
                <h3 className="text-xl font-bold mb-3">{area.title}</h3>
                <p className="text-gray-700 dark:text-gray-300 mb-4">
                  {area.description}
                </p>
                <div>
                  <h4 className="font-semibold mb-2 text-sm uppercase tracking-wider text-gray-500 dark:text-gray-400">
                    Key Skills
                  </h4>
                  <ul className="list-disc pl-5 text-gray-700 dark:text-gray-300 text-sm space-y-1">
                    {area.skills.map((skill, i) => (
                      <li key={i}>{skill}</li>
                    ))}
                  </ul>
                </div>
              </motion.div>
            ))}
          </div>
        </Section>

        <Section>
          <h2 className="text-3xl font-bold mb-8">Education</h2>
          <Timeline items={education.map(edu => ({
            time: edu.year,
            title: edu.degree,
            subtitle: edu.institution,
            content: (
              <div>
                <p className="mb-2">{edu.description}</p>
                {edu.achievements.length > 0 && (
                  <div>
                    <h4 className="font-semibold text-sm mb-1">Achievements</h4>
                    <ul className="list-disc pl-5 text-sm">
                      {edu.achievements.map((achievement, i) => (
                        <li key={i}>{achievement}</li>
                      ))}
                    </ul>
                  </div>
                )}
              </div>
            )
          }))} />
        </Section>

        <Section className="bg-gray-50 dark:bg-gray-900 py-16">
          <h2 className="text-3xl font-bold mb-8">Professional Experience</h2>
          <Timeline items={career.map(exp => ({
            time: exp.years,
            title: exp.position,
            subtitle: exp.organization,
            content: (
              <div>
                <p className="mb-2">{exp.description}</p>
                {exp.achievements.length > 0 && (
                  <div>
                    <h4 className="font-semibold text-sm mb-1">Key Accomplishments</h4>
                    <ul className="list-disc pl-5 text-sm">
                      {exp.achievements.map((achievement, i) => (
                        <li key={i}>{achievement}</li>
                      ))}
                    </ul>
                  </div>
                )}
              </div>
            )
          }))} />
        </Section>

        <Section>
          <h2 className="text-3xl font-bold mb-8">Awards & Recognition</h2>
          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            {awards.map((award, index) => (
              <motion.div
                key={index}
                initial={{ opacity: 0, y: 20 }}
                whileInView={{ opacity: 1, y: 0 }}
                transition={{ duration: 0.3, delay: index * 0.05 }}
                viewport={{ once: true }}
                className="bg-white dark:bg-gray-800 p-6 rounded-lg shadow-md"
              >
                <div className="flex items-start">
                  <div className="bg-blue-100 dark:bg-blue-900 rounded-full px-3 py-1 text-blue-800 dark:text-blue-200 font-semibold mr-3">
                    {award.year}
                  </div>
                  <div>
                    <h3 className="text-lg font-semibold mb-2">{award.title}</h3>
                    <p className="text-gray-700 dark:text-gray-300 text-sm">
                      {award.description}
                    </p>
                  </div>
                </div>
              </motion.div>
            ))}
          </div>
        </Section>

        <Section className="bg-gray-50 dark:bg-gray-900 py-16">
          <div className="text-center max-w-3xl mx-auto">
            <h2 className="text-3xl font-bold mb-6">Get in Touch</h2>
            <p className="text-gray-700 dark:text-gray-300 mb-8">
              Dr. Hedayat welcomes collaboration opportunities, speaking engagements, and consultation requests. He is also actively looking for motivated graduate students interested in structural engineering and AI integration.
            </p>
            <div className="flex justify-center space-x-4">
              <a 
                href="/contact" 
                className="px-6 py-3 bg-blue-600 text-white rounded-lg hover:bg-blue-700 transition-colors"
              >
                Contact Dr. Hedayat
              </a>
              <a 
                href="/research" 
                className="px-6 py-3 bg-gray-200 text-gray-800 rounded-lg hover:bg-gray-300 transition-colors dark:bg-gray-700 dark:text-white dark:hover:bg-gray-600"
              >
                Explore Research
              </a>
            </div>
          </div>
        </Section>
      </Container>
    </Layout>
  );
} 