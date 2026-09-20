import SwiftUI

// MARK: - Dual-Layer Canvas Workspace (ZStack Overlay Architecture)

public struct DualLayerCanvasView: View {
    @ObservedObject public var state: TracingAppState
    
    public init(state: TracingAppState) {
        self.state = state
    }
    
    public var body: some View {
        GeometryReader { geometry in
            ZStack {
                // Background Studio Mat / Slate Color
                Color(red: 0.980, green: 0.976, blue: 0.961)
                    .ignoresSafeArea()
                
                // Subtle Drafting Grid
                DraftingGridView()
                     .opacity(0.10)
                
                // LAYER 1: Background Reference Tracing Layer (Underneath)
                ReferenceLayerContainerView(state: state, bounds: geometry.size)
                    .opacity(state.referenceOpacity)
                    .allowsHitTesting(state.isAdjustingReference)
                
                // LAYER 2: Foreground Drawing Canvas Layer (Overlaid on top)
                ForegroundDrawingCanvasView(state: state)
                    .allowsHitTesting(!state.isAdjustingReference)
                
                // Active Mode Indicator Pill (When reference adjusting is active)
                if state.isAdjustingReference {
                    VStack {
                        HStack(spacing: 8) {
                            Image(systemName: "arrow.up.and.down.and.arrow.left.and.right")
                                .font(.system(size: 13, weight: .bold))
                            Text("Reference Adjust Mode • Pan & Pinch to Align")
                                .font(.system(size: 12, weight: .bold))
                            
                            Button {
                                state.resetReferenceTransform()
                            } label: {
                                Text("Reset")
                                    .font(.system(size: 11, weight: .heavy))
                                    .padding(.horizontal, 8)
                                    .padding(.vertical, 3)
                                    .background(Color.white.opacity(0.2))
                                    .clipShape(Capsule())
                            }
                        }
                        .foregroundColor(.white)
                        .padding(.horizontal, 14)
                        .padding(.vertical, 8)
                        .background(Color(red: 0.961, green: 0.620, blue: 0.043).opacity(0.95))
                        .clipShape(Capsule())
                        .shadow(color: .black.opacity(0.3), radius: 10, y: 4)
                        .padding(.top, 16)
                        
                        Spacer()
                    }
                    .transition(.opacity.combined(with: .scale(scale: 0.95)))
                }
            }
        }
    }
}

// MARK: - Reference Layer with Simultaneous Pan & Magnification Gesture
public struct ReferenceLayerContainerView: View {
    @ObservedObject public var state: TracingAppState
    public let bounds: CGSize
    
    public init(state: TracingAppState, bounds: CGSize) {
        self.state = state
        self.bounds = bounds
    }
    
    // Unified SimultaneousGesture combining Drag (Pan) and Magnification (Pinch Zoom)
    private var referenceSimultaneousGesture: some Gesture {
        SimultaneousGesture(
            DragGesture(minimumDistance: 0)
                .onChanged { value in
                    state.dragGestureOffset = value.translation
                },
            MagnificationGesture()
                .onChanged { scale in
                    state.pinchGestureScale = scale
                }
        )
        .onEnded { _ in
            state.commitTransform()
        }
    }
    
    public var body: some View {
        let currentScale = state.referenceTransform.scale * state.pinchGestureScale
        let currentOffsetX = state.referenceTransform.offset.width + state.dragGestureOffset.width
        let currentOffsetY = state.referenceTransform.offset.height + state.dragGestureOffset.height
        
        Group {
            switch state.referenceTarget {
            case let .vector(shapeType):
                VectorRendererView(shapeType: shapeType, strokeColor: Color(red: 0.145, green: 0.388, blue: 0.922), lineWidth: 3.0)
                    .frame(
                        width: min(bounds.width, bounds.height) * 0.72,
                        height: min(bounds.width, bounds.height) * 0.72
                    )
            case let .symbol(symbolName):
                Image(systemName: symbolName)
                    .resizable()
                    .scaledToFit()
                    .foregroundColor(Color(red: 0.145, green: 0.388, blue: 0.922))
                    .frame(
                        width: min(bounds.width, bounds.height) * 0.70,
                        height: min(bounds.width, bounds.height) * 0.70
                    )
            case let .image(uiImage):
                Image(uiImage: uiImage)
                    .resizable()
                    .scaledToFit()
                    .frame(
                        maxWidth: bounds.width * 0.85,
                        maxHeight: bounds.height * 0.85
                    )
            }
        }
        .scaleEffect(currentScale)
        .offset(x: currentOffsetX, y: currentOffsetY)
        .gesture(state.isAdjustingReference ? referenceSimultaneousGesture : nil)
    }
}

