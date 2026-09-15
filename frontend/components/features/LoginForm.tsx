'use client'

import { useEffect, useState, useRef } from 'react'
import { useModalStore } from '@/lib/stores/modals.ts'

export default function LoginForm() {
  const { openModal, closeModal, isOpen } = useModalStore()
  const modalRef = useRef<HTMLDialogElement>(null) 
  const [email, setEmail] = useState('')
  const [password, setPassword] = useState('')
  
  useEffect(() => {
    if (isOpen('login')) {
      modalRef.current?.showModal()
    } else {
      modalRef.current?.close()
    }
  }, [isOpen('login')])

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault()
    //login attempt
    closeModal('login')
  }

  return (
    <>
      <button
        className="btn"
        onClick={() => openModal('login')}
      >
        login
      </button>
      { isOpen('login') &&
        <dialog
          ref={modalRef}
          className="modal"
          onClick={() => {if(isOpen('login')) closeModal('login')}}
        >
          <div
            className="modal-box"
            onClick={(e) => e.stopPropagation()}
          >
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
                <button onClick={(e) => closeModal('login')}>login</button>
              </div>
            </form>
          </div>
        </dialog>
      }
    </>
  )
}
