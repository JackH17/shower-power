import React, { useState, useEffect, useRef } from 'react';
import { getUserMediaStream } from '../utils/getUserInput';
import { CreateConvolver } from '../utils/createConvolver';
import BathroomResponseOne from '../assets/ImpulseResponses/bathroom_1.wav';
import ShowerResponseOne from '../assets/ImpulseResponses/shower_response.wav';

import ShowerPowerDisplay from '../Components/ShowerPowerDisplay';

const ShowerPower = () => {


    const [audioContext, setAudioContext] = useState(false);
    const [engaged, setEngaged] = useState(false);

    const [input, setInput] = useState();
    const [output, setOutput] = useState();

    const channelGain = useRef();
    const [gain, setGain] = useState(1);


    const [wetAmount, setWetAmount] = useState(0);
    const [dryAmount, setDryAmount] = useState(0);

    const dryGain = useRef();
    const wetGain = useRef();

    const reverbOne = useRef();
    const reverbOneGain = useRef();
    const [verbOneGain, setVerbOneGain] = useState(1);

    const reverbTwo = useRef();
    const reverbTwoGain = useRef();
    const [verbTwoGain, setVerbTwoGain] = useState(0);


    const trebleEqualizer = useRef();
    const [trebleGain, setTrebleGain] = useState(1);

    const bassEqualizer = useRef();
    const [bassGain, setBassGain] = useState(1);

    const compressor = useRef();

    const [compThreshold, setCompThreshold] = useState(-10);
    const [compRatio, setCompRatio] = useState(4);
    const [compRelease, setCompRelease] = useState(0.25);
    const [compAttack, setCompAttack] = useState(0.01);
    const [compKnee, setCompKnee] = useState(5);

    const [reverbPreDelay, setReverbPreDelay] = useState(0.01);
    const delay = useRef();

    useEffect(() => {

        if(channelGain.current !== undefined){
            channelGain.current.gain.value = gain;
        }

    }, [gain]);

    useEffect(() => {

        if(channelGain.current !== undefined){
            wetGain.current.gain.value = wetAmount;
            dryGain.current.gain.value = dryAmount;
        }

    }, [wetAmount, dryAmount]);

    useEffect(() => {

        if(channelGain.current !== undefined){

            reverbOneGain.current.gain.value = verbOneGain;
            reverbTwoGain.current.gain.value = verbTwoGain;
        }
        

    }, [verbOneGain, verbTwoGain])

    useEffect(() => {

        if(channelGain.current !== undefined){

            delay.current.delayTime.value = reverbPreDelay;
        }

    }, [reverbPreDelay])

    useEffect(() => {

        if(channelGain.current !== undefined){

            trebleEqualizer.current.gain.value = trebleGain;
            bassEqualizer.current.gain.value = bassGain;

        }
    }, [trebleGain, bassGain]);

    useEffect(() => {

        if(channelGain.current !== undefined){

            compressor.current.threshold.value = compThreshold;
            compressor.current.ratio.value = compRatio;
            compressor.current.attack.value = compAttack;
            compressor.current.release.value = compRelease;
            compressor.current.knee.value = compKnee;
        }
    }, [compThreshold, compRatio, compAttack, compRelease, compKnee])

    const setUserInputs = (streamNode, channelGainNode, dryGainNode, wetGainNode, reverbOneGainNode, reverbTwoGainNode) => {

        setInput(streamNode);

        channelGain.current = channelGainNode;
        dryGain.current = dryGainNode;
        wetGain.current = wetGainNode;

        reverbOneGainNode.gain.value = 1;
        reverbOneGain.current = reverbOneGainNode;

        reverbTwoGainNode.gain.value = 0;
        reverbTwoGain.current = reverbTwoGainNode;
    };

    const chooseReverb = (reverb) => {

        if(reverb === 'one'){
            setVerbOneGain(1);
            setVerbTwoGain(0);
        } else if(reverb === 'two'){
            setVerbOneGain(0);
            setVerbTwoGain(1);
        }
    }

    const setComponentReverb = async (convolverNodeOne, convolverNodeTwo) => {

        const bathroomVerbOne = await convolverNodeOne;

        reverbOne.current = bathroomVerbOne;

        const showerVerbOne = await convolverNodeTwo;

        reverbTwo.current = await showerVerbOne;
    };

    const setComponentCompression = (comp) => {
        compressor.current = comp;
    };

    const setComponentEqualizer = (treble, bass) => {

        treble.type = 'highshelf';
        treble.frequency.value = 1000;
        treble.gain.value = 1;
        trebleEqualizer.current = treble;

        bass.type = 'lowshelf';
        bass.frequency.value = 500;
        bass.gain.value = 1;
        bassEqualizer.current = bass;
    };

    const setComponentDelay = (delayNode) => {

        delayNode.delayTime.value = 0;
        delay.current = delayNode;  
    };

    const createAudioNodes = (context, userMediaStreamNode) => {

        setUserInputs(userMediaStreamNode, context.createGain(), context.createGain(), context.createGain(), context.createGain(), context.createGain());

        setComponentReverb(CreateConvolver(BathroomResponseOne, context), CreateConvolver(ShowerResponseOne, context));

        setComponentCompression(context.createDynamicsCompressor());

        setComponentDelay(context.createDelay());

        setComponentEqualizer(context.createBiquadFilter(), context.createBiquadFilter());

        setAudioContext(!audioContext);

    }

    const getContext = async () => {

        const AudioContext = window.AudioContext || window.webkitAudioContext;
        const context =  new AudioContext();

        setOutput(context.destination);

        const userMediaStreamNode = await getUserMediaStream(context);

        if(userMediaStreamNode.error){
            return;
        } else {
            createAudioNodes(context, userMediaStreamNode);
        }

    };

    const engageDisengage = () => {

        if(!engaged){

            setEngaged(!engaged);

            input.connect(channelGain.current);
            channelGain.current.connect(dryGain.current);
            dryGain.current.connect(output);

            channelGain.current.connect(wetGain.current);
            wetGain.current.connect(compressor.current);
            compressor.current.connect(delay.current);

            delay.current.connect(reverbOneGain.current);
            reverbOneGain.current.connect(reverbOne.current);
            reverbOne.current.connect(trebleEqualizer.current);

            delay.current.connect(reverbTwoGain.current);
            reverbTwoGain.current.connect(reverbTwo.current);
            reverbTwo.current.connect(trebleEqualizer.current);

            trebleEqualizer.current.connect(bassEqualizer.current);
            bassEqualizer.current.connect(output);

        } else {

            setEngaged(!engaged)

            input.disconnect(channelGain.current)

            channelGain.current.disconnect(dryGain.current);
            dryGain.current.disconnect(output);

            channelGain.current.disconnect(wetGain.current);
            wetGain.current.disconnect(compressor.current);
            compressor.current.disconnect(delay.current);

            delay.current.disconnect(reverbOneGain.current);
            reverbOneGain.current.disconnect(reverbOne.current);
            reverbOne.current.disconnect(trebleEqualizer.current);

            delay.current.disconnect(reverbTwoGain.current);
            reverbTwoGain.current.disconnect(reverbTwo.current);
            reverbTwo.current.disconnect(trebleEqualizer.current);

            trebleEqualizer.current.disconnect(bassEqualizer.current);
            bassEqualizer.current.disconnect(output);    
        }

    };

    const handleChannelGainChange = (g) => {
        setGain(g);
    };

    const handleWetDryChange = (wetDry) => {
        setWetAmount(parseFloat(wetDry[0]));
        setDryAmount(parseFloat(wetDry[1]));
    };

    const handleCompChange = (c) => {
        if(c === 'fast'){
            setCompThreshold(-20);
            setCompRatio(10);
            setCompAttack(0.015);
            setCompRelease(0.025);
            setCompKnee(5);
        } else {
            setCompThreshold(-24);
            setCompRatio(2);
            setCompAttack(0.03);
            setCompRelease(0.04); 
            setCompKnee(2);
        }
    };

    const handlePreDelayChange = (delayTime) => {
        setReverbPreDelay(parseFloat(delayTime));
    };

    const handleEQChange = (eq) => {
        if(eq === 'none'){
            setTrebleGain(1);
            setBassGain(1);
        } else if(eq === "treble"){
            setTrebleGain(2);
            setBassGain(0);
        } else if(eq === "bass"){
            setTrebleGain(0);
            setBassGain(2);
        }
    }


    return (

        <div>
            <ShowerPowerDisplay getContext={getContext} engageDisengage={engageDisengage} handleChannelGainChange={handleChannelGainChange} handleWetDryChange={handleWetDryChange} handlePreDelayChange={handlePreDelayChange} handleCompChange={handleCompChange} handleEQChange={handleEQChange} chooseReverb={chooseReverb} audioContext={audioContext}/>
        </div>
    )
}

export default ShowerPower;
