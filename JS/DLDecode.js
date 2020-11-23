
function decode() {

    const modeMask = 0b00001111;
    const DLIMask = 0b10000000;
    const LMSMask = 0b01000000;
    const VScroll = 0b00100000;
    const HScroll = 0b00010000;
    const JVB = 0x41;
    const JMP = 0x01;

    let source = document.getElementById('d-list').value;

    if (source.substring(0, 1) === ',') {
        source = source.substring(1);
    }

    const sourceByteChars = source.replace(/\s/g, '').replace(',,', ',').split(',');

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

        const mode = b & modeMask;
        const isDLI = (b & DLIMask) == DLIMask;
        const isLMS = (b & LMSMask) == LMSMask;
        const isHScroll = (b & HScroll) == HScroll && mode != 0;
        const isVScroll = (b & VScroll) == VScroll && mode != 0;
        const isJVB = b == JVB;
        const isJMP = b == JMP;
        const bLines = ((b & 0b01110000) >> 4) + 1;

        outputString += `${b.toString().padStart(3, ' ')}  \$${b.toString(16).padStart(2, '0')} : `;
        if (isJVB) {
            outputString += "JVB ";
            if (isDLI)
                outputString += "DLI ";
            const addr = sourceBytes[pos + 1] + sourceBytes[pos + 2] * 256;
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
            const addr = sourceBytes[pos + 1] + sourceBytes[pos + 2] * 256;
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
            const addr = sourceBytes[pos + 1] + sourceBytes[pos + 2] * 256;
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
            outputString += `Text mode ${mode} ${anticToBasic(mode)}`;
        if (mode >= 8 && mode <= 15)
            outputString += `Gr. mode ${mode} ${anticToBasic(mode)}`;

        console.log(outputString);
        addToOutput(outputString);
        outputString = '';
        pos += 1;
    }

    // Output

}

function anticToBasic(mode) {
    let basicMode = '';
    switch (mode) {
        case 2:
            basicMode = '0';
            break;
        case 3:
            basicMode = 'none';
            break;
        case 4:
            basicMode = 'none (XL 12)';
            break;
        case 5:
            basicMode = 'none (XL 13)';
            break;
        case 6:
            basicMode = '1';
            break;
        case 7:
            basicMode = '2';
            break;
        case 8:
            basicMode = '3';
            break;
        case 9:
            basicMode = '4';
            break;
        case 10:
            basicMode = '5';
            break;
        case 11:
            basicMode = '6';
            break;
        case 12:
            basicMode = 'none (XL )14';
            break;
        case 13:
            basicMode = '7';
            break;
        case 14:
            basicMode = 'none (7+, XL 15)';
            break;
        case 15:
            basicMode = '8';
            break;
    }
    return `Basic ${basicMode}`;
}

function addToOutput(outputLine) {
    const node = document.createElement('div');
    node.innerText = outputLine;
    document.getElementById('output').appendChild(node);
}
