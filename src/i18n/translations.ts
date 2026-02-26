export type Language = "en" | "pt" | "es" | "hu";

export const languageLabels: Record<Language, string> = {
  en: "English",
  pt: "Português",
  es: "Español",
  hu: "Magyar",
};

export const languageFlags: Record<Language, string> = {
  en: "🇬🇧",
  pt: "🇧🇷",
  es: "🇪🇸",
  hu: "🇭🇺",
};

export type TranslationKeys = {
  // Navbar
  "nav.howItWorks": string;
  "nav.safety": string;
  "nav.pricing": string;
  "nav.signUp": string;
  "nav.browse": string;
  "nav.matches": string;
  "nav.profile": string;
  "nav.settings": string;
  "nav.logout": string;
  // Hero
  "hero.badge": string;
  "hero.title1": string;
  "hero.title2": string;
  "hero.subtitle": string;
  "hero.getStarted": string;
  "hero.howItWorks": string;
  "hero.matched": string;
  // How It Works
  "hiw.badge": string;
  "hiw.title": string;
  "hiw.subtitle": string;
  "hiw.step1.title": string;
  "hiw.step1.desc": string;
  "hiw.step2.title": string;
  "hiw.step2.desc": string;
  "hiw.step3.title": string;
  "hiw.step3.desc": string;
  "hiw.step4.title": string;
  "hiw.step4.desc": string;
  "hiw.diverse": string;
  "hiw.cta.title": string;
  "hiw.cta.subtitle": string;
  "hiw.cta.button": string;
  // Footer
  "footer.tagline": string;
  "footer.quickLinks": string;
  "footer.home": string;
  "footer.legal": string;
  "footer.privacyPolicy": string;
  "footer.cookiePolicy": string;
  "footer.contactUs": string;
  "footer.rights": string;
  "footer.privacy": string;
  "footer.cookies": string;
  // Feedback
  "feedback.title": string;
  "feedback.subtitle": string;
  "feedback.placeholder": string;
  "feedback.submit": string;
  "feedback.sending": string;
  "feedback.thanks": string;
  "feedback.thanksDesc": string;
  "feedback.give": string;
  // Browse/Match
  "browse.findMatch": string;
  "browse.preferences": string;
  "browse.loading": string;
  "browse.noMore": string;
  "browse.noMoreDesc": string;
  "browse.browseAll": string;
  "browse.swipeHint": string;
  "browse.itsAMatch": string;
  "browse.matchedWith": string;
  "browse.sendMessage": string;
  "browse.keepSwiping": string;
};

const en: TranslationKeys = {
  "nav.howItWorks": "How It Works",
  "nav.safety": "Safety",
  "nav.pricing": "Pricing",
  "nav.signUp": "Sign Up",
  "nav.browse": "Browse",
  "nav.matches": "Matches",
  "nav.profile": "Profile",
  "nav.settings": "Settings",
  "nav.logout": "Logout",
  "hero.badge": "Finding flatmates made easy",
  "hero.title1": "Find Your",
  "hero.title2": "Perfect Flatmate",
  "hero.subtitle": "Connect with compatible roommates from diverse backgrounds. Simple, stress-free, and pleasant — the way finding a flatmate should be.",
  "hero.getStarted": "Get Started",
  "hero.howItWorks": "How It Works",
  "hero.matched": "flatmates matched",
  "hiw.badge": "Simple 4-step process",
  "hiw.title": "How Roompeer",
  "hiw.subtitle": "Finding your perfect flatmate has never been easier. Follow these simple steps to start your journey towards a harmonious living experience.",
  "hiw.step1.title": "Create Your Profile",
  "hiw.step1.desc": "Tell us about yourself, your lifestyle, and what you're looking for in a flatmate. Share your habits, interests, and preferences to help us find your perfect match.",
  "hiw.step2.title": "Find Your Match",
  "hiw.step2.desc": "Use our smart filters to find compatible flatmates in your desired area. Browse through profiles, check compatibility scores, and discover people who share your living style.",
  "hiw.step3.title": "Connect & Chat",
  "hiw.step3.desc": "Safely message your matches to get to know them better. Ask questions, share more about yourself, and build trust before making any commitments.",
  "hiw.step4.title": "Move In!",
  "hiw.step4.desc": "Finalize the details and start your positive living experience. Once you've found the right match, take the next step towards your new home together.",
  "hiw.diverse": "People from all walks of life find their match",
  "hiw.cta.title": "Ready to Find Your Perfect Flatmate?",
  "hiw.cta.subtitle": "Join a growing community of people who have found their ideal living situation through Roompeer.",
  "hiw.cta.button": "Get Started Today",
  "footer.tagline": "Making it simple, stress-free, and pleasant to locate a compatible flatmate.",
  "footer.quickLinks": "Quick Links",
  "footer.home": "Home",
  "footer.legal": "Legal",
  "footer.privacyPolicy": "Privacy Policy",
  "footer.cookiePolicy": "Cookie Policy",
  "footer.contactUs": "Contact Us",
  "footer.rights": "All rights reserved.",
  "footer.privacy": "Privacy",
  "footer.cookies": "Cookies",
  "feedback.title": "How's your experience?",
  "feedback.subtitle": "Rate and share your thoughts with us",
  "feedback.placeholder": "Tell us more (optional)...",
  "feedback.submit": "Submit Feedback",
  "feedback.sending": "Sending...",
  "feedback.thanks": "Thank you!",
  "feedback.thanksDesc": "Your feedback helps us improve Roompeer.",
  "feedback.give": "Give Feedback",
  "browse.findMatch": "Find Your Match",
  "browse.preferences": "Preferences",
  "browse.loading": "Loading profiles...",
  "browse.noMore": "No More Profiles",
  "browse.noMoreDesc": "You've seen all available flatmates. Check back later for new matches!",
  "browse.browseAll": "Browse All Profiles",
  "browse.swipeHint": "Swipe right to like, left to pass",
  "browse.itsAMatch": "It's a Match!",
  "browse.matchedWith": "liked each other!",
  "browse.sendMessage": "Send a Message",
  "browse.keepSwiping": "Keep Swiping",
};

