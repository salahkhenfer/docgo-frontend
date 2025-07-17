# API Client Usage Guide

## Overview

This project uses a centralized API client (`apiClient.js`) that provides consistent HTTP request handling, authentication, and error management across all services.

## Features

✅ **Automatic Authentication**: Includes auth tokens in all requests  
✅ **401 Error Handling**: Automatically logs out users when tokens expire  
✅ **Consistent Base URL**: Uses environment variable `VITE_API_URL`  
✅ **Credentials Support**: Includes cookies for session management  
✅ **Centralized Configuration**: One place to manage all HTTP settings

## How to Use

### 1. Import the API Client

```javascript
import api from "./apiClient";
```

### 2. Make HTTP Requests

```javascript
// GET request
const response = await api.get("/users/courses");
const data = response.data;

// POST request
const response = await api.post("/users/courses/apply", {
    courseId: 123,
    message: "I want to join this course",
});

// PUT request
const response = await api.put("/users/profile", {
    firstName: "John",
    lastName: "Doe",
});

// DELETE request
const response = await api.delete("/users/courses/123");
```

### 3. Handle Errors

```javascript
try {
    const response = await api.get("/some-endpoint");
    return response.data;
} catch (error) {
    console.error("API Error:", error);
    throw error;
}
```

### 4. Upload Files

```javascript
const formData = new FormData();
formData.append("file", file);

const response = await api.post("/upload", formData, {
    headers: {
        "Content-Type": "multipart/form-data",
    },
});
```

### 5. Download Files

```javascript
const response = await api.get("/download/file-id", {
    responseType: "blob",
});

// Create download link
const url = window.URL.createObjectURL(new Blob([response.data]));
const link = document.createElement("a");
link.href = url;
link.setAttribute("download", "filename.pdf");
document.body.appendChild(link);
link.click();
```

## Service Structure

### Create New Services

Always use the shared API client for new services:

```javascript
// services/myNewService.js
import api from "./apiClient";

export const myNewService = {
    getData: async () => {
        try {
            const response = await api.get("/my-endpoint");
            return response.data;
        } catch (error) {
            console.error("Error fetching data:", error);
            throw error;
        }
    },

    // ... other methods
};

export default myNewService;
```

### Updated Services

The following services now use the shared API client:

-   ✅ `courseService.js` - Course management
-   ✅ `VisitTrackerService.jsx` - Visit tracking
-   ⚠️ `authService.js` - Uses separate instance to avoid circular dependency

### Migration Guide

If you have existing services using axios directly:

**Before:**

```javascript
import axios from "axios";

const response = await axios.post(`${API_URL}/endpoint`, data);
```

**After:**

```javascript
import api from "./apiClient";

const response = await api.post("/endpoint", data);
```

## Configuration

The API client is configured in `src/services/apiClient.js`:

-   **Base URL**: Automatically uses `VITE_API_URL` environment variable
-   **Auth Headers**: Automatically adds Bearer token from localStorage/sessionStorage
-   **Error Handling**: Automatically handles 401 errors by logging out users
-   **Credentials**: Includes cookies for session-based authentication

## Environment Variables

Make sure your `.env` file contains:

```env
VITE_API_URL=http://localhost:3000
```

## Benefits

1. **Consistency**: All API calls follow the same pattern
2. **Maintainability**: Changes to HTTP behavior only need to be made in one place
3. **Security**: Automatic token management and logout on auth failures
4. **Error Handling**: Centralized error processing
5. **Performance**: Reuses axios instance for better performance

## Troubleshooting

### Common Issues

1. **401 Errors**: The API client automatically handles these by logging out the user
2. **CORS Issues**: Make sure your backend allows credentials and the correct origin
3. **Token Refresh**: Implement token refresh logic in the request interceptor if needed

### Debug Mode

To see all API requests, add this to your component:

```javascript
import api from "../services/apiClient";

// Log all requests (development only)
if (import.meta.env.DEV) {
    api.interceptors.request.use((request) => {
        console.log("Starting Request:", request);
        return request;
    });
}
```
