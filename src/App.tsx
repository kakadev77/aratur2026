import { useEffect, useLayoutEffect, useRef, useState, type CSSProperties } from 'react'

// Área útil de cada foto em pixels da imagem original: [x, y, largura, altura]; sem `crop`, vale a imagem inteira.
// As fotos antigas que ainda restam são capturas de tela com bordas, cantos ou cards embutidos;
// o recorte mantém esses elementos sempre fora do quadro, em qualquer proporção.
type Crop = [number, number, number, number]
type PhotoMeta = { src: string; size: [number, number]; crop?: Crop; focus?: [number, number] }

const inset = (w: number, h: number, t = 8, r = 8, b = 8, l = 8): Crop => [l, t, w - l - r, h - t - b]

const photos = {
  miranteAraruna: { src: '/images/mirante-araruna.jpg', size: [1125, 1099], focus: [562, 650] },
  pedraDaBocaCafe: { src: '/images/pedra-da-boca-cafe.jpg', size: [1075, 827], focus: [537, 470] },
  baraoCafe: { src: '/images/barao-cafe.jpg', size: [1200, 1600], focus: [600, 1010] },
  spazioDaPedra: { src: '/images/spazio-da-pedra.jpg', size: [1936, 3435], focus: [968, 1200] },
  recantoDosCoqueiros: { src: '/images/recanto-dos-coqueiros.jpg', size: [813, 1600], crop: [0, 0, 813, 1570], focus: [406, 850] },
  ararunaAerea: { src: '/images/araruna-vista-aerea.jpg', size: [2368, 903], focus: [1250, 450] },
  parquePedraDaBoca: { src: '/images/parque-estadual-pedra-da-boca.webp', size: [1200, 630], focus: [630, 280] },
  pedraMacambira: { src: '/images/pedra-da-macambira.png', size: [700, 300], focus: [330, 160] },
  canionMacapa: { src: '/images/canion-macapa-hd.jpg', size: [1512, 903], focus: [760, 480] },
  mercadoCultural: { src: '/images/mercado-cultural.jpg', size: [700, 300] },
  historiaAraruna: { src: '/images/historia-araruna.png', size: [512, 321], focus: [256, 150] },
  adegaCafeNaSerra: { src: '/images/adega-cafe-na-serra.jpg', size: [2560, 1707] },
  casaFarinha: { src: '/images/casa-de-farinha-interior.jpg', size: [1024, 683] },
  oBeco: { src: '/images/beco-bistro.jpg', size: [2560, 1707], focus: [1280, 760] },
  emporioPrime: { src: '/images/emporio-prime-hd.jpg', size: [1080, 1080], focus: [540, 500] },
  negaJoana: { src: '/images/nega-joana-lago.jpg', size: [1024, 576], focus: [580, 330] },
  ararunaHotel: { src: '/images/araruna-hotel.png', size: [1080, 1080], focus: [620, 500] },
  hotelPedraDaBoca: { src: '/images/hotel-pedra-da-boca.jpg', size: [1024, 529] },
  altoSerra: { src: '/images/alto-da-serra-fachada.png', size: [1080, 1080], focus: [540, 720] },
  // A foto antiga da Romaria termina em y≈490; abaixo disso estava o card antigo.
  romariaFatima: { src: '/images/romaria-fatima-procissao.jpg', size: [640, 360] },
  // Cartazes oficiais: o quadro fica no nome do evento, sem datas, chamadas e faixas de patrocinadores.
  exposerra: { src: '/images/exposerra-2026.png', size: [2480, 2480], crop: [150, 429, 2180, 1451] },
  saoJoao: { src: '/images/sao-joao-na-serra-2026.png', size: [1080, 1920], crop: [0, 230, 1080, 640] },
  motoFest: { src: '/images/moto-fest-2026.png', size: [1600, 1200], focus: [800, 560] },
} satisfies Record<string, PhotoMeta>

function Photo({ photo, alt, className = '', priority = false }: { photo: PhotoMeta; alt: string; className?: string; priority?: boolean }) {
  const [w, h] = photo.size
  const [cx, cy, cw, ch] = photo.crop ?? [0, 0, w, h]
  const [fx, fy] = photo.focus ?? [cx + cw / 2, cy + ch / 2]
  const vars = { '--nw': w, '--nh': h, '--cx': cx, '--cy': cy, '--cw': cw, '--ch': ch, '--fx': fx, '--fy': fy } as CSSProperties
  return (
    <div className={`photo ${className}`} style={vars}>
      <img src={photo.src} alt={alt} width={w} height={h} loading={priority ? 'eager' : 'lazy'} decoding="async" fetchPriority={priority ? 'high' : 'auto'} />
    </div>
  )
}

