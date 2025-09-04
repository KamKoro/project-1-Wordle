/* data.js — word lists + utilities
   - allowedGuesses: big list (anything users may type)
   - solutionList: auto-built from allowedGuesses EXCLUDING likely plurals
   - Normalises, de-dupes, validates (A–Z only, 5 letters)
   - Exposes:
       window.WORD_LEN
       window.allowedGuesses        (raw)
       window.solutionList          (raw, auto-filtered)
       window.ALLOWED               (normalised, deduped)
       window.SOLUTIONS             (normalised, deduped)
       window.ALLOWED_SET           (Set for O(1) validation)
       window.pickRandomSolution()  -> string
       window.solutionForDate(date, salt) -> string
*/

// --------------------------- Config ---------------------------
const WORD_LEN = 5;
const DAILY_EPOCH_ISO = '2025-06-19T00:00:00Z';
const DAILY_SALT = 137;
window.WORD_LEN = WORD_LEN;

// --------------------------- Word List --------------------------- //
let allowedGuesses = [
  // A
  "ABOUT","ABOVE","ABYSS","ACORN","ACTOR","ADAGE","ADIEU","ADMIT",
  "ADOPT","ADORE","ADULT","AFFIX","AFTER","AGAIN","AGATE","AGILE",
  "AGORA","AGREE","AHEAD","ALARM","ALBUM","ALERT","ALGAE","ALIEN",
  "ALIVE","ALLEY","ALLOW","ALONE","ALONG","ALOUD","ALPHA","ALSO",
  "ALTER","AMAZE","AMBER","AMITY","AMONG","AMPLE","AMUSE","ANGEL",
  "ANGER","ANGLE","ANGRY","ANGST","AORTA","APART","APPLE","APPLY",
  "APRON","ARISE","AROMA","ARROW","ASIDE","ASSET","ASHEN","ATLAS",
  "AUDIO","AVAIL","AVERT","AVOID","AWARD","AWARE","AXIOM","AZURE",

  // B
  "BACON","BADGE","BAKER","BALMY","BANJO","BARGE","BASIL","BASIC",
  "BATCH","BEACH","BEARD","BEAST","BEGAN","BEGIN","BEGUN","BELOW",
  "BELCH","BELLY","BENCH","BERTH","BERRY","BIBLE","BINGE","BINGO",
  "BIRCH","BIRTH","BISON","BLACK","BLADE","BLAME","BLANK","BLAST",
  "BLAZE","BLEAK","BLEND","BLIND","BLINK","BLISS","BLOAT","BLOCK",
  "BLOOD","BLOOM","BLOUSE","BLUFF","BLUNT","BLUER","BLURT","BLUSH",
  "BOARD","BOAST","BOATS","BOOTH","BOUND","BRAIN","BRAKE","BRAND",
  "BRASH","BRAVE","BRAVO","BREAD","BREAK","BRICK","BRIDE","BRIEF",
  "BRINE","BRING","BRINK","BRISK","BRINY","BROIL","BROAD","BROKE",
  "BROOD","BROWN","BRUNT","BRUSH","BRUTE","BUILD","BUDGE","BUXOM",
  "BUNCH","BURST","BUYER",

  // C
  "CABAL","CABIN","CACHE","CABLE","CAMEL","CANDY","CANNY","CANOE",
  "CARGO","CARRY","CAUSE","CEDAR","CHAIR","CHAFE","CHALK","CHAOS",
  "CHASM","CHARM","CHART","CHASE","CHEAP","CHEER","CHEST","CHIEF",
  "CHILD","CHILL","CHIME","CHIRP","CHOIR","CHOKE","CHORD","CHUTE",
  "CHUNK","CIDER","CIVIC","CIVIL","CLADE","CLAIM","CLASH","CLASS",
  "CLEAN","CLEAR","CLEAT","CLERK","CLIMB","CLOCK","CLOSE","CLOTH",
  "CLOUD","CLOVE","CLOWN","COACH","COAST","COCOA","COLOR","COMET",
  "CONDO","CORAL","COUNT","COURT","COVER","COVET","COWER","CRACK",
  "CRANE","CRASH","CRATE","CRAWL","CRAZY","CREAK","CREDO","CRIME",
  "CRISP","CROOK","CRONY","CROWD","CRUDE","CRUEL","CRUMB","CRUSH",
  "CRUST","CROWN","CUBIC","CURLY","CURVE","CYCLE","CYBER","CYNIC",

  // D
  "DAILY","DAIRY","DAISY","DALLY","DANCE","DANDY","DARTS","DAUNT",
  "DEATH","DEALT","DEBIT","DECAL","DECOY","DEFER","DEIGN","DEITY",
  "DELAY","DELTA","DELVE","DEMON","DEMUR","DENSE","DEPTH","DETER",
  "DEVIL","DICEY","DIGIT","DINER","DINGO","DIRTY","DISCO","DITTY",
  "DIZZY","DODGE","DODGY","DOGMA","DOING","DOCKS","DOLLY","DONOR",
  "DOORS","DOUBT","DOUGH","DOUSE","DRAFT","DRAMA","DRANK","DRAPE",
  "DREAD","DREAM","DRESS","DRIED","DRIFT","DRILL","DRINK","DRIVE",
  "DRONE","DROVE","DRUID","DRUGS","DRUNK","DRYER","DUCAL","DUCKS",
  "DOWRY","DUSTY","DUVET","DWARF","DWELL","DYING",

  // E
  "EAGER","EAGLE","EARLY","EARTH","EASEL","EATEN","EBONY","ECLAT",
  "EDICT","EERIE","EIGHT","EJECT","ELATE","ELBOW","ELDER","ELEGY",
  "ELIDE","ELFIN","ELITE","ELOPE","ELUDE","EMAIL","EMBER","EMCEE",
  "EMOTE","EMPTY","ENACT","ENEMY","ENNUI","ENJOY","ENSUE","ENTER",
  "ENTRY","EPOCH","EPOXY","EQUAL","EQUIP","ERASE","ERODE","ERROR",
  "ESSAY","ETHIC","ETHOS","EVENT","EVERY","EVICT","EVOKE","EVADE",
  "EXACT","EXALT","EXCEL","EXERT","EXILE","EXIST","EXITS","EXTRA",

  // F
  "FABLE","FAINT","FAITH","FALSE","FANCY","FAUNA","FATAL","FAULT",
  "FEAST","FERAL","FENCE","FETCH","FETID","FIBRE","FIELD","FIFTH",
  "FIGHT","FIEND","FINAL","FIRST","FJORD","FIZZY","FLAIR","FLARE",
  "FLAME","FLASH","FLESH","FLINT","FLOCK","FLOOD","FLOOR","FLORA",
  "FROTH","FLUTE","FOCUS","FORAY","FORCE","FORGE","FORTH","FORTY",
  "FOUND","FRAIL","FRANK","FRAUD","FRESH","FROST","FROWN","FROZE",
  "FRUIT","FUGUE","FUMES","FUNGI","FUNNY","FUNKY","FUSSY","FUZZY",

  // G
  "GAFFE","GAILY","GAMES","GAMER","GAMUT","GAUGE","GAUNT","GAWKY",
  "GAVEL","GENRE","GHOST","GHOUL","GIANT","GIDDY","GIRTH","GIVEN",
  "GLAND","GLARE","GLASS","GLEAM","GLEAN","GLIDE","GLOAT","GLOBE",
  "GLOOM","GLORY","GLOVE","GOING","GOUGE","GORGE","GRACE","GRAIL",
  "GRAND","GRANT","GRAPE","GRASS","GRAVE","GRAZE","GRASP","GREAT",
  "GREEN","GREET","GRILL","GRIME","GRIND","GRIPE","GROIN","GROUP",
  "GROSS","GROWN","GUARD","GUESS","GUIDE","GUEST","GULLY",

  // H
  "HABIT","HAIKU","HALVE","HAPPY","HANDS","HARDY","HASTE","HASTY",
  "HATCH","HAVEN","HAUNT","HAZEL","HEARD","HEART","HEAVY","HEDGE",
  "HEIST","HELIX","HELLO","HERON","HIKER","HINGE","HITCH","HOBBY",
  "HOARD","HOIST","HOLLY","HONEY","HORSE","HOUND","HOUSE","HOVEL",
  "HOVER","HULKY","HUMAN","HUMID","HUMOR","HUNCH","HURLS","HURRY",
  "HUSKS","HUSKY","HYDRA","HYDRO","HYENA","HYPER",

  // I
  "ICILY","ICING","ICHOR","ICONS","IDEAL","IDEAS","IDIOM","IDIOT",
  "IGLOO","ILIAC","IMAGE","IMBUE","IMPLY","INANE","INBOX","INCUR",
  "INDEX","INERT","INEPT","INFER","INLAY","INLET","INNER","INPUT",
  "IONIC","INTRO","IOTAS","IRATE","IRKED","IRONY","ISLET","ISSUE",
  "ITCHY","IVIED","IVORY",

  // J
  "JAUNT","JAZZY","JELLO","JELLY","JELLS","JERKY","JEWEL","JIFFY",
  "JOINT","JOIST","JOKER","JOKES","JOLLY","JOULE","JOWLS","JOUST",
  "JUDGE","JUICE","JUICY","JUMBO","JUMPS","JUMPY","JUNKS","JUNTO",
  "JUROR",

  // K
  "KAPPA","KARMA","KAYAK","KETCH","KHAKI","KINKY","KIOSK","KITES",
  "KITTY","KNACK","KNAVE","KNEAD","KNEEL","KNEES","KNELT","KNIFE",
  "KNITS","KNOCK","KNOLL","KNOWN","KOALA","KOOKY","KORMA","KRAUT",
  "KUDOS",

  // L
  "LABEL","LARGE","LASER","LATCH","LAYER","LEAFY","LEARN","LEAST",
  "LEASH","LEAVE","LEMON","LEVEL","LEVER","LIGHT","LILAC","LIMBO",
  "LINGO","LINKS","LITHE","LITRE","LIVED","LIVER","LIVES","LOCAL",
  "LODGE","LOAMY","LOATH","LOFTY","LOGIC","LOOSE","LOOPY","LORRY",
  "LOSER","LOTUS","LOUSE","LOUPE","LOVER","LOWER","LOWLY","LOYAL",
  "LUCID","LUCKY","LUNCH","LUNAR","LUNGE","LURCH","LURID","LYMPH",
  "LYRIC",

  // M
  "MACHO","MAGIC","MAJOR","MAKER","MAMBO","MANGO","MANOR","MAPLE",
  "MARCH","MARRY","MASON","MATCH","MEANT","MELEE","MELON","MERCY",
  "MERIT","METAL","METER","METRE","MICRO","MIGHT","MINED","MINER",
  "MINOR","MINUS","MIMIC","MIRTH","MOIST","MODEL","MOLAR","MONEY",
  "MONTH","MOOSE","MORAL","MORPH","MOSSY","MOTEL","MOTIF","MOTOR",
  "MOUNT","MOUSE","MOUTH","MOVIE","MOVER","MOWER","MUCKY","MUNCH",
  "MUMMY","MURKY","MUSIC","MUTED","MYTHS",

  // N
  "NADIR","NAIVE","NAKED","NANNY","NATAL","NAVAL","NASTY","NAVEL",
  "NATTO","NERDY","NERVY","NEIGH","NERVE","NEVER","NICHE","NIECE",
  "NIFTY","NIGHT","NINJA","NINNY","NINTH","NOBLE","NOBLY","NODAL",
  "NOISE","NOSED","NORTH","NOTCH","NOTED","NOVEL","NUDGE","NYLON",
  "NURSE","NUTTY","NYMPH",

  // O
  "OAKEN","OASIS","OBESE","OBEYS","OCCUR","OCEAN","OCHRE","OCTAL",
  "ODDLY","ODIUM","OFTEN","OKAPI","OLDER","OLIVE","OMITS","ONION",
  "ONSET","OPERA","OPINE","OPIUM","OPTED","OPTIC","ORBIT","ORDER",
  "ORGAN","OTHER","OTTER","OUTDO","OUTER","OVERT","OVINE","OVOID",
  "OXBOW","OXIDE","OXLIP","OZONE",

  // P
  "PADRE","PANIC","PAINT","PAPER","PASTA","PATCH","PATIO","PAVED",
  "PAGAN","PEACE","PEACH","PECAN","PEARL","PEDAL","PENAL","PENCE",
  "PENNY","PERIL","PHASE","PIANO","PILOT","PINKY","PINCH","PIOUS",
  "PIPER","PITCH","PIVOT","PIXEL","PLACE","PLAIN","PLANK","PLANT",
  "PLATE","PLAZA","PLEAD","PLUCK","PLUMB","PLUME","PLUSH","POINT",
  "POISE","POLAR","POLKA","POPPY","POUCH","POWER","PRANK","PRICE",
  "PRIDE","PRIME","PRINT","PRIOR","PRISM","PROBE","PRONE","PROOF",
  "PROUD","PROVE","PROWL","PROXY","PRUDE","PSALM","PUBIC","PUPAE",
  "PUPIL","PUREE","PURGE","PURSE","PULSE","PYGMY",

  // Q
  "QUALM","QUACK","QUAIL","QUAKE","QUARK","QUART","QUASH","QUASI",
  "QUAFF","QUEEN","QUELL","QUERN","QUEUE","QUERY","QUEST","QUICK",
  "QUIET","QUILL","QUILT","QUINT","QUIRK","QUITE","QUOTA","QUOTE",

  // R
  "RABBI","RABID","RADAR","RADIO","RAISE","RALLY","RANGE","RATES",
  "RAVEN","RAZED","RAZOR","REACH","REACT","READY","REALM","REBEL",
  "REBUS","RECAP","RECUR","REEDY","REIGN","RELAX","RELIC","RELAY",
  "REMIT","REPLY","RERUN","RESET","RHINO","RHYME","RIDER","RIDGE",
  "RIGHT","RIGID","RINSE","RIPEN","RISKY","RIVER","ROAST","ROBED",
  "ROBOT","ROCKY","ROGUE","ROUTE","ROUND","ROUSE","ROVER","ROWER",
  "ROYAL","RUGBY","RURAL","RUSTY","RIVEN",

  // S
  "SABRE","SAFER","SAINT","SALAD","SALTY","SAUCE","SAUNA","SCALD",
  "SCALP","SCARF","SCARY","SCENE","SCENT","SCOFF","SCOOP","SCOPE",
  "SCORE","SCORN","SCOUT","SCOWL","SCRUB","SEIZE","SENSE","SHADE",
  "SHAKE","SHAPE","SHARE","SHARP","SHAVE","SHEEP","SHELF","SHELL",
  "SHINY","SHIRE","SHIRT","SHOCK","SHONE","SHOOK","SHORE","SHORT",
  "SHOUT","SHOVE","SHOWN","SHRUB","SHRUG","SIEGE","SIGHT","SINEW",
  "SILLY","SIREN","SKATE","SKILL","SKIRT","SKULL","SKEIN","SLEEK",
  "SLEEP","SLEET","SLICK","SLATE","SLIDE","SLIME","SLING","SLOPE",
  "SLOSH","SLOTH","SMALL","SMART","SMELL","SMILE","SMOKE","SMOKY",
  "SMOTE","SNACK","SNAIL","SNAKE","SNARL","SNEAK","SNEER","SNIPE",
  "SNOOP","SNUCK","SOBER","SOOTY","SOLAR","SOLID","SONAR","SORRY",
  "SOUND","SOUTH","SPACE","SPADE","SPARE","SPARK","SPEAK","SPEAR",
  "SPEED","SPELL","SPEND","SPICE","SPIKE","SPIKY","SPILL","SPILT",
  "SPINE","SPITE","SPLIT","SPOIL","SPOKE","SPOOL","SPOON","SPORT",
  "SPURN","SQUAD","SQUID","STAND","STARE","START","STATE","STAKE",
  "STALE","STALL","STEAL","STEAK","STEAM","STEEL","STEEP","STEER",
  "STERN","STICK","STIFF","STILL","STING","STINK","STONE","STOLE",
  "STOOL","STORM","STORY","STOVE","STRAW","STRAP","STRIP","STUDY",
  "STUFF","STUMP","STYLE","SUGAR","SUITE","SURLY","SUNNY","SUPER",
  "SURGE","SWEEP","SWEAR","SWEAT","SWEET","SWELL","SWIFT","SWING",
  "SWIRL","SWOOP","SWORD","SWUNG","SWEPT","SYRUP","SYNTH",

  // T
  "TABLE","TACIT","TAKEN","TALES","TALON","TANGO","TAPER","TASTE",
  "TARDY","TENSE","TEPID","THANK","THIEF","THICK","THIRD","THORN",
  "THOSE","THREE","THREW","THINK","THING","TIGHT","TILDE","TIMER",
  "TINGE","TITLE","TITAN","TOAST","TODAY","TOTAL","TOUCH","TOUGH",
  "TOXIC","TOWER","TOWEL","TRACE","TRACK","TRAIL","TRASH","TRITE",
  "TRUCK","TRUNK","TREAD","TREAT","TREND","TROPE","TROVE","TRULY",
  "TRUST","TULIP","TUMOR","TUTOR","TWANG","TWINE","TWINS","TWIRL",
  "TWIST","TYPED","TYPIC",

  // U
  "UDDER","ULCER","UMBER","ULTRA","UNCLE","UNCUT","UNDER","UNDUE",
  "UNFIT","UNIFY","UNION","UNITE","UNITY","UNMET","UNTIE","UNTIL",
  "UNWED","UNZIP","UPEND","UPPER","UPSET","URBAN","URGED","USAGE",
  "USERS","USHER","USUAL","USING","USURP","UTTER",

  // V
  "VAGUE","VALID","VALOR","VALUE","VALVE","VAPID","VAPOR","VAULT",
  "VAUNT","VELDT","VENOM","VENUE","VERSE","VERGE","VERVE","VICAR",
  "VICES","VIGIL","VIGOR","VILER","VILLA","VINYL","VIPER","VIRAL",
  "VISTA","VITAL","VIVID","VIXEN","VOCAB","VOCAL","VODKA","VOGUE",
  "VOLTS","VOTER","VOWED","VOWEL",

  // W
  "WACKY","WADER","WAFER","WAGON","WAIST","WAKEN","WALTZ","WASTE",
  "WATER","WAXEN","WAVER","WEALD","WEARY","WEIGH","WEIRD","WELSH",
  "WENCH","WHEEL","WHACK","WHARF","WHALE","WHEAT","WHILE","WHINE",
  "WHIRL","WHISK","WHITE","WHOLE","WHOOP","WHOSE","WIDEN","WIDOW",
  "WIDTH","WIELD","WINCE","WINDY","WITCH","WITTY","WOMAN","WOOER",
  "WOOZY","WORLD","WORRY","WORSE","WORST","WORTH","WOUND","WOVEN",
  "WRIST","WRITE","WROTE","WRONG","WRUNG","WRYLY",

  // X
  "XENIA","XENON","XERIC","XYLEM","XYSTI","XYSTS",

  // Y
  "YACHT","YAPPY","YARNS","YAWNS","YEARN","YEAST","YELLS","YETIS",
  "YIELD","YIKES","YODEL","YOKED","YOKEL","YOUNG","YOURS","YOUTH",
  "YOWLS","YUMMY",

  // Z
  "ZAPPY","ZAZEN","ZEBRA","ZEBUS","ZESTS","ZESTY","ZILCH","ZINGS",
  "ZINGY","ZLOTY","ZONAL","ZONED","ZONER","ZONES","ZONKS","ZORIL",
  "ZORRO"
];


