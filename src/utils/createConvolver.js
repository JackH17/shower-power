const getArrayBuffer = async (impulse) => {

    const response = await fetch(impulse)

    const responseArrayBuffer = await response.arrayBuffer()

    return responseArrayBuffer;
};

export const CreateConvolver = async (impulse, audioCTX) => {
    
    const arrayBuffer = await getArrayBuffer(impulse, audioCTX);

    const reverb = await audioCTX.createConvolver();

    const buffer = await audioCTX.decodeAudioData(arrayBuffer, buffer => buffer)

    reverb.buffer = buffer;

    return reverb;
}