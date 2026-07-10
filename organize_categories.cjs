const fs = require('fs');
const path = require('path');

const dataPath = path.join(__dirname, 'src', 'data', 'images.json');
const data = require(dataPath);

// 1. Merge wedding teasers into Wedding
if (data['wedding teasers']) {
  data.Wedding = [...(data.Wedding || []), ...data['wedding teasers']];
  delete data['wedding teasers'];
}

// 2. Merge corparate teasers into Corporate, and slice to balance
if (data['corparate teasers']) {
  // Let's keep 15 from Corporate to balance with 13 Wedding photos
  const slicedCorporate = (data.Corporate || []).slice(0, 15);
  data.Corporate = [...slicedCorporate, ...data['corparate teasers']];
  delete data['corparate teasers'];
}

// 3. Rename corprate photos to Events so the Events tab works!
if (data['corprate photos']) {
  data.Events = data['corprate photos'];
  delete data['corprate photos'];
}

fs.writeFileSync(dataPath, JSON.stringify(data, null, 2));
console.log('Successfully organized and balanced categories.');
console.log('Wedding:', data.Wedding?.length);
console.log('Corporate:', data.Corporate?.length);
console.log('Events:', data.Events?.length);
