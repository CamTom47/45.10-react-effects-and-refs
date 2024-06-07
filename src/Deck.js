import React, {useState, useEffect} from "react";
import Card from "./Card";
import axios from "axios";

const Deck = () => {
    const BASE_URL = 'https://deckofcardsapi.com/api/deck'

  const [deck, setDeck] = useState(null);
  const [drawn, setDrawn] = useState([]);
  const [isShuffling, setIsShuffling] = useState(false);
  

  //on load create a new deck >> useEffect

  useEffect(function loadDekFromAPI () {
    async function fetchDeckData() {
        let resp = await axios.get(`${BASE_URL}/new/shuffle`)
        setDeck(resp.data)
    }
    fetchDeckData()
  }, []);

  /** Draw card: change the state & effect will kick in */
  async function draw() {
    try{
      const resp = await axios.get(`${BASE_URL}/${deck.deck_id}/draw`)

      if (resp.data.remaining === 0) throw new Error("Deck Empty!")

    const card = resp.data.cards[0];

      setDrawn( d => [
        ...d,
        {id: card.code,
          name: card.value + " of " + card.suit,
          image: card.image
        },
      ])

      setDeck({
          "deck_id": deck.deck_id,
          "remaining": resp.data.remaining,
          "shuffled": deck.shuffled
        })
    } catch (e) {
      alert(e)
    }}

        /** Shuffle: change the state & effect will kick in */
  async function shuffle() {
    setIsShuffling(true);
    try {
      const resp = await axios.get(`${BASE_URL}/${deck.deck_id}/shuffle/`)
      setDrawn([]);

    } catch(e) {
      alert(e)
    } finally {
        setIsShuffling(false);
    }
}

    /** Return draw button (disabled if shuffling)*/

    function renderDrawBtnIfOk(){
        if (!deck) return null;

        return (
            <button
            className="Deck-drawButton"
            onClick={draw}
            disabled={isShuffling}
            >
                Draw Card
            </button>

        )
    }

    /** Return shuffle button (disabled if already is)*/

    function renderShuffleButtonIfOk() {
        if (!deck) return null

        return (
            <button
            className="Deck-shuffleButton"
            onClick={shuffle}
            disabled={isShuffling}>
                Shuffle Deck
            </button>
        )
    }

    return (
        <>
        {renderDrawBtnIfOk()}       
        {renderShuffleButtonIfOk()}   
        <div className="Deck-cardArea">{
            drawn.map( c => (
                <Card key={c.id} name={c.name} image={c.image}
                />
            ))
        }
        </div>

        </>
    )

}
export default Deck;