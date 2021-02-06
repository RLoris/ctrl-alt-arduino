const SerialPort = require('serialport');
const Readline = require('@serialport/parser-readline');
const port = new SerialPort('COM3', { baudRate: 9600 });
const parser = port.pipe(new Readline({ delimiter: '\n' }));

port.on("open", () => {
    console.log('serial port open with arduino uno');
});
parser.on('data', data =>{
    console.log('arduino: ', data);
});

port.write('led\n', (err) => {
    if (err) {
        return console.log('Error on write: ', err.message);
    }
    console.log('message written');
});