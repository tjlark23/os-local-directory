const XLSX = require('xlsx');
const path = require('path');

const file = path.join('C:', 'Users', 'tjlar', 'Downloads', 'Leander General Restaurants + Photos_FIXED.xlsx');
console.log('Trying to read:', file);

try {
  const workbook = XLSX.readFile(file);
  const sheet = workbook.Sheets[workbook.SheetNames[0]];
  const data = XLSX.utils.sheet_to_json(sheet);

  console.log('Rows:', data.length);
  console.log('Columns:', Object.keys(data[0]).slice(0, 20));
  console.log('\nFirst row name:', data[0].name);

  // Check for photo columns
  const photoKeys = Object.keys(data[0]).filter(k => k.includes('Photo'));
  console.log('\nPhoto columns found:', photoKeys.length);
  console.log('First 5 photo columns:', photoKeys.slice(0, 5));

  // Check first row photos
  let photoCount = 0;
  for (let i = 1; i <= 60; i++) {
    const url = data[0][`Photo_${i}_URL`];
    if (url && typeof url === 'string' && url.startsWith('http')) {
      photoCount++;
    }
  }
  console.log('Photos for first business:', photoCount);

} catch (err) {
  console.log('Error:', err.message);
}
