import { Suspense } from "react"
import NovaSenhaForm from "./NovaSenhaForm"

export default function NovaSenhaPage() {
  return (
    <Suspense fallback={<div className="text-white text-center mt-10">Carregando formulário...</div>}>
      <NovaSenhaForm />
    </Suspense>
  )
}
