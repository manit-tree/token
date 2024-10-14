# Token.js

JavaScript library to create and validate token. Inspired by JSON Web Token but simpler.

## Token formula

Token consists of only 2 part 

1. payload = base64_encode(JSON.stringify(JavaScript Object)) 
2. signature = sha256(payload + '.' + secret)

## Example of Token

eyJ4IjoxMCwieSI6MjB9.ea7353198fda96d50ad568766dc2ff1e4462a22ec6dcafee84f75e719bbd3514

## Author

Mr.Manit Treeprapankit
