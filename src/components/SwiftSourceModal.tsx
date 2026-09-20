import React, { useState } from 'react';
import {
  Code,
  Download,
  Copy,
  Check,
  X,
  FileCode,
  Sparkles,
  Smartphone,
} from 'lucide-react';

interface SwiftSourceModalProps {
  isOpen: boolean;
  onClose: () => void;
}

interface SwiftFileEntry {
  filename: string;
  title: string;
  description: string;
  downloadUrl: string;
  codeSnippet: string;
}

const SWIFT_FILES: SwiftFileEntry[] = [
  {
    filename: 'ContentView.swift',
    title: 'ContentView & Navigation',
    description: 'Root view with dual-layer canvas, top navigation, bottom toolbar, and startup selection sheet',
    downloadUrl: '/swift/ContentView.swift',
    codeSnippet: `import SwiftUI

// MARK: - Root Content View for iOS Tracing & Drawing Application

public struct ContentView: View {
    @StateObject private var state = TracingAppState()
    @State private var isTargetPickerPresented: Bool = false
    @State private var isExportPresented: Bool = false
    @State private var isClearConfirmationPresented: Bool = false
    
    // Startup: 3 Random Drawing Options
    @State private var isStartupPresented: Bool = true
    @State private var startupOptions: [VectorShapeType] = []
    
    public init() {}
    
    public var body: some View {
        ZStack {
            // Background Canvas Workspace
            DualLayerCanvasView(state: state)
                .ignoresSafeArea(.all, edges: .top)
            
            // Top Navigation Bar
            VStack {
                HStack(spacing: 12) {
                    // App Identity Pill
                    HStack(spacing: 8) {
                        Image(systemName: "pencil.and.outline")
                            .font(.system(size: 15, weight: .bold))
                            .foregroundColor(.cyan)
                        Text("Drawing Studio")
                            .font(.system(size: 15, weight: .bold, design: .rounded))
                            .foregroundColor(.white)
                    }
                    .padding(.horizontal, 14)
                    .padding(.vertical, 8)
                    .background(Color(red: 0.12, green: 0.12, blue: 0.14).opacity(0.85))
                    .clipShape(Capsule())
                    .overlay(
                        Capsule()
                            .stroke(Color.white.opacity(0.12), lineWidth: 1)
                    )
                    
                    Spacer()
                    
                    // Export to Photos Button
                    Button {
                        isExportPresented = true
                    } label: {
                        HStack(spacing: 6) {
                            Image(systemName: "square.and.arrow.up")
                                .font(.system(size: 13, weight: .bold))
                            Text("Export")
                                .font(.system(size: 13, weight: .bold))
                        }
                        .foregroundColor(.cyan)
                        .padding(.horizontal, 14)
                        .padding(.vertical, 8)
                        .background(Color(red: 0.12, green: 0.12, blue: 0.14).opacity(0.85))
                        .clipShape(Capsule())
                        .overlay(
                            Capsule()
                                .stroke(Color.cyan.opacity(0.35), lineWidth: 1)
                        )
                    }
                    
                    // Clear Canvas Action
                    Button {
                        if !state.lines.isEmpty {
                            isClearConfirmationPresented = true
                        }
                    } label: {
                        Image(systemName: "trash")
                            .font(.system(size: 14, weight: .semibold))
                            .foregroundColor(.gray)
                            .frame(width: 36, height: 36)
                            .background(Color(red: 0.12, green: 0.12, blue: 0.14).opacity(0.85))
                            .clipShape(Circle())
                            .overlay(
                                Circle()
                                    .stroke(Color.white.opacity(0.12), lineWidth: 1)
                            )
                    }
                    .disabled(state.lines.isEmpty)
                    .opacity(state.lines.isEmpty ? 0.4 : 1.0)
                    .confirmationDialog(
                        "Clear Drawing Canvas?",
                        isPresented: $isClearConfirmationPresented,
                        titleVisibility: .visible
                    ) {
                        Button("Clear All Strokes", role: .destructive) {
                            state.clearCanvas()
                        }
                        Button("Cancel", role: .cancel) {}
                    } message: {
                        Text("This will clear your foreground strokes while leaving your drawing layer untouched.")
                    }
                }
                .padding(.horizontal, 16)
                .padding(.top, 10)
                
                Spacer()
                
                // Bottom Toolbar
                BottomToolbarView(
                    state: state,
                    isTargetPickerPresented: $isTargetPickerPresented,
                    isExportPresented: $isExportPresented
                )
            }
        }
        .onAppear {
            if startupOptions.isEmpty {
                startupOptions = TracingAppState.generateRandomOptions(count: 3)
            }
        }
        .sheet(isPresented: $isStartupPresented) {
            StartupOptionsSheet(
                options: $startupOptions,
                onSelectOption: { chosenShape in
                    state.setVectorTarget(chosenShape)
                    isStartupPresented = false
                },
                onExploreAll: {
                    isStartupPresented = false
                    isTargetPickerPresented = true
                }
            )
        }
        .sheet(isPresented: $isTargetPickerPresented) {
            ImageChannelsSheet(state: state)
        }
        .sheet(isPresented: $isExportPresented) {
            ExportPhotoSheet(appState: state)
        }
        .preferredColorScheme(.dark)
    }
}

// MARK: - Startup 3 Random Options Sheet
public struct StartupOptionsSheet: View {
    @Binding public var options: [VectorShapeType]
    public let onSelectOption: (VectorShapeType) -> Void
    public let onExploreAll: () -> Void
    @Environment(\\.dismiss) private var dismiss
    
    public init(
        options: Binding<[VectorShapeType]>,
        onSelectOption: @escaping (VectorShapeType) -> Void,
        onExploreAll: @escaping () -> Void
    ) {
        self._options = options
        self.onSelectOption = onSelectOption
        self.onExploreAll = onExploreAll
    }
    
    public var body: some View {
        NavigationStack {
            ZStack {
                Color(red: 0.10, green: 0.10, blue: 0.12)
                    .ignoresSafeArea()
                
                VStack(spacing: 24) {
                    VStack(spacing: 6) {
                        Text("Pick a Drawing to Start")
                            .font(.system(size: 22, weight: .bold, design: .rounded))
                            .foregroundColor(.white)
                        Text("Choose one of 3 random drawings to begin your session:")
                            .font(.system(size: 14, weight: .medium))
                            .foregroundColor(.gray)
                            .multilineTextAlignment(.center)
                    }
                    .padding(.top, 16)
                    
                    VStack(spacing: 12) {
                        ForEach(options) { shape in
                            StartupOptionRow(shape: shape) {
                                onSelectOption(shape)
                            }
                        }
                    }
                    .padding(.horizontal, 20)
                    
                    Spacer()
                    
                    VStack(spacing: 10) {
                        Button {
                            withAnimation(.easeInOut(duration: 0.2)) {
                                options = TracingAppState.generateRandomOptions(count: 3)
                            }
                        } label: {
                            HStack(spacing: 8) {
                                Image(systemName: "dice.fill")
                                    .font(.system(size: 14, weight: .bold))
                                Text("Shuffle 3 New Options")
                                    .font(.system(size: 14, weight: .bold))
                            }
                            .foregroundColor(.white)
                            .frame(maxWidth: .infinity)
                            .padding(.vertical, 12)
                            .background(Color.white.opacity(0.08))
                            .clipShape(Capsule())
                        }
                        
                        Button {
                            onExploreAll()
                        } label: {
                            Text("Browse All 25 Drawings in Library")
                                .font(.system(size: 13, weight: .semibold))
                                .foregroundColor(.cyan)
                        }
                        .padding(.top, 4)
                    }
                    .padding(.horizontal, 20)
                    .padding(.bottom, 20)
                }
            }
            .navigationTitle("Welcome")
            .navigationBarTitleDisplayMode(.inline)
            .toolbar {
                ToolbarItem(placement: .navigationBarTrailing) {
                    Button("Skip") {
                        dismiss()
                    }
                    .font(.system(size: 14, weight: .semibold))
                    .foregroundColor(.gray)
                }
            }
        }
    }
}

// MARK: - Startup Option Row Card
public struct StartupOptionRow: View {
    public let shape: VectorShapeType
    public let onSelect: () -> Void
    
    public init(shape: VectorShapeType, onSelect: @escaping () -> Void) {
        self.shape = shape
        self.onSelect = onSelect
    }
    
    public var body: some View {
        Button(action: onSelect) {
            HStack(spacing: 16) {
                ZStack {
                    RoundedRectangle(cornerRadius: 14)
                        .fill(Color.white.opacity(0.06))
                        .frame(width: 64, height: 64)
                    
                    VectorRendererView(shapeType: shape, strokeColor: .cyan, lineWidth: 2.5)
                        .frame(width: 42, height: 42)
                }
                
                VStack(alignment: .leading, spacing: 4) {
                    Text(shape.rawValue)
                        .font(.system(size: 16, weight: .bold, design: .rounded))
                        .foregroundColor(.white)
                    
                    HStack(spacing: 6) {
                        Text(shape.category.rawValue.capitalized)
                            .font(.system(size: 11, weight: .heavy))
                            .foregroundColor(.cyan)
                            .padding(.horizontal, 7)
                            .padding(.vertical, 2)
                            .background(Color.cyan.opacity(0.15))
                            .clipShape(Capsule())
                        
                        Text("Tap to draw")
                            .font(.system(size: 12, weight: .medium))
                            .foregroundColor(.gray)
                    }
                }
                
                Spacer()
                
                Image(systemName: "pencil.line")
                    .font(.system(size: 18, weight: .semibold))
                    .foregroundColor(.cyan)
            }
            .padding(14)
            .background(Color(red: 0.16, green: 0.16, blue: 0.18))
            .cornerRadius(18)
            .overlay(
                RoundedRectangle(cornerRadius: 18)
                    .stroke(Color.white.opacity(0.10), lineWidth: 1)
            )
        }
        .buttonStyle(.plain)
    }
}`,
  },
  {
    filename: 'TracingModel.swift',
    title: 'Model & 15-Step Undo Engine',
    description: 'ObservableObject managing strokes, 15-step undo/redo stack, and reference state',
    downloadUrl: '/swift/TracingModel.swift',
    codeSnippet: `import SwiftUI
import Combine

// MARK: - Tracing App State & 15-Step Undo/Redo Engine
@MainActor
public class TracingAppState: ObservableObject {
    @Published public var lines: [DrawingLine] = []
    @Published public var currentLine: DrawingLine?
    
    // 15-Step Undo/Redo Matrix
    private let maxUndoSteps = 15
    @Published public var undoStack: [[DrawingLine]] = []
    @Published public var redoStack: [[DrawingLine]] = []
    
    // Brush & Eraser State
    @Published public var currentTool: DrawingTool = .brush
    @Published public var selectedColor: Color = .white
    @Published public var lineWidth: CGFloat = 6.0
    @Published public var brushOpacity: Double = 1.0
    
    // Reference Layer State
    @Published public var referenceTarget: ReferenceTarget = .vector(.star)
    @Published public var isReferenceVisible: Bool = true
    @Published public var referenceOpacity: Double = 0.45
    @Published public var isAdjustingReference: Bool = false
    
    public func startLine(at point: CGPoint) {
        guard !isAdjustingReference else { return }
        currentLine = DrawingLine(
            points: [point],
            color: selectedColor,
            lineWidth: lineWidth,
            opacity: brushOpacity,
            isEraser: currentTool == .eraser
        )
    }
    
    public func endLine() {
        guard let line = currentLine else { return }
        undoStack.append(lines)
        if undoStack.count > maxUndoSteps { undoStack.removeFirst() }
        redoStack.removeAll()
        lines.append(line)
        currentLine = nil
    }
}`,
  },
  {
    filename: 'SFSymbolsLibraryView.swift',
    title: 'SF Symbols Curated Template Library',
    description: 'Extensive library of 250+ fun, trace-ready Apple SF Symbols across Creatures & Nature, Vehicles & Speed, Gaming & Fun, Sports & Geometry with automated pattern generator',
    downloadUrl: '/swift/SFSymbolsLibraryView.swift',
    codeSnippet: `import SwiftUI

// MARK: - Curated SF Symbols Matrix & Automated Pattern Generator
// Filters out boring UI elements (arrows, gears, clipboards, checkboxes)
// Expands seeds into hundreds of validated symbols:

public struct SFSymbolCatalogEngine {
    public static let creaturesAndNatureSeeds = [
        "pawprint.fill", "hare.fill", "tortoise.fill", "bird.fill", "fish.fill", "ant.fill",
        "ladybug.fill", "butterfly.fill", "leaf.fill", "tree.fill", "flame.fill", "sun.max.fill",
        "moon.stars.fill", "cloud.bolt.rain.fill", "sparkles", "fossil.shell.fill"
    ]
    public static let vehiclesAndSpeedSeeds = [
        "car.fill", "car.side.fill", "truck.box.fill", "airplane", "bicycle",
        "scooter", "tram.fill", "sailboat.fill", "rocket.fill", "helicopter.fill", "motorcycle.fill"
    ]
    public static let gamingAndFunSeeds = [
        "gamecontroller.fill", "tv.fill", "headphones", "guitar.fill", "book.fill",
        "paintbrush.filled.hover.button.shape", "lightbulb.fill", "binoculars.fill",
        "dice.fill", "puzzlepiece.fill", "theatermasks.fill", "crown.fill"
    ]
    public static let sportsAndGeometrySeeds = [
        "soccerball", "basketball.fill", "trophy.fill", "medal.fill", "umbrella.fill",
        "key.fill", "gift.fill", "hourglass", "shield.fill", "waveform.path"
    ]
    
    // Automated pattern generator:
    // - Programmatically generates celestial & weather matrices (sun, moon, cloud variations)
    // - Loops geometric bases with .circle.fill and .square.fill
    // - Programmatically builds dice matrix (die.face.1.fill ... die.face.6.fill)
    // - Validates symbol existence against iOS system library (UIImage(systemName: candidate) != nil)
}

// Rendered in LazyVGrid with dark-mode square grid cards using .font(.system(size: 36))
// Tapping sets selectedSymbolName binding and immediately loads vector blueprint to backdrop layer`,
  },
  {
    filename: 'DualLayerCanvasView.swift',
    title: 'Dual-Layer Canvas & Eraser',
    description: 'ZStack architecture, destinationOut pixel-accurate eraser, and simultaneous gestures',
    downloadUrl: '/swift/DualLayerCanvasView.swift',
    codeSnippet: `import SwiftUI

// MARK: - Dual-Layer Canvas Workspace (ZStack Overlay Architecture)
public struct DualLayerCanvasView: View {
    @ObservedObject public var state: TracingAppState
    
    public var body: some View {
        GeometryReader { geometry in
            ZStack {
                // Background Mat
                Color(red: 0.08, green: 0.08, blue: 0.10).ignoresSafeArea()
                DraftingGridView().opacity(0.12)
                
                // LAYER 1: Background Reference Tracing Layer
                ReferenceLayerContainerView(state: state, bounds: geometry.size)
                    .opacity(state.referenceOpacity)
                    .allowsHitTesting(state.isAdjustingReference)
                
                // LAYER 2: Foreground Drawing Canvas Layer
                ForegroundDrawingCanvasView(state: state)
                    .allowsHitTesting(!state.isAdjustingReference)
            }
        }
    }
}

// Pixel-Accurate Eraser Engine via blendMode(.destinationOut)
public struct ForegroundDrawingCanvasView: View {
    @ObservedObject public var state: TracingAppState
    
    public var body: some View {
        Canvas { context, size in
            context.drawLayer { drawingContext in
                for line in state.lines {
                    var path = Path()
                    guard let firstPoint = line.points.first else { continue }
                    path.move(to: firstPoint)
                    for pt in line.points.dropFirst() { path.addLine(to: pt) }
                    
                    let strokeStyle = StrokeStyle(lineWidth: line.lineWidth, lineCap: .round, lineJoin: .round)
                    if line.isEraser {
                        // Pixel-accurate eraser: cuts only from foreground drawing layer!
                        drawingContext.blendMode = .destinationOut
                        drawingContext.stroke(path, with: .color(.black), style: strokeStyle)
                    } else {
                        drawingContext.blendMode = .normal
                        drawingContext.stroke(path, with: .color(line.color.opacity(line.opacity)), style: strokeStyle)
                    }
                }
            }
        }
    }
}`,
  },
  {
    filename: 'VectorLibraryShapes.swift',
    title: '15 Built-In Vector Shapes',
    description: 'Animals (Lion, Bird, Cat), Fruits (Strawberry, Orange), Sweets (Candy, Marshmallow, M&Ms), & Basics (Star, Heart, Car, Flower)',
    downloadUrl: '/swift/VectorLibraryShapes.swift',
    codeSnippet: `import SwiftUI

// 15 Natively Coded SwiftUI Shapes scaling infinitely without images:
// 🦁 Animals: LionShape, BirdShape, CatShape
// 🍓 Fruits: StrawberryShape, OrangeShape
// 🍬 Sweets: CandyShape, MarshmallowShape, MMSpillShape
// 🌟 Basics: StarShape, HeartShape, CarShape, FlowerShape, CrescentShape, DiamondShape, ButterflyShape`,
  },
  {
    filename: 'ExportPhotoSheet.swift',
    title: 'Export to Photos Engine',
    description: 'Offscreen UIGraphicsImageRenderer (1080x1080 up to 3x Retina) saving directly to iOS Photos with PHPhotoLibrary and haptic feedback',
    downloadUrl: '/swift/ExportPhotoSheet.swift',
    codeSnippet: `import SwiftUI
import Photos

// Offscreen rendering engine with transparent, dark mat, or composite backgrounds:
let renderer = UIGraphicsImageRenderer(size: canvasSize, format: format)
let image = renderer.image { ctx in
    // Renders drawing lines with native CoreGraphics blends and anti-aliasing
}
PHPhotoLibrary.requestAuthorization(for: .addOnly) { status in
    if status == .authorized || status == .limited {
        UIImageWriteToSavedPhotosAlbum(image, nil, nil, nil)
    }
}`,
  },
  {
    filename: 'ImageChannelsSheet.swift',
    title: '3 Offline Target Channels',
    description: 'Vector Library, PhotosUI PhotosPicker, and .fileImporter with safe security scoping',
    downloadUrl: '/swift/ImageChannelsSheet.swift',
    codeSnippet: `import SwiftUI
import PhotosUI
import UniformTypeIdentifiers

// Channel 1: Built-In Vector Library
// Channel 2: PhotosPicker(selection: $photoItem, matching: .images)
// Channel 3: .fileImporter(allowedContentTypes: [.png, .jpeg]) with startAccessingSecurityScopedResource()`,
  },
  {
    filename: 'BottomToolbarView.swift',
    title: 'Bottom Toolbar & Brush Kit',
    description: 'Dark-themed floating capsule with thickness & opacity sliders, color swatches, and eye toggle',
    downloadUrl: '/swift/BottomToolbarView.swift',
    codeSnippet: `import SwiftUI

// Includes:
// - Line Thickness Slider (1...40 pt)
// - Brush Opacity Slider (0.1...1.0)
// - 8 Vibrant Color Swatches
// - Pixel-Accurate Eraser Button
// - Quick Eye Toggle Button (0% <-> 100% opacity)
// - 15-Step Undo/Redo Buttons`,
  },
  {
    filename: 'Package.swift',
    title: 'Swift Package Manifest',
    description: 'Zero-dependency iPadOS & iOS package specification for Swift Playgrounds & Xcode',
    downloadUrl: '/swift/Package.swift',
    codeSnippet: `// swift-tools-version: 5.9
import PackageDescription
import AppleProductTypes

let package = Package(
    name: "DrawingStudio",
    platforms: [.iOS("16.0")],
    products: [
        .iOSApplication(
            name: "Drawing Studio iOS",
            targets: ["AppModule"],
            capabilities: [.photoLibrary(purposeString: "Import reference photos")]
        )
    ],
    targets: [.executableTarget(name: "AppModule", path: "Sources")]
)`,
  },
];

