import inquirer from 'inquirer'
import axios from 'axios'
import chalk from 'chalk'
import say from 'say'
const log = console.log;

const baseURL = `https://pokeapi.co/api/v2/`

// ask the user which pokemon they'd like to look up. 
const promptUser = () => {
  return inquirer.prompt([
    {
      type: 'input',
      message: 'Which Pokémon would you like to look up?',
      name: 'name'
    }
  ])
}

function getBasicInfo(name) {
  axios.get(baseURL + `pokemon/${name}`).then(resp => {
    const data = resp.data;
    let typesName = []
    let statsInfo = []

    const name = data.name;
    log(chalk.red("=================================================================================================================="))

    
    const types = data.types;
    for (let i = 0; i < types.length; i++) {
      typesName.push(types[i].type.name)
    }

    const speciesURL = data.species.url;
    getFlavorText(speciesURL)

    log(chalk.yellow(
      `${name[0].toUpperCase() + name.substring(1)}`) + ", the " + 
      chalk.underline.blueBright(`${typesName}`) + " type Pokémon.\n")
    
    say.speak(`${name[0].toUpperCase() + name.substring(1)}, the ${typesName} type Pokémon.`)

    const stats = data.stats
    for(let i = 0; i < stats.length; i++) {
      const stat_name = stats[i].stat.name
      const stat_score = stats[i].base_stat

      statsInfo.push({stat: stat_name, score: stat_score})
    }
    setTimeout(() => {console.table(statsInfo)}, 2000)
  })
  .catch(function (error) {
    if (error.response) {
      log('No pokemon with that name... ')
    }
  })
}


function getFlavorText(url) {
  axios.get(url).then(resp => {
    const evoChainURL = resp.data.evolution_chain.url
    getEvoChain(evoChainURL);

    const flavorTextArr = resp.data.flavor_text_entries;
    for (let i = 0; i < flavorTextArr.length; i++) {
      if (flavorTextArr[i].language.name === 'en') {
        const flavorText = flavorTextArr[i].flavor_text;
        const properText = flavorText.split('\n').join(' ').split('\f').join(' ')
        log(properText + '\n')
        break;
      }
    }
  })
  .catch(function (error) {
    if (error.response) {
      log(error.response.data);
      log(error.response.status);
      log(error.response.headers);
    } else if (error.request) {
      log(error.request)
    } else {
      log('Error', error.message);
    }
    log(error.config);
  })
}

function getEvoChain(url) {
  axios.get(url).then(resp => {
    let evo1;
    let evo2;
    let evo3;

    const evoChain = resp.data.chain;

    evo1 = evoChain.species.name;

    // check to see if there is ONLY a second evolution in the chain. 
    if (evoChain.evolves_to[0] !== undefined && evoChain.evolves_to[0].evolves_to[0] === undefined) {
      evo2 = evoChain.evolves_to[0].species.name;
      console.log(`${evo1} --> ${evo2}`)
    } 
    // Check to see if there is a third evolution in the chain. 
    else if (evoChain.evolves_to[0] !== undefined && evoChain.evolves_to[0].evolves_to[0] !== undefined) {

      evo2 = evoChain.evolves_to[0].species.name;
      evo3 = evoChain.evolves_to[0].evolves_to[0].species.name;

      console.log(`${evo1} --> ${evo2} --> ${evo3}`)
    }
    console.log(`${evo1} does not evolve.`)
  })
  .catch(function (error) {
    if (error.response) {
      log(error.response.data);
      log(error.response.status);
      log(error.response.headers);
    } else if (error.request) {
      log(error.request)
    } else {
      log('Error', error.message);
    }
    log(error.config);
  })
}

promptUser()
.then(pokemon => {
  getBasicInfo(pokemon.name);
})