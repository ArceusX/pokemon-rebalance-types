import React, {useEffect} from 'react';
import TypeRebalance from './TypeRebalance';
import "./TypeRebalance.css";

const App = () => {
    useEffect(() => {
      document.title = "Pokémon Type Rebalance";
    }, []);
  
    return (
        <TypeRebalance />
    );
  };
export default App;