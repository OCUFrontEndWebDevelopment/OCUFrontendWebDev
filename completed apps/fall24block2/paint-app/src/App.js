<<<<<<< HEAD
/* eslint-disable no-undef */

import { useRef, useState, useEffect } from "react";

// Brush Classes

/** Basic Brush: Simple continuous lines */
class Brush {
  constructor(ctx) {
    this.ctx = ctx;
  }

  draw(x, y) {
    this.ctx.lineTo(x, y);
    this.ctx.stroke();
  }
}

/** Pen Brush: Mimics handwriting with precise strokes */
class PenBrush extends Brush {
  draw(x, y) {
    this.ctx.lineTo(x, y);
    this.ctx.stroke();
  }
}

/** AirBrush: Simulates spray paint */
class AirBrush extends Brush {
  constructor(ctx) {
    super(ctx);
    this.sprayInterval = null;
    this.currentX = 0;
    this.currentY = 0;
  }

  start(x, y) {
    this.currentX = x;
    this.currentY = y;
    this.spray();
    this.sprayInterval = setInterval(() => this.spray(), 50);
  }

  spray() {
    const density = 30;
    const radius = 15;
    for (let i = 0; i < density; i++) {
      const angle = Math.random() * Math.PI * 2;
      const distance = Math.random() * radius;
      const offsetX = Math.cos(angle) * distance;
      const offsetY = Math.sin(angle) * distance;
      this.ctx.beginPath();
      this.ctx.arc(
        this.currentX + offsetX,
        this.currentY + offsetY,
        1,
        0,
        Math.PI * 2
      );
      this.ctx.fill();
    }
  }

  stop() {
    clearInterval(this.sprayInterval);
  }

  draw(x, y) {
    this.currentX = x;
    this.currentY = y;
  }
}

/** Calligraphy Pen: Simulates angled strokes */
class CalligraphyPen extends Brush {
  draw(x, y) {
    const { ctx } = this;
    const width = 10;
    const angle = Math.PI / 6;
    const dx = width * Math.cos(angle);
    const dy = width * Math.sin(angle);
    ctx.beginPath();
    ctx.moveTo(x - dx, y - dy);
    ctx.lineTo(x + dx, y + dy);
    ctx.stroke();
  }
}

/** Eraser: Removes content by making it transparent */
class Eraser extends Brush {
  draw(x, y) {
    this.ctx.globalCompositeOperation = "destination-out";
    super.draw(x, y);
    this.ctx.globalCompositeOperation = "source-over";
  }
}

/** Pattern Brush: Repeated shapes (e.g., circles) */
class PatternBrush extends Brush {
  draw(x, y) {
    const { ctx } = this;
    ctx.beginPath();
    ctx.arc(x, y, 10, 0, 2 * Math.PI);
    ctx.fill();
  }
}

// App Component

