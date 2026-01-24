import Swal from "sweetalert2";
import i18n from "../i18n";

/**
 * Helper function to show sweet alerts with i18n support
 * Automatically handles language-based text and RTL direction
 */
export const showAlert = async (options) => {
  const { t } = i18n;
  const isRTL = i18n.language === "ar";

  // Default configuration
  const defaultConfig = {
    allowOutsideClick: true,
    allowEscapeKey: true,
    customClass: {
      popup: "rounded-lg shadow-xl",
      title: "text-lg font-semibold text-gray-900",
      content: "text-gray-600",
    },
  };

  // Translate title and text if they are translation keys
  const config = {
    ...defaultConfig,
    ...options,
    title: options.title || "",
    text: options.text || "",
    // Apply RTL direction
    direction: isRTL ? "rtl" : "ltr",
  };

  return await Swal.fire(config);
};

/**
 * Show success alert
 */
export const showSuccess = async (titleKey, textKey = null, options = {}) => {
  const { t } = i18n;

  return showAlert({
    icon: "success",
    title: t(titleKey),
    text: textKey ? t(textKey) : "",
    confirmButtonColor: "#10b981",
    confirmButtonText: t("common.ok", "OK"),
    ...options,
  });
};

/**
 * Show error alert
 */
export const showError = async (titleKey, textKey = null, options = {}) => {
  const { t } = i18n;

  return showAlert({
    icon: "error",
    title: t(titleKey),
    text: textKey ? t(textKey) : "",
    confirmButtonColor: "#ef4444",
    confirmButtonText: t("common.ok", "OK"),
    ...options,
  });
};

/**
 * Show info alert
 */
export const showInfo = async (titleKey, textKey = null, options = {}) => {
  const { t } = i18n;

  return showAlert({
    icon: "info",
    title: t(titleKey),
    text: textKey ? t(textKey) : "",
    confirmButtonColor: "#3b82f6",
    confirmButtonText: t("common.ok", "OK"),
    ...options,
  });
};

/**
 * Show warning alert
 */
export const showWarning = async (titleKey, textKey = null, options = {}) => {
  const { t } = i18n;

  return showAlert({
    icon: "warning",
    title: t(titleKey),
    text: textKey ? t(textKey) : "",
    confirmButtonColor: "#f59e0b",
    confirmButtonText: t("common.ok", "OK"),
    ...options,
  });
};

/**
 * Show confirmation dialog
 */
export const showConfirmation = async (
  titleKey,
  textKey = null,
  options = {}
) => {
  const { t } = i18n;

  return showAlert({
    icon: "warning",
    title: t(titleKey),
    text: textKey ? t(textKey) : "",
    showCancelButton: true,
    confirmButtonColor: "#3b82f6",
    cancelButtonColor: "#6b7280",
    confirmButtonText: t("common.yes", "Yes"),
    cancelButtonText: t("common.cancel", "Cancel"),
    ...options,
  });
};

/**
 * Show enrollment success
 */
export const showEnrollmentSuccess = async () => {
  const { t } = i18n;

  return showSuccess(
    "alerts.enrollment.successTitle",
    "alerts.enrollment.successText",
    {
      confirmButtonText: t("alerts.enrollment.startLearning"),
    }
  );
};

/**
 * Show enrollment error
 */
export const showEnrollmentError = async (errorMessage = null) => {
  const { t } = i18n;

  return showError("alerts.enrollment.failedTitle", null, {
    text: errorMessage || t("alerts.enrollment.failedText"),
  });
};

/**
 * Show application success
 */
export const showApplicationSuccess = async () => {
  const { t } = i18n;

  return showSuccess(
    "alerts.application.successTitle",
    "alerts.application.successText",
    {
      confirmButtonText: t("alerts.application.viewApplications"),
    }
  );
};

/**
 * Show application error
 */
export const showApplicationError = async (errorMessage = null) => {
  const { t } = i18n;

  return showError("alerts.application.failedTitle", null, {
    text: errorMessage || t("alerts.application.failedText"),
  });
};

/**
 * Show payment pending
 */
export const showPaymentPending = async (transactionId) => {
  const { t } = i18n;

  return showInfo("alerts.payment.pendingTitle", null, {
    html: `${t("alerts.payment.pendingText")}<br/><br/>
           <strong>${t("alerts.payment.transactionId")}</strong> ${transactionId}<br/><br/>
           ${t("common.waitingForApproval", "Vous serez notifié une fois approuvé")}`,
    confirmButtonText: t("common.ok", "OK"),
  });
};

/**
 * Show certificate generating
 */
export const showCertificateGenerating = async () => {
  const { t } = i18n;

  return showAlert({
    title: t("alerts.certificate.generatingTitle"),
    html: t("alerts.certificate.generatingText"),
    allowOutsideClick: false,
    allowEscapeKey: false,
    didOpen: (modal) => {
      Swal.showLoading();
    },
  });
};

/**
 * Show quiz incomplete
 */
export const showQuizIncomplete = async () => {
  const { t } = i18n;

  return showWarning(
    "alerts.quiz.incompleteTitle",
    "alerts.quiz.incompleteText"
  );
};

/**
 * Show quiz success
 */
export const showQuizSuccess = async (score) => {
  const { t } = i18n;

  const passText = t("alerts.quiz.passText").replace("{{score}}", score);

  return showSuccess("alerts.quiz.successTitle", null, {
    html: `<strong>${passText}</strong>`,
    confirmButtonText: t("alerts.quiz.viewResults"),
  });
};

/**
 * Show quiz fail
 */
export const showQuizFail = async (score) => {
  const { t } = i18n;

  const failText = t("alerts.quiz.failText").replace("{{score}}", score);

  return showInfo("alerts.quiz.failTitle", null, {
    html: failText,
    confirmButtonText: t("alerts.quiz.viewResults"),
  });
};

/**
 * Close alert
 */
export const closeAlert = () => {
  Swal.close();
};

export default {
  showAlert,
  showSuccess,
  showError,
  showInfo,
  showWarning,
  showConfirmation,
  showEnrollmentSuccess,
  showEnrollmentError,
  showApplicationSuccess,
  showApplicationError,
  showPaymentPending,
  showCertificateGenerating,
  showQuizIncomplete,
  showQuizSuccess,
  showQuizFail,
  closeAlert,
};
