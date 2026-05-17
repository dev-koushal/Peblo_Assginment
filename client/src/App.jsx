import React, { useState, useEffect } from 'react'
import Auth from './pages/Auth'
import Notes from './pages/Notes'
import Insights from './pages/Insights'

export default function App(){
  const [user, setUser] = useState(null)
  const [view, setView] = useState('notes')

  useEffect(()=>{
    fetch('https://peblo-assginmentbackend.onrender.com/auth/me', { credentials: 'include' })
      .then(r => r.json())
      .then(data => { if(data.user) setUser(data.user) })
      .catch(()=>{})
  },[])

  if(!user) return <Auth onAuth={u=>setUser(u)} />

  return (
    <div className="min-h-screen bg-pastel-1">
      <header className="flex items-center justify-between p-4 bg-white/60 shadow-sm">
        <h1 className="text-xl font-bold text-pink-700">Notely</h1>
        <nav className="flex gap-3">
          <button onClick={()=>setView('notes')} className="px-3 py-1 rounded bg-pink-100">Notes</button>
          <button onClick={()=>setView('insights')} className="px-3 py-1 rounded bg-pink-100">Insights</button>
        </nav>
      </header>
      <main className="p-6">
        {view==='notes' && <Notes user={user} onLogout={()=>setUser(null)} />}
        {view==='insights' && <Insights />}
      </main>
    </div>
  )
}