const pt: TranslationKeys = {
  "nav.howItWorks": "Como Funciona",
  "nav.safety": "Segurança",
  "nav.pricing": "Preços",
  "nav.signUp": "Cadastrar",
  "nav.browse": "Explorar",
  "nav.matches": "Combinações",
  "nav.profile": "Perfil",
  "nav.settings": "Configurações",
  "nav.logout": "Sair",
  "hero.badge": "Encontrar colegas de quarto ficou fácil",
  "hero.title1": "Encontre Seu",
  "hero.title2": "Colega Ideal",
  "hero.subtitle": "Conecte-se com colegas de quarto compatíveis de diferentes origens. Simples, sem estresse e agradável — como encontrar um colega deveria ser.",
  "hero.getStarted": "Começar Agora",
  "hero.howItWorks": "Como Funciona",
  "hero.matched": "colegas combinados",
  "hiw.badge": "Processo simples de 4 etapas",
  "hiw.title": "Como o Roompeer",
  "hiw.subtitle": "Encontrar seu colega de quarto ideal nunca foi tão fácil. Siga estes passos simples para começar sua jornada.",
  "hiw.step1.title": "Crie Seu Perfil",
  "hiw.step1.desc": "Conte-nos sobre você, seu estilo de vida e o que procura em um colega. Compartilhe seus hábitos, interesses e preferências.",
  "hiw.step2.title": "Encontre Sua Combinação",
  "hiw.step2.desc": "Use nossos filtros inteligentes para encontrar colegas compatíveis na sua área desejada.",
  "hiw.step3.title": "Conecte & Converse",
  "hiw.step3.desc": "Envie mensagens para seus matches de forma segura para conhecê-los melhor.",
  "hiw.step4.title": "Mude-se!",
  "hiw.step4.desc": "Finalize os detalhes e comece sua experiência positiva de convivência.",
  "hiw.diverse": "Pessoas de todas as origens encontram sua combinação",
  "hiw.cta.title": "Pronto para Encontrar Seu Colega Ideal?",
  "hiw.cta.subtitle": "Junte-se a uma comunidade crescente de pessoas que encontraram sua situação ideal de moradia.",
  "hiw.cta.button": "Começar Hoje",
  "footer.tagline": "Tornando simples, sem estresse e agradável encontrar um colega compatível.",
  "footer.quickLinks": "Links Rápidos",
  "footer.home": "Início",
  "footer.legal": "Jurídico",
  "footer.privacyPolicy": "Política de Privacidade",
  "footer.cookiePolicy": "Política de Cookies",
  "footer.contactUs": "Fale Conosco",
  "footer.rights": "Todos os direitos reservados.",
  "footer.privacy": "Privacidade",
  "footer.cookies": "Cookies",
  "feedback.title": "Como está sua experiência?",
  "feedback.subtitle": "Avalie e compartilhe seus pensamentos",
  "feedback.placeholder": "Conte-nos mais (opcional)...",
  "feedback.submit": "Enviar Feedback",
  "feedback.sending": "Enviando...",
  "feedback.thanks": "Obrigado!",
  "feedback.thanksDesc": "Seu feedback nos ajuda a melhorar o Roompeer.",
  "feedback.give": "Dar Feedback",
  "browse.findMatch": "Encontre Sua Combinação",
  "browse.preferences": "Preferências",
  "browse.loading": "Carregando perfis...",
  "browse.noMore": "Sem Mais Perfis",
  "browse.noMoreDesc": "Você viu todos os colegas disponíveis. Volte mais tarde!",
  "browse.browseAll": "Ver Todos os Perfis",
  "browse.swipeHint": "Deslize para direita para curtir, esquerda para passar",
  "browse.itsAMatch": "É uma Combinação!",
  "browse.matchedWith": "gostaram um do outro!",
  "browse.sendMessage": "Enviar Mensagem",
  "browse.keepSwiping": "Continuar Explorando",
};

