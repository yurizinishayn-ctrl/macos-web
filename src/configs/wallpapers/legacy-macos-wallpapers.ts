import { wallpapers_config } from './wallpaper.config.ts';

const svg = (body: string) => `data:image/svg+xml;charset=UTF-8,${encodeURIComponent(`
<svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 1920 1200">
<defs>
  <linearGradient id="g" x1="0" y1="0" x2="1" y2="1"><stop offset="0" stop-color="#07143f"/><stop offset="0.52" stop-color="#1c77c3"/><stop offset="1" stop-color="#9be7ff"/></linearGradient>
  <radialGradient id="r"><stop offset="0" stop-color="#ffffff" stop-opacity=".85"/><stop offset="1" stop-color="#ffffff" stop-opacity="0"/></radialGradient>
  <linearGradient id="p" x1="0" y1="0" x2="0" y2="1"><stop stop-color="#120021"/><stop offset="1" stop-color="#05020c"/></linearGradient>
</defs>${body}</svg>`)}`;

const aqua = svg(`
<rect width="1920" height="1200" fill="url(#g)"/>
<path d="M-80 1020 C320 650 540 930 920 550 C1290 180 1550 480 2070 110" fill="none" stroke="#dff8ff" stroke-width="150" stroke-linecap="round" opacity=".22"/>
<path d="M-60 1140 C320 770 640 1010 990 650 C1320 310 1610 580 2010 270" fill="none" stroke="#ffffff" stroke-width="38" stroke-linecap="round" opacity=".32"/>
<ellipse cx="1520" cy="170" rx="520" ry="360" fill="url(#r)" opacity=".45"/>`);

const aquaDark = svg(`
<rect width="1920" height="1200" fill="#061329"/>
<path d="M-120 920 C330 560 610 850 960 520 C1290 210 1600 390 2050 40" fill="none" stroke="#2b9fe9" stroke-width="210" stroke-linecap="round" opacity=".55"/>
<path d="M-80 1060 C360 710 650 920 1020 630 C1350 370 1660 520 2000 270" fill="none" stroke="#9ce9ff" stroke-width="38" stroke-linecap="round" opacity=".58"/>`);

const space = svg(`
<rect width="1920" height="1200" fill="url(#p)"/>
<circle cx="430" cy="290" r="3" fill="#fff"/><circle cx="870" cy="170" r="4" fill="#fff"/><circle cx="1260" cy="310" r="3" fill="#fff"/><circle cx="1630" cy="180" r="2" fill="#fff"/><circle cx="1510" cy="680" r="4" fill="#fff" opacity=".8"/>
<path d="M-100 1060 C260 690 680 880 930 500 C1160 150 1520 230 2020 30" fill="none" stroke="#3d4cf2" stroke-width="230" opacity=".52"/>
<path d="M-120 1010 C320 720 650 910 980 560 C1250 280 1570 390 2050 120" fill="none" stroke="#ff55bc" stroke-width="70" opacity=".58"/>`);

const earth = svg(`
<rect width="1920" height="1200" fill="#0a1a20"/>
<circle cx="970" cy="880" r="520" fill="#1e3440"/><circle cx="970" cy="880" r="500" fill="#173f31"/>
<path d="M580 780 C720 650 870 700 930 610 C1030 470 1200 500 1340 630 C1200 730 1110 780 1020 920 C900 1010 720 970 580 780Z" fill="#4c8f4f"/>
<path d="M720 860 C850 780 950 810 1070 740 C1160 690 1250 710 1320 760 C1210 920 1110 1010 930 1040 C820 1020 760 950 720 860Z" fill="#8ab35b" opacity=".8"/>
<ellipse cx="690" cy="420" rx="500" ry="230" fill="#ffffff" opacity=".08"/>`);

export const legacy_macos_wallpapers = {
  'legacy-cheetah': { name: 'Mac OS X Cheetah 10.0', image: aqua },
  'legacy-puma': { name: 'Mac OS X Puma 10.1', image: aqua },
  'legacy-jaguar': { name: 'Mac OS X Jaguar 10.2', image: aquaDark },
  'legacy-panther': { name: 'Mac OS X Panther 10.3', image: aquaDark },
  'legacy-tiger': { name: 'Mac OS X Tiger 10.4', image: aqua },
  'legacy-leopard': { name: 'Mac OS X Leopard 10.5', image: space },
  'legacy-snow-leopard': { name: 'Mac OS X Snow Leopard 10.6', image: space },
  'legacy-lion': { name: 'Mac OS X Lion 10.7', image: earth },
  'legacy-mountain-lion': { name: 'OS X Mountain Lion 10.8', image: earth },
  'legacy-mavericks': { name: 'OS X Mavericks 10.9', image: earth },
  'legacy-yosemite': { name: 'OS X Yosemite 10.10', image: earth },
  'legacy-el-capitan': { name: 'OS X El Capitan 10.11', image: earth },
  'legacy-sierra': { name: 'macOS Sierra 10.12', image: earth },
  'legacy-high-sierra': { name: 'macOS High Sierra 10.13', image: earth },
  'legacy-mojave-day': { name: 'macOS Mojave 10.14 — Day', image: earth },
  'legacy-mojave-night': { name: 'macOS Mojave 10.14 — Night', image: space },
  'legacy-catalina-light': { name: 'macOS Catalina 10.15 — Light', image: earth },
  'legacy-catalina-dark': { name: 'macOS Catalina 10.15 — Dark', image: space },
} as const;

for (const [id, wallpaper] of Object.entries(legacy_macos_wallpapers)) {
  (wallpapers_config as Record<string, any>)[id] = {
    name: wallpaper.name,
    type: 'standalone',
    thumbnail: wallpaper.image,
    image: wallpaper.image,
  };
}
