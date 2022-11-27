import './index.css';

type WallParamns = {
  id: number;
  height: [number, (n: number) => void];
  width: [number, (n: number) => void];
  window: [number, (n: number) => void];
  door: [number, (n: number) => void];
};

export function Wall({
  id,
  height,
  width,
  window,
  door,
}: WallParamns) {
  return (
    <div className='wall-main'>
      Parede { id + 1}
      <section>
        <label>
          <b>Altura da parede:</b>
        </label>
        <input
          type="number"
          value={ height[0] || ''}
          onChange={e => height[1](Number(e.target.value))}
        />metros
      </section>
      <section>
        <label>
          <b>Largura da parede:</b>
        </label>
        <input
          type="number"
          value={ width[0] || ''}
          onChange={e => width[1](Number(e.target.value))}
        />metros
      </section>
      <section>
        <label>
          <b>Quantidade de janelas:</b>
        </label>
        <input
          type="number"
          value={ window[0] || ''}
          onChange={e => window[1](Number(e.target.value))}
        />
      </section>
      <section>
        <label>
          <b>Quantidade de portas:</b>
        </label>
        <input
          type="number"
          value={ door[0] || ''}
          onChange={e => door[1](Number(e.target.value))}
        />
      </section>
    </div>
  );
}