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
  const [draggingDay, setDraggingDay] = useState(null);

  while (paddedDays.length < rowCount * 7) paddedDays.push(null);

  const [moods, setMoods] = useState({});

  useEffect(() => {
    const saved = localStorage.getItem('moods');
    if (saved) setMoods(JSON.parse(saved));
  }, []);

  useEffect(() => {
    localStorage.setItem('moods', JSON.stringify(moods));
  }, [moods]);

  function handleDayClick(day) {
    setMoods((prev) => {
      const existing = prev[day] || { x: 70, y: 8, emoji: '' };
      const currentIndex = MOODS_LIST.indexOf(existing.emoji);
      const nextMood = MOODS_LIST[(currentIndex + 1) % MOODS_LIST.length];
      return { ...prev, [day]: { ...existing, emoji: nextMood } };
    });
  }

  // ---- NEW: handles the file picker selection ----
  function handlePhotoUpload(day, event) {
    const file = event.target.files[0];
    if (!file) return;

    const reader = new FileReader();
    reader.onload = () => {
      setMoods((prev) => ({
        ...prev,
        [day]: {
          ...prev[day],
          photo: reader.result,
          photoX: prev[day]?.photoX ?? 20,
          photoY: prev[day]?.photoY ?? 40
        }
      }));
    };
    reader.readAsDataURL(file);
  }

  return (
    <div style={{ minHeight: '100vh', width: '100%', padding: '40px', fontFamily: 'Handlee, cursive' }}>
      <div style={{ maxWidth: '1200px', margin: '0 auto' }}>
        <h1 style={{ margin: '0 0 5px 0', fontSize: '28px', color: '#222' }}>Mood Tracker</h1>

        <div style={{
          position: 'relative',
          width: '910px',
          height: `${rowCount * 130 }px`,
          boxSizing: 'border-box',
          backgroundColor: '#fafafa',
          border: '2px solid #040408',
          borderRadius: '0px',
          boxShadow: '0 10px 25px rgba(0, 0, 0, 0.05)',
          margin: '30px auto 0 auto'
        }}>

          <div style={{
            display: 'grid',
            gridTemplateColumns: 'repeat(7, 130px)',
            gridTemplateRows: `repeat(${rowCount}, 130px)`,
            width: '100%',
            height: '100%'
          }}>

            {paddedDays.map((day, index) => {
             /* const isLastColumn = (index + 1) % 7 === 0;
              const isLastRow = index >= (rowCount - 1) * 7;

              const borderStyle = {
                borderRight: isLastColumn ? 'none' : '2px solid #040408',
                borderBottom: isLastRow ? 'none' : '2px solid #040408'
              }; 
              */
             const borderStyle ={
              borderRight: '2px solid #040408',
              borderBottom: '2px solid #040408'
             }

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
                        // ---- CHANGED: now handles both emoji AND photo dragging ----
                        if (!draggingDay) return;
                        const rect = e.currentTarget.getBoundingClientRect();
                        const newX = e.clientX - rect.left;
                        const newY = e.clientY - rect.top;

                        if (draggingDay === day) {
                          setMoods((prev) => ({
                            ...prev,
                            [day]: { ...prev[day], x: newX, y: newY }
                          }));
                        } else if (draggingDay === `photo-${day}`) {
                          setMoods((prev) => ({
                            ...prev,
                            [day]: { ...prev[day], photoX: newX, photoY: newY }
                          }));
                        }
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

                      {/* ---- NEW: hidden file input, one per day ---- */}
                      <input
                        type="file"
                        accept="image/*"
                        id={`photo-upload-${day}`}
                        style={{ display: 'none' }}
                        onChange={(e) => handlePhotoUpload(day, e)}
                      />

                      {/* ---- NEW: polaroid photo (draggable) or upload button ---- */}
                      {moods[day]?.photo ? (
                        <div
                          onMouseDown={(e) => {
                            e.stopPropagation();
                            setDraggingDay(`photo-${day}`);
                          }}
                          style={{
                            position: 'absolute',
                            left: `${moods[day]?.photoX ?? 20}px`,
                            top: `${moods[day]?.photoY ?? 40}px`,
                            backgroundColor: '#fff',
                            padding: '4px 4px 12px 4px',
                            boxShadow: '0 2px 6px rgba(0,0,0,0.2)',
                            cursor: 'grab',
                            transform: 'rotate(-3deg)',
                            zIndex: draggingDay === `phote-${day}` ? 999:10
                          }}
                        >
                          <img
                            src={moods[day].photo}
                            style={{ width: '60px', height: '60px', objectFit: 'cover', display: 'block' }}
                          />
                        </div>
                      ) : (
                        <label
                          htmlFor={`photo-upload-${day}`}
                          onClick={(e) => e.stopPropagation()}
                          style={{
                            position: 'absolute',
                            bottom: '4px',
                            left: '4px',
                            fontSize: '10px',
                            color: '#999',
                            cursor: 'pointer'
                          }}
                        >
                          + photo
                        </label>
                      )}
                    </div>
                  )}
                </div>
              );
            })}

          </div>
        </div>
      </div>
    </div>
  );
}

export default App;