// MARK: - Foreground High-Performance Canvas (Retina / CoreGraphics)
public struct ForegroundDrawingCanvasView: View {
    @ObservedObject public var state: TracingAppState
    
    public init(state: TracingAppState) {
        self.state = state
    }
    
    public var body: some View {
        Canvas { context, size in
            // Render on isolated transparent layer to support pixel-accurate destinationOut erasing
            context.drawLayer { drawingContext in
                // Draw all committed lines
                for line in state.lines {
                    var path = Path()
                    guard let firstPoint = line.points.first else { continue }
                    path.move(to: firstPoint)
                    for pt in line.points.dropFirst() {
                        path.addLine(to: pt)
                    }
                    
                    let strokeStyle = StrokeStyle(
                        lineWidth: line.lineWidth,
                        lineCap: .round,
                        lineJoin: .round
                    )
                    
                    if line.isEraser {
                        // Pixel-accurate eraser: cuts only from the drawing layer, leaves template untouched!
                        drawingContext.blendMode = .destinationOut
                        drawingContext.stroke(
                            path,
                            with: .color(.black),
                            style: strokeStyle
                        )
                    } else {
                        drawingContext.blendMode = .normal
                        drawingContext.stroke(
                            path,
                            with: .color(line.color.opacity(line.opacity)),
                            style: strokeStyle
                        )
                    }
                }
                
                // Draw currently active dragging stroke
                if let activeLine = state.currentLine {
                    var path = Path()
                    if let firstPoint = activeLine.points.first {
                        path.move(to: firstPoint)
                        for pt in activeLine.points.dropFirst() {
                            path.addLine(to: pt)
                        }
                        
                        let strokeStyle = StrokeStyle(
                            lineWidth: activeLine.lineWidth,
                            lineCap: .round,
                            lineJoin: .round
                        )
                        
                        if activeLine.isEraser {
                            drawingContext.blendMode = .destinationOut
                            drawingContext.stroke(path, with: .color(.black), style: strokeStyle)
                        } else {
                            drawingContext.blendMode = .normal
                            drawingContext.stroke(
                                path,
                                with: .color(activeLine.color.opacity(activeLine.opacity)),
                                style: strokeStyle
                            )
                        }
                    }
                }
            }
        }
        .gesture(
            DragGesture(minimumDistance: 0, coordinateSpace: .local)
                .onChanged { value in
                    if state.currentLine == nil {
                        state.startLine(at: value.location)
                    } else {
                        state.appendPoint(value.location)
                    }
                }
                .onEnded { _ in
                    state.endLine()
                }
        )
    }
}

// MARK: - Drafting Grid Blueprint
public struct DraftingGridView: View {
    public init() {}
    
    public var body: some View {
        Canvas { context, size in
            let spacing: CGFloat = 30.0
            var path = Path()
            
            var x: CGFloat = 0
            while x < size.width {
                path.move(to: CGPoint(x: x, y: 0))
                path.addLine(to: CGPoint(x: x, y: size.height))
                x += spacing
            }
            
            var y: CGFloat = 0
            while y < size.height {
                path.move(to: CGPoint(x: 0, y: y))
                path.addLine(to: CGPoint(x: size.width, y: y))
                y += spacing
            }
            
            context.stroke(path, with: .color(.white), lineWidth: 0.5)
        }
    }
}
