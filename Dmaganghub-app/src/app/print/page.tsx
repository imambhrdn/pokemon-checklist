'use client';

import { useEffect, useState, useRef, useMemo } from 'react';
import { perfectOrderSet } from '@/data/pokemonSet';
import { Circle, Diamond, Star, Sparkles, Crown, Gem, Flame, Hexagon, Download, Printer } from 'lucide-react';
import Link from 'next/link';
import { loadFromLocalStorage, loadLogoFromStorage, loadSetTitleFromStorage } from '@/utils/csvParser';
import type { PokemonCard, Rarity } from '@/data/pokemonSet';
import html2canvas from 'html2canvas';

export default function PrintPage() {
  const [cards, setCards] = useState<PokemonCard[]>(perfectOrderSet);
  const [isCustomData, setIsCustomData] = useState(false);
  const [logo, setLogo] = useState<string | null>(null);
  const [customTitle, setCustomTitle] = useState<string | null>(null);
  const [isExporting, setIsExporting] = useState(false);
  const pageRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    // Load cards
    const customData = loadFromLocalStorage();
    if (customData && customData.length > 0) {
      setCards(customData);
      setIsCustomData(true);
    }

    // Load logo
    const savedLogo = loadLogoFromStorage();
    if (savedLogo) {
      setLogo(savedLogo);
    }

    // Load custom title
    const savedTitle = loadSetTitleFromStorage();
    if (savedTitle) {
      setCustomTitle(savedTitle);
    }
  }, []);

  const getSetTitle = () => {
    if (customTitle) {
      return `Pokémon TCG: ${customTitle} Card List`;
    }
    if (isCustomData) {
      return 'Custom Card Checklist';
    }
    return 'Pokémon TCG: Mega Evolution-Perfect Order Card List';
  };

  // Distribute cards column-first, then transpose for CSS Grid
  const orderedCards = useMemo(() => {
    const numColumns = 3;
    const columns: PokemonCard[][] = Array.from({ length: numColumns }, () => []);

    // Calculate cards per column
    const baseCount = Math.floor(cards.length / numColumns);
    const extra = cards.length % numColumns;

    let index = 0;
    for (let col = 0; col < numColumns; col++) {
      // First 'extra' columns get one extra card
      const countForColumn = baseCount + (col < extra ? 1 : 0);
      for (let row = 0; row < countForColumn; row++) {
        columns[col].push(cards[index++]);
      }
    }

    // Find max column height
    const maxHeight = Math.max(...columns.map(col => col.length));

    // Transpose: convert to rows for CSS Grid (which reads left-to-right)
    const transposed: PokemonCard[] = [];
    for (let row = 0; row < maxHeight; row++) {
      for (let col = 0; col < numColumns; col++) {
        if (row < columns[col].length) {
          transposed.push(columns[col][row]);
        }
      }
    }

    return transposed;
  }, [cards]);

  // Get rarity icon component dengan warna berbeda
  const getRarityIcon = (rarity: Rarity) => {
    switch (rarity) {
      case 'common':
        return <Circle size={11} className="fill-gray-500 text-gray-500" />;
      case 'uncommon':
        return <Diamond size={11} className="fill-green-600 text-green-600" />;
      case 'rare':
        return <Star size={11} className="fill-blue-500 text-blue-500" />;
      case 'double-rare':
        return <Sparkles size={11} className="fill-purple-600 text-purple-600" />;
      case 'illustration-rare':
        return <Crown size={11} className="fill-yellow-500 text-yellow-500" />;
      case 'ultra-rare':
        return <Gem size={11} className="fill-pink-500 text-pink-500" />;
      case 'special-illustration-rare':
        return <Flame size={11} className="fill-orange-500 text-orange-500" />;
      case 'mega-hyper-rare':
        return <Hexagon size={11} className="fill-red-600 text-red-500" stroke="red" strokeWidth={2} />;
      default:
        return <Circle size={11} className="fill-gray-400" />;
    }
  };

  const handleExportPNG = async () => {
    if (!pageRef.current) return;

    setIsExporting(true);
    try {
      const element = pageRef.current;
      const scale = 2;

      // A4 size in mm converted to pixels (at 96 DPI: 1mm = 3.78px, at scale 2: 1mm = 7.56px)
      const A4_WIDTH_MM = 210;
      const A4_HEIGHT_MM = 297;
      const PX_PER_MM = 3.78;
      const pageWidth = Math.round(A4_WIDTH_MM * PX_PER_MM * scale);
      const pageHeight = Math.round(A4_HEIGHT_MM * PX_PER_MM * scale);

      // Get the full height of content
      const fullCanvas = await html2canvas(element, {
        scale,
        useCORS: true,
        logging: false,
        backgroundColor: '#ffffff',
        windowWidth: element.scrollWidth,
        windowHeight: element.scrollHeight,
      });

      const totalPages = Math.ceil(fullCanvas.height / pageHeight);
      const title = customTitle || 'checklist';

      // Download each page
      for (let pageNum = 0; pageNum < totalPages; pageNum++) {
        const startY = pageNum * pageHeight;
        const remainingHeight = Math.min(pageHeight, fullCanvas.height - startY);

        // Create a canvas for this page
        const pageCanvas = document.createElement('canvas');
        pageCanvas.width = pageWidth;
        pageCanvas.height = remainingHeight;
        const ctx = pageCanvas.getContext('2d');

        if (ctx) {
          // Fill white background
          ctx.fillStyle = '#ffffff';
          ctx.fillRect(0, 0, pageWidth, remainingHeight);

          // Copy the portion of the full canvas
          ctx.drawImage(
            fullCanvas,
            0, startY, fullCanvas.width, remainingHeight,
            0, 0, pageWidth, remainingHeight
          );
        }

        // Convert to blob and download
        pageCanvas.toBlob((blob) => {
          if (blob) {
            const url = URL.createObjectURL(blob);
            const a = document.createElement('a');
            a.href = url;
            const pageNumStr = String(pageNum + 1).padStart(2, '0');
            a.download = `${title}-page-${pageNumStr}.png`;
            a.click();
            URL.revokeObjectURL(url);
          }
        });

        // Small delay between downloads
        await new Promise(resolve => setTimeout(resolve, 200));
      }

      setIsExporting(false);
    } catch (error) {
      console.error('Export failed:', error);
      setIsExporting(false);
    }
  };

  return (
    <div className="bg-gray-100 min-h-screen font-sans p-4 print:p-0">

      {/* Kontainer Kertas A4 */}
      <div ref={pageRef} className="w-[210mm] mx-auto bg-white text-[10px] text-black print:w-full print:mx-0 shadow-lg print:shadow-none">

        {/* Header Section */}
        <header className="flex justify-between items-center border-b-2 border-black pb-4 px-4 pt-6">
          {/* Logo or Default Text */}
          <div className="w-36 h-14 bg-green-600 text-white flex items-center justify-center font-black italic rounded-md overflow-hidden">
            {logo ? (
              <img src={logo} alt="Set Logo" className="w-full h-full object-contain bg-white" />
            ) : (
              <span className="text-base">PERFECT ORDER</span>
            )}
          </div>

          <div className="text-center flex-1">
            <h1 className="font-bold text-xl tracking-wide">{getSetTitle()}</h1>
            {isCustomData && (
              <p className="text-gray-500 text-xs mt-1">Total: {cards.length} cards</p>
            )}
          </div>

          <div className="w-28 h-14 bg-yellow-400 text-blue-700 flex items-center justify-center font-black rounded-md">
            <span className="text-sm">Pokémon</span>
          </div>
        </header>

        {/* Legend / Key Section */}
        <div className="px-4 pt-3 pb-4">
          <div className="grid grid-cols-4 gap-2 text-[8px]">
            <div className="flex items-center gap-1 p-1.5 bg-gray-50 rounded border">
              <Circle size={7} className="fill-gray-500 text-gray-500 flex-shrink-0" />
              <span className="leading-tight">Common</span>
            </div>
            <div className="flex items-center gap-1 p-1.5 bg-green-50 rounded border border-green-200">
              <Diamond size={7} className="fill-green-600 text-green-600 flex-shrink-0" />
              <span className="leading-tight">Uncommon</span>
            </div>
            <div className="flex items-center gap-1 p-1.5 bg-blue-50 rounded border border-blue-200">
              <Star size={7} className="fill-blue-500 text-blue-500 flex-shrink-0" />
              <span className="leading-tight">Rare</span>
            </div>
            <div className="flex items-center gap-1 p-1.5 bg-purple-50 rounded border border-purple-200">
              <Sparkles size={7} className="fill-purple-600 text-purple-600 flex-shrink-0" />
              <span className="leading-tight">Double Rare</span>
            </div>
            <div className="flex items-center gap-1 p-1.5 bg-yellow-50 rounded border border-yellow-200">
              <Crown size={7} className="fill-yellow-500 text-yellow-500 flex-shrink-0" />
              <span className="leading-tight">Illustration Rare</span>
            </div>
            <div className="flex items-center gap-1 p-1.5 bg-pink-50 rounded border border-pink-200">
              <Gem size={7} className="fill-pink-500 text-pink-500 flex-shrink-0" />
              <span className="leading-tight">Ultra Rare</span>
            </div>
            <div className="flex items-center gap-1 p-1.5 bg-orange-50 rounded border border-orange-200">
              <Flame size={7} className="fill-orange-500 text-orange-500 flex-shrink-0" />
              <span className="leading-tight">Special Illustration Rare</span>
            </div>
            <div className="flex items-center gap-1 p-1.5 bg-red-50 rounded border border-red-200">
              <Hexagon size={7} className="fill-red-600 text-red-600 flex-shrink-0" />
              <span className="leading-tight">Mega Hyper Rare</span>
            </div>
          </div>
        </div>

        {/* 3-Column Grid Layout untuk Daftar Kartu */}
        <div className="px-4 pb-4">
          <div className="grid grid-cols-3 gap-x-6 gap-y-1">
            {orderedCards.map((card, index) => (
              <div key={`card-${index}`} className="flex items-center justify-between py-1.5 border-b border-gray-200">

                {/* Kiri: ID, Nama */}
                <div className="flex items-center gap-2 overflow-hidden flex-1 min-w-0">
                  <span className="text-gray-400 font-mono text-[9px] flex-shrink-0">#{card.id}</span>
                  <span className="font-medium truncate text-[10px]">{card.name}</span>
                </div>

                {/* Kanan: Simbol Rarity */}
                <div className="flex-shrink-0 ml-2">
                  {getRarityIcon(card.rarity)}
                </div>

              </div>
            ))}
          </div>
        </div>
      </div>

      {/* Floating Action Buttons (Hilang saat print) */}
      <div className="fixed bottom-8 right-8 flex flex-col gap-2 no-print">
        <button
          onClick={handleExportPNG}
          disabled={isExporting}
          className="px-5 py-3 bg-green-600 text-white font-bold rounded-full shadow-2xl hover:bg-green-700 transition-colors flex items-center gap-2 disabled:opacity-50"
        >
          <Download size={18} />
          {isExporting ? '...' : 'PNG'}
        </button>
        <button
          onClick={() => window.print()}
          className="px-5 py-3 bg-black text-white font-bold rounded-full shadow-2xl hover:bg-gray-800 transition-colors flex items-center gap-2"
        >
          <Printer size={18} />
          PDF
        </button>
        <Link
          href="/"
          className="px-5 py-3 bg-gray-500 text-white font-bold rounded-full shadow-2xl hover:bg-gray-600 transition-colors flex items-center gap-2 text-center"
        >
          ←
        </Link>
      </div>

      <style jsx>{`
        @media print {
          .no-print {
            display: none !important;
          }
        }
      `}</style>
    </div>
  );
}
