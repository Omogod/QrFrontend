/* eslint-disable no-undef */
import React, { useState, useEffect, useRef } from 'react';
import axios from 'axios';
import jsQR from 'jsqr';

const QRPage = () => {
  const [qrCode, setQrCode] = useState('');
  const [movies, setMovies] = useState([]);
  const [scanner, setScanner] = useState(null);
  const [url, setUrl] = useState('');
  const canvasRef = useRef();

  useEffect(() => {
    const fetchData = async () => {
      const data = await axios.get('http://localhost:3000/qr/qrcode');
      console.log(data)
      setQrCode(data.data.qr);
    };
    const intervalId = setInterval(() => {
        fetchData();
      }, 10000);
  
      return () => {
        clearInterval(intervalId);
      };
  }, []);



//   useEffect(() => {
//     const intervalId = setInterval(() => {
//       fetchData();
//       fetchMovies();
//     }, 10000);

//     return () => {
//       clearInterval(intervalId);
//     };
//   }, []);


// useEffect(() => {
//     if (scanner === null) {
//       navigator.mediaDevices
//         .getUserMedia({ video: { facingMode: 'environment' } })
//         .then(stream => {
//           videoRef.current.srcObject = stream;
//         });
//     }
//   }, [scanner]);

useEffect(() => {
    if (scanner === null) {
      setScanner(true);
    }
  }, [scanner]);

//   useEffect(() => {
//     const scan = () => {
//       if (videoRef.current.readyState === videoRef.current.HAVE_ENOUGH_DATA) {
//         const canvas = document.createElement('canvas');
//         canvas.width = videoRef.current.videoWidth;
//         canvas.height = videoRef.current.videoHeight;
//         canvas.getContext('2d').drawImage(videoRef.current, 0, 0);
//         const imageData = canvas.getContext('2d').getImageData(
//           0,
//           0,
//           canvas.width,
//           canvas.height
//         );
//         const code = jsQR(imageData.data, imageData.width, imageData.height);
//         if (code) {
//           alert(code.data);
//         //   console.log(code.data);
//         //   setUrl(code.data);
//           const fetchMovies = async () => {

//             // if(url)
//           await axios.get(code.data).then(res =>   setMovies(res.data.Search) )
//         //   setMovies(res.data);
//           console.log(movies)
       
//         };
//         const intervalId = setInterval(() => {
//             fetchMovies();
//           }, 10000);
      
//           return () => {
//             clearInterval(intervalId);
//           };
//         }
//       }
//       requestAnimationFrame(scan);
//     };
//     scan();
    
//   }, [movies]);


//   useEffect(() => {

//   }, [movies]);
useEffect(() => {
    const scan = async () => {
      if (scanner) {
        const screen = await navigator.mediaDevices.getDisplayMedia({
          video: true,
        });
        canvasRef.current.getContext('2d').drawImage(screen, 0, 0);
        const imageData = canvasRef.current.getContext('2d').getImageData(
          0,
          0,
          canvasRef.current.width,
          canvasRef.current.height
        );
        const code = jsQR(imageData.data, imageData.width, imageData.height);
        if (code) {
          alert(code.data);
        //   const fetchMovies = async () => {

        //   await axios.get(code.data).then(res =>   setMovies(res.data.Search) )
        //   console.log(movies)
       
        };
    //     const intervalId = setInterval(() => {
    //         fetchMovies();
    //       }, 10000);
      
    //       return () => {
    //         clearInterval(intervalId);
    //       };
    //     }
      }
      requestAnimationFrame(scan);
    };
    scan();
  }, [scanner]);



  return (
    <div>
      <img src={qrCode} alt="QR code" />
      <canvas ref={canvasRef} width={window.innerWidth} height={window.innerHeight} />
      <ul>
        { movies.map((movie, index) => (
          <li key={index}>
            {movie.Title}
            <img src={movie.Poster} alt={movie.Title} />
          </li>
        ))}
      </ul>
    </div>
  );
};

export default QRPage;



