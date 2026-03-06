import Hls from "hls.js";
import {
  BookOpen,
  ChevronDown,
  ChevronLeft,
  ChevronRight,
  ChevronUp,
  FileText,
  HelpCircle,
  Pause,
  Play,
  Video,
  X,
} from "lucide-react";
import PropTypes from "prop-types";
import { useCallback, useEffect, useRef, useState } from "react";
import { FaCheckCircle, FaLock } from "react-icons/fa";
import { useTranslation } from "react-i18next";
import { useNavigate, useParams } from "react-router-dom";
import Swal from "sweetalert2";
import { EnrollmentAPI } from "../API/Enrollment";
import { useAppContext } from "../AppContext";
import { useCourse } from "../hooks/useCourse";
import MainLoading from "../MainLoading";
import Certificate from "./Certificate";

// ─────────────────────────────────────────────────────────────────────────────
// Item type icon helper
// ─────────────────────────────────────────────────────────────────────────────
ItemTypeIcon.propTypes = {
  type: PropTypes.string,
  className: PropTypes.string,
};
function ItemTypeIcon({ type, className = "w-4 h-4" }) {
  switch (type) {
    case "video":
      return <Video className={`${className} text-blue-500`} />;
    case "pdf":
      return <FileText className={`${className} text-red-500`} />;
    case "text":
      return <BookOpen className={`${className} text-green-500`} />;
    case "quiz":
      return <HelpCircle className={`${className} text-purple-500`} />;
    default:
      return <FileText className={`${className} text-gray-400`} />;
  }
}

