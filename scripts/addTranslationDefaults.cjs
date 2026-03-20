const fs = require("fs");
const path = require("path");

const projectRoot = process.cwd();
const srcDir = path.join(projectRoot, "src");
const enPath = path.join(srcDir, "locales", "en", "translation.json");

function readJson(filePath) {
  return JSON.parse(fs.readFileSync(filePath, "utf8"));
}

function getByDotPath(obj, dotPath) {
  return dotPath.split(".").reduce((acc, part) => {
    if (acc && Object.prototype.hasOwnProperty.call(acc, part)) {
      return acc[part];
    }
    return undefined;
  }, obj);
}

function humanizeKey(key) {
  const lastSegment = key.split(".").pop() || key;
  const cleaned = lastSegment
    .replace(/[_-]+/g, " ")
    .replace(/([a-z])([A-Z])/g, "$1 $2")
    .replace(/\s+/g, " ")
    .trim();

  if (!cleaned) return key;
  return cleaned.charAt(0).toUpperCase() + cleaned.slice(1);
}

function toDefaultText(key, enTranslations) {
  const enValue = getByDotPath(enTranslations, key);
  if (typeof enValue === "string" && enValue.trim()) {
    return enValue;
  }
  return humanizeKey(key);
}

function escapeForQuote(str, quote) {
  let escaped = str.replace(/\\/g, "\\\\");
  if (quote === '"') escaped = escaped.replace(/"/g, '\\"');
  if (quote === "'") escaped = escaped.replace(/'/g, "\\'");
  return escaped;
}

function getCodeFiles(dir) {
  const out = [];
  const stack = [dir];

  while (stack.length) {
    const current = stack.pop();
    const entries = fs.readdirSync(current, { withFileTypes: true });

    for (const entry of entries) {
      const fullPath = path.join(current, entry.name);
      if (entry.isDirectory()) {
        stack.push(fullPath);
      } else if (entry.isFile() && /\.(js|jsx|ts|tsx)$/.test(entry.name)) {
        out.push(fullPath);
      }
    }
  }

  return out;
}

function updateFile(filePath, enTranslations) {
  const original = fs.readFileSync(filePath, "utf8");
  const pattern = /(^|[^\w$.])(i18n\.)?t\(\s*(["'])((?:\\.|(?!\3).)*)\3\s*\)/gm;

  let count = 0;
  const updated = original.replace(pattern, (match, prefix, i18nPrefix, quote, key) => {
    const defaultText = toDefaultText(key, enTranslations);
    const escapedDefault = escapeForQuote(defaultText, quote);
    count += 1;
    return `${prefix}${i18nPrefix || ""}t(${quote}${key}${quote}, ${quote}${escapedDefault}${quote})`;
  });

  if (count > 0 && updated !== original) {
    fs.writeFileSync(filePath, updated, "utf8");
  }

  return count;
}

function main() {
  if (!fs.existsSync(enPath)) {
    throw new Error(`English translation file not found: ${enPath}`);
  }

  const enTranslations = readJson(enPath);
  const files = getCodeFiles(srcDir);

  let totalReplacements = 0;
  let touchedFiles = 0;

  for (const filePath of files) {
    const replacements = updateFile(filePath, enTranslations);
    if (replacements > 0) {
      touchedFiles += 1;
      totalReplacements += replacements;
    }
  }

  console.log(`Updated ${touchedFiles} files with ${totalReplacements} translation default fallback(s).`);
}

main();
