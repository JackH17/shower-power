import React, { useEffect, useRef } from 'react'

const getPixelRatio = context => {

    var backingStore =
    context.backingStorePixelRatio ||
    context.webkitBackingStorePixelRatio ||
    context.mozBackingStorePixelRatio ||
    context.msBackingStorePixelRatio ||
    context.oBackingStorePixelRatio ||
    context.backingStorePixelRatio ||
    1;

    return (window.devicePixelRatio || 1) / backingStore;
};

const Visualizer = ({analyser}) => {

    let canvasRef = useRef();

    const DATA = new Uint8Array(analyser.frequencyBinCount);
    const LENGTH = DATA.length;

    useEffect(() => {

        let H;
        let W;
        let h;
        let x;

        let canvas = canvasRef.current;
   
        let context = canvas.getContext('2d');

        let ratio = getPixelRatio(context);
        let width = getComputedStyle(canvas).getPropertyValue('width').slice(0, -2);
        let height = getComputedStyle(canvas).getPropertyValue('height').slice(0, -2);

        W = canvas.width = width * ratio;
        H = canvas.height = height * ratio;

        h = H / LENGTH;
        x = W - 1;

        canvas.style.width = `${width}px`;
        canvas.style.height = `${height}px`;

        let requestID;

        const render = () => {

            let imageData = context.getImageData(1, 0, W - 1, H);
            context.clearRect(0, 0, canvas.width, canvas.height);
            context.putImageData(imageData, 0, 0)
        

            analyser.getByteFrequencyData(DATA);

            for(let i = 0; i < LENGTH; i++){
                
                let rat = DATA[i] / 255;


                context.strokeStyle = `rgba(${rat}, ${rat}, ${rat}, ${rat})`
                context.beginPath();
                context.lineWidth = 5;
                context.moveTo(x, H - (i * h));
                context.lineTo(x, H - (i * h + h));
                context.stroke();
            }

            requestID = requestAnimationFrame(render);
        };

        render();

        return(() => {
            cancelAnimationFrame(requestID);
        })

    })



    return (
        <canvas className="visualizer" ref={canvasRef} style={{ width: '80%', height: '100px' }}/>
    )
};

export default Visualizer;

