const fs = require("fs");
const path = require("path");

// Directory link variables
const dirArray = [
  "music/Fifty Sixty/",
  "music/Seventy/",
  "music/Eighty/",
  "music/Ninety/",
  "music/2000/",
  "music/Latest Hits/",
  "music/Country/",
  "music/Karaoke/",
  "music/Special Occasion/",
  "music/Christmas Song/",
];

// Variable to store the index number for the table
let index = 1;

// Directory access to load video using fs.readdir
function imgVideoLoader(dir, index, buttonLeftID, title) {
  fs.readdir(dir, (err, files) => {
    if (err) {
      console.error(err);
      return;
    }

    const filteredFiles = files.filter((filename) => {
      return (
        filename !== "." &&
        filename !== ".." &&
        filename !== ".DS_Store" &&
        /\.(mp4|m4v|mov|flv|ogv|webm|avchd|avi|mkv|wmv|mpg|mpeg)$/.test(
          filename
        )
      );
    });

    // Initialize an empty string for the section content
    let sectionContent = "";

    filteredFiles.forEach((filename) => {
      // Filename without extension
      const filenameNoExt = path.parse(filename).name;

      // Thumbnail, image and directory variables passed to queue_array_create
      const thumbnail = path.join(dir, "img", `${filenameNoExt}.jpg`);
      const img = `<img src="${thumbnail}" alt="${filename}">`;
      const dirLink = path.join(dir, filename);

      // Append the table HTML to the section content
      sectionContent += `<table onclick="javascript:queue_array_create('${filenameNoExt}', '${thumbnail}', '${dirLink}')">    
                          <th id="index">${index++}.</th>
                          <th>${img}</th>
                          <td>${filenameNoExt}</td>
                        </table>`;
    });

    // Display the category title, button-left ID, and section content
    console.log(
      `<section id="${buttonLeftID}">
        <h3>${title}</h3><br>
        ${sectionContent}
      </section>`
    );
  });
}

// a list of dictionaries of categories with array position, ID of "button-left" and title for the table
const categories = [
  { position: 0, key: "5060", value: "50's & 60's" },
  { position: 1, key: "70", value: "70's" },
  { position: 2, key: "80", value: "80's" },
  { position: 3, key: "90", value: "90's" },
  { position: 4, key: "2000", value: "2000's" },
  { position: 5, key: "LatestHits", value: "Latest Hits" },
  { position: 6, key: "Country", value: "Country" },
  { position: 7, key: "Karaoke", value: "Karaoke" },
  { position: 8, key: "SpecialOccasion", value: "Special Occasion" },
  { position: 9, key: "ChristmasSong", value: "Christmas Song" },
];

// Load the video by directory
for (let category of categories) {
  imgVideoLoader(
    dirArray[category.position],
    index,
    category.key,
    category.value
  );
}
