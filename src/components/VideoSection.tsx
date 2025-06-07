import React, { useState, useRef, useEffect, useCallback } from 'react';
import { Play, Pause, Maximize2, X, ChevronLeft, ChevronRight, Volume2, VolumeX } from 'lucide-react';
import { motion, AnimatePresence, useAnimation } from 'framer-motion';

// Hide scrollbar but keep functionality
const scrollbarHide = {
  '&::-webkit-scrollbar': {
    display: 'none',
  },
  '-ms-overflow-style': 'none',
  'scrollbar-width': 'none',
};

interface VideoDurations {
  [key: string]: number;
}

interface VideoItemProps {
  video: string;
  index: number;
  isHovered: boolean;
  videoRefs: React.MutableRefObject<(HTMLVideoElement | null)[]>;
  videoDurations: VideoDurations;
  handleVideoHover: (index: number, isHovering: boolean) => void;
  openFullscreen: (video: string, index: number) => void;
  totalVideos: number;
}

// Memoized Video Item Component
const VideoItem = React.memo(({ 
  video, 
  index, 
  isHovered, 
  videoRefs, 
  videoDurations, 
  handleVideoHover, 
  openFullscreen,
  totalVideos
}: VideoItemProps) => {
  const [isPlaying, setIsPlaying] = useState(false);
  const videoRef = useRef<HTMLVideoElement>(null);
  
  // Handle video play
  const handlePlay = useCallback((e: React.MouseEvent) => {
    e.stopPropagation();
    const videoEl = videoRefs.current?.[index];
    if (videoEl) {
      videoEl.play()
        .then(() => setIsPlaying(true))
        .catch(console.error);
    }
  }, [index, videoRefs]);
  
  // Handle video pause
  const handlePause = useCallback((e: React.MouseEvent) => {
    e.stopPropagation();
    const videoEl = videoRefs.current?.[index];
    if (videoEl) {
      videoEl.pause();
      setIsPlaying(false);
    }
  }, [index, videoRefs]);
  
  // Handle video click to open fullscreen
  const handleClick = useCallback((e: React.MouseEvent) => {
    e.stopPropagation();
    openFullscreen(video, index % (totalVideos / 2));
  }, [index, openFullscreen, totalVideos, video]);
  
  // Handle video loaded data
  const handleVideoLoadedData = useCallback((e: React.SyntheticEvent<HTMLVideoElement>) => {
    const videoEl = e.target as HTMLVideoElement;
    videoDurations[video] = videoEl.duration || 0;
  }, [video, videoDurations]);
  
  // Auto-play video when mounted
  useEffect(() => {
    const currentVideoRef = videoRef.current;
    if (currentVideoRef && videoRefs) {
      videoRefs.current[index] = currentVideoRef;
      
      const playVideo = async () => {
        try {
          await currentVideoRef.play();
          setIsPlaying(true);
        } catch (error) {
          console.error('Error playing video:', error);
          setIsPlaying(false);
        }
      };
      
      playVideo();
      
      return () => {
        // Clean up on unmount
        if (videoRefs.current) {
          videoRefs.current[index] = null;
        }
      };
    }
  }, [index, videoRefs]);
  
  // Format time in seconds to MM:SS format
  const formatTime = (time: number): string => {
    const minutes = Math.floor(time / 60);
    const seconds = Math.floor(time % 60);
    return `${minutes}:${seconds.toString().padStart(2, '0')}`;
  };

  return (
    <div
      key={`${video}-${index}`}
      className="group relative flex-shrink-0 w-28 sm:w-36 md:w-40 lg:w-48 mx-2 cursor-pointer overflow-hidden rounded-xl bg-gray-900 transition-all duration-300 hover:scale-105"
      style={{
        aspectRatio: '9/16',
        height: '280px',
        maxHeight: '400px',
        minHeight: '200px'
      }}
      onMouseEnter={() => handleVideoHover(index, true)}
      onMouseLeave={() => handleVideoHover(index, false)}
      onClick={handleClick}
    >
      <video
        ref={videoRef}
        className="h-full w-full object-cover"
        src={video}
        muted
        loop
        playsInline
        onPlay={() => setIsPlaying(true)}
        onPause={() => setIsPlaying(false)}
        onLoadedData={handleVideoLoadedData}
      />
      
      {/* Hover Overlay */}
      <div 
        className={`absolute inset-0 flex flex-col items-center justify-center bg-black bg-opacity-50 transition-opacity duration-300 ${
          isHovered ? 'opacity-100' : 'opacity-0'
        }`}
        onClick={handleClick}
      >
        <div className="flex flex-col items-center justify-center space-y-4">
          <div className="flex h-16 w-16 items-center justify-center rounded-full bg-white bg-opacity-20 transform transition-transform group-hover:scale-110">
            {isPlaying ? (
              <Pause className="h-8 w-8 text-white" onClick={handlePause} />
            ) : (
              <Play className="h-8 w-8 text-white" onClick={handlePlay} />
            )}
          </div>
          <button 
            className="px-4 py-2 bg-white bg-opacity-20 text-white rounded-full text-sm font-medium hover:bg-opacity-30 transition-all"
            onClick={handleClick}
          >
            Fullscreen
          </button>
        </div>
      </div>
      
      {/* Video Duration */}
      <div className="absolute bottom-3 right-3 rounded-full bg-black bg-opacity-70 px-2 py-1 text-xs text-white">
        {videoDurations[video] ? formatTime(videoDurations[video]) : '0:00'}
      </div>
    </div>
  );
});

