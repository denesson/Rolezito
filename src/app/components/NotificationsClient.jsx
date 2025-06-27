'use client'
import { useEffect, useState } from 'react'

export default function NotificationsModal() {
  const [showModal, setShowModal] = useState(false)

  useEffect(() => {
    // só abre na primeira visita
    if (!localStorage.getItem('notif-seen')) {
      setShowModal(true)
    }
  }, [])

  const closeModal = () => {
    localStorage.setItem('notif-seen', '1')
    setShowModal(false)
  }

  const subscribeUser = async () => {
    // aqui entra sua lógica de subscribeUser…
    // depois de inscrever, fecha modal:
    closeModal()
  }

  if (!showModal) return null

  return (
    <div className="fixed inset-0 bg-black/50 flex items-center justify-center z-50">
      <div className="bg-white dark:bg-gray-800 p-6 rounded-xl max-w-sm text-center space-y-4">
        <h2 className="text-xl font-bold text-gray-900 dark:text-white">
          Quer receber notificações?
        </h2>
        <p className="text-gray-700 dark:text-gray-300">
          Fique por dentro toda vez que um novo evento for lançado!
        </p>
        <div className="flex justify-center gap-4">
          <button
            onClick={subscribeUser}
            className="px-4 py-2 bg-blue-600 text-white rounded hover:bg-blue-700 transition"
          >
            Sim, quero!
          </button>
          <button
            onClick={closeModal}
            className="px-4 py-2 bg-gray-300 text-gray-800 rounded hover:bg-gray-400 transition"
          >
            Agora não
          </button>
        </div>
      </div>
    </div>
  )
}
