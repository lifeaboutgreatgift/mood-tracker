import { useState } from 'react';
import './App.css';

function App() {
  const [mood, setMood] = useState('');
  
  return (
    <div className="app">
      <h1>Mood Tracker</h1>
      <p>Today's mood: {mood}</p>

      <button onClick={() => setMood('😊')}>Happy</button>
      <button onClick={() => setMood('🥲')}>Sad</button>
      <button onClick={() => setMood('😴')}>Sleepy</button>
    </div>
  )
}

export default App;