// /* eslint-disable no-bitwise */
// import NfcManager from 'react-native-nfc-manager';

// async function writePokemon(pokemon) {
//     let blockData;
//     let respBytes = [];
//     let allBytes = [];

//     //Block 4 start write
//     let pokname = "helloworldhelloworld12"

//     let strlen = parseInt(pokname.length / 4)
//     let blockWriteUpto = strlen % 4 == 0 ? strlen : strlen + 1

//     let nameBytes = Array.from(pokname).map((_, i) => {
//         return pokname.charCodeAt(i);
//     });

//     while (nameBytes.length < blockWriteUpto * 4) {
//         nameBytes.push(0);
//     }

//     let nameBlockIdx = 4;
//     for (let i = 0; i < blockWriteUpto; i++) {
//         blockData = nameBytes.slice(4 * i, 4 * i + 4);
//         respBytes = await NfcManager.nfcAHandler.transceive([
//             0xa2,
//             nameBlockIdx + i,
//             ...blockData,
//         ]);
//         console.warn(`write data block ${nameBlockIdx + i}`, blockData);
//         if (respBytes[0] !== 0xa) {
//             throw new Error('fail to write');
//         }
//     }

//     allBytes = [...allBytes, ...blockData];

//     // // Block 7 ~ 11: the name of the pokemon
//     // pokname = "helloworld"
//     // nameBytes = Array.from(pokname).map((_, i) => {
//     //   return pokname.charCodeAt(i);
//     // });

//     // while (nameBytes.length < 20) {
//     //   nameBytes.push(0);
//     // }

//     // nameBlockIdx = 7;
//     // for (let i = 0; i < 5; i++) {
//     //   blockData = nameBytes.slice(4 * i, 4 * i + 4);
//     //   respBytes = await NfcManager.nfcAHandler.transceive([
//     //     0xa2,
//     //     nameBlockIdx + i,
//     //     ...blockData,
//     //   ]);
//     //   console.warn(`write data block ${nameBlockIdx + i}`, blockData);
//     //   if (respBytes[0] !== 0xa) {
//     //     throw new Error('fail to write');
//     //   }
//     // }
//     // allBytes = [...allBytes, ...nameBytes];

//     return allBytes;
// }

// export default writePokemon;
