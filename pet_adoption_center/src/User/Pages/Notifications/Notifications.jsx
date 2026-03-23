import { useEffect, useState } from "react";
import { getNotifications } from "../../Services/notificationService";

const statusConfig = {
  approved: {
    label: "Approved",
    dot: "#4ade80",
    bg: "rgba(74,222,128,0.08)",
    border: "rgba(74,222,128,0.25)",
    text: "#166534",
  },
  rejected: {
    label: "Rejected",
    dot: "#f87171",
    bg: "rgba(248,113,113,0.08)",
    border: "rgba(248,113,113,0.25)",
    text: "#991b1b",
  },
  pending: {
    label: "Pending",
    dot: "#fbbf24",
    bg: "rgba(251,191,36,0.08)",
    border: "rgba(251,191,36,0.25)",
    text: "#92400e",
  },
};

const styles = `
  @import url('https://fonts.googleapis.com/css2?family=DM+Serif+Display:ital@0;1&family=DM+Sans:wght@300;400;500&display=swap');

  .notif-root {
    min-height: 100vh;
    background: #f5f0e8;
    font-family: 'DM Sans', sans-serif;
    padding: 52px 40px;
  }

  .notif-inner {
    max-width: 72rem; /* ~max-w-6xl */
    margin: 0 auto;
    width: 100%;
  }

  .main-header {
    display: flex;
    justify-content: space-between;
    align-items: flex-end;
    margin-bottom: 40px;
    border-bottom: 1px solid rgba(90,70,40,0.12);
    padding-bottom: 28px;
  }

  .main-title {
    font-family: 'DM Serif Display', serif;
    font-size: 48px;
    color: #1a1510;
    line-height: 1;
    letter-spacing: -1px;
  }

  .main-title em {
    font-style: italic;
    color: #8b6d3f;
  }

  .main-meta {
    font-size: 12px;
    color: rgba(26,21,16,0.35);
    letter-spacing: 0.5px;
    text-align: right;
    line-height: 1.7;
  }

  .stats-row {
    display: flex;
    gap: 10px;
    margin-bottom: 32px;
    flex-wrap: wrap;
  }

  .stat-chip {
    display: flex;
    align-items: center;
    gap: 7px;
    padding: 7px 16px;
    border-radius: 100px;
    border: 1px solid rgba(90,70,40,0.13);
    background: #faf7f2;
    font-size: 12px;
    color: rgba(26,21,16,0.55);
    cursor: pointer;
    transition: all 0.18s ease;
    font-family: 'DM Sans', sans-serif;
  }

  .stat-chip:hover {
    border-color: rgba(90,70,40,0.35);
    color: #1a1510;
  }

  .stat-chip.active {
    background: #1a1510;
    border-color: #1a1510;
    color: #f5f0e8;
  }

  .stat-dot {
    width: 6px; height: 6px;
    border-radius: 50%;
    flex-shrink: 0;
  }

  .stat-count { opacity: 0.5; font-size: 11px; }

  /* 3 columns at full width, 2 at mid, 1 at small */
  .cards-grid {
    display: grid;
    grid-template-columns: repeat(3, 1fr);
    gap: 20px;
  }

  @media (max-width: 1024px) {
    .cards-grid { grid-template-columns: repeat(2, 1fr); }
  }

  @media (max-width: 640px) {
    .cards-grid { grid-template-columns: 1fr; }
    .notif-root { padding: 28px 16px; }
    .main-title { font-size: 32px; }
    .main-header { flex-direction: column; align-items: flex-start; gap: 10px; }
  }

  .app-card {
    background: #faf7f2;
    border: 1px solid rgba(90,70,40,0.10);
    border-radius: 16px;
    overflow: hidden;
    transition: transform 0.2s ease, box-shadow 0.2s ease;
    animation: cardIn 0.35s ease both;
  }

  .app-card:hover {
    transform: translateY(-3px);
    box-shadow: 0 20px 40px rgba(26,21,16,0.08);
  }

  @keyframes cardIn {
    from { opacity: 0; transform: translateY(12px); }
    to   { opacity: 1; transform: translateY(0); }
  }

  .card-accent { height: 3px; width: 100%; }

  .card-body { padding: 22px; }

  .card-top {
    display: flex;
    justify-content: space-between;
    align-items: flex-start;
    margin-bottom: 16px;
  }

  .card-pet-row {
    display: flex;
    align-items: center;
    gap: 12px;
  }

  .card-pet-img {
    width: 48px; height: 48px;
    border-radius: 10px;
    object-fit: cover;
    border: 2px solid rgba(90,70,40,0.08);
    flex-shrink: 0;
  }

  .card-pet-name {
    font-family: 'DM Serif Display', serif;
    font-size: 17px;
    color: #1a1510;
    line-height: 1.1;
    margin-bottom: 2px;
  }

  .card-pet-label {
    font-size: 10px;
    color: rgba(26,21,16,0.38);
    letter-spacing: 0.5px;
  }

  .status-badge {
    display: flex;
    align-items: center;
    gap: 5px;
    padding: 4px 11px;
    border-radius: 100px;
    font-size: 9px;
    font-weight: 500;
    letter-spacing: 1px;
    text-transform: uppercase;
    border: 1px solid;
    flex-shrink: 0;
  }

  .status-badge-dot { width: 5px; height: 5px; border-radius: 50%; }

  .card-divider {
    height: 1px;
    background: rgba(90,70,40,0.07);
    margin: 14px 0;
  }

  .card-applicant {
    font-size: 13px;
    font-weight: 500;
    color: #1a1510;
    margin-bottom: 10px;
  }

  .card-info-grid {
    display: grid;
    grid-template-columns: 1fr 1fr;
    gap: 8px 14px;
    margin-bottom: 12px;
  }

  .info-label {
    font-size: 9px;
    letter-spacing: 0.8px;
    text-transform: uppercase;
    color: rgba(26,21,16,0.33);
    margin-bottom: 2px;
  }

  .info-value {
    font-size: 12px;
    color: rgba(26,21,16,0.72);
  }

  .card-text-block {
    background: rgba(90,70,40,0.04);
    border-radius: 8px;
    padding: 9px 11px;
    margin-bottom: 7px;
  }

  .card-text-label {
    font-size: 9px;
    letter-spacing: 1px;
    text-transform: uppercase;
    color: rgba(26,21,16,0.33);
    margin-bottom: 3px;
  }

  .card-text-value {
    font-size: 12px;
    color: rgba(26,21,16,0.62);
    line-height: 1.5;
  }

  .card-date {
    font-size: 10px;
    color: rgba(26,21,16,0.26);
    margin-top: 12px;
    letter-spacing: 0.3px;
  }

  .empty-state {
    grid-column: 1 / -1;
    text-align: center;
    padding: 100px 20px;
  }

  .empty-icon { font-size: 52px; opacity: 0.35; margin-bottom: 14px; }

  .empty-title {
    font-family: 'DM Serif Display', serif;
    font-size: 26px;
    color: rgba(26,21,16,0.28);
    margin-bottom: 6px;
  }

  .empty-sub { font-size: 13px; color: rgba(26,21,16,0.2); }

  .loading-screen {
    min-height: 100vh;
    display: flex;
    flex-direction: column;
    align-items: center;
    justify-content: center;
    background: #f5f0e8;
    font-family: 'DM Serif Display', serif;
    font-size: 22px;
    color: rgba(26,21,16,0.3);
    gap: 14px;
  }

  .loading-dots { display: flex; gap: 6px; }

  .loading-dot {
    width: 6px; height: 6px;
    border-radius: 50%;
    background: #8b6d3f;
    animation: pulse 1.2s ease-in-out infinite;
  }

  .loading-dot:nth-child(2) { animation-delay: 0.2s; }
  .loading-dot:nth-child(3) { animation-delay: 0.4s; }

  @keyframes pulse {
    0%, 100% { opacity: 0.2; transform: scale(0.8); }
    50%       { opacity: 1;   transform: scale(1);   }
  }
`;

