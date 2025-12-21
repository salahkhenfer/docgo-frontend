import {
  ChevronLeft,
  ChevronRight,
  FileText,
  Pause,
  Play,
  X,
} from "lucide-react";
import { useCallback, useEffect, useRef, useState } from "react";
import { useTranslation } from "react-i18next";
import { FaCheckCircle, FaLock } from "react-icons/fa";
import { useNavigate, useParams } from "react-router-dom";
import { EnrollmentAPI } from "../API/Enrollment";
import { useAppContext } from "../AppContext";
import { useCourse } from "../hooks/useCourse";
import MainLoading from "../MainLoading";
import { courseService } from "../services/courseService";
import Certificate from "./Certificate";
import CourseResources from "./CourseResources";
import QuizContent from "./QuizContent";

export function CourseVideos() {
  const { t } = useTranslation();
  const { courseId } = useParams();
  const navigate = useNavigate();
  const { user } = useAppContext();

  // Video player states
  const videoRef = useRef(null);
  const [isPlaying, setPlaying] = useState(false);
  const [currentTime, setCurrentTime] = useState(0);
  const [duration, setDuration] = useState(0);
  const [currentVideoIndex, setCurrentVideoIndex] = useState(0);
  const [sidebarOpen, setSidebarOpen] = useState(false);
  const [showQuiz, setShowQuiz] = useState(false);
  const [showResources, setShowResources] = useState(false);
  const [showCertificate, setShowCertificate] = useState(false);

  // Progress tracking
  const [completedVideos, setCompletedVideos] = useState(new Set());
  const [videoProgress, setVideoProgress] = useState({});
  const [isSyncing, setIsSyncing] = useState(false);
  const [lastSyncTime, setLastSyncTime] = useState(null);

  // Certificate unlock state - MUST be declared before any conditional logic
  const [isCertificateUnlocked, setIsCertificateUnlocked] = useState(false);

  const { courseData, loading, error, hasError, isEnrolled, hasData } =
    useCourse(courseId);

  // Load progress from backend and localStorage
  useEffect(() => {
    const loadProgress = async () => {
      try {
        // Try to load from backend first
        const response = await EnrollmentAPI.getCourseProgress(courseId);
        if (response.success && response.data) {
          const backendProgress = response.data;
          const completed = new Set(backendProgress.completedVideos || []);
          const videoProgs = backendProgress.videoProgress || {};

          setCompletedVideos(completed);
          setVideoProgress(videoProgs);
          setLastSyncTime(backendProgress.lastUpdated);

          // Also save to localStorage as backup
          localStorage.setItem(
            `course_${courseId}_progress`,
            JSON.stringify({
              completed: Array.from(completed),
              videoProgress: videoProgs,
              lastUpdated:
                backendProgress.lastUpdated || new Date().toISOString(),
            })
          );
        } else {
          // Fallback to localStorage if backend fails
          const savedProgress = localStorage.getItem(
            `course_${courseId}_progress`
          );
          if (savedProgress) {
            const progress = JSON.parse(savedProgress);
            setCompletedVideos(new Set(progress.completed || []));
            setVideoProgress(progress.videoProgress || {});
          }
        }
      } catch (error) {
        // Note: 404 errors are normal for first-time course visits
        if (error.response?.status !== 404) {
          console.warn("Error loading progress from backend:", error.message);
        }
        // Fallback to localStorage
        const savedProgress = localStorage.getItem(
          `course_${courseId}_progress`
        );
        if (savedProgress) {
          const progress = JSON.parse(savedProgress);
          setCompletedVideos(new Set(progress.completed || []));
          setVideoProgress(progress.videoProgress || {});
        }
      }
    };

    loadProgress();
  }, [courseId]);

  // Load certificate unlock status - check both quiz completion and score
  useEffect(() => {
    const quizCompleted = localStorage.getItem(
      `course_${courseId}_quiz_completed`
    );
    const quizScore = localStorage.getItem(`course_${courseId}_quiz_score`);

    // Certificate is unlocked only if quiz is passed (localStorage value is 'true')
    if (quizCompleted === "true") {
      setIsCertificateUnlocked(true);
    } else {
      setIsCertificateUnlocked(false);
    }

    // Also listen for storage changes (when quiz is completed in the same tab)
    const handleStorageChange = () => {
      const completed = localStorage.getItem(
        `course_${courseId}_quiz_completed`
      );
      if (completed === "true") {
        setIsCertificateUnlocked(true);
      } else {
        setIsCertificateUnlocked(false);
      }
    };

    window.addEventListener("storage", handleStorageChange);

    // Check immediately
    handleStorageChange();

    return () => window.removeEventListener("storage", handleStorageChange);
  }, [courseId]);

  // Redirect if not enrolled
  useEffect(() => {
    if (hasData && !isEnrolled) {
      navigate(`/Courses/${courseId}`);
    }
  }, [hasData, isEnrolled, courseId, navigate]);

  // Save progress to localStorage and backend
  const saveProgress = useCallback(
    async (completed, progress, totalVideos = 0) => {
      const progressData = {
        completed: Array.from(completed),
        videoProgress: progress,
        lastUpdated: new Date().toISOString(),
      };

      // Save to localStorage immediately
      localStorage.setItem(
        `course_${courseId}_progress`,
        JSON.stringify(progressData)
      );

      // Sync to backend
      try {
        setIsSyncing(true);
        const response = await EnrollmentAPI.updateCourseProgress(courseId, {
          completedVideos: Array.from(completed),
          videoProgress: progress,
          totalVideos: totalVideos,
          overallProgress: Math.round(
            (completed.size / (totalVideos || 1)) * 100
          ),
        });

        if (response.success) {
          setLastSyncTime(new Date().toISOString());
        }
      } catch (error) {
        console.error("Error syncing progress to backend:", error);
      } finally {
        setIsSyncing(false);
      }
    },
    [courseId]
  );

  if (loading) return <MainLoading />;

  if (hasError || !courseData) {
    return (
      <div className="min-h-screen bg-gray-50 flex items-center justify-center">
        <div className="text-center">
          <p className="text-red-600 mb-4">
            {error || t("Error loading course")}
          </p>
          <button
            onClick={() => navigate(`/Courses/${courseId}`)}
            className="text-blue-600 hover:underline"
          >
            {t("Go back to course")}
          </button>
        </div>
      </div>
    );
  }

  const { course } = courseData;
  const videos = course.videos || [];
  const currentVideo = videos[currentVideoIndex];

  // Fix: Quiz data is an array, check if it has items
  const hasQuiz = Array.isArray(course.quiz) && course.quiz.length > 0;

  // Debug: Log quiz availability
  console.log("Course quiz data:", course.quiz);
  console.log("Has quiz:", hasQuiz);
  console.log("Course resources:", course.resources);
  console.log(
    "Has resources:",
    course.resources && course.resources.length > 0
  );

  // Debounced function to update video progress to backend
  const updateVideoProgressDebounced = (() => {
    let timeoutId;
    return (videoId, progressPercent, isCompleted) => {
      clearTimeout(timeoutId);
      timeoutId = setTimeout(async () => {
        try {
          await courseService.updateVideoProgress({
            courseId,
            videoId,
            progress: progressPercent,
            completed: isCompleted,
            timestamp: new Date().toISOString(),
          });
        } catch (error) {
          console.error("Error updating video progress:", error);
        }
      }, 2000); // Send update 2 seconds after last change
    };
  })();

  // Video player handlers
  const handlePlay = () => {
    if (videoRef.current) {
      videoRef.current.play();
      setPlaying(true);
    }
  };

  const handlePause = () => {
    if (videoRef.current) {
      videoRef.current.pause();
      setPlaying(false);
    }
  };

  const handleToggle = () => {
    isPlaying ? handlePause() : handlePlay();
  };

  // Time formatting
  function formatTime(seconds) {
    if (isNaN(seconds)) return "0:00";
    const minutes = Math.floor(seconds / 60);
    const secs = Math.floor(seconds % 60);
    return `${minutes}:${secs < 10 ? "0" : ""}${secs}`;
  }

  // Handle video time updates
  const handleTimeUpdate = (e) => {
    const current = e.target.currentTime;
    const total = e.target.duration;
    setCurrentTime(current);

    // Track progress percentage for current video
    if (total > 0) {
      const progressPercent = (current / total) * 100;
      const videoId = videos[currentVideoIndex]?.id || currentVideoIndex;

      setVideoProgress((prev) => ({
        ...prev,
        [videoId]: progressPercent,
      }));

      // Send debounced progress update to backend
      const isCompleted = progressPercent >= 90;
      updateVideoProgressDebounced(videoId, progressPercent, isCompleted);

      // Mark as completed if watched 90% or more
      if (progressPercent >= 90 && !completedVideos.has(videoId)) {
        const newCompleted = new Set(completedVideos);
        newCompleted.add(videoId);
        setCompletedVideos(newCompleted);
        saveProgress(
          newCompleted,
          {
            ...videoProgress,
            [videoId]: progressPercent,
          },
          videos.length
        );
      }
    }
  };

  const handleLoadedMetadata = (e) => {
    setDuration(e.target.duration);
  };

  // Handle timeline scrubbing
  const handleSeek = (e) => {
    const time = parseFloat(e.target.value);
    if (videoRef.current && !isNaN(time)) {
      videoRef.current.currentTime = time;
      setCurrentTime(time);
    }
  };

  // Get video URL with API base
  const getVideoUrl = (video) => {
    if (!video) {
      console.warn("No video object provided");
      return null;
    }

    const videoPath =
      video.videoUrl ||
      video.video_url ||
      video.url ||
      video.VideoUrl ||
      video.path ||
      video.videoPath ||
      video.Video ||
      video.video;

    if (!videoPath) {
      console.warn("No video path found in video object:", video);
      return null;
    }

    if (videoPath.startsWith("http")) return videoPath;

    const fullUrl = import.meta.env.VITE_API_URL + videoPath;
    console.log("Video URL:", fullUrl);
    return fullUrl;
  };

  // Handle video selection
  const handleVideoSelect = (index) => {
    setCurrentVideoIndex(index);
    setCurrentTime(0);
    setSidebarOpen(false);
    setShowQuiz(false);
    setShowResources(false);
    setShowCertificate(false);
    if (videoRef.current) {
      videoRef.current.currentTime = 0;
    }
  };

  // Handle previous video
  const handlePrevious = () => {
    if (currentVideoIndex > 0) {
      handleVideoSelect(currentVideoIndex - 1);
    }
  };

  // Handle next video
  const handleNext = () => {
    if (currentVideoIndex < videos.length - 1) {
      handleVideoSelect(currentVideoIndex + 1);
    }
  };

  // Handle video ended - auto play next
  const handleVideoEnded = () => {
    const videoId = videos[currentVideoIndex]?.id || currentVideoIndex;

    // Mark as completed
    const newCompleted = new Set(completedVideos);
    newCompleted.add(videoId);
    setCompletedVideos(newCompleted);
    saveProgress(newCompleted, videoProgress, videos.length);

    // Auto play next video
    if (currentVideoIndex < videos.length - 1) {
      handleVideoSelect(currentVideoIndex + 1);
    }
  };

  // Check if all videos are completed
  const allVideosCompleted =
    videos.length > 0 && completedVideos.size >= videos.length;

  // Check if quiz is unlocked - unlock when all videos completed
  const isQuizUnlocked = allVideosCompleted;

  const toggleSidebar = () => {
    setSidebarOpen(!sidebarOpen);
  };

  if (!currentVideo) {
    return (
      <div className="min-h-screen bg-gray-50 flex items-center justify-center">
        <div className="text-center">
          <p className="text-gray-600">{t("No videos available")}</p>
          <button
            onClick={() => navigate(`/Courses/${courseId}`)}
            className="mt-4 text-blue-600 hover:underline"
          >
            {t("Go back to course")}
          </button>
        </div>
      </div>
    );
  }

  return (
    <div className="flex w-full flex-col bg-gradient-to-br from-gray-50 to-blue-50 min-h-screen">
      {/* Mobile Header with Sidebar Toggle */}
      <div className="md:hidden bg-white border-b border-gray-200 px-4 py-3 sticky top-0 z-20 shadow-sm">
        <div className="flex items-center justify-between">
          <button
            onClick={() => navigate(`/Courses/${courseId}`)}
            className="flex items-center text-gray-600 hover:text-blue-600 transition-colors"
          >
            <ChevronLeft className="w-5 h-5 mr-1" />
            {t("Back")}
          </button>
          <h1 className="text-lg font-semibold text-gray-800 truncate mx-4">
            {course.Title}
          </h1>
          <button
            onClick={toggleSidebar}
            className="p-2 rounded-lg text-gray-600 hover:text-blue-600 hover:bg-blue-50 transition-all"
            aria-label="Toggle course menu"
          >
            <svg
              className="w-6 h-6"
              fill="none"
              stroke="currentColor"
              viewBox="0 0 24 24"
            >
              {sidebarOpen ? (
                <path
                  strokeLinecap="round"
                  strokeLinejoin="round"
                  strokeWidth={2}
                  d="M6 18L18 6M6 6l12 12"
                />
              ) : (
                <path
                  strokeLinecap="round"
                  strokeLinejoin="round"
                  strokeWidth={2}
                  d="M4 6h16M4 12h16M4 18h16"
                />
              )}
            </svg>
          </button>
        </div>
      </div>

      {/* Mobile Sidebar Overlay */}
      {sidebarOpen && (
        <div
          className="md:hidden fixed inset-0 bg-black bg-opacity-50 z-30"
          onClick={toggleSidebar}
        />
      )}

      {/* Main Content Container */}
      <div className="flex-1 w-full max-w-[1360px] mx-auto px-4">
        <div className="flex gap-0 h-full">
          {/* Sidebar - Desktop */}
          <aside className="hidden md:block md:w-80 lg:w-96 flex-shrink-0">
            <div className="flex flex-col items-start pr-6 pl-8 border-r border-gray-200 min-h-screen bg-white shadow-sm">
              <button
                onClick={() => navigate(`/Courses/${courseId}`)}
                className="mt-6 mb-4 flex items-center text-gray-600 hover:text-blue-600 transition-all group"
              >
                <ChevronLeft className="w-5 h-5 mr-1 group-hover:-translate-x-1 transition-transform" />
                {t("Back to course")}
              </button>

              <h1 className="text-2xl font-bold leading-9 bg-gradient-to-r from-blue-600 to-purple-600 bg-clip-text text-transparent mb-6">
                {course.Title}
              </h1>

              {/* Progress Indicator */}
              <div className="mb-8 p-5 bg-gradient-to-br from-blue-50 to-indigo-50 rounded-2xl border border-blue-100 shadow-sm w-full">
                <div className="flex items-center justify-between mb-3">
                  <span className="text-sm font-semibold text-gray-700">
                    {t("Progress")}
                  </span>
                  <div className="flex items-center gap-2">
                    <span className="text-lg font-bold text-blue-600">
                      {Math.round((completedVideos.size / videos.length) * 100)}
                      %
                    </span>
                    {isSyncing && (
                      <div className="animate-spin rounded-full h-4 w-4 border-2 border-blue-600 border-t-transparent"></div>
                    )}
                  </div>
                </div>
                <div className="w-full bg-gray-200 rounded-full h-3 overflow-hidden shadow-inner">
                  <div
                    className="bg-gradient-to-r from-blue-500 to-purple-600 h-3 rounded-full transition-all duration-500 shadow-sm"
                    style={{
                      width: `${(completedVideos.size / videos.length) * 100}%`,
                    }}
                  />
                </div>
                <div className="flex items-center justify-between mt-3">
                  <p className="text-xs text-gray-600 flex items-center gap-2">
                    <FaCheckCircle className="text-green-500" />
                    {completedVideos.size} / {videos.length}{" "}
                    {t("videos completed")}
                  </p>
                  {lastSyncTime && !isSyncing && (
                    <p className="text-xs text-gray-500 flex items-center gap-1">
                      <svg
                        className="w-3 h-3 text-green-500"
                        fill="currentColor"
                        viewBox="0 0 20 20"
                      >
                        <path
                          fillRule="evenodd"
                          d="M16.707 5.293a1 1 0 010 1.414l-8 8a1 1 0 01-1.414 0l-4-4a1 1 0 011.414-1.414L8 12.586l7.293-7.293a1 1 0 011.414 0z"
                          clipRule="evenodd"
                        />
                      </svg>
                      {t("Synced") || "Synced"}
                    </p>
                  )}
                </div>
              </div>

              {/* Video List Navigation */}
              <section className="w-full mb-8">
                <h2 className="text-xl font-bold text-gray-800 mb-4 flex items-center gap-2">
                  <Play className="w-5 h-5 text-blue-600" />
                  {t("Course Content")}
                </h2>
                <nav className="space-y-2">
                  {videos.map((video, index) => {
                    const isActive = index === currentVideoIndex;
                    const videoId = video.id || index;
                    const isCompleted = completedVideos.has(videoId);
                    const progress = videoProgress[videoId] || 0;
                    const hasProgress = progress > 0 && progress < 90;

                    return (
                      <div key={video.id || index} className="relative">
                        <button
                          onClick={() => handleVideoSelect(index)}
                          className={`flex gap-3 items-center p-4 w-full rounded-xl border-2 transition-all duration-200 text-left group ${
                            isCompleted
                              ? "border-green-500 bg-green-50 hover:bg-green-100 hover:shadow-md"
                              : isActive
                              ? "border-blue-500 bg-gradient-to-r from-blue-50 to-indigo-50 shadow-md"
                              : "border-gray-200 bg-white hover:border-blue-300 hover:shadow-sm"
                          }`}
                        >
                          {/* Icon */}
                          <div
                            className={`flex-shrink-0 ${
                              isCompleted ? "animate-pulse" : ""
                            }`}
                          >
                            {isCompleted ? (
                              <FaCheckCircle className="w-6 h-6 text-green-600" />
                            ) : (
                              <div
                                className={`w-6 h-6 rounded-full border-2 flex items-center justify-center ${
                                  isActive
                                    ? "border-blue-600 bg-blue-100"
                                    : "border-gray-300"
                                }`}
                              >
                                <span
                                  className={`text-xs font-semibold ${
                                    isActive ? "text-blue-600" : "text-gray-500"
                                  }`}
                                >
                                  {index + 1}
                                </span>
                              </div>
                            )}
                          </div>

                          {/* Title and Progress */}
                          <div className="flex-1">
                            <span
                              className={`font-medium block ${
                                isCompleted
                                  ? "text-green-700"
                                  : isActive
                                  ? "text-blue-700"
                                  : "text-gray-700 group-hover:text-blue-600"
                              }`}
                            >
                              {video.title}
                            </span>

                            {/* Progress bar for partially watched videos */}
                            {hasProgress && !isCompleted && (
                              <div className="mt-2 w-full bg-gray-200 rounded-full h-1.5 overflow-hidden">
                                <div
                                  className="bg-blue-500 h-1.5 rounded-full transition-all duration-300"
                                  style={{ width: `${progress}%` }}
                                />
                              </div>
                            )}
                          </div>

                          {/* Status Icon */}
                          {isActive ? (
                            <Play className="w-4 h-4 text-blue-600 animate-pulse flex-shrink-0" />
                          ) : (
                            !isCompleted && (
                              <ChevronRight className="w-4 h-4 text-gray-400 group-hover:text-blue-600 group-hover:translate-x-1 transition-transform flex-shrink-0" />
                            )
                          )}
                        </button>
                      </div>
                    );
                  })}
                </nav>
              </section>

              {/* Quiz and Certificate Section */}
              <section className="w-full space-y-3">
                {/* Resources Button - Always show */}
                <button
                  onClick={() => {
                    setShowResources(true);
                    setShowQuiz(false);
                    setShowCertificate(false);
                  }}
                  className="w-full p-4 rounded-xl border-2 border-orange-200 bg-gradient-to-r from-orange-50 to-red-50 hover:border-orange-300 hover:shadow-md transition-all"
                >
                  <div className="flex items-center gap-3">
                    <FileText className="w-5 h-5 text-orange-600" />
                    <div className="flex-1 text-left">
                      <span className="font-semibold text-orange-700 block">
                        {t("Resources")}
                      </span>
                    </div>
                    <ChevronRight className="w-4 h-4 text-orange-600" />
                  </div>
                </button>

                {/* Show quiz section only if course has quiz */}
                {hasQuiz && (
                  <div
                    className={`p-4 rounded-xl border-2 transition-all ${
                      isQuizUnlocked
                        ? "border-green-500 bg-gradient-to-r from-green-50 to-emerald-50 hover:shadow-md"
                        : "border-gray-200 bg-gray-50"
                    }`}
                  >
                    {isQuizUnlocked ? (
                      <button
                        onClick={() => {
                          setShowQuiz(true);
                          setShowResources(false);
                          setShowCertificate(false);
                          setSidebarOpen(false);
                        }}
                        className="w-full flex items-center gap-3 text-green-700 hover:text-green-800 font-semibold"
                      >
                        <FaCheckCircle className="w-5 h-5 text-green-600 animate-bounce" />
                        <span className="flex-1">{t("Quiz unlocked")}</span>
                        <ChevronRight className="w-4 h-4" />
                      </button>
                    ) : (
                      <div className="flex items-center gap-3 text-gray-400">
                        <FaLock className="w-5 h-5" />
                        <span className="flex-1 text-sm">
                          {t("Quiz (locked)")}
                        </span>
                      </div>
                    )}
                  </div>
                )}

                <div
                  className={`p-4 rounded-xl border-2 transition-all ${
                    isCertificateUnlocked
                      ? "border-purple-500 bg-gradient-to-r from-purple-50 to-pink-50 hover:shadow-md"
                      : "border-gray-200 bg-gray-50"
                  }`}
                >
                  {isCertificateUnlocked ? (
                    <button
                      onClick={() => {
                        setShowCertificate(true);
                        setShowQuiz(false);
                        setShowResources(false);
                      }}
                      className="w-full flex items-center gap-3 text-purple-700 hover:text-purple-800 font-semibold"
                    >
                      <FaCheckCircle className="w-5 h-5 text-purple-600 animate-bounce" />
                      <span className="flex-1">{t("Certificate")}</span>
                      <ChevronRight className="w-4 h-4" />
                    </button>
                  ) : (
                    <div className="flex items-center gap-3 text-gray-400">
                      <FaLock className="w-5 h-5" />
                      <span className="flex-1 text-sm">
                        {t("Certificate (locked)")}
                      </span>
                    </div>
                  )}
                </div>
              </section>
            </div>
          </aside>

          {/* Mobile Sidebar */}
          <div
            className={`md:hidden fixed top-0 left-0 h-full w-full bg-white shadow-xl transform transition-transform duration-300 ease-in-out z-40 ${
              sidebarOpen ? "translate-x-0" : "-translate-x-full"
            }`}
          >
            <div className="h-full overflow-y-auto pt-16 px-6">
              <button
                onClick={toggleSidebar}
                className="absolute top-4 right-4 p-2 rounded-md text-gray-600 hover:text-gray-800 hover:bg-gray-100 transition-colors"
              >
                <svg
                  className="w-6 h-6"
                  fill="none"
                  stroke="currentColor"
                  viewBox="0 0 24 24"
                >
                  <path
                    strokeLinecap="round"
                    strokeLinejoin="round"
                    strokeWidth={2}
                    d="M6 18L18 6M6 6l12 12"
                  />
                </svg>
              </button>

              <h2 className="text-xl font-bold text-gray-800 mb-6 flex items-center gap-2">
                <Play className="w-5 h-5 text-blue-600" />
                {t("Course Content")}
              </h2>

              <nav className="space-y-4">
                {videos.map((video, index) => {
                  const isActive = index === currentVideoIndex;
                  const videoId = video.id || index;
                  const isCompleted = completedVideos.has(videoId);
                  const progress = videoProgress[videoId] || 0;
                  const hasProgress = progress > 0 && progress < 90;

                  return (
                    <div key={video.id || index} className="relative">
                      <button
                        onClick={() => handleVideoSelect(index)}
                        className={`flex gap-4 items-center p-4 w-full rounded-xl border-2 transition-all duration-200 text-left group ${
                          isCompleted
                            ? "border-green-500 bg-green-50 hover:bg-green-100 hover:shadow-md"
                            : isActive
                            ? "border-blue-500 bg-gradient-to-r from-blue-50 to-indigo-50 shadow-md"
                            : "border-gray-200 bg-white hover:border-blue-300 hover:shadow-sm"
                        }`}
                      >
                        {/* Icon */}
                        <div
                          className={`flex-shrink-0 ${
                            isCompleted ? "animate-pulse" : ""
                          }`}
                        >
                          {isCompleted ? (
                            <FaCheckCircle className="w-6 h-6 text-green-600" />
                          ) : (
                            <div
                              className={`w-6 h-6 rounded-full border-2 flex items-center justify-center ${
                                isActive
                                  ? "border-blue-600 bg-blue-100"
                                  : "border-gray-300"
                              }`}
                            >
                              <span
                                className={`text-xs font-semibold ${
                                  isActive ? "text-blue-600" : "text-gray-500"
                                }`}
                              >
                                {index + 1}
                              </span>
                            </div>
                          )}
                        </div>

                        {/* Title and Progress */}
                        <div className="flex-1">
                          <span
                            className={`font-medium block ${
                              isCompleted
                                ? "text-green-700"
                                : isActive
                                ? "text-blue-700"
                                : "text-gray-700 group-hover:text-blue-600"
                            }`}
                          >
                            {video.title}
                          </span>

                          {/* Progress bar for partially watched videos */}
                          {hasProgress && !isCompleted && (
                            <div className="mt-2 w-full bg-gray-200 rounded-full h-1.5 overflow-hidden">
                              <div
                                className="bg-blue-500 h-1.5 rounded-full transition-all duration-300"
                                style={{ width: `${progress}%` }}
                              />
                            </div>
                          )}
                        </div>

                        {/* Status Icon */}
                        {isActive ? (
                          <Play className="w-4 h-4 text-blue-600 animate-pulse flex-shrink-0" />
                        ) : (
                          !isCompleted && (
                            <ChevronRight className="w-4 h-4 text-gray-400 group-hover:text-blue-600 group-hover:translate-x-1 transition-transform flex-shrink-0" />
                          )
                        )}
                      </button>
                    </div>
                  );
                })}
              </nav>

              {/* Quiz and Certificate - Mobile */}
              <div className="mt-8 space-y-4">
                {/* Resources Button - Mobile - Always show */}
                <button
                  onClick={() => {
                    setShowResources(true);
                    setShowQuiz(false);
                    setShowCertificate(false);
                    setSidebarOpen(false);
                  }}
                  className="w-full p-4 rounded-xl border-2 border-orange-200 bg-gradient-to-r from-orange-50 to-red-50 hover:border-orange-300 transition-all"
                >
                  <div className="flex items-center gap-3">
                    <FileText className="w-5 h-5 text-orange-600" />
                    <div className="flex-1 text-left">
                      <span className="font-semibold text-orange-700 block">
                        {t("Resources")}
                      </span>
                    </div>
                    <ChevronRight className="w-4 h-4 text-orange-600" />
                  </div>
                </button>

                {/* Show quiz section only if course has quiz */}
                {hasQuiz && (
                  <div
                    className={`p-4 rounded-xl border-2 transition-all ${
                      isQuizUnlocked
                        ? "border-green-500 bg-gradient-to-r from-green-50 to-emerald-50"
                        : "border-gray-200 bg-gray-50"
                    }`}
                  >
                    {isQuizUnlocked ? (
                      <button
                        onClick={() => {
                          setShowQuiz(true);
                          setShowResources(false);
                          setShowCertificate(false);
                          setSidebarOpen(false);
                        }}
                        className="w-full flex items-center gap-3 text-green-700 font-semibold"
                      >
                        <FaCheckCircle className="w-5 h-5 text-green-600 animate-bounce" />
                        <span className="flex-1">{t("Quiz unlocked")}</span>
                        <ChevronRight className="w-4 h-4" />
                      </button>
                    ) : (
                      <div className="flex items-center gap-3 text-gray-400">
                        <FaLock className="w-5 h-5" />
                        <span className="flex-1 text-sm">
                          {t("Quiz (locked)")}
                        </span>
                      </div>
                    )}
                  </div>
                )}

                <div
                  className={`p-4 rounded-xl border-2 transition-all ${
                    isCertificateUnlocked
                      ? "border-purple-500 bg-gradient-to-r from-purple-50 to-pink-50"
                      : "border-gray-200 bg-gray-50"
                  }`}
                >
                  {isCertificateUnlocked ? (
                    <button
                      onClick={() => {
                        setShowCertificate(true);
                        setShowQuiz(false);
                        setShowResources(false);
                        setSidebarOpen(false);
                      }}
                      className="w-full flex items-center gap-3 text-purple-700 font-semibold"
                    >
                      <FaCheckCircle className="w-5 h-5 text-purple-600 animate-bounce" />
                      <span className="flex-1">{t("Certificate")}</span>
                      <ChevronRight className="w-4 h-4" />
                    </button>
                  ) : (
                    <div className="flex items-center gap-3 text-gray-400">
                      <FaLock className="w-5 h-5" />
                      <span className="flex-1 text-sm">
                        {t("Certificate (locked)")}
                      </span>
                    </div>
                  )}
                </div>
              </div>
            </div>
          </div>

          {/* Main Video Content */}
          <main className="flex-1 min-w-0 ml-5 w-[72%] max-md:ml-0 max-md:w-full">
            {showCertificate ? (
              <div className="flex flex-col w-full max-md:mt-8 max-md:max-w-full">
                {/* Certificate Header with Back Button */}
                <div className="flex items-center justify-between mb-6">
                  <h1 className="text-2xl font-semibold text-zinc-800">
                    {t("Course Certificate")}
                  </h1>
                  <button
                    onClick={() => setShowCertificate(false)}
                    className="flex items-center gap-2 px-4 py-2 text-gray-700 bg-gray-100 hover:bg-gray-200 rounded-lg transition-colors"
                  >
                    <X className="w-4 h-4" />
                    <span>{t("Back to Videos")}</span>
                  </button>
                </div>

                {/* Certificate Content */}
                <div className="overflow-hidden w-full">
                  <Certificate />
                </div>
              </div>
            ) : showResources ? (
              <div className="flex flex-col w-full max-md:mt-8 max-md:max-w-full">
                {/* Resources Header with Back Button */}
                <div className="flex items-center justify-between mb-6">
                  <h1 className="text-2xl font-semibold text-zinc-800">
                    {t("Course Resources")}
                  </h1>
                  <button
                    onClick={() => setShowResources(false)}
                    className="flex items-center gap-2 px-4 py-2 text-gray-700 bg-gray-100 hover:bg-gray-200 rounded-lg transition-colors"
                  >
                    <X className="w-4 h-4" />
                    <span>{t("Back to Videos")}</span>
                  </button>
                </div>

                {/* Resources Content */}
                <div className="overflow-hidden w-full">
                  <CourseResources />
                </div>
              </div>
            ) : showQuiz ? (
              <div className="flex flex-col w-full max-md:mt-8 max-md:max-w-full">
                {/* Quiz Header with Back Button */}
                <div className="flex items-center justify-between mb-6">
                  <h1 className="text-2xl font-semibold text-zinc-800">
                    {t("Course Quiz")}
                  </h1>
                  <button
                    onClick={() => setShowQuiz(false)}
                    className="flex items-center gap-2 px-4 py-2 text-gray-700 bg-gray-100 hover:bg-gray-200 rounded-lg transition-colors"
                  >
                    <X className="w-4 h-4" />
                    <span>{t("Back to Videos")}</span>
                  </button>
                </div>

                {/* Quiz Content */}
                <div className="overflow-hidden w-full">
                  <QuizContent quizData={course.quiz} />
                </div>
              </div>
            ) : (
              <div className="flex flex-col w-full max-md:mt-8 max-md:max-w-full">
                <section>
                  <header>
                    <h1 className="text-2xl font-semibold text-zinc-800">
                      {currentVideo.title}
                    </h1>
                    {currentVideo.description && (
                      <p className="mt-2 text-base leading-relaxed text-neutral-600">
                        {currentVideo.description}
                      </p>
                    )}
                  </header>

                  {/* Video Player */}
                  <div className="py-6">
                    <div className="relative mx-auto mt-6 w-full max-w-[860px] overflow-hidden rounded-2xl bg-black shadow-2xl transition duration-300 hover:shadow-3xl border border-gray-200">
                      {getVideoUrl(currentVideo) ? (
                        <>
                          <video
                            className="w-full aspect-video object-contain"
                            ref={videoRef}
                            src={getVideoUrl(currentVideo)}
                            onTimeUpdate={handleTimeUpdate}
                            onLoadedMetadata={handleLoadedMetadata}
                            onPlay={() => setPlaying(true)}
                            onPause={() => setPlaying(false)}
                            onEnded={handleVideoEnded}
                            onError={(e) => {
                              console.error("Video error:", e);
                              console.error(
                                "Video source:",
                                getVideoUrl(currentVideo)
                              );
                              console.error(
                                "Current video object:",
                                currentVideo
                              );
                            }}
                          />

                          {/* Play/Pause Button Overlay */}
                          <div
                            role="button"
                            onClick={handleToggle}
                            className="absolute inset-0 flex items-center justify-center cursor-pointer bg-gradient-to-t from-black/40 via-transparent to-transparent transition-opacity hover:from-black/50"
                          >
                            <div
                              className={`z-20 flex h-20 w-20 items-center justify-center rounded-full bg-gradient-to-r from-blue-500 to-purple-600 text-white transition-all duration-300 md:h-24 md:w-24 hover:from-blue-600 hover:to-purple-700 hover:scale-110 shadow-2xl ${
                                isPlaying
                                  ? "invisible select-none opacity-0"
                                  : ""
                              }`}
                            >
                              {isPlaying ? (
                                <Pause className="h-10 w-10 md:h-12 md:w-12" />
                              ) : (
                                <Play className="h-10 w-10 md:h-12 md:w-12" />
                              )}
                            </div>
                          </div>
                        </>
                      ) : (
                        <div className="w-full aspect-video flex items-center justify-center bg-gray-900 text-white">
                          <div className="text-center p-8">
                            <div className="text-6xl mb-4">🎥</div>
                            <h3 className="text-xl font-semibold mb-2">
                              {t("Video not available")}
                            </h3>
                            <p className="text-gray-400 text-sm">
                              {t(
                                "This video source is not configured properly"
                              )}
                            </p>
                            <p className="text-gray-500 text-xs mt-2">
                              Video ID: {currentVideo?.id || "N/A"}
                            </p>
                          </div>
                        </div>
                      )}
                    </div>

                    {/* Video Controls */}
                    <div className="w-full mt-6 px-2 md:px-0 max-w-[860px] mx-auto">
                      <div className="p-5 bg-gradient-to-br from-gray-50 to-blue-50 rounded-2xl shadow-md border border-gray-100">
                        {/* Progress Bar */}
                        <div className="mb-4">
                          <input
                            type="range"
                            min={0}
                            max={duration || 0}
                            step={0.1}
                            value={currentTime}
                            onChange={handleSeek}
                            className="w-full h-2 bg-gray-300 rounded-full appearance-none cursor-pointer
                                   [&::-webkit-slider-thumb]:appearance-none 
                                   [&::-webkit-slider-thumb]:w-4 
                                   [&::-webkit-slider-thumb]:h-4 
                                   [&::-webkit-slider-thumb]:rounded-full 
                                   [&::-webkit-slider-thumb]:bg-gradient-to-r 
                                   [&::-webkit-slider-thumb]:from-blue-500 
                                   [&::-webkit-slider-thumb]:to-purple-600
                                   [&::-webkit-slider-thumb]:shadow-lg
                                   [&::-webkit-slider-thumb]:transition-transform
                                   [&::-webkit-slider-thumb]:hover:scale-125
                                   [&::-moz-range-thumb]:w-4 
                                   [&::-moz-range-thumb]:h-4 
                                   [&::-moz-range-thumb]:rounded-full 
                                   [&::-moz-range-thumb]:bg-gradient-to-r 
                                   [&::-moz-range-thumb]:from-blue-500 
                                   [&::-moz-range-thumb]:to-purple-600
                                   [&::-moz-range-thumb]:border-0
                                   [&::-moz-range-thumb]:shadow-lg
                                   [&::-moz-range-thumb]:transition-transform
                                   [&::-moz-range-thumb]:hover:scale-125"
                            style={{
                              background: `linear-gradient(to right, #3b82f6 0%, #9333ea ${
                                (currentTime / duration) * 100
                              }%, #d1d5db ${
                                (currentTime / duration) * 100
                              }%, #d1d5db 100%)`,
                            }}
                          />
                          <div className="flex justify-between text-sm text-gray-600 font-medium mt-2">
                            <span>{formatTime(currentTime)}</span>
                            <span>{formatTime(duration)}</span>
                          </div>
                        </div>

                        {/* Control Buttons */}
                        <div className="flex items-center justify-center gap-6">
                          <button
                            onClick={handlePrevious}
                            disabled={currentVideoIndex === 0}
                            className="p-3 rounded-full bg-white hover:bg-gray-50 disabled:opacity-30 disabled:cursor-not-allowed 
                                   transition-all hover:scale-110 active:scale-95 shadow-md border border-gray-200"
                            title="Previous video"
                          >
                            <ChevronLeft className="w-6 h-6 text-gray-700" />
                          </button>

                          <button
                            onClick={handleToggle}
                            className="p-5 rounded-full bg-gradient-to-r from-blue-500 to-purple-600 
                                   hover:from-blue-600 hover:to-purple-700 
                                   transition-all hover:scale-110 active:scale-95 shadow-xl"
                            title={isPlaying ? "Pause" : "Play"}
                          >
                            {isPlaying ? (
                              <Pause className="w-8 h-8 text-white" />
                            ) : (
                              <Play className="w-8 h-8 text-white" />
                            )}
                          </button>

                          <button
                            onClick={handleNext}
                            disabled={currentVideoIndex === videos.length - 1}
                            className="p-3 rounded-full bg-white hover:bg-gray-50 disabled:opacity-30 disabled:cursor-not-allowed 
                                   transition-all hover:scale-110 active:scale-95 shadow-md border border-gray-200"
                            title="Next video"
                          >
                            <ChevronRight className="w-6 h-6 text-gray-700" />
                          </button>
                        </div>
                      </div>
                    </div>
                  </div>
                </section>
              </div>
            )}
          </main>
        </div>
      </div>
    </div>
  );
}

export default CourseVideos;
