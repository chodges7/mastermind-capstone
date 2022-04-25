// Generic Variables
let w; // width of the canvas
let h; // height of the canvas

// Grid Variables
let columns; // columns in the game (how long the words will be)
let rows; // rows in the game (total amt of guesses)
let gridSize; // size of the grid boxes
let squareSize; // size of the letter boxes
let yOffset; // offset for pushing the grid up/down
let xOffset; // offset for pushing the grid left/right
let ymargin; // calculating the xmargin
let xMargin; // calculating the ymargin

// Colors
let gridColor; // color of the grid
let letterBlank; // color of the letter boxes when no letters have been used
let letterRight; // color of when a guessed letter is correct
let letterClose; // color of when a guessed letter is close
let letterWrong; // color of when a guessed letter is wrong
let btnStart; // color of menu start button
let btnGeneric; // color of generic button

// Menu variable
let menu;

// Button Variables
let BUTTON_HEIGHT;
let BUTTON_WIDTH;

// Letters array
let letterIndex;
let wordIndex;
let letters;
let jsonObj;
let guessesJSON;

// Regular expression for letters
const regex = /[A-Za-z]+/;

/* --------------------------- */
/* ----- P5.JS FUNCTIONS ----- */
/* --------------------------- */

function setup () {
    /* ----- Initialize variables -----*/
    // Generic variables
    w = windowWidth;
    h = windowHeight;

    // Grid Variables
    columns = 5;
    rows = 6;
    gridSize = 75;
    squareSize = 60;
    yOffset = 45;
    xOffset = 0;

    // Color variables
    gridColor = 50;
    letterBlank = 60;
    letterRight = color(19, 186, 65);
    letterClose = color(255, 159, 45);
    letterWrong = color(247, 65, 65);
    btnStart = color(42, 161, 151);
    btnGeneric = color(131, 148, 150);

    // Menu variable
    menu = 0;
    won = false;

    // Button Variables
    BUTTON_HEIGHT = 50;
    BUTTON_WIDTH = 100;

    // Letters array
    letterIndex = 0;
    wordIndex = 0;
    letters = [...new Array(rows)].map(() => new Array(columns));
    $.ajax({
        method: "GET",
        url: "/guess_entry",
        data: {
            game_id: gameId
        },
        dataType: 'json',
        success: function (data) {
            setupJSON(data)
        }
    });

    // Create the canvas we'll work on
    createCanvas(w, h);

    randomSeed(parseInt(gameId))
    goalWord = wordList["words"][floor(random(0, 2235))].toUpperCase()
    console.log(`Goal word is ${goalWord}`)
} // setup()

function draw () {
    if (menu === 0) {
        menuView();
    } 
    else if (menu === 1) {
        gameView();
    }
} // draw()

/* --------------------- */
/* ----- FUNCTIONS ----- */
/* --------------------- */

function addWord() {
    let word = "";
    for (let i = 0; i < columns; i++) {
        word += letters[wordIndex][i];
    }
    if ((guessesJSON["guesses"].length - 1) <= wordIndex) {
        guessesJSON["guesses"][wordIndex] = word;
    }
    else {
        guessesJSON["guesses"].push(word);
    }
    print(guessesJSON);
}

function ajaxPost(done) {
    if (done) {
        $.ajax({
            method: "POST",
            url: "/guess_entry",
            data: {
                game_id: gameId,
                guesses: JSON.stringify(guessesJSON),
                completed: "True"
            },
            dataType: 'json',
            success: function (data) {
                console.log(data);
            }
        });
    }
    else {
        $.ajax({
            method: "POST",
            url: "/guess_entry",
            data: {
                game_id: gameId,
                guesses: JSON.stringify(guessesJSON),
            },
            dataType: 'json',
            success: function (data) {
                console.log(data);
            }
        });
    }
}

function mouseClicked () {
    xLimit = BUTTON_WIDTH / 2;
    yLimit = BUTTON_HEIGHT / 2;

    // // log where the mouse is
    // console.log(mouseX + ", " + mouseY)
    // console.log("xLimit = " + xLimit)
    // console.log("yLimit = " + yLimit)
    // console.log("leftLimit = " + ((w/2) - xLimit) + " rightLimit = " + ((w/2) + xLimit))
    // console.log("upperLimit = " + ((h/2) - yLimit) + " rightLimit = " + ((h/2) + yLimit))

    // if we're on the base menu...
    if (menu === 0 && // ... and we're within the right x limits...
         mouseX > ((w/2) - xLimit) && mouseX < ((w/2) + xLimit)) {
        // ... and we're within the right y limits...
        if (mouseY > ((h/2) - yLimit) && mouseY < ((h/2) + yLimit)) {
        // ... then we've clicked a button!
            menu = 1;
        }
        if (mouseY > ((h/2 + 70) - yLimit) && mouseY < ((h/2 + 70) + yLimit)) {
            location.href = 'about';
        }
        else {
            menu = 0;
        }
    }
} // mouseClicked()

