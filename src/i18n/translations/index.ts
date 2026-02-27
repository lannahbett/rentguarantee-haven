export { type Language, languageLabels, type TranslationKeys } from "./types";
export { en } from "./en";
export { pt } from "./pt";
export { es } from "./es";
export { hu } from "./hu";

import { Language, TranslationKeys } from "./types";
import { en } from "./en";
import { pt } from "./pt";
import { es } from "./es";
import { hu } from "./hu";

export const translations: Record<Language, TranslationKeys> = { en, pt, es, hu };
