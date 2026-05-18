const fs = require('fs');

function replaceInFile(path, oldStr, newStr) {
  const content = fs.readFileSync(path, 'utf8');
  fs.writeFileSync(path, content.split(oldStr).join(newStr), 'utf8');
}

replaceInFile('src/pages/LandingPage.tsx', 'CampanhaPronta', 'Fotomax IA');
replaceInFile('src/pages/Dashboard.tsx', 'CampanhaPronta', 'Campanhas');
replaceInFile('src/pages/CampaignGenerator.tsx', 'CampanhaPronta', 'Campanhas');
replaceInFile('src/pages/CampaignDashboard.tsx', 'CampanhaPronta', 'Campanhas');
replaceInFile('src/constants.ts', 'CampanhaPronta', 'Campanhas');
console.log('Replaced texts!');
