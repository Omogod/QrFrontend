/* eslint-disable no-undef */
import React, { useState, useEffect, useRef } from "react";
import axios from "axios";
import jsQR from "jsqr";

const QRPage = () => {
  const [qrCode, setQrCode] = useState("");
  const [movies, setMovies] = useState([]);
  const [scanner, setScanner] = useState(null);
  const [url, setUrl] = useState("");
  const canvasRef = useRef();
  const videoRef = useRef();

  useEffect(() => {
    const fetchData = async () => {
      const data = await axios.get("http://localhost:3002/qr/qrcode");
      console.log(data);
      setQrCode(data.data.qr);
    };
    const intervalId = setInterval(() => {
      fetchData();
    }, 10000);

    return () => {
      clearInterval(intervalId);
    };
  }, []);


  useEffect(() => {
    if (scanner === null) {
      setScanner(true);
    }
  }, [scanner]);

  useEffect(() => {
    const scan = async () => {
      if (scanner) {
        const stream = await navigator.mediaDevices.getDisplayMedia({
          video: true,
        });
        videoRef.current.srcObject = stream;
        videoRef.current.addEventListener("loadedmetadata", () => {
          canvasRef.current.width = videoRef.current.videoWidth;
          canvasRef.current.height = videoRef.current.videoHeight;
        });
      }
    };
    scan();
  }, [scanner]);

  useEffect(() => {
    const decode = () => {
      if (scanner) {
        canvasRef.current.getContext("2d").drawImage(videoRef.current, 0, 0);
        const imageData = canvasRef.current
          .getContext("2d")
          .getImageData(
            0,
            0,
            canvasRef.current.width,
            canvasRef.current.height
          );
        const code = jsQR(imageData.data, imageData.width, imageData.height);
        if (code) {
          alert(code.data);
          const fetchMovies = async () => {
            // if(url)
            await axios
              .get(code.data)
              .then((res) => setMovies(res.data.Search));
            //   setMovies(res.data);
            console.log(movies);
          };
          const intervalId = setInterval(() => {
            fetchMovies();
          }, 10000);

          return () => {
            clearInterval(intervalId);
          };
        }
      }
      requestAnimationFrame(decode);
    };
    decode();
  }, [scanner, movies]);

  return (
    <div>
      <img src={qrCode} alt="QR code" />
      <video ref={videoRef} autoPlay />
      <canvas ref={canvasRef} />
      <ul>
        {movies.map((movie, index) => (
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
