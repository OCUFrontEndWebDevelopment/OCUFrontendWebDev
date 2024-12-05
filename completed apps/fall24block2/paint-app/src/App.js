import React, { useRef, useState, useEffect } from 'react';
import 'tailwindcss/tailwind.css'; // Assuming you have Tailwind CSS set up

const ErrorAlert = ({ children }) => (
  <div className="bg-red-100 border border-red-400 text-red-700 px-4 py-2 rounded relative text-sm">
    {children}
  </div>
);

const BrushSettingsForm = ({
  setLineColor,
  setLineWidth,
  setLineOpacity,
  setImage,
  setScale,
  setRotation,
  setOpacity
}) => {
  const [formValues, setFormValues] = useState({
    color: "#000000",
    width: "5",
    opacity: "10",
    image: null,
    scale: 1,
    rotation: 0
  });

  const [errors, setErrors] = useState({});

  const validateForm = (name, value) => {
    switch (name) {
      case 'width':
        return value >= 3 && value <= 20 ? '' : 'Brush Width must be between 3 and 20';
      case 'opacity':
        return value >= 1 && value <= 100 ? '' : 'Brush Opacity must be between 1 and 100';
      case 'scale':
        return value >= 0.1 && value <= 3 ? '' : 'Scale must be between 0.1 and 3';
      case 'rotation':
        return value >= 0 && value <= 360 ? '' : 'Rotation must be between 0 and 360 degrees';
      default:
        return '';
    }
  };

  const handleChange = (e) => {
    const { name, value, type, files } = e.target;
    const newValue = type === 'file' ? files[0] : value;
    const error = validateForm(name, newValue);

    setFormValues(prev => ({
      ...prev,
      [name]: newValue
    }));

    setErrors(prev => ({
      ...prev,
      [name]: error
    }));

    if (!error) {
      switch (name) {
        case 'color':
          setLineColor(newValue);
          break;
        case 'width':
          setLineWidth(newValue);
          break;
        case 'opacity':
          setLineOpacity(newValue / 100);
          break;
        case 'image':
          setImage(newValue);
          break;
        case 'scale':
          setScale(newValue);
          break;
        case 'rotation':
          setRotation(newValue);
          break;
        default:
          console.warn(`Unexpected form field: ${name}`);
      }
    }
  };

  return (
    <form className="flex flex-col items-center">
      <div className="mb-4">
        <label className="block text-gray-700 text-sm font-bold mb-2" htmlFor="color">
          Brush Color
        </label>
        <input 
          type="color" 
          name="color" 
          id="color" 
          value={formValues.color} 
          onChange={handleChange} 
          className="border rounded p-2"
        />
      </div>
      <div className="mb-4">
        <label className="block text-gray-700 text-sm font-bold mb-2" htmlFor="width">
          Brush Width
        </label>
        <input 
          type="number" 
          name="width" 
          id="width" 
          value={formValues.width} 
          min="3" 
          max="20" 
          onChange={handleChange} 
          className="border rounded p-2"
        />
        {errors.width && <ErrorAlert>{errors.width}</ErrorAlert>}
      </div>
      <div className="mb-4">
        <label className="block text-gray-700 text-sm font-bold mb-2" htmlFor="opacity">
          Brush Opacity
        </label>
        <input 
          type="number" 
          name="opacity" 
          id="opacity" 
          value={formValues.opacity} 
          min="1" 
          max="100" 
          onChange={handleChange} 
          className="border rounded p-2"
        />
        {errors.opacity && <ErrorAlert>{errors.opacity}</ErrorAlert>}
      </div>
      <div className="mb-4">
        <label className="block text-gray-700 text-sm font-bold mb-2" htmlFor="image">
          Upload Image Stamp
        </label>
        <input 
          type="file" 
          name="image" 
          id="image" 
          accept="image/*" 
          onChange={handleChange} 
          className="border rounded p-2"
        />
        {formValues.image && (
          <div className="mt-2">
            <img src={URL.createObjectURL(formValues.image)} alt="preview" className="w-24 h-24" />
          </div>
        )}
      </div>
      <div className="mb-4">
        <label className="block text-gray-700 text-sm font-bold mb-2" htmlFor="scale">
          Stamp Scale
        </label>
        <input 
          type="number" 
          name="scale" 
          id="scale" 
          value={formValues.scale} 
          min="0.1" 
          max="3" 
          step="0.1" 
          onChange={handleChange} 
          className="border rounded p-2"
        />
        {errors.scale && <ErrorAlert>{errors.scale}</ErrorAlert>}
      </div>
      <div className="mb-4">
        <label className="block text-gray-700 text-sm font-bold mb-2" htmlFor="rotation">
          Stamp Rotation
        </label>
        <input 
          type="number" 
          name="rotation" 
          id="rotation" 
          value={formValues.rotation} 
          min="0" 
          max="360" 
          step="1" 
          onChange={handleChange} 
          className="border rounded p-2"
        />
        {errors.rotation && <ErrorAlert>{errors.rotation}</ErrorAlert>}
      </div>
    </form>
  );
};

