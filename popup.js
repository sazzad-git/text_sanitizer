// Default word mappings
const DEFAULT_WORDS = {
  email: "ema_il",
  gmail: "gma_il",
  whatsapp: "wha_tsapp",
  skype: "sky_pe",
  telegram: "tele_gram",
  discord: "dis_cord",
  phone: "pho_ne",
  mobile: "mobi_le",
  number: "num_ber",
  contact: "conta_ct",
  zoom: "zo_om",
  slack: "sla_ck",
  linkedin: "link_edin",
  facebook: "face_book",
  instagram: "inst_agram",
  twitter: "twit_ter",
  youtube: "yout_ube",
  tiktok: "tik_tok",
  snapchat: "snap_chat",
  pinterest: "pint_erest",
  reddit: "red_dit",
  tumblr: "tum_blr",
  meeting: "mee_ting",
  call: "ca_ll",
  "video call": "vid_eo c_all",
  "google meet": "g_meet",
  anydesk: "any_desk",
  teamviewer: "team_viewer",

  payment: "pa_yment",
  paypal: "p_ay_pal",
  pay: "p_ay",
  payoneer: "p_ay_oneer",
  crypto: "cry_pto",
  bitcoin: "bit_coin",
  wire: "wi_re",
  bank: "ba_nk",
  transfer: "trans_fer",
  cash: "ca_sh",
  invoice: "invo_ice",
  outside: "outsi_de",
  direct: "dire_ct",
  stripe: "str_ipe",
  fee: "f_ee",
  price: "pri_ce",
  cost: "co_st",
  billing: "bill_ing",

  homework: "home_work",
  assignment: "assign_ment",
  essay: "ess_ay",
  thesis: "the_sis",
  exam: "ex_am",
  test: "te_st",
  degree: "deg_ree",
  coursework: "course_work",
  academic: "acad_emic",

  review: "revi_ew",
  feedback: "feed_back",
  rating: "rat_ing",
  trustpilot: "trust_pilot",
  "google review": "google_rev",
  followers: "follo_wers",
  subscribers: "subs_cribers",
  "five star": "5_st_ar",
  positive: "posi_tive",
  recommendation: "recomm_end",

  password: "pass_word",
  login: "lo_gin",
  credential: "creden_tial",
  address: "addr_ess",
  location: "loca_tion",
  private: "pri_vate",
  access: "acc_ess",
  verification: "veri_fication",

  marketing_and_spam: {
    guaranteed: "guaran_teed",
    money: "mon_ey",
    income: "inco_me",
    profit: "pro_fit",
    fiverr: "fiv_err",
    order: "ord_er",
    cancel: "can_cel",
    refund: "refu_nd",
    portfolio: "port_folio",
    website: "web_site",
  },
};

// DOM elements
// DOM elements
let inputText,
  outputText,
  sanitizeBtn,
  copyBtn,
  customBtn,
  profileBtn,
  wordList,
  newWordInput,
  newReplacementInput,
  addWordBtn,
  tabButtons,
  tabContents;

if (typeof document !== "undefined") {
  inputText = document.getElementById("inputText");
  outputText = document.getElementById("outputText");
  sanitizeBtn = document.getElementById("sanitizeBtn");
  copyBtn = document.getElementById("copyBtn");
  customBtn = document.getElementById("customBtn");
  profileBtn = document.getElementById("profileBtn");
  wordList = document.getElementById("wordList");
  newWordInput = document.getElementById("newWord");
  newReplacementInput = document.getElementById("newReplacement");
  addWordBtn = document.getElementById("addWordBtn");
  tabButtons = document.querySelectorAll(".tab-btn");
  tabContents = document.querySelectorAll(".tab-content");
}

// Initialize extension
async function init() {
  await loadWordMappings();
  renderWordList();
  setupEventListeners();
}

// Load word mappings from storage
async function loadWordMappings() {
  return new Promise((resolve) => {
    chrome.storage.sync.get(["wordMappings"], (result) => {
      if (
        !result.wordMappings ||
        Object.keys(result.wordMappings).length === 0
      ) {
        // Initialize with default words
        chrome.storage.sync.set({ wordMappings: DEFAULT_WORDS }, () => {
          window.wordMappings = DEFAULT_WORDS;
          resolve();
        });
      } else {
        window.wordMappings = result.wordMappings;
        resolve();
      }
    });
  });
}

// Save word mappings to storage
function saveWordMappings() {
  chrome.storage.sync.set({ wordMappings: window.wordMappings }, () => {
    console.log("Word mappings saved");
  });
}

// Sanitize text by replacing restricted words
function sanitizeText(text) {
  if (!text || !window.wordMappings) {
    return text;
  }

  let sanitized = text;
  const words = Object.keys(window.wordMappings);

  // Sort words by length (longest first) to handle overlapping words correctly
  words.sort((a, b) => b.length - a.length);

  // Create a case-insensitive regex for each word
  words.forEach((word) => {
    const replacement = window.wordMappings[word];
    // Use word boundaries to match whole words only
    const regex = new RegExp(`\\b${escapeRegex(word)}\\b`, "gi");
    sanitized = sanitized.replace(regex, (match) => {
      // Preserve the original case pattern
      return preserveCase(match, replacement);
    });
  });

  return sanitized;
}

// Escape special regex characters
function escapeRegex(str) {
  return str.replace(/[.*+?^${}()|[\]\\]/g, "\\$&");
}

// Preserve the case pattern of the original word in the replacement
function preserveCase(original, replacement) {
  if (original === original.toLowerCase()) {
    return replacement.toLowerCase();
  } else if (original === original.toUpperCase()) {
    return replacement.toUpperCase();
  } else if (original[0] === original[0].toUpperCase()) {
    return (
      replacement.charAt(0).toUpperCase() + replacement.slice(1).toLowerCase()
    );
  }
  return replacement;
}

