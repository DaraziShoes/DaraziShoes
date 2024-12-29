// src/CommonFunction.js
export const convertToPreviewLink = (link) => {
    if (link.includes("/view")) {
      return link.replace("/view", "/preview");
    }
    return link;
  };
  