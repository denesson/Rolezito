// Exemplo de componentes laterais: src/app/components/SideBanner.jsx
export default function SideBanner({ children }) {
  return (
    <div className="w-72 mx-auto my-6">
      <div className="bg-[#1F2937] border border-[#334155] rounded-lg overflow-hidden">
        {children}
      </div>
    </div>
  )
}
