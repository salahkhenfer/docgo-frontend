import axios from "../utils/axios";

const reviewsAPI = {
  submitCourseReview: (courseId, { rate, comment }) =>
    axios.post(`/Courses/${courseId}/reviews`, { rate, comment }),

  deleteCourseReview: (courseId) =>
    axios.delete(`/Courses/${courseId}/reviews`),

  getCourseReviews: (courseId) => axios.get(`/Courses/${courseId}/reviews`),

  submitProgramReview: (programId, { rate, comment }) =>
    axios.post(`/Programs/${programId}/reviews`, { rate, comment }),

  deleteProgramReview: (programId) =>
    axios.delete(`/Programs/${programId}/reviews`),

  getProgramReviews: (programId) => axios.get(`/Programs/${programId}/reviews`),
};

export default reviewsAPI;
