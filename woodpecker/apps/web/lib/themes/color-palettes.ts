/**
 * Comprehensive Color Palette System
 * Based on Color Hunt palettes - exact hex values from provided URLs
 */

// Helper function to convert hex to HSL (for CSS variables)
function hexToHsl(hex: string): string {
  // Remove # if present
  hex = hex.replace('#', '')
  
  // Parse RGB
  const r = parseInt(hex.substring(0, 2), 16) / 255
  const g = parseInt(hex.substring(2, 4), 16) / 255
  const b = parseInt(hex.substring(4, 6), 16) / 255

  const max = Math.max(r, g, b)
  const min = Math.min(r, g, b)
  let h: number, s: number, l: number

  l = (max + min) / 2

  if (max === min) {
    h = s = 0 // achromatic
  } else {
    const d = max - min
    s = l > 0.5 ? d / (2 - max - min) : d / (max + min)
    switch (max) {
      case r: h = ((g - b) / d + (g < b ? 6 : 0)) / 6; break
      case g: h = ((b - r) / d + 2) / 6; break
      case b: h = ((r - g) / d + 4) / 6; break
      default: h = 0
    }
  }

  h = Math.round(h * 360)
  s = Math.round(s * 100)
  l = Math.round(l * 100)

  return `${h} ${s}% ${l}%`
}

// Helper to convert hex to HSL (for CSS variables - Tailwind uses HSL format)
function hexToHslString(hex: string): string {
  hex = hex.replace('#', '')
  
  // Parse RGB
  const r = parseInt(hex.substring(0, 2), 16) / 255
  const g = parseInt(hex.substring(2, 4), 16) / 255
  const b = parseInt(hex.substring(4, 6), 16) / 255

  const max = Math.max(r, g, b)
  const min = Math.min(r, g, b)
  let h: number, s: number, l: number

  l = (max + min) / 2

  if (max === min) {
    h = s = 0 // achromatic
  } else {
    const d = max - min
    s = l > 0.5 ? d / (2 - max - min) : d / (max + min)
    switch (max) {
      case r: h = ((g - b) / d + (g < b ? 6 : 0)) / 6; break
      case g: h = ((b - r) / d + 2) / 6; break
      case b: h = ((r - g) / d + 4) / 6; break
      default: h = 0
    }
  }

  h = Math.round(h * 360)
  s = Math.round(s * 100)
  l = Math.round(l * 100)

  return `${h} ${s}% ${l}%`
}

export interface ColorPalette {
  name: string
  description: string
  colors: {
    primary: string
    secondary: string
    accent: string
    background: string
    surface: string
    text: string
    textSecondary: string
  }
  cssVariables: Record<string, string>
}

