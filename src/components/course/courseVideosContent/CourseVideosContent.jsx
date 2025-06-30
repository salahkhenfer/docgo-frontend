import Slider from "react-slick";
import { useRef, useState, useEffect } from "react";
import { TestimonialCard } from "./TestimonialCard";
import { useTranslation } from "react-i18next";

export function CourseVideosContent() {
  const { t } = useTranslation();

  // Video player states
  const videoRef = useRef(null);
  const [isPlaying, setPlaying] = useState(false);
  const [currentTime, setCurrentTime] = useState(0);
  const [duration, setDuration] = useState(0);

  // Feedback states
  const [showFeedbackForm, setShowFeedbackForm] = useState(false);
  const [rating, setRating] = useState(0);
  const [comment, setComment] = useState("");

  // Data state (simulating backend response)
  const [courseData, setCourseData] = useState(null);
  const [loading, setLoading] = useState(true);

  // Simulated backend data structure
  const mockBackendData = {
    id: "video_001",
    url: "https://cdn.pixabay.com/video/2024/05/31/214592_large.mp4",
    thumbnail: "https://cdn.pixabay.com/video/2024/05/31/214592_thumbnail.jpg",
    duration: 1800, // 30 minutes in seconds
    title: "Introduction to Web Development",
    description: "Get started with the fundamentals of web development",

    statistics: {
      totalViews: 15420,
      totalStudents: 3240,
      averageRating: 4.7,
      totalReviews: 892,
    },

    testimonials: [
      {
        id: 1,
        testimonial:
          "Grâce à un accompagnement personnalisé, je me sens accompagné à chaque étape du processus. Le contenu est très bien structuré et facile à suivre.",
        author: "Mohamed Yan",
        role: "Étudiante en France",
        avatar:
          "https://cdn.builder.io/api/v1/image/assets/TEMP/6ff491269cba4203f3ad0701f0e9de0cd42c8008",
        rating: 5,
        date: "2024-01-15",
        courseId: "course_001",
      },
      {
        id: 2,
        testimonial:
          "Le service m'a énormément aidé à comprendre les démarches d'admission et visa. Les explications sont claires et détaillées.",
        author: "Fatima Zohra",
        role: "Étudiante en Allemagne",
        avatar:
          "https://cdn.builder.io/api/v1/image/assets/TEMP/5d9a259579fe50840511b1b3a869d2e696e22e6f",
        rating: 4,
        date: "2024-01-10",
        courseId: "course_001",
      },
      {
        id: 3,
        testimonial:
          "Excellent accompagnement ! Je recommande pour toute personne qui veut étudier à l'étranger. L'équipe est très professionnelle.",
        author: "Karim Belkacem",
        role: "Étudiant au Canada",
        avatar:
          "https://cdn.builder.io/api/v1/image/assets/TEMP/6ff491269cba4203f3ad0701f0e9de0cd42c8008",
        rating: 5,
        date: "2024-01-08",
        courseId: "course_001",
      },
      {
        id: 4,
        testimonial:
          "Simple, rapide et efficace. L'équipe est disponible à tout moment. Les ressources fournies sont de grande qualité.",
        author: "Lina Haddad",
        role: "Étudiante en Belgique",
        avatar:
          "https://cdn.builder.io/api/v1/image/assets/TEMP/5d9a259579fe50840511b1b3a869d2e696e22e6f",
        rating: 4,
        date: "2024-01-05",
        courseId: "course_001",
      },
      {
        id: 5,
        testimonial:
          "Formation complète avec beaucoup d'exemples pratiques. J'ai pu appliquer directement ce que j'ai appris.",
        author: "Ahmed Bouali",
        role: "Développeur Full Stack",
        avatar:
          "https://cdn.builder.io/api/v1/image/assets/TEMP/6ff491269cba4203f3ad0701f0e9de0cd42c8008",
        rating: 5,
        date: "2024-01-01",
        courseId: "course_001",
      },
      {
        id: 6,
        testimonial:
          "Interface intuitive et contenu de qualité. Support technique très réactif en cas de problème.",
        author: "Yasmine Alami",
        role: "Designer UX/UI",
        avatar:
          "https://cdn.builder.io/api/v1/image/assets/TEMP/5d9a259579fe50840511b1b3a869d2e696e22e6f",
        rating: 4,
        date: "2023-12-28",
        courseId: "course_001",
      },
    ],
  };

  // Simulate API call
  useEffect(() => {
    const fetchCourseData = async () => {
      setLoading(true);
      try {
        // Simulate API delay
        await new Promise((resolve) => setTimeout(resolve, 1000));
        setCourseData(mockBackendData);
      } catch (error) {
        console.error("Error fetching course data:", error);
      } finally {
        setLoading(false);
      }
    };

    fetchCourseData();
  }, []);

  // Video player handlers
  const handlePlay = () => {
    videoRef.current?.play();
    setPlaying(true);
  };

  const handlePause = () => {
    videoRef.current?.pause();
    setPlaying(false);
  };

  const handleToggle = () => {
    isPlaying ? handlePause() : handlePlay();
  };

  // Utility function for time formatting
  function formatTime(seconds) {
    const minutes = Math.floor(seconds / 60);
    const secs = Math.floor(seconds % 60);
    return `${minutes}:${secs < 10 ? "0" : ""}${secs}`;
  }

  // Slider settings
  const sliderSettings = {
    dots: true,
    arrows: false,
    infinite: true,
    speed: 500,
    slidesToShow: 2,
    slidesToScroll: 1,
    autoplay: true,
    autoplaySpeed: 4000,
    pauseOnHover: true,
    responsive: [
      {
        breakpoint: 1024,
        settings: {
          slidesToShow: 2,
        },
      },
      {
        breakpoint: 768,
        settings: {
          slidesToShow: 1,
        },
      },
    ],
  };

  // Handle feedback submission
  const handleFeedbackSubmit = async () => {
    try {
      alert(
        `${t("course.thankYou")}\n${t("course.rating")}: ${rating} ★\n${t(
          "course.comment"
        )}: ${comment}`
      );
      setComment("");
      setRating(0);
      setShowFeedbackForm(false);
    } catch (error) {
      console.error("Error submitting feedback:", error);
      alert("Error submitting feedback. Please try again.");
    }
  };

  // Loading state
  if (loading) {
    return (
      <main className="ml-5 w-[72%] max-md:ml-0 max-md:w-full">
        <div className="flex flex-col w-full max-md:mt-8 max-md:max-w-full">
          <div className="animate-pulse">
            <div className="h-8 bg-gray-300 rounded w-3/4 mb-4"></div>
            <div className="h-4 bg-gray-300 rounded w-full mb-2"></div>
            <div className="h-4 bg-gray-300 rounded w-2/3 mb-6"></div>
            <div className="h-64 md:h-80 lg:h-[420px] bg-gray-300 rounded-[48px] mb-8"></div>
          </div>
        </div>
      </main>
    );
  }

  // Error state
  if (!courseData) {
    return (
      <main className="ml-5 w-[72%] max-md:ml-0 max-md:w-full">
        <div className="flex flex-col w-full max-md:mt-8 max-md:max-w-full">
          <div className="text-center py-8">
            <p className="text-red-600">
              Error loading course data. Please try again.
            </p>
          </div>
        </div>
      </main>
    );
  }

  return (
    <main className="ml-5 w-[72%] max-md:ml-0 max-md:w-full">
      <div className="flex flex-col w-full max-md:mt-8 max-md:max-w-full">
        <section>
          <header>
            <h1 className="text-2xl font-semibold text-zinc-800">
              {courseData.title}
            </h1>
            <p className="mt-2 text-base leading-relaxed text-neutral-600">
              {courseData.description}
            </p>

            {/* Course Statistics */}
            <div className="flex gap-6 mt-4 text-sm text-neutral-600">
              <span>
                {courseData.statistics.totalViews.toLocaleString()} views
              </span>
              <span>
                {courseData.statistics.totalStudents.toLocaleString()} students
              </span>
              <span>
                ★ {courseData.statistics.averageRating} (
                {courseData.statistics.totalReviews} reviews)
              </span>
            </div>
          </header>

          {/* Video Player */}
          <div className="py-6">
            <div className="relative mx-auto mt-6 h-64 w-full max-w-[860px] overflow-hidden rounded-[48px] bg-gray-200 shadow-md transition duration-300 hover:shadow-lg md:h-80 lg:h-[420px]">
              <video
                className="h-full w-full object-cover"
                ref={videoRef}
                src={courseData.url}
                poster={courseData.thumbnail}
                onTimeUpdate={(e) => setCurrentTime(e.target.currentTime)}
                onLoadedMetadata={(e) => setDuration(e.target.duration)}
                onPlay={() => setPlaying(true)}
                onPause={() => setPlaying(false)}
              />

              <div
                role="button"
                onClick={handleToggle}
                className="absolute left-0 top-0 flex h-full w-full items-center justify-center cursor-pointer"
              >
                <div
                  className={`z-20 flex h-16 w-16 items-center justify-center rounded-full bg-cyan-500 text-white transition-all duration-500 md:h-20 md:w-20 hover:bg-cyan-600 ${
                    isPlaying ? "invisible select-none opacity-0" : ""
                  }`}
                >
                  {/* Play Icon */}
                  <svg
                    className="h-12 w-12 md:h-16 md:w-16 ml-1"
                    stroke="currentColor"
                    viewBox="0 0 512 512"
                  >
                    <path
                      d="M448 256c0-106-86-192-192-192S64 150 64 256s86 192 192 192 192-86 192-192z"
                      fill="none"
                      stroke="currentColor"
                      strokeMiterlimit="10"
                      strokeWidth="32"
                    />
                    <path d="M176 176v160l160-80z" fill="currentColor" />
                  </svg>
                </div>
              </div>
            </div>

            {/* Video Timeline */}
            <div className="w-full mt-4 px-2 md:px-0 max-w-[860px] mx-auto">
              <input
                type="range"
                min={0}
                max={duration}
                step={0.1}
                value={currentTime}
                onChange={(e) => {
                  const time = parseFloat(e.target.value);
                  if (videoRef.current) {
                    videoRef.current.currentTime = time;
                    setCurrentTime(time);
                  }
                }}
                className="w-full h-2 bg-gray-200 rounded-lg appearance-none cursor-pointer accent-cyan-500"
              />
              <div className="flex justify-between text-sm text-neutral-600 mt-2">
                <span>{formatTime(currentTime)}</span>
                <span>{formatTime(duration)}</span>
              </div>
            </div>
          </div>
        </section>

        {/* Feedback Section */}
        <section className="mt-10">
          <div className="flex gap-2 flex-wrap items-center text-zinc-800">
            <button
              onClick={() => setShowFeedbackForm(false)}
              className="px-6 py-2 bg-white rounded-lg border text-base font-medium hover:bg-gray-50 transition-colors"
            >
              {t("course.readComments")} ({courseData.testimonials.length})
            </button>
            <button
              className="px-4 py-2 text-base text-blue-600 hover:underline transition-colors"
              onClick={() => setShowFeedbackForm(true)}
            >
              {t("course.writeFeedback")}
            </button>
          </div>

          {/* Feedback Form */}
          {showFeedbackForm && (
            <div className="mt-6 border p-6 rounded-xl bg-gray-50">
              <h3 className="text-lg font-semibold text-zinc-800 mb-4">
                {t("course.leaveFeedback")}
              </h3>
              <div className="flex items-center gap-2 mb-4">
                <span className="text-gray-600">{t("course.rating")}:</span>
                {[1, 2, 3, 4, 5].map((star) => (
                  <button
                    key={star}
                    onClick={() => setRating(star)}
                    className={`text-2xl transition-colors hover:scale-110 ${
                      rating >= star
                        ? "text-yellow-400"
                        : "text-gray-300 hover:text-yellow-200"
                    }`}
                  >
                    ★
                  </button>
                ))}
                {rating > 0 && (
                  <span className="ml-2 text-sm text-gray-600">
                    ({rating}/5)
                  </span>
                )}
              </div>
              <textarea
                rows={4}
                value={comment}
                onChange={(e) => setComment(e.target.value)}
                placeholder={t("course.commentPlaceholder")}
                className="w-full p-3 border rounded-md focus:outline-none focus:ring-2 focus:ring-cyan-500 focus:border-transparent resize-none"
              />
              <div className="mt-4 flex gap-2 justify-end">
                <button
                  onClick={() => {
                    setComment("");
                    setRating(0);
                    setShowFeedbackForm(false);
                  }}
                  className="px-6 py-2 bg-gray-300 text-gray-700 rounded-md hover:bg-gray-400 transition-colors"
                >
                  Cancel
                </button>
                <button
                  onClick={handleFeedbackSubmit}
                  disabled={!rating || !comment.trim()}
                  className="px-6 py-2 bg-cyan-500 text-white rounded-md hover:bg-cyan-600 disabled:bg-gray-400 disabled:cursor-not-allowed transition-colors"
                >
                  {t("course.submit")}
                </button>
              </div>
            </div>
          )}

          {/* Testimonials Section */}
          <div className="mt-8">
            <h3 className="text-xl font-semibold text-zinc-800 mb-6">
              Student Reviews ({courseData.testimonials.length})
            </h3>

            {courseData.testimonials.length > 0 ? (
              <Slider {...sliderSettings}>
                {courseData.testimonials.map((testimonial) => (
                  <div key={testimonial.id} className="h-full px-2">
                    <TestimonialCard
                      {...testimonial}
                      showDate={true}
                      showRating={true}
                    />
                  </div>
                ))}
              </Slider>
            ) : (
              <div className="text-center py-8 text-gray-500">
                <p>No reviews yet. Be the first to leave a review!</p>
              </div>
            )}
          </div>
        </section>
      </div>
    </main>
  );
}

export default CourseVideosContent;
