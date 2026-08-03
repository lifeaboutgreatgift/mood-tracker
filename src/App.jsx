import { useState } from 'react';
import './App.css';

const MOODS = {
  great: { emoji: '🌸', color: '#ffb3c6' },
  good:  { emoji: '☀️', color: '#ffe4a3' },
  okay:  { emoji: '🌤️', color: '#c9e4de' },
  bad:   { emoji: '🌧️', color: '#a8c5e0' },
};

function getLast30Days() {
  const days = [];
  for (let i = 29; i >= 0; i--) {
    const d = new Date();
    d.setDate(d.getDate() - i);
    days.push(d.toISOString().split('T')[0]); // "2026-08-03"
  }
  return days;
}

function DaySquare({ date, mood }) {
  const moodData = mood ? MOODS[mood] : null;
  const isToday = date === new Date().toISOString().split('T')[0];

  return (
    <div
      className={`day-square ${isToday ? 'today' : ''}`}
      style={{ backgroundColor: moodData ? moodData.color : '#eee' }}
      title={date}
    >
      {moodData ? moodData.emoji : ''}
    </div>
  );
}

function MoodGrid({ log }) {
  const days = getLast30Days();

  return (
    <div className="mood-grid">
      {days.map((date) => (
        <DaySquare key={date} date={date} mood={log[date]} />
      ))}
    </div>
  );
}

function MoodPicker({ onSelect, todaysMood }) {
  return (
    <div className="mood-picker">
      {Object.entries(MOODS).map(([key, { emoji }]) => (
        <button
          key={key}
          onClick={() => onSelect(key)}
          className={todaysMood === key ? 'selected' : ''}
        >
          {emoji}
        </button>
      ))}
    </div>
  );
}

function App() {
  const [log, setLog] = useState({}); // { "2026-08-03": "great", ... }
  const today = new Date().toISOString().split('T')[0];

  function logMood(mood) {
    setLog((prev) => ({ ...prev, [today]: mood }));
  }

  return (
    <div className="app">
      <h1>Mood Tracker</h1>

      <p className="prompt">How are you feeling today?</p>
      <MoodPicker onSelect={logMood} todaysMood={log[today]} />

      {!log[today] && <p className="hint">Pick a mood to log today ✨</p>}

      <h2>Last 30 Days</h2>
      <MoodGrid log={log} />
    </div>
  );
}

export default App;