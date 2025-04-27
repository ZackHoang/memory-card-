import { useEffect } from 'react';
import './App.css'
import { useState } from 'react';

function App() {
  const [cards, setCards] = useState([]); 
  const [selectedCards, setSelectedCards] = useState([]); 
  const [score, setScore] = useState(0); 
  const [bestScore, setBestScore] = useState(0); 

  useEffect(() => {
    const apiUrl = 'https://raw.githubusercontent.com/ByMykel/CSGO-API/main/public/api/en/base_weapons.json';

    fetch(apiUrl)
      .then(response => {
        if (response.ok) {
          return response.json();
        } else {
          throw new Error('Request failed with status code: ' + response.status);
        }
      })
      .then(data => {
        console.log(data);
        let randomCards = []; 
        while (randomCards.length < 12) {
          let randomIndex = Math.floor(Math.random() * 67); 
          let randomWeapon = data[randomIndex]; 
          let isDuplicate = false; 
          for (let i = 0; i < randomCards.length; i++) {
            if (randomCards[i].id === randomWeapon.id) {
              isDuplicate = true; 
              break 
            }
          }
          if (isDuplicate === true) {
            continue 
          } else {
            randomCards.push(randomWeapon); 
          }
        }
        console.log(randomCards); 
        setCards(randomCards); 
      })
      .catch(error => {
        console.error('An error occurred:', error.message);
      });
  }, []); 

  const handleSelectCard = (id) => {
    if (selectedCards.find((cardId) => cardId === id)) { 
      console.log("Reset score"); 
      setSelectedCards([]); 
      if (score > bestScore) {
        setBestScore(score); 
      }
      setScore(0); 
    } else {
      console.log("Score added"); 
      setSelectedCards([...selectedCards, id]); 
      setScore(score + 1); 
      if (score === bestScore) {
        setBestScore(bestScore + 1); 
      }
    }
    let copyCards = [...cards]; 
    for (let i = copyCards.length - 1; i > 0; i--) {
      let randomIndex = Math.floor(Math.random() * (i + 1)); 
      let temp = copyCards[i]; 
      copyCards[i] = copyCards[randomIndex]; 
      copyCards[randomIndex] = temp; 
    }
    setCards(copyCards); 
  }

  return (
    <> 
      <hgroup>
        <h1>Counter Strike Weapons Memory Game</h1>
        <p>Can you memorize all the weapons from Counter Strike? Don't click on the same weapon twice!</p>
      </hgroup>
      <div className='score'>
        <p>Score: {score}</p>
        <p>Best Score: {bestScore}</p>
      </div>
      <div className='cards'>
        {cards.map((card) => {
          return <figure onClick={() => handleSelectCard(card.id)} key={card.id}>
            <img loading='lazy' src={card.image}></img>
            <figcaption>{card.name}</figcaption>
          </figure>
        })}
      </div>
    </>
  )
}

export default App
