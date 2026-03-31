export default () => {

  const slugify = (text: string | undefined) => {
    return text ?
      text
        .toString()
        .toLowerCase()
        .normalize('NFD')
        .trim()
        .replace(/\s+/g, '-')
        .replace(/[^\w\-]+/g, '')
        .replace(/\-\-+/g, '-')
      : '';
  }
  return {
    slugify
  };
}