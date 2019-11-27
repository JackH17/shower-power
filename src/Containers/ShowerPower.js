import React, { useState, useEffect, useRef } from 'react';
import { getUserMediaStream } from '../utils/getUserInput';
import { CreateConvolver } from '../utils/createConvolver';
import ShowerResponse from '../assets/ImpulseResponses/shower_response.wav';

const ShowerPower = () => {

    const [audioContext, setAudioContext] = useState(false);
    const [engaged, setEngaged] = useState(false);

    const [input, setInput] = useState();
    const [output, setOutput] = useState();

    const channelGain = useRef();
    const [gain, setGain] = useState(5);


    const [wetDry, setWetDry] = useState(3);
    const dryGain = useRef();
    const wetGain = useRef();

    const reverb = useRef();

    const trebleEqualizer = useRef();

    const [trebleFrequency, setTrebleFrequency] = useState(10000);
    const [trebleGain, setTrebleGain] = useState(5);

    const midEqualizer = useRef();

    const [midFrequency, setMidFrequency] = useState(3000);
    const [midGain, setMidGain] = useState(5);
    const [midQ, setMidQ] = useState(1);

    const bassEqualizer = useRef();

    const [bassFrequency, setBassFrequency] = useState(200);
    const [bassGain, setBassGain] = useState(5);

    const compressor = useRef();

    const [compThreshold, setCompThreshold] = useState(-20);
    const [compRatio, setCompRatio] = useState(4);
    const [compRelease, setCompRelease] = useState(0.25);
    const [compAttack, setCompAttack] = useState(0.01);
    const [compKnee, setCompKnee] = useState(5);

    const [channelPan, setChannelPan] = useState(0);
    const panner = useRef();

    const [reverbPreDelay, setReverbPreDelay] = useState(0);
    const delay = useRef();


    useEffect(() => {

        if(channelGain.current !== undefined){
            
            channelGain.current.gain.value = gain / 5;

            panner.current.pan.value = channelPan;

            delay.current.delayTime.value = reverbPreDelay;

            if(wetDry === 5){
                dryGain.current.gain.value = 0;
                wetGain.current.gain.value = 2;
            } else if(wetDry === 4){
                dryGain.current.gain.value = 0.5;
                wetGain.current.gain.value = 1.5;
            } else if(wetDry === 3){
                dryGain.current.gain.value = 1;
                wetGain.current.gain.value = 1;
            } else if(wetDry === 2){
                dryGain.current.gain.value = 1.5;
                wetGain.current.gain.value = 0.5;
            } else {
                dryGain.current.gain.value = 2;
                wetGain.current.gain.value = 0;
            }
        }

    }, [gain, wetDry, channelPan, reverbPreDelay]);

    useEffect(() => {

        if(channelGain.current !== undefined){

            trebleEqualizer.current.frequency.value = trebleFrequency;
            trebleEqualizer.current.gain.value = trebleGain;

            midEqualizer.current.frequency.value = midFrequency;
            midEqualizer.current.Q.value = midQ;
            midEqualizer.current.gain.value = midGain;

            bassEqualizer.current.frequency.value = bassFrequency;
            bassEqualizer.current.gain.value = bassGain;
        }
    }, [trebleFrequency, trebleGain, midFrequency, midGain, midQ, bassFrequency, bassGain]);

    useEffect(() => {
        if(channelGain.current !== undefined){

            compressor.current.threshold.value = compThreshold;
            compressor.current.ratio.value = compRatio;
            compressor.current.attack.value = compAttack;
            compressor.current.release.value = compRelease;
            compressor.current.knee.value = compKnee;
        }
    }, [compThreshold, compRatio, compKnee, compAttack, compRelease])

    const setUserInputs = (streamNode, channelGainNode, dryGainNode, wetGainNode) => {

        setInput(streamNode);

        channelGain.current = channelGainNode;
        dryGain.current = dryGainNode;
        wetGain.current = wetGainNode;

    };

    const setComponentReverb = async (convolverNode) => {

        const verb = await convolverNode;

        reverb.current = verb;
    };

    const setComponentCompression = (comp) => {
        compressor.current = comp;
    };

    const setComponentEqualizer = (treble, mid, bass) => {

        treble.type = 'highshelf';
        trebleEqualizer.current = treble;

        mid.type = 'peaking'
        midEqualizer.current = mid;

        bass.type = 'lowshelf';
        bassEqualizer.current = bass;
    };

    const setComponentPanner = (pan) => {
        pan.pan.value = 0;
        panner.current = pan;

    };

    const setComponentDelay = (delayNode) => {

        delayNode.delayTime.value = 0;

        delay.current = delayNode;
        
    };

    const getContext = async () => {

        setAudioContext(!audioContext);

        const AudioContext = window.AudioContext || window.webkitAudioContext;
        const context =  new AudioContext();

        setOutput(context.destination);

        const userMediaStreamNode = await getUserMediaStream(context);

        setUserInputs(userMediaStreamNode, context.createGain(), context.createGain(), context.createGain());

        setComponentPanner(context.createStereoPanner());

        setComponentReverb(CreateConvolver(ShowerResponse, context));

        setComponentCompression(context.createDynamicsCompressor());

        setComponentDelay(context.createDelay())

        setComponentEqualizer(context.createBiquadFilter(), context.createBiquadFilter(), context.createBiquadFilter())
    };

    const engage = (engageDisengage) => (<div><button  className="input-button" onClick={engageDisengage}>{engaged ? `Off` : `On`}</button></div>)

    const engageDisengage = () => {

        if(!engaged){

            setEngaged(!engaged);

            input.connect(panner.current);
            panner.current.connect(channelGain.current);
            channelGain.current.connect(dryGain.current);
            dryGain.current.connect(output);
            channelGain.current.connect(wetGain.current);
            wetGain.current.connect(compressor.current);
            compressor.current.connect(delay.current);
            delay.current.connect(reverb.current);
            reverb.current.connect(trebleEqualizer.current);
            trebleEqualizer.current.connect(midEqualizer.current);
            midEqualizer.current.connect(bassEqualizer.current);
            bassEqualizer.current.connect(output);

        } else {

            setEngaged(!engaged)

            input.disconnect(panner.current);
            panner.current.disconnect(channelGain.current);

            channelGain.current.disconnect(dryGain.current);
            dryGain.current.disconnect(output);

            channelGain.current.disconnect(wetGain.current);
            wetGain.current.disconnect(compressor.current);
            compressor.current.disconnect(delay.current);
            delay.current.disconnect(reverb.current);
            reverb.current.disconnect(trebleEqualizer.current);
            trebleEqualizer.current.disconnect(midEqualizer.current);
            midEqualizer.current.disconnect(bassEqualizer.current);
            bassEqualizer.current.disconnect(output);
        }

    };

    const handleChannelGainChange = (e) => {
        setGain(parseInt(e.target.value));
    };

    const handleWetDryChange = (e) => {
        setWetDry(parseInt(e.target.value));
    };

    const handleChannelTrebleFrequencyChange = (e) => {
        setTrebleFrequency(parseInt(e.target.value));
    };

    const handleChannelMidFrequencyChange = (e) => {
        setMidFrequency(parseInt(e.target.value));
    };

    const handleChannelBassFrequencyChange = (e) => {
        setBassFrequency(parseInt(e.target.value));
    };

    const handleChannelTrebleGainChange = (e) => {
        setTrebleGain(parseInt(e.target.value));
    };

    const handleChannelMidGainChange = (e) => {
        setMidGain(parseInt(e.target.value));
    };

    const handleChannelBassGainChange = (e) => {
        setBassGain(parseInt(e.target.value));
    };

    const handleChannelMidQChange = (e) => {
        setMidQ(parseInt(e.target.value));
    };

    const handleCompThresholdChange = (e) => {
        setCompThreshold(parseFloat(e.target.value));
    }

    const handleCompRatioChange = (e) => {
        setCompRatio(parseFloat(e.target.value));
    }

    const handleCompReleaseChange = (e) => {
        setCompRelease(parseFloat(e.target.value));
    }

    const handleCompAttackChange = (e) => {
        setCompAttack(parseFloat(e.target.value));
    }

    const handleCompKneeChange = (e) => {
        setCompKnee(parseInt(e.target.value))
    }

    const handlePanChange = (e) => {
        setChannelPan(parseFloat(e.target.value));
    }

    const handlePreDelayChange = (e) => {
        setReverbPreDelay(parseFloat(e.target.value))
    }


    return (

        <div className="shower-home">
            <h1 className="shower-home__heading--main">Shower Power</h1>
                <h2 className="shower-home__heading--sub">A shower based covolution reverb</h2>
                    <div>
                        <div className="shower-home__context">
                            {
                                audioContext ? <p className="live">live</p> : <button className="input-button" onClick={getContext}>Get Input</button>
                            }
                            <div className="engage-button">
                                {
                                    audioContext && engage(engageDisengage)
                                }
                            </div>
                        </div>
                        <div className="row control-panel">
                            <div className="col-1-of-3">
                                <h2 className="effect-component-heading">Compression</h2>
                                <p className="component-slider">Threshold {compThreshold}</p>
                                <input type="range" name="Threshold" min="-50" max="0" step="0.1" value={compThreshold} onChange={handleCompThresholdChange}></input>
                                <p className="component-slider">Ratio {compRatio}</p>
                                <input type="range" name="ratio" min="0" max="20" step="1" value={compRatio} onChange={handleCompRatioChange}></input>
                                <p className="component-slider">Attack {compAttack}</p>
                                <input type="range" name="attack" min="0" max="1" step="0.01" value={compAttack} onChange={handleCompAttackChange}></input>
                                <p className="component-slider">Release {compRelease}</p>
                                <input type="range" name="release" min="0" max="1" step="0.01" value={compRelease} onChange={handleCompReleaseChange}></input> 
                                <p className="component-slider">Knee {compKnee}</p>
                                <input type="range" name="knee" min="0" max="20" step="1" value={compKnee} onChange={handleCompKneeChange}></input>
                            </div>
                            <div className="col-1-of-3">
                                <h2 className="effect-component-heading">Channel</h2>
                                    <p className="component-slider">Volume {gain}</p>
                                    <input type="range" value={gain} min="0" max="10" step="1" onChange={handleChannelGainChange}/>
                                    <p className="component-slider">Wet {wetDry}</p>
                                    <input type="range" value={wetDry} min="1" max="5" step="1" onChange={handleWetDryChange}/>
                                    <p className="component-slider">Pre-Delay {reverbPreDelay}</p>
                                    <input type="range" value={reverbPreDelay} min="0" max="1" step="0.01" onChange={handlePreDelayChange}/>
                                    <p className="component-slider">Pan {channelPan}</p>
                                    <input type="range" value={channelPan} min="-1" max="1" step="0.1" onChange={handlePanChange}/>
                            </div>
                            <div className="col-1-of-3">
                                <h2 className="effect-component-heading">Equalizer</h2>
                                <h5 className="eq-headings">Treble</h5>
                                <p>Frequency {trebleFrequency}</p>
                                <input type="range" value={trebleFrequency} min="7000" max="20000" step="1" onChange={handleChannelTrebleFrequencyChange}/>
                                <p>Gain {trebleGain}</p>
                                <input type="range" value={trebleGain} min="0" max="10" step="1" onChange={handleChannelTrebleGainChange}/>
                                <h5 className="eq-headings">Mid</h5>
                                <p>Q {midQ}</p>
                                <input type="range" value={midQ} min="0" max="5" step="1" onChange={handleChannelMidQChange}/>
                                <p>Frequency {midFrequency}</p>
                                <input type="range" value={midFrequency} min="500" max="7000" step="1" onChange={handleChannelMidFrequencyChange}/>
                                <p>Gain {midGain}</p>
                                <input type="range" value={midGain} min="0" max="10" step="1" onChange={handleChannelMidGainChange}/>
                                <h5 className="eq-headings">Bass</h5>
                                <p>Frequency {bassFrequency}</p>
                                <input type="range" value={bassFrequency} min="20" max="500" step="1" onChange={handleChannelBassFrequencyChange}/>
                                <p>Gain {bassGain}</p>
                                <input type="range" value={bassGain} min="0" max="10" step="1" onChange={handleChannelBassGainChange}/>
                            </div>
                        </div>
                                        
                    </div>
        </div>
    )
}

export default ShowerPower;
