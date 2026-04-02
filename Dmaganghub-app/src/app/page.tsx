'use client';

import { useState } from 'react';
import Link from 'next/link';
import { parseCSV, saveToLocalStorage, clearLocalStorage, saveLogoToStorage, clearLogoFromStorage, saveSetTitleToStorage, clearSetTitleFromStorage } from '@/utils/csvParser';
import type { PokemonCard } from '@/data/pokemonSet';
import { Upload, FileText, Trash2, Check, Image as ImageIcon, Type } from 'lucide-react';

export default function Home() {
  const [uploadedCards, setUploadedCards] = useState<PokemonCard[] | null>(null);
  const [fileName, setFileName] = useState<string>('');
  const [error, setError] = useState<string>('');

  // Logo state
  const [logoPreview, setLogoPreview] = useState<string>('');
  const [logoName, setLogoName] = useState<string>('');

  // Set title state
  const [setTitle, setSetTitle] = useState<string>('');

  const handleFileUpload = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (!file) return;

    setFileName(file.name);
    setError('');

    const reader = new FileReader();
    reader.onload = (event) => {
      try {
        const csvText = event.target?.result as string;
        const cards = parseCSV(csvText);

        if (cards.length === 0) {
          setError('No valid data found in CSV');
          return;
        }

        setUploadedCards(cards);
        saveToLocalStorage(cards);
      } catch (err) {
        setError('Failed to parse CSV: ' + (err as Error).message);
      }
    };

    reader.readAsText(file);
  };

  const handleLogoUpload = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (!file) return;

    setLogoName(file.name);

    const reader = new FileReader();
    reader.onload = (event) => {
      const base64 = event.target?.result as string;
      setLogoPreview(base64);
      saveLogoToStorage(base64);
    };

    reader.readAsDataURL(file);
  };

  const handleSetTitleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const value = e.target.value;
    setSetTitle(value);
    if (value.trim()) {
      saveSetTitleToStorage(value);
    } else {
      clearSetTitleFromStorage();
    }
  };

  const handleClear = () => {
    setUploadedCards(null);
    setFileName('');
    setError('');
    clearLocalStorage();
  };

  const handleClearLogo = () => {
    setLogoPreview('');
    setLogoName('');
    clearLogoFromStorage();
  };

  const getRarityCount = () => {
    if (!uploadedCards) return null;
    return {
      total: uploadedCards.length,
      common: uploadedCards.filter(c => c.rarity === 'common').length,
      uncommon: uploadedCards.filter(c => c.rarity === 'uncommon').length,
      rare: uploadedCards.filter(c => c.rarity === 'rare').length,
      doubleRare: uploadedCards.filter(c => c.rarity === 'double-rare').length,
      illustrationRare: uploadedCards.filter(c => c.rarity === 'illustration-rare').length,
      ultraRare: uploadedCards.filter(c => c.rarity === 'ultra-rare').length,
      specialIllustrationRare: uploadedCards.filter(c => c.rarity === 'special-illustration-rare').length,
      megaHyperRare: uploadedCards.filter(c => c.rarity === 'mega-hyper-rare').length,
    };
  };

  const stats = getRarityCount();

  return (
    <main className="min-h-screen flex flex-col items-center justify-center bg-gray-50 p-6">
      <div className="max-w-2xl w-full">
        <div className="bg-white rounded-2xl shadow-lg p-8">
          <h1 className="text-2xl font-bold mb-2 text-center">TCG Checklist Generator</h1>
          <p className="text-gray-600 mb-8 text-center">
            Upload CSV to create a custom checklist PDF
          </p>

          {/* Set Title Input */}
          <div className="mb-6">
            <label className="block text-sm font-medium text-gray-700 mb-2 flex items-center gap-2">
              <Type size={16} />
              Set Name (Optional)
            </label>
            <input
              type="text"
              value={setTitle}
              onChange={handleSetTitleChange}
              placeholder="e.g.: Mega Evolution, Base Set, etc."
              className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-black"
            />
          </div>

          {/* Logo Upload Section */}
          <div className="mb-6">
            <label className="block text-sm font-medium text-gray-700 mb-2 flex items-center gap-2">
              <ImageIcon size={16} />
              Set Logo (Optional)
            </label>

            <div className="flex gap-2">
              <label className="flex-1 cursor-pointer">
                <div className="border-2 border-dashed border-gray-300 rounded-lg p-4 text-center hover:border-gray-400 transition">
                  {logoPreview ? (
                    <img src={logoPreview} alt="Logo preview" className="max-h-16 mx-auto" />
                  ) : (
                    <>
                      <Upload className="mx-auto h-8 w-8 text-gray-400 mb-2" />
                      <span className="text-sm text-gray-600">
                        {logoName || 'Click to upload logo'}
                      </span>
                    </>
                  )}
                </div>
                <input
                  type="file"
                  accept="image/*"
                  onChange={handleLogoUpload}
                  className="hidden"
                />
              </label>

              {logoPreview && (
                <button
                  onClick={handleClearLogo}
                  className="px-4 py-2 bg-red-500 text-white rounded-lg hover:bg-red-600 transition"
                  title="Remove logo"
                >
                  <Trash2 size={20} />
                </button>
              )}
            </div>
          </div>

          {/* CSV Upload Section */}
          <div className="mb-6">
            <label className="block text-sm font-medium text-gray-700 mb-2">
              Format CSV: <code className="bg-gray-100 px-2 py-1 rounded">id,name,rarity</code>
            </label>

            <div className="flex gap-2">
              <label className="flex-1 cursor-pointer">
                <div className="border-2 border-dashed border-gray-300 rounded-lg p-4 text-center hover:border-gray-400 transition">
                  <Upload className="mx-auto h-8 w-8 text-gray-400 mb-2" />
                  <span className="text-sm text-gray-600">
                    {fileName || 'Click to upload CSV'}
                  </span>
                </div>
                <input
                  type="file"
                  accept=".csv"
                  onChange={handleFileUpload}
                  className="hidden"
                />
              </label>

              {uploadedCards && (
                <button
                  onClick={handleClear}
                  className="px-4 py-2 bg-red-500 text-white rounded-lg hover:bg-red-600 transition"
                  title="Clear data"
                >
                  <Trash2 size={20} />
                </button>
              )}
            </div>

            {error && (
              <p className="mt-2 text-sm text-red-600">{error}</p>
            )}
          </div>

          {/* Preview Section */}
          {uploadedCards && stats && (
            <div className="mb-6 p-4 bg-green-50 border border-green-200 rounded-lg">
              <div className="flex items-center gap-2 text-green-700 mb-3">
                <Check size={18} />
                <span className="font-medium">CSV Successfully Uploaded!</span>
              </div>

              <div className="grid grid-cols-4 gap-2 text-sm">
                <div className="bg-white p-2 rounded">
                  <div className="text-gray-500">Total</div>
                  <div className="font-bold text-lg">{stats.total}</div>
                </div>
                <div className="bg-white p-2 rounded">
                  <div className="text-gray-500">● Common</div>
                  <div className="font-bold">{stats.common}</div>
                </div>
                <div className="bg-white p-2 rounded">
                  <div className="text-gray-500">◆ Uncommon</div>
                  <div className="font-bold">{stats.uncommon}</div>
                </div>
                <div className="bg-white p-2 rounded">
                  <div className="text-gray-500">★ Rare</div>
                  <div className="font-bold">{stats.rare}</div>
                </div>
                <div className="bg-white p-2 rounded">
                  <div className="text-gray-500">** Double Rare</div>
                  <div className="font-bold">{stats.doubleRare}</div>
                </div>
                <div className="bg-white p-2 rounded">
                  <div className="text-gray-500">✦ Illustration Rare</div>
                  <div className="font-bold">{stats.illustrationRare}</div>
                </div>
                <div className="bg-white p-2 rounded">
                  <div className="text-gray-500">👑 Ultra Rare</div>
                  <div className="font-bold">{stats.ultraRare}</div>
                </div>
                <div className="bg-white p-2 rounded">
                  <div className="text-gray-500">💎 Special Illustration Rare</div>
                  <div className="font-bold">{stats.specialIllustrationRare}</div>
                </div>
                <div className="bg-white p-2 rounded col-span-4">
                  <div className="text-gray-500">🔥 Mega Hyper Rare</div>
                  <div className="font-bold">{stats.megaHyperRare}</div>
                </div>
              </div>

              {/* Preview first 5 cards */}
              <div className="mt-3 pt-3 border-t border-green-200">
                <p className="text-xs text-gray-500 mb-1">Preview first 5 cards:</p>
                <div className="text-xs space-y-1">
                  {uploadedCards.slice(0, 5).map((card, index) => (
                    <div key={`preview-${index}`} className="flex justify-between">
                      <span>{card.id}</span>
                      <span className="flex-1 mx-2 truncate">{card.name}</span>
                      <span className="text-gray-400">{card.rarity}</span>
                    </div>
                  ))}
                </div>
              </div>
            </div>
          )}

          {/* Action Buttons */}
          <div className="flex gap-3">
            <Link
              href="/print"
              className="flex-1 py-3 px-4 bg-black text-white font-semibold rounded-lg hover:bg-gray-800 transition text-center flex items-center justify-center gap-2"
            >
              <FileText size={20} />
              {uploadedCards ? 'Print Checklist' : 'Use Default Data'}
            </Link>
          </div>

          {/* CSV Example */}
          <div className="mt-6 p-4 bg-gray-50 rounded-lg">
            <p className="text-xs text-gray-500 mb-2">CSV Example:</p>
            <pre className="text-xs bg-white p-2 rounded border overflow-x-auto">
{`id,name,rarity
001,Pikachu,common
002,Charizard,rare
003,Mewtwo ex,double-rare`}
            </pre>
          </div>
        </div>
      </div>
    </main>
  );
}
