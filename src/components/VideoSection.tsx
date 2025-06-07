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
  const handleVideoLoadedData = (e: React.SyntheticEvent<HTMLVideoElement>) => {
    const videoEl = e.target as HTMLVideoElement;
    videoDurations[video] = videoEl.duration || 0;
  };

  const formatTime = (time: number): string => {
    const minutes = Math.floor(time / 60);
    const seconds = Math.floor(time % 60);
    return `${minutes}:${seconds.toString().padStart(2, '0')}`;
  };

  return (
    <div
      key={`${video}-${index}`}
      className="group relative aspect-video flex-shrink-0 w-72 md:w-80 lg:w-96 mx-2 cursor-pointer overflow-hidden rounded-xl bg-gray-900 transition-all duration-300 hover:scale-105"
      onMouseEnter={() => handleVideoHover(index, true)}
      onMouseLeave={() => handleVideoHover(index, false)}
      onClick={() => openFullscreen(video, index % (totalVideos / 2))}
    >
      <video
        ref={el => videoRefs.current[index] = el}
        className="h-full w-full object-cover"
        src={video}
        muted
        loop
        playsInline
        onLoadedData={handleVideoLoadedData}
      />
      
      {/* Hover Overlay */}
      <div className={`absolute inset-0 flex items-center justify-center bg-black bg-opacity-50 transition-opacity duration-300 ${
        isHovered ? 'opacity-100' : 'opacity-0'
      }`}>
        <div className="flex h-16 w-16 items-center justify-center rounded-full bg-white bg-opacity-20 transform transition-transform group-hover:scale-110">
          <Play className="h-8 w-8 text-white" />
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
        video.play().catch(console.error);
      }
    } else {
      setIsHovered(null);
      const video = videoRefs.current[index];
      if (video) {
        video.pause();
        video.currentTime = 0;
      }
    }
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
  
  // Auto-scroll effect
  useEffect(() => {
    if (!scrollContainerRef.current || !isScrolling) return;
    
    const scrollContainer = scrollContainerRef.current;
    const scrollWidth = scrollContainer.scrollWidth / 2; // Since we duplicated the videos
    let lastTimestamp = 0;
    
    const scrollStep = (timestamp: number) => {
      if (!lastTimestamp) lastTimestamp = timestamp;
      const deltaTime = timestamp - lastTimestamp;
      lastTimestamp = timestamp;
      
      // Calculate new scroll position
      const newPosition = scrollContainer.scrollLeft + (scrollSpeed * deltaTime / 16);
      
      // Check if we've scrolled to the end or beginning
      if (newPosition >= scrollWidth) {
        scrollContainer.scrollLeft = newPosition - scrollWidth;
      } else {
        scrollContainer.scrollLeft = newPosition;
      }
      
      scrollAnimationRef.current = requestAnimationFrame(scrollStep);
    };
    
    // Start scrolling
    scrollAnimationRef.current = requestAnimationFrame(scrollStep);
    
    // Cleanup
    return () => {
      if (scrollAnimationRef.current) {
        cancelAnimationFrame(scrollAnimationRef.current);
      }
    };
  }, [isScrolling, scrollSpeed]);

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
          className="flex space-x-6 py-4 overflow-x-auto scroll-smooth"
          onMouseEnter={handleMouseEnter}
          onMouseLeave={handleMouseLeave}
          onScroll={handleScroll}
          style={{
            ...scrollbarHide,
            WebkitOverflowScrolling: 'touch',
          }}
        >
          {videos.map((video, index) => (
            <div
              key={`${video}-${index}`}
              className="group relative aspect-video flex-shrink-0 w-64 md:w-80 lg:w-96 cursor-pointer overflow-hidden rounded-lg bg-gray-900"
              onMouseEnter={() => handleVideoHover(index, true)}
              onMouseLeave={() => handleVideoHover(index, false)}
              onClick={() => openFullscreen(video, index % (videos.length / 2))}
            >
              <video
                ref={el => videoRefs.current[index] = el}
                className="h-full w-full object-cover"
                src={video}
                muted
                loop
                playsInline
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
              <div className="relative h-full w-full">
                <video
                  ref={fullscreenVideoRef}
                  className="h-full w-full"
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