export const colorPalettes: ColorPalette[] = [
  // Palette 1: fcf8f8fbefeff9dfdff5afaf
  {
    name: 'Soft Elegance',
    description: 'Gentle and calming, perfect for personal finance',
    colors: {
      primary: '#F5AFAF',
      secondary: '#F9DFDF',
      accent: '#FBEFEF',
      background: '#FCF8F8',
      surface: '#FFFFFF',
      text: '#2C2C2C',
      textSecondary: '#6B6B6B',
    },
    cssVariables: {
      '--primary': hexToHslString('#F5AFAF'),
      '--primary-foreground': hexToHslString('#2C2C2C'),
      '--secondary': hexToHslString('#F9DFDF'),
      '--secondary-foreground': hexToHslString('#2C2C2C'),
      '--accent': hexToHslString('#FBEFEF'),
      '--accent-foreground': hexToHslString('#2C2C2C'),
      '--background': hexToHslString('#FCF8F8'),
      '--foreground': hexToHslString('#2C2C2C'),
      '--muted': hexToHslString('#FBEFEF'),
      '--muted-foreground': hexToHslString('#6B6B6B'),
      '--card': hexToHslString('#FFFFFF'),
      '--card-foreground': hexToHslString('#2C2C2C'),
      '--popover': hexToHslString('#FFFFFF'),
      '--popover-foreground': hexToHslString('#2C2C2C'),
      '--border': hexToHslString('#F9DFDF'),
      '--input': hexToHslString('#F9DFDF'),
      '--ring': hexToHslString('#F5AFAF'),
    },
  },
  // Palette 2: 9cc6dbfcf6d9cf4b00ddba7d
  {
    name: 'Ocean Breeze',
    description: 'Fresh and professional, ideal for financial planning',
    colors: {
      primary: '#9CC6DB',
      secondary: '#FCF6D9',
      accent: '#CF4B00',
      background: '#FCF6D9',
      surface: '#FFFFFF',
      text: '#1A1A1A',
      textSecondary: '#4A4A4A',
    },
    cssVariables: {
      '--primary': hexToHslString('#9CC6DB'),
      '--primary-foreground': hexToHslString('#1A1A1A'),
      '--secondary': hexToHslString('#FCF6D9'),
      '--secondary-foreground': hexToHslString('#1A1A1A'),
      '--accent': hexToHslString('#CF4B00'),
      '--accent-foreground': hexToHslString('#FFFFFF'),
      '--background': hexToHslString('#FCF6D9'),
      '--foreground': hexToHslString('#1A1A1A'),
      '--muted': hexToHslString('#FCF6D9'),
      '--muted-foreground': hexToHslString('#4A4A4A'),
      '--card': hexToHslString('#FFFFFF'),
      '--card-foreground': hexToHslString('#1A1A1A'),
      '--popover': hexToHslString('#FFFFFF'),
      '--popover-foreground': hexToHslString('#1A1A1A'),
      '--border': hexToHslString('#FCF6D9'),
      '--input': hexToHslString('#FCF6D9'),
      '--ring': hexToHslString('#9CC6DB'),
    },
  },
  // Palette 3: f1f3e0d2dcb6a1bc98778873
  {
    name: 'Sage Wisdom',
    description: 'Natural and trustworthy, great for estate planning',
    colors: {
      primary: '#A1BC98',
      secondary: '#D2DCB6',
      accent: '#778873',
      background: '#F1F3E0',
      surface: '#FFFFFF',
      text: '#1A1A1A',
      textSecondary: '#4A4A4A',
    },
    cssVariables: {
      '--primary': hexToHslString('#A1BC98'),
      '--primary-foreground': hexToHslString('#1A1A1A'),
      '--secondary': hexToHslString('#D2DCB6'),
      '--secondary-foreground': hexToHslString('#1A1A1A'),
      '--accent': hexToHslString('#778873'),
      '--accent-foreground': hexToHslString('#FFFFFF'),
      '--background': hexToHslString('#F1F3E0'),
      '--foreground': hexToHslString('#1A1A1A'),
      '--muted': hexToHslString('#D2DCB6'),
      '--muted-foreground': hexToHslString('#4A4A4A'),
      '--card': hexToHslString('#FFFFFF'),
      '--card-foreground': hexToHslString('#1A1A1A'),
      '--popover': hexToHslString('#FFFFFF'),
      '--popover-foreground': hexToHslString('#1A1A1A'),
      '--border': hexToHslString('#D2DCB6'),
      '--input': hexToHslString('#D2DCB6'),
      '--ring': hexToHslString('#A1BC98'),
    },
  },
  // Palette 4: d34e4ef9e7b2ddc57ace7e5a
  {
    name: 'Warm Sunset',
    description: 'Energetic and optimistic, perfect for growth tracking',
    colors: {
      primary: '#D34E4E',
      secondary: '#F9E7B2',
      accent: '#DDC57A',
      background: '#F9E7B2',
      surface: '#FFFFFF',
      text: '#1A1A1A',
      textSecondary: '#4A4A4A',
    },
    cssVariables: {
      '--primary': hexToHslString('#D34E4E'),
      '--primary-foreground': hexToHslString('#FFFFFF'),
      '--secondary': hexToHslString('#F9E7B2'),
      '--secondary-foreground': hexToHslString('#1A1A1A'),
      '--accent': hexToHslString('#DDC57A'),
      '--accent-foreground': hexToHslString('#1A1A1A'),
      '--background': hexToHslString('#F9E7B2'),
      '--foreground': hexToHslString('#1A1A1A'),
      '--muted': hexToHslString('#F9E7B2'),
      '--muted-foreground': hexToHslString('#4A4A4A'),
      '--card': hexToHslString('#FFFFFF'),
      '--card-foreground': hexToHslString('#1A1A1A'),
      '--popover': hexToHslString('#FFFFFF'),
      '--popover-foreground': hexToHslString('#1A1A1A'),
      '--border': hexToHslString('#F9E7B2'),
      '--input': hexToHslString('#F9E7B2'),
      '--ring': hexToHslString('#D34E4E'),
    },
  },
  // Palette 5: ff5555ff937ec1e59fa3d78a
  {
    name: 'Vibrant Coral',
    description: 'Bold and engaging, great for highlighting achievements',
    colors: {
      primary: '#FF5555',
      secondary: '#FF937E',
      accent: '#C1E59F',
      background: '#FFFFFF',
      surface: '#FFFFFF',
      text: '#1A1A1A',
      textSecondary: '#4A4A4A',
    },
    cssVariables: {
      '--primary': hexToHslString('#FF5555'),
      '--primary-foreground': hexToHslString('#FFFFFF'),
      '--secondary': hexToHslString('#FF937E'),
      '--secondary-foreground': hexToHslString('#1A1A1A'),
      '--accent': hexToHslString('#C1E59F'),
      '--accent-foreground': hexToHslString('#1A1A1A'),
      '--background': hexToHslString('#FFFFFF'),
      '--foreground': hexToHslString('#1A1A1A'),
      '--muted': hexToHslString('#FF937E'),
      '--muted-foreground': hexToHslString('#4A4A4A'),
      '--card': hexToHslString('#FFFFFF'),
      '--card-foreground': hexToHslString('#1A1A1A'),
      '--popover': hexToHslString('#FFFFFF'),
      '--popover-foreground': hexToHslString('#1A1A1A'),
      '--border': hexToHslString('#FF937E'),
      '--input': hexToHslString('#FF937E'),
      '--ring': hexToHslString('#FF5555'),
    },
  },
  // Palette 6: 00546101879000b7b5f4f4f4
  {
    name: 'Deep Teal',
    description: 'Professional and sophisticated, ideal for business',
    colors: {
      primary: '#005461',
      secondary: '#018790',
      accent: '#00B7B5',
      background: '#F4F4F4',
      surface: '#FFFFFF',
      text: '#1A1A1A',
      textSecondary: '#4A4A4A',
    },
    cssVariables: {
      '--primary': hexToHslString('#005461'),
      '--primary-foreground': hexToHslString('#FFFFFF'),
      '--secondary': hexToHslString('#018790'),
      '--secondary-foreground': hexToHslString('#FFFFFF'),
      '--accent': hexToHslString('#00B7B5'),
      '--accent-foreground': hexToHslString('#FFFFFF'),
      '--background': hexToHslString('#F4F4F4'),
      '--foreground': hexToHslString('#1A1A1A'),
      '--muted': hexToHslString('#F4F4F4'),
      '--muted-foreground': hexToHslString('#4A4A4A'),
      '--card': hexToHslString('#FFFFFF'),
      '--card-foreground': hexToHslString('#1A1A1A'),
      '--popover': hexToHslString('#FFFFFF'),
      '--popover-foreground': hexToHslString('#1A1A1A'),
      '--border': hexToHslString('#018790'),
      '--input': hexToHslString('#018790'),
      '--ring': hexToHslString('#005461'),
    },
  },
  // Palette 7: 222831393e4600adb5eeeeee
  {
    name: 'Dark Professional',
    description: 'Modern and sleek, perfect for power users',
    colors: {
      primary: '#00ADB5',
      secondary: '#393E46',
      accent: '#EEEEEE',
      background: '#222831',
      surface: '#393E46',
      text: '#EEEEEE',
      textSecondary: '#B8B8B8',
    },
    cssVariables: {
      '--primary': hexToHslString('#00ADB5'),
      '--primary-foreground': hexToHslString('#EEEEEE'),
      '--secondary': hexToHslString('#393E46'),
      '--secondary-foreground': hexToHslString('#EEEEEE'),
      '--accent': hexToHslString('#EEEEEE'),
      '--accent-foreground': hexToHslString('#222831'),
      '--background': hexToHslString('#222831'),
      '--foreground': hexToHslString('#EEEEEE'),
      '--muted': hexToHslString('#393E46'),
      '--muted-foreground': hexToHslString('#B8B8B8'),
      '--card': hexToHslString('#393E46'),
      '--card-foreground': hexToHslString('#EEEEEE'),
      '--popover': hexToHslString('#393E46'),
      '--popover-foreground': hexToHslString('#EEEEEE'),
      '--border': hexToHslString('#393E46'),
      '--input': hexToHslString('#393E46'),
      '--ring': hexToHslString('#00ADB5'),
    },
  },
  // Palette 8: e3fdfdcbf1f5a6e3e971c9ce
  {
    name: 'Mint Fresh',
    description: 'Clean and refreshing, great for clarity',
    colors: {
      primary: '#71C9CE',
      secondary: '#A6E3E9',
      accent: '#CBF1F5',
      background: '#E3FDFD',
      surface: '#FFFFFF',
      text: '#1A1A1A',
      textSecondary: '#4A4A4A',
    },
    cssVariables: {
      '--primary': hexToHslString('#71C9CE'),
      '--primary-foreground': hexToHslString('#1A1A1A'),
      '--secondary': hexToHslString('#A6E3E9'),
      '--secondary-foreground': hexToHslString('#1A1A1A'),
      '--accent': hexToHslString('#CBF1F5'),
      '--accent-foreground': hexToHslString('#1A1A1A'),
      '--background': hexToHslString('#E3FDFD'),
      '--foreground': hexToHslString('#1A1A1A'),
      '--muted': hexToHslString('#CBF1F5'),
      '--muted-foreground': hexToHslString('#4A4A4A'),
      '--card': hexToHslString('#FFFFFF'),
      '--card-foreground': hexToHslString('#1A1A1A'),
      '--popover': hexToHslString('#FFFFFF'),
      '--popover-foreground': hexToHslString('#1A1A1A'),
      '--border': hexToHslString('#CBF1F5'),
      '--input': hexToHslString('#CBF1F5'),
      '--ring': hexToHslString('#71C9CE'),
    },
  },
  // Palette 9: 08d9d6252a34ff2e63eaeaea
  {
    name: 'Neon Accent',
    description: 'Bold and modern, perfect for highlighting',
    colors: {
      primary: '#08D9D6',
      secondary: '#252A34',
      accent: '#FF2E63',
      background: '#EAEAEA',
      surface: '#FFFFFF',
      text: '#252A34',
      textSecondary: '#4A4A4A',
    },
    cssVariables: {
      '--primary': hexToHslString('#08D9D6'),
      '--primary-foreground': hexToHslString('#252A34'),
      '--secondary': hexToHslString('#252A34'),
      '--secondary-foreground': hexToHslString('#FFFFFF'),
      '--accent': hexToHslString('#FF2E63'),
      '--accent-foreground': hexToHslString('#FFFFFF'),
      '--background': hexToHslString('#EAEAEA'),
      '--foreground': hexToHslString('#252A34'),
      '--muted': hexToHslString('#EAEAEA'),
      '--muted-foreground': hexToHslString('#4A4A4A'),
      '--card': hexToHslString('#FFFFFF'),
      '--card-foreground': hexToHslString('#252A34'),
      '--popover': hexToHslString('#FFFFFF'),
      '--popover-foreground': hexToHslString('#252A34'),
      '--border': hexToHslString('#EAEAEA'),
      '--input': hexToHslString('#EAEAEA'),
      '--ring': hexToHslString('#08D9D6'),
    },
  },
  // Palette 10: ad8b73ceab93e3caa5fffbe9
  {
    name: 'Warm Beige',
    description: 'Comfortable and inviting, perfect for family planning',
    colors: {
      primary: '#AD8B73',
      secondary: '#CEAB93',
      accent: '#E3CAA5',
      background: '#FFFBE9',
      surface: '#FFFFFF',
      text: '#2C2C2C',
      textSecondary: '#6B6B6B',
    },
    cssVariables: {
      '--primary': hexToHslString('#AD8B73'),
      '--primary-foreground': hexToHslString('#FFFFFF'),
      '--secondary': hexToHslString('#CEAB93'),
      '--secondary-foreground': hexToHslString('#2C2C2C'),
      '--accent': hexToHslString('#E3CAA5'),
      '--accent-foreground': hexToHslString('#2C2C2C'),
      '--background': hexToHslString('#FFFBE9'),
      '--foreground': hexToHslString('#2C2C2C'),
      '--muted': hexToHslString('#E3CAA5'),
      '--muted-foreground': hexToHslString('#6B6B6B'),
      '--card': hexToHslString('#FFFFFF'),
      '--card-foreground': hexToHslString('#2C2C2C'),
      '--popover': hexToHslString('#FFFFFF'),
      '--popover-foreground': hexToHslString('#2C2C2C'),
      '--border': hexToHslString('#E3CAA5'),
      '--input': hexToHslString('#E3CAA5'),
      '--ring': hexToHslString('#AD8B73'),
    },
  },
  // Palette 11: c4dfdfd2e9e9e3f4f4f8f6f4
  {
    name: 'Aqua Mist',
    description: 'Serene and balanced, ideal for reflection',
    colors: {
      primary: '#C4DFDF',
      secondary: '#D2E9E9',
      accent: '#E3F4F4',
      background: '#F8F6F4',
      surface: '#FFFFFF',
      text: '#1A1A1A',
      textSecondary: '#4A4A4A',
    },
    cssVariables: {
      '--primary': hexToHslString('#C4DFDF'),
      '--primary-foreground': hexToHslString('#1A1A1A'),
      '--secondary': hexToHslString('#D2E9E9'),
      '--secondary-foreground': hexToHslString('#1A1A1A'),
      '--accent': hexToHslString('#E3F4F4'),
      '--accent-foreground': hexToHslString('#1A1A1A'),
      '--background': hexToHslString('#F8F6F4'),
      '--foreground': hexToHslString('#1A1A1A'),
      '--muted': hexToHslString('#E3F4F4'),
      '--muted-foreground': hexToHslString('#4A4A4A'),
      '--card': hexToHslString('#FFFFFF'),
      '--card-foreground': hexToHslString('#1A1A1A'),
      '--popover': hexToHslString('#FFFFFF'),
      '--popover-foreground': hexToHslString('#1A1A1A'),
      '--border': hexToHslString('#E3F4F4'),
      '--input': hexToHslString('#E3F4F4'),
      '--ring': hexToHslString('#C4DFDF'),
    },
  },
  // Palette 12: 040d12183d3d5c837493b1a6
  {
    name: 'Deep Forest',
    description: 'Rich and grounded, perfect for legacy planning',
    colors: {
      primary: '#183D3D',
      secondary: '#5C8374',
      accent: '#93B1A6',
      background: '#040D12',
      surface: '#183D3D',
      text: '#FFFFFF',
      textSecondary: '#B8B8B8',
    },
    cssVariables: {
      '--primary': hexToHslString('#183D3D'),
      '--primary-foreground': hexToHslString('#FFFFFF'),
      '--secondary': hexToHslString('#5C8374'),
      '--secondary-foreground': hexToHslString('#FFFFFF'),
      '--accent': hexToHslString('#93B1A6'),
      '--accent-foreground': hexToHslString('#FFFFFF'),
      '--background': hexToHslString('#040D12'),
      '--foreground': hexToHslString('#FFFFFF'),
      '--muted': hexToHslString('#183D3D'),
      '--muted-foreground': hexToHslString('#B8B8B8'),
      '--card': hexToHslString('#183D3D'),
      '--card-foreground': hexToHslString('#FFFFFF'),
      '--popover': hexToHslString('#183D3D'),
      '--popover-foreground': hexToHslString('#FFFFFF'),
      '--border': hexToHslString('#183D3D'),
      '--input': hexToHslString('#183D3D'),
      '--ring': hexToHslString('#93B1A6'),
    },
  },
  // Palette 13: f9f5f6f8e8eefdcedff2bed1
  {
    name: 'Blush Pink',
    description: 'Soft and caring, great for personal touch',
    colors: {
      primary: '#F2BED1',
      secondary: '#FDCEDF',
      accent: '#F8E8EE',
      background: '#F9F5F6',
      surface: '#FFFFFF',
      text: '#2C2C2C',
      textSecondary: '#6B6B6B',
    },
    cssVariables: {
      '--primary': hexToHslString('#F2BED1'),
      '--primary-foreground': hexToHslString('#2C2C2C'),
      '--secondary': hexToHslString('#FDCEDF'),
      '--secondary-foreground': hexToHslString('#2C2C2C'),
      '--accent': hexToHslString('#F8E8EE'),
      '--accent-foreground': hexToHslString('#2C2C2C'),
      '--background': hexToHslString('#F9F5F6'),
      '--foreground': hexToHslString('#2C2C2C'),
      '--muted': hexToHslString('#F8E8EE'),
      '--muted-foreground': hexToHslString('#6B6B6B'),
      '--card': hexToHslString('#FFFFFF'),
      '--card-foreground': hexToHslString('#2C2C2C'),
      '--popover': hexToHslString('#FFFFFF'),
      '--popover-foreground': hexToHslString('#2C2C2C'),
      '--border': hexToHslString('#FDCEDF'),
      '--input': hexToHslString('#FDCEDF'),
      '--ring': hexToHslString('#F2BED1'),
    },
  },
  // Palette 14: 00000052057b892cdcbc6ff1
  {
    name: 'Royal Purple',
    description: 'Luxurious and premium, perfect for high-value planning',
    colors: {
      primary: '#892CDC',
      secondary: '#52057B',
      accent: '#BC6FF1',
      background: '#000000',
      surface: '#1A1A1A',
      text: '#FFFFFF',
      textSecondary: '#B8B8B8',
    },
    cssVariables: {
      '--primary': hexToHslString('#892CDC'),
      '--primary-foreground': hexToHslString('#FFFFFF'),
      '--secondary': hexToHslString('#52057B'),
      '--secondary-foreground': hexToHslString('#FFFFFF'),
      '--accent': hexToHslString('#BC6FF1'),
      '--accent-foreground': hexToHslString('#FFFFFF'),
      '--background': hexToHslString('#000000'),
      '--foreground': hexToHslString('#FFFFFF'),
      '--muted': hexToHslString('#1A1A1A'),
      '--muted-foreground': hexToHslString('#B8B8B8'),
      '--card': hexToHslString('#1A1A1A'),
      '--card-foreground': hexToHslString('#FFFFFF'),
      '--popover': hexToHslString('#1A1A1A'),
      '--popover-foreground': hexToHslString('#FFFFFF'),
      '--border': hexToHslString('#1A1A1A'),
      '--input': hexToHslString('#1A1A1A'),
      '--ring': hexToHslString('#892CDC'),
    },
  },
]

/**
 * Get palette by name
 */
export function getPalette(name: string): ColorPalette | undefined {
  return colorPalettes.find(p => p.name === name)
}

/**
 * Get default palette
 */
export function getDefaultPalette(): ColorPalette {
  return colorPalettes[0] // Soft Elegance
}

/**
 * Apply palette to document
 */
export function applyPalette(palette: ColorPalette) {
  if (typeof document === 'undefined') return
  
  const root = document.documentElement
  Object.entries(palette.cssVariables).forEach(([key, value]) => {
    root.style.setProperty(key, value)
  })
}
