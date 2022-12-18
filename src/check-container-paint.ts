/* eslint-disable linebreak-style */
export function checkContainerPaint(liters: number): [number, number, number, number] {
  let factoryf1 = 0; //teste
  let factoryf2 = 0;
  let factoryf3 = 0;
  let factoryf4 = 0;
  
  const padronizar = () => {
    if(liters.toString().split('.').length > 1) {
      const inteiro = +liters.toString().split('.')[0];
      let decimal = +liters.toString().split('.')[1];
      decimal /= Math.pow(10, decimal.toString().length - 1);
      decimal = Math.ceil(decimal);
      liters = +inteiro + (decimal / 10);
    }
  };
  
  padronizar();
      
  const estimate = () => {
    return Number(((factoryf1 * 18) + (factoryf2 * 3.6) + (factoryf3 * 2.5) + (factoryf4 * 0.5)).toFixed(1));
  };
      
  const getFactoryF1 = () => factoryf1 = Math.trunc((liters - estimate()) / 18);
      
  const getFactoryF2 = () => {
    const getFactories = () => {
      let factorMin = 0;
      let factorMax = 5;
      if(liters.toString().split('.').length > 1) {
        const decimal = +liters.toString().split('.')[1];
        factorMax = decimal;
        factorMin = decimal >= 5 ? decimal - 5 : decimal + 5;
      }
      return [factorMax, factorMin];
    };
      
    const factories = getFactories();
    factories.every(v => {
      if(estimate() + (v * 3.6) > liters)
        return true;
      else {
        factoryf2 = v;
        return false;
      }
            
    });
  };
      
  const getFactoryF3 = () => factoryf3 = Math.trunc((liters - estimate()) / 2.5);
      
  const getFactoryF4 = () => {
    factoryf4 = Math.trunc((liters - estimate()) / 0.5);
      
    const recalc = () => {
      if(estimate() < liters) {
        factoryf4++;
        recalc();
      }
    };
    recalc();        
  };
      
  const calc = () => {
    const mathQueue = [getFactoryF1, getFactoryF2, getFactoryF3, getFactoryF4];
    let next = 0;
      
    let controle = 0;
    const recalc = (queue: (() => void)[]) => {
      if(controle > 2) return;
      controle++;
      queue.map( f => f());
      
      if(estimate() >= +(liters + 0.1).toFixed(2)) {
        if(mathQueue[next] == getFactoryF1 && factoryf1 > 0) {
          factoryf1--;
          factoryf2 = 0;
          factoryf3 = 0;
          factoryf4 = 0;
          next++;
          recalc([getFactoryF2, getFactoryF3, getFactoryF4]);
        } else if(mathQueue[next] == getFactoryF2 && factoryf2 > 0) {
          factoryf2--;
          factoryf3 = 0;
          factoryf4 = 0;
          next++;
          recalc([getFactoryF3, getFactoryF4]);
        } else if(mathQueue[next] == getFactoryF3 && factoryf3 > 0) {
          factoryf3--;
          factoryf4 = 0;
          recalc([getFactoryF4]);
        }
      }
    };
          
    recalc(mathQueue);
  };
  calc();
  return [ factoryf1, factoryf2, factoryf3, factoryf4 ];
}