import i18nfr from '~~/i18n/fr.js';
import i18nen from '~~/i18n/en.js';

export default (lang: string) => {
    console.log("i18nlog", i18nfr.positions, lang);
    const positionsOptions = lang === "fr" ? i18nfr.positions : i18nen.positions;
    return Object.keys(positionsOptions).map(key => {
        return {
          key: key,
          label: positionsOptions[key]
        };
    });
}