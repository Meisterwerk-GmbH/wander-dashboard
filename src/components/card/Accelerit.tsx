const ACCELERIT_LOGO =
  "https://static.wixstatic.com/media/3582a0_4c1005955a7e45a1a127f4655356a71e~mv2.png/v1/fill/w_980,h_147,al_c,q_85,usm_0.66_1.00_0.01,enc_avif,quality_auto/accelerit-logo-1.png";

export default function Accelerit() {
  return (
    <section className="glass relative overflow-hidden rounded-3xl p-8">
      <div className="absolute -top-24 -left-16 h-48 w-48 rounded-full bg-accelerit/30 blur-3xl" />
      <div className="relative space-y-6">
        <div className="flex items-center">
          <img
            src={ACCELERIT_LOGO}
            alt="Accelerit"
            className="h-9 md:h-10 object-contain brightness-0 invert"
          />
        </div>
        <div className="space-y-3">
          <h2 className="text-3xl font-semibold text-slate-50">Build. Scale. Accelerate.</h2>
          <p className="text-sm text-slate-100">
            Produkt- und Plattformteams, die jetzt liefern. Fokus auf Engineering, Geschwindigkeit
            und messbaren Impact. Weiter sind wir heisse typen zwischen 30 und 40
          </p>
        </div>
        <div className="flex flex-wrap gap-3 text-xs text-slate-200">
          <span className="rounded-full bg-white/5 px-3 py-1">Engineering Momentum</span>
          <span className="rounded-full bg-white/5 px-3 py-1">Cloud & Platform</span>
          <span className="rounded-full bg-white/5 px-3 py-1">Delivery Partners</span>
        </div>
      </div>
    </section>
  );
}
