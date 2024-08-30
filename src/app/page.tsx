"use client"


import React, { useRef, useState, useEffect } from 'react';
import Select from 'react-select';

const cropOptions = [
  { value: 'pigeon_peas', label: 'Pigeon Peas', regions: ['Ruvuma', 'Mtwara', 'Lindi'] },
  { value: 'coffee', label: 'Coffee', regions: ['Iringa', 'Mbeya', 'Rukwa'] },
  { value: 'sesame', label: 'Sesame Seeds', regions: ['Morogoro', 'Mwanza', 'Shinyanga'] },
  { value: 'soya', label: 'Soya Beans', regions: ['Arusha', 'Manyara', 'Kilimanjaro'] },
  { value: 'bean', label: 'Beans', regions: ['Dodoma', 'Singida', 'Tabora'] },
  { value: 'chick_peas', label: 'Chick Peas', regions: ['Ruvuma', 'Iringa', 'Mbeya'] },
  { value: 'cocoa', label: 'Cocoa', regions: ['Singida', 'Dodoma', 'Manyara'] },
];

const CanvasComponent = () => {
  const canvasRef = useRef(null);
  const [auctionDate, setAuctionDate] = useState(new Date(Date.now() + 7 * 24 * 60 * 60 * 1000));
  const [auctionTime, setAuctionTime] = useState('10:00');
  const [selectedCrops, setSelectedCrops] = useState([]);
  const [description, setDescription] = useState('');
  const [image, setImage] = useState(null);
  const [positions, setPositions] = useState({
    header: { x: 40, y: 60 },
    image: { x: 0, y: 100 },
    crops: { x: 40, y: 720 },
    description: { x: 40, y: 780 },
    dataCircle: { x: 60, y: 160 },
    footer: { x: 500, y: 960 },
  });

  const generateDescription = (crops) => {
    if (crops.length === 0) return '';

    const cropDetails = crops.map(crop => `${crop.label} in ${crop.region}`).join(', ');
    const auctionDate = new Date(Date.now() + 7 * 24 * 60 * 60 * 1000).toLocaleDateString('en-US', { weekday: 'long', year: 'numeric', month: 'long', day: 'numeric' });

    return `TMX, COPRA, WRRB, TCDC and the Regional and District Government Authorities hereby invite you to participate in the auction for ${cropDetails}. The auction will take place on ${auctionDate} at 10:00 am through the TMX Online Trading System. All interested parties are welcome to participate.`;
  };

  useEffect(() => {
    setDescription(generateDescription(selectedCrops));
  }, [selectedCrops]);

  const drawCanvas = () => {
    const canvas = canvasRef.current;
    const ctx = canvas.getContext('2d');

    // Clear canvas
    ctx.clearRect(0, 0, canvas.width, canvas.height);

    // Draw background
    ctx.fillStyle = '#f1f5f9';
    ctx.fillRect(0, 0, canvas.width, canvas.height);

    // Draw header
    ctx.font = '32px Arial';
    ctx.fillStyle = 'black';
    ctx.fillText('L-L', positions.header.x, positions.header.y);
    ctx.fillText('Middle text', canvas.width / 2 - 80, positions.header.y);
    ctx.fillText('L-R', canvas.width - 100, positions.header.y);

    // Draw image
    if (image) {
      ctx.drawImage(image, positions.image.x, positions.image.y, canvas.width, 560);
    } else {
      ctx.fillStyle = '#e2e8f0';
      ctx.fillRect(positions.image.x, positions.image.y, canvas.width, 560);
      ctx.font = '40px Arial';
      ctx.fillStyle = 'black';
      ctx.fillText('Placeholder Image', canvas.width / 2 - 140, positions.image.y + 280);
    }

    // Draw Circle
    const {x, y} = positions.dataCircle;
    const radius = 50;
    ctx.beginPath();
    ctx.arc(x, y, radius, 0, 2 * Math.PI);
    ctx.fillstyle = "#2dd4bf"
    ctx.font = '16px Arial';

    // Draw selected crops
    ctx.font = 'bold 48px Arial';
    ctx.fillStyle = 'black';
    const cropsText = selectedCrops.map(crop => crop.label).join(', ');
    ctx.fillText(cropsText, positions.crops.x, positions.crops.y, canvas.width - 80);

    // Draw description
    ctx.font = '28px Arial';
    const wrapText = (context, text, x, y, maxWidth, lineHeight) => {
      const words = text.split(' ');
      let line = '';

      for (let n = 0; n < words.length; n++) {
        const testLine = line + words[n] + ' ';
        const metrics = context.measureText(testLine);
        const testWidth = metrics.width;
        if (testWidth > maxWidth && n > 0) {
          context.fillText(line, x, y);
          line = words[n] + ' ';
          y += lineHeight;
        } else {
          line = testLine;
        }
      }
      context.fillText(line, x, y);
    };

    wrapText(ctx, description, positions.description.x, positions.description.y, canvas.width - 80, 40);

    // Draw footer
    ctx.fillText('Footer', positions.footer.x, positions.footer.y);
  };

  useEffect(() => {
    drawCanvas();
  }, [selectedCrops, description, image, positions]);

  const handleImageUpload = (e) => {
    const file = e.target.files[0];
    const reader = new FileReader();
    reader.onload = (event) => {
      const img = new Image();
      img.onload = () => {
        setImage(img);
      };
      img.src = event.target.result;
    };
    reader.readAsDataURL(file);
  };

  const handleDownload = () => {
    const canvas = canvasRef.current;
    const dataURL = canvas.toDataURL('image/png');
    const link = document.createElement('a');
    link.href = dataURL;
    link.download = 'canvas_image.png';
    link.click();
  };

  const handlePositionChange = (element, axis, value) => {
    setPositions(prev => ({
      ...prev,
      [element]: {
        ...prev[element],
        [axis]: Number(value)
      }
    }));
  };

  const customStyles = {
    option: (provided, state) => ({
      ...provided,
      display: 'flex',
      alignItems: 'center',
      justifyContent: 'space-between',
    }),
  };

  return (
    <div className="w-full max-w-4xl mx-auto p-4 text-black">
      <div className="flex flex-col md:flex-row justify-between mb-4">
        <div>L-L</div>
        <div>Middle text</div>
        <div>L-R</div>
      </div>
      <div className="overflow-auto mb-4">
        <canvas ref={canvasRef} width={1000} height={1000} className="border border-blue-950" />
      </div>
      <div className="space-y-4">
        <Select
          isMulti
          options={cropOptions}
          value={selectedCrops}
          onChange={setSelectedCrops}
          placeholder="Select crops..."
          className="w-full"
          styles={customStyles}
          formatOptionLabel={({ label, regions }) => (
            <div className="flex justify-between">
              <span>{label}</span>
              <Select
                options={regions.map(region => ({ value: region, label: region }))}
                onChange={(selectedRegion) => {
                  const updatedCrops = selectedCrops.map(crop => 
                    crop.label === label ? { ...crop, region: selectedRegion.value } : crop
                  );
                  setSelectedCrops(updatedCrops);
                }}
                placeholder="Select region"
                className="w-40"
              />
            </div>
          )}
        />
        <textarea
          value={description}
          readOnly
          className="w-full p-2 border rounded h-32"
        />
        <div className="flex flex-col sm:flex-row sm:justify-between space-y-2 sm:space-y-0 sm:space-x-2">
          <input
            type="file"
            accept="image/*"
            onChange={handleImageUpload}
            className="w-full sm:w-auto"
          />
          <button onClick={handleDownload} className="w-full sm:w-auto bg-blue-500 text-white p-2 rounded">
            Download Image
          </button>
        </div>
        <div className="space-y-2">
          <h3 className="font-bold">Position Controls</h3>
          {Object.entries(positions).map(([element, { x, y }]) => (
            <div key={element} className="flex space-x-2">
              <label className="w-24">{element}:</label>
              <input
                type="range"
                min="0"
                max="1000"
                value={x}
                onChange={(e) => handlePositionChange(element, 'x', e.target.value)}
                className="w-1/3"
              />
              <input
                type="range"
                min="0"
                max="1000"
                value={y}
                onChange={(e) => handlePositionChange(element, 'y', e.target.value)}
                className="w-1/3"
              />
              <span>X: {x}, Y: {y}</span>
            </div>
          ))}
        </div>
      </div>
      <div className="mt-4 text-center">Footer</div>
    </div>
  );
};

export default function Home() {
  return (
    <div className="min-h-screen flex justify-center items-center bg-gray-100">
      <CanvasComponent />
    </div>
  );
}