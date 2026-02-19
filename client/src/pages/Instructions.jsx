import React from 'react';
import '../styles.css'; // Importing the external styles

const Home = () => {
  return (
    <div className="instructions-container">
      <header className="instructions-header">
        <h1>Instructions</h1>
        <p>Play the game to learn about academic publishing and avoid the Academic Predator!</p>
        <p>About the game:
            <ol>
              <li>There are three levels in the game: Level 0, Level 1, and Level 2</li>
              <li>Learn how to avoid predatory journals</li>
              <li>Discover best practices for ethical research</li>
            </ol>
        </p>
      </header>
      
      <main className="home-content">
        <button className="cta-button" onClick={() => console.log('Button Clicked!')}>
          Start Game
        </button>
      </main>
    </div>
  );
};

export default Home;