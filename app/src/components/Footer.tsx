export default function Footer() {
  return (
    <footer className="border-t border-warm-200/60 mt-24">
      <div className="max-w-7xl mx-auto px-6 lg:px-10 py-12 flex flex-col md:flex-row items-center justify-between gap-4 text-warm-500 text-xs tracking-widest uppercase">
        <span className="font-serif text-base normal-case tracking-wide text-stone-925">
          ÉDIT
        </span>
        <span>Modern Style, Designed To Last</span>
        <span className="normal-case tracking-normal">
          &copy; {new Date().getFullYear()} ÉDIT Lookbook
        </span>
      </div>
    </footer>
  );
}
