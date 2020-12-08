
const { exec } = require('child_process');

//Creation of cmd object
/**
 * Each cmd object contain 3 function : execute, argLengthError and doc
 * 
 * execute an array as argument. This function execute the cmd
 * argLengthError take 1 argument that represent the number of args pass to the cmd. This function return false if there's no length problem and true otherwise
 * doc print the doc of the command
 * 
 */
let serviceCmd = {
    execute: (args) => {
        const name = args.shift();
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
    },
    argLengthError: (actual) => {
        if(actual === 1) return false;
        console.log('ERROR in args length')
        console.log(`Command "npm run generate service" takes 1 arg but receives ${actual}.\nUse "npm run generate help" if you need help.\n`);
        return true;
    },
    doc: () => {
        const cmd = cmdForm(false, 'service');
        console.log('\t--Services generation--\n')
        console.log(`* Command => ${cmd}\n`)
        console.log('* Argument:\n\t<name> is the name of the service that will be generate.\n')
        console.log('* Description: This command generate the service\'s files (.ts and .spec.ts) in the folder src/app/_services/<name>.\n')
    }
}

let componentCmd = {
    execute: (args) => {
        const name = args.shift();
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
    },
    argLengthError: (actual) => {
        if(actual === 1) return false;
        console.log('ERROR in args length')
        console.log(`Command "npm run generate component" takes 1 arg but receives ${actual}.\nUse "npm run generate help" if you need help.\n`)
        return true;
    },
    doc: () => {
        const cmd = cmdForm(false, 'component');
        console.log('\t--Components generation--\n')
        console.log(`* Command => ${cmd}\n`)
        console.log('* Argument:\n\t<name> is the name of the component that will be generate.\n')
        console.log('* Description: This command generate the component\'s files (.ts, .spec.ts, .scss and .hmtl) in the folder src/app/components/<name>.\n')
    }
}

let classCmd = {
    execute: (args) => {
        const name = args.shift();
        const className = name.charAt(0).toUpperCase() + name.slice(1)
        console.log(`> ng g class models/${name}/${className}`)
        exec(`ng g class models/${name}/${className}`, (error, stdout, stderr) => {
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
    },
    argLengthError: (actual) => {
        if(actual === 1) return false;
        console.log('ERROR in args length')
        console.log(`Command "npm run generate class" takes 1 arg but receives ${actual}.\nUse "npm run generate help" if you need help.\n`)
        return true;
    },
    doc: () => {
        const cmd = cmdForm(false, 'class');
        console.log('\t--Classes generation--\n')
        console.log(`* Command => ${cmd}\n`)
        console.log('* Argument:\n\t<name> is the name of the class that will be generate.\n')
        console.log('* Description: This command generate the class\'s files (.ts and .spec.ts) in the folder src/app/models/<name>. The class name will be capitalise.\n')
    }
}

let interfaceCmd = {
    execute: (args) => {
        const name = args.shift();
        console.log(`> ng g class models/i-${name}`)
        exec(`ng g interface models/I${name}`, (error, stdout, stderr) => {
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
    },
    argLengthError: (actual) => {
        if(actual === 1) return false;
        console.log('ERROR in args length')
        console.log(`Command "npm run generate interface" takes 1 arg but receives ${actual}.\nUse "npm run generate help" if you need help.\n`)
        return true;
    },
    doc: () => {
        const cmd = cmdForm(false, 'interface');
        console.log('\t--Interfaces generation--\n')
        console.log(`* Command => ${cmd}\n`)
        console.log('* Argument:\n\t<name> is the name of the interface that will be generate.\n')
        console.log('* Description: This command generate the interface\'s file (.ts) in the folder src/app/models. The interface file name will be i<name>.ts and the interface name will be I<name>.\n')
    }
}

//Functions declaration
function printDoc() {
    //Creation of variable for the doc
    const allCmd = [serviceCmd, componentCmd, classCmd, interfaceCmd];

    //Printing the doc
    console.log('\t\t** DOC OF THE GENERATE COMMAND **\n');
    console.log(`The command "generate" can execute using either the complete form "${cmdForm()}" or the shorten form "${cmdForm(true)}"\n\n`)
    //console.log(`${doc}`)
    for(const c of allCmd) {
        c.doc();
        console.log('\n')
    }
}

function cmdForm(short = false, type = '<type>', arg='<name>') {
    const cmdPrefix = 'npm run'
    const cmdName = short? 'g': 'generate';
    return `${cmdPrefix} ${cmdName} ${type} ${arg}`
}

function prettyPrintArr(arr) {
    let pretty = '';
    for(let i=0; i<arr.length; i++) {
        pretty += `${arr[i]}`;
        if(i!== arr.length-1) pretty += ' ';
    }
    return pretty;
}

//Main code that is executed
const args = process.argv.slice(2)
const type = args.shift();
let cmd;
switch(type) {
    case 'service':
        cmd = serviceCmd;
        break;
    case 'component':
        cmd = componentCmd;
        break;
    case 'class':
        cmd = classCmd;
        break;
    case 'interface':
        cmd = interfaceCmd;
        break;
    case 'help':
        printDoc();
        return;
    default:
        console.log(`The type "${type}" is not handle by this command.`);
        return;
}

if(cmd.argLengthError(args.length)) return;
cmd.execute(args);


