// import { extractEntities } from './extractEntities';
import { extractEntities } from './extractEntities';

const args = process.argv;
const search = args.find((arg) => arg.includes('search='));

if (search) {
  const searchTerm = search.split('search=')[1];
  extractEntities(searchTerm).then(entities => {
    console.log(entities);
  }).catch(err => {
    console.error(err);
  });
} else {
  console.error('No search term provided. Please provide a search term using: search="[search term]"');
}

