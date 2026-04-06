export type Lang = 'fr' | 'ar';

export const translations = {
  // ===== Language Selector =====
  langSelector: {
    title: { fr: 'Bienvenue', ar: 'مرحبا بيك' },
    subtitle: { fr: 'Choisissez votre langue', ar: 'ختار اللغة ديالك' },
  },

  // ===== TopBar =====
  topBar: {
    mapLabel: { fr: 'Voir la localisation', ar: 'شوف البلاصة' },
    calendarLabel: { fr: 'Ajouter au calendrier', ar: 'زيد للكوندا' },
  },

  // ===== RSVPForm =====
  rsvp: {
    badge: { fr: 'Invitation Exclusive', ar: 'دعوة خاصة' },
    dates: { fr: '14—19 MAI 2026', ar: '14—19 ماي 2026' },
    location: { fr: 'CASABLANCA', ar: 'الدار البيضاء' },
    edition: { fr: '2ÈME ÉDITION', ar: 'الطبعة الثانية' },
    perk1: { fr: 'Coupon -25% exclusif sur commandes', ar: 'كوبون -25% حصري على الطلبيات' },
    perk2: { fr: 'Roue de la Fortune & tombola cadeaux', ar: 'عجلة الحظ و تومبولا هدايا' },
    perk3: { fr: 'Navette privée offerte — transport premium', ar: 'نافيط خاصة مجانية — نقل بريميوم' },
    perk4: { fr: 'Masterclass quotidiennes à 14h00', ar: 'ماستركلاس كل نهار على 14h00' },
    formTitle: { fr: 'Confirmez votre présence', ar: 'أكد الحضور ديالك' },
    fullName: { fr: 'Nom complet', ar: 'الإسم الكامل' },
    salon: { fr: 'Salon / Institut', ar: 'صالون / معهد' },
    city: { fr: 'Ville', ar: 'المدينة' },
    whatsapp: { fr: 'WhatsApp (06 ou 07...)', ar: '(06 ولا 07...) WhatsApp' },
    people: { fr: 'Personnes', ar: 'عدد الأشخاص' },
    representative: { fr: 'Représentant', ar: 'الممثل التجاري' },
    day: { fr: 'Jour de venue', ar: 'نهار الحضور' },
    progress0: { fr: 'Complétez votre inscription', ar: 'كمل التسجيل ديالك' },
    progressActive: { fr: 'En cours...', ar: 'كيتسجل...' },
    progressDone: { fr: '✓ Prêt à confirmer !', ar: '✓ مستاعد للتأكيد!' },
    submit: { fr: 'Réserver ma place VIP →', ar: '← حجز البلاصة VIP ديالي' },
    submitting: { fr: 'Envoi...', ar: 'كيتسيفط...' },
    bottomHint: { fr: 'Une expérience inoubliable vous attend', ar: 'تجربة ما تتنساش كتسناك' },
    phoneError: { fr: 'Numéro invalide', ar: 'الرقم ماشي صحيح' },
    phoneDuplicate: { fr: 'Ce numéro WhatsApp est déjà inscrit', ar: 'هاد الرقم ديال WhatsApp مسجل من قبل' },
    person: { fr: 'personne', ar: 'شخص' },
    persons: { fr: 'personnes', ar: 'أشخاص' },
  },

  // ===== Confirmation =====
  confirmation: {
    title: { fr: ', votre place est réservée !', ar: ', البلاصة ديالك محجوزة!' },
    titleFallback: { fr: 'Votre place est réservée !', ar: 'البلاصة ديالك محجوزة!' },
    subtitle: { fr: 'Nous avons hâte de vous accueillir', ar: 'منتظرينك بفارغ الصبر' },
    ticketLabel: { fr: 'Numéro de billet', ar: 'رقم التيكي' },
    perk1: { fr: 'Coupon -25% exclusif', ar: 'كوبون -25% حصري' },
    perk1Desc: { fr: "Sur commandes durant l'événement", ar: 'على الطلبيات فالحدث' },
    perk2: { fr: 'Ticket tombola offert', ar: 'تيكي تومبولا مجاني' },
    perk2Desc: { fr: 'Participez au grand tirage', ar: 'شارك فالسحب الكبير' },
    perk3: { fr: 'Navette privée offerte', ar: 'نافيط خاصة مجانية' },
    perk3Desc: { fr: 'Transport premium inclus', ar: 'النقل البريميوم داخل' },
    perk4: { fr: 'Masterclass quotidiennes', ar: 'ماستركلاس كل نهار' },
    perk4Desc: { fr: 'Chaque jour à 14h00', ar: 'كل نهار على 14h00' },
    wheelReminder: { fr: "N'oubliez pas votre Roue de la Fortune !", ar: 'ما تنساش عجلة الحظ ديالك!' },
    wheelReminderDesc: { fr: 'Présentez ce billet à votre commercial', ar: 'وري هاد التيكي للممثل التجاري ديالك' },
    dayJ: { fr: 'le jour J', ar: 'نهار الحدث' },
    wheelAccess: { fr: 'pour accéder au jeu', ar: 'باش تدخل للعبة' },
    masterclassTitle: { fr: 'Masterclass quotidiennes à 14h00', ar: 'ماستركلاس كل نهار على 14h00' },
    masterclassDesc: { fr: 'Amenez vos esthéticiennes ! Formations exclusives offertes chaque jour.', ar: 'جيبو الإستيتسيان ديالكم معاكم! تكوينات حصرية مجانية كل نهار.' },
    saveTicket: { fr: 'Sauvegardez votre billet', ar: 'حفظ التيكي ديالك' },
    screenshotHint: { fr: 'Screenshotez ce billet pour le conserver', ar: 'دير سكرينشوت لهاد التيكي باش تحافظ عليه' },
    whatsappSave: { fr: 'WhatsApp', ar: 'WhatsApp' },
    whatsappSub: { fr: 'Sauvegarder', ar: 'حفظ' },
  },

  // ===== StaffPin =====
  staffPin: {
    badge: { fr: 'Zone Sécurisée', ar: 'منطقة آمنة' },
    year: { fr: '2026', ar: '2026' },
    title: { fr: 'ACCÈS STAFF', ar: 'دخول الفريق' },
    subtitle: { fr: "Entrez le code d'accès commercial", ar: 'دخل كود الدخول التجاري' },
    hint: { fr: 'Code alphanumérique fourni par votre responsable', ar: 'الكود اللي عطاك المسؤول ديالك' },
    submit: { fr: 'ACCÉDER', ar: 'دخول' },
    validating: { fr: 'Vérification...', ar: 'التحقق...' },
    bottomHint: { fr: 'Accès réservé aux commerciaux Semilac Days', ar: 'الدخول خاص بالتجاريين ديال Semilac Days' },
    errorWrong: { fr: 'Code incorrect', ar: 'الكود غالط' },
    errorEmpty: { fr: 'Veuillez saisir le code', ar: 'دخل الكود عافاك' },
  },

  // ===== WheelCode =====
  wheelCode: {
    badge: { fr: 'Validation Client', ar: 'التحقق من الزبون' },
    subtitle: { fr: 'Roue de la Fortune', ar: 'عجلة الحظ' },
    instruction: { fr: 'Entrez le code billet du client et le numéro de devis', ar: 'دخل كود التيكي ديال الزبون و رقم الدوفي' },
    instruction2: { fr: 'pour déverrouiller la roue', ar: 'باش تحل العجلة' },
    ticketLabel: { fr: 'Code Billet Client', ar: 'كود تيكي الزبون' },
    ticketHint: { fr: 'Complétez : SD26-XXXX', ar: 'كمل : SD26-XXXX' },
    devisLabel: { fr: 'Numéro de Devis', ar: 'رقم الدوفي' },
    devisHint: { fr: 'Format: S + 5 caractères', ar: 'الفورما : S + 5 حروف' },
    submit: { fr: 'Valider et lancer la roue', ar: 'تأكيد و دور العجلة' },
    validating: { fr: 'Validation...', ar: 'التحقق...' },
    bottomHint: { fr: 'Les deux codes sont requis pour continuer', ar: 'خاصك الكودين باش تكمل' },
    errorDevisUsed: { fr: 'Ce numéro de devis a déjà été utilisé', ar: 'هاد رقم الدوفي تستعمل من قبل' },
    errorAlreadyUsed: { fr: 'Ce billet a déjà participé', ar: 'هاد التيكي شارك من قبل' },
    errorNotFound: { fr: 'Billet non trouvé dans le système', ar: 'التيكي ما كاينش فالسيستيم' },
    errorConnection: { fr: 'Erreur de connexion, réessayez', ar: 'مشكل فالكونيكسيون، عاود حاول' },
    welcomeBadge: { fr: 'Validation Réussie', ar: 'التحقق ناجح' },
    welcomeHello: { fr: 'Bonjour', ar: 'مرحبا' },
    welcomeMessage: { fr: 'Préparez-vous à tenter votre chance', ar: 'تهيأ باش تجرب حظك' },
    welcomeWheel: { fr: 'à la Roue de la Fortune', ar: 'فعجلة الحظ' },
  },

  // ===== WheelGame =====
  wheelGame: {
    greeting: { fr: 'Bonne chance,', ar: 'بالتوفيق،' },
    attempt: { fr: 'ESSAI', ar: 'المحاولة' },
    attemptStatus: { fr: 'Essai 1 / 2', ar: 'المحاولة 1 / 2' },
    lastAttempt: { fr: 'Dernier essai', ar: 'آخر محاولة' },
    instruction: { fr: 'Tournez la roue pour découvrir', ar: 'دور العجلة باش تشوف' },
    instructionBold: { fr: 'votre réduction spécial VIP', ar: 'التخفيض الخاص VIP ديالك' },
    lastAttemptInstruction: { fr: 'Dernier essai !', ar: 'آخر محاولة!' },
    improveGain: { fr: 'Améliorez votre gain de', ar: 'حسّن الربح ديالك من' },
    spin: { fr: 'SPIN', ar: 'دور' },
    resultTitle: { fr: 'Vous avez gagné', ar: 'ربحتي' },
    retryButton: { fr: 'Retenter ma chance (Essai 2)', ar: 'عاود حاول حظك (المحاولة 2)' },
    keepButton: { fr: 'Conserver ce gain', ar: 'حتفظ بهاد الربح' },
    keepLabel: { fr: 'Conserver', ar: 'حتفظ' },
    keepDesc: { fr: 'Garder ce résultat', ar: 'حتفظ بهاد النتيجة' },
    retryLabel: { fr: 'Retenter', ar: 'عاود حاول' },
    retryDesc: { fr: 'Essai restant', ar: 'محاولة باقية' },
  },

  // ===== CouponResult =====
  couponResult: {
    bravo: { fr: 'Bravo !', ar: 'برافو!' },
    youWon: { fr: 'VOUS AVEZ GAGNÉ', ar: 'ربحتي' },
    reduction: { fr: 'de réduction immédiate', ar: 'ديال التخفيض فالحين' },
    onOrder: { fr: 'Sur votre prochaine commande Semilac', ar: 'على الطلبية الجاية ديال Semilac' },
    validUntil: { fr: 'Valable jusqu\'au 19 Mai 2026', ar: 'صالح حتى 19 ماي 2026' },
    codeLabel: { fr: 'Code Promo', ar: 'كود برومو' },
    screenshot: { fr: 'Screenshotez maintenant !', ar: 'دير سكرينشوت دابا!' },
    screenshotDesc: { fr: 'Gardez votre code précieusement pour le jour J', ar: 'حافظ على الكود ديالك لنهار الحدث' },
    traceTitle: { fr: 'Traçabilité', ar: 'التتبع' },
    traceTicket: { fr: 'Ticket RSVP', ar: 'تيكي RSVP' },
    traceDevis: { fr: 'N° Devis', ar: 'رقم الدوفي' },
    traceReduction: { fr: 'Réduction', ar: 'التخفيض' },
    traceAuto: { fr: '✓ Enregistré automatiquement', ar: '✓ تسجل أوتوماتيك' },
    shareStory: { fr: 'Partager en Story', ar: 'شارك فالستوري' },
  },

  // ===== Shared =====
  shared: {
    sponsoredBy: { fr: 'Sponsored By', ar: 'برعاية' },
  },

  // ===== Greeting =====
  greeting: {
    welcome: { fr: 'BIENVENUE', ar: 'مرحبا بيك' },
    hello: { fr: 'Bonjour,', ar: 'مرحبا،' },
    wheelAwaits: { fr: 'Votre roue vous attend', ar: 'العجلة كتسناك' },
    getReady: { fr: 'Préparez-vous pour', ar: 'تهيأ لـ' },
    wheelOfFortune: { fr: 'La Roue de la Fortune', ar: 'عجلة الحظ' },
  },
} as const;

export type TranslationKey = keyof typeof translations;

export function t(section: keyof typeof translations, key: string, lang: Lang): string {
  const s = translations[section] as any;
  if (!s || !s[key]) return key;
  return s[key][lang] || s[key]['fr'] || key;
}
