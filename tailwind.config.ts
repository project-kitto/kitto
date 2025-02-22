import { Config } from 'tailwindcss';

const config: Config = {
    // ...existing config...
    theme: {
        extend: {
            // ...existing extends...
        },
    },
    plugins: [
        // ...existing plugins...
        require('tailwind-scrollbar'),
    ],
}

export default config;