const App = () => {
  const canvasRef = useRef(null);
  const ctxRef = useRef(null);
  const [isDrawing, setIsDrawing] = useState(false);
  
  const [lineWidth, setLineWidth] = useState(5);
  const [lineColor, setLineColor] = useState("black");
  const [lineOpacity, setLineOpacity] = useState(0.1);
  const [image, setImage] = useState(null);
  const [scale, setScale] = useState(1);
  const [rotation, setRotation] = useState(0);

  useEffect(() => {
    const canvas = canvasRef.current;
    const ctx = canvas.getContext("2d");
    ctx.lineCap = "round";
    ctx.lineJoin = "round";
    ctx.globalAlpha = lineOpacity;
    ctx.strokeStyle = lineColor;
    ctx.lineWidth = lineWidth;
    ctxRef.current = ctx;
  }, [lineColor, lineOpacity, lineWidth]);

  const startDrawing = (e) => {
    ctxRef.current.beginPath();
    ctxRef.current.moveTo(
      e.nativeEvent.offsetX,
      e.nativeEvent.offsetY
    );
    setIsDrawing(true);
  };

  const endDrawing = () => {
    ctxRef.current.closePath();
    setIsDrawing(false);
  };

  const draw = (e) => {
    if (!isDrawing) return;
    ctxRef.current.lineTo(
      e.nativeEvent.offsetX,
      e.nativeEvent.offsetY
    );
    ctxRef.current.stroke();
  };

  const drawStamp = () => {
    if (image) {
      const img = new Image();
      img.src = URL.createObjectURL(image);
      img.onload = () => {
        const ctx = ctxRef.current;
        ctx.save();
        ctx.translate(640, 360); // Center the image
        ctx.rotate((rotation * Math.PI) / 180); // Convert degrees to radians
        ctx.scale(scale, scale); // Scale the image
        ctx.globalAlpha = lineOpacity; // Apply opacity
        ctx.drawImage(img, -img.width / 2, -img.height / 2); // Center image
        ctx.restore();
      };
    }
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-gray-50 to-gray-100 flex flex-col items-center">
      <h1 className="font-['Lobster'] text-5xl text-blue-600 my-6">Paint App</h1>
      <div className="bg-white border-2 border-gray-300 rounded-lg p-4">
        <BrushSettingsForm
          setLineColor={setLineColor}
          setLineWidth={setLineWidth}
          setLineOpacity={setLineOpacity}
          setImage={setImage}
          setScale={setScale}
          setRotation={setRotation}
        />
      </div>
      <div className="my-8">
        <canvas
          ref={canvasRef}
          width={1280}
          height={720}
          className="border border-gray-400"
          onMouseDown={startDrawing}
          onMouseMove={draw}
          onMouseUp={endDrawing}
          onMouseOut={endDrawing}
        />
        {image && drawStamp()}
      </div>
    </div>
  );
};

export default App;
