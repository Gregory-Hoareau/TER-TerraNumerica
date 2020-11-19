
const { exec } = require('child_process');

const args = process.argv.slice(2)

const type = args.shift();
switch(type) {
    case 'service':
        if(args.length !== 1) {
            console.log(`Command "npm run generate service" takes 1 arg but receives ${args.length}.\nUse "npm run generate help" if you need help.`)
        }
        generateService(args.shift());
        break;
    case 'component':
        if(args.length !== 1) {
            console.log(`Command "npm run generate component" takes 1 arg but receives ${args.length}.\nUse "npm run generate help" if you need help.`)
        }
        generateComponent(args.shift());
        break;
    case 'class':
        if(args.length !== 1) {
            console.log(`Command "npm run generate class" takes 1 arg but receives ${args.length}.\nUse "npm run generate help" if you need help.`)
        }
        generateClass(args.shift());
        break;
    case 'interface':
        if(args.length !== 1) {
            console.log(`Command "npm run generate interface" takes 1 arg but receives ${args.length}.\nUse "npm run generate help" if you need help.`)
        }
        generateInterface(args.shift());
        break;
    case 'help':
        printDoc();
        break;
    default:
        console.log(`The type "${type}" is not handle by this command.`);
        break;
}

function generateService(name) {
    console.log(`> ng g service _services/${name}/${name}`);

    exec(`ng g service _services/${name}/${name}`, (error, stdout, stderr) => {
        if(error) {
            console.log(`error: ${error.message}`);
            return;
        }
        if(stderr) {
            console.log(`stderr: ${stderr}`)
            return;
        }
        console.log(`${stdout}`);
    })
}

function generateComponent(name) {
    console.log(`> ng g component components/${name}`)

    exec(`ng g component components/${name}`, (error, stdout, stderr) => {
        if(error) {
            console.log(`error: ${error.message}`);
            return;
        }
        if(stderr) {
            console.log(`stderr: ${stderr}`)
            return;
        }
        console.log(`${stdout}`);
    })
}

function generateClass(name) {
    console.log(`> ng g class models/${name}/${name}`)

    exec(`ng g class models/${name}/${name}`, (error, stdout, stderr) => {
        if(error) {
            console.log(`error: ${error.message}`);
            return;
        }
        if(stderr) {
            console.log(`stderr: ${stderr}`)
            return;
        }
        console.log(`${stdout}`);
    })
}

function generateInterface(name) {
    console.log(`> ng g class models/i-${name}`)

    exec(`ng g interface models/i-${name}`, (error, stdout, stderr) => {
        if(error) {
            console.log(`error: ${error.message}`);
            return;
        }
        if(stderr) {
            console.log(`stderr: ${stderr}`)
            return;
        }
        console.log(`${stdout}`);
    })
}

function printDoc() {
    let doc = '** DOC **\n\nNot made yet but coming soon ;)\n';
    console.log(`${doc}`);
}
