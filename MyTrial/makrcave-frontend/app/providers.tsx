'use client';

import React from 'react';
import { AuthProvider } from '../contexts/AuthContext';
import { MakerspaceProvider } from '../contexts/MakerspaceContext';
import { FeatureFlagProvider } from '../contexts/FeatureFlagContext';
import { ThemeProvider } from '../../../packages/ui/contexts/ThemeContext';
import { NotificationProvider } from '../contexts/NotificationContext';
import { MemberProvider } from '../contexts/MemberContext';
import { BillingProvider } from '../contexts/BillingContext';
import { SkillProvider } from '../contexts/SkillContext';
import { HealthProvider } from '../contexts/HealthContext';

export function Providers({ children }: { children: React.ReactNode }) {
  return (
    <ThemeProvider>
      <HealthProvider>
        <AuthProvider>
          <FeatureFlagProvider>
            <NotificationProvider>
              <MakerspaceProvider>
                <MemberProvider>
                  <SkillProvider>
                    <BillingProvider>
                      {children}
                    </BillingProvider>
                  </SkillProvider>
                </MemberProvider>
              </MakerspaceProvider>
            </NotificationProvider>
          </FeatureFlagProvider>
        </AuthProvider>
      </HealthProvider>
    </ThemeProvider>
  );
}
