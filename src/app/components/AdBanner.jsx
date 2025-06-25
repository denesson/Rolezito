export default function AdBanner({ children }) {
  return (
    <div className="w-full flex justify-center my-4">
      <div className="bg-[#1F2937] border border-[#334155] rounded-lg overflow-hidden">
        {children}
      </div>
    </div>
  )
}
