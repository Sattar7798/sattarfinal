/// <reference types="react" />
/// <reference types="react-dom" />

import * as React from 'react';

declare module 'framer-motion' {
  export interface Transition {
    duration?: number;
    delay?: number;
    ease?: string | number[];
    type?: string;
    stiffness?: number;
    damping?: number;
    mass?: number;
    [key: string]: any;
  }
  
  export interface Variants {
    [key: string]: any;
  }
  
  export interface AnimationProps {
    initial?: any;
    animate?: any;
    exit?: any;
    transition?: Transition;
    variants?: Variants;
    whileHover?: any;
    whileTap?: any;
    whileFocus?: any;
    whileInView?: any;
    viewport?: {
      once?: boolean;
      margin?: string;
      amount?: 'some' | 'all' | number;
    };
  }
  
  type MotionComponent<T extends keyof JSX.IntrinsicElements> = 
    React.ForwardRefExoticComponent<
      React.DetailedHTMLProps<React.HTMLAttributes<T>, T> & 
      AnimationProps & 
      React.RefAttributes<T>
    >;
  
  interface Motion {
    div: MotionComponent<HTMLDivElement>;
    span: MotionComponent<HTMLSpanElement>;
    p: MotionComponent<HTMLParagraphElement>;
    h1: MotionComponent<HTMLHeadingElement>;
    h2: MotionComponent<HTMLHeadingElement>;
    h3: MotionComponent<HTMLHeadingElement>;
    h4: MotionComponent<HTMLHeadingElement>;
    h5: MotionComponent<HTMLHeadingElement>;
    h6: MotionComponent<HTMLHeadingElement>;
    a: MotionComponent<HTMLAnchorElement>;
    button: MotionComponent<HTMLButtonElement>;
    img: MotionComponent<HTMLImageElement>;
    svg: React.ForwardRefExoticComponent<
      React.SVGProps<SVGSVGElement> & 
      AnimationProps & 
      React.RefAttributes<SVGSVGElement>
    >;
    path: React.ForwardRefExoticComponent<
      React.SVGProps<SVGPathElement> & 
      AnimationProps & 
      React.RefAttributes<SVGPathElement>
    >;
    circle: React.ForwardRefExoticComponent<
      React.SVGProps<SVGCircleElement> & 
      AnimationProps & 
      React.RefAttributes<SVGCircleElement>
    >;
    // Add other elements as needed
  }
  
  export const motion: Motion;
  
  // Additional exports for AnimatePresence and other components
  export interface AnimatePresenceProps {
    children?: React.ReactNode;
    initial?: boolean;
    exitBeforeEnter?: boolean;
    onExitComplete?: () => void;
    mode?: 'sync' | 'wait' | 'popLayout';
  }
  
  export const AnimatePresence: React.FC<AnimatePresenceProps>;
} 