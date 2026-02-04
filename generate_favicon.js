const fs = require('fs');
const path = require('path');

// Ensure assets directory exists
const assetsDir = path.join(__dirname, 'src/assets');
const inputFile = path.join(assetsDir, 'logo_custom.jpg');
const outputFile = path.join(assetsDir, 'logo_custom_circle.svg');

try {
    console.log('Reading input file:', inputFile);
    if (!fs.existsSync(inputFile)) {
        console.error('Input file not found!');
        process.exit(1);
    }

    const img = fs.readFileSync(inputFile, 'base64');
    console.log('Image read successfully. Size:', img.length);

    const svg = `<svg width="100" height="100" viewBox="0 0 100 100" xmlns="http://www.w3.org/2000/svg">
  <defs>
    <clipPath id="circle">
      <circle cx="50" cy="50" r="50"/>
    </clipPath>
  </defs>
  <image href="data:image/jpeg;base64,${img}" width="100" height="100" preserveAspectRatio="xMidYMid slice" clip-path="url(#circle)"/>
</svg>`;

    fs.writeFileSync(outputFile, svg);
    console.log('SVG written to:', outputFile);
} catch (error) {
    console.error('Error generating SVG:', error);
    process.exit(1);
}
