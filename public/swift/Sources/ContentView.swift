import SwiftUI

enum AppMode: Equatable {
    case freeDraw
    case colorByNumber
}

private let studioPaper = Color(red: 0.980, green: 0.976, blue: 0.961)
private let studioAmber = Color(red: 0.961, green: 0.620, blue: 0.043)
private let studioInk = Color(red: 0.10, green: 0.11, blue: 0.13)

// MARK: - Root Content View for iOS Tracing & Drawing Application

public struct ContentView: View {
    @StateObject private var state = TracingAppState()
    @State private var isTargetPickerPresented: Bool = false
    @State private var isExportPresented: Bool = false
    @State private var isClearConfirmationPresented: Bool = false
    @State private var appMode: AppMode = .freeDraw

    // Startup: 3 Random Drawing Options
    @State private var isStartupPresented: Bool = true
    @State private var startupOptions: [VectorShapeType] = []
    
    public init() {}

    @ViewBuilder
    private func modeButton(title: String, icon: String, mode: AppMode) -> some View {
        Button {
            withAnimation(.easeInOut(duration: 0.2)) {
                appMode = mode
            }
        } label: {
            HStack(spacing: 5) {
                Image(systemName: icon)
                    .font(.system(size: 12, weight: .bold))
                Text(title)
                    .font(.system(size: 11, weight: .heavy, design: .rounded))
            }
            .foregroundColor(appMode == mode ? .white : studioInk.opacity(0.72))
            .padding(.horizontal, 10)
            .padding(.vertical, 7)
            .background(appMode == mode ? studioAmber : .clear)
            .clipShape(Capsule())
        }
        .buttonStyle(.plain)
    }
    
