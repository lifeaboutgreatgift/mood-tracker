import { useState, useEffect } from 'react';
import './App.css';

function getMonthDays(year, month) {
  const firstDay = new Date(year, month, 1).getDay();
  const daysInMonth = new Date(year, month + 1, 0).getDate();

  const cells = [];
  for (let i = 0; i < firstDay; i++) cells.push(null);
  for (let day = 1; day <= daysInMonth; day++) cells.push(day);

  return cells;
}

const MOODS_LIST = ['😊', '😴', '😡', '🥲', '😎', ''];

function App() {
  const today = new Date();
  const totalDays = getMonthDays(today.getFullYear(), today.getMonth());
  const totalCells = totalDays.length;
  const rowCount = Math.ceil(totalCells / 7);
  const paddedDays = [...totalDays];
  const [draggingDay, setDraggingDay] = useState(null); // which day is being dragged right now
  
  while (paddedDays.length < rowCount * 7) paddedDays.push(null);

  // ---- mood state ----
  const [moods, setMoods] = useState({});

  // ---- load saved moods once when app starts ----
  useEffect(() => {
    const saved = localStorage.getItem('moods');
    if (saved) setMoods(JSON.parse(saved));
  }, []);

  // ---- save moods every time they change ----
  useEffect(() => {
    localStorage.setItem('moods', JSON.stringify(moods));
  }, [moods]);

  // ---- click handler to cycle moods ----
  function handleDayClick(day) {
    setMoods((prev) => {
      const existing = prev[day] || { x: 70, y: 8, emoji: '' };
      const currentIndex = MOODS_LIST.indexOf(existing.emoji);
      const nextMood = MOODS_LIST[(currentIndex + 1) % MOODS_LIST.length];
      return { ...prev, [day]: { ...existing, emoji: nextMood } };
    });
  }

  return (
    <div  style={{ minHeight: '100vh', width: '100%', padding: '40px', fontFamily: 'Handlee, cursive' }}>
      <div style={{ maxWidth: '1200px', margin: '0 auto' }}>
        <h1 style={{ margin: '0 0 5px 0', fontSize: '28px', color: '#222' }}>Mood Tracker</h1>

        <div style={{
          position: 'relative',
          width: '912px', // Tweak slightly to 912px to account for the outer borders cleanly
          height: `${rowCount * 130 + 2}px`,
          backgroundColor: '#fafafa',
          border: '2px solid #040408',
          borderRadius: '8px',
          boxShadow: '0 10px 25px rgba(0, 0, 0, 0.05)',
          margin: '30px auto 0 auto',
          overflow: 'hidden'
        }}>

          <div style={{
            display: 'grid',
            gridTemplateColumns: 'repeat(7, 130px)',
            gridTemplateRows: `repeat(${rowCount}, 130px)`,
            width: '100%',
            height: '100%'
          }}>

            {paddedDays.map((day, index) => {
              const isLastColumn = (index + 1) % 7 === 0;
              const isLastRow = index >= (rowCount - 1) * 7;

              // Crisp border setup: inner cells get borders on the right and bottom
              const borderStyle = {
                borderRight: isLastColumn ? 'none' : '2px solid #040408',
                borderBottom: isLastRow ? 'none' : '2px solid #040408'
              };

              return (
                <div
                  key={index}
                  style={{
                    ...borderStyle,
                    boxSizing: 'border-box',
                    backgroundColor: '#fafafa',
                    position: 'relative' 
                  }}
                >
                  {day && (
                    <div
                      onClick={() => handleDayClick(day)}
                      onMouseMove={(e) => {
                        if (draggingDay !== day) return;
                        const rect = e.currentTarget.getBoundingClientRect();
                        const newX = e.clientX - rect.left;
                        const newY = e.clientY - rect.top;
                        setMoods((prev) => ({
                          ...prev,
                          [day]: { ...prev[day], x: newX, y: newY }
                        }));
                      }}
                      onMouseUp={() => setDraggingDay(null)}
                      style={{ position: 'relative', width: '100%', height: '100%', cursor: 'pointer' }}
                    >
                      {/* date number */}
                      <span style={{
                        position: 'absolute',
                        top: '8px',
                        left: '10px',
                        fontWeight: '600',
                        color: '#000000',
                        fontSize: '14px',
                        userSelect: 'none'
                      }}>
                        {String(day).padStart(2, '0')}
                      </span>

                      {/* mood emoji — draggable */}
                      {moods[day]?.emoji && (
                        <div
                          onMouseDown={(e) => {
                            e.stopPropagation();
                            setDraggingDay(day);
                          }}
                          style={{
                            position: 'absolute',
                            left: `${moods[day]?.x ?? 70}px`,
                            top: `${moods[day]?.y ?? 8}px`,
                            fontSize: '20px',
                            cursor: 'grab',
                            userSelect: 'none'
                          }}
                        >
                          {moods[day]?.emoji}
                        </div>
                      )}
                    </div>
                  )}
                </div>
              ); // Closing tag for return item loop
            })} {/* Closing tag for map function */}

          </div>
        </div>
      </div>
    </div>
  );
}

export default App;
