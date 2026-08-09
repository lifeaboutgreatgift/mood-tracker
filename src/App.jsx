import { useState, useEffect } from 'react';
import bgImage from './assets/snoopy-checked.jpg';
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
  while (paddedDays.length < rowCount * 7) paddedDays.push(null);

  const [moods, setMoods] = useState({});       // { day: { emoji, x, y, photo, photoX, photoY } }
  const [notes, setNotes] = useState([]);         // [{ id, text, x, y }]
  const [texts, setTexts] = useState([]); // [{ id, text, x, y }]
  const [draggingItem, setDraggingItem] = useState(null); // { type: 'emoji'|'photo'|'note', day, id }
  const [editingNoteId, setEditingNoteId] = useState(null);
  const [editingTextId, setEditingTextId] = useState(null);

  // ---- load saved data once ----
  useEffect(() => {
    const savedMoods = localStorage.getItem('moods');
    if (savedMoods) setMoods(JSON.parse(savedMoods));
    const savedNotes = localStorage.getItem('notes');
    if (savedNotes) setNotes(JSON.parse(savedNotes));
    const savedTexts = localStorage.getItem('texts');
    if (savedTexts) setTexts(JSON.parse(savedTexts));
  }, []);

  // ---- save moods on change ----
  useEffect(() => {
    localStorage.setItem('moods', JSON.stringify(moods));
  }, [moods]);

  // ---- save notes on change ----
  useEffect(() => {
    localStorage.setItem('notes', JSON.stringify(notes));
  }, [notes]);

  useEffect(() => {
    localStorage.setItem('texts', JSON.stringify(texts));
  }, [texts]);

  useEffect(() => {
  if (!draggingItem) return;

  function handleMove(e) {
    const calendarEl = document.getElementById('calendar-box');
    const rect = calendarEl.getBoundingClientRect();
    const newX = e.clientX - rect.left;
    const newY = e.clientY - rect.top;

    if (draggingItem.type === 'emoji') {
      setMoods((prev) => ({
        ...prev,
        [draggingItem.day]: { ...prev[draggingItem.day], x: newX, y: newY }
      }));
    } else if (draggingItem.type === 'photo') {
      setMoods((prev) => ({
        ...prev,
        [draggingItem.day]: { ...prev[draggingItem.day], photoX: newX, photoY: newY }
      }));
    } else if (draggingItem.type === 'note') {
      setNotes((prev) => prev.map((n) => (n.id === draggingItem.id ? { ...n, x: newX, y: newY } : n)));
    } else if (draggingItem.type === 'text') {
      setTexts((prev) => prev.map((t) => (t.id === draggingItem.id ? { ...t, x: newX, y: newY } : t)));
    }
  }

  function handleUp() {
    setDraggingItem(null);
  }

  window.addEventListener('mousemove', handleMove);
  window.addEventListener('mouseup', handleUp);

  return () => {
    window.removeEventListener('mousemove', handleMove);
    window.removeEventListener('mouseup', handleUp);
  };
}, [draggingItem]);

  // ---- NEW: figure out a day's position within the grid (col/row -> pixel offset) ----
  function getCellOffset(day) {
    const idx = paddedDays.indexOf(day);
    const col = idx % 7;
    const row = Math.floor(idx / 7);
    return { left: col * 130, top: row * 130 };
  }

  function handleDayClick(day) {
    setMoods((prev) => {
      const existing = prev[day] || {};
      const currentIndex = MOODS_LIST.indexOf(existing.emoji || '');
      const nextMood = MOODS_LIST[(currentIndex + 1) % MOODS_LIST.length];
      const { left, top } = getCellOffset(day);
      return {
        ...prev,
        [day]: {
          ...existing,
          emoji: nextMood,
          x: existing.x ?? left + 70,
          y: existing.y ?? top + 8
        }
      };
    });
  }

  function handlePhotoUpload(day, event) {
    const file = event.target.files[0];
    if (!file) return;

    const reader = new FileReader();
    reader.onload = () => {
      const { left, top } = getCellOffset(day);
      setMoods((prev) => ({
        ...prev,
        [day]: {
          ...prev[day],
          photo: reader.result,
          photoX: prev[day]?.photoX ?? left + 20,
          photoY: prev[day]?.photoY ?? top + 40
        }
      }));
    };
    reader.readAsDataURL(file);
  }

  // --- handler to create a new text item 
