# TraceDraw iOS — High-Performance Tracing & Drawing Application

Complete, native Apple Swift source code for **TraceDraw iOS**, an offline, zero-dependency drawing and tracing application designed for iPadOS & iOS.

## Architectural Highlights
- **Dual-Layer Canvas Workspace**: A layered `ZStack` interface where a background reference layer is overlaid by a high-performance CoreGraphics foreground drawing canvas.
- **Independent Gesture Decoupling**: Seamless simultaneous pan & magnification gestures on the reference layer without interfering with foreground sketching.
- **3 Local-Only Offline Image Channels**:
  1. **Built-In Vector Library**: 5 natively coded SwiftUI `Shape` paths (`StarShape`, `CatShape`, `HeartShape`, `CarShape`, `FlowerShape`) that scale infinitely.
  2. **PhotosUI Picker**: Native `PhotosPicker` filtering strictly for `.images` and loading via `loadTransferable(type: Data.self)`.
  3. **Files App Importer**: `.fileImporter` with security-scoped URL handling for PNG and JPEG files.
- **Drawing Utilities & Engine**:
  - **Brush Kit**: Thickness slider (1–40 pt), opacity slider (10%–100%), and 8 vibrant color swatches.
  - **Pixel-Accurate Eraser**: Utilizes `Canvas` `blendMode = .destinationOut` on an isolated drawing context layer, erasing user strokes cleanly while leaving the tracing template completely untouched.
  - **Quick Eye Toggle**: Instantly toggles template opacity between 0% and active level.
  - **15-Step Undo/Redo Matrix**: Complete state snapshot history for 15 levels of drawing operations.

## Directory Structure
- `Package.swift` — Swift Package Manager manifest with AppleProductTypes for iPadOS & iOS (zero external dependencies).
- `Sources/App.swift` — Application entry point (`@main`).
- `Sources/ContentView.swift` — Root UI with top navigation, confirmation dialogs, and workspace container.
- `Sources/DualLayerCanvasView.swift` — Dual-layer `ZStack` workspace with isolated canvas rendering, destinationOut eraser, and simultaneous reference gestures.
- `Sources/BottomToolbarView.swift` — Dark-themed bottom toolbar with expandable brush sliders, eraser, and undo/redo controls.
- `Sources/ImageChannelsSheet.swift` — 3 offline image channels (Vector Library, PhotosPicker, Files Importer).
- `Sources/VectorLibraryShapes.swift` — 5 native vector shapes with infinite scaling.
- `Sources/TracingModel.swift` — ObservableObject state management and 15-step undo/redo engine.

## How to Run on iPad or iPhone
1. Open the **Swift Playgrounds** app on your iPad or iPhone, or Xcode on macOS.
2. Create a new App project.
3. Add the files from `Sources/`.
4. Tap **Run** to launch immediately — 100% offline, zero network requests, zero API keys required!
