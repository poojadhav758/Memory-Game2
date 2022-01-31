import { useEffect, useRef, useState } from 'react'
import Card from './Card'
import '../scss/board.scss'
import { setInterval } from 'timers';


type BoardProps = {
  setMoves: React.Dispatch<React.SetStateAction<number>>
  finishGameCallback: () => void
  cardIds: Array<number>
  setTimeLeft:React.Dispatch<React.SetStateAction<number>>
  timeLeft:number
  // m: NodeJS.Timer
}

function Board(props: BoardProps) {
  const [openCards, setOpenCards] = useState<Array<number>>([]);
  const [clearedCards, setClearedCards] = useState<Array<number>>([]);
  const [shouldDisableAllCards, setShouldDisableAllCards] = useState<boolean>(false);
  const timeout = useRef<NodeJS.Timeout>(setTimeout(()=>{}));
  const [firstCardClick, setFirstCardClick] = useState(0);
  const [stopFlag, setStopFlag] = useState(false);

  const disable = () => {
    setShouldDisableAllCards(true);
  };
  const enable = () => {
    setShouldDisableAllCards(false);
  };

  const checkCompletion = () => {
    console.log("clearedCards",clearedCards)
    if (clearedCards.length === props.cardIds.length) {
     props.finishGameCallback()
    }
  }

  const evaluate = () => {
    const [first, second] = openCards;
    enable();
    // check if first card is equal second card
    if ((first % 6 + 1) === (second % 6 + 1)) {
      setClearedCards((prev) => [...prev, first, second]);
      setOpenCards([]);
      return;
    }
    // flip the cards back after 500ms duration
    timeout.current = setTimeout(() => {
      setOpenCards([]);
    }, 1000);
  }

  const handleCardClick = (id: number) => {
    if(firstCardClick === 0){
      setFirstCardClick(1);
      console.log("click1");
    }
    if (openCards.length === 1) {
      // in this case we have alredy selected one card
      // this means that we are finishing a move
      setOpenCards((prev) => [...prev, id]);
      props.setMoves((moves) => moves + 1)
      disable();
    } else {
      // in this case this is the first card we select
      clearTimeout(timeout.current);
      setOpenCards([id]);
    }
  };

  useEffect(() => {
    let timeout: NodeJS.Timeout = setTimeout(()=>{});
    if (openCards.length === 2) {
      timeout = setTimeout(evaluate, 500);
    }
    return () => {
      clearTimeout(timeout);
    };
  }, [openCards]);


  const timer =()=> 
  {var myInterval = setInterval(()=>{ 
    stopFlag ? 
      props.setTimeLeft(0)
      :
    props.setTimeLeft((timeLeft)=>
    timeLeft >0 && !stopFlag?  
    timeLeft-1 : timeLeft)
  },1000)};


  useEffect(() => {
    console.log("firstCardClick",firstCardClick)
    if(firstCardClick === 1 ){
      timer();
          setTimeout(() => {
        if(props.timeLeft >=0){
        setShouldDisableAllCards(true);
        }
      }, 30000);
    }
  }, [firstCardClick,stopFlag]);
  
  useEffect(() => {
    checkCompletion();
    if(clearedCards.length=== 12){
      console.log("finish");
      // props.setTimeLeft((timeLeft)=>timeLeft);
      setStopFlag((stopFlag)=>!stopFlag);
    }
  }, [clearedCards]);

  const checkIsFlipped = (id: number) => {
    return clearedCards.includes(id) || openCards.includes(id);
  };

  const checkIsInactive = (id: number) => {
    return clearedCards.includes(id)
  };

  return (
    <div className={'board'}>
      {props.cardIds.map(i => {
        return <Card
          key={i}
          image={`/images/${i % 6 + 1}.png`}
          id={i}
          isDisabled={shouldDisableAllCards}
          isInactive={checkIsInactive(i)}
          isFlipped={checkIsFlipped(i)}
          onClick={handleCardClick}
        />
      })}
    </div>
  )
}

export default Board