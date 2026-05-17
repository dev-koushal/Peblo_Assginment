import React, { useEffect, useState } from 'react'

export default function Public(){
  const [note, setNote] = useState(null)
  const parts = window.location.pathname.split('/')
  const id = parts[parts.length-1]

  useEffect(()=>{
    fetch(`https://peblo-assginmentbackend.onrender.com/public/${id}`)
      .then(r=>r.json())
      .then(d=> setNote(d.note))
      .catch(()=>{})
  },[])

  if(!note) return <div className="min-h-screen flex items-center justify-center">Note not found or loading...</div>

  return (
    <div className="min-h-screen bg-pastel-2 flex items-center justify-center p-6">
      <div className="max-w-2xl bg-white p-6 rounded-lg shadow-md">
        <h1 className="text-2xl font-bold mb-2">{note.title}</h1>
        <div className="text-sm text-gray-500 mb-4">By {note.owner?.name || 'Unknown'}</div>
        <div className="whitespace-pre-wrap">{note.content}</div>
      </div>
    </div>
  )
}
