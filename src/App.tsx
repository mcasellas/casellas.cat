import React from 'react';
import { motion, AnimatePresence } from 'motion/react';
import { Routes, Route, Link, useLocation } from 'react-router-dom';

const Footer = () => (
  <motion.footer 
    initial={{ opacity: 0 }}
    animate={{ opacity: 1 }}
    transition={{ duration: 0.8, delay: 0.4 }}
    className="mt-16 md:mt-24 pt-8 border-t border-[#222] flex flex-col md:flex-row justify-between items-start md:items-end gap-8 md:gap-0"
  >
    <div className="flex flex-col sm:flex-row gap-8 md:gap-12 font-mono text-[10px] text-[#444] uppercase tracking-widest">
      <div>
        <p className="mb-1 text-[#666]">Interessos</p>
        <p className="text-[#888]">Fotografia • Ràdio • NetDevOps</p>
      </div>
    </div>
    <div className="text-[10px] font-mono text-[#444] tracking-tight">
      © {new Date().getFullYear()} CASELLAS.CAT
    </div>
  </motion.footer>
);

const CVPage = () => {
  return (
    <div className="min-h-screen bg-[#0a0a0b] text-[#f0f0f0] font-sans flex flex-col p-6 md:p-12 relative selection:bg-white selection:text-black">
      <div className="hidden md:flex absolute top-12 right-12 text-[10px] font-mono tracking-widest text-[#444] uppercase flex-col items-end gap-1">
        <span>41.9309° N, 2.2544° E</span>
        <span>CATALUNYA</span>
      </div>

      <motion.header
        initial={{ opacity: 0, y: 10 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.8, ease: [0.16, 1, 0.3, 1] }}
        className="mb-12 md:mb-16 mt-8 md:mt-0"
      >
        <Link to="/" className="text-[#888] hover:text-white font-mono text-xs uppercase tracking-widest mb-8 inline-block transition-colors">← Tornar a l'inici</Link>
        <h1 className="text-4xl md:text-6xl lg:text-7xl font-black tracking-tighter leading-[0.8] mb-4">
          CURRÍCULUM
        </h1>
        <p className="text-sm md:text-xl font-mono text-[#FFCC00] flex items-center gap-3">
          <span className="w-2 h-2 rounded-full bg-[#FFCC00] animate-pulse"></span> 
          MARC CASELLAS
        </p>
      </motion.header>

      <main className="flex-grow w-full max-w-none">
        <motion.div
          initial={{ opacity: 0, y: 10 }}
          animate={{ opacity: 1, y: 0 }}
          exit={{ opacity: 0, y: -10 }}
          transition={{ duration: 0.6, ease: [0.16, 1, 0.3, 1] }}
          className="bg-[#111] rounded-sm p-6 md:p-10 border border-[#222] font-sans text-[#ddd] w-full"
        >
          <div className="space-y-12">
            {/* About Me */}
            <section>
              <h2 className="text-xl font-bold text-white mb-4 flex items-center gap-2"><span className="text-xl">🚀</span> About Me</h2>
              <p className="leading-relaxed text-[#aaa] font-light mb-4">
                Computer Engineer (UPC) specialized in <span className="text-white font-medium">infrastructure monitoring, automation</span>, and the deployment of critical services (<span className="text-white font-medium">NetDevOps</span>). Strong background in <span className="text-white font-medium">Python</span> and <span className="text-white font-medium">Cloud environments (GCP/Docker)</span>. Passionate about observability, operational efficiency, and network security.
              </p>
              <p className="leading-relaxed text-[#aaa] font-light">Based in Osona, Barcelona (Catalonia).</p>
            </section>

            {/* Experience */}
            <section>
              <h2 className="text-xl font-bold text-white mb-6 flex items-center gap-2 border-t border-[#333] pt-8"><span className="text-xl">💼</span> Professional Experience</h2>
              
              <div className="space-y-8">
                <div className="relative pl-4 border-l border-[#333]">
                  <div className="absolute w-2 h-2 bg-[#FFCC00] rounded-full -left-[4.5px] top-2"></div>
                  <h3 className="text-lg font-semibold text-white">NetDevOps · Network Automation Engineer</h3>
                  <p className="text-sm font-mono text-[#888] mb-3"><a href="https://adamo.es" target="_blank" rel="noreferrer" className="text-[#FFCC00] hover:underline">@ Adamo Telecom</a> • Dec. 2022 — Present</p>
                  <ul className="space-y-2 text-[#aaa] font-light text-sm list-none">
                    {/* <li><span className="mr-2">📊</span><strong className="text-[#ddd] font-medium">Data & ML:</strong> Designed ETL pipelines (<strong>ElastiFlow</strong>) and machine learning models for anomaly detection.</li> */}
                    <li><span className="mr-2">⚙️</span><strong className="text-[#ddd] font-medium">Automation & Cloud:</strong> Process orchestration with <strong>Python</strong> and deployment of microservices in containers (<strong>Docker</strong>) across on-premise and cloud environments (<strong>GCP</strong> / <strong>BigQuery</strong>).</li>
                    <li><span className="mr-2">🖥️</span><strong className="text-[#ddd] font-medium">Monitoring & HA:</strong> Designed <strong>Zabbix</strong> monitoring architectures with reactive and predictive alerting. Management of critical systems (<strong>RADIUS, DHCP, DNS, IPAM</strong>) in high availability (HA).</li>
                    <li><span className="mr-2">🔄</span><strong className="text-[#ddd] font-medium">DevOps & CI/CD:</strong> Implementation of CI/CD cycles and software best practices (Git, documentation) in collaboration with dev and operations teams.</li>
                    <li><span className="mr-2">🛡️</span><strong className="text-[#ddd] font-medium">Cybersecurity:</strong> Deployment and policy definition for perimeter firewalls (<strong>NGFW</strong>).</li>
                    <li><span className="mr-2">🧪</span><strong className="text-[#ddd] font-medium">Homologation:</strong> CPE equipment testing and validation before production rollout.</li>
                  </ul>
                </div>

                <div className="relative pl-4 border-l border-[#333]">
                  <div className="absolute w-2 h-2 bg-[#555] rounded-full -left-[4.5px] top-2"></div>
                  <h3 className="text-lg font-semibold text-white">Network Engineer</h3>
                  <p className="text-sm font-mono text-[#888] mb-3"><a href="https://somvera.cat" target="_blank" rel="noreferrer" className="text-white hover:underline">@ Vera</a> • Aug. 2022 — Dec. 2022</p>
                  <ul className="space-y-2 text-[#aaa] font-light text-sm list-none">
                    <li><span className="mr-2">🗺️</span>Design of the new network architecture and definition of technical standards.</li>
                    <li><span className="mr-2">👁️</span>Improved observability through data homogenization in <strong>Zabbix</strong>.</li>
                    <li><span className="mr-2">📡</span>Topology and routing design, GPON troubleshooting, and XGSPON homologation.</li>
                  </ul>
                </div>

                <div className="relative pl-4 border-l border-[#333]">
                  <div className="absolute w-2 h-2 bg-[#555] rounded-full -left-[4.5px] top-2"></div>
                  <h3 className="text-lg font-semibold text-white">NOC / Network Delivery Engineer</h3>
                  <p className="text-sm font-mono text-[#888] mb-3"><a href="https://adamo.es" target="_blank" rel="noreferrer" className="text-white hover:underline">@ Adamo Telecom</a> • Jun. 2019 — Aug. 2022</p>
                  <ul className="space-y-2 text-[#aaa] font-light text-sm list-none">
                    <li><span className="mr-2">🏗️</span><strong className="text-[#ddd] font-medium">Delivery:</strong> Integration of new nodes, DWDM migrations, M&A network integrations, and PoP deployments.</li>
                    <li><span className="mr-2">🚨</span><strong className="text-[#ddd] font-medium">NOC:</strong> Resolution of critical CORE network incidents (Tier 3) and support for enterprise clients (FiberOffice, EVPN, IP-Transit).</li>
                    <li><span className="mr-2">📈</span>Proactive monitoring with <strong>Zabbix</strong> and <strong>Nagios</strong>.</li>
                  </ul>
                </div>
              </div>
            </section>

            {/* Technical Skills */}
            <section>
              <h2 className="text-xl font-bold text-white mb-6 flex items-center gap-2 border-t border-[#333] pt-8"><span className="text-xl">🛠️</span> Technical Skills</h2>
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4 text-sm">
                <div className="bg-[#1a1a1a] p-4 rounded-sm border border-[#2a2a2a]">
                  <h3 className="font-semibold text-white mb-2">Development</h3>
                  <p className="text-[#aaa] font-light">Python, SQL, JavaScript, C++, PHP, FastAPI, Flask, Jinja, HTML</p>
                </div>
                <div className="bg-[#1a1a1a] p-4 rounded-sm border border-[#2a2a2a]">
                  <h3 className="font-semibold text-white mb-2">Infrastructure</h3>
                  <p className="text-[#aaa] font-light">Docker, Git, CI/CD, Linux (Debian, Ubuntu, Rocky Linux)</p>
                </div>
                <div className="bg-[#1a1a1a] p-4 rounded-sm border border-[#2a2a2a]">
                  <h3 className="font-semibold text-white mb-2">Cloud & Systems</h3>
                  <p className="text-[#aaa] font-light">Google Cloud (GCP), BigQuery, Proxmox, VMware</p>
                </div>
                <div className="bg-[#1a1a1a] p-4 rounded-sm border border-[#2a2a2a]">
                  <h3 className="font-semibold text-white mb-2">Networking</h3>
                  <p className="text-[#aaa] font-light">OSPF, BGP, DHCP, DNS, SIP, GPON, DWDM</p>
                </div>
                <div className="bg-[#1a1a1a] p-4 rounded-sm border border-[#2a2a2a] md:col-span-2">
                  <h3 className="font-semibold text-white mb-2">Vendors</h3>
                  <p className="text-[#aaa] font-light">Huawei, Cisco, PaloAlto, Nokia, ZTE, FiberHome, Mikrotik</p>
                </div>
              </div>
            </section>

            {/* Education */}
            <section>
              <h2 className="text-xl font-bold text-white mb-6 flex items-center gap-2 border-t border-[#333] pt-8"><span className="text-xl">🎓</span> Education</h2>
              <div className="mb-4">
                <h3 className="text-lg font-semibold text-white">B.S. in Computer Engineering</h3>
                <p className="text-sm font-mono text-[#888] mb-2"><a href="https://www.upc.edu" target="_blank" rel="noreferrer" className="text-white hover:underline">Universitat Politècnica de Catalunya (UPC)</a> • Sep. 2016 — Jan. 2021</p>
                <p className="text-sm text-[#aaa] font-light italic mb-2">Major in Information Technology (IT)</p>
                <p className="text-[#aaa] font-light text-sm"><strong className="text-[#ddd] font-medium">Thesis:</strong> <a href="https://upcommons.upc.edu/handle/2117/344879" target="_blank" rel="noreferrer" className="text-[#FFCC00] hover:underline">QoS implementation in an ISP</a> – Implementation of quality of service policies for residential traffic.</p>
              </div>
            </section>

            {/* Projects & Volunteering */}
            <section>
              <h2 className="text-xl font-bold text-white mb-6 flex items-center gap-2 border-t border-[#333] pt-8"><span className="text-xl">📻</span> Projects & Volunteering</h2>
              <div className="space-y-6">
                <div>
                  <h3 className="text-base font-semibold text-white">Sysadmin / Radio Speaker <span className="font-normal text-[#888]">@ <a href="https://radiovoltrega.com" target="_blank" rel="noreferrer" className="text-white hover:underline">Ràdio Voltregà</a> (2010 — Present)</span></h3>
                  <ul className="list-disc list-inside text-sm text-[#aaa] font-light mt-2 space-y-1">
                    <li>Server administration (streaming, broadcasting) and network maintenance.</li>
                    <li>Automation: Developed a distributed contribution system for remote users.</li>
                    <li>Co-host of the show <em>Endramaliats</em>.</li>
                  </ul>
                </div>
                <div>
                  <h3 className="text-base font-semibold text-white">Photographer <span className="font-normal text-[#888]">@ <a href="https://afvoltreganes.cat" target="_blank" rel="noreferrer" className="text-white hover:underline">AFV</a> (2022 — Present)</span></h3>
                  <ul className="list-disc list-inside text-sm text-[#aaa] font-light mt-2 space-y-1">
                    <li>Portfolio available at <a href="https://casellas.cat/photos" target="_blank" rel="noreferrer" className="text-[#FFCC00] hover:underline">casellas.cat/photos</a>.</li>
                  </ul>
                </div>
              </div>
            </section>

            <div className="grid grid-cols-1 sm:grid-cols-2 gap-8 border-t border-[#333] pt-8">
              {/* Languages */}
              <section>
                <h2 className="text-xl font-bold text-white mb-4 flex items-center gap-2"><span className="text-xl">🗣️</span> Languages</h2>
                <ul className="list-disc list-inside text-sm text-[#aaa] font-light space-y-1">
                  <li><strong className="text-[#ddd] font-medium">Catalan:</strong> Native</li>
                  <li><strong className="text-[#ddd] font-medium">Spanish:</strong> Native</li>
                  <li><strong className="text-[#ddd] font-medium">English:</strong> Advanced (B2)</li>
                </ul>
              </section>

              {/* Others */}
              <section>
                <h2 className="text-xl font-bold text-white mb-4 flex items-center gap-2"><span className="text-xl">🚘</span> Others</h2>
                <ul className="list-disc list-inside text-sm text-[#aaa] font-light space-y-1">
                  <li><strong className="text-[#ddd] font-medium">Driving License:</strong> B</li>
                </ul>
              </section>
            </div>
          </div>
        </motion.div>
      </main>

      <Footer />
    </div>
  );
};

