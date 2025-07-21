import React from 'react';
import { motion } from 'framer-motion';
import { 
  ethiopianPatterns, 
  ethiopianSymbols, 
  PatternType, 
  SymbolType,
  ethiopianColors
} from '../lib/ethiopian-design-system';

interface CulturalPatternShowcaseProps {
  className?: string;
}

/**
 * Component that showcases Ethiopian cultural patterns and symbols
 */
export function CulturalPatternShowcase({ className }: CulturalPatternShowcaseProps): React.ReactNode {
  return (
    <div className={`w-full py-8 ${className}`}>
      <div className="container mx-auto px-4">
        <div className="text-center mb-10">
          <h2 className="text-3xl font-bold mb-2">
            <span className="ethiopian-green">የኢትዮጵያ</span> <span className="ethiopian-gold">ባህላዊ</span> <span className="ethiopian-red">ንድፎች</span>
          </h2>
          <p className="text-muted-foreground max-w-2xl mx-auto">
            Ethiopian Cultural Patterns and Symbols
          </p>
        </div>

        {/* Patterns Section */}
        <div className="mb-12">
          <h3 className="text-xl font-semibold mb-4 border-b border-border pb-2">Cultural Patterns</h3>
          <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 gap-6">
            {Object.values(PatternType).map((patternType, index) => {
              const pattern = ethiopianPatterns[patternType];
              return (
                <motion.div
                  key={patternType}
                  initial={{ opacity: 0, y: 20 }}
                  animate={{ opacity: 1, y: 0 }}
                  transition={{ delay: index * 0.1 }}
                  className="bg-card rounded-lg overflow-hidden shadow-md border border-border"
                >
                  <div className={`h-32 ${pattern.cssClass}`} style={{ color: ethiopianColors.green }}></div>
                  <div className="p-4">
                    <div className="flex flex-col items-center">
                      <span className="font-bold text-lg drop-shadow-md text-black dark:text-white">{pattern.name}</span>
                      <span className="text-sm drop-shadow-sm text-black dark:text-white">{pattern.description}</span>
                    </div>
                  </div>
                </motion.div>
              );
            })}
          </div>
        </div>

        {/* Symbols Section */}
        <div className="mb-12">
          <h3 className="text-xl font-semibold mb-4 border-b border-border pb-2">Cultural Symbols</h3>
          <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 gap-6">
            {Object.values(SymbolType).map((symbolType, index) => {
              const symbol = ethiopianSymbols[symbolType];
              return (
                <motion.div
                  key={symbolType}
                  initial={{ opacity: 0, y: 20 }}
                  animate={{ opacity: 1, y: 0 }}
                  transition={{ delay: index * 0.1 }}
                  className="bg-card rounded-lg overflow-hidden shadow-md border border-border"
                >
                  <div className={`h-32 flex items-center justify-center ${symbol.cssClass}`} 
                       dangerouslySetInnerHTML={{ __html: symbol.svgPath }}>
                  </div>
                  <div className="p-4">
                    <h4 className="font-medium">{symbol.name}</h4>
                    <p className="text-sm text-muted-foreground">{symbol.description}</p>
                  </div>
                </motion.div>
              );
            })}
          </div>
        </div>

        {/* Color Palette Section */}
        <div>
          <h3 className="text-xl font-semibold mb-4 border-b border-border pb-2">Ethiopian Color Palette</h3>
          <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-7 gap-4">
            {Object.entries(ethiopianColors).map(([name, color], index) => (
              <motion.div
                key={name}
                initial={{ opacity: 0, scale: 0.9 }}
                animate={{ opacity: 1, scale: 1 }}
                transition={{ delay: index * 0.05 }}
                className="flex flex-col items-center"
              >
                <div 
                  className="w-16 h-16 rounded-full mb-2 border border-border" 
                  style={{ backgroundColor: color }}
                ></div>
                <span className="text-sm font-medium capitalize">{name}</span>
                <span className="text-xs text-muted-foreground">{color}</span>
              </motion.div>
            ))}
          </div>
        </div>

        {/* Design Elements Examples */}
        <div className="mt-12 grid grid-cols-1 md:grid-cols-2 gap-8">
          {/* Ethiopian Card Example */}
          <motion.div
            initial={{ opacity: 0, x: -20 }}
            animate={{ opacity: 1, x: 0 }}
            transition={{ delay: 0.3 }}
          >
            <h4 className="text-lg font-medium mb-3">Ethiopian Card Style</h4>
            <div className="card-ethiopian p-6">
              <h5 className="font-bold mb-2">ለውጥ ማምጣት</h5>
              <p className="text-sm mb-4 font-ethiopic">የእርስዎ ጉዞ ወደ ስኬት የሚጀምረው ዛሬ ነው። እኛ እርስዎን ለመርዳት እዚህ አለን።</p>
              <button className="btn-ethiopian">ጀምር</button>
            </div>
          </motion.div>

          {/* Ethiopian Button Examples */}
          <motion.div
            initial={{ opacity: 0, x: 20 }}
            animate={{ opacity: 1, x: 0 }}
            transition={{ delay: 0.3 }}
          >
            <h4 className="text-lg font-medium mb-3">Ethiopian Button Styles</h4>
            <div className="bg-card border border-border rounded-lg p-6 flex flex-col gap-4">
              <button className="btn-ethiopian w-full">Primary Action</button>
              <button className="btn-ethiopian-gold w-full">Secondary Action</button>
              <div className="flex gap-4">
                <button className="btn-ethiopian flex-1">ቀጥል</button>
                <button className="btn-ethiopian-gold flex-1">ተመለስ</button>
              </div>
            </div>
          </motion.div>
        </div>

        {/* Border Examples */}
        <div className="mt-8">
          <h4 className="text-lg font-medium mb-3">Ethiopian Border Styles</h4>
          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            <div className="border-ethiopian-pattern p-6 bg-card">
              <h5 className="font-medium mb-2">Flag-Inspired Border</h5>
              <p className="text-sm text-muted-foreground">Border using the Ethiopian flag colors</p>
            </div>
            <div className="border-ethiopian-cross p-6 bg-card">
              <h5 className="font-medium mb-2">Cross Pattern Border</h5>
              <p className="text-sm text-muted-foreground">Border inspired by Ethiopian cross patterns</p>
            </div>
          </div>
        </div>

        {/* Background Examples */}
        <div className="mt-8 grid grid-cols-1 md:grid-cols-2 gap-6">
          <div className="bg-ethiopian-gradient p-6 rounded-lg text-white">
            <h5 className="font-medium mb-2">Ethiopian Gradient Background</h5>
            <p className="text-sm">Vibrant background using the Ethiopian flag colors</p>
          </div>
          <div className="bg-ethiopian-subtle p-6 rounded-lg">
            <h5 className="font-medium mb-2">Subtle Ethiopian Background</h5>
            <p className="text-sm text-muted-foreground">Subtle background inspired by Ethiopian colors</p>
          </div>
        </div>
      </div>
    </div>
  );
}