import Link from 'next/link';
import { motion } from 'framer-motion';

const Footer = () => {
  const currentYear = new Date().getFullYear();

  const socialLinks = [
    { name: 'LinkedIn', url: 'https://linkedin.com/in/sattar-hedayat', icon: 'linkedin' },
    { name: 'Google Scholar', url: 'https://scholar.google.com/citations?user=sattar-hedayat', icon: 'google-scholar' },
    { name: 'ResearchGate', url: 'https://www.researchgate.net/profile/Sattar-Hedayat', icon: 'researchgate' },
    { name: 'Twitter', url: 'https://twitter.com/sattarhedayat', icon: 'twitter' },
  ];

  const footerLinks = [
    { title: 'Navigation', links: [
      { name: 'Home', path: '/' },
      { name: 'Research', path: '/research' },
      { name: 'Publications', path: '/publications' },
      { name: 'Interactive Models', path: '/interactive-model' },
      { name: 'About', path: '/about' },
      { name: 'Contact', path: '/contact' },
    ]},
    { title: 'Research Areas', links: [
      { name: 'Structural Engineering', path: '/research#structural' },
      { name: 'Seismic Analysis', path: '/research#seismic' },
      { name: 'AI in Engineering', path: '/research#ai' },
      { name: 'Sustainable Buildings', path: '/research#sustainable' },
    ]},
    { title: 'Contact', links: [
      { name: 'Email', path: 'mailto:sattar.hedayat@university.edu' },
      { name: 'Office', info: 'Engineering Building, Room 3025' },
      { name: 'Phone', info: '+1 (555) 123-4567' },
    ]},
  ];

  // Animation variants
  const fadeIn = {
    hidden: { opacity: 0, y: 20 },
    visible: { opacity: 1, y: 0, transition: { duration: 0.6 } }
  };

  // Icon component
  const SocialIcon = ({ type }) => {
    switch (type) {
      case 'linkedin':
        return (
          <svg className="w-5 h-5 fill-current" viewBox="0 0 24 24" xmlns="http://www.w3.org/2000/svg">
            <path d="M20.447 20.452h-3.554v-5.569c0-1.328-.027-3.037-1.852-3.037-1.853 0-2.136 1.445-2.136 2.939v5.667H9.351V9h3.414v1.561h.046c.477-.9 1.637-1.85 3.37-1.85 3.601 0 4.267 2.37 4.267 5.455v6.286zM5.337 7.433c-1.144 0-2.063-.926-2.063-2.065 0-1.138.92-2.063 2.063-2.063 1.14 0 2.064.925 2.064 2.063 0 1.139-.925 2.065-2.064 2.065zm1.782 13.019H3.555V9h3.564v11.452zM22.225 0H1.771C.792 0 0 .774 0 1.729v20.542C0 23.227.792 24 1.771 24h20.451C23.2 24 24 23.227 24 22.271V1.729C24 .774 23.2 0 22.223 0h.002z"/>
          </svg>
        );
      case 'google-scholar':
        return (
          <svg className="w-5 h-5 fill-current" viewBox="0 0 24 24" xmlns="http://www.w3.org/2000/svg">
            <path d="M5.242 13.769L0 9.5 12 0l12 9.5-5.242 4.269C17.548 11.249 14.978 9.5 12 9.5c-2.977 0-5.548 1.748-6.758 4.269zM12 10a7 7 0 1 0 0 14 7 7 0 0 0 0-14z"/>
          </svg>
        );
      case 'researchgate':
        return (
          <svg className="w-5 h-5 fill-current" viewBox="0 0 24 24" xmlns="http://www.w3.org/2000/svg">
            <path d="M19.586 0c-.818 0-1.508.19-2.073.565-.563.377-.97.936-1.213 1.68a3.193 3.193 0 0 0-.112.437 8.365 8.365 0 0 0-.078.53 9 9 0 0 0-.05.727c-.01.282-.013.621-.013 1.016a31.121 31.121 0 0 0 .014 1.017 9 9 0 0 0 .05.727 7.946 7.946 0 0 0 .078.53h-.004a3.334 3.334 0 0 0 .589 1.608c.263.391.612.703 1.045.937.432.231.94.349 1.523.349.818 0 1.508-.19 2.073-.565.563-.377.97-.936 1.213-1.68.084-.168.12-.286.145-.437.026-.15.055-.33.078-.53.026-.2.043-.454.052-.727.01-.282.012-.621.012-1.016a31.121 31.121 0 0 0-.014-1.017 11.4 11.4 0 0 0-.05-.727 8.303 8.303 0 0 0-.078-.53h.004a3.23 3.23 0 0 0-.589-1.608 2.953 2.953 0 0 0-1.045-.936C20.678.117 20.169 0 19.586 0zm-7.583 0a13.83 13.83 0 0 0-4.154.635A12.387 12.387 0 0 0 0 5.973V24h9.413V20.5h-5.29V7.325c.913-1.163 2.248-1.988 3.836-2.344a10.888 10.888 0 0 1 2.563-.299v7.025c0 .371.205.681.5.81.295.13.636.076.849-.134L20.677 4.94c.192-.142.296-.362.296-.596 0-.233-.104-.454-.296-.597L11.87.212a.901.901 0 0 0-.524-.199.901.901 0 0 0-.325-.013z"/>
          </svg>
        );
      case 'twitter':
        return (
          <svg className="w-5 h-5 fill-current" viewBox="0 0 24 24" xmlns="http://www.w3.org/2000/svg">
            <path d="M23.953 4.57a10 10 0 01-2.825.775 4.958 4.958 0 002.163-2.723c-.951.555-2.005.959-3.127 1.184a4.92 4.92 0 00-8.384 4.482C7.69 8.095 4.067 6.13 1.64 3.162a4.822 4.822 0 00-.666 2.475c0 1.71.87 3.213 2.188 4.096a4.904 4.904 0 01-2.228-.616v.06a4.923 4.923 0 003.946 4.827 4.996 4.996 0 01-2.212.085 4.936 4.936 0 004.604 3.417 9.867 9.867 0 01-6.102 2.105c-.39 0-.779-.023-1.17-.067a13.995 13.995 0 007.557 2.209c9.053 0 13.998-7.496 13.998-13.985 0-.21 0-.42-.015-.63A9.935 9.935 0 0024 4.59z"/>
          </svg>
        );
      default:
        return null;
    }
  };

  return (
    <footer className="bg-gray-100 dark:bg-gray-900 pt-16 pb-8">
      <div className="container mx-auto px-4">
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-8">
          {/* Logo and About */}
          <motion.div 
            initial="hidden"
            whileInView="visible"
            viewport={{ once: true }}
            variants={fadeIn}
            className="col-span-1 md:col-span-2 lg:col-span-1"
          >
            <Link href="/">
              <div className="flex items-center cursor-pointer">
                <span className="text-xl font-bold bg-clip-text text-transparent bg-gradient-to-r from-blue-600 to-emerald-600">
                  Dr. Sattar Hedayat
                </span>
              </div>
            </Link>
            <p className="mt-4 text-gray-600 dark:text-gray-400">
              Structural engineer specializing in seismic analysis and AI integration
              in building engineering. Researching innovative solutions for safer,
              more resilient structures.
            </p>
            <div className="mt-6 flex space-x-4">
              {socialLinks.map((link) => (
                <a
                  key={link.name}
                  href={link.url}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="text-gray-600 dark:text-gray-400 hover:text-blue-600 dark:hover:text-blue-400 transition-colors"
                  aria-label={link.name}
                >
                  <SocialIcon type={link.icon} />
                </a>
              ))}
            </div>
          </motion.div>

          {/* Footer Links */}
          {footerLinks.map((section, index) => (
            <motion.div
              key={section.title}
              initial="hidden"
              whileInView="visible"
              viewport={{ once: true }}
              variants={fadeIn}
              custom={index}
              className="col-span-1"
            >
              <h3 className="text-lg font-semibold text-gray-900 dark:text-white mb-4">
                {section.title}
              </h3>
              <ul className="space-y-2">
                {section.links.map((link) => (
                  <li key={link.name}>
                    {link.path ? (
                      <Link
                        href={link.path}
                        className="text-gray-600 dark:text-gray-400 hover:text-blue-600 dark:hover:text-blue-400 transition-colors"
                      >
                        {link.name}
                      </Link>
                    ) : (
                      <span className="text-gray-600 dark:text-gray-400">
                        <strong>{link.name}:</strong> {link.info}
                      </span>
                    )}
                  </li>
                ))}
              </ul>
            </motion.div>
          ))}
        </div>

        <div className="border-t border-gray-200 dark:border-gray-800 mt-12 pt-8 flex flex-col md:flex-row justify-between items-center">
          <p className="text-gray-600 dark:text-gray-400 text-sm">
            © {currentYear} Dr. Sattar Hedayat. All rights reserved.
          </p>
          <div className="mt-4 md:mt-0">
            <Link
              href="/privacy"
              className="text-sm text-gray-600 dark:text-gray-400 hover:text-blue-600 dark:hover:text-blue-400 transition-colors mr-4"
            >
              Privacy Policy
            </Link>
            <Link
              href="/terms"
              className="text-sm text-gray-600 dark:text-gray-400 hover:text-blue-600 dark:hover:text-blue-400 transition-colors"
            >
              Terms of Service
            </Link>
          </div>
        </div>
      </div>
    </footer>
  );
};

export default Footer; 