const es: TranslationKeys = {
  "nav.howItWorks": "Cómo Funciona",
  "nav.safety": "Seguridad",
  "nav.pricing": "Precios",
  "nav.signUp": "Registrarse",
  "nav.browse": "Explorar",
  "nav.matches": "Coincidencias",
  "nav.profile": "Perfil",
  "nav.settings": "Ajustes",
  "nav.logout": "Cerrar Sesión",
  "hero.badge": "Encontrar compañeros de piso fácil",
  "hero.title1": "Encuentra Tu",
  "hero.title2": "Compañero Ideal",
  "hero.subtitle": "Conéctate con compañeros compatibles de diversos orígenes. Simple, sin estrés y agradable.",
  "hero.getStarted": "Comenzar",
  "hero.howItWorks": "Cómo Funciona",
  "hero.matched": "compañeros conectados",
  "hiw.badge": "Proceso simple de 4 pasos",
  "hiw.title": "Cómo Funciona",
  "hiw.subtitle": "Encontrar a tu compañero de piso ideal nunca ha sido tan fácil. Sigue estos sencillos pasos.",
  "hiw.step1.title": "Crea Tu Perfil",
  "hiw.step1.desc": "Cuéntanos sobre ti, tu estilo de vida y lo que buscas en un compañero de piso.",
  "hiw.step2.title": "Encuentra Tu Match",
  "hiw.step2.desc": "Usa nuestros filtros inteligentes para encontrar compañeros compatibles en tu zona.",
  "hiw.step3.title": "Conecta y Chatea",
  "hiw.step3.desc": "Envía mensajes seguros a tus matches para conocerlos mejor.",
  "hiw.step4.title": "¡Múdate!",
  "hiw.step4.desc": "Finaliza los detalles y comienza tu experiencia positiva de convivencia.",
  "hiw.diverse": "Personas de todos los orígenes encuentran su match",
  "hiw.cta.title": "¿Listo para Encontrar Tu Compañero Ideal?",
  "hiw.cta.subtitle": "Únete a una comunidad creciente que ha encontrado su situación ideal de vivienda.",
  "hiw.cta.button": "Comenzar Hoy",
  "footer.tagline": "Haciendo simple, sin estrés y agradable encontrar un compañero compatible.",
  "footer.quickLinks": "Enlaces Rápidos",
  "footer.home": "Inicio",
  "footer.legal": "Legal",
  "footer.privacyPolicy": "Política de Privacidad",
  "footer.cookiePolicy": "Política de Cookies",
  "footer.contactUs": "Contáctanos",
  "footer.rights": "Todos los derechos reservados.",
  "footer.privacy": "Privacidad",
  "footer.cookies": "Cookies",
  "feedback.title": "¿Cómo es tu experiencia?",
  "feedback.subtitle": "Califica y comparte tus opiniones",
  "feedback.placeholder": "Cuéntanos más (opcional)...",
  "feedback.submit": "Enviar Comentario",
  "feedback.sending": "Enviando...",
  "feedback.thanks": "¡Gracias!",
  "feedback.thanksDesc": "Tu comentario nos ayuda a mejorar Roompeer.",
  "feedback.give": "Dar Feedback",
  "browse.findMatch": "Encuentra Tu Match",
  "browse.preferences": "Preferencias",
  "browse.loading": "Cargando perfiles...",
  "browse.noMore": "No Hay Más Perfiles",
  "browse.noMoreDesc": "Has visto todos los compañeros disponibles. ¡Vuelve más tarde!",
  "browse.browseAll": "Ver Todos los Perfiles",
  "browse.swipeHint": "Desliza a la derecha para gustar, izquierda para pasar",
  "browse.itsAMatch": "¡Es un Match!",
  "browse.matchedWith": "¡se gustaron mutuamente!",
  "browse.sendMessage": "Enviar Mensaje",
  "browse.keepSwiping": "Seguir Explorando",
};

