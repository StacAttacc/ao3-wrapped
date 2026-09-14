'use client'

import { useState } from 'react'

export default function LoginForm() {
  const [email, setEmail] = useState('')
  const [password, setPassword] = useState('')

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault()
//login attempt
    document.getElementById('creds_modal')?.close()
  }

  return (
    <>
      <button
        className="btn"
        onClick={() => document.getElementById('creds_modal')?.showModal()}
      >
        login
      </button>
      <dialog id="creds_modal" className="modal">
        <div className="modal-box">
          <form onSubmit={handleSubmit}>
            <input
              type="email"
              placeholder="email"
              value={email}
              onChange={(e) => setEmail(e.target.value)}
              required
            />
            <input
              type="password"
              placeholder="password"
              value={password}
              onChange={(e) => setPassword(e.target.value)}
              required
            />
            <div className="modal-action">
              <button onClick={(e) => document.getElementById('creds_modal')?.close()}>login</button>
            </div>
          </form>
        </div>
      </dialog>
    </>
  )
}