const App = () => {
  const canvasRef = useRef(null);
  const ctxRef = useRef(null);
  const [isDrawing, setIsDrawing] = useState(false);
  const [lineWidth, setLineWidth] = useState(5);
  const [lineColor, setLineColor] = useState("#000000");
  const [lineOpacity, setLineOpacity] = useState(1);
  const [brushType, setBrushType] = useState("Basic");

  const defaultBrushColors = {
    Select: "#000000",
    Pen: "#1a1a1a",
    AirBrush: "#ff0000",
    CalligraphyPen: "#0066cc",
    Eraser: "#ffffff",
    PatternBrush: "#00cc66",
  };

  const brushes = useRef({
    Select: new Brush(null),
    Pen: new PenBrush(null),
    AirBrush: new AirBrush(null),
    CalligraphyPen: new CalligraphyPen(null),
    Eraser: new Eraser(null),
    PatternBrush: new PatternBrush(null),
  });

  useEffect(() => {
    const canvas = canvasRef.current;
    const ctx = canvas.getContext("2d");
    ctx.lineCap = "round";
    ctx.lineJoin = "round";
    ctx.globalAlpha = lineOpacity;
    ctx.strokeStyle = lineColor;
    ctx.fillStyle = lineColor;
    ctx.lineWidth = lineWidth;
    ctxRef.current = ctx;

    Object.values(brushes.current).forEach((brush) => (brush.ctx = ctx));
  }, [lineColor, lineOpacity, lineWidth]);

  const startDrawing = (e) => {
    const x = e.nativeEvent.offsetX;
    const y = e.nativeEvent.offsetY;
    setIsDrawing(true);

    if (brushType === "AirBrush") {
      brushes.current.AirBrush.start(x, y);
    } else {
      ctxRef.current.beginPath();
      ctxRef.current.moveTo(x, y);
    }
  };

  const endDrawing = () => {
    setIsDrawing(false);

    if (brushType === "AirBrush") {
      brushes.current.AirBrush.stop();
    } else {
      ctxRef.current.closePath();
    }
  };

  const draw = (e) => {
    if (!isDrawing) return;
    const x = e.nativeEvent.offsetX;
    const y = e.nativeEvent.offsetY;

    const selectedBrush = brushes.current[brushType];
    if (selectedBrush) {
      selectedBrush.draw(x, y);
    }
  };

  const BrushSettingsForm = ({
    setLineColor,
    setLineWidth,
    setLineOpacity,
    setBrushType,
  }) => {
    const [formValues, setFormValues] = useState({
      color: defaultBrushColors.Basic,
      width: "5",
      opacity: "100",
      brush: "Basic",
    });

    const handleChange = (e) => {
      const { name, value } = e.target;

      setFormValues((prev) => ({
        ...prev,
        [name]: value,
      }));

      switch (name) {
        case "color":
          setLineColor(value);
          break;
        case "width":
          setLineWidth(value);
          break;
        case "opacity":
          setLineOpacity(value / 100);
          break;
        case "brush":
          setBrushType(value);
          setLineColor(defaultBrushColors[value]); // Update brush color
          setFormValues((prev) => ({
            ...prev,
            color: defaultBrushColors[value], // Update color picker value
          }));
          break;
        default:
          break;
=======
import { useRef, useState, useEffect } from "react";

const App = () => {
  const canvasRef = useRef(null);
  const ctxRef = useRef(null);
  const [isDrawing, setIsDrawing] = useState(false);
  const [lineWidth, setLineWidth] = useState(5);
  const [lineColor, setLineColor] = useState("black");
  const [lineOpacity, setLineOpacity] = useState(0.1);

  // Undo/Redo stacks
  const [undoStack, setUndoStack] = useState([]);
  const [redoStack, setRedoStack] = useState([]);

  useEffect(() => {
    const canvas = canvasRef.current;
    const ctx = canvas.getContext("2d");
    ctx.lineCap = "round";
    ctx.lineJoin = "round";
    ctx.globalAlpha = lineOpacity;
    ctx.strokeStyle = lineColor;
    ctx.lineWidth = lineWidth;
    ctxRef.current = ctx;

    // Save initial state to undo stack
    saveState();
  }, [lineColor, lineOpacity, lineWidth]);

  const saveState = () => {
    const canvas = canvasRef.current;
    const dataUrl = canvas.toDataURL();
    setUndoStack((prev) => [...prev, dataUrl]);
  };

  const restoreState = (dataUrl) => {
    const canvas = canvasRef.current;
    const ctx = canvas.getContext("2d");
    const img = new Image();
    img.src = dataUrl;
    img.onload = () => {
      // Reset the canvas before restoring the image
      ctx.clearRect(0, 0, canvas.width, canvas.height);
  
      // Temporarily reset globalAlpha to avoid transparency stacking
      const currentAlpha = ctx.globalAlpha;
      ctx.globalAlpha = 1;
  
      ctx.drawImage(img, 0, 0);
  
      // Restore globalAlpha to its original value
      ctx.globalAlpha = currentAlpha;
    };
  };
  

  const startDrawing = (e) => {
    ctxRef.current.beginPath();
    ctxRef.current.moveTo(e.nativeEvent.offsetX, e.nativeEvent.offsetY);
    setIsDrawing(true);
  };

  const endDrawing = () => {
    if (isDrawing) {
      ctxRef.current.closePath();
      setIsDrawing(false);
      saveState(); // Save state after completing a stroke
      setRedoStack([]); // Clear redo stack after a new drawing action
    }
  };

  const draw = (e) => {
    if (!isDrawing) return;
    ctxRef.current.lineTo(e.nativeEvent.offsetX, e.nativeEvent.offsetY);
    ctxRef.current.stroke();
  };

  const handleUndo = () => {
    if (undoStack.length > 1) {
      const newUndoStack = [...undoStack];
      const lastState = newUndoStack.pop();
      setRedoStack((prev) => [lastState, ...prev]);
      setUndoStack(newUndoStack);
      restoreState(newUndoStack[newUndoStack.length - 1]);
    }
  };

  const handleRedo = () => {
    if (redoStack.length > 0) {
      const newRedoStack = [...redoStack];
      const nextState = newRedoStack.shift();
      setRedoStack(newRedoStack);
      setUndoStack((prev) => [...prev, nextState]);
      restoreState(nextState);
    }
  };

  const StyledMenu = ({ className, children }) => (
    <div
      className={`${className} bg-gray-200/20 rounded-md p-4 mb-4 w-[650px] flex justify-evenly items-center`}
    >
      {children}
    </div>
  );

  const ErrorAlert = ({ children }) => (
    <div className="bg-red-100 border border-red-400 text-red-700 px-4 py-2 rounded relative text-sm">
      {children}
    </div>
  );

  const BrushSettingsForm = ({ setLineColor, setLineWidth, setLineOpacity }) => {
    const [formValues, setFormValues] = useState({
      color: "#000000",
      width: "5",
      opacity: "10",
    });
    const [errors, setErrors] = useState({});

    const validateForm = (name, value) => {
      switch (name) {
        case "width":
          return value >= 3 && value <= 20 ? "" : "Width must be between 3 and 20";
        case "opacity":
          return value >= 1 && value <= 100 ? "" : "Opacity must be between 1 and 100";
        default:
          return "";
      }
    };

    const handleChange = (e) => {
      const { name, value } = e.target;
      const error = validateForm(name, value);
      setFormValues((prev) => ({
        ...prev,
        [name]: value,
      }));
      setErrors((prev) => ({
        ...prev,
        [name]: error,
      }));

      if (!error) {
        switch (name) {
          case "color":
            setLineColor(value);
            break;
          case "width":
            setLineWidth(value);
            break;
          case "opacity":
            setLineOpacity(value / 100);
            break;
          default:
            console.warn(`Unhandled property: ${name}`);
            break;
        }
>>>>>>> 186e7b6bb742a7dd3286850cfed705ffe180561a
      }
    };

    return (
      <div className="space-y-4">
<<<<<<< HEAD
        <div className="bg-gray-200/20 rounded-md p-4 mb-4 w-[650px] flex justify-evenly items-center">
          <div>
            <label className="block text-sm font-medium">Brush Type</label>
            <select
              name="brush"
              value={formValues.brush}
              onChange={handleChange}
              className="block border border-gray-300 rounded p-2"
            >
              {Object.keys(defaultBrushColors).map((brush) => (
                <option key={brush} value={brush}>
                  {brush}
                </option>
              ))}
            </select>
          </div>

          <div>
            <label className="block text-sm font-medium">Brush Color</label>
            <input
              type="color"
              name="color"
              value={formValues.color}
              onChange={handleChange}
              className="h-8 w-16"
            />
          </div>

          <div>
            <label className="block text-sm font-medium">
              Brush Width ({formValues.width}px)
            </label>
            <input
              type="range"
              name="width"
              min="3"
              max="20"
              value={formValues.width}
              onChange={handleChange}
              className="w-32"
            />
          </div>

          <div>
            <label className="block text-sm font-medium">
              Brush Opacity ({formValues.opacity}%)
            </label>
            <input
              type="range"
              name="opacity"
              min="1"
              max="100"
              value={formValues.opacity}
              onChange={handleChange}
              className="w-32"
            />
          </div>
        </div>
      </div>
    );
  };

=======
        <StyledMenu>
          <div className="space-y-2">
            <label className="block text-sm font-medium">Brush Color</label>
            <input
              type="color"
              name="color"
              value={formValues.color}
              onChange={handleChange}
              className="h-8 w-16"
            />
          </div>
          <div>
            <label className="block text-sm font-medium">
              Brush Width ({formValues.width}px)
            </label>
            <input
              type="range"
              name="width"
              min="3"
              max="20"
              value={formValues.width}
              onChange={handleChange}
              className="w-32"
            />
            {errors.width && <ErrorAlert>{errors.width}</ErrorAlert>}
          </div>
          <div className="space-y-2">
            <label className="block text-sm font-medium">
              Brush Opacity ({formValues.opacity}%)
            </label>
            <input
              type="range"
              name="opacity"
              min="1"
              max="100"
              value={formValues.opacity}
              onChange={handleChange}
              className="w-32"
            />
            {errors.opacity && <ErrorAlert>{errors.opacity}</ErrorAlert>}
          </div>
        </StyledMenu>
      </div>
    );
  };

>>>>>>> 186e7b6bb742a7dd3286850cfed705ffe180561a
  return (
    <div className="min-h-screen bg-gradient-to-br from-gray-50 to-gray-100 flex flex-col items-center">
      <h1 className="font-['Lobster'] text-5xl text-blue-600 my-6">Paint App</h1>
      <div className="bg-white border-2 border-gray-300 rounded-lg p-4">
        <BrushSettingsForm
          setLineColor={setLineColor}
          setLineWidth={setLineWidth}
          setLineOpacity={setLineOpacity}
<<<<<<< HEAD
          setBrushType={setBrushType}
        />
=======
        />
        <div className="flex space-x-4 mb-4">
          <button
            onClick={handleUndo}
            className="px-4 py-2 bg-blue-500 text-white rounded shadow hover:bg-blue-600"
          >
            Undo
          </button>
          <button
            onClick={handleRedo}
            className="px-4 py-2 bg-green-500 text-white rounded shadow hover:bg-green-600"
          >
            Redo
          </button>
        </div>
>>>>>>> 186e7b6bb742a7dd3286850cfed705ffe180561a
        <canvas
          onMouseDown={startDrawing}
          onMouseUp={endDrawing}
          onMouseMove={draw}
          ref={canvasRef}
          width={1280}
          height={720}
          className="border border-gray-200"
        />
      </div>
    </div>
  );
};

export default App;
