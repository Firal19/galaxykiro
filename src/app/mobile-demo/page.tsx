'use client';

import React, { useState } from 'react';
import { MobileFirstLayout, ResponsiveGrid, MobileStack, ResponsiveText, MobileCard, TouchOptimizedList } from '../../components/mobile-first-layout';
import { TouchButton } from '../../components/ui/touch-button';
import { TouchInput } from '../../components/ui/touch-input';
import { ThumbZoneLayout, FloatingActionButton, BottomSheet, ThumbFriendlyTabs } from '../../components/ui/thumb-zone-layout';
import { SwipeSectionNavigator } from '../../components/swipe-section-navigator';
import { MobileResponsiveTest } from '../../components/mobile-responsive-test';
import { usePWA } from '../../lib/hooks/use-pwa';

export default function MobileDemoPage() {
  const [showBottomSheet, setShowBottomSheet] = useState(false);
  const [activeTab, setActiveTab] = useState('overview');
  const [currentSection, setCurrentSection] = useState('responsive');
  const { isInstallable, isInstalled, isOnline, installApp } = usePWA();

  const demoSections = [
    {
      id: 'responsive',
      title: 'Responsive Layout',
      component: (
        <MobileFirstLayout variant="constrained" spacing="medium">
          <MobileStack spacing="normal">
            <ResponsiveText variant="h1" align="center">
              Mobile-First Design
            </ResponsiveText>
            <ResponsiveText variant="body" align="center">
              This layout adapts seamlessly from mobile to desktop with touch-optimized interactions.
            </ResponsiveText>
            
            <ResponsiveGrid 
              columns={{ mobile: 1, tablet: 2, desktop: 3 }}
              gap="medium"
            >
              <MobileCard padding="medium" shadow border>
                <ResponsiveText variant="h3">Touch Optimized</ResponsiveText>
                <ResponsiveText variant="body">
                  All interactive elements meet the 44px minimum touch target requirement.
                </ResponsiveText>
              </MobileCard>
              
              <MobileCard padding="medium" shadow border>
                <ResponsiveText variant="h3">Responsive Grid</ResponsiveText>
                <ResponsiveText variant="body">
                  Automatically adjusts from 1 column on mobile to 3 on desktop.
                </ResponsiveText>
              </MobileCard>
              
              <MobileCard padding="medium" shadow border>
                <ResponsiveText variant="h3">PWA Ready</ResponsiveText>
                <ResponsiveText variant="body">
                  Service worker enabled with offline functionality and install prompts.
                </ResponsiveText>
              </MobileCard>
            </ResponsiveGrid>
          </MobileStack>
        </MobileFirstLayout>
      )
    },
    {
      id: 'touch',
      title: 'Touch Interface',
      component: (
        <MobileFirstLayout variant="constrained" spacing="medium">
          <MobileStack spacing="normal">
            <ResponsiveText variant="h2" align="center">
              Touch-Optimized Components
            </ResponsiveText>
            
            <div className="space-y-4">
              <TouchInput
                label="Email Address"
                type="email"
                placeholder="Enter your email"
                helperText="16px font size prevents zoom on iOS"
              />
              
              <TouchInput
                label="Phone Number"
                type="tel"
                placeholder="+251 911 234 567"
                helperText="Touch-friendly input with proper spacing"
              />
              
              <div className="flex flex-col sm:flex-row gap-4">
                <TouchButton variant="primary" size="medium" className="flex-1">
                  Primary Action
                </TouchButton>
                <TouchButton variant="secondary" size="medium" className="flex-1">
                  Secondary Action
                </TouchButton>
              </div>
              
              <TouchButton 
                variant="cta" 
                size="large" 
                className="w-full"
                onClick={() => setShowBottomSheet(true)}
              >
                Open Bottom Sheet
              </TouchButton>
            </div>
          </MobileStack>
        </MobileFirstLayout>
      )
    },
    {
      id: 'swipe',
      title: 'Swipe Navigation',
      component: (
        <MobileFirstLayout variant="constrained" spacing="medium">
          <MobileStack spacing="normal">
            <ResponsiveText variant="h2" align="center">
              Gesture-Based Navigation
            </ResponsiveText>
            <ResponsiveText variant="body" align="center">
              Swipe left or right to navigate between sections. Try it on mobile!
            </ResponsiveText>
            
            <MobileCard padding="large" className="bg-gradient-to-r from-growth-50 to-transformation-50">
              <div className="text-center space-y-4">
                <div className="text-4xl">👈 👉</div>
                <ResponsiveText variant="h3">Swipe to Navigate</ResponsiveText>
                <ResponsiveText variant="body">
                  This section supports swipe gestures for navigation between different demo areas.
                </ResponsiveText>
              </div>
            </MobileCard>
          </MobileStack>
        </MobileFirstLayout>
      )
    },
    {
      id: 'thumb',
      title: 'Thumb Zone',
      component: (
        <div className="h-screen">
          <ThumbZoneLayout
            content={
              <MobileFirstLayout variant="constrained" spacing="medium">
                <MobileStack spacing="normal">
                  <ResponsiveText variant="h2">Thumb Zone Layout</ResponsiveText>
                  <ResponsiveText variant="body">
                    This layout optimizes content for one-thumb reachability:
                  </ResponsiveText>
                  
                  <div className="space-y-4">
                    <MobileCard padding="medium" className="bg-red-50 border-red-200">
                      <ResponsiveText variant="h4">Hard Reach Zone (Top)</ResponsiveText>
                      <ResponsiveText variant="small">
                        Static content and information that doesn't require frequent interaction.
                      </ResponsiveText>
                    </MobileCard>
                    
                    <MobileCard padding="medium" className="bg-yellow-50 border-yellow-200">
                      <ResponsiveText variant="h4">Medium Reach Zone (Middle)</ResponsiveText>
                      <ResponsiveText variant="small">
                        Secondary actions and interactive content.
                      </ResponsiveText>
                    </MobileCard>
                  </div>
                </MobileStack>
              </MobileFirstLayout>
            }
            secondaryActions={
              <div className="space-y-2">
                <TouchButton variant="secondary" size="medium" className="w-full">
                  Secondary Action
                </TouchButton>
                <TouchButton variant="ghost" size="medium" className="w-full">
                  Another Option
                </TouchButton>
              </div>
            }
            primaryActions={
              <div className="space-y-2">
                <ResponsiveText variant="small" align="center" className="text-gray-600">
                  Easy Reach Zone (Bottom)
                </ResponsiveText>
                <TouchButton variant="cta" size="large" className="w-full">
                  Primary Action
                </TouchButton>
              </div>
            }
          />
        </div>
      )
    },
    {
      id: 'test',
      title: 'Comprehensive Test',
      component: <MobileResponsiveTest />
    }
  ];

  const tabs = [
    {
      id: 'overview',
      label: 'Overview',
      icon: (
        <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M4 6h16M4 12h16M4 18h16" />
        </svg>
      ),
      content: (
        <MobileStack spacing="normal">
          <ResponsiveText variant="h3">Mobile-First Implementation</ResponsiveText>
          <ResponsiveText variant="body">
            This demo showcases the complete mobile-first responsive design system with:
          </ResponsiveText>
          
          <TouchOptimizedList
            items={[
              {
                id: '1',
                content: (
                  <div>
                    <div className="font-semibold">Touch-Optimized Components</div>
                    <div className="text-sm text-gray-600">44px minimum touch targets, proper spacing</div>
                  </div>
                )
              },
              {
                id: '2',
                content: (
                  <div>
                    <div className="font-semibold">Swipe Navigation</div>
                    <div className="text-sm text-gray-600">Gesture-based section navigation</div>
                  </div>
                )
              },
              {
                id: '3',
                content: (
                  <div>
                    <div className="font-semibold">Thumb Zone Layout</div>
                    <div className="text-sm text-gray-600">One-thumb reachability optimization</div>
                  </div>
                )
              },
              {
                id: '4',
                content: (
                  <div>
                    <div className="font-semibold">PWA Features</div>
                    <div className="text-sm text-gray-600">Service worker, offline support, install prompts</div>
                  </div>
                )
              }
            ]}
          />
        </MobileStack>
      )
    },
    {
      id: 'features',
      label: 'Features',
      icon: (
        <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 12l2 2 4-4m6 2a9 9 0 11-18 0 9 9 0 0118 0z" />
        </svg>
      ),
      content: (
        <MobileStack spacing="normal">
          <ResponsiveText variant="h3">PWA Status</ResponsiveText>
          
          <div className="space-y-3">
            <div className="flex items-center justify-between p-3 bg-gray-50 rounded-lg">
              <span>Online Status</span>
              <div className={`w-3 h-3 rounded-full ${isOnline ? 'bg-green-500' : 'bg-red-500'}`} />
            </div>
            
            <div className="flex items-center justify-between p-3 bg-gray-50 rounded-lg">
              <span>App Installed</span>
              <div className={`w-3 h-3 rounded-full ${isInstalled ? 'bg-green-500' : 'bg-gray-300'}`} />
            </div>
            
            <div className="flex items-center justify-between p-3 bg-gray-50 rounded-lg">
              <span>Install Available</span>
              <div className={`w-3 h-3 rounded-full ${isInstallable ? 'bg-green-500' : 'bg-gray-300'}`} />
            </div>
          </div>
          
          {isInstallable && (
            <TouchButton variant="primary" size="medium" onClick={installApp} className="w-full">
              Install Progressive Web App
            </TouchButton>
          )}
        </MobileStack>
      )
    },
    {
      id: 'responsive',
      label: 'Responsive',
      icon: (
        <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 18h.01M8 21h8a2 2 0 002-2V5a2 2 0 00-2-2H8a2 2 0 00-2 2v14a2 2 0 002 2z" />
        </svg>
      ),
      content: (
        <MobileStack spacing="normal">
          <ResponsiveText variant="h3">Responsive Breakpoints</ResponsiveText>
          
          <div className="space-y-2">
            <div className="p-3 bg-blue-50 rounded-lg">
              <div className="font-semibold text-blue-900">Mobile (320px+)</div>
              <div className="text-sm text-blue-700">Base mobile experience</div>
            </div>
            
            <div className="p-3 bg-green-50 rounded-lg">
              <div className="font-semibold text-green-900">Tablet (640px+)</div>
              <div className="text-sm text-green-700">Enhanced layout with more columns</div>
            </div>
            
            <div className="p-3 bg-purple-50 rounded-lg">
              <div className="font-semibold text-purple-900">Desktop (1024px+)</div>
              <div className="text-sm text-purple-700">Full desktop experience</div>
            </div>
          </div>
        </MobileStack>
      )
    }
  ];

  return (
    <div className="min-h-screen bg-gray-50">
      {/* Main Content */}
      <div className="h-screen">
        <SwipeSectionNavigator
          sections={demoSections}
          initialSection={currentSection}
          onSectionChange={setCurrentSection}
        />
      </div>

      {/* Floating Action Button */}
      <FloatingActionButton
        onClick={() => setShowBottomSheet(true)}
        icon={
          <svg className="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M13 16h-1v-4h-1m1-4h.01M21 12a9 9 0 11-18 0 9 9 0 0118 0z" />
          </svg>
        }
        label="Show Info"
        position="bottom-right"
      />

      {/* Bottom Sheet with Tabs */}
      <BottomSheet
        isOpen={showBottomSheet}
        onClose={() => setShowBottomSheet(false)}
        title="Mobile-First Demo"
        height="half"
      >
        <ThumbFriendlyTabs
          tabs={tabs}
          activeTab={activeTab}
          onTabChange={setActiveTab}
        />
      </BottomSheet>
    </div>
  );
}