const nav = [
  ['Início', 'inicio'],
  ['Sobre', 'sobre'],
  ['Pontos turísticos', 'pontos'],
  ['Cultura', 'cultura'],
  ['Onde comer', 'comer'],
  ['Onde ficar', 'ficar'],
  ['Eventos', 'eventos'],
  ['Localização', 'localizacao'],
]

type Item = { title: string; photo: PhotoMeta; desc?: string; alt?: string }

const pontos: (Item & { featured?: boolean })[] = [
  {
    title: 'Parque Estadual da Pedra da Boca',
    photo: photos.parquePedraDaBoca,
    desc: 'Unidade de conservação criada em 2000, o parque reúne formações rochosas, trilhas e experiências de contemplação, natureza, aventura e turismo religioso.',
    featured: true,
  },
  { title: 'Mirante de Araruna', photo: photos.miranteAraruna },
  {
    title: 'Pedra da Macambira',
    photo: photos.pedraMacambira,
    desc: 'Formação rochosa da paisagem serrana de Araruna, associada a trilhas, contemplação da natureza e atividades de aventura.',
  },
  {
    title: 'Cânion do Macapá',
    photo: photos.canionMacapa,
    desc: 'Paredões rochosos acompanham o Rio Calabouço em um percurso com trilhas, grutas e cenários marcantes da região.',
  },
  {
    title: 'Mercado Cultural de Araruna',
    photo: photos.mercadoCultural,
    desc: 'Antigo Mercado Público inaugurado em 1909, o edifício integra a memória arquitetônica e cultural da cidade.',
  },
]

const comer: Item[] = [
  { title: 'Pedra da Boca Café', photo: photos.pedraDaBocaCafe },
  { title: 'Barão Café', photo: photos.baraoCafe },
  { title: 'Recanto dos Coqueiros', photo: photos.recantoDosCoqueiros },
  { title: 'Adega Café na Serra', photo: photos.adegaCafeNaSerra, desc: 'Uma das opções de alimentação disponíveis em Araruna.' },
  { title: 'Casa de Farinha Restaurante & Pizzaria', photo: photos.casaFarinha, desc: 'Restaurante e pizzaria que integra as opções de alimentação da cidade.' },
  { title: 'O Beco Bistrô e Eventos', photo: photos.oBeco, desc: 'Estabelecimento local que integra as opções de alimentação da cidade.' },
  { title: 'Empório Prime Coffee & Creperie', photo: photos.emporioPrime, desc: 'Opção local voltada à experiência de cafeteria e creperia.' },
]

const ficar: Item[] = [
  { title: 'Spazio da Pedra', photo: photos.spazioDaPedra },
  { title: 'Hotel Pedra da Boca', photo: photos.hotelPedraDaBoca, alt: 'Quarto com vista para a Pedra da Boca' },
  { title: 'Nega Joana', photo: photos.negaJoana, desc: 'Opção de hospedagem para quem visita Araruna.' },
  { title: 'Araruna Hotel Pousada', photo: photos.ararunaHotel, desc: 'Hospedagem local para a estadia em Araruna.' },
  { title: 'Alto da Serra Hotel', photo: photos.altoSerra, desc: 'Opção local de hospedagem no município.' },
]

const eventos: Item[] = [
  { title: 'Romaria de Fátima', photo: photos.romariaFatima, desc: 'Manifestação religiosa periódica do calendário turístico municipal.' },
  { title: 'ExpoSerra', photo: photos.exposerra, alt: 'Cartaz da ExpoSerra Araruna 2026', desc: 'Exposição voltada a bovinos, caprinos e ovinos, integrando atividades econômicas e culturais do município.' },
  // Sem descrição até haver texto aprovado; o nome vem do material oficial de cada evento.
  { title: 'São João na Serra', photo: photos.saoJoao, alt: 'Cartaz do São João na Serra 2026, em Araruna-PB' },
  { title: 'Araruna Moto Fest', photo: photos.motoFest, alt: 'Participantes do Araruna Moto Fest sob o pórtico de boas-vindas' },
]

