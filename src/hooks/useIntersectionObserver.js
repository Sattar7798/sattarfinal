import { useEffect, useState, useRef } from 'react';

/**
 * Custom hook that detects when an element enters or exits the viewport (visible area)
 * 
 * @param {Object} options Configuration options for the Intersection Observer
 * @param {string|number} options.threshold Visibility threshold (0-1) or multiple thresholds
 * @param {string} options.rootMargin Margin around the root element
 * @param {Element} options.root The element used as viewport for checking visibility
 * @param {Function} options.onEnter Callback function when element enters viewport
 * @param {Function} options.onExit Callback function when element exits viewport
 * @returns {Object} Observer details and ref to attach to element
 */
const useIntersectionObserver = ({
  threshold = 0.1,
  rootMargin = '0px',
  root = null,
  onEnter = null,
  onExit = null,
  triggerOnce = false,
} = {}) => {
  const [isIntersecting, setIsIntersecting] = useState(false);
  const [hasTriggered, setHasTriggered] = useState(false);
  const observedRef = useRef(null);
  const observerRef = useRef(null);

  useEffect(() => {
    // Clean up previous observer
    if (observerRef.current) {
      observerRef.current.disconnect();
    }

    // Skip if we've already triggered once and triggerOnce is true
    if (triggerOnce && hasTriggered) {
      return;
    }

    // Create new observer
    observerRef.current = new IntersectionObserver(
      (entries) => {
        entries.forEach(entry => {
          const isElementIntersecting = entry.isIntersecting;
          
          // If entering viewport
          if (isElementIntersecting && !isIntersecting) {
            setIsIntersecting(true);
            if (onEnter) onEnter(entry);
            if (triggerOnce) setHasTriggered(true);
          } 
          // If exiting viewport
          else if (!isElementIntersecting && isIntersecting) {
            setIsIntersecting(false);
            if (onExit) onExit(entry);
          }
        });
      },
      {
        threshold: typeof threshold === 'string' ? parseFloat(threshold) : threshold,
        rootMargin,
        root,
      }
    );

    // Observe element if it exists
    const currentElement = observedRef.current;
    if (currentElement) {
      observerRef.current.observe(currentElement);
    }

    // Clean up on unmount
    return () => {
      if (observerRef.current && currentElement) {
        observerRef.current.unobserve(currentElement);
        observerRef.current.disconnect();
      }
    };
  }, [threshold, rootMargin, root, onEnter, onExit, isIntersecting, triggerOnce, hasTriggered]);

  // Helper functions to manage observer
  const startObserving = (element) => {
    if (observerRef.current && element) {
      observerRef.current.observe(element);
      observedRef.current = element;
    }
  };

  const stopObserving = () => {
    if (observerRef.current && observedRef.current) {
      observerRef.current.unobserve(observedRef.current);
      observedRef.current = null;
    }
  };

  const resetTrigger = () => {
    setHasTriggered(false);
  };

  return {
    ref: observedRef,
    isIntersecting,
    hasTriggered,
    startObserving,
    stopObserving,
    resetTrigger,
  };
};

export default useIntersectionObserver; 