// --------------------------- Plural filtering ---------------------------
// Words we *keep* even though they end with 'S' (clear singulars).
const NON_PLURAL_SINGULARS = new Set([
  'ABYSS','CLASS','GRASS','CHAOS'
]);

function isLikelyPlural(word) {
  // Always keep obvious singulars ending with S
  if (NON_PLURAL_SINGULARS.has(word)) return false;

  // Keep words ending with 'SS' (e.g., GLASS) — but you can later whitelist instead.
  if (word.endsWith('SS')) return false;

  // -IES plural (e.g., TRIES -> TRY)
  if (word.endsWith('IES')) return true;

  // -ES after sibilants (boxes, buses, quizzes, churches, dishes)
  if (/(S|X|Z|CH|SH)ES$/.test(word)) return true;

  // Generic trailing -S (likely plural or 3rd person verb) -> exclude
  if (word.endsWith('S')) return true;

  return false;
}

// --------------------------- Normalisation ---------------------------
function normaliseList(arr) {
  const out = [];
  const seen = new Set();
  for (const raw of arr || []) {
    const w = String(raw).trim().toUpperCase();
    if (w.length !== WORD_LEN) continue;
    if (!/^[A-Z]+$/.test(w)) continue;
    if (!seen.has(w)) { seen.add(w); out.push(w); }
  }
  return out;
}

