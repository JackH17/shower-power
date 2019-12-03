import React, { useEffect, useState, useRef } from 'react';
import Konva from 'konva';
import { Stage, Layer, Rect, Circle, Line, Text, Image } from "react-konva";
import useImage from 'use-image';
import tileBackground from '../assets/SVGS/pink_tiled_background.svg'

const ShowerPowerDisplay = ({getContext, engageDisengage, handleChannelGainChange, handleWetDryChange, handlePreDelayChange, handleCompChange, handleEQChange, chooseReverb}) => {

    const [stageWidth, setStageWidth] = useState(window.innerWidth);
    const [stageHeight, setStageHeight] = useState(window.innerHeight);

    const [context, setContext] = useState(false)

    const [tiles] = useImage(tileBackground);

    const [engaged, setEngaged] = useState(false);

    let engagedLine = useRef();

    let volumeLine = useRef();
    const [volumeDragAmount, setVolumeDragAmount] = useState(0);
    const [volumeAmount, setVolumeAmount] = useState(1);

    let wetDryLine = useRef();
    const [wetDryDragAmount, setWetDryDragAmount] = useState(0);
    const [wetDryAmount, setWetDryAmount] = useState([]);

    const [reverb, setReverb] = useState('one');
    const [reverbDragAmount, setReverbDragAmount] = useState();
    let reverbLine = useRef();


    let wetDry = useRef();
    let volume = useRef();

    let preDelayLine = useRef();
    const [preDelayDragAmount, setPreDelayDragAmount] = useState();
    const [preDelayAmount, setPreDelayAmount] = useState(0.01);

    let compressionLine = useRef();
    const [compressionDragAmount, setCompressionDragAmount] = useState();
    const [compressionSpeed, setCompressionSpeed] = useState('fast');

    let eqBoostLine = useRef();
    const [eqBoostDragAmount, setEQBoostDragAmount] = useState(0);
    const [eqBoostSetting, setEQBoostSetting] = useState('none');

    const stageRefOne = useRef();
    const engagedLight = useRef();

    const [engagedHelper, setEngagedHelper] = useState(false)


    const updateWidthAndHeight = () => {

        setStageWidth(window.innerWidth);
        setStageHeight(window.innerHeight);
    }

    useEffect(() => {
        window.addEventListener('resize', updateWidthAndHeight)

        return () => {
            window.removeEventListener('resize', updateWidthAndHeight);
        }
    });

    useEffect(() => {

        if(!engaged){
            return;
        }

        let period = 300;

        let animation = new Konva.Animation(frame => {
            engagedLight.current.opacity((Math.sin(frame.time / period) + 1) / 2);
        }, engagedLight.current.getLayer());
      
        animation.start();

        return () => {
            animation.stop();
        };
    })

    useEffect(() => {

        chooseReverb(reverb)

    }, [reverb])

    useEffect(() => {

        handleChannelGainChange(volumeAmount)

    }, [volumeAmount]);
    

    useEffect(() => {

        handleWetDryChange(wetDryAmount);

    }, [wetDryAmount])

    useEffect(() => {
        handlePreDelayChange(preDelayAmount);
    }, [preDelayAmount])

    useEffect(() => {

        handleCompChange(compressionSpeed)

    }, [compressionSpeed]);

    useEffect(() => {
        handleEQChange(eqBoostSetting);
    }, [eqBoostSetting])

    const widthPercentage = (width) => {   
        return Math.floor(stageWidth / (100 / width))
    }

    const heightPercentage = (height) => {   
        return Math.floor(stageHeight / (100 / height))
    }

    const hadleEngaged = () => {

        if(!context){
            window.alert('You must enable User Audio before you can enable Audio effects')
            return ;
        }

        setEngaged(!engaged);

        engageDisengage();

        if(engaged){
            engagedLine.current.rotation(90)
        } else if(!engaged){
            engagedLine.current.rotation(-90)
        }
    }

    const getReverbAmount = () => {

        if(!context){
            window.alert('You must enable User Audio before you can enable Audio effects')
            return ;
        }

        if(reverbDragAmount === 90){
            setReverb('two')
        }else if(reverbDragAmount === -90){
            setReverb('one')
        }

    }

    const rotateReverb = () => {

        if(reverbDragAmount > 0){
            reverbLine.current.rotation(90)
        } else if(reverbDragAmount < 0){
            reverbLine.current.rotation(-90)
        } 
    }

    const getReverbDragMove = (e) => {

        const difference = (e.currentTarget.attrs.x - e.evt.clientX)

        if(difference > 90){
            setReverbDragAmount(90)
        } else if(difference < -90){
            setReverbDragAmount(-90)
        } else {
            setReverbDragAmount(difference);
        }

        rotateReverb();

    }

    const getVolumeAmount = () => {

        if(!context){
            window.alert('You must enable User Audio before you can enable Audio effects')
            return ;
        }

        setVolumeAmount(((Math.floor(volumeDragAmount/9))/10) + 1)
    }

    const rotateVolume = () => {

        if(volumeDragAmount > 90){
            volumeLine.current.rotation(90)
        } else if(volumeDragAmount < -90){
            volumeLine.current.rotation(-90)
        } else {
            volumeLine.current.rotation(volumeDragAmount)
        }
    }

    const getVolumeDragMove = (e) =>{
     
        const difference = (e.currentTarget.attrs.x - e.evt.clientX)

        if(difference > 90){
            setVolumeDragAmount(90)
        } else if(difference < -90){
            setVolumeDragAmount(-90)
        } else {
            setVolumeDragAmount(difference);
        }

        rotateVolume();
    }

    const getWetDryAmount = () => {

        if(!context){
            window.alert('You must enable User Audio before you can enable Audio effects')
            return ;
        }

        setWetDryAmount([(2 - (((Math.floor(wetDryDragAmount/9))/10) + 1)), (((Math.floor(wetDryDragAmount/9))/10) + 1)]);

    }

    const rotateWetDry = () => {

        if(wetDryDragAmount > 90){
            wetDryLine.current.rotation(90)
        } else if(wetDryDragAmount < -90){
            wetDryLine.current.rotation(-90)
        } else {
            wetDryLine.current.rotation(wetDryDragAmount)
        }
    }

    const getWetDryDragMove = (e) => {
     
        const difference = (e.currentTarget.attrs.x - e.evt.clientX)

        if(difference > 90){
            setWetDryDragAmount(90)
        } else if(difference < -90){
            setWetDryDragAmount(-90)
        } else {
            setWetDryDragAmount(difference);
        }

        rotateWetDry();
    }

    const getCompressionSpeed = () => {

        if(!context){
            window.alert('You must enable User Audio before you can enable Audio effects')
            return ;
        }

        if(compressionDragAmount >= 0 || compressionDragAmount > 90){
            setCompressionSpeed('slow');
        } else if(compressionDragAmount <= -1 || compressionDragAmount < -90){
            setCompressionSpeed('fast');
        }  

    }

    const compressionSnapDrag = () => {

        if(compressionDragAmount >= 0 || compressionDragAmount > 90){
            compressionLine.current.rotation(90);
        } else if(compressionDragAmount <= -1 || compressionDragAmount < -90){
            compressionLine.current.rotation(-90)
        }  
    }

    const getCompressionDragMove = (e) => {
        const difference = (e.currentTarget.attrs.x - e.evt.clientX)

        if(difference >= 0 || difference > 90){
            setCompressionDragAmount(90)
        } else if(difference <= -1 || difference < -90){
            setCompressionDragAmount(-90)
        } 

        compressionSnapDrag();
    }

    const getEQBoostSetting = () => {

        if(!context){
            window.alert('You must enable User Audio before you can enable Audio effects')
            return ;
        }

        if(eqBoostDragAmount >= 45 || eqBoostDragAmount >= 90){
            setEQBoostSetting('treble')
        } else if(eqBoostDragAmount <= -45 || eqBoostDragAmount <= -90){
            setEQBoostSetting('bass')
        } else {
            setEQBoostSetting('none')
        }

    }

    const eqBoostSnapDrag = () =>{

        if(eqBoostDragAmount >= 45 || eqBoostDragAmount >= 90){
            eqBoostLine.current.rotation(90)
        } else if(eqBoostDragAmount <= -45 || eqBoostDragAmount <= -90){
            eqBoostLine.current.rotation(-90)
        } else {
            eqBoostLine.current.rotation(0)

        }
    }

    const getEQBoostDragMove = (e) => {
        const difference = (e.currentTarget.attrs.x - e.evt.clientX)

        if(difference >= 45 || difference > 90){
            setEQBoostDragAmount(90)
        } else if(difference <= -45 || difference < -90){
            setEQBoostDragAmount(-90)
        } else {
            setEQBoostDragAmount(0)
        }

        eqBoostSnapDrag();
    }

    const getPreDelayAmount = () => {

        if(!context){
            window.alert('You must enable User Audio before you can enable Audio effects')
            return ;
        }

        setPreDelayAmount(Math.floor((preDelayDragAmount + 90)/18)/100);
    }

    const rotatePreDelay = () => {

        if(preDelayDragAmount > 90){
            preDelayLine.current.rotation(90)
        } else if(preDelayDragAmount < -90){
            preDelayLine.current.rotation(-90)
        } else {
            preDelayLine.current.rotation(preDelayDragAmount)
        }

    }

    const getPreDelayDragMove = (e) => {

        const difference = (e.currentTarget.attrs.x - e.evt.clientX);

        if(difference > 90){
            setPreDelayDragAmount(90)
        } else if(difference < -90){
            setPreDelayDragAmount(-90)
        } else {
            setPreDelayDragAmount(difference);
        }

        rotatePreDelay();

    }

    const handleContext = () => {
        if(context){
            return;
        }
        
        setContext(true);
        getContext();
    }

    const handleEngagedMouseEnter = () => {
        setEngagedHelper(true)
    }

    const handleEngagedMouseLeave = () => {
        setEngagedHelper(false)
    }

    return (
        <div>
            <Stage ref={stageRefOne} width={stageWidth} height={stageHeight}>
                <Layer>
                        <Rect width={stageWidth} height={stageWidth} fill="#93b8f5" zIndex={-100}/>
                            <Image image={tiles} width={stageWidth} height={stageHeight}/>
                                <Text text="SHOWER" x={widthPercentage(1)} y={heightPercentage(4)} fontSize={widthPercentage(7)} fontFamily={'Major Mono Display'}/>
                                <Text text="POWER" x={widthPercentage(70)} y={heightPercentage(4)} fontSize={widthPercentage(7)} fontFamily={'Major Mono Display'}/>
                                        <Circle x={widthPercentage(50.5)} y={heightPercentage(12)} radius={widthPercentage(5)} fill="black" shadowBlur={7}/>
                                        <Circle ref={engagedLight} x={widthPercentage(50.5)} y={heightPercentage(12)} radius={widthPercentage(3)} fill="red" shadowBlur={7} opacity={engaged ? 0 : 1}/>
                                        <Circle x={widthPercentage(50.5)} y={heightPercentage(12)} radius={widthPercentage(5)} fill="black" shadowBlur={7} opacity={engaged ? 0 : 1}/>
                                    <Text text="ON" x={widthPercentage(39)} y={heightPercentage(56)} fontSize={widthPercentage(3)} fontFamily={'Major Mono Display'}/>
                                        <Circle x={widthPercentage(50.5)} y={heightPercentage(60)} radius={widthPercentage(2)} fill="grey" onClick={hadleEngaged} onMouseEnter={handleEngagedMouseEnter} onMouseLeave={handleEngagedMouseLeave}/>
                                        <Circle x={widthPercentage(50.5)} y={heightPercentage(60)} radius={widthPercentage(1)} fill="black" onClick={hadleEngaged} onMouseEnter={handleEngagedMouseEnter} onMouseLeave={handleEngagedMouseLeave}/>
                                        <Line ref={engagedLine} x={widthPercentage(50.5)} y={heightPercentage(60)} points={[0,0,0,- widthPercentage(2)]} stroke={'black'} strokeWidth={5} closed={true} lineCap={"round"}/>  
                                    <Text text="OFF" x={widthPercentage(57)} y={heightPercentage(56)} fontSize={widthPercentage(3)} fontFamily={'Major Mono Display'}/>
                                    <Text text='Click To Engage' x={widthPercentage(50)} y={heightPercentage(65)} fontSize={widthPercentage(1)} fontFamily={'Major Mono Display'} opacity={engagedHelper && !engaged ? 1 : 0}/>
                                    <Text text="WET" x={widthPercentage(3)} y={heightPercentage(56)} fontSize={widthPercentage(3)} fontFamily={'Major Mono Display'}/>
                                        <Circle ref={wetDry} x={widthPercentage(15)} y={heightPercentage(60)} radius={widthPercentage(3)} fill="grey" draggable onDragMove={getWetDryDragMove} onDragEnd={getWetDryAmount} dragBoundFunc={function(pos){return{x: this.absolutePosition().x, y: this.absolutePosition().y}}}/> 
                                        <Circle x={widthPercentage(15)} y={heightPercentage(60)} radius={widthPercentage(1)} fill="black" draggable onDragMove={getWetDryDragMove} onDragEnd={getWetDryAmount} dragBoundFunc={function(pos){return{x: this.absolutePosition().x, y: this.absolutePosition().y}}}/>
                                        <Line ref={wetDryLine} x={widthPercentage(15)} y={heightPercentage(60)} points={[0,0,0,- widthPercentage(3)]} stroke={'black'} strokeWidth={5} closed={true} lineCap={"round"}/>
                                    <Text text="DRY" x={widthPercentage(21)} y={heightPercentage(56)} fontSize={widthPercentage(3)} fontFamily={'Major Mono Display'}/>
                                    <Text text="-60DB" x={widthPercentage(68)} y={heightPercentage(56)} fontSize={widthPercentage(3)} fontFamily={'Major Mono Display'}/>
                                        <Circle ref={volume} x={widthPercentage(85)} y={heightPercentage(60)}  radius={widthPercentage(3)} fill="grey" draggable onDragMove={getVolumeDragMove} onDragEnd={getVolumeAmount} dragBoundFunc={function(pos){return{x: this.absolutePosition().x, y: this.absolutePosition().y}}}/>
                                        <Circle x={widthPercentage(85)} y={heightPercentage(60)} radius={widthPercentage(1)} fill="black" draggable onDragMove={getVolumeDragMove} onDragEnd={getVolumeAmount} dragBoundFunc={function(pos){return{x: this.absolutePosition().x, y: this.absolutePosition().y}}}/>
                                        <Line ref={volumeLine} x={widthPercentage(85)} y={heightPercentage(60)} points={[0,0,0,- widthPercentage(3)]} stroke={'black'} strokeWidth={5} closed={true} lineCap={"round"}/>
                                    <Text text="0DB" x={widthPercentage(91)} y={heightPercentage(56)} fontSize={widthPercentage(3)} fontFamily={'Major Mono Display'}/> 
                                    <Text text="REVERB" x={widthPercentage(24)} y={heightPercentage(25)} fontSize={widthPercentage(4)} fontFamily={'Major Mono Display'}/>
                                    <Text text="1" x={widthPercentage(25)} y={heightPercentage(35)} fontSize={widthPercentage(4)} fontFamily={'Major Mono Display'}/>
                                        <Circle x={widthPercentage(33.5)} y={heightPercentage(39)} radius={widthPercentage(2)} fill="grey" draggable onDragMove={getReverbDragMove} onDragEnd={getReverbAmount} dragBoundFunc={function(pos){return{x: this.absolutePosition().x, y: this.absolutePosition().y}}}/>
                                        <Circle x={widthPercentage(33.5)} y={heightPercentage(39)} radius={widthPercentage(1)} fill="black" draggable onDragMove={getReverbDragMove} onDragEnd={getReverbAmount} dragBoundFunc={function(pos){return{x: this.absolutePosition().x, y: this.absolutePosition().y}}}/>
                                        <Line ref={reverbLine} x={widthPercentage(33.5)} y={heightPercentage(39)} points={[0,0,0,- widthPercentage(2)]} stroke={'black'} strokeWidth={5} closed={true} lineCap={"round"}/>
                                    <Text text="2" x={widthPercentage(39)} y={heightPercentage(35)} fontSize={widthPercentage(4)} fontFamily={'Major Mono Display'}/>
                                    <Text text="PRE-DELAY" x={widthPercentage(55)} y={heightPercentage(25)} fontSize={widthPercentage(4)} fontFamily={'Major Mono Display'}/>
                                    <Text text="0.01" x={widthPercentage(53)} y={heightPercentage(35)} fontSize={widthPercentage(3)} fontFamily={'Major Mono Display'}/>
                                        <Circle x={widthPercentage(67.5)} y={heightPercentage(39)} radius={widthPercentage(2)} fill="grey" draggable onDragMove={getPreDelayDragMove} onDragEnd={getPreDelayAmount} dragBoundFunc={function(pos){return{x: this.absolutePosition().x, y: this.absolutePosition().y}}}/>
                                        <Circle x={widthPercentage(67.5)} y={heightPercentage(39)} radius={widthPercentage(1)} fill="black" draggable onDragMove={getPreDelayDragMove} onDragEnd={getPreDelayAmount} dragBoundFunc={function(pos){return{x: this.absolutePosition().x, y: this.absolutePosition().y}}}/>
                                        <Line ref={preDelayLine} x={widthPercentage(67.5)} y={heightPercentage(39)} points={[0,0,0,- widthPercentage(2)]} stroke={'black'} strokeWidth={5} closed={true} lineCap={"round"}/>
                                    <Text text="0.1" x={widthPercentage(75)} y={heightPercentage(35)} fontSize={widthPercentage(3)} fontFamily={'Major Mono Display'}/>
                                    <Text text="COMPRESSION" x={widthPercentage(22)} y={heightPercentage(73)} fontSize={widthPercentage(3)} fontFamily={'Major Mono Display'}/>
                                    <Text text="FAST" x={widthPercentage(23)} y={heightPercentage(85)} fontSize={widthPercentage(2)} fontFamily={'Major Mono Display'}/>
                                        <Circle x={widthPercentage(33.5)} y={heightPercentage(87)} radius={widthPercentage(2)} fill="grey" draggable onDragMove={getCompressionDragMove} onDragEnd={getCompressionSpeed} dragBoundFunc={function(pos){return{x: this.absolutePosition().x, y: this.absolutePosition().y}}}/>
                                        <Circle x={widthPercentage(33.5)} y={heightPercentage(87)} radius={widthPercentage(1)} fill="black" draggable onDragMove={getCompressionDragMove} onDragEnd={getCompressionSpeed} dragBoundFunc={function(pos){return{x: this.absolutePosition().x, y: this.absolutePosition().y}}}/>
                                        <Line ref={compressionLine} x={widthPercentage(33.5)} y={heightPercentage(87)} points={[0,0,0,- widthPercentage(2)]} stroke={'black'} strokeWidth={5} closed={true} lineCap={"round"}/>
                                    <Text text="SLOW" x={widthPercentage(38)} y={heightPercentage(85)} fontSize={widthPercentage(2)} fontFamily={'Major Mono Display'}/>
                                    <Text text="EQ BOOST" x={widthPercentage(60)} y={heightPercentage(73)} fontSize={widthPercentage(3)} fontFamily={'Major Mono Display'}/>
                                    <Text text="NONE" x={widthPercentage(64.5)} y={heightPercentage(79.5)} fontSize={widthPercentage(1.5)} fontFamily={'Major Mono Display'}/>
                                    <Text text="BASS" x={widthPercentage(59)} y={heightPercentage(86)} fontSize={widthPercentage(1.5)} fontFamily={'Major Mono Display'}/>
                                        <Circle x={widthPercentage(66.5)} y={heightPercentage(88)} radius={widthPercentage(2)} fill="grey" draggable onDragMove={getEQBoostDragMove} onDragEnd={getEQBoostSetting} dragBoundFunc={function(pos){return{x: this.absolutePosition().x, y: this.absolutePosition().y}}}/>
                                        <Circle x={widthPercentage(66.5)} y={heightPercentage(88)} radius={widthPercentage(1)} fill="black" draggable onDragMove={getEQBoostDragMove} onDragEnd={getEQBoostSetting} dragBoundFunc={function(pos){return{x: this.absolutePosition().x, y: this.absolutePosition().y}}}/>
                                        <Line ref={eqBoostLine} x={widthPercentage(66.5)} y={heightPercentage(88)} points={[0,0,0,- widthPercentage(2)]} stroke={'black'} strokeWidth={5} closed={true} lineCap={"round"}/>
                                    <Text text="TREBLE" x={widthPercentage(69.5)} y={heightPercentage(86)} fontSize={widthPercentage(1.5)} fontFamily={'Major Mono Display'}/>

                                    <Text text="Click To" x={widthPercentage(3)} y={heightPercentage(26)} fontSize={widthPercentage(1)} fontFamily={'Major Mono Display'} opacity={context ? 0 : 1}/>
                                    <Text text="Enable" x={widthPercentage(3)} y={heightPercentage(28)} fontSize={widthPercentage(1)} fontFamily={'Major Mono Display'} opacity={context ? 0 : 1}/>
                                        <Circle x={widthPercentage(7)} y={heightPercentage(35)} radius={widthPercentage(2)} fill="grey" onClick={handleContext} opacity={context ? 0 : 1}/>
                                        <Circle x={widthPercentage(7)} y={heightPercentage(35)} radius={widthPercentage(1)} fill="black" onClick={handleContext} opacity={context ? 0 : 1}/>
                                    <Text text="User Audio" x={widthPercentage(1)} y={heightPercentage(40)} fontSize={widthPercentage(2)} fontFamily={'Major Mono Display'} opacity={context ? 0 : 1}/>
                </Layer>
            </Stage>
        </div>
    )
}

export default ShowerPowerDisplay;