const VideoSection: React.FC = () => {
  // State management
  const [videos, setVideos] = useState<string[]>([]);
  const [isHovered, setIsHovered] = useState<number | null>(null);
  const [isFullscreen, setIsFullscreen] = useState(false);
  const [currentVideo, setCurrentVideo] = useState<string>('');
  const [isMuted, setIsMuted] = useState(true);
  const [currentVideoIndex, setCurrentVideoIndex] = useState(0);
  const [isPlaying, setIsPlaying] = useState(false);
  const [currentTime, setCurrentTime] = useState(0);
  const [duration, setDuration] = useState(0);
  const [showControls, setShowControls] = useState(true);
  const [videoDurations, setVideoDurations] = useState<VideoDurations>({});
  
  // Scrolling state
  const [isScrolling, setIsScrolling] = useState(true);
  const [scrollPosition, setScrollPosition] = useState(0);
  
  // Refs
  const videoRefs = useRef<(HTMLVideoElement | null)[]>([]);
  const fullscreenVideoRef = useRef<HTMLVideoElement>(null);
  const controlsTimeoutRef = useRef<NodeJS.Timeout>();
  const containerRef = useRef<HTMLDivElement>(null);
  const scrollContainerRef = useRef<HTMLDivElement>(null);
  const scrollAnimationRef = useRef<number>();
  const controls = useAnimation();
  
  // Scroll speed (pixels per frame)
  const scrollSpeed = 1.5;

  // Generate video paths with duplicates for seamless looping
  useEffect(() => {
    const videoFiles = Array.from({ length: 60 }, (_, i) => `/videos/Gym Videos (${i + 1}).mp4`);
    // Duplicate videos for seamless looping
    setVideos([...videoFiles, ...videoFiles]);
  }, []);

  // Handle video hover
  const handleVideoHover = useCallback((index: number, isHovering: boolean) => {
    if (isHovering) {
      setIsHovered(index);
      const video = videoRefs.current[index];
      if (video) {
        video.pause();
      }
    } else {
      setIsHovered(null);
      const video = videoRefs.current[index];
      if (video) {
        video.play().catch(console.error);
      }
    }
  }, []);
  
  // Auto-play all videos on mount and when scrolling
  useEffect(() => {
    const playAllVideos = () => {
      videoRefs.current.forEach(video => {
        if (video && video.paused) {
          video.play().catch(console.error);
        }
      });
    };
    
    // Initial play
    const timer = setTimeout(playAllVideos, 1000);
    
    // Play videos when scroll container is in view
    const observer = new IntersectionObserver((entries) => {
      entries.forEach(entry => {
        if (entry.isIntersecting) {
          playAllVideos();
        }
      });
    }, { threshold: 0.1 });
    
    if (scrollContainerRef.current) {
      observer.observe(scrollContainerRef.current);
    }
    
    return () => {
      clearTimeout(timer);
      observer.disconnect();
    };
  }, []);

  // Toggle play/pause
  const togglePlayPause = useCallback(() => {
    if (fullscreenVideoRef.current) {
      if (isPlaying) {
        fullscreenVideoRef.current.pause();
      } else {
        fullscreenVideoRef.current.play().catch(console.error);
      }
      setIsPlaying(!isPlaying);
    }
  }, [isPlaying]);

  // Toggle mute
  const toggleMute = useCallback(() => {
    if (fullscreenVideoRef.current) {
      fullscreenVideoRef.current.muted = !fullscreenVideoRef.current.muted;
      setIsMuted(fullscreenVideoRef.current.muted);
    }
  }, []);

  // Open video in fullscreen
  const openFullscreen = useCallback((video: string, index: number) => {
    setCurrentVideo(video);
    setCurrentVideoIndex(index);
    setIsFullscreen(true);
    document.body.style.overflow = 'hidden';
    
    // Auto-play the video when opened in fullscreen
    setTimeout(() => {
      if (fullscreenVideoRef.current) {
        fullscreenVideoRef.current.play().catch(console.error);
        setIsPlaying(true);
      }
    }, 100);
  }, []);

  // Close fullscreen
  const closeFullscreen = useCallback(() => {
    if (fullscreenVideoRef.current) {
      fullscreenVideoRef.current.pause();
      fullscreenVideoRef.current.currentTime = 0;
      setIsPlaying(false);
    }
    setIsFullscreen(false);
    document.body.style.overflow = '';
  }, []); 

  // Handle video end
  const handleVideoEnd = useCallback(() => {
    const nextIndex = (currentVideoIndex + 1) % videos.length;
    setCurrentVideoIndex(nextIndex);
    setCurrentVideo(videos[nextIndex]);
    
    if (fullscreenVideoRef.current) {
      fullscreenVideoRef.current.src = videos[nextIndex];
      fullscreenVideoRef.current.play().catch(console.error);
    }
  }, [currentVideoIndex, videos]);

  // Handle scroll events for manual scrolling
  const handleScroll = useCallback(() => {
    if (scrollContainerRef.current) {
      const container = scrollContainerRef.current;
      setScrollPosition(container.scrollLeft);
    }
  }, []);
  
  // Pause scrolling when hovering over the container
  const handleMouseEnter = useCallback(() => {
    setIsScrolling(false);
    if (scrollAnimationRef.current) {
      cancelAnimationFrame(scrollAnimationRef.current);
    }
  }, []);
  
  // Resume scrolling when mouse leaves
  const handleMouseLeave = useCallback(() => {
    setIsScrolling(true);
  }, []);
  
  // Enhanced auto-scroll effect with momentum and easing
  useEffect(() => {
    if (!scrollContainerRef.current || !isScrolling) return;
    
    const scrollContainer = scrollContainerRef.current;
    const scrollWidth = scrollContainer.scrollWidth / 2;
    let lastTimestamp = 0;
    let scrollDirection = 1;
    let velocity = 0;
    const friction = 0.95; // Friction coefficient (0.9-0.99)
    const acceleration = 0.2; // Acceleration rate
    const maxSpeed = 10; // Maximum scroll speed
    
    const scrollStep = (timestamp: number) => {
      if (!lastTimestamp) {
        lastTimestamp = timestamp;
        scrollAnimationRef.current = requestAnimationFrame(scrollStep);
        return;
      }
      
      const deltaTime = Math.min(timestamp - lastTimestamp, 100) / 16; // Cap delta time
      lastTimestamp = timestamp;
      
      // Apply acceleration
      velocity = Math.min(velocity + (acceleration * deltaTime * scrollDirection), maxSpeed);
      
      // Calculate new position with momentum
      const currentScroll = scrollContainer.scrollLeft;
      let newPosition = currentScroll + (velocity * deltaTime);
      
      // Check boundaries and bounce
      if (newPosition >= scrollWidth - scrollContainer.clientWidth) {
        newPosition = scrollWidth - scrollContainer.clientWidth;
        velocity = -velocity * 0.6; // Bounce effect
        scrollDirection = -1;
      } else if (newPosition <= 0) {
        newPosition = 0;
        velocity = -velocity * 0.6; // Bounce effect
        scrollDirection = 1;
      } else {
        // Apply friction when not at boundaries
        velocity *= Math.pow(friction, deltaTime);
        if (Math.abs(velocity) < 0.1) velocity = 0;
      }
      
      // Apply smooth scrolling
      scrollContainer.scrollTo({
        left: newPosition,
        behavior: 'smooth'
      });
      
      if (isScrolling) {
        scrollAnimationRef.current = requestAnimationFrame(scrollStep);
      }
    };
    
    scrollAnimationRef.current = requestAnimationFrame(scrollStep);
    
    return () => {
      if (scrollAnimationRef.current) {
        cancelAnimationFrame(scrollAnimationRef.current);
      }
    };
  }, [isScrolling, scrollSpeed]);
  
  // Handle wheel events for smooth horizontal scrolling
  useEffect(() => {
    const container = scrollContainerRef.current;
    if (!container) return;
    
    const handleWheel = (e: WheelEvent) => {
      if (Math.abs(e.deltaY) > Math.abs(e.deltaX)) {
        container.scrollLeft += e.deltaY * 0.8; // Reduce scroll speed
        e.preventDefault();
      }
    };
    
    container.addEventListener('wheel', handleWheel as EventListener, { passive: false } as AddEventListenerOptions);
    return () => container.removeEventListener('wheel', handleWheel as EventListener);
  }, []);

  // Handle time update
  const handleTimeUpdate = useCallback(() => {
    if (fullscreenVideoRef.current) {
      setCurrentTime(fullscreenVideoRef.current.currentTime);
      setDuration(fullscreenVideoRef.current.duration || 0);
    }
  }, []);

  // Handle loaded metadata
  const handleLoadedMetadata = useCallback(() => {
    if (fullscreenVideoRef.current) {
      setDuration(fullscreenVideoRef.current.duration || 0);
    }
  }, []);

  // Handle video loaded data
  const handleVideoLoadedData = useCallback((e: React.SyntheticEvent<HTMLVideoElement>) => {
    const video = e.target as HTMLVideoElement;
    setVideoDurations(prev => ({
      ...prev,
      [video.src]: video.duration || 0
    }));
  }, []);

  // Format time in MM:SS format
  const formatTime = (time: number): string => {
    const minutes = Math.floor(time / 60);
    const seconds = Math.floor(time % 60);
    return `${minutes}:${seconds.toString().padStart(2, '0')}`;
  };

  // Handle keyboard navigation
  useEffect(() => {
    const handleKeyDown = (e: KeyboardEvent) => {
      if (!isFullscreen) return;
      
      switch (e.key) {
        case 'Escape':
          closeFullscreen();
          break;
        case ' ':
        case 'k':
          e.preventDefault();
          togglePlayPause();
          break;
        case 'm':
          toggleMute();
          break;
        case 'ArrowLeft':
          e.preventDefault();
          if (fullscreenVideoRef.current) {
            fullscreenVideoRef.current.currentTime = Math.max(0, fullscreenVideoRef.current.currentTime - 5);
          }
          break;
        case 'ArrowRight':
          e.preventDefault();
          if (fullscreenVideoRef.current) {
            fullscreenVideoRef.current.currentTime = Math.min(
              fullscreenVideoRef.current.duration,
              fullscreenVideoRef.current.currentTime + 5
            );
          }
          break;
        case 'f':
          if (document.fullscreenElement) {
            document.exitFullscreen();
          } else {
            document.documentElement.requestFullscreen();
          }
          break;
        default:
          break;
      }
    };

    window.addEventListener('keydown', handleKeyDown);
    return () => {
      window.removeEventListener('keydown', handleKeyDown);
    };
  }, [closeFullscreen, isFullscreen, toggleMute, togglePlayPause]);

  // Handle controls visibility
  useEffect(() => {
    if (!isFullscreen) return;

    const showControls = () => {
      setShowControls(true);
      if (controlsTimeoutRef.current) {
        clearTimeout(controlsTimeoutRef.current);
      }
      controlsTimeoutRef.current = setTimeout(() => {
        setShowControls(false);
      }, 3000);
    };

    showControls();
    window.addEventListener('mousemove', showControls);
    window.addEventListener('mousedown', showControls);

    return () => {
      window.removeEventListener('mousemove', showControls);
      window.removeEventListener('mousedown', showControls);
      if (controlsTimeoutRef.current) {
        clearTimeout(controlsTimeoutRef.current);
      }
    };
  }, [isFullscreen]);

  // Handle progress bar click
  const handleProgressBarClick = (e: React.MouseEvent<HTMLDivElement>) => {
    if (!fullscreenVideoRef.current) return;
    
    const rect = e.currentTarget.getBoundingClientRect();
    const pos = (e.clientX - rect.left) / rect.width;
    fullscreenVideoRef.current.currentTime = pos * fullscreenVideoRef.current.duration;
  };

  // Handle previous video
  const handlePreviousVideo = useCallback(() => {
    const prevIndex = (currentVideoIndex - 1 + videos.length) % videos.length;
    setCurrentVideoIndex(prevIndex);
    setCurrentVideo(videos[prevIndex]);
    
    if (fullscreenVideoRef.current) {
      fullscreenVideoRef.current.src = videos[prevIndex];
      fullscreenVideoRef.current.play().catch(console.error);
    }
  }, [currentVideoIndex, videos]);

  // Handle next video
  const handleNextVideo = useCallback(() => {
    const nextIndex = (currentVideoIndex + 1) % videos.length;
    setCurrentVideoIndex(nextIndex);
    setCurrentVideo(videos[nextIndex]);
    
    if (fullscreenVideoRef.current) {
      fullscreenVideoRef.current.src = videos[nextIndex];
      fullscreenVideoRef.current.play().catch(console.error);
    }
  }, [currentVideoIndex, videos]);

  return (
    <div className="relative w-full overflow-hidden bg-black py-12">
      <div className="container mx-auto px-4">
        <h2 className="mb-8 text-3xl font-bold text-white">Video Gallery</h2>
        
        {/* Video Grid with Horizontal Scrolling */}
        <div 
          ref={scrollContainerRef}
          className="flex items-center py-6 overflow-x-auto snap-x snap-mandatory touch-pan-x [&::-webkit-scrollbar]:hidden"
          onMouseEnter={handleMouseEnter}
          onMouseLeave={() => {
            // Call the original handleMouseLeave if it exists
            if (handleMouseLeave) handleMouseLeave();
            // Update cursor style
            const container = scrollContainerRef.current;
            if (container) container.style.cursor = 'grab';
          }}
          onScroll={handleScroll}
          style={{
            WebkitOverflowScrolling: 'touch',
            scrollSnapType: 'x mandatory',
            msOverflowStyle: 'none',
            scrollbarWidth: 'none',
            scrollBehavior: 'smooth',
            padding: '0 2rem', // Add padding for better scroll boundaries
            margin: '0 -2rem', // Compensate for padding
            cursor: 'grab',
          }}
          onMouseDown={() => {
            const container = scrollContainerRef.current;
            if (container) container.style.cursor = 'grabbing';
          }}
          onMouseUp={() => {
            const container = scrollContainerRef.current;
            if (container) container.style.cursor = 'grab';
          }}
        >
          {videos.map((video, index) => (
            <div
              key={`${video}-${index}`}
              className="group relative flex-shrink-0 w-28 sm:w-36 md:w-40 lg:w-48 mx-2 cursor-pointer overflow-hidden rounded-lg bg-gray-900 snap-center"
              style={{
                aspectRatio: '9/16',
                height: '280px',
                maxHeight: '400px',
                minHeight: '200px',
                scrollSnapAlign: 'center',
                scrollSnapStop: 'always',
                transition: 'transform 0.2s ease, box-shadow 0.2s ease',
              }}
              onMouseEnter={(e) => {
                const element = e.currentTarget;
                if (element) {
                  element.style.transform = 'scale(1.02)';
                  element.style.boxShadow = '0 10px 25px -5px rgba(0, 0, 0, 0.1), 0 10px 10px -5px rgba(0, 0, 0, 0.04)';
                }
                handleVideoHover(index, true);
              }}
              onMouseLeave={(e) => {
                const element = e.currentTarget;
                if (element) {
                  element.style.transform = 'scale(1)';
                  element.style.boxShadow = 'none';
                }
                handleVideoHover(index, false);
              }}
              onClick={() => openFullscreen(video, index % (videos.length / 2))}
            >
              <video
                ref={el => {
                  if (el) {
                    videoRefs.current[index] = el;
                    // Auto-play the video when mounted
                    el.play()
                      .then(() => setIsPlaying(true))
                      .catch(console.error);
                  }
                }}
                className="h-full w-full object-cover"
                src={video}
                muted
                loop
                playsInline
                onPlay={() => setIsPlaying(true)}
                onPause={() => setIsPlaying(false)}
                onLoadedData={handleVideoLoadedData}
              />
              
              {/* Hover Overlay */}
              <div className={`absolute inset-0 flex items-center justify-center bg-black bg-opacity-50 opacity-0 transition-opacity group-hover:opacity-100 ${
                isHovered === index ? 'opacity-100' : 'opacity-0'
              }`}>
                <div className="flex h-16 w-16 items-center justify-center rounded-full bg-white bg-opacity-20">
                  <Play className="h-8 w-8 text-white" />
                </div>
              </div>
              
              {/* Video Duration */}
              <div className="absolute bottom-2 right-2 rounded bg-black bg-opacity-70 px-2 py-1 text-xs text-white">
                {videoDurations[video] ? formatTime(videoDurations[video]) : '0:00'}
              </div>
            </div>
          ))}
        </div>
        
        {/* Scroll indicators */}
        <div className="flex justify-center mt-6 space-x-2">
          <button 
            onClick={() => {
              if (scrollContainerRef.current) {
                scrollContainerRef.current.scrollBy({ left: -300, behavior: 'smooth' });
              }
            }}
            className="p-2 rounded-full bg-gray-800 hover:bg-gray-700 transition-colors"
            aria-label="Scroll left"
          >
            <ChevronLeft className="h-6 w-6 text-white" />
          </button>
          <button 
            onClick={() => {
              if (scrollContainerRef.current) {
                scrollContainerRef.current.scrollBy({ left: 300, behavior: 'smooth' });
              }
            }}
            className="p-2 rounded-full bg-gray-800 hover:bg-gray-700 transition-colors"
            aria-label="Scroll right"
          >
            <ChevronRight className="h-6 w-6 text-white" />
          </button>
        </div>
      </div>

      {/* Fullscreen Modal */}
      <AnimatePresence>
        {isFullscreen && (
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            className="fixed inset-0 z-50 flex items-center justify-center bg-black bg-opacity-90"
            onClick={closeFullscreen}
          >
            <div 
              className="relative h-full w-full max-w-6xl"
              onClick={e => e.stopPropagation()}
            >
              {/* Video Container */}
              <div className="relative w-full h-full flex items-center justify-center bg-black">
                <video
                  ref={fullscreenVideoRef}
                  className="h-full max-h-[90vh] object-contain"
                  style={{
                    aspectRatio: '9/16',
                    maxWidth: 'calc(90vh * 9/16)'
                  }}
                  src={currentVideo}
                  autoPlay
                  muted={isMuted}
                  onClick={togglePlayPause}
                  onEnded={handleVideoEnd}
                  onTimeUpdate={handleTimeUpdate}
                  onLoadedMetadata={handleLoadedMetadata}
                />
                
                {/* Custom Controls Overlay */}
                <motion.div 
                  className="absolute bottom-0 left-0 right-0 bg-gradient-to-t from-black to-transparent p-4"
                  initial="hidden"
                  animate={showControls ? 'visible' : 'hidden'}
                  variants={{
                    visible: { opacity: 1, y: 0 },
                    hidden: { opacity: 0, y: 20 }
                  }}
                >
                  {/* Progress Bar */}
                  <div 
                    className="relative mb-4 h-1 w-full cursor-pointer bg-gray-700"
                    onClick={e => e.stopPropagation()}
                  >
                    <div 
                      className="absolute left-0 top-0 h-full bg-red-500"
                      style={{ width: `${(currentTime / duration) * 100}%` }}
                    />
                    <div 
                      className="absolute -top-1 h-3 w-3 -translate-x-1.5 rounded-full bg-red-500"
                      style={{ left: `${(currentTime / duration) * 100}%` }}
                    />
                  </div>
                  
                  {/* Controls */}
                  <div className="flex items-center justify-between">
                    <div className="flex items-center space-x-4">
                      <button 
                        onClick={(e) => {
                          e.stopPropagation();
                          togglePlayPause();
                        }}
                        className="text-white hover:text-gray-300"
                        aria-label={isPlaying ? 'Pause' : 'Play'}
                      >
                        {isPlaying ? <Pause size={24} /> : <Play size={24} />}
                      </button>
                      
                      <div className="flex items-center space-x-2">
                        <button 
                          onClick={(e) => {
                            e.stopPropagation();
                            toggleMute();
                          }}
                          className="text-white hover:text-gray-300"
                          aria-label={isMuted ? 'Unmute' : 'Mute'}
                        >
                          {isMuted ? <VolumeX size={20} /> : <Volume2 size={20} />}
                        </button>
                        <span className="text-sm text-white">
                          {formatTime(currentTime)} / {formatTime(duration)}
                        </span>
                      </div>
                    </div>
                    
                    <div className="flex items-center space-x-4">
                      <button 
                        onClick={(e) => {
                          e.stopPropagation();
                          if (document.fullscreenElement) {
                            document.exitFullscreen();
                          } else {
                            document.documentElement.requestFullscreen();
                          }
                        }}
                        className="text-white hover:text-gray-300"
                        aria-label="Toggle fullscreen"
                      >
                        <Maximize2 size={20} />
                      </button>
                      
                      <button 
                        onClick={closeFullscreen}
                        className="text-white hover:text-gray-300"
                        aria-label="Close"
                      >
                        <X size={24} />
                      </button>
                    </div>
                  </div>
                </motion.div>
                
                {/* Navigation Buttons */}
                <button 
                  className="absolute left-4 top-1/2 -translate-y-1/2 rounded-full bg-black bg-opacity-50 p-2 text-white hover:bg-opacity-75"
                  onClick={(e) => {
                    e.stopPropagation();
                    handlePreviousVideo();
                  }}
                  aria-label="Previous video"
                >
                  <ChevronLeft size={32} />
                </button>
                
                <button 
                  className="absolute right-4 top-1/2 -translate-y-1/2 rounded-full bg-black bg-opacity-50 p-2 text-white hover:bg-opacity-75"
                  onClick={(e) => {
                    e.stopPropagation();
                    handleNextVideo();
                  }}
                  aria-label="Next video"
                >
                  <ChevronRight size={32} />
                </button>
              </div>
            </div>
          </motion.div>
        )}
      </AnimatePresence>
    </div>
  );
};

export default VideoSection;
