const API_URL = "https://ai-learning-agent-gwil.onrender.com";

export const apiRequest = async (
  endpoint,
  options = {}
) => {
  const response = await fetch(
    `${API_URL}${endpoint}`,
    {
      ...options,
      headers: {
        "Content-Type": "application/json",
        ...(options.headers || {}),
      },
    }
  );

  const data = await response.json();

  if (!response.ok) {
    throw new Error(
      data.detail || "Something went wrong."
    );
  }

  return data;
};


// ====================
// Authentication
// ====================

export const registerUser = async (userData) => {
  return apiRequest(
    "/auth/register",
    {
      method: "POST",
      body: JSON.stringify(userData),
    }
  );
};


export const loginUser = async (credentials) => {
  return apiRequest(
    "/auth/login",
    {
      method: "POST",
      body: JSON.stringify(credentials),
    }
  );
};


// ====================
// AI Tutor
// ====================

export const askTutor = async (question, history = []) => {
  const token = localStorage.getItem("access_token");

  return apiRequest("/tutor/ask", {
    method: "POST",
    headers: {
      Authorization: `Bearer ${token}`,
    },
    body: JSON.stringify({
      question,
      history,
    }),
  });
};


// ====================
// Quiz
// ====================

export const generateQuiz = async (topic, numQuestions) => {
  const token = localStorage.getItem("access_token");

  return apiRequest("/quiz/generate", {
    method: "POST",
    headers: {
      Authorization: `Bearer ${token}`,
    },
    body: JSON.stringify({
      topic,
      num_questions: numQuestions,
    }),
  });
};

export const saveQuizResult = async (topic, score, total) => {
  const token = localStorage.getItem("access_token");

  return apiRequest("/quiz/result", {
    method: "POST",
    headers: {
      Authorization: `Bearer ${token}`,
    },
    body: JSON.stringify({
      topic,
      score,
      total,
    }),
  });
};


// ====================
// Interview
// ====================

export const startInterview = async (topic) => {
  const token = localStorage.getItem("access_token");

  return apiRequest("/interview/start", {
    method: "POST",
    headers: {
      Authorization: `Bearer ${token}`,
    },
    body: JSON.stringify({
      topic,
    }),
  });
};


export const submitInterviewAnswer = async (data) => {
  const token = localStorage.getItem("access_token");

  return apiRequest("/interview/answer", {
    method: "POST",
    headers: {
      Authorization: `Bearer ${token}`,
    },
    body: JSON.stringify(data),
  });
};


// ====================
// Planner
// ====================

export const getLearningPlan = async () => {
  const token = localStorage.getItem("access_token");

  return apiRequest("/planner", {
    method: "GET",
    headers: {
      Authorization: `Bearer ${token}`,
    },
  });
};


// ====================
// Evaluation
// ====================

export const evaluateAnswer = async (question, answer) => {
  const token = localStorage.getItem("access_token");

  return apiRequest("/evaluation/answer", {
    method: "POST",
    headers: {
      Authorization: `Bearer ${token}`,
    },
    body: JSON.stringify({
      question,
      student_answer: answer,
    }),
  });
};


export const evaluateRag = async (
  question,
  answer
) => {
  return apiRequest(
    "/evaluation/rag",
    {
      method: "POST",
      body: JSON.stringify({
        question,
        answer,
      }),
    }
  );
};


// ====================
// Progress
// ====================

export const getProgress = async () => {
  const token = localStorage.getItem("access_token");

  return apiRequest("/progress", {
    method: "GET",
    headers: {
      Authorization: `Bearer ${token}`,
    },
  });
};


// ====================
// Documents
// ====================

export const uploadDocument = async (file) => {
  const token = localStorage.getItem("access_token");

  const formData = new FormData();
  formData.append("file", file);

  const response = await fetch(`${API_URL}/documents/upload`, {
    method: "POST",
    headers: {
      Authorization: `Bearer ${token}`,
    },
    body: formData,
  });

  const data = await response.json();

  if (!response.ok) {
    throw new Error(data.detail || "Document upload failed.");
  }

  return data;
};

export const getDocuments = async () => {
  const token = localStorage.getItem("access_token");

  return apiRequest("/documents", {
    method: "GET",
    headers: {
      Authorization: `Bearer ${token}`,
    },
  });
};

export const deleteDocument = async (filename) => {
  const token = localStorage.getItem("access_token");

  return apiRequest(
    `/documents/${encodeURIComponent(filename)}`,
    {
      method: "DELETE",
      headers: {
        Authorization: `Bearer ${token}`,
      },
    }
  );
};

// Usage
export const getUsage = async () => {
  const token = localStorage.getItem("access_token");

  return apiRequest("/usage", {
    method: "GET",
    headers: {
      Authorization: `Bearer ${token}`,
    },
  });
};