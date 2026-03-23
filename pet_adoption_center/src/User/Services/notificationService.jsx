import api from "../../api/axios";

export const getNotifications = async () => {
  try {
    const res = await api.get("/adoptions/notifications", {
      headers: {
        Authorization: `Bearer ${localStorage.getItem("token")}`,
      },
    });

    return res.data.notifications || [];
  } catch (error) {
    console.error("❌ Notification API error:", error);
    return [];
  }
};