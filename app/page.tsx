'use client';

import { useState } from 'react';
import envios from './envios.json';

export default function Home() {
  const [selected, setSelected] = useState(0);

  return (
    <div style={{ display: 'flex', height: '100vh' }}>
      <div style={{ flex: 1, padding: '2rem', borderRight: '1px solid #ccc' }}>
        <h2>Historial de envios:</h2>
        <select
          value={selected}
          onChange={(e) => setSelected(Number(e.target.value))}
          aria-label="historial envios lista"
        >
          <option value={0}>1</option>
          <option value={1}>2</option>
          <option value={2}>3</option>
          <option value={3}>4</option>
          <option value={4}>5</option>
        </select>
      </div>
      <div style={{ flex: 1, padding: '2rem' }}>
        <h2>Envio:</h2>
        <pre>{JSON.stringify(envios[selected], null, 2)}</pre>
      </div>
    </div>
  );
}
