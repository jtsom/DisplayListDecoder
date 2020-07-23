function draw() {
    const bits = document.getElementById("bits");

    const source = document.getElementById('bitmap').value;
    const sourceByteChars = source.replace(/\s/g, '').replace(',,', ',');

    const ctx = bits.getContext("2d");

    const dataArray = sourceByteChars.split(',');

    bits.height = dataArray.length * 20;

    dataArray.forEach((byte, byteIndex) => {
        let sourceByte = '';

        if (byte.startsWith('$')) {
            sourceByte = parseInt(byte.substring(1), 16);
        } else {
            sourceByte = parseInt(byte);
        }

        const x = sourceByte.toString(2).padStart(8, "0");

        x.split('').forEach((element, i) => {
            if (element === '1') {
                const xPos = i * 20;
                const yPos = byteIndex * 20;
                ctx.fillRect(xPos, yPos, 20, 20);
            }
        });
    });

   //   for(i=0; i<8; i++){
   //     ctx.fillRect(i * 20,i * 20,20,20);
   //   }

}