function failed() {
    if(!won){
        alert(`You lost! :( Goal word was: ${goalWord}`);
        setTimeout(() => {
            location.reload();
        }, 3500); // wait for 3 seconds
    }
} // failed()

function goalWordFill (i, j) {
    if (letters[j][i] === undefined || letters[j][i] === "" || j >= wordIndex) {
        fill(letterBlank);
    } 
    else if (goalWord.includes(letters[j][i])) {
        fill(letterClose);
        if (goalWord[i] === letters[j][i]) {
            fill(letterRight);
        }
    } 
    else {
        fill(letterWrong);
    }
} // goalWordFill()

function goalWordVerify () {
    win = true;
    for (let i = 0; i < columns; i++) {
        if (letters[wordIndex][i] !== goalWord[i]) {
            console.log(`${letters[wordIndex][i]} != ${goalWord[i]}`);
            win = false;
        }
    }

    if (win) {
        won = true;
        ajaxPost(true);
        alert(`You won!`);
        setTimeout(() => {
            location.reload();
        }, 3000); // wait for 3 seconds
    }
    else {
        ajaxPost(false);
    }
} // goalWordVerify()

function keyPressed() {
    const character = String.fromCodePoint(keyCode);
    if (menu !== 1) {
        return;
    }

    if (keyCode === BACKSPACE) {
        letterIndex--;
        if (letterIndex === -1) {
            letters[wordIndex][letterIndex + 1] = "";
            letterIndex++;
        } 
        else {
            letters[wordIndex][letterIndex] = "";
        }
        // console.log(letters);
    } else if (keyCode === ENTER) {
        if (letterIndex !== 0 && letterIndex % columns === 0) {
            addWord();
            goalWordVerify();
            letterIndex = 0;
            wordIndex++;
            // wordIndex = (wordIndex + 1) % rows; // wrap the wordIndex on rows
            if (wordIndex >= rows) {
                ajaxPost(true);
                failed();
            }
        }
    }
    // if not backspace or enter check for character
    else if (regex.test(character)) {
        letters[wordIndex][letterIndex] = character;
        // letterIndex = (letterIndex + 1) % columns;
        if (letterIndex < columns) {
            letterIndex++;
        }
    } 
    else {
        console.log(`Bad key: ${character}`);
    }
} // keyPressed()

function setupJSON(data) {
    // Now that we have backend data, we need to parse it
    // Sometimes, it's a string and sometimes it's an object
    // If it's a string...
    if (typeof(data[0][0]) === "string") {
        // ... use JSON.parse()
        guessesJSON = JSON.parse(data[0][0]);
    }
    else {
        // ... else just assgin it
        guessesJSON = data[0][0];
    }

    // For every word in guesses...
    for (let i = 0; i < guessesJSON["guesses"].length; i++) {
        // ... ,assuing it's not "default", ...
        if (guessesJSON["guesses"][i] === "default") {
            wordIndex = i;
            guessesJSON["guesses"][i] = "";
            break;
        }
        // ... set the new wordIndex, and sync the letters array
        wordIndex = i + 1;
        for (let j = 0; j < columns; j++) {
            letters[i][j] = guessesJSON["guesses"][i][j];
        } // for each letter
    } // for each word in guessesJSON

    // Do a log about where we're starting
    console.log(`starting game @ ${wordIndex}`)
}

function windowResized() {
    resizeCanvas(windowWidth, windowHeight, true);
    w = windowWidth;
    h = windowHeight;
} // windowResized()

/* ----------------- */
/* ----- MENUS ----- */
/* ----------------- */

