'use client';

import React, { useState } from 'react';
import { Copy, Check, ChevronDown, ChevronUp, RotateCcw, Trash2 } from 'lucide-react';

interface PromptCommandProps {
  prompt: string;
  filename?: string;
  ratio?: string;
  title?: string;
  referenceImages?: string[];  // 参照画像のファイル名リスト
}

export default function PromptCommand({
  prompt: defaultPrompt,
  filename: defaultFilename = 'output',
  ratio: defaultRatio = '1:1',
  title = 'プロンプトジェネレータ',
  referenceImages: defaultReferenceImages = []
}: PromptCommandProps) {
  const [isOpen, setIsOpen] = useState(false);
  const [prompt, setPrompt] = useState(defaultPrompt);
  const [filename, setFilename] = useState(defaultFilename.replace(/\.png$/, ''));
  const [ratio, setRatio] = useState(defaultRatio);
  const [copied, setCopied] = useState(false);
  const [referenceImages, setReferenceImages] = useState<string[]>(defaultReferenceImages);

  const ratios = ['1:1', '16:9', '9:16', '3:4', '4:3', '3:2', '2:3'];

  // ファイル名に拡張子を付与
  const filenameWithExt = filename ? `${filename}.png` : 'output.png';

  // 参照画像モードかどうか
  const hasReferenceImages = referenceImages.length > 0;

  // コマンドを生成
  const generateCommand = () => {
    const escapedPrompt = prompt.replace(/"/g, '\\"');

    if (hasReferenceImages) {
      // 参照画像ありの場合
      const refFiles = referenceImages.join(' ');
      let cmd = `python generate_image.py "${escapedPrompt}" --ref ${refFiles} --out ${filenameWithExt}`;
      if (ratio !== '1:1') {
        cmd += ` --ratio ${ratio}`;
      }
      return cmd;
    } else {
      // 従来のテキストのみ生成
      let cmd = `python generate_image.py "${escapedPrompt}" ${filenameWithExt}`;
      if (ratio !== '1:1') {
        cmd += ` ${ratio}`;
      }
      return cmd;
    }
  };

  const handleCopy = async () => {
    await navigator.clipboard.writeText(generateCommand());
    setCopied(true);
    setTimeout(() => setCopied(false), 2000);
  };

  const handleReset = () => {
    setPrompt(defaultPrompt);
    setFilename(defaultFilename.replace(/\.png$/, ''));
    setRatio(defaultRatio);
    setReferenceImages(defaultReferenceImages);
  };

  // 参照画像を更新
  const handleReferenceChange = (index: number, value: string) => {
    const newRefs = [...referenceImages];
    newRefs[index] = value;
    setReferenceImages(newRefs);
  };

  // 参照画像を追加
  const addReferenceImage = () => {
    setReferenceImages([...referenceImages, '']);
  };

  // 参照画像を削除
  const removeReferenceImage = (index: number) => {
    setReferenceImages(referenceImages.filter((_, i) => i !== index));
  };

  return (
    <div className="my-4">
      {/* トグルボタン */}
      <div>
        {!isOpen && (
          <p className="mb-1 text-sm text-gray-500">
            クリックしてPythonコマンドを生成
          </p>
        )}
        <button
          onClick={() => setIsOpen(!isOpen)}
          className="flex items-center gap-2 px-4 py-2 bg-blue-600 hover:bg-blue-700 text-white rounded-lg transition-colors font-medium"
        >
          {isOpen ? <ChevronUp className="w-4 h-4" /> : <ChevronDown className="w-4 h-4" />}
          {title}
        </button>
      </div>

      {/* 展開部分 */}
      {isOpen && (
        <div className="mt-2 border border-gray-200 rounded-lg overflow-hidden bg-white shadow-sm">
          <div className="p-4 space-y-4">
            {/* プロンプト入力 */}
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1">
                プロンプト
              </label>
              <textarea
                value={prompt}
                onChange={(e) => setPrompt(e.target.value)}
                className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500 text-sm resize-y min-h-[80px]"
                placeholder="プロンプトを入力..."
              />
            </div>

            {/* 参照画像（参照画像モードの場合のみ表示） */}
            {hasReferenceImages && (
              <div className="w-full">
                <label className="block text-sm font-medium text-gray-700 mb-1">
                  参照画像
                </label>
                <div className="space-y-2">
                  {referenceImages.map((ref, index) => (
                    <div key={index} className="flex items-center gap-2">
                      <input
                        type="text"
                        value={ref}
                        onChange={(e) => handleReferenceChange(index, e.target.value)}
                        className="flex-1 px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500 text-sm"
                        placeholder={`参照画像${index + 1}.png`}
                      />
                      <button
                        onClick={() => removeReferenceImage(index)}
                        className="p-2 text-red-600 hover:text-red-800 hover:bg-red-50 rounded transition-colors"
                        title="削除"
                      >
                        <Trash2 className="w-4 h-4" />
                      </button>
                    </div>
                  ))}
                  <button
                    onClick={addReferenceImage}
                    className="text-sm text-blue-600 hover:text-blue-800"
                  >
                    + 参照画像を追加
                  </button>
                </div>
              </div>
            )}

            {/* ファイル名（モバイルでは単独行） */}
            <div className="w-full">
              <label className="block text-sm font-medium text-gray-700 mb-1">
                出力ファイル名
              </label>
              <div className="flex items-center">
                <input
                  type="text"
                  value={filename}
                  onChange={(e) => setFilename(e.target.value)}
                  className="flex-1 px-3 py-2 border border-gray-300 rounded-l-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500 text-sm"
                  placeholder="output"
                />
                <span className="px-3 py-2 bg-gray-100 border border-l-0 border-gray-300 rounded-r-lg text-sm text-gray-600">
                  .png
                </span>
              </div>
            </div>

            {/* アスペクト比とデフォルトボタン（横並び） */}
            <div className="flex gap-4 items-end">
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">
                  アスペクト比
                </label>
                <select
                  value={ratio}
                  onChange={(e) => setRatio(e.target.value)}
                  className="px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500 text-sm bg-white"
                >
                  {ratios.map((r) => (
                    <option key={r} value={r}>{r}</option>
                  ))}
                </select>
              </div>

              {/* デフォルトに戻すボタン */}
              <button
                onClick={handleReset}
                className="flex items-center gap-1 px-3 py-2 text-sm text-gray-700 hover:text-gray-900 bg-gray-200 hover:bg-gray-300 rounded-lg transition-colors border border-gray-400"
                title="デフォルトに戻す"
              >
                <RotateCcw className="w-4 h-4" />
                デフォルト
              </button>
            </div>
          </div>

          {/* 出力コマンド */}
          <div className="bg-gray-900 p-3 flex items-start gap-2">
            <span
              className="flex-1 text-sm font-mono break-all whitespace-pre-wrap"
              style={{ color: '#4ade80' }}
            >
              {generateCommand()}
            </span>
            <button
              onClick={handleCopy}
              className="flex-shrink-0 p-2 rounded bg-gray-700 hover:bg-gray-600 text-gray-300 hover:text-white transition-colors"
              aria-label="コマンドをコピー"
            >
              {copied ? <Check className="w-4 h-4" /> : <Copy className="w-4 h-4" />}
            </button>
          </div>
        </div>
      )}
    </div>
  );
}
