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
const DAILY_EPOCH_ISO = '2021-06-19T00:00:00Z';
const DAILY_SALT = 137;
window.WORD_LEN = WORD_LEN;

// --------------------------- Raw List (your original) ---------------------------
let allowedGuesses = [
// A
"ABOUT","ABOVE","ABYSS","ACORN","ACTOR","ADIEU","ADMIT","ADOPT","ADORE","ADULT","AFFIX","AFTER","AGAIN","AGILE","AGORA","AGREE","AHEAD","ALARM","ALBUM","ALERT","ALIEN","ALIVE","ALLEY","ALLOW","ALONE","ALONG","ALOUD","ALPHA","ALSO","ALTER","AMAZE","AMBER","AMONG","AMPLE","AMUSE","ANGEL","ANGER","ANGLE","ANGRY","ANGST","APART","APPLE","APPLY","ARISE","AROMA","ARROW","ASIDE","ASSET","AUDIO","AVERT","AVOID","AWARD","AWARE","AZURE",
// B
"BACON","BAKER","BANJO","BASIC","BEACH","BEARD","BEAST","BEGAN","BEGIN","BELOW","BELCH","BELLY","BENCH","BERRY","BIBLE","BINGE","BINGO","BIRTH","BISON","BLACK","BLADE","BLAME","BLANK","BLAST","BLAZE","BLEAK","BLEND","BLIND","BLINK","BLISS","BLOCK","BLOOD","BLOOM","BLOUSE","BLUFF","BLUNT","BLURT","BLUSH","BOARD","BOAST","BOATS","BOOTH","BOUND","BRAIN","BRAKE","BRAND","BRASH","BRAVE","BRAVO","BREAD","BREAK","BRICK","BRIDE","BRIEF","BRINE","BRING","BROAD","BROKE","BROOD","BROWN","BRUSH","BUILD","BUDGE","BUNCH","BURST","BUYER",
// C
"CABIN","CACHE","CABLE","CAMEL","CANDY","CANOE","CARGO","CARRY","CAUSE","CHAIR","CHALK","CHAOS","CHARM","CHART","CHASE","CHEAP","CHEER","CHEST","CHIEF","CHILD","CHILL","CHIME","CHIRP","CHOIR","CHOKE","CHORD","CHUNK","CIDER","CIVIC","CIVIL","CLAIM","CLASH","CLASS","CLEAN","CLEAR","CLIMB","CLOCK","CLOSE","CLOTH","CLOUD","CLOVE","CLOWN","COACH","COAST","COLOR","COUNT","COURT","COVER","CRACK","CRANE","CRASH","CRATE","CRAWL","CRAZY","CRIME","CRISP","CROWD","CRUEL","CRUSH","CRUST","CROWN","CUBIC","CURLY","CURVE","CYCLE","CYBER","CYNIC",

"DAILY","DAISY","DANCE","DANDY","DARTS","DAUNT","DEATH","DEALT","DEBIT","DECAL","DECOY","DEFER","DEITY","DELAY","DELTA","DELVE","DEMON","DENSE","DEPTH","DEVIL","DICEY","DIGIT","DINER","DINGO","DIRTY","DISCO","DIZZY","DODGE","DOING","DOCKS","DOLLY","DONOR","DOORS","DOUBT","DOUGH","DOUSE","DRAFT","DRAMA","DRANK","DRAPE","DREAD","DREAM","DRESS","DRIED","DRIFT","DRILL","DRINK","DRIVE","DROVE","DRONE","DROVE","DRUGS","DRUNK","DRYER","DUCKS","DUSTY","DWARF","DWELL","DYING",

"EARLY","EAGER","EAGLE","EARTH","EASEL","EATEN","EBONY","EERIE","EIGHT","EJECT","ELATE","ELBOW","ELDER","ELFIN","ELITE","ELOPE","ELUDE","EMAIL","EMBER","EMPTY","ENACT","ENEMY","ENJOY","ENSUE","ENTER","ENTRY","EPOCH","EQUAL","EQUIP","ERASE","ERROR","ESSAY","ETHIC","ETHOS","EVENT","EVERY","EVOKE","EVADE","EVICT","EXACT","EXALT","EXCEL","EXERT","EXILE","EXIST","EXITS","EXTRA",

"FABLE","FAINT","FAITH","FALSE","FANCY","FATAL","FAULT","FEAST","FENCE","FETCH","FIBRE","FIELD","FIGHT","FINAL","FIRST","FIFTY","FIZZY","FLAIR","FLARE","FLAME","FLASH","FLESH","FLINT","FLOCK","FLOOD","FLOOR","FLORA","FLUTE","FOCUS","FORCE","FORGE","FORTH","FORTY","FOUND","FRAIL","FRANK","FRAUD","FRESH","FRONT","FROST","FROWN","FROZE","FRUIT","FUNGI","FUNNY","FUNKY","FUZZY",

"GAMES","GAMER","GAUGE","GAUNT","GAVEL","GENRE","GHOST","GIANT","GIDDY","GIVEN","GLAND","GLARE","GLASS","GLEAM","GLEAN","GLIDE","GLOBE","GLOOM","GLORY","GLOVE","GOING","GORGE","GRACE","GRAND","GRANT","GRAPE","GRASS","GRAVE","GRAZE","GRASP","GREAT","GREEN","GREET","GRILL","GRIND","GROUP","GROSS","GROWN","GUARD","GUESS","GUIDE","GUEST",

"HABIT","HAPPY","HANDS","HARDY","HASTE","HASTY","HATCH","HAUNT","HEARD","HEART","HEAVY","HEDGE","HEIST","HELIX","HELLO","HERON","HIKER","HINGE","HITCH","HOBBY","HOLLY","HONEY","HORSE","HOUND","HOUSE","HOTEL","HOVER","HULKY","HUMAN","HUMID","HUMOR","HURLS","HURRY","HUSKY","HYDRA","HYENA","HYPER",

"ICILY","ICING","ICONS","IDEAL","IDEAS","IDIOM","IGLOO","IMAGE","IMPLY","INBOX","INCUR","INDEX","INERT","INFER","INLAY","INLET","INNER","INPUT","INTRO","INVOK","IRATE","IRONY","ISLET","ISSUE","ITCHY","IVIED","IVORY",

"JAZZY","JELLO","JELLY","JELLS","JERKY","JEWEL","JOINT","JOIST","JOKER","JOKES","JOLLY","JOUST","JUDGE","JUICE","JUICY","JUMBO","JUMPS","JUMPY","JUNKS","JUNTO","JUROR","JURRY",

"KAPPA","KARMA","KAYAK","KETCH","KHAKI","KINKY","KIOSK","KITTY","KNACK","KNAVE","KNEAD","KNEEL","KNELT","KNIFE","KNOCK","KNOWN","KOALA","KRAUT","KUDOS",
// L
"LABEL","LARGE","LASER","LATCH","LAYER","LEAFY","LEARN","LEAST","LEASH","LEAVE","LEMON","LEVEL","LEVER","LIGHT","LIMBO","LINGO","LINKS","LITHE","LIVED","LIVER","LIVES","LOCAL","LODGE","LOFTY","LOGIC","LOOSE","LOOPY","LOSER","LOTUS","LOVER","LOWER","LOWLY","LOYAL","LUCID","LUCKY","LUNCH","LUNAR","LUNGE","LURCH","LURID","LYRIC",
// M
"MACHO","MAGIC","MAJOR","MAKER","MANGO","MAPLE","MARCH","MATCH","MEANT","MERIT","METAL","METER","METRE","MICRO","MIGHT","MINED","MINER","MINOR","MINUS","MIMIC","MIRTH","MODEL","MOLAR","MONEY","MONTH","MOOSE","MORAL","MOSSY","MOTEL","MOTIF","MOTOR","MOUNT","MOUSE","MOUTH","MOVIE","MOVER","MUNCH","MURKY","MUSIC","MUTED","MYTHS",
// N
"NADIR","NAIVE","NAKED","NANNY","NATAL","NAVAL","NASTY","NAVEL","NEIGH","NERVE","NEVER","NICHE","NIECE","NIFTY","NIGHT","NINJA","NINTH","NOBLE","NOBLY","NOISE","NORTH","NOTCH","NOTED","NOVEL","NUDGE","NURSE","NUTTY","NYMPH",
// O
"OASIS","OBESE","OCCUR","OCEAN","OCTAL","ODDLY","OFTEN","OLDER","OLIVE","OMITS","ONION","ONSET","OPERA","OPINE","OPTED","OPTIC","ORBIT","ORDER","ORGAN","OTHER","OTTER","OUTDO","OUTER","OVERT","OVINE","OXIDE","OZONE",
// P
"PANIC","PAINT","PAPER","PASTA","PATCH","PATIO","PAVED","PEACE","PEACH","PEARL","PEDAL","PENAL","PENCE","PENNY","PERIL","PHASE","PIANO","PILOT","PINKY","PINCH","PITCH","PIVOT","PIXEL","PLACE","PLAIN","PLANK","PLANT","PLATE","PLAZA","PLEAD","PLUCK","PLUME","PLUSH","POINT","POLAR","POLKA","POPPY","POUCH","POWER","PRANK","PRICE","PRIDE","PRIME","PRINT","PRIOR","PRISM","PROBE","PRONE","PROOF","PROUD","PROVE","PROWL","PSALM","PURGE","PURSE","PULSE","PUPIL","PUREE","PYGMY",
// Q
"QUALM","QUACK","QUAIL","QUAKE","QUARK","QUASH","QUEEN","QUELL","QUEUE","QUEST","QUICK","QUIET","QUILL","QUILT","QUINT","QUIRK","QUITE","QUOTA","QUOTE",
// R
"RABID","RADIO","RALLY","RANGE","RATES","RAVEN","RAISE","RAZOR","REACH","REACT","READY","REALM","REBEL","RECAP","REIGN","RELAY","REPLY","RESET","RHYME","RIDER","RIDGE","RIGHT","RIGID","RINSE","RISKY","RIVER","ROAST","ROBOT","ROCKY","ROGUE","ROUTE","ROUND","ROUSE","ROVER","ROYAL","RUGBY","RUMOR","RURAL","RUSTY",
// S
"SAFER","SAINT","SALAD","SALTY","SAUCE","SCARF","SCARY","SCENE","SCENT","SCOFF","SCOOP","SCOPE","SCORE","SCORN","SCOUT","SCRUB","SEIZE","SENSE","SHADE","SHAKE","SHAPE","SHARE","SHARP","SHAVE","SHEEP","SHELF","SHELL","SHINY","SHIRT","SHOCK","SHOOK","SHORE","SHORT","SHOUT","SHOVE","SHOWN","SHRUB","SHRUG","SIGHT","SILLY","SIREN","SKATE","SKILL","SKIRT","SKULL","SLEEK","SLEEP","SLEET","SLICK","SLIDE","SLIME","SLING","SLOPE","SLOTH","SMALL","SMART","SMELL","SMILE","SMOKE","SMOKY","SNACK","SNAIL","SNAKE","SNEAK","SNEER","SNIPE","SNOOP","SNUCK","SOBER","SOLAR","SOLID","SONAR","SORRY","SOUND","SOUTH","SPACE","SPADE","SPARE","SPARK","SPEAK","SPEAR","SPEED","SPELL","SPEND","SPICE","SPIKE","SPIKY","SPILL","SPILT","SPINE","SPITE","SPLIT","SPOIL","SPOKE","SPOOL","SPOON","SPORT","SQUAD","SQUID","STAGE","STAGE","STAFF","STAGE","STAGE","STAGE","STAND","STARE","START","STATE","STAKE","STALE","STALL","STEAL","STEAK","STEAM","STEEL","STEEP","STEER","STERN","STICK","STIFF","STILL","STING","STINK","STONE","STOLE","STOOL","STORM","STORY","STOVE","STRAW","STRAP","STRIP","STUDY","STUFF","STUMP","STYLE","SUGAR","SUITE","SUNNY","SUPER","SURGE","SWEEP","SWEAR","SWEAT","SWEET","SWELL","SWIFT","SWING","SWIRL","SWOOP","SWORD","SWUNG","SWEPT","SYRUP","SYNTH",
// T
"TABLE","TAKEN","TALON","TALES","TANGO","TASTE","TENSE","THANK","THAT'S","THIEF","THICK","THIRD","THORN","THOSE","THREE","THREW","THINK","THING","TITLE","TIGHT","THROW","THUMB","TIGER","TIMER","TODAY","TOTAL","TOAST","TORCH","TOUCH","TOUGH","TOWER","TOWEL","TRACE","TRACK","TRAIL","TRASH","TRUCK","TRUNK","TREAD","TREAT","TREND","TRULY","TROPE","TRUST","TWINE","TWINS","TWIRL","TWIST","TYPED","TYPIC",
// U
"ULCER","ULTRA","UNCLE","UNDER","UNFIT","UNIFY","UNION","UNITE","UNITY","UNTIE","UNTIL","UNZIP","UPEND","UPPER","UPSET","URBAN","URGED","USAGE","USERS","USHER","USUAL","USING","UTTER",
// V
"VALID","VALUE","VALVE","VAPID","VAPOR","VAULT","VAUNT","VENOM","VENUE","VERSE","VERGE","VICES","VIGOR","VILLA","VINYL","VIRAL","VISTA","VITAL","VIVID","VIXEN","VOCAL","VODKA","VOTER","VOWED","VOWEL",

"WAGER","WAGON","WAIST","WALTZ","WASTE","WATER","WAVER","WEARY","WEIGH","WEIRD","WHACK","WHALE","WHEAT","WHILE","WHINE","WHIRL","WHISK","WHITE","WHOLE","WHOSE","WIDEN","WIDTH","WINCE","WINDY","WITTY","WOMAN","WORRY","WORSE","WORST","WORTH","WORLD","WOOZY","WOUND","WOVEN","WRITE","WRIST","WROTE","WRONG","WRUNG",

"XENIA","XENON","XYSTI",
// Y
"YACHT","YARNS","YAWNS","YEARN","YEAST","YELLS","YIELD","YIKES","YODEL","YOKEL","YOUNG","YOURS","YOUTH","YOWLS","YUMMY",
// Z
"ZAPPY","ZEBRA","ZEBUS","ZESTS","ZESTY","ZILCH","ZINGY","ZINGS","ZIPPER","ZIPPY","ZONAL","ZONED","ZONES","ZONER","ZORRO"
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
