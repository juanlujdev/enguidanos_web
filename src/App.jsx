import React, { useState, useEffect } from 'react'
import { useTweaks, TweaksPanel, TweakSection, TweakRadio, TweakSelect, TweakColor, TweakToggle } from './tweaks/TweaksPanel.jsx'
import { Header, Footer } from './components/shared/index.js'
import { Home, NaturalezaPage, PatrimonioPage, HistoriaPage, AgendaPage, AyuntamientoPage, OficinaTurismoPage, TurismoPage, TurismoDeportivoPage, RestaurantesPage, AlojamientosPage, AvisoLegalPage, PrivacidadPage, AccesibilidadPage } from './components/pages/index.js'

const TWEAK_DEFAULTS = /*EDITMODE-BEGIN*/{
  "primaryAccent": "#c2562a",
  "fontHeading": "DM Serif Display",
  "fontBody": "Manrope",
  "density": "comfortable",
  "dark": false
}/*EDITMODE-END*/;

function App() {
  const [page, setPage] = useState("home");
  const [navTarget, setNavTarget] = useState(null);
  const [scrolled, setScrolled] = useState(false);
  const [tweaks, setTweak] = useTweaks(TWEAK_DEFAULTS);

  // Navegación con deep-link: cambia de página y, opcionalmente, marca un
  // elemento destino para que la página haga scroll y lo resalte al montar.
  const navigate = (dest, target = null) => { setNavTarget(target); setPage(dest); };
  const goClear = (dest) => navigate(dest, null);

  // Ocultar splash cuando React termina de montar
  useEffect(() => {
    const splash = document.getElementById('splash')
    if (!splash) return
    splash.style.opacity = '0'
    splash.addEventListener('transitionend', () => splash.remove(), { once: true })
  }, [])

  // Apply tweaks
  useEffect(() => {
    document.documentElement.style.setProperty("--terracota", tweaks.primaryAccent);
    document.documentElement.style.setProperty("--font-serif", `"${tweaks.fontHeading}", Georgia, serif`);
    document.documentElement.style.setProperty("--font-sans", `"${tweaks.fontBody}", -apple-system, sans-serif`);
    document.documentElement.dataset.theme = tweaks.dark ? "dark" : "light";
    document.body.style.fontSize = tweaks.density === "compact" ? "15px" : tweaks.density === "spacious" ? "17px" : "16px";
  }, [tweaks]);

  // Scroll handling
  useEffect(() => {
    const onScroll = () => setScrolled(window.scrollY > 40);
    window.addEventListener("scroll", onScroll);
    return () => window.removeEventListener("scroll", onScroll);
  }, []);

  // Reveal animations — IntersectionObserver + MutationObserver para captar
  // nuevos elementos al cambiar de pestaña dentro de una misma página.
  useEffect(() => {
    const obs = new IntersectionObserver((entries) => {
      entries.forEach(e => { if (e.isIntersecting) { e.target.classList.add("in"); obs.unobserve(e.target); } });
    }, { threshold: 0.05, rootMargin: "0px 0px -8% 0px" });
    const observeAll = () => {
      document.querySelectorAll(".reveal:not(.in)").forEach(el => obs.observe(el));
    };
    observeAll();
    const mo = new MutationObserver(observeAll);
    mo.observe(document.body, { childList: true, subtree: true });
    return () => { obs.disconnect(); mo.disconnect(); };
  }, [page]);

  // Reset scroll on page change (instantáneo: evita que el smooth global
  // cancele el salto y deja la página lista para el deep-link).
  useEffect(() => {
    const html = document.documentElement;
    const prev = html.style.scrollBehavior;
    html.style.scrollBehavior = "auto";
    window.scrollTo(0, 0);
    html.style.scrollBehavior = prev;
  }, [page]);

  // Páginas con cabecera de imagen a sangre: la barra fija va en blanco arriba.
  const HERO_BG_PAGES = ["naturaleza", "patrimonio", "turismo-deportivo", "restaurantes", "alojamientos", "agenda", "oficina-turismo", "historia"];
  const transparent = page === "home" || HERO_BG_PAGES.includes(page);

  return (
    <>
      <Header page={page} setPage={goClear} scrolled={scrolled} transparent={transparent} />
      {page === "home" && <Home setPage={goClear} navigate={navigate} />}
      {page === "turismo" && <TurismoPage setPage={goClear} />}
      {page === "turismo-deportivo" && <TurismoDeportivoPage />}
      {page === "restaurantes" && <RestaurantesPage />}
      {page === "alojamientos" && <AlojamientosPage />}
      {page === "naturaleza" && <NaturalezaPage navTarget={navTarget} />}
      {page === "oficina-turismo" && <OficinaTurismoPage navTarget={navTarget} />}
      {page === "patrimonio" && <PatrimonioPage navTarget={navTarget} />}
      {page === "historia" && <HistoriaPage />}
      {page === "agenda" && <AgendaPage />}
      {page === "ayuntamiento" && <AyuntamientoPage navTarget={navTarget} />}
      {page === "aviso-legal" && <AvisoLegalPage />}
      {page === "privacidad" && <PrivacidadPage />}
      {page === "accesibilidad" && <AccesibilidadPage />}
      <Footer setPage={goClear} navigate={navigate} />

      <TweaksPanel title="Tweaks">
        <TweakSection title="Color">
          <TweakColor label="Acento principal" value={tweaks.primaryAccent} onChange={(v) => setTweak("primaryAccent", v)} />
          <TweakToggle label="Modo oscuro" value={tweaks.dark} onChange={(v) => setTweak("dark", v)} />
        </TweakSection>
        <TweakSection title="Tipografía">
          <TweakSelect label="Titulares" value={tweaks.fontHeading} onChange={(v) => setTweak("fontHeading", v)}
            options={["DM Serif Display","Cormorant Garamond","Fraunces","Playfair Display","Libre Caslon Text"]} />
          <TweakSelect label="Cuerpo" value={tweaks.fontBody} onChange={(v) => setTweak("fontBody", v)}
            options={["Manrope","Inter","DM Sans","Work Sans","Lato"]} />
        </TweakSection>
        <TweakSection title="Densidad">
          <TweakRadio label="Tamaño base" value={tweaks.density} onChange={(v) => setTweak("density", v)}
            options={[{value:"compact",label:"Compacto"},{value:"comfortable",label:"Normal"},{value:"spacious",label:"Amplio"}]} />
        </TweakSection>
      </TweaksPanel>
    </>
  );
}

export default App;
