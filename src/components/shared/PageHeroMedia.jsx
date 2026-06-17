import React from 'react'

// Cabecera editorial a sangre: imagen de fondo a pantalla completa con un
// velo oscuro degradado y el título encima en blanco. Si no se pasa `img`,
// muestra un fondo oscuro con un marcador de la foto que debe ir ahí.
function PageHeroMedia({ img, alt, placeholder, position, children }) {
  return (
    <section
      className={"page-hero page-hero--bg" + (img ? "" : " page-hero--bg-ph")}
      style={img ? { backgroundImage: `url(${img})`, backgroundPosition: position || "center" } : undefined}
      role="img" aria-label={alt || placeholder || "Imagen de cabecera"}>
      <div className="container">
        <div className="page-hero-text">{children}</div>
      </div>
      {!img && <span className="page-hero-bg-label mono">{placeholder || "FOTO"}</span>}
    </section>
  );
}

export default PageHeroMedia