function handleAddText(day) {
  const { left, top } = getCellOffset(day);
  const newText = { id: Date.now() + 1, text: 'text', x: left + 15, y: top + 60 };
  setTexts((prev) => [...prev, newText]);
  setEditingTextId(newText.id);
}

function updateTextValue(id, value) {
  setTexts((prev) => prev.map((t) => (t.id === id ? { ...t, text: value } : t)));
}

  // ---- NEW: create a new text note near a given day's cell ----
  function handleAddNote(day) {
    const { left, top } = getCellOffset(day);
    const newNote = { id: Date.now(), text: 'note', x: left + 15, y: top + 95 };
    setNotes((prev) => [...prev, newNote]);
    setEditingNoteId(newNote.id);
  }

  function updateNoteText(id, text) {
    setNotes((prev) => prev.map((n) => (n.id === id ? { ...n, text } : n)));
  }

  function deleteNote(id) {
    setNotes((prev) => prev.filter((n) => n.id !== id));
  }


  return (
    <div style={{
      minHeight: '100vh',
      width: '100%',
      padding: '40px',
      fontFamily: 'Handlee, cursive',
      backgroundImage: `url(${bgImage})`,
      backgroundSize: 'cover',
      backgroundPosition: 'center',
      backgroundRepeat: 'no-repeat'
    }}>
      <div style={{ maxWidth: '1200px', margin: '0 auto' }}>
        <h1 style={{ margin: '0 0 5px 0', fontSize: '28px', color: '#222' }}>Mood Tracker</h1>

        {/* ---- Calendar box: now handles mouse move/up for ALL dragging ---- */}
        <div
          id="calendar-box"
          style={{
            position: 'relative',
            width: '910px',
            height: `${rowCount * 130}px`,
            boxSizing: 'border-box',
            backgroundColor: '#fafafa',
            boxShadow: '0 10px 25px rgba(0, 0, 0, 0.05)',
            margin: '30px auto 0 auto'
          }}
        >
          {/* ---- Grid layer: numbers, borders, upload/note triggers ---- */}
          <div style={{
            display: 'grid',
            gridTemplateColumns: 'repeat(7, 130px)',
            gridTemplateRows: `repeat(${rowCount}, 130px)`,
            width: '100%',
            height: '100%'
          }}>
            {paddedDays.map((day, index) => (
              <div
                key={index}
                className="day-cell"
                style={{
                  backgroundColor: 'transparent'
                }}
              >
                {day && (
                  <div
                    onClick={() => handleDayClick(day)}
                    style={{ position: 'relative', width: '100%', height: '100%', cursor: 'pointer' }}
                  >
                    <span style={{
                      position: 'absolute', top: '10px', left: '7px',
                      fontWeight: '600', color: '#000', fontSize: '14px', userSelect: 'none'
                    }}>
                      {String(day).padStart(2, '0')}
                    </span>

                    <input
                      type="file"
                      accept="image/*"
                      id={`photo-upload-${day}`}
                      style={{ display: 'none' }}
                      onChange={(e) => handlePhotoUpload(day, e)}
                    />

                    <label
                     className="cell-action-btn"
                      htmlFor={`photo-upload-${day}`}
                      onClick={(e) => e.stopPropagation()}
                      style={{ bottom: '4px', left: '4px' }}
                    >
                      + photo
                    </label>

                    <button
                     className="cell-action-btn"
                      onClick={(e) => { e.stopPropagation(); handleAddNote(day); }}
                      style={{
                        bottom: '4px', right: '4px'
                      }}
                    >
                      + note
                    </button>
                    <button
                      className="cell-action-btn"
                      onClick={(e) => { e.stopPropagation(); handleAddText(day); }}
                      style={{
                        bottom: '18px', right: '4px'
                      }}
                    >
                      + text
                    </button>
                  </div>
                )}
              </div>
            ))}
          </div>

          {/* ---- NEW: Overlay layer — all draggable items live here, calendar-relative positions ---- */}
          <div style={{ position: 'absolute', top: 0, left: 0, width: '100%', height: '100%', pointerEvents: 'none' }}>

            {/* emojis */}
            {Object.entries(moods).map(([day, data]) =>
              data.emoji ? (
                <div
                  key={`emoji-${day}`}
                  className="draggable-item mood-emoji"
                  onMouseDown={(e) => {
                    e.preventDefault();
                    setDraggingItem({ type: 'emoji', day });
                  }}
                  style={{
                    left: `${data.x}px`,
                    top: `${data.y}px`,
                    zIndex: draggingItem?.type === 'emoji' && draggingItem.day === day ? 999 : 10
                  }}
                >
                  {data.emoji}
                </div>
              ) : null
            )}

            {/* photos */}
            {Object.entries(moods).map(([day, data]) =>
              data.photo ? (
                <div
                  key={`photo-${day}`}
                  className="draggable-item polaroid-frame"
                  onMouseDown={(e) => {
                     e.preventDefault();
                     setDraggingItem({ type: 'photo', day });
                }}
                  style={{
                    left: `${data.photoX}px`,
                    top: `${data.photoY}px`,
                    zIndex: draggingItem?.type === 'photo' && draggingItem.day === day ? 999 : 10
                  }}
                >
                  <img src={data.photo} style={{ width: '60px', height: '60px', objectFit: 'cover', display: 'block' }} />
                </div>
              ) : null
            )}

            {/* notes */}
            {notes.map((note) => (
              <div
                key={note.id}
                className="draggable-item sticky-note"
                onMouseDown={(e) => {
                   e.preventDefault();
                   setDraggingItem({ type: 'note', id: note.id });
              }}
                style={{
                  left: `${note.x}px`,
                  top: `${note.y}px`,
                  zIndex: draggingItem?.type === 'note' && draggingItem.id === note.id ? 999 : 10
                }}
              >
                {editingNoteId === note.id ? (
                  <input
                    autoFocus
                    value={note.text}
                    onChange={(e) => updateNoteText(note.id, e.target.value)}
                    onBlur={() => setEditingNoteId(null)}
                    onMouseDown={(e) => e.stopPropagation()}
                    style={{ fontSize: '12px', width: '90px', fontFamily: 'inherit' }}
                  />
                ) : (
                  <span onClick={() => setEditingNoteId(note.id)}>{note.text}</span>
                )}
              </div>
            ))}
            {/* simple text — no background box, free length */}
              {texts.map((t) => (
                <div
                  key={t.id}
                  className="draggable-item free-text"
                  onMouseDown={(e) => {
                     e.preventDefault();
                      setDraggingItem({ type: 'text', id: t.id }); 
                    }}
                  style={{
                    left: `${t.x}px`,
                    top: `${t.y}px`,
                    zIndex: draggingItem?.type === 'text' && draggingItem.id === t.id ? 999 : 10
                  }}
                >
                  {editingTextId === t.id ? (
                    <input
                      autoFocus
                      value={t.text}
                      onChange={(e) => updateTextValue(t.id, e.target.value)}
                      onBlur={() => setEditingTextId(null)}
                      onMouseDown={(e) => e.stopPropagation()}
                      style={{ fontSize: '13px', fontFamily: 'inherit', border: 'none', borderBottom: '1px solid #ccc', background: 'transparent', color: '#333' }}
                    />
                  ) : (
                    <span onClick={() => setEditingTextId(t.id)}>{t.text}</span>
                  )}
                </div>
              ))}

          </div>
        </div>
      </div>
    </div>
  );
}

export default App;