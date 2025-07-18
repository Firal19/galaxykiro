const fs = require('fs');
const path = require('path');

// Function to recursively find all .tsx files
function findTsxFiles(dir) {
  const files = [];
  const items = fs.readdirSync(dir);
  
  for (const item of items) {
    const fullPath = path.join(dir, item);
    const stat = fs.statSync(fullPath);
    
    if (stat.isDirectory() && !item.startsWith('.') && item !== 'node_modules') {
      files.push(...findTsxFiles(fullPath));
    } else if (item.endsWith('.tsx')) {
      files.push(fullPath);
    }
  }
  
  return files;
}

// Function to fix apostrophes in a file
function fixApostrophes(filePath) {
  let content = fs.readFileSync(filePath, 'utf8');
  let changed = false;
  
  // Common contractions to fix
  const contractions = {
    "I'm": "I am",
    "you're": "you are",
    "You're": "You are",
    "it's": "it is",
    "It's": "It is",
    "don't": "do not",
    "Don't": "Do not",
    "doesn't": "does not",
    "Doesn't": "Does not",
    "didn't": "did not",
    "Didn't": "Did not",
    "won't": "will not",
    "Won't": "Will not",
    "can't": "cannot",
    "Can't": "Cannot",
    "isn't": "is not",
    "Isn't": "Is not",
    "aren't": "are not",
    "Aren't": "Are not",
    "wasn't": "was not",
    "Wasn't": "Was not",
    "weren't": "were not",
    "Weren't": "Were not",
    "haven't": "have not",
    "Haven't": "Have not",
    "hasn't": "has not",
    "Hasn't": "Has not",
    "hadn't": "had not",
    "Hadn't": "Had not",
    "wouldn't": "would not",
    "Wouldn't": "Would not",
    "shouldn't": "should not",
    "Shouldn't": "Should not",
    "couldn't": "could not",
    "Couldn't": "Could not",
    "we're": "we are",
    "We're": "We are",
    "they're": "they are",
    "They're": "They are",
    "there's": "there is",
    "There's": "There is",
    "here's": "here is",
    "Here's": "Here is",
    "what's": "what is",
    "What's": "What is",
    "that's": "that is",
    "That's": "That is",
    "who's": "who is",
    "Who's": "Who is",
    "where's": "where is",
    "Where's": "Where is",
    "when's": "when is",
    "When's": "When is",
    "how's": "how is",
    "How's": "How is",
    "let's": "let us",
    "Let's": "Let us",
    "I've": "I have",
    "you've": "you have",
    "You've": "You have",
    "we've": "we have",
    "We've": "We have",
    "they've": "they have",
    "They've": "They have",
    "I'll": "I will",
    "you'll": "you will",
    "You'll": "You will",
    "we'll": "we will",
    "We'll": "We will",
    "they'll": "they will",
    "They'll": "They will",
    "he'll": "he will",
    "He'll": "He will",
    "she'll": "she will",
    "She'll": "She will",
    "it'll": "it will",
    "It'll": "It will"
  };
  
  // Fix contractions within strings
  for (const [contraction, expansion] of Object.entries(contractions)) {
    const regex = new RegExp(`(text:|placeholder:|description:)\\s*'([^']*?)${contraction.replace("'", "\\'")}([^']*?)'`, 'g');
    const newContent = content.replace(regex, (match, prefix, before, after) => {
      return `${prefix} '${before}${expansion}${after}'`;
    });
    if (newContent !== content) {
      content = newContent;
      changed = true;
    }
  }
  
  // Also fix within double quotes
  for (const [contraction, expansion] of Object.entries(contractions)) {
    const regex = new RegExp(`(text:|placeholder:|description:)\\s*"([^"]*?)${contraction.replace("'", "\\'")}([^"]*?)"`, 'g');
    const newContent = content.replace(regex, (match, prefix, before, after) => {
      return `${prefix} "${before}${expansion}${after}"`;
    });
    if (newContent !== content) {
      content = newContent;
      changed = true;
    }
  }
  
  if (changed) {
    fs.writeFileSync(filePath, content);
    console.log(`Fixed apostrophes in: ${filePath}`);
  }
}

// Main execution
const srcDir = path.join(__dirname, 'src');
const tsxFiles = findTsxFiles(srcDir);

console.log(`Found ${tsxFiles.length} .tsx files`);

for (const file of tsxFiles) {
  fixApostrophes(file);
}

console.log('Apostrophe fixing complete!');