const Notifications = () => {
  const [notifications, setNotifications] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [filter, setFilter] = useState("all");

  const fetchNotifications = async () => {
    try {
      const data = await getNotifications();
      setNotifications(data);
    } catch (err) {
      console.error("Failed to fetch notifications", err);
      setError("Failed to load applications");
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchNotifications();
    const interval = setInterval(fetchNotifications, 10000);
    return () => clearInterval(interval);
  }, []);

  const counts = {
    all: notifications.length,
    approved: notifications.filter((n) => n.status === "approved").length,
    pending: notifications.filter((n) => n.status === "pending").length,
    rejected: notifications.filter((n) => n.status === "rejected").length,
  };

  const filtered =
    filter === "all"
      ? notifications
      : notifications.filter((n) => n.status === filter);

  if (loading) {
    return (
      <>
        <style>{styles}</style>
        <div className="loading-screen">
          <span>Loading applications</span>
          <div className="loading-dots">
            <div className="loading-dot" />
            <div className="loading-dot" />
            <div className="loading-dot" />
          </div>
        </div>
      </>
    );
  }

  return (
    <>
      <style>{styles}</style>
      <div className="notif-root">
        <div className="notif-inner">

          {/* Header */}
          <header className="main-header">
            <h1 className="main-title">
              My <em>Applications</em>
            </h1>
            <div className="main-meta">
              Auto-refreshes every 10s<br />
              {new Date().toLocaleDateString("en-US", {
                weekday: "long", month: "long", day: "numeric",
              })}
            </div>
          </header>

          {/* Filter chips */}
          <div className="stats-row">
            {[
              { key: "all",      dot: "#a0916e" },
              { key: "pending",  dot: statusConfig.pending.dot  },
              { key: "approved", dot: statusConfig.approved.dot },
              { key: "rejected", dot: statusConfig.rejected.dot },
            ].map(({ key, dot }) => (
              <button
                key={key}
                className={`stat-chip${filter === key ? " active" : ""}`}
                onClick={() => setFilter(key)}
              >
                <span
                  className="stat-dot"
                  style={{ background: filter === key ? "#f5f0e8" : dot }}
                />
                {key.charAt(0).toUpperCase() + key.slice(1)}
                <span className="stat-count">({counts[key] ?? 0})</span>
              </button>
            ))}
          </div>

          {error && (
            <p style={{ color: "#991b1b", fontSize: 13, marginBottom: 20 }}>{error}</p>
          )}

          {/* Cards grid */}
          <div className="cards-grid">
            {filtered.length === 0 ? (
              <div className="empty-state">
                <div className="empty-icon">📭</div>
                <div className="empty-title">No applications here</div>
                <div className="empty-sub">Try a different filter or check back later.</div>
              </div>
            ) : (
              filtered.map((item, i) => {
                const cfg = statusConfig[item.status] ?? statusConfig.pending;
                return (
                  <div
                    className="app-card"
                    key={item.id}
                    style={{ animationDelay: `${i * 0.06}s` }}
                  >
                    <div className="card-accent" style={{ background: cfg.dot }} />
                    <div className="card-body">

                      <div className="card-top">
                        <div className="card-pet-row">
                          <img
                            src={item.image_url || "/default-pet.png"}
                            className="card-pet-img"
                            alt={item.pet_name}
                          />
                          <div>
                            <div className="card-pet-name">{item.pet_name}</div>
                            <div className="card-pet-label">Pet Name</div>
                          </div>
                        </div>
                        <div
                          className="status-badge"
                          style={{ background: cfg.bg, borderColor: cfg.border, color: cfg.text }}
                        >
                          <div className="status-badge-dot" style={{ background: cfg.dot }} />
                          {cfg.label}
                        </div>
                      </div>

                      <div className="card-divider" />

                      <div className="card-applicant">{item.full_name}</div>

                      <div className="card-info-grid">
                        <div>
                          <div className="info-label">Age</div>
                          <div className="info-value">{item.age}</div>
                        </div>
                        <div>
                          <div className="info-label">Phone</div>
                          <div className="info-value">{item.phone}</div>
                        </div>
                        <div style={{ gridColumn: "1 / -1" }}>
                          <div className="info-label">Occupation</div>
                          <div className="info-value">{item.job}</div>
                        </div>
                      </div>

                      <div className="card-text-block">
                        <div className="card-text-label">Experience</div>
                        <div className="card-text-value">{item.experience_with_pets}</div>
                      </div>

                      <div className="card-text-block">
                        <div className="card-text-label">Reason for Adoption</div>
                        <div className="card-text-value">{item.reason_for_adoption}</div>
                      </div>

                      <div className="card-date">
                        Submitted {new Date(item.created_at).toLocaleString("en-US", {
                          month: "short", day: "numeric", year: "numeric",
                          hour: "2-digit", minute: "2-digit",
                        })}
                      </div>

                    </div>
                  </div>
                );
              })
            )}
          </div>

        </div>
      </div>
    </>
  );
};

export default Notifications;