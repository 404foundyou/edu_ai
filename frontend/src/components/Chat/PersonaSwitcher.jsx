// components/Chat/PersonaSwitcher.jsx
// Dropdown to switch between AI personas

import { useState } from 'react'

const PERSONAS = [
  { id: 'default', label: 'Default', icon: '⚡', desc: 'Standard assistant' },
  { id: 'teacher', label: 'Teacher', icon: '🎓', desc: 'Step by step explanations' },
  { id: 'developer', label: 'Developer', icon: '💻', desc: 'Technical and code-focused' },
  { id: 'friend', label: 'Friend', icon: '🤝', desc: 'Casual and supportive' },
]

const PersonaSwitcher = ({ selected, onSelect }) => {
  const [open, setOpen] = useState(false)
  const current = PERSONAS.find((p) => p.id === selected) || PERSONAS[0]

  return (
    <div className="relative">
      {/* Trigger button */}
      <button
        onClick={() => setOpen(!open)}
        className="flex items-center gap-2 px-3 py-1.5 bg-[#222] border border-[#333] rounded-lg text-[12px] text-[#ccc] hover:border-[#444] transition-colors"
      >
        <span>{current.icon}</span>
        <span>{current.label}</span>
        <svg width="10" height="10" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
          <path d="M6 9l6 6 6-6" strokeLinecap="round" strokeLinejoin="round" />
        </svg>
      </button>

      {/* Dropdown */}
      {open && (
        <div className="absolute right-0 top-9 w-52 bg-[#1e1e1e] border border-[#2a2a2a] rounded-xl shadow-xl z-50 overflow-hidden">
          {PERSONAS.map((persona) => (
            <button
              key={persona.id}
              onClick={() => {
                onSelect(persona.id)
                setOpen(false)
              }}
              className={`w-full flex items-start gap-3 px-3 py-2.5 text-left hover:bg-[#2a2a2a] transition-colors ${
                selected === persona.id ? 'bg-[#2a2a2a]' : ''
              }`}
            >
              <span className="text-base mt-0.5">{persona.icon}</span>
              <div>
                <p className={`text-[12px] font-medium ${selected === persona.id ? 'text-[#7c6af7]' : 'text-[#ccc]'}`}>
                  {persona.label}
                </p>
                <p className="text-[11px] text-[#555]">{persona.desc}</p>
              </div>
              {selected === persona.id && (
                <svg className="ml-auto mt-1 flex-shrink-0" width="12" height="12" viewBox="0 0 24 24" fill="none" stroke="#7c6af7" strokeWidth="2.5">
                  <path d="M20 6L9 17l-5-5" strokeLinecap="round" strokeLinejoin="round" />
                </svg>
              )}
            </button>
          ))}
        </div>
      )}
    </div>
  )
}

export default PersonaSwitcher