// Render the word list in the settings
function renderWordList() {
  if (!window.wordMappings) {
    return;
  }

  wordList.innerHTML = "";

  const words = Object.keys(window.wordMappings).sort();

  if (words.length === 0) {
    return; // CSS will handle empty state
  }

  words.forEach((word) => {
    const wordItem = document.createElement("div");
    wordItem.className = "word-item";

    wordItem.innerHTML = `
      <div class="word-item-content">
        <span class="word-item-original">${escapeHtml(word)}</span>
        <span class="word-item-arrow">→</span>
        <span class="word-item-replacement">${escapeHtml(window.wordMappings[word])}</span>
      </div>
      <button class="btn-delete" data-word="${escapeHtml(word)}">Delete</button>
    `;

    const deleteBtn = wordItem.querySelector(".btn-delete");
    deleteBtn.addEventListener("click", () => {
      deleteWord(word);
    });

    wordList.appendChild(wordItem);
  });
}

// Escape HTML to prevent XSS
function escapeHtml(text) {
  const div = document.createElement("div");
  div.textContent = text;
  return div.innerHTML;
}

// Add a new word mapping
function addWord() {
  const word = newWordInput.value.trim().toLowerCase();
  const replacement = newReplacementInput.value.trim();

  if (!word || !replacement) {
    alert("Please enter both word and replacement");
    return;
  }

  if (window.wordMappings[word]) {
    if (!confirm(`"${word}" already exists. Do you want to replace it?`)) {
      return;
    }
  }

  window.wordMappings[word] = replacement;
  saveWordMappings();
  renderWordList();

  // Clear inputs
  newWordInput.value = "";
  newReplacementInput.value = "";
  newWordInput.focus();
}

// Delete a word mapping
function deleteWord(word) {
  if (confirm(`Are you sure you want to delete "${word}"?`)) {
    delete window.wordMappings[word];
    saveWordMappings();
    renderWordList();
  }
}

// Copy output to clipboard
async function copyToClipboard() {
  const text = outputText.value;
  if (!text) {
    alert("No text to copy");
    return;
  }

  try {
    await navigator.clipboard.writeText(text);

    // Visual feedback
    const originalText = copyBtn.textContent;
    copyBtn.textContent = "Copied!";
    copyBtn.style.backgroundColor = "var(--accent-color)";

    setTimeout(() => {
      copyBtn.textContent = originalText;
      copyBtn.style.backgroundColor = "";
    }, 2000);
  } catch (err) {
    console.error("Failed to copy:", err);
    alert("Failed to copy to clipboard");
  }
}

// Setup event listeners
function setupEventListeners() {
  // Sanitize button
  sanitizeBtn.addEventListener("click", () => {
    const input = inputText.value;
    const sanitized = sanitizeText(input);
    outputText.value = sanitized;
  });

  // Copy button
  copyBtn.addEventListener("click", copyToClipboard);

  // Custom Greeting button
  customBtn.addEventListener("click", () => {
    const currentText = outputText.value;
    if (!currentText) {
      if (inputText.value) {
        // Auto-sanitize if input exists but output doesn't
        sanitizeBtn.click();
        setTimeout(() => customBtn.click(), 50);
        return;
      }
      alert("Please sanitize some text first!");
      return;
    }

    const separator = "===========================================\n";
    const greeting = separator + "Hello there,\nI hope you are doing well.\n\n";
    const closing = "\n\nThank you\n" + separator.trim();

    // Prevent double adding
    if (
      currentText.startsWith(separator + "Hello there,") &&
      currentText.endsWith("Thank you\n" + separator.trim())
    ) {
      return;
    }

    outputText.value = greeting + currentText + closing;
  });

  // Profile button
  profileBtn.addEventListener("click", () => {
    const currentText = outputText.value;
    const profileTemplate =
      "Profile:\nClient Name:\nOrder ID:\nQuality Check: \n\n\n";

    // Prevent double adding if starts with "Profile:"
    if (currentText.startsWith("Profile:")) {
      return;
    }

    // If there is existing text, prepend the template
    if (currentText) {
      outputText.value = profileTemplate + currentText;
    } else {
      outputText.value = profileTemplate;
    }
  });

  // Tab switching
  tabButtons.forEach((button) => {
    button.addEventListener("click", () => {
      const targetTab = button.getAttribute("data-tab");

      // Remove active class from all tabs and buttons
      tabButtons.forEach((btn) => btn.classList.remove("active"));
      tabContents.forEach((content) => content.classList.remove("active"));

      // Add active class to clicked button and corresponding content
      button.classList.add("active");
      const targetContent = document.getElementById(`${targetTab}Tab`);
      if (targetContent) {
        targetContent.classList.add("active");
      }
    });
  });

  // Add word button
  addWordBtn.addEventListener("click", addWord);

  // Allow Enter key to add word
  newWordInput.addEventListener("keypress", (e) => {
    if (e.key === "Enter") {
      newReplacementInput.focus();
    }
  });

  newReplacementInput.addEventListener("keypress", (e) => {
    if (e.key === "Enter") {
      addWord();
    }
  });

  // Auto-sanitize on input (optional - can be removed if too aggressive)
  // inputText.addEventListener('input', () => {
  //   const input = inputText.value;
  //   const sanitized = sanitizeText(input);
  //   outputText.value = sanitized;
  // });
}

// Initialize when DOM is ready
if (typeof document !== "undefined") {
  if (document.readyState === "loading") {
    document.addEventListener("DOMContentLoaded", init);
  } else {
    init();
  }
}

if (typeof module !== "undefined" && module.exports) {
  module.exports = { sanitizeText, DEFAULT_WORDS };
}
