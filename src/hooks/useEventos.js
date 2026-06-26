import { useState, useEffect } from 'react'

export function useEventos() {
  const [data, setData] = useState(null)
  useEffect(() => {
    fetch(import.meta.env.BASE_URL + 'data/eventos.json')
      .then(r => { if (!r.ok) throw new Error(r.status); return r.json(); })
      .then(setData)
      .catch(err => { console.error('useEventos:', err); setData([]); })
  }, [])
  return data
}
