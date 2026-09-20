import SwiftUI
import Combine

// MARK: - Drawing Data Structures

public struct DrawingPoint: Equatable, Codable {
    public let x: CGFloat
    public let y: CGFloat
    
    public init(x: CGFloat, y: CGFloat) {
        self.x = x
        self.y = y
    }
    
    public init(_ point: CGPoint) {
        self.x = point.x
        self.y = point.y
    }
    
    public var cgPoint: CGPoint {
        CGPoint(x: x, y: y)
    }
}

public enum DrawingTool: String, CaseIterable, Identifiable {
    case brush = "Studio Brush"
    case pen = "Studio Pen"
    case pencil = "Graphite Pencil"
    case highlighter = "Marker"
    case eraser = "Eraser"
    
    public var id: String { rawValue }
    
    public var systemIcon: String {
        switch self {
        case .brush: return "paintbrush.pointed.fill"
        case .pen: return "pencil.tip"
        case .pencil: return "pencil"
        case .highlighter: return "highlighter"
        case .eraser: return "eraser.fill"
        }
    }
}

public enum CompositionGuide: String, CaseIterable, Identifiable {
    case none = "None"
    case ruleOfThirds = "Rule of Thirds"
    case crosshair = "Crosshair"
    case dots = "Dot Grid"
    
    public var id: String { rawValue }
}

public struct DrawingLine: Identifiable, Equatable {
    public let id: UUID
    public var points: [CGPoint]
    public var color: Color
    public var lineWidth: CGFloat
    public var opacity: Double
    public var isEraser: Bool
    public var tool: DrawingTool
    
    public init(
        id: UUID = UUID(),
        points: [CGPoint] = [],
        color: Color = .white,
        lineWidth: CGFloat = 5.0,
        opacity: Double = 1.0,
        isEraser: Bool = false,
        tool: DrawingTool = .brush
    ) {
        self.id = id
        self.points = points
        self.color = color
        self.lineWidth = lineWidth
        self.opacity = opacity
        self.isEraser = isEraser
        self.tool = tool
    }
}

public enum VectorCategory: String, CaseIterable, Identifiable {
    case all = "All"
    case space = "Space"
    case animals = "Animals"
    case nature = "Nature & Magic"
    case vehicles = "Vehicles"
    case fruits = "Fruits"
    case sweets = "Candy & Sweets"
    case basics = "Basics"
    
    public var id: String { rawValue }
    
    public var emoji: String {
        switch self {
        case .all: return "✨"
        case .space: return "🚀"
        case .animals: return "🐼"
        case .nature: return "🦋"
        case .vehicles: return "⛵"
        case .fruits: return "🍓"
        case .sweets: return "🍬"
        case .basics: return "🌟"
        }
    }
}

public enum VectorShapeType: String, CaseIterable, Identifiable {
    // Space
    case rocket = "Rocket Ship"
    case planet = "Saturn Planet"
    case astronaut = "Astronaut Helmet"
    
    // Animals
    case panda = "Panda Bear"
    case dolphin = "Dolphin"
    case lion = "Lion"
    case bird = "Bird"
    case cat = "Cat"
    
    // Nature & Magic
    case butterfly = "Butterfly"
    case bonsai = "Bonsai Tree"
    case crystal = "Magic Crystal"
    
    // Vehicles
    case sailboat = "Sailboat"
    case airplane = "Jetliner"
    case car = "Vintage Car"
    
    // Fruits
    case strawberry = "Strawberry"
    case orange = "Orange"
    case watermelon = "Watermelon"
    case apple = "Apple"
    
    // Sweets & Candy
    case marshmallow = "Marshmallow"
    case mnms = "M&M's"
    case lollipop = "Lollipop"
    case candy = "Wrapped Candy"
    
    // Basics & Shapes
    case star = "Star"
    case heart = "Heart"
    case flower = "Flower"
    
    public var id: String { rawValue }
    
    public var category: VectorCategory {
        switch self {
        case .rocket, .planet, .astronaut:
            return .space
        case .panda, .dolphin, .lion, .bird, .cat:
            return .animals
        case .butterfly, .bonsai, .crystal:
            return .nature
        case .sailboat, .airplane, .car:
            return .vehicles
        case .strawberry, .orange, .watermelon, .apple:
            return .fruits
        case .marshmallow, .mnms, .lollipop, .candy:
            return .sweets
        case .star, .heart, .flower:
            return .basics
        }
    }
    
