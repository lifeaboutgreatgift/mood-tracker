import { useState } from 'react';
import './App.css';

function App() {
  
  return (
    // This is your main full-screen background wrapper
    <div style={{ 
      height: '100%',        // Force it to fill the entire screen height
      width: '100%',            // Force it to fill the entire screen width
      padding: '40px'         // Gives you clean padding around your inner workspace

    }}>
      
      {/* Your inner workspace box where the tracker will live */}
      <div style={{
        maxWidth: '1200px',
        margin: '0 auto',        // Automatically centers your workspace horizontally
      }}>
        <h1> Mood Tracker</h1>
        <p>This is  clean white workspace canvas.</p>
      </div>

    </div>
  );
  
 
}

export default App;