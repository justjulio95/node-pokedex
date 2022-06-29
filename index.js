import inquirer from 'inquirer'
import axios from 'axios'
import { stat } from 'fs';

const baseURL = `https://pokeapi.co/api/v2/`

axios.get(baseURL + `pokemon/pidgeotto`).then(resp => {
  const data = resp.data;
  let typesName = []
  let statsInfo = []

  const name = data.name;
  console.log("==================================================================================================================")
  
  //getFlavorText(name);
  

  const id = data.id;
  const types = data.types;
  for (let i = 0; i < types.length; i++) {
    //console.log(types[i].type.name)
    typesName.push(types[i].type.name)
  }

  console.log(`${name[0].toUpperCase() + name.substring(1)}, the ${typesName} type Pokemon.`)

  const stats = data.stats
  for(let i = 0; i < stats.length; i++) {
    const stat_name = stats[i].stat.name
    const stat_score = stats[i].base_stat

    statsInfo.push({stat: stat_name, score: stat_score})
  }
  console.table(statsInfo)
})
.catch(function (error) {
  if (error.response) {
    console.log(error.response.data);
    console.log(error.response.status);
    console.log(error.response.headers);
  } else if (error.request) {
    console.log(error.request)
  } else {
    console.log('Error', error.message);
  }
  console.log(error.config);
})


// function getFlavorText(name) {
//   axios.get(baseURL + name).then(resp => {
//     const flavorText = resp.data.flavor_text_entries[0].flavor_text;
//     console.log(flavorText)
//   })
// }