const PhotosPage = () => {
  const imageModules = import.meta.glob('/public/images/*.{jpg,jpeg,png,webp,gif,JPG,JPEG,PNG,WEBP,GIF}', { eager: true });
  const images = Object.keys(imageModules).map(key => key.replace('/public', ''));

  return (
    <div className="min-h-screen bg-[#0a0a0b] text-[#f0f0f0] font-sans flex flex-col p-6 md:p-12 relative selection:bg-white selection:text-black">
      <div className="hidden md:flex absolute top-12 right-12 text-[10px] font-mono tracking-widest text-[#444] uppercase flex-col items-end gap-1">
        <span>41.9309° N, 2.2544° E</span>
        <span>CATALUNYA</span>
      </div>

      <motion.header
        initial={{ opacity: 0, y: 10 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.8, ease: [0.16, 1, 0.3, 1] }}
        className="mb-12 md:mb-16 mt-8 md:mt-0"
      >
        <Link to="/" className="text-[#888] hover:text-white font-mono text-xs uppercase tracking-widest mb-8 inline-block transition-colors">← Tornar a l'inici</Link>
        <h1 className="text-4xl md:text-6xl lg:text-7xl font-black tracking-tighter leading-[0.8] mb-4">
          PORTFOLIO 
        </h1>
        <p className="text-sm md:text-xl font-mono text-[#FFCC00] flex items-center gap-3">
          <span className="w-2 h-2 rounded-full bg-[#FFCC00] animate-pulse"></span> 
          FOTOGRAFIA
        </p>
      </motion.header>

      <main className="flex-grow w-full max-w-none">
        <motion.div
           initial={{ opacity: 0, y: 10 }}
           animate={{ opacity: 1, y: 0 }}
           exit={{ opacity: 0, y: -10 }}
           transition={{ duration: 0.6, ease: [0.16, 1, 0.3, 1] }}
           className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-4"
        >
          {images.map((src, index) => (
             <div key={index} className="bg-[#1a1a1a] rounded-sm overflow-hidden aspect-square relative group">
                <img src={src} alt={`Photography ${index}`} className="absolute inset-0 w-full h-full object-cover opacity-80 group-hover:opacity-100 transition-all duration-500 group-hover:scale-105" loading="lazy" />
             </div>
          ))}
          {images.length === 0 && (
             <div className="col-span-full py-20 text-center flex flex-col items-center justify-center border border-dashed border-[#333] rounded-sm">
               <span className="text-2xl mb-4">📷</span>
               <p className="text-[#666] font-mono text-sm max-w-md">No s'han trobat imatges. Afegeix les teves fotos a la carpeta <span className="text-white bg-[#222] px-1 rounded">public/images/</span> per veure-les aquí.</p>
             </div>
          )}
        </motion.div>
      </main>

      <Footer />
    </div>
  );
};

