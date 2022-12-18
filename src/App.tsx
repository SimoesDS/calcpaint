import { useEffect, useState } from 'react';
import './App.css';
import { Wall } from './componets/Wall';
import { checkContainerPaint } from './check-container-paint';

function App() {
  const qtdWall = 4; // Quantidade de paredes
  const qtdContainers = 4; // Quantidade de latas de tintas
  const windowWidth = 2; // Requisito 4: Largura da janela
  const windowHeight = 1.2; // Requisito 4: Altura da janela
  const doorWidth = 0.8; // Requisito 5: Largura da porta
  const doorHeight = 1.9; // Requisito 5: Altura da porta


  const [paintContainer, setPaintContainer] = useState(Array<number>(qtdContainers));
  const [arrHeight, setArrHeight] = useState(Array<number>(qtdWall));
  const [arrWidth, setArrWidth] = useState(Array<number>(qtdWall));
  const [arrDoor, setArrDoor] = useState(Array<number>(qtdWall));
  const [arrWindow, setArrWindow] = useState(Array<number>(qtdWall));
  const [squareMetersTotal, setSquareMetersTotal] = useState(0);
  
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

    
    const squaMtrsTotal = Array
      .from(Array(qtdWall).keys())
      .reduce((pv, crr) => {
        const windowArea = arrWindow[crr] * (windowWidth * windowHeight);
        const doorArea = arrDoor[crr] * (doorWidth * doorHeight);

        return pv + (arrHeight[crr] * arrWidth[crr]) - (windowArea + doorArea);
      }, 0);

    
    setSquareMetersTotal(squaMtrsTotal);
    const liters = squaMtrsTotal / 5;

    // 8 - Latas de tintas
    const containers = checkContainerPaint(liters);

    setPaintContainer(containers);
  }

  return (
    <div className='main'>
      <h1>Calculadora de tintas</h1>
      <div>
        <section className='wall-section'>
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
        </section>
        <button onClick={ handleCalculate }>Calcular</button>
        <section className='info-section'>
          <p>Metros quadrados: { squareMetersTotal.toFixed(2) }</p>
          <p>Litros de tinta: { (squareMetersTotal / 5).toFixed(2) }</p>
          <p>Lata(s) de tinta necessárias para pitar todas as paredes:</p>
          <ul>
            {
              paintContainer
                .map((v, i) => {
                  if(v == 0) return;
                  switch(i) {
                  case 0: return <li key={i}>{v} - Lata(s) de 18 litros</li>;
                  case 1: return <li key={i}>{v} - Lata(s) de 3.6 litros</li>;
                  case 2: return <li key={i}>{v} - Lata(s) de 2.5 litros</li>;
                  case 3: return <li key={i}>{v} - Lata(s) de 0.5 litros</li>;
                  default: return;
                  }
                })
            }
          </ul>
        </section>        
      </div>
    </div>
  );
}

export default App;