// Build solution list from allowed, excluding likely plurals.
function buildAutoSolutions(fromAllowed) {
  const out = [];
  for (const w of fromAllowed) {
    if (!isLikelyPlural(w)) out.push(w);
  }
  return out;
}

function buildLexicon({ allowed }) {
  const ALLOWED = normaliseList(allowed);
  const autoSolutions = buildAutoSolutions(ALLOWED);
  // Ensure every solution is also guessable (already true here)
  const SOLUTIONS = normaliseList(autoSolutions);
  const ALLOWED_SET = new Set(ALLOWED);
  return { SOLUTIONS, ALLOWED, ALLOWED_SET };
}

// --------------------------- Lint (console) ---------------------------
function lintList(name, arr) {
  const issues = { wrongLen:[], nonAlpha:[], dups:[] };
  const seen = new Set();
  for (const raw of arr || []) {
    const w = String(raw).trim().toUpperCase();
    if (w.length !== WORD_LEN) issues.wrongLen.push(w);
    if (!/^[A-Z]+$/.test(w)) issues.nonAlpha.push(w);
    if (seen.has(w)) issues.dups.push(w);
    seen.add(w);
  }
  if (issues.wrongLen.length || issues.nonAlpha.length || issues.dups.length) {
    console.group(`Word list issues in ${name}`);
    if (issues.wrongLen.length) console.warn('Wrong length:', issues.wrongLen.slice(0,20), `(+${Math.max(0, issues.wrongLen.length-20)} more)`);
    if (issues.nonAlpha.length) console.warn('Non-alpha:', issues.nonAlpha.slice(0,20), `(+${Math.max(0, issues.nonAlpha.length-20)} more)`);
    if (issues.dups.length) console.warn('Duplicates:', issues.dups.slice(0,20), `(+${Math.max(0, issues.dups.length-20)} more)`);
    console.groupEnd();
  } else {
    console.info(`${name}: ${arr?.length ?? 0} entries, no issues ✅`);
  }
}

