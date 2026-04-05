export default function Footer() {
  return (
    <footer className="w-full py-12 mt-auto bg-[#0e0e0f] border-t border-white/5">
      <div className="flex flex-col md:flex-row justify-between items-center px-8 md:px-12 gap-6 max-w-[1600px] mx-auto">
        <div className="flex flex-col items-center md:items-start gap-4">
          <div className="font-headline font-bold text-[#d0bcff] tracking-tighter text-xl uppercase">BookMyFun</div>
          <div className="font-headline text-sm tracking-wide uppercase text-[#e5e2e3]/40">© 2024 BookMyFun.</div>
        </div>
        <div className="flex flex-wrap justify-center gap-8 font-headline text-sm tracking-wide uppercase">
          <a className="text-[#e5e2e3]/40 hover:text-secondary transition-colors duration-200" href="#">Legal</a>
          <a className="text-[#e5e2e3]/40 hover:text-secondary transition-colors duration-200" href="#">Privacy</a>
          <a className="text-[#e5e2e3]/40 hover:text-secondary transition-colors duration-200" href="#">Support</a>
          <a className="text-[#e5e2e3]/40 hover:text-secondary transition-colors duration-200" href="#">Contact</a>
        </div>
        <div className="flex gap-4">
          <div className="w-8 h-8 rounded-full border border-white/10 flex items-center justify-center hover:border-primary cursor-pointer transition-colors">
            <span className="material-symbols-outlined text-sm text-[#e5e2e3]/40">share</span>
          </div>
          <div className="w-8 h-8 rounded-full border border-white/10 flex items-center justify-center hover:border-primary cursor-pointer transition-colors">
            <span className="material-symbols-outlined text-sm text-[#e5e2e3]/40">public</span>
          </div>
        </div>
      </div>
    </footer>
  );
}