const hu: TranslationKeys = {
  "nav.howItWorks": "Hogyan Működik",
  "nav.safety": "Biztonság",
  "nav.pricing": "Árak",
  "nav.signUp": "Regisztráció",
  "nav.browse": "Böngészés",
  "nav.matches": "Találatok",
  "nav.profile": "Profil",
  "nav.settings": "Beállítások",
  "nav.logout": "Kijelentkezés",
  "hero.badge": "Lakótárs keresés egyszerűen",
  "hero.title1": "Találd Meg a",
  "hero.title2": "Tökéletes Lakótársad",
  "hero.subtitle": "Kapcsolódj kompatibilis lakótársakhoz különböző háttérrel. Egyszerű, stresszmentes és kellemes.",
  "hero.getStarted": "Kezdés",
  "hero.howItWorks": "Hogyan Működik",
  "hero.matched": "lakótárs párosítva",
  "hiw.badge": "Egyszerű 4 lépéses folyamat",
  "hiw.title": "Hogyan Működik a",
  "hiw.subtitle": "A tökéletes lakótárs megtalálása még sosem volt ilyen egyszerű. Kövesd ezeket az egyszerű lépéseket.",
  "hiw.step1.title": "Hozd Létre Profilod",
  "hiw.step1.desc": "Mesélj magadról, az életstílusodról és arról, mit keresel egy lakótársban.",
  "hiw.step2.title": "Találd Meg a Párod",
  "hiw.step2.desc": "Használd okos szűrőinket kompatibilis lakótársak megtalálásához a kívánt területen.",
  "hiw.step3.title": "Kapcsolódj és Chatelj",
  "hiw.step3.desc": "Biztonságosan üzenj a találataidnak, hogy jobban megismerd őket.",
  "hiw.step4.title": "Költözz Be!",
  "hiw.step4.desc": "Véglegesítsd a részleteket és kezdd el a pozitív együttélési élményed.",
  "hiw.diverse": "Minden háttérből érkező emberek megtalálják a párjukat",
  "hiw.cta.title": "Készen Állsz Megtalálni a Tökéletes Lakótársad?",
  "hiw.cta.subtitle": "Csatlakozz egy növekvő közösséghez, akik megtalálták ideális lakhatási helyzetüket.",
  "hiw.cta.button": "Kezdd El Ma",
  "footer.tagline": "Egyszerűvé, stresszmentessé és kellemessé tesszük a kompatibilis lakótárs megtalálását.",
  "footer.quickLinks": "Gyors Linkek",
  "footer.home": "Főoldal",
  "footer.legal": "Jogi",
  "footer.privacyPolicy": "Adatvédelmi Irányelvek",
  "footer.cookiePolicy": "Cookie Szabályzat",
  "footer.contactUs": "Kapcsolat",
  "footer.rights": "Minden jog fenntartva.",
  "footer.privacy": "Adatvédelem",
  "footer.cookies": "Cookie-k",
  "feedback.title": "Milyen az élményed?",
  "feedback.subtitle": "Értékeld és oszd meg gondolataidat",
  "feedback.placeholder": "Mesélj többet (opcionális)...",
  "feedback.submit": "Visszajelzés Küldése",
  "feedback.sending": "Küldés...",
  "feedback.thanks": "Köszönjük!",
  "feedback.thanksDesc": "Visszajelzésed segít a Roompeer fejlesztésében.",
  "feedback.give": "Visszajelzés",
  "browse.findMatch": "Találd Meg a Párod",
  "browse.preferences": "Preferenciák",
  "browse.loading": "Profilok betöltése...",
  "browse.noMore": "Nincs Több Profil",
  "browse.noMoreDesc": "Minden elérhető lakótársat megnéztél. Nézz vissza később!",
  "browse.browseAll": "Összes Profil",
  "browse.swipeHint": "Húzd jobbra a tetszéshez, balra az elutasításhoz",
  "browse.itsAMatch": "Találat!",
  "browse.matchedWith": "kölcsönösen kedvelték egymást!",
  "browse.sendMessage": "Üzenet Küldése",
  "browse.keepSwiping": "Tovább Böngészés",
};

export const translations: Record<Language, TranslationKeys> = { en, pt, es, hu };