function gameView () {
    background(60);

    /* ----- Draw the logo ----- */
    rectMode(CENTER);
    textSize(75);
    fill(12);
    text("Mastermind", w / 2, (h / 2) - 250, BUTTON_WIDTH * 3, BUTTON_HEIGHT * 2);

    /* ----- Draw the grid and letter boxes ----- */
    rectMode(CORNER);
    yMargin = ((h - (rows * gridSize)) / 2) + yOffset;
    xMargin = ((w - (columns * gridSize)) / 2) + xOffset;

    // for each box in the grid...
    for (let i = 0; i < columns; i++) {
        for (let j = 0; j < rows; j++) {
            // ...set the xPos and yPos for the letters
            const xPos = (i * gridSize) + xMargin + ((gridSize - squareSize) / 2);
            const yPos = (j * gridSize) + yMargin + ((gridSize - squareSize) / 2);

            // ...set the gridxPos and gridyPos for this gridBoxes
            const gridxPos = (i * gridSize) + xMargin;
            const gridyPos = (j * gridSize) + yMargin;

            // ...create the two boxes in the grid
            fill(gridColor);
            square(gridxPos, gridyPos, gridSize, 4);

            goalWordFill(i, j);

            square(xPos, yPos, squareSize, 10);
            fill(0);
            textAlign(CENTER, CENTER);
            textSize(30);
            text(letters[j][i], xPos, yPos + (squareSize / 2) + 2, squareSize);
        }
    }
} // gameView()

function menuView () {
    background(60);

    /* ----- Draw the logo ----- */
    rectMode(CENTER);
    textSize(75);
    fill(12);
    text("Mastermind", w/2, (h/2)-100, BUTTON_WIDTH * 3, BUTTON_HEIGHT * 2);

    /* ----- Draw the Start button ----- */
    fill(btnStart);
    rect(w/2, h/2, BUTTON_WIDTH, BUTTON_HEIGHT, 10);
    rect(w/2, h/2 + 70, BUTTON_WIDTH, BUTTON_HEIGHT, 10);

    textFont("Georgia");
    textAlign(CENTER, CENTER);
    textSize(25);
    fill(0);
    text("Start", w/2, h/2, BUTTON_WIDTH, BUTTON_HEIGHT);

    text("About", w/2, h/2 + 70, BUTTON_WIDTH, BUTTON_HEIGHT)
} // menuView()

/* -------------------- */
/* ----- wordList ----- */
/* -------------------- */

