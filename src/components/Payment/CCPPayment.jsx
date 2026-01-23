import PropTypes from "prop-types";
import { useEffect, useRef, useState } from "react";
import { useTranslation } from "react-i18next";
import {
  FaCheckCircle,
  FaClock,
  FaExclamationTriangle,
  FaInfoCircle,
  FaSpinner,
  FaTimesCircle,
  FaUpload,
} from "react-icons/fa";
import { PaymentAPI } from "../../API/Payment";
import { useAppContext } from "../../AppContext";
import RichTextDisplay from "../Common/RichTextDisplay";

const CCPPayment = ({
  itemData,
  itemType,
  amount,
  currency,
  paymentConfig,
  onSuccess,
  onError,
  loading,
  setLoading,
}) => {
  const { t } = useTranslation();
  const { user } = useAppContext();
  const [existingApplication, setExistingApplication] = useState(null);
  const [checkingApplication, setCheckingApplication] = useState(true);
  const [paymentForm, setPaymentForm] = useState({
    fullName: user
      ? `${user.firstName || ""} ${user.lastName || ""}`.trim()
      : "",
    ccpNumber: "",
    transferReference: "",
    phoneNumber: user?.phoneNumber || "",
    email: user?.email || "",
  });
  const [receiptFile, setReceiptFile] = useState(null);
  const [fileName, setFileName] = useState("");
  const [errors, setErrors] = useState({});
  const fileInputRef = useRef(null);

  // Check for existing payment application
  useEffect(() => {
    const checkExistingApplication = async () => {
      if (!itemData?.id) return;

      try {
        setCheckingApplication(true);
        const response = await PaymentAPI.checkPaymentApplication(
          itemType,
          itemData.id,
        );

        if (response.success && response.data.hasApplication) {
          setExistingApplication(response.data);
        }
      } catch (error) {
        console.error("Error checking application:", error);
      } finally {
        setCheckingApplication(false);
      }
    };

    checkExistingApplication();
  }, [itemData?.id, itemType]);

  // CCP account details from configuration
  const ccpAccountDetails = {
    accountNumber: paymentConfig?.accountNumber || "Not configured",
    accountName: paymentConfig?.accountName || "Not configured",
    rib: paymentConfig?.rib || "Not configured",
    bankName: paymentConfig?.bankName || "Algeria Post CCP",
  };

  const validateForm = () => {
    const newErrors = {};

    if (!paymentForm.fullName.trim()) {
      newErrors.fullName = "Full name is required";
    }

    if (!paymentForm.ccpNumber.trim()) {
      newErrors.ccpNumber = "CCP number is required";
    } else if (!/^\d+$/.test(paymentForm.ccpNumber)) {
      newErrors.ccpNumber = "CCP number must contain only digits";
    }

    if (!paymentForm.transferReference.trim()) {
      newErrors.transferReference = "Transfer reference is required";
    }

    if (!paymentForm.phoneNumber.trim()) {
      newErrors.phoneNumber = "Phone number is required";
    } else if (!/^[\d\s\-+()]+$/.test(paymentForm.phoneNumber)) {
      newErrors.phoneNumber = "Invalid phone number format";
    }

    if (!paymentForm.email.trim()) {
      newErrors.email = "Email is required";
    } else if (!/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(paymentForm.email)) {
      newErrors.email = "Invalid email format";
    }

    if (!receiptFile) {
      newErrors.receiptFile = "Payment receipt is required";
    }

    setErrors(newErrors);
    return Object.keys(newErrors).length === 0;
  };

  const handleInputChange = (e) => {
    const { name, value } = e.target;
    setPaymentForm((prev) => ({
      ...prev,
      [name]: value,
    }));
    // Clear error for this field
    if (errors[name]) {
      setErrors((prev) => ({ ...prev, [name]: "" }));
    }
  };

  const handleFileSelect = () => {
    // Reset the input value before opening file picker
    // This allows selecting the same file again
    if (fileInputRef.current) {
      fileInputRef.current.value = null;
    }
    fileInputRef.current?.click();
  };

  const handleFileChange = (event) => {
    const file = event.target.files[0];
    if (file) {
      // Validate file type
      const allowedTypes = [
        "image/jpeg",
        "image/jpg",
        "image/png",
        "application/pdf",
      ];
      if (!allowedTypes.includes(file.type)) {
        setErrors((prev) => ({
          ...prev,
          receiptFile: "Please upload a valid file (JPG, PNG, or PDF)",
        }));
        // Reset file input
        event.target.value = null;
        return;
      }

      // Validate file size (max 5MB)
      if (file.size > 5 * 1024 * 1024) {
        setErrors((prev) => ({
          ...prev,
          receiptFile: "File size must be less than 5MB",
        }));
        // Reset file input
        event.target.value = null;
        return;
      }

      setReceiptFile(file);
      setFileName(file.name);
      setErrors((prev) => ({ ...prev, receiptFile: "" }));
    }
    // Reset file input value to allow selecting the same file again
    event.target.value = null;
  };

  const handleCCPPayment = async (e) => {
    e.preventDefault();

    if (!validateForm()) {
      return;
    }

    setLoading(true);

    try {
      // Prepare payment data
      const paymentData = {
        itemType,
        itemId: itemData?.id,
        itemName: itemData?.Title || itemData?.title,
        description: `${
          itemType.charAt(0).toUpperCase() + itemType.slice(1)
        }: ${itemData?.Title || itemData?.title}`,
      };

      // Create CCP payment with screenshot
      const paymentResult = await PaymentAPI.createCCPPayment(
        paymentData,
        {
          ccpNumber: paymentForm.ccpNumber,
          transferReference: paymentForm.transferReference,
          fullName: paymentForm.fullName,
          phoneNumber: paymentForm.phoneNumber,
          email: paymentForm.email,
        },
        receiptFile,
      );

      if (!paymentResult.success) {
        throw new Error(paymentResult.message);
      }

      // Show success with the actual payment result
      const successPayment = {
        paymentId: paymentResult.data.paymentId,
        method: "ccp",
        amount: paymentResult.data.amount,
        currency: paymentResult.data.currency,
        status: paymentResult.data.status || "pending_verification",
        itemId: itemData?.id,
        itemType,
        reference: paymentForm.transferReference,
        receiptFileName: receiptFile.name,
      };

      onSuccess(successPayment);
    } catch (error) {
      console.error("CCP payment error:", error);

      // If payment upload failed, attempt cleanup to remove any uploaded file
      if (itemData?.id) {
        try {
          await PaymentAPI.cleanupCCPPayment({
            itemType,
            itemId: itemData.id,
          });
        } catch (cleanupError) {
          console.warn(
            "Payment cleanup failed (may be normal if file wasn't uploaded):",
            cleanupError.message,
          );
        }
      }

      onError(error);
    } finally {
      setLoading(false);
    }
  };

  const getStatusBadge = (status) => {
    const statusConfig = {
      pending: {
        icon: FaClock,
        text: "Pending Verification",
        bgColor: "bg-yellow-100",
        textColor: "text-yellow-800",
        borderColor: "border-yellow-200",
      },
      approved: {
        icon: FaCheckCircle,
        text: "Approved",
        bgColor: "bg-green-100",
        textColor: "text-green-800",
        borderColor: "border-green-200",
      },
      rejected: {
        icon: FaTimesCircle,
        text: "Rejected",
        bgColor: "bg-red-100",
        textColor: "text-red-800",
        borderColor: "border-red-200",
      },
      cancelled: {
        icon: FaTimesCircle,
        text: "Cancelled",
        bgColor: "bg-gray-100",
        textColor: "text-gray-800",
        borderColor: "border-gray-200",
      },
    };

    const config = statusConfig[status] || statusConfig.pending;
    const Icon = config.icon;

    return (
      <div
        className={`inline-flex items-center gap-2 px-3 py-1 rounded-full border ${config.bgColor} ${config.textColor} ${config.borderColor}`}
      >
        <Icon className="text-sm" />
        <span className="text-sm font-medium">{config.text}</span>
      </div>
    );
  };

  const formatDate = (dateString) => {
    return new Date(dateString).toLocaleString("en-US", {
      year: "numeric",
      month: "short",
      day: "numeric",
      hour: "2-digit",
      minute: "2-digit",
    });
  };

  // Show loading state while checking for existing application
  if (checkingApplication) {
    return (
      <div className="flex items-center justify-center py-8">
        <FaSpinner className="animate-spin text-3xl text-green-600" />
        <span className="ml-3 text-gray-600">Checking payment status...</span>
      </div>
    );
  }

  // Show existing application if found and not rejected/cancelled
  if (
    existingApplication?.hasApplication &&
    !existingApplication?.canSubmitNew
  ) {
    const app = existingApplication.application;

    return (
      <div className="space-y-6">
        <div className="flex items-center gap-3 mb-6">
          <div className="w-8 h-8 bg-green-600 rounded-full flex items-center justify-center">
            <span className="text-white font-bold text-sm">C</span>
          </div>
          <h3 className="text-lg font-medium text-gray-900">
            Algeria CCP Payment
          </h3>
        </div>

        {/* Existing Application Status */}
        <div className="bg-blue-50 border-2 border-blue-200 rounded-lg p-6">
          <div className="flex items-start gap-4">
            <FaInfoCircle className="text-blue-600 text-2xl mt-1" />
            <div className="flex-1">
              <h4 className="font-semibold text-blue-900 text-lg mb-3">
                Payment Application Already Submitted
              </h4>
              <p className="text-blue-800 mb-4">
                You have already submitted a payment application for this item.
                You cannot submit another payment until the current one is
                processed.
              </p>

              <div className="bg-white rounded-lg p-4 space-y-3">
                <div className="flex justify-between items-center">
                  <span className="text-gray-600 font-medium">Status:</span>
                  {getStatusBadge(app.status)}
                </div>

                <div className="flex justify-between">
                  <span className="text-gray-600 font-medium">Amount:</span>
                  <span className="font-bold text-gray-900">
                    {app.amount} {app.currency}
                  </span>
                </div>

                <div className="flex justify-between">
                  <span className="text-gray-600 font-medium">CCP Number:</span>
                  <span className="font-mono text-gray-900">
                    {app.ccpNumber}
                  </span>
                </div>

                <div className="flex justify-between">
                  <span className="text-gray-600 font-medium">
                    Transaction ID:
                  </span>
                  <span className="font-mono text-gray-900">
                    {app.transactionId}
                  </span>
                </div>

                <div className="flex justify-between">
                  <span className="text-gray-600 font-medium">Submitted:</span>
                  <span className="text-gray-900">
                    {formatDate(app.createdAt)}
                  </span>
                </div>

                {app.status === "pending" && (
                  <div className="mt-4 p-3 bg-yellow-50 border border-yellow-200 rounded-lg">
                    <div className="flex items-center gap-2">
                      <FaClock className="text-yellow-600" />
                      <span className="text-yellow-800 text-sm">
                        Your payment is being verified by our team. This usually
                        takes 24-48 hours.
                      </span>
                    </div>
                  </div>
                )}

                {app.rejectionReason && (
                  <div className="mt-4 p-3 bg-red-50 border border-red-200 rounded-lg">
                    <div className="flex items-start gap-2">
                      <FaExclamationTriangle className="text-red-600 mt-0.5" />
                      <div>
                        <p className="text-red-800 font-medium text-sm mb-1">
                          Rejection Reason:
                        </p>
                        <p className="text-red-700 text-sm">
                          {app.rejectionReason}
                        </p>
                      </div>
                    </div>
                  </div>
                )}
              </div>
            </div>
          </div>
        </div>
      </div>
    );
  }

  return (
    <div className="space-y-6">
      <div className="flex items-center gap-3 mb-6">
        <div className="w-8 h-8 bg-green-600 rounded-full flex items-center justify-center">
          <span className="text-white font-bold text-sm">C</span>
        </div>
        <h3 className="text-lg font-medium text-gray-900">
          {t("paymentPage.ccpPaymentForm.title")}
        </h3>
      </div>

      {/* Payment Instructions - Rich Text or Default */}
      <div className="bg-green-50 border border-green-200 rounded-lg p-4">
        <div className="flex items-start gap-3">
          <FaInfoCircle className="text-green-600 mt-1" />
          <div className="flex-1">
            <h4 className="font-medium text-green-900 mb-2">
              {t("paymentPage.ccpPaymentForm.paymentInstructions")}
            </h4>
            {paymentConfig?.instructions ? (
              <RichTextDisplay
                content={paymentConfig.instructions}
                className="text-sm"
                textClassName="text-green-800"
              />
            ) : (
              <ol className="text-sm text-green-800 space-y-1 list-decimal list-inside">
                <li>{t("paymentPage.ccpPaymentForm.instruction1")}</li>
                <li>{t("paymentPage.ccpPaymentForm.instruction2")}</li>
                <li>{t("paymentPage.ccpPaymentForm.instruction3")}</li>
                <li>{t("paymentPage.ccpPaymentForm.instruction4")}</li>
                <li>{t("paymentPage.ccpPaymentForm.instruction5")}</li>
              </ol>
            )}
          </div>
        </div>
      </div>

      {/* CCP Account Details */}
      <div className="bg-gradient-to-br from-gray-50 to-gray-100 border-2 border-gray-300 rounded-lg p-5 shadow-sm">
        <h4 className="font-semibold text-gray-900 mb-4 text-lg flex items-center gap-2">
          <FaInfoCircle className="text-green-600" />
          {t("paymentPage.ccpPaymentForm.transferToAccount")}
        </h4>
        <div className="bg-white rounded-lg p-4 space-y-3 shadow-sm">
          <div className="flex justify-between items-center py-2 border-b">
            <span className="text-gray-600 font-medium">
              {t("paymentPage.ccpPaymentForm.accountNumber")}:
            </span>
            <span className="font-mono font-bold text-gray-900 text-lg">
              {ccpAccountDetails.accountNumber}
            </span>
          </div>
          <div className="flex justify-between items-center py-2 border-b">
            <span className="text-gray-600 font-medium">
              {t("paymentPage.ccpPaymentForm.accountName")}:
            </span>
            <span className="font-semibold text-gray-900">
              {ccpAccountDetails.accountName}
            </span>
          </div>
          <div className="flex justify-between items-center py-2 border-b">
            <span className="text-gray-600 font-medium">
              {t("paymentPage.ccpPaymentForm.rib")}:
            </span>
            <span className="font-mono font-medium text-gray-900">
              {ccpAccountDetails.rib}
            </span>
          </div>
          <div className="flex justify-between items-center py-2 border-b">
            <span className="text-gray-600 font-medium">
              {t("paymentPage.ccpPaymentForm.bank")}:
            </span>
            <span className="font-medium text-gray-900">
              {ccpAccountDetails.bankName}
            </span>
          </div>
          <div className="flex justify-between items-center py-3 bg-green-50 -mx-4 px-4 rounded-b-lg">
            <span className="text-gray-700 font-semibold text-lg">
              {t("paymentPage.ccpPaymentForm.amountToPay")}:
            </span>
            <span className="font-bold text-2xl text-green-600">
              {amount} {currency}
            </span>
          </div>
        </div>
      </div>

      {/* Payment Form */}
      <form onSubmit={handleCCPPayment} className="space-y-5">
        <div className="bg-white border-2 border-gray-200 rounded-lg p-6 shadow-sm">
          <h4 className="font-semibold text-gray-900 mb-4 text-lg">
            {t("paymentPage.ccpPaymentForm.yourInformation")}
          </h4>

          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            {/* Full Name */}
            <div>
              <label
                htmlFor="fullName"
                className="block text-sm font-semibold text-gray-700 mb-2"
              >
                {t("paymentPage.ccpPaymentForm.fullName")}{" "}
                <span className="text-red-500">*</span>
              </label>
              <input
                type="text"
                id="fullName"
                name="fullName"
                value={paymentForm.fullName}
                onChange={handleInputChange}
                required
                className={`w-full px-4 py-3 border-2 rounded-lg focus:outline-none focus:ring-2 focus:ring-green-500 transition-all ${
                  errors.fullName ? "border-red-500" : "border-gray-300"
                }`}
                placeholder={t(
                  "paymentPage.ccpPaymentForm.fullNamePlaceholder",
                )}
              />
              {errors.fullName && (
                <p className="mt-1 text-sm text-red-600">{errors.fullName}</p>
              )}
            </div>

            {/* CCP Number */}
            <div>
              <label
                htmlFor="ccpNumber"
                className="block text-sm font-semibold text-gray-700 mb-2"
              >
                {t("paymentPage.ccpPaymentForm.ccpNumber")}{" "}
                <span className="text-red-500">*</span>
              </label>
              <input
                type="text"
                id="ccpNumber"
                name="ccpNumber"
                value={paymentForm.ccpNumber}
                onChange={handleInputChange}
                required
                className={`w-full px-4 py-3 border-2 rounded-lg focus:outline-none focus:ring-2 focus:ring-green-500 transition-all font-mono ${
                  errors.ccpNumber ? "border-red-500" : "border-gray-300"
                }`}
                placeholder={t(
                  "paymentPage.ccpPaymentForm.ccpNumberPlaceholder",
                )}
              />
              {errors.ccpNumber && (
                <p className="mt-1 text-sm text-red-600">{errors.ccpNumber}</p>
              )}
            </div>

            {/* Transfer Reference */}
            <div>
              <label
                htmlFor="transferReference"
                className="block text-sm font-semibold text-gray-700 mb-2"
              >
                {t("paymentPage.ccpPaymentForm.transferReference")}{" "}
                <span className="text-red-500">*</span>
              </label>
              <input
                type="text"
                id="transferReference"
                name="transferReference"
                value={paymentForm.transferReference}
                onChange={handleInputChange}
                required
                className={`w-full px-4 py-3 border-2 rounded-lg focus:outline-none focus:ring-2 focus:ring-green-500 transition-all font-mono ${
                  errors.transferReference
                    ? "border-red-500"
                    : "border-gray-300"
                }`}
                placeholder={t(
                  "paymentPage.ccpPaymentForm.transferReferencePlaceholder",
                )}
              />
              {errors.transferReference && (
                <p className="mt-1 text-sm text-red-600">
                  {errors.transferReference}
                </p>
              )}
              <p className="mt-1 text-xs text-gray-500">
                {t("paymentPage.ccpPaymentForm.transferReferenceHelp")}
              </p>
            </div>

            {/* Phone Number */}
            <div>
              <label
                htmlFor="phoneNumber"
                className="block text-sm font-semibold text-gray-700 mb-2"
              >
                {t("paymentPage.ccpPaymentForm.phoneNumber")}{" "}
                <span className="text-red-500">*</span>
              </label>
              <input
                type="tel"
                id="phoneNumber"
                name="phoneNumber"
                value={paymentForm.phoneNumber}
                onChange={handleInputChange}
                required
                className={`w-full px-4 py-3 border-2 rounded-lg focus:outline-none focus:ring-2 focus:ring-green-500 transition-all ${
                  errors.phoneNumber ? "border-red-500" : "border-gray-300"
                }`}
                placeholder={t(
                  "paymentPage.ccpPaymentForm.phoneNumberPlaceholder",
                )}
              />
              {errors.phoneNumber && (
                <p className="mt-1 text-sm text-red-600">
                  {errors.phoneNumber}
                </p>
              )}
            </div>

            {/* Email */}
            <div className="md:col-span-2">
              <label
                htmlFor="email"
                className="block text-sm font-semibold text-gray-700 mb-2"
              >
                {t("paymentPage.ccpPaymentForm.email")}{" "}
                <span className="text-red-500">*</span>
              </label>
              <input
                type="email"
                id="email"
                name="email"
                value={paymentForm.email}
                onChange={handleInputChange}
                required
                className={`w-full px-4 py-3 border-2 rounded-lg focus:outline-none focus:ring-2 focus:ring-green-500 transition-all ${
                  errors.email ? "border-red-500" : "border-gray-300"
                }`}
                placeholder={t("paymentPage.ccpPaymentForm.emailPlaceholder")}
              />
              {errors.email && (
                <p className="mt-1 text-sm text-red-600">{errors.email}</p>
              )}
            </div>
          </div>
        </div>

        {/* File Upload Section */}
        <div className="bg-white border-2 border-gray-200 rounded-lg p-6 shadow-sm">
          <h4 className="font-semibold text-gray-900 mb-4 text-lg">
            {t("paymentPage.ccpPaymentForm.uploadReceiptRequired")}
          </h4>

          <div className="space-y-4">
            <div className="flex items-center justify-center w-full">
              <label
                htmlFor="receipt-upload"
                className={`flex flex-col items-center justify-center w-full h-48 border-3 border-dashed rounded-lg cursor-pointer transition-all ${
                  errors.receiptFile
                    ? "border-red-500 bg-red-50 hover:bg-red-100"
                    : "border-green-500 bg-green-50 hover:bg-green-100"
                } ${fileName ? "border-solid bg-green-100" : ""}`}
              >
                <div className="flex flex-col items-center justify-center pt-5 pb-6 px-4 text-center">
                  {fileName ? (
                    <>
                      <FaCheckCircle className="w-12 h-12 mb-3 text-green-600" />
                      <p className="mb-2 text-sm font-semibold text-green-700">
                        {t("paymentPage.ccpPaymentForm.fileSelected")}
                      </p>
                      <p className="text-sm text-green-600 break-all">
                        {fileName}
                      </p>
                      <p className="text-xs text-green-500 mt-2">
                        {t("paymentPage.ccpPaymentForm.clickToChange")}
                      </p>
                    </>
                  ) : (
                    <>
                      <FaUpload className="w-12 h-12 mb-3 text-green-600" />
                      <p className="mb-2 text-sm text-gray-700">
                        <span className="font-semibold">
                          {t("paymentPage.ccpPaymentForm.clickToUpload")}
                        </span>{" "}
                        {t("paymentPage.ccpPaymentForm.yourReceipt")}
                      </p>
                      <p className="text-xs text-gray-500">
                        {t("paymentPage.ccpPaymentForm.acceptedFormats")}
                      </p>
                    </>
                  )}
                </div>
                <input
                  id="receipt-upload"
                  ref={fileInputRef}
                  type="file"
                  className="hidden"
                  accept="image/jpeg,image/jpg,image/png,application/pdf"
                  onChange={handleFileChange}
                />
              </label>
            </div>
            {errors.receiptFile && (
              <p className="text-sm text-red-600 text-center">
                {errors.receiptFile}
              </p>
            )}
          </div>
        </div>

        {/* Submit Button */}
        <button
          type="submit"
          disabled={loading}
          className="w-full bg-gradient-to-r from-green-600 to-green-700 hover:from-green-700 hover:to-green-800 text-white font-bold py-4 px-6 rounded-lg transition-all duration-200 flex items-center justify-center gap-3 shadow-lg hover:shadow-xl disabled:opacity-50 disabled:cursor-not-allowed text-lg"
        >
          {loading ? (
            <>
              <FaSpinner className="animate-spin text-xl" />
              <span>{t("paymentPage.ccpPaymentForm.submittingPayment")}</span>
            </>
          ) : (
            <>
              <FaCheckCircle className="text-xl" />
              <span>
                {t("paymentPage.ccpPaymentForm.submitForVerification")}
              </span>
            </>
          )}
        </button>

        <p className="text-sm text-gray-600 text-center">
          {t("paymentPage.ccpPaymentForm.confirmationMessage")}
        </p>
      </form>
    </div>
  );
};

CCPPayment.propTypes = {
  itemData: PropTypes.object.isRequired,
  itemType: PropTypes.string.isRequired,
  amount: PropTypes.oneOfType([PropTypes.string, PropTypes.number]).isRequired,
  currency: PropTypes.string.isRequired,
  paymentConfig: PropTypes.object,
  onSuccess: PropTypes.func.isRequired,
  onError: PropTypes.func.isRequired,
  loading: PropTypes.bool.isRequired,
  setLoading: PropTypes.func.isRequired,
};

export default CCPPayment;
