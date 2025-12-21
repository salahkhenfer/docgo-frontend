import apiClient from "../services/apiClient";

// Enrollment API for managing course and program applications and enrollments
export const EnrollmentAPI = {
    // =================================================================
    // COURSE ENROLLMENT METHODS
    // =================================================================

    // Apply for a course (creates Course_Applications)
    applyCourse: async (courseData) => {
        try {
            const response = await apiClient.post(
                "/enrollment/courses/apply",
                courseData
            );

            return {
                success: true,
                data: response.data.data,
                message: "Course application submitted successfully",
            };
        } catch (error) {
            console.error("Course application error:", error);
            return {
                success: false,
                message:
                    error.response?.data?.message ||
                    "Failed to submit course application",
                error: error.response?.data?.error || error.message,
            };
        }
    },

    // Enroll in a free course
    enrollFreeCourse: async (courseData) => {
        try {
            const response = await apiClient.post(
                "/enrollment/courses/enroll-free",
                courseData
            );

            return {
                success: true,
                data: response.data.data,
                message: "Successfully enrolled in free course",
            };
        } catch (error) {
            console.error("Free course enrollment error:", error);
            return {
                success: false,
                message:
                    error.response?.data?.message ||
                    "Failed to enroll in free course",
                error: error.response?.data?.error || error.message,
            };
        }
    },

    // Get course progress
    getCourseProgress: async (courseId) => {
        try {
            const response = await apiClient.get(
                `/enrollment/courses/${courseId}/progress`
            );

            return {
                success: true,
                data: response.data.data,
                message: "Course progress fetched successfully",
            };
        } catch (error) {
            // 404 is expected when no progress exists yet
            if (error.response?.status !== 404) {
                console.error("Get course progress error:", error);
            }
            return {
                success: false,
                message:
                    error.response?.data?.message ||
                    "Failed to fetch course progress",
                error: error.response?.data?.error || error.message,
            };
        }
    },

    // Update course progress
    updateCourseProgress: async (courseId, progressData) => {
        try {
            const response = await apiClient.put(
                `/enrollment/courses/${courseId}/progress`,
                progressData
            );

            return {
                success: true,
                data: response.data.data,
                message: "Course progress updated successfully",
            };
        } catch (error) {
            console.error("Update course progress error:", error);
            return {
                success: false,
                message:
                    error.response?.data?.message ||
                    "Failed to update course progress",
                error: error.response?.data?.error || error.message,
            };
        }
    },

    // Submit quiz results
    submitQuizResults: async (courseId, quizData) => {
        try {
            const response = await apiClient.post(
                `/enrollment/courses/${courseId}/quiz-results`,
                quizData
            );

            return {
                success: true,
                data: response.data.data,
                message: "Quiz results submitted successfully",
            };
        } catch (error) {
            console.error("Submit quiz results error:", error);
            return {
                success: false,
                message:
                    error.response?.data?.message ||
                    "Failed to submit quiz results",
                error: error.response?.data?.error || error.message,
            };
        }
    },

    // =================================================================
    // PROGRAM ENROLLMENT METHODS
    // =================================================================

    // Apply for a program (creates Program_Applications)
    applyProgram: async (programData) => {
        try {
            const response = await apiClient.post(
                "/enrollment/programs/apply",
                programData
            );

            return {
                success: true,
                data: response.data.data,
                message: "Program application submitted successfully",
            };
        } catch (error) {
            console.error("Program application error:", error);
            return {
                success: false,
                message:
                    error.response?.data?.message ||
                    "Failed to submit program application",
                error: error.response?.data?.error || error.message,
            };
        }
    },

    // Enroll in a free program
    enrollFreeProgram: async (programData) => {
        try {
            const response = await apiClient.post(
                "/enrollment/programs/enroll-free",
                programData
            );

            return {
                success: true,
                data: response.data.data,
                message: "Successfully enrolled in free program",
            };
        } catch (error) {
            console.error("Free program enrollment error:", error);
            return {
                success: false,
                message:
                    error.response?.data?.message ||
                    "Failed to enroll in free program",
                error: error.response?.data?.error || error.message,
            };
        }
    },

    // Get program progress
    getProgramProgress: async (programId) => {
        try {
            const response = await apiClient.get(
                `/enrollment/programs/${programId}/progress`
            );

            return {
                success: true,
                data: response.data.data,
                message: "Program progress fetched successfully",
            };
        } catch (error) {
            console.error("Get program progress error:", error);
            return {
                success: false,
                message:
                    error.response?.data?.message ||
                    "Failed to fetch program progress",
                error: error.response?.data?.error || error.message,
            };
        }
    },

    // =================================================================
    // DASHBOARD AND OVERVIEW METHODS
    // =================================================================

    // Get dashboard overview
    getDashboardOverview: async () => {
        try {
            const response = await apiClient.get("/enrollment/dashboard");

            return {
                success: true,
                data: response.data.data,
                message: "Dashboard overview fetched successfully",
            };
        } catch (error) {
            console.error("Get dashboard overview error:", error);
            return {
                success: false,
                message:
                    error.response?.data?.message ||
                    "Failed to fetch dashboard overview",
                error: error.response?.data?.error || error.message,
            };
        }
    },

    // Get user's course applications
    getCourseApplications: async (params = {}) => {
        try {
            const response = await apiClient.get(
                "/enrollment/courses/my-applications",
                { params }
            );

            return {
                success: true,
                data: response.data.data,
                message: "Course applications fetched successfully",
            };
        } catch (error) {
            console.error("Get course applications error:", error);
            return {
                success: false,
                message:
                    error.response?.data?.message ||
                    "Failed to fetch course applications",
                error: error.response?.data?.error || error.message,
            };
        }
    },

    // Get user's program applications
    getProgramApplications: async (params = {}) => {
        try {
            const response = await apiClient.get(
                "/enrollment/programs/my-applications",
                { params }
            );

            return {
                success: true,
                data: response.data.data,
                message: "Program applications fetched successfully",
            };
        } catch (error) {
            console.error("Get program applications error:", error);
            return {
                success: false,
                message:
                    error.response?.data?.message ||
                    "Failed to fetch program applications",
                error: error.response?.data?.error || error.message,
            };
        }
    },

    // Get user's program enrollments
    getProgramEnrollments: async (params = {}) => {
        try {
            const response = await apiClient.get(
                "/enrollment/programs/my-enrollments",
                { params }
            );

            return {
                success: true,
                data: response.data.data,
                message: "Program enrollments fetched successfully",
            };
        } catch (error) {
            console.error("Get program enrollments error:", error);
            return {
                success: false,
                message:
                    error.response?.data?.message ||
                    "Failed to fetch program enrollments",
                error: error.response?.data?.error || error.message,
            };
        }
    },
};

export default EnrollmentAPI;