    public var iconName: String {
        switch self {
        case .rocket: return "airplane.departure"
        case .planet: return "globe.americas.fill"
        case .astronaut: return "person.crop.circle"
        case .panda: return "face.smiling"
        case .dolphin: return "water.waves"
        case .lion: return "crown.fill"
        case .bird: return "bird.fill"
        case .cat: return "pawprint.fill"
        case .butterfly: return "camera.macro"
        case .bonsai: return "leaf.arrow.circlepath"
        case .crystal: return "sparkles"
        case .sailboat: return "sailboat.fill"
        case .airplane: return "airplane"
        case .car: return "car.fill"
        case .strawberry: return "leaf.fill"
        case .orange: return "circle.dashed"
        case .watermelon: return "moon.fill"
        case .apple: return "apple.logo"
        case .marshmallow: return "oval.portrait.fill"
        case .mnms: return "circle.circle.fill"
        case .lollipop: return "circle.hexagongrid.fill"
        case .candy: return "sparkles"
        case .star: return "star.fill"
        case .heart: return "heart.fill"
        case .flower: return "camera.macro"
        }
    }
}

public enum ReferenceTarget: Equatable {
    case vector(VectorShapeType)
    case symbol(String)
    case image(UIImage)
    
    public static func == (lhs: ReferenceTarget, rhs: ReferenceTarget) -> Bool {
        switch (lhs, rhs) {
        case let (.vector(v1), .vector(v2)):
            return v1 == v2
        case let (.symbol(s1), .symbol(s2)):
            return s1 == s2
        case let (.image(img1), .image(img2)):
            return img1 === img2
        default:
            return false
        }
    }
}

public struct ReferenceLayerTransform: Equatable {
    public var offset: CGSize = .zero
    public var scale: CGFloat = 1.0
    
    public init(offset: CGSize = .zero, scale: CGFloat = 1.0) {
        self.offset = offset
        self.scale = scale
    }
}

// MARK: - Tracing App State & Undo/Redo Engine

@MainActor
public class TracingAppState: ObservableObject {
    // Canvas Strokes
    @Published public var lines: [DrawingLine] = []
    @Published public var currentLine: DrawingLine?
    
    // 15-Step Undo/Redo Matrix
    private let maxUndoSteps = 15
    @Published public var undoStack: [[DrawingLine]] = []
    @Published public var redoStack: [[DrawingLine]] = []
    
    // Active Brush & Pro Tools
    @Published public var currentTool: DrawingTool = .brush
    @Published public var selectedColor: Color = Color(red: 0.0, green: 0.48, blue: 1.0)
    @Published public var lineWidth: CGFloat = 6.0
    @Published public var brushOpacity: Double = 1.0
    
    // Reference Layer State
    @Published public var referenceTarget: ReferenceTarget = .vector(.star)
    @Published public var isReferenceVisible: Bool = true
    @Published public var referenceOpacity: Double = 0.45
    @Published public var lastActiveReferenceOpacity: Double = 0.45
    @Published public var isPeeking: Bool = false
    @Published public var guideMode: CompositionGuide = .none
    
    // Decoupled Gesture Control
    @Published public var isAdjustingReference: Bool = false
    @Published public var referenceTransform: ReferenceLayerTransform = ReferenceLayerTransform()
    @Published public var dragGestureOffset: CGSize = .zero
    @Published public var pinchGestureScale: CGFloat = 1.0
    
    // Initializer with random initial target
    public init(initialTarget: ReferenceTarget? = nil) {
        if let target = initialTarget {
            self.referenceTarget = target
        } else if let randomShape = VectorShapeType.allCases.randomElement() {
            self.referenceTarget = .vector(randomShape)
        } else {
            self.referenceTarget = .vector(.star)
        }
    }
    
    public static func generateRandomOptions(count: Int = 3) -> [VectorShapeType] {
        Array(VectorShapeType.allCases.shuffled().prefix(count))
    }
    
    // Preset Vibrant Color Palette
    public let vibrantColors: [Color] = [
        Color(red: 0.0, green: 0.48, blue: 1.0),   // Electric iOS Blue
        Color(red: 0.35, green: 0.34, blue: 0.84), // Indigo
        Color(red: 0.69, green: 0.32, blue: 0.87), // Purple
        Color(red: 1.0, green: 0.18, blue: 0.33),  // Neon Pink
        Color(red: 1.0, green: 0.23, blue: 0.19),  // Vibrant Red
        Color(red: 1.0, green: 0.58, blue: 0.0),   // Sunset Orange
        Color(red: 1.0, green: 0.80, blue: 0.0),   // Gold Yellow
        Color(red: 0.20, green: 0.78, blue: 0.35), // Mint Green
        Color(red: 0.13, green: 0.83, blue: 0.93), // Cyan
        Color.white,
        Color.black
    ]
    