function Card({ item, featured = false }: { item: Item; featured?: boolean }) {
  return (
    <article className={featured ? 'card cardFeatured' : 'card'}>
      <Photo photo={item.photo} alt={item.alt ?? item.title} className="cardMedia" />
      <div className="cardBody">
        <h3>{item.title}</h3>
        {item.desc && <p>{item.desc}</p>}
      </div>
    </article>
  )
}

function SectionTitle({ eyebrow, title, subtitle }: { eyebrow?: string; title: string; subtitle?: string }) {
  return (
    <div className="sectionTitle">
      {eyebrow && <span className="eyebrow">{eyebrow}</span>}
      <span className="miniLine" />
      <h2>{title}</h2>
      {subtitle && <p>{subtitle}</p>}
    </div>
  )
}

function App() {
  const [open, setOpen] = useState(false)
  const [scrolled, setScrolled] = useState(false)
  const [active, setActive] = useState('inicio')
  const heroRef = useRef<HTMLElement>(null)
  const headerRef = useRef<HTMLElement>(null)
  const menuButtonRef = useRef<HTMLButtonElement>(null)
  const sentinelRef = useRef<HTMLDivElement>(null)
  const openRef = useRef(open)
  openRef.current = open

  // Esc fecha o menu e devolve o foco ao botão que o abriu.
  useEffect(() => {
    const closeOnEscape = (event: KeyboardEvent) => {
      if (event.key !== 'Escape' || !openRef.current) return
      setOpen(false)
      menuButtonRef.current?.focus()
    }
    window.addEventListener('keydown', closeOnEscape)
    return () => window.removeEventListener('keydown', closeOnEscape)
  }, [])

  // Com o menu aberto: fecha ao tocar fora do header ou quando a tela passa a mostrar a navegação completa.
  useEffect(() => {
    if (!open) return
    const closeOnOutside = (event: PointerEvent) => {
      if (!headerRef.current?.contains(event.target as Node)) setOpen(false)
    }
    const wide = window.matchMedia('(min-width: 1081px)')
    const closeOnWide = () => { if (wide.matches) setOpen(false) }
    document.addEventListener('pointerdown', closeOnOutside)
    wide.addEventListener('change', closeOnWide)
    return () => {
      document.removeEventListener('pointerdown', closeOnOutside)
      wide.removeEventListener('change', closeOnWide)
    }
  }, [open])

  // Header sólido assim que a página deixa o topo.
  useEffect(() => {
    const sentinel = sentinelRef.current
    if (!sentinel) return
    const observer = new IntersectionObserver(([entry]) => setScrolled(!entry.isIntersecting))
    observer.observe(sentinel)
    return () => observer.disconnect()
  }, [])

  // Seção ativa: a que cruza a faixa logo acima do meio da tela.
  useEffect(() => {
    const sections = nav.map(([, id]) => document.getElementById(id)).filter((el): el is HTMLElement => el !== null)
    const observer = new IntersectionObserver(
      entries => entries.forEach(entry => { if (entry.isIntersecting) setActive(entry.target.id) }),
      { rootMargin: '-40% 0px -55% 0px' },
    )
    sections.forEach(section => observer.observe(section))
    return () => observer.disconnect()
  }, [])

  // Keep the approved bottom anchors; grow the mobile hero only when text needs room.
  useLayoutEffect(() => {
    const hero = heroRef.current
    if (!hero) return
    const intro = hero.querySelector<HTMLElement>('.heroIntro')!
    const title = hero.querySelector<HTMLElement>('.heroTitleBlock')!
    const button = hero.querySelector<HTMLElement>('.heroButton')!
    const measure = () => {
      if (!window.matchMedia('(max-width: 620px)').matches) {
        hero.style.removeProperty('--hero-content-height')
        return
      }
      const introStyle = getComputedStyle(intro)
      const titleStyle = getComputedStyle(title)
      const buttonStyle = getComputedStyle(button)
      const introBottom = parseFloat(introStyle.top) + intro.offsetHeight
      const titleBottom = parseFloat(titleStyle.bottom)
      const buttonTopSpace = parseFloat(buttonStyle.bottom) + button.offsetHeight
      const required = Math.ceil(Math.max(
        introBottom + 24 + title.offsetHeight + titleBottom,
        introBottom + 24 + buttonTopSpace,
      ))
      const value = required + 'px'
      if (hero.style.getPropertyValue('--hero-content-height') !== value) {
        hero.style.setProperty('--hero-content-height', value)
      }
    }
    const observer = new ResizeObserver(measure)
    ;[intro, title, button].forEach(element => observer.observe(element))
    window.addEventListener('resize', measure)
    measure()
    return () => {
      observer.disconnect()
      window.removeEventListener('resize', measure)
    }
  }, [])

  const navLinks = (onNavigate?: () => void) =>
    nav.map(([label, id]) => (
      <a key={id} href={`#${id}`} aria-current={active === id ? 'location' : undefined} onClick={onNavigate}>{label}</a>
    ))

  return (
    <div>
      <a className="skipLink" href="#conteudo">Pular para o conteúdo</a>
      <div ref={sentinelRef} className="scrollSentinel" aria-hidden="true" />
      <header ref={headerRef} className={scrolled || open ? 'topbar isSolid' : 'topbar'}>
        <div className="topbarInner">
          <a href="#inicio" className="brand" aria-label="AraTur - início">
            <img src="/images/logo-aratur.png" alt="AraTur" width={2012} height={781} />
          </a>
          <nav className="desktopNav" aria-label="Navegação principal">
            {navLinks()}
          </nav>
          <button ref={menuButtonRef} className="menuButton" onClick={() => setOpen(v => !v)} aria-label={open ? 'Fechar menu' : 'Abrir menu'} aria-expanded={open} aria-controls="menu-mobile">
            <span className="menuGlyph" aria-hidden="true">{open ? '✕' : '☰'}</span>
          </button>
        </div>
        {open && (
          <nav id="menu-mobile" className="mobileNav" aria-label="Navegação móvel">
            {navLinks(() => setOpen(false))}
          </nav>
        )}
      </header>

      <main id="conteudo">
        <section ref={heroRef} id="inicio" className="hero" aria-label="Descubra Araruna">
          {/* Camadas: paisagem (0) → véu (1) → título e texto (2) → Pedra recortada (3) → CTA (4). */}
          {/* Fundo: composição visual gerada para o projeto (não é fotografia documental); decorativo. */}
          <picture>
            <source media="(max-width: 620px)" type="image/webp" srcSet="/images/hero-paisagem-mobile-480.webp 480w, /images/hero-paisagem-mobile-628.webp 628w" sizes="max(100vw, 60svh)" width={628} height={941} />
            <img className="heroBg" src="/images/hero-paisagem-1672.webp" alt="" width={1672} height={941} decoding="async" />
          </picture>
          <div className="heroShade" aria-hidden="true" />
          <div className="heroTitleBlock">
            <span className="heroEyebrow">Natureza e cultura na Paraíba</span>
            <h1><span className="heroKicker">Descubra</span> <span className="heroTitle">Araruna</span></h1>
          </div>
          <img className="heroRock" src="/images/hero-pedra-recorte-1448.webp" srcSet="/images/hero-pedra-recorte-800.webp 800w, /images/hero-pedra-recorte-1080.webp 1080w, /images/hero-pedra-recorte-1448.webp 1448w" sizes="(max-width: 620px) 205vw, (max-width: 900px) 160vw, min(95vw, 150svh)" alt="Pedra da Boca, em Araruna" width={1448} height={1086} fetchPriority="high" decoding="async" />
          <p className="heroIntro">Da Pedra da Boca às ruas que guardam sua história, descubra paisagens, sabores e caminhos para viver Araruna.</p>
          <a className="heroButton" href="#sobre">Explore Araruna <span aria-hidden="true">→</span></a>
        </section>

        <section id="sobre" className="section about">
          <div className="container aboutGrid">
            <div>
              <SectionTitle eyebrow="Conheça o destino" title="Natureza, história e hospitalidade" />
              <p className="lead">O AraTur reúne caminhos para conhecer as paisagens, a memória e as opções locais que fazem parte de uma visita a Araruna.</p>
              <div className="featureGrid">
                <div className="feature"><span className="simpleIcon">△</span><div><strong>Natureza</strong><span>Serras, pedras e trilhas</span></div></div>
                <div className="feature"><span className="simpleIcon">▦</span><div><strong>Cultura</strong><span>Memória e patrimônio</span></div></div>
                <div className="feature"><span className="simpleIcon">✦</span><div><strong>Gastronomia</strong><span>Opções locais</span></div></div>
                <div className="feature"><span className="simpleIcon">□</span><div><strong>Eventos</strong><span>Celebrações e encontros</span></div></div>
              </div>
            </div>
            <Photo photo={photos.ararunaAerea} alt="Vista aérea do centro de Araruna" className="aboutVisual" />
          </div>
        </section>

        <section id="pontos" className="section pointsSection">
          <div className="container">
            <SectionTitle title="Pontos turísticos" subtitle="Formações rochosas, paisagens naturais e patrimônio para conhecer durante a visita a Araruna." />
            <p className="reference">Informações de referência: Portal oficial de turismo e Prefeitura Municipal de Araruna.</p>
            <div className="cardGrid">
              {pontos.map(p => <Card key={p.title} item={p} featured={p.featured} />)}
            </div>
          </div>
        </section>

        <section id="cultura" className="section cultureSection">
          <div className="container cultureGrid">
            <div>
              <SectionTitle title="Cultura e história" subtitle="Referências históricas que ajudam a contar a formação urbana e a identidade de Araruna." />
            </div>
            <article className="cultureCard">
              <Photo photo={photos.historiaAraruna} alt="Vista histórica de Araruna" className="cultureMedia" />
              <p>Povos indígenas Cariri habitavam a região, e o nome Araruna é associado a “arara preta”. O povoado se desenvolveu no século XIX em torno de uma capela dedicada a Nossa Senhora da Conceição.</p>
              <p>Em 1854 foi criada a freguesia. A Lei Provincial nº 616, de 10 de julho de 1876, elevou Araruna à categoria de município. Seu patrimônio histórico reúne construções e espaços ligados a essa formação urbana.</p>
              <small>Fontes de referência: IBGE e Prefeitura Municipal de Araruna.</small>
            </article>
          </div>
        </section>

        <section id="comer" className="section paleBlue">
          <div className="container">
            <SectionTitle title="Onde comer" subtitle="Opções locais para incluir no percurso por Araruna." />
            <div className="cardGrid">
              {comer.map(item => <Card key={item.title} item={item} />)}
            </div>
          </div>
        </section>

        <section id="ficar" className="section staySection">
          <div className="container">
            <SectionTitle title="Onde ficar" subtitle="Opções de hospedagem para a estadia em Araruna." />
            <div className="cardGrid">
              {ficar.map(item => <Card key={item.title} item={item} />)}
            </div>
          </div>
        </section>

        <section id="eventos" className="section paleBlue">
          <div className="container">
            <SectionTitle title="Calendário turístico" subtitle="Eventos e manifestações periódicas que fazem parte da vida cultural de Araruna." />
            <p className="reference">Programações sujeitas à divulgação oficial. Consulte os canais do município antes de planejar a visita.</p>
            <div className="cardGrid">
              {eventos.map(item => <Card key={item.title} item={item} />)}
            </div>
            <div className="otherEvents"><span className="simpleIcon">□</span><div><strong>Outras celebrações e encontros</strong><span>Atividades do município e eventos locais também integram o calendário turístico.</span></div></div>
          </div>
        </section>

        <section id="localizacao" className="mapCta">
          <div className="container mapGrid">
            <div>
              <span className="eyebrow light">LOCALIZAÇÃO</span>
              <h2>Explore Araruna no mapa</h2>
              <p>Araruna é um município do estado da Paraíba, no Nordeste do Brasil.</p>
              <div className="locationRow"><span className="mapDot">●</span> Araruna-PB, Brasil</div>
              <a className="mapsButton" href="https://www.google.com/maps/search/?api=1&query=Araruna%2C%20PB" target="_blank" rel="noreferrer">Ver localização no Google Maps <span>↗</span></a>
            </div>
            <div className="pinArt"><div className="orbit one"/><div className="orbit two"/><div className="orbit three"/><div className="bigPin">●</div></div>
          </div>
        </section>
      </main>

      <footer>
        <div className="container footerGrid">
          <div className="footerBrand"><img src="/images/logo-aratur.png" alt="AraTur" /><p>Turismo em Araruna-PB.</p></div>
          <div><strong>Navegação</strong>{nav.slice(0,4).map(([l,id])=><a key={id} href={`#${id}`}>{l}</a>)}</div>
          <div><strong>Explore</strong>{nav.slice(4).map(([l,id])=><a key={id} href={`#${id}`}>{l}</a>)}</div>
          <div><strong>AraTur</strong><span>Natureza, cultura e hospitalidade.</span><span className="footerIcon"><span>◉</span> Araruna-PB</span></div>
        </div>
        <div className="copyright">© 2026 AraTur — Araruna-PB</div>
      </footer>
    </div>
  )
}

export default App
