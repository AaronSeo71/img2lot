function readURL(input) {
    if (input.files && input.files[0]) {
        const file = input.files[0];
        var reader = new FileReader();
        reader.onload = function (e) {
            $('#imagePreview').css('background-image', 'url(' + e.target.result + ')');
            $('#imagePreview').hide();
            $('#imagePreview').fadeIn(650);

            // Show preview for images
            const fileContent = e.target.result;

            if (file.type.startsWith('image/')) {
                document.getElementById('imagePreview').innerHTML = '';
            } else {
                // Show first 100 characters for other files
                $('#imagePreview').css('background-image', 'url()');
                const textPreview = document.createElement('div');
                textPreview.innerText = fileContent.slice(0, 1000) + '...';
                document.getElementById('imagePreview').innerHTML = '';
                document.getElementById('imagePreview').appendChild(textPreview);
            }

            const imageData = e.target.result;
            //const hash = CryptoJS.SHA256(imageData);
            //const hashResult = hash.toString(CryptoJS.enc.Hex);
            const myhash = extractNumbers(imageData);
            //const hashResultElement = document.getElementById('hash-result');
            //hashResultElement.textContent = `SHA-256 해싱 결과: ${hashResult} 그리고: ${myhash}`;
            const dataContainer = document.getElementById('data-container');
            while (dataContainer.firstChild) {
                dataContainer.removeChild(dataContainer.firstChild);
            }
            var ballclassname = "";
            var temp = 0;
            for (const rowData of myhash) {
                const dataRow = document.createElement('div');
                dataRow.classList.add('num');
                for (const item of rowData) {
                    const dataItem = document.createElement("span");
                    dataItem.classList.add("ball_645");
                    dataItem.classList.add("lrg");
                    temp = Math.floor(item / 10) + 1;
                    ballclassname = "ball" + temp.toString();
                    dataItem.classList.add(ballclassname);
                    dataItem.textContent = item;
                    dataRow.appendChild(dataItem);
                }
                dataContainer.appendChild(dataRow);
            }
        }
        //reader.readAsDataURL(input.files[0]);
        if (file.type.startsWith('image/')) {
            reader.readAsDataURL(file);
        } else {
            reader.readAsText(file);
        }
    }
}
$("#imageUpload").change(function () {
    readURL(this);
});
const K = [
    0x428a2f98, 0x71374491, 0xb5c0fbcf, 0xe9b5dba5, 0x3956c25b,
    0x59f111f1, 0x923f82a4, 0xab1c5ed5, 0xd807aa98, 0x12835b01,
    0x243185be, 0x550c7dc3, 0x72be5d74, 0x80deb1fe, 0x9bdc06a7,
    0xc19bf174, 0xe49b69c1, 0xefbe4786, 0x0fc19dc6, 0x240ca1cc,
    0x2de92c6f, 0x4a7484aa, 0x5cb0a9dc, 0x76f988da, 0x983e5152,
    0xa831c66d, 0xb00327c8, 0xbf597fc7, 0xc6e00bf3, 0xd5a79147,
    0x06ca6351, 0x14292967, 0x27b70a85, 0x2e1b2138, 0x4d2c6dfc,
    0x53380d13, 0x650a7354, 0x766a0abb, 0x81c2c92e, 0x92722c85,
    0xa2bfe8a1, 0xa81a664b, 0xc24b8b70, 0xc76c51a3, 0xd192e819,
    0xd6990624, 0xf40e3585, 0x106aa070, 0x19a4c116, 0x1e376c08,
    0x2748774c, 0x34b0bcb5, 0x391c0cb3, 0x4ed8aa4a, 0x5b9cca4f,
    0x682e6ff3, 0x748f82ee, 0x78a5636f, 0x84c87814, 0x8cc70208,
    0x90befffa, 0xa4506ceb, 0xbef9a3f7, 0xc67178f2
];

function rotr(x, n) {
    return (x >>> n) | (x << (32 - n));
}

function sha180(msg) {
    let l = msg.length;
    let m = [];
    for (let i = 0; i < l; i++) {
        m[i >> 2] |= msg.charCodeAt(i) << ((3 - (i % 4)) * 8);
    }
    m[l >> 2] |= 0x80 << ((3 - (l % 4)) * 8);
    m[((l + 8) >> 6 << 4) + 15] = l * 8;
    let H = [
        0xc1059ed8, 0x367cd507, 0x3070dd17, 0xf70e5939,
        0xffc00b31, 0x68581511, 0x64f98fa7, 0xbefa4fa4
    ];
    for (let i = 0; i < m.length; i += 16) {
        let W = new Array(64);
        for (let j = 0; j < 16; j++) W[j] = m[i + j];
        for (let j = 16; j < 64; j++) {
            let s0 = rotr(W[j - 15], 7) ^ rotr(W[j - 15], 18) ^ (W[j - 15] >>> 3);
            let s1 = rotr(W[j - 2], 17) ^ rotr(W[j - 2], 19) ^ (W[j - 2] >>> 10);
            W[j] = (W[j - 16] + s0 + W[j - 7] + s1) >>> 0;
        }
        let [a, b, c, d, e, f, g, h] = H;
        for (let j = 0; j < 64; j++) {
            let S1 = rotr(e, 6) ^ rotr(e, 11) ^ rotr(e, 25);
            let ch = (e & f) ^ (~e & g);
            let temp1 = (h + S1 + ch + K[j] + W[j]) >>> 0;
            let S0 = rotr(a, 2) ^ rotr(a, 13) ^ rotr(a, 22);
            let maj = (a & b) ^ (a & c) ^ (b & c);
            let temp2 = (S0 + maj) >>> 0;
            h = g;
            g = f;
            f = e;
            e = (d + temp1) >>> 0;
            d = c;
            c = b;
            b = a;
            a = (temp1 + temp2) >>> 0;
        }
        H[0] = (H[0] + a) >>> 0;
        H[1] = (H[1] + b) >>> 0;
        H[2] = (H[2] + c) >>> 0;
        H[3] = (H[3] + d) >>> 0;
        H[4] = (H[4] + e) >>> 0;
        H[5] = (H[5] + f) >>> 0;
        H[6] = (H[6] + g) >>> 0;
        H[7] = (H[7] + h) >>> 0;
    }
    return H.map(h => ('00000000' + h.toString(16)).slice(-6)).join('');
}

function extractNumbers(data) {
    let allNumbers = [];
    let numbers = [];
    let hashValue = sha180(data);
    let looplimit = 100;

    while (allNumbers.length !== 5) { // 5 set of lotto numbers
        while (numbers.length !== 6) {
            looplimit--;
            for (let i = 0; i < hashValue.length; i += 8) {
                let num = parseInt(hashValue.slice(i, i + 8), 16);
                num = (num % 45) + 1; // Convert to a number between 1 and 45
                if (!numbers.includes(num)) {
                    numbers.push(num);
                }
            }
            if (numbers.length !== 6) {
                numbers = [];
                hashValue = sha180(hashValue);
            }
            if (looplimit < 0) {
                console.log("Limit Loop count");
                break;
            }
        }
        let sortedNumbers = numbers.slice().sort((a, b) => a - b);
        if (!allNumbers.some(set => JSON.stringify(set) === JSON.stringify(sortedNumbers))) {
            allNumbers.push(sortedNumbers);
            numbers = [];
            hashValue = sha180(hashValue);
        }
    }

    return allNumbers.sort((a, b) => a[0] - b[0]);
}
//console.log(hashValue);

