import fs from "node:fs/promises";
import http from "node:http";
import open from "open";

export const interpolate = (html, data) => {
  // {{ notes }} -> data.notes
  return html.replace(/\{\{\s*(\w+)\s*\}\}/g, (match, placeholder) => {
    return data[placeholder] || "";
  });
};

export const formatNotes = (notes) => {
  return notes
    .map((note) => {
      return `
      <div class="note">
        <p>${note.content}</p>
        <div class="tags">
          ${note.tags.map((tag) => `<span class="tag">${tag}</span>`).join("")}
        </div>
      </div>
    `;
    })
    .join("\n");
};

export const createServer = (notes) => {
  return http.createServer(async (req, res) => {
    const HTML_PATH = new URL("./template.html", import.meta.url).pathname; //grab the html file (in the same directory as server.js)
    const template = await fs.readFile(HTML_PATH, "utf-8");
    const html = interpolate(template, { notes: formatNotes(notes) }); //interpolate the html file with the notes, to be shown to the user

    res.writeHead(200, { "Content-Type": "text/html" }); //set status and header at the same time
    res.end(html); //send the html
  });
};

// Start the server:
export const start = (notes, port) => {
  const server = createServer(notes);
  server.listen(port, () => {
    console.log(`Server is listening on port ${port}`);
  });
  open(`http://localhost:${port}`); //open that address on the browser
};
