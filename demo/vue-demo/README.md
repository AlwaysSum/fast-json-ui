# Fast-JSON-UI-Vue Demo

This is a demo application for the Fast-JSON-UI-Vue library, which allows you to convert JSON configurations to Vue components.

## Features

- Basic and advanced examples of using the Fast-JSON-UI-Vue library
- Live JSON configuration editor
- Data binding and method binding examples
- Custom component examples

## Getting Started

### Prerequisites

- Node.js (v14 or later)
- npm or yarn

### Installation

1. Clone the repository:
   ```bash
   git clone https://github.com/yourusername/fast-json-ui.git
   cd fast-json-ui
   ```

2. Install dependencies for the library:
   ```bash
   cd ui-vue
   npm install
   ```

3. Install dependencies for the demo:
   ```bash
   cd ../demo/vue-demo
   npm install
   ```

4. Link the library to the demo:
   ```bash
   npm link ../../ui-vue
   ```

### Running the Demo

```bash
npm run dev
```

This will start the development server and open the demo application in your browser.

## Usage

The demo application includes:

1. **Basic Example**: Shows how to use the basic components and layouts.
2. **Advanced Example**: Demonstrates more complex configurations with nested components and custom components.

You can edit the JSON configuration and data in real-time to see how the UI changes.

## Custom Components

The demo includes custom component examples that show how to extend the Fast-JSON-UI-Vue library with your own components.

## License

MIT
