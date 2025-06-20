const fs = require("fs");
const path = require("path");

exports.handler = async function(event) {
  try {
    const { image, url } = JSON.parse(event.body);
    if (!image || !url) {
      return { statusCode: 400, body: "Missing image or URL." };
    }

    const id = Date.now().toString();
    const filename = `preview-${id}.html`;
    const previewsDir = path.join(__dirname, "../../previews");

    if (!fs.existsSync(previewsDir)) fs.mkdirSync(previewsDir, { recursive: true });

    const html = `
<!DOCTYPE html>
<html>
<head>
  <meta charset="UTF-8">
  <meta property="og:title" content="Watch Now!" />
  <meta property="og:description" content="Tap to see full content!" />
  <meta property="og:image" content="${image}" />
  <meta property="og:url" content="${url}" />
  <meta property="og:type" content="website" />
  <meta http-equiv="refresh" content="0; url=${url}" />
  <title>Redirecting...</title>
</head>
<body style="margin:0">
  <a href="${url}"><img src="${image}" style="width:100%;height:auto;" /></a>
</body>
</html>
`;

    const filePath = path.join(previewsDir, filename);
    fs.writeFileSync(filePath, html);

    return {
      statusCode: 200,
      body: JSON.stringify({
        preview: \`https://${process.env.URL || "yoursite.netlify.app"}/previews/\${filename}\`
      })
    };
  } catch (error) {
    return { statusCode: 500, body: JSON.stringify({ error: error.message }) };
  }
};
