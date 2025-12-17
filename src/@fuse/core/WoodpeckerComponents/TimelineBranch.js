import { useEffect, useRef } from 'react';
import { styled } from '@mui/material/styles';
import { motion } from 'framer-motion';
import { gsap } from 'gsap';
import { ScrollTrigger } from 'gsap/ScrollTrigger';

gsap.registerPlugin(ScrollTrigger);

const BranchContainer = styled('div')(({ theme }) => ({
  position: 'relative',
  width: '100%',
  minHeight: '200px',
  display: 'flex',
  alignItems: 'center',
  justifyContent: 'center',
}));

const BranchSVG = styled('svg')({
  position: 'absolute',
  width: '100%',
  height: '100%',
  pointerEvents: 'none',
});

const BranchPath = styled('path')(({ theme, branch }) => ({
  fill: 'none',
  stroke: branch === 'career'
    ? '#10B981'
    : branch === 'personal'
    ? '#3B82F6'
    : branch === 'family'
    ? '#EC4899'
    : '#6B7280',
  strokeWidth: 3,
  strokeLinecap: 'round',
  strokeLinejoin: 'round',
  opacity: 0,
}));

const TimelineBranch = ({
  startPoint = { x: 50, y: 0 },
  endPoint = { x: 50, y: 100 },
  controlPoints = [],
  branch = 'main',
  animated = true,
  duration = 2,
  delay = 0,
  className
}) => {
  const pathRef = useRef(null);
  const containerRef = useRef(null);

  useEffect(() => {
    if (!animated || !pathRef.current) return;

    const path = pathRef.current;
    const pathLength = path.getTotalLength();

    // Set up the path for animation
    gsap.set(path, {
      strokeDasharray: pathLength,
      strokeDashoffset: pathLength,
      opacity: 1
    });

    // Create scroll-triggered animation
    const tl = gsap.timeline({
      scrollTrigger: {
        trigger: containerRef.current,
        start: 'top 80%',
        end: 'bottom 20%',
        toggleActions: 'play none none reverse'
      }
    });

    tl.to(path, {
      strokeDashoffset: 0,
      duration: duration,
      delay: delay,
      ease: 'power2.out'
    });

    return () => {
      if (tl.scrollTrigger) {
        tl.scrollTrigger.kill();
      }
      tl.kill();
    };
  }, [animated, duration, delay]);

  // Generate SVG path from points
  const generatePath = () => {
    let pathData = `M ${startPoint.x} ${startPoint.y}`;

    if (controlPoints.length > 0) {
      // Use quadratic curves for smooth branches
      controlPoints.forEach((point, index) => {
        const nextPoint = controlPoints[index + 1] || endPoint;
        if (index % 2 === 0) {
          pathData += ` Q ${point.x} ${point.y} ${nextPoint.x} ${nextPoint.y}`;
        }
      });
    } else {
      // Simple line if no control points
      pathData += ` L ${endPoint.x} ${endPoint.y}`;
    }

    return pathData;
  };

  return (
    <BranchContainer ref={containerRef} className={className}>
      <BranchSVG viewBox="0 0 100 100" preserveAspectRatio="none">
        <BranchPath
          ref={pathRef}
          branch={branch}
          d={generatePath()}
        />
      </BranchSVG>
    </BranchContainer>
  );
};

// Predefined branch patterns for common use cases
export const BranchPatterns = {
  upwardBranch: {
    controlPoints: [
      { x: 50, y: 20 },
      { x: 70, y: 40 },
      { x: 80, y: 60 }
    ]
  },
  downwardBranch: {
    controlPoints: [
      { x: 50, y: 20 },
      { x: 30, y: 40 },
      { x: 20, y: 60 }
    ]
  },
  zigzagBranch: {
    controlPoints: [
      { x: 60, y: 15 },
      { x: 40, y: 35 },
      { x: 70, y: 55 },
      { x: 30, y: 75 }
    ]
  },
  curvedBranch: {
    controlPoints: [
      { x: 55, y: 25 },
      { x: 65, y: 45 },
      { x: 45, y: 65 }
    ]
  }
};

export default TimelineBranch;
