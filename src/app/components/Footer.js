// components/Footer.jsx
export default function Footer() {
  return (
    <footer className="bg-[#1F2937] border-t border-[#334155] py-6 mt-16">
      <div className="max-w-6xl mx-auto text-center text-[#9CA3AF] text-sm tracking-wide select-none">
        Desenvolvido por{" "}
        <span className="font-semibold text-[#0EA5E9]">Denesson Barreto</span> &copy;{" "}
        {new Date().getFullYear()}
      </div>
    </footer>
  )
}
