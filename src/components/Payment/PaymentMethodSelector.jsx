import { FaCheck } from "react-icons/fa";
import PropTypes from "prop-types";
import RichTextDisplay from "../Common/RichTextDisplay";

const PaymentMethodSelector = ({ methods, selectedMethod, onMethodChange }) => {
    return (
        <div className="grid gap-4">
            {methods.map((method) => (
                <div key={method.id} className="space-y-3">
                    <button
                        onClick={() => onMethodChange(method.id)}
                        disabled={!method.available}
                        className={`
                            relative p-4 border-2 rounded-lg transition-all duration-200 w-full
                            ${
                                selectedMethod === method.id
                                    ? "border-blue-500 bg-blue-50"
                                    : "border-gray-200 bg-white hover:border-gray-300"
                            }
                            ${
                                !method.available
                                    ? "opacity-50 cursor-not-allowed"
                                    : "cursor-pointer"
                            }
                        `}
                    >
                        <div className="flex items-center gap-4">
                            {/* Method Icon */}
                            <div className="w-12 h-12 bg-gray-100 rounded-lg flex items-center justify-center">
                                {method.icon ? (
                                    <img
                                        src={method.icon}
                                        alt={method.name}
                                        className="w-8 h-8 object-contain"
                                    />
                                ) : (
                                    <div className="w-8 h-8 bg-gray-300 rounded"></div>
                                )}
                            </div>

                            {/* Method Info */}
                            <div className="flex-1 text-left">
                                <h3 className="font-medium text-gray-900">
                                    {method.name}
                                </h3>
                                <p className="text-sm text-gray-600">
                                    {method.description}
                                </p>
                                {!method.available && (
                                    <p className="text-xs text-red-500 mt-1">
                                        Currently unavailable
                                    </p>
                                )}
                                {method.isEnabled === false && (
                                    <p className="text-xs text-yellow-600 mt-1">
                                        Temporarily disabled
                                    </p>
                                )}
                            </div>

                            {/* Selection Indicator */}
                            <div
                                className={`
                                w-6 h-6 rounded-full border-2 flex items-center justify-center
                                ${
                                    selectedMethod === method.id
                                        ? "border-blue-500 bg-blue-500"
                                        : "border-gray-300"
                                }
                            `}
                            >
                                {selectedMethod === method.id && (
                                    <FaCheck className="text-white text-xs" />
                                )}
                            </div>
                        </div>
                    </button>

                    {/* Show detailed instructions when selected */}
                    {selectedMethod === method.id &&
                        method.detailedInstructions && (
                            <div className="ml-16 p-4 bg-blue-50 border border-blue-200 rounded-lg">
                                <h4 className="font-medium text-blue-900 mb-2">
                                    Payment Instructions
                                </h4>
                                <RichTextDisplay
                                    content={method.detailedInstructions}
                                    className="text-sm"
                                    textClassName="text-blue-800"
                                />
                            </div>
                        )}
                </div>
            ))}
        </div>
    );
};

PaymentMethodSelector.propTypes = {
    methods: PropTypes.arrayOf(
        PropTypes.shape({
            id: PropTypes.string.isRequired,
            name: PropTypes.string.isRequired,
            description: PropTypes.string.isRequired,
            icon: PropTypes.string,
            available: PropTypes.bool.isRequired,
            enabled: PropTypes.bool,
            isEnabled: PropTypes.bool,
            detailedInstructions: PropTypes.string,
        })
    ).isRequired,
    selectedMethod: PropTypes.string.isRequired,
    onMethodChange: PropTypes.func.isRequired,
};

export default PaymentMethodSelector;
