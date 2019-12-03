const getStream = async () => {

    const constraints = {
        echoCancellation: false,
        autoGainControl: false,
        noiseSuppression: false,
        latency: 0
    }

    try {
        const userStream =  await navigator.mediaDevices.getUserMedia({audio: constraints});  
    
        return userStream;

    } catch (error){
        window.alert(`Current browser not supported`);
        return;
    }

}; 

const createMediaStreamAudioSourceNode = async (audioCTX, userStream) => {

    const mediaStreamSourceNode = await audioCTX.createMediaStreamSource(userStream);

    return mediaStreamSourceNode

}


export const getUserMediaStream = async (audioCTX) => {

        const userStream =  await getStream();
        
        const mediaStreamSourceNode = await createMediaStreamAudioSourceNode(audioCTX, userStream)

        return mediaStreamSourceNode;
}