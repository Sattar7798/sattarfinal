'use client';

import * as React from 'react';
import { motion } from 'framer-motion';
import Container from '@/components/layout/Container';
import Section from '@/components/layout/Section';
import PageHeader from '@/components/layout/PageHeader';
import { EmailIcon, PhoneIcon, LocationIcon, ClockIcon } from '@/components/ui/Icons';
import Layout from '@/components/layout/LayoutFix';

// Define types for form data and form status
interface FormData {
  name: string;
  email: string;
  subject: string;
  message: string;
  category: string;
}

interface FormStatus {
  isSubmitting: boolean;
  isSubmitted: boolean;
  error: string | null;
}

interface ContactInfo {
  icon: React.ReactNode;
  title: string;
  content: string;
  link?: string;
  secondary?: string;
}

interface Category {
  value: string;
  label: string;
}

export default function ContactPage() {
  // Form state
  const [formData, setFormData] = React.useState<FormData>({
    name: '',
    email: '',
    subject: '',
    message: '',
    category: 'general'
  });
  const [formStatus, setFormStatus] = React.useState<FormStatus>({
    isSubmitting: false,
    isSubmitted: false,
    error: null
  });

  // Handle form input changes
  const handleChange = (e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement | HTMLSelectElement>) => {
    const { name, value } = e.target;
    setFormData((prev: FormData) => ({
      ...prev,
      [name]: value
    }));
  };

  // Handle form submission
  const handleSubmit = async (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    setFormStatus({ isSubmitting: true, isSubmitted: false, error: null });

    try {
      // Here you would normally send the form data to your backend
      // This is a simulation of the API call
      await new Promise(resolve => setTimeout(resolve, 1500));
      
      // Reset form and show success
      setFormData({
        name: '',
        email: '',
        subject: '',
        message: '',
        category: 'general'
      });
      setFormStatus({ isSubmitting: false, isSubmitted: true, error: null });
    } catch (error) {
      setFormStatus({ 
        isSubmitting: false, 
        isSubmitted: false, 
        error: 'There was an error submitting your message. Please try again later.'
      });
    }
  };

  // Contact information
  const contactInfo: ContactInfo[] = [
    {
      icon: <EmailIcon className="w-5 h-5" />,
      title: 'Email',
      content: 'hedayat.1996509@studenti.uniroma1.it',
      link: 'mailto:hedayat.1996509@studenti.uniroma1.it'
    },
    {
      icon: <PhoneIcon className="w-5 h-5" />,
      title: 'Phone',
      content: '+39 388 978 4912',
      link: 'tel:+393889784912'
    },
    {
      icon: <LocationIcon className="w-5 h-5" />,
      title: 'Office',
      content: 'Rome, Italy',
      link: 'https://maps.google.com/?q=Sapienza+University+Rome+Italy'
    },
    {
      icon: <ClockIcon className="w-5 h-5" />,
      title: 'Office Hours',
      content: 'Monday & Wednesday: 2:00 PM - 4:00 PM',
      secondary: 'or by appointment'
    }
  ];

  // Topic categories
  const categories: Category[] = [
    { value: 'general', label: 'General Inquiry' },
    { value: 'research', label: 'Research Collaboration' },
    { value: 'speaking', label: 'Speaking Engagement' },
    { value: 'student', label: 'Prospective Student' },
    { value: 'consulting', label: 'Engineering Consultation' }
  ];

  return (
    <Layout>
      <PageHeader
        title="Contact Sattar Hedayat"
        subtitle="Get in touch for research collaborations, speaking engagements, or consultations"
        imageUrl="/assets/images/contact-header.jpg"
      />

      <Container>
        <Section>
          <div className="grid grid-cols-1 lg:grid-cols-3 gap-12">
            {/* Contact information */}
            <div className="lg:col-span-1">
              <motion.div
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ duration: 0.5 }}
                className="bg-white dark:bg-gray-800 rounded-lg shadow-md p-6"
              >
                <h2 className="text-2xl font-bold mb-6">Contact Information</h2>
                <div className="space-y-6">
                  {contactInfo.map((item, index) => (
                    <div key={index} className="flex">
                      <div className="text-blue-600 dark:text-blue-400 mr-4">
                        {item.icon}
                      </div>
                      <div>
                        <h3 className="font-semibold text-gray-900 dark:text-white">
                          {item.title}
                        </h3>
                        {item.link ? (
                          <a 
                            href={item.link} 
                            className="text-gray-600 dark:text-gray-300 hover:text-blue-600 dark:hover:text-blue-400"
                            target={item.link.startsWith('http') ? '_blank' : undefined}
                            rel={item.link.startsWith('http') ? 'noopener noreferrer' : undefined}
                          >
                            {item.content}
                          </a>
                        ) : (
                          <p className="text-gray-600 dark:text-gray-300">{item.content}</p>
                        )}
                        {item.secondary && (
                          <p className="text-gray-500 dark:text-gray-400 text-sm mt-1">
                            {item.secondary}
                          </p>
                        )}
                      </div>
                    </div>
                  ))}
                </div>

                <div className="mt-8 pt-6 border-t border-gray-200 dark:border-gray-700">
                  <h3 className="font-semibold text-gray-900 dark:text-white mb-3">
                    Administration & Research Team
                  </h3>
                  <p className="text-gray-600 dark:text-gray-300">
                    For administrative inquiries, please contact:
                  </p>
                  <p className="text-gray-600 dark:text-gray-300 mt-2">
                    <strong>Sattar Hedayat</strong><br />
                    <a 
                      href="mailto:sattarhedayat2020@gmail.com"
                      className="text-blue-600 dark:text-blue-400 hover:underline"
                    >
                      sattarhedayat2020@gmail.com
                    </a>
                  </p>
                </div>
              </motion.div>
            </div>

            {/* Contact form */}
            <motion.div
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.5, delay: 0.2 }}
              className="lg:col-span-2"
            >
              <div className="bg-white dark:bg-gray-800 rounded-lg shadow-md p-6">
                <h2 className="text-2xl font-bold mb-6">Send a Message</h2>
                
                {formStatus.isSubmitted ? (
                  <div className="bg-green-50 dark:bg-green-900 border border-green-200 dark:border-green-800 rounded-lg p-6 text-center">
                    <div className="text-green-600 dark:text-green-400 text-4xl mb-4">
                      <svg xmlns="http://www.w3.org/2000/svg" className="h-16 w-16 mx-auto" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 12l2 2 4-4m6 2a9 9 0 11-18 0 9 9 0 0118 0z" />
                      </svg>
                    </div>
                    <h3 className="text-xl font-bold text-green-800 dark:text-green-300 mb-2">
                      Message Sent Successfully!
                    </h3>
                    <p className="text-green-700 dark:text-green-400 mb-4">
                      Thank you for reaching out. Sattar Hedayat will respond to your message as soon as possible.
                    </p>
                    <button
                      onClick={() => setFormStatus((prev: FormStatus) => ({ ...prev, isSubmitted: false }))}
                      className="px-4 py-2 bg-green-600 text-white rounded-lg hover:bg-green-700 transition-colors"
                    >
                      Send Another Message
                    </button>
                  </div>
                ) : (
                  <form onSubmit={handleSubmit} className="space-y-6">
                    {formStatus.error && (
                      <div className="bg-red-50 dark:bg-red-900 border border-red-200 dark:border-red-800 rounded-lg p-4 text-red-700 dark:text-red-400 mb-4">
                        {formStatus.error}
                      </div>
                    )}
                    
                    <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                      <div>
                        <label htmlFor="name" className="block text-gray-700 dark:text-gray-300 font-medium mb-2">
                          Name <span className="text-red-600">*</span>
                        </label>
                        <input
                          type="text"
                          id="name"
                          name="name"
                          value={formData.name}
                          onChange={handleChange}
                          required
                          className="w-full p-3 border border-gray-300 dark:border-gray-700 rounded-lg focus:ring-blue-500 focus:border-blue-500 dark:bg-gray-700 dark:text-white"
                          placeholder="Your name"
                        />
                      </div>
                      
                      <div>
                        <label htmlFor="email" className="block text-gray-700 dark:text-gray-300 font-medium mb-2">
                          Email <span className="text-red-600">*</span>
                        </label>
                        <input
                          type="email"
                          id="email"
                          name="email"
                          value={formData.email}
                          onChange={handleChange}
                          required
                          className="w-full p-3 border border-gray-300 dark:border-gray-700 rounded-lg focus:ring-blue-500 focus:border-blue-500 dark:bg-gray-700 dark:text-white"
                          placeholder="Your email address"
                        />
                      </div>
                    </div>
                    
                    <div>
                      <label htmlFor="category" className="block text-gray-700 dark:text-gray-300 font-medium mb-2">
                        Category
                      </label>
                      <select
                        id="category"
                        name="category"
                        value={formData.category}
                        onChange={handleChange}
                        className="w-full p-3 border border-gray-300 dark:border-gray-700 rounded-lg focus:ring-blue-500 focus:border-blue-500 dark:bg-gray-700 dark:text-white"
                      >
                        {categories.map((category) => (
                          <option key={category.value} value={category.value}>
                            {category.label}
                          </option>
                        ))}
                      </select>
                    </div>
                    
                    <div>
                      <label htmlFor="subject" className="block text-gray-700 dark:text-gray-300 font-medium mb-2">
                        Subject <span className="text-red-600">*</span>
                      </label>
                      <input
                        type="text"
                        id="subject"
                        name="subject"
                        value={formData.subject}
                        onChange={handleChange}
                        required
                        className="w-full p-3 border border-gray-300 dark:border-gray-700 rounded-lg focus:ring-blue-500 focus:border-blue-500 dark:bg-gray-700 dark:text-white"
                        placeholder="Subject of your message"
                      />
                    </div>
                    
                    <div>
                      <label htmlFor="message" className="block text-gray-700 dark:text-gray-300 font-medium mb-2">
                        Message <span className="text-red-600">*</span>
                      </label>
                      <textarea
                        id="message"
                        name="message"
                        value={formData.message}
                        onChange={handleChange}
                        required
                        rows={6}
                        className="w-full p-3 border border-gray-300 dark:border-gray-700 rounded-lg focus:ring-blue-500 focus:border-blue-500 dark:bg-gray-700 dark:text-white"
                        placeholder="Your message"
                      ></textarea>
                    </div>
                    
                    <div className="flex justify-end">
                      <button
                        type="submit"
                        disabled={formStatus.isSubmitting}
                        className={`px-6 py-3 bg-blue-600 text-white rounded-lg hover:bg-blue-700 transition-colors ${
                          formStatus.isSubmitting ? 'opacity-75 cursor-not-allowed' : ''
                        }`}
                      >
                        {formStatus.isSubmitting ? 'Sending...' : 'Send Message'}
                      </button>
                    </div>
                  </form>
                )}
              </div>
            </motion.div>
          </div>
        </Section>
        
        <Section className="bg-gray-50 dark:bg-gray-900 py-16">
          <div className="text-center max-w-3xl mx-auto">
            <h2 className="text-2xl font-bold mb-6">Visit the Lab</h2>
            <p className="text-gray-700 dark:text-gray-300 mb-8">
              Smart Structures Laboratory is located in Building 5, MIT Campus. Visitors are welcome during open house events or by appointment.
            </p>
            <div className="aspect-w-16 aspect-h-9 rounded-lg overflow-hidden shadow-lg">
              <iframe
                src="https://www.google.com/maps/embed?pb=!1m18!1m12!1m3!1d2948.224627294724!2d-71.09476!3d42.360091!2m3!1f0!2f0!3f0!3m2!1i1024!2i768!4f13.1!3m3!1m2!1s0x89e370a9563dc44b%3A0x8467c6b6f549a352!2sMassachusetts%20Institute%20of%20Technology!5e0!3m2!1sen!2sus!4v1644314841097!5m2!1sen!2sus"
                width="100%"
                height="450"
                style={{ border: 0 }}
                allowFullScreen={true}
                loading="lazy"
                title="Lab Location Map"
              ></iframe>
            </div>
          </div>
        </Section>
        
        <Section>
          <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
            <motion.div
              initial={{ opacity: 0, y: 20 }}
              whileInView={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.5 }}
              viewport={{ once: true }}
              className="bg-white dark:bg-gray-800 p-6 rounded-lg shadow-md"
            >
              <h3 className="text-xl font-bold mb-4">For Students</h3>
              <p className="text-gray-700 dark:text-gray-300 mb-4">
                Interested in joining Dr. Hedayat's research team? Prospective graduate students should include their research interests, CV, and academic background in their message.
              </p>
              <a 
                href="#"
                onClick={(e: React.MouseEvent<HTMLAnchorElement>) => {
                  e.preventDefault();
                  setFormData((prev: FormData) => ({ ...prev, category: 'student' }));
                  const categoryElement = document.getElementById('category');
                  if (categoryElement) {
                    categoryElement.scrollIntoView({ behavior: 'smooth' });
                  }
                }}
                className="text-blue-600 dark:text-blue-400 hover:underline"
              >
                Apply as a Research Assistant →
              </a>
            </motion.div>
            
            <motion.div
              initial={{ opacity: 0, y: 20 }}
              whileInView={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.5, delay: 0.1 }}
              viewport={{ once: true }}
              className="bg-white dark:bg-gray-800 p-6 rounded-lg shadow-md"
            >
              <h3 className="text-xl font-bold mb-4">For Research Collaborators</h3>
              <p className="text-gray-700 dark:text-gray-300 mb-4">
                Dr. Hedayat welcomes collaborations with other researchers and institutions on projects related to structural engineering, seismic analysis, and AI integration.
              </p>
              <a 
                href="#"
                onClick={(e: React.MouseEvent<HTMLAnchorElement>) => {
                  e.preventDefault();
                  setFormData((prev: FormData) => ({ ...prev, category: 'research' }));
                  const categoryElement = document.getElementById('category');
                  if (categoryElement) {
                    categoryElement.scrollIntoView({ behavior: 'smooth' });
                  }
                }}
                className="text-blue-600 dark:text-blue-400 hover:underline"
              >
                Propose a Collaboration →
              </a>
            </motion.div>
            
            <motion.div
              initial={{ opacity: 0, y: 20 }}
              whileInView={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.5, delay: 0.2 }}
              viewport={{ once: true }}
              className="bg-white dark:bg-gray-800 p-6 rounded-lg shadow-md"
            >
              <h3 className="text-xl font-bold mb-4">For Industry Partners</h3>
              <p className="text-gray-700 dark:text-gray-300 mb-4">
                Looking for expert consultation on structural engineering problems or AI-enhanced solutions? Dr. Hedayat provides consulting services for industry partners.
              </p>
              <a 
                href="#"
                onClick={(e: React.MouseEvent<HTMLAnchorElement>) => {
                  e.preventDefault();
                  setFormData((prev: FormData) => ({ ...prev, category: 'consulting' }));
                  const categoryElement = document.getElementById('category');
                  if (categoryElement) {
                    categoryElement.scrollIntoView({ behavior: 'smooth' });
                  }
                }}
                className="text-blue-600 dark:text-blue-400 hover:underline"
              >
                Request a Consultation →
              </a>
            </motion.div>
          </div>
        </Section>
      </Container>
    </Layout>
  );
} 