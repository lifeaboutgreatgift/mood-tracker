import { useState, useEffect } from 'react';
import bgImage from './assets/snoopy-checked.jpg';
import burgerImg from './assets/burger.png';
import topBun from './assets/top-bun.png';
import lettuce from './assets/lettuce.png';
import patty from './assets/patty.png';
import bottomBun from './assets/bottom-bun.png';
import './App.css';

function getMonthDays(year, month) {
  const firstDay = new Date(year, month, 1).getDay();
  const daysInMonth = new Date(year, month + 1, 0).getDate();
  const cells = [];
  for (let i = 0; i < firstDay; i++) cells.push(null);
  for (let day = 1; day <= daysInMonth; day++) cells.push(day);
  return cells;
}

function getMonthKey(date) {
  return `${date.getFullYear()}-${date.getMonth()}`;
}

const MONTH_NAMES = ['January', 'February', 'March', 'April', 'May', 'June',
  'July', 'August', 'September', 'October', 'November', 'December'];

const EMOJI_CYCLE = ['😊', '😴', '😡', '🥲', '😎', ''];

const BURGER_LAYERS = [
  { id: 'top-bun', img: topBun, height: 190, width: 220, hitWidth: 140, hitHeight: 90 },
  { id: 'lettuce', img: lettuce, height: 160, width: 260, hitWidth: 160, hitHeight: 80 },
  { id: 'patty', img: patty, height: 160, width: 240, hitWidth: 150, hitHeight: 80 },
  { id: 'bottom-bun', img: bottomBun, height: 180, width: 300, hitWidth: 180, hitHeight: 100 }
];

const LAYER_GAPS = [-100, -150, -150];
const BURGER_MENU_HEIGHT = BURGER_LAYERS.reduce((sum, layer, index) => {
  const gap = index < LAYER_GAPS.length ? LAYER_GAPS[index] : 0;
  return sum + layer.height + gap;
}, 0);

function getOpenOffset(index) {
  let offset = 0;
  for (let i = 0; i < index; i++) {
    offset += BURGER_LAYERS[i].height + LAYER_GAPS[i];
  }
  return offset;
}

/*
function getOpenOffset(index, menuOpen) {
  if (!menuOpen) return index * 2; // Flat stacked look when menu is closed

  // Hardcoded center-balanced positions so the large pieces sit perfectly on screen
  // Top Bun moves UP (-), Lettuce stays near center, Patty and Bottom Bun move DOWN (+)
  const balancedPositions = {
    0: -40, // top-bun: slides up cleanly
    1: 10,  // lettuce: sits near the center trigger point
    2: 30,  // patty: drops down comfortably
    3: 55   // bottom-bun: stays visible inside the screen
  };

  return balancedPositions[index];
}
*/

function BurgerMenu({ onTopBunClick, onLettuceClick, onPattyClick, onBottomBunClick }) {
  const [menuOpen, setMenuOpen] = useState(false);

  return (
    <div style={{ position: 'relative', width: '220px', height: '260px' }}>
      <img
        src={burgerImg}
        onClick={() => setMenuOpen(true)}
        style={{
          position: 'absolute', top: 0, left: '50%', width: '180px',
          transform: 'translateX(-50%)',
          opacity: menuOpen ? 0 : 1,
          pointerEvents: menuOpen ? 'none' : 'auto',
          transition: 'opacity 0.25s ease, transform 0.25s ease',
          cursor: 'pointer'
        }}
      />

      {menuOpen && (
        <>
          <div style={{ position: 'absolute', top: '30px', left: '50%', transform: 'translateX(-50%)', zIndex: 5 }}>
            <button onClick={() => { onTopBunClick(); setMenuOpen(false); }} style={{ padding: '8px 12px', cursor: 'pointer' }}>Emoji</button>
          </div>
          <div style={{ position: 'absolute', top: '90px', left: '50%', transform: 'translateX(-50%)', zIndex: 5 }}>
            <button onClick={() => { onLettuceClick(); setMenuOpen(false); }} style={{ padding: '8px 12px', cursor: 'pointer' }}>Photo</button>
          </div>
          <div style={{ position: 'absolute', top: '150px', left: '50%', transform: 'translateX(-50%)', zIndex: 5 }}>
            <button onClick={() => { onPattyClick(); setMenuOpen(false); }} style={{ padding: '8px 12px', cursor: 'pointer' }}>Text</button>
          </div>
          <div style={{ position: 'absolute', top: '210px', left: '50%', transform: 'translateX(-50%)', zIndex: 5 }}>
            <button onClick={() => { onBottomBunClick(); setMenuOpen(false); }} style={{ padding: '8px 12px', cursor: 'pointer' }}>Note</button>
          </div>
        </>
      )}
    </div>
  );
}