// ─────────────────────────────────────────────────────────────────────────────
// Inline Section Quiz – renders quizData JSON from a SectionItem
// ─────────────────────────────────────────────────────────────────────────────
SectionQuiz.propTypes = {
  item: PropTypes.object.isRequired,
  courseId: PropTypes.string,
  onComplete: PropTypes.func.isRequired,
  isCompleted: PropTypes.bool,
};
function SectionQuiz({ item, courseId, onComplete, isCompleted }) {
  const { t } = useTranslation();
  const [answers, setAnswers] = useState({});
  const [submitted, setSubmitted] = useState(false);
  const [score, setScore] = useState(null);
  const [attempts, setAttempts] = useState(0);

  const quizData = item.quizData;
  const questions =
    quizData?.questions || (Array.isArray(quizData) ? quizData : []);
  const passingScore = item.quizPassingScore ?? 80;
  const maxAttempts = item.maxAttempts ?? 3;

  const handleAnswer = (questionId, value) => {
    if (submitted) return;
    setAnswers((prev) => ({ ...prev, [questionId]: value }));
  };

  const handleSubmit = async () => {
    if (questions.length === 0) return;

    let correct = 0;
    questions.forEach((q) => {
      const qId = q.id || q._id || String(q.order ?? questions.indexOf(q));
      if (
        answers[qId] === q.correctAnswer ||
        answers[qId] === q.correct_answer
      ) {
        correct++;
      }
    });
    const pct = Math.round((correct / questions.length) * 100);
    setScore(pct);
    setSubmitted(true);
    setAttempts((a) => a + 1);

    const passed = pct >= passingScore;
    try {
      await EnrollmentAPI.markItemComplete(courseId, item.id, {
        quizScore: pct,
        quizPassed: passed,
        timeSpent: 0,
      });
    } catch {
      // silent
    }

    if (passed) onComplete(item.id);
  };

  const handleRetry = () => {
    setAnswers({});
    setSubmitted(false);
    setScore(null);
  };

  if (!Array.isArray(questions) || questions.length === 0) {
    return (
      <div className="p-8 text-center text-gray-500">
        <HelpCircle className="w-12 h-12 mx-auto mb-3 text-gray-300" />
        <p>{t("No quiz questions available")}</p>
      </div>
    );
  }

  return (
    <div className="max-w-2xl mx-auto">
      {/* Header */}
      <div className="mb-6 p-4 bg-purple-50 rounded-xl border border-purple-100">
        <h2 className="text-xl font-bold text-purple-800 mb-1">{item.title}</h2>
        <p className="text-sm text-purple-600">
          {t("Passing score")}: {passingScore}% &nbsp;|&nbsp;
          {t("Attempts")}: {attempts}/{maxAttempts}
        </p>
      </div>

      {/* Result */}
      {submitted && (
        <div
          className={`mb-6 p-4 rounded-xl border text-center ${
            score >= passingScore
              ? "bg-green-50 border-green-300 text-green-800"
              : "bg-red-50 border-red-300 text-red-800"
          }`}
        >
          <p className="text-2xl font-bold mb-1">{score}%</p>
          <p className="font-medium">
            {score >= passingScore
              ? t("Quiz passed! Great job.")
              : t("Quiz failed. Try again.")}
          </p>
          {score < passingScore && attempts < maxAttempts && (
            <button
              onClick={handleRetry}
              className="mt-3 px-4 py-2 bg-red-600 text-white rounded-lg hover:bg-red-700 transition-colors text-sm font-medium"
            >
              {t("Retry")}
            </button>
          )}
        </div>
      )}

      {/* Questions */}
      {!submitted && (
        <div className="space-y-6">
          {questions.map((q, idx) => {
            const qId = q.id || q._id || String(q.order ?? idx);
            return (
              <div
                key={qId}
                className="p-5 bg-white rounded-xl border border-gray-200 shadow-sm"
              >
                <p className="font-semibold text-gray-800 mb-4">
                  {idx + 1}. {q.text || q.question}
                </p>
                {Array.isArray(q.options) ? (
                  <div className="space-y-2">
                    {q.options.map((opt) => {
                      const optId = opt.id || opt.value || opt.label;
                      return (
                        <label
                          key={optId}
                          className={`flex items-center gap-3 p-3 rounded-lg border cursor-pointer transition-colors ${
                            answers[qId] === optId
                              ? "border-purple-500 bg-purple-50"
                              : "border-gray-200 hover:bg-gray-50"
                          }`}
                        >
                          <input
                            type="radio"
                            name={`q_${qId}`}
                            value={optId}
                            checked={answers[qId] === optId}
                            onChange={() => handleAnswer(qId, optId)}
                            className="text-purple-600"
                          />
                          <span className="text-gray-700">
                            {opt.label || opt.text || opt.value}
                          </span>
                        </label>
                      );
                    })}
                  </div>
                ) : (
                  // True/False
                  <div className="flex gap-4">
                    {["True", "False"].map((val) => (
                      <label
                        key={val}
                        className={`flex-1 flex items-center justify-center gap-2 p-3 rounded-lg border cursor-pointer transition-colors ${
                          answers[qId] === val
                            ? "border-purple-500 bg-purple-50"
                            : "border-gray-200 hover:bg-gray-50"
                        }`}
                      >
                        <input
                          type="radio"
                          name={`q_${qId}`}
                          value={val}
                          checked={answers[qId] === val}
                          onChange={() => handleAnswer(qId, val)}
                          className="text-purple-600"
                        />
                        <span className="font-medium">{t(val)}</span>
                      </label>
                    ))}
                  </div>
                )}
              </div>
            );
          })}

          <button
            onClick={handleSubmit}
            disabled={Object.keys(answers).length < questions.length}
            className="w-full py-3 bg-gradient-to-r from-purple-500 to-indigo-600 text-white font-semibold rounded-xl hover:from-purple-600 hover:to-indigo-700 transition-all disabled:opacity-50 disabled:cursor-not-allowed shadow-md"
          >
            {t("Submit Quiz")}
          </button>
        </div>
      )}

      {/* Already completed */}
      {isCompleted && !submitted && (
        <div className="mt-4 p-3 bg-green-50 rounded-lg border border-green-200 text-green-700 text-sm text-center">
          <FaCheckCircle className="inline mr-2" />
          {t("You have already completed this quiz")}
        </div>
      )}
    </div>
  );
}

// ─────────────────────────────────────────────────────────────────────────────
// PDF Viewer
// ─────────────────────────────────────────────────────────────────────────────
PdfViewer.propTypes = {
  item: PropTypes.object.isRequired,
  onComplete: PropTypes.func.isRequired,
  isCompleted: PropTypes.bool,
};
function PdfViewer({ item, onComplete, isCompleted }) {
  const { t } = useTranslation();
  const [marked, setMarked] = useState(isCompleted);

  const handleMark = async () => {
    setMarked(true);
    onComplete(item.id);
  };

  const url = item.pdfUrl;
  const embedUrl = url?.startsWith("http")
    ? url
    : `${import.meta.env.VITE_API_URL}${url}`;

  return (
    <div className="flex flex-col gap-4">
      <div className="flex items-center justify-between">
        <h2 className="text-xl font-semibold text-gray-800">{item.title}</h2>
        {!marked ? (
          <button
            onClick={handleMark}
            className="flex items-center gap-2 px-4 py-2 bg-green-600 text-white rounded-lg hover:bg-green-700 transition-colors text-sm font-medium"
          >
            <FaCheckCircle /> {t("Mark as Read")}
          </button>
        ) : (
          <span className="flex items-center gap-2 text-green-700 font-medium text-sm">
            <FaCheckCircle /> {t("Completed")}
          </span>
        )}
      </div>
      {item.description && (
        <p className="text-gray-600 text-sm">{item.description}</p>
      )}
      {url ? (
        <iframe
          src={embedUrl}
          className="w-full rounded-xl border border-gray-200 shadow-sm"
          style={{ height: "75vh" }}
          title={item.title}
        />
      ) : (
        <div className="flex items-center justify-center h-64 bg-gray-50 rounded-xl border border-gray-200 text-gray-500">
          <p>{t("PDF not available")}</p>
        </div>
      )}
    </div>
  );
}

