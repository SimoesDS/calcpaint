import { useEffect, useState } from 'react';
import './App.css';
import { Wall } from './componets/Wall';

function App() {
  const qtdWall = 4; // Quantidade de paredes
  const windowWidth = 2; // Requisito 4: Largura da janela
  const windowHeight = 1.2; // Requisito 4: Altura da janela
  const doorWidth = 0.8; // Requisito 5: Largura da porta
  const doorHeight = 1.9; // Requisito 5: Altura da porta

  const [paintContainer, setPaintContainer] = useState(0);
  const [arrHeight, setArrHeight] = useState(Array<number>(qtdWall));
  const [arrWidth, setArrWidth] = useState(Array<number>(qtdWall));
  const [arrDoor, setArrDoor] = useState(Array<number>(qtdWall));
  const [arrWindow, setArrWindow] = useState(Array<number>(qtdWall));
  
  const s = paintContainer > 1 ? 's' : '';
  
  // initialize the arrays
  useEffect(() => {
    setArrDoor(() => [...Array(qtdWall)].map(() => 0));
    setArrWindow(() => [...Array(qtdWall)].map(() => 0));
  }, []);
  
  function handleInput(index: number, setFunc: React.Dispatch<React.SetStateAction<number[]>>) {
    return (value: number) => {
      setFunc((arr) => [...arr].map((v, i) => i == index ? value : v));
    };
  }

  function handleCalculate() {
    
    const checkSquareMeters = (i: number, mts: number) => {
      if(mts < 1) throw new Error(`Parede ${i + 1}: Não pode ter menos de 1 metro quadrado`);
      if(mts > 50) throw new Error(`Parede ${i + 1}: Não pode ter mais de 50 metros quadrados`);
    };

    const checkAreaWall = (i: number, mts: number) => {
      const windowArea = arrWindow[i] * (windowWidth * windowHeight);
      const doorArea = arrDoor[i] * (doorWidth * doorHeight);

      if(windowArea + doorArea > (mts * 0.5)) throw new Error('Total de área das portas e janelas deve ser no máximo 50% da área de parede');
    };

    const checkWallHeight = (i: number, wallHeight: number) => {
      console.log(arrDoor, i);
      if(arrDoor[i] && wallHeight < doorHeight + 0.3) throw new Error('A altura da parede com porta deve ser, no mínimo, 30 centímetros maior que a altura da porta');
    };

    for (let i = 0; i < qtdWall; i++) {
      const squareMeters = arrHeight[i] * arrWidth[i];

      try {
        // 1 - Não pode ter menos de 1 metro quadrado nem mais de 50 metros quadrados
        checkSquareMeters(i, squareMeters);

        // 2 - O total de área das portas e janelas deve ser no máximo 50% da área de parede
        checkAreaWall(i, squareMeters);

        // 3 - A altura da parede com porta deve ser, no mínimo, 30 centímetros maior que a altura da porta
        checkWallHeight(i, arrHeight[i]);


      } catch (error) {
        console.error(`Parede ${i + 1}: ${error}`);
        return;
      }
    }



    setPaintContainer(1);
  }

  return (
    <div className='main'>
      <h1>Calculadora de tintas</h1>
      <div>
        {
          Array
            .from(Array(qtdWall).keys())
            .map(i => <Wall
              key={i}
              id={i}
              height={ [arrHeight[i], handleInput(i, setArrHeight)] }
              width={ [arrWidth[i], handleInput(i, setArrWidth)] }
              door={ [arrDoor[i], handleInput(i, setArrDoor)] }
              window={ [arrWindow[i], handleInput(i, setArrWindow)] }></Wall>)
        }
      </div>
      <button onClick={ handleCalculate }>Calcular</button>
      <p>Lata{s} de tinta{s}: {paintContainer}</p>
    </div>
  );
}

export default App;
