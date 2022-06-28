// const inquirer = require('inquirer');
import inquirer from 'inquirer'

const promptUser = () => {
  return inquirer.prompt([
    {
      type: 'input',
      name: 'name',
      message: 'Which Pokemon would you like to look up?'
    }
  ])
}

promptUser()
.then(pokemon => console.log(pokemon.name))