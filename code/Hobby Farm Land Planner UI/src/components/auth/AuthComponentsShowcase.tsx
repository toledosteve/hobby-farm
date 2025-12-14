/**
 * Auth Components Showcase
 * 
 * This file demonstrates all the authentication UI components
 * and their various states for design reference.
 */

import { AuthInput } from "./AuthInput";
import { Button } from "../ui/button";
import { AuthCard } from "./AuthCard";

export function AuthComponentsShowcase() {
  return (
    <div className="min-h-screen bg-background p-8">
      <div className="max-w-6xl mx-auto space-y-12">
        <div>
          <h1 className="mb-2">Authentication Components</h1>
          <p className="text-muted-foreground">
            Component library for Hobby Farm Planner authentication flow
          </p>
        </div>

        {/* Text Inputs */}
        <section className="space-y-6">
          <div>
            <h2 className="mb-4">Text Input States</h2>
            <div className="grid grid-cols-1 md:grid-cols-2 gap-6 max-w-3xl">
              <div>
                <h3 className="text-sm mb-4">Default State</h3>
                <AuthInput
                  id="input-default"
                  label="Email Address"
                  type="email"
                  placeholder="sarah@example.com"
                />
              </div>

              <div>
                <h3 className="text-sm mb-4">Focused State</h3>
                <AuthInput
                  id="input-focused"
                  label="Email Address"
                  type="email"
                  placeholder="sarah@example.com"
                  value="sarah@"
                />
              </div>

              <div>
                <h3 className="text-sm mb-4">Error State</h3>
                <AuthInput
                  id="input-error"
                  label="Email Address"
                  type="email"
                  placeholder="sarah@example.com"
                  value="invalid-email"
                  error="Please enter a valid email address"
                />
              </div>

              <div>
                <h3 className="text-sm mb-4">With Helper Text</h3>
                <AuthInput
                  id="input-helper"
                  label="Password"
                  type="password"
                  placeholder="••••••••"
                  helperText="Minimum 8 characters"
                />
              </div>

              <div>
                <h3 className="text-sm mb-4">Required Field</h3>
                <AuthInput
                  id="input-required"
                  label="Full Name"
                  placeholder="Sarah Johnson"
                  required
                />
              </div>
            </div>
          </div>
        </section>

        {/* Buttons */}
        <section className="space-y-6">
          <div>
            <h2 className="mb-4">Button Variants</h2>
            <div className="flex flex-wrap gap-4">
              <Button size="lg">Primary Button</Button>
              <Button size="lg" variant="outline">
                Secondary Button
              </Button>
              <Button size="lg" variant="ghost">
                Ghost Button
              </Button>
              <Button size="lg" disabled>
                Disabled Button
              </Button>
            </div>
          </div>

          <div>
            <h3 className="text-sm mb-4">Button Sizes</h3>
            <div className="flex flex-wrap items-center gap-4">
              <Button size="sm">Small</Button>
              <Button>Default</Button>
              <Button size="lg">Large</Button>
            </div>
          </div>

          <div>
            <h3 className="text-sm mb-4">Full Width Button</h3>
            <div className="max-w-md">
              <Button className="w-full" size="lg">
                Sign In
              </Button>
            </div>
          </div>
        </section>

        {/* Cards */}
        <section className="space-y-6">
          <div>
            <h2 className="mb-4">Auth Card</h2>
            <AuthCard
              title="Sign In"
              subtitle="Welcome back to your farm planner."
            >
              <div className="space-y-4">
                <AuthInput
                  id="demo-email"
                  label="Email Address"
                  type="email"
                  placeholder="sarah@example.com"
                  required
                />
                <AuthInput
                  id="demo-password"
                  label="Password"
                  type="password"
                  placeholder="••••••••"
                  required
                />
                <Button className="w-full" size="lg">
                  Sign In
                </Button>
              </div>
            </AuthCard>
          </div>
        </section>

        {/* Typography */}
        <section className="space-y-6">
          <div>
            <h2 className="mb-4">Typography</h2>
            <div className="space-y-4 max-w-2xl">
              <div>
                <h1>Heading 1 - Page Title</h1>
                <p className="text-sm text-muted-foreground mt-1">
                  Used for main page headings
                </p>
              </div>
              <div>
                <h2>Heading 2 - Section Title</h2>
                <p className="text-sm text-muted-foreground mt-1">
                  Used for section headings
                </p>
              </div>
              <div>
                <h3>Heading 3 - Subsection</h3>
                <p className="text-sm text-muted-foreground mt-1">
                  Used for subsection headings
                </p>
              </div>
              <div>
                <p>
                  Body text - Regular paragraph text for content and descriptions.
                  This is the default text style used throughout the application.
                </p>
              </div>
              <div>
                <p className="text-sm text-muted-foreground">
                  Muted text - Used for supplementary information, helper text, and
                  less important content.
                </p>
              </div>
            </div>
          </div>
        </section>

        {/* Color Palette */}
        <section className="space-y-6">
          <div>
            <h2 className="mb-4">Color Palette</h2>
            <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
              <div>
                <div className="h-24 rounded-lg bg-primary mb-2"></div>
                <p className="text-sm">Primary</p>
                <p className="text-xs text-muted-foreground">#2D5F3F</p>
              </div>
              <div>
                <div className="h-24 rounded-lg bg-secondary mb-2"></div>
                <p className="text-sm">Secondary</p>
                <p className="text-xs text-muted-foreground">#84A98C</p>
              </div>
              <div>
                <div className="h-24 rounded-lg bg-card border border-border mb-2"></div>
                <p className="text-sm">Card</p>
                <p className="text-xs text-muted-foreground">Background</p>
              </div>
              <div>
                <div className="h-24 rounded-lg bg-muted mb-2"></div>
                <p className="text-sm">Muted</p>
                <p className="text-xs text-muted-foreground">Subtle backgrounds</p>
              </div>
              <div>
                <div className="h-24 rounded-lg bg-destructive mb-2"></div>
                <p className="text-sm">Destructive</p>
                <p className="text-xs text-muted-foreground">Errors</p>
              </div>
              <div>
                <div className="h-24 rounded-lg border-2 border-border mb-2"></div>
                <p className="text-sm">Border</p>
                <p className="text-xs text-muted-foreground">Separators</p>
              </div>
            </div>
          </div>
        </section>

        {/* Spacing & Layout */}
        <section className="space-y-6">
          <div>
            <h2 className="mb-4">Design Tokens</h2>
            <div className="space-y-2 text-sm">
              <p><strong>Border Radius:</strong> 6-8px for cards and inputs</p>
              <p><strong>Shadows:</strong> Subtle, soft shadows for depth</p>
              <p><strong>Spacing:</strong> Consistent 4px/8px/16px/24px scale</p>
              <p><strong>Font:</strong> Clean sans-serif (system font stack)</p>
            </div>
          </div>
        </section>

        {/* Mobile Responsive Notes */}
        <section className="space-y-6">
          <div>
            <h2 className="mb-4">Responsive Design</h2>
            <div className="bg-muted rounded-lg p-6 space-y-4">
              <div>
                <h3 className="text-sm mb-2">Mobile (sm)</h3>
                <ul className="text-sm text-muted-foreground space-y-1">
                  <li>• Full-width inputs and buttons</li>
                  <li>• Reduced padding (px-4 instead of px-6)</li>
                  <li>• Stack buttons vertically</li>
                  <li>• Centered content with max-width</li>
                </ul>
              </div>
              <div>
                <h3 className="text-sm mb-2">Tablet & Desktop (md+)</h3>
                <ul className="text-sm text-muted-foreground space-y-1">
                  <li>• Fixed-width auth cards (max-w-md)</li>
                  <li>• Side-by-side button layouts</li>
                  <li>• Comfortable padding and spacing</li>
                </ul>
              </div>
            </div>
          </div>
        </section>
      </div>
    </div>
  );
}