// ─────────────────────────────────────────────────────────────────────────────
// Text Reader
// ─────────────────────────────────────────────────────────────────────────────
TextReader.propTypes = {
  item: PropTypes.object.isRequired,
  onComplete: PropTypes.func.isRequired,
  isCompleted: PropTypes.bool,
};
function TextReader({ item, onComplete, isCompleted }) {
  const { t, i18n } = useTranslation();
  const [marked, setMarked] = useState(isCompleted);
  const content =
    i18n.language === "ar" && item.textContent_ar
      ? item.textContent_ar
      : item.textContent || "";

  const handleMark = () => {
    setMarked(true);
    onComplete(item.id);
  };

  return (
    <div className="flex flex-col gap-4 max-w-3xl mx-auto">
      <div className="flex items-center justify-between">
        <h2 className="text-xl font-semibold text-gray-800">{item.title}</h2>
        {!marked ? (
          <button
            onClick={handleMark}
            className="flex items-center gap-2 px-4 py-2 bg-green-600 text-white rounded-lg hover:bg-green-700 transition-colors text-sm font-medium"
          >
            <FaCheckCircle /> {t("Mark as Read")}
          </button>
        ) : (
          <span className="flex items-center gap-2 text-green-700 font-medium text-sm">
            <FaCheckCircle /> {t("Completed")}
          </span>
        )}
      </div>
      <div
        className="prose prose-gray max-w-none p-6 bg-white rounded-xl border border-gray-200 shadow-sm leading-relaxed"
        dangerouslySetInnerHTML={{
          __html: content || `<p>${t("No content available")}</p>`,
        }}
      />
    </div>
  );
}

