import React, {useEffect} from 'react';
import TypeRebalanceApp from './TypeRebalanceApp';
import {TypeDamage} from './TypeData';

const App = () => {
    useEffect(() => {
      document.title = "Pokémon Type Rebalancing";
    }, []);
  
    return (
        <TypeRebalanceApp srcTypeDamage={TypeDamage} />
    );
  };
export default App;