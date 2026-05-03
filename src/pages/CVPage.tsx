import { motion } from 'motion/react';
import { useTranslation, Trans } from 'react-i18next';
import { Link } from 'react-router-dom';
import { LanguageSwitcher } from '../components/LanguageSwitcher';
import { StatusDot } from '../components/StatusDot';
import { Footer } from '../components/Footer';

export const CVPage = () => {
  const { t } = useTranslation();
  return (
    <div className="min-h-screen bg-[#0a0a0b] text-[#f0f0f0] font-sans flex flex-col p-6 md:p-12 relative selection:bg-white selection:text-black">
      <motion.div 
        initial={{ opacity: 0, x: -20 }}
        animate={{ opacity: 1, x: 0 }}
        transition={{ duration: 1.2, delay: 1, ease: [0.22, 1, 0.36, 1] }}
        className="absolute top-6 right-6 md:top-12 md:right-12 flex items-center gap-6 z-50"
      >
        <div className="hidden xl:flex text-[10px] font-mono tracking-widest text-[#444] uppercase flex-col items-end gap-1">
          <span>41.9309° N, 2.2544° E</span>
          <span>CATALUNYA</span>
        </div>
        <div className="hidden md:block">
          <LanguageSwitcher />
        </div>
      </motion.div>

      <motion.header
        initial={{ opacity: 0, y: 40 }}
        animate={{ opacity: 1, y: 0 }}
        exit={{ opacity: 0, transition: { duration: 0.3 } }}
        transition={{ duration: 1.2, ease: [0.22, 1, 0.36, 1] }}
        className="mb-12 md:mb-16 mt-8 md:mt-0 xl:pr-96"
      >
        <Link to="/" className="text-[#888] hover:text-white font-mono text-xs uppercase tracking-widest mb-8 inline-block transition-colors">{t('footer.back_to_home')}</Link>
        <h1 className="text-4xl md:text-6xl lg:text-7xl font-black tracking-tighter leading-[0.8] mb-4">
          <Trans i18nKey="home.title" />
        </h1>
        <div className="text-sm md:text-xl font-mono text-[#FFCC00] flex items-center gap-3">
          <StatusDot delay={0.8} />
          {t('cv.title')}
        </div>
      </motion.header>

      <main className="flex-grow w-full max-w-none">
        <motion.div
          initial={{ opacity: 0, y: 30 }}
          animate={{ opacity: 1, y: 0 }}
          exit={{ opacity: 0, transition: { duration: 0.4 } }}
          transition={{ duration: 1.8, delay: 0.2, ease: [0.22, 1, 0.36, 1] }}
          className="bg-[#111] rounded-sm p-6 md:p-10 border border-[#222] font-sans text-[#ddd] w-full"
        >
          <div className="space-y-12">
            {/* About Me */}
            <section>
              <h2 className="text-xl font-bold text-white mb-4 flex items-center gap-2"><span className="text-xl">🚀</span> {t('cv.about.title')}</h2>
              <p className="leading-relaxed text-[#aaa] font-light mb-4">
                <Trans i18nKey="cv.about.p1">
                  Computer Engineer (UPC) specialized in <span className="text-white font-medium">infrastructure monitoring, automation</span>, and the deployment of critical services (<span className="text-white font-medium">NetDevOps</span>). Strong background in <span className="text-white font-medium">Python</span> and <span className="text-white font-medium">Cloud environments (GCP/Docker)</span>. Passionate about observability, operational efficiency, and network security.
                </Trans>
              </p>
              <p className="leading-relaxed text-[#aaa] font-light">{t('cv.about.p2')}</p>
            </section>

            {/* Experience */}
            <section>
              <h2 className="text-xl font-bold text-white mb-6 flex items-center gap-2 border-t border-[#333] pt-8"><span className="text-xl">💼</span> {t('cv.experience.title')}</h2>
              
              <div className="space-y-8">
                <div className="relative pl-4 border-l border-[#333]">
                  <div className="absolute w-2 h-2 bg-[#FFCC00] rounded-full -left-[4.5px] top-2"></div>
                  <h3 className="text-lg font-semibold text-white">{t('cv.experience.adamo.role')}</h3>
                  <p className="text-sm font-mono text-[#888] mb-3"><a href="https://adamo.es" target="_blank" rel="noopener noreferrer" className="text-[#FFCC00] hover:underline">@ {t('cv.experience.adamo.company')}</a> • {t('cv.experience.adamo.date')}</p>
                  <ul className="space-y-2 text-[#aaa] font-light text-sm list-none">
                    {(t('cv.experience.adamo.items', { returnObjects: true }) as string[]).map((item, i) => (
                      <li key={i}>
                        <span className="mr-2">{['⚙️', '🖥️', '🔄', '🛡️', '🧪', '📊'][i] || '•'}</span>
                        <Trans i18nKey={`cv.experience.adamo.items.${i}`}>
                          <span /><strong className="text-[#ddd] font-medium" /><em />
                        </Trans>
                      </li>
                    ))}
                  </ul>
                </div>

                <div className="relative pl-4 border-l border-[#333]">
                  <div className="absolute w-2 h-2 bg-[#555] rounded-full -left-[4.5px] top-2"></div>
                  <h3 className="text-lg font-semibold text-white">{t('cv.experience.vera.role')}</h3>
                  <p className="text-sm font-mono text-[#888] mb-3"><a href="https://somvera.cat" target="_blank" rel="noopener noreferrer" className="text-white hover:underline">@ {t('cv.experience.vera.company')}</a> • {t('cv.experience.vera.date')}</p>
                  <ul className="space-y-2 text-[#aaa] font-light text-sm list-none">
                    {(t('cv.experience.vera.items', { returnObjects: true }) as string[]).map((item, i) => (
                      <li key={i}>
                        <span className="mr-2">{['🗺️', '👁️', '📡'][i] || '•'}</span>
                        <Trans i18nKey={`cv.experience.vera.items.${i}`}>
                          <span /><strong className="text-[#ddd] font-medium" /><em />
                        </Trans>
                      </li>
                    ))}
                  </ul>
                </div>

                <div className="relative pl-4 border-l border-[#333]">
                  <div className="absolute w-2 h-2 bg-[#555] rounded-full -left-[4.5px] top-2"></div>
                  <h3 className="text-lg font-semibold text-white">{t('cv.experience.adamo_noc.role')}</h3>
                  <p className="text-sm font-mono text-[#888] mb-3"><a href="https://adamo.es" target="_blank" rel="noopener noreferrer" className="text-white hover:underline">@ {t('cv.experience.adamo_noc.company')}</a> • {t('cv.experience.adamo_noc.date')}</p>
                  <ul className="space-y-2 text-[#aaa] font-light text-sm list-none">
                    {(t('cv.experience.adamo_noc.items', { returnObjects: true }) as string[]).map((item, i) => (
                      <li key={i}>
                        <span className="mr-2">{['🏗️', '🚨', '📈'][i] || '•'}</span>
                        <Trans i18nKey={`cv.experience.adamo_noc.items.${i}`}>
                          <span /><strong className="text-[#ddd] font-medium" /><em />
                        </Trans>
                      </li>
                    ))}
                  </ul>
                </div>
              </div>
            </section>

            {/* Technical Skills */}
            <section>
              <h2 className="text-xl font-bold text-white mb-6 flex items-center gap-2 border-t border-[#333] pt-8"><span className="text-xl">🛠️</span> {t('cv.skills.title')}</h2>
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4 text-sm">
                <div className="bg-[#1a1a1a] p-4 rounded-sm border border-[#2a2a2a]">
                  <h3 className="font-semibold text-white mb-2">{t('cv.skills.development')}</h3>
                  <p className="text-[#aaa] font-light">Python, SQL, JavaScript, C++, PHP, FastAPI, Flask, Jinja, HTML</p>
                </div>
                <div className="bg-[#1a1a1a] p-4 rounded-sm border border-[#2a2a2a]">
                  <h3 className="font-semibold text-white mb-2">{t('cv.skills.infrastructure')}</h3>
                  <p className="text-[#aaa] font-light">Docker, Git, CI/CD, Linux (Debian, Ubuntu, Rocky Linux)</p>
                </div>
                <div className="bg-[#1a1a1a] p-4 rounded-sm border border-[#2a2a2a]">
                  <h3 className="font-semibold text-white mb-2">{t('cv.skills.cloud')}</h3>
                  <p className="text-[#aaa] font-light">Google Cloud (GCP), BigQuery, Proxmox, VMware</p>
                </div>
                <div className="bg-[#1a1a1a] p-4 rounded-sm border border-[#2a2a2a]">
                  <h3 className="font-semibold text-white mb-2">{t('cv.skills.networking')}</h3>
                  <p className="text-[#aaa] font-light">OSPF, BGP, DHCP, DNS, SIP, GPON, DWDM</p>
                </div>
                <div className="bg-[#1a1a1a] p-4 rounded-sm border border-[#2a2a2a] md:col-span-2">
                  <h3 className="font-semibold text-white mb-2">{t('cv.skills.vendors')}</h3>
                  <p className="text-[#aaa] font-light">Huawei, Cisco, PaloAlto, Nokia, ZTE, FiberHome, Mikrotik</p>
                </div>
              </div>
            </section>

            {/* Education */}
            <section>
              <h2 className="text-xl font-bold text-white mb-6 flex items-center gap-2 border-t border-[#333] pt-8"><span className="text-xl">🎓</span> {t('cv.education.title')}</h2>
              <div className="mb-4">
                <h3 className="text-lg font-semibold text-white">{t('cv.education.degree')}</h3>
                <p className="text-sm font-mono text-[#888] mb-2"><a href="https://www.upc.edu" target="_blank" rel="noopener noreferrer" className="text-white hover:underline">{t('cv.education.university')}</a> • {t('cv.education.date')}</p>
                <p className="text-sm text-[#aaa] font-light italic mb-2">{t('cv.education.major')}</p>
                <p className="text-[#aaa] font-light text-sm">
                  <Trans i18nKey="cv.education.thesis">
                    <strong className="text-[#ddd] font-medium">Thesis:</strong> <a href="https://upcommons.upc.edu/handle/2117/344879" target="_blank" rel="noopener noreferrer" className="text-[#FFCC00] hover:underline">QoS implementation in an ISP</a> – Implementation of quality of service policies for residential traffic.
                  </Trans>
                </p>
              </div>
            </section>

            {/* Projects & Volunteering */}
            <section>
              <h2 className="text-xl font-bold text-white mb-6 flex items-center gap-2 border-t border-[#333] pt-8"><span className="text-xl">📻</span> {t('cv.volunteering.title')}</h2>
              <div className="space-y-6">
                <div>
                  <h3 className="text-base font-semibold text-white">{t('cv.volunteering.radio.role')} <span className="font-normal text-[#888]">@ <a href="https://radiovoltrega.com" target="_blank" rel="noopener noreferrer" className="text-white hover:underline">Ràdio Voltregà</a> ({t('cv.volunteering.radio.date')})</span></h3>
                  <ul className="list-disc list-inside text-sm text-[#aaa] font-light mt-2 space-y-1">
                    <li>{t('cv.volunteering.radio.item1')}</li>
                    <li>{t('cv.volunteering.radio.item2')}</li>
                    <li>{t('cv.volunteering.radio.item3')}</li>
                  </ul>
                </div>
                <div>
                  <h3 className="text-base font-semibold text-white">{t('cv.volunteering.photography.role')} <span className="font-normal text-[#888]">@ <a href="https://afvoltreganes.cat" target="_blank" rel="noopener noreferrer" className="text-white hover:underline">AFV</a> ({t('cv.volunteering.photography.date')})</span></h3>
                  <ul className="list-disc list-inside text-sm text-[#aaa] font-light mt-2 space-y-1">
                    <li><Trans i18nKey="cv.volunteering.photography.item1">Portfolio available at <Link to="/photos" className="text-[#FFCC00] hover:underline">photos</Link>.</Trans></li>
                  </ul>
                </div>
              </div>
            </section>

            <div className="grid grid-cols-1 sm:grid-cols-2 gap-8 border-t border-[#333] pt-8">
              {/* Languages */}
              <section>
                <h2 className="text-xl font-bold text-white mb-4 flex items-center gap-2"><span className="text-xl">🗣️</span> {t('cv.languages.title')}</h2>
                <ul className="list-disc list-inside text-sm text-[#aaa] font-light space-y-1">
                  <li><strong className="text-[#ddd] font-medium">{t('cv.languages.catalan')}:</strong> {t('cv.languages.native')}</li>
                  <li><strong className="text-[#ddd] font-medium">{t('cv.languages.spanish')}:</strong> {t('cv.languages.native')}</li>
                  <li><strong className="text-[#ddd] font-medium">{t('cv.languages.english')}:</strong> {t('cv.languages.advanced')}</li>
                </ul>
              </section>

              {/* Others */}
              <section>
                <h2 className="text-xl font-bold text-white mb-4 flex items-center gap-2"><span className="text-xl">🚘</span> {t('cv.others.title')}</h2>
                <ul className="list-disc list-inside text-sm text-[#aaa] font-light space-y-1">
                  <li><strong className="text-[#ddd] font-medium">{t('cv.others.driving')}:</strong> {t('cv.others.license_b')}</li>
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