function App() {
  const [currentDate, setCurrentDate] = useState(new Date());
  const monthKey = getMonthKey(currentDate);

  const totalDays = getMonthDays(currentDate.getFullYear(), currentDate.getMonth());
  const rowCount = Math.ceil(totalDays.length / 7);
  const paddedDays = [...totalDays];
  while (paddedDays.length < rowCount * 7) paddedDays.push(null);

  const [emojis, setEmojis] = useState([]);
  const [photos, setPhotos] = useState([]);
  const [notes, setNotes] = useState([]);
  const [texts, setTexts] = useState([]);
  const [draggingItem, setDraggingItem] = useState(null);
  const [editingNoteId, setEditingNoteId] = useState(null);
  const [editingTextId, setEditingTextId] = useState(null);

  useEffect(() => {
    try {
      const e = localStorage.getItem('emojis'); if (e) setEmojis(JSON.parse(e));
      const p = localStorage.getItem('photos'); if (p) setPhotos(JSON.parse(p));
      const n = localStorage.getItem('notes'); if (n) setNotes(JSON.parse(n));
      const t = localStorage.getItem('texts'); if (t) setTexts(JSON.parse(t));
    } catch (err) {
      console.warn('Could not load saved data:', err);
    }
  }, []);

  useEffect(() => {
    try { localStorage.setItem('emojis', JSON.stringify(emojis)); }
    catch (err) { console.warn('Could not save emojis:', err); }
  }, [emojis]);

  useEffect(() => {
    try { localStorage.setItem('photos', JSON.stringify(photos)); }
    catch (err) { console.warn('Could not save photos — storage may be full:', err); }
  }, [photos]);

  useEffect(() => {
    try { localStorage.setItem('notes', JSON.stringify(notes)); }
    catch (err) { console.warn('Could not save notes:', err); }
  }, [notes]);

  useEffect(() => {
    try { localStorage.setItem('texts', JSON.stringify(texts)); }
    catch (err) { console.warn('Could not save texts:', err); }
  }, [texts]);

  useEffect(() => {
    if (!draggingItem) return;

    function handleMove(e) {
      const calendarEl = document.getElementById('calendar-box');
      const rect = calendarEl.getBoundingClientRect();
      const newX = e.clientX - rect.left;
      const newY = e.clientY - rect.top;

      const move = (setArr) =>
        setArr((prev) => prev.map((item) => (item.id === draggingItem.id ? { ...item, x: newX, y: newY } : item)));

      if (draggingItem.type === 'emoji') move(setEmojis);
      else if (draggingItem.type === 'photo') move(setPhotos);
      else if (draggingItem.type === 'note') move(setNotes);
      else if (draggingItem.type === 'text') move(setTexts);
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

  function spawnEmoji() {
    setEmojis((prev) => [...prev, {
      id: Date.now(), emoji: EMOJI_CYCLE[0],
      x: 380, y: 10 + (prev.length % 6) * 18, monthKey
    }]);
  }

  function spawnPhoto() {
    setPhotos((prev) => [...prev, {
      id: Date.now() + 1, photo: null,
      x: 380, y: 10 + (prev.length % 6) * 18, monthKey
    }]);
  }

  function spawnText() {
    const id = Date.now() + 2;
    setTexts((prev) => [...prev, { id, text: 'text', x: 380, y: 10 + (prev.length % 6) * 18, monthKey }]);
    setEditingTextId(id);
  }

  function spawnNote() {
    const id = Date.now() + 3;
    setNotes((prev) => [...prev, { id, text: 'note', x: 380, y: 10 + (prev.length % 6) * 18, monthKey }]);
    setEditingNoteId(id);
  }

  function cycleEmoji(id) {
    setEmojis((prev) =>
      prev.map((e) => {
        if (e.id !== id) return e;
        const nextIndex = (EMOJI_CYCLE.indexOf(e.emoji) + 1) % EMOJI_CYCLE.length;
        return { ...e, emoji: EMOJI_CYCLE[nextIndex] };
      })
    );
  }

  function deleteEmoji(id) {
    setEmojis((prev) => prev.filter((e) => e.id !== id));
  }

  function handlePhotoFileSelect(id, event) {
    const file = event.target.files[0];
    if (!file) return;
    const reader = new FileReader();
    reader.onload = () => {
      setPhotos((prev) => prev.map((p) => (p.id === id ? { ...p, photo: reader.result } : p)));
    };
    reader.readAsDataURL(file);
  }

  function deletePhoto(id) {
    setPhotos((prev) => prev.filter((p) => p.id !== id));
  }

  function updateNoteText(id, text) {
    setNotes((prev) => prev.map((n) => (n.id === id ? { ...n, text } : n)));
  }

  function deleteNote(id) {
    setNotes((prev) => prev.filter((n) => n.id !== id));
  }

  function updateTextValue(id, value) {
    setTexts((prev) => prev.map((t) => (t.id === id ? { ...t, text: value } : t)));
  }

  function deleteText(id) {
    setTexts((prev) => prev.filter((t) => t.id !== id));
  }

  function goToPrevMonth() {
    setCurrentDate((prev) => new Date(prev.getFullYear(), prev.getMonth() - 1, 1));
  }

  function goToNextMonth() {
    setCurrentDate((prev) => new Date(prev.getFullYear(), prev.getMonth() + 1, 1));
  }

  const currentEmojis = emojis.filter((e) => e.monthKey === monthKey);
  const currentPhotos = photos.filter((p) => p.monthKey === monthKey);
  const currentNotes = notes.filter((n) => n.monthKey === monthKey);
  const currentTexts = texts.filter((t) => t.monthKey === monthKey);

  return (
    <div style={{
      minHeight: '100vh', width: '100%', padding: '40px', fontFamily: 'Handlee, cursive',
      backgroundImage: `url(${bgImage})`, backgroundSize: 'auto',
      backgroundPosition: 'center', backgroundRepeat: 'repeat'
      
    }}>
      <div style={{ maxWidth: '1200px', margin: '0 auto' }}>
        <div style={{ 
          position: 'fixed',
          left: '20px',
          top: '20px',
          zIndex: 100
          }}>
          <BurgerMenu
            onTopBunClick={spawnEmoji}
            onLettuceClick={spawnPhoto}
            onPattyClick={spawnText}
            onBottomBunClick={spawnNote}
          />
        </div>

        <div style={{ display: 'flex', alignItems: 'center', gap: '16px', marginTop: '10px' }}>
          <button onClick={goToPrevMonth} style={{ cursor: 'pointer', fontFamily: 'inherit', fontSize: '18px' }}>←</button>
          <span style={{ fontSize: '18px', fontWeight: '600' }}>
            {MONTH_NAMES[currentDate.getMonth()]} {currentDate.getFullYear()}
          </span>
          <button onClick={goToNextMonth} style={{ cursor: 'pointer', fontFamily: 'inherit', fontSize: '18px' }}>→</button>
        </div>

        <div
          id="calendar-box"
          style={{
            position: 'relative', width: '910px', height: `${rowCount * 130}px`,
            boxSizing: 'border-box', backgroundColor: '#fafafa',
            boxShadow: '0 10px 25px rgba(0, 0, 0, 0.05)', margin: '30px auto 0 auto'
          }}
        >
          <div style={{
            display: 'grid', gridTemplateColumns: 'repeat(7, 130px)',
            gridTemplateRows: `repeat(${rowCount}, 130px)`, width: '100%', height: '100%'
          }}>
            {paddedDays.map((day, index) => (
              <div key={index} className="day-cell" style={{ backgroundColor: 'transparent' }}>
                {day && (
                  <span style={{
                    position: 'absolute', top: '10px', left: '7px',
                    fontWeight: '600', color: '#000', fontSize: '14px', userSelect: 'none'
                  }}>
                    {String(day).padStart(2, '0')}
                  </span>
                )}
              </div>
            ))}
          </div>

          <div style={{ position: 'absolute', top: 0, left: 0, width: '100%', height: '100%', pointerEvents: 'none' }}>

            {currentEmojis.map((item) => (
              <div
                key={item.id}
                className="draggable-item mood-emoji"
                onMouseDown={(e) => { e.preventDefault(); setDraggingItem({ type: 'emoji', id: item.id }); }}
                onClick={(e) => { e.stopPropagation(); cycleEmoji(item.id); }}
                style={{
                  left: `${item.x}px`, top: `${item.y}px`,
                  zIndex: draggingItem?.type === 'emoji' && draggingItem.id === item.id ? 999 : 10
                }}
              >
                <button
                  onMouseDown={(e) => e.stopPropagation()}
                  onClick={(e) => { e.stopPropagation(); deleteEmoji(item.id); }}
                  style={{
                    position: 'absolute', top: '-10px', right: '-10px', width: '14px', height: '14px',
                    borderRadius: '50%', border: '1px solid #999', background: '#fff',
                    fontSize: '8px', color: '#333',
                    lineHeight: '1', cursor: 'pointer', padding: 0,
                    display: 'flex', alignItems: 'center', justifyContent: 'center'
                  }}
                >
                  ×
                </button>
                {item.emoji}
              </div>
            ))}

            {currentPhotos.map((item) => (
              <div
                key={item.id}
                className="draggable-item polaroid-frame"
                onMouseDown={(e) => { e.preventDefault(); setDraggingItem({ type: 'photo', id: item.id }); }}
                style={{
                  left: `${item.x}px`, top: `${item.y}px`,
                  zIndex: draggingItem?.type === 'photo' && draggingItem.id === item.id ? 999 : 10
                }}
              >
                <button
                  onMouseDown={(e) => e.stopPropagation()}
                  onClick={(e) => { e.stopPropagation(); deletePhoto(item.id); }}
                  style={{
                    position: 'absolute', top: '-8px', right: '-8px', width: '18px', height: '18px',
                    borderRadius: '50%', border: '1px solid #999', background: '#fff',
                    fontSize: '11px', color: '#333',
                    lineHeight: '1', cursor: 'pointer', padding: 0,
                    display: 'flex', alignItems: 'center', justifyContent: 'center'
                  }}
                >
                  ×
                </button>

                <input
                  type="file"
                  accept="image/*"
                  id={`photo-upload-${item.id}`}
                  style={{ display: 'none' }}
                  onChange={(e) => handlePhotoFileSelect(item.id, e)}
                />

                {item.photo ? (
                  <label htmlFor={`photo-upload-${item.id}`} onMouseDown={(e) => e.stopPropagation()} style={{ cursor: 'pointer', display: 'block' }}>
                    <img src={item.photo} style={{ width: '60px', height: '60px', objectFit: 'cover', display: 'block' }} />
                  </label>
                ) : (
                  <label
                    htmlFor={`photo-upload-${item.id}`}
                    onMouseDown={(e) => e.stopPropagation()}
                    style={{
                      width: '60px', height: '60px', display: 'flex', alignItems: 'center', justifyContent: 'center',
                      fontSize: '9px', color: '#999', border: '1px dashed #ccc', cursor: 'pointer', textAlign: 'center'
                    }}
                  >
                    tap to add
                  </label>
                )}
              </div>
            ))}

            {currentNotes.map((note) => (
              <div
                key={note.id}
                className="draggable-item sticky-note"
                onMouseDown={(e) => { e.preventDefault(); setDraggingItem({ type: 'note', id: note.id }); }}
                style={{
                  left: `${note.x}px`, top: `${note.y}px`,
                  zIndex: draggingItem?.type === 'note' && draggingItem.id === note.id ? 999 : 10
                }}
              >
                {editingNoteId === note.id ? (
                  <div style={{ display: 'flex', gap: '4px', alignItems: 'center' }}>
                    <input
                      autoFocus
                      value={note.text}
                      onChange={(e) => updateNoteText(note.id, e.target.value)}
                      onBlur={() => setEditingNoteId(null)}
                      onMouseDown={(e) => e.stopPropagation()}
                      style={{ fontSize: '12px', width: '70px', fontFamily: 'inherit', color: '#333' }}
                    />
                    <button
                      onMouseDown={(e) => e.stopPropagation()}
                      onClick={() => deleteNote(note.id)}
                      style={{ fontSize: '10px', cursor: 'pointer', border: 'none', background: 'none' }}
                    >
                      🗑
                    </button>
                  </div>
                ) : (
                  <span onClick={() => setEditingNoteId(note.id)}>{note.text}</span>
                )}
              </div>
            ))}

            {currentTexts.map((t) => (
              <div
                key={t.id}
                className="draggable-item free-text"
                onMouseDown={(e) => { e.preventDefault(); setDraggingItem({ type: 'text', id: t.id }); }}
                style={{
                  left: `${t.x}px`, top: `${t.y}px`,
                  zIndex: draggingItem?.type === 'text' && draggingItem.id === t.id ? 999 : 10
                }}
              >
                {editingTextId === t.id ? (
                  <div style={{ display: 'flex', gap: '4px', alignItems: 'center' }}>
                    <input
                      autoFocus
                      value={t.text}
                      onChange={(e) => updateTextValue(t.id, e.target.value)}
                      onBlur={() => setEditingTextId(null)}
                      onMouseDown={(e) => e.stopPropagation()}
                      style={{ fontSize: '13px', fontFamily: 'inherit', border: 'none', borderBottom: '1px solid #ccc', background: 'transparent', color: '#333' }}
                    />
                    <button
                      onMouseDown={(e) => e.stopPropagation()}
                      onClick={() => deleteText(t.id)}
                      style={{ fontSize: '10px', cursor: 'pointer', border: 'none', background: 'none' }}
                    >
                      🗑
                    </button>
                  </div>
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