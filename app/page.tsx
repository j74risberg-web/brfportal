"use client";

import { useState, useEffect } from "react";

// --- HJÄLPFUNKTIONER ---
function getMonthDays(year: number, month: number) {
  const firstDay = new Date(year, month, 1);
  const lastDay = new Date(year, month + 1, 0);
  const startWeekDay = (firstDay.getDay() + 6) % 7; 
  const daysInMonth = lastDay.getDate();
  const days: (Date | null)[] = [];
  for (let i = 0; i < startWeekDay; i++) days.push(null);
  for (let d = 1; d <= daysInMonth; d++) days.push(new Date(year, month, d));
  return days;
}

interface Booking {
  id: string;
  type: string;
  date: string;
  slot: string; // Nytt: Tidspass (t.ex. "07:00-12:00")
  userName: string;
}

export default function Page() {
  const [page, setPage] = useState("login");
  const [active, setActive] = useState("Nyheter");
  const [newsIndex, setNewsIndex] = useState(0);
  const [editPage, setEditPage] = useState("Om Slalomsvängen 2");
  const [selectedDate, setSelectedDate] = useState<Date | null>(null);

  const [user] = useState({ name: "Erik Johansson", lägenhet: "1202" });

  const defaultHero = "https://www.brfslalomsvangen2.se/wp-content/uploads/2010/07/cropped-Banner-2.jpg";
  const [loginImage, setLoginImage] = useState(defaultHero);

  const [news, setNews] = useState([
    { title: "Välkommen till S2", text: "Här kan du läsa om allt som händer i vår förening.", image: "https://images.unsplash.com/photo-1545324418-cc1a3fa10c00" },
    { title: "Nya maskiner", text: "Tvättstugan har fått helt nya torktumlare!", image: "https://images.unsplash.com/photo-1517677208171-0bc6725a3e60" }
  ]);

  const [pageTexts, setPageTexts] = useState<Record<string, string>>({
    "Om Slalomsvängen 2": "Brf Slalomsvängen 2 är en stabil förening...",
    "Tvättstuga": "Välj ett ledigt pass nedan. Max 1 pass åt gången.",
    "SPA": "Vänligen duscha innan bastu/bad. Lämna spat i rent skick.",
    "Gästrummet": "Boka för gäster, 300 kr/natt."
  });

  const [bookings, setBookings] = useState<Booking[]>([]);
  const [currentDate, setCurrentDate] = useState(new Date());

  useEffect(() => {
    const savedImg = localStorage.getItem("brf_login_img");
    const savedBookings = localStorage.getItem("brf_bookings_v3");
    if (savedImg) setLoginImage(savedImg);
    if (savedBookings) setBookings(JSON.parse(savedBookings));
  }, []);

  useEffect(() => {
    localStorage.setItem("brf_login_img", loginImage);
    localStorage.setItem("brf_bookings_v3", JSON.stringify(bookings));
  }, [loginImage, bookings]);

  // Definiera tidspass
  const timeSlots: Record<string, string[]> = {
    "Tvättstuga": ["07:00 - 12:00", "12:00 - 17:00", "17:00 - 22:00"],
    "SPA": ["08:00 - 11:00", "11:00 - 14:00", "14:00 - 17:00", "17:00 - 20:00", "20:00 - 23:00"],
    "Gästrummet": ["Helt dygn (In 15:00, Ut 12:00)"]
  };

  const isSlotBooked = (date: Date, type: string, slot: string) => {
    const dStr = date.toISOString().split("T")[0];
    return bookings.find(b => b.date === dStr && b.type === type && b.slot === slot);
  };

  const handleBooking = (date: Date, type: string, slot: string) => {
    const dateStr = date.toISOString().split("T")[0];
    const existing = isSlotBooked(date, type, slot);

    if (existing) {
      if (existing.userName === user.name) {
        if (confirm("Vill du avboka?")) setBookings(bookings.filter(b => b.id !== existing.id));
      }
    } else {
      const newB: Booking = { id: Math.random().toString(36).substr(2,9), type, date: dateStr, slot, userName: user.name };
      setBookings([...bookings, newB]);
      setSelectedDate(null);
    }
  };

  const menuItems = ["Nyheter", "Gästrummet", "Tvättstuga", "SPA", "Profil", "Inställningar"];

  return (
    <div className="app">
      <head>
  <title>Slalomsvängen 2</title>
  <link rel="apple-touch-icon" href="/icon.png" />
  <meta name="apple-mobile-web-app-capable" content="yes" />
  <meta name="apple-mobile-web-app-status-bar-style" content="black-translucent" />
</head>
      {page === "login" ? (
        <div className="login-screen">
          <div className="login-card">
            <div className="login-hero" style={{ backgroundImage: `url(${loginImage})` }}>
              <div className="logo-badge">S2</div>
            </div>
            <div className="login-content">
              <h1>Slalomsvängen 2</h1>
              <p>Boendeportal</p>
              <button className="gsi-button" onClick={() => setPage("dashboard")}>
                <img src="https://www.gstatic.com/firebasejs/ui/2.0.0/images/auth/google.svg" width="18" />
                <span>Logga in med Google</span>
              </button>
            </div>
          </div>
        </div>
      ) : (
        <>
          <div className="hero-banner" style={{ backgroundImage: `url(${loginImage})` }}>
            <div className="hero-text">
              <h1>{active}</h1>
              <p>Brf Slalomsvängen 2</p>
            </div>
            <button className="logout-btn" onClick={() => setPage("login")}>Logga ut</button>
          </div>

          <main className="main-content">
            
            {/* BOOKING UI */}
            {["Gästrummet", "Tvättstuga", "SPA"].includes(active) && (
              <div className="booking-view">
                <div className="card info-box">
                  <h4>{active} - Information</h4>
                  <p>{pageTexts[active]}</p>
                </div>

                <div className="card calendar">
                  <div className="cal-header">
                    <button onClick={() => setCurrentDate(new Date(currentDate.getFullYear(), currentDate.getMonth() - 1))}>❮</button>
                    <span>{currentDate.toLocaleString("sv-SE", { month: "long", year: "numeric" })}</span>
                    <button onClick={() => setCurrentDate(new Date(currentDate.getFullYear(), currentDate.getMonth() + 1))}>❯</button>
                  </div>
                  <div className="cal-grid">
                    {["M", "T", "O", "T", "F", "L", "S"].map(d => <div key={d} className="wd">{d}</div>)}
                    {getMonthDays(currentDate.getFullYear(), currentDate.getMonth()).map((day, i) => {
                      if (!day) return <div key={i} className="empty" />;
                      const dateStr = day.toISOString().split("T")[0];
                      const dayBookings = bookings.filter(b => b.date === dateStr && b.type === active);
                      const myBookings = dayBookings.filter(b => b.userName === user.name);
                      const isFull = dayBookings.length >= (timeSlots[active]?.length || 1);

                      return (
                        <div key={i} 
                          className={`cell ${myBookings.length > 0 ? 'my-booked' : (isFull ? 'booked' : 'free')} ${selectedDate?.getTime() === day.getTime() ? 'selected' : ''}`}
                          onClick={() => setSelectedDate(day)}>
                          <span className="day-num">{day.getDate()}</span>
                          {dayBookings.length > 0 && <span className="slot-count">{dayBookings.length} bokad</span>}
                        </div>
                      );
                    })}
                  </div>
                </div>

                {/* TIDSPASS-MODAL / LISTA */}
                {selectedDate && (
                  <div className="card slots-card">
                    <div className="slots-header">
                      <h5>Tidspass för {selectedDate.toLocaleDateString('sv-SE')}</h5>
                      <button onClick={() => setSelectedDate(null)}>Stäng</button>
                    </div>
                    <div className="slots-list">
                      {timeSlots[active].map(slot => {
                        const b = isSlotBooked(selectedDate, active, slot);
                        return (
                          <div key={slot} className={`slot-item ${b ? 'occupied' : 'available'}`}>
                            <span>{slot}</span>
                            {b ? (
                              <span className="owner">{b.userName === user.name ? 'Din bokning' : b.userName}</span>
                            ) : null}
                            <button 
                              disabled={b && b.userName !== user.name}
                              onClick={() => handleBooking(selectedDate, active, slot)}
                              className={b ? 'cancel' : 'book'}
                            >
                              {b ? (b.userName === user.name ? 'Avboka' : 'Upptaget') : 'Boka'}
                            </button>
                          </div>
                        );
                      })}
                    </div>
                  </div>
                )}
              </div>
            )}

            {/* PROFIL */}
            {active === "Profil" && (
              <div className="profil-page">
                <div className="card user-card">
                  <div className="avatar">{user.name[0]}</div>
                  <h3>{user.name}</h3>
                  <p>Lgh {user.lägenhet}</p>
                </div>
                <h4>Mina bokningar</h4>
                {bookings.filter(b => b.userName === user.name).length > 0 ? (
                  bookings.filter(b => b.userName === user.name).map(b => (
                    <div key={b.id} className="card booking-row">
                      <div>
                        <strong>{b.type}</strong>
                        <p>{b.date} | {b.slot}</p>
                      </div>
                      <button onClick={() => setBookings(bookings.filter(x => x.id !== b.id))}>Avboka</button>
                    </div>
                  ))
                ) : <p className="card">Inga aktiva bokningar.</p>}
              </div>
            )}

            {active === "Nyheter" && (
              <div className="card news-card">
                <div className="carousel">
                  <img src={news[newsIndex].image} />
                  <div className="nav">
                    <button onClick={() => setNewsIndex((newsIndex - 1 + news.length) % news.length)}>❮</button>
                    <button onClick={() => setNewsIndex((newsIndex + 1) % news.length)}>❯</button>
                  </div>
                </div>
                <div className="news-body">
                  <h3>{news[newsIndex].title}</h3>
                  <p>{news[newsIndex].text}</p>
                </div>
              </div>
            )}

            {active === "Inställningar" && (
              <div className="admin-view">
                <div className="card">
                  <label>Byt Hero-bild (URL)</label>
                  <input value={loginImage} onChange={(e) => setLoginImage(e.target.value)} />
                </div>
                <div className="card">
                  <label>Redigera text för: {editPage}</label>
                  <select value={editPage} onChange={(e) => setEditPage(e.target.value)}>
                    {Object.keys(pageTexts).map(k => <option key={k} value={k}>{k}</option>)}
                  </select>
                  <textarea rows={4} value={pageTexts[editPage]} onChange={(e) => setPageTexts({...pageTexts, [editPage]: e.target.value})} />
                </div>
              </div>
            )}
          </main>

          <nav className="bottom-nav">
            <div className="nav-container">
              {menuItems.map(item => (
                <button key={item} className={active === item ? 'active' : ''} onClick={() => {setActive(item); setSelectedDate(null);}}>{item}</button>
              ))}
            </div>
          </nav>
        </>
      )}

      <style jsx>{`
        .app { font-family: -apple-system, sans-serif; background: #f1f5f9; min-height: 100vh; }
        
        /* LOGIN */
        .login-screen { 
          height: 100vh; display: flex; align-items: center; justify-content: center; 
          background-color: #f1f5f9;
          background-image: radial-gradient(at 0% 0%, hsla(145,28%,66%,0.3) 0, transparent 50%), radial-gradient(at 50% 0%, hsla(205,33%,71%,0.3) 0, transparent 50%);
        }
        .login-card { background: white; border-radius: 2rem; width: 340px; overflow: hidden; box-shadow: 0 20px 40px rgba(0,0,0,0.1); }
        .login-hero { height: 160px; background-size: cover; background-position: center; display: flex; align-items: center; justify-content: center; }
        .logo-badge { width: 50px; height: 50px; background: #1f3d2b; color: white; border-radius: 50%; display: flex; align-items: center; justify-content: center; font-weight: 900; font-size: 1.2rem; }
        .login-content { padding: 2rem; text-align: center; }
        .gsi-button { width: 100%; padding: 0.8rem; border: 1px solid #ddd; border-radius: 1rem; background: white; display: flex; align-items: center; justify-content: center; gap: 10px; cursor: pointer; font-weight: 600; }

        /* HERO & CONTENT */
        .hero-banner { height: 160px; background-size: cover; background-position: center; position: relative; display: flex; align-items: flex-end; padding: 1.5rem; color: white; }
        .hero-banner::after { content: ''; position: absolute; inset: 0; background: linear-gradient(transparent, rgba(0,0,0,0.8)); }
        .hero-text { position: relative; z-index: 1; }
        .logout-btn { position: absolute; top: 1rem; right: 1rem; z-index: 2; background: rgba(255,255,255,0.2); border: none; color: white; padding: 0.4rem 0.8rem; border-radius: 2rem; cursor: pointer; font-size: 0.7rem; }
        
        .main-content { padding: 1rem; max-width: 600px; margin: 0 auto; padding-bottom: 7rem; }
        .card { background: white; border-radius: 1.5rem; padding: 1.25rem; box-shadow: 0 4px 6px -1px rgba(0,0,0,0.05); margin-bottom: 1rem; }

        /* CALENDAR */
        .cal-header { display: flex; justify-content: space-between; align-items: center; margin-bottom: 1rem; font-weight: 800; }
        .cal-grid { display: grid; grid-template-columns: repeat(7, 1fr); gap: 0.4rem; }
        .wd { text-align: center; font-size: 0.7rem; color: #94a3b8; font-weight: 800; }
        .cell { aspect-ratio: 1; border-radius: 0.8rem; display: flex; flex-direction: column; align-items: center; justify-content: center; cursor: pointer; position: relative; font-weight: 700; transition: 0.2s; }
        .cell.free { background: #f1f5f9; color: #64748b; }
        .cell.booked { background: #e2e8f0; color: #94a3b8; }
        .cell.my-booked { background: #1f3d2b; color: white; }
        .cell.selected { border: 2px solid #1f3d2b; transform: scale(1.05); }
        .slot-count { font-size: 0.5rem; margin-top: 2px; opacity: 0.8; }

        /* SLOTS */
        .slots-header { display: flex; justify-content: space-between; align-items: center; margin-bottom: 1rem; }
        .slot-item { display: flex; justify-content: space-between; align-items: center; padding: 0.8rem; border-bottom: 1px solid #f1f5f9; font-size: 0.9rem; }
        .slot-item button { padding: 0.5rem 1rem; border-radius: 0.5rem; border: none; cursor: pointer; font-weight: 600; }
        .book { background: #1f3d2b; color: white; }
        .cancel { background: #fee2e2; color: #ef4444; }
        .owner { font-size: 0.7rem; color: #94a3b8; }

        /* PROFIL */
        .user-card { text-align: center; }
        .avatar { width: 50px; height: 50px; background: #1f3d2b; color: white; border-radius: 50%; display: flex; align-items: center; justify-content: center; margin: 0 auto 10px; font-weight: 800; }
        .booking-row { display: flex; justify-content: space-between; align-items: center; }
        .booking-row p { font-size: 0.8rem; color: #64748b; margin: 0; }
        .booking-row button { border: none; background: #fee2e2; color: #ef4444; padding: 5px 10px; border-radius: 5px; font-size: 0.7rem; }

        /* NAV */
        .bottom-nav { position: fixed; bottom: 0; left: 0; right: 0; background: #000; padding: 0.8rem; z-index: 100; }
        .nav-container { display: flex; gap: 0.5rem; overflow-x: auto; padding: 0 0.5rem; scrollbar-width: none; }
        .bottom-nav button { background: #1a1a1a; border: none; color: #94a3b8; padding: 0.6rem 1.2rem; border-radius: 2rem; white-space: nowrap; font-size: 0.8rem; font-weight: 700; cursor: pointer; }
        .bottom-nav button.active { background: white; color: black; }

        .admin-view input, .admin-view select, .admin-view textarea { width: 100%; padding: 0.8rem; border: 1px solid #e2e8f0; border-radius: 1rem; margin-top: 5px; font-family: inherit; }
      `}</style>
    </div>
  );
}