const HomePage = () => {
  const location = useLocation();

  const images = [
    "/images/1.jpg",
    "/images/2.jpg",
    "/images/3.jpg",
    "/images/4.jpg",
    "/images/5.jpg"
  ];

  return (
    <div className="min-h-screen bg-[#0a0a0b] text-[#f0f0f0] font-sans flex flex-col p-6 md:p-12 relative selection:bg-white selection:text-black">
      <div className="hidden md:flex absolute top-12 right-12 text-[10px] font-mono tracking-widest text-[#444] uppercase flex-col items-end gap-1">
        <span>41.9309° N, 2.2544° E</span>
        <span>CATALUNYA</span>
      </div>

      <motion.header
        initial={{ opacity: 0, y: 10 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.8, ease: [0.16, 1, 0.3, 1] }}
        className="mb-12 md:mb-16 mt-8 md:mt-0"
      >
        <h1 className="text-6xl md:text-8xl lg:text-9xl font-black tracking-tighter leading-[0.8] mb-4">
          MARC<br/>CASELLAS
        </h1>
        <p className="text-sm md:text-xl font-mono text-[#FFCC00] flex items-center gap-3">
          <span className="w-2 h-2 rounded-full bg-[#FFCC00] animate-pulse"></span> 
          ENGINYER INFORMÀTIC (UPC) / FOTOGRAFIA / RÀDIO
        </p>
      </motion.header>

      <main className="flex-grow grid grid-cols-1 lg:grid-cols-12 gap-12">
        <motion.div 
          initial={{ opacity: 0, x: -20 }}
          animate={{ opacity: 1, x: 0 }}
          transition={{ duration: 0.8, delay: 0.1, ease: [0.16, 1, 0.3, 1] }}
          className="lg:col-span-5 flex flex-col justify-between border-t border-[#222] pt-8"
        >
          <div className="space-y-6 mb-10 lg:mb-15">
            <p className="text-base md:text-lg leading-relaxed text-[#aaa] font-light max-w-xl">
              Hola, sóc en Marc. Nascut a la comarca d'Osona, Catalunya. 
            </p>
            <p className="text-base md:text-lg leading-relaxed text-[#aaa] font-light max-w-xl">
              Sóc <span className="text-white font-medium">enginyer informàtic</span> de professió, especialitzat en NetDevOps, monitoratge i automatització.
            </p>
            <p className="text-base md:text-lg leading-relaxed text-[#aaa] font-light max-w-xl">
              Fora de l'àmbit tècnic, sóc un apassionat de capturar i explicar històries. Ho faig a través de la fotografia, sobretot de carrer, viatge i paisatge, i també des de la ràdio. Aquest espai recull una part d'aquesta vessant més personal i creativa.
            </p>
          </div>

          <div className="space-y-8">
            <nav className="flex flex-col gap-3 font-mono text-sm">
              <Link to="/cv" className="group flex w-full items-center justify-between border-b border-[#222] pb-2 transition-all hover:border-white text-left cursor-pointer">
                <span className={`text-[#666] group-hover:text-white transition-colors ${location.pathname === '/cv' ? 'text-white' : ''}`}>01</span> 
                <span className={`text-white ${location.pathname === '/cv' ? 'font-bold' : ''}`}>CURRÍCULUM</span> 
                <span className="text-[#444] group-hover:text-white transition-colors">NETDEVOPS →</span>
              </Link>
              <Link to="/photos" className="group flex w-full items-center justify-between border-b border-[#222] pb-2 transition-all hover:border-white text-left cursor-pointer">
                <span className={`text-[#666] group-hover:text-white transition-colors ${location.pathname === '/photos' ? 'text-white' : ''}`}>02</span> 
                <span className={`text-white ${location.pathname === '/photos' ? 'font-bold' : ''}`}>FOTOGRAFIA</span> 
                <span className="text-[#444] group-hover:text-white transition-colors">PORTFOLIO →</span>
              </Link>
              <a href="https://radiovoltrega.com/endramaliats" target="_blank" rel="noreferrer" className="group flex items-center justify-between border-b border-[#222] pb-2 transition-all hover:border-white">
                <span className="text-[#666] group-hover:text-white transition-colors">03</span> 
                <span className="text-white">ENDRAMALIATS</span> 
                <span className="text-[#444] group-hover:text-white transition-colors">PODCAST →</span>
              </a>
            </nav>

            <div className="pt-4">
              <span className="text-[#888] mb-4 inline-block font-mono text-[10px] uppercase tracking-widest">Segueix-me a ...</span>
              <div className="flex flex-wrap gap-6 text-[11px] font-mono tracking-widest uppercase text-[#666]">
                <a href="https://www.instagram.com/marc.casellas" target="_blank" rel="noreferrer" className="hover:text-white transition-colors">Instagram</a>
                <a href="https://twitter.com/casellas98" target="_blank" rel="noreferrer" className="hover:text-white transition-colors">X</a>
                <a href="https://linkedin.com/in/casellas98" target="_blank" rel="noreferrer" className="hover:text-white transition-colors">LinkedIn</a>
                <a href="https://github.com/mcasellas" target="_blank" rel="noreferrer" className="hover:text-white transition-colors">GitHub</a>
              </div>
            </div>
          </div>
        </motion.div>

        <motion.div 
          key="portfolio"
          initial={{ opacity: 0, scale: 0.98 }}
          animate={{ opacity: 1, scale: 1 }}
          exit={{ opacity: 0, scale: 0.98 }}
          transition={{ duration: 0.6, ease: [0.16, 1, 0.3, 1] }}
          className="lg:col-span-7 h-[600px] lg:h-[auto] min-h-[400px] grid grid-cols-2 grid-rows-3 gap-3"
        >
          <div className="row-span-2 bg-[#1a1a1a] rounded-sm overflow-hidden relative group">
            <img src={images[0]} alt="Photography by Marc" className="absolute inset-0 w-full h-full object-cover opacity-80 group-hover:opacity-100 transition-all duration-500 group-hover:scale-105" loading="lazy" />
            <div className="absolute top-0 left-0 w-full h-full bg-gradient-to-t from-black/60 to-transparent"></div>
            <div className="absolute bottom-3 left-3 bg-black/50 backdrop-blur px-2 py-1 text-[9px] md:text-[10px] font-mono opacity-0 group-hover:opacity-100 transition-opacity text-[#f0f0f0]">
              Tradicions
            </div>
          </div>
          <div className="bg-[#1a1a1a] rounded-sm overflow-hidden relative group">
            <img src={images[1]} alt="Photography by Marc" className="absolute inset-0 w-full h-full object-cover opacity-80 group-hover:opacity-100 transition-all duration-500 group-hover:scale-105" loading="lazy" />
            <div className="absolute top-0 left-0 w-full h-full bg-gradient-to-t from-black/60 to-transparent"></div>
            <div className="absolute bottom-3 left-3 bg-black/50 backdrop-blur px-2 py-1 text-[9px] md:text-[10px] font-mono opacity-0 group-hover:opacity-100 transition-opacity text-[#f0f0f0]">
              Natura
            </div>
          </div>
          <div className="bg-[#1a1a1a] rounded-sm overflow-hidden relative group">
            <img src={images[2]} alt="Photography by Marc" className="absolute inset-0 w-full h-full object-cover opacity-80 group-hover:opacity-100 transition-all duration-500 group-hover:scale-105" loading="lazy" />
            <div className="absolute top-0 left-0 w-full h-full bg-gradient-to-t from-black/60 to-transparent"></div>
            <div className="absolute bottom-3 left-3 bg-black/50 backdrop-blur px-2 py-1 text-[9px] md:text-[10px] font-mono opacity-0 group-hover:opacity-100 transition-opacity text-[#f0f0f0]">
              Viatge
            </div>
          </div>
          <div className="bg-[#1a1a1a] rounded-sm overflow-hidden relative group">
            <img src={images[3]} alt="Photography by Marc" className="absolute inset-0 w-full h-full object-cover opacity-80 group-hover:opacity-100 transition-all duration-500 group-hover:scale-105" loading="lazy" />
            <div className="absolute top-0 left-0 w-full h-full bg-gradient-to-t from-black/60 to-transparent"></div>
            <div className="absolute bottom-3 left-3 bg-black/50 backdrop-blur px-2 py-1 text-[9px] md:text-[10px] font-mono opacity-0 group-hover:opacity-100 transition-opacity text-[#f0f0f0]">
              Street Photograpy 
            </div>
          </div>
          <div className="bg-[#1a1a1a] rounded-sm overflow-hidden relative group">
            <img src={images[4]} alt="Photography by Marc" className="absolute inset-0 w-full h-full object-cover opacity-80 group-hover:opacity-100 transition-all duration-500 group-hover:scale-105" loading="lazy" />
            <div className="absolute top-0 left-0 w-full h-full bg-gradient-to-t from-black/60 to-transparent"></div>
            <div className="absolute bottom-3 left-3 bg-black/50 backdrop-blur px-2 py-1 text-[9px] md:text-[10px] font-mono opacity-0 group-hover:opacity-100 transition-opacity text-[#f0f0f0]">
              Catalunya
            </div>
          </div>
        </motion.div>
      </main>

      <Footer />
    </div>
  );
};

export default function App() {
  const location = useLocation();

  return (
    <AnimatePresence mode="wait">
      <Routes location={location} key={location.pathname}>
        <Route path="/" element={<HomePage />} />
        <Route path="/cv" element={<CVPage />} />
        <Route path="/photos" element={<PhotosPage />} />
      </Routes>
    </AnimatePresence>
  );
}

