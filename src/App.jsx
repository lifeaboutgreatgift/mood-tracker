import { useState } from 'react';
import './App.css';

function getMonthDays(year, month) {
  const firstDay = new Date(year, month, 1).getDay(); // 0=Sun, 6=Sat
  const daysInMonth = new Date(year, month + 1, 0).getDate();

  const cells = [];
  for (let i = 0; i < firstDay; i++) cells.push(null); // empty padding
  for (let day = 1; day <= daysInMonth; day++) cells.push(day);

  return cells;
}

function App() {
  const today = new Date();
  const totalDays = getMonthDays(today.getFullYear(), today.getMonth());
  const totalCells = totalDays.length;
  const rowCount = Math.ceil(totalCells / 7);
  const paddedDays = [...totalDays];
  while (paddedDays.length < rowCount * 7) paddedDays.push(null);

  return (
    // This is your main full-screen background wrapper
    <div className="scroll-hide" style={{ minHeight: '100vh', width: '100%', padding: '40px', fontFamily: 'Handlee, cursive' }}>
      <div style={{ maxWidth: '1200px', margin: '0 auto' }}>
        <h1 style={{ margin: '0 0 5px 0', fontSize: '28px', color: '#222' }}> Mood Tracker</h1>

        <div style={{
          position: 'relative',
          width: '910px',
          height: `${rowCount * 130}px`,
          backgroundColor: '#ffffff',
          border: '2px solid #2b2424',
          borderRadius: '8px',
          boxShadow: '0 10px 25px rgba(0, 0, 0, 0.05)',
          margin: '30px auto 0 auto',
          overflow: 'hidden'
        }}>

          {/* THE CSS GRID MATRIX LAYER */}
          <div style={{
            display: 'grid',
            gridTemplateColumns: 'repeat(7, 130px)',
            gridTemplateRows: `repeat(${rowCount}, 130px)`,
            width: '100%',
            height: '100%'
          }}>

            {/* Loop through each day and render its grid block */}
            {paddedDays.map((day, index) => {
              const isFirstColumn = index % 7 === 0;
              const isFirstRow = index < 7;
              const borderStyle = {
                borderTop: isFirstRow ? 'none' : '2px solid transparent',
                borderLeft: isFirstColumn ? 'none' : '2px solid transparent',
                borderRight: '2px solid #2b2424',
                borderBottom: '2px solid #2b2424'
              };

              return (
                <div
                  key={index}
                  style={{
                    ...borderStyle,
                    padding: '8px 0 0 10px',
                    boxSizing: 'border-box',
                    backgroundColor: '#ffffff',
                    display: 'flex',
                    alignItems: 'flex-start',
                    justifyContent: 'flex-start'
                  }}
                >
                  {/* The Day Number Label — only render if it's a real day, not a padding cell */}
                  {day && (
                    <span style={{
                      fontWeight: '600',
                      color: '#000000',
                      fontSize: '14px',
                      userSelect: 'none'
                    }}>
                      {String(day).padStart(2, '0')}
                    </span>
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