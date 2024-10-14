import sha256 from 'sha256';

function base64_encode(str) {
    return Buffer.from(str).toString('base64');
}

function base64_decode(str) {
    return Buffer.from(str, 'base64');
}

function create_token(payload, secret) {
    let part1 = base64_encode(JSON.stringify(payload));
    let signature = sha256(`${part1}.${secret}`);

    return part1 + '.' + signature;

}

function verify_token(token, secret) {
    return new Promise((resolve, reject) => {
        let arr = token.split('.');    

        if (arr.length == 2) {
            let signature = sha256(`${arr[0]}.${secret}`);
    
            if (signature == arr[1]) {
                resolve(JSON.parse(base64_decode(arr[0])));
            } else {
                reject({status:501, description: 'invalid signature'});
            }
        }
    
        reject({status:502, description: 'invalid token'});
    })
}

export { sha256, base64_decode, base64_encode, create_token, verify_token }