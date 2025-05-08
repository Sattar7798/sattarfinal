# Dr. Sattar Hedayat - Personal Website

This is an innovative professional website for Dr. Sattar Hedayat, showcasing his research in structural engineering, seismic analysis, and AI integration in building engineering.

## Features

### Advanced 3D Visualizations
- Interactive building models using Three.js/React Three Fiber
- Dynamic seismic load simulations
- Realistic rendering of structural behaviors

### Innovative Animation Techniques
- Micro-interactions for intuitive user feedback
- Scroll-triggered animations for engaging content reveals
- Particle systems for visualizing forces and energy flow

### AI Integration Features
- Predictive seismic analysis visualizations
- Research data visualization
- AI-powered structural analysis tools

## Technology Stack

### Core Framework
- React with TypeScript
- Next.js for enhanced performance and SEO
- Tailwind CSS for styling

### Animation & 3D Libraries
- Three.js/React Three Fiber for 3D rendering
- GSAP for advanced timeline animations
- Framer Motion for React component animations

### AI Integration
- TensorFlow.js for client-side AI processing

## Project Structure

```
sattar-hedayat-website/
│
├── public/
│   ├── models/          # 3D models for building visualizations
│   ├── textures/        # Textures for 3D models
│   ├── images/          # Website images
│   └── data/            # JSON data files
│
├── src/
│   ├── components/
│   │   ├── layout/      # Layout components (Navbar, Footer)
│   │   ├── animations/  # Animation components
│   │   ├── 3d/          # Three.js components
│   │   ├── ai/          # AI visualization components
│   │   ├── sections/    # Page sections
│   │   └── ui/          # Reusable UI components
│   │
│   ├── hooks/           # Custom React hooks
│   ├── constants/       # Constants and configuration
│   ├── utils/           # Utility functions
│   │   ├── three/       # Three.js utilities
│   │   ├── seismic/     # Seismic simulation utilities
│   │   └── ai/          # AI utilities
│   │
│   ├── context/         # React context providers
│   ├── app/             # Next.js app router pages
│   └── styles/          # Global styles
│
└── config/              # Build configuration
```

## Getting Started

1. Clone the repository
2. Install dependencies:
   ```
   npm install
   ```
3. Run the development server:
   ```
   npm run dev
   ```
4. Open [http://localhost:3000](http://localhost:3000) in your browser

## Key Pages

- **Home**: Introduction and research highlights
- **Research**: Detailed research information
- **Publications**: Academic publications
- **Interactive Model**: 3D visualizations and simulations
- **About**: Professional background
- **Contact**: Contact information

## Building for Production

```
npm run build
npm start
```

## License

This project is proprietary and not licensed for public use or distribution. 