// Lint raw list
lintList('allowedGuesses (raw)', allowedGuesses);

// Build final, cleaned lexicon and expose it
const { SOLUTIONS, ALLOWED, ALLOWED_SET } = buildLexicon({
  allowed: allowedGuesses
});

window.allowedGuesses = allowedGuesses;   // raw
window.solutionList   = SOLUTIONS;        // auto-filtered
window.ALLOWED        = ALLOWED;          // cleaned allowed list
window.SOLUTIONS      = SOLUTIONS;        // cleaned solution list
window.ALLOWED_SET    = ALLOWED_SET;      // fast lookup

// --------------------------- Helpers ---------------------------
// Random solution (practice mode)
function pickRandomSolution() {
  if (!SOLUTIONS.length) return '';
  const i = Math.floor(Math.random() * SOLUTIONS.length);
  return SOLUTIONS[i];
}

// Deterministic daily solution based on date (+salt)
function solutionForDate(date = new Date(), salt = DAILY_SALT) {
  if (!SOLUTIONS.length) return '';
  const epoch = new Date(DAILY_EPOCH_ISO);
  const dayIndex = Math.floor((date - epoch) / 86400000);
  return SOLUTIONS[(dayIndex + salt) % SOLUTIONS.length];
}

window.pickRandomSolution = pickRandomSolution;
window.solutionForDate = solutionForDate;

// Friendly startup logs
console.info(`Lexicon ready: ${SOLUTIONS.length} solutions (plurals excluded) | ${ALLOWED.length} allowed guesses.`);
