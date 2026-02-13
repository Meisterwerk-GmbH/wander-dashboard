const RENTSHOP_LOGO = "https://www.rentshop.ch/_next/static/media/logo-white.28480f1c.svg";

export default function RentshopCard() {
  return (
    <section className="glass relative overflow-hidden rounded-3xl p-8">
      <div className="absolute -bottom-24 -right-16 h-52 w-52 rounded-full bg-rentshop/30 blur-3xl" />
      <div className="relative space-y-6">
        <div className="flex items-center">
          <img src={RENTSHOP_LOGO} alt="Rentshop" className="h-10 md:h-12 object-contain" />
        </div>
        <div className="space-y-3">
          <h2 className="text-3xl font-semibold text-slate-50">Easy Miete. Easy Lieferung.</h2>
          <p className="text-sm text-slate-100">
            mieten statt kaufen, bei rentshop findest du alles für deinen Event. Das Material
            wird per Post zu dir nach Hause geliefert.
          </p>
        </div>
        <div className="flex flex-wrap gap-3 text-xs text-slate-200">
          <span className="rounded-full bg-white/5 px-3 py-1">Locations & Leasing</span>
          <span className="rounded-full bg-white/5 px-3 py-1">Pop-up Spaces</span>
          <span className="rounded-full bg-white/5 px-3 py-1">Community Driven</span>
        </div>
      </div>
    </section>
  );
}