export const SwiftSourceModal: React.FC<SwiftSourceModalProps> = ({ isOpen, onClose }) => {
  const [selectedFile, setSelectedFile] = useState<SwiftFileEntry>(SWIFT_FILES[0]);
  const [isCopied, setIsCopied] = useState<boolean>(false);

  if (!isOpen) return null;

  const handleCopy = () => {
    navigator.clipboard.writeText(selectedFile.codeSnippet);
    setIsCopied(true);
    setTimeout(() => setIsCopied(false), 2000);
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/80 backdrop-blur-md animate-in fade-in duration-200">
      <div className="w-full max-w-4xl bg-[#141417] border border-white/10 rounded-3xl shadow-2xl flex flex-col max-h-[90vh] overflow-hidden">
        {/* Header */}
        <div className="flex items-center justify-between px-6 py-4 border-b border-white/10 bg-[#19191d]">
          <div className="flex items-center gap-3">
            <div className="w-9 h-9 rounded-xl bg-cyan-500/20 flex items-center justify-center text-cyan-400">
              <Code className="w-5 h-5" />
            </div>
            <div>
              <h2 className="text-base font-bold text-white flex items-center gap-2">
                <span>Native Swift Source Code</span>
                <span className="px-2 py-0.5 rounded-full text-[10px] font-extrabold bg-cyan-500/20 text-cyan-300 border border-cyan-400/30">
                  SwiftUI + CoreGraphics
                </span>
              </h2>
              <p className="text-xs text-gray-400">
                100% Local & Offline • Ready for Swift Playgrounds (iPad) & Xcode (iOS)
              </p>
            </div>
          </div>

          <div className="flex items-center gap-2">
            <a
              href="/SwiftFiles.zip"
              download="DrawingStudio_SwiftFiles.zip"
              className="flex items-center gap-2 px-3.5 py-1.5 rounded-full bg-cyan-500 hover:bg-cyan-400 text-black text-xs font-bold transition-colors shadow-lg shadow-cyan-500/20"
            >
              <Download className="w-3.5 h-3.5" />
              <span>Download All (.ZIP)</span>
            </a>
            <button
              onClick={onClose}
              className="p-2 rounded-full bg-white/5 hover:bg-white/10 text-gray-400 hover:text-white transition-colors"
            >
              <X className="w-4 h-4" />
            </button>
          </div>
        </div>

        {/* Content Layout */}
        <div className="flex-1 flex flex-col md:flex-row overflow-hidden">
          {/* File Selector Sidebar */}
          <div className="w-full md:w-64 border-b md:border-b-0 md:border-r border-white/10 p-3 space-y-1 overflow-y-auto bg-[#161619]">
            <div className="text-[11px] font-bold text-gray-400 uppercase tracking-wider px-3 py-2">
              Swift Project Files
            </div>
            {SWIFT_FILES.map((file) => {
              const isSelected = selectedFile.filename === file.filename;
              return (
                <button
                  key={file.filename}
                  onClick={() => setSelectedFile(file)}
                  className={`w-full flex items-center gap-2.5 px-3 py-2.5 rounded-xl text-left transition-all ${
                    isSelected
                      ? 'bg-cyan-500/20 text-cyan-300 border border-cyan-400/30 font-semibold'
                      : 'hover:bg-white/5 text-gray-300 text-sm'
                  }`}
                >
                  <FileCode className="w-4 h-4 flex-shrink-0" />
                  <span className="truncate text-xs">{file.filename}</span>
                </button>
              );
            })}
          </div>

          {/* Code Viewer Panel */}
          <div className="flex-1 flex flex-col overflow-hidden bg-[#0d0d10]">
            <div className="flex items-center justify-between px-6 py-3 border-b border-white/5 bg-[#111114]">
              <div>
                <div className="text-xs font-bold text-white">{selectedFile.title}</div>
                <div className="text-[11px] text-gray-400">{selectedFile.description}</div>
              </div>

              <div className="flex items-center gap-2">
                <button
                  onClick={handleCopy}
                  className="flex items-center gap-1.5 px-3 py-1.5 rounded-lg bg-white/5 hover:bg-white/10 text-gray-300 text-xs font-medium transition-colors"
                >
                  {isCopied ? <Check className="w-3.5 h-3.5 text-green-400" /> : <Copy className="w-3.5 h-3.5" />}
                  <span>{isCopied ? 'Copied' : 'Copy'}</span>
                </button>
                <a
                  href={selectedFile.downloadUrl}
                  download={selectedFile.filename}
                  className="flex items-center gap-1.5 px-3 py-1.5 rounded-lg bg-white/5 hover:bg-white/10 text-gray-300 text-xs font-medium transition-colors"
                >
                  <Download className="w-3.5 h-3.5" />
                  <span>Download</span>
                </a>
              </div>
            </div>

            <pre className="flex-1 p-6 text-xs font-mono text-gray-300 overflow-auto whitespace-pre leading-relaxed select-text">
              <code>{selectedFile.codeSnippet}</code>
            </pre>
          </div>
        </div>

        {/* Footer / Instructions */}
        <div className="px-6 py-3 border-t border-white/10 bg-[#161619] flex items-center justify-between text-xs text-gray-400">
          <div className="flex items-center gap-2">
            <Smartphone className="w-4 h-4 text-cyan-400" />
            <span>To run on iPad: Open Swift Playgrounds, create App, and paste these source files.</span>
          </div>
          <span className="text-[11px] text-gray-500">Zero Dependencies • 100% Offline</span>
        </div>
      </div>
    </div>
  );
};
