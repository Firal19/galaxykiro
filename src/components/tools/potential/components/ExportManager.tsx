"use client";

import { useState } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { Card, CardContent } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { 
  Download, 
  Share2, 
  Mail, 
  MessageCircle, 
  Image, 
  FileText, 
  Video,
  Linkedin,
  Twitter,
  Facebook,
  Instagram,
  CheckCircle,
  ExternalLink
} from 'lucide-react';

interface ExportManagerProps {
  result: any;
  onClose: () => void;
}

export function ExportManager({ result, onClose }: ExportManagerProps) {
  const [selectedExports, setSelectedExports] = useState<Set<string>>(new Set());
  const [isExporting, setIsExporting] = useState(false);
  const [exportComplete, setExportComplete] = useState<Set<string>>(new Set());

  const exportOptions = [
    {
      id: 'pdf',
      name: 'PDF Report',
      description: 'Comprehensive assessment report with insights',
      icon: <FileText className="w-6 h-6" />,
      color: 'bg-red-100 text-red-700',
      action: () => exportPDF()
    },
    {
      id: 'image',
      name: 'Shareable Image',
      description: 'Visual summary card for social sharing',
      icon: <Image className="w-6 h-6" />,
      color: 'bg-purple-100 text-purple-700',
      action: () => exportImage()
    },
    {
      id: 'video',
      name: 'Animated Summary',
      description: 'Short video highlighting your superpowers',
      icon: <Video className="w-6 h-6" />,
      color: 'bg-blue-100 text-blue-700',
      action: () => exportVideo()
    },
    {
      id: 'email',
      name: 'Email Report',
      description: 'Detailed analysis sent to your inbox',
      icon: <Mail className="w-6 h-6" />,
      color: 'bg-green-100 text-green-700',
      action: () => exportEmail()
    }
  ];

  const socialOptions = [
    {
      id: 'whatsapp',
      name: 'WhatsApp',
      icon: <MessageCircle className="w-5 h-5" />,
      color: 'bg-green-500',
      action: () => shareWhatsApp()
    },
    {
      id: 'linkedin',
      name: 'LinkedIn',
      icon: <Linkedin className="w-5 h-5" />,
      color: 'bg-blue-600',
      action: () => shareLinkedIn()
    },
    {
      id: 'twitter',
      name: 'Twitter',
      icon: <Twitter className="w-5 h-5" />,
      color: 'bg-sky-500',
      action: () => shareTwitter()
    },
    {
      id: 'facebook',
      name: 'Facebook',
      icon: <Facebook className="w-5 h-5" />,
      color: 'bg-blue-500',
      action: () => shareFacebook()
    },
    {
      id: 'instagram',
      name: 'Instagram',
      icon: <Instagram className="w-5 h-5" />,
      color: 'bg-pink-500',
      action: () => shareInstagram()
    }
  ];

  // Export functions (simplified for demo)
  const exportPDF = async () => {
    console.log('Exporting PDF...');
    // Implementation would generate PDF report
    await new Promise(resolve => setTimeout(resolve, 2000));
    return 'Generated comprehensive PDF report';
  };

  const exportImage = async () => {
    console.log('Exporting Image...');
    // Implementation would generate social media image
    await new Promise(resolve => setTimeout(resolve, 1500));
    return 'Created shareable image';
  };

  const exportVideo = async () => {
    console.log('Exporting Video...');
    // Implementation would generate animated video
    await new Promise(resolve => setTimeout(resolve, 3000));
    return 'Generated animated summary video';
  };

  const exportEmail = async () => {
    console.log('Sending Email...');
    // Implementation would send email report
    await new Promise(resolve => setTimeout(resolve, 1000));
    return 'Email report sent successfully';
  };

  const shareWhatsApp = () => {
    const text = encodeURIComponent(`🚀 I just discovered my potential superpowers! My top strength is ${getTopSuperpower()}. Check out your potential at ${window.location.origin}`);
    window.open(`https://wa.me/?text=${text}`, '_blank');
  };

  const shareLinkedIn = () => {
    const text = encodeURIComponent(`Just completed an amazing potential assessment! Discovered my ${getTopSuperpower()} superpower. #PersonalGrowth #SelfDiscovery`);
    window.open(`https://www.linkedin.com/sharing/share-offsite/?url=${window.location.origin}&summary=${text}`, '_blank');
  };

  const shareTwitter = () => {
    const text = encodeURIComponent(`🌟 Just unlocked my potential superpowers! My top strength: ${getTopSuperpower()}. What's yours? #PotentialUnlocked #PersonalGrowth`);
    window.open(`https://twitter.com/intent/tweet?text=${text}&url=${window.location.origin}`, '_blank');
  };

  const shareFacebook = () => {
    window.open(`https://www.facebook.com/sharer/sharer.php?u=${window.location.origin}`, '_blank');
  };

  const shareInstagram = () => {
    // Instagram doesn't support direct sharing, so copy to clipboard
    const text = `🚀 Just discovered my ${getTopSuperpower()} superpower! Link in bio to discover yours #PotentialUnlocked`;
    navigator.clipboard.writeText(text);
    alert('Caption copied to clipboard! Share on Instagram Stories.');
  };

  const getTopSuperpower = () => {
    if (!result?.dimensionScores) return 'Personal Growth';
    const topDimension = Object.entries(result.dimensionScores)
      .sort(([,a], [,b]) => (b as number) - (a as number))[0];
    return topDimension ? topDimension[0].replace('_', ' ') : 'Personal Growth';
  };

  const handleExport = async (optionId: string) => {
    setIsExporting(true);
    setSelectedExports(new Set([optionId]));
    
    try {
      const option = exportOptions.find(opt => opt.id === optionId);
      if (option) {
        await option.action();
        setExportComplete(prev => new Set(prev.add(optionId)));
      }
    } catch (error) {
      console.error('Export failed:', error);
    } finally {
      setIsExporting(false);
      setTimeout(() => {
        setSelectedExports(new Set());
      }, 2000);
    }
  };

  const handleBulkExport = async () => {
    setIsExporting(true);
    setSelectedExports(new Set(exportOptions.map(opt => opt.id)));
    
    for (const option of exportOptions) {
      try {
        await option.action();
        setExportComplete(prev => new Set(prev.add(option.id)));
      } catch (error) {
        console.error(`${option.name} export failed:`, error);
      }
    }
    
    setIsExporting(false);
    setTimeout(() => {
      setSelectedExports(new Set());
    }, 2000);
  };

  return (
    <motion.div
      initial={{ opacity: 0 }}
      animate={{ opacity: 1 }}
      exit={{ opacity: 0 }}
      className="fixed inset-0 bg-black/50 flex items-center justify-center p-4 z-50"
      onClick={onClose}
    >
      <motion.div
        initial={{ scale: 0.9, opacity: 0 }}
        animate={{ scale: 1, opacity: 1 }}
        exit={{ scale: 0.9, opacity: 0 }}
        onClick={(e) => e.stopPropagation()}
        className="max-w-4xl w-full max-h-[90vh] overflow-y-auto"
      >
        <Card className="bg-white shadow-2xl border-0">
          <CardContent className="p-8">
            {/* Header */}
            <div className="text-center mb-8">
              <h2 className="text-3xl font-bold mb-2">Share Your Results</h2>
              <p className="text-gray-600">
                Export your potential assessment in multiple formats
              </p>
              <Badge className="bg-purple-100 text-purple-700 mt-2">
                Multi-Channel Export
              </Badge>
            </div>

            {/* Quick Actions */}
            <div className="mb-8">
              <div className="flex justify-center gap-4">
                <Button
                  onClick={handleBulkExport}
                  disabled={isExporting}
                  className="bg-gradient-to-r from-purple-600 to-pink-600"
                >
                  <Download className="w-4 h-4 mr-2" />
                  Export All Formats
                </Button>
                <Button variant="outline" onClick={onClose}>
                  Close
                </Button>
              </div>
            </div>

            {/* Export Options */}
            <div className="grid md:grid-cols-2 gap-6 mb-8">
              {exportOptions.map((option) => (
                <motion.div
                  key={option.id}
                  initial={{ opacity: 0, y: 20 }}
                  animate={{ opacity: 1, y: 0 }}
                  transition={{ delay: 0.1 }}
                >
                  <Card 
                    className={`border-2 transition-all duration-300 ${
                      exportComplete.has(option.id)
                        ? 'border-green-300 bg-green-50'
                        : selectedExports.has(option.id)
                        ? 'border-purple-300 bg-purple-50'
                        : 'border-gray-200 hover:border-purple-300 hover:shadow-lg cursor-pointer'
                    }`}
                    onClick={() => !isExporting && !exportComplete.has(option.id) && handleExport(option.id)}
                  >
                    <CardContent className="p-6">
                      <div className="flex items-start gap-4">
                        <div className={`p-3 rounded-lg ${option.color}`}>
                          {option.icon}
                        </div>
                        <div className="flex-1">
                          <h3 className="font-bold text-lg mb-1">{option.name}</h3>
                          <p className="text-gray-600 text-sm mb-3">{option.description}</p>
                          
                          {exportComplete.has(option.id) ? (
                            <div className="flex items-center gap-2 text-green-600">
                              <CheckCircle className="w-4 h-4" />
                              <span className="text-sm font-medium">Completed</span>
                            </div>
                          ) : selectedExports.has(option.id) ? (
                            <div className="flex items-center gap-2 text-purple-600">
                              <div className="w-4 h-4 border-2 border-purple-600 border-t-transparent rounded-full animate-spin" />
                              <span className="text-sm font-medium">Exporting...</span>
                            </div>
                          ) : (
                            <Button size="sm" variant="outline">
                              Export Now
                            </Button>
                          )}
                        </div>
                      </div>
                    </CardContent>
                  </Card>
                </motion.div>
              ))}
            </div>

            {/* Social Sharing */}
            <div className="border-t pt-6">
              <h3 className="text-xl font-bold text-center mb-4">Share on Social Media</h3>
              <div className="flex justify-center gap-3 flex-wrap">
                {socialOptions.map((social) => (
                  <motion.button
                    key={social.id}
                    initial={{ scale: 0 }}
                    animate={{ scale: 1 }}
                    transition={{ delay: 0.1 }}
                    whileHover={{ scale: 1.05 }}
                    whileTap={{ scale: 0.95 }}
                    onClick={social.action}
                    className={`p-3 rounded-full text-white ${social.color} hover:opacity-90 transition-opacity flex items-center gap-2`}
                  >
                    {social.icon}
                    <span className="text-sm font-medium">{social.name}</span>
                  </motion.button>
                ))}
              </div>
              
              <div className="text-center mt-4">
                <p className="text-xs text-gray-500">
                  Share your achievement and inspire others to discover their potential
                </p>
              </div>
            </div>
          </CardContent>
        </Card>
      </motion.div>
    </motion.div>
  );
}