const wordList = { "words": ["rebut", "humph", "awake", "blush", "focal", "evade", "naval", "serve", "heath", "dwarf", "model", "karma", "stink", "grade", "quiet", "bench", "abate", "feign", "major", "death", "fresh", "crust", "stool", "colon", "abase", "marry", "react", "batty", "pride", "floss", "helix", "croak", "staff", "paper", "unfed", "whelp", "trawl", "outdo", "adobe", "crazy", "sower", "repay", "digit", "crate", "cluck", "spike", "mimic", "pound", "maxim", "linen", "unmet", "flesh", "forth", "first", "stand", "belly", "ivory", "seedy", "print", "yearn", "drain", "bribe", "stout", "panel", "crass", "flume", "offal", "agree", "error", "swirl", "argue", "bleed", "delta", "flick", "totem", "wooer", "front", "shrub", "parry", "biome", "lapel", "start", "greet", "goner", "golem", "loopy", "round", "audit", "lying", "gamma", "labor", "islet", "civic", "forge", "corny", "moult", "basic", "salad", "agate", "spicy", "spray", "essay", "fjord", "spend", "kebab", "guild", "aback", "motor", "alone", "hatch", "hyper", "thumb", "dowry", "ought", "belch", "dutch", "pilot", "tweed", "comet", "jaunt", "steed", "abyss", "growl", "fling", "dozen", "erode", "world", "gouge", "click", "briar", "great", "altar", "pulpy", "blurt", "coast", "duchy", "fixer", "group", "rogue", "badly", "smart", "pithy", "gaudy", "chill", "heron", "finer", "surer", "radio", "rouge", "perch", "retch", "wrote", "clock", "tilde", "store", "prove", "bring", "solve", "cheat", "grime", "exult", "usher", "epoch", "triad", "break", "rhino", "viral", "conic", "masse", "sonic", "vital", "trace", "using", "peach", "champ", "baton", "brake", "pluck", "craze", "gripe", "weary", "picky", "acute", "ferry", "aside", "tapir", "troll", "unify", "rebus", "boost", "truss", "siege", "tiger", "banal", "slump", "crank", "gorge", "query", "drink", "favor", "abbey", "tangy", "panic", "solar", "shire", "proxy", "point", "robot", "wince", "crimp", "knoll", "sugar", "whack", "mount", "perky", "could", "wrung", "light", "those", "shard", "pleat", "aloft", "skill", "elder", "frame", "humor", "pause", "ulcer", "ultra", "robin", "cynic", "aroma", "caulk", "shake", "dodge", "swill", "tacit", "other", "thorn", "trove", "bloke", "vivid", "spill", "chant", "choke", "nasty", "mourn", "ahead", "brine", "cloth", "hoard", "sweet", "month", "lapse", "watch", "today", "focus", "smelt", "tease", "cater", "movie", "saute", "allow", "renew", "their", "slosh", "purge", "chest", "depot", "epoxy", "found", "shall", "harry", "stove", "lowly", "snout", "trope", "fewer", "shawl", "natal", "comma", "foray", "scare", "stair", "black", "squad", "royal", "chunk", "mince", "shame", "ample", "flair", "foyer", "cargo", "oxide", "plant", "olive", "inert", "askew", "heist", "shown", "zesty", "hasty", "trash", "fella", "larva", "forgo", "story", "hairy", "train", "homer", "badge", "midst", "canny", "slung", "metal", "yield", "delve", "being", "scour", "glass", "gamer", "scrap", "money", "hinge", "album", "vouch", "asset", "tiara", "crept", "bayou", "atoll", "manor", "creak", "showy", "phase", "froth", "depth", "gloom", "flood", "trait", "girth", "piety", "payer", "goose", "float", "donor", "atone", "primo", "apron", "blown", "cacao", "loser", "input", "gloat", "awful", "brink", "smite", "beady", "rusty", "retro", "droll", "gawky", "hutch", "pinto", "gaily", "egret", "lilac", "sever", "field", "fluff", "hydro", "flack", "agape", "voice", "stead", "stalk", "berth", "madam", "night", "bland", "liver", "wedge", "augur", "roomy", "wacky", "flock", "angry", "bobby", "trite", "aphid", "midge", "power", "elope", "cinch", "motto", "stomp", "upset", "bluff", "cramp", "quart", "coyly", "youth", "rhyme", "buggy", "alien", "smear", "unfit", "patty", "cling", "glean", "label", "hunky", "khaki", "poker", "gruel", "twice", "twang", "shrug", "treat", "unlit", "waste", "merit", "woven", "octal", "needy", "clown", "widow", "irony", "ruder", "gauze", "chief", "onset", "prize", "fungi", "charm", "gully", "inter", "whoop", "taunt", "leery", "class", "theme", "lofty", "tibia", "alpha", "thyme", "eclat", "doubt", "parer", "chute", "stick", "trice", "alike", "sooth", "recap", "saint", "liege", "glory", "grate", "admit", "brisk", "soggy", "usurp", "scald", "scorn", "leave", "twine", "sting", "bough", "marsh", "sloth", "dandy", "vigor", "howdy", "enjoy", "valid", "ionic", "equal", "unset", "floor", "catch", "spade", "exist", "quirk", "denim", "grove", "spiel", "mummy", "fault", "foggy", "flout", "carry", "sneak", "libel", "waltz", "aptly", "piney", "inept", "aloud", "photo", "dream", "stale", "vomit", "ombre", "unite", "snarl", "baker", "there", "glyph", "pooch", "hippy", "spell", "folly", "louse", "gulch", "vault", "godly", "threw", "fleet", "grave", "inane", "shock", "crave", "spite", "valve", "skimp", "claim", "rainy", "musty", "pique", "quasi", "arise", "aging", "valet", "avert", "stuck", "recut", "mulch", "genre", "plume", "rifle", "count", "incur", "total", "wrest", "mocha", "deter", "study", "safer", "rivet", "funny", "smoke", "mound", "undue", "sedan", "swine", "guile", "gusty", "equip", "tough", "canoe", "chaos", "covet", "human", "udder", "lunch", "blast", "stray", "manga", "melee", "lefty", "quick", "paste", "given", "octet", "risen", "groan", "leaky", "grind", "carve", "loose", "sadly", "spilt", "apple", "slack", "honey", "final", "sheen", "eerie", "minty", "slick", "derby", "wharf", "spelt", "coach", "erupt", "singe", "price", "spawn", "fairy", "jiffy", "filmy", "stack", "chose", "sleep", "ardor", "nanny", "niece", "woozy", "handy", "grace", "ditto", "stank", "cream", "usual", "diode", "valor", "angle", "ninja", "muddy", "chase", "reply", "prone", "spoil", "heart", "shade", "diner", "arson", "sleet", "dowel", "couch", "palsy", "bowel", "smile", "evoke", "creek", "lance", "eagle", "idiot", "siren", "built", "embed", "award", "dross", "annul", "goody", "frown", "patio", "laden", "humid", "elite", "lymph", "edify", "might", "reset", "visit", "gusto", "purse", "vapor", "crock", "write", "sunny", "loath", "chaff", "slide", "venom", "stamp", "sorry", "still", "acorn", "aping", "pushy", "tamer", "hater", "mania", "awoke", "brawn", "swift", "exile", "birch", "lucky", "freer", "risky", "ghost", "plier", "lunar", "winch", "snare", "nurse", "house", "borax", "nicer", "lurch", "exalt", "about", "savvy", "toxin", "tunic", "pried", "inlay", "chump", "lanky", "cress", "eater", "elude", "cycle", "kitty", "boule", "moron", "tenet", "place", "lobby", "plush", "vigil", "index", "blink", "clung", "qualm", "croup", "clink", "juicy", "stage", "decay", "nerve", "flier", "shaft", "crook", "clean", "china", "ridge", "vowel", "gnome", "snuck", "icing", "spiny", "rigor", "snail", "flown", "rabid", "prose", "thank", "poppy", "budge", "fiber", "moldy", "dowdy", "kneel", "track", "caddy", "quell", "dumpy", "paler", "swore", "rebar", "scuba", "splat", "flyer", "mason", "doing", "ozone", "amply", "molar", "ovary", "beset", "queue", "cliff", "magic", "truce", "sport", "fritz", "edict", "twirl", "verse", "llama", "eaten", "range", "whisk", "hovel", "rehab", "macaw", "sigma", "spout", "verve", "sushi", "dying", "fetid", "brain", "buddy", "thump", "scion", "candy", "chord", "basin", "march", "crowd", "arbor", "gayly", "musky", "stain", "dally", "bless", "bravo", "stung", "title", "ruler", "kiosk", "blond", "ennui", "layer", "fluid", "tatty", "score", "cutie", "zebra", "barge", "matey", "bluer", "aider", "shook", "river", "privy", "betel", "frisk", "bongo", "begun", "azure", "weave", "genie", "sound", "glove", "braid", "scope", "wryly", "rover", "assay", "ocean", "bloom", "irate", "later", "woken", "silky", "wreck", "dwelt", "slate", "smack", "solid", "amaze", "hazel", "wrist", "jolly", "globe", "flint", "rouse", "civil", "vista", "relax", "cover", "alive", "beech", "jetty", "bliss", "vocal", "often", "dolly", "eight", "joker", "since", "event", "ensue", "shunt", "diver", "poser", "worst", "sweep", "alley", "creed", "anime", "leafy", "bosom", "dunce", "stare", "pudgy", "waive", "choir", "stood", "spoke", "outgo", "delay", "bilge", "ideal", "clasp", "seize", "hotly", "laugh", "sieve", "block", "meant", "grape", "noose", "hardy", "shied", "drawl", "daisy", "putty", "strut", "burnt", "tulip", "crick", "idyll", "furor", "geeky", "cough", "naive", "shoal", "stork", "bathe", "aunty", "check", "prime", "brass", "outer", "furry", "razor", "elect", "evict", "imply", "demur", "quota", "haven", "cavil", "swear", "crump", "dough", "gavel", "wagon", "salon", "nudge", "harem", "pitch", "sworn", "pupil", "excel", "stony", "cabin", "unzip", "queen", "trout", "polyp", "earth", "storm", "until", "taper", "enter", "child", "adopt", "minor", "husky", "brave", "filet", "slime", "glint", "tread", "steal", "regal", "guest", "every", "murky", "share", "spore", "hoist", "buxom", "inner", "otter", "dimly", "level", "sumac", "donut", "stilt", "arena", "sheet", "scrub", "fancy", "slimy", "pearl", "silly", "porch", "dingo", "sepia", "amble", "shady", "bread", "friar", "reign", "dairy", "quill", "cross", "brood", "tuber", "shear", "posit", "blank", "villa", "shank", "piggy", "freak", "which", "among", "shell", "would", "algae", "large", "rabbi", "agony", "amuse", "bushy", "copse", "knife", "pouch", "ascot", "plane", "crown", "urban", "snide", "relay", "abide", "viola", "rajah", "straw", "dilly", "crash", "amass", "third", "trick", "tutor", "woody", "blurb", "grief", "disco", "where", "sassy", "beach", "sauna", "comic", "clued", "creep", "caste", "graze", "frock", "prong", "lurid", "steel", "halve", "buyer", "vinyl", "utile", "smell", "adage", "worry", "tasty", "local", "trade", "finch", "ashen", "modal", "gaunt", "clove", "enact", "adorn", "roast", "speck", "sheik", "missy", "grunt", "snoop", "party", "touch", "mafia", "emcee", "array", "south", "vapid", "jelly", "skulk", "angst", "tubal", "lower", "crest", "sweat", "cyber", "adore", "tardy", "swami", "notch", "groom", "roach", "hitch", "young", "align", "ready", "frond", "strap", "puree", "realm", "venue", "swarm", "offer", "seven", "dryer", "diary", "dryly", "drank", "acrid", "heady", "theta", "junto", "pixie", "quoth", "bonus", "shalt", "penne", "amend", "datum", "build", "piano", "shelf", "lodge", "suing", "rearm", "coral", "ramen", "worth", "infer", "overt", "mayor", "ovoid", "glide", "usage", "poise", "chuck", "prank", "fishy", "tooth", "ether", "drove", "idler", "swath", "stint", "while", "begat", "apply", "slang", "tarot", "radar", "credo", "aware", "canon", "shift", "timer", "bylaw", "serum", "three", "steak", "iliac", "shirk", "blunt", "puppy", "penal", "joist", "bunny", "shape", "beget", "wheel", "adept", "stunt", "stole", "topaz", "chore", "fluke", "afoot", "bloat", "bully", "dense", "caper", "sneer", "boxer", "jumbo", "lunge", "space", "avail", "short", "slurp", "loyal", "pizza", "conch", "tempo", "droop", "plate", "plunk", "afoul", "savoy", "steep", "agile", "stake", "dwell", "knave", "beard", "arose", "motif", "smash", "broil", "glare", "shove", "baggy", "mammy", "swamp", "along", "rugby", "wager", "quack", "squat", "snaky", "debit", "mange", "skate", "ninth", "joust", "spurn", "medal", "micro", "rebel", "flank", "learn", "nadir", "maple", "comfy", "remit", "gruff", "ester", "least", "mogul", "fetch", "cause", "oaken", "aglow", "meaty", "gaffe", "shyly", "racer", "prowl", "thief", "stern", "poesy", "rocky", "tweet", "waist", "spire", "grope", "havoc", "patsy", "truly", "forty", "deity", "uncle", "swish", "giver", "preen", "bevel", "lemur", "draft", "slope", "annoy", "lingo", "bleak", "ditty", "curly", "cedar", "dirge", "grown", "horde", "drool", "shuck", "crypt", "cumin", "stock", "gravy", "locus", "wider", "breed", "quite", "chafe", "cache", "blimp", "deign", "fiend", "logic", "cheap", "elide", "rigid", "false", "renal", "pence", "rowdy", "shoot", "blaze", "envoy", "posse", "brief", "never", "abort", "mouse", "mucky", "sulky", "fiery", "media", "trunk", "yeast", "clear", "skunk", "scalp", "bitty", "cider", "koala", "duvet", "segue", "creme", "super", "grill", "after", "owner", "ember", "reach", "nobly", "empty", "speed", "gipsy", "recur", "smock", "dread", "merge", "burst", "kappa", "amity", "shaky", "hover", "carol", "snort", "synod", "faint", "haunt", "flour", "chair", "detox", "shrew", "tense", "plied", "quark", "burly", "novel", "waxen", "stoic", "jerky", "blitz", "beefy", "lyric", "towel", "quilt", "below", "bingo", "wispy", "brash", "scone", "toast", "easel", "saucy", "value", "spice", "honor", "route", "sharp", "bawdy", "radii", "skull", "phony", "issue", "swell", "trial", "flora", "upper", "latch", "wight", "brick", "retry", "holly", "decal", "grass", "shack", "dogma", "mover", "defer", "sober", "optic", "crier", "vying", "nomad", "flute", "hippo", "shark", "drier", "bugle", "tawny", "chalk", "feast", "ruddy", "pedal", "scarf", "cruel", "bleat", "tidal", "slush", "windy", "dusty", "sally", "igloo", "nerdy", "jewel", "shone", "whale", "fugue", "elbow", "crumb", "pansy", "welsh", "syrup", "terse", "suave", "gamut", "swung", "drake", "freed", "afire", "shirt", "grout", "oddly", "tithe", "plaid", "dummy", "broom", "blind", "torch", "enemy", "again", "tying", "pesky", "alter", "gazer", "noble", "ethos", "bride", "extol", "decor", "hobby", "beast", "idiom", "utter", "these", "sixth", "alarm", "erase", "elegy", "piper", "scaly", "scold", "chick", "sooty", "canal", "whiny", "slash", "quake", "joint", "swept", "heavy", "wield", "femme", "lasso", "maize", "shale", "screw", "spree", "smoky", "whiff", "scent", "glade", "spent", "prism", "stoke", "riper", "orbit", "cocoa", "guilt", "humus", "shush", "table", "smirk", "wrong", "noisy", "alert", "shiny", "elate", "resin", "whole", "hunch", "pixel", "polar", "hotel", "sword", "cleat", "mango", "rumba", "puffy", "filly", "billy", "leash", "clout", "dance", "ovate", "facet", "chili", "paint", "liner", "curio", "salty", "audio", "snake", "fable", "cloak", "navel", "spurt", "pesto", "balmy", "flash", "unwed", "early", "churn", "weedy", "stump", "lease", "witty", "wimpy", "spoof", "saner", "blend", "salsa", "thick", "warty", "manic", "blare", "squib", "spoon", "probe", "crepe", "knack", "force", "debut", "order", "haste", "teeth", "agent", "widen", "icily", "slice", "ingot", "clash", "juror", "blood", "abode", "throw", "unity", "pivot", "slept", "troop", "spare", "sewer", "parse", "morph", "cacti", "tacky", "spool", "demon", "moody", "annex", "begin", "fuzzy", "patch", "water", "lumpy", "admin", "omega", "limit", "tabby", "macho", "aisle", "skiff", "basis", "plank", "verge", "botch", "crawl", "lousy", "slain", "cubic", "raise", "wrack", "guide", "foist", "cameo", "under", "actor", "revue", "fraud", "harpy", "scoop", "climb", "refer", "olden", "clerk", "debar", "tally", "ethic", "cairn", "tulle", "ghoul", "hilly", "crude", "apart", "scale", "older", "plain", "briny", "abbot", "rerun", "quest", "crisp", "bound", "befit", "drawn", "suite", "itchy", "cheer", "bagel", "guess", "broad", "axiom", "chard", "caput", "leant", "harsh", "curse", "proud", "swing", "opine", "taste", "lupus", "gumbo", "miner", "green", "chasm", "lipid", "topic", "armor", "brush", "crane", "mural", "abled", "habit", "bossy", "maker", "dusky", "dizzy", "lithe", "brook", "jazzy", "fifty", "sense", "giant", "surly", "legal", "fatal", "flunk", "began", "prune", "small", "slant", "scoff", "torus", "ninny", "covey", "viper", "taken", "moral", "vogue", "owing", "token", "entry", "booth", "voter", "chide", "elfin", "ebony", "neigh", "minim", "melon", "kneed", "decoy", "voila", "ankle", "arrow", "mushy", "tribe", "cease", "eager", "birth", "graph", "odder", "terra", "weird", "tried", "clack", "color", "rough", "weigh", "uncut", "ladle", "strip", "craft", "minus", "dicey", "titan", "lucid", "vicar", "dress", "ditch", "pasta", "taffy", "flame", "swoop", "aloof", "sight", "broke", "teary", "chart", "sixty", "wordy", "sheer", "nosey", "savor", "clamp", "funky", "foamy", "toxic", "brand", "plumb", "dingy", "butte", "drill", "tripe", "bicep", "tenor", "krill", "worse", "drama", "hyena", "think", "ratio", "cobra", "basil", "scrum", "bused", "phone", "court", "camel", "proof", "heard", "angel", "petal", "pouty", "throb", "maybe", "fetal", "sprig", "spine", "shout", "cadet", "macro", "dodgy", "satyr", "rarer", "binge", "trend", "nutty", "leapt", "amiss", "split", "myrrh", "width", "sonar", "tower", "baron", "fever", "waver", "spark", "belie", "sloop", "expel", "smote", "baler", "above", "north", "wafer", "scant", "frill", "awash", "snack", "scowl", "frail", "drift", "limbo", "fence", "motel", "ounce", "wreak", "revel", "talon", "prior", "knelt", "cello", "flake", "debug", "anode", "crime", "salve", "scout", "imbue", "pinky", "stave", "vague", "chock", "fight", "video", "stone", "teach", "cleft", "frost", "prawn", "twist", "apnea", "stiff", "plaza", "ledge", "tweak", "board", "grant", "medic", "bacon", "cable", "brawl", "slunk", "raspy", "forum", "drone", "women", "mucus", "boast", "coven", "tumor", "truer", "wrath", "stall", "steam", "axial", "purer", "daily", "trail", "niche", "mealy", "juice", "nylon", "plump", "merry", "flail", "papal", "wheat", "berry", "cower", "brute", "leggy", "snipe", "sinew", "skier", "penny", "jumpy", "rally", "umbra", "scary", "modem", "gross", "avian", "greed", "tonic", "parka", "sniff", "livid", "stark", "giddy", "reuse", "taboo", "avoid", "quote", "liken", "gloss", "beret", "noise", "gland", "dealt", "sling", "rumor", "opera", "tonga", "flare", "wound", "white", "bulky", "etude", "horse", "circa", "paddy", "inbox", "fizzy", "grain", "exert", "surge", "gleam", "belle", "salvo", "crush", "fruit", "sappy", "taker", "tract", "ovine", "spiky", "frank", "reedy", "filth", "spasm", "heave", "mambo", "right", "clank", "trust", "lumen", "borne", "spook", "sauce", "amber", "lathe", "carat", "corer", "dirty", "slyly", "affix", "alloy", "sheep", "wooly", "mauve", "flung", "yacht", "fried", "quail", "brunt", "grimy", "cagey", "rinse", "state", "grasp", "milky", "bison", "graft", "sandy", "baste", "flask", "hedge", "swash", "boney", "coupe", "endow", "abhor", "welch", "blade", "tight", "geese", "miser", "mirth", "cloud", "cabal", "leech", "close", "tenth", "pecan", "droit", "grail", "clone", "guise", "ralph", "tango", "biddy", "smith", "mower", "payee", "serif", "drape", "fifth", "glaze", "allot", "truck", "kayak", "virus", "testy", "tepee", "fully", "zonal", "metro", "curry", "grand", "banjo", "axion", "bezel", "occur", "chain", "nasal", "gooey", "filer", "brace", "allay", "pubic", "raven", "plead", "gnash", "flaky", "munch", "dully", "eking", "thing", "slink", "hurry", "theft", "shorn", "pygmy", "ranch", "wring", "lemon", "shore", "mamma", "froze", "newer", "style", "moose", "antic", "drown", "vegan", "chess", "guppy", "union", "lever", "lorry", "image", "cabby", "druid", "exact", "truth", "dopey", "spear", "cried", "chime", "crony", "stunk", "timid", "batch", "gauge", "rotor", "curve", "latte", "witch", "bunch", "repel", "anvil", "soapy", "meter", "broth", "madly", "dried", "scene", "known", "magma", "roost", "woman", "punch", "pasty", "downy", "knead", "whirl", "rapid", "clang", "anger", "drive", "goofy", "email", "music", "stuff", "bleep", "rider", "mecca", "folio", "setup", "verso", "quash", "fauna", "gummy", "happy", "newly", "fussy", "relic", "guava", "ratty", "fudge", "femur", "chirp", "forte", "alibi", "whine", "petty", "golly", "plait", "fleck", "felon", "gourd", "brown", "thrum", "ficus", "stash", "decry", "wiser", "junta", "visor", "daunt", "scree", "impel", "await", "press", "whose", "turbo", "stoop", "speak", "mangy", "eying", "inlet", "crone", "pulse", "mossy", "staid", "hence", "pinch", "teddy", "sully", "snore", "ripen", "snowy", "attic", "going", "leach", "mouth", "hound", "clump", "tonal", "peril", "piece", "blame", "haute", "spied", "undid", "intro", "basal", "shine", "gecko", "rodeo", "guard", "steer", "loamy", "scamp", "scram", "hello", "vaunt", "organ", "feral", "knock", "extra", "condo", "adapt", "willy", "polka", "rayon", "skirt", "faith", "torso", "match", "mercy", "tepid", "sleek", "riser", "twixt", "peace", "flush", "catty", "login", "eject", "roger", "rival", "untie", "refit", "aorta", "adult", "judge", "rower", "artsy", "rural", "shave"] };
