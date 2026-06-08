// tailwind.config.js
export default {
  content: [
    "./src/**/*.{js,ts,jsx,tsx}", // adjust as per your project
  ],
  theme: {
    extend: {
      fontFamily: {
        poppins: ['Poppins', 'sans-serif'],
        roboto: ['Roboto', 'sans-serif'],
      },
      colors: {
        wellness: {
          dark: '#1F4D43',     // dark green background
          medium: '#4E7C6E',   // mid green tone
          light: '#9CC8A1',    // light green (background tint)
          leaf: '#B9D46D',     // yellow-green leaves
          brown: '#7B4E2C',    // tree trunk
        },
      },
    },
  },
  plugins: [],
}
