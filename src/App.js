import React, { Component } from 'react';
import './App.css';

const OBJECT_SIZE = 40;
const OBJECTS_PER_SECOND = 1;
const OBJECT_SPEED = 1;
const OBJECT_MOVE_INTERVAL = 20;
const SPEED_INCREMENT = 0.5;

class App extends Component {
  constructor(props) {
    super(props);
    this.state = {
      score: 0,
      objects: [],
      gamePaused: false,
      speed: OBJECT_SPEED,
      gameOver: false,
    };
    this.gameInterval = null;
    this.moveObjectsInterval = null;
  }

  startGame = () => {
    this.gameInterval = setInterval(() => {
      const colors = ['red', 'blue', 'green', 'black'];
      const randomColor = colors[Math.floor(Math.random() * colors.length)];
  
      const newObject = {
        x: Math.floor(Math.random() * (414 - OBJECT_SIZE)),
        y: 0,
        color: randomColor,
      };
      this.setState((prevState) => ({ objects: [...prevState.objects, newObject] }));
    }, 1000 / OBJECTS_PER_SECOND);

    this.moveObjectsInterval = setInterval(() => {
      this.setState((prevState) => {
        const updatedObjects = prevState.objects.map((object) => ({
          ...object,
          y: object.y + prevState.speed,
        }));

        const reachedBottom = updatedObjects.some(
          (object) => object.y >= window.innerHeight - OBJECT_SIZE
        );

        if (reachedBottom) {
          this.stopGame();
          this.setState({ gameOver: true });
        } else {
          this.setState({ objects: updatedObjects });
        }
      });
    }, OBJECT_MOVE_INTERVAL);
  };

  stopGame = () => {
    clearInterval(this.gameInterval);
    clearInterval(this.moveObjectsInterval);
  };

  handleClick = (index) => {
    this.setState((prevState) => ({
      score: prevState.score + 1,
      speed: prevState.speed + SPEED_INCREMENT,
      objects: prevState.objects.filter((_, i) => i !== index),
    }));
  };

  handlePause = () => {
    this.setState({ gamePaused: true });
  };

  handleResume = () => {
    this.setState({ gamePaused: false });
  };

  componentDidMount() {
    this.startGame();
  }

  componentDidUpdate(prevProps, prevState) {
    if (prevState.gamePaused !== this.state.gamePaused) {
      this.stopGame();
      if (!this.state.gamePaused) {
        this.startGame();
      }
    }
  }

  componentWillUnmount() {
    this.stopGame();
  }

  render() {
    const { score, objects, gamePaused, gameOver } = this.state;
  
    return (
      <div className="app-container">
        {gameOver ? (
          <div className="game-over">
            <div>Game Over</div>
            <div>Your score: {score}</div>
          </div>
        ) : (
          <>
            <div className="score">{score}</div>
            <div className="button-container">
              {gamePaused ? (
                <button onClick={this.handleResume} className="button">
                  Resume
                </button>
              ) : (
                <button onClick={this.handlePause} className="button">
                  Pause
                </button>
              )}
              <button onClick={this.stopGame} className="button">
                Stop
              </button>
            </div>
            {objects.map((object, index) => (
              <div
                key={index}
                className="object"
                style={{
                  left: object.x,
                  top: object.y,
                  backgroundColor: object.color,
                  backgroundImage: 'url(IMAGE_URL)', // Add your image URL here or keep it empty for colored circles
                }}
                onClick={() => this.handleClick(index)}
              />
            ))}
          </>
        )}
      </div>
    );
  }}

export default App;