// ─────────────────────────────────────────────────────────────────────────────
// Video Player (HLS-aware)
// ─────────────────────────────────────────────────────────────────────────────
VideoItemPlayer.propTypes = {
  item: PropTypes.object.isRequired,
  courseId: PropTypes.string,
  onComplete: PropTypes.func.isRequired,
  isCompleted: PropTypes.bool,
};
function VideoItemPlayer({ item, courseId, onComplete, isCompleted }) {
  const { t } = useTranslation();
  const videoRef = useRef(null);
  const hlsRef = useRef(null);
  const [isPlaying, setPlaying] = useState(false);
  const [currentTime, setCurrentTime] = useState(0);
  const [duration, setDuration] = useState(0);
  const completedRef = useRef(isCompleted);
  completedRef.current = isCompleted;

  const url = item.videoUrl?.startsWith("http")
    ? item.videoUrl
    : item.videoUrl
      ? `${import.meta.env.VITE_API_URL}${item.videoUrl}`
      : null;

  // Attach HLS
  useEffect(() => {
    const el = videoRef.current;
    if (!el || !url) return;

    if (hlsRef.current) {
      hlsRef.current.destroy();
      hlsRef.current = null;
    }

    const isHls = url.includes(".m3u8");
    if (!isHls) {
      el.src = url;
      return;
    }

    if (el.canPlayType("application/vnd.apple.mpegurl")) {
      el.src = url;
      return;
    }

    if (Hls.isSupported()) {
      const hls = new Hls({ enableWorker: true, lowLatencyMode: false });
      hlsRef.current = hls;
      hls.loadSource(url);
      hls.attachMedia(el);
    }

    return () => {
      if (hlsRef.current) {
        hlsRef.current.destroy();
        hlsRef.current = null;
      }
    };
  }, [url]);

  const handleTimeUpdate = (e) => {
    const cur = e.target.currentTime;
    const total = e.target.duration;
    setCurrentTime(cur);
    if (total > 0 && (cur / total) * 100 >= 90 && !completedRef.current) {
      completedRef.current = true;
      EnrollmentAPI.markItemComplete(courseId, item.id, {
        watchedDuration: Math.round(cur),
        timeSpent: Math.round(cur),
      })
        .then((res) => {
          if (res.success) onComplete(item.id);
        })
        .catch(() => {});
    }
  };

  const handleEnded = () => {
    if (!completedRef.current) {
      completedRef.current = true;
      EnrollmentAPI.markItemComplete(courseId, item.id, {
        watchedDuration: Math.round(videoRef.current?.duration || 0),
        timeSpent: Math.round(videoRef.current?.duration || 0),
      })
        .then((res) => {
          if (res.success) onComplete(item.id);
        })
        .catch(() => {});
    }
  };

  const formatTime = (s) => {
    if (isNaN(s)) return "0:00";
    const m = Math.floor(s / 60);
    const sec = Math.floor(s % 60);
    return `${m}:${sec < 10 ? "0" : ""}${sec}`;
  };

  return (
    <div className="flex flex-col gap-4">
      <div className="flex items-center justify-between">
        <h2 className="text-xl font-semibold text-gray-800">{item.title}</h2>
        {isCompleted && (
          <span className="flex items-center gap-2 text-green-700 font-medium text-sm">
            <FaCheckCircle /> {t("Completed")}
          </span>
        )}
      </div>
      {item.description && (
        <p className="text-gray-600 text-sm">{item.description}</p>
      )}

      <div className="relative mx-auto w-full max-w-[860px] overflow-hidden rounded-2xl bg-black shadow-2xl border border-gray-200">
        {url ? (
          <>
            <video
              ref={videoRef}
              className="w-full aspect-video object-contain"
              src={url}
              onTimeUpdate={handleTimeUpdate}
              onLoadedMetadata={(e) => setDuration(e.target.duration)}
              onPlay={() => setPlaying(true)}
              onPause={() => setPlaying(false)}
              onEnded={handleEnded}
            />
            <div
              role="button"
              onClick={() =>
                isPlaying ? videoRef.current?.pause() : videoRef.current?.play()
              }
              className="absolute inset-0 flex items-center justify-center cursor-pointer bg-gradient-to-t from-black/40 via-transparent to-transparent transition-opacity hover:from-black/50"
            >
              <div
                className={`z-20 flex h-20 w-20 items-center justify-center rounded-full bg-gradient-to-r from-blue-500 to-purple-600 text-white transition-all duration-300 hover:scale-110 shadow-2xl ${
                  isPlaying ? "invisible select-none opacity-0" : ""
                }`}
              >
                {isPlaying ? (
                  <Pause className="h-10 w-10" />
                ) : (
                  <Play className="h-10 w-10" />
                )}
              </div>
            </div>
          </>
        ) : (
          <div className="w-full aspect-video flex items-center justify-center bg-gray-900 text-white">
            <div className="text-center p-8">
              <p className="text-gray-400 text-sm">
                {t("Video not available")}
              </p>
            </div>
          </div>
        )}
      </div>

      {/* Controls */}
      <div className="w-full max-w-[860px] mx-auto">
        <div className="p-5 bg-gradient-to-br from-gray-50 to-blue-50 rounded-2xl shadow-md border border-gray-100">
          <div className="mb-4">
            <input
              type="range"
              min={0}
              max={duration || 0}
              step={0.1}
              value={currentTime}
              onChange={(e) => {
                const t2 = parseFloat(e.target.value);
                if (videoRef.current && !isNaN(t2)) {
                  videoRef.current.currentTime = t2;
                  setCurrentTime(t2);
                }
              }}
              className="w-full h-2 bg-gray-300 rounded-full appearance-none cursor-pointer"
              style={{
                background: `linear-gradient(to right, #3b82f6 0%, #9333ea ${
                  duration ? (currentTime / duration) * 100 : 0
                }%, #d1d5db ${
                  duration ? (currentTime / duration) * 100 : 0
                }%, #d1d5db 100%)`,
              }}
            />
            <div className="flex justify-between text-sm text-gray-600 font-medium mt-2">
              <span>{formatTime(currentTime)}</span>
              <span>{formatTime(duration)}</span>
            </div>
          </div>
          <div className="flex items-center justify-center gap-6">
            <button
              onClick={() =>
                isPlaying ? videoRef.current?.pause() : videoRef.current?.play()
              }
              className="p-5 rounded-full bg-gradient-to-r from-blue-500 to-purple-600 hover:from-blue-600 hover:to-purple-700 transition-all hover:scale-110 active:scale-95 shadow-xl"
            >
              {isPlaying ? (
                <Pause className="w-8 h-8 text-white" />
              ) : (
                <Play className="w-8 h-8 text-white" />
              )}
            </button>
          </div>
        </div>
      </div>
    </div>
  );
}

