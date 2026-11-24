const stimuli = [
  { id: "S01", russian: "Гриб", audio: "гриб.m4a" },
  { id: "S02", russian: "Грипп", audio: "грип.m4a" },
  { id: "S03", russian: "Род", audio: "род.m4a" },
  { id: "S04", russian: "Рот", audio: "рот.m4a" },
  { id: "S05", russian: "Игра", audio: "игра.m4a" },
  { id: "S06", russian: "В игре", audio: "в_игре.m4a" },
  { id: "S07", russian: "Игорь", audio: "игорь.m4a" },
  { id: "S08", russian: "Об Игоре", audio: "об_игоре.m4a" },
  { id: "S09", russian: "Индия", audio: "индия.m4a" },
  { id: "S10", russian: "В Индии", audio: "в_иднии.m4a" },
  { id: "S11", russian: "Импорт", audio: "импорт.m4a" },
  { id: "S12", russian: "Об импорте", audio: "об_импорте.m4a" },
  { id: "S13", russian: "Враг", audio: "враг.m4a" },
  { id: "S14", russian: "Глаз", audio: "глаз.m4a" },
  { id: "S15", russian: "Институт", audio: "институт.m4a" },
  { id: "S16", russian: "В институте", audio: "в_институт.m4a" },
  { id: "S17", russian: "К Ире", audio: "к_ире.m4a" },
  { id: "S18", russian: "Кире", audio: "кире.m4a" },
  { id: "S19", russian: "Маршрут", audio: "маршрут.m4a" },
  { id: "S20", russian: "Мороз", audio: "мороз.m4a" },
  { id: "S21", russian: "На повторе", audio: "на_повторе.m4a" },
  { id: "S22", russian: "Ржавчина", audio: "ржавчина.m4a" },
  { id: "S23", russian: "Встречаемый", audio: "встречаемый.m4a" },
  { id: "S24", russian: "Защищающийся", audio: "защищающийся.m4a" },
  { id: "S25", russian: "Лез", audio: "лез.m4a" },
  { id: "S26", russian: "Лес", audio: "лес.m4a" },
  { id: "S27", russian: "Луг", audio: "луг.m4a" },
  { id: "S28", russian: "Лук", audio: "лук.m4a" }
];

const $ = (id) => document.getElementById(id);
const setup = $("setup-screen");
const runner = $("runner-screen");
const complete = $("complete-screen");
const audioRevision = "native-recordings-20261124-v3";
const instructions = {
  orthography: "Say the item aloud once at a natural pace, then select Next.",
  audio: "Press Play. After the recording finishes, repeat the item aloud once at a natural pace, then select Next."
};

// The same two fixed lists are used throughout the session. The first list
// receives text before audio; the second receives audio before text. The lists
// are deliberately balanced for baseline /i/ and hard-consonant /i/ contexts.
const byId = (id) => stimuli.find((item) => item.id === id);
const textThenAudio = [
  "S01", "S04", "S05", "S08", "S09", "S12",
  "S14", "S15", "S17", "S20", "S21", "S24", "S25", "S28"
].map(byId);
const textThenAudioSecondPresentation = [
  "S20", "S15", "S25", "S01", "S24", "S17", "S12",
  "S28", "S21", "S05", "S14", "S09", "S04", "S08"
].map(byId);
const audioThenText = [
  "S02", "S03", "S06", "S07", "S10", "S11",
  "S13", "S16", "S18", "S19", "S22", "S23", "S26", "S27"
].map(byId);
const audioThenTextSecondPresentation = [
  "S16", "S26", "S02", "S13", "S27", "S07", "S23",
  "S10", "S03", "S18", "S06", "S22", "S11", "S19"
].map(byId);

let blocks = [];
let currentBlock = 0;
let currentTrial = 0;
let currentAudio = null;
let audioFinished = false;

function start() {
  blocks = [
    { part: 1, sequence: "text-then-audio", type: "orthography", items: [...textThenAudio] },
    { part: 2, sequence: "text-then-audio", type: "audio", items: [...textThenAudioSecondPresentation] },
    { part: 3, sequence: "audio-then-text", type: "audio", items: [...audioThenText] },
    { part: 4, sequence: "audio-then-text", type: "orthography", items: [...audioThenTextSecondPresentation] }
  ];
  currentBlock = 0;
  currentTrial = 0;
  setup.classList.add("hidden");
  runner.classList.remove("hidden");
  renderTrial();
}

function current() {
  return blocks[currentBlock].items[currentTrial];
}

function stopAudio() {
  if (currentAudio) {
    currentAudio.pause();
    currentAudio.currentTime = 0;
    currentAudio = null;
  }
}

function setNextEnabled(enabled) {
  $("next-button").disabled = !enabled;
  $("next-button").setAttribute("aria-disabled", String(!enabled));
}

function renderTrial() {
  stopAudio();
  audioFinished = false;
  const block = blocks[currentBlock];
  const item = current();
  const type = block.type;
  $("stage-label").textContent = `Stage ${currentBlock + 1} of ${blocks.length}`;
  $("counter").textContent = `${currentTrial + 1} / ${block.items.length}`;
  $("progress-bar").style.width = `${((currentTrial + 1) / block.items.length) * 100}%`;
  $("instruction").textContent = instructions[type];
  $("prompt").textContent = item.russian;
  $("prompt").classList.toggle("hidden", type === "audio");
  $("audio-controls").classList.toggle("hidden", type !== "audio");
  $("audio-status").textContent = type === "audio" ? "Press Play to hear the item." : "";
  $("next-button").textContent = "Next";
  setNextEnabled(type !== "audio");
}

function next() {
  const block = blocks[currentBlock];
  if (block.type === "audio" && !audioFinished) return;
  if (currentTrial < block.items.length - 1) {
    currentTrial += 1;
    renderTrial();
    return;
  }
  if (currentBlock < blocks.length - 1) {
    currentBlock += 1;
    currentTrial = 0;
    renderTrial();
    return;
  }
  runner.classList.add("hidden");
  complete.classList.remove("hidden");
  $("completion-summary").textContent = "All items are complete.";
}

function playCurrentAudio() {
  const item = current();
  stopAudio();
  setNextEnabled(false);
  currentAudio = new Audio(`audio/${item.audio}?rev=${audioRevision}`);
  $("audio-status").textContent = "Loading recording…";
  currentAudio.addEventListener("canplay", () => {
    $("audio-status").textContent = "Playing. Repeat after it finishes.";
  }, { once: true });
  currentAudio.addEventListener("ended", () => {
    audioFinished = true;
    $("audio-status").textContent = "Now repeat the item aloud once, then select Next.";
    setNextEnabled(true);
  });
  currentAudio.addEventListener("error", () => {
    $("audio-status").textContent = `This recording could not be found: audio/${item.audio}`;
  }, { once: true });
  currentAudio.play().catch(() => {
    $("audio-status").textContent = "The recording could not play. Reload the page and try again.";
  });
}

$("begin-button").addEventListener("click", start);
$("next-button").addEventListener("click", next);
$("play-audio").addEventListener("click", playCurrentAudio);
$("restart-button").addEventListener("click", () => {
  complete.classList.add("hidden");
  setup.classList.remove("hidden");
});
