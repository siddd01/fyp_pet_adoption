import Swal from "sweetalert2";

const resolveMessage = (message) => {
  if (message === null || message === undefined) return "";
  if (typeof message === "string") return message.trim();
  if (typeof message === "number" || typeof message === "boolean") return String(message);

  if (typeof message === "object") {
    return (
      message.response?.data?.message ||
      message.data?.message ||
      message.error ||
      message.message ||
      JSON.stringify(message)
    );
  }

  return String(message);
};

const inferIcon = (message) => {
  const text = resolveMessage(message).toLowerCase();

  if (!text) return "info";
  if (/(fail|error|invalid|denied|unauthoriz|reject|blocked|cannot|unable|missing)/.test(text)) {
    return "error";
  }
  if (/(warn|permanent|delete|remove|undo)/.test(text)) {
    return "warning";
  }
  if (/(success|created|updated|added|approved|sent|deleted|saved|completed|removed)/.test(text)) {
    return "success";
  }

  return "info";
};

const toast = Swal.mixin({
  toast: true,
  position: "top-end",
  showConfirmButton: false,
  timer: 3200,
  timerProgressBar: true,
  customClass: {
    popup: "app-swal-toast",
    title: "app-swal-toast-title",
  },
});

const modal = Swal.mixin({
  buttonsStyling: false,
  reverseButtons: true,
  showCancelButton: true,
  customClass: {
    popup: "app-swal-popup",
    title: "app-swal-title",
    htmlContainer: "app-swal-content",
    confirmButton: "app-swal-confirm",
    cancelButton: "app-swal-cancel",
    input: "app-swal-input",
    validationMessage: "app-swal-validation",
  },
});

const normalizeConfirmOptions = (input) =>
  typeof input === "string" ? { text: input } : input || {};

const normalizePromptOptions = (input) =>
  typeof input === "string" ? { title: input } : input || {};

export const installAppDialogs = () => {
  if (typeof window === "undefined" || window.__sanoGharDialogsInstalled) {
    return;
  }

  window.__sanoGharDialogsInstalled = true;

  window.appAlert = (message, options = {}) => {
    const text = resolveMessage(message);

    return toast.fire({
      icon: options.icon || inferIcon(text),
      title: options.title || text || "Notice",
      timer: options.timer ?? 3200,
    });
  };

  window.appConfirm = async (input) => {
    const options = normalizeConfirmOptions(input);

    const result = await modal.fire({
      icon: options.icon || "warning",
      title: options.title || "Please confirm",
      text: options.text || "",
      html: options.html,
      footer: options.footer,
      confirmButtonText: options.confirmButtonText || "Continue",
      cancelButtonText: options.cancelButtonText || "Cancel",
      focusCancel: true,
    });

    return result.isConfirmed;
  };

  window.appPrompt = async (input) => {
    const options = normalizePromptOptions(input);

    const result = await modal.fire({
      icon: options.icon || "question",
      title: options.title || "Enter a value",
      text: options.text || "",
      html: options.html,
      input: options.input || "text",
      inputLabel: options.inputLabel,
      inputValue: options.inputValue || "",
      inputPlaceholder: options.inputPlaceholder || "",
      inputAttributes: options.inputAttributes || {},
      confirmButtonText: options.confirmButtonText || "Submit",
      cancelButtonText: options.cancelButtonText || "Cancel",
      preConfirm: (value) => {
        const finalValue =
          typeof value === "string"
            ? options.preserveWhitespace
              ? value
              : value.trim()
            : value;

        if (options.required === false) {
          return finalValue;
        }

        if (!finalValue) {
          Swal.showValidationMessage(options.validationMessage || "This field is required.");
          return false;
        }

        return finalValue;
      },
    });

    if (!result.isConfirmed) {
      return null;
    }

    return result.value;
  };

  window.alert = (message) => window.appAlert(message);
};
