/**
 * Sanitizes and cleans user display names, stripping accidental Java entity toString() artifacts
 * such as "com.krishiai.user.entity.User@76ddd639" or similar backend memory representations,
 * and neatly title-cases human names.
 */
export function formatFullName(name?: string, fallback = "Expert Candidate"): string {
  if (!name) return fallback;

  // 1. Strip Java package/class toString memory references
  const cleaned = name
    .replace(/\s*(?:com|org|io|net)\.[a-zA-Z0-9_.]*@[a-f0-9]+/gi, "")
    .replace(/\s*com\.krishiai[^\s]*/gi, "")
    .replace(/\s*[a-zA-Z0-9_.]*entity[a-zA-Z0-9_.]*@[a-f0-9]+/gi, "")
    .replace(/\s*[a-zA-Z0-9_.]*User@[a-f0-9]+/gi, "")
    .replace(/\s*@[a-f0-9]{6,}/gi, "")
    .trim();

  if (!cleaned) return fallback;

  // 2. Properly capitalize name words (e.g., "hari" -> "Hari", "hiyan jong rai" -> "Hiyan Jong Rai")
  return cleaned
    .split(/\s+/)
    .map((word) => {
      if (!word) return "";
      // Keep existing CamelCase or acronyms (e.g. "Dr." or "PhD") if already formatted
      if (word.length > 1 && word.slice(1) !== word.slice(1).toLowerCase() && word === word.toUpperCase()) {
        return word;
      }
      return word.charAt(0).toUpperCase() + word.slice(1).toLowerCase();
    })
    .join(" ");
}
