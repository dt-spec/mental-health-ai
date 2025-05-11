# Haven - Mental Health Voice Assistant

Haven is a compassionate mental health voice assistant that provides emotional support and guidance through voice conversations. It offers a safe space for users to express their feelings and receive helpful responses.

## Features

- Voice-based conversation interface
- Mood tracking and emotional support
- Guided breathing exercises and mindfulness techniques
- Daily affirmations and positive reinforcement
- Crisis support resources
- Expandable question categories for easy navigation

## Tech Stack

- Next.js
- TypeScript
- Framer Motion for animations
- ElevenLabs for voice synthesis
- OpenAI for conversation processing

## Getting Started

1. Clone the repository:
```bash
git clone https://github.com/yourusername/haven.git
cd haven
```

2. Install dependencies:
```bash
npm install
```

3. Create a `.env.local` file in the root directory and add your API keys:
```
ELEVENLABS_API_KEY=your_elevenlabs_api_key
OPENAI_API_KEY=your_openai_api_key
```

4. Run the development server:
```bash
npm run dev
```

5. Open [http://localhost:3000](http://localhost:3000) in your browser.

## Usage

1. Select your current mood from the options provided
2. Click "Start Conversation" to begin speaking with Haven
3. Use the suggested questions or ask your own
4. Click "Stop Conversation" when you're done

## Project Structure

```
├── components/
│   └── conversation.tsx    # Main conversation component
├── pages/
│   ├── index.tsx          # Main page
│   └── api/              # API routes
├── styles/
│   └── Home.module.css   # Component styles
└── public/              # Static assets
```

## Contributing

Contributions are welcome! Please feel free to submit a Pull Request.

## License

This project is licensed under the MIT License - see the [LICENSE](LICENSE) file for details.

## Acknowledgments

- ElevenLabs for the voice API
- OpenAI for the language model
- Next.js team for the amazing framework 