(function setupCodeBuddyContext(global) {
  function createDefaultContext() {
    return {
      student: {
        level: "",
        currentModule: "",
        currentLesson: "",
        completedConcepts: [],
      },
      page: {
        type: "",
        title: "",
        description: "",
        moduleId: null,
        lessonId: null,
        exerciseId: null,
      },
      editor: {
        language: "javascript",
        code: "",
      },
      execution: {
        lastError: "",
        testsPassed: 0,
        testsFailed: 0,
        attempts: 0,
      },
    };
  }

  function cloneContext(value) {
    return JSON.parse(JSON.stringify(value));
  }

  function mergeDefined(current, updates) {
    const merged = { ...current };

    Object.keys(current).forEach((key) => {
      if (updates[key] !== undefined) {
        merged[key] = Array.isArray(updates[key])
          ? [...updates[key]]
          : updates[key];
      }
    });

    return merged;
  }

  let currentContext = createDefaultContext();

  function getContext() {
    return cloneContext(currentContext);
  }

  function updateContext(updates = {}) {
    const safeUpdates =
      updates && typeof updates === "object" ? updates : {};

    currentContext = {
      student: mergeDefined(
        currentContext.student,
        safeUpdates.student || {}
      ),
      page: mergeDefined(currentContext.page, safeUpdates.page || {}),
      editor: mergeDefined(currentContext.editor, safeUpdates.editor || {}),
      execution: mergeDefined(
        currentContext.execution,
        safeUpdates.execution || {}
      ),
    };

    return getContext();
  }

  function resetContext() {
    currentContext = createDefaultContext();
    return getContext();
  }

  global.CodeBuddyContext = {
    getContext,
    updateContext,
    resetContext,
  };
})(window);
