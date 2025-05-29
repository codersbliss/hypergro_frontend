# Form Builder Application

A powerful and intuitive form builder that allows users to create, customize, and share multi-step forms with drag-and-drop functionality.

## Features

- **Drag-and-Drop Interface**
  - Add form components visually
  - Reorder fields with drag actions
  - Intuitive component sidebar

- **Field Types**
  - Text Input
  - Text Area
  - Dropdown
  - Checkbox
  - Radio Buttons
  - Date Picker
  - Time Picker
  - Range Slider
  - File Upload
  - Headings
  - Paragraphs

- **Field Configuration**
  - Custom labels
  - Placeholders
  - Help text
  - Required fields
  - Validation rules
    - Min/Max length
    - Pattern matching
    - Custom error messages

- **Multi-Step Forms**
  - Step navigation
  - Progress indicators
  - Step-specific validation

- **Real-Time Preview**
  - Desktop view
  - Tablet view
  - Mobile view
  - Live validation

- **Templates**
  - Predefined templates
  - Save custom templates
  - Quick form creation

- **Form Sharing**
  - Shareable URLs
  - Public form view
  - Response collection

- **Additional Features**
  - Auto-save to localStorage
  - Dark/Light theme
  - Undo/Redo functionality
  - View form responses

## Getting Started

### Prerequisites

- Node.js 18.0.0 or higher
- npm 9.0.0 or higher

### Installation

1. Clone the repository:
   ```bash
   git clone https://github.com/codersbliss/hypergro_frontend.git
   ```

2. Navigate to the project directory:
   ```bash
   cd form-builder
   ```

3. Install dependencies:
   ```bash
   npm install
   ```

4. Start the development server:
   ```bash
   npm run dev
   ```

5. Open your browser and visit `http://localhost:5173`

## Usage

### Creating a Form

1. Click "Create Form" on the dashboard
2. Drag components from the sidebar to the canvas
3. Configure field properties in the right panel
4. Add multiple steps if needed
5. Preview your form using the preview button
6. Save and share your form

### Using Templates

1. Select a template from the dashboard
2. Customize the template as needed
3. Save as a new form

### Sharing Forms

1. Click the "Share" button in the form builder
2. Copy the generated URL
3. Share with your users

### Viewing Responses

1. Navigate to the dashboard
2. Find your form
3. Click "View Responses"

## Tech Stack

- React 18
- TypeScript
- Tailwind CSS
- Zustand (State Management)
- react-beautiful-dnd (Drag and Drop)
- Lucide React (Icons)

## Project Structure

```
src/
├── components/
│   ├── builder/         # Form builder components
│   ├── dashboard/       # Dashboard components
│   └── ui/             # Reusable UI components
├── context/            # React context providers
├── pages/              # Route pages
├── store/              # Zustand store
├── types/              # TypeScript types
└── utils/             # Utility functions
```

