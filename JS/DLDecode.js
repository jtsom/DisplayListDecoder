// @ts-check
function decode() {

    const modeMask = 0b00001111;
    const DLIMask = 0b10000000;
    const LMSMask = 0b01000000;
    const VScroll = 0b00100000;
    const HScroll = 0b00010000;
    const JVB = 0x41;
    const JMP = 0x01;

    let source = document.getElementById('d-list').value;
    let sourceByteChars = source.replaceAll(' ', '').replaceAll('\n', '').split(',');

    let sourceBytes = [];

    sourceByteChars.forEach(element => {
        if (element.startsWith('$')) {
            sourceBytes.push(parseInt(element.substring(1), 16));
        } else {
            sourceBytes.push(parseInt(element));
        }
    });

    document.getElementById('output').innerHTML = '';

    // Decode
    let pos = 0;
    let outputString = '';

    while (pos < sourceBytes.length) {
        let b = sourceBytes[pos];

        let mode = b & modeMask;
        let isDLI = (b & DLIMask) == DLIMask;
        let isLMS = (b & LMSMask) == LMSMask;
        let isHScroll = (b & HScroll) == HScroll && mode != 0;
        let isVScroll = (b & VScroll) == VScroll && mode != 0;
        let isJVB = b == JVB;
        let isJMP = b == JMP;
        let bLines = ((b & 0b01110000) >> 4) + 1;

        outputString += `${b.toString().padStart(3, ' ')}  \$${b.toString(16).padStart(2, '0')} : `;
        if (isJVB) {
            outputString += "JVB ";
            if (isDLI)
                outputString += "DLI ";
            let addr = sourceBytes[pos + 1] + sourceBytes[pos + 2] * 256;
            pos += 3;
            outputString += `\$${addr.toString(16).padStart(4, '0')} `;
            console.log(outputString);
            addToOutput(outputString);
            outputString = ''
            continue;
        }
        if (isJMP) {
            outputString += "JMP ";
            if (isDLI)
                outputString += "DLI ";
            let addr = sourceBytes[pos + 1] + sourceBytes[pos + 2] * 256;
            pos += 3;
            outputString += `\$${addr.toString(16).padStart(4, '0')} `;
            console.log(outputString);
            addToOutput(outputString);
            outputString = '';
            continue;
        }
        if (mode == 0)
            outputString += `${bLines} Blank lines `;
        if (isLMS && mode != 0) {
            outputString += "LMS ";
            let addr = sourceBytes[pos + 1] + sourceBytes[pos + 2] * 256;
            pos += 2;
            outputString += `\$${addr.toString(16).padStart(4, '0')} `;
        }
        if (isHScroll)
            outputString += "HSCROLL ";
        if (isVScroll)
            outputString += "VSCROLL ";
        if (isDLI)
            outputString += "DLI ";
        if (mode >= 2 && mode <= 7)
            outputString += `Text mode ${mode} `;
        if (mode >= 8 && mode <= 15)
            outputString += `Gr. mode ${mode} `;

        console.log(outputString);
        addToOutput(outputString);
        outputString = '';
        pos += 1;
    }

    // Output

}

function addToOutput(outputLine) {
    let node = document.createElement('div');
    node.innerText = outputLine;
    document.getElementById('output').appendChild(node);
}