// ─────────────────────────────────────────────────────────────────────────────
// Main CourseSections component
// ─────────────────────────────────────────────────────────────────────────────
export function CourseSections() {
  const { t } = useTranslation();
  const { courseId } = useParams();
  const navigate = useNavigate();
  const { user } = useAppContext();

  const [currentItem, setCurrentItem] = useState(null);
  const [sidebarOpen, setSidebarOpen] = useState(false);
  const [expandedSections, setExpandedSections] = useState({});
  const [showCertificate, setShowCertificate] = useState(false);

  // Progress
  const [completedItems, setCompletedItems] = useState(new Set());
  const [totalItems, setTotalItems] = useState(0);

  const { courseData, loading, error, hasError, isEnrolled, hasData } =
    useCourse(courseId);

  // Redirect if not enrolled
  useEffect(() => {
    if (hasData && !isEnrolled) {
      navigate(`/Courses/${courseId}`);
    }
  }, [hasData, isEnrolled, courseId, navigate]);

  // Load progress from backend
  useEffect(() => {
    if (!courseId || !user) return;
    EnrollmentAPI.getCourseProgress(courseId)
      .then((res) => {
        if (res.success && res.data) {
          const ids = res.data.completedItemIds || [];
          setCompletedItems(new Set(ids));
          setTotalItems(res.data.totalItems || 0);
        }
      })
      .catch(() => {});
  }, [courseId, user]);

  // Auto-expand all sections and select first item
  useEffect(() => {
    const course = courseData?.course;
    if (!course) return;

    const rawSects = course.sections || [];
    const legVids = course.videos || [];
    const activeSections =
      rawSects.length > 0
        ? rawSects
        : legVids.length > 0
          ? [
              {
                id: "legacy",
                title: "Course Content",
                items: legVids.map((v) => ({
                  id: v.id,
                  title: v.title,
                  type: "video",
                  videoUrl: v.video || v.videoUrl || v.VideoUrl,
                  isRequired: true,
                })),
              },
            ]
          : [];

    if (!activeSections.length) return;

    const expanded = {};
    activeSections.forEach((s) => {
      expanded[s.id] = true;
    });
    setExpandedSections(expanded);

    // Select first item if none selected
    if (!currentItem) {
      const first = activeSections[0]?.items?.[0];
      if (first) setCurrentItem(first);
    }
    // Update total items count from sections
    const total = activeSections.reduce(
      (sum, s) => sum + (s.items?.length || 0),
      0,
    );
    if (total > 0) setTotalItems((prev) => (prev === 0 ? total : prev));
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [courseData]);

  const handleItemComplete = useCallback(async (itemId) => {
    setCompletedItems((prev) => {
      const next = new Set([...prev, itemId]);
      return next;
    });
  }, []);

  const handleCertificateClick = async () => {
    const studentName =
      user?.firstName && user?.lastName
        ? `${user.firstName} ${user.lastName}`
        : user?.FirstName
          ? `${user.FirstName} ${user.LastName}`
          : user?.name || "";

    const result = await Swal.fire({
      title: t("certificate.realNameTitle") || "Certificate Name",
      html: `
                <p style="margin-bottom:10px;color:#374151">
                    ${
                      t("certificate.realNameWarning") ||
                      "Your certificate will be issued under your real name. This cannot be changed later."
                    }
                </p>
                <p style="font-weight:700;font-size:1.1em;color:#7c3aed;padding:8px 16px;background:#f3e8ff;border-radius:8px;display:inline-block">
                    ${studentName || t("certificate.noName") || "Name not set"}
                </p>
                ${
                  !studentName
                    ? `<p style="margin-top:10px;color:#dc2626;font-size:0.9em">${t("certificate.goSetName") || "Please update your profile with your real name first."}</p>`
                    : ""
                }
            `,
      icon: "warning",
      showCancelButton: true,
      confirmButtonColor: "#7c3aed",
      cancelButtonColor: "#6b7280",
      confirmButtonText: t("certificate.proceed") || "Get Certificate",
      cancelButtonText: t("certificate.cancel") || "Cancel",
      focusCancel: !studentName,
    });

    if (result.isConfirmed && studentName) {
      navigate(`/Courses/${courseId}/watch/certificate`);
    } else if (result.isConfirmed && !studentName) {
      navigate("/profile/edit");
    }
  };

  // ── Early returns ──────────────────────────────────────────────────────
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

  const course = courseData?.course;

  // Build sections: prefer course.sections; fall back to synthetic section from course.videos
  const rawSections = course?.sections || [];
  const legacyVideos = course?.videos || [];
  const hasSections = rawSections.length > 0;
  const hasLegacyVideos = !hasSections && legacyVideos.length > 0;

  const sections = hasSections
    ? rawSections
    : hasLegacyVideos
      ? [
          {
            id: "legacy",
            title: t("Course Content"),
            items: legacyVideos.map((v) => ({
              id: v.id,
              title: v.title,
              type: "video",
              videoUrl: v.video || v.videoUrl || v.VideoUrl,
              videoDuration: v.duration,
              description: v.description,
              isRequired: true,
            })),
          },
        ]
      : [];

  // If genuinely no content at all, show message
  if (!hasSections && !hasLegacyVideos) {
    return (
      <div className="min-h-screen bg-gray-50 flex items-center justify-center">
        <div className="text-center">
          <p className="text-gray-600 mb-4">
            {t("This course has no content yet")}
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

  const hasCertificate = course?.certificate === true;
  const isCertificateUnlocked =
    totalItems > 0 && completedItems.size >= totalItems;

  const progressPct =
    totalItems > 0 ? Math.round((completedItems.size / totalItems) * 100) : 0;

  // ── Sidebar section/item list ──────────────────────────────────────────
  const SidebarContent = () => (
    <div className="flex flex-col h-full">
      <button
        onClick={() => navigate(`/Courses/${courseId}`)}
        className="mt-6 mb-4 flex items-center text-gray-600 hover:text-blue-600 transition-all group"
      >
        <ChevronLeft className="w-5 h-5 mr-1 group-hover:-translate-x-1 transition-transform" />
        {t("Back to course")}
      </button>

      <h1 className="text-xl font-bold leading-8 bg-gradient-to-r from-blue-600 to-purple-600 bg-clip-text text-transparent mb-5">
        {course.Title}
      </h1>

      {/* Progress */}
      <div className="mb-6 p-4 bg-gradient-to-br from-blue-50 to-indigo-50 rounded-2xl border border-blue-100 shadow-sm">
        <div className="flex items-center justify-between mb-2">
          <span className="text-sm font-semibold text-gray-700">
            {t("Progress")}
          </span>
          <span className="text-lg font-bold text-blue-600">
            {progressPct}%
          </span>
        </div>
        <div className="w-full bg-gray-200 rounded-full h-3 overflow-hidden">
          <div
            className="bg-gradient-to-r from-blue-500 to-purple-600 h-3 rounded-full transition-all duration-500"
            style={{ width: `${progressPct}%` }}
          />
        </div>
        <p className="text-xs text-gray-500 mt-2">
          {completedItems.size} / {totalItems} {t("items completed")}
        </p>
      </div>

      {/* Sections accordion */}
      <nav className="flex-1 overflow-y-auto space-y-3 pb-4">
        {sections.map((section) => {
          const isExpanded = expandedSections[section.id] !== false;
          const sectionItems = section.items || [];
          const sectionDone = sectionItems.filter((i) =>
            completedItems.has(i.id),
          ).length;

          return (
            <div
              key={section.id}
              className="border border-gray-200 rounded-xl overflow-hidden"
            >
              {/* Section header */}
              <button
                onClick={() =>
                  setExpandedSections((prev) => ({
                    ...prev,
                    [section.id]: !isExpanded,
                  }))
                }
                className="w-full flex items-center justify-between p-3 bg-gray-50 hover:bg-gray-100 transition-colors text-left"
              >
                <div className="flex-1 min-w-0">
                  <p className="font-semibold text-gray-800 text-sm truncate">
                    {section.title}
                  </p>
                  <p className="text-xs text-gray-500 mt-0.5">
                    {sectionDone}/{sectionItems.length} {t("completed")}
                  </p>
                </div>
                {isExpanded ? (
                  <ChevronUp className="w-4 h-4 text-gray-500 flex-shrink-0 ml-2" />
                ) : (
                  <ChevronDown className="w-4 h-4 text-gray-500 flex-shrink-0 ml-2" />
                )}
              </button>

              {/* Items */}
              {isExpanded && (
                <div className="divide-y divide-gray-100">
                  {sectionItems.map((item) => {
                    const isActive = currentItem?.id === item.id;
                    const isDone = completedItems.has(item.id);

                    return (
                      <button
                        key={item.id}
                        onClick={() => {
                          setCurrentItem(item);
                          setShowCertificate(false);
                          setSidebarOpen(false);
                        }}
                        className={`w-full flex items-center gap-3 px-3 py-3 text-left transition-colors ${
                          isActive
                            ? "bg-blue-50 border-l-4 border-blue-500"
                            : isDone
                              ? "bg-green-50 hover:bg-green-100"
                              : "bg-white hover:bg-gray-50"
                        }`}
                      >
                        {/* Completion icon */}
                        <div className="flex-shrink-0">
                          {isDone ? (
                            <FaCheckCircle className="w-5 h-5 text-green-500" />
                          ) : (
                            <ItemTypeIcon
                              type={item.type}
                              className="w-5 h-5"
                            />
                          )}
                        </div>
                        {/* Title */}
                        <span
                          className={`text-sm font-medium flex-1 truncate ${
                            isActive
                              ? "text-blue-700"
                              : isDone
                                ? "text-green-700"
                                : "text-gray-700"
                          }`}
                        >
                          {item.title}
                        </span>
                        {isActive && (
                          <Play className="w-3 h-3 text-blue-500 flex-shrink-0" />
                        )}
                      </button>
                    );
                  })}
                </div>
              )}
            </div>
          );
        })}
      </nav>

      {/* Certificate button */}
      {hasCertificate && (
        <div
          className={`mt-4 p-4 rounded-xl border-2 transition-all ${
            isCertificateUnlocked
              ? "border-purple-500 bg-gradient-to-r from-purple-50 to-pink-50 hover:shadow-md cursor-pointer"
              : "border-gray-200 bg-gray-50"
          }`}
          onClick={isCertificateUnlocked ? handleCertificateClick : undefined}
        >
          {isCertificateUnlocked ? (
            <div className="flex items-center gap-3 text-purple-700 font-semibold">
              <FaCheckCircle className="w-5 h-5 text-purple-600 animate-bounce" />
              <span className="flex-1">{t("Certificate")}</span>
              <ChevronRight className="w-4 h-4" />
            </div>
          ) : (
            <div className="flex items-center gap-3 text-gray-400">
              <FaLock className="w-5 h-5" />
              <span className="flex-1 text-sm">
                {t("Certificate (locked)")}
              </span>
            </div>
          )}
        </div>
      )}
    </div>
  );

  // ── Main content renderer based on item type ───────────────────────────
  const renderMainContent = () => {
    if (showCertificate) {
      return (
        <div className="flex flex-col w-full">
          <div className="flex items-center justify-between mb-6">
            <h1 className="text-2xl font-semibold text-zinc-800">
              {t("Course Certificate")}
            </h1>
            <button
              onClick={() => setShowCertificate(false)}
              className="flex items-center gap-2 px-4 py-2 text-gray-700 bg-gray-100 hover:bg-gray-200 rounded-lg transition-colors"
            >
              <X className="w-4 h-4" />
              <span>{t("Back")}</span>
            </button>
          </div>
          <Certificate />
        </div>
      );
    }

    if (!currentItem) {
      return (
        <div className="flex items-center justify-center h-64 text-gray-500">
          <p>{t("Select an item from the sidebar to begin")}</p>
        </div>
      );
    }

    const done = completedItems.has(currentItem.id);

    switch (currentItem.type) {
      case "video":
        return (
          <VideoItemPlayer
            key={currentItem.id}
            item={currentItem}
            courseId={courseId}
            onComplete={handleItemComplete}
            isCompleted={done}
          />
        );
      case "pdf":
        return (
          <PdfViewer
            key={currentItem.id}
            item={currentItem}
            onComplete={(id) =>
              EnrollmentAPI.markItemComplete(courseId, id, {
                timeSpent: 0,
              })
                .then((res) => {
                  if (res.success) handleItemComplete(id);
                })
                .catch(() => {})
            }
            isCompleted={done}
          />
        );
      case "text":
        return (
          <TextReader
            key={currentItem.id}
            item={currentItem}
            onComplete={(id) =>
              EnrollmentAPI.markItemComplete(courseId, id, {
                timeSpent: 0,
              })
                .then((res) => {
                  if (res.success) handleItemComplete(id);
                })
                .catch(() => {})
            }
            isCompleted={done}
          />
        );
      case "quiz":
        return (
          <SectionQuiz
            key={currentItem.id}
            item={currentItem}
            courseId={courseId}
            onComplete={handleItemComplete}
            isCompleted={done}
          />
        );
      default:
        return (
          <div className="p-8 text-center text-gray-500">
            <p>
              {t("Unknown item type")}: {currentItem.type}
            </p>
          </div>
        );
    }
  };

  // ── Navigation helpers ─────────────────────────────────────────────────
  const allItems = sections.flatMap((s) => s.items || []);
  const currentIdx = allItems.findIndex((i) => i.id === currentItem?.id);
  const hasPrev = currentIdx > 0;
  const hasNext = currentIdx < allItems.length - 1;

  return (
    <div className="w-full flex-col bg-gradient-to-br from-gray-50 to-blue-50 min-h-screen">
      {/* Mobile header */}
      <div className="md:hidden bg-white border-b border-gray-200 px-4 py-3 sticky top-0 z-50 flex items-center justify-between">
        <button
          onClick={() => setSidebarOpen(true)}
          className="p-2 rounded-lg text-gray-600 bg-gray-100 hover:bg-gray-200 transition-all"
          aria-label="Open menu"
        >
          <svg
            className="w-5 h-5"
            fill="none"
            stroke="currentColor"
            viewBox="0 0 24 24"
          >
            <path
              strokeLinecap="round"
              strokeLinejoin="round"
              strokeWidth={2}
              d="M4 6h16M4 12h16M4 18h16"
            />
          </svg>
        </button>
        <span className="font-semibold text-gray-800 truncate max-w-[200px]">
          {currentItem?.title || course?.Title}
        </span>
        <span className="text-sm text-blue-600 font-bold">{progressPct}%</span>
      </div>

      {/* Mobile sidebar overlay */}
      {sidebarOpen && (
        <div
          className="md:hidden fixed inset-0 bg-black bg-opacity-50 z-40"
          onClick={() => setSidebarOpen(false)}
        />
      )}

      {/* Mobile sidebar panel */}
      <div
        className={`md:hidden fixed top-0 left-0 h-full w-80 max-w-[90vw] bg-white shadow-2xl transform transition-transform duration-300 ease-in-out z-50 overflow-y-auto px-5 ${
          sidebarOpen ? "translate-x-0" : "-translate-x-full"
        }`}
      >
        <button
          onClick={() => setSidebarOpen(false)}
          className="absolute top-4 right-4 p-2 rounded-full text-gray-600 bg-gray-100 hover:bg-gray-200"
        >
          <X className="w-5 h-5" />
        </button>
        <SidebarContent />
      </div>

      {/* Main layout */}
      <div className="flex-1 w-full max-w-[1360px] mx-auto flex">
        {/* Desktop sidebar */}
        <aside className="hidden md:flex md:w-80 lg:w-96 flex-shrink-0">
          <div className="flex flex-col px-6 border-r border-gray-200 min-h-screen bg-white shadow-sm w-full overflow-y-auto">
            <SidebarContent />
          </div>
        </aside>

        {/* Content area */}
        <main className="flex-1 min-w-0 p-6 md:p-8">
          {renderMainContent()}

          {/* Prev / Next navigation */}
          {!showCertificate && currentItem && (
            <div className="flex items-center justify-between mt-8 max-w-[860px] mx-auto">
              <button
                onClick={() =>
                  hasPrev && setCurrentItem(allItems[currentIdx - 1])
                }
                disabled={!hasPrev}
                className="flex items-center gap-2 px-4 py-2 rounded-xl bg-white border border-gray-200 text-gray-700 hover:border-blue-400 hover:text-blue-600 disabled:opacity-40 disabled:cursor-not-allowed transition-all shadow-sm"
              >
                <ChevronLeft className="w-4 h-4" />
                {t("Previous")}
              </button>

              {hasNext ? (
                <button
                  onClick={() => setCurrentItem(allItems[currentIdx + 1])}
                  className="flex items-center gap-2 px-4 py-2 rounded-xl bg-blue-600 text-white hover:bg-blue-700 transition-all shadow-sm"
                >
                  {t("Next")}
                  <ChevronRight className="w-4 h-4" />
                </button>
              ) : isCertificateUnlocked && hasCertificate ? (
                <button
                  onClick={handleCertificateClick}
                  className="flex items-center gap-2 px-4 py-2 rounded-xl bg-purple-600 text-white hover:bg-purple-700 transition-all shadow-sm"
                >
                  <FaCheckCircle />
                  {t("Get Certificate")}
                </button>
              ) : (
                <span className="text-sm text-gray-400">
                  {t("End of course")}
                </span>
              )}
            </div>
          )}
        </main>
      </div>
    </div>
  );
}

export default CourseSections;