    // MARK: - Drawing Actions
    
    public func startLine(at point: CGPoint) {
        guard !isAdjustingReference else { return }
        let newLine = DrawingLine(
            points: [point],
            color: selectedColor,
            lineWidth: lineWidth,
            opacity: brushOpacity,
            isEraser: currentTool == .eraser,
            tool: currentTool
        )
        currentLine = newLine
    }
    
    public func appendPoint(_ point: CGPoint) {
        guard !isAdjustingReference, currentLine != nil else { return }
        currentLine?.points.append(point)
    }
    
    public func endLine() {
        guard let line = currentLine else { return }
        
        // Push previous state to undo stack (max 15 steps)
        undoStack.append(lines)
        if undoStack.count > maxUndoSteps {
            undoStack.removeFirst()
        }
        
        // Clear redo stack on new user drawing operation
        redoStack.removeAll()
        
        lines.append(line)
        currentLine = nil
    }
    
    // MARK: - 15-Step Undo/Redo Matrix
    
    public var canUndo: Bool {
        !undoStack.isEmpty
    }
    
    public var canRedo: Bool {
        !redoStack.isEmpty
    }
    
    public func undo() {
        guard canUndo else { return }
        let previousState = undoStack.removeLast()
        
        // Push current to redo stack
        redoStack.append(lines)
        if redoStack.count > maxUndoSteps {
            redoStack.removeFirst()
        }
        
        lines = previousState
    }
    
    public func redo() {
        guard canRedo else { return }
        let nextState = redoStack.removeLast()
        
        // Push current to undo stack
        undoStack.append(lines)
        if undoStack.count > maxUndoSteps {
            undoStack.removeFirst()
        }
        
        lines = nextState
    }
    
    public func clearCanvas() {
        guard !lines.isEmpty else { return }
        undoStack.append(lines)
        if undoStack.count > maxUndoSteps {
            undoStack.removeFirst()
        }
        redoStack.removeAll()
        lines.removeAll()
    }
    
    // MARK: - Quick Eye & Peek Toggles
    
    public func toggleReferenceEye() {
        if isReferenceVisible {
            lastActiveReferenceOpacity = max(referenceOpacity, 0.1)
            referenceOpacity = 0.0
            isReferenceVisible = false
        } else {
            referenceOpacity = lastActiveReferenceOpacity
            isReferenceVisible = true
        }
    }
    
    // MARK: - Transform Actions
    
    public func commitTransform() {
        referenceTransform.offset.width += dragGestureOffset.width
        referenceTransform.offset.height += dragGestureOffset.height
        referenceTransform.scale = max(0.2, min(referenceTransform.scale * pinchGestureScale, 6.0))
        dragGestureOffset = .zero
        pinchGestureScale = 1.0
    }
    
    public func resetReferenceTransform() {
        referenceTransform = ReferenceLayerTransform()
        dragGestureOffset = .zero
        pinchGestureScale = 1.0
    }
    
    // MARK: - Drawing Board Auto-Erase & Target Switching
    
    public func eraseBoard() {
        lines.removeAll()
        currentLine = nil
        undoStack.removeAll()
        redoStack.removeAll()
    }
    
    public func setVectorTarget(_ type: VectorShapeType) {
        referenceTarget = .vector(type)
        eraseBoard()
        resetReferenceTransform()
        if referenceOpacity == 0 {
            referenceOpacity = lastActiveReferenceOpacity
            isReferenceVisible = true
        }
    }
    
    public func setSymbolTarget(_ symbolName: String) {
        referenceTarget = .symbol(symbolName)
        eraseBoard()
        resetReferenceTransform()
        if referenceOpacity == 0 {
            referenceOpacity = lastActiveReferenceOpacity
            isReferenceVisible = true
        }
    }
    
    public func setImageTarget(_ image: UIImage) {
        referenceTarget = .image(image)
        eraseBoard()
        resetReferenceTransform()
        if referenceOpacity == 0 {
            referenceOpacity = lastActiveReferenceOpacity
            isReferenceVisible = true
        }
    }
}