    public var body: some View {
        ZStack {
            // Background Canvas Workspace
            if appMode == .freeDraw {
                DualLayerCanvasView(state: state)
                    .ignoresSafeArea(.all, edges: .top)
            } else {
                ColorByNumberView(state: state, openLibrary: { isTargetPickerPresented = true })
                    .ignoresSafeArea(.all, edges: .top)
            }
            
            // Right-Side Toolbar (Brush Kit, Eraser, Undo/Redo, Export) — anchored to the trailing edge, vertically centered
            if appMode == .freeDraw {
                BottomToolbarView(
                    state: state,
                    isTargetPickerPresented: $isTargetPickerPresented,
                    isExportPresented: $isExportPresented
                )
                .frame(maxWidth: .infinity, maxHeight: .infinity, alignment: .trailing)
            }

            // Top Navigation Bar
            VStack {
                HStack(spacing: 12) {
                    // App Identity Pill (Branding cleaned)
                    HStack(spacing: 8) {
                        Image(systemName: "pencil.and.outline")
                            .font(.system(size: 15, weight: .bold))
                            .foregroundColor(.cyan)
                        Text("Drawing Studio")
                            .font(.system(size: 15, weight: .bold, design: .rounded))
                            .foregroundColor(studioInk)
                    }
                    .padding(.horizontal, 14)
                    .padding(.vertical, 8)
                    .background(.ultraThinMaterial)
                    .clipShape(Capsule())
                    .overlay(
                        Capsule()
                            .stroke(studioAmber.opacity(0.72), lineWidth: 1.5)
                    )
                    .shadow(color: .black.opacity(0.12), radius: 8, y: 3)

                    HStack(spacing: 4) {
                        modeButton(title: "Trace & Draw", icon: "paintpalette.fill", mode: .freeDraw)
                        modeButton(title: "Color by Number", icon: "number", mode: .colorByNumber)
                    }
                    .padding(4)
                    .background(.ultraThinMaterial)
                    .clipShape(Capsule())
                    .overlay(Capsule().stroke(studioAmber.opacity(0.45), lineWidth: 1))

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

// MARK: - Color by Number Workspace
private struct ColorByNumberView: View {
    @ObservedObject var state: TracingAppState
    let openLibrary: () -> Void
    @State private var selectedNumber = 1
    @State private var filledCells: [Int: Int] = [:]
    @State private var selectedPicture: VectorShapeType = .star
    @State private var isGridVisible = true
    @State private var isHintVisible = false
    private let colors: [Color] = [Color(red: 0.16, green: 0.70, blue: 0.91), Color(red: 1.0, green: 0.79, blue: 0.15), Color(red: 0.18, green: 0.18, blue: 0.21)]

    // Every picture owns its own number map. Keeping the map derived from the selection
    // prevents the board from staying on the default picture after a new choice.
    private var grid: [[Int?]] {
        switch selectedPicture.category {
        case .animals: return [
            [nil, nil, 1, 1, nil, nil, 1, 1, nil, nil, nil], [nil, 1, 2, 2, 1, nil, 1, 2, 2, 1, nil],
            [1, 2, 3, 2, 2, 1, 1, 2, 3, 2, 1], [1, 2, 2, 2, 2, 1, 1, 2, 2, 2, 1],
            [1, 2, 2, 3, 2, 1, 1, 2, 3, 2, 1], [nil, 1, 2, 2, 1, nil, 1, 2, 2, 1, nil],
            [nil, nil, 1, 1, nil, nil, 1, 1, nil, nil, nil], [nil, 1, 1, 2, 2, 2, 2, 2, 1, 1, nil],
            [nil, 1, 2, 2, 2, 2, 2, 2, 2, 1, nil], [nil, nil, 1, 1, 1, 1, 1, 1, 1, nil, nil]
        ]
        case .vehicles: return [
            [nil, nil, nil, nil, 1, 1, 1, nil, nil, nil, nil], [nil, nil, nil, 1, 2, 2, 2, 1, nil, nil, nil],
            [nil, nil, 1, 2, 2, 3, 2, 2, 1, nil, nil], [nil, 1, 2, 2, 2, 2, 2, 2, 2, 1, nil],
            [1, 2, 2, 3, 2, 2, 2, 3, 2, 2, 1], [1, 2, 2, 2, 2, 2, 2, 2, 2, 2, 1],
            [1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1], [nil, 1, 1, nil, nil, nil, nil, 1, 1, nil, nil],
            [nil, 1, 1, nil, nil, nil, nil, 1, 1, nil, nil], [nil, nil, nil, nil, nil, nil, nil, nil, nil, nil, nil]
        ]
        default: return [
            [nil, nil, nil, 1, 1, 1, nil, nil, 1, 1, nil], [nil, nil, nil, nil, 2, 2, 2, 2, nil, nil, nil],
            [nil, nil, nil, nil, 2, 2, 2, 2, nil, nil, nil], [1, 1, 1, 2, 2, 2, 2, 2, 2, 1, 1],
            [1, 1, 1, 2, 3, 2, 2, 3, 2, 1, 1], [nil, 1, 1, 2, 2, 2, 2, 2, 2, 1, nil],
            [nil, 1, 1, 2, 2, 2, 2, 2, 2, 1, nil], [nil, nil, 1, 3, 3, 3, 3, 1, 1, nil, nil],
            [nil, nil, nil, nil, 2, 2, 2, 2, nil, nil, nil], [nil, nil, nil, nil, nil, 3, 3, nil, nil, nil]
        ]
        }
    }

    private var flattenedGrid: [Int?] { grid.flatMap { $0 } }
    private var gridColumns: [GridItem] {
        Array(repeating: GridItem(.flexible(), spacing: 4), count: 11)
    }

    private func selectPicture(_ shape: VectorShapeType) {
        selectedPicture = shape
        selectedNumber = 1
        filledCells.removeAll()
        isHintVisible = false
        state.setVectorTarget(shape)
    }

    var body: some View {
        GeometryReader { geometry in
            ZStack {
                Color(red: 0.98, green: 0.97, blue: 0.94).ignoresSafeArea()
                DottedPaperBackground()
                VStack(spacing: 14) {
                    HStack {
                        Button(action: openLibrary) { Label("Back to Free Draw", systemImage: "chevron.left") }
                        Spacer()
                        VStack(spacing: 3) {
                            Text("Buzzy Bee").font(.system(size: 22, weight: .black, design: .rounded))
                            Text("Animals & Nature • 5% Done").font(.system(size: 13, weight: .bold)).foregroundColor(.cyan)
                        }
                        Spacer()
                        Button(action: { filledCells.removeAll() }) { Label("Clear", systemImage: "arrow.counterclockwise") }
                    }
                    .font(.system(size: 13, weight: .bold, design: .rounded))
                    .foregroundColor(studioInk.opacity(0.74))
                    .padding(.horizontal, 28)
                    .padding(.top, 54)

                    ScrollView(.horizontal, showsIndicators: false) {
                        HStack(alignment: .top, spacing: 28) {
                            VStack(spacing: 16) {
                                picturePicker
                                guidePanel
                                numberPicker
                                HStack(spacing: 12) {
                                    utilityButton("tablecells", title: isGridVisible ? "Hide Grid" : "Show Grid") {
                                        isGridVisible.toggle()
                                    }
                                    utilityButton("lightbulb.fill", title: "Hint") {
                                        revealHint()
                                    }
                                }
                                if isHintVisible {
                                    Text("Pick number \(selectedNumber), then tap every matching square.")
                                        .font(.system(size: 12, weight: .bold, design: .rounded))
                                        .foregroundColor(.orange)
                                        .multilineTextAlignment(.center)
                                        .frame(maxWidth: 190)
                                }
                            }
                            board
                        }
                        .frame(maxWidth: .infinity)
                        .padding(.horizontal, 24)
                    }
                    .frame(maxWidth: .infinity, maxHeight: .infinity, alignment: .center)
                    Spacer(minLength: 10)
                }
            }
            .onChange(of: state.referenceTarget) { _, target in
                if case .vector(let shape) = target, shape != selectedPicture {
                    selectPicture(shape)
                }
            }
        }
    }

    private var picturePicker: some View {
        VStack(alignment: .leading, spacing: 8) {
            Text("PICK A PICTURE")
                .font(.system(size: 12, weight: .black, design: .rounded))
                .foregroundColor(studioInk)
            ScrollView(.horizontal, showsIndicators: false) {
                HStack(spacing: 8) {
                    ForEach(VectorShapeType.allCases, id: \.self) { shape in
                        Button {
                            selectPicture(shape)
                        } label: {
                            VStack(spacing: 4) {
                                VectorRendererView(shapeType: shape, strokeColor: colors[0], lineWidth: 2)
                                    .frame(width: 52, height: 42)
                                Text(shape.rawValue)
                                    .font(.system(size: 9, weight: .bold, design: .rounded))
                                    .lineLimit(1)
                            }
                            .foregroundColor(studioInk)
                            .padding(6)
                            .background(selectedPicture == shape ? Color.cyan.opacity(0.18) : Color.white.opacity(0.9))
                            .clipShape(RoundedRectangle(cornerRadius: 10))
                            .overlay(RoundedRectangle(cornerRadius: 10).stroke(selectedPicture == shape ? .cyan : .clear, lineWidth: 2))
                        }
                        .buttonStyle(.plain)
                    }
                }
            }
        }
        .padding(.horizontal, 12)
    }

    private var guidePanel: some View {
        VStack(spacing: 8) {
            Text("PICTURE GUIDE").font(.system(size: 13, weight: .black, design: .rounded)).foregroundColor(Color(red: 0.25, green: 0.15, blue: 0.08))
            ZStack {
                RoundedRectangle(cornerRadius: 12).fill(.white)
                VectorRendererView(shapeType: selectedPicture, strokeColor: colors[0], lineWidth: 3)
                    .padding(22)
                VStack {
                    HStack {
                        guideBadge(1, color: colors[0])
                        Spacer()
                        guideBadge(2, color: colors[1])
                    }
                    Spacer()
                    HStack {
                        Spacer()
                        guideBadge(3, color: colors[2])
                    }
                }
                .padding(10)
            }
            .frame(width: 190, height: 150)
        }
        .padding(14).background(Color(red: 0.72, green: 0.51, blue: 0.31)).clipShape(RoundedRectangle(cornerRadius: 20)).overlay(RoundedRectangle(cornerRadius: 20).stroke(Color(red: 0.43, green: 0.25, blue: 0.10), lineWidth: 5))
    }

    private func guideBadge(_ number: Int, color: Color) -> some View {
        Text("\(number)").font(.system(size: 12, weight: .black, design: .rounded)).foregroundColor(.white).frame(width: 26, height: 26).background(color).clipShape(Circle()).overlay(Circle().stroke(.white, lineWidth: 2))
    }

    private var numberPicker: some View {
        HStack(spacing: 10) {
            ForEach(1...3, id: \.self) { number in
                Button { selectedNumber = number } label: {
                    Text("\(number)").font(.system(size: 18, weight: .black, design: .rounded)).foregroundColor(.white).frame(width: 58, height: 58).background(colors[number - 1]).clipShape(Circle()).overlay(Circle().stroke(selectedNumber == number ? Color.green : .clear, lineWidth: 6))
                }.buttonStyle(.plain)
            }
        }.padding(10).background(.white).clipShape(Capsule()).shadow(color: .black.opacity(0.12), radius: 10, y: 5)
    }

    private var board: some View {
        LazyVGrid(columns: gridColumns, spacing: 4) {
            ForEach(Array(flattenedGrid.indices), id: \.self) { index in
                numberCell(at: index)
            }
        }
        .padding(18)
        .background(Color(red: 0.72, green: 0.51, blue: 0.31))
        .clipShape(RoundedRectangle(cornerRadius: 26))
        .overlay {
            RoundedRectangle(cornerRadius: 26)
                .stroke(Color(red: 0.43, green: 0.25, blue: 0.10), lineWidth: 7)
        }
        .frame(maxWidth: 650)
    }

    private func numberCell(at index: Int) -> some View {
        let value = flattenedGrid[index]
        let isFilled = value.map { filledCells[index] == $0 } ?? false
        let isHinted = isHintVisible && value == selectedNumber && !isFilled
        let fillColor = filledCells[index].map { colors[$0 - 1] } ?? Color(red: 0.97, green: 0.98, blue: 0.99)
        let borderColor = isHinted ? colors[selectedNumber - 1] : (isGridVisible ? Color.gray.opacity(0.18) : .clear)
        let borderWidth: CGFloat = isHinted ? 3 : 1

        return Button {
            guard let value, value == selectedNumber else { return }
            filledCells[index] = value
        } label: {
            Group {
                if let value {
                    Text(isFilled ? "" : "\(value)")
                        .font(.system(size: 18, weight: .bold, design: .rounded))
                        .foregroundColor(studioInk)
                } else {
                    Color.clear
                }
            }
            .frame(minWidth: 44, minHeight: 44)
            .background(fillColor)
            .clipShape(RoundedRectangle(cornerRadius: 5))
            .overlay {
                RoundedRectangle(cornerRadius: 5)
                    .stroke(borderColor, lineWidth: borderWidth)
            }
        }
        .buttonStyle(.plain)
    }

    private func revealHint() {
        isHintVisible = true
        DispatchQueue.main.asyncAfter(deadline: .now() + 1.8) {
            isHintVisible = false
        }
    }

    private func utilityButton(_ icon: String, title: String, action: @escaping () -> Void) -> some View {
        Button(action: action) {
            VStack(spacing: 4) {
                Image(systemName: icon).font(.system(size: 20, weight: .bold))
                Text(title).font(.system(size: 9, weight: .black, design: .rounded)).lineLimit(1)
            }
            .foregroundColor(.white).frame(width: 70, height: 66).background(Color.green).clipShape(RoundedRectangle(cornerRadius: 16))
        }
        .buttonStyle(.plain)
        .accessibilityLabel(title)
    }
}

private struct DottedPaperBackground: View {
    var body: some View {
        Canvas { context, size in
            let step: CGFloat = 24
            for x in stride(from: 0, through: size.width, by: step) {
                for y in stride(from: 0, through: size.height, by: step) {
                    context.fill(Path(ellipseIn: CGRect(x: x, y: y, width: 2, height: 2)), with: .color(Color.orange.opacity(0.10)))
                }
            }
        }
        .allowsHitTesting(false)
    }
}

// MARK: - Startup 3 Random Options Sheet
public struct StartupOptionsSheet: View {
    @Binding public var options: [VectorShapeType]
    public let onSelectOption: (VectorShapeType) -> Void
    public let onExploreAll: () -> Void
    @Environment(\.dismiss) private var dismiss
    
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
                    // Header Description
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
                    
                    // 3 Interactive Options Cards
                    VStack(spacing: 12) {
                        ForEach(options) { shape in
                            StartupOptionRow(shape: shape) {
                                onSelectOption(shape)
                            }
                        }
                    }
                    .padding(.horizontal, 20)
                    
                    Spacer()
                    
                    // Secondary Controls: Shuffle or Browse All
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
                // Shape Vector Icon Box
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
}

#Preview {
    ContentView()
}
