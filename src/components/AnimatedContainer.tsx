
import React from 'react';
import { useScrollAnimation } from '../hooks/useScrollAnimation';

interface AnimatedContainerProps {
  children: React.ReactNode;
  animation?: 'fade-up' | 'fade-left' | 'fade-right' | 'scale-in';
  delay?: number;
  className?: string;
  triggerOnce?: boolean;
}

const AnimatedContainer: React.FC<AnimatedContainerProps> = ({
  children,
  animation = 'fade-up',
  delay = 0,
  className = '',
  triggerOnce = true
}) => {
  const { ref, isInView } = useScrollAnimation({ triggerOnce });

  const getAnimationClass = () => {
    switch (animation) {
      case 'fade-up':
        return 'animate-fade-in-up';
      case 'fade-left':
        return 'animate-fade-in-left';
      case 'fade-right':
        return 'animate-fade-in-right';
      case 'scale-in':
        return 'animate-scale-in';
      default:
        return 'animate-fade-in-up';
    }
  };

  const getDelayClass = () => {
    if (delay <= 100) return 'animate-delay-100';
    if (delay <= 200) return 'animate-delay-200';
    if (delay <= 300) return 'animate-delay-300';
    if (delay <= 400) return 'animate-delay-400';
    if (delay <= 500) return 'animate-delay-500';
    return '';
  };

  return (
    <div
      ref={ref as React.RefObject<HTMLDivElement>}
      className={`
        ${isInView ? getAnimationClass() : 'opacity-0'}
        ${getDelayClass()}
        ${className}
      `}
      style={{ animationDelay: `${delay}ms` }}
    >
      {children}
    </div>
  );
};

export default AnimatedContainer;
