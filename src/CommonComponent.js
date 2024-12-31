export const convertToPreviewLink = (link) => {
  if (link && typeof link === 'string' && link.includes("/view")) {
    return link.replace("/view", "/preview");
  }
  return link;
};
export const categories = [
    "Sports",
    "Football",
    "Sport Chic",
    "Formal",
    "Sandals",
    "Slipper",
    "Flip-flops",
  ];

export const genders = ["Men", "Women", "Kids"];