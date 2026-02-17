// Mock globals BEFORE requiring the module
global.window = {
  wordMappings: {},
};

// Mock chrome API
global.chrome = {
  storage: {
    sync: {
      get: jest.fn(),
      set: jest.fn(),
    },
  },
};

const { sanitizeText, DEFAULT_WORDS } = require("./popup");

// Re-assign default words to window for tests that need it
global.window.wordMappings = DEFAULT_WORDS;

describe("Text Sanitizer", () => {
  beforeEach(() => {
    // Reset window.wordMappings before each test to ensure clean state
    global.window.wordMappings = { ...DEFAULT_WORDS };
  });

  test("should sanitize simple restricted words", () => {
    const input = "Please contact me via email or phone.";
    const expected = "Please conta_ct me via ema_il or pho_ne.";
    expect(sanitizeText(input)).toBe(expected);
  });

  test("should preserve case for capitalized words", () => {
    const input = "Email me at support.";
    const expected = "Ema_il me at support.";
    expect(sanitizeText(input)).toBe(expected);
  });

  test("should preserve case for UPPERCASE words", () => {
    const input = "DO NOT CALL ME.";
    const expected = "DO NOT CA_LL ME.";
    expect(sanitizeText(input)).toBe(expected);
  });

  test("should handle MixedCase properly", () => {
    const input = "WhatsApp is popular.";
    const expected = "Wha_tsapp is popular.";
    expect(sanitizeText(input)).toBe(expected);
  });

  test("should return original text if no restricted words found", () => {
    const input = "Hello world, this is a safe sentence.";
    expect(sanitizeText(input)).toBe(input);
  });

  test("should handle empty input", () => {
    expect(sanitizeText("")).toBe("");
    expect(sanitizeText(null)).toBe(null);
    expect(sanitizeText(undefined)).toBe(undefined);
  });

  test("should handle words with regex special characters if any", () => {
    // Adding a test case for a custom mapping with special chars
    global.window.wordMappings["c++"] = "cpp";
    const input = "I love c++ coding.";
    const expected = "I love cpp coding.";
    expect(sanitizeText(input)).toBe(